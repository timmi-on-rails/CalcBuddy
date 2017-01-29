using FastColoredTextBoxNS;
using System.Windows;

namespace CalcBuddy
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            Loaded += MainWindow_Loaded;
        }

        private void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            System.Windows.Forms.Integration.WindowsFormsHost host =
                new System.Windows.Forms.Integration.WindowsFormsHost();

            FastColoredTextBox textBox = new FastColoredTextBox();
            host.Child = textBox;

            grid.Children.Add(host);
        }
    }
}
