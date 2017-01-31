using MathParser;
using System.Windows;

namespace CalcBuddy
{
    public partial class MainWindow : Window
    {
        public double WindowChromeCaptionHeight
        {
            get { return (double)GetValue(WindowChromeCaptionHeightProperty); }
            set { SetValue(WindowChromeCaptionHeightProperty, value); }
        }

        public static readonly DependencyProperty WindowChromeCaptionHeightProperty =
            DependencyProperty.Register("WindowChromeCaptionHeight", typeof(double), typeof(MainWindow));

        readonly MathParser.MathParser mathParser;
        readonly SymbolManager symbolManager;

        public MainWindow()
        {
            InitializeComponent();
            Loaded += MainWindow_Loaded;
            mathParser = new MathParser.MathParser();

            symbolManager = new SymbolManager();
            symbolManager.SetTrigonometrySymbols();
            symbolManager.SetEvalSymbol();
        }

        private async void MainWindow_Loaded(object sender, System.Windows.RoutedEventArgs e)
        {
            System.Windows.Forms.Integration.WindowsFormsHost host =
                new System.Windows.Forms.Integration.WindowsFormsHost();

            ConsoleTextBox textBox = new ConsoleTextBox();
            host.Child = textBox;

            ConsoleBorder.Child = host;

            string text = "";

            do
            {
                textBox.WriteLine("> ");
                text = await textBox.ReadLineAsync();
                try
                {
                    MathParser.Expression expression = mathParser.Parse(text);

                    string detail = expression.ToDebug();
                    Value result = expression.Evaluate(symbolManager);

                    if (result.IsExpression)
                    {
                        textBox.WriteLine(string.Format("{0} = `{1}`", detail, result));
                    }
                    else
                    {
                        textBox.WriteLine(string.Format("{0} = {1}", detail, result));
                    }

                    expression.ExecuteAssignments(symbolManager);
                }
                catch (System.Exception exception)
                {
                    textBox.WriteLine(string.Format("error: {0}", exception.Message));
                }
                finally
                {
                    textBox.WriteLine("\n");
                }

            } while (text != "exit");


        }

        private void CloseWindowClick(object sender, System.Windows.RoutedEventArgs e)
        {
            Close();
        }

        private void MinimizeWindowClick(object sender, System.Windows.RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }

        private void MaximizeOrRestoreWindowClick(object sender, System.Windows.RoutedEventArgs e)
        {
            if (WindowState == WindowState.Maximized)
            {
                WindowState = WindowState.Normal;
            }
            else
            {
                WindowState = WindowState.Maximized;
            }
        }
    }
}
