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
                var parser2 = new MathParser.MathParser();
                System.Console.WriteLine("Hello");
                var result2 = parser2.Parse("1+1");
                System.Console.WriteLine(result2.Evaluate());
    
                var d1 = document.createElement("textarea");
                d1.style.height = "200px";
                d1.style.width = "200px";
    
                document.body.appendChild(d1);
                var editor = CodeMirror.fromTextArea(d1, { lineNumbers: true });
    
                var widgets = new (System.Collections.Generic.Dictionary$2(System.Double,Bridge.virtualc("CodeMirror.LineWidget")))();
    
                editor.on("change", function (instance, change) {
                    var $t;
                    var line1 = change.from.line;
                    if (widgets.containsKey(line1)) {
                        widgets.get(line1).clear();
    
                    }
    
                    var l = instance.getDoc().getLine(line1);
                    var parser = new MathParser.MathParser();
                    try {
                        var result = parser.Parse(l).Evaluate();
                        var div = ($t = document.createElement("div"), $t.textContent = result.toString(), $t);
    
                        div.setAttribute("style", "padding: 15px; background: #dcfadc");
    
                        widgets.set(line1, editor.addLineWidget(line1, div));
    
                    } catch ($e1) {
                        $e1 = System.Exception.create($e1);
                    }
                });
            }
        });
        Bridge.init();
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDYWxjQnVkZHkuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkFwcC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Z0JBU0dBLGNBQWNBLElBQUlBO2dCQUNsQkE7Z0JBQ0FBLGNBQWNBO2dCQUNkQSx5QkFBeUJBOztnQkFFekJBLFNBQVNBO2dCQUNUQTtnQkFDQUE7O2dCQUVBQSwwQkFBdUVBO2dCQUN2RUEsYUFBYUEsd0JBQTJDQSxJQUFJQTs7Z0JBSzVEQSxjQUF1RUEsS0FBSUE7O2dCQUUzRUEsVUFBVUEsVUFBb0NBLEFBQXFEQSxVQUFDQSxVQUFVQTs7b0JBRTdHQSxZQUFlQTtvQkFDZkEsSUFBSUEsb0JBQW9CQTt3QkFFdkJBLFlBQVFBOzs7O29CQUlUQSxRQUFXQSwwQkFBMEJBO29CQUNyQ0EsYUFBYUEsSUFBSUE7b0JBQ2pCQTt3QkFFQ0EsYUFBYUEsYUFBYUE7d0JBQzFCQSxVQUFVQSxzREFFS0E7O3dCQUdmQTs7d0JBRUFBLFlBQVFBLE9BQVNBLHFCQUFxQkEsT0FBT0EiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBDYWxjQnVkZHlcclxue1xyXG5cdHB1YmxpYyBjbGFzcyBBcHBcclxuXHR7XHJcblx0XHRwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXHJcblx0XHR7XHJcblx0XHRcdHZhciBwYXJzZXIyID0gbmV3IE1hdGhQYXJzZXIuTWF0aFBhcnNlcigpO1xyXG5cdFx0XHRTeXN0ZW0uQ29uc29sZS5Xcml0ZUxpbmUoXCJIZWxsb1wiKTtcclxuXHRcdFx0dmFyIHJlc3VsdDIgPSBwYXJzZXIyLlBhcnNlKFwiMSsxXCIpO1xyXG5cdFx0XHRTeXN0ZW0uQ29uc29sZS5Xcml0ZUxpbmUocmVzdWx0Mi5FdmFsdWF0ZSgpKTtcclxuXHJcblx0XHRcdHZhciBkMSA9IG5ldyBSZXR5cGVkLmRvbS5IVE1MVGV4dEFyZWFFbGVtZW50KCk7XHJcblx0XHRcdGQxLnN0eWxlLmhlaWdodCA9IFwiMjAwcHhcIjtcclxuXHRcdFx0ZDEuc3R5bGUud2lkdGggPSBcIjIwMHB4XCI7XHJcblxyXG5cdFx0XHRSZXR5cGVkLmRvbS5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkPFJldHlwZWQuZG9tLkhUTUxUZXh0QXJlYUVsZW1lbnQ+KGQxKTtcclxuXHRcdFx0dmFyIGVkaXRvciA9IFJldHlwZWQuY29kZW1pcnJvci5Db2RlTWlycm9yLmZyb21UZXh0QXJlYShkMSwgbmV3IFJldHlwZWQuY29kZW1pcnJvci5Db2RlTWlycm9yLkVkaXRvckNvbmZpZ3VyYXRpb24oKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0bGluZU51bWJlcnMgPSB0cnVlXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0RGljdGlvbmFyeTxkb3VibGUsIFJldHlwZWQuY29kZW1pcnJvci5Db2RlTWlycm9yLkxpbmVXaWRnZXQ+IHdpZGdldHMgPSBuZXcgRGljdGlvbmFyeTxkb3VibGUsIFJldHlwZWQuY29kZW1pcnJvci5Db2RlTWlycm9yLkxpbmVXaWRnZXQ+KCk7XHJcblxyXG5cdFx0XHRlZGl0b3Iub24oUmV0eXBlZC5jb2RlbWlycm9yLkxpdGVyYWxzLmNoYW5nZSwgKGdsb2JhbDo6UmV0eXBlZC5jb2RlbWlycm9yLkNvZGVNaXJyb3IuRWRpdG9yLm9uRm4yKSgoaW5zdGFuY2UsIGNoYW5nZSkgPT5cclxuXHRcdFx0e1xyXG5cdFx0XHRcdGRvdWJsZSBsaW5lMSA9IGNoYW5nZS5mcm9tLmxpbmU7XHJcblx0XHRcdFx0aWYgKHdpZGdldHMuQ29udGFpbnNLZXkobGluZTEpKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHdpZGdldHNbbGluZTFdLmNsZWFyKCk7XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0c3RyaW5nIGwgPSBpbnN0YW5jZS5nZXREb2MoKS5nZXRMaW5lKGxpbmUxKTtcclxuXHRcdFx0XHR2YXIgcGFyc2VyID0gbmV3IE1hdGhQYXJzZXIuTWF0aFBhcnNlcigpO1xyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHZhciByZXN1bHQgPSBwYXJzZXIuUGFyc2UobCkuRXZhbHVhdGUoKTtcclxuXHRcdFx0XHRcdHZhciBkaXYgPSBuZXcgUmV0eXBlZC5kb20uSFRNTERpdkVsZW1lbnRcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0dGV4dENvbnRlbnQgPSByZXN1bHQuVG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRkaXYuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJwYWRkaW5nOiAxNXB4OyBiYWNrZ3JvdW5kOiAjZGNmYWRjXCIpO1xyXG5cclxuXHRcdFx0XHRcdHdpZGdldHNbbGluZTFdID0gZWRpdG9yLmFkZExpbmVXaWRnZXQobGluZTEsIGRpdik7XHJcblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoRXhjZXB0aW9uKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIl0KfQo=
