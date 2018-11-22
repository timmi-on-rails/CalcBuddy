using Tokenizer;

namespace Parser
{
	class VariableParselet : IPrefixParselet
	{
		public IExpression Parse(ParseExpressionDelegate parseExpression, TokenStream tokenStream, Token token)
		{
			return new VariableExpression(token.Content);
		}
	}
}
