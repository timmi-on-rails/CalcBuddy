using System;
using System.Collections.Generic;
using System.Linq;
using Tokenizer;

namespace Parser
{
	class ParserSpecification
	{
		public static readonly Dictionary<TokenType, ParsePrefixDelegate> Prefix = new Dictionary<TokenType, ParsePrefixDelegate>
		{
			{ TokenType.Identifier, CreateVariableParselet() },
			{ TokenType.Decimal, CreateFloatingPointNumberParselet() },
			{ TokenType.Integer, CreateIntegerParselet() },
			{ TokenType.LeftParenthesis, CreateGroupParselet() },
			{ TokenType.Minus, CreatePrefixOperatorParselet(PrefixExpressionType.Negation) },
			{ TokenType.Plus, CreatePrefixOperatorParselet(PrefixExpressionType.Positive) }
		};

		public static readonly Dictionary<TokenType, (int precedence, ParseInfixDelegate parse)> Infix = new Dictionary<TokenType, (int, ParseInfixDelegate)>
		{
			{ TokenType.Exclamation, CreatePostfixOperatorParselet(PostfixExpressionType.Factorial, Precedences.POSTFIX) },
			{ TokenType.Assignment, CreateAssignParselet() },
			{ TokenType.Equal, CreateBinaryOperatorParselet(BinaryExpressionType.Equal, Precedences.COMPARISON, Associativity.Left) },
			{ TokenType.NotEqual, CreateBinaryOperatorParselet(BinaryExpressionType.NotEqual, Precedences.COMPARISON, Associativity.Left) },
			{ TokenType.Less, CreateBinaryOperatorParselet(BinaryExpressionType.Less, Precedences.COMPARISON, Associativity.Left) },
			{ TokenType.Greater, CreateBinaryOperatorParselet(BinaryExpressionType.Greater, Precedences.COMPARISON, Associativity.Left) },
			{ TokenType.LessOrEqual, CreateBinaryOperatorParselet(BinaryExpressionType.LessOrEqual, Precedences.COMPARISON, Associativity.Left) },
			{ TokenType.GreaterOrEqual, CreateBinaryOperatorParselet(BinaryExpressionType.GreaterOrEqual, Precedences.COMPARISON, Associativity.Left) },
			{ TokenType.QuestionMark, CreateTernaryParselet() },
			{ TokenType.LeftParenthesis, CreateCallParselet() },
			{ TokenType.Plus, CreateBinaryOperatorParselet(BinaryExpressionType.Addition, Precedences.SUM, Associativity.Left) },
			{ TokenType.Minus, CreateBinaryOperatorParselet(BinaryExpressionType.Substraction, Precedences.SUM, Associativity.Left) },
			{ TokenType.Star, CreateBinaryOperatorParselet(BinaryExpressionType.Multiplication, Precedences.PRODUCT, Associativity.Left) },
			{ TokenType.Slash, CreateBinaryOperatorParselet(BinaryExpressionType.Division, Precedences.PRODUCT, Associativity.Left) },
			{ TokenType.Pow, CreateBinaryOperatorParselet(BinaryExpressionType.Power, Precedences.EXPONENT, Associativity.Right) },
			{ TokenType.Percent, CreateBinaryOperatorParselet(BinaryExpressionType.Modulo, Precedences.PRODUCT, Associativity.Left) }
		};

		private static (int, ParseInfixDelegate) CreatePostfixOperatorParselet(PostfixExpressionType prefixExpressionType, int precedence)
		{
			return (
				precedence,
				(ParseExpressionDelegate parseExpression, TokenStream tokenStream, IExpression leftExpression) =>
				{
					return new PostfixExpression(prefixExpressionType, leftExpression);
				}
			);
		}

