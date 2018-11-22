namespace Parser
{
	class GroupExpression : IExpression
	{
		public IExpression Operand { get; }

		public GroupExpression(IExpression operand)
		{
			Operand = operand;
		}

		public void Accept(IExpressionVisitor visitor)
		{
			visitor.Traverse(() => visitor.Visit(this), Operand);
		}
	}
}
