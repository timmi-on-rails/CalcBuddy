using System;
using System.Reflection;

namespace BridgeTest
{
	public static class Tests
	{
		public static void Run(Assembly assembly)
		{
			int total = 0;
			int failed = 0;
			int success = 0;

			foreach (Type type in assembly.GetTypes())
			{
				bool isTestClass = type.GetCustomAttributes(typeof(TestFixture), inherit: false).Length > 0;

				if (isTestClass)
				{
					string className = type.Name;

					foreach (MethodInfo methodInfo in type.GetMethods())
					{
						bool isTestMethod = methodInfo.GetCustomAttributes(typeof(Test)).Length > 0;

						if (isTestMethod)
						{
							string methodName = methodInfo.Name;
							object instance = Activator.CreateInstance(type);

							Console.WriteLine($"{className}.{methodName}");
							Console.Write("...");

							try
							{
								total++;
								methodInfo.Invoke(instance);
								success++;
								Console.WriteLine("Ok");
							}
							catch (Exception e)
							{
								Console.WriteLine($"Exception: {e.Message}");
								failed++;
								Console.WriteLine("Failed");
							}
						}
					}
				}
			}

			Console.WriteLine("--------------------------------");
			Console.WriteLine($"Total: {total}, Success: {success}, Failed: {failed}");
		}
	}
}
