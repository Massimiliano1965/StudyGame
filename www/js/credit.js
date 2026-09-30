// ===== Logica punteggio: bonus / malus / soglia =====
const Credit = (() => {
  let state;
  const listeners = [];

  function init(s) { state = s; notify(); }

  function onChange(fn) { listeners.push(fn); }
  function notify() { listeners.forEach(fn => fn(state.credit)); }

  // Applica una risposta. Ritorna { delta, credit, reached }
  function answer(isCorrect, question) {
    const bonus = question.bonus ?? CONFIG.BONUS;
    const malus = question.malus ?? CONFIG.MALUS;
    const before = state.credit;

    state.credit = isCorrect
      ? state.credit + bonus
      : Math.max(CONFIG.MIN_CREDIT, state.credit - malus);

    const reached = state.credit >= CONFIG.TARGET;
    if (reached) state.phase = "win";

    Storage.save(state);
    notify();
    return { delta: state.credit - before, credit: state.credit, reached };
  }

  const get = () => state.credit;
  const progress = () => Math.min(1, state.credit / CONFIG.TARGET);

  return { init, onChange, answer, get, progress };
})();
