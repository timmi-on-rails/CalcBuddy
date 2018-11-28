/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2015
 * @compiler Bridge.NET 17.4.0
 */
Bridge.assembly("Parser", function ($asm, globals) {
    "use strict";

    Bridge.define("Parser.IExpressionVisitor", {
        $kind: "interface"
    });

    Bridge.define("Parser.Associativity", {
        $kind: "enum",
        statics: {
            fields: {
                Left: 0,
                Right: 1
            }
        }
    });

    Bridge.define("Parser.AssociativityExtensions", {
        statics: {
            methods: {
                /**
                 * Parsing operators with same precedence and right associativity
                 is done by parsing the right hand side expression with a lower precedence.
                 *
                 * @static
                 * @public
                 * @this Parser.AssociativityExtensions
                 * @memberof Parser.AssociativityExtensions
                 * @param   {Parser.Associativity}    associativity
                 * @return  {number}                                   The precedence increment.
                 */
                ToPrecedenceIncrement: function (associativity) {
                    switch (associativity) {
                        case Parser.Associativity.Left: 
                            return 0;
                        case Parser.Associativity.Right: 
                            return -1;
                        default: 
                            throw new System.ArgumentException.$ctor1("unhandled associtivity");
                    }
                }
            }
        }
    });

    Bridge.define("Parser.ParserException", {
        inherits: [System.Exception],
        ctors: {
            ctor: function () {
                this.$initialize();
                System.Exception.ctor.call(this);
            },
            $ctor1: function (message) {
                this.$initialize();
                System.Exception.ctor.call(this, message);
            },
            $ctor2: function (message, innerException) {
                this.$initialize();
                System.Exception.ctor.call(this, message, innerException);
            }
        }
    });

    Bridge.define("Parser.IExpression", {
        $kind: "interface"
    });

    Bridge.define("Parser.BinaryExpressionType", {
        $kind: "enum",
        statics: {
            fields: {
                Addition: 0,
                Substraction: 1,
                Multiplication: 2,
                Division: 3,
                Power: 4,
                Modulo: 5,
                Equal: 6,
                NotEqual: 7,
                Less: 8,
                LessOrEqual: 9,
                Greater: 10,
                GreaterOrEqual: 11
            }
        }
    });

    Bridge.define("Parser.EvaluateSymbols", {
        statics: {
            methods: {
                SetEvalSymbol: function (symbolManager) {
                    var $function = function ($arguments) {
                        var value = $arguments[System.Array.index(0, $arguments)];

                        return value.ToExpression().Evaluate$1(symbolManager);
                    };

                    symbolManager.Parser$ISymbolManager$Set(Parser.Identifier.op_Implicit("eval"), Parser.Value.Function($function));
                }
            }
        }
    });

    Bridge.define("Parser.EvaluationException", {
        inherits: [System.Exception],
        ctors: {
            ctor: function () {
                this.$initialize();
                System.Exception.ctor.call(this);
            },
            $ctor1: function (message) {
                this.$initialize();
                System.Exception.ctor.call(this, message);
            },
            $ctor2: function (message, innerException) {
                this.$initialize();
                System.Exception.ctor.call(this, message, innerException);
            }
        }
    });

    Bridge.define("Parser.Expression", {
        props: {
            Expr: null
        },
        ctors: {
            ctor: function (expression) {
                this.$initialize();
                this.Expr = expression;
            }
        },
        methods: {
            Evaluate: function () {
                return this.Evaluate$1(null);
            },
            Evaluate$1: function (symbolManager) {
                var evaluationVisitor = new Parser.EvaluationVisitor(symbolManager);
                this.Expr.Parser$IExpression$Accept(evaluationVisitor);
                return evaluationVisitor.GetResult();
            },
            ExecuteAssignments: function (symbolManager) {
                var assignVisitor = new Parser.AssignVisitor(symbolManager);
                this.Expr.Parser$IExpression$Accept(assignVisitor);
            },
            toString: function () {
                return this.ToDebug();
            },
            ToDebug: function () {
                var printVisitor = new Parser.PrintVisitor();
                this.Expr.Parser$IExpression$Accept(printVisitor);
                return printVisitor.GetResult();
            },
            ToGraphviz: function () {
                var graphvizVisitor = new Parser.GraphvizVisitor();
                this.Expr.Parser$IExpression$Accept(graphvizVisitor);
                return graphvizVisitor.GetResult();
            }
        }
    });

    Bridge.define("Parser.ExpressionParser", {
        methods: {
            Parse: function (tokenStream) {
                return this.ParseExpression(tokenStream, Parser.Precedences.EXPRESSION);
            },
            ParseExpression: function (tokenStream, precedence) {
                var token = tokenStream.Consume();

                var parsePrefix = { };
                if (!Parser.ParserSpecification.Prefix.tryGetValue(token.TokenType, parsePrefix)) {
                    // TODO better exception
                    throw new System.ArgumentException.$ctor1("Could not parse \"" + (token.Content || "") + "\".");
                }

                // Do not inline declaration to out parameter ... bug https://github.com/bridgedotnet/Bridge/issues/3786
                var leftExpression = parsePrefix.v(Bridge.fn.cacheBind(this, this.ParseExpression), tokenStream, token);

                var infix = { v : new (System.ValueTuple$2(System.Int32,Function))() };

                while (Parser.ParserSpecification.Infix.tryGetValue(tokenStream.Peek().TokenType, infix) && precedence < infix.v.Item1) {
                    tokenStream.Consume();
                    leftExpression = infix.v.Item2(Bridge.fn.cacheBind(this, this.ParseExpression), tokenStream, leftExpression);
                }

                return leftExpression;
            }
        }
    });

    Bridge.define("Parser.ExpressionVisitorExtensions", {
        statics: {
            methods: {
                Traverse: function (visitor, visitSelf, children) {
                    var $t;
                    if (children === void 0) { children = []; }
                    var traversal = visitor.Parser$IExpressionVisitor$Traversal;

                    if (traversal === Parser.Traversal.BottomUp) {
                        $t = Bridge.getEnumerator(children);
                        try {
                            while ($t.moveNext()) {
                                var child = $t.Current;
                                child.Parser$IExpression$Accept(visitor);
                            }
                        } finally {
                            if (Bridge.is($t, System.IDisposable)) {
                                $t.System$IDisposable$Dispose();
                            }
                        }
                    } else if (traversal === Parser.Traversal.None) {
                    } else {
                        throw new System.ArgumentException.$ctor1("unknown traversal type");
                    }

                    visitSelf();
                }
            }
        }
    });

    Bridge.define("Parser.Identifier", {
        statics: {
            methods: {
                op_Implicit: function (name) {
                    return new Parser.Identifier(name);
                },
                op_Implicit$1: function (identifier) {
                    return identifier._name;
                },
                op_Equality: function (identifier1, identifier2) {
                    if (Bridge.referenceEquals(identifier1, identifier2)) {
                        return true;
                    }

                    if (identifier1 == null || identifier2 == null) {
                        return false;
                    }

                    return System.String.equals(identifier1._name, identifier2._name);
                },
                op_Inequality: function (identifier1, identifier2) {
                    return !(Parser.Identifier.op_Equality(identifier1, identifier2));
                }
            }
        },
        fields: {
            _name: null
        },
        ctors: {
            ctor: function (name) {
                this.$initialize();
                this._name = name;
                // TODO validation
            }
        },
        methods: {
            toString: function () {
                return this._name;
            },
            equals: function (obj) {
                var other = (Bridge.as(obj, Parser.Identifier));

                if (other == null) {
                    return false;
                }

                return System.String.equals(this._name, other._name);
            },
            getHashCode: function () {
                return Bridge.getHashCode(this._name);
            }
        }
    });

    Bridge.define("Parser.ISymbolManager", {
        $kind: "interface"
    });

    Bridge.define("Parser.MathParser", {
        methods: {
            Parse: function (expression) {
                var tokensWithoutWhiteSpaces = System.Linq.Enumerable.from(Tokenizer.Tokenize.FromString(expression)).where($asm.$.Parser.MathParser.f1);

                var tokenStream = new Parser.TokenStream(tokensWithoutWhiteSpaces);
                try {
                    var expressionParser = new Parser.ExpressionParser();
                    var rootExpression = expressionParser.Parse(tokenStream);

                    tokenStream.Consume$1(Tokenizer.TokenType.EndOfFile);

                    return new Parser.Expression(rootExpression);
                }
                finally {
                    if (Bridge.hasValue(tokenStream)) {
                        tokenStream.System$IDisposable$Dispose();
                    }
                }
            }
        }
    });

    Bridge.ns("Parser.MathParser", $asm.$);

    Bridge.apply($asm.$.Parser.MathParser, {
        f1: function (token) {
            return token.TokenType !== Tokenizer.TokenType.WhiteSpace;
        }
    });

    Bridge.define("Parser.ParserSpecification", {
        statics: {
            fields: {
                Prefix: null,
                Infix: null
            },
            ctors: {
                init: function () {
                    this.Prefix = $asm.$.Parser.ParserSpecification.f1(new (System.Collections.Generic.Dictionary$2(Tokenizer.TokenType,Function))());
                    this.Infix = $asm.$.Parser.ParserSpecification.f2(new (System.Collections.Generic.Dictionary$2(Tokenizer.TokenType,System.ValueTuple$2(System.Int32,Function)))());
                }
            },
            methods: {
                CreatePostfixOperatorParselet: function (prefixExpressionType, precedence) {
                    return new (System.ValueTuple$2(System.Int32,Function)).$ctor1(precedence, function (parseExpression, tokenStream, leftExpression) {
                        return new Parser.PostfixExpression(prefixExpressionType, leftExpression);
                    });
                },
                CreateAssignParselet: function () {
                    return new (System.ValueTuple$2(System.Int32,Function)).$ctor1(Parser.Precedences.ASSIGNMENT, $asm.$.Parser.ParserSpecification.f6);
                },
                CreateTernaryParselet: function () {
                    return new (System.ValueTuple$2(System.Int32,Function)).$ctor1(Parser.Precedences.CONDITIONAL, $asm.$.Parser.ParserSpecification.f7);
                },
                CreateCallParselet: function () {
                    return new (System.ValueTuple$2(System.Int32,Function)).$ctor1(Parser.Precedences.CALL, $asm.$.Parser.ParserSpecification.f8);
                },
                CreateBinaryOperatorParselet: function (binaryExpressionType, precedence, associativity) {
                    return new (System.ValueTuple$2(System.Int32,Function)).$ctor1(precedence, function (parseExpression, tokenStream, leftExpression) {
                        var rightExpression = parseExpression(tokenStream, ((precedence + Parser.AssociativityExtensions.ToPrecedenceIncrement(associativity)) | 0));
                        return new Parser.BinaryExpression(binaryExpressionType, leftExpression, rightExpression);
                    });
                },
                CreateVariableParselet: function () {
                    return $asm.$.Parser.ParserSpecification.f9;
                },
                CreateFloatingPointNumberParselet: function () {
                    return $asm.$.Parser.ParserSpecification.f10;
                },
                CreateIntegerParselet: function () {
                    return $asm.$.Parser.ParserSpecification.f11;
                },
                CreateGroupParselet: function () {
                    return $asm.$.Parser.ParserSpecification.f12;
                },
                CreatePrefixOperatorParselet: function (prefixExpressionType) {
                    return function (parseExpression, tokenStream, token) {
                        var operand = parseExpression(tokenStream, Parser.Precedences.PREFIX);
                        return new Parser.PrefixExpression(prefixExpressionType, operand);
                    };
                }
            }
        }
    });

    Bridge.ns("Parser.ParserSpecification", $asm.$);

    Bridge.apply($asm.$.Parser.ParserSpecification, {
        f1: function (_o1) {
            _o1.add(Tokenizer.TokenType.Identifier, Parser.ParserSpecification.CreateVariableParselet());
            _o1.add(Tokenizer.TokenType.Decimal, Parser.ParserSpecification.CreateFloatingPointNumberParselet());
            _o1.add(Tokenizer.TokenType.Integer, Parser.ParserSpecification.CreateIntegerParselet());
            _o1.add(Tokenizer.TokenType.LeftParenthesis, Parser.ParserSpecification.CreateGroupParselet());
            _o1.add(Tokenizer.TokenType.Minus, Parser.ParserSpecification.CreatePrefixOperatorParselet(Parser.PrefixExpressionType.Negation));
            _o1.add(Tokenizer.TokenType.Plus, Parser.ParserSpecification.CreatePrefixOperatorParselet(Parser.PrefixExpressionType.Positive));
            return _o1;
        },
        f2: function (_o2) {
            _o2.add(Tokenizer.TokenType.Exclamation, Parser.ParserSpecification.CreatePostfixOperatorParselet(Parser.PostfixExpressionType.Factorial, Parser.Precedences.POSTFIX));
            _o2.add(Tokenizer.TokenType.Assignment, Parser.ParserSpecification.CreateAssignParselet());
            _o2.add(Tokenizer.TokenType.Equal, Parser.ParserSpecification.CreateBinaryOperatorParselet(Parser.BinaryExpressionType.Equal, Parser.Precedences.COMPARISON, Parser.Associativity.Left));
            _o2.add(Tokenizer.TokenType.NotEqual, Parser.ParserSpecification.CreateBinaryOperatorParselet(Parser.BinaryExpressionType.NotEqual, Parser.Precedences.COMPARISON, Parser.Associativity.Left));
            _o2.add(Tokenizer.TokenType.Less, Parser.ParserSpecification.CreateBinaryOperatorParselet(Parser.BinaryExpressionType.Less, Parser.Precedences.COMPARISON, Parser.Associativity.Left));
            _o2.add(Tokenizer.TokenType.Greater, Parser.ParserSpecification.CreateBinaryOperatorParselet(Parser.BinaryExpressionType.Greater, Parser.Precedences.COMPARISON, Parser.Associativity.Left));
            _o2.add(Tokenizer.TokenType.LessOrEqual, Parser.ParserSpecification.CreateBinaryOperatorParselet(Parser.BinaryExpressionType.LessOrEqual, Parser.Precedences.COMPARISON, Parser.Associativity.Left));
            _o2.add(Tokenizer.TokenType.GreaterOrEqual, Parser.ParserSpecification.CreateBinaryOperatorParselet(Parser.BinaryExpressionType.GreaterOrEqual, Parser.Precedences.COMPARISON, Parser.Associativity.Left));
            _o2.add(Tokenizer.TokenType.QuestionMark, Parser.ParserSpecification.CreateTernaryParselet());
            _o2.add(Tokenizer.TokenType.LeftParenthesis, Parser.ParserSpecification.CreateCallParselet());
            _o2.add(Tokenizer.TokenType.Plus, Parser.ParserSpecification.CreateBinaryOperatorParselet(Parser.BinaryExpressionType.Addition, Parser.Precedences.SUM, Parser.Associativity.Left));
            _o2.add(Tokenizer.TokenType.Minus, Parser.ParserSpecification.CreateBinaryOperatorParselet(Parser.BinaryExpressionType.Substraction, Parser.Precedences.SUM, Parser.Associativity.Left));
            _o2.add(Tokenizer.TokenType.Star, Parser.ParserSpecification.CreateBinaryOperatorParselet(Parser.BinaryExpressionType.Multiplication, Parser.Precedences.PRODUCT, Parser.Associativity.Left));
            _o2.add(Tokenizer.TokenType.Slash, Parser.ParserSpecification.CreateBinaryOperatorParselet(Parser.BinaryExpressionType.Division, Parser.Precedences.PRODUCT, Parser.Associativity.Left));
            _o2.add(Tokenizer.TokenType.Pow, Parser.ParserSpecification.CreateBinaryOperatorParselet(Parser.BinaryExpressionType.Power, Parser.Precedences.EXPONENT, Parser.Associativity.Right));
            _o2.add(Tokenizer.TokenType.Percent, Parser.ParserSpecification.CreateBinaryOperatorParselet(Parser.BinaryExpressionType.Modulo, Parser.Precedences.PRODUCT, Parser.Associativity.Left));
            return _o2;
        },
        f3: function (argument) {
            return (Bridge.as(argument, Parser.VariableExpression));
        },
        f4: function (arg) {
            return arg != null;
        },
        f5: function (argument) {
            return argument.Identifier;
        },
        f6: function (parseExpression, tokenStream, leftExpression) {
            var rightExpression = parseExpression(tokenStream, ((Parser.Precedences.ASSIGNMENT + Parser.AssociativityExtensions.ToPrecedenceIncrement(Parser.Associativity.Right)) | 0));
            if (Bridge.is(leftExpression, Parser.VariableExpression)) {
                var identifier = Bridge.cast(leftExpression, Parser.VariableExpression).Identifier;
                return new Parser.VariableAssignmentExpression(identifier, rightExpression);
            } else if (Bridge.is(leftExpression, Parser.CallExpression)) {
                var callExpression = Bridge.cast(leftExpression, Parser.CallExpression);
                var $arguments = System.Linq.Enumerable.from(callExpression.Arguments).select($asm.$.Parser.ParserSpecification.f3);
                var functionExpression = Bridge.as(callExpression.FunctionExpression, Parser.VariableExpression);
                if (System.Linq.Enumerable.from($arguments).all($asm.$.Parser.ParserSpecification.f4) && functionExpression != null) {
                    return new Parser.FunctionAssignmentExpression(functionExpression.Identifier, System.Linq.Enumerable.from($arguments).select($asm.$.Parser.ParserSpecification.f5), rightExpression);
                } else {
                    throw new Parser.BadAssignmentException.$ctor1("Every argument in a function assignment must be a variable name.");
                }
            }

            throw new Parser.BadAssignmentException.$ctor1("The left hand side of an assignment must either be a function signature or a variable name.");
        },
        f7: function (parseExpression, tokenStream, leftExpression) {
            var trueExpression = parseExpression(tokenStream, 0);
            tokenStream.Consume$1(Tokenizer.TokenType.Colon);
            var falseExpression = parseExpression(tokenStream, ((Parser.Precedences.CONDITIONAL + Parser.AssociativityExtensions.ToPrecedenceIncrement(Parser.Associativity.Right)) | 0));
            return new Parser.TernaryExpression(leftExpression, trueExpression, falseExpression);
        },
        f8: function (parseExpression, tokenStream, leftExpression) {
            var $arguments = new (System.Collections.Generic.List$1(Parser.IExpression)).ctor();
            if (!tokenStream.Match(Tokenizer.TokenType.RightParenthesis)) {
                do {
                    $arguments.add(parseExpression(tokenStream, 0));
                } while (tokenStream.Match(Tokenizer.TokenType.Comma));
                tokenStream.Consume$1(Tokenizer.TokenType.RightParenthesis);
            }

            return new Parser.CallExpression(leftExpression, $arguments);
        },
        f9: function (parseExpression, tokenStream, token) {
            return new Parser.VariableExpression(Parser.Identifier.op_Implicit(token.Content));
        },
        f10: function (parseExpression, tokenStream, token) {
            var result = System.Double.parse(token.Content);
            return new Parser.ValueExpression(Parser.Value.Decimal(result));
        },
        f11: function (parseExpression, tokenStream, token) {
            var result = System.Int64.parse(token.Content);
            return new Parser.ValueExpression(Parser.Value.Integer(result));
        },
        f12: function (parseExpression, tokenStream, token) {
            var expression = parseExpression(tokenStream, 0);
            tokenStream.Consume$1(Tokenizer.TokenType.RightParenthesis);
            return new Parser.GroupExpression(expression);
        }
    });

    Bridge.define("Parser.PostfixExpressionType", {
        $kind: "enum",
        statics: {
            fields: {
                Factorial: 0
            }
        }
    });

    Bridge.define("Parser.Precedences", {
        statics: {
            fields: {
                EXPRESSION: 0,
                ASSIGNMENT: 0,
                CONDITIONAL: 0,
                COMPARISON: 0,
                SUM: 0,
                PRODUCT: 0,
                PREFIX: 0,
                EXPONENT: 0,
                POSTFIX: 0,
                CALL: 0
            },
            ctors: {
                init: function () {
                    this.EXPRESSION = 0;
                    this.ASSIGNMENT = 1;
                    this.CONDITIONAL = 2;
                    this.COMPARISON = 3;
                    this.SUM = 4;
                    this.PRODUCT = 5;
                    this.PREFIX = 6;
                    this.EXPONENT = 7;
                    this.POSTFIX = 8;
                    this.CALL = 9;
                }
            }
        }
    });

    Bridge.define("Parser.PrefixExpressionType", {
        $kind: "enum",
        statics: {
            fields: {
                Negation: 0,
                Positive: 1
            }
        }
    });

    Bridge.define("Parser.SymbolManagerExtensions", {
        statics: {
            methods: {
                SetInteger: function (symbolManager, identifier, l) {
                    symbolManager.Parser$ISymbolManager$Set(identifier, Parser.Value.Integer(l));
                },
                SetDecimal: function (symbolManager, identifier, d) {
                    symbolManager.Parser$ISymbolManager$Set(identifier, Parser.Value.Decimal(d));
                },
                SetBoolean: function (symbolManager, identifier, b) {
                    symbolManager.Parser$ISymbolManager$Set(identifier, Parser.Value.Boolean(b));
                },
                SetFunction: function (symbolManager, identifier, $function) {
                    symbolManager.Parser$ISymbolManager$Set(identifier, Parser.Value.Function($function));
                }
            }
        }
    });

    Bridge.define("Parser.TokenStream", {
        inherits: [System.IDisposable],
        fields: {
            _tokenEnumerator: null,
            _isEnumeratorAhead: false
        },
        alias: ["Dispose", "System$IDisposable$Dispose"],
        ctors: {
            ctor: function (tokens) {
                this.$initialize();
                this._tokenEnumerator = Bridge.getEnumerator(tokens, Tokenizer.Token);
            }
        },
        methods: {
            Consume: function () {
                if (this._isEnumeratorAhead) {
                    this._isEnumeratorAhead = false;
                } else {
                    this._tokenEnumerator.System$Collections$IEnumerator$moveNext();
                }

                return this._tokenEnumerator[Bridge.geti(this._tokenEnumerator, "System$Collections$Generic$IEnumerator$1$Tokenizer$Token$Current$1", "System$Collections$Generic$IEnumerator$1$Current$1")];
            },
            Consume$1: function (expectedTokenType) {
                var nextToken = this.Peek();

                if (nextToken.TokenType !== expectedTokenType) {
                    throw new Parser.ExpectedTokenException.$ctor3(expectedTokenType, nextToken.Position);
                }

                return this.Consume();
            },
            Peek: function () {
                if (!this._isEnumeratorAhead) {
                    this._tokenEnumerator.System$Collections$IEnumerator$moveNext();
                    this._isEnumeratorAhead = true;
                }

                return this._tokenEnumerator[Bridge.geti(this._tokenEnumerator, "System$Collections$Generic$IEnumerator$1$Tokenizer$Token$Current$1", "System$Collections$Generic$IEnumerator$1$Current$1")];
            },
            Match: function (expectedTokenType) {
                var nextToken = this.Peek();
                var isTokenTypeEqual = (nextToken.TokenType === expectedTokenType);

                if (isTokenTypeEqual) {
                    this.Consume();
                }

                return isTokenTypeEqual;
            },
            Dispose: function () {
                this._tokenEnumerator.System$IDisposable$Dispose();
            }
        }
    });

    Bridge.define("Parser.Traversal", {
        $kind: "enum",
        statics: {
            fields: {
                None: 0,
                BottomUp: 1
            }
        }
    });

    Bridge.define("Parser.TrigonometrySymbols", {
        statics: {
            methods: {
                SetTrigonometrySymbols: function (symbolManager) {
                    Parser.TrigonometrySymbols.Define(symbolManager, "sin", Math.sin);
                    Parser.TrigonometrySymbols.Define(symbolManager, "cos", Math.cos);
                    Parser.TrigonometrySymbols.Define(symbolManager, "tan", Math.tan);
                },
                Define: function (symbolManager, symbolName, method) {
                    var $function = function ($arguments) {
                        if ($arguments.length === 1) {
                            var isNumber = $arguments[System.Array.index(0, $arguments)].IsInteger || $arguments[System.Array.index(0, $arguments)].IsDecimal;

                            if (isNumber) {
                                var x = $arguments[System.Array.index(0, $arguments)].ToDouble();

                                return Parser.Value.Decimal(method(x));
                            }
                        }

                        var message = System.String.format("Function {0} expects exactly one argument of type number. Given {1} arguments.", symbolName, Bridge.box($arguments.length, System.Int32));
                        throw new Parser.EvaluationException.$ctor1(message);
                    };

                    symbolManager.Parser$ISymbolManager$Set(Parser.Identifier.op_Implicit(symbolName), Parser.Value.Function($function));
                }
            }
        }
    });

    Bridge.define("Parser.Value", {
        statics: {
            methods: {
                Integer: function (l) {
                    return new Parser.Value(Parser.Value.Type.Integer, l);
                },
                Decimal: function (d) {
                    return new Parser.Value(Parser.Value.Type.Decimal, Bridge.box(d, System.Double, System.Double.format, System.Double.getHashCode));
                },
                Boolean: function (b) {
                    return new Parser.Value(Parser.Value.Type.Boolean, Bridge.box(b, System.Boolean, System.Boolean.toString));
                },
                Function: function ($function) {
                    return new Parser.Value(Parser.Value.Type.Function, $function);
                },
                Empty: function () {
                    return new Parser.Value(Parser.Value.Type.Empty, null);
                },
                Expression: function (expression) {
                    return new Parser.Value(Parser.Value.Type.Expression, expression);
                },
                Add: function (valueA, valueB) {
                    if (valueA.IsInteger && valueB.IsInteger) {
                        var a = valueA.ToInt64();
                        var b = valueB.ToInt64();
                        return Parser.Value.Integer(a.add(b));
                    }

                    var isNumberA = valueA.IsDecimal || valueA.IsInteger;
                    var isNumberB = valueB.IsDecimal || valueB.IsInteger;

                    if (isNumberA && isNumberB) {
                        var a1 = valueA.ToDouble();
                        var b1 = valueB.ToDouble();
                        return Parser.Value.Decimal(a1 + b1);
                    }

                    if (valueA.IsExpression || valueB.IsExpression) {
                        var a2 = new Parser.ValueExpression(valueA);
                        var b2 = new Parser.ValueExpression(valueB);
                        var result = new Parser.BinaryExpression(Parser.BinaryExpressionType.Addition, a2, b2);
                        return Parser.Value.Expression(new Parser.Expression(result));
                    }

                    var message = System.String.format("Incompatible types of operands {0} and {1} for binary operation {2}.", Bridge.box(valueA.ValueType, Parser.Value.Type, System.Enum.toStringFn(Parser.Value.Type)), Bridge.box(valueB.ValueType, Parser.Value.Type, System.Enum.toStringFn(Parser.Value.Type)), Bridge.box(Parser.BinaryExpressionType.Addition, Parser.BinaryExpressionType, System.Enum.toStringFn(Parser.BinaryExpressionType)));
                    throw new Parser.EvaluationException.$ctor1(message);
                }
            }
        },
        fields: {
            _value: null
        },
        props: {
            ValueType: 0,
            IsEmpty: {
                get: function () {
                    return this.ValueType === Parser.Value.Type.Empty;
                }
            },
            IsExpression: {
                get: function () {
                    return this.ValueType === Parser.Value.Type.Expression;
                }
            },
            IsInteger: {
                get: function () {
                    return this.ValueType === Parser.Value.Type.Integer;
                }
            },
            IsDecimal: {
                get: function () {
                    return this.ValueType === Parser.Value.Type.Decimal;
                }
            },
            IsBoolean: {
                get: function () {
                    return this.ValueType === Parser.Value.Type.Boolean;
                }
            },
            IsFunction: {
                get: function () {
                    return this.ValueType === Parser.Value.Type.Function;
                }
            }
        },
        ctors: {
            ctor: function (valueType, value) {
                this.$initialize();
                this.ValueType = valueType;
                this._value = value;
            }
        },
        methods: {
            ToInt64: function () {
                return System.Convert.toInt64(this._value);
            },
            ToDouble: function () {
                return System.Convert.toDouble(this._value);
            },
            ToBoolean: function () {
                return System.Convert.toBoolean(this._value);
            },
            ToFunction: function () {
                return this._value;
            },
            ToExpression: function () {
                return Bridge.cast(this._value, Parser.Expression);
            },
            toString: function () {
                return Bridge.toString(this._value);
            }
        }
    });

    Bridge.define("Parser.Value.Type", {
        $kind: "nested enum",
        statics: {
            fields: {
                Empty: 0,
                Integer: 1,
                Decimal: 2,
                Boolean: 3,
                Function: 4,
                Expression: 5
            }
        }
    });

    Bridge.define("Parser.BottomUpExpressionVisitor", {
        inherits: [Parser.IExpressionVisitor],
        props: {
            Traversal: {
                get: function () {
                    return Parser.Traversal.BottomUp;
                }
            }
        },
        alias: [
            "Traversal", "Parser$IExpressionVisitor$Traversal",
            "Visit$4", "Parser$IExpressionVisitor$Visit$4",
            "Visit$1", "Parser$IExpressionVisitor$Visit$1",
            "Visit$8", "Parser$IExpressionVisitor$Visit$8",
            "Visit$3", "Parser$IExpressionVisitor$Visit$3",
            "Visit$2", "Parser$IExpressionVisitor$Visit$2",
            "Visit$6", "Parser$IExpressionVisitor$Visit$6",
            "Visit$9", "Parser$IExpressionVisitor$Visit$9",
            "Visit$7", "Parser$IExpressionVisitor$Visit$7",
            "Visit$5", "Parser$IExpressionVisitor$Visit$5",
            "Visit", "Parser$IExpressionVisitor$Visit"
        ],
        methods: {
            Visit$4: function (postfixExpression) { },
            Visit$1: function (functionExpression) { },
            Visit$8: function (variableAssignmentExpression) { },
            Visit$3: function (groupExpression) { },
            Visit$2: function (functionAssignmentExpression) { },
            Visit$6: function (ternaryExpression) { },
            Visit$9: function (variableExpression) { },
            Visit$7: function (valueExpression) { },
            Visit$5: function (prefixExpression) { },
            Visit: function (binaryExpression) { }
        }
    });

    Bridge.define("Parser.BadAssignmentException", {
        inherits: [Parser.ParserException],
        ctors: {
            ctor: function () {
                this.$initialize();
                Parser.ParserException.ctor.call(this);
            },
            $ctor1: function (message) {
                this.$initialize();
                Parser.ParserException.$ctor1.call(this, message);
            },
            $ctor2: function (message, innerException) {
                this.$initialize();
                Parser.ParserException.$ctor2.call(this, message, innerException);
            }
        }
    });

    Bridge.define("Parser.BinaryExpression", {
        inherits: [Parser.IExpression],
        props: {
            BinaryExpressionType: 0,
            LeftOperand: null,
            RightOperand: null
        },
        alias: ["Accept", "Parser$IExpression$Accept"],
        ctors: {
            ctor: function (binaryExpressionType, leftOperand, rightOperand) {
                this.$initialize();
                this.BinaryExpressionType = binaryExpressionType;
                this.LeftOperand = leftOperand;
                this.RightOperand = rightOperand;
            }
        },
        methods: {
            Accept: function (visitor) {
                Parser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.Parser$IExpressionVisitor$Visit(this);
                }), [this.LeftOperand, this.RightOperand]);
            }
        }
    });

    Bridge.define("Parser.CallExpression", {
        inherits: [Parser.IExpression],
        props: {
            FunctionExpression: null,
            Arguments: null
        },
        alias: ["Accept", "Parser$IExpression$Accept"],
        ctors: {
            ctor: function (functionExpression, $arguments) {
                this.$initialize();
                this.FunctionExpression = functionExpression;
                this.Arguments = System.Linq.Enumerable.from($arguments).ToArray();
            }
        },
        methods: {
            Accept: function (visitor) {
                var children = System.Linq.Enumerable.from(System.Array.init([this.FunctionExpression], Parser.IExpression)).concat(this.Arguments).ToArray(Parser.IExpression);
                Parser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.Parser$IExpressionVisitor$Visit$1(this);
                }), children);
            }
        }
    });

    Bridge.define("Parser.EvaluationVisitor", {
        inherits: [Parser.IExpressionVisitor],
        fields: {
            _symbolManager: null,
            _evaluationStack: null
        },
        props: {
            Traversal: {
                get: function () {
                    return Parser.Traversal.None;
                }
            }
        },
        alias: [
            "Traversal", "Parser$IExpressionVisitor$Traversal",
            "Visit", "Parser$IExpressionVisitor$Visit",
            "Visit$5", "Parser$IExpressionVisitor$Visit$5",
            "Visit$7", "Parser$IExpressionVisitor$Visit$7",
            "Visit$1", "Parser$IExpressionVisitor$Visit$1",
            "Visit$6", "Parser$IExpressionVisitor$Visit$6",
            "Visit$9", "Parser$IExpressionVisitor$Visit$9",
            "Visit$4", "Parser$IExpressionVisitor$Visit$4",
            "Visit$3", "Parser$IExpressionVisitor$Visit$3",
            "Visit$8", "Parser$IExpressionVisitor$Visit$8",
            "Visit$2", "Parser$IExpressionVisitor$Visit$2"
        ],
        ctors: {
            ctor: function (symbolManager) {
                this.$initialize();
                this._symbolManager = symbolManager;
                this._evaluationStack = new (System.Collections.Generic.Stack$1(Parser.Value)).ctor();
            }
        },
        methods: {
            GetResult: function () {
                if (this._evaluationStack.Count === 1) {
                    return this._evaluationStack.Pop();
                } else {
                    throw new Parser.EvaluationException.$ctor1("Evaluation stack still contains " + this._evaluationStack.Count + " values. It should contain exactly one value.");
                }
            },
            Visit: function (binaryExpression) {
                binaryExpression.LeftOperand.Parser$IExpression$Accept(this);
                binaryExpression.RightOperand.Parser$IExpression$Accept(this);

                var rightOperand = this._evaluationStack.Pop();
                var leftOperand = this._evaluationStack.Pop();
                var isNumberLeft = leftOperand.IsDecimal || leftOperand.IsInteger;
                var isNumberRight = rightOperand.IsDecimal || rightOperand.IsInteger;

                switch (binaryExpression.BinaryExpressionType) {
                    case Parser.BinaryExpressionType.Addition: 
                        var result = Parser.Value.Add(leftOperand, rightOperand);
                        this._evaluationStack.Push(result);
                        return;
                }

                if (isNumberLeft && isNumberRight) {
                    var leftValue = leftOperand.ToDouble();
                    var rightValue = rightOperand.ToDouble();
                    var result1;

                    switch (binaryExpression.BinaryExpressionType) {
                        case Parser.BinaryExpressionType.Substraction: 
                            result1 = Parser.Value.Decimal(leftValue - rightValue);
                            break;
                        case Parser.BinaryExpressionType.Multiplication: 
                            result1 = Parser.Value.Decimal(leftValue * rightValue);
                            break;
                        case Parser.BinaryExpressionType.Division: 
                            result1 = Parser.Value.Decimal(leftValue / rightValue);
                            break;
                        case Parser.BinaryExpressionType.Power: 
                            result1 = Parser.Value.Decimal(Math.pow(leftValue, rightValue));
                            break;
                        case Parser.BinaryExpressionType.Modulo: 
                            result1 = Parser.Value.Decimal(leftValue % rightValue);
                            break;
                        case Parser.BinaryExpressionType.Equal: 
                            result1 = Parser.Value.Boolean(leftValue === rightValue);
                            break;
                        case Parser.BinaryExpressionType.NotEqual: 
                            result1 = Parser.Value.Boolean(leftValue !== rightValue);
                            break;
                        case Parser.BinaryExpressionType.Less: 
                            result1 = Parser.Value.Boolean(leftValue < rightValue);
                            break;
                        case Parser.BinaryExpressionType.LessOrEqual: 
                            result1 = Parser.Value.Boolean(leftValue <= rightValue);
                            break;
                        case Parser.BinaryExpressionType.Greater: 
                            result1 = Parser.Value.Boolean(leftValue > rightValue);
                            break;
                        case Parser.BinaryExpressionType.GreaterOrEqual: 
                            result1 = Parser.Value.Boolean(leftValue >= rightValue);
                            break;
                        default: 
                            var message = System.String.format("Unhandled binary operation {0}.", [Bridge.box(binaryExpression.BinaryExpressionType, Parser.BinaryExpressionType, System.Enum.toStringFn(Parser.BinaryExpressionType))]);
                            throw new Parser.EvaluationException.$ctor1(message);
                    }

                    // TODO integer operations
                    this._evaluationStack.Push(result1);
                } else {
                    var message1 = System.String.format("Incompatible types of operands {0} and {1} for binary operation {2}.", leftOperand, rightOperand, Bridge.box(binaryExpression.BinaryExpressionType, Parser.BinaryExpressionType, System.Enum.toStringFn(Parser.BinaryExpressionType)));
                    throw new Parser.EvaluationException.$ctor1(message1);
                }
            },
            Visit$5: function (prefixExpression) {
                prefixExpression.RightOperand.Parser$IExpression$Accept(this);

                var operand = this._evaluationStack.Pop();

                if (operand.IsInteger || operand.IsDecimal) {
                    var value = operand.ToDouble();
                    var result;

                    switch (prefixExpression.PrefixExpressionType) {
                        case Parser.PrefixExpressionType.Negation: 
                            result = -value;
                            break;
                        default: 
                            var message = System.String.format("Unhandled prefix operation {0}.", [Bridge.box(prefixExpression.PrefixExpressionType, Parser.PrefixExpressionType, System.Enum.toStringFn(Parser.PrefixExpressionType))]);
                            throw new Parser.EvaluationException.$ctor1(message);
                    }

                    this._evaluationStack.Push(Parser.Value.Decimal(result));
                } else {
                    var message1 = System.String.format("Unable to execute prefix operation {0} for operand {1}.", Bridge.box(prefixExpression.PrefixExpressionType, Parser.PrefixExpressionType, System.Enum.toStringFn(Parser.PrefixExpressionType)), operand);
                    throw new Parser.EvaluationException.$ctor1(message1);
                }
            },
            Visit$7: function (valueExpression) {
                if (valueExpression.Value.IsExpression) {
                    valueExpression.Value.ToExpression().Expr.Parser$IExpression$Accept(this);
                } else {
                    this._evaluationStack.Push(valueExpression.Value);
                }
            },
            Visit$1: function (functionExpression) {
                var $t;
                functionExpression.FunctionExpression.Parser$IExpression$Accept(this);

                $t = Bridge.getEnumerator(functionExpression.Arguments, Parser.IExpression);
                try {
                    while ($t.moveNext()) {
                        var argument = $t.Current;
                        argument.Parser$IExpression$Accept(this);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                var numArguments = System.Linq.Enumerable.from(functionExpression.Arguments).count();

                var $arguments = new (System.Collections.Generic.List$1(Parser.Value)).ctor();

                for (var i = 0; i < numArguments; i = (i + 1) | 0) {
                    $arguments.add(this._evaluationStack.Pop());
                }
                $arguments.Reverse();

                var $function = this._evaluationStack.Pop();

                if ($function.IsFunction) {

                    var result = $function.ToFunction()($arguments.ToArray());
                    this._evaluationStack.Push(result);
                } else {
                    throw new Parser.EvaluationException.$ctor1("Invalid function call with " + numArguments + " arguments.");
                }
            },
            Visit$6: function (ternaryExpression) {
                ternaryExpression.Condition.Parser$IExpression$Accept(this);
                var conditionOperand = this._evaluationStack.Pop();

                if (conditionOperand.IsBoolean) {
                    var condition = conditionOperand.ToBoolean();

                    if (condition) {
                        ternaryExpression.TrueCase.Parser$IExpression$Accept(this);
                    } else {
                        ternaryExpression.FalseCase.Parser$IExpression$Accept(this);
                    }
                } else {
                    var message = System.String.format(System.String.concat("Condition in ternary operation must be boolean, got ", conditionOperand) + " instead.", null);
                    throw new Parser.EvaluationException.$ctor1(message);
                }
            },
            Visit$9: function (variableExpression) {
                if (this._symbolManager != null && this._symbolManager.Parser$ISymbolManager$IsSet(variableExpression.Identifier)) {
                    // TODO decide whether this is good or not , do we want to evaluate like that?!
                    var value = this._symbolManager.Parser$ISymbolManager$Get(variableExpression.Identifier);

                    if (value.IsExpression) {
                        value.ToExpression().Expr.Parser$IExpression$Accept(this);
                    } else {
                        this._evaluationStack.Push(value);
                    }
                } else {
                    this._evaluationStack.Push(Parser.Value.Expression(new Parser.Expression(variableExpression)));
                }
            },
            Visit$4: function (postfixExpression) {
                postfixExpression.LeftOperand.Parser$IExpression$Accept(this);

                var operand = this._evaluationStack.Pop();

                if (operand.IsInteger) {
                    var value = operand;
                    var result;

                    switch (postfixExpression.PostfixExpressionType) {
                        case Parser.PostfixExpressionType.Factorial: 
                            var res = System.Int64(1);
                            var val = value.ToInt64();
                            if (val.gt(System.Int64(0))) {
                                while (val.ne(System.Int64(1))) {
                                    res = res.mul(val);
                                    val = val.sub(System.Int64(1));
                                }
                            }
                            result = Parser.Value.Integer(res);
                            break;
                        default: 
                            var message = System.String.format("Unhandled postfix operation {0}.", [Bridge.box(postfixExpression.PostfixExpressionType, Parser.PostfixExpressionType, System.Enum.toStringFn(Parser.PostfixExpressionType))]);
                            throw new Parser.EvaluationException.$ctor1(message);
                    }

                    this._evaluationStack.Push(result);
                } else {
                    var message1 = System.String.format("Unable to execute postfix operation {0} for operand {1}.", Bridge.box(postfixExpression.PostfixExpressionType, Parser.PostfixExpressionType, System.Enum.toStringFn(Parser.PostfixExpressionType)), operand);
                    throw new Parser.EvaluationException.$ctor1(message1);
                }
            },
            Visit$3: function (groupExpression) {
                groupExpression.Operand.Parser$IExpression$Accept(this);
            },
            Visit$8: function (variableAssignmentExpression) {
                variableAssignmentExpression.Expression.Parser$IExpression$Accept(this);
            },
            Visit$2: function (functionAssignmentExpression) {
                var value = Parser.AssignVisitor.GetFunction(functionAssignmentExpression, this._symbolManager);
                this._evaluationStack.Push(value);
            }
        }
    });

    Bridge.define("Parser.ExpectedTokenException", {
        inherits: [Parser.ParserException],
        props: {
            TokenType: 0,
            Position: 0
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                Parser.ParserException.ctor.call(this);
            },
            $ctor1: function (message) {
                this.$initialize();
                Parser.ParserException.$ctor1.call(this, message);
            },
            $ctor2: function (message, innerException) {
                this.$initialize();
                Parser.ParserException.$ctor2.call(this, message, innerException);
            },
            $ctor3: function (tokenType, position) {
                this.$initialize();
                Parser.ParserException.$ctor1.call(this, "Expected token " + System.Enum.toString(Tokenizer.TokenType, tokenType) + " at position " + position);
                this.TokenType = tokenType;
                this.Position = position;
            }
        }
    });

    Bridge.define("Parser.FunctionAssignmentExpression", {
        inherits: [Parser.IExpression],
        props: {
            FunctionIdentifier: null,
            ArgumentNames: null,
            Expression: null
        },
        alias: ["Accept", "Parser$IExpression$Accept"],
        ctors: {
            ctor: function (functionIdentifier, $arguments, expression) {
                this.$initialize();
                this.FunctionIdentifier = functionIdentifier;
                this.Expression = expression;
                this.ArgumentNames = System.Linq.Enumerable.from($arguments).ToArray();
            }
        },
        methods: {
            Accept: function (visitor) {
                Parser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.Parser$IExpressionVisitor$Visit$2(this);
                }), [this.Expression]);
            }
        }
    });

    Bridge.define("Parser.GroupExpression", {
        inherits: [Parser.IExpression],
        props: {
            Operand: null
        },
        alias: ["Accept", "Parser$IExpression$Accept"],
        ctors: {
            ctor: function (operand) {
                this.$initialize();
                this.Operand = operand;
            }
        },
        methods: {
            Accept: function (visitor) {
                Parser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.Parser$IExpressionVisitor$Visit$3(this);
                }), [this.Operand]);
            }
        }
    });

    Bridge.define("Parser.PostfixExpression", {
        inherits: [Parser.IExpression],
        props: {
            PostfixExpressionType: 0,
            LeftOperand: null
        },
        alias: ["Accept", "Parser$IExpression$Accept"],
        ctors: {
            ctor: function (postfixExpressionType, leftOperand) {
                this.$initialize();
                this.PostfixExpressionType = postfixExpressionType;
                this.LeftOperand = leftOperand;
            }
        },
        methods: {
            Accept: function (visitor) {
                Parser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.Parser$IExpressionVisitor$Visit$4(this);
                }), [this.LeftOperand]);
            }
        }
    });

    Bridge.define("Parser.PrefixExpression", {
        inherits: [Parser.IExpression],
        props: {
            PrefixExpressionType: 0,
            RightOperand: null
        },
        alias: ["Accept", "Parser$IExpression$Accept"],
        ctors: {
            ctor: function (prefixExpressionType, rightOperand) {
                this.$initialize();
                this.PrefixExpressionType = prefixExpressionType;
                this.RightOperand = rightOperand;
            }
        },
        methods: {
            Accept: function (visitor) {
                Parser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.Parser$IExpressionVisitor$Visit$5(this);
                }), [this.RightOperand]);
            }
        }
    });

    Bridge.define("Parser.SymbolicExpression", {
        inherits: [Parser.IExpression],
        props: {
            Operand: null
        },
        alias: ["Accept", "Parser$IExpression$Accept"],
        ctors: {
            ctor: function (operand) {
                this.$initialize();
                this.Operand = operand;
            }
        },
        methods: {
            Accept: function (visitor) {
                //TODO
                //visitor.Traverse(() => visitor.Visit(this), Operand);
            }
        }
    });

    Bridge.define("Parser.SymbolManager", {
        inherits: [Parser.ISymbolManager],
        fields: {
            _symbols: null
        },
        alias: [
            "IsSet", "Parser$ISymbolManager$IsSet",
            "Get", "Parser$ISymbolManager$Get",
            "Set", "Parser$ISymbolManager$Set"
        ],
        ctors: {
            init: function () {
                this._symbols = new (System.Collections.Generic.Dictionary$2(Parser.Identifier,Parser.Value))();
            }
        },
        methods: {
            IsSet: function (identifier) {
                return this._symbols.containsKey(identifier);
            },
            Get: function (identifier) {
                return this._symbols.get(identifier);
            },
            Set: function (identifier, value) {
                this._symbols.set(identifier, value);
            }
        }
    });

    Bridge.define("Parser.TernaryExpression", {
        inherits: [Parser.IExpression],
        props: {
            Condition: null,
            TrueCase: null,
            FalseCase: null
        },
        alias: ["Accept", "Parser$IExpression$Accept"],
        ctors: {
            ctor: function (condition, trueCase, falseCase) {
                this.$initialize();
                this.Condition = condition;
                this.TrueCase = trueCase;
                this.FalseCase = falseCase;
            }
        },
        methods: {
            Accept: function (visitor) {
                Parser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.Parser$IExpressionVisitor$Visit$6(this);
                }), [this.Condition, this.TrueCase, this.FalseCase]);
            }
        }
    });

    Bridge.define("Parser.UnknownVariableException", {
        inherits: [Parser.ParserException],
        ctors: {
            ctor: function () {
                this.$initialize();
                Parser.ParserException.ctor.call(this);
            },
            $ctor1: function (message) {
                this.$initialize();
                Parser.ParserException.$ctor1.call(this, message);
            },
            $ctor2: function (message, innerException) {
                this.$initialize();
                Parser.ParserException.$ctor2.call(this, message, innerException);
            }
        }
    });

    Bridge.define("Parser.ValueExpression", {
        inherits: [Parser.IExpression],
        props: {
            Value: null
        },
        alias: ["Accept", "Parser$IExpression$Accept"],
        ctors: {
            ctor: function (value) {
                this.$initialize();
                this.Value = value;
            }
        },
        methods: {
            Accept: function (visitor) {
                if (this.Value.IsExpression) {
                    Parser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                        visitor.Parser$IExpressionVisitor$Visit$7(this);
                    }), [this.Value.ToExpression().Expr]);
                } else {
                    Parser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                        visitor.Parser$IExpressionVisitor$Visit$7(this);
                    }));
                }
            }
        }
    });

    Bridge.define("Parser.VariableAssignmentExpression", {
        inherits: [Parser.IExpression],
        props: {
            Identifier: null,
            Expression: null
        },
        alias: ["Accept", "Parser$IExpression$Accept"],
        ctors: {
            ctor: function (identifier, expression) {
                this.$initialize();
                this.Identifier = identifier;
                this.Expression = expression;
            }
        },
        methods: {
            Accept: function (visitor) {
                Parser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.Parser$IExpressionVisitor$Visit$8(this);
                }), [this.Expression]);
            }
        }
    });

    Bridge.define("Parser.VariableExpression", {
        inherits: [Parser.IExpression],
        props: {
            Identifier: null
        },
        alias: ["Accept", "Parser$IExpression$Accept"],
        ctors: {
            ctor: function (identifier) {
                this.$initialize();
                this.Identifier = identifier;
            }
        },
        methods: {
            Accept: function (visitor) {
                Parser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.Parser$IExpressionVisitor$Visit$9(this);
                }));
            }
        }
    });

    Bridge.define("Parser.AssignVisitor", {
        inherits: [Parser.BottomUpExpressionVisitor],
        statics: {
            methods: {
                GetFunction: function (functionAssignmentExpression, symbolManager) {
                    return Parser.Value.Function(function (args) {
                        var fExpEvaluationVisitor = new Parser.FunctionExpressionVisitor(functionAssignmentExpression.ArgumentNames, args, symbolManager);
                        functionAssignmentExpression.Expression.Parser$IExpression$Accept(fExpEvaluationVisitor);
                        return fExpEvaluationVisitor.GetResult();
                    });
                }
            }
        },
        fields: {
            _symbolManager: null
        },
        alias: [
            "Visit$8", "Parser$IExpressionVisitor$Visit$8",
            "Visit$2", "Parser$IExpressionVisitor$Visit$2"
        ],
        ctors: {
            ctor: function (symbolManager) {
                this.$initialize();
                Parser.BottomUpExpressionVisitor.ctor.call(this);
                this._symbolManager = symbolManager;
            }
        },
        methods: {
            Visit$8: function (variableAssignmentExpression) {
                var evaluationVisitor = new Parser.EvaluationVisitor(this._symbolManager);
                variableAssignmentExpression.Expression.Parser$IExpression$Accept(evaluationVisitor);

                this._symbolManager.Parser$ISymbolManager$Set(variableAssignmentExpression.Identifier, evaluationVisitor.GetResult());
            },
            Visit$2: function (functionAssignmentExpression) {
                this._symbolManager.Parser$ISymbolManager$Set(functionAssignmentExpression.FunctionIdentifier, Parser.AssignVisitor.GetFunction(functionAssignmentExpression, this._symbolManager));
            }
        }
    });

    Bridge.define("Parser.FunctionExpressionVisitor", {
        inherits: [Parser.EvaluationVisitor],
        fields: {
            argNames: null,
            arguments: null
        },
        alias: ["Visit$9", "Parser$IExpressionVisitor$Visit$9"],
        ctors: {
            ctor: function (argNames, $arguments, symbolProvider) {
                this.$initialize();
                Parser.EvaluationVisitor.ctor.call(this, symbolProvider);
                this.argNames = argNames;
                this.arguments = $arguments;
            }
        },
        methods: {
            Visit$9: function (variableExpression) {
                if (System.Linq.Enumerable.from(this.argNames).contains(variableExpression.Identifier)) {
                    var idx = System.Linq.Enumerable.from(this.argNames).toList(Parser.Identifier).indexOf(variableExpression.Identifier);
                    this._evaluationStack.Push(this.arguments[System.Array.index(idx, this.arguments)]);
                } else {
                    Parser.EvaluationVisitor.prototype.Visit$9.call(this, variableExpression);
                }
            }
        }
    });

    Bridge.define("Parser.GraphvizVisitor", {
        inherits: [Parser.BottomUpExpressionVisitor],
        fields: {
            stringBuilder: null,
            id: 0,
            idStack: null
        },
        alias: [
            "Visit$1", "Parser$IExpressionVisitor$Visit$1",
            "Visit$6", "Parser$IExpressionVisitor$Visit$6",
            "Visit", "Parser$IExpressionVisitor$Visit",
            "Visit$7", "Parser$IExpressionVisitor$Visit$7",
            "Visit$9", "Parser$IExpressionVisitor$Visit$9",
            "Visit$5", "Parser$IExpressionVisitor$Visit$5"
        ],
        ctors: {
            init: function () {
                this.stringBuilder = new System.Text.StringBuilder();
                this.id = 0;
                this.idStack = new (System.Collections.Generic.Stack$1(System.Int32)).ctor();
            }
        },
        methods: {
            Visit$1: function (functionExpression) {
                this.consume("Function Call", ((System.Linq.Enumerable.from(functionExpression.Arguments).count() + 1) | 0));
            },
            Visit$6: function (ternaryExpression) {
                this.consume("Ternary", 3);
            },
            Visit: function (binaryExpression) {
                this.consume(System.Enum.toString(Parser.BinaryExpressionType, binaryExpression.BinaryExpressionType), 2);
            },
            Visit$7: function (valueExpression) {
                this.consume(valueExpression.Value.toString(), 0);
            },
            Visit$9: function (variableExpression) {
                this.consume(Parser.Identifier.op_Implicit$1(variableExpression.Identifier), 0);
            },
            Visit$5: function (prefixExpression) {
                this.consume(System.Enum.toString(Parser.PrefixExpressionType, prefixExpression.PrefixExpressionType), 1);
            },
            consume: function (nodeName, count) {
                var $t;
                this.stringBuilder.appendLine(System.String.format("node{0} [ label = \"{1}\" ];", Bridge.box(this.id, System.Int32), nodeName));

                var childIds = System.Linq.Enumerable.range(0, count).select(Bridge.fn.bind(this, $asm.$.Parser.GraphvizVisitor.f1)).reverse();
                $t = Bridge.getEnumerator(childIds, System.Int32);
                try {
                    while ($t.moveNext()) {
                        var i = $t.Current;
                        this.stringBuilder.appendLine(System.String.format("node{0} -> node{1};", Bridge.box(this.id, System.Int32), Bridge.box(i, System.Int32)));
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                this.idStack.Push(this.id);
                this.id = (this.id + 1) | 0;
            },
            GetResult: function () {
                return "digraph G {\n" + (this.stringBuilder.toString() || "") + "}\n";
            }
        }
    });

    Bridge.ns("Parser.GraphvizVisitor", $asm.$);

    Bridge.apply($asm.$.Parser.GraphvizVisitor, {
        f1: function (x) {
            return this.idStack.Pop();
        }
    });

    Bridge.define("Parser.PrintVisitor", {
        inherits: [Parser.BottomUpExpressionVisitor],
        fields: {
            _stack: null
        },
        alias: [
            "Visit", "Parser$IExpressionVisitor$Visit",
            "Visit$7", "Parser$IExpressionVisitor$Visit$7",
            "Visit$6", "Parser$IExpressionVisitor$Visit$6",
            "Visit$9", "Parser$IExpressionVisitor$Visit$9",
            "Visit$5", "Parser$IExpressionVisitor$Visit$5",
            "Visit$4", "Parser$IExpressionVisitor$Visit$4",
            "Visit$1", "Parser$IExpressionVisitor$Visit$1",
            "Visit$8", "Parser$IExpressionVisitor$Visit$8",
            "Visit$2", "Parser$IExpressionVisitor$Visit$2"
        ],
        ctors: {
            init: function () {
                this._stack = new (System.Collections.Generic.Stack$1(System.String)).ctor();
            }
        },
        methods: {
            GetResult: function () {
                if (this._stack.Count === 1) {
                    return this._stack.Pop();
                } else {
                    var message = System.String.format("Stack contains {0} values. It should contain exactly one value.", [Bridge.box(this._stack.Count, System.Int32)]);
                    throw new Parser.EvaluationException.$ctor1(message);
                }
            },
            Visit: function (binaryExpression) {
                var infix;
                switch (binaryExpression.BinaryExpressionType) {
                    case Parser.BinaryExpressionType.Addition: 
                        infix = "+";
                        break;
                    case Parser.BinaryExpressionType.Division: 
                        infix = "/";
                        break;
                    case Parser.BinaryExpressionType.Multiplication: 
                        infix = "*";
                        break;
                    case Parser.BinaryExpressionType.Power: 
                        infix = "^";
                        break;
                    case Parser.BinaryExpressionType.Substraction: 
                        infix = "-";
                        break;
                    case Parser.BinaryExpressionType.Modulo: 
                        infix = "%";
                        break;
                    case Parser.BinaryExpressionType.Equal: 
                        infix = "==";
                        break;
                    case Parser.BinaryExpressionType.NotEqual: 
                        infix = "!=";
                        break;
                    case Parser.BinaryExpressionType.Less: 
                        infix = "<";
                        break;
                    case Parser.BinaryExpressionType.LessOrEqual: 
                        infix = "<=";
                        break;
                    case Parser.BinaryExpressionType.Greater: 
                        infix = ">";
                        break;
                    case Parser.BinaryExpressionType.GreaterOrEqual: 
                        infix = ">=";
                        break;
                    default: 
                        throw new System.ArgumentException.$ctor1("unhandled binary expression type");
                }

                var right = this._stack.Pop();
                var left = this._stack.Pop();

                var output = System.String.format("({0}{1}{2})", left, infix, right);
                this._stack.Push(output);
            },
            Visit$7: function (valueExpression) {
                this._stack.Push(valueExpression.Value.toString());
            },
            Visit$6: function (ternaryExpression) {
                var falseCase = this._stack.Pop();
                var trueCase = this._stack.Pop();
                var condition = this._stack.Pop();

                this._stack.Push("{" + (condition || "") + " ? " + (trueCase || "") + " : " + (falseCase || "") + "}");
            },
            Visit$9: function (variableExpression) {
                this._stack.Push(Parser.Identifier.op_Implicit$1(variableExpression.Identifier));
            },
            Visit$5: function (prefixExpression) {
                var prefix;
                switch (prefixExpression.PrefixExpressionType) {
                    case Parser.PrefixExpressionType.Negation: 
                        prefix = "-";
                        break;
                    case Parser.PrefixExpressionType.Positive: 
                        prefix = "+";
                        break;
                    default: 
                        throw new System.ArgumentException.$ctor1("unhandled prefix expression type");
                }

                var right = this._stack.Pop();
                var output = System.String.format("({0}{1})", prefix, right);
                this._stack.Push(output);
            },
            Visit$4: function (postfixExpression) {
                var postfix;
                switch (postfixExpression.PostfixExpressionType) {
                    case Parser.PostfixExpressionType.Factorial: 
                        postfix = "!";
                        break;
                    default: 
                        throw new System.ArgumentException.$ctor1("unhandled postfix expression type");
                }

                var left = this._stack.Pop();
                var output = System.String.format("({0}{1})", left, postfix);
                this._stack.Push(output);
            },
            Visit$1: function (functionExpression) {
                var args = Bridge.toArray(System.Linq.Enumerable.from(functionExpression.Arguments).select(Bridge.fn.bind(this, $asm.$.Parser.PrintVisitor.f1)).reverse()).join(",");
                var functionName = this._stack.Pop();
                this._stack.Push((functionName || "") + "(" + (args || "") + ")");
            },
            Visit$8: function (variableAssignmentExpression) {
                this._stack.Push(System.String.concat("(", Parser.Identifier.op_Implicit$1(variableAssignmentExpression.Identifier)) + " = " + (this._stack.Pop() || "") + ")");
            },
            Visit$2: function (functionAssignmentExpression) {
                this._stack.Push(System.String.concat("(", Parser.Identifier.op_Implicit$1(functionAssignmentExpression.FunctionIdentifier)) + "(" + (Bridge.toArray(functionAssignmentExpression.ArgumentNames).join(", ") || "") + ")" + " = " + (this._stack.Pop() || "") + ")");
            }
        }
    });

    Bridge.ns("Parser.PrintVisitor", $asm.$);

    Bridge.apply($asm.$.Parser.PrintVisitor, {
        f1: function (arg) {
            return this._stack.Pop();
        }
    });
});
