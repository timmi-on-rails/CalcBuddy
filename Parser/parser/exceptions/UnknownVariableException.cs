﻿using System;

namespace Parser
{
	class UnknownVariableException : ParserException
	{
		internal UnknownVariableException() { }
		internal UnknownVariableException(string message) : base(message) { }
		internal UnknownVariableException(string message, Exception innerException) : base(message, innerException) { }
	}
}
