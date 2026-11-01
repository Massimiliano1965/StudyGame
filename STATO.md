# STATO — Gioca e Impara (StudyGame)
Aggiornato: 29/10/2026

**Cos'è:** app Android di quiz e giochi per ragazzi dalla 1ª elementare alla 3ª media, per guadagnare minuti di telefono.
**Ultima modifica:** dopo un gioco la schermata ora scorre fino ad «Avanti» (24/10/2026).
**APK (per tutti):** https://github.com/Massimiliano1965/StudyGame/releases/download/gioca-152/GiocaEImpara-152.apk (build 152)
**APK con dedica:** https://github.com/Massimiliano1965/StudyGame/releases/download/gioca-d1-152/GiocaEImpara-d1-152.apk
**Regole e riassunto completo:** `StudyGame-riassunto-prossima-chat.md` (del 10/10)

## Aperto
- Niente di segnato. Si aggiorna a fine lavoro.

## Per aprire una nuova chat
> Lavoriamo su «Gioca e Impara» (repo Massimiliano1965/StudyGame, ramo main). Leggi prima STATO.md e StudyGame-riassunto-prossima-chat.md. Oggi voglio fare: ...

## 01/11/2026 — Controllo completo (Claude)
- Provati in automatico 3400 giri di tutti i 29 giochi, tutte le classi e materie: nessun errore. 4054 domande controllate (risposte, indice giusto, spiegazioni): nessun problema vero.
- Costruzione con Android 16 (API 36, Cordova-android 15.1.0): provata e riuscita. Workflow `build.yml` e `release-aab.yml` portati a Cordova 13 + android 15.1.0 + Gradle 8.13 (sul ramo, da provare su main).
- Per il Play Store restano: informativa privacy su una pagina web pubblica (es. GitHub Pages), segreti della chiave nuova, email sviluppatore.
- NOVITÀ (01/11/2026, sul ramo, da provare sul telefono): «Sfida del giorno» (5 sfide riuscite = figurina in più; riquadro in home), «Ripassa i miei errori» (le domande sbagliate si ricordano e si rifanno senza perdere minuti; fino a 30), «Questa settimana» in cima al Resoconto (giorni, tempo, % riusciti, confronto con la settimana scorsa, materia forte e da rinforzare). Codice in `www/js/extra.js`; salvati sul telefono in `sg2_daily` e `sg2_errs`.
- `pagina-privacy.yml`: pubblica la Privacy su GitHub Pages (una volta: Settings > Pages > Source = GitHub Actions).
