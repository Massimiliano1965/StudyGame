// ===== Salvataggio stato (sopravvive alla chiusura dell'app) =====
const Storage = (() => {
  const KEY = "studyplay_state_v1";

  const today = () => new Date().toISOString().slice(0, 10);

  const fresh = () => ({
    credit: CONFIG.START_CREDIT,
    day: today(),
    phase: "study",      // study | win | play | end
    playEndsAt: null     // timestamp ms di fine gioco
  });

  function load() {
    let s;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
    if (!s) return fresh();
    // Reset giornaliero (non interrompe un gioco in corso)
    if (CONFIG.DAILY_RESET && s.day !== today() && s.phase !== "play") return fresh();
    return s;
  }

  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }

  return { load, save, fresh };
})();
