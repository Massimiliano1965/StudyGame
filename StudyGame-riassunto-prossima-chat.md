# Studia e Gioca: riassunto per la prossima chat

Progetto: Studia e Gioca (repo GitHub Massimiliano1965/StudyGame, app Android Cordova).

## Stato
- Ultimo commit su main: f17bf01 (voce inglese).
- Ultima build verde confermata: run #16 (commit bd0690d). La build del commit f17bf01 va ancora controllata sulla pagina della singola run in GitHub Actions (artefatto StudyGame-apk).
- Materie col bollino verde: Matematica, Italiano, Inglese.

## Fatto nella fase "Voce inglese"
- Le parole inglesi sono lette con voce en-US, il resto in italiano: domande, Corsa, Tiro a segno, Incastro e feedback dopo la risposta.
- voce.js: `Voice.speak` accetta una stringa oppure una lista di pezzi `{ t, l: "en" }`. Con il plugin TTS ogni pezzo parte con il suo locale.
- questions.js: ogni domanda di inglese ha `en` (parole inglesi) e, se le risposte sono tutte inglesi, `ae: true`. `shuffleWithAnswer` li conserva.
- games.js: l'Incastro di inglese ha `eng` e `rEn` (true solo nei temi "contrario" e "passato dei verbi irregolari", dove anche i pezzi sono inglesi).
- app.js: `langSegs`, `ansSegs`, `fin`, poi `roundSpeech`, `questionSpeech`, `feedbackSpeech`.
- NON ancora provato su telefono: la voce inglese va verificata dopo la build.

## Fatto dopo: scene, esplosione, voce
- Voce inglese provata sul telefono: funziona. Ora va un po' più veloce (en: 1.15, italiano invariato).
- Incastro completato: al posto delle caselle appare una scena a tema (emoji, offline), con didascalia e le coppie. Scene in games.js (`SCENES`, `SCENE_RULES`, `sceneKey`, `sceneHtml`), scelte dal testo della consegna. Nuovo tema inglese "tavola" (bread, banana, bottle, plate...).
- Secondo errore: il puzzle esplode (BOOM) e ricomincia da capo con pezzi rimescolati; nessun minuto perso. Il primo errore si perdona. `Games.setBoom` suona Sfx.no.
- NON ancora provato su telefono: scene ed esplosione.

## Da fare
- Provare la voce inglese sul telefono (una domanda "Come si dice «gatto» in inglese?" e un Incastro dei colori). Se non parte, dirlo e si guarda.
- Poi la prossima materia/gioco: la decide Massi.

## Regole di Massi (da rispettare sempre)
- Rispondere subito, senza giri. Non fargli fare 10 comandi.
- Scrivere e pubblicare su main quando ha già dato il SÌ.
- Build solo da GitHub Actions, controllata sulla pagina della singola run.
- Un gioco alla volta, funzionante, solo quello che dice lui.
- Non centrare i bottoni con transform. Non mettere BackgroundColor in config.xml.
- Prima di caricare su GitHub, aspettare 4 o 5 modifiche importanti: non strumento dopo strumento dopo strumento.
- A ogni fase chiusa: scrivere "FASE CHIUSA: ti conviene aprire una nuova chat" sia all'INIZIO sia alla FINE del messaggio (Massi a volte non legge la fine), e allegare direttamente il file di riassunto per la nuova chat.
