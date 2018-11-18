/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2015
 * @compiler Bridge.NET 17.4.0
 */
Bridge.assembly("Parser", function ($asm, globals) {
    "use strict";

    Bridge.define("MathParser.IInfixParselet", {
        $kind: "interface"
    });

    Bridge.define("MathParser.IExpressionVisitor", {
        $kind: "interface"
    });

    Bridge.define("MathParser.Associativity", {
        $kind: "enum",
        statics: {
            fields: {
                Left: 0,
                Right: 1
            }
        }
    });

    Bridge.define("MathParser.AssociativityExtensions", {
        statics: {
            methods: {
                /**
                 * Parsing operators with same precedence and right associativity
                 is done by parsing the right hand side expression with a lower precedence.
                 *
                 * @static
                 * @public
                 * @this MathParser.AssociativityExtensions
                 * @memberof MathParser.AssociativityExtensions
                 * @param   {MathParser.Associativity}    associativity
                 * @return  {number}                                       The precedence increment.
                 */
                ToPrecedenceIncrement: function (associativity) {
                    switch (associativity) {
                        case MathParser.Associativity.Left: 
                            return 0;
                        case MathParser.Associativity.Right: 
                            return -1;
                        default: 
                            throw new System.ArgumentException.$ctor1("unhandled associtivity");
                    }
                }
            }
        }
    });

    Bridge.define("MathParser.ParserException", {
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

    Bridge.define("MathParser.IExpression", {
        $kind: "interface"
    });

    Bridge.define("MathParser.BinaryExpressionType", {
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

    Bridge.define("MathParser.EvaluateSymbols", {
        statics: {
            methods: {
                SetEvalSymbol: function (symbolManager) {
                    var $function = function ($arguments) {
                        var value = $arguments[System.Array.index(0, $arguments)];

                        return value.ToExpression().Evaluate$1(symbolManager);
                    };

                    symbolManager.MathParser$ISymbolManager$Set(MathParser.Identifier.op_Implicit("eval"), MathParser.Value.Function($function));
                }
            }
        }
    });

    Bridge.define("MathParser.EvaluationException", {
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

    Bridge.define("MathParser.Expression", {
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
                var evaluationVisitor = new MathParser.EvaluationVisitor(symbolManager);
                this.Expr.MathParser$IExpression$Accept(evaluationVisitor);
                return evaluationVisitor.GetResult();
            },
            ExecuteAssignments: function (symbolManager) {
                var assignVisitor = new MathParser.AssignVisitor(symbolManager);
                this.Expr.MathParser$IExpression$Accept(assignVisitor);
            },
            toString: function () {
                return this.ToDebug();
            },
            ToDebug: function () {
                var printVisitor = new MathParser.PrintVisitor();
                this.Expr.MathParser$IExpression$Accept(printVisitor);
                return printVisitor.GetResult();
            },
            ToGraphviz: function () {
                var graphvizVisitor = new MathParser.GraphvizVisitor();
                this.Expr.MathParser$IExpression$Accept(graphvizVisitor);
                return graphvizVisitor.GetResult();
            }
        }
    });

    Bridge.define("MathParser.ExpressionParser", {
        statics: {
            fields: {
                _prefixParselets: null,
                _infixParselets: null
            },
            ctors: {
                init: function () {
                    this._prefixParselets = new (System.Collections.Generic.Dictionary$2(Tokenizer.TokenType,MathParser.IPrefixParselet))();
                    this._infixParselets = new (System.Collections.Generic.Dictionary$2(Tokenizer.TokenType,MathParser.IInfixParselet))();
                },
                ctor: function () {
                    MathParser.ExpressionParser.registerPrefixParselet(Tokenizer.TokenType.Identifier, new MathParser.VariableParselet());
                    MathParser.ExpressionParser.registerPrefixParselet(Tokenizer.TokenType.Decimal, new MathParser.FloatingPointNumberParselet());
                    MathParser.ExpressionParser.registerPrefixParselet(Tokenizer.TokenType.Integer, new MathParser.IntegerParselet());
                    //registerPrefixParselet(TokenType.False, new FixValueParselet(Value.Boolean(false)));
                    //registerPrefixParselet(TokenType.True, new FixValueParselet(Value.Boolean(true)));
                    MathParser.ExpressionParser.registerPrefixParselet(Tokenizer.TokenType.LeftParenthesis, new MathParser.GroupParselet());
                    MathParser.ExpressionParser.registerPrefixParselet(Tokenizer.TokenType.Minus, new MathParser.PrefixOperatorParselet(MathParser.PrefixExpressionType.Negation, MathParser.Precedences.PREFIX));
                    MathParser.ExpressionParser.registerPrefixParselet(Tokenizer.TokenType.Plus, new MathParser.PrefixOperatorParselet(MathParser.PrefixExpressionType.Positive, MathParser.Precedences.PREFIX));

                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.Exclamation, new MathParser.PostfixOperatorParselet(MathParser.PostfixExpressionType.Factorial, MathParser.Precedences.POSTFIX));
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.Assignment, new MathParser.AssignParselet());
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.Equal, new MathParser.BinaryOperatorParselet(MathParser.BinaryExpressionType.Equal, MathParser.Precedences.COMPARISON, MathParser.Associativity.Left));
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.NotEqual, new MathParser.BinaryOperatorParselet(MathParser.BinaryExpressionType.NotEqual, MathParser.Precedences.COMPARISON, MathParser.Associativity.Left));
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.Less, new MathParser.BinaryOperatorParselet(MathParser.BinaryExpressionType.Less, MathParser.Precedences.COMPARISON, MathParser.Associativity.Left));
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.Greater, new MathParser.BinaryOperatorParselet(MathParser.BinaryExpressionType.Greater, MathParser.Precedences.COMPARISON, MathParser.Associativity.Left));
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.LessOrEqual, new MathParser.BinaryOperatorParselet(MathParser.BinaryExpressionType.LessOrEqual, MathParser.Precedences.COMPARISON, MathParser.Associativity.Left));
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.GreaterOrEqual, new MathParser.BinaryOperatorParselet(MathParser.BinaryExpressionType.GreaterOrEqual, MathParser.Precedences.COMPARISON, MathParser.Associativity.Left));
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.QuestionMark, new MathParser.TernaryParselet());
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.LeftParenthesis, new MathParser.CallParselet());
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.Plus, new MathParser.BinaryOperatorParselet(MathParser.BinaryExpressionType.Addition, MathParser.Precedences.SUM, MathParser.Associativity.Left));
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.Minus, new MathParser.BinaryOperatorParselet(MathParser.BinaryExpressionType.Substraction, MathParser.Precedences.SUM, MathParser.Associativity.Left));
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.Star, new MathParser.BinaryOperatorParselet(MathParser.BinaryExpressionType.Multiplication, MathParser.Precedences.PRODUCT, MathParser.Associativity.Left));
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.Slash, new MathParser.BinaryOperatorParselet(MathParser.BinaryExpressionType.Division, MathParser.Precedences.PRODUCT, MathParser.Associativity.Left));
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.Pow, new MathParser.BinaryOperatorParselet(MathParser.BinaryExpressionType.Power, MathParser.Precedences.EXPONENT, MathParser.Associativity.Right));
                    MathParser.ExpressionParser.registerInfixParselet(Tokenizer.TokenType.Percent, new MathParser.BinaryOperatorParselet(MathParser.BinaryExpressionType.Modulo, MathParser.Precedences.PRODUCT, MathParser.Associativity.Left));
                }
            },
            methods: {
                registerPrefixParselet: function (tokenType, prefixParselet) {
                    MathParser.ExpressionParser._prefixParselets.add(tokenType, prefixParselet);
                },
                registerInfixParselet: function (tokenType, infixParselet) {
                    MathParser.ExpressionParser._infixParselets.add(tokenType, infixParselet);
                }
            }
        },
        methods: {
            Parse: function (tokenStream) {
                return this.ParseExpression(tokenStream, MathParser.Precedences.EXPRESSION);
            },
            ParseExpression: function (tokenStream, precedence) {
                var token = tokenStream.Consume();

                var prefixParselet = { };
                if (!MathParser.ExpressionParser._prefixParselets.tryGetValue(token.TokenType, prefixParselet)) {
                    // TODO better exception
                    throw new System.ArgumentException.$ctor1("Could not parse \"" + (token.Content || "") + "\".");
                }
                var leftExpression = prefixParselet.v.MathParser$IPrefixParselet$Parse(Bridge.fn.cacheBind(this, this.ParseExpression), tokenStream, token);

                while (true) {
                    var infixParselet = { };
                    var isInfix = MathParser.ExpressionParser._infixParselets.tryGetValue(tokenStream.Peek().TokenType, infixParselet);
                    if (!isInfix) {
                        if (MathParser.ExpressionParser._prefixParselets.containsKey(tokenStream.Peek().TokenType)) {
                            infixParselet.v = MathParser.ExpressionParser._infixParselets.get(Tokenizer.TokenType.Star);
                        } else {
                            break;
                        }
                    }

                    if (precedence >= infixParselet.v.MathParser$IInfixParselet$Precedence) {
                        break;
                    }
                    // todo handle juxtaposition multiplication for constants with brackets
                    if (isInfix) {
                        tokenStream.Consume();
                    }

                    leftExpression = infixParselet.v.MathParser$IInfixParselet$Parse(Bridge.fn.cacheBind(this, this.ParseExpression), tokenStream, leftExpression);
                }

                return leftExpression;
            }
        }
    });

    Bridge.define("MathParser.ExpressionVisitorExtensions", {
        statics: {
            methods: {
                Traverse: function (visitor, visitSelf, children) {
                    var $t;
                    if (children === void 0) { children = []; }
                    var traversal = visitor.MathParser$IExpressionVisitor$Traversal;

                    if (traversal === MathParser.Traversal.BottomUp) {
                        $t = Bridge.getEnumerator(children);
                        try {
                            while ($t.moveNext()) {
                                var child = $t.Current;
                                child.MathParser$IExpression$Accept(visitor);
                            }
                        } finally {
                            if (Bridge.is($t, System.IDisposable)) {
                                $t.System$IDisposable$Dispose();
                            }
                        }
                    } else if (traversal === MathParser.Traversal.None) {
                    } else {
                        throw new System.ArgumentException.$ctor1("unknown traversal type");
                    }

                    visitSelf();
                }
            }
        }
    });

    Bridge.define("MathParser.IPrefixParselet", {
        $kind: "interface"
    });

    Bridge.define("MathParser.Identifier", {
        statics: {
            methods: {
                op_Implicit: function (name) {
                    return new MathParser.Identifier(name);
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
                    return !(MathParser.Identifier.op_Equality(identifier1, identifier2));
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
                var other = (Bridge.as(obj, MathParser.Identifier));

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

    Bridge.define("MathParser.ISymbolManager", {
        $kind: "interface"
    });

    Bridge.define("MathParser.MathParser", {
        methods: {
            Parse: function (expression) {
                var tokensWithoutWhiteSpaces = System.Linq.Enumerable.from(Tokenizer.Tokenize.FromString(expression)).where($asm.$.MathParser.MathParser.f1);

                var tokenStream = new MathParser.TokenStream(tokensWithoutWhiteSpaces);
                try {
                    var expressionParser = new MathParser.ExpressionParser();
                    var rootExpression = expressionParser.Parse(tokenStream);

                    tokenStream.Consume$1(Tokenizer.TokenType.EndOfFile);

                    return new MathParser.Expression(rootExpression);
                }
                finally {
                    if (Bridge.hasValue(tokenStream)) {
                        tokenStream.System$IDisposable$Dispose();
                    }
                }
            }
        }
    });

    Bridge.ns("MathParser.MathParser", $asm.$);

    Bridge.apply($asm.$.MathParser.MathParser, {
        f1: function (token) {
            return token.TokenType !== Tokenizer.TokenType.WhiteSpace;
        }
    });

    Bridge.define("MathParser.PostfixExpressionType", {
        $kind: "enum",
        statics: {
            fields: {
                Factorial: 0
            }
        }
    });

    Bridge.define("MathParser.Precedences", {
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

    Bridge.define("MathParser.PrefixExpressionType", {
        $kind: "enum",
        statics: {
            fields: {
                Negation: 0,
                Positive: 1
            }
        }
    });

    Bridge.define("MathParser.SymbolManagerExtensions", {
        statics: {
            methods: {
                SetInteger: function (symbolManager, identifier, l) {
                    symbolManager.MathParser$ISymbolManager$Set(identifier, MathParser.Value.Integer(l));
                },
                SetDecimal: function (symbolManager, identifier, d) {
                    symbolManager.MathParser$ISymbolManager$Set(identifier, MathParser.Value.Decimal(d));
                },
                SetBoolean: function (symbolManager, identifier, b) {
                    symbolManager.MathParser$ISymbolManager$Set(identifier, MathParser.Value.Boolean(b));
                },
                SetFunction: function (symbolManager, identifier, $function) {
                    symbolManager.MathParser$ISymbolManager$Set(identifier, MathParser.Value.Function($function));
                }
            }
        }
    });

    Bridge.define("MathParser.TokenStream", {
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
                    throw new MathParser.ExpectedTokenException.$ctor3(expectedTokenType, nextToken.Position);
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

    Bridge.define("MathParser.Traversal", {
        $kind: "enum",
        statics: {
            fields: {
                None: 0,
                BottomUp: 1
            }
        }
    });

    Bridge.define("MathParser.TrigonometrySymbols", {
        statics: {
            methods: {
                SetTrigonometrySymbols: function (symbolManager) {
                    MathParser.TrigonometrySymbols.Define(symbolManager, "sin", Math.sin);
                    MathParser.TrigonometrySymbols.Define(symbolManager, "cos", Math.cos);
                    MathParser.TrigonometrySymbols.Define(symbolManager, "tan", Math.tan);
                },
                Define: function (symbolManager, symbolName, method) {
                    var $function = function ($arguments) {
                        if ($arguments.length === 1) {
                            var isNumber = $arguments[System.Array.index(0, $arguments)].IsInteger || $arguments[System.Array.index(0, $arguments)].IsDecimal;

                            if (isNumber) {
                                var x = $arguments[System.Array.index(0, $arguments)].ToDouble();

                                return MathParser.Value.Decimal(method(x));
                            }
                        }

                        var message = System.String.format("Function {0} expects exactly one argument of type number. Given {1} arguments.", symbolName, Bridge.box($arguments.length, System.Int32));
                        throw new MathParser.EvaluationException.$ctor1(message);
                    };

                    symbolManager.MathParser$ISymbolManager$Set(MathParser.Identifier.op_Implicit(symbolName), MathParser.Value.Function($function));
                }
            }
        }
    });

    Bridge.define("MathParser.Value", {
        statics: {
            methods: {
                Integer: function (l) {
                    return new MathParser.Value(MathParser.Value.Type.Integer, l);
                },
                Decimal: function (d) {
                    return new MathParser.Value(MathParser.Value.Type.Decimal, Bridge.box(d, System.Double, System.Double.format, System.Double.getHashCode));
                },
                Boolean: function (b) {
                    return new MathParser.Value(MathParser.Value.Type.Boolean, Bridge.box(b, System.Boolean, System.Boolean.toString));
                },
                Function: function ($function) {
                    return new MathParser.Value(MathParser.Value.Type.Function, $function);
                },
                Empty: function () {
                    return new MathParser.Value(MathParser.Value.Type.Empty, null);
                },
                Expression: function (expression) {
                    return new MathParser.Value(MathParser.Value.Type.Expression, expression);
                },
                Add: function (valueA, valueB) {
                    if (valueA.IsInteger && valueB.IsInteger) {
                        var a = valueA.ToInt64();
                        var b = valueB.ToInt64();
                        return MathParser.Value.Integer(a.add(b));
                    }

                    var isNumberA = valueA.IsDecimal || valueA.IsInteger;
                    var isNumberB = valueB.IsDecimal || valueB.IsInteger;

                    if (isNumberA && isNumberB) {
                        var a1 = valueA.ToDouble();
                        var b1 = valueB.ToDouble();
                        return MathParser.Value.Decimal(a1 + b1);
                    }

                    if (valueA.IsExpression || valueB.IsExpression) {
                        var a2 = new MathParser.ValueExpression(valueA);
                        var b2 = new MathParser.ValueExpression(valueB);
                        var result = new MathParser.BinaryExpression(MathParser.BinaryExpressionType.Addition, a2, b2);
                        return MathParser.Value.Expression(new MathParser.Expression(result));
                    }

                    var message = System.String.format("Incompatible types of operands {0} and {1} for binary operation {2}.", Bridge.box(valueA.ValueType, MathParser.Value.Type, System.Enum.toStringFn(MathParser.Value.Type)), Bridge.box(valueB.ValueType, MathParser.Value.Type, System.Enum.toStringFn(MathParser.Value.Type)), Bridge.box(MathParser.BinaryExpressionType.Addition, MathParser.BinaryExpressionType, System.Enum.toStringFn(MathParser.BinaryExpressionType)));
                    throw new MathParser.EvaluationException.$ctor1(message);
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
                    return this.ValueType === MathParser.Value.Type.Empty;
                }
            },
            IsExpression: {
                get: function () {
                    return this.ValueType === MathParser.Value.Type.Expression;
                }
            },
            IsInteger: {
                get: function () {
                    return this.ValueType === MathParser.Value.Type.Integer;
                }
            },
            IsDecimal: {
                get: function () {
                    return this.ValueType === MathParser.Value.Type.Decimal;
                }
            },
            IsBoolean: {
                get: function () {
                    return this.ValueType === MathParser.Value.Type.Boolean;
                }
            },
            IsFunction: {
                get: function () {
                    return this.ValueType === MathParser.Value.Type.Function;
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
                return Bridge.cast(this._value, MathParser.Expression);
            },
            toString: function () {
                return Bridge.toString(this._value);
            }
        }
    });

    Bridge.define("MathParser.Value.Type", {
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

    Bridge.define("MathParser.AssignParselet", {
        inherits: [MathParser.IInfixParselet],
        props: {
            Precedence: {
                get: function () {
                    return MathParser.Precedences.ASSIGNMENT;
                }
            }
        },
        alias: [
            "Parse", "MathParser$IInfixParselet$Parse",
            "Precedence", "MathParser$IInfixParselet$Precedence"
        ],
        methods: {
            Parse: function (parseExpression, tokenStream, leftExpression) {
                var rightExpression = parseExpression(tokenStream, ((MathParser.Precedences.ASSIGNMENT + MathParser.AssociativityExtensions.ToPrecedenceIncrement(MathParser.Associativity.Right)) | 0));

                if (Bridge.is(leftExpression, MathParser.VariableExpression)) {
                    var identifier = Bridge.cast(leftExpression, MathParser.VariableExpression).Identifier;
                    return new MathParser.VariableAssignmentExpression(identifier, rightExpression);
                } else if (Bridge.is(leftExpression, MathParser.CallExpression)) {
                    var callExpression = Bridge.cast(leftExpression, MathParser.CallExpression);

                    var $arguments = System.Linq.Enumerable.from(callExpression.Arguments).select($asm.$.MathParser.AssignParselet.f1);
                    var functionExpression = Bridge.as(callExpression.FunctionExpression, MathParser.VariableExpression);

                    if (System.Linq.Enumerable.from($arguments).all($asm.$.MathParser.AssignParselet.f2) && functionExpression != null) {
                        return new MathParser.FunctionAssignmentExpression(functionExpression.Identifier, System.Linq.Enumerable.from($arguments).select($asm.$.MathParser.AssignParselet.f3), rightExpression);
                    } else {
                        throw new MathParser.BadAssignmentException.$ctor1("Every argument in a function assignment must be a variable name.");
                    }
                }

                throw new MathParser.BadAssignmentException.$ctor1("The left hand side of an assignment must either be a function signature or a variable name.");
            }
        }
    });

    Bridge.ns("MathParser.AssignParselet", $asm.$);

    Bridge.apply($asm.$.MathParser.AssignParselet, {
        f1: function (argument) {
            return (Bridge.as(argument, MathParser.VariableExpression));
        },
        f2: function (arg) {
            return arg != null;
        },
        f3: function (argument) {
            return argument.Identifier;
        }
    });

    Bridge.define("MathParser.BottomUpExpressionVisitor", {
        inherits: [MathParser.IExpressionVisitor],
        props: {
            Traversal: {
                get: function () {
                    return MathParser.Traversal.BottomUp;
                }
            }
        },
        alias: [
            "Traversal", "MathParser$IExpressionVisitor$Traversal",
            "Visit$4", "MathParser$IExpressionVisitor$Visit$4",
            "Visit$1", "MathParser$IExpressionVisitor$Visit$1",
            "Visit$8", "MathParser$IExpressionVisitor$Visit$8",
            "Visit$3", "MathParser$IExpressionVisitor$Visit$3",
            "Visit$2", "MathParser$IExpressionVisitor$Visit$2",
            "Visit$6", "MathParser$IExpressionVisitor$Visit$6",
            "Visit$9", "MathParser$IExpressionVisitor$Visit$9",
            "Visit$7", "MathParser$IExpressionVisitor$Visit$7",
            "Visit$5", "MathParser$IExpressionVisitor$Visit$5",
            "Visit", "MathParser$IExpressionVisitor$Visit"
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

    Bridge.define("MathParser.BadAssignmentException", {
        inherits: [MathParser.ParserException],
        ctors: {
            ctor: function () {
                this.$initialize();
                MathParser.ParserException.ctor.call(this);
            },
            $ctor1: function (message) {
                this.$initialize();
                MathParser.ParserException.$ctor1.call(this, message);
            },
            $ctor2: function (message, innerException) {
                this.$initialize();
                MathParser.ParserException.$ctor2.call(this, message, innerException);
            }
        }
    });

    Bridge.define("MathParser.BinaryExpression", {
        inherits: [MathParser.IExpression],
        props: {
            BinaryExpressionType: 0,
            LeftOperand: null,
            RightOperand: null
        },
        alias: ["Accept", "MathParser$IExpression$Accept"],
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
                MathParser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.MathParser$IExpressionVisitor$Visit(this);
                }), [this.LeftOperand, this.RightOperand]);
            }
        }
    });

    Bridge.define("MathParser.BinaryOperatorParselet", {
        inherits: [MathParser.IInfixParselet],
        fields: {
            _binaryExpressionType: 0,
            _associativity: 0
        },
        props: {
            Precedence: 0
        },
        alias: [
            "Parse", "MathParser$IInfixParselet$Parse",
            "Precedence", "MathParser$IInfixParselet$Precedence"
        ],
        ctors: {
            ctor: function (binaryExpressionType, precedence, associativity) {
                this.$initialize();
                this._binaryExpressionType = binaryExpressionType;
                this.Precedence = precedence;
                this._associativity = associativity;
            }
        },
        methods: {
            Parse: function (parseExpression, tokenStream, leftExpression) {
                var rightExpression = parseExpression(tokenStream, ((this.Precedence + MathParser.AssociativityExtensions.ToPrecedenceIncrement(this._associativity)) | 0));
                return new MathParser.BinaryExpression(this._binaryExpressionType, leftExpression, rightExpression);
            }
        }
    });

    Bridge.define("MathParser.CallExpression", {
        inherits: [MathParser.IExpression],
        props: {
            FunctionExpression: null,
            Arguments: null
        },
        alias: ["Accept", "MathParser$IExpression$Accept"],
        ctors: {
            ctor: function (functionExpression, $arguments) {
                this.$initialize();
                this.FunctionExpression = functionExpression;
                this.Arguments = System.Linq.Enumerable.from($arguments).ToArray();
            }
        },
        methods: {
            Accept: function (visitor) {
                var children = System.Linq.Enumerable.from(System.Array.init([this.FunctionExpression], MathParser.IExpression)).concat(this.Arguments).ToArray(MathParser.IExpression);
                MathParser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.MathParser$IExpressionVisitor$Visit$1(this);
                }), children);
            }
        }
    });

    Bridge.define("MathParser.CallParselet", {
        inherits: [MathParser.IInfixParselet],
        props: {
            Precedence: {
                get: function () {
                    return MathParser.Precedences.CALL;
                }
            }
        },
        alias: [
            "Parse", "MathParser$IInfixParselet$Parse",
            "Precedence", "MathParser$IInfixParselet$Precedence"
        ],
        methods: {
            Parse: function (parseExpression, tokenStream, leftExpression) {
                var $arguments = new (System.Collections.Generic.List$1(MathParser.IExpression)).ctor();

                if (!tokenStream.Match(Tokenizer.TokenType.RightParenthesis)) {
                    do {
                        $arguments.add(parseExpression(tokenStream, 0));
                    } while (tokenStream.Match(Tokenizer.TokenType.Comma));

                    tokenStream.Consume$1(Tokenizer.TokenType.RightParenthesis);
                }

                return new MathParser.CallExpression(leftExpression, $arguments);
            }
        }
    });

    Bridge.define("MathParser.EvaluationVisitor", {
        inherits: [MathParser.IExpressionVisitor],
        fields: {
            _symbolManager: null,
            _evaluationStack: null
        },
        props: {
            Traversal: {
                get: function () {
                    return MathParser.Traversal.None;
                }
            }
        },
        alias: [
            "Traversal", "MathParser$IExpressionVisitor$Traversal",
            "Visit", "MathParser$IExpressionVisitor$Visit",
            "Visit$5", "MathParser$IExpressionVisitor$Visit$5",
            "Visit$7", "MathParser$IExpressionVisitor$Visit$7",
            "Visit$1", "MathParser$IExpressionVisitor$Visit$1",
            "Visit$6", "MathParser$IExpressionVisitor$Visit$6",
            "Visit$9", "MathParser$IExpressionVisitor$Visit$9",
            "Visit$4", "MathParser$IExpressionVisitor$Visit$4",
            "Visit$3", "MathParser$IExpressionVisitor$Visit$3",
            "Visit$8", "MathParser$IExpressionVisitor$Visit$8",
            "Visit$2", "MathParser$IExpressionVisitor$Visit$2"
        ],
        ctors: {
            ctor: function (symbolManager) {
                this.$initialize();
                this._symbolManager = symbolManager;
                this._evaluationStack = new (System.Collections.Generic.Stack$1(MathParser.Value)).ctor();
            }
        },
        methods: {
            GetResult: function () {
                if (this._evaluationStack.Count === 1) {
                    return this._evaluationStack.Pop();
                } else {
                    throw new MathParser.EvaluationException.$ctor1("Evaluation stack still contains " + this._evaluationStack.Count + " values. It should contain exactly one value.");
                }
            },
            Visit: function (binaryExpression) {
                binaryExpression.LeftOperand.MathParser$IExpression$Accept(this);
                binaryExpression.RightOperand.MathParser$IExpression$Accept(this);

                var rightOperand = this._evaluationStack.Pop();
                var leftOperand = this._evaluationStack.Pop();
                var isNumberLeft = leftOperand.IsDecimal || leftOperand.IsInteger;
                var isNumberRight = rightOperand.IsDecimal || rightOperand.IsInteger;

                switch (binaryExpression.BinaryExpressionType) {
                    case MathParser.BinaryExpressionType.Addition: 
                        var result = MathParser.Value.Add(leftOperand, rightOperand);
                        this._evaluationStack.Push(result);
                        return;
                }

                if (isNumberLeft && isNumberRight) {
                    var leftValue = leftOperand.ToDouble();
                    var rightValue = rightOperand.ToDouble();
                    var result1;

                    switch (binaryExpression.BinaryExpressionType) {
                        case MathParser.BinaryExpressionType.Substraction: 
                            result1 = MathParser.Value.Decimal(leftValue - rightValue);
                            break;
                        case MathParser.BinaryExpressionType.Multiplication: 
                            result1 = MathParser.Value.Decimal(leftValue * rightValue);
                            break;
                        case MathParser.BinaryExpressionType.Division: 
                            result1 = MathParser.Value.Decimal(leftValue / rightValue);
                            break;
                        case MathParser.BinaryExpressionType.Power: 
                            result1 = MathParser.Value.Decimal(Math.pow(leftValue, rightValue));
                            break;
                        case MathParser.BinaryExpressionType.Modulo: 
                            result1 = MathParser.Value.Decimal(leftValue % rightValue);
                            break;
                        case MathParser.BinaryExpressionType.Equal: 
                            result1 = MathParser.Value.Boolean(leftValue === rightValue);
                            break;
                        case MathParser.BinaryExpressionType.NotEqual: 
                            result1 = MathParser.Value.Boolean(leftValue !== rightValue);
                            break;
                        case MathParser.BinaryExpressionType.Less: 
                            result1 = MathParser.Value.Boolean(leftValue < rightValue);
                            break;
                        case MathParser.BinaryExpressionType.LessOrEqual: 
                            result1 = MathParser.Value.Boolean(leftValue <= rightValue);
                            break;
                        case MathParser.BinaryExpressionType.Greater: 
                            result1 = MathParser.Value.Boolean(leftValue > rightValue);
                            break;
                        case MathParser.BinaryExpressionType.GreaterOrEqual: 
                            result1 = MathParser.Value.Boolean(leftValue >= rightValue);
                            break;
                        default: 
                            var message = System.String.format("Unhandled binary operation {0}.", [Bridge.box(binaryExpression.BinaryExpressionType, MathParser.BinaryExpressionType, System.Enum.toStringFn(MathParser.BinaryExpressionType))]);
                            throw new MathParser.EvaluationException.$ctor1(message);
                    }

                    // TODO integer operations
                    this._evaluationStack.Push(result1);
                } else {
                    var message1 = System.String.format("Incompatible types of operands {0} and {1} for binary operation {2}.", leftOperand, rightOperand, Bridge.box(binaryExpression.BinaryExpressionType, MathParser.BinaryExpressionType, System.Enum.toStringFn(MathParser.BinaryExpressionType)));
                    throw new MathParser.EvaluationException.$ctor1(message1);
                }
            },
            Visit$5: function (prefixExpression) {
                prefixExpression.RightOperand.MathParser$IExpression$Accept(this);

                var operand = this._evaluationStack.Pop();

                if (operand.IsInteger || operand.IsDecimal) {
                    var value = operand.ToDouble();
                    var result;

                    switch (prefixExpression.PrefixExpressionType) {
                        case MathParser.PrefixExpressionType.Negation: 
                            result = -value;
                            break;
                        default: 
                            var message = System.String.format("Unhandled prefix operation {0}.", [Bridge.box(prefixExpression.PrefixExpressionType, MathParser.PrefixExpressionType, System.Enum.toStringFn(MathParser.PrefixExpressionType))]);
                            throw new MathParser.EvaluationException.$ctor1(message);
                    }

                    this._evaluationStack.Push(MathParser.Value.Decimal(result));
                } else {
                    var message1 = System.String.format("Unable to execute prefix operation {0} for operand {1}.", Bridge.box(prefixExpression.PrefixExpressionType, MathParser.PrefixExpressionType, System.Enum.toStringFn(MathParser.PrefixExpressionType)), operand);
                    throw new MathParser.EvaluationException.$ctor1(message1);
                }
            },
            Visit$7: function (valueExpression) {
                if (valueExpression.Value.IsExpression) {
                    valueExpression.Value.ToExpression().Expr.MathParser$IExpression$Accept(this);
                } else {
                    this._evaluationStack.Push(valueExpression.Value);
                }
            },
            Visit$1: function (functionExpression) {
                var $t;
                functionExpression.FunctionExpression.MathParser$IExpression$Accept(this);

                $t = Bridge.getEnumerator(functionExpression.Arguments, MathParser.IExpression);
                try {
                    while ($t.moveNext()) {
                        var argument = $t.Current;
                        argument.MathParser$IExpression$Accept(this);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                var numArguments = System.Linq.Enumerable.from(functionExpression.Arguments).count();

                var $arguments = new (System.Collections.Generic.List$1(MathParser.Value)).ctor();

                for (var i = 0; i < numArguments; i = (i + 1) | 0) {
                    $arguments.add(this._evaluationStack.Pop());
                }
                $arguments.Reverse();

                var $function = this._evaluationStack.Pop();

                if ($function.IsFunction) {

                    var result = $function.ToFunction()($arguments.ToArray());
                    this._evaluationStack.Push(result);
                } else {
                    throw new MathParser.EvaluationException.$ctor1("Invalid function call with " + numArguments + " arguments.");
                }
            },
            Visit$6: function (ternaryExpression) {
                ternaryExpression.Condition.MathParser$IExpression$Accept(this);
                var conditionOperand = this._evaluationStack.Pop();

                if (conditionOperand.IsBoolean) {
                    var condition = conditionOperand.ToBoolean();

                    if (condition) {
                        ternaryExpression.TrueCase.MathParser$IExpression$Accept(this);
                    } else {
                        ternaryExpression.FalseCase.MathParser$IExpression$Accept(this);
                    }
                } else {
                    var message = System.String.format(System.String.concat("Condition in ternary operation must be boolean, got ", conditionOperand) + " instead.", null);
                    throw new MathParser.EvaluationException.$ctor1(message);
                }
            },
            Visit$9: function (variableExpression) {
                if (this._symbolManager != null && this._symbolManager.MathParser$ISymbolManager$IsSet(variableExpression.Identifier)) {
                    // TODO decide whether this is good or not , do we want to evaluate like that?!
                    var value = this._symbolManager.MathParser$ISymbolManager$Get(variableExpression.Identifier);

                    if (value.IsExpression) {
                        value.ToExpression().Expr.MathParser$IExpression$Accept(this);
                    } else {
                        this._evaluationStack.Push(value);
                    }
                } else {
                    this._evaluationStack.Push(MathParser.Value.Expression(new MathParser.Expression(variableExpression)));
                }
            },
            Visit$4: function (postfixExpression) {
                postfixExpression.LeftOperand.MathParser$IExpression$Accept(this);

                var operand = this._evaluationStack.Pop();

                if (operand.IsInteger) {
                    var value = operand;
                    var result;

                    switch (postfixExpression.PostfixExpressionType) {
                        case MathParser.PostfixExpressionType.Factorial: 
                            var res = System.Int64(1);
                            var val = value.ToInt64();
                            while (val.ne(System.Int64(1))) {
                                res = res.mul(val);
                                val = val.sub(System.Int64(1));
                            }
                            result = MathParser.Value.Integer(res);
                            break;
                        default: 
                            var message = System.String.format("Unhandled postfix operation {0}.", [Bridge.box(postfixExpression.PostfixExpressionType, MathParser.PostfixExpressionType, System.Enum.toStringFn(MathParser.PostfixExpressionType))]);
                            throw new MathParser.EvaluationException.$ctor1(message);
                    }

                    this._evaluationStack.Push(result);
                } else {
                    var message1 = System.String.format("Unable to execute postfix operation {0} for operand {1}.", Bridge.box(postfixExpression.PostfixExpressionType, MathParser.PostfixExpressionType, System.Enum.toStringFn(MathParser.PostfixExpressionType)), operand);
                    throw new MathParser.EvaluationException.$ctor1(message1);
                }
            },
            Visit$3: function (groupExpression) {
                groupExpression.Operand.MathParser$IExpression$Accept(this);
            },
            Visit$8: function (variableAssignmentExpression) {
                variableAssignmentExpression.Expression.MathParser$IExpression$Accept(this);
            },
            Visit$2: function (functionAssignmentExpression) {
                var value = MathParser.AssignVisitor.GetFunction(functionAssignmentExpression, this._symbolManager);
                this._evaluationStack.Push(value);
            }
        }
    });

    Bridge.define("MathParser.ExpectedTokenException", {
        inherits: [MathParser.ParserException],
        props: {
            TokenType: 0,
            Position: 0
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                MathParser.ParserException.ctor.call(this);
            },
            $ctor1: function (message) {
                this.$initialize();
                MathParser.ParserException.$ctor1.call(this, message);
            },
            $ctor2: function (message, innerException) {
                this.$initialize();
                MathParser.ParserException.$ctor2.call(this, message, innerException);
            },
            $ctor3: function (tokenType, position) {
                this.$initialize();
                MathParser.ParserException.$ctor1.call(this, "Expected token " + System.Enum.toString(Tokenizer.TokenType, tokenType) + " at position " + position);
                this.TokenType = tokenType;
                this.Position = position;
            }
        }
    });

    Bridge.define("MathParser.FixValueParselet", {
        inherits: [MathParser.IPrefixParselet],
        fields: {
            _value: null
        },
        alias: ["Parse", "MathParser$IPrefixParselet$Parse"],
        ctors: {
            ctor: function (value) {
                this.$initialize();
                this._value = value;
            }
        },
        methods: {
            Parse: function (parseExpression, tokenStream, token) {
                return new MathParser.ValueExpression(this._value);
            }
        }
    });

    Bridge.define("MathParser.FloatingPointNumberParselet", {
        inherits: [MathParser.IPrefixParselet],
        alias: ["Parse", "MathParser$IPrefixParselet$Parse"],
        methods: {
            Parse: function (parseExpression, tokenStream, token) {
                var result = System.Double.parse(token.Content);
                return new MathParser.ValueExpression(MathParser.Value.Decimal(result));
            }
        }
    });

    Bridge.define("MathParser.FunctionAssignmentExpression", {
        inherits: [MathParser.IExpression],
        props: {
            FunctionIdentifier: null,
            ArgumentNames: null,
            Expression: null
        },
        alias: ["Accept", "MathParser$IExpression$Accept"],
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
                MathParser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.MathParser$IExpressionVisitor$Visit$2(this);
                }), [this.Expression]);
            }
        }
    });

    Bridge.define("MathParser.GroupExpression", {
        inherits: [MathParser.IExpression],
        props: {
            Operand: null
        },
        alias: ["Accept", "MathParser$IExpression$Accept"],
        ctors: {
            ctor: function (operand) {
                this.$initialize();
                this.Operand = operand;
            }
        },
        methods: {
            Accept: function (visitor) {
                MathParser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.MathParser$IExpressionVisitor$Visit$3(this);
                }), [this.Operand]);
            }
        }
    });

    Bridge.define("MathParser.GroupParselet", {
        inherits: [MathParser.IPrefixParselet],
        alias: ["Parse", "MathParser$IPrefixParselet$Parse"],
        methods: {
            Parse: function (parseExpression, tokenStream, token) {
                var expression = parseExpression(tokenStream, 0);
                tokenStream.Consume$1(Tokenizer.TokenType.RightParenthesis);
                return new MathParser.GroupExpression(expression);
            }
        }
    });

    Bridge.define("MathParser.IntegerParselet", {
        inherits: [MathParser.IPrefixParselet],
        alias: ["Parse", "MathParser$IPrefixParselet$Parse"],
        methods: {
            Parse: function (parseExpression, tokenStream, token) {
                var result = System.Int64.parse(token.Content);
                return new MathParser.ValueExpression(MathParser.Value.Integer(result));
            }
        }
    });

    Bridge.define("MathParser.PostfixExpression", {
        inherits: [MathParser.IExpression],
        props: {
            PostfixExpressionType: 0,
            LeftOperand: null
        },
        alias: ["Accept", "MathParser$IExpression$Accept"],
        ctors: {
            ctor: function (postfixExpressionType, leftOperand) {
                this.$initialize();
                this.PostfixExpressionType = postfixExpressionType;
                this.LeftOperand = leftOperand;
            }
        },
        methods: {
            Accept: function (visitor) {
                MathParser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.MathParser$IExpressionVisitor$Visit$4(this);
                }), [this.LeftOperand]);
            }
        }
    });

    Bridge.define("MathParser.PostfixOperatorParselet", {
        inherits: [MathParser.IInfixParselet],
        fields: {
            _postfixExpressionType: 0
        },
        props: {
            Precedence: 0
        },
        alias: [
            "Parse", "MathParser$IInfixParselet$Parse",
            "Precedence", "MathParser$IInfixParselet$Precedence"
        ],
        ctors: {
            ctor: function (postfixExpressionType, precedence) {
                this.$initialize();
                this._postfixExpressionType = postfixExpressionType;
                this.Precedence = precedence;
            }
        },
        methods: {
            Parse: function (parseExpression, tokenStream, leftExpression) {
                return new MathParser.PostfixExpression(this._postfixExpressionType, leftExpression);
            }
        }
    });

    Bridge.define("MathParser.PrefixExpression", {
        inherits: [MathParser.IExpression],
        props: {
            PrefixExpressionType: 0,
            RightOperand: null
        },
        alias: ["Accept", "MathParser$IExpression$Accept"],
        ctors: {
            ctor: function (prefixExpressionType, rightOperand) {
                this.$initialize();
                this.PrefixExpressionType = prefixExpressionType;
                this.RightOperand = rightOperand;
            }
        },
        methods: {
            Accept: function (visitor) {
                MathParser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.MathParser$IExpressionVisitor$Visit$5(this);
                }), [this.RightOperand]);
            }
        }
    });

    Bridge.define("MathParser.PrefixOperatorParselet", {
        inherits: [MathParser.IPrefixParselet],
        fields: {
            _prefixExpressionType: 0,
            _precedence: 0
        },
        alias: ["Parse", "MathParser$IPrefixParselet$Parse"],
        ctors: {
            ctor: function (prefixExpressionType, precedence) {
                this.$initialize();
                this._prefixExpressionType = prefixExpressionType;
                this._precedence = precedence;
            }
        },
        methods: {
            Parse: function (parseExpression, tokenStream, token) {
                var operand = parseExpression(tokenStream, this._precedence);
                return new MathParser.PrefixExpression(this._prefixExpressionType, operand);
            }
        }
    });

    Bridge.define("MathParser.SymbolicExpression", {
        inherits: [MathParser.IExpression],
        props: {
            Operand: null
        },
        alias: ["Accept", "MathParser$IExpression$Accept"],
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

    Bridge.define("MathParser.SymbolManager", {
        inherits: [MathParser.ISymbolManager],
        fields: {
            _symbols: null
        },
        alias: [
            "IsSet", "MathParser$ISymbolManager$IsSet",
            "Get", "MathParser$ISymbolManager$Get",
            "Set", "MathParser$ISymbolManager$Set"
        ],
        ctors: {
            init: function () {
                this._symbols = new (System.Collections.Generic.Dictionary$2(MathParser.Identifier,MathParser.Value))();
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

    Bridge.define("MathParser.TernaryExpression", {
        inherits: [MathParser.IExpression],
        props: {
            Condition: null,
            TrueCase: null,
            FalseCase: null
        },
        alias: ["Accept", "MathParser$IExpression$Accept"],
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
                MathParser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.MathParser$IExpressionVisitor$Visit$6(this);
                }), [this.Condition, this.TrueCase, this.FalseCase]);
            }
        }
    });

    Bridge.define("MathParser.TernaryParselet", {
        inherits: [MathParser.IInfixParselet],
        props: {
            Precedence: {
                get: function () {
                    return MathParser.Precedences.CONDITIONAL;
                }
            }
        },
        alias: [
            "Parse", "MathParser$IInfixParselet$Parse",
            "Precedence", "MathParser$IInfixParselet$Precedence"
        ],
        methods: {
            Parse: function (parseExpression, tokenStream, leftExpression) {
                var trueExpression = parseExpression(tokenStream, 0);
                tokenStream.Consume$1(Tokenizer.TokenType.Colon);
                var falseExpression = parseExpression(tokenStream, ((MathParser.Precedences.CONDITIONAL + MathParser.AssociativityExtensions.ToPrecedenceIncrement(MathParser.Associativity.Right)) | 0));
                return new MathParser.TernaryExpression(leftExpression, trueExpression, falseExpression);
            }
        }
    });

    Bridge.define("MathParser.UnknownVariableException", {
        inherits: [MathParser.ParserException],
        ctors: {
            ctor: function () {
                this.$initialize();
                MathParser.ParserException.ctor.call(this);
            },
            $ctor1: function (message) {
                this.$initialize();
                MathParser.ParserException.$ctor1.call(this, message);
            },
            $ctor2: function (message, innerException) {
                this.$initialize();
                MathParser.ParserException.$ctor2.call(this, message, innerException);
            }
        }
    });

    Bridge.define("MathParser.ValueExpression", {
        inherits: [MathParser.IExpression],
        props: {
            Value: null
        },
        alias: ["Accept", "MathParser$IExpression$Accept"],
        ctors: {
            ctor: function (value) {
                this.$initialize();
                this.Value = value;
            }
        },
        methods: {
            Accept: function (visitor) {
                if (this.Value.IsExpression) {
                    MathParser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                        visitor.MathParser$IExpressionVisitor$Visit$7(this);
                    }), [this.Value.ToExpression().Expr]);
                } else {
                    MathParser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                        visitor.MathParser$IExpressionVisitor$Visit$7(this);
                    }));
                }
            }
        }
    });

    Bridge.define("MathParser.VariableAssignmentExpression", {
        inherits: [MathParser.IExpression],
        props: {
            Identifier: null,
            Expression: null
        },
        alias: ["Accept", "MathParser$IExpression$Accept"],
        ctors: {
            ctor: function (identifier, expression) {
                this.$initialize();
                this.Identifier = identifier;
                this.Expression = expression;
            }
        },
        methods: {
            Accept: function (visitor) {
                MathParser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.MathParser$IExpressionVisitor$Visit$8(this);
                }), [this.Expression]);
            }
        }
    });

    Bridge.define("MathParser.VariableExpression", {
        inherits: [MathParser.IExpression],
        props: {
            Identifier: null
        },
        alias: ["Accept", "MathParser$IExpression$Accept"],
        ctors: {
            ctor: function (identifier) {
                this.$initialize();
                this.Identifier = identifier;
            }
        },
        methods: {
            Accept: function (visitor) {
                MathParser.ExpressionVisitorExtensions.Traverse(visitor, Bridge.fn.bind(this, function () {
                    visitor.MathParser$IExpressionVisitor$Visit$9(this);
                }));
            }
        }
    });

    Bridge.define("MathParser.VariableParselet", {
        inherits: [MathParser.IPrefixParselet],
        alias: ["Parse", "MathParser$IPrefixParselet$Parse"],
        methods: {
            Parse: function (parseExpression, tokenStream, token) {
                return new MathParser.VariableExpression(MathParser.Identifier.op_Implicit(token.Content));
            }
        }
    });

    Bridge.define("MathParser.AssignVisitor", {
        inherits: [MathParser.BottomUpExpressionVisitor],
        statics: {
            methods: {
                GetFunction: function (functionAssignmentExpression, symbolManager) {
                    return MathParser.Value.Function(function (args) {
                        var fExpEvaluationVisitor = new MathParser.FunctionExpressionVisitor(functionAssignmentExpression.ArgumentNames, args, symbolManager);
                        functionAssignmentExpression.Expression.MathParser$IExpression$Accept(fExpEvaluationVisitor);
                        return fExpEvaluationVisitor.GetResult();
                    });
                }
            }
        },
        fields: {
            _symbolManager: null
        },
        alias: [
            "Visit$8", "MathParser$IExpressionVisitor$Visit$8",
            "Visit$2", "MathParser$IExpressionVisitor$Visit$2"
        ],
        ctors: {
            ctor: function (symbolManager) {
                this.$initialize();
                MathParser.BottomUpExpressionVisitor.ctor.call(this);
                this._symbolManager = symbolManager;
            }
        },
        methods: {
            Visit$8: function (variableAssignmentExpression) {
                var evaluationVisitor = new MathParser.EvaluationVisitor(this._symbolManager);
                variableAssignmentExpression.Expression.MathParser$IExpression$Accept(evaluationVisitor);

                this._symbolManager.MathParser$ISymbolManager$Set(variableAssignmentExpression.Identifier, evaluationVisitor.GetResult());
            },
            Visit$2: function (functionAssignmentExpression) {
                this._symbolManager.MathParser$ISymbolManager$Set(functionAssignmentExpression.FunctionIdentifier, MathParser.AssignVisitor.GetFunction(functionAssignmentExpression, this._symbolManager));
            }
        }
    });

    Bridge.define("MathParser.FunctionExpressionVisitor", {
        inherits: [MathParser.EvaluationVisitor],
        fields: {
            argNames: null,
            arguments: null
        },
        alias: ["Visit$9", "MathParser$IExpressionVisitor$Visit$9"],
        ctors: {
            ctor: function (argNames, $arguments, symbolProvider) {
                this.$initialize();
                MathParser.EvaluationVisitor.ctor.call(this, symbolProvider);
                this.argNames = argNames;
                this.arguments = $arguments;
            }
        },
        methods: {
            Visit$9: function (variableExpression) {
                if (System.Linq.Enumerable.from(this.argNames).contains(variableExpression.Identifier)) {
                    var idx = System.Linq.Enumerable.from(this.argNames).toList(MathParser.Identifier).indexOf(variableExpression.Identifier);
                    this._evaluationStack.Push(this.arguments[System.Array.index(idx, this.arguments)]);
                } else {
                    MathParser.EvaluationVisitor.prototype.Visit$9.call(this, variableExpression);
                }
            }
        }
    });

    Bridge.define("MathParser.GraphvizVisitor", {
        inherits: [MathParser.BottomUpExpressionVisitor],
        fields: {
            stringBuilder: null,
            id: 0,
            idStack: null
        },
        alias: [
            "Visit$1", "MathParser$IExpressionVisitor$Visit$1",
            "Visit$6", "MathParser$IExpressionVisitor$Visit$6",
            "Visit", "MathParser$IExpressionVisitor$Visit",
            "Visit$7", "MathParser$IExpressionVisitor$Visit$7",
            "Visit$9", "MathParser$IExpressionVisitor$Visit$9",
            "Visit$5", "MathParser$IExpressionVisitor$Visit$5"
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
                this.consume(System.Enum.toString(MathParser.BinaryExpressionType, binaryExpression.BinaryExpressionType), 2);
            },
            Visit$7: function (valueExpression) {
                this.consume(valueExpression.Value.toString(), 0);
            },
            Visit$9: function (variableExpression) {
                this.consume(MathParser.Identifier.op_Implicit$1(variableExpression.Identifier), 0);
            },
            Visit$5: function (prefixExpression) {
                this.consume(System.Enum.toString(MathParser.PrefixExpressionType, prefixExpression.PrefixExpressionType), 1);
            },
            consume: function (nodeName, count) {
                var $t;
                this.stringBuilder.appendLine(System.String.format("node{0} [ label = \"{1}\" ];", Bridge.box(this.id, System.Int32), nodeName));

                var childIds = System.Linq.Enumerable.range(0, count).select(Bridge.fn.bind(this, $asm.$.MathParser.GraphvizVisitor.f1)).reverse();
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

    Bridge.ns("MathParser.GraphvizVisitor", $asm.$);

    Bridge.apply($asm.$.MathParser.GraphvizVisitor, {
        f1: function (x) {
            return this.idStack.Pop();
        }
    });

    Bridge.define("MathParser.PrintVisitor", {
        inherits: [MathParser.BottomUpExpressionVisitor],
        fields: {
            _stack: null
        },
        alias: [
            "Visit", "MathParser$IExpressionVisitor$Visit",
            "Visit$7", "MathParser$IExpressionVisitor$Visit$7",
            "Visit$6", "MathParser$IExpressionVisitor$Visit$6",
            "Visit$9", "MathParser$IExpressionVisitor$Visit$9",
            "Visit$5", "MathParser$IExpressionVisitor$Visit$5",
            "Visit$4", "MathParser$IExpressionVisitor$Visit$4",
            "Visit$1", "MathParser$IExpressionVisitor$Visit$1",
            "Visit$8", "MathParser$IExpressionVisitor$Visit$8",
            "Visit$2", "MathParser$IExpressionVisitor$Visit$2"
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
                    throw new MathParser.EvaluationException.$ctor1(message);
                }
            },
            Visit: function (binaryExpression) {
                var infix;
                switch (binaryExpression.BinaryExpressionType) {
                    case MathParser.BinaryExpressionType.Addition: 
                        infix = "+";
                        break;
                    case MathParser.BinaryExpressionType.Division: 
                        infix = "/";
                        break;
                    case MathParser.BinaryExpressionType.Multiplication: 
                        infix = "*";
                        break;
                    case MathParser.BinaryExpressionType.Power: 
                        infix = "^";
                        break;
                    case MathParser.BinaryExpressionType.Substraction: 
                        infix = "-";
                        break;
                    case MathParser.BinaryExpressionType.Modulo: 
                        infix = "%";
                        break;
                    case MathParser.BinaryExpressionType.Equal: 
                        infix = "==";
                        break;
                    case MathParser.BinaryExpressionType.NotEqual: 
                        infix = "!=";
                        break;
                    case MathParser.BinaryExpressionType.Less: 
                        infix = "<";
                        break;
                    case MathParser.BinaryExpressionType.LessOrEqual: 
                        infix = "<=";
                        break;
                    case MathParser.BinaryExpressionType.Greater: 
                        infix = ">";
                        break;
                    case MathParser.BinaryExpressionType.GreaterOrEqual: 
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
                this._stack.Push(MathParser.Identifier.op_Implicit$1(variableExpression.Identifier));
            },
            Visit$5: function (prefixExpression) {
                var prefix;
                switch (prefixExpression.PrefixExpressionType) {
                    case MathParser.PrefixExpressionType.Negation: 
                        prefix = "-";
                        break;
                    case MathParser.PrefixExpressionType.Positive: 
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
                    case MathParser.PostfixExpressionType.Factorial: 
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
                var args = Bridge.toArray(System.Linq.Enumerable.from(functionExpression.Arguments).select(Bridge.fn.bind(this, $asm.$.MathParser.PrintVisitor.f1)).reverse()).join(",");
                var functionName = this._stack.Pop();
                this._stack.Push((functionName || "") + "(" + (args || "") + ")");
            },
            Visit$8: function (variableAssignmentExpression) {
                this._stack.Push(System.String.concat("(", MathParser.Identifier.op_Implicit$1(variableAssignmentExpression.Identifier)) + " = " + (this._stack.Pop() || "") + ")");
            },
            Visit$2: function (functionAssignmentExpression) {
                this._stack.Push(System.String.concat("(", MathParser.Identifier.op_Implicit$1(functionAssignmentExpression.FunctionIdentifier)) + "(" + (Bridge.toArray(functionAssignmentExpression.ArgumentNames).join(", ") || "") + ")" + " = " + (this._stack.Pop() || "") + ")");
            }
        }
    });

    Bridge.ns("MathParser.PrintVisitor", $asm.$);

    Bridge.apply($asm.$.MathParser.PrintVisitor, {
        f1: function (arg) {
            return this._stack.Pop();
        }
    });
});
