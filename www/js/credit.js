// ===== Minuti di telefono guadagnati =====
// Si parte da MIN_MINUTES (garantiti). Il premio dipende dal livello scelto rispetto alla classe reale:
// livello più basso +1 / −1,5; il proprio +2 / −1; più alto +3 / 0 (con tetto giornaliero HIGH_CAP).
// Non si scende mai sotto il minimo garantito e non si supera il tetto della fascia.
const Credit = (() => {
  let state = Storage.loadDay();
  let classId = 0;
  const listeners = [];

  const notify = () => listeners.forEach(fn => fn(state));
  const band = () => classId <= 1 ? 0 : classId <= 4 ? 1 : 2;
  const max = () => CONFIG.MAX_BY_BAND[band()];
  const clamp = v => Math.max(CONFIG.MIN_MINUTES, Math.min(max(), v));

  // ---- pausa (cooldown) tra una sessione di guadagno e l'altra ----
  // state.sess = minuti guadagnati nella sessione in corso; state.cdUntil = fine della pausa (ms).
  const cdLeft = () => Math.max(0, (state.cdUntil || 0) - Date.now());
  const cooling = () => CONFIG.COOLDOWN_MIN > 0 && cdLeft() > 0;
  function endCooldown() { state.cdUntil = 0; state.sess = 0; Storage.saveDay(state); notify(); }
  // aggiorna la sessione col guadagno netto; restituisce true se da adesso scatta la pausa
  function trackSession(delta) {
    if (!(CONFIG.SESSION_EARN > 0) || !(CONFIG.COOLDOWN_MIN > 0) || cooling()) return false;
    state.sess = Math.max(0, (state.sess || 0) + delta);
    if (state.sess >= CONFIG.SESSION_EARN) {
      state.cdUntil = Date.now() + CONFIG.COOLDOWN_MIN * 60000;
      state.sess = 0;
      return true;
    }
    return false;
  }

  function setClass(id) { classId = id == null ? 0 : id; state.minutes = clamp(state.minutes); }
  function refresh() { state = Storage.loadDay(); state.minutes = clamp(state.minutes); notify(); }

  // rel: -1 livello più basso, 0 il proprio, +1 più alto
  function answer(isCorrect, rel) {
    const before = state.minutes;
    let r = rel || 0;
    if (r > 0 && (state.hi || 0) >= CONFIG.HIGH_CAP) r = 0;   // tetto del livello alto raggiunto: vale come il proprio
    const t0 = CONFIG.REWARD[r < 0 ? "low" : r > 0 ? "high" : "same"];
    const t = state.noPen ? { ok: t0.ok, ko: 0 } : t0;   // «oggi nessuna penalità» deciso da un genitore
    state.minutes = clamp(before + (isCorrect ? t.ok : -t.ko));
    if (isCorrect && r > 0) state.hi = (state.hi || 0) + t.ok;
    if (isCorrect) state.correct++; else state.wrong++;
    const cooldown = trackSession(state.minutes - before);
    Storage.saveDay(state);
    notify();
    return { delta: state.minutes - before, minutes: state.minutes, full: state.minutes >= max(), rel: r, cooldown };
  }

  // 3/10/2026: risultato di un esercizio = quante risposte giuste e quante sbagliate.
  // Guadagno per giusta (CONFIG.RIGHT) e perdita per sbagliata (CONFIG.WRONG; 0 alla 1ª-2ª elementare e con «nessuna penalità»).
  // Restituisce anche il traguardo raggiunto (milestone, in minuti) se c'è da fare festa: una sola volta per traguardo al giorno.
  function result(right, wrong, rel) {
    const before = state.minutes;
    let r = rel || 0;
    if (r > 0 && (state.hi || 0) >= CONFIG.HIGH_CAP) r = 0;
    const key = r < 0 ? "low" : r > 0 ? "high" : "same";
    const gain = right * CONFIG.RIGHT[key];
    const loss = (state.noPen || band() === 0) ? 0 : wrong * CONFIG.WRONG[key];
    state.minutes = clamp(before + gain - loss);
    if (r > 0) state.hi = (state.hi || 0) + gain;
    state.correct += right; state.wrong += wrong;
    let milestone = 0;
    const step = CONFIG.FEST_STEP[band()];
    for (let m = CONFIG.MIN_MINUTES + step; m <= max(); m += step) {
      if (m > (state.festMax || CONFIG.MIN_MINUTES) && state.minutes >= m) milestone = m;
    }
    if (milestone) state.festMax = milestone;
    const cooldown = trackSession(state.minutes - before);
    Storage.saveDay(state);
    notify();
    return { delta: state.minutes - before, minutes: state.minutes, full: state.minutes >= max(), rel: r, milestone, cooldown };
  }

  // regalo di un genitore: dentro il tetto del giorno
  function gift(n) { const b = state.minutes; state.minutes = clamp(b + n); state.gift = (state.gift || 0) + n; Storage.saveDay(state); notify(); return state.minutes - b; }
  function noPenalty() { state.noPen = true; Storage.saveDay(state); }
  const get = () => state.minutes;
  // minuti interi guadagnati ma non ancora usati per sbloccare il telefono (granted = già consegnati al blocco)
  const available = () => Math.max(0, Math.floor(state.minutes) - (state.granted || 0));
  function claim() {
    const n = available();
    if (n > 0) { state.granted = Math.floor(state.minutes); Storage.saveDay(state); notify(); }
    return n;
  }
  // quanta parte della barra è riempita (0..1) tra minimo e tetto
  const progress = () => (state.minutes - CONFIG.MIN_MINUTES) / (max() - CONFIG.MIN_MINUTES);
  // fotografia dei conti di oggi: base garantita, bonus guadagnato, minuti già consegnati al blocco, pausa
  function status() {
    const m = state.minutes, base = Math.min(m, CONFIG.MIN_MINUTES);
    return { base, bonus: Math.max(0, m - CONFIG.MIN_MINUTES), total: m, granted: state.granted || 0, available: available(),
      sessionEarned: state.sess || 0, cooling: cooling(), cooldownLeftMs: cdLeft() };
  }
  const highFull = () => (state.hi || 0) >= CONFIG.HIGH_CAP;
  const onChange = fn => listeners.push(fn);

  function format(min) {
    const t = Math.floor(min), h = Math.floor(t / 60), m = t % 60;
    return h > 0 ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
  }
  const fmtDelta = n => String(Math.abs(n)).replace(".", ",");

  return { answer, result, get, available, claim, cooling, cdLeft, endCooldown, status, progress, onChange, refresh, format, fmtDelta, max, setClass, highFull, gift, noPenalty };
})();
