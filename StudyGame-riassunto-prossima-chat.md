# Gioca e Impara: riassunto per la prossima chat
Aggiornato al 10 ottobre 2026 (sera). Le versioni precedenti di questo file sono nella storia di git.

## Messaggio da incollare nella nuova chat
> Lavoriamo su «Gioca e Impara» (repo Massimiliano1965/StudyGame, ramo main). Aggiungi il repo alla sessione, clonalo e leggi prima `StudyGame-riassunto-prossima-chat.md`. Rispetta le mie regole scritte lì. Oggi voglio fare: [scrivi qui]

## Il progetto
- App Android (Cordova) per bambini e ragazzi dalla 1ª elementare alla 3ª media: quiz e giochi sulle materie di scuola. Rispondendo bene si guadagnano minuti di telefono. Il tempo lo decidono i genitori; il blocco del telefono (facoltativo) apre le altre app solo con i minuti guadagnati.
- Autore: Massimiliano Previtali (Massi), educatore linguistico. Non è programmatore: lavora dal telefono e prova tutto sul suo Android.
- Repo: Massimiliano1965/StudyGame (PUBBLICO), ramo unico `main`. Id pacchetto `it.massi.studygame`. Chiavi di salvataggio `sg2_*` (non cambiarle: si perderebbero i profili).
- Build: solo GitHub Actions. «Build APK» (.github/workflows/build.yml) parte a ogni push su main e fa DUE app: `StudyGame-apk` (per tutti) e `StudyGame-apk-D1` (con dedica). «Build AAB (Play Store)» (release-aab.yml) si avvia a mano.
- Controllo della build dalla sessione cloud: `gh api "repos/Massimiliano1965/StudyGame/actions/runs?per_page=3"`. I log e gli artefatti non si scaricano da qui (redirect bloccato).

## Regole di Massi (sempre)
- Italiano semplice e diretto, risposte subito, niente «prova questo poi quello». Non fargli fare 10 comandi.
- PRIMA DI OGNI CAMBIAMENTO: avvisarlo e fargli vedere (screenshot/anteprima). Fare solo quello che chiede; il resto si propone.
- Caricare su main solo dopo il suo sì. Non fargli da collaudatore: Claude prova da solo nel browser (Playwright) e controlla la build.
- Il tasto Indietro torna alla pagina precedente; chiude l'app solo dalla home.
- Nome dell'app: «Gioca e Impara» (mai «Studia e Gioca»). Non centrare i bottoni con transform. Non mettere BackgroundColor in config.xml.
- Varietà vera nei giochi (non lo stesso gioco con altre parole). Regola degli errori: due errori si perdonano, al terzo si perde (decisa da Massi).
- Nella versione per tutti NON deve comparire il nome del bambino della dedica (Massi la mostra ai genitori).
- A fase chiusa: «FASE CHIUSA: ti conviene aprire una nuova chat» all'inizio e alla fine del messaggio, e allegare questo file.

