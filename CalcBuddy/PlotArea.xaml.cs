using MathParser;
using OxyPlot;
using OxyPlot.Axes;
using System;
using System.Windows.Controls;

namespace CalcBuddy
{
    public partial class PlotArea : UserControl
    {
        readonly FunctionAutoDetailSeries functionSeries;

        public event EventHandler PlotExecuted;

        public PlotArea()
        {
            InitializeComponent();

            functionSeries = new FunctionAutoDetailSeries();

            PlotModel plotModel = new PlotModel();
            plotModel.Series.Add(functionSeries);

            plotModel.Axes.Add(new LinearAxis
            {
                Position = AxisPosition.Left,
                Minimum = -1,
                Maximum = 1,
                MajorGridlineStyle = LineStyle.Solid,   // gridlines seem to slow down alot
                MinorGridlineStyle = LineStyle.Dot
            });

            plotModel.Axes.Add(new LinearAxis
            {
                Position = AxisPosition.Bottom,
                Minimum = -1,
                Maximum = 1,
                MajorGridlineStyle = LineStyle.Solid,   // gridlines seem to slow down alot
                MinorGridlineStyle = LineStyle.Dot
            });

            plotView.Model = plotModel;
        }

        public Value Plot(Value[] args)
        {
            if (args[0].IsFunction)
            {
                OnPlotExecuted();
                Function function = args[0].ToFunction();

                functionSeries.Function = (x => function(Value.Decimal(x)).ToDouble());
                plotView.InvalidatePlot();
            }

            return Value.Decimal(0);
        }

        private void OnPlotExecuted()
        {
            PlotExecuted?.Invoke(this, EventArgs.Empty);
        }
    }
}
