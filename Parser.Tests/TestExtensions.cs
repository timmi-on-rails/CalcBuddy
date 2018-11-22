using BridgeTest;

namespace Parser.Tests
{
	public static class TestExtensions
	{
		public static double Evaluate(this string mathExpression)
		{
			Parser.MathParser mathParser = new Parser.MathParser();
			return mathParser.Parse(mathExpression).Evaluate().ToDouble();
		}

		public static void ShouldParseAs(this string mathExpression, string expected)
		{
			Parser.MathParser mathParser = new Parser.MathParser();
			Assert.AreEqual(expected, mathParser.Parse(mathExpression).ToDebug());
		}

		public static void ShouldEvaluateTo(this string mathExpression, double expected)
		{
			Parser.MathParser mathParser = new Parser.MathParser();
			Assert.AreEqual(expected, mathParser.Parse(mathExpression).Evaluate().ToDouble());
		}
	}
}
