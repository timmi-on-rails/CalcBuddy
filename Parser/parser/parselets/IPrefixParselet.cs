using Tokenizer;

namespace Parser
{
	interface IPrefixParselet
	{
		IExpression Parse(ParseExpressionDelegate parseExpression, TokenStream tokenStream, Token token);
	}
}
