#!/bin/sh
# Versione web (iPhone, PC, Android): crea la cartella "site" senza Cordova e con l'avviso sul blocco schermo
set -e
rm -rf site
cp -r www site
cp web/webnote.js site/js/webnote.js
sed -i '/src="cordova.js"/d' site/index.html
sed -i 's|  <script src="js/config.js"></script>|  <script src="js/webnote.js"></script>\n  <script src="js/config.js"></script>|' site/index.html
grep -q webnote.js site/index.html
