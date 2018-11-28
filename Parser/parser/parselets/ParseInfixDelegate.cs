namespace Parser
{
	delegate IExpression ParseInfixDelegate(ParseExpressionDelegate parseExpression, TokenStream tokenStream, IExpression leftExpression);
}
