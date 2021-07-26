# BetterNY
## Features
- Many site embed support
- Minimize user's **loooong** username
- Color text(WIP)
- Live theme change
- Markdowns(WIP)
- and more!
## How to install(Chrome)
1. Open F12
2. Click "Sources"
3. Open main.js
4. Copy & Paste source.js to main.js
5. enjoy
## How to install(feature) not working now
1. Open console
2. Enter below command\

```
let head=document.getElementsByTagName("head")[0],script=document.createElement("script");script.type="text/javascript",script.onload=function(){initBetterNy()},script.src="https://raw.githubusercontent.com/NamuTree0345/BetterNY/main/new.main.js",head.appendChild(script);
```
If not works\
```
let head = document.getElementsByTagName('body')[0];
let script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function() {
    initBetterNy();
}
script.src = 'https://gitcdn.xyz/cdn/NamuTree0345/BetterNY/0d2bc24edd7721fc78e63a41a5ab36059e1697dc/new.main.js';
head.appendChild(script);
```
3. Enjoy
