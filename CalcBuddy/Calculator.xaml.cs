using MathParser;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Threading;

namespace CalcBuddy
{
    public partial class Calculator : UserControl
    {
        public bool IsPlotAreaVisible
        {
            get { return (bool)GetValue(IsPlotAreaVisibleProperty); }
            set { SetValue(IsPlotAreaVisibleProperty, value); }
        }

        public static readonly DependencyProperty IsPlotAreaVisibleProperty = DependencyProperty.Register("IsPlotAreaVisible", typeof(bool), typeof(Calculator));

        public PlotArea PlotArea { get; set; }

        readonly MathParser.MathParser mathParser;
        readonly SymbolManager symbolManager;

        public Calculator()
        {
            InitializeComponent();

            Loaded += Calculator_Loaded;

            mathParser = new MathParser.MathParser();

            symbolManager = new SymbolManager();
            symbolManager.SetTrigonometrySymbols();
            symbolManager.SetEvalSymbol();
        }

        public void Activate()
        {
            host.InvalidateVisual();
            Dispatcher.BeginInvoke(new Action(() => consoleTextBox.Focus()), DispatcherPriority.Normal);
        }

        private async void Calculator_Loaded(object sender, RoutedEventArgs e)
        {
            if (PlotArea != null)
            {
                Value plotFunction = Value.Function(new Function(PlotArea.Plot));
                symbolManager.Set("plot", plotFunction);
                PlotArea.PlotExecuted += PlotArea_PlotExecuted;
            }

            string text = "";

            do
            {
                consoleTextBox.WriteLine("> ");
                consoleTextBox.Focus();
                text = await consoleTextBox.ReadLineAsync();
                try
                {
                    MathParser.Expression expression = mathParser.Parse(text);

                    string detail = expression.ToDebug();
                    Value result = expression.Evaluate(symbolManager);

                    if (result.IsExpression)
                    {
                        consoleTextBox.WriteLine(string.Format("{0} = `{1}`", detail, result));
                    }
                    else
                    {
                        consoleTextBox.WriteLine(string.Format("{0} = {1}", detail, result));
                    }

                    expression.ExecuteAssignments(symbolManager);
                }
                catch (Exception exception)
                {
                    consoleTextBox.WriteLine(string.Format("error: {0}", exception.Message));
                }
                finally
                {
                    consoleTextBox.WriteLine("\n");
                }

            } while (text != "exit");
        }

        private void PlotArea_PlotExecuted(object sender, EventArgs e)
        {
            IsPlotAreaVisible = true;
        }
    }
}
