using Tokenizer;

namespace Parser
{
	delegate IExpression ParsePrefixDelegate(ParseExpressionDelegate parseExpression, TokenStream tokenStream, Token token);
}
