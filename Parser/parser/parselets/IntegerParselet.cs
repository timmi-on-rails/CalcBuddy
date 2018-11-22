using System;
using System.Globalization;
using Tokenizer;

namespace Parser
{
	class IntegerParselet : IPrefixParselet
	{
		public IExpression Parse(ParseExpressionDelegate parseExpression, TokenStream tokenStream, Token token)
		{
			long result = Int64.Parse(token.Content);
			return new ValueExpression(Value.Integer(result));
		}
	}
}
