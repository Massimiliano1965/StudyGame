// ===== Minuti di telefono guadagnati =====
// Si parte da MIN_MINUTES (garantiti). Giuste = +BONUS, sbagliate = -MALUS,
// ma non si scende mai sotto il minimo garantito e non si supera il tetto.
const Credit = (() => {
  let state = Storage.loadDay();
  const listeners = [];

  const notify = () => listeners.forEach(fn => fn(state));
  const clamp = v => Math.max(CONFIG.MIN_MINUTES, Math.min(CONFIG.MAX_MINUTES, v));

  function refresh() { state = Storage.loadDay(); notify(); }

  function answer(isCorrect) {
    const before = state.minutes;
    state.minutes = clamp(before + (isCorrect ? CONFIG.BONUS : -CONFIG.MALUS));
    if (isCorrect) state.correct++; else state.wrong++;
    Storage.saveDay(state);
    notify();
    return { delta: state.minutes - before, minutes: state.minutes, full: state.minutes >= CONFIG.MAX_MINUTES };
  }

  const get = () => state.minutes;
  // quanta parte della barra è riempita (0..1) tra minimo e tetto
  const progress = () => (state.minutes - CONFIG.MIN_MINUTES) / (CONFIG.MAX_MINUTES - CONFIG.MIN_MINUTES);
  const onChange = fn => listeners.push(fn);

  function format(min) {
    const h = Math.floor(min / 60), m = min % 60;
    return h > 0 ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
  }

  return { answer, get, progress, onChange, refresh, format };
})();
