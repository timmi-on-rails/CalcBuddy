using FastColoredTextBoxNS;
using MathParser;


namespace CalcBuddy
{
    public partial class MainWindow : System.Windows.Window
    {
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
                    Expression expression = mathParser.Parse(text);

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

        private void TitleBarMouseLeftButtonDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            DragMove();
        }

        private void MinimizeWindowClick(object sender, System.Windows.RoutedEventArgs e)
        {
            WindowState = System.Windows.WindowState.Minimized;
        }

        private void MaximizeWindowClick(object sender, System.Windows.RoutedEventArgs e)
        {
            WindowState = System.Windows.WindowState.Maximized;
        }
    }
}