## File (www/)
- `index.html` carica gli script in ordine. `css/style.css`: UN file, riordinato per argomento con indice in cima (temi, base, componenti, splash, profilo, home, compagno, schermata di gioco, un blocco per ogni gioco, giochi scuri, album, impostazioni/blocco, schermi piccoli, @keyframes). Le regole nuove vanno nella loro sezione, non in fondo.
- `js/app.js`: schermate, profilo, home, impostazioni, voce, PIN, album, blocco, pausa occhi, tasto Indietro.
- `js/games.js` (17 giochi) e `js/games2.js` (12 giochi scuri, dalla 4ª elementare). Ogni gioco: `makeX` + `mountX`, `onDone(ok, risposta, spiegazione, errori)`.
- `js/questions.js` + `js/q_*.js`: domande per fascia (A 1ª–2ª el., B 3ª–5ª, C medie); matematica generata. `js/parole.js` toglie le parole difficili ai piccoli.
- `js/credit.js`, `js/config.js` (minuti, tetti, «cervello esploso»), `js/voice.js`, `js/music.js`, `js/characters.js`, `js/album.js`, `js/lock.js`, `js/splash.js`, `js/dedica.js` (scritto dalla build), `privacy.html`.
- Plugin locali: `plugins-local/speechrecognition`, `plugins-local/studylock` (blocco, Java).
- Icone: `res/` (normale) e `res/dedica/D1/` (icona, avvio di Android, logo dell'avvio animato).

## Com'è l'app adesso
- Prima schermata: «Ciao! Che scuola fai?» con tre colonne (1ª–3ª elementare, 4ª–5ª elementare, Scuola media). Il bambino sceglie e tutto prende lo stile della sua fascia; poi vede solo le classi della fascia (+ «Le altre classi»).
- Tre stili: piccoli (chiaro e colorato), ragazzi (blu), teen (antracite e verde). Colori riposanti per gli occhi (niente bianco puro né nero con fluo). Compagno e album diversi per fascia.
- Primo avvio: fotosensibilità → Avvertenze → PIN dei genitori → offerta del blocco (si può saltare) → profilo del bambino.
- Blocco del telefono (facoltativo): guida in 3 passi con telefono disegnato e dito animato («Mostra sopra le altre app», con passo extra per «Consenti impostazioni con restrizioni»; «Accesso all'utilizzo»; protezione dalla disinstallazione facoltativa). Home: «Usa i miei minuti». Impostazioni: attiva/spegni (PIN), emergenza 10 min, numeri da chiamare.
- Tempo: i genitori decidono garantiti e tetto (Impostazioni, PIN). «Cervello esploso» dopo troppo gioco; pausa ogni 45 min; pausa per gli occhi ogni 20 min di gioco (20 secondi, tra un esercizio e l'altro).
- 29 giochi. Rinnovati il 10/10: Canestro, Pesca con la lenza, Talpe veloci (3 domande, combo), Mongolfiera, Gara contro il bot. Dopo il secondo errore il compagno incoraggia. Indietro a metà gioco chiede «Vuoi uscire dal gioco?».
- Album di figurine, una per ogni gioco vinto (non nei ripassi): adesivi (1ª–3ª), carte con rarità e riflesso olografico (4ª–5ª), collezione esagonale (medie). Doppioni = punti scambio.
- Privacy: informativa nelle Impostazioni (PIN); «Lascia una recensione» chiede il PIN. Nessun dato inviato.
- Versione con dedica (codice D1): icona scudo da supereroe con la P, avvio con lo scudo, «Ciao <nome>! Benvenuto!» al posto di «Come ti chiami?», ringraziamento al bambino solo lì.

## In sospeso / da fare
- Prova sul telefono di Massi di tutto il pacchetto del 10/10 (blocco con la guida nuova, giochi nuovi, album, colori, pausa occhi, app con dedica).
- Play Store (Massi NON vuole ancora pubblicare). Quando vorrà: incollare su GitHub i 3 segreti della chiave nuova (file `SEGRETI-GITHUB-StudyGame.txt` consegnato a Massi; la chiave è `upload-giocaeimpara.keystore`, tenuta da lui), email dello sviluppatore, informativa privacy su una pagina web (es. GitHub Pages). La vecchia chiave esposta è stata cancellata. `signing/studygame.keystore` (versioni di prova) resta: cambiarla obbligherebbe a reinstallare.
- FATTO: il nome del bambino non è più nel repo pubblico. Codice D1; il nome sta nella variabile GitHub `DEDICA_NOME` (Settings > Secrets and variables > Actions > Variables). Senza variabile la build con dedica viene saltata.
- App giapponese «あそんで まなぼう» per Riku (nipote di Massi, 2–5 anni; papà Ryu, mamma Kumi, insegnante di scuola dell'infanzia; usano iPhone): solo un'idea, da finire entro fine anno. Prima versione nello zip `asobou-riku.zip` consegnato a Massi (8 giochi dalle 5 aree del 幼稚園教育要領, voce giapponese, adesivi, tempo dei genitori, pausa occhi). Per iPhone: pagina web installabile (manifest + service worker già fatti) da pubblicare su un repo con GitHub Pages; Massi deve creare il repo.

## Come provare (per Claude)
- Playwright con Chromium: `executablePath: '/opt/pw-browsers/chromium'`, pagina `file:///…/www/index.html`, bloccare `cordova.js` con route.
- Profilo finto in `localStorage.sg2_profile` = {nick, classId, family:"creatura", color, photo:null, autoRead:false, narrAsked:true, sound:false, music:false, pin:"x", infoSeen:true, fxSeen:true}.
- Per un gioco preciso: `Games.pick = () => Games.make(kind, classe, materia)` poi «Gioca». Giri automatici di tutti i giochi con `Games.make` + `Games.mount`.
- Blocco: `window.cordova = {}` + finto `window.StudyLock` (callback con lo stato) e `deviceready` a mano.
- Versione con dedica: copia di www con `dedica.js` = `const DEDICA = "<nome>"` e `img/dedica-logo.svg`.
- Prima di cambiare il CSS senza voler cambiare l'aspetto: fotografia degli stili calcolati di tutte le schermate prima/dopo e confronto (fatto per il riordino: 0 differenze).
