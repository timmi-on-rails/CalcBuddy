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

			IPrefixParselet prefixParselet;
			if (!ParserSpecification.Prefix.TryGetValue(token.TokenType, out prefixParselet))
			{
				// TODO better exception
				throw new ArgumentException(
					"Could not parse \"" + token.Content + "\".");
			}

			IExpression leftExpression = prefixParselet.Parse(ParseExpression, tokenStream, token);

			IInfixParselet infixParselet;

			while (ParserSpecification.Infix.TryGetValue(tokenStream.Peek().TokenType, out infixParselet)
				&& precedence < infixParselet.Precedence)
			{
				tokenStream.Consume();
				leftExpression = infixParselet.Parse(ParseExpression, tokenStream, leftExpression);
			}

			return leftExpression;
		}
	}
}
