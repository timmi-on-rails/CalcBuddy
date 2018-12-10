namespace Tokenizer
{
	public class Token
	{
		// public Object Value { get; }

		public TokenType TokenType { get; }

		public string Content { get; }

		public int Line { get; }

		public int Position { get; }

		public ErrorCode ErrorCode { get; }

		public Token(TokenType tokenType, string content, int line, int position, ErrorCode errorCode)
		{
			TokenType = tokenType;
			Content = content;
			Line = line;
			Position = position;
			ErrorCode = errorCode;
		}
	}
}
