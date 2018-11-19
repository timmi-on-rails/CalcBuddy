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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDYWxjQnVkZHkuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkFwcC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Z0JBU0dBLGNBQWNBLElBQUlBO2dCQUNsQkE7Z0JBQ0FBLGNBQWNBO2dCQUNkQSx5QkFBeUJBOztnQkFFekJBLFNBQVNBO2dCQUNUQTtnQkFDQUE7O2dCQUVBQSwwQkFBdUVBO2dCQUN2RUEsYUFBYUEsd0JBQTJDQSxJQUFJQTs7Z0JBSzVEQSxjQUF1RUEsS0FBSUE7O2dCQUUzRUEsVUFBVUEsVUFBb0NBLEFBQXFEQSxVQUFDQSxVQUFVQTs7b0JBRTdHQSxZQUFlQTtvQkFDZkEsSUFBSUEsb0JBQW9CQTt3QkFFdkJBLFlBQVFBOzs7O29CQUlUQSxRQUFXQSwwQkFBMEJBO29CQUNyQ0EsYUFBYUEsSUFBSUE7b0JBQ2pCQTt3QkFFQ0EsYUFBYUEsYUFBYUE7d0JBQzFCQSxVQUFVQSxzREFFS0E7O3dCQUdmQTs7d0JBRUFBLFlBQVFBLE9BQVNBLHFCQUFxQkEsT0FBT0EiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG5cbm5hbWVzcGFjZSBDYWxjQnVkZHlcbntcblx0cHVibGljIGNsYXNzIEFwcFxuXHR7XG5cdFx0cHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxuXHRcdHtcblx0XHRcdHZhciBwYXJzZXIyID0gbmV3IE1hdGhQYXJzZXIuTWF0aFBhcnNlcigpO1xuXHRcdFx0U3lzdGVtLkNvbnNvbGUuV3JpdGVMaW5lKFwiSGVsbG9cIik7XG5cdFx0XHR2YXIgcmVzdWx0MiA9IHBhcnNlcjIuUGFyc2UoXCIxKzFcIik7XG5cdFx0XHRTeXN0ZW0uQ29uc29sZS5Xcml0ZUxpbmUocmVzdWx0Mi5FdmFsdWF0ZSgpKTtcblxuXHRcdFx0dmFyIGQxID0gbmV3IFJldHlwZWQuZG9tLkhUTUxUZXh0QXJlYUVsZW1lbnQoKTtcblx0XHRcdGQxLnN0eWxlLmhlaWdodCA9IFwiMjAwcHhcIjtcblx0XHRcdGQxLnN0eWxlLndpZHRoID0gXCIyMDBweFwiO1xuXG5cdFx0XHRSZXR5cGVkLmRvbS5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkPFJldHlwZWQuZG9tLkhUTUxUZXh0QXJlYUVsZW1lbnQ+KGQxKTtcblx0XHRcdHZhciBlZGl0b3IgPSBSZXR5cGVkLmNvZGVtaXJyb3IuQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZDEsIG5ldyBSZXR5cGVkLmNvZGVtaXJyb3IuQ29kZU1pcnJvci5FZGl0b3JDb25maWd1cmF0aW9uKClcblx0XHRcdHtcblx0XHRcdFx0bGluZU51bWJlcnMgPSB0cnVlXG5cdFx0XHR9KTtcblxuXHRcdFx0RGljdGlvbmFyeTxkb3VibGUsIFJldHlwZWQuY29kZW1pcnJvci5Db2RlTWlycm9yLkxpbmVXaWRnZXQ+IHdpZGdldHMgPSBuZXcgRGljdGlvbmFyeTxkb3VibGUsIFJldHlwZWQuY29kZW1pcnJvci5Db2RlTWlycm9yLkxpbmVXaWRnZXQ+KCk7XG5cblx0XHRcdGVkaXRvci5vbihSZXR5cGVkLmNvZGVtaXJyb3IuTGl0ZXJhbHMuY2hhbmdlLCAoZ2xvYmFsOjpSZXR5cGVkLmNvZGVtaXJyb3IuQ29kZU1pcnJvci5FZGl0b3Iub25GbjIpKChpbnN0YW5jZSwgY2hhbmdlKSA9PlxuXHRcdFx0e1xuXHRcdFx0XHRkb3VibGUgbGluZTEgPSBjaGFuZ2UuZnJvbS5saW5lO1xuXHRcdFx0XHRpZiAod2lkZ2V0cy5Db250YWluc0tleShsaW5lMSkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR3aWRnZXRzW2xpbmUxXS5jbGVhcigpO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzdHJpbmcgbCA9IGluc3RhbmNlLmdldERvYygpLmdldExpbmUobGluZTEpO1xuXHRcdFx0XHR2YXIgcGFyc2VyID0gbmV3IE1hdGhQYXJzZXIuTWF0aFBhcnNlcigpO1xuXHRcdFx0XHR0cnlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhciByZXN1bHQgPSBwYXJzZXIuUGFyc2UobCkuRXZhbHVhdGUoKTtcblx0XHRcdFx0XHR2YXIgZGl2ID0gbmV3IFJldHlwZWQuZG9tLkhUTUxEaXZFbGVtZW50XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGV4dENvbnRlbnQgPSByZXN1bHQuVG9TdHJpbmcoKVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRkaXYuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJwYWRkaW5nOiAxNXB4OyBiYWNrZ3JvdW5kOiAjZGNmYWRjXCIpO1xuXG5cdFx0XHRcdFx0d2lkZ2V0c1tsaW5lMV0gPSBlZGl0b3IuYWRkTGluZVdpZGdldChsaW5lMSwgZGl2KTtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoIChFeGNlcHRpb24pXG5cdFx0XHRcdHtcblx0XHRcdFx0fVxuXHRcdFx0fSkpO1xuXHRcdH1cblx0fVxufVxuIl0KfQo=
