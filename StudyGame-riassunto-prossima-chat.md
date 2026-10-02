# Gioca e Impara: riassunto per la prossima chat

Progetto: Gioca e Impara, app Android (Cordova) per ragazzi 6–12 anni: si risponde a quiz e giochi di scuola per guadagnare tempo di telefono (30 min garantiti al giorno, tetto 2h30, +2 min per risposta giusta, −1 per sbagliata). Autore: Massi (non è sviluppatore di mestiere, lavora dal telefono e prova tutto sul suo telefono Android).

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

## Giochi (16 + domanda normale a 4 risposte). REGOLA: due errori si perdonano, al TERZO si perde (tutti i giochi tranne Tiro a segno/Corsa, un solo tentativo, e Memory, max 5 errori)
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
- (nuovi del 1 ottobre sera, vedi sotto: Salva l'omino, Taglia al volo, Collega con le linee)
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


## Novità del 1 ottobre sera (NOME NUOVO: «Gioca e Impara», prima «Gioca» perché è positivo)
- Rinominata ovunque (config.xml, index.html, config.js, avvertenze, titoli). Restano invariati id pacchetto it.massi.studygame, repo StudyGame e chiavi localStorage sg2_* (così non si perde il profilo).
- Icona: libro aperto + joystick + stella sorridente, sfondo azzurro-viola-rosa. Sorgente: res/build_icons.py (rigenera res/emblem.svg, www/js/logo.js e res/android/*.png; serve Playwright). In config.xml: icone vecchie + adattive (foreground/background) per ogni densità; verificato in locale con `cordova prepare` (genera mipmap-*-v26).
- Splash animato HTML/CSS (index.html + css + js/splash.js): logo che rimbalza, lettere «Gioca / e Impara» che cadono, coriandoli, firma «Ideata e creata da Massimiliano Previtali, educatore linguistico, 20 anni di esperienza nell'insegnamento delle lingue». Resta almeno 3,2 s, un tocco la chiude dopo l'avvio, sicurezza a 10 s. Logo e nome anche nella home e nella prima schermata (brandHtml in app.js).
- Avvertenze (pulsante info) riscritte: chi l'ha pensata, l'idea (ripetizione + divertimento > insegnamento imposto), «contrario all'uso spropositato dei cellulari ma la tecnologia c'è: usiamola bene e impediamo che la usino male», non sostituisce la scuola, fonti ministeriali, genitori.
- 3 giochi nuovi in games.js: «Salva l'omino» (impiccato: indizio + lettere, ponte con assi che cadono, al terzo errore cade in acqua; parole 3–10 lettere, cifre ≥2; non parte dove le risposte sono frasi lunghe, es. civica), «Taglia al volo» (le risposte volano, si taglia col dito la giusta; area di taglio generosa; una carta tagliata male rientra), «Collega con le linee» (si trascina dal sinistro al destro o viceversa, oppure tocco-tocco; linee colorate). Voce: roundSpeech in app.js (Collega legge sinistra e destra separate, senza svelare le coppie).
- Errori: tutti i giochi ora perdono al TERZO errore (Massi: «al secondo mai sentito»). Hint e voce aggiornati.
- Scene di fine gioco corrette: storia e scienze scelgono la variante (Egitto / Grecia e Roma / castelli / neutra «viaggio nel tempo»; laboratorio / universo / natura) solo se almeno 3 coppie su 4 c'entrano, altrimenti neutra; «cose di una volta» non usa più la scena dei giorni e stagioni; matematica con geometria mischiata usa il titolo neutro «Collega ogni quesito alla sua soluzione».
- Domande nuove (js/q_extra5.js, 14 per fascia): tecnologia A 70, B 81, C 81; arte A 62, B 57, C 59 (con dedup per testo).
- Provato da Claude in headless: 107 prove sui 3 giochi nuovi (vittoria, sconfitta, tocco-tocco, due errori poi vittoria) su 10 materie; 1920 giri casuali su tutte le materie senza errori JS; lettere e fila perdono solo al terzo errore; audit delle scene per materia. NON ancora provato da Massi sul telefono.
- Da fare / idee: blocco del telefono: FATTO, vedi sezione sopra; altre domande; più parole di seconda lingua; il difetto «alla prima apertura devo chiudere e riaprire» solo quando lo decide lui.

## Blocco telefono + omino fluttuante (1 ottobre notte)
- Plugin nativo plugins-local/studylock (Java: StudyLock.java, LockService.java, BootReceiver.java; aggiunto in build.yml). Servizio in primo piano che ogni secondo legge l'app davanti (UsageStatsManager) e, se non ci sono minuti sbloccati, copre lo schermo con una schermata «Telefono in pausa» (permesso «Mostra sopra le altre app» + «Accesso all'uso»). SENZA i due permessi non blocca niente. Nessun amministratore del dispositivo: si può sempre disinstallare (o avviare in modalità provvisoria).
- Mai coperte: Gioca e Impara, telefono/chiamate, sveglia, installazione/disinstallazione, permessi, SystemUI. I minuti si consumano solo mentre si usano le ALTRE app (giocare qui non li consuma). Avviso a 1 minuto dalla fine.
- Emergenza: sulla schermata di blocco pulsante nativo «tieni premuto 3 secondi» = sblocco 10 minuti (funziona anche se la parte web si blocca); anche in Impostazioni. Il numero di emergenze di oggi si vede in Impostazioni.
- App: Impostazioni → «Blocco telefono» (spento di default; per spegnerlo calcolo da adulti tipo 27 × 13). In home, con blocco pronto, pulsante «📱 Usa i miei minuti (N)»: Credit.claim() consegna al blocco i minuti guadagnati e non ancora usati (campo granted nel giorno). Nuovo giorno = si riparte.
- Omino fluttuante: se dopo una risposta l'omino in alto è uscito dallo schermo (scroll in fondo), la sua reazione (balla o si schiaccia e piange) appare ~2,8 s al centro, senza bloccare i tocchi (showHeroFx in app.js, .hero.fx in style.css). Se si vede già non appare il doppione.
- Schede di fine gioco (Incastro/Memory): nuovo file js/emo_words.js con le figurine per parola (EMO_WORDS, EMO_RULES, EMO_RULES_R). Regola: figurina SOLO se c'entra davvero. Se almeno 3 parole del giro hanno la figurina, la scena mostra solo quelle (castello, fabbrica, spade, quadro per Feudalesimo/Rivoluzione industriale/Crociate/Rinascimento; bandiere per gli stati, ecc.); altrimenti la scena decorata di prima. Seconda lingua: si guarda solo la parola italiana. Controllate tutte le coppie di tutte le materie (storia, geografia, scienze, tecnologia, arte, musica, civica, latino, italiano, inglese, francese/spagnolo/tedesco).
- Splash: il difetto era lo splash di sistema Android (logo Cordova su bianco) che passava prima del nostro. Ora config.xml usa res/splash-icon.png (emblema) su viola #9B6BFF. Lo splash animato HTML in sé funziona (provato in browser).
- Provato da Claude in headless (mock del plugin, schermo 360×520): claim, secondo claim, +2 dopo risposta giusta, emergenza, spegnimento con calcolo (sbagliato/giusto), permessi mancanti, omino fluttuante presente/assente. La parte Java NON è provata su un telefono vero: la compilazione la dice la build; il comportamento reale lo si vede solo sul telefono di Massi.

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
- Il nome dell'app è «Gioca e Impara» (mai «Studia e Gioca»).
- Linguaggio: italiano, diretto; Massi si arrabbia se si fa il pigro o si ripete.
## Aggiornamento 1 ottobre 2026 (sera)
- Blocco telefono: PROVATO da Massi sul telefono vero, FUNZIONA. Con l'APK installato a mano Android 13+ chiede "Consenti impostazioni con restrizioni" (Info app → ⋮). Da Play Store non succede. Idea: schermata guida nell'app (non fatta).
- Splash nativo e omino fluttuante: ancora da verificare sul telefono.
- Jingle funky originale (Sfx.ok in app.js) per la risposta giusta. Niente musica protetta da copyright.
- Fatte 3 presentazioni (Slides): bambini https://claude.ai/artifact/U2TG5YEQw2EKR1YfkhPc8e, genitori https://claude.ai/artifact/22Auu4mteZyDwkwbgjHuQL, famiglia https://claude.ai/artifact/81sLhXSsipAzfUH3wMXFnC (private, da condividere a mano).
- Valutazione critica: app solida; mancano prova di una settimana con un bambino vero, informativa privacy, controllo a campione domande, parere professionale (Play Families Policy, eventuale autorizzazione attività secondaria se dipendente pubblico, partita IVA).
- Play Store: non prima di un mese; account sviluppatore circa 25 $ una tantum (da verificare), test chiuso richiesto ai nuovi account personali.
- Prossima app: "Avvocato in tasca" (da discutere).

## Pacchetto del 2 ottobre sera (tutto su main)
- Parole difficili: nuovo js/parole.js (liste di radici per fascia A = 1ª–2ª el. e B = 3ª–5ª el.). Toglie le domande che le contengono (banchi di storia, geografia, scienze, tecnologia, arte, musica, civica, italiano; non inglese, seconda lingua, latino) e le coppie dei giochi di collegamento (pairsFor in games.js usa `Parole.themes`). Per aggiungere una parola da escludere basta una radice nella lista HARD. Es. «ceramista» non compare più in 1ª–2ª.
- «Collega con le linee»: quando una coppia è giusta, linea, pallini e caselle sono SEMPRE verde chiaro #34a847 (testo bianco); il rosso resta solo per il lampo dell'errore.
- Memory: le due carte di una coppia stanno sempre su colonne opposte (una a sinistra, una a destra).
- Fumetti animati (`heroSay` in app.js): ora anche per la creatura (frasi dolci) e il robot (frasi da robot), non solo per la volpe hip hop; la stessa frase non esce due volte di fila.
- Guida permessi blocco: schermata «Come dare i permessi» (5 passi, «Consenti impostazioni con restrizioni») con pulsante «Apri Info app» (nuova azione nativa openAppInfo in StudyLock.java). Si apre da sola accendendo il blocco senza permessi e dal pulsante «Android non mi fa dare il permesso» nelle Impostazioni.
- Provato in headless: 170+ partite Memory e 160+ Linee (vittoria, errore poi vittoria), 2125 giri su tutte le materie/classi senza errori JS, guida con plugin simulato. La parte Java (openAppInfo) la dice la build; il comportamento reale solo il telefono. NON provato da Massi sul telefono.
- Resta da fare: prova sul telefono (decide Massi).
