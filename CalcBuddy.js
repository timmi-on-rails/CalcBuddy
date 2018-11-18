/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2018
 * @compiler Bridge.NET 17.4.0
 */
Bridge.assembly("CalcBuddy", function ($asm, globals) {
    "use strict";

    Bridge.define("CalcBuddy.App", {
        main: function Main () {
            var parser = new MathParser.MathParser();
            System.Console.WriteLine("Hello");
            var result = parser.Parse("1+1");
            System.Console.WriteLine(result.Evaluate());
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDYWxjQnVkZHkuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkFwcC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7OztZQVFHQSxhQUFhQSxJQUFJQTtZQUNqQkE7WUFDQUEsYUFBYUE7WUFDYkEseUJBQWtCQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgQ2FsY0J1ZGR5XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBBcHBcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXHJcbiAgICAgICAge1xyXG5cdFx0XHR2YXIgcGFyc2VyID0gbmV3IE1hdGhQYXJzZXIuTWF0aFBhcnNlcigpO1xyXG5cdFx0XHRDb25zb2xlLldyaXRlTGluZShcIkhlbGxvXCIpO1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0gcGFyc2VyLlBhcnNlKFwiMSsxXCIpO1xyXG5cdFx0XHRDb25zb2xlLldyaXRlTGluZShyZXN1bHQuRXZhbHVhdGUoKSk7XHJcblx0XHR9XHJcbiAgICB9XHJcbn1cclxuIl0KfQo=
