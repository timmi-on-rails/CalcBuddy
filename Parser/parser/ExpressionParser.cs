using System;
using Tokenizer;

namespace Parser
{
	class ExpressionParser
	{
		public IExpression Parse(TokenStream tokenStream)
		{
			return ParseExpression(tokenStream, Precedences.EXPRESSION);
		}

		IExpression ParseExpression(TokenStream tokenStream, int precedence)
		{
			Token token = tokenStream.Consume();

			ParsePrefixDelegate parsePrefix;
			if (!ParserSpecification.Prefix.TryGetValue(token.TokenType, out parsePrefix))
			{
				// TODO better exception
				throw new ArgumentException("Could not parse \"" + token.Content + "\".");
			}

			// Do not inline declaration to out parameter ... bug https://github.com/bridgedotnet/Bridge/issues/3786
			IExpression leftExpression = parsePrefix(ParseExpression, tokenStream, token);

			(int precedence, ParseInfixDelegate parse) infix;

			while (ParserSpecification.Infix.TryGetValue(tokenStream.Peek().TokenType, out infix)
				&& precedence < infix.precedence)
			{
				tokenStream.Consume();
				leftExpression = infix.parse(ParseExpression, tokenStream, leftExpression);
			}

			return leftExpression;
		}
	}
}
