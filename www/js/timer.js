// ===== Countdown basato su orario di fine =====
// Si salva il momento di fine (non i secondi rimasti): se l'app viene chiusa
// o il telefono va in standby, alla riapertura il tempo è comunque corretto.
const Timer = (() => {
  let interval = null;

  function start(endsAt, onTick, onEnd) {
    stop();
    const tick = () => {
      const left = Math.max(0, endsAt - Date.now());
      onTick(left);
      if (left === 0) { stop(); onEnd(); }
    };
    tick();
    interval = setInterval(tick, 1000);
  }

  function stop() {
    if (interval) clearInterval(interval);
    interval = null;
  }

  function format(ms) {
    const total = Math.ceil(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = n => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  }

  return { start, stop, format };
})();
