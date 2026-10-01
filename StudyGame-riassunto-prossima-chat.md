# Studia e Gioca: riassunto per la prossima chat

Progetto: Studia e Gioca, app Android (Cordova) per ragazzi 6–12 anni: si risponde a quiz e giochi di scuola per guadagnare tempo di telefono (30 min garantiti al giorno, tetto 2h30, +2 min per risposta giusta, −1 per sbagliata). Autore: Massi (non è sviluppatore di mestiere, lavora dal telefono e prova tutto sul suo telefono Android).

## Dove sta il codice
- Repo GitHub: Massimiliano1965/StudyGame (clone: https://github.com/Massimiliano1965/studygame). Branch unico: main.
- Build: solo da GitHub Actions, workflow "Build APK" (.github/workflows/build.yml). Artefatto: StudyGame-apk. Plugin: cordova-plugin-tts-advanced@0.5.3 e plugins-local/speechrecognition.
- Ultimo commit su main: vedi `git log` (6 materie nuove + domande allargate + Trova l'intruso). Build: controllare l'ultima run. Controllo build: `gh` non c'è nella sessione cloud, si usa curl su https://api.github.com/repos/Massimiliano1965/StudyGame/actions/runs.
- Dalla sessione cloud: `gh` e `git` funzionano; il repo va aggiunto con add_repo (push) e clonato in /home/claude/studygame.

## File principali (www/)
- js/config.js: regole (minuti, GAME_SHARE 0.7, GAME_SHARE_SMALL 0.95 per 1ª–3ª elementare).
- js/subjects.js: 12 materie in elenco; READY_SUBJECTS = tutte e 12 le materie (matematica, italiano, inglese, storia, geografia, scienze, tecnologia, arte, musica, educazione civica, seconda lingua, latino).
- js/questions.js: italiano (poche domande, 6 per fascia: da allargare) e matematica (generata dal programma). Dispatcher `Questions.next`: se la materia ha un banco in QBANK lo usa.
- js/q_inglese.js: 298 domande di inglese (fasce A 1ª–2ª el., B 3ª–5ª el., C medie); vocabolario generato da liste di coppie [inglese, italiano] (2 domande a parola) + frasi di grammatica scritte a mano. Ogni domanda ha `en` (parole inglesi per la voce) e `ae` se le risposte sono tutte inglesi.
- js/q_scienze.js (A 27, B 29, C 31 domande), js/q_italiano_extra.js (porta italiano a A 31, B 31, C 35), js/q_storia_extra.js e js/q_geografia_extra.js (storia A 29, B 41, C 42; geografia A 30, B 50, C 50): i file *_extra si aggiungono ai banchi base. Stessa struttura di q_storia.js e q_geografia.js: stesse tre fasce, risposta giusta sempre per prima (poi mescolate). Per aggiungere una materia nuova basta un file così + READY_SUBJECTS + coppie in games.js (OTHER_PAIRS) + scena + SCENE_RULES.
- js/q_altre.js: banchi base di tecnologia, arte, musica, civica e latino (46, solo dalla 2ª media). js/q_altre_extra.js li allarga: tecnologia A 40, B 44, C 47; arte A 37, B 43, C 45; musica A 38, B 41, C 46; civica A 38, B 44, C 46. js/q_italiano_extra2.js e js/q_scienze_extra.js allargano italiano (A 40, B 43, C 51) e scienze (A 39, B 46, C 51).
- js/q_lingua2.js: seconda lingua (solo dalla 1ª media). Oggetto globale `L2`: un vocabolario [italiano, francese, spagnolo, tedesco] per categoria (12 categorie + frasi + verbo essere) da cui genera domande (circa 250 per lingua) e temi per i giochi. La lingua si sceglie in Impostazioni (Francese predefinito, salvata in profile.l2). `L2.use(codice)` cambia banco e coppie; `Voice.setForeign(locale)` fa leggere le parole straniere con la voce giusta (fr-FR, es-ES, de-DE); l'inglese resta en-US.
- js/games.js: tutti i giochi. Funzioni: pairsFor (coppie condivise; STO_PAIRS e GEO_PAIRS per storia e geografia), SCENES/SCENE_RULES/sceneKey/sceneHtml/EMO (scene a puzzle completo), makeX/mountX per ogni gioco, GAMES (registro), pickRound (se un gioco non può partire ne prova un altro).
- js/app.js: schermate, voce (roundSpeech, feedbackSpeech, langSegs), tasto indietro (onBack), home.
- js/voice.js: lettura (TTS) e microfono; speak accetta stringa o lista di pezzi `{t, l:"en"}`.
- css/style.css, js/characters.js, js/credit.js, js/storage.js (chiavi localStorage sg2_profile e sg2_day), js/lock.js.

## Giochi (12 + domanda normale a 4 risposte)
- Ricostruisci la frase (solo italiano), Operazione (solo matematica).
- Tiro a segno, Corsa, Incastro, Memory, Palloncini, Pesca, Talpe, Vero o falso, Lettere mescolate: attivi per tutte le materie.
- Incastro: un errore si perdona, al secondo il puzzle esplode (BOOM) e ricomincia con pezzi rimescolati, senza perdere minuti. A puzzle completo appare una scena a tema: figurine delle parole giocate (EMO) + sfondo, colori e posizioni casuali; matematica, equazioni, storia e geografia hanno più varianti.
- Memory: 2 colonne × 4 righe, carte da girare; riuscito se al massimo 5 errori; a fine partita appare la stessa scena dell'Incastro.
- Palloncini: in alto una parola (3 parole una dopo l'altra), salgono palloncini con le risposte, scoppia solo quello giusto; un errore si perdona, al secondo i palloncini scappano (risposta sbagliata).
- Pesca: pesci con le risposte, tocca quello giusto; un errore si perdona.
- NUOVO Talpe: 6 buchi, le talpe spuntano con le risposte (max 3 insieme, ogni risposta compare a turno), tocca quella giusta; un errore si perdona, al secondo si perde e compare la talpa giusta.
- NUOVO Vero o falso lampo: 5 frasi (domanda + risposta proposta), tocca ✅ o ❌; un errore si perdona, al secondo si perde. Pulsante 🔊 Leggi su ogni frase; con la lettura automatica attiva ogni frase nuova viene letta.
- NUOVO Lettere mescolate: indizio (es. «gatto → ?»), si rimettono in ordine le lettere della risposta (parole da 2 a 9 caratteri senza spazi, anche cifre); un errore si perdona. Se non ci sono parole adatte parte un altro gioco.
- NUOVO Trova l'intruso: 3 giri da 4 parole (da una parola di un altro tema), tocca quella che non c'entra; un errore si perdona, al secondo si perde; pulsante 🔊 Leggi. Non parte per matematica e italiano (i temi di collegamento lì sono relazioni, non categorie).
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
- Provato da Massi sul telefono (prima di questa fase): voce inglese, scene e tutto il resto ("il resto ok"). Storia, Geografia, i 3 nuovi giochi e le nuove domande di inglese NON sono ancora stati provati da lui sul telefono.
- Provato da Claude in un browser headless (Playwright, schermo 390×800): banchi di domande controllati (4 risposte diverse, niente duplicati), 3 nuovi giochi simulati in vittoria e sconfitta su 5 materie × classi 1/4/7 (tutti ok), scene di Incastro e Memory per storia e geografia, 45 avvii per materia/classe dall'app vera senza errori JS, screenshot, frasi lette dalla voce. Come rifarlo: pagina file:///.../www/index.html, bloccare cordova.js con route, localStorage `sg2_profile` = {nick, classId, family:"creatura", color:"#FF8FB1", photo:null, autoRead, narrAsked:true, sound}.
- Provato da Claude in browser headless: 1440 giri di gioco su 6 materie × classi 0/3/4/7 senza errori; Scienze giocata dall'app vera (classi 0, 4, 7).
- Provato da Claude in browser headless: banchi nuovi (4 risposte diverse, niente duplicati), 22 simulazioni di Trova l'intruso (vittoria e sconfitta, 11 materie/classi), 1000+ giri di gioco sulle materie nuove senza errori JS, partite dall'app vera su 8 materie.
- Provato da Claude in browser headless (1 ottobre): 1560 giri di gioco su tecnologia, arte, musica, civica e seconda lingua (francese, spagnolo, tedesco) senza errori; voce straniera controllata per lingua (fr-FR, es-ES, de-DE); impostazione della lingua salvata; banchi senza risposte duplicate né domande doppie.
- STATO DEL CODICE: tutto pubblicato su main. Le 6 materie nuove, le domande allargate di italiano/scienze e Trova l'intruso NON sono ancora provati da Massi sul telefono.

## Novità del 1 ottobre (tutto su main, build riuscita, commit 94db602)
- Pulsanti fissi in alto: 🔊 Voce ON/OFF (rosso se spento: allora non si sente MAI nulla, in ogni gioco) e 🎵 Musica ON/OFF. Tolto il vecchio tasto "leggi". Tocco fuori dalla scheda = esce. Fotocamera vera (cordova-plugin-camera@7.0.0, aggiunto in build.yml). "Seleziona tutto / Deseleziona tutto" per le materie.
- js/music.js: jingle sintetizzati con WebAudio (nessun file, nessun copyright), stacchetto 3–4 s per età e materia (pop 1ª–2ª/3ª–5ª/medie, robot per matematica, mare, animali, arpa, fanfara, classica: Ode alla gioia, Eine kleine Nachtmusik, Für Elise; organo). La lettura parte quando il jingle finisce.
- Disclaimer (pulsante info): non sostituisce insegnamento né genitori; basato su Indicazioni nazionali D.M. 254/2012 + "nuovi scenari" 2018 (valide nel 2026/27 per le classi 2ª–5ª e 2ª–3ª media) e nuove Indicazioni D.M. 221 del 9/12/2025 (GU 27/1/2026), in vigore dal 2026/27 solo per infanzia, 1ª primaria e 1ª media; supervisione dei genitori.
- Matematica: geometria (figure, perimetri, aree, angoli, Pitagora, cerchio, volumi) e problemi "moderni" (algoritmi, binario, risparmio). Filtro per classe: `cl: [da, a]` nelle domande/temi + `Questions.inClass()`.
- File nuovi: q_nuove_ind.js (1ª media nuove Indicazioni, geografia italiana, tecnologia, IA, scienze), q_extra4.js (storia e tecnologia fasce A/B). Seconda lingua: 9 categorie nuove + frasi, `L2.seqs()`.
- Nuovo gioco 13: "Metti in fila" (ordina giorni, mesi, pianeti, eventi, numeri, alfabeto, ecc.; un errore perdonato, al secondo mostra la soluzione). Provato in headless su 12 materie × classi 0/3/4/7.
- Animazioni personaggio: sbaglia = si schiaccia e piange (lacrime + 😭); giusto = balla (moonwalk, giravolta o posa) con cappello 🎩 e guanto 🧤. CSS in style.css, funzione `animateHero` in app.js.
- Impostazioni più arie (niente sovrapposizioni).
- NON ancora provato da Massi sul telefono: tutto questo elenco.
- Aperto: confronto 1ª elementare con le nuove Indicazioni solo di copertura temi (il testo ufficiale non è stato letto riga per riga: la ricerca web non ha dato il testo); banchi fascia A già ampi (40–110 domande per materia).

## Da fare (decide Massi)
- Eventualmente altre domande per tecnologia, arte, musica, civica (ora 37–47 per fascia) e più parole nel vocabolario di seconda lingua.
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