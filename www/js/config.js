// ===== Configurazione: tutte le regole del gioco stanno qui =====
const CONFIG = {
  APP_NAME: "Gioca e Impara",
  // 4/10/2026: valori iniziali PRUDENTI. Il tempo lo decidono i genitori (Impostazioni → Tempo di telefono, con il PIN).
  MIN_MINUTES: 10,    // minuti garantiti ogni giorno (suggeriti)
  MAX_MINUTES: 45,    // tetto suggerito più alto (medie); il tetto vero dipende dalla fascia, vedi MAX_BY_BAND
  MAX_BY_BAND: [30, 30, 45],   // tetto giornaliero suggerito: elementari 30 min, medie 45 min
  // limiti che i genitori possono scegliere (minuti, a passi di LIM_STEP)
  LIM_MIN_RANGE: [0, 120],     // minuti garantiti: da 0 a 2 ore
  LIM_MAX_RANGE: [10, 240],    // tetto: da 10 minuti a 4 ore
  LIM_STEP: 5,
  LIM_PLAY_RANGE: [10, 240],   // gioco dentro l'app prima del «cervello esploso»: da 10 minuti a 4 ore (suggeriti: PLAY_MIN_BY_CLASS)
  // Minuti per risposta, secondo il livello scelto rispetto alla classe REALE (bloccata dal PIN dei genitori):
  // low = esercizi di una classe inferiore, same = della sua classe, high = di una classe superiore
  REWARD: { low: { ok: 1, ko: 1.5 }, same: { ok: 2, ko: 1 }, high: { ok: 3, ko: 0 } },
  // 3/10/2026: ogni esercizio vale fino a 3 risposte giuste; guadagno per risposta giusta e perdita per sbagliata, secondo il livello scelto.
  // Alla 1ª-2ª elementare le sbagliate non tolgono mai niente.
  RIGHT: { low: 0.5, same: 1, high: 1.5 },
  WRONG: { low: 1.5, same: 1, high: 0 },
  FEST_STEP: [5, 5, 10],   // festa dei traguardi ogni N minuti: elementari 5, medie 10 (a partire dai minuti garantiti)
  HIGH_CAP: 30,       // minuti al giorno guadagnabili col livello più alto; oltre, vale come il proprio livello
  // «Il cervello esplode»: il bambino è libero di giocare quanto vuole; solo dopo i minuti di PLAY_MIN_BY_CLASS di gioco VERO nella giornata
  // (contati solo mentre è dentro gli esercizi, anche in più volte) compare il cervello che esplode e dice «basta, spegni il telefono».
  // Gli esercizi si fermano per COOLDOWN_MIN minuti; scatta a fine esercizio, mai a metà. I minuti già guadagnati restano usabili.
  // 0 = spento. Si azzera a mezzanotte. Un genitore può saltare la pausa con il PIN.
  // 4/10/2026: sono solo i valori SUGGERITI; i genitori li cambiano in Impostazioni → Tempo di telefono (profile.lim.play).
  PLAY_MIN_BY_CLASS: [45, 45, 45, 90, 90, 120, 120, 120],  // minuti di gioco al giorno per classe: 1ª-3ª elem. 45, 4ª-5ª elem. 1h30, medie 2 ore
  COOLDOWN_MIN: 90,
  // (facoltativo) pausa anche dopo tot minuti di telefono GUADAGNATI in una tornata; 0 = spento
  SESSION_EARN: 0,
  PIN_TRIES: 5,       // tentativi sbagliati di PIN prima della pausa
  PIN_PAUSE_MIN: 5,   // minuti di pausa dopo troppi tentativi
  GAME_SHARE: 0.7,    // quota di giri che sono giochi (il resto sono domande a risposta multipla)
  GAME_SHARE_SMALL: 0.95,   // lo stesso per i più piccoli (1ª-3ª elementare): quasi solo giochi
  NICK_MAX: 14,
  PHOTO_SIZE: 256,    // lato (px) della foto salvata sul telefono
  CLASSES: [
    { id: 0, label: "1ª elementare", short: "1ª", level: "Elementari" },
    { id: 1, label: "2ª elementare", short: "2ª", level: "Elementari" },
    { id: 2, label: "3ª elementare", short: "3ª", level: "Elementari" },
    { id: 3, label: "4ª elementare", short: "4ª", level: "Elementari" },
    { id: 4, label: "5ª elementare", short: "5ª", level: "Elementari" },
    { id: 5, label: "1ª media",      short: "1ª", level: "Medie" },
    { id: 6, label: "2ª media",      short: "2ª", level: "Medie" },
    { id: 7, label: "3ª media",      short: "3ª", level: "Medie" }
  ]
};
