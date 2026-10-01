// ===== Configurazione: tutte le regole del gioco stanno qui =====
const CONFIG = {
  APP_NAME: "Studia e Gioca",
  MIN_MINUTES: 30,    // minuti garantiti ogni giorno
  MAX_MINUTES: 150,   // tetto giornaliero (2h30)
  BONUS: 2,           // minuti guadagnati per risposta giusta
  MALUS: 1,           // minuti persi per risposta sbagliata (mai sotto il minimo garantito)
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
