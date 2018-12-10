/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2018
 * @compiler Bridge.NET 17.4.0
 */
Bridge.assembly("CalcBuddy", function ($asm, globals) {
    "use strict";

    require(["codemirror"], function (CodeMirror) {
        Bridge.define("CalcBuddy.App", {
            main: function Main () {
                var $t;
                System.Console.WriteLine(System.String.format("Version: {0}", [CalcBuddy.Version.Info]));
    
                var d1 = ($t = document.createElement("textarea"), $t.autofocus = true, $t);
    
                document.body.appendChild(d1);
                var editor = CodeMirror.fromTextArea(d1, { lineNumbers: true });
    
                var widgets = new (System.Collections.Generic.Dictionary$2(System.Double,Bridge.virtualc("CodeMirror.LineWidget")))();
                editor.setSize("100%", "100%");
                editor.on("change", function (instance, change) {
                    var $t1, $t2, $t3;
                    var notebook = new Parser.Notebook(instance.getValue());
                    try {
                        notebook.Process();
                    } catch (e) {
                        e = System.Exception.create(e);
                        System.Console.WriteLine(e.Message);
                    }
    
                    $t1 = Bridge.getEnumerator(widgets.getKeys(), System.Double);
                    try {
                        while ($t1.moveNext()) {
                            var widgetLine = $t1.Current;
                            widgets.get(widgetLine).clear();
                            System.Console.WriteLine("Remove widget on line: " + System.Double.format(widgetLine));
                        }
                    } finally {
                        if (Bridge.is($t1, System.IDisposable)) {
                            $t1.System$IDisposable$Dispose();
                        }
                    }
    
    
                    $t2 = Bridge.getEnumerator(notebook.Results);
                    try {
                        while ($t2.moveNext()) {
                            var kvp = $t2.Current;
                            var div = ($t3 = document.createElement("div"), $t3.textContent = kvp.value, $t3);
    
                            div.setAttribute("style", "padding: 15px; background: #dcfadc");
    
                            widgets.set(kvp.key, editor.addLineWidget(kvp.key, div));
                            System.Console.WriteLine("Add widget on line: " + kvp.key);
                        }
                    } finally {
                        if (Bridge.is($t2, System.IDisposable)) {
                            $t2.System$IDisposable$Dispose();
                        }
                    }
    
                    /* double line1 = change.from.line;
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
        });
    
        Bridge.define("CalcBuddy.Version", {
            statics: {
                fields: {
                    Info: null
                },
                ctors: {
                    init: function () {
                        this.Info = "1.0.71";
                    }
                }
            }
        });
        Bridge.init();
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDYWxjQnVkZHkuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkFwcC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7O2dCQVVHQSx5QkFBeUJBLHNDQUE2QkE7O2dCQUV0REEsU0FBU0E7O2dCQUtUQSwwQkFBdUVBO2dCQUN2RUEsYUFBYUEsd0JBQTJDQSxJQUFJQTs7Z0JBSzVEQSxjQUF1RUEsS0FBSUE7Z0JBQzNFQTtnQkFDQUEsVUFBVUEsVUFBb0NBLEFBQXFEQSxVQUFDQSxVQUFVQTs7b0JBRTdHQSxlQUFlQSxJQUFJQSxnQkFBU0E7b0JBQzVCQTt3QkFFQ0E7Ozt3QkFJQUEseUJBQXlCQTs7O29CQUcxQkEsTUFBMkJBOzs7OzRCQUkxQkEsWUFBUUE7NEJBQ1JBLHlCQUF5QkEsaURBQTRCQTs7Ozs7Ozs7O29CQVV0REEsMkJBQW9CQTs7Ozs0QkFFbkJBLFVBQVVBLHdEQUVLQTs7NEJBR2ZBOzs0QkFFQUEsWUFBUUEsU0FBV0EscUJBQXFCQSxTQUFTQTs0QkFDakRBLHlCQUF5QkEseUJBQXlCQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIFBhcnNlcjtcblxubmFtZXNwYWNlIENhbGNCdWRkeVxue1xuXHRwdWJsaWMgY2xhc3MgQXBwXG5cdHtcblx0XHRwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXG5cdFx0e1xuXHRcdFx0U3lzdGVtLkNvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJWZXJzaW9uOiB7MH1cIixWZXJzaW9uLkluZm8pKTtcblxuXHRcdFx0dmFyIGQxID0gbmV3IFJldHlwZWQuZG9tLkhUTUxUZXh0QXJlYUVsZW1lbnRcblx0XHRcdHtcblx0XHRcdFx0YXV0b2ZvY3VzID0gdHJ1ZVxuXHRcdFx0fTtcblxuXHRcdFx0UmV0eXBlZC5kb20uZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZDxSZXR5cGVkLmRvbS5IVE1MVGV4dEFyZWFFbGVtZW50PihkMSk7XG5cdFx0XHR2YXIgZWRpdG9yID0gUmV0eXBlZC5jb2RlbWlycm9yLkNvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGQxLCBuZXcgUmV0eXBlZC5jb2RlbWlycm9yLkNvZGVNaXJyb3IuRWRpdG9yQ29uZmlndXJhdGlvbigpXG5cdFx0XHR7XG5cdFx0XHRcdGxpbmVOdW1iZXJzID0gdHJ1ZVxuXHRcdFx0fSk7XG5cblx0XHRcdERpY3Rpb25hcnk8ZG91YmxlLCBSZXR5cGVkLmNvZGVtaXJyb3IuQ29kZU1pcnJvci5MaW5lV2lkZ2V0PiB3aWRnZXRzID0gbmV3IERpY3Rpb25hcnk8ZG91YmxlLCBSZXR5cGVkLmNvZGVtaXJyb3IuQ29kZU1pcnJvci5MaW5lV2lkZ2V0PigpO1xuXHRcdFx0ZWRpdG9yLnNldFNpemUoXCIxMDAlXCIsIFwiMTAwJVwiKTtcblx0XHRcdGVkaXRvci5vbihSZXR5cGVkLmNvZGVtaXJyb3IuTGl0ZXJhbHMuY2hhbmdlLCAoZ2xvYmFsOjpSZXR5cGVkLmNvZGVtaXJyb3IuQ29kZU1pcnJvci5FZGl0b3Iub25GbjIpKChpbnN0YW5jZSwgY2hhbmdlKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgbm90ZWJvb2sgPSBuZXcgTm90ZWJvb2soaW5zdGFuY2UuZ2V0VmFsdWUoKSk7XG5cdFx0XHRcdHRyeVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bm90ZWJvb2suUHJvY2VzcygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoIChFeGNlcHRpb24gZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFN5c3RlbS5Db25zb2xlLldyaXRlTGluZShlLk1lc3NhZ2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yZWFjaCAodmFyIHdpZGdldExpbmUgaW4gd2lkZ2V0cy5LZXlzKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly9pZiAoIW5vdGVib29rLlJlc3VsdHMuQ29udGFpbnNLZXkoKGludCl3aWRnZXRMaW5lKSlcblx0XHRcdFx0XHQvL3tcblx0XHRcdFx0XHR3aWRnZXRzW3dpZGdldExpbmVdLmNsZWFyKCk7XG5cdFx0XHRcdFx0U3lzdGVtLkNvbnNvbGUuV3JpdGVMaW5lKFwiUmVtb3ZlIHdpZGdldCBvbiBsaW5lOiBcIiArIHdpZGdldExpbmUpO1xuXHRcdFx0XHRcdC8vfVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gc3ludGF4IGhpZ2xpZ3Rpbmdcblx0XHRcdFx0Ly8gYXV0byBjb21wbGV0aW9uXG5cdFx0XHRcdC8vIGVycm9yIGRpc3BsYXkgaW4gZ3VpXG5cdFx0XHRcdC8vIGNvbW1lbnRzXG5cdFx0XHRcdC8vIHN0YXRlbWVudHMgZXZhbHVhdGUgc2VwYXJhdGVseSAvIGxpbmUgYnkgbGluZVxuXG5cdFx0XHRcdGZvcmVhY2ggKHZhciBrdnAgaW4gbm90ZWJvb2suUmVzdWx0cylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhciBkaXYgPSBuZXcgUmV0eXBlZC5kb20uSFRNTERpdkVsZW1lbnRcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0Q29udGVudCA9IGt2cC5WYWx1ZVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRkaXYuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJwYWRkaW5nOiAxNXB4OyBiYWNrZ3JvdW5kOiAjZGNmYWRjXCIpO1xuXG5cdFx0XHRcdFx0d2lkZ2V0c1trdnAuS2V5XSA9IGVkaXRvci5hZGRMaW5lV2lkZ2V0KGt2cC5LZXksIGRpdik7XG5cdFx0XHRcdFx0U3lzdGVtLkNvbnNvbGUuV3JpdGVMaW5lKFwiQWRkIHdpZGdldCBvbiBsaW5lOiBcIiArIGt2cC5LZXkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Lypkb3VibGUgbGluZTEgPSBjaGFuZ2UuZnJvbS5saW5lO1xuXHRcdFx0XHRpZiAod2lkZ2V0cy5Db250YWluc0tleShsaW5lMSkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR3aWRnZXRzW2xpbmUxXS5jbGVhcigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c3RyaW5nIGwgPSBpbnN0YW5jZS5nZXREb2MoKS5nZXRMaW5lKGxpbmUxKTtcblx0XHRcdFx0dmFyIHBhcnNlciA9IG5ldyBQYXJzZXIuTWF0aFBhcnNlcigpO1xuXHRcdFx0XHR0cnlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhciByZXN1bHQgPSBwYXJzZXIuUGFyc2UobCkuRXZhbHVhdGUoKTtcblx0XHRcdFx0XHR2YXIgZGl2ID0gbmV3IEhUTUxEaXZFbGVtZW50XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGV4dENvbnRlbnQgPSByZXN1bHQuVG9TdHJpbmcoKVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRkaXYuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJwYWRkaW5nOiAxNXB4OyBiYWNrZ3JvdW5kOiAjZGNmYWRjXCIpO1xuXG5cdFx0XHRcdFx0d2lkZ2V0c1tsaW5lMV0gPSBlZGl0b3IuYWRkTGluZVdpZGdldChsaW5lMSwgZGl2KTtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoIChFeGNlcHRpb24pXG5cdFx0XHRcdHtcblx0XHRcdFx0fSovXG5cdFx0XHR9KSk7XG5cdFx0fVxuXHR9XG59XG4iXQp9Cg==
