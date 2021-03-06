﻿using BridgeTest;
using Parser;

namespace Parser.Tests
{
	[TestFixture]
	public class TestFunctions
	{
		[Test]
		public void TestFuncAssignment1 ()
		{
			SymbolManager symbolManager = new SymbolManager ();

			Parser.MathParser parser = new Parser.MathParser ();
			Expression expression = parser.Parse ("f(x)=3");
			expression.ExecuteAssignments (symbolManager);

			double a = parser.Parse ("f(2)").Evaluate (symbolManager).ToDouble ();
			Assert.AreEqual (3, a);
		}

		[Test]
		public void TestFuncAssignment2 ()
		{
			SymbolManager symbolManager = new SymbolManager ();

			Parser.MathParser parser = new Parser.MathParser ();
			Expression expression = parser.Parse ("f(x)=x*x");
			expression.ExecuteAssignments (symbolManager);

			double a = parser.Parse ("f(5)").Evaluate (symbolManager).ToDouble ();
			Assert.AreEqual (25, a);
		}
	}
}
