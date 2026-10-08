// ===== Resoconto per i genitori: giochi, riusciti/no, tempo nell'app, per materia e per livello =====
// Tutto resta su questo telefono (nessun invio). Si tengono gli ultimi 30 giorni.
const Stats = (() => {
  const K = "sg2_hist", KEEP = 30;
  let hist = {};
  try { hist = JSON.parse(localStorage.getItem(K)) || {}; } catch (e) { hist = {}; }
  let dirty = false;

  const blank = () => ({ sec: 0, rounds: 0, ok: 0, ko: 0, subj: {}, lvl: { low: [0, 0], same: [0, 0], high: [0, 0] }, gift: 0, help: 0, sessions: [] });
  const day = (d) => { const k = d || Storage.today(); return hist[k] || (hist[k] = blank()); };

  function save() {
    dirty = false;
    const keys = Object.keys(hist).sort();
    while (keys.length > KEEP) delete hist[keys.shift()];
    try { localStorage.setItem(K, JSON.stringify(hist)); } catch (e) {}
  }
  // sessioni di gioco: ogni volta che si entra a giocare (pausa > 5 minuti = nuova sessione)
  const GAP = 5 * 60 * 1000;
  let cur = null;
  const openSess = () => {
    const now = Date.now();
    if (cur && now - cur.last > GAP) cur = null;
    if (!cur) {
      cur = { s: now, sec: 0, ok: 0, ko: 0, last: now };
      const d = day(), arr = d.sessions || (d.sessions = []);
      arr.push(cur);
    }
    cur.last = now;
    return cur;
  };
  function endSession() { cur = null; save(); }
  function round(sid, ok, rel) {
    const ss = openSess(); if (ok) ss.ok++; else ss.ko++;
    const d = day();
    d.rounds++; if (ok) d.ok++; else d.ko++;
    const s = d.subj[sid] || (d.subj[sid] = [0, 0]); s[ok ? 0 : 1]++;
    const l = d.lvl[rel < 0 ? "low" : rel > 0 ? "high" : "same"]; l[ok ? 0 : 1]++;
    save();
  }
  function tick() { day().sec++; openSess().sec++; dirty = true; }
  function flush() { if (dirty) save(); }
  function gift(n) { day().gift += n; save(); }
  function help() { day().help++; save(); }
  // ultimi n giorni, dal più recente
  function days(n) {
    const out = [], t = new Date();
    for (let i = 0; i < n; i++) {
      const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - i);
      const p = x => String(x).padStart(2, "0");
      const k = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
      out.push({ date: d, key: k, ...(hist[k] || blank()) });
    }
    return out;
  }
  function wipe() { hist = {}; try { localStorage.removeItem(K); } catch (e) {} }
  // elenco sessioni degli ultimi n giorni, dalla più recente
  function sessions(n) {
    const out = [];
    days(n).forEach(d => (d.sessions || []).forEach(x => out.push(x)));
    return out.sort((a, b) => b.s - a.s);
  }
  return { round, tick, flush, gift, help, days, day, wipe, endSession, sessions };
})();
