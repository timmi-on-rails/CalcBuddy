using System.Collections.Generic;
using System.Linq;
using Tokenizer;

namespace Parser
{
	public class Notebook
	{
		public string Content { get; }

		public Dictionary<int, string> Results { get; } = new Dictionary<int, string>();

		public Notebook(string content)
		{
			Content = content;
		}

		public void Process()
		{
			IEnumerable<Token> tokensWithoutWhiteSpaces = Tokenize.FromString(Content)
																   .Where(token => token.TokenType != TokenType.WhiteSpace);

			StatementsExpression statements;

			using (TokenStream tokenStream = new TokenStream(tokensWithoutWhiteSpaces))
			{
				ExpressionParser expressionParser = new ExpressionParser();
				statements = expressionParser.ParseStatements(tokenStream);

				tokenStream.Consume(TokenType.EndOfFile);
			}

			Results.Clear();
			var symbolManager = new SymbolManager();

			foreach (StatementExpression expression in statements.Statements)
			{
				var assignVisitor = new AssignVisitor(symbolManager);
				expression.Accept(assignVisitor);

				if (expression.Loud)
				{
					var evaluationVisitor = new EvaluationVisitor(symbolManager);
					expression.Accept(evaluationVisitor);
					string result = evaluationVisitor.GetResult().ToString();
					Results.Add(expression.Line, result);
				}
			}
		}
	}
}
