namespace Parser
{
	class VariableExpression : IExpression
	{
		public Identifier Identifier { get; }

		public VariableExpression(Identifier identifier)
		{
			Identifier = identifier;
		}

		public void Accept(IExpressionVisitor visitor)
		{
			visitor.Traverse(() => visitor.Visit(this));
		}
	}
}
