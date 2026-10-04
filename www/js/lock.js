// ===== Blocco morbido del telefono (parte web) =====
// La parte nativa è il plugin StudyLock (plugins-local/studylock): copre le altre app finché non ci sono
// minuti sbloccati. Protezione dalla disinstallazione: amministratore del dispositivo + Impostazioni dietro PIN dei genitori. In un browser
// (senza plugin) tutte le funzioni non fanno nulla e non danno errori.
const Lock = (() => {
  const nat = () => (window.cordova && window.StudyLock) || null;
  let st = { overlay: false, usage: false, enabled: false, running: false, leftMin: 0, emergencyLeftMin: 0, emergencyToday: 0, admin: false, guard: false };

  function call(name, args) {
    return new Promise(res => {
      const n = nat();
      if (!n || typeof n[name] !== "function") return res(st);
      const done = r => { if (r && typeof r === "object") st = Object.assign({}, st, r); res(st); };
      try { n[name](...(args || []), done, () => res(st)); } catch (e) { res(st); }
    });
  }

  const available = () => !!nat();
  // blocco pronto = attivo e con entrambi i permessi Android concessi
  const ready = () => available() && st.enabled && st.overlay && st.usage;

  return {
    available, ready,
    get: () => st,
    status: () => call("status"),
    setEnabled: on => call("setEnabled", [!!on]),
    unlock: min => call("unlock", [min]),
    emergency: () => call("emergency"),
    lockNow: () => call("lockNow"),
    setPin: hash => call("setPin", [String(hash || "")]),
    requestAdmin: () => call("requestAdmin"),
    releaseAdmin: () => call("releaseAdmin"),
    openOverlaySettings: () => call("openOverlaySettings"),
    openUsageSettings: () => call("openUsageSettings"),
    openAppInfo: () => call("openAppInfo")
  };
})();
