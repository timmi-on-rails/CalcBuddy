using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parser
{
	class StatementsExpression : IExpression
	{
		public IEnumerable<StatementExpression> Statements { get; }

		public StatementsExpression(IEnumerable<StatementExpression> statements)
		{
			Statements = statements.ToArray();
		}

		public void Accept(IExpressionVisitor visitor)
		{
			visitor.Traverse(() => visitor.Visit(this), Statements.ToArray());
		}
	}
}
