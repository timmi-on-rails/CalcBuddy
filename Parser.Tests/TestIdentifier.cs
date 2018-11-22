using BridgeTest;
using MathParser;

namespace Parser.Tests
{
	[TestFixture]
	public class TestIdentifier
	{
		[Test]
		public void TestComparison()
		{
			Identifier identifierX = "x";
			Identifier identifierY = "y";

			Assert.AreNotSame(identifierX, identifierY);
			Assert.AreNotEqual(identifierX, identifierY);
			Assert.IsTrue(identifierX != identifierY);
			// TODO more checks on valid identifiers
		}
	}
}
