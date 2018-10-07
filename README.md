# CalcBuddy

[![Build status](https://ci.appveyor.com/api/projects/status/9cakg8kde4u480c9/branch/master?svg=true)](https://ci.appveyor.com/project/timmi-on-rails/calcbuddy/branch/master)

Binary: https://ci.appveyor.com/api/projects/timmi-on-rails/CalcBuddy/artifacts/CalcBuddy/bin/CalcBuddy.zip

Ideas:
- CalcBuddy goes Web (-> Bridge.NET)
- Easy Syntax, yet technical
- Notebook style calculations
- Package system for imports
- Share packages
- Save/Load Calculations (to file + web)
- Share Calculations with link

Roadmap:
1. Get working Stack (Progressive Web App + Bridge.NET + Retyped + MathParser + JS Editor (ace, codemirror, ...))
2. Implement first version of minimum set of the language supported. (Discuss expression vs. statement and when to evaluate and when not. Are more than one statements per line ok? Are multiline expressions ok?). Also do we want big numbers? What are the tokens of the language?
3. Evaluate Change Detection and partial calculation of consecutive results on change

- Make sure App is offline compatible
- Create Help&Feedback system
- Let community take part in development
- Add autocompletion
- Discuss language characteristics (tokenizer + parser)
- Add functions and so on
- Implement package/import system
- Fine tune optics
- Do some marketing/web site
- Write an updater integrated with the PWA
- Add concept to store calculations in the cloud with link
- Discuss whether advanced features like plotting should become part of calcbuddy
- Discuss whether the output should be pretty formatted (latex) or technical and direct...
