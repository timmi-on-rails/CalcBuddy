using System;

namespace Parser
{
	class EvaluationException : Exception
	{
		internal EvaluationException() { }
		internal EvaluationException(string message) : base(message) { }
		internal EvaluationException(string message, Exception innerException) : base(message, innerException) { }
	}
}
