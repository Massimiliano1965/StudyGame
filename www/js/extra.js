// ===== Sfida del giorno + Ripasso degli errori + Riepilogo settimanale (01/11/2026) =====
// Tutto resta sul telefono (nessun invio). Chiavi: sg2_daily (sfida di oggi), sg2_errs (domande sbagliate da ripassare).
const Extra = (() => {
  const K_D = "sg2_daily", K_E = "sg2_errs", GOAL = 5, KEEP = 30;
  const rd = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } };
  const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  // ---- Sfida del giorno: 5 risposte giuste (giochi e domande, non i ripassi) = una figurina in più ----
  function daily() {
    const d = rd(K_D, null), t = Storage.today();
    return d && d.day === t ? d : { day: t, n: 0, claimed: false };
  }
  // chiamata a ogni esercizio riuscito: true se proprio ora la sfida è completata (e il premio non era ancora stato dato)
  function won() {
    const d = daily(); d.n++;
    const first = d.n >= GOAL && !d.claimed;
    if (first) d.claimed = true;
    wr(K_D, d);
    return first;
  }
  const goal = () => GOAL;

  // ---- Ripasso: le domande sbagliate si ricordano e si rifanno, senza perdere minuti ----
  const idOf = o => { const s = JSON.stringify(o); let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return String(h); };
  const errors = () => rd(K_E, []);
  function noteError(sid, cls, orig) {
    if (!orig || (!orig.q && !orig.round)) return;
    const id = idOf(orig), list = errors().filter(e => e.id !== id);
    list.push({ id, sid, cls, orig, at: Date.now() });
    while (list.length > KEEP) list.shift();
    wr(K_E, list);
  }
  function fixed(id) { wr(K_E, errors().filter(e => e.id !== id)); }
  const count = () => errors().length;
  // fino a n errori, i più vecchi prima
  const pickErrors = n => errors().slice(0, n);

  // ---- Riepilogo della settimana (per i genitori) ----
  function week() {
    const d = Stats.days(14), cur = d.slice(0, 7), prev = d.slice(7);
    const sum = arr => arr.reduce((a, x) => { a.sec += x.sec; a.ok += x.ok; a.ko += x.ko; a.days += (x.sec > 0 || x.rounds > 0) ? 1 : 0;
      Object.entries(x.subj).forEach(([id, v]) => { const s = a.subj[id] || (a.subj[id] = [0, 0]); s[0] += v[0]; s[1] += v[1]; }); return a; },
      { sec: 0, ok: 0, ko: 0, days: 0, subj: {} });
    const c = sum(cur), p = sum(prev);
    const pct = a => (a.ok + a.ko) ? Math.round(a.ok / (a.ok + a.ko) * 100) : null;
    const ranked = Object.entries(c.subj).filter(([, v]) => v[0] + v[1] >= 4).map(([id, v]) => ({ id, pct: Math.round(v[0] / (v[0] + v[1]) * 100), n: v[0] + v[1] }))
      .sort((a, b) => b.pct - a.pct);
    return { days: c.days, sec: c.sec, rounds: c.ok + c.ko, pct: pct(c), prevPct: pct(p),
      best: ranked.length ? ranked[0] : null, weak: ranked.length > 1 && ranked[ranked.length - 1].pct < 70 ? ranked[ranked.length - 1] : null };
  }
  function wipe() { try { localStorage.removeItem(K_D); localStorage.removeItem(K_E); } catch (e) {} }

  return { daily, won, goal, noteError, fixed, count, pickErrors, week, wipe };
})();
