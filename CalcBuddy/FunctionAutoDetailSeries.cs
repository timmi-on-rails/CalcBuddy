using OxyPlot;
using OxyPlot.Axes;
using OxyPlot.Series;
using System;
using System.Collections.Generic;

namespace CalcBuddy
{
    public class FunctionAutoDetailSeries : LineSeries
    {
        public Func<double, double> Function { get; set; }

        public int NumberOfDataPoints { get; set; }

        public FunctionAutoDetailSeries()
        {
            ItemsSource = CreateDataPoints();
            NumberOfDataPoints = 1000;
        }

        public FunctionAutoDetailSeries(Func<double, double> function) : this()
        {
            this.Function = function;
        }

        private IEnumerable<DataPoint> CreateDataPoints()
        {
            if (Function != null)
            {
                VerifyAxes();

                double minX = XAxis.ActualMinimum;
                double maxX = XAxis.ActualMaximum;

                double dx = (maxX - minX) / NumberOfDataPoints;

                for (int i = 0; i < NumberOfDataPoints; i++)
                {
                    double x = minX + (i + 0.5) * dx;
                    yield return new DataPoint(x, Function(x));
                }
            }
        }

        protected override void EnsureAxes()
        {
            base.EnsureAxes();

            XAxis.AxisChanged -= XAxisChanged;
            XAxis.AxisChanged += XAxisChanged;
        }

        private void XAxisChanged(object sender, AxisChangedEventArgs e)
        {
            UpdateData();
        }
    }
}
