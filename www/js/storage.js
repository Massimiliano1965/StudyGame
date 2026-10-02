// ===== Salvataggio sul telefono (nessun invio in rete) =====
const Storage = (() => {
  const K_PROFILE = "sg2_profile";
  const K_DAY = "sg2_day";

  const today = () => {
    const d = new Date();
    const p = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  };

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; }
  }

  const loadProfile = () => read(K_PROFILE);
  const saveProfile = p => write(K_PROFILE, p);

  // Stato del giorno: ogni giorno si riparte dai minuti garantiti
  function loadDay() {
    const s = read(K_DAY);
    if (s && s.day === today()) return s;
    return { day: today(), minutes: CONFIG.MIN_MINUTES, correct: 0, wrong: 0, granted: 0, hi: 0 };
  }
  const saveDay = s => write(K_DAY, s);

  function resetAll() {
    try { localStorage.removeItem(K_PROFILE); localStorage.removeItem(K_DAY); localStorage.removeItem("sg2_hist"); } catch (e) {}
  }

  return { loadProfile, saveProfile, loadDay, saveDay, resetAll, today };
})();
