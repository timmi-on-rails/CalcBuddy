﻿namespace Parser
{
	interface IInfixParselet
	{
		IExpression Parse(ParseExpressionDelegate parseExpression, TokenStream tokenStream, IExpression leftExpression);
		int Precedence { get; }
	}
}
