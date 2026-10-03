// ===== Giochi: puzzle e tiro a segno (la domanda di scuola è il gioco) =====
// Ogni gioco crea un "giro" (round) con Games.pick(); l'app lo mostra con Games.mount().
// Quando il bambino ha finito, il gioco chiama onDone(giusto, soluzione, spiegazione).
const Games = (() => {
  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = arr => arr[rnd(0, arr.length - 1)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = n => n < 0 ? "−" + (-n) : String(n);
  const N = fmt;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  let raf = 0;
  let tapFn = () => {};
  const setTap = fn => { tapFn = fn || (() => {}); };
  let boomFn = () => {};
  const setBoom = fn => { boomFn = fn || (() => {}); };
  // piccola pioggia di coriandoli dal bottone giusto (discreta, ~1 secondo)
  function cheer(btn) {
    if (!btn || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    const r = btn.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const cols = ["#FFD23F", "#FF5C8A", "#3DDC84", "#4FC3F7", "#FF8A3D"];
    for (let k = 0; k < 16; k++) {
      const s = document.createElement("span");
      s.className = "confetto";
      s.style.left = cx + "px"; s.style.top = cy + "px";
      s.style.background = cols[k % cols.length];
      s.style.setProperty("--dx", (Math.random() * 240 - 120) + "px");
      s.style.setProperty("--dy", (Math.random() * -170 - 30) + "px");
      s.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    }
  }
  // esito visibile su una risposta a bottoni: la giusta diventa verde (✓), quella sbagliata rossa (✗), le altre si spengono
  function markAnswer(root, sel, goodBtn, chosenBtn, ok) {
    root.querySelectorAll(sel).forEach(x => { if (x !== goodBtn && x !== chosenBtn) x.classList.add("dim"); });
    if (goodBtn) { goodBtn.classList.add("good"); if (ok) { goodBtn.classList.add("pop"); cheer(goodBtn); } }
    if (!ok && chosenBtn) chosenBtn.classList.add("bad", "shake");
  }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

  // ====================================================================
  // RICOSTRUISCI LA FRASE (italiano)
  // ====================================================================
  const SENT = {
    A: [
      "Il gatto beve il latte.", "La mamma prepara la cena.", "Marco gioca con il pallone.", "Il sole splende nel cielo.",
      "La bambina legge un libro.", "Il cane corre nel giardino.", "Luca mangia una mela rossa.", "Mio papà guida la macchina.",
      "Gli uccellini cantano sull'albero.", "La nonna fa una torta.", "Il pesce nuota nel mare.", "Anna disegna un bel fiore."
    ],
    B: [
      "I bambini giocano a pallone nel cortile della scuola.", "Mia sorella più piccola ama disegnare con i pennarelli.",
      "Il treno per Milano parte dal binario cinque.", "Il pastore porta le pecore a pascolare sul prato.",
      "Nel bosco abbiamo trovato un nido pieno di uova.", "Il gelato al cioccolato è il mio gusto preferito.",
      "La maestra ha letto ai bambini una storia divertente.", "Il bidello suona la campanella alla fine della lezione.",
      "Mio fratello maggiore studia il pianoforte da due anni.", "Gli astronauti viaggiano nello spazio con una grande navicella.",
      "Il contadino raccoglie le mele mature dagli alberi.", "La biblioteca della scuola è aperta tutti i giorni."
    ],
    C: [
      "Se domani farà bel tempo, andremo a fare una gita in montagna.", "Dante Alighieri è considerato il padre della lingua italiana.",
      "Quando ho finito i compiti, mi piace leggere un buon libro.", "Il Colosseo è uno dei monumenti più visitati del mondo.",
      "Nonostante la stanchezza, Giulia ha concluso il suo allenamento.", "Leggere ogni giorno aiuta ad arricchire il proprio vocabolario.",
      "La Rivoluzione francese cambiò profondamente la società europea.", "Il Po è il fiume più lungo d'Italia.",
      "Per risolvere il problema, bisogna prima leggere con attenzione il testo.", "Gli studenti che si impegnano ottengono sempre buoni risultati.",
      "Galileo Galilei osservò le lune di Giove con il suo telescopio.", "Mentre aspettavo l'autobus, ho ripassato la lezione di storia."
    ]
  };
  let lastSentence = "";

  function makeFrase(classId) {
    const list = SENT[classId <= 1 ? "A" : classId <= 4 ? "B" : "C"];
    let s, g = 0;
    do { s = pick(list); } while (s === lastSentence && g++ < 20);
    lastSentence = s;
    const target = s.split(" ");
    let words = shuffle(target);
    g = 0;
    while (words.join(" ") === s && g++ < 30) words = shuffle(target);
    return { kind: "frase", title: "Ricostruisci la frase", prompt: "Metti le parole in ordine per fare una frase.", hint: "", items: words, solution: s };
  }

  // ====================================================================
  // RICOSTRUISCI L'OPERAZIONE (matematica)
  // ====================================================================
  // Valuta una lista di pezzi (numeri, + − × : e parentesi). Ritorna un numero oppure NaN.
  function calc(toks) {
    let i = 0;
    const num = t => /^−?\d+$/.test(String(t)) ? parseInt(String(t).replace("−", "-"), 10) : NaN;
    function factor() {
      const t = toks[i++];
      if (t === "(") { const v = expr(); return toks[i++] === ")" ? v : NaN; }
      return num(t);
    }
    function term() {
      let v = factor();
      while (toks[i] === "×" || toks[i] === ":") { const op = toks[i++], r = factor(); v = op === "×" ? v * r : v / r; }
      return v;
    }
    function expr() {
      let v = term();
      while (toks[i] === "+" || toks[i] === "−") { const op = toks[i++], r = term(); v = op === "+" ? v + r : v - r; }
      return v;
    }
    const v = expr();
    return i === toks.length ? v : NaN;
  }

  // Vero se i pezzi, messi in quest'ordine, formano un'uguaglianza giusta (qualsiasi disposizione vale)
  function isTrue(seq) {
    const e = seq.indexOf("=");
    if (e <= 0 || e !== seq.lastIndexOf("=") || e === seq.length - 1) return false;
    const l = calc(seq.slice(0, e)), r = calc(seq.slice(e + 1));
    return Number.isFinite(l) && Number.isFinite(r) && Math.abs(l - r) < 1e-9;
  }

  // Uguaglianza vera adatta alla classe (come lista di pezzi)
  function eqTokens(c) {
    const r = Math.random();
    switch (c) {
      case 0: {
        if (r < 0.5) { const a = rnd(1, 9), b = rnd(1, 10); return [N(a), "+", N(b), "=", N(a + b)]; }
        const a = rnd(1, 9), b = rnd(1, 9); return [N(a + b), "−", N(b), "=", N(a)];
      }
      case 1: {
        if (r < 0.34) { const a = rnd(11, 59), b = rnd(10, 40); return [N(a), "+", N(b), "=", N(a + b)]; }
        if (r < 0.67) { const a = rnd(40, 99), b = rnd(10, 39); return [N(a), "−", N(b), "=", N(a - b)]; }
        const t = pick([2, 5, 10]), n = rnd(2, 10); return [N(t), "×", N(n), "=", N(t * n)];
      }
      case 2: {
        if (r < 0.6) { const a = rnd(2, 10), b = rnd(2, 10); return [N(a), "×", N(b), "=", N(a * b)]; }
        const b = rnd(2, 9), x = rnd(2, 10); return [N(b * x), ":", N(b), "=", N(x)];
      }
      case 3: {
        if (r < 0.5) { const a = rnd(12, 48), b = rnd(2, 9); return [N(a), "×", N(b), "=", N(a * b)]; }
        const a = rnd(2, 9), b = rnd(2, 9), c = rnd(1, 20); return [N(a), "×", N(b), "+", N(c), "=", N(a * b + c)];
      }
      case 4: {
        const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 6); return ["(", N(a), "+", N(b), ")", "×", N(c), "=", N((a + b) * c)];
      }
      case 5: {
        if (r < 0.5) { const a = rnd(2, 9), b = rnd(2, 9), c = rnd(1, a * b - 1); return [N(a), "×", N(b), "−", N(c), "=", N(a * b - c)]; }
        const c = rnd(2, 6), s = c * rnd(3, 9), a = rnd(1, s - 1); return ["(", N(a), "+", N(s - a), ")", ":", N(c), "=", N(s / c)];
      }
      case 6: {
        const a = rnd(1, 8), b = rnd(5, 15), c = rnd(2, 6); return ["(", N(a), "−", N(b), ")", "×", N(c), "=", N((a - b) * c)];
      }
      default: {
        const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 9), d = rnd(1, 15); return [N(a), "×", "(", N(b), "+", N(c), ")", "−", N(d), "=", N(a * (b + c) - d)];
      }
    }
  }

  const prettyEq = toks => toks.join(" ").replace(/\( /g, "(").replace(/ \)/g, ")");

  function makeOperazione(classId) {
    let toks, prompt = "Metti numeri e segni al posto giusto: l'operazione deve tornare.", hint = "", problem = false;
    if (Math.random() < 0.5 && typeof Questions !== "undefined" && Questions.problem) {
      const p = Questions.problem(classId);
      toks = p.tokens; prompt = p.text; hint = "Costruisci l'operazione che risolve il problema."; problem = true;
    } else {
      toks = eqTokens(classId);
    }
    let items = shuffle(toks), g = 0;
    while (isTrue(items) && g++ < 60) items = shuffle(toks);
    return { kind: "operazione", title: "Ricostruisci l'operazione", prompt, hint, items, solution: prettyEq(toks), problem };
  }

  // Costruttore a tocchi: i pezzi in basso, la frase/operazione in alto
  function mountBuilder(el, o) {
    let placed = [], done = false;
    const kindOf = t => o.kind === "frase" ? "word" : /^−?\d+$/.test(t) ? "num" : t === "=" ? "eq" : (t === "(" || t === ")") ? "par" : "op";
    const chip = (id, cls, extra) => `<button class="chipw ${kindOf(o.items[id])} ${cls || ""}" data-id="${id}"${extra || ""}>${esc(o.items[id])}</button>`;

    function draw(state) {
      const pool = o.items.map((_, i) => i).filter(i => !placed.includes(i));
      el.innerHTML = `<div class="gbuild">
        <div class="slots ${placed.length ? "" : "empty"} ${o.kind}">${placed.length
          ? placed.map((id, pos) => chip(id, state || "", ` data-pos="${pos}"`)).join("")
          : `<span class="slot-hint">${o.kind === "frase" ? "Tocca le parole qui sotto" : "Tocca numeri e segni qui sotto"}</span>`}</div>
        <div class="pool ${o.kind}">${pool.map(i => chip(i, "")).join("")}</div>
        ${done ? "" : `<div class="gactions">
          <button class="btn ghost" data-undo ${placed.length ? "" : "disabled"}>↺ Da capo</button>
          <button class="btn go" data-go ${placed.length === o.items.length ? "" : "disabled"}>Controlla ✓</button></div>`}
      </div>`;
    }

    el.onclick = e => {
      if (done) return;
      const t = e.target.closest("button");
      if (!t || !el.contains(t) || t.disabled) return;
      if (t.dataset.pos !== undefined) placed.splice(+t.dataset.pos, 1);
      else if (t.dataset.id !== undefined) placed.push(+t.dataset.id);
      else if (t.hasAttribute("data-undo")) placed = [];
      else if (t.hasAttribute("data-go")) {
        done = true;
        const ok = o.check(placed.map(i => o.items[i]));
        draw(ok ? "ok" : "bad");
        o.onDone(ok, o.solution, ok ? o.okText : "");
        return;
      }
      tapFn();
      draw();
    };
    draw();
  }

  // ====================================================================
  // TIRO A SEGNO (italiano e matematica)
  // ====================================================================
  function makeBersaglio(classId, subjectId) {
    if (typeof Questions === "undefined") return null;
    const q = Questions.next(subjectId, classId);
    if (!q) return null;
    const speed = classId <= 2 ? 45 : classId <= 4 ? 75 : 105;
    return { kind: "bersaglio", title: "Tiro a segno", prompt: q.q, hint: "Tocca il bersaglio con la risposta giusta!", q, speed };
  }

  const LANE = 78, TCOL = ["#FFD23F", "#7ED9FF", "#FF9EC0", "#B9F27A"];

  function mountBersaglio(el, r, onDone) {
    const q = r.q;
    el.innerHTML = `<div class="arena" style="height:${q.a.length * LANE + 8}px">${q.a.map((t, i) => {
      const fs = t.length > 18 ? 15 : t.length > 11 ? 18 : 22;
      return `<button class="target" data-i="${i}" style="top:${8 + i * LANE}px;--tc:${TCOL[i % 4]};font-size:${fs}px"><span class="bull">🎯</span><span class="ttxt">${esc(t)}</span></button>`;
    }).join("")}</div>`;
    const arena = el.querySelector(".arena");
    const ts = [...arena.querySelectorAll(".target")];
    const S = ts.map(t => ({ el: t, x: 0, w: 0, v: (Math.random() < 0.5 ? -1 : 1) * r.speed * (0.7 + Math.random() * 0.6) }));
    let done = false, last = 0;

    function place(s) { s.el.style.transform = `translateX(${Math.round(s.x)}px)`; }
    function frame(now) {
      if (done) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const W = arena.clientWidth;
      for (const s of S) {
        s.w = s.el.offsetWidth || s.w;
        const max = Math.max(0, W - s.w);
        s.x += s.v * dt;
        if (s.x < 0) { s.x = 0; s.v = Math.abs(s.v); }
        if (s.x > max) { s.x = max; s.v = -Math.abs(s.v); }
        place(s);
      }
      raf = requestAnimationFrame(frame);
    }
    // posizioni di partenza sparse
    requestAnimationFrame(() => {
      const W = arena.clientWidth;
      for (const s of S) { s.w = s.el.offsetWidth; s.x = Math.random() * Math.max(0, W - s.w); place(s); }
    });
    raf = requestAnimationFrame(frame);

    function hit(i) {
      if (done) return;
      done = true; stop(); tapFn();
      const ok = i === q.c;
      ts.forEach((t, k) => {
        t.disabled = true;
        if (k === q.c) t.classList.add("ok");
        else if (k === i) t.classList.add("bad");
        else t.classList.add("dim");
      });
      ts[i].querySelector(".bull").textContent = ok ? "💥" : "✖";
      onDone(ok, q.a[q.c], q.e || "");
    }
    ts.forEach((t, i) => {
      t.addEventListener("pointerdown", e => { e.preventDefault(); hit(i); });
      t.addEventListener("click", () => hit(i));
    });
  }

  // ====================================================================
  // CORSA (italiano e matematica): il personaggio corre, scegli la corsia giusta
  // ====================================================================
  let avatarFn = null;
  const setAvatar = fn => { avatarFn = fn; };

  function makeCorsa(classId, subjectId) {
    if (typeof Questions === "undefined") return null;
    const q = Questions.next(subjectId, classId);
    if (!q || q.a.length < 3) return null;
    const wrong = shuffle(q.a.map((t, i) => i).filter(i => i !== q.c)).slice(0, 2);
    const idx = shuffle([q.c, ...wrong]);
    return { kind: "corsa", title: "Corsa", prompt: q.q, hint: "Premi Via! e porta il personaggio nella corsia della risposta giusta.",
      q, opts: idx.map(i => q.a[i]), lane: idx.indexOf(q.c), travel: classId <= 2 ? 5.5 : classId <= 4 ? 4.5 : 3.8 };
  }

  // carattere in base alla parola più lunga, così le parole non si spezzano a metà
  function gateFont(tx) {
    const lw = Math.max(...String(tx).split(/\s+/).map(w => w.length));
    const base = lw >= 12 ? 11 : lw >= 10 ? 12 : lw >= 8 ? 14 : lw >= 6 ? 17 : 20;
    return String(tx).length > 24 ? Math.min(base, 12) : String(tx).length > 14 ? Math.min(base, 14) : base;
  }

  function mountCorsa(el, r, onDone) {
    const H = 340, GH = 74, CH = 64, Y0 = 6, Y1 = (H - 8 - CH) + CH * 0.5 - GH;
    let lane = 1, started = false, done = false, t = 0, last = 0;
    const laneLeft = l => ((l + 0.5) * 100 / 3) + "%";
    el.innerHTML = `<div class="runwrap">
      <div class="track" style="height:${H}px">
        ${[0, 1, 2].map(i => `<div class="lane" data-l="${i}"></div>`).join("")}
        ${r.opts.map((tx, i) => `<div class="gate" style="left:${i * 100 / 3}%;top:${Y0}px;--tc:${TCOL[i]};font-size:${gateFont(tx)}px"><span>${esc(tx)}</span></div>`).join("")}
        <div class="runner" style="left:${laneLeft(lane)}">${avatarFn ? avatarFn() : "🏃"}</div>
        <button class="btn big gostart">▶ Via!</button>
      </div>
      <div class="runctl"><button class="btn alt" data-mv="-1" aria-label="Sinistra">◀</button><button class="btn alt" data-mv="1" aria-label="Destra">▶</button></div>
    </div>`;
    const track = el.querySelector(".track"), runner = el.querySelector(".runner"), gates = [...el.querySelectorAll(".gate")];
    function setLane(n) { if (done) return; lane = Math.max(0, Math.min(2, n)); runner.style.left = laneLeft(lane); tapFn(); }
    el.querySelectorAll(".lane").forEach(l => l.addEventListener("pointerdown", e => { e.preventDefault(); setLane(+l.dataset.l); }));
    el.querySelectorAll(".lane").forEach(l => l.addEventListener("click", () => setLane(+l.dataset.l)));
    el.querySelectorAll("[data-mv]").forEach(b => b.addEventListener("click", () => setLane(lane + +b.dataset.mv)));

    function finish() {
      done = true; stop();
      const ok = lane === r.lane;
      gates.forEach((g, i) => g.classList.add(i === r.lane ? "ok" : i === lane ? "bad" : "dim"));
      el.querySelectorAll("[data-mv]").forEach(b => { b.disabled = true; });
      onDone(ok, r.q.a[r.q.c], r.q.e || "");
    }
    function frame(now) {
      if (done) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now; t += dt;
      const p = Math.min(1, t / r.travel), y = Y0 + (Y1 - Y0) * p;
      gates.forEach(g => { g.style.top = Math.round(y) + "px"; });
      if (p >= 1) { finish(); return; }
      raf = requestAnimationFrame(frame);
    }
    el.querySelector(".gostart").addEventListener("click", e => {
      if (started) return;
      started = true; e.currentTarget.remove(); tapFn();
      raf = requestAnimationFrame(frame);
    });
  }

  // ====================================================================
  // INCASTRO (italiano e matematica): collega ogni pezzo al suo posto
  // ====================================================================
  function mathPairs(c) {
    const geoPair = () => {
      const fig = [["Triangolo", "3 lati"], ["Quadrato", "4 lati"], ["Pentagono", "5 lati"], ["Esagono", "6 lati"], ["Ottagono", "8 lati"]];
      if (c === 0) { const f = pick(fig.slice(0, 2)); return { l: f[0], r: f[1] }; }
      if (c <= 2) { const f = pick(fig.slice(0, 4)); return { l: f[0], r: f[1] }; }
      if (c === 3) { const l = rnd(3, 15); return pick([{ l: `Perimetro quadrato, lato ${l} cm`, r: `${4 * l} cm` }, { l: `Quadrato di perimetro ${4 * l} cm: lato`, r: `${l} cm` }]); }
      if (c === 4) { const l = rnd(3, 12), h = rnd(2, 9); return pick([{ l: `Area quadrato, lato ${l} cm`, r: `${l * l} cm²` }, { l: `Perimetro rettangolo ${l} × ${h} cm`, r: `${2 * (l + h)} cm` }]); }
      if (c === 5) { const b = 2 * rnd(2, 9), h = rnd(2, 9); return pick([{ l: `Area triangolo, base ${b} altezza ${h}`, r: `${b * h / 2} cm²` }, { l: `Spigolo cubo ${rnd(2, 5)} cm: volume`, r: null }]); }
      if (c === 6) { const t = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]); return pick([{ l: `Cateti ${t[0]} e ${t[1]}: ipotenusa`, r: `${t[2]} cm` }, { l: `Triangolo con angoli ${t[0] * 10}° e ${t[1] * 5}°: il terzo`, r: `${180 - t[0] * 10 - t[1] * 5}°` }]); }
      const t = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]); const x = rnd(2, 6); return pick([{ l: `Cateti ${t[0]} e ${t[1]}: ipotenusa`, r: `${t[2]} cm` }, { l: `Cubo di spigolo ${x} cm: volume`, r: `${x * x * x} cm³` }]);
    };
    const gen = () => {
      if (Math.random() < 0.2) { const g = geoPair(); if (g && g.r) return g; }
      switch (c) {
        case 0: {
          if (Math.random() < 0.6) { const a = rnd(1, 9), b = rnd(1, 10); return { l: `${a} + ${b}`, r: N(a + b) }; }
          const a = rnd(1, 9), b = rnd(1, 9); return { l: `${a + b} − ${b}`, r: N(a) };
        }
        case 1: {
          const k = rnd(0, 2);
          if (k === 0) { const a = rnd(11, 59), b = rnd(10, 40); return { l: `${a} + ${b}`, r: N(a + b) }; }
          if (k === 1) { const a = rnd(40, 99), b = rnd(10, 39); return { l: `${a} − ${b}`, r: N(a - b) }; }
          const t = pick([2, 5, 10]), n = rnd(2, 10); return { l: `${t} × ${n}`, r: N(t * n) };
        }
        case 2: {
          if (Math.random() < 0.6) { const a = rnd(2, 10), b = rnd(2, 10); return { l: `${a} × ${b}`, r: N(a * b) }; }
          const b = rnd(2, 9), x = rnd(2, 10); return { l: `${b * x} : ${b}`, r: N(x) };
        }
        case 3: {
          const k = rnd(0, 2);
          if (k === 0) { const a = rnd(12, 48), b = rnd(2, 9); return { l: `${a} × ${b}`, r: N(a * b) }; }
          if (k === 1) { const d = pick([2, 3, 4, 5]), n = rnd(2, 8) * d; return { l: `1/${d} di ${n}`, r: N(n / d) }; }
          const a = rnd(3, 9), b = rnd(3, 9), x = rnd(1, 20); return { l: `${a} × ${b} + ${x}`, r: N(a * b + x) };
        }
        case 4: {
          const k = rnd(0, 2);
          if (k === 0) { const p = pick([10, 25, 50]), n = rnd(2, 10) * 20; return { l: `${p}% di ${n}`, r: N(n * p / 100) }; }
          if (k === 1) { const l = rnd(3, 15), h = rnd(2, 12); return { l: `Area ${l} × ${h} cm`, r: `${l * h} cm²` }; }
          const a = rnd(2, 9), b = rnd(2, 9), x = rnd(2, 6); return { l: `(${a} + ${b}) × ${x}`, r: N((a + b) * x) };
        }
        case 5: {
          const k = rnd(0, 2);
          if (k === 0) { const b = rnd(2, 9); return { l: `${b}²`, r: N(b * b) }; }
          if (k === 1) { const b = rnd(2, 5); return { l: `${b}³`, r: N(b * b * b) }; }
          const a = rnd(2, 6), b = rnd(7, 12); return { l: `${a * b} : ${a} + ${b}`, r: N(b + b) };
        }
        case 6: {
          if (Math.random() < 0.55) { const a = rnd(2, 12), b = rnd(2, 15); return { l: `${N(-a)} + ${b}`, r: N(b - a) }; }
          const x = rnd(3, 15); return { l: `√${x * x}`, r: N(x) };
        }
        default: {
          const x = rnd(2, 14);
          if (Math.random() < 0.5) { const b = rnd(1, 20); return { l: `x + ${b} = ${x + b}`, r: `x = ${x}` }; }
          const a = rnd(2, 9); return { l: `${a}x = ${a * x}`, r: `x = ${x}` };
        }
      }
    };
    const out = []; let g = 0;
    while (out.length < 4 && g++ < 300) { const p = gen(); if (!out.some(o => o.r === p.r || o.l === p.l)) out.push(p); }
    return out;
  }

  const ITA_PAIRS = {
    A: [
      { prompt: "Collega ogni parola al suo contrario.", pairs: [["alto", "basso"], ["caldo", "freddo"], ["grande", "piccolo"], ["giorno", "notte"], ["aperto", "chiuso"], ["veloce", "lento"], ["pieno", "vuoto"], ["felice", "triste"], ["dolce", "amaro"], ["nuovo", "vecchio"]] },
      { prompt: "Collega ogni parola al suo plurale.", pairs: [["gatto", "gatti"], ["fiore", "fiori"], ["penna", "penne"], ["libro", "libri"], ["casa", "case"], ["albero", "alberi"], ["bambino", "bambini"], ["sedia", "sedie"], ["mela", "mele"]] },
      { prompt: "Collega ogni animale al suo verso.", pairs: [["cane", "abbaia"], ["gatto", "miagola"], ["mucca", "muggisce"], ["pecora", "bela"], ["asino", "raglia"], ["leone", "ruggisce"], ["rana", "gracida"], ["cavallo", "nitrisce"], ["maiale", "grugnisce"]] }
    ],
    B: [
      { prompt: "Collega ogni parola al suo contrario.", pairs: [["generoso", "avaro"], ["antico", "moderno"], ["rumoroso", "silenzioso"], ["coraggioso", "pauroso"], ["ricco", "povero"], ["lontano", "vicino"], ["ampio", "stretto"], ["pesante", "leggero"]] },
      { prompt: "Collega le parole che significano la stessa cosa.", pairs: [["felice", "contento"], ["veloce", "rapido"], ["bello", "grazioso"], ["stanco", "esausto"], ["arrabbiato", "furioso"], ["strano", "bizzarro"], ["gentile", "cortese"]] },
      { prompt: "Collega ogni parola al suo plurale.", pairs: [["uomo", "uomini"], ["uovo", "uova"], ["dito", "dita"], ["braccio", "braccia"], ["lago", "laghi"], ["medico", "medici"], ["bue", "buoi"], ["ala", "ali"]] },
      { prompt: "Collega ogni verbo al suo passato prossimo.", pairs: [["mangiare", "ho mangiato"], ["partire", "sono partito"], ["bere", "ho bevuto"], ["andare", "sono andato"], ["vedere", "ho visto"], ["scrivere", "ho scritto"], ["fare", "ho fatto"], ["venire", "sono venuto"]] }
    ],
    C: [
      { prompt: "Collega ogni figura retorica al suo esempio.", pairs: [["Metafora", "Sei una roccia"], ["Similitudine", "Veloce come il vento"], ["Onomatopea", "Din don"], ["Iperbole", "Ho aspettato un secolo"], ["Personificazione", "Il vento sussurra"]] },
      { prompt: "Collega ogni autore alla sua opera.", pairs: [["Manzoni", "I promessi sposi"], ["Dante", "Divina Commedia"], ["Collodi", "Pinocchio"], ["Boccaccio", "Decameron"], ["Verga", "I Malavoglia"], ["Petrarca", "Canzoniere"], ["Calvino", "Il barone rampante"], ["Leopardi", "L'infinito"]] },
      { prompt: "Collega ogni parola alla sua categoria.", pairs: [["veloce", "aggettivo"], ["correre", "verbo"], ["perché", "congiunzione"], ["Roma", "nome proprio"], ["lentamente", "avverbio"], ["di", "preposizione"], ["io", "pronome"]] }
    ]
  };

  const ENG_PAIRS = {
    A: [
      { prompt: "Collega ogni colore inglese al suo significato.", pairs: [["red", "rosso"], ["blue", "blu"], ["green", "verde"], ["yellow", "giallo"], ["black", "nero"], ["white", "bianco"], ["pink", "rosa"], ["orange", "arancione"]] },
      { prompt: "Collega ogni animale inglese al suo significato.", pairs: [["dog", "cane"], ["cat", "gatto"], ["bird", "uccello"], ["fish", "pesce"], ["horse", "cavallo"], ["cow", "mucca"], ["rabbit", "coniglio"], ["duck", "anatra"]] },
      { prompt: "Collega ogni numero inglese al suo significato.", pairs: [["one", "uno"], ["two", "due"], ["three", "tre"], ["four", "quattro"], ["five", "cinque"], ["six", "sei"], ["seven", "sette"], ["ten", "dieci"]] }
    ],
    B: [
      { prompt: "Collega ogni parola della scuola al suo significato.", pairs: [["pencil", "matita"], ["desk", "banco"], ["teacher", "insegnante"], ["bag", "zaino"], ["window", "finestra"], ["door", "porta"], ["chair", "sedia"]] },
      { prompt: "Collega ogni parola della famiglia al suo significato.", pairs: [["mother", "madre"], ["father", "padre"], ["brother", "fratello"], ["sister", "sorella"], ["grandmother", "nonna"], ["uncle", "zio"], ["aunt", "zia"]] },
      { prompt: "Collega ogni verbo inglese al suo significato.", pairs: [["to eat", "mangiare"], ["to drink", "bere"], ["to sleep", "dormire"], ["to run", "correre"], ["to read", "leggere"], ["to write", "scrivere"], ["to open", "aprire"]] },
      { prompt: "Collega ogni parola della tavola al suo significato.", pairs: [["bread", "pane"], ["banana", "banana"], ["bottle", "bottiglia"], ["plate", "piatto"], ["glass", "bicchiere"], ["apple", "mela"], ["fork", "forchetta"], ["milk", "latte"]] }
    ],
    C: [
      { rEn: true, prompt: "Collega ogni parola inglese al suo contrario.", pairs: [["hot", "cold"], ["early", "late"], ["easy", "difficult"], ["rich", "poor"], ["strong", "weak"], ["safe", "dangerous"]] },
      { rEn: true, prompt: "Collega ogni verbo inglese irregolare al suo passato (past simple).", pairs: [["go", "went"], ["see", "saw"], ["eat", "ate"], ["buy", "bought"], ["take", "took"], ["write", "wrote"], ["have", "had"]] },
      { prompt: "Collega ogni parola inglese al suo significato.", pairs: [["although", "anche se"], ["however", "tuttavia"], ["because", "perché"], ["always", "sempre"], ["never", "mai"], ["together", "insieme"]] }
    ]
  };


  // ---- Storia e Geografia: temi per i giochi di collegamento ----
  const STO_PAIRS = {
    A: [
      { prompt: "Collega ogni giorno della settimana al giorno che viene dopo.", pairs: [["lunedì", "martedì"], ["martedì", "mercoledì"], ["mercoledì", "giovedì"], ["giovedì", "venerdì"], ["venerdì", "sabato"], ["sabato", "domenica"]] },
      { prompt: "Collega ogni stagione a un suo mese.", pairs: [["inverno", "gennaio"], ["primavera", "aprile"], ["estate", "luglio"], ["autunno", "ottobre"]] },
      { prompt: "Collega ogni cosa di una volta a quella di oggi.", pairs: [["candela", "lampadina"], ["lettera", "messaggio"], ["carrozza", "automobile"]] }
    ],
    B: [
      { prompt: "Collega ogni popolo antico al suo luogo.", pairs: [["Egizi", "Nilo"], ["Sumeri", "Mesopotamia"], ["Greci", "Atene"], ["Romani", "Roma"], ["Etruschi", "Etruria"]] },
      { prompt: "Collega ogni personaggio alla sua storia.", pairs: [["Romolo", "fondò Roma"], ["Giulio Cesare", "generale romano"], ["Augusto", "primo imperatore"], ["Annibale", "elefanti e Alpi"], ["Colombo", "scoprì l'America"], ["Leonardo", "la Gioconda"]] },
      { prompt: "Collega ogni monumento al suo popolo.", pairs: [["Piramidi", "Egizi"], ["Colosseo", "Romani"], ["Partenone", "Greci"], ["Tombe dipinte", "Etruschi"], ["Tavolette d'argilla", "Sumeri"]] },
      { prompt: "Collega ogni evento alla sua data.", pairs: [["Nascita di Roma", "753 a.C."], ["Caduta di Roma", "476 d.C."], ["Scoperta dell'America", "1492"], ["Rivoluzione francese", "1789"]] }
    ],
    C: [
      { cl: [6, 7], prompt: "Collega ogni evento alla sua data.", pairs: [["Scoperta dell'America", "1492"], ["Rivoluzione francese", "1789"], ["Unità d'Italia", "1861"], ["Prima guerra mondiale", "1914"], ["Repubblica italiana", "1946"], ["Caduta del Muro", "1989"]] },
      { cl: [6, 7], prompt: "Collega ogni personaggio al suo ruolo.", pairs: [["Napoleone", "imperatore francese"], ["Garibaldi", "spedizione dei Mille"], ["Cavour", "primo ministro"], ["Gutenberg", "stampa"], ["Lutero", "Riforma"], ["Colombo", "America"]] },
      { prompt: "Collega ogni periodo alla sua caratteristica.", pairs: [["Feudalesimo", "signori e vassalli"], ["Rinascimento", "arte e cultura classica"], ["Rivoluzione industriale", "macchine e fabbriche"], ["Crociate", "Terra Santa"], ["Illuminismo", "la ragione"]] }
    ]
  };

  const GEO_PAIRS = {
    A: [
      { prompt: "Collega ogni parte del paesaggio alla sua descrizione.", pairs: [["mare", "acqua salata"], ["lago", "acqua tra le terre"], ["montagna", "cima alta"], ["fiume", "acqua che scorre"], ["pianura", "terra piatta"], ["isola", "terra nel mare"]] },
      { prompt: "Collega ogni città italiana a ciò per cui è famosa.", pairs: [["Venezia", "canali"], ["Roma", "Colosseo"], ["Napoli", "Vesuvio"], ["Pisa", "torre pendente"], ["Milano", "Duomo"], ["Firenze", "Cupola"]] }
    ],
    B: [
      { prompt: "Collega ogni regione al suo capoluogo.", pairs: [["Lombardia", "Milano"], ["Piemonte", "Torino"], ["Toscana", "Firenze"], ["Sicilia", "Palermo"], ["Campania", "Napoli"], ["Veneto", "Venezia"], ["Sardegna", "Cagliari"], ["Lazio", "Roma"], ["Liguria", "Genova"], ["Emilia-Romagna", "Bologna"]] },
      { prompt: "Collega ogni stato alla sua capitale.", pairs: [["Francia", "Parigi"], ["Spagna", "Madrid"], ["Germania", "Berlino"], ["Regno Unito", "Londra"], ["Portogallo", "Lisbona"], ["Grecia", "Atene"]] },
      { prompt: "Collega ogni parola alla sua definizione.", pairs: [["isola", "terra nel mare"], ["penisola", "quasi tutta nel mare"], ["golfo", "mare dentro la costa"], ["delta", "foce a più rami"], ["altopiano", "pianura in alto"]] }
    ],
    C: [
      { prompt: "Collega ogni stato alla sua capitale.", pairs: [["Canada", "Ottawa"], ["Australia", "Canberra"], ["Brasile", "Brasilia"], ["Turchia", "Ankara"], ["Svizzera", "Berna"], ["Egitto", "Il Cairo"], ["Giappone", "Tokyo"], ["Polonia", "Varsavia"]] },
      { prompt: "Collega ogni montagna al suo continente.", pairs: [["Everest", "Asia"], ["Kilimangiaro", "Africa"], ["Monte Bianco", "Europa"], ["Aconcagua", "America"]] },
      { prompt: "Collega ogni fiume alla città che attraversa.", pairs: [["Senna", "Parigi"], ["Tamigi", "Londra"], ["Tevere", "Roma"], ["Arno", "Firenze"], ["Nilo", "Il Cairo"]] }
    ]
  };
  const SCI_PAIRS = {
    A: [
      { prompt: "Collega ogni animale al suo cucciolo.", pairs: [["gatto", "gattino"], ["cane", "cucciolo"], ["mucca", "vitello"], ["pecora", "agnello"], ["cavallo", "puledro"], ["gallina", "pulcino"]] },
      { prompt: "Collega ogni parte del corpo al suo senso.", pairs: [["occhi", "vista"], ["orecchie", "udito"], ["naso", "olfatto"], ["lingua", "gusto"], ["pelle", "tatto"]] },
      { prompt: "Collega ogni parte della pianta a ciò che fa.", pairs: [["radice", "beve l'acqua"], ["foglia", "prende la luce"], ["fiore", "diventa frutto"], ["seme", "nasce la pianta"], ["tronco", "sostiene la pianta"]] }
    ],
    B: [
      { prompt: "Collega ogni pianeta alla sua caratteristica.", pairs: [["Mercurio", "il più vicino al Sole"], ["Giove", "il più grande"], ["Marte", "il pianeta rosso"], ["Saturno", "gli anelli"], ["Terra", "la vita"]] },
      { prompt: "Collega ogni animale alla sua classe.", pairs: [["delfino", "mammifero"], ["aquila", "uccello"], ["rana", "anfibio"], ["serpente", "rettile"], ["squalo", "pesce"], ["ape", "insetto"]] },
      { prompt: "Collega ogni passaggio di stato al suo nome.", pairs: [["da solido a liquido", "fusione"], ["da liquido a gas", "evaporazione"], ["da gas a liquido", "condensazione"], ["da liquido a solido", "solidificazione"]] },
      { prompt: "Collega ogni organo alla sua funzione.", pairs: [["cuore", "pompa il sangue"], ["polmoni", "respirare"], ["stomaco", "digerisce"], ["cervello", "pensare"], ["ossa", "sostengono il corpo"]] }
    ],
    C: [
      { prompt: "Collega ogni simbolo al suo elemento chimico.", pairs: [["H", "idrogeno"], ["O", "ossigeno"], ["Fe", "ferro"], ["Na", "sodio"], ["C", "carbonio"], ["Au", "oro"]] },
      { prompt: "Collega ogni scienziato alla sua scoperta.", pairs: [["Newton", "gravitazione"], ["Darwin", "evoluzione"], ["Mendel", "ereditarietà"], ["Galileo", "telescopio"], ["Marie Curie", "radioattività"], ["Pasteur", "pastorizzazione"]] },
      { prompt: "Collega ogni unità di misura alla sua grandezza.", pairs: [["metro", "lunghezza"], ["chilogrammo", "massa"], ["secondo", "tempo"], ["Kelvin", "temperatura"], ["Newton", "forza"], ["Joule", "energia"]] }
    ]
  };
  // ---- Tecnologia, Arte, Musica, Educazione civica, Seconda lingua, Latino ----
  const TEC_PAIRS = {
    A: [
      { prompt: "Collega ogni oggetto a ciò che serve a fare.", pairs: [["forbici", "tagliare"], ["colla", "incollare"], ["penna", "scrivere"], ["telefono", "telefonare"], ["frigorifero", "conservare il cibo"], ["lampadina", "fare luce"]] },
      { prompt: "Collega ogni mezzo di trasporto a dove viaggia.", pairs: [["treno", "rotaie"], ["aereo", "cielo"], ["nave", "mare"], ["bicicletta", "strada"], ["metropolitana", "sotto terra"]] }
    ],
    B: [
      { prompt: "Collega ogni materiale a ciò da cui si ricava.", pairs: [["carta", "legno degli alberi"], ["vetro", "sabbia"], ["plastica", "petrolio"], ["lana", "pecora"], ["cotone", "pianta del cotone"]] },
      { prompt: "Collega ogni parte del computer a ciò che fa.", pairs: [["tastiera", "scrivere"], ["mouse", "muovere il cursore"], ["stampante", "stampare su carta"], ["schermo", "mostrare le immagini"], ["casse", "riprodurre i suoni"], ["microfono", "registrare la voce"]] },
      { prompt: "Collega ogni fonte di energia a come si ottiene.", pairs: [["solare", "dalla luce del Sole"], ["eolica", "dal vento"], ["idroelettrica", "dall'acqua che cade"], ["geotermica", "dal calore della Terra"], ["petrolio", "combustibile fossile"]] }
    ],
    C: [
      { prompt: "Collega ogni unità di misura elettrica alla sua grandezza.", pairs: [["volt", "tensione"], ["ampere", "corrente"], ["watt", "potenza"], ["ohm", "resistenza"], ["kilowattora", "energia consumata"]] },
      { prompt: "Collega ogni termine informatico al suo significato.", pairs: [["algoritmo", "sequenza di istruzioni"], ["bit", "0 oppure 1"], ["browser", "naviga su Internet"], ["firewall", "protegge la rete"], ["URL", "indirizzo web"], ["password", "chiave segreta"]] },
      { prompt: "Collega ogni materiale a una sua proprietà.", pairs: [["rame", "conduce l'elettricità"], ["gomma", "isola dall'elettricità"], ["vetro", "trasparente e fragile"], ["acciaio", "duro e resistente"], ["alluminio", "leggero"]] }
    ]
  };
  const ART_PAIRS = {
    A: [
      { prompt: "Collega ogni cosa al suo colore.", pairs: [["sole", "giallo"], ["erba", "verde"], ["fragola", "rosso"], ["neve", "bianco"], ["cielo sereno", "azzurro"]] },
      { prompt: "Collega ogni artista a ciò che usa.", pairs: [["pittore", "pennello"], ["scultore", "scalpello"], ["fotografo", "macchina fotografica"], ["disegnatore", "matita"], ["ceramista", "argilla"]] }
    ],
    B: [
      { prompt: "Collega ogni artista alla sua opera.", pairs: [["Leonardo", "La Gioconda"], ["Michelangelo", "Il David"], ["Van Gogh", "Notte stellata"], ["Picasso", "Guernica"], ["Botticelli", "La Primavera"], ["Klimt", "Il bacio"]] },
      { prompt: "Collega ogni opera al luogo dove si trova.", pairs: [["Gioconda", "Louvre, Parigi"], ["David", "Firenze"], ["Cappella Sistina", "Città del Vaticano"], ["Ultima Cena", "Milano"], ["Partenone", "Atene"], ["Colosseo", "Roma"]] },
      { prompt: "Collega ogni tecnica a come si fa.", pairs: [["acquerello", "colori diluiti in acqua"], ["affresco", "sul muro fresco"], ["mosaico", "piccole tessere"], ["collage", "pezzi incollati"], ["scultura", "si scolpisce un blocco"]] }
    ],
    C: [
      { prompt: "Collega ogni artista alla sua corrente.", pairs: [["Monet", "Impressionismo"], ["Picasso", "Cubismo"], ["Dalí", "Surrealismo"], ["Warhol", "Pop art"], ["Boccioni", "Futurismo"], ["Caravaggio", "Barocco"]] },
      { prompt: "Collega ogni stile a una sua caratteristica.", pairs: [["Romanico", "archi a tutto sesto"], ["Gotico", "archi a sesto acuto"], ["Barocco", "movimento e decorazioni"], ["Rinascimento", "prospettiva e proporzioni"], ["Neoclassico", "ispirato all'antica Grecia"]] },
      { prompt: "Collega ogni monumento alla sua città.", pairs: [["Torre pendente", "Pisa"], ["Cupola di Brunelleschi", "Firenze"], ["Arena", "Verona"], ["Basilica di San Marco", "Venezia"], ["Mole Antonelliana", "Torino"]] }
    ]
  };
  const MUS_PAIRS = {
    A: [
      { prompt: "Collega ogni strumento a come si suona.", pairs: [["flauto", "si soffia"], ["tamburo", "si batte"], ["violino", "si usa l'archetto"], ["chitarra", "si pizzicano le corde"], ["pianoforte", "si premono i tasti"]] },
      { prompt: "Collega ogni parola della musica al suo significato.", pairs: [["forte", "con tanto volume"], ["piano", "con poco volume"], ["acuto", "alto, come un uccellino"], ["grave", "basso, come un leone"], ["veloce", "rapido"], ["lento", "calmo"]] }
    ],
    B: [
      { prompt: "Collega ogni compositore a una sua opera.", pairs: [["Vivaldi", "Le quattro stagioni"], ["Verdi", "La traviata"], ["Rossini", "Il barbiere di Siviglia"], ["Mozart", "Il flauto magico"], ["Puccini", "Tosca"], ["Beethoven", "Nona sinfonia"]] },
      { prompt: "Collega ogni strumento alla sua famiglia.", pairs: [["violino", "archi"], ["tromba", "ottoni"], ["flauto", "legni"], ["timpano", "percussioni"], ["pianoforte", "tastiera"]] },
      { prompt: "Collega ogni segno della musica al suo significato.", pairs: [["f (forte)", "suonare con forza"], ["p (piano)", "suonare piano"], ["crescendo", "volume che aumenta"], ["diminuendo", "volume che diminuisce"], ["pausa", "silenzio"]] }
    ],
    C: [
      { prompt: "Collega ogni compositore alla sua epoca.", pairs: [["Bach", "Barocco"], ["Mozart", "Classicismo"], ["Chopin", "Romanticismo"], ["Debussy", "Impressionismo"], ["Stravinskij", "Novecento"]] },
      { prompt: "Collega ogni indicazione di velocità della musica al suo significato.", pairs: [["adagio", "lento"], ["andante", "a passo di camminata"], ["allegro", "veloce"], ["presto", "velocissimo"], ["moderato", "né lento né veloce"]] },
      { prompt: "Collega ogni voce del coro al suo tipo.", pairs: [["soprano", "femminile acuta"], ["contralto", "femminile grave"], ["tenore", "maschile acuta"], ["basso", "maschile grave"]] }
    ]
  };
  const CIV_PAIRS = {
    A: [
      { prompt: "Collega ogni luogo a chi ci lavora.", pairs: [["ospedale", "medico"], ["scuola", "maestra"], ["caserma dei pompieri", "vigile del fuoco"], ["stazione di polizia", "poliziotto"], ["biblioteca", "bibliotecario"]] },
      { prompt: "Collega ogni segnale a ciò che dobbiamo fare.", pairs: [["semaforo rosso", "fermarsi"], ["semaforo verde", "passare"], ["semaforo giallo", "fare attenzione"], ["strisce pedonali", "attraversare"], ["marciapiede", "camminare"]] },
      { prompt: "Collega ogni rifiuto al suo contenitore.", pairs: [["giornale", "carta"], ["bottiglia di vetro", "vetro"], ["bottiglia di plastica", "plastica"], ["buccia di banana", "umido"], ["lattina", "metalli"]] }
    ],
    B: [
      { prompt: "Collega ogni festa alla sua data.", pairs: [["Festa della Repubblica", "2 giugno"], ["Festa della Liberazione", "25 aprile"], ["Festa dei lavoratori", "1 maggio"], ["Giorno della Memoria", "27 gennaio"], ["Natale", "25 dicembre"]] },
      { prompt: "Collega ogni organo dello Stato a ciò che fa.", pairs: [["Parlamento", "fa le leggi"], ["Governo", "fa funzionare lo Stato"], ["Presidente della Repubblica", "garante della Costituzione"], ["Magistratura", "applica le leggi"], ["Sindaco", "guida il Comune"]] },
      { prompt: "Collega ogni simbolo italiano a ciò che è.", pairs: [["tricolore", "la bandiera"], ["Canto degli Italiani", "l'inno"], ["Roma", "la capitale"], ["euro", "la moneta"], ["Costituzione", "la legge fondamentale"]] }
    ],
    C: [
      { prompt: "Collega ogni articolo della Costituzione al suo tema.", pairs: [["Art. 1", "Repubblica fondata sul lavoro"], ["Art. 3", "uguaglianza"], ["Art. 11", "ripudio della guerra"], ["Art. 21", "libertà di pensiero"], ["Art. 34", "scuola aperta a tutti"]] },
      { prompt: "Collega ogni organizzazione al suo scopo.", pairs: [["ONU", "pace tra le nazioni"], ["Unione europea", "cooperazione tra Stati europei"], ["UNESCO", "cultura e istruzione"], ["OMS", "salute nel mondo"], ["UNICEF", "diritti dei bambini"]] },
      { prompt: "Collega ogni data a ciò che è successo.", pairs: [["2 giugno 1946", "nasce la Repubblica"], ["1° gennaio 1948", "Costituzione in vigore"], ["1957", "Trattati di Roma"], ["2002", "entra l'euro"]] }
    ]
  };
  const LAT_PAIRS = (() => {
    const C = [
      { prompt: "Collega ogni parola latina al suo significato.", pairs: [["puer", "ragazzo"], ["puella", "ragazza"], ["agricola", "contadino"], ["domus", "casa"], ["via", "strada"], ["nox", "notte"], ["rex", "re"], ["equus", "cavallo"]] },
      { prompt: "Collega ogni frase latina al suo significato.", pairs: [["Carpe diem", "cogli l'attimo"], ["Alea iacta est", "il dado è tratto"], ["Veni, vidi, vici", "venni, vidi, vinsi"], ["Errare humanum est", "sbagliare è umano"], ["Mens sana in corpore sano", "mente sana in corpo sano"]] },
      { prompt: "Collega ogni forma di «sum» al suo significato.", pairs: [["sum", "io sono"], ["es", "tu sei"], ["est", "egli è"], ["sumus", "noi siamo"], ["estis", "voi siete"], ["sunt", "essi sono"]] }
    ];
    return { A: C, B: C, C };
  })();
  const OTHER_PAIRS = { storia: STO_PAIRS, geografia: GEO_PAIRS, scienze: SCI_PAIRS, tecnologia: TEC_PAIRS, arte: ART_PAIRS, musica: MUS_PAIRS, civica: CIV_PAIRS, get lingua2() { return L2.pairs(); }, latino: LAT_PAIRS };

  // ====================================================================
  // SCENE DEL PUZZLE COMPLETATO (emoji, funzionano anche offline)
  // [sfondo, [[emoji, x%, y%, grandezza px], ...], didascalia]
  // ====================================================================
  const SKY = "linear-gradient(#BEE9FF 0 58%, #9EE493 58%)";
  const SCENES = {
    colori: ["linear-gradient(#BEE9FF, #E8F7FF)", [["🌈", 50, 38, 120], ["☁️", 14, 18, 56], ["☁️", 86, 22, 48], ["🎨", 26, 80, 56], ["🖍️", 50, 84, 44], ["🌻", 74, 78, 54], ["🦋", 84, 52, 36]], "Che bel mondo a colori!"],
    animali: [SKY, [["☀️", 90, 12, 40], ["🏡", 80, 46, 66], ["🌳", 10, 46, 66], ["🐦", 45, 18, 34], ["🐄", 28, 72, 58], ["🐴", 55, 70, 58], ["🐇", 74, 84, 40], ["🦆", 16, 88, 38]], "Una fattoria piena di amici!"],
    numeri: ["linear-gradient(#FFE3F1, #FFF5C2)", [["🎂", 50, 72, 82], ["🎈", 18, 36, 60], ["🎈", 34, 22, 52], ["🎈", 66, 22, 52], ["🎈", 82, 36, 60], ["🎉", 14, 80, 48], ["🎁", 86, 80, 48]], "Che festa! Tutti i numeri a posto!"],
    scuola: ["linear-gradient(#FFF1C9 0 62%, #E0B98A 62%)", [["🪟", 14, 30, 56], ["🧑‍🏫", 50, 34, 68], ["🚪", 88, 36, 60], ["🪑", 22, 76, 54], ["🪑", 44, 80, 54], ["🎒", 66, 80, 46], ["✏️", 82, 72, 38], ["📚", 32, 56, 36]], "La classe è pronta: si comincia la lezione!"],
    famiglia: [SKY, [["☀️", 88, 12, 44], ["🏠", 50, 42, 92], ["🌳", 10, 50, 62], ["🌳", 90, 50, 62], ["👨‍👩‍👧‍👦", 50, 80, 70], ["🐕", 20, 86, 40]], "Una bella famiglia felice!"],
    verbi: ["linear-gradient(#E6D9FF, #FFFFFF)", [["🍽️", 15, 34, 54], ["🥤", 38, 22, 50], ["😴", 62, 34, 56], ["🏃", 85, 28, 56], ["📖", 25, 76, 52], ["✍️", 50, 80, 48], ["🚪", 78, 76, 48]], "Che giornata piena di azioni!"],
    tavola: ["linear-gradient(#FFF3D6 0 52%, #C98B5A 52%)", [["🍽️", 50, 72, 84], ["🍞", 24, 62, 54], ["🍌", 77, 62, 54], ["🍼", 10, 80, 50], ["🍎", 33, 86, 40], ["🍴", 88, 82, 44], ["🥛", 66, 88, 40], ["🕯️", 50, 26, 50]], "La tavola è apparecchiata: buon appetito!"],
    contrariEn: ["linear-gradient(#FFD9A8 0 50%, #CDEBFF 50%)", [["☀️", 24, 28, 70], ["🔥", 24, 74, 46], ["❄️", 76, 28, 64], ["⛄", 76, 72, 60], ["⚖️", 50, 50, 50]], "Caldo e freddo: opposti ma amici!"],
    tempo: ["linear-gradient(#E3F0FF, #FFFFFF)", [["⏳", 50, 24, 50], ["🕰️", 14, 28, 46], ["🚂", 30, 68, 72], ["📖", 76, 66, 56], ["⭐", 86, 24, 34]], "Il passato dei verbi: viaggio nel tempo!"],
    parole: ["linear-gradient(#CDEBFF, #E8FFE3)", [["🌍", 50, 50, 110], ["✈️", 18, 24, 50], ["💬", 82, 24, 50], ["🗣️", 20, 80, 46], ["🗺️", 80, 80, 46]], "Ora parli inglese come un viaggiatore!"],
    contrariIt: ["linear-gradient(#FFE9B8 0 50%, #B9C3FF 50%)", [["☀️", 20, 24, 48], ["🌙", 80, 72, 48], ["🐘", 30, 66, 80], ["🐭", 70, 30, 36], ["⚖️", 50, 50, 44]], "Grandi e piccoli, giorno e notte: tutto a posto!"],
    plurali: ["linear-gradient(#FFE3F1, #FFF)", [["🍎", 40, 26, 44], ["🍎", 58, 22, 44], ["🌸", 16, 62, 50], ["🌸", 30, 76, 44], ["🐱", 55, 68, 58], ["🐱", 72, 80, 50], ["📚", 86, 54, 52]], "Uno, due, tanti: i plurali sono a posto!"],
    versi: [SKY, [["🎵", 30, 20, 38], ["🎶", 70, 18, 38], ["🦁", 50, 44, 60], ["🐄", 20, 76, 56], ["🐑", 42, 82, 50], ["🐴", 64, 76, 56], ["🐸", 86, 86, 38]], "Che concerto di versi!"],
    sinonimi: ["linear-gradient(#FFF0B8, #FFE0F0)", [["🤝", 50, 56, 90], ["😊", 20, 28, 54], ["😄", 80, 28, 54], ["✨", 50, 20, 34]], "Parole gemelle: stesso significato!"],
    retorica: ["linear-gradient(#EAD9FF, #FFF)", [["🎭", 50, 50, 90], ["✨", 20, 24, 44], ["🖋️", 82, 26, 48], ["🌬️", 20, 78, 44], ["💭", 80, 78, 44]], "Che bei giri di parole!"],
    autori: ["linear-gradient(#FFEFD0, #E8D2A8)", [["🏛️", 50, 48, 84], ["📚", 20, 76, 56], ["🖋️", 80, 76, 48], ["👓", 28, 22, 42], ["📜", 74, 24, 46]], "Grandi autori, grandi libri!"],
    categorie: ["linear-gradient(#D9F2FF, #FFF)", [["🔤", 50, 46, 84], ["📖", 22, 76, 52], ["✏️", 78, 76, 48], ["🧠", 20, 24, 44], ["🎓", 80, 24, 50]], "Ogni parola ha la sua casa!"],
    calendario: ["linear-gradient(#FFF3C9, #FFE0F0)", [["📅", 50, 44, 90], ["☀️", 16, 24, 50], ["🍂", 84, 24, 46], ["❄️", 18, 78, 46], ["🌸", 82, 78, 46]], "Il tempo passa: giorni e stagioni a posto!"],
    storia: [
      ["linear-gradient(#FFE9B8 0 58%, #E8C98A 58%)", [["🔺", 40, 56, 80], ["🐪", 70, 74, 54], ["☀️", 86, 16, 44], ["🏺", 14, 78, 46], ["📜", 20, 30, 44]], "Un tuffo nell'antico Egitto!"],
      ["linear-gradient(#EAD9FF 0 58%, #C9B58A 58%)", [["🏛️", 50, 46, 90], ["🏺", 18, 76, 48], ["🏟️", 82, 70, 56], ["⚔️", 20, 28, 42], ["🏆", 80, 28, 44]], "Grecia e Roma: la storia è a posto!"],
      ["linear-gradient(#CDEBFF 0 58%, #9EE493 58%)", [["🏰", 50, 46, 92], ["🛡️", 20, 74, 48], ["⚔️", 80, 74, 44], ["🐎", 16, 36, 50], ["🚩", 82, 30, 44]], "Cavalieri e castelli: tutto al suo posto!"],
      ["linear-gradient(#E4DBFF 0 58%, #F3D9A8 58%)", [["⏳", 50, 46, 84], ["📜", 20, 72, 52], ["🗺️", 80, 72, 52], ["🕰️", 18, 26, 48], ["🏛️", 82, 26, 46], ["🧭", 52, 82, 40]], "Un viaggio nel tempo: la storia è a posto!"]
    ],
    scienze: [
      ["linear-gradient(#E8F7FF, #D9FFE8)", [["🔬", 50, 50, 84], ["🧪", 18, 28, 52], ["⚗️", 82, 26, 52], ["🧬", 20, 78, 48], ["💡", 80, 78, 46], ["🔭", 50, 18, 40]], "Che bel laboratorio: sei uno scienziato!"],
      ["linear-gradient(#1B1F4B, #4B3A8F)", [["🪐", 50, 46, 90], ["🌍", 18, 28, 54], ["☄️", 82, 24, 44], ["🌙", 84, 72, 46], ["🛰️", 20, 76, 44], ["⭐", 60, 20, 30]], "L'universo non ha più segreti!"],
      ["linear-gradient(#BEE9FF 0 58%, #9EE493 58%)", [["🌳", 18, 46, 70], ["🌻", 50, 70, 54], ["🐝", 40, 34, 40], ["🦋", 74, 30, 40], ["🐛", 80, 80, 36], ["🌧️", 84, 16, 44]], "La natura è piena di meraviglie!"]
    ],
    tec: ["linear-gradient(#E8F7FF, #FFF3C9)", [["💻", 50, 50, 84], ["🖱️", 22, 78, 44], ["⌨️", 54, 84, 44], ["🔧", 84, 26, 46], ["💡", 16, 24, 48], ["🤖", 82, 76, 52]], "Che bravo tecnico: tutto funziona!"],
    arte: ["linear-gradient(#FFF1F6, #FFF8D6)", [["🎨", 50, 48, 84], ["🖌️", 20, 26, 50], ["🖼️", 82, 26, 52], ["🗿", 20, 78, 52], ["🌈", 80, 78, 46], ["✨", 50, 18, 32]], "Che artista! Il capolavoro è completo!"],
    musica: ["linear-gradient(#EAD9FF, #FFE3F1)", [["🎹", 50, 66, 70], ["🎻", 20, 36, 56], ["🎺", 80, 36, 54], ["🥁", 16, 80, 50], ["🎵", 40, 18, 36], ["🎶", 66, 16, 36], ["🎤", 86, 80, 46]], "Che concerto: l'orchestra è al completo!"],
    civica: ["linear-gradient(#CDEBFF 0 58%, #9EE493 58%)", [["🏛️", 50, 44, 84], ["🇮🇹", 20, 28, 50], ["🤝", 30, 80, 52], ["🗳️", 72, 78, 50], ["⚖️", 82, 28, 48], ["🌳", 12, 66, 50]], "Cittadini insieme: che bella comunità!"],
    lingue: ["linear-gradient(#CDEBFF, #FFE3F1)", [["🌍", 50, 48, 96], ["🗣️", 18, 26, 50], ["💬", 82, 26, 50], ["✈️", 20, 80, 46], ["🥐", 80, 80, 46], ["💃", 50, 84, 40]], "Parli tante lingue: cittadino del mondo!"],
    latino: ["linear-gradient(#FFEFD0, #E8D2A8)", [["🏛️", 50, 46, 84], ["🏺", 20, 76, 50], ["📜", 80, 76, 50], ["⚔️", 18, 26, 46], ["🏟️", 84, 28, 52], ["👑", 50, 16, 36]], "Ave! Parli come un antico Romano!"],
    mondo: [
      ["linear-gradient(#CDEBFF, #E8FFE3)", [["🌍", 50, 50, 110], ["🧭", 18, 24, 48], ["🗺️", 82, 24, 48], ["✈️", 22, 80, 46], ["⛰️", 80, 80, 46]], "Il mondo è nelle tue mani!"],
      ["linear-gradient(#BEE9FF 0 55%, #9EE493 55%)", [["🏔️", 24, 44, 76], ["🌋", 74, 46, 66], ["🏝️", 50, 80, 54], ["🌊", 16, 84, 44], ["🧭", 86, 16, 40]], "Montagne, vulcani e isole: che viaggio!"]
    ],
    mat: [
      ["linear-gradient(#D9F2FF, #FFF3C9)", [["🧮", 50, 54, 88], ["➕", 18, 24, 46], ["✖️", 82, 24, 46], ["➗", 22, 82, 44], ["➖", 78, 82, 44], ["🔢", 50, 16, 36]], "I numeri tornano: che bravo matematico!"],
      ["linear-gradient(#1B1F4B, #4B3A8F)", [["🚀", 50, 48, 84], ["🪐", 18, 26, 60], ["⭐", 82, 22, 36], ["🌙", 84, 70, 48], ["✨", 24, 74, 34], ["🛸", 62, 20, 40]], "Conti perfetti: si parte per lo spazio!"],
      ["linear-gradient(#FFF1C9 0 60%, #C98B5A 60%)", [["🧺", 50, 66, 74], ["🍎", 30, 56, 46], ["🍌", 70, 56, 46], ["🍊", 40, 78, 38], ["🍇", 62, 80, 38], ["🛒", 14, 70, 52], ["🏪", 86, 30, 66]], "Che spesa precisa: i conti tornano!"],
      ["linear-gradient(#BEE9FF 0 58%, #F4C98A 58%)", [["🏁", 86, 40, 56], ["🏆", 50, 30, 68], ["🥇", 18, 28, 48], ["🏃", 30, 74, 58], ["👏", 72, 76, 46], ["🎉", 52, 80, 36]], "Vittoria! Campione dei numeri!"]
    ],
    eq: [
      ["linear-gradient(#EAD9FF, #FFF)", [["⚖️", 50, 52, 90], ["🕵️", 20, 28, 54], ["🔍", 82, 26, 48], ["🏆", 50, 18, 40], ["🗝️", 80, 80, 44]], "Hai trovato la x: detective dei numeri!"],
      ["linear-gradient(#FFE9B8 0 55%, #F4C98A 55%)", [["🗺️", 50, 38, 70], ["🏴‍☠️", 18, 30, 50], ["💎", 50, 78, 54], ["🪙", 78, 74, 40], ["🧭", 84, 28, 46], ["🏝️", 20, 76, 56]], "La x segna il tesoro: trovato!"],
      ["linear-gradient(#D9F2FF, #E8FFE3)", [["🤖", 50, 50, 90], ["⚙️", 18, 26, 48], ["🔧", 82, 26, 44], ["💡", 22, 80, 44], ["🔋", 80, 78, 44]], "Il robot ha risolto l'equazione!"]
    ]
  };
  const SCENE_RULES = [
    [/^matematica: .*equazion/, "eq"], [/^matematica/, "mat"],
    [/^storia: .*(giorno della settimana|stagione)/, "calendario"], [/^storia/, "storia"], [/^geografia/, "mondo"], [/^scienze/, "scienze"], [/^tecnologia/, "tec"], [/^arte/, "arte"], [/^musica/, "musica"], [/^civica/, "civica"], [/^lingua2/, "lingue"], [/^latino/, "latino"],
    [/^inglese: .*colore/, "colori"], [/^inglese: .*animale/, "animali"], [/^inglese: .*numero/, "numeri"],
    [/^inglese: .*scuola/, "scuola"], [/^inglese: .*famiglia/, "famiglia"], [/^inglese: .*verbo inglese/, "verbi"],
    [/^inglese: .*tavola/, "tavola"], [/^inglese: .*contrario/, "contrariEn"], [/^inglese: .*irregolare/, "tempo"], [/^inglese/, "parole"],
    [/contrario/, "contrariIt"], [/plurale/, "plurali"], [/verso/, "versi"], [/stessa cosa/, "sinonimi"],
    [/passato prossimo/, "tempo"], [/figura retorica/, "retorica"], [/autore/, "autori"], [/categoria/, "categorie"]
  ];
  function sceneKey(subjectId, prompt) {
    const s = subjectId + ": " + prompt;
    for (const [re, k] of SCENE_RULES) if (re.test(s)) return k;
    return "parole";
  }
  // una figurina per le parole del puzzle (se la parola non c'è, si salta)
  const EMO = {
    red: "🔴", blue: "🔵", green: "🟢", yellow: "🟡", black: "⚫", white: "⚪", pink: "🌸", orange: "🟠",
    dog: "🐶", cat: "🐱", bird: "🐦", fish: "🐟", horse: "🐴", cow: "🐄", rabbit: "🐇", duck: "🦆",
    one: "1️⃣", two: "2️⃣", three: "3️⃣", four: "4️⃣", five: "5️⃣", six: "6️⃣", seven: "7️⃣", ten: "🔟",
    pencil: "✏️", desk: "🖥️", teacher: "🧑‍🏫", bag: "🎒", window: "🪟", door: "🚪", chair: "🪑",
    mother: "👩", father: "👨", brother: "👦", sister: "👧", grandmother: "👵", uncle: "🧔", aunt: "👩‍🦰",
    "to eat": "🍽️", "to drink": "🥤", "to sleep": "😴", "to run": "🏃", "to read": "📖", "to write": "✍️", "to open": "📂",
    bread: "🍞", banana: "🍌", bottle: "🍼", plate: "🍽️", glass: "🥛", apple: "🍎", fork: "🍴", milk: "🥛",
    hot: "🔥", cold: "❄️", early: "🌅", late: "🌙", easy: "😊", difficult: "😰", rich: "💰", poor: "🪙", strong: "💪", weak: "🥀",
    safe: "🛡️", dangerous: "⚠️", go: "🚶", see: "👀", eat: "🍽️", buy: "🛒", take: "🤲", write: "✍️", have: "🤝",
    gatto: "🐱", fiore: "🌸", penna: "🖊️", libro: "📖", casa: "🏠", albero: "🌳", bambino: "🧒", sedia: "🪑", mela: "🍎",
    cane: "🐶", mucca: "🐄", pecora: "🐑", asino: "🐴", leone: "🦁", rana: "🐸", cavallo: "🐴", maiale: "🐷",
    alto: "🦒", caldo: "🔥", freddo: "❄️", grande: "🐘", piccolo: "🐭", giorno: "☀️", notte: "🌙",
    mare: "🌊", lago: "🏞️", montagna: "⛰️", fiume: "🏞️", pianura: "🌾", isola: "🏝️", Colosseo: "@colosseo", colosseo: "@colosseo", vesuvio: "🌋", piramidi: "🔺", partenone: "🏛️",
    inverno: "❄️", primavera: "🌸", estate: "☀️", autunno: "🍂", candela: "🕯️", lampadina: "💡", lettera: "✉️", telefono: "☎️", computer: "💻", automobile: "🚗", carrozza: "🐎",
    gattino: "🐱", cucciolo: "🐶", vitello: "🐮", agnello: "🐑", puledro: "🐴", pulcino: "🐥", occhi: "👀", orecchie: "👂", naso: "👃", pelle: "🖐️",
    radice: "🌱", foglia: "🍃", fiore: "🌸", seme: "🌰", tronco: "🪵", mercurio: "☿️", giove: "🟠", marte: "🔴", saturno: "🪐", terra: "🌍",
    delfino: "🐬", aquila: "🦅", rana: "🐸", serpente: "🐍", squalo: "🦈", ape: "🐝", cuore: "❤️", polmoni: "🫁", cervello: "🧠", ossa: "🦴",
    darwin: "🐢", newton: "🍎", galileo: "🔭", "marie curie": "☢️", mendel: "🌱", pasteur: "🧫", metro: "📏", secondo: "⏱️", joule: "⚡", kelvin: "🌡️",
    aperto: "🔓", chiuso: "🔒", veloce: "⚡", lento: "🐌", felice: "😀", triste: "😢", dolce: "🍬", amaro: "🍋", nuovo: "✨", vecchio: "👴"
  };
  // rOnly: seconda lingua (a sinistra c'è una parola straniera che potrebbe somigliare a una parola di altre lingue: si guarda solo l'italiano)
  function emojiFor(p, rOnly) {
    const l = String(p.l).toLowerCase().trim(), r = String(p.r).toLowerCase().trim();
    const sides = rOnly ? [r] : [l, r];
    for (const k of sides) if (EMO[k] || EMO_WORDS[k] || (rOnly && EMO_WORDS_L2[k])) return EMO[k] || EMO_WORDS[k] || EMO_WORDS_L2[k];
    if (!rOnly) {
      for (const [re, e] of EMO_RULES) if (re.test(l)) return e;
      for (const [re, e] of EMO_RULES_R) if (re.test(r)) return e;
    }
    return "";
  }

  // ogni volta una scena diversa: colori, posizioni, specchio e figure a caso
  function sceneHtml(key, pairs) {
    let sc = SCENES[key] || SCENES.parole;
    if (Array.isArray(sc[0])) {                                      // più varianti: la scena specifica solo se quasi tutte le coppie c'entrano, altrimenti quella neutra
      const texts = pairs.map(p => (p.l + " " + p.r).toLowerCase()), need = Math.max(2, Math.ceil(texts.length * 0.75));
      const hits = re => texts.filter(t => re.test(t)).length;
      if (key === "storia") {
        const R = [/egizi|egitto|faraon|piramid|nilo|tutankh|cleopatra|geroglif|mummi/, /romani|romano|\broma\b|greci|grecia|gladiat|cesare|colosseo|atene|sparta|olimp|etrusch|impero/, /castell|cavalier|medioev|feud|crociat|carlo magno|vassall/];
        const i = R.findIndex(re => hits(re) >= need);
        sc = sc[i >= 0 ? i : 3];
      } else if (key === "scienze") {
        const space = /pianet|stell|galass|\bsole\b|luna|mercurio|venere|giove|marte|saturno|nettuno|urano|orbita|cometa|asteroid|universo|terra/;
        const nature = /pianta|foglia|radice|fiore|seme|animal|insett|mammifer|uccell|rettil|pesc|habitat|erbivor|carnivor|albero|bosco|\bape\b|cucciol|agnell|pulcin|gattin|vitell|puledr|pecora|gatto|\bcane\b|gallina|mucca|frutto|tronco/;
        sc = sc[hits(space) >= need ? 1 : hits(nature) >= need ? 2 : 0];
      } else sc = pick(sc);
    }
    const flip = Math.random() < 0.5, hue = rnd(0, 359), jit = n => n + rnd(-5, 5);
    const words = [];
    pairs.forEach(p => { const e = emojiFor(p, key === "lingue"); if (e && !words.includes(e)) words.push(e); });
    let items, strip = "";
    if (words.length >= 3) {
      // almeno tre parole hanno la loro figurina: la scena mostra SOLO quelle (più qualche stellina), così ogni immagine c'entra con ciò che si è giocato
      const slots = words.length >= 4 ? [[22, 34], [78, 32], [30, 76], [72, 74]] : [[24, 36], [76, 36], [50, 74]];
      items = shuffle(words.slice()).slice(0, slots.length).map((e, i) => [e, jit(flip ? 100 - slots[i][0] : slots[i][0]), jit(slots[i][1]), rnd(64, 78)]);
      shuffle(["✨", "⭐", "💫", "🌟"]).slice(0, 3).forEach((e, i) => items.push([e, [10, 90, 50][i] + rnd(-4, 4), [14, 16, 10][i] + rnd(-3, 3), rnd(22, 30)]));
    } else {
      let decor = shuffle(sc[1].slice());
      if (decor.length > 5) decor = decor.slice(0, rnd(5, decor.length));
      items = decor.map(it => [it[0], jit(flip ? 100 - it[1] : it[1]), Math.min(words.length ? 70 : 90, jit(it[2])), Math.round(it[3] * (0.9 + Math.random() * 0.25))]);
      shuffle(["✨", "⭐", "🎈", "💫", "🌟"]).slice(0, 2).forEach(e => items.push([e, rnd(8, 92), rnd(10, 40), rnd(24, 36)]));
      if (words.length) strip = `<div class="sc-strip">${shuffle(words.slice()).map((e, i) => `<span style="animation-delay:${(items.length * 0.16 + i * 0.2).toFixed(2)}s">${iconHtml(e)}</span>`).join("")}</div>`;
    }
    const dark = /#1B1F4B/.test(sc[0]);
    return `<div class="scene"><div class="sc-bg" style="background:${sc[0]};${dark ? "" : `filter:hue-rotate(${hue}deg)`}"></div>${items.map((it, i) =>
      `<span class="sc-it" style="left:${it[1]}%;top:${it[2]}%;font-size:${it[3]}px;animation-delay:${(i * 0.16).toFixed(2)}s">${iconHtml(it[0])}</span>`).join("")}${strip}</div>
      <div class="sc-cap">🎉 ${esc(sc[2])}</div>
      <div class="sc-words">${pairs.map(p => `<span>${esc(p.l)} = ${esc(p.r)}</span>`).join("")}</div>`;
  }

  // coppie per i giochi di collegamento (Incastro, Memory, Palloncini)
  function pairsFor(classId, subjectId) {
    let prompt, pairs, eng = false, rEn = false;
    if (subjectId === "matematica") {
      pairs = mathPairs(classId);
      prompt = classId >= 7 ? "Collega ogni equazione alla sua soluzione." : "Collega ogni operazione al suo risultato.";
      if (pairs.some(p => /[a-zà-ù]{4,}/i.test(String(p.l)))) prompt = "Collega ogni quesito alla sua soluzione.";   // c'è anche geometria: titolo neutro
    } else if (subjectId === "inglese") {
      const theme = pick(ENG_PAIRS[classId <= 1 ? "A" : classId <= 4 ? "B" : "C"]);
      pairs = shuffle(theme.pairs).slice(0, 4).map(p => ({ l: p[0], r: p[1] }));
      prompt = theme.prompt;
      eng = true; rEn = !!theme.rEn;   // per la voce: parole a sinistra in inglese; a destra inglese solo se rEn
    } else if (OTHER_PAIRS[subjectId]) {
      let tl = Questions.inClass(OTHER_PAIRS[subjectId][classId <= 1 ? "A" : classId <= 4 ? "B" : "C"], classId);
      if (subjectId !== "lingua2" && subjectId !== "latino") tl = Parole.themes(tl, classId);
      const theme = pick(tl);
      pairs = shuffle(theme.pairs).slice(0, 4).map(p => ({ l: p[0], r: p[1] }));
      prompt = theme.prompt;
      if (subjectId === "lingua2") eng = true;   // le parole a sinistra sono straniere: la voce le legge nella lingua scelta
    } else {
      const theme = pick(Parole.themes(Questions.inClass(ITA_PAIRS[classId <= 1 ? "A" : classId <= 4 ? "B" : "C"], classId), classId));
      pairs = shuffle(theme.pairs).slice(0, 4).map(p => ({ l: p[0], r: p[1] }));
      prompt = theme.prompt;
    }
    return { prompt, pairs, eng, rEn, scene: sceneKey(subjectId, prompt) };
  }

  function makeIncastro(classId, subjectId) {
    const { prompt, pairs, eng, rEn, scene } = pairsFor(classId, subjectId);
    if (pairs.length < 3) return null;
    let order = shuffle(pairs.map((_, i) => i)), g = 0;
    while (order.every((v, i) => v === i) && g++ < 20) order = shuffle(order);
    return { kind: "incastro", title: "Incastro", eng, rEn, prompt, hint: "Trascina ogni pezzo al suo posto, oppure toccalo e poi tocca il posto. Due errori si perdonano, al terzo il puzzle esplode!", pairs, order,
      scene, solution: pairs.map(p => `${p.l} → ${p.r}`).join(" · ") };
  }

  function mountIncastro(el, r, onDone) {
    const P = r.pairs;
    el.innerHTML = `<div class="inc">
      <div class="inc-rows">${P.map((p, i) => `<div class="inc-row"><span class="inc-label">${esc(p.l)}</span><div class="inc-drop" data-s="${i}"><span class="inc-q">?</span></div></div>`).join("")}</div>
      <div class="inc-tray">${r.order.map(i => `<button class="piece" data-p="${i}"><span class="pz">🧩</span>${esc(P[i].r)}</button>`).join("")}</div>
    </div>`;
    const drops = [...el.querySelectorAll(".inc-drop")], tray = el.querySelector(".inc-tray");
    let mistakes = 0, placed = 0, sel = null, done = false, justDragged = false;

    function clearSel() { if (sel) sel.classList.remove("sel"); sel = null; }
    function attempt(pc, s) {
      if (done) return;
      const pid = +pc.dataset.p;
      if (pid === s) {
        const drop = drops[s];
        drop.classList.add("ok"); drop.innerHTML = `<span>${esc(P[s].r)}</span>`;
        pc.classList.add("gone"); clearSel(); placed++; tapFn();
        if (placed === P.length) {
          done = true;
          const box = el.querySelector(".inc");
          if (box) box.innerHTML = sceneHtml(r.scene, P);
          onDone(true, r.solution, mistakes === 0 ? "Tutto incastrato al primo colpo!" : "Incastrato!");
        }
      } else {
        mistakes++; clearSel();
        const d = drops[s];
        d.classList.add("nope"); pc.classList.add("nope");
        if (mistakes > 2) { done = true; explode(); return; }
        setTimeout(() => { d.classList.remove("nope"); pc.classList.remove("nope"); }, 450);
      }
    }

    // secondo errore: il puzzle esplode e si ricomincia da capo
    function explode() {
      boomFn();
      el.querySelectorAll(".nope").forEach(n => n.classList.remove("nope"));
      el.querySelectorAll(".inc-row, .piece:not(.gone)").forEach(p => {
        p.style.setProperty("--dx", rnd(-170, 170) + "px");
        p.style.setProperty("--dy", rnd(-240, 180) + "px");
        p.style.setProperty("--rot", rnd(-540, 540) + "deg");
        p.classList.add("boom");
      });
      const box = el.querySelector(".inc");
      if (box) box.insertAdjacentHTML("beforeend", `<div class="boom-msg"><span>💥 BOOM!<small>Si ricomincia da capo</small></span></div>`);
      setTimeout(() => {
        if (!el.isConnected) return;
        let o = shuffle(P.map((_, i) => i)), g = 0;
        while (o.every((v, i) => v === i) && g++ < 20) o = shuffle(o);
        r.order = o;
        mountIncastro(el, r, onDone);
      }, 1500);
    }

    // trascinamento (mouse o dito)
    tray.addEventListener("pointerdown", e => {
      const pc = e.target.closest(".piece");
      if (!pc || done || pc.classList.contains("gone")) return;
      const x0 = e.clientX, y0 = e.clientY;
      let dragging = false;
      try { pc.setPointerCapture(e.pointerId); } catch (err) {}
      const move = ev => {
        const dx = ev.clientX - x0, dy = ev.clientY - y0;
        if (!dragging && Math.hypot(dx, dy) > 8) { dragging = true; pc.classList.add("drag"); }
        if (dragging) pc.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const end = ev => {
        pc.removeEventListener("pointermove", move);
        pc.removeEventListener("pointerup", end);
        pc.removeEventListener("pointercancel", end);
        if (!dragging) return;
        justDragged = true; setTimeout(() => { justDragged = false; }, 50);
        pc.style.visibility = "hidden";
        const under = document.elementFromPoint(ev.clientX, ev.clientY);
        pc.style.visibility = ""; pc.style.transform = ""; pc.classList.remove("drag");
        const drop = under && under.closest && under.closest(".inc-drop");
        if (drop && !drop.classList.contains("ok")) attempt(pc, +drop.dataset.s);
      };
      pc.addEventListener("pointermove", move);
      pc.addEventListener("pointerup", end);
      pc.addEventListener("pointercancel", end);
    });

    // tocco: scegli il pezzo, poi tocca il suo posto
    tray.addEventListener("click", e => {
      const pc = e.target.closest(".piece");
      if (!pc || done || justDragged || pc.classList.contains("gone")) return;
      const was = sel === pc;
      clearSel();
      if (!was) { sel = pc; pc.classList.add("sel"); tapFn(); }
    });
    drops.forEach(d => d.addEventListener("click", () => {
      if (done || !sel || d.classList.contains("ok")) return;
      attempt(sel, +d.dataset.s);
    }));
  }

  // ====================================================================
  // MEMORY: gira le carte e trova le coppie
  // ====================================================================
  function makeMemory(classId, subjectId) {
    const g = pairsFor(classId, subjectId);
    if (g.pairs.length < 3) return null;
    return { kind: "memory", title: "Memory", eng: g.eng, rEn: g.rEn, prompt: "Gira le carte e trova le coppie!",
      hint: g.prompt.replace(/^Collega/, "Abbina") + " Le coppie trovate restano scoperte.", pairs: g.pairs, scene: g.scene,
      solution: g.pairs.map(p => `${p.l} → ${p.r}`).join(" · ") };
  }

  function mountMemory(el, r, onDone) {
    const P = r.pairs;
    // 2 colonne: le due carte di una coppia stanno sempre su colonne opposte (una a sinistra, una a destra)
    let colL = shuffle(P.map((p, i) => ({ id: i, t: p.l }))), colR = shuffle(P.map((p, i) => ({ id: i, t: p.r }))), g0 = 0;
    while (P.length > 1 && colL.every((c, i) => c.id === colR[i].id) && g0++ < 30) colR = shuffle(colR);
    const cards = colL.flatMap((c, i) => [c, colR[i]]);
    el.innerHTML = `<div class="mem">${cards.map((c, i) => {
      const fs = c.t.length > 18 ? 13 : c.t.length > 11 ? 16 : 20;
      return `<button class="mcard" data-i="${i}" style="font-size:${fs}px"><span class="mback">❓</span><span class="mface">${esc(c.t)}</span></button>`;
    }).join("")}</div>`;
    const els = [...el.querySelectorAll(".mcard")];
    let first = null, lock = false, found = 0, mistakes = 0, done = false;
    function finish() {
      done = true;
      const ok = mistakes <= 5;
      if (ok) { el.innerHTML = `<div class="inc">${sceneHtml(r.scene, P)}</div>`; }
      onDone(ok, r.solution, ok ? (mistakes === 0 ? "Memoria perfetta: nessun errore!" : "Tutte le coppie trovate!") : `Troppi errori (${mistakes}).`);
    }
    els.forEach((card, i) => card.addEventListener("click", () => {
      if (done || lock || card.classList.contains("up") || card.classList.contains("match")) return;
      tapFn(); card.classList.add("up");
      if (first === null) { first = i; return; }
      const a = first; first = null;
      if (cards[a].id === cards[i].id) {
        els[a].classList.add("match"); card.classList.add("match"); found++;
        if (found === P.length) setTimeout(finish, 450);
      } else {
        mistakes++; lock = true;
        els[a].classList.add("miss"); card.classList.add("miss");
        setTimeout(() => { [els[a], card].forEach(c => c.classList.remove("up", "miss")); lock = false; }, 850);
      }
    }));
  }

  // ====================================================================
  // PALLONCINI: salgono dal basso, scoppia solo quelli giusti
  // ====================================================================
  const BCOL = ["#FF8FB1", "#7ED9FF", "#FFD23F", "#B9F27A", "#C9A8FF", "#FFB26B"];

  function makePalloncini(classId, subjectId) {
    const g = pairsFor(classId, subjectId);
    if (g.pairs.length < 4) return null;
    const targets = shuffle(g.pairs).slice(0, 3);
    return { kind: "palloncino", title: "Palloncini", eng: g.eng, rEn: g.rEn, prompt: "Scoppia i palloncini giusti!",
      hint: "In alto c'è una parola: scoppia il palloncino che le corrisponde. Due errori si perdonano, al terzo i palloncini scappano!",
      pairs: targets, pool: g.pairs, speed: classId <= 2 ? 62 : classId <= 4 ? 85 : 110, scene: g.scene,
      solution: targets.map(p => `${p.l} → ${p.r}`).join(" · ") };
  }

  function mountPalloncini(el, r, onDone) {
    const T = r.pairs, pool = r.pool, H = 330;
    el.innerHTML = `<div class="baltarget"><span class="bt-n"></span><span class="bt-l"></span></div><div class="sky" style="height:${H}px"></div>`;
    const sky = el.querySelector(".sky"), $l = el.querySelector(".bt-l"), $n = el.querySelector(".bt-n");
    let ti = 0, mistakes = 0, done = false, last = 0, spawnT = 0;
    const B = [];
    const showTarget = () => { $n.textContent = `${ti + 1}/${T.length}`; $l.textContent = T[ti].l; };
    showTarget();

    function place(b) { b.el.style.transform = `translate(${Math.round(b.x)}px, ${Math.round(b.y)}px)`; }
    function spawn(y0) {
      if (B.length >= 4) return;
      const cur = T[ti], nRight = B.filter(b => b.p === cur).length;
      const right = nRight === 0 || (nRight < 2 && Math.random() < 0.2);
      const others = pool.filter(x => x !== cur), free = others.filter(x => !B.some(b => b.p === x));
      const p = right ? cur : pick(free.length ? free : others);
      const el2 = document.createElement("button");
      el2.className = "balloon";
      el2.style.setProperty("--bc", pick(BCOL));
      const fs = p.r.length > 14 ? 12 : p.r.length > 9 ? 14 : 18;
      el2.innerHTML = `<span class="bal-t" style="font-size:${fs}px">${esc(p.r)}</span>`;
      sky.appendChild(el2);
      const W = sky.clientWidth, w = 108;
      const b = { el: el2, p, x: rnd(2, Math.max(3, W - w - 2)), y: y0 === undefined ? H + 10 : y0, v: r.speed * (0.8 + Math.random() * 0.5) };
      place(b); B.push(b);
      el2.addEventListener("pointerdown", e => { e.preventDefault(); pop(b); });
    }
    function drop(b) { const i = B.indexOf(b); if (i >= 0) B.splice(i, 1); b.el.remove(); }
    function effect(b, txt, cls) {
      const f = document.createElement("div");
      f.className = "bal-fx " + cls; f.textContent = txt;
      f.style.transform = `translate(${Math.round(b.x + 30)}px, ${Math.round(b.y + 30)}px)`;
      sky.appendChild(f); setTimeout(() => f.remove(), 600);
    }
    function finish(ok) {
      done = true; stop();
      B.forEach(b => { b.el.disabled = true; });
      onDone(ok, r.solution, ok ? (mistakes === 0 ? "Nemmeno un palloncino sbagliato!" : "Palloncini scoppiati!") : "Tre palloncini sbagliati: gli altri sono volati via.");
    }
    function pop(b) {
      if (done || !B.includes(b)) return;
      tapFn();
      if (b.p === T[ti]) {
        effect(b, "💥", "good"); drop(b); ti++;
        if (ti >= T.length) { finish(true); return; }
        showTarget();
      } else {
        mistakes++; effect(b, "✖", "bad"); drop(b); boomFn();
        if (mistakes > 2) finish(false);
      }
    }
    function frame(now) {
      if (done) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now; spawnT += dt;
      if (spawnT > 0.85) { spawnT = 0; spawn(); }
      for (const b of B.slice()) {
        b.y -= b.v * dt; place(b);
        if (b.y < -130) drop(b);
      }
      raf = requestAnimationFrame(frame);
    }
    spawn(H * 0.55); spawn(H * 0.8); spawn(H * 0.3);
    raf = requestAnimationFrame(frame);
  }

  // ====================================================================
  // PESCA: pesca solo il pesce con la risposta giusta
  // ====================================================================
  const FISH = ["🐟", "🐠", "🐡", "🦈"];

  function makePesca(classId, subjectId) {
    if (typeof Questions === "undefined") return null;
    const q = Questions.next(subjectId, classId);
    if (!q || q.a.length < 3) return null;
    const speed = classId <= 2 ? 40 : classId <= 4 ? 65 : 90;
    return { kind: "pesca", title: "Pesca", prompt: q.q, hint: "Tocca il pesce con la risposta giusta per pescarlo! Due errori si perdonano.", q, speed };
  }

  function mountPesca(el, r, onDone) {
    const q = r.q, FL = 82;
    el.innerHTML = `<div class="sea" style="height:${q.a.length * FL + 40}px"><div class="shore">🎣</div>${q.a.map((t, i) => {
      const fs = t.length > 18 ? 14 : t.length > 11 ? 17 : 21;
      return `<button class="fish" data-i="${i}" style="top:${34 + i * FL}px;--tc:${TCOL[i % 4]};font-size:${fs}px"><span class="fe">${FISH[i % 4]}</span><span class="ftxt">${esc(t)}</span></button>`;
    }).join("")}</div>`;
    const sea = el.querySelector(".sea");
    const fs = [...sea.querySelectorAll(".fish")];
    const S = fs.map(f => ({ el: f, fe: f.querySelector(".fe"), x: 0, w: 0, ph: Math.random() * 6, live: true, v: (Math.random() < 0.5 ? -1 : 1) * r.speed * (0.7 + Math.random() * 0.6) }));
    let done = false, last = 0, mistakes = 0, t = 0;

    function place(s) { s.el.style.transform = `translate(${Math.round(s.x)}px, ${Math.round(Math.sin(t * 2 + s.ph) * 6)}px)`; s.fe.style.transform = s.v > 0 ? "scaleX(-1)" : "none"; }
    function frame(now) {
      if (done) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now; t += dt;
      const W = sea.clientWidth;
      for (const s of S) {
        if (!s.live) continue;
        s.w = s.el.offsetWidth || s.w;
        const max = Math.max(0, W - s.w);
        s.x += s.v * dt;
        if (s.x < 0) { s.x = 0; s.v = Math.abs(s.v); }
        if (s.x > max) { s.x = max; s.v = -Math.abs(s.v); }
        place(s);
      }
      raf = requestAnimationFrame(frame);
    }
    requestAnimationFrame(() => {
      const W = sea.clientWidth;
      for (const s of S) { s.w = s.el.offsetWidth; s.x = Math.random() * Math.max(0, W - s.w); place(s); }
    });
    raf = requestAnimationFrame(frame);

    function lineTo(s) {
      const ln = document.createElement("div");
      ln.className = "fline";
      const cx = s.x + s.w / 2, top = parseFloat(s.el.style.top);
      ln.style.left = Math.round(cx) + "px";
      sea.appendChild(ln);
      requestAnimationFrame(() => { ln.style.height = Math.round(top + 10) + "px"; });
    }
    function catchIt(i) {
      if (done) return;
      const s = S[i];
      tapFn();
      if (i === q.c) {
        done = true; stop();
        lineTo(s); s.el.classList.add("ok"); s.fe.textContent = "🎣";
        fs.forEach((f, k) => { f.disabled = true; if (k !== i) f.classList.add("dim"); });
        onDone(true, q.a[q.c], q.e || "");
      } else {
        mistakes++; s.live = false; boomFn();
        s.el.classList.add("bad"); s.el.disabled = true; s.fe.textContent = "✖";
        if (mistakes > 2) {
          done = true; stop();
          fs.forEach((f, k) => { f.disabled = true; if (k === q.c) f.classList.add("ok"); else if (S[k].live) f.classList.add("dim"); });
          onDone(false, q.a[q.c], q.e || "");
        }
      }
    }
    fs.forEach((f, i) => {
      f.addEventListener("pointerdown", e => { e.preventDefault(); catchIt(i); });
    });
  }

  // ====================================================================
  // TALPE: spuntano dai buchi con le risposte, colpisci quella giusta
  // ====================================================================
  function makeTalpe(classId, subjectId) {
    if (typeof Questions === "undefined") return null;
    const q = Questions.next(subjectId, classId);
    if (!q || q.a.length < 3) return null;
    return { kind: "talpa", title: "Talpe", prompt: q.q, hint: "Le talpe spuntano dai buchi: tocca quella con la risposta giusta! Due errori si perdonano.", q,
      stay: classId <= 2 ? 2.8 : classId <= 4 ? 2.3 : 1.9 };
  }

  function mountTalpe(el, r, onDone) {
    const q = r.q, HOLES = 6, MAXLIVE = 3;
    el.innerHTML = `<div class="whack">${Array.from({ length: HOLES }, (_, i) =>
      `<button class="hole" data-h="${i}"><span class="mole"><span class="mtxt"></span><span class="mface">🐹</span></span><span class="mound"></span></button>`).join("")}</div>`;
    const H = [...el.querySelectorAll(".hole")].map(h => ({ el: h, mole: h.querySelector(".mole"), face: h.querySelector(".mface"), txt: h.querySelector(".mtxt"), ans: -1, t: 0 }));
    let done = false, mistakes = 0, last = 0, spawnIn = 0.25, queue = [];

    function hide(h) { h.ans = -1; h.mole.classList.remove("up", "bad", "ok"); h.face.textContent = "🐹"; }
    function show(h, i, life, cls) {
      h.ans = i; h.t = life;
      h.txt.textContent = q.a[i];
      const L = q.a[i].length;
      h.txt.style.fontSize = (L > 18 ? 12 : L > 11 ? 14 : L > 7 ? 17 : 20) + "px";
      h.mole.classList.remove("bad", "ok");
      if (cls) h.mole.classList.add(cls);
      h.mole.classList.add("up");
    }
    function spawn() {
      const live = H.filter(h => h.ans >= 0), free = H.filter(h => h.ans < 0);
      if (live.length >= MAXLIVE || !free.length) return;
      if (!queue.length) queue = shuffle(q.a.map((_, i) => i));
      const k = queue.findIndex(i => !live.some(h => h.ans === i));
      if (k < 0) return;
      const i = queue.splice(k, 1)[0];
      show(pick(free), i, r.stay * (0.85 + Math.random() * 0.4));
    }
    function frame(now) {
      if (done) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now; spawnIn -= dt;
      for (const h of H) if (h.ans >= 0 && !h.mole.classList.contains("bad")) { h.t -= dt; if (h.t <= 0) hide(h); }
      if (spawnIn <= 0) { spawn(); spawnIn = 0.5 + Math.random() * 0.35; }
      raf = requestAnimationFrame(frame);
    }
    function hit(h) {
      if (done || h.ans < 0 || h.mole.classList.contains("bad")) return;
      tapFn();
      if (h.ans === q.c) {
        done = true; stop();
        H.forEach(x => { x.el.disabled = true; if (x !== h) x.mole.classList.remove("up"); });
        h.mole.classList.add("ok"); h.face.textContent = "🤩";
        onDone(true, q.a[q.c], q.e || "");
      } else {
        mistakes++; boomFn();
        h.mole.classList.add("bad"); h.face.textContent = "✖";
        if (mistakes > 2) {
          done = true; stop();
          H.forEach(x => { x.el.disabled = true; if (x !== h) hide(x); });
          const free = H.find(x => x !== h);
          show(free, q.c, 99, "ok");
          onDone(false, q.a[q.c], q.e || "");
        } else {
          setTimeout(() => { if (!done) hide(h); }, 450);
        }
      }
    }
    H.forEach(h => h.el.addEventListener("pointerdown", e => { e.preventDefault(); hit(h); }));
    raf = requestAnimationFrame(frame);
  }

  // ====================================================================
  // VERO O FALSO LAMPO: cinque frasi, tocca ✅ o ❌
  // ====================================================================
  let speakFn = null, autoSpeakFn = () => false, canSpeakFn = () => false;
  const setSpeak = (fn, auto, can) => { speakFn = fn; autoSpeakFn = auto || (() => false); canSpeakFn = can || (() => false); };

  function makeVF(classId, subjectId) {
    if (typeof Questions === "undefined") return null;
    const cards = []; let guard = 0;
    while (cards.length < 5 && guard++ < 80) {
      const q = Questions.next(subjectId, classId);
      if (!q || q.a.length < 3) return null;
      if (cards.some(c => c.q.q === q.q)) continue;
      const truth = cards.length === 0 ? Math.random() < 0.5 : Math.random() < 0.5;
      const wrongs = q.a.map((t, i) => i).filter(i => i !== q.c);
      cards.push({ q, truth, cand: q.a[truth ? q.c : pick(wrongs)], right: q.a[q.c] });
    }
    if (cards.length < 5) return null;
    return { kind: "vf", title: "Vero o falso", prompt: "Cinque frasi lampo: vero o falso?",
      hint: "Leggi la domanda e la risposta proposta. Tocca ✅ se è giusta, ❌ se è sbagliata. Due errori si perdonano, al terzo si perde.", cards };
  }

  function mountVF(el, r, onDone) {
    const C = r.cards;
    let i = 0, mistakes = 0, right = 0, busy = false, done = false;
    const wrongList = [];
    function draw() {
      const c = C[i];
      el.innerHTML = `<div class="vf">
        <div class="vf-dots">${C.map((_, k) => `<i class="${k < i ? "done" : k === i ? "now" : ""}"></i>`).join("")}</div>
        <div class="vf-card">
          <div class="vf-q">${esc(c.q.q)}</div>
          <div class="vf-a"><small>Risposta proposta</small>${esc(c.cand)}</div>
          ${canSpeakFn() ? `<button class="btn ghost vf-say" data-say>🔊 Leggi</button>` : ""}
        </div>
        <div class="vf-btns">
          <button class="btn vf-yes" data-v="1">✅ Vero</button>
          <button class="btn vf-no" data-v="0">❌ Falso</button>
        </div>
      </div>`;
      if (i > 0 && autoSpeakFn() && speakFn) speakFn(c);
    }
    function finish() {
      done = true;
      const ok = mistakes <= 2;
      el.innerHTML = `<div class="vf"><div class="vf-dots">${C.map(() => `<i class="done"></i>`).join("")}</div>
        <div class="vf-card"><div class="vf-end">${ok ? "🎉" : "😅"} ${right} su ${C.length} giuste</div></div></div>`;
      onDone(ok, wrongList.join(" · "), ok ? (mistakes === 0 ? "Cinque su cinque: lampo perfetto!" : "Bravo, hai superato il lampo!") : "");
    }
    el.onclick = e => {
      const say = e.target.closest("[data-say]");
      if (say && speakFn) { speakFn(C[i]); return; }
      const b = e.target.closest("[data-v]");
      if (!b || busy || done) return;
      busy = true; tapFn();
      const c = C[i], said = b.dataset.v === "1", ok = said === c.truth;
      el.querySelectorAll("[data-v]").forEach(x => { x.disabled = true; });
      const good = el.querySelector(`[data-v="${c.truth ? 1 : 0}"]`);
      markAnswer(el, "[data-v]", good, b, ok);
      if (ok) right++; else {
        mistakes++; boomFn();
        wrongList.push(`${c.q.q} → ${c.right}`);
        const card = el.querySelector(".vf-card");
        if (card) card.insertAdjacentHTML("beforeend", `<div class="vf-fix">Giusto: <b>${esc(c.right)}</b></div>`);
      }
      setTimeout(() => {
        if (!el.isConnected) return;
        busy = false;
        if (mistakes > 2 || i >= C.length - 1) { finish(); return; }
        i++; draw();
      }, ok ? 1000 : 1500);
    };
    draw();
  }


  // ====================================================================
  // DOMANDE CHIARE: trasforma la regola dell'abbinamento ("Collega ogni organo alla
  // sua funzione.") in una domanda vera ("Che cosa fa «stomaco»?"), con la parola
  // da indovinare scritta in mezzo. Serve a Lettere mescolate e Salva l'omino.
  // ====================================================================
  const ASK_RULES = [
    [/stessa cosa/, "Quale parola significa la stessa cosa di ", "?"],
    [/animale al suo cucciolo/, "Come si chiama il cucciolo di ", "?"],
    [/animale al suo verso/, "Che verso fa ", "?"],
    [/animale alla sua classe/, "A quale classe di animali appartiene ", "?"],
    [/articolo della Costituzione/, "Di che cosa parla l'articolo ", " della Costituzione?"],
    [/artista a ciò che usa/, "Che cosa usa questo artista: ", "?"],
    [/artista alla sua corrente/, "A quale corrente artistica appartiene ", "?"],
    [/(artista|autore|compositore) (alla sua|a una sua) opera/, "Qual è un'opera di ", "?"],
    [/città italiana/, "Per che cosa è famosa la città di ", "?"],
    [/compositore alla sua epoca/, "A quale epoca musicale appartiene ", "?"],
    [/cosa al suo colore/, "Di che colore è ", "?"],
    [/cosa di una volta/, "Che cosa usiamo oggi al posto di ", "?"],
    [/data a ciò che è successo/, "Che cosa è successo in questa data: ", "?"],
    [/evento alla sua data/, "In che data è avvenuto questo evento: ", "?"],
    [/festa alla sua data/, "In che data cade questa festa: ", "?"],
    [/figura retorica/, "Quale esempio corrisponde a questa figura retorica: ", "?"],
    [/fiume alla città/, "Quale città attraversa il fiume ", "?"],
    [/fonte di energia/, "Come si ottiene l'energia ", "?"],
    [/giorno della settimana al giorno/, "Quale giorno viene dopo ", "?"],
    [/indicazione di velocità/, "Che cosa significa in musica ", "?"],
    [/luogo a chi ci lavora/, "Chi lavora in questo posto: ", "?"],
    [/materiale a ciò da cui/, "Da che cosa si ricava ", "?"],
    [/materiale a una sua proprietà/, "Qual è una caratteristica di questo materiale: ", "?"],
    [/mezzo di trasporto/, "Dove viaggia ", "?"],
    [/montagna al suo continente/, "In quale continente si trova ", "?"],
    [/monumento al suo popolo/, "Quale popolo ha costruito ", "?"],
    [/monumento alla sua città/, "In quale città si trova ", "?"],
    [/oggetto a ciò che serve/, "A che cosa serve ", "?"],
    [/opera al luogo/, "Dove si trova ", "?"],
    [/organizzazione al suo scopo/, "Qual è lo scopo di questa organizzazione: ", "?"],
    [/organo dello Stato/, "Che cosa fa questo organo dello Stato: ", "?"],
    [/organo alla sua funzione/, "Che cosa fa questo organo del corpo: ", "?"],
    [/parola (inglese )?al suo contrario/, "Qual è il contrario di ", "?"],
    [/al suo plurale/, "Qual è il plurale di ", "?"],
    [/parola alla sua categoria/, "Che tipo di parola è ", "?"],
    [/parola alla sua definizione/, "Che cosa significa ", "?"],
    [/parte del computer/, "A che cosa serve nel computer: ", "?"],
    [/parte del corpo al suo senso/, "Con quale senso usiamo ", "?"],
    [/parte del paesaggio/, "Come si descrive ", "?"],
    [/parte della pianta/, "A che cosa serve nella pianta: ", "?"],
    [/passaggio di stato/, "Come si chiama il passaggio di stato ", "?"],
    [/periodo alla sua caratteristica/, "Qual è una caratteristica di ", "?"],
    [/personaggio al suo ruolo/, "Chi era ", "?"],
    [/personaggio alla sua storia/, "Chi era o che cosa ha fatto ", "?"],
    [/pianeta alla sua caratteristica/, "Qual è la caratteristica del pianeta ", "?"],
    [/popolo antico/, "Dove viveva questo popolo antico: ", "?"],
    [/regione al suo capoluogo/, "Qual è il capoluogo della regione ", "?"],
    [/rifiuto al suo contenitore/, "In quale contenitore va buttato ", "?"],
    [/scienziato alla sua scoperta/, "Che cosa ha scoperto ", "?"],
    [/segnale a ciò che dobbiamo fare/, "Che cosa dobbiamo fare con ", "?"],
    [/segno( della musica)? al suo significato/, "Che cosa significa in musica ", "?"],
    [/simbolo al suo elemento chimico/, "Quale elemento chimico ha il simbolo ", "?"],
    [/simbolo italiano/, "Che cosa è per l'Italia ", "?"],
    [/stagione a un suo mese/, "Quale mese fa parte di questa stagione: ", "?"],
    [/stato alla sua capitale/, "Qual è la capitale di questo stato: ", "?"],
    [/stile a una sua caratteristica/, "Qual è una caratteristica dello stile ", "?"],
    [/strumento a come si suona/, "Come si suona questo strumento: ", "?"],
    [/strumento alla sua famiglia/, "A quale famiglia di strumenti appartiene ", "?"],
    [/tecnica a come si fa/, "Come si fa questa tecnica: ", "?"],
    [/unità di misura/, "Che cosa misura questa unità: ", "?"],
    [/verbo al suo passato prossimo/, "Qual è il passato prossimo di ", "?"],
    [/verbo (inglese )?irregolare (inglese )?al suo passato/, "Qual è il passato del verbo inglese ", "?"],
    [/voce del coro/, "Che tipo di voce del coro è ", "?"],
    [/al suo significato/, "Che cosa significa ", "?"],
    [/al suo tema/, "Di che cosa parla ", "?"]
  ];
  // regole in cui la risposta non è una sola: nei giochi a lettere si saltano
  const ASK_AMBIGUE = /stagione a un suo mese|a una sua opera|alla sua opera|a una sua caratteristica|a una sua proprietà|periodo alla sua|parte del paesaggio|personaggio|città italiana|cosa di una volta|fonte di energia|oggetto a ciò|ciò che dobbiamo fare|parte del computer|parte della pianta|pianeta alla sua|organizzazione al suo|simbolo italiano|tecnica a come|strumento a come|monumento al suo|segnale|rifiuto/;

  // restituisce { pre, post, text } : la parola da indovinare va tra «pre» e «post»
  function askFor(rule, word, eng, rEn) {
    rule = String(rule || "");
    if (/operazione al suo risultato/.test(rule)) return { pre: "Quanto fa ", post: "?", text: `Quanto fa ${word}?`, bare: true };
    if (/(equazione|quesito) alla sua soluzione/.test(rule)) return { pre: "Risolvi: ", post: "", text: `Risolvi: ${word}`, bare: true };
    let hit = ASK_RULES.find(a => a[0].test(rule));
    let pre, post;
    if (hit) { pre = hit[1]; post = hit[2]; }
    else { pre = rule.replace(/\.$/, "") + ": "; post = ""; }
    // inglese/altre lingue: dillo chiaro nella domanda, così si legge anche se la voce non si capisce
    if (hit && eng && !rEn && /significato/.test(rule)) post = " in italiano?";
    else if (hit && rEn && /contrario/.test(rule)) post = " in inglese?";
    if (hit && /latina|«sum»/.test(rule)) post = " in italiano?";
    const text = `${pre}«${word}»${post}`;
    return { pre: pre + "«", post: "»" + post, text };
  }

  // ====================================================================
  // LETTERE MESCOLATE: rimetti in ordine le lettere della parola
  // ====================================================================
  function makeLettere(classId, subjectId) {
    for (let k = 0; k < 20; k++) {
      const g = pairsFor(classId, subjectId);
      if (ASK_AMBIGUE.test(g.prompt)) continue;
      const cands = shuffle(g.pairs).filter(p => { const w = String(p.r); return !/\s/.test(w) && w.length >= 2 && w.length <= 9; });
      if (!cands.length) continue;
      const p = cands[0], ask = askFor(g.prompt, p.l, g.eng, g.rEn);
      return { kind: "lettere", title: "Lettere mescolate", eng: g.eng, rEn: g.rEn, clue: { l: p.l, r: String(p.r) }, ask,
        prompt: `${ask.text} Rimetti in ordine le lettere della risposta.`, hint: "Tocca le lettere nell'ordine giusto: due errori si perdonano.", scene: g.scene };
    }
    return null;
  }

  function mountLettere(el, r, onDone) {
    const word = r.clue.r, letters = word.split("");
    let order = shuffle(letters.map((_, i) => i)), g = 0;
    while (order.every((v, i) => letters[v] === letters[i]) && g++ < 40) order = shuffle(order);
    let placed = [], mistakes = 0, done = false, busy = false;

    function draw(state) {
      const pool = order.filter(i => !placed.includes(i));
      el.innerHTML = `<div class="lett">
        <div class="lt-clue">${esc(r.ask ? r.ask.text : r.clue.l + " → ?")}</div>
        <div class="lt-slots ${state || ""}">${letters.map((_, k) => placed[k] !== undefined
          ? `<button class="lt-slot on" data-pos="${k}">${esc(letters[placed[k]])}</button>` : `<span class="lt-slot"></span>`).join("")}</div>
        <div class="lt-pool">${pool.map(i => `<button class="lt-tile" data-id="${i}">${esc(letters[i])}</button>`).join("")}</div>
      </div>`;
    }
    el.onclick = e => {
      if (done || busy) return;
      const t = e.target.closest("button");
      if (!t || !el.contains(t)) return;
      if (t.dataset.pos !== undefined) { placed.splice(+t.dataset.pos, 1); tapFn(); draw(); return; }
      if (t.dataset.id === undefined) return;
      placed.push(+t.dataset.id); tapFn();
      if (placed.length < letters.length) { draw(); return; }
      const ok = placed.map(i => letters[i]).join("").toLowerCase() === word.toLowerCase();
      if (ok) {
        done = true; draw("ok");
        onDone(true, `${r.clue.l} → ${word}`, mistakes === 0 ? "Parola ricostruita al primo colpo!" : "Parola ricostruita!");
        return;
      }
      mistakes++; boomFn();
      if (mistakes > 2) { done = true; draw("bad"); onDone(false, `${r.clue.l} → ${word}`, ""); return; }
      busy = true; draw("bad");
      setTimeout(() => { if (!el.isConnected) return; busy = false; placed = []; draw(); }, 800);
    };
    draw();
  }

  // ====================================================================
  // TROVA L'INTRUSO: tre giri, quattro parole, una non c'entra con le altre
  // ====================================================================
  function makeIntruso(classId, subjectId) {
    if (subjectId === "matematica" || subjectId === "italiano") return null;
    const band = classId <= 1 ? "A" : classId <= 4 ? "B" : "C";
    const eng = subjectId === "inglese" || subjectId === "lingua2";
    const allThemes = (subjectId === "inglese" ? ENG_PAIRS : OTHER_PAIRS[subjectId] || {})[band];
    const themes = allThemes && Questions.inClass(allThemes, classId);
    if (!themes || themes.length < 2) return null;
    const low = t => String(t).toLowerCase();
    const rounds = [];
    let order = shuffle(themes.slice()), guard = 0;
    while (rounds.length < 3 && guard++ < 30) {
      if (!order.length) order = shuffle(themes.slice());
      const T = order.shift();
      if (T.pairs.length < 3) continue;
      const lefts = T.pairs.map(p => p[0]), rights = T.pairs.map(p => p[1]);
      const others = shuffle(themes.filter(x => x !== T).flatMap(x => x.pairs.map(p => p[0])))
        .filter(w => !lefts.some(l => low(l) === low(w)) && !rights.some(rr => low(rr) === low(w)));
      if (!others.length) continue;
      const rest = shuffle(lefts).slice(0, 3), odd = others[0];
      const words = shuffle(rest.concat([odd]));
      if (rounds.some(c => c.words.join("|") === words.join("|"))) continue;
      rounds.push({ words, odd: words.indexOf(odd), rest, eng });
    }
    if (rounds.length < 3) return null;
    return { kind: "intruso", title: "Trova l'intruso", eng, prompt: "Tre giri: trova l'intruso!",
      hint: "Tocca la parola che non c'entra con le altre tre. Due errori si perdonano, al terzo si perde.", rounds };
  }

  function mountIntruso(el, r, onDone) {
    const R = r.rounds;
    let i = 0, mistakes = 0, right = 0, busy = false, done = false;
    const wrongList = [];
    function draw() {
      const c = R[i];
      el.innerHTML = `<div class="vf odd">
        <div class="vf-dots">${R.map((_, k) => `<i class="${k < i ? "done" : k === i ? "now" : ""}"></i>`).join("")}</div>
        <div class="vf-card">
          <div class="vf-q">Quale parola non c'entra con le altre?</div>
          ${canSpeakFn() ? `<button class="btn ghost vf-say" data-say>🔊 Leggi</button>` : ""}
        </div>
        <div class="odd-grid">${c.words.map((w, k) => `<button class="odd-w" data-k="${k}">${esc(w)}</button>`).join("")}</div>
      </div>`;
      if (i > 0 && autoSpeakFn() && speakFn) speakFn(c);
    }
    function finish() {
      done = true;
      const ok = mistakes <= 2;
      el.innerHTML = `<div class="vf"><div class="vf-dots">${R.map(() => `<i class="done"></i>`).join("")}</div>
        <div class="vf-card"><div class="vf-end">${ok ? "🎉" : "😅"} ${right} su ${R.length} giuste</div></div></div>`;
      onDone(ok, wrongList.join(" · "), ok ? (mistakes === 0 ? "Tre su tre: occhio da detective!" : "Bravo, hai trovato gli intrusi!") : "");
    }
    el.onclick = e => {
      const say = e.target.closest("[data-say]");
      if (say && speakFn) { speakFn(R[i]); return; }
      const b = e.target.closest("[data-k]");
      if (!b || busy || done) return;
      busy = true; tapFn();
      const c = R[i], ok = +b.dataset.k === c.odd;
      el.querySelectorAll("[data-k]").forEach(x => { x.disabled = true; });
      const good = el.querySelector(`[data-k="${c.odd}"]`);
      markAnswer(el, "[data-k]", good, b, ok);
      if (ok) right++; else {
        mistakes++; boomFn();
        wrongList.push(`${c.words[c.odd]} è l'intruso (gli altri: ${c.rest.join(", ")})`);
        const card = el.querySelector(".vf-card");
        if (card) card.insertAdjacentHTML("beforeend", `<div class="vf-fix">Gli altri tre vanno insieme: <b>${esc(c.rest.join(", "))}</b></div>`);
      }
      setTimeout(() => {
        if (!el.isConnected) return;
        busy = false;
        if (mistakes > 2 || i >= R.length - 1) { finish(); return; }
        i++; draw();
      }, ok ? 1000 : 1900);
    };
    draw();
  }

  // ====================================================================
  // METTI IN FILA: tocca gli elementi nell'ordine giusto (numeri, giorni, epoche, pianeti, note…)
  // ====================================================================
  const MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  const GIORNI = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];
  const EN_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const EN_NUM = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  const PIANETI = ["Mercurio", "Venere", "Terra", "Marte", "Giove", "Saturno", "Urano", "Nettuno"];
  const INVENZIONI = ["Stampa di Gutenberg", "Telescopio di Galileo", "Pila di Volta", "Radio di Marconi", "Aeroplano dei fratelli Wright", "Computer", "Smartphone"];
  const MONTAGNE = ["Monte Bianco", "Monte Rosa", "Cervino", "Gran Paradiso", "Etna", "Gran Sasso"];
  const CITTA_NS = ["Trento", "Milano", "Firenze", "Roma", "Napoli", "Catanzaro", "Palermo"];
  const OCEANI = ["Pacifico", "Atlantico", "Indiano", "Artico"];
  const COLORI_ARC = ["rosso", "arancione", "giallo", "verde", "azzurro", "indaco", "viola"];
  const NOTE = ["do", "re", "mi", "fa", "sol", "la", "si"];
  const DURATE = ["semibreve", "minima", "semiminima", "croma", "semicroma"];
  const DINAMICHE = ["pianissimo", "piano", "mezzoforte", "forte", "fortissimo"];
  const EPOCHE = ["Preistoria", "Età antica", "Medioevo", "Età moderna", "Età contemporanea"];
  const SEQS = {
    storia: {
      A: [
        { p: "Metti in fila i giorni della settimana.", items: GIORNI }, { p: "Metti in fila i mesi dell'anno.", items: MESI },
        { p: "Metti in fila i momenti della giornata.", items: ["mattina", "mezzogiorno", "pomeriggio", "sera", "notte"] },
        { p: "Metti in fila le stagioni, a partire dalla primavera.", items: ["primavera", "estate", "autunno", "inverno"] }
      ],
      B: [
        { p: "Metti in fila le età della storia, dalla più antica.", items: EPOCHE },
        { p: "Metti in fila i periodi della Preistoria, dal più antico.", items: ["Paleolitico", "Neolitico", "Età del bronzo", "Età del ferro"] },
        { p: "Metti in fila questi eventi, dal più antico.", items: ["Nascita di Roma", "Caduta dell'Impero romano d'Occidente", "Scoperta dell'America", "Rivoluzione francese", "Unità d'Italia"] }
      ],
      C: [
        { cl: [5, 7], p: "Metti in fila questi eventi, dal più antico.", items: ["Caduta dell'Impero romano d'Occidente", "Incoronazione di Carlo Magno", "Prima Crociata", "Peste nera", "Caduta di Costantinopoli", "Scoperta dell'America"] },
        { cl: [6, 7], p: "Metti in fila questi eventi, dal più antico.", items: ["Scoperta dell'America", "Rivoluzione francese", "Unità d'Italia", "Prima guerra mondiale", "Seconda guerra mondiale", "Nascita della Repubblica italiana", "Caduta del Muro di Berlino"] },
        { p: "Metti in fila le età della storia, dalla più antica.", items: EPOCHE }
      ]
    },
    geografia: {
      A: [{ p: "Metti in fila dal più piccolo al più grande.", items: ["la casa", "la strada", "il quartiere", "la città"] }],
      B: [{ p: "Metti in fila queste città, da Nord a Sud.", items: CITTA_NS }, { p: "Metti in fila gli oceani, dal più grande al più piccolo.", items: OCEANI }],
      C: [{ p: "Metti in fila queste città, da Nord a Sud.", items: CITTA_NS }, { p: "Metti in fila gli oceani, dal più grande al più piccolo.", items: OCEANI },
        { p: "Metti in fila queste montagne, dalla più alta alla più bassa.", items: MONTAGNE }]
    },
    scienze: {
      A: [
        { p: "Metti in fila la vita di una pianta.", items: ["seme", "germoglio", "pianta", "fiore", "frutto"] },
        { p: "Metti in fila la vita di una farfalla.", items: ["uovo", "bruco", "crisalide", "farfalla"] },
        { p: "Metti in fila le età di una persona.", items: ["neonato", "bambino", "adulto", "anziano"] }
      ],
      B: [
        { p: "Metti in fila i pianeti, dal più vicino al Sole.", items: PIANETI },
        { p: "Metti in fila la catena alimentare, a partire dall'erba.", items: ["erba", "cavalletta", "rana", "serpente", "aquila"] },
        { p: "Metti in fila il viaggio del cibo nel corpo.", items: ["bocca", "esofago", "stomaco", "intestino tenue", "intestino crasso"] }
      ],
      C: [
        { p: "Metti in fila i pianeti, dal più vicino al Sole.", items: PIANETI },
        { p: "Metti in fila i livelli del corpo, dal più piccolo al più grande.", items: ["cellula", "tessuto", "organo", "apparato", "organismo"] },
        { p: "Metti in fila il viaggio del cibo nel corpo.", items: ["bocca", "esofago", "stomaco", "intestino tenue", "intestino crasso"] }
      ]
    },
    tecnologia: {
      A: [{ p: "Metti in fila dal più lento al più veloce.", items: ["a piedi", "bicicletta", "automobile", "treno veloce", "aereo"] }],
      B: [{ p: "Metti in fila queste invenzioni, dalla più antica.", items: INVENZIONI }],
      C: [{ p: "Metti in fila queste invenzioni, dalla più antica.", items: INVENZIONI }]
    },
    arte: {
      A: [{ p: "Metti in fila i colori dell'arcobaleno, dal rosso.", items: COLORI_ARC }],
      B: [{ p: "Metti in fila i colori dell'arcobaleno, dal rosso.", items: COLORI_ARC }],
      C: [{ p: "Metti in fila questi movimenti artistici, dal più antico.", items: ["Romanico", "Gotico", "Rinascimento", "Barocco", "Neoclassicismo", "Impressionismo", "Cubismo"] }]
    },
    musica: {
      A: [{ p: "Metti in fila le note musicali, a partire dal do.", items: NOTE }],
      B: [{ p: "Metti in fila le note musicali, a partire dal do.", items: NOTE }, { p: "Metti in fila le durate, dalla più lunga alla più corta.", items: DURATE }],
      C: [{ p: "Metti in fila le durate, dalla più lunga alla più corta.", items: DURATE }, { p: "Metti in fila i volumi, dal più piano al più forte.", items: DINAMICHE }]
    },
    civica: {
      A: [{ p: "Metti in fila dal più piccolo al più grande.", items: ["la classe", "la scuola", "il quartiere", "la città"] }],
      B: [{ p: "Metti in fila dal più piccolo al più grande.", items: ["il Comune", "la Provincia", "la Regione", "lo Stato", "l'Unione europea"] }],
      C: [{ p: "Metti in fila dal più piccolo al più grande.", items: ["il Comune", "la Provincia", "la Regione", "lo Stato", "l'Unione europea"] }]
    },
    inglese: {
      eng: true,
      A: [{ p: "Put the numbers in order. Metti in fila i numeri.", items: EN_NUM }, { p: "Put the days in order. Metti in fila i giorni.", items: EN_DAYS }],
      B: [{ p: "Metti in fila i giorni della settimana.", items: EN_DAYS }, { p: "Metti in fila i mesi dell'anno.", items: EN_MONTHS }, { p: "Metti in fila i numeri.", items: EN_NUM }],
      C: [{ p: "Metti in fila i mesi dell'anno.", items: EN_MONTHS }, { p: "Metti in fila i giorni della settimana.", items: EN_DAYS }, { p: "Metti in fila le stagioni.", items: ["spring", "summer", "autumn", "winter"] }]
    },
    latino: {
      A: [{ p: "Metti in fila i numeri latini, da unus.", items: ["unus", "duo", "tres", "quattuor", "quinque", "sex", "septem", "octo", "novem", "decem"] }],
      B: [{ p: "Metti in fila i numeri latini, da unus.", items: ["unus", "duo", "tres", "quattuor", "quinque", "sex", "septem", "octo", "novem", "decem"] }],
      C: [{ p: "Metti in fila i numeri latini, da unus.", items: ["unus", "duo", "tres", "quattuor", "quinque", "sex", "septem", "octo", "novem", "decem"] }]
    }
  };
  const ITA_ALFA = {
    A: ["albero", "barca", "casa", "dado", "elefante", "fiore", "gatto", "isola", "luna", "mela", "naso", "ombrello", "pane", "rana", "sole", "tavolo", "uva", "vela", "zaino"],
    B: ["amicizia", "bosco", "cavallo", "dolce", "estate", "finestra", "giardino", "libro", "montagna", "natura", "orologio", "palazzo", "quaderno", "ragazzo", "scuola", "treno", "vento", "zucchero"],
    C: ["abitudine", "bellezza", "coraggio", "dolore", "energia", "fantasia", "gentilezza", "illusione", "libertà", "memoria", "orizzonte", "pazienza", "ricordo", "silenzio", "tempesta", "universo", "vittoria"]
  };

  function filaMath(c) {
    const dec = x => String(x).replace(".", ",");
    const n = c <= 2 ? 4 : 5;
    const asc = Math.random() < 0.5;
    let vals = [];
    const uniqN = gen => { const set = new Map(); let g = 0; while (set.size < n && g++ < 200) { const v = gen(); set.set(v.k, v.s); } return [...set.entries()]; };
    let items;
    if (c === 0) items = uniqN(() => { const v = rnd(1, 20); return { k: v, s: String(v) }; });
    else if (c === 1) items = uniqN(() => { const v = rnd(5, 99); return { k: v, s: String(v) }; });
    else if (c === 2) items = uniqN(() => { const v = rnd(20, 999); return { k: v, s: String(v) }; });
    else if (c === 3) items = uniqN(() => { const v = rnd(120, 9999); return { k: v, s: String(v) }; });
    else if (c === 4) items = uniqN(() => { const v = rnd(1, 199) / 10; return { k: v, s: dec(v) }; });
    else if (c === 5) items = uniqN(() => { const v = rnd(5, 999) / (Math.random() < 0.5 ? 100 : 1000); return { k: v, s: dec(v) }; });
    else if (c === 6) items = uniqN(() => { const v = rnd(-15, 15); return { k: v, s: v < 0 ? "−" + (-v) : String(v) }; });
    else items = uniqN(() => {
      const r = Math.random();
      if (r < 0.4) { const v = rnd(-9, 9); return { k: v, s: v < 0 ? "−" + (-v) : String(v) }; }
      if (r < 0.7) { const q = rnd(2, 9); return { k: q, s: "√" + q * q }; }
      const b = rnd(2, 5), e = rnd(2, 3); return { k: Math.pow(b, e), s: b + (e === 2 ? "²" : "³") };
    });
    if (items.length < n) return null;
    items.sort((a, b) => asc ? a[0] - b[0] : b[0] - a[0]);
    return { p: asc ? "Metti in fila i numeri, dal più piccolo al più grande." : "Metti in fila i numeri, dal più grande al più piccolo.", items: items.map(x => x[1]) };
  }

  function makeFila(classId, subjectId) {
    const band = classId <= 1 ? "A" : classId <= 4 ? "B" : "C";
    const n = classId <= 2 ? 4 : 5;
    let src = null, eng = false;
    if (subjectId === "matematica") src = filaMath(classId);
    else if (subjectId === "italiano") {
      const pool = shuffle(ITA_ALFA[band].slice()), take = [], seen = new Set();
      for (const w of pool) { if (!seen.has(w[0]) && take.length < n) { seen.add(w[0]); take.push(w); } }
      src = { p: "Metti in fila queste parole in ordine alfabetico.", items: take.sort((a, b) => a.localeCompare(b, "it")) };
    } else if (subjectId === "lingua2") {
      const list = L2.seqs(); if (list.length) { src = pick(list); eng = true; }
    } else if (SEQS[subjectId]) {
      const list = Questions.inClass(SEQS[subjectId][band] || [], classId);
      if (list.length) { src = pick(list); eng = !!SEQS[subjectId].eng; }
    }
    if (!src || src.items.length < 3) return null;
    let items = src.items;
    if (items.length > n) {   // si prendono n elementi a caso, ma restano nel loro ordine
      const idx = shuffle(items.map((_, i) => i)).slice(0, n).sort((a, b) => a - b);
      items = idx.map(i => items[i]);
    }
    let pool = shuffle(items.slice()), g = 0;
    while (pool.every((v, i) => v === items[i]) && g++ < 30) pool = shuffle(pool);
    return { kind: "fila", title: "Metti in fila", eng, prompt: src.p, hint: "Tocca gli elementi nell'ordine giusto, uno dopo l'altro. Due errori si perdonano.",
      items, pool, solution: items.join(" → ") };
  }

  function mountFila(el, r, onDone) {
    const items = r.items, n = items.length;
    let next = 0, mistakes = 0, done = false, busy = false;
    function draw(failed) {
      const used = new Set(items.slice(0, next));
      el.innerHTML = `<div class="fila">
        <div class="fila-slots">${items.map((it, k) => `<div class="fila-slot ${k < next ? "on" : ""} ${failed && k >= next ? "show" : ""}"><b>${k + 1}</b><span>${k < next || failed ? esc(it) : ""}</span></div>`).join("")}</div>
        <div class="fila-pool">${r.pool.map((it, k) => used.has(it) ? "" : `<button class="fila-chip" data-k="${k}">${esc(it)}</button>`).join("")}</div>
      </div>`;
    }
    el.onclick = e => {
      if (done || busy) return;
      const b = e.target.closest("[data-k]");
      if (!b) return;
      const it = r.pool[+b.dataset.k];
      tapFn();
      if (it === items[next]) {
        next++;
        if (next >= n) { done = true; draw(); el.querySelectorAll(".fila-slot").forEach(x => x.classList.add("ok")); onDone(true, r.solution, mistakes === 0 ? "Tutto in fila al primo colpo!" : "Tutto in fila!"); return; }
        draw(); return;
      }
      mistakes++; boomFn(); b.classList.add("bad");
      if (mistakes > 2) { done = true; busy = true; setTimeout(() => { if (!el.isConnected) return; draw(true); onDone(false, r.solution, ""); }, 500); return; }
      busy = true; setTimeout(() => { if (!el.isConnected) return; busy = false; draw(); }, 600);
    };
    draw();
  }

  // ====================================================================
  // SALVA L'OMINO (impiccato): si indovina la parola toccando le lettere
  // ====================================================================
  function makeImpiccato(classId, subjectId) {
    const maxLen = classId <= 2 ? 7 : 10;
    for (let k = 0; k < 20; k++) {
      const g = pairsFor(classId, subjectId);
      if (ASK_AMBIGUE.test(g.prompt)) continue;
      const cands = shuffle(g.pairs).filter(p => {
        if (p.r == null) return false;
        const w = String(p.r), dig = /^\d+$/.test(w);
        return /^[\p{L}\d]+$/u.test(w) && w.length >= (dig ? 2 : 3) && w.length <= maxLen;
      });
      if (!cands.length) continue;
      const p = cands[0], ask = askFor(g.prompt, String(p.l), g.eng, g.rEn);
      return { kind: "impiccato", title: "Salva l'omino", eng: g.eng, rEn: g.rEn, clue: { l: String(p.l), r: String(p.r) }, ask,
        extra: classId <= 2 ? 3 : classId <= 4 ? 4 : 6,
        prompt: `${ask.text} Indovina la parola toccando le lettere.`,
        hint: "Indovina la parola toccando le lettere. Due errori si perdonano, al terzo l'omino cade in acqua.", scene: g.scene };
    }
    return null;
  }

  function hangSvg(stage, win) {
    // stage: 0 tutto a posto, 1 e 2 le assi cadono una dopo l'altra, 3 l'omino cade in acqua
    const fallen = stage === 1 ? [3] : stage === 2 ? [1, 3] : stage >= 3 ? [1, 2, 3] : [];
    const planks = [0, 1, 2, 3, 4].map(i =>
      `<rect class="hg-plank${fallen.includes(i) ? " fall" : ""}" x="${90 + i * 24}" y="100" width="24" height="9" rx="2" fill="#C98B4A" stroke="#2B2D52" stroke-width="2.5"/>`).join("");
    const up = win || stage === 2;
    const arms = up
      ? `<path d="M150 77 L136 64 M150 77 L164 64" stroke="#2B2D52" stroke-width="4" stroke-linecap="round" fill="none"/>`
      : `<path d="M150 77 L138 87 M150 77 L162 87" stroke="#2B2D52" stroke-width="4" stroke-linecap="round" fill="none"/>`;
    const eyes = stage >= 3
      ? `<path d="M143 54 l5 5 m0 -5 l-5 5 M152 54 l5 5 m0 -5 l-5 5" stroke="#2B2D52" stroke-width="2" stroke-linecap="round"/>`
      : `<circle cx="146" cy="57" r="1.9" fill="#2B2D52"/><circle cx="154" cy="57" r="1.9" fill="#2B2D52"/>`;
    const mouth = win ? `<path d="M143 62 Q150 71 157 62 Z" fill="#fff" stroke="#2B2D52" stroke-width="2" stroke-linejoin="round"/>`
      : stage >= 3 ? `<path d="M145 66 Q150 61 155 66" stroke="#2B2D52" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
      : stage >= 1 ? `<ellipse cx="150" cy="65" rx="2.6" ry="3.2" fill="#2B2D52"/>`
      : `<path d="M145 63 Q150 68 155 63" stroke="#2B2D52" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    const man = `<g class="hg-man ${stage >= 3 ? "drop" : stage >= 1 ? "wobble" : win ? "hop" : ""}">
        <path d="M150 71 L150 90 M150 90 L142 100 M150 90 L158 100" stroke="#2B2D52" stroke-width="4" stroke-linecap="round" fill="none"/>
        ${arms}
        <circle cx="150" cy="58" r="13" fill="#FFD9A8" stroke="#2B2D52" stroke-width="3"/>
        <path d="M137 55 Q150 38 163 55 Z" fill="#FF5C8A" stroke="#2B2D52" stroke-width="2.5" stroke-linejoin="round"/>
        ${eyes}${mouth}</g>`;
    const splash = stage >= 3 ? `<g class="hg-splash"><circle cx="140" cy="132" r="4" fill="#fff"/><circle cx="160" cy="130" r="5" fill="#fff"/><circle cx="150" cy="124" r="3.5" fill="#fff"/><circle cx="130" cy="136" r="3" fill="#fff"/><circle cx="170" cy="136" r="3" fill="#fff"/></g>` : "";
    const stars = win ? `<g class="hg-stars"><text x="104" y="52" font-size="18">⭐</text><text x="182" y="46" font-size="20">✨</text><text x="196" y="74" font-size="16">⭐</text></g>` : "";
    return `<svg class="hg-svg" viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="L'omino sul ponte">
      <rect width="300" height="170" fill="#BFE8FF"/>
      <circle cx="42" cy="32" r="15" fill="#FFD23F" stroke="#2B2D52" stroke-width="3"/>
      <ellipse cx="236" cy="34" rx="26" ry="10" fill="#fff"/><ellipse cx="256" cy="40" rx="18" ry="8" fill="#fff"/>
      <rect x="0" y="100" width="90" height="70" fill="#8A5A2B" stroke="#2B2D52" stroke-width="3"/>
      <rect x="210" y="100" width="90" height="70" fill="#8A5A2B" stroke="#2B2D52" stroke-width="3"/>
      <rect x="0" y="96" width="90" height="10" fill="#7BD35B" stroke="#2B2D52" stroke-width="3"/>
      <rect x="210" y="96" width="90" height="10" fill="#7BD35B" stroke="#2B2D52" stroke-width="3"/>
      <rect x="90" y="138" width="120" height="32" fill="#4DB8FF"/>
      <path d="M90 140 q10 -7 20 0 t20 0 t20 0 t20 0 t20 0 t10 0" stroke="#fff" stroke-width="3" fill="none"/>
      ${planks}${man}${splash}${stars}</svg>`;
  }

  function mountImpiccato(el, r, onDone) {
    const word = r.clue.r, chars = word.split(""), low = chars.map(c => c.toLowerCase());
    const uniq = [...new Set(low)], dig = /^\d+$/.test(word);
    const source = dig ? "0123456789".split("") : "abcdefghijklmnopqrstuvwxyz".split("");
    const decoys = shuffle(source.filter(c => !uniq.includes(c))).slice(0, r.extra || 3);
    const keys = uniq.concat(decoys).sort((a, b) => a.localeCompare(b, "it"));
    const used = new Map();   // lettera -> "ok" | "bad"
    let mistakes = 0, done = false, win = false;

    function draw() {
      const lost = done && !win;
      el.innerHTML = `<div class="hang">
        <div class="hg-scene">${hangSvg(Math.min(mistakes, 3), win)}</div>
        <div class="hg-word ${win ? "ok" : lost ? "bad" : ""}">${chars.map((c, i) => {
          const shown = used.get(low[i]) === "ok" || lost;
          return `<span class="hg-slot ${shown ? "on" : ""} ${lost && used.get(low[i]) !== "ok" ? "miss" : ""}">${shown ? esc(c) : ""}</span>`;
        }).join("")}</div>
        <div class="hg-keys">${keys.map(k => `<button class="hg-key ${used.get(k) || ""}" data-k="${esc(k)}" ${used.has(k) || done ? "disabled" : ""}>${esc(k)}</button>`).join("")}</div>
      </div>`;
    }
    el.onclick = e => {
      if (done) return;
      const b = e.target.closest(".hg-key");
      if (!b || !el.contains(b) || b.disabled) return;
      const k = b.dataset.k;
      tapFn();
      if (low.includes(k)) {
        used.set(k, "ok");
        if (uniq.every(u => used.get(u) === "ok")) {
          done = true; win = true; draw();
          onDone(true, `${r.clue.l} → ${word}`, mistakes === 0 ? "Omino salvato senza errori!" : "Omino salvato!");
          return;
        }
      } else {
        used.set(k, "bad"); mistakes++; boomFn();
        if (mistakes > 2) { done = true; draw(); onDone(false, `${r.clue.l} → ${word}`, ""); return; }
      }
      draw();
    };
    draw();
  }

  // ====================================================================
  // TAGLIA AL VOLO: le risposte volano, si taglia col dito quella giusta
  // ====================================================================
  function makeTaglia(classId, subjectId) {
    if (typeof Questions === "undefined") return null;
    const q = Questions.next(subjectId, classId);
    if (!q || q.a.length < 3) return null;
    return { kind: "taglia", title: "Taglia al volo", prompt: q.q, q,
      hint: "Le risposte volano: passa il dito sopra quella giusta per tagliarla! Due errori si perdonano, al terzo si perde.",
      T: classId <= 2 ? 3.1 : classId <= 4 ? 2.6 : 2.2 };
  }

  function mountTaglia(el, r, onDone) {
    const q = r.q, n = q.a.length;
    el.innerHTML = `<div class="slice"><svg class="sl-trail" xmlns="http://www.w3.org/2000/svg"><polyline points="" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>${q.a.map(a => {
      const L = a.length;
      return `<div class="sl-card"><span class="sl-in" style="font-size:${L > 18 ? 12 : L > 11 ? 14 : L > 7 ? 17 : 20}px">${esc(a)}</span></div>`;
    }).join("")}</div>`;
    const field = el.querySelector(".slice"), line = el.querySelector("polyline");
    const FW = field.clientWidth || 320, FH = field.clientHeight || 340;
    const C = [...field.querySelectorAll(".sl-card")].map((c, i) => ({
      el: c, in: c.firstChild, i, w: c.offsetWidth || 90, h: c.offsetHeight || 40, live: false, wait: 0.25 + i * 0.55 + Math.random() * 0.3,
      t: 0, T: 1, x0: 0, vx: 0, y0: 0, vy: 0, g: 0, x: 0, y: FH + 80 }));
    C.forEach(c => { c.el.style.visibility = "hidden"; });
    const pts = [];
    let done = false, mistakes = 0, last = 0, pressing = false, px = 0, py = 0;

    const place = c => { c.el.style.transform = `translate3d(${Math.round(c.x)}px,${Math.round(c.y)}px,0)`; };
    function launch(c) {
      const T = r.T * (0.9 + Math.random() * 0.25), h = FH * (0.6 + Math.random() * 0.22), span = Math.max(0, FW - c.w);
      c.T = T; c.t = 0; c.g = 8 * h / (T * T); c.vy = -4 * h / T; c.y0 = FH + 6;
      c.x0 = Math.min(span, Math.max(0, (c.i / Math.max(1, n - 1)) * span + (Math.random() - 0.5) * span * 0.3));
      c.vx = (Math.random() * span - c.x0) / T;
      c.live = true; c.in.className = "sl-in";
      c.x = c.x0; c.y = c.y0; place(c); c.el.style.visibility = "visible";
    }
    function center(c) { c.x = (FW - c.w) / 2; c.y = (FH - c.h) / 2; place(c); c.el.style.visibility = "visible"; c.in.className = "sl-in won"; }

    function cut(c) {
      if (done || !c.live) return;
      c.live = false; c.wait = 1.1; tapFn();
      if (c.i === q.c) {
        done = true; stop();
        C.forEach(x => { if (x !== c) x.el.style.visibility = "hidden"; });
        center(c); line.setAttribute("points", "");
        onDone(true, q.a[q.c], q.e || "");
        return;
      }
      mistakes++; boomFn(); c.in.className = "sl-in badc";
      if (mistakes > 2) {
        done = true; stop();
        C.forEach(x => { x.el.style.visibility = "hidden"; });
        center(C[q.c]); line.setAttribute("points", "");
        onDone(false, q.a[q.c], q.e || "");
      }
    }
    function hitSeg(x1, y1, x2, y2) {
      const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 6));
      for (let s = 0; s <= steps; s++) {
        const x = x1 + (x2 - x1) * s / steps, y = y1 + (y2 - y1) * s / steps;
        for (const c of C) {
          if (done) return;
          if (c.live && x >= c.x - 10 && x <= c.x + c.w + 10 && y >= c.y - 10 && y <= c.y + c.h + 10) cut(c);
        }
      }
    }
    function frame(now) {
      if (done) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      for (const c of C) {
        if (c.live) {
          c.t += dt; c.x = c.x0 + c.vx * c.t; c.y = c.y0 + c.vy * c.t + 0.5 * c.g * c.t * c.t; place(c);
          if (c.t >= c.T) { c.live = false; c.el.style.visibility = "hidden"; c.wait = 0.3 + Math.random() * 0.7; }
        } else {
          c.wait -= dt;
          if (c.wait <= 0) launch(c);
        }
      }
      while (pts.length && now - pts[0].t > 170) pts.shift();
      line.setAttribute("points", pts.map(p => p.x.toFixed(1) + "," + p.y.toFixed(1)).join(" "));
      raf = requestAnimationFrame(frame);
    }
    const pos = e => { const b = field.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    field.addEventListener("pointerdown", e => {
      if (done) return;
      e.preventDefault();
      try { field.setPointerCapture(e.pointerId); } catch (_) {}
      pressing = true; [px, py] = pos(e); pts.length = 0; pts.push({ x: px, y: py, t: performance.now() });
      hitSeg(px, py, px, py);
    });
    field.addEventListener("pointermove", e => {
      if (!pressing || done) return;
      const [x, y] = pos(e);
      hitSeg(px, py, x, y); px = x; py = y; pts.push({ x, y, t: performance.now() });
    });
    const up = () => { pressing = false; };
    field.addEventListener("pointerup", up); field.addEventListener("pointercancel", up);
    raf = requestAnimationFrame(frame);
  }

  // ====================================================================
  // COLLEGA CON LE LINEE: si trascina il dito da una parola alla sua coppia
  // ====================================================================
  function makeLinee(classId, subjectId) {
    const g = pairsFor(classId, subjectId);
    const pairs = g.pairs.filter(p => p.r != null).slice(0, 4).map(p => ({ l: String(p.l), r: String(p.r) }));
    if (pairs.length < 3) return null;
    const uniq = k => new Set(pairs.map(p => p[k].toLowerCase())).size === pairs.length;
    if (!uniq("l") || !uniq("r")) return null;
    let order = shuffle(pairs.map((_, i) => i)), guard = 0;
    while (order.every((v, i) => v === i) && guard++ < 30) order = shuffle(order);
    return { kind: "linee", title: "Collega con le linee", eng: g.eng, rEn: g.rEn, prompt: g.prompt,
      hint: "Trascina il dito da una parola alla sua coppia (oppure tocca una parola e poi la sua coppia). Due errori si perdonano, al terzo si perde.",
      pairs, order, scene: g.scene };
  }

  function mountLinee(el, r, onDone) {
    const P = r.pairs, n = P.length, GREEN = "#34a847", COL = P.map(() => GREEN);   // corretto = sempre verde (linea, pallini e caselle)
    el.innerHTML = `<div class="lk">
      <div class="lk-col">${P.map((p, i) => `<button class="lk-item" data-s="l" data-p="${i}"><span>${esc(p.l)}</span><i class="lk-dot"></i></button>`).join("")}</div>
      <div class="lk-col">${r.order.map(i => `<button class="lk-item" data-s="r" data-p="${i}"><span>${esc(P[i].r)}</span><i class="lk-dot"></i></button>`).join("")}</div>
      <svg class="lk-svg" xmlns="http://www.w3.org/2000/svg"></svg></div>`;
    const box = el.querySelector(".lk"), svg = el.querySelector(".lk-svg");
    const item = (s, p) => box.querySelector(`.lk-item[data-s="${s}"][data-p="${p}"]`);
    const dotPos = it => {
      const b = box.getBoundingClientRect(), d = it.querySelector(".lk-dot").getBoundingClientRect();
      return [d.left + d.width / 2 - b.left, d.top + d.height / 2 - b.top];
    };
    const lines = [];   // { p, color } oppure { p, color, rev: true }
    let tmp = null, from = null, sel = null, mistakes = 0, done = false;
    const sol = P.map(p => `${p.l} → ${p.r}`).join(", ");

    function draw() {
      const seg = (a, b, color, extra) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="7" stroke-linecap="round" ${extra || ""}/>` +
        `<circle cx="${a[0]}" cy="${a[1]}" r="6" fill="${color}"/>` + (extra ? "" : `<circle cx="${b[0]}" cy="${b[1]}" r="6" fill="${color}"/>`);
      svg.innerHTML = lines.map(l => seg(dotPos(item("l", l.p)), dotPos(item("r", l.p)), l.color, l.rev ? 'stroke-dasharray="3 10"' : "")).join("") +
        (tmp ? seg(tmp.a, tmp.b, tmp.color) : "");
    }
    function clearMarks() { box.querySelectorAll(".lk-item.act,.lk-item.hov").forEach(x => x.classList.remove("act", "hov")); }
    function lock(p, color) { ["l", "r"].forEach(s => { const it = item(s, p); it.classList.add("m"); it.classList.toggle("ok", color === GREEN); it.classList.remove("act", "hov"); it.style.setProperty("--c", color); }); }

    function attempt(lp, rp) {
      sel = null; from = null; clearMarks();
      if (lp === rp) {
        lock(lp, COL[lp]); lines.push({ p: lp, color: COL[lp] }); tmp = null; draw(); tapFn();
        if (lines.length === n) { done = true; onDone(true, sol, mistakes === 0 ? "Tutte le coppie al primo colpo!" : "Tutte le coppie collegate!"); }
        return;
      }
      mistakes++; boomFn();
      const a = item("l", lp), b = item("r", rp);
      a.classList.add("bad"); b.classList.add("bad");
      tmp = { a: dotPos(a), b: dotPos(b), color: "#E5484D" }; draw();
      setTimeout(() => { if (!el.isConnected) return; a.classList.remove("bad"); b.classList.remove("bad"); tmp = null; draw(); }, 450);
      if (mistakes > 2) {
        done = true;
        for (let p = 0; p < n; p++) if (!lines.some(l => l.p === p)) { lock(p, "#E8E8F0"); lines.push({ p, color: "#7C7FA8", rev: true }); }
        draw(); onDone(false, sol, "");
      }
    }
    const rel = e => { const b = box.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    box.addEventListener("pointerdown", e => {
      if (done) return;
      const it = e.target.closest(".lk-item");
      if (!it || it.classList.contains("m")) return;
      e.preventDefault();
      try { box.setPointerCapture(e.pointerId); } catch (_) {}
      const s = it.dataset.s, p = +it.dataset.p;
      if (sel && sel.s !== s) { attempt(s === "l" ? p : sel.p, s === "r" ? p : sel.p); return; }
      clearMarks(); sel = null;
      it.classList.add("act");
      from = { s, p, it, x: e.clientX, y: e.clientY, moved: false };
    });
    box.addEventListener("pointermove", e => {
      if (done || !from) return;
      if (!from.moved && Math.hypot(e.clientX - from.x, e.clientY - from.y) > 10) from.moved = true;
      if (!from.moved) return;
      tmp = { a: dotPos(from.it), b: rel(e), color: "#2B2D52" }; draw();
      box.querySelectorAll(".lk-item.hov").forEach(x => x.classList.remove("hov"));
      const t = document.elementFromPoint(e.clientX, e.clientY), ti = t && t.closest && t.closest(".lk-item");
      if (ti && ti.dataset.s !== from.s && !ti.classList.contains("m")) ti.classList.add("hov");
    });
    box.addEventListener("pointerup", e => {
      if (done || !from) return;
      const f = from; from = null; tmp = null;
      const t = document.elementFromPoint(e.clientX, e.clientY), ti = t && t.closest && t.closest(".lk-item");
      if (f.moved && ti && ti.dataset.s !== f.s && !ti.classList.contains("m")) {
        const q = +ti.dataset.p;
        attempt(f.s === "l" ? f.p : q, f.s === "r" ? f.p : q);
        return;
      }
      clearMarks(); draw();
      if (!f.moved) { sel = { s: f.s, p: f.p }; f.it.classList.add("act"); }
    });
    box.addEventListener("pointercancel", () => { from = null; tmp = null; clearMarks(); draw(); });
    draw();
  }

  // ====================================================================
  // SCELTA E COLLEGAMENTO CON L'APP
  // ====================================================================
  const ALL = ["italiano", "matematica", "inglese", "storia", "geografia", "scienze", "tecnologia", "arte", "musica", "civica", "lingua2", "latino"];
  const GAMES = {
    frase:      { subjects: ["italiano"], make: c => makeFrase(c) },
    operazione: { subjects: ["matematica"], make: c => makeOperazione(c) },
    bersaglio:  { subjects: ALL, make: (c, s) => makeBersaglio(c, s) },
    corsa:      { subjects: ALL, make: (c, s) => makeCorsa(c, s) },
    incastro:   { subjects: ALL, make: (c, s) => makeIncastro(c, s) },
    memory:     { subjects: ALL, make: (c, s) => makeMemory(c, s) },
    palloncino: { subjects: ALL, make: (c, s) => makePalloncini(c, s) },
    pesca:      { subjects: ALL, make: (c, s) => makePesca(c, s) },
    talpa:      { subjects: ALL, make: (c, s) => makeTalpe(c, s) },
    vf:         { subjects: ALL, make: (c, s) => makeVF(c, s) },
    lettere:    { subjects: ALL, make: (c, s) => makeLettere(c, s) },
    fila:       { subjects: ALL, make: (c, s) => makeFila(c, s) },
    intruso:    { subjects: ALL.filter(x => x !== "matematica" && x !== "italiano"), make: (c, s) => makeIntruso(c, s) },
    impiccato:  { subjects: ALL, make: (c, s) => makeImpiccato(c, s) },
    taglia:     { subjects: ALL, make: (c, s) => makeTaglia(c, s) },
    linee:      { subjects: ALL, make: (c, s) => makeLinee(c, s) }
  };

  // Un giro di gioco per la materia e la classe, oppure null (allora si fa una domanda normale).
  // share = quota di giri che sono giochi (0..1); lastKind = gioco precedente, per non ripeterlo.
  function pickRound(subjectId, classId, lastKind, share) {
    if (Math.random() >= share) return null;
    // se un gioco non può partire (es. Lettere mescolate senza parole adatte) si prova con un altro
    const kinds = shuffle(Object.keys(GAMES).filter(k => GAMES[k].subjects.includes(subjectId) && k !== lastKind));
    for (const k of kinds) {
      const r = GAMES[k].make(classId, subjectId);
      if (r) return r;
    }
    return null;
  }

  function mount(el, r, onDone) {
    stop();
    if (r.kind === "frase") {
      mountBuilder(el, { kind: "frase", items: r.items, solution: r.solution, onDone, okText: "Frase perfetta!",
        check: texts => texts.join(" ") === r.solution });
    } else if (r.kind === "operazione") {
      mountBuilder(el, { kind: "operazione", items: r.items, solution: r.solution, onDone, okText: "L'operazione torna!", check: isTrue });
    } else if (r.kind === "bersaglio") {
      mountBersaglio(el, r, onDone);
    } else if (r.kind === "corsa") {
      mountCorsa(el, r, onDone);
    } else if (r.kind === "incastro") {
      mountIncastro(el, r, onDone);
    } else if (r.kind === "memory") {
      mountMemory(el, r, onDone);
    } else if (r.kind === "palloncino") {
      mountPalloncini(el, r, onDone);
    } else if (r.kind === "pesca") {
      mountPesca(el, r, onDone);
    } else if (r.kind === "talpa") {
      mountTalpe(el, r, onDone);
    } else if (r.kind === "vf") {
      mountVF(el, r, onDone);
    } else if (r.kind === "lettere") {
      mountLettere(el, r, onDone);
    } else if (r.kind === "intruso") {
      mountIntruso(el, r, onDone);
    } else if (r.kind === "fila") {
      mountFila(el, r, onDone);
    } else if (r.kind === "impiccato") {
      mountImpiccato(el, r, onDone);
    } else if (r.kind === "taglia") {
      mountTaglia(el, r, onDone);
    } else if (r.kind === "linee") {
      mountLinee(el, r, onDone);
    }
  }

  return { pick: pickRound, mount, stop, setTap, setBoom, setAvatar, setSpeak, isTrue, calc };
})();
