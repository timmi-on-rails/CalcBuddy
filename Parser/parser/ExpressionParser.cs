using System;
using System.Collections.Generic;
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

		StatementExpression ParseStatement(TokenStream tokenStream)
		{
			IExpression expression = Parse(tokenStream);
			int line = tokenStream.Peek().Line;

			if (tokenStream.Match(TokenType.Semicolon))
			{
				return new StatementExpression(expression, loud: false, line: line);
			}

			if (tokenStream.Match(TokenType.Newline) || tokenStream.Peek().TokenType == TokenType.EndOfFile)
			{
				return new StatementExpression(expression, loud: true, line: line);
			}

			throw new ParserException("Expected Newline or semicolon.");
		}

		public StatementsExpression ParseStatements(TokenStream tokenStream)
		{
			List<StatementExpression> statements = new List<StatementExpression>();

			while (tokenStream.Peek().TokenType != TokenType.EndOfFile)
			{
				while (tokenStream.Peek().TokenType == TokenType.Newline)
				{
					tokenStream.Consume();
				}

				StatementExpression statement = ParseStatement(tokenStream);
				statements.Add(statement);
			}

			return new StatementsExpression(statements);
		}
	}
}