		private static (int, ParseInfixDelegate) CreateAssignParselet()
		{
			return (
				Precedences.ASSIGNMENT,
				(ParseExpressionDelegate parseExpression, TokenStream tokenStream, IExpression leftExpression) =>
				{
					IExpression rightExpression = parseExpression(tokenStream, Precedences.ASSIGNMENT + Associativity.Right.ToPrecedenceIncrement());

					if (leftExpression is VariableExpression)
					{
						Identifier identifier = ((VariableExpression)leftExpression).Identifier;
						return new VariableAssignmentExpression(identifier, rightExpression);
					}
					else if (leftExpression is CallExpression)
					{
						CallExpression callExpression = (CallExpression)leftExpression;

						IEnumerable<VariableExpression> arguments = callExpression.Arguments.Select(argument => (argument as VariableExpression));
						VariableExpression functionExpression = callExpression.FunctionExpression as VariableExpression;

						if (arguments.All(arg => arg != null) && functionExpression != null)
						{
							return new FunctionAssignmentExpression(functionExpression.Identifier, arguments.Select(argument => argument.Identifier), rightExpression);
						}
						else
						{
							throw new BadAssignmentException("Every argument in a function assignment must be a variable name.");
						}
					}

					throw new BadAssignmentException("The left hand side of an assignment must either be a function signature or a variable name.");
				}
			);
		}

		private static (int, ParseInfixDelegate) CreateTernaryParselet()
		{
			return (
				Precedences.CONDITIONAL,
				(ParseExpressionDelegate parseExpression, TokenStream tokenStream, IExpression leftExpression) =>
				{
					IExpression trueExpression = parseExpression(tokenStream);
					tokenStream.Consume(TokenType.Colon);
					IExpression falseExpression = parseExpression(tokenStream, Precedences.CONDITIONAL + Associativity.Right.ToPrecedenceIncrement());
					return new TernaryExpression(leftExpression, trueExpression, falseExpression);
				}
			);
		}

		private static (int, ParseInfixDelegate) CreateCallParselet()
		{
			return (
				Precedences.CALL,
				(ParseExpressionDelegate parseExpression, TokenStream tokenStream, IExpression leftExpression) =>
				{
					List<IExpression> arguments = new List<IExpression>();

					if (!tokenStream.Match(TokenType.RightParenthesis))
					{
						do
						{
							arguments.Add(parseExpression(tokenStream));
						} while (tokenStream.Match(TokenType.Comma));

						tokenStream.Consume(TokenType.RightParenthesis);
					}

					return new CallExpression(leftExpression, arguments);
				}
			);
		}

		private static (int, ParseInfixDelegate) CreateBinaryOperatorParselet(BinaryExpressionType binaryExpressionType, int precedence, Associativity associativity)
		{
			return (
				precedence,
				(ParseExpressionDelegate parseExpression, TokenStream tokenStream, IExpression leftExpression) =>
				{
					IExpression rightExpression = parseExpression(tokenStream, precedence + associativity.ToPrecedenceIncrement());
					return new BinaryExpression(binaryExpressionType, leftExpression, rightExpression);
				}
			);
		}

		static ParsePrefixDelegate CreateVariableParselet()
		{
			return (ParseExpressionDelegate parseExpression, TokenStream tokenStream, Token token) =>
			{
				return new VariableExpression(token.Content);
			};
		}

		static ParsePrefixDelegate CreateFloatingPointNumberParselet()
		{
			return (ParseExpressionDelegate parseExpression, TokenStream tokenStream, Token token) =>
			{
				double result = Double.Parse(token.Content);
				return new ValueExpression(Value.Decimal(result));
			};
		}

		private static ParsePrefixDelegate CreateIntegerParselet()
		{
			return (ParseExpressionDelegate parseExpression, TokenStream tokenStream, Token token) =>
			{
				long result = Int64.Parse(token.Content);
				return new ValueExpression(Value.Integer(result));
			};
		}

		private static ParsePrefixDelegate CreateGroupParselet()
		{
			return (ParseExpressionDelegate parseExpression, TokenStream tokenStream, Token token) =>
			{
				IExpression expression = parseExpression(tokenStream);
				tokenStream.Consume(TokenType.RightParenthesis);
				return new GroupExpression(expression);
			};
		}

		private static ParsePrefixDelegate CreatePrefixOperatorParselet(PrefixExpressionType prefixExpressionType)
		{
			return (ParseExpressionDelegate parseExpression, TokenStream tokenStream, Token token) =>
			{
				IExpression operand = parseExpression(tokenStream, Precedences.PREFIX);
				return new PrefixExpression(prefixExpressionType, operand);
			};
		}
	}
}
