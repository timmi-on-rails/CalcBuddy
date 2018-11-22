using System;

namespace BridgeTest
{
	public static class Assert
	{
		public static void Fail(string message)
		{
			Console.WriteLine(message);

			throw new Exception();
		}

		public static void AreEqual<T>(T expected, T actual)
		{
			if (!expected.Equals(actual))
			{
				Console.WriteLine($"Expected {expected}, but got {actual}.");
				throw new Exception();
			}
		}

		public static void AreNotEqual(object a, object b)
		{
			if (a.Equals(b))
			{
				Console.WriteLine($"Expected to be not equal: {a} and {b}.");
				throw new Exception();
			}
		}

		public static void AreNotSame(object a, object b)
		{
			if (ReferenceEquals(a, b))
			{
				Console.WriteLine($"Expected to be not the same: {a} and {b}.");
				throw new Exception();
			}
		}

		public static void IsTrue(bool value)
		{
			if (!value)
			{
				Console.WriteLine($"Expected true, but got false.");
				throw new Exception();
			}
		}

		public static void IsFalse(bool value)
		{
			if (value)
			{
				Console.WriteLine($"Expected false, but got true.");
				throw new Exception();
			}
		}

		public static void Throws<T>(Action p) where T : Exception
		{
			bool thrown = false;

			try
			{
				p();
			}
			catch (T)
			{
				thrown = true;
			}

			if (!thrown)
			{
				throw new Exception();
			}
		}
	}
}
