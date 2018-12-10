using System;
using static Retyped.dom;
using static Retyped.codemirror;
using System.Collections.Generic;
using Parser;

namespace CalcBuddy
{
	public class App
	{
		public static void Main()
		{
			System.Console.WriteLine($"Version: {Version.Info}");

			var d1 = new HTMLTextAreaElement
			{
				autofocus = true
			};

			document.body.appendChild(d1);
			var editor = CodeMirror.fromTextArea(d1, new CodeMirror.EditorConfiguration()
			{
				lineNumbers = true
			});

			Dictionary<double, CodeMirror.LineWidget> widgets = new Dictionary<double, CodeMirror.LineWidget>();
			editor.setSize("100%", "100%");
			editor.on(Retyped.codemirror.Literals.change, (instance, change) =>
			{
				var notebook = new Notebook(instance.getValue());
				try
				{
					notebook.Process();
				}
				catch (Exception e)
				{
					System.Console.WriteLine(e.Message);
				}

				foreach (var widgetLine in widgets.Keys)
				{
					//if (!notebook.Results.ContainsKey((int)widgetLine))
					//{
					widgets[widgetLine].clear();
					System.Console.WriteLine("Remove widget on line: " + widgetLine);
					//}
				}

				// syntax higligting
				// auto completion
				// error display in gui
				// comments
				// statements evaluate separately / line by line

				foreach (var kvp in notebook.Results)
				{
					var div = new HTMLDivElement
					{
						textContent = kvp.Value
					};

					div.setAttribute("style", "padding: 15px; background: #dcfadc");

					widgets[kvp.Key] = editor.addLineWidget(kvp.Key, div);
					System.Console.WriteLine("Add widget on line: " + kvp.Key);
				}

				/*double line1 = change.from.line;
				if (widgets.ContainsKey(line1))
				{
					widgets[line1].clear();
				}

				string l = instance.getDoc().getLine(line1);
				var parser = new Parser.MathParser();
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
				}*/
			});
		}
	}
}
