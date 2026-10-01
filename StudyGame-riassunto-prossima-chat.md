# Studia e Gioca: riassunto per la prossima chat

Progetto: Studia e Gioca, app Android (Cordova) per ragazzi 6–12 anni: si risponde a quiz e giochi di scuola per guadagnare tempo di telefono (30 min garantiti al giorno, tetto 2h30, +2 min per risposta giusta, −1 per sbagliata). Autore: Massi (non è sviluppatore di mestiere, lavora dal telefono e prova tutto sul suo telefono Android).

## Dove sta il codice
- Repo GitHub: Massimiliano1965/StudyGame (clone: https://github.com/Massimiliano1965/studygame). Branch unico: main.
- Build: solo da GitHub Actions, workflow "Build APK" (.github/workflows/build.yml). Artefatto: StudyGame-apk. Plugin: cordova-plugin-tts-advanced@0.5.3 e plugins-local/speechrecognition.
- Ultimo commit su main e ultima build verde: da controllare con `gh run list -R Massimiliano1965/StudyGame -L 3` (all'ultimo controllo: run #25 verde, commit 5cdf256, più il commit dell'intestazione pulita).
- Dalla sessione cloud: `gh` e `git` funzionano; il repo va aggiunto con add_repo (push) e clonato in /home/claude/studygame.

## File principali (www/)
- js/config.js: regole (minuti, GAME_SHARE 0.7, GAME_SHARE_SMALL 0.95 per 1ª–3ª elementare).
- js/subjects.js: 12 materie in elenco; READY_SUBJECTS = matematica, italiano, inglese (le altre 9 non hanno domande: "arriva presto").
- js/questions.js: banco domande (inglese ha circa 20 domande: poco, va allargato). Ogni domanda inglese ha `en` (parole inglesi per la voce) e `ae` se le risposte sono tutte inglesi.
- js/games.js: tutti i giochi. Funzioni: pairsFor (coppie condivise), SCENES/SCENE_RULES/sceneKey/sceneHtml/EMO (scene a puzzle completo), makeX/mountX per ogni gioco, GAMES (registro), pickRound.
- js/app.js: schermate, voce (roundSpeech, feedbackSpeech, langSegs), tasto indietro (onBack), home.
- js/voice.js: lettura (TTS) e microfono; speak accetta stringa o lista di pezzi `{t, l:"en"}`.
- css/style.css, js/characters.js, js/credit.js, js/storage.js (chiavi localStorage sg2_profile e sg2_day), js/lock.js.

## Giochi (8 + domanda normale a 4 risposte)
- Ricostruisci la frase (solo italiano), Operazione (solo matematica).
- Tiro a segno, Corsa, Incastro, Memory, Palloncini, Pesca: tutti attivi per italiano, matematica e inglese.
- Incastro: un errore si perdona, al secondo il puzzle esplode (BOOM) e ricomincia con pezzi rimescolati, senza perdere minuti. A puzzle completo appare una scena a tema: figurine delle parole giocate (EMO) + sfondo, colori e posizioni casuali; matematica ed equazioni hanno più varianti.
- Memory: 2 colonne × 4 righe, carte da girare; riuscito se al massimo 5 errori; a fine partita appare la stessa scena dell'Incastro.
- Palloncini: in alto una parola (3 parole una dopo l'altra), salgono palloncini con le risposte, scoppia solo quello giusto; un errore si perdona, al secondo i palloncini scappano (risposta sbagliata).
- Pesca: pesci con le risposte, tocca quello giusto; un errore si perdona.
- Tiro a segno e Corsa: un solo tentativo.
- Classi piccole (1ª–3ª elementare): 95% giochi e 5% domande; dalla 4ª in su 70% giochi.

## Voce
- Parole inglesi lette con voce en-US (rate 1.15), il resto in italiano (0.95). Ogni pezzo riprova da solo (3 tentativi con pausa) se il motore non è pronto; si sceglie una voce locale per lingua (evita le voci "network").
- Alla prima apertura dopo un'installazione a volte il motore vocale non è pronto: la correzione dei nuovi tentativi serve a questo. Massi dice che lo stesso difetto "alla prima apertura devo chiudere e riaprire" capita anche in altre sue app (PapaNav, TurnUpp, MedTranslator): da guardare, ma solo quando lo decide lui.

## Tasto indietro Android
Torna alla pagina prima: chiude le impostazioni, dalla sfida va alla home, nella creazione profilo torna al passo prima. Dalla home esce dall'app.

## Home
Intestazione con avatar, nome, classe, ⚙️ e il pulsante grande che legge la pagina. Tolto il pulsante 🔊 dei suoni (resta in Impostazioni).

## Stato delle prove
- Provato da Massi sul telefono: voce inglese, scene e tutto il resto ("il resto ok").
- Provato da Claude in un browser headless (Playwright, schermo 390×800): 54 partite simulate (Memory, Palloncini, Pesca; vinte e perse; tre materie; classi 1/4/7), lettura vocale dei nuovi giochi, screenshot. Come rifarlo: pagina file:///.../www/index.html, bloccare cordova.js con route, localStorage `sg2_profile` = {nick, classId, family:"creatura", color:"#FF8FB1", photo:null, autoRead, narrAsked:true, sound}.

## Da fare (decide Massi)
- Nuova materia con domande (Storia, Geografia, Scienze, ecc.): tutti gli 8 giochi la useranno subito.
- Allargare il banco domande di inglese (ora circa 20).
- Eventualmente nuovi giochi (Massi vuole varietà continua, niente "sempre i soliti due esercizi").

## Regole di Massi (da rispettare sempre)
- Rispondere subito, senza giri. Non fargli fare 10 comandi, niente "ok allora facciamo questo, infallibile".
- Scrivere e pubblicare su main quando ha già dato il SÌ.
- Build solo da GitHub Actions, controllata da Claude sulla pagina della singola run. NON avvisarlo che la build è pronta e non spiegargli come si installa: controlla da solo.
- NON chiedergli di fare da collaudatore ("dimmi dove si blocca"): Claude trova e verifica da solo, anche simulando le partite in un browser.
- Un gioco alla volta, funzionante, solo quello che dice lui; ma vuole fantasia e varietà vera (non lo stesso gioco con altre parole).
- Non centrare i bottoni con transform. Non mettere BackgroundColor in config.xml.
- Prima di caricare su GitHub, aspettare 4 o 5 modifiche importanti: non strumento dopo strumento.
- A ogni fase chiusa: scrivere "FASE CHIUSA: ti conviene aprire una nuova chat" sia all'INIZIO sia alla FINE del messaggio (Massi a volte non legge la fine), e allegare direttamente il file di riassunto per la nuova chat.
- Il tasto indietro non deve chiudere l'app: deve tornare alla pagina precedente.
- Linguaggio: italiano, diretto; Massi si arrabbia se si fa il pigro o si ripete.
