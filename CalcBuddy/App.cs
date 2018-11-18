using System;

namespace CalcBuddy
{
    public class App
    {
        public static void Main()
        {
			var parser = new MathParser.MathParser();
			Console.WriteLine("Hello");
			var result = parser.Parse("1+1");
			Console.WriteLine(result.Evaluate());
		}
    }
}
