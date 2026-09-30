// ===== Configurazione: tutte le regole del gioco stanno qui =====
const CONFIG = {
  APP_NAME: "StudyGame",
  START_CREDIT: 20,   // bonus iniziale (minuti)
  TARGET: 60,         // soglia per sbloccare il premio
  BONUS: 5,           // default risposta giusta (sovrascrivibile per domanda)
  MALUS: 3,           // default risposta sbagliata (sovrascrivibile per domanda)
  MIN_CREDIT: 0,      // il credito non scende sotto questo valore
  DAILY_RESET: true   // ogni nuovo giorno si riparte da START_CREDIT
};
