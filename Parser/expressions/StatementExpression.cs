namespace Parser
{
	class StatementExpression : IExpression
	{
		public IExpression Expression { get; }

		public bool Loud { get; }

		public int Line { get; }

		public void Accept(IExpressionVisitor visitor)
		{
			visitor.Traverse(() => visitor.Visit(this), Expression);
		}

		public StatementExpression(IExpression expression, bool loud, int line)
		{
			Expression = expression;
			Loud = loud;
			Line = line;
		}
	}
}
