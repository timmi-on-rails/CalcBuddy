using MathParser;
using System;
using System.Windows;
using System.Windows.Input;

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
        System.Windows.Forms.NotifyIcon notifyIcon;
        HotKey _hotKey;
        ConsoleTextBox textBox;

        public MainWindow()
        {
            notifyIcon = new System.Windows.Forms.NotifyIcon();
            notifyIcon.Icon = new System.Drawing.Icon("CalcBuddy.ico");

            notifyIcon.DoubleClick += notifyIcon_DoubleClick;
            Deactivated += MainWindow_Deactivated;
            _hotKey = new HotKey(Key.C, KeyModifier.Win, OnHotKeyHandler);

            InitializeComponent();
            Loaded += MainWindow_Loaded;
            mathParser = new MathParser.MathParser();

            symbolManager = new SymbolManager();
            symbolManager.SetTrigonometrySymbols();
            symbolManager.SetEvalSymbol();

            Closing += MainWindow_Closing;
        }

        private void MainWindow_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            notifyIcon.Dispose();
        }

        private void OnHotKeyHandler(HotKey obj)
        {
            if (Visibility == Visibility.Visible)
            {
                Hide();
                notifyIcon.Visible = true;
            }
            else
            {
                notifyIcon.Visible = false;
                Show();
                Activate();
                textBox.Invalidate();
                textBox.Focus();
            }
        }

        void MainWindow_Deactivated(object sender, EventArgs e)
        {
            Hide();
            notifyIcon.Visible = true;
        }

        void notifyIcon_DoubleClick(object sender, EventArgs e)
        {
            notifyIcon.Visible = false;
            Show();
            Activate();
            textBox.Focus();


        }


        private async void MainWindow_Loaded(object sender, System.Windows.RoutedEventArgs e)
        {
            System.Windows.Forms.Integration.WindowsFormsHost host =
                new System.Windows.Forms.Integration.WindowsFormsHost();

            textBox = new ConsoleTextBox();
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
