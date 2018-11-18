using System;
using static Retyped.dom;
using static Retyped.codemirror;
using System.Collections.Generic;

namespace CalcBuddy
{
	public class App
	{
		public static void Main()
		{
			var parser2 = new MathParser.MathParser();
			System.Console.WriteLine("Hello");
			var result2 = parser2.Parse("1+1");
			System.Console.WriteLine(result2.Evaluate());

			var d1 = new HTMLTextAreaElement();
			d1.style.height = "200px";
			d1.style.width = "200px";

			document.body.appendChild(d1);
			var editor = CodeMirror.fromTextArea(d1, new CodeMirror.EditorConfiguration()
			{
				lineNumbers = true
			});

			Dictionary<double, CodeMirror.LineWidget> widgets = new Dictionary<double, CodeMirror.LineWidget>();

			editor.on(Retyped.codemirror.Literals.change, (instance, change) =>
			{
				double line1 = change.from.line;
				if (widgets.ContainsKey(line1))
				{
					widgets[line1].clear();

				}

				string l = instance.getDoc().getLine(line1);
				var parser = new MathParser.MathParser();
				try
				{
					var result = parser.Parse(l).Evaluate();
					var div = new HTMLDivElement
					{
						textContent = result.ToString()
					};

					div.setAttribute("style", "padding: 15px; background: #dcfadc");

					widgets[line1] = editor.addLineWidget(line1, div);

				}
				catch (Exception)
				{
				}
			});
		}
	}
}
