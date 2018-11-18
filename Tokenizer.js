/**
 * @version 1.0.6896.26105
 * @copyright tom
 * @compiler Bridge.NET 17.4.0
 */
Bridge.assembly("Tokenizer", function ($asm, globals) {
    "use strict";

    Bridge.define("Tokenizer.ErrorCode", {
        $kind: "enum",
        statics: {
            fields: {
                Ok: 0,
                ExpectedDecimal: 1,
                Unknown: 2,
                NotAllowedIdentifierCharacters: 3
            }
        }
    });

    Bridge.define("Tokenizer.TextReaderTokenizer", {
        fields: {
            tokenContentBuilder: null,
            textReader: null,
            index: 0,
            peek: 0
        },
        ctors: {
            init: function () {
                this.tokenContentBuilder = new System.Text.StringBuilder();
            },
            ctor: function (textReader) {
                this.$initialize();
                this.textReader = textReader;
            }
        },
        methods: {
            Consume: function () {

                this.tokenContentBuilder.append(String.fromCharCode((this.peek & 65535)));
                this.index = (this.index + 1) | 0;
                this.peek = this.textReader.Read();
            },
            CreateToken: function (tokenType, errorCode) {
                if (errorCode === void 0) { errorCode = 0; }
                var content = this.tokenContentBuilder.toString();
                this.tokenContentBuilder.clear();
                var startPosition = (this.index - content.length) | 0;
                return new Tokenizer.Token(tokenType, content, startPosition, errorCode);
            },
            PeekIsPunctuation: function () {
                return this.peek === 60 || this.peek === 62 || this.peek === 40 || this.peek === 41 || this.peek === 33 || this.peek === 94 || this.peek === 42 || this.peek === 43 || this.peek === 45 || this.peek === 61 || this.peek === 47 || this.peek === 37 || this.peek === 44 || this.peek === 63 || this.peek === 58 || this.peek === 59 || this.peek === 46 || this.peek === 123 || this.peek === 125 || this.peek === 91 || this.peek === 93 || this.peek === 38 || this.peek === 124 || this.peek === 126;
            },
            PeekIsDigit: function () {
                return 48 <= this.peek && this.peek <= 57;
            },
            PeekIsLetter: function () {
                return (97 <= this.peek && this.peek <= 122) || (65 <= this.peek && this.peek <= 90);
            },
            PeekIsWhiteSpace: function () {
                return this.peek === 32 || this.peek === 9;
            },
            PeekIsEOF: function () {
                return this.peek === -1;
            },
            PeekIsWordSeparator: function () {
                return this.PeekIsWhiteSpace() || this.PeekIsPunctuation() || this.PeekIsEOF();
            },
            Scan: function () {
                return new (Bridge.GeneratorEnumerable$1(Tokenizer.Token))(Bridge.fn.bind(this, function ()  {
                    var $step = 0,
                        $jumpFromFinally,
                        $returnValue,
                        $async_e;

                    var $enumerator = new (Bridge.GeneratorEnumerator$1(Tokenizer.Token))(Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                switch ($step) {
                                    case 0: {
                                        this.peek = this.textReader.Read();
                                        $step = 1;
                                        continue;
                                    }
                                    case 1: {
                                        if ( this.peek !== -1 ) {
                                                $step = 2;
                                                continue;
                                            } 
                                            $step = 24;
                                            continue;
                                    }
                                    case 2: {
                                        if (this.PeekIsLetter() || this.peek === 95) {
                                                $step = 3;
                                                continue;
                                            } else  {
                                                $step = 5;
                                                continue;
                                            }
                                    }
                                    case 3: {
                                        $enumerator.current = this.ScanIdentifier();
                                            $step = 4;
                                            return true;
                                    }
                                    case 4: {
                                        $step = 23;
                                        continue;
                                    }
                                    case 5: {
                                        if (this.PeekIsWhiteSpace()) {
                                                $step = 6;
                                                continue;
                                            } else  {
                                                $step = 8;
                                                continue;
                                            }
                                    }
                                    case 6: {
                                        $enumerator.current = this.ScanWhiteSpace();
                                            $step = 7;
                                            return true;
                                    }
                                    case 7: {
                                        $step = 22;
                                        continue;
                                    }
                                    case 8: {
                                        if (this.peek === 46) {
                                                $step = 9;
                                                continue;
                                            } else  {
                                                $step = 11;
                                                continue;
                                            }
                                    }
                                    case 9: {
                                        $enumerator.current = this.ScanDecimal();
                                            $step = 10;
                                            return true;
                                    }
                                    case 10: {
                                        $step = 21;
                                        continue;
                                    }
                                    case 11: {
                                        if (this.PeekIsPunctuation()) {
                                                $step = 12;
                                                continue;
                                            } else  {
                                                $step = 14;
                                                continue;
                                            }
                                    }
                                    case 12: {
                                        $enumerator.current = this.ScanPunctuation();
                                            $step = 13;
                                            return true;
                                    }
                                    case 13: {
                                        $step = 20;
                                        continue;
                                    }
                                    case 14: {
                                        if (this.PeekIsDigit()) {
                                                $step = 15;
                                                continue;
                                            } else  {
                                                $step = 17;
                                                continue;
                                            }
                                    }
                                    case 15: {
                                        $enumerator.current = this.ScanInteger();
                                            $step = 16;
                                            return true;
                                    }
                                    case 16: {
                                        $step = 19;
                                        continue;
                                    }
                                    case 17: {
                                        $enumerator.current = this.ScanWord(Tokenizer.ErrorCode.Unknown);
                                            $step = 18;
                                            return true;
                                    }
                                    case 18: {
                                        $step = 19;
                                        continue;
                                    }
                                    case 19: {
                                        $step = 20;
                                        continue;
                                    }
                                    case 20: {
                                        $step = 21;
                                        continue;
                                    }
                                    case 21: {
                                        $step = 22;
                                        continue;
                                    }
                                    case 22: {
                                        $step = 23;
                                        continue;
                                    }
                                    case 23: {
                                        
                                            $step = 1;
                                            continue;
                                    }
                                    case 24: {
                                        $enumerator.current = this.CreateToken(Tokenizer.TokenType.EndOfFile);
                                            $step = 25;
                                            return true;
                                    }
                                    case 25: {

                                    }
                                    default: {
                                        return false;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            throw $async_e;
                        }
                    }));
                    return $enumerator;
                }));
            },
            ScanIdentifier: function () {
                do {
                    this.Consume();
                } while (this.PeekIsLetter() || this.PeekIsDigit() || this.peek === 95);

                if (!this.PeekIsWordSeparator()) {
                    return this.ScanWord(Tokenizer.ErrorCode.NotAllowedIdentifierCharacters);
                }

                return this.CreateToken(Tokenizer.TokenType.Identifier);
            },
            ScanInteger: function () {
                do {
                    this.Consume();
                } while (this.PeekIsDigit());

                if (this.peek === 46 || this.peek === 101) {
                    return this.ScanDecimal();
                }

                return this.CreateToken(Tokenizer.TokenType.Integer);
            },
            ScanDecimal: function () {
                while (this.PeekIsDigit()) {
                    this.Consume();
                }

                if (this.peek === 46) {
                    this.Consume();

                    var anyDigits = false;

                    while (this.PeekIsDigit()) {
                        this.Consume();
                        anyDigits = true;
                    }

                    if (!anyDigits) {
                        if (this.tokenContentBuilder.getLength() === 1) {
                            return this.CreateToken(Tokenizer.TokenType.Dot);
                        }

                        return this.ScanWord(Tokenizer.ErrorCode.ExpectedDecimal);
                    }
                }

                if (this.peek === 101) {
                    this.Consume();

                    if (this.peek === 43 || this.peek === 45) {
                        this.Consume();
                    }

                    while (this.PeekIsDigit()) {
                        this.Consume();
                    }
                }

                return this.CreateToken(Tokenizer.TokenType.Decimal);
            },
            ScanPunctuation: function () {
                switch (this.peek) {
                    case 58: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.Colon);
                    case 40: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.LeftParenthesis);
                    case 41: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.RightParenthesis);
                    case 62: 
                        this.Consume();
                        if (this.peek === 61) {
                            this.Consume();
                            return this.CreateToken(Tokenizer.TokenType.GreaterOrEqual);
                        }
                        return this.CreateToken(Tokenizer.TokenType.Greater);
                    case 60: 
                        this.Consume();
                        if (this.peek === 61) {
                            this.Consume();
                            return this.CreateToken(Tokenizer.TokenType.LessOrEqual);
                        }
                        if (this.peek === 62) {
                            this.Consume();
                            return this.CreateToken(Tokenizer.TokenType.NotEqual);
                        }
                        return this.CreateToken(Tokenizer.TokenType.Less);
                    case 126: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.Tilde);
                    case 43: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.Plus);
                    case 45: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.Minus);
                    case 61: 
                        this.Consume();
                        if (this.peek === 61) {
                            this.Consume();
                            return this.CreateToken(Tokenizer.TokenType.Equal);
                        }
                        return this.CreateToken(Tokenizer.TokenType.Assignment);
                    case 33: 
                        this.Consume();
                        if (this.peek === 61) {
                            this.Consume();
                            return this.CreateToken(Tokenizer.TokenType.NotEqual);
                        }
                        return this.CreateToken(Tokenizer.TokenType.Exclamation);
                    case 42: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.Star);
                    case 47: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.Slash);
                    case 37: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.Percent);
                    case 44: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.Comma);
                    case 94: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.Pow);
                    case 63: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.QuestionMark);
                    case 59: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.Semicolon);
                    case 46: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.Dot);
                    case 123: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.CurlyLeft);
                    case 125: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.CurlyRight);
                    case 91: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.BracketLeft);
                    case 93: 
                        this.Consume();
                        return this.CreateToken(Tokenizer.TokenType.BracketRight);
                    case 38: 
                        this.Consume();
                        if (this.peek === 38) {
                            this.Consume();
                            return this.CreateToken(Tokenizer.TokenType.AndDouble);
                        }
                        return this.CreateToken(Tokenizer.TokenType.AndSingle);
                    case 124: 
                        this.Consume();
                        if (this.peek === 124) {
                            this.Consume();
                            return this.CreateToken(Tokenizer.TokenType.PipeDouble);
                        }
                        return this.CreateToken(Tokenizer.TokenType.PipeSingle);
                    default: 
                        throw new System.ArgumentException.$ctor1("bug, punctuation expected");
                }
            },
            ScanWhiteSpace: function () {
                do {
                    this.Consume();
                } while (this.PeekIsWhiteSpace());

                return this.CreateToken(Tokenizer.TokenType.WhiteSpace);
            },
            ScanWord: function (errorCode) {
                while (!this.PeekIsWordSeparator()) {
                    this.Consume();
                }

                return this.CreateToken(Tokenizer.TokenType.Unknown, errorCode);
            }
        }
    });

    Bridge.define("Tokenizer.Token", {
        props: {
            TokenType: 0,
            Content: null,
            Position: 0,
            ErrorCode: 0
        },
        ctors: {
            ctor: function (tokenType, content, position, errorCode) {
                this.$initialize();
                this.TokenType = tokenType;
                this.Content = content;
                this.Position = position;
                this.ErrorCode = errorCode;
            }
        }
    });

    Bridge.define("Tokenizer.Tokenize", {
        statics: {
            methods: {
                FromString: function (content) {
                    return new Tokenizer.Tokenize.TokenEnumerableFromString(content);
                }
            }
        }
    });

    Bridge.define("Tokenizer.TokenType", {
        $kind: "enum",
        statics: {
            fields: {
                Tilde: 0,
                Assignment: 1,
                Equal: 2,
                NotEqual: 3,
                LeftParenthesis: 4,
                RightParenthesis: 5,
                Plus: 6,
                Minus: 7,
                Star: 8,
                Slash: 9,
                Pow: 10,
                Identifier: 11,
                Integer: 12,
                Decimal: 13,
                QuestionMark: 14,
                Colon: 15,
                Semicolon: 16,
                Dot: 17,
                CurlyLeft: 18,
                CurlyRight: 19,
                BracketLeft: 20,
                BracketRight: 21,
                EndOfFile: 22,
                Less: 23,
                Greater: 24,
                Comma: 25,
                Unknown: 26,
                LessOrEqual: 27,
                GreaterOrEqual: 28,
                WhiteSpace: 29,
                Percent: 30,
                Exclamation: 31,
                AndDouble: 32,
                AndSingle: 33,
                PipeSingle: 34,
                PipeDouble: 35
            }
        }
    });

    Bridge.define("Tokenizer.Tokenize.TokenEnumerableFromString", {
        inherits: [System.Collections.Generic.IEnumerable$1(Tokenizer.Token)],
        $kind: "nested class",
        fields: {
            content: null,
            alreadyIterated: false
        },
        alias: ["GetEnumerator", ["System$Collections$Generic$IEnumerable$1$Tokenizer$Token$GetEnumerator", "System$Collections$Generic$IEnumerable$1$GetEnumerator"]],
        ctors: {
            ctor: function (content) {
                this.$initialize();
                this.content = content;
            }
        },
        methods: {
            GetEnumerator: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    textReader,
                    tokenizer,
                    $t,
                    token,
                    $async_e,
                    $async_e1;

                var $enumerator = new (Bridge.GeneratorEnumerator$1(Tokenizer.Token))(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    if (this.alreadyIterated) {
                                            throw new System.InvalidOperationException.$ctor1("It is not allowed to iterate more than once.");
                                        }

                                        this.alreadyIterated = true;

                                        textReader = new System.IO.StringReader(this.content);
                                    $step = 1;
                                    continue;
                                }
                                case 1: {
                                    tokenizer = new Tokenizer.TextReaderTokenizer(textReader);

                                        $t = Bridge.getEnumerator(tokenizer.Scan(), Tokenizer.Token);
                                        $step = 2;
                                        continue;
                                }
                                case 2: {
                                    if ($t.moveNext()) {
                                            token = $t.Current;
                                            $step = 3;
                                            continue;
                                        }
                                    $step = 5;
                                    continue;
                                }
                                case 3: {
                                    $enumerator.current = token;
                                        $step = 4;
                                        return true;
                                }
                                case 4: {
                                    $step = 2;
                                    continue;
                                }
                                case 5: {
                                    $step = 6;
                                    continue;
                                }
                                case 6: {
                                    if (Bridge.hasValue(textReader)) textReader.System$IDisposable$Dispose();

                                        if ($jumpFromFinally > -1) {
                                            $step = $jumpFromFinally;
                                            $jumpFromFinally = null;
                                        } else if ($async_e) {
                                            throw $async_e;
                                            return;
                                        } else if (Bridge.isDefined($returnValue)) {
                                            $tcs.setResult($returnValue);
                                            return;
                                        }
                                    $step = 7;
                                    continue;
                                }
                                case 7: {

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        if ($step >= 1 && $step <= 5){

                            $step = 6;
                            $enumerator.moveNext();
                            return;
                        }
                        throw $async_e;
                    }
                }), function () {
                    if ($step >= 1 && $step <= 5){

                        $step = 6;
                        $enumerator.moveNext();
                        return;
                    }

                });
                return $enumerator;
            },
            System$Collections$IEnumerable$GetEnumerator: function () {
                return this.GetEnumerator();
            }
        }
    });
});
