using FastColoredTextBoxNS;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CalcBuddy
{
    /// <summary>
    /// Console emulator.
    /// </summary>
    public class ConsoleTextBox : FastColoredTextBox
    {
        //private volatile bool isReadLineMode;
        private volatile bool isUpdating;
        private Place StartReadPlace { get; set; }
        private volatile TaskCompletionSource<bool> isReadLineModeTask = new TaskCompletionSource<bool>();
        private List<string> history = new List<string>();
        private int? historyIndex;

        /// <summary>
        /// Append line to end of text.
        /// </summary>
        /// <param name="text"></param>
        public void WriteLine(string text)
        {
            isReadLineModeTask.TrySetResult(false);
            isUpdating = true;
            try
            {
                AppendText(text);
                GoEnd();
            }
            finally
            {
                isUpdating = false;
                ClearUndo();
            }
        }

        /// <summary>
        /// Wait for line entering.
        /// Set IsReadLineMode to false for break of waiting.
        /// </summary>
        /// <returns></returns>
        public async Task<string> ReadLineAsync()
        {
            GoEnd();
            StartReadPlace = Range.End;
            isReadLineModeTask = new TaskCompletionSource<bool>();
            await isReadLineModeTask.Task;

            ClearUndo();

            string input = new Range(this, StartReadPlace, Range.End).Text.TrimEnd('\r', '\n');

            if (!string.IsNullOrWhiteSpace(input))
            {
                history.Add(input);
            }

            return input;
        }

        public override void OnTextChanging(ref string text)
        {
            if (!isUpdating)
            {
                historyIndex = null;
            }

            if (isReadLineModeTask.Task.IsCompleted && !isUpdating)
            {
                text = ""; //cancel changing
                return;
            }

            if (!isReadLineModeTask.Task.IsCompleted)
            {
                if (Selection.Start < StartReadPlace || Selection.End < StartReadPlace)
                    GoEnd();//move caret to entering position

                if (Selection.Start == StartReadPlace || Selection.End == StartReadPlace)
                    if (text == "\b") //backspace
                    {
                        text = ""; //cancel deleting of last char of readonly text
                        return;
                    }

                if (text != null && text.Contains('\n'))
                {
                    string input = new Range(this, StartReadPlace, Range.End).Text;
                    if (!string.IsNullOrWhiteSpace(input))
                    {
                        text = text.Substring(0, text.IndexOf('\n') + 1);
                        isReadLineModeTask.TrySetResult(false);
                    }
                    else
                    {
                        text = text.TrimEnd('\n');
                    }
                }
            }

            base.OnTextChanging(ref text);
        }

        public override void Clear()
        {
            bool oldIsReadMode = !isReadLineModeTask.Task.IsCompleted;

            isReadLineModeTask.TrySetResult(false);
            isUpdating = true;

            base.Clear();
            history.Clear();
            historyIndex = null;

            isUpdating = false;
            if (oldIsReadMode)
            {
                isReadLineModeTask = new TaskCompletionSource<bool>();
            }

            StartReadPlace = Place.Empty;
        }

        public override bool ProcessKey(Keys keyData)
        {
            if (keyData == Keys.Up)
            {
                if (history.Count > 0)
                {
                    if (historyIndex.HasValue)
                    {
                        if (historyIndex.Value > 0)
                        {
                            historyIndex--;
                        }
                        else
                        {
                            return true;
                        }
                    }
                    else
                    {
                        historyIndex = history.Count - 1;

                        string input = new Range(this, StartReadPlace, Range.End).Text;
                        if (!string.IsNullOrWhiteSpace(input))
                        {
                            history.Add(input);
                        }
                    }

                    isUpdating = true;
                    InsertTextAndRestoreSelection(new Range(this, StartReadPlace, Range.End), history[historyIndex.Value], DefaultStyle);
                    isUpdating = false;

                }

                return true;
            }

            if (keyData == Keys.Down)
            {
                if (historyIndex.HasValue)
                {
                    if (historyIndex.Value < history.Count - 1)
                    {
                        historyIndex++;
                        isUpdating = true;
                        InsertTextAndRestoreSelection(new Range(this, StartReadPlace, Range.End), history[historyIndex.Value], DefaultStyle);
                        isUpdating = false;
                    }
                }

                return true;
            }

            if (keyData == Keys.Left)
            {
                if (Selection.Start <= StartReadPlace)
                {
                    return true;
                }
            }

            return base.ProcessKey(keyData);
        }
    }
}
