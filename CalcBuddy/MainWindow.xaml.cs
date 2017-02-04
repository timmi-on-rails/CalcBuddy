using System;
using System.ComponentModel;
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

        public static readonly DependencyProperty WindowChromeCaptionHeightProperty = DependencyProperty.Register("WindowChromeCaptionHeight", typeof(double), typeof(MainWindow));

        readonly System.Windows.Forms.NotifyIcon _notifyIcon;
        readonly HotKey _hotKey;

        public MainWindow()
        {
            _hotKey = new HotKey(Key.C, KeyModifier.Win, OnHotKeyHandler);

            _notifyIcon = new System.Windows.Forms.NotifyIcon();
            _notifyIcon.Icon = new System.Drawing.Icon("CalcBuddy.ico");

            _notifyIcon.DoubleClick += NotifyIconDoubleClick;

            InitializeComponent();

            Calculator.PlotArea = PlotArea;
            Closing += MainWindowClosing;
            StateChanged += MainWindowStateChanged;
            Loaded += (o, e) => Calculator.Activate();

            DependencyPropertyDescriptor dependencyPropertyDescriptor = DependencyPropertyDescriptor.FromProperty(Calculator.IsPlotAreaVisibleProperty, typeof(Calculator));
            dependencyPropertyDescriptor.AddValueChanged(Calculator, OnIsPlotAreaVisibleChanged);
        }

        void OnIsPlotAreaVisibleChanged(object sender, EventArgs e)
        {
            if (Calculator.IsPlotAreaVisible)
            {
                double calculatorWidth = LeftColumnDefinition.ActualWidth + RightColumnDefinition.ActualWidth;
                Width += MainGrid.ActualHeight;
                LeftColumnDefinition.Width = new GridLength(calculatorWidth);
            }
            else
            {
                Width -= RightColumnDefinition.ActualWidth;
                LeftColumnDefinition.Width = GridLength.Auto;
            }
        }

        void MainWindowStateChanged(object sender, EventArgs e)
        {
            if (WindowState == WindowState.Minimized)
            {
                MinimizeToTray();
            }
        }

        void MainWindowClosing(object sender, CancelEventArgs e)
        {
            _notifyIcon.Dispose();
            _hotKey.Dispose();
        }

        void OnHotKeyHandler(HotKey obj)
        {
            if (_notifyIcon.Visible)
            {
                RestoreFromTray();
            }
            else
            {
                MinimizeToTray();
            }
        }

        void NotifyIconDoubleClick(object sender, EventArgs e)
        {
            RestoreFromTray();
        }

        void MinimizeToTray()
        {
            Hide();
            _notifyIcon.Visible = true;
        }

        void RestoreFromTray()
        {
            _notifyIcon.Visible = false;
            Show();

            WindowState = WindowState.Normal;
            Calculator.Activate();
        }

        void MinimizeWindowClick(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }

        void MaximizeOrRestoreWindowClick(object sender, RoutedEventArgs e)
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

        void CloseWindowClick(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}
