// ===== Salvataggio sul telefono (nessun invio in rete) =====
const Storage = (() => {
  const K_PROFILE = "sg2_profile";
  const K_DAY = "sg2_day";

  const today = () => {
    const d = new Date();
    const p = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  };

  // problemi di salvataggio: l'app li mostra una volta sola (memoria piena, dati illeggibili)
  let onProblem = null; const pending = [];
  const problem = kind => { try { if (onProblem) onProblem(kind); else pending.push(kind); } catch (e) {} };
  function read(key) {
    let raw = null;
    try { raw = localStorage.getItem(key); } catch (e) { return null; }
    if (raw === null) return null;
    try { return JSON.parse(raw); }
    catch (e) {   // dati rovinati: si conserva una copia, così non si perdono in silenzio
      try { localStorage.setItem(key + "_bad", raw); } catch (e2) {}
      problem("unreadable");
      return null;
    }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { problem("full"); return false; }
  }

  const loadProfile = () => read(K_PROFILE);
  const saveProfile = p => write(K_PROFILE, p);

  // Stato del giorno: ogni giorno si riparte dai minuti garantiti
  // start = minuti garantiti di oggi (quelli scelti dai genitori, o i suggeriti)
  function loadDay(start) {
    const s = read(K_DAY);
    if (s && s.day === today()) return s;
    const m = typeof start === "number" ? start : CONFIG.MIN_MINUTES;
    return { day: today(), minutes: m, base: m, correct: 0, wrong: 0, granted: 0, hi: 0 };
  }
  const saveDay = s => write(K_DAY, s);

  function resetAll() {
    try { const old = localStorage.getItem(K_PROFILE); if (old) localStorage.setItem(K_PROFILE + "_bak", old); } catch (e) {}
    try { localStorage.removeItem(K_PROFILE); localStorage.removeItem(K_DAY); localStorage.removeItem("sg2_hist"); } catch (e) {}
  }

  return { loadProfile, saveProfile, loadDay, saveDay, resetAll, today, setProblemHandler: fn => { onProblem = fn; pending.splice(0).forEach(k => problem(k)); } };
})();
