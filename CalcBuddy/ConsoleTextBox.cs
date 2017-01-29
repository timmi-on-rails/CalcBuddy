using FastColoredTextBoxNS;
using System.Linq;
using System.Threading.Tasks;

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

            return new Range(this, StartReadPlace, Range.End).Text.TrimEnd('\r', '\n');
        }

        public override void OnTextChanging(ref string text)
        {
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
                    text = text.Substring(0, text.IndexOf('\n') + 1);
                    isReadLineModeTask.TrySetResult(false);
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

            isUpdating = false;
            if (oldIsReadMode)
            {
                isReadLineModeTask = new TaskCompletionSource<bool>();
            }

            StartReadPlace = Place.Empty;
        }
    }
}
