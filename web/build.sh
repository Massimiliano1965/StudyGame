#!/bin/sh
# Versione web (iPhone, PC, Android): crea la cartella "site" senza Cordova e con l'avviso sul blocco schermo
set -e
rm -rf site
cp -r www site
cp web/webnote.js site/js/webnote.js
sed -i '/src="cordova.js"/d' site/index.html
sed -i 's|  <script src="js/config.js"></script>|  <script src="js/webnote.js"></script>\n  <script src="js/config.js"></script>|' site/index.html
grep -q webnote.js site/index.html
# ogni pubblicazione ha un numero diverso sui file: il browser non usa più la copia vecchia che ha in memoria
V=$(git rev-parse --short HEAD 2>/dev/null || date +%s)
sed -i -E "s#(src|href)=\"((js|css)/[^\"?]+)\"#\1=\"\2?v=$V\"#g" site/index.html
grep -q "webnote.js?v=" site/index.html
