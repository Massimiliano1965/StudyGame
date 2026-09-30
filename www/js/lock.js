// ===== Blocco / sblocco dispositivo =====
// In HTML/JS puro NON è possibile bloccare le altre app del telefono.
// Questo modulo è il punto unico dove collegare la parte nativa.
// Finché non c'è un plugin nativo, le funzioni non fanno nulla (no errori).
//
// Opzioni reali per il blocco:
//  1) Google Family Link (gratis, già esistente): il genitore gestisce i limiti,
//     questa app serve solo a "guadagnare" il tempo.
//  2) Plugin Cordova custom in Java/Kotlin con Device Owner / Lock Task Mode
//     (startLockTask / stopLockTask): richiede un telefono dedicato configurato
//     come dispositivo aziendale via ADB.
//  3) App nativa Kotlin con UsageStatsManager + AccessibilityService.
const Lock = (() => {
  const native = () => window.cordova && window.StudyLock; // plugin futuro

  function lock() {
    if (native()) window.StudyLock.lock();
  }

  function unlock(minutes) {
    if (native()) window.StudyLock.unlock(minutes);
  }

  return { lock, unlock };
})();
