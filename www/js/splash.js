// ===== Schermata iniziale animata: resta almeno 3 secondi, poi sfuma; un tocco la chiude (dopo l'avvio) =====
const Splash = (() => {
  const el = document.getElementById("splash"), t0 = Date.now(), MIN = 3200;
  let gone = false, booted = false;
  function remove() {
    if (gone || !el) return;
    gone = true; el.classList.add("out");
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 800);
  }
  function done() { booted = true; setTimeout(remove, Math.max(0, MIN - (Date.now() - t0))); }
  if (el) el.addEventListener("click", () => { if (booted && Date.now() - t0 > 1500) remove(); });
  setTimeout(remove, 10000);   // rete di sicurezza: non resta mai bloccata
  return { done };
})();
