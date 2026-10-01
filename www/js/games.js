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
    const gen = () => {
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
      { prompt: "Collega ogni verbo inglese al suo significato.", pairs: [["to eat", "mangiare"], ["to drink", "bere"], ["to sleep", "dormire"], ["to run", "correre"], ["to read", "leggere"], ["to write", "scrivere"], ["to open", "aprire"]] }
    ],
    C: [
      { prompt: "Collega ogni parola inglese al suo contrario.", pairs: [["hot", "cold"], ["early", "late"], ["easy", "difficult"], ["rich", "poor"], ["strong", "weak"], ["safe", "dangerous"]] },
      { prompt: "Collega ogni verbo irregolare al suo passato.", pairs: [["go", "went"], ["see", "saw"], ["eat", "ate"], ["buy", "bought"], ["take", "took"], ["write", "wrote"], ["have", "had"]] },
      { prompt: "Collega ogni parola inglese al suo significato.", pairs: [["although", "anche se"], ["however", "tuttavia"], ["because", "perché"], ["always", "sempre"], ["never", "mai"], ["together", "insieme"]] }
    ]
  };

  function makeIncastro(classId, subjectId) {
    let prompt, pairs;
    if (subjectId === "matematica") {
      pairs = mathPairs(classId);
      prompt = classId >= 7 ? "Collega ogni equazione alla sua soluzione." : "Collega ogni operazione al suo risultato.";
    } else if (subjectId === "inglese") {
      const theme = pick(ENG_PAIRS[classId <= 1 ? "A" : classId <= 4 ? "B" : "C"]);
      pairs = shuffle(theme.pairs).slice(0, 4).map(p => ({ l: p[0], r: p[1] }));
      prompt = theme.prompt;
    } else {
      const theme = pick(ITA_PAIRS[classId <= 1 ? "A" : classId <= 4 ? "B" : "C"]);
      pairs = shuffle(theme.pairs).slice(0, 4).map(p => ({ l: p[0], r: p[1] }));
      prompt = theme.prompt;
    }
    if (pairs.length < 3) return null;
    let order = shuffle(pairs.map((_, i) => i)), g = 0;
    while (order.every((v, i) => v === i) && g++ < 20) order = shuffle(order);
    return { kind: "incastro", title: "Incastro", prompt, hint: "Trascina ogni pezzo al suo posto, oppure toccalo e poi tocca il posto.", pairs, order,
      solution: pairs.map(p => `${p.l} → ${p.r}`).join(" · ") };
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
          const ok = mistakes <= 1;
          onDone(ok, r.solution, ok ? (mistakes === 0 ? "Tutto incastrato al primo colpo!" : "Incastrato!") : `Hai sbagliato ${mistakes} volte.`);
        }
      } else {
        mistakes++; clearSel();
        const d = drops[s];
        d.classList.add("nope"); pc.classList.add("nope");
        setTimeout(() => { d.classList.remove("nope"); pc.classList.remove("nope"); }, 450);
      }
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
  // SCELTA E COLLEGAMENTO CON L'APP
  // ====================================================================
  const GAMES = {
    frase:      { subjects: ["italiano"], make: c => makeFrase(c) },
    operazione: { subjects: ["matematica"], make: c => makeOperazione(c) },
    bersaglio:  { subjects: ["italiano", "matematica"], make: (c, s) => makeBersaglio(c, s) },
    corsa:      { subjects: ["italiano", "matematica"], make: (c, s) => makeCorsa(c, s) },
    incastro:   { subjects: ["italiano", "matematica", "inglese"], make: (c, s) => makeIncastro(c, s) }
  };

  // Un giro di gioco per la materia e la classe, oppure null (allora si fa una domanda normale).
  // share = quota di giri che sono giochi (0..1); lastKind = gioco precedente, per non ripeterlo.
  function pickRound(subjectId, classId, lastKind, share) {
    if (Math.random() >= share) return null;
    const kinds = Object.keys(GAMES).filter(k => GAMES[k].subjects.includes(subjectId) && k !== lastKind);
    if (!kinds.length) return null;
    return GAMES[pick(kinds)].make(classId, subjectId);
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
    }
  }

  return { pick: pickRound, mount, stop, setTap, setAvatar, isTrue, calc };
})();
