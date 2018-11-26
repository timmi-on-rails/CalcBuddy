using System.Collections.Generic;
using Tokenizer;

namespace Parser
{
	class ParserSpecification
	{
		public static readonly Dictionary<TokenType, IPrefixParselet> Prefix = new Dictionary<TokenType, IPrefixParselet>
		{
			{ TokenType.Identifier, new VariableParselet() },
			{ TokenType.Decimal, new FloatingPointNumberParselet() },
			{ TokenType.Integer, new IntegerParselet() },
			{ TokenType.LeftParenthesis, new GroupParselet() },
			{ TokenType.Minus, new PrefixOperatorParselet(PrefixExpressionType.Negation, Precedences.PREFIX) },
			{ TokenType.Plus, new PrefixOperatorParselet(PrefixExpressionType.Positive, Precedences.PREFIX) }
		};

		public static readonly Dictionary<TokenType, IInfixParselet> Infix = new Dictionary<TokenType, IInfixParselet>
		{
			{ TokenType.Exclamation, new PostfixOperatorParselet(PostfixExpressionType.Factorial, Precedences.POSTFIX) },
			{ TokenType.Assignment, new AssignParselet() },
			{ TokenType.Equal, new BinaryOperatorParselet(BinaryExpressionType.Equal, Precedences.COMPARISON, Associativity.Left) },
			{ TokenType.NotEqual, new BinaryOperatorParselet(BinaryExpressionType.NotEqual, Precedences.COMPARISON, Associativity.Left) },
			{ TokenType.Less, new BinaryOperatorParselet(BinaryExpressionType.Less, Precedences.COMPARISON, Associativity.Left) },
			{ TokenType.Greater, new BinaryOperatorParselet(BinaryExpressionType.Greater, Precedences.COMPARISON, Associativity.Left) },
			{ TokenType.LessOrEqual, new BinaryOperatorParselet(BinaryExpressionType.LessOrEqual, Precedences.COMPARISON, Associativity.Left) },
			{ TokenType.GreaterOrEqual, new BinaryOperatorParselet(BinaryExpressionType.GreaterOrEqual, Precedences.COMPARISON, Associativity.Left) },
			{ TokenType.QuestionMark, new TernaryParselet() },
			{ TokenType.LeftParenthesis, new CallParselet() },
			{ TokenType.Plus, new BinaryOperatorParselet(BinaryExpressionType.Addition, Precedences.SUM, Associativity.Left) },
			{ TokenType.Minus, new BinaryOperatorParselet(BinaryExpressionType.Substraction, Precedences.SUM, Associativity.Left) },
			{ TokenType.Star, new BinaryOperatorParselet(BinaryExpressionType.Multiplication, Precedences.PRODUCT, Associativity.Left) },
			{ TokenType.Slash, new BinaryOperatorParselet(BinaryExpressionType.Division, Precedences.PRODUCT, Associativity.Left) },
			{ TokenType.Pow, new BinaryOperatorParselet(BinaryExpressionType.Power, Precedences.EXPONENT, Associativity.Right) },
			{ TokenType.Percent, new BinaryOperatorParselet(BinaryExpressionType.Modulo, Precedences.PRODUCT, Associativity.Left) }
		};
	}
}
