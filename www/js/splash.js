// ===== Schermata iniziale animata: resta almeno 3 secondi, poi sfuma; un tocco la chiude (dopo l'avvio) =====
const Splash = (() => {
  let resuming = false;
  try { const r = JSON.parse(localStorage.getItem("sg2_resume")); resuming = !!(r && r.g && Date.now() - r.at < 6 * 3600 * 1000); } catch (e) {}
  const el = document.getElementById("splash"), t0 = Date.now(), MIN = resuming ? 0 : 3200;
  let gone = false, booted = false;
  const f = document.getElementById("sp-for");
  if (f && typeof DEDICA === "string" && DEDICA) { f.textContent = "Ideata per " + DEDICA + " \u2764\uFE0F"; f.hidden = false; }
  // versione personalizzata: il logo diventa la sua icona (img/dedica-logo.svg, copiata dalla build) e lo sfondo i suoi colori
  if (el && typeof DEDICA === "string" && DEDICA) {
    el.classList.add("sp-dedica");
    const logo = el.querySelector(".sp-logo"), im = new Image();
    im.alt = ""; im.onload = () => { if (logo) { logo.innerHTML = ""; logo.appendChild(im); } };
    im.src = "img/dedica-logo.svg";
  }
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
