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
                System.Console.WriteLine(System.String.format("Version: {0}", [CalcBuddy.Version.Info]));
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
    
        Bridge.define("CalcBuddy.Version", {
            statics: {
                fields: {
                    Info: null
                },
                ctors: {
                    init: function () {
                        this.Info = "development";
                    }
                }
            }
        });
        Bridge.init();
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDYWxjQnVkZHkuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkFwcC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Z0JBU0dBLHlCQUF5QkEsc0NBQTZCQTtnQkFDdERBLGNBQWNBLElBQUlBO2dCQUNsQkE7Z0JBQ0FBLGNBQWNBO2dCQUNkQSx5QkFBeUJBOztnQkFFekJBLFNBQVNBO2dCQUNUQTtnQkFDQUE7O2dCQUVBQSwwQkFBdUVBO2dCQUN2RUEsYUFBYUEsd0JBQTJDQSxJQUFJQTs7Z0JBSzVEQSxjQUF1RUEsS0FBSUE7O2dCQUUzRUEsVUFBVUEsVUFBb0NBLEFBQXFEQSxVQUFDQSxVQUFVQTs7b0JBRTdHQSxZQUFlQTtvQkFDZkEsSUFBSUEsb0JBQW9CQTt3QkFFdkJBLFlBQVFBOzs7O29CQUlUQSxRQUFXQSwwQkFBMEJBO29CQUNyQ0EsYUFBYUEsSUFBSUE7b0JBQ2pCQTt3QkFFQ0EsYUFBYUEsYUFBYUE7d0JBQzFCQSxVQUFVQSxzREFFS0E7O3dCQUdmQTs7d0JBRUFBLFlBQVFBLE9BQVNBLHFCQUFxQkEsT0FBT0EiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG5cbm5hbWVzcGFjZSBDYWxjQnVkZHlcbntcblx0cHVibGljIGNsYXNzIEFwcFxuXHR7XG5cdFx0cHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxuXHRcdHtcblx0XHRcdFN5c3RlbS5Db25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiVmVyc2lvbjogezB9XCIsVmVyc2lvbi5JbmZvKSk7XG5cdFx0XHR2YXIgcGFyc2VyMiA9IG5ldyBNYXRoUGFyc2VyLk1hdGhQYXJzZXIoKTtcblx0XHRcdFN5c3RlbS5Db25zb2xlLldyaXRlTGluZShcIkhlbGxvXCIpO1xuXHRcdFx0dmFyIHJlc3VsdDIgPSBwYXJzZXIyLlBhcnNlKFwiMSsxXCIpO1xuXHRcdFx0U3lzdGVtLkNvbnNvbGUuV3JpdGVMaW5lKHJlc3VsdDIuRXZhbHVhdGUoKSk7XG5cblx0XHRcdHZhciBkMSA9IG5ldyBSZXR5cGVkLmRvbS5IVE1MVGV4dEFyZWFFbGVtZW50KCk7XG5cdFx0XHRkMS5zdHlsZS5oZWlnaHQgPSBcIjIwMHB4XCI7XG5cdFx0XHRkMS5zdHlsZS53aWR0aCA9IFwiMjAwcHhcIjtcblxuXHRcdFx0UmV0eXBlZC5kb20uZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZDxSZXR5cGVkLmRvbS5IVE1MVGV4dEFyZWFFbGVtZW50PihkMSk7XG5cdFx0XHR2YXIgZWRpdG9yID0gUmV0eXBlZC5jb2RlbWlycm9yLkNvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGQxLCBuZXcgUmV0eXBlZC5jb2RlbWlycm9yLkNvZGVNaXJyb3IuRWRpdG9yQ29uZmlndXJhdGlvbigpXG5cdFx0XHR7XG5cdFx0XHRcdGxpbmVOdW1iZXJzID0gdHJ1ZVxuXHRcdFx0fSk7XG5cblx0XHRcdERpY3Rpb25hcnk8ZG91YmxlLCBSZXR5cGVkLmNvZGVtaXJyb3IuQ29kZU1pcnJvci5MaW5lV2lkZ2V0PiB3aWRnZXRzID0gbmV3IERpY3Rpb25hcnk8ZG91YmxlLCBSZXR5cGVkLmNvZGVtaXJyb3IuQ29kZU1pcnJvci5MaW5lV2lkZ2V0PigpO1xuXG5cdFx0XHRlZGl0b3Iub24oUmV0eXBlZC5jb2RlbWlycm9yLkxpdGVyYWxzLmNoYW5nZSwgKGdsb2JhbDo6UmV0eXBlZC5jb2RlbWlycm9yLkNvZGVNaXJyb3IuRWRpdG9yLm9uRm4yKSgoaW5zdGFuY2UsIGNoYW5nZSkgPT5cblx0XHRcdHtcblx0XHRcdFx0ZG91YmxlIGxpbmUxID0gY2hhbmdlLmZyb20ubGluZTtcblx0XHRcdFx0aWYgKHdpZGdldHMuQ29udGFpbnNLZXkobGluZTEpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0d2lkZ2V0c1tsaW5lMV0uY2xlYXIoKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0c3RyaW5nIGwgPSBpbnN0YW5jZS5nZXREb2MoKS5nZXRMaW5lKGxpbmUxKTtcblx0XHRcdFx0dmFyIHBhcnNlciA9IG5ldyBNYXRoUGFyc2VyLk1hdGhQYXJzZXIoKTtcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdHtcblx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gcGFyc2VyLlBhcnNlKGwpLkV2YWx1YXRlKCk7XG5cdFx0XHRcdFx0dmFyIGRpdiA9IG5ldyBSZXR5cGVkLmRvbS5IVE1MRGl2RWxlbWVudFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHRDb250ZW50ID0gcmVzdWx0LlRvU3RyaW5nKClcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0ZGl2LnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwicGFkZGluZzogMTVweDsgYmFja2dyb3VuZDogI2RjZmFkY1wiKTtcblxuXHRcdFx0XHRcdHdpZGdldHNbbGluZTFdID0gZWRpdG9yLmFkZExpbmVXaWRnZXQobGluZTEsIGRpdik7XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaCAoRXhjZXB0aW9uKVxuXHRcdFx0XHR7XG5cdFx0XHRcdH1cblx0XHRcdH0pKTtcblx0XHR9XG5cdH1cbn1cbiJdCn0K
