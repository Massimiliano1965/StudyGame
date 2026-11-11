// Solo versione web: se il browser ingrandisce la pagina (zoom o caratteri grandi del telefono) lo schermo diventa
// più stretto di quello per cui l'app è disegnata e i pulsanti in alto si accavallano. Si disegna sempre a 360 di
// larghezza e il browser la adatta allo schermo: l'aspetto resta uguale a quello dell'app.
(function () {
  if (window.cordova) return;
  var m = document.querySelector('meta[name="viewport"]');
  var w = Math.min(window.innerWidth || 360, (window.screen && screen.width) || 360);
  if (m && w < 360) m.setAttribute("content", "width=360, viewport-fit=cover");
})();

// Solo versione web: avviso sull'app scaricabile con il blocco schermo (nell'app Android non compare)
(function () {
  if (window.cordova) return;
  const el = document.createElement("div");
  el.id = "webnote";
  el.innerHTML = `<div class="wn-card">
    <svg class="wn-ico" viewBox="0 0 64 64" aria-hidden="true"><rect x="16" y="28" width="32" height="26" rx="6" fill="#F2C35A" stroke="#474C70" stroke-width="3"/><path d="M22 28v-7a10 10 0 0 1 20 0v7" fill="none" stroke="#474C70" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="40" r="3.5" fill="#474C70"/><path d="M32 43v5" stroke="#474C70" stroke-width="3" stroke-linecap="round"/></svg>
    <h2>L'app da scaricare ha anche il blocco schermo</h2>
    <p>Nell'app per Android, i giochi del telefono restano bloccati finché il bambino non guadagna minuti con i quiz. Così impara a gestire da solo il suo tempo, e i genitori non devono controllarlo di continuo.</p>
    <p class="wn-sub">Il blocco schermo non è ancora disponibile per iPhone: per ora solo Android. Questa versione web ha tutti i giochi, ma senza blocco.</p>
    <button type="button" id="wn-ok">Ho capito, gioca!</button>
  </div>`;
  const st = document.createElement("style");
  st.textContent = `#webnote{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(51,55,90,.6);font-family:"Fredoka",system-ui,sans-serif}
#webnote .wn-card{max-width:380px;width:100%;background:#FFFBF2;color:#33375A;border:3px solid #474C70;border-radius:24px;padding:22px 20px;text-align:center;box-shadow:0 8px 0 #474C70}
#webnote .wn-ico{width:72px;height:72px}
#webnote h2{margin:8px 0 10px;font-size:22px;line-height:1.2}
#webnote p{margin:0 0 10px;font-size:16px;line-height:1.35}
#webnote .wn-sub{font-size:15px;background:#F2F6F8;border-radius:12px;padding:8px 10px}
#webnote button{margin-top:6px;width:100%;padding:14px;font:inherit;font-size:18px;font-weight:600;color:#fff;background:#EE7A98;border:3px solid #474C70;border-radius:16px}`;
  document.head.appendChild(st);
  const add = () => { document.body.appendChild(el); document.getElementById("wn-ok").onclick = () => el.remove(); };
  if (document.body) add(); else document.addEventListener("DOMContentLoaded", add);
})();

// Solo versione web: nel browser c'è meno altezza che nell'app (barre del browser) e il testo può essere ingrandito
// dal telefono. Le schermate iniziali e della creazione del profilo si rimpiccioliscono quel tanto che basta
// per stare tutte nello schermo, senza scorrere e senza che i pulsanti in basso coprano il resto.
(function () {
  if (window.cordova) return;
  var st = document.createElement("style");
  st.textContent = "html{-webkit-text-size-adjust:100%;text-size-adjust:100%}";
  document.head.appendChild(st);
  var busy = false;
  function fit() {
    busy = false;
    var sc = document.querySelector("#app > .screen.wz");
    if (!sc) return;
    sc.style.zoom = "";
    var root = document.documentElement, z = 1;
    for (var k = 0; k < 4; k++) {
      var need = root.scrollHeight, have = window.innerHeight;
      if (need <= have + 1) break;
      z = Math.max(0.6, z * have / need - 0.01);
      sc.style.zoom = z;
      if (z <= 0.6) break;
    }
  }
  function ask() { if (!busy) { busy = true; requestAnimationFrame(fit); } }
  function start() {
    var app = document.getElementById("app");
    if (!app) return;
    new MutationObserver(ask).observe(app, { childList: true, subtree: true });
    window.addEventListener("resize", ask);
    ask();
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
