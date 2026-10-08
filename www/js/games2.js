// ===== Giochi in più (4ª elementare in su): stile «gioco» scuro =====
// Ogni gioco si registra in Games con make() (crea il giro) e mount() (lo mostra).
// A fine giro chiama onDone(ok, rispostaGiusta, spiegazione, errori): due errori si perdonano, al terzo si perde.
(() => {
  const H = Games.internals, { esc, shuffle, pick, rnd } = H;
  const tap = () => H.tap(), boom = () => H.boom();
  const ALL = ["italiano", "matematica", "inglese", "storia", "geografia", "scienze", "tecnologia", "arte", "musica", "civica", "lingua2", "latino"];
  const MIN_CLASS = 3;   // 4ª elementare in su
  const Q = (s, c) => (typeof Questions !== "undefined" ? Questions.next(s, c) : null);
  const goodQ = q => q && Array.isArray(q.a) && q.a.length >= 2 && q.q && q.q.length < 150;
  const seq = (s, c, n) => {
    const out = [], seen = new Set();
    for (let g = 0; out.length < n && g < 60; g++) { const q = Q(s, c); if (goodQ(q) && !seen.has(q.q)) { seen.add(q.q); out.push(q); } }
    return out.length === n ? out : null;
  };
  const pips = m => `<div class="g2-pips" aria-label="Errori perdonati">${[0, 1, 2].map(i => `<i class="${i < 3 - m ? "" : "x"}"></i>`).join("")}</div>`;
  const alive = el => el && el.isConnected;
  const fsz = t => (t.length > 26 ? 13 : t.length > 16 ? 15 : t.length > 9 ? 17 : 20);
  const base = (kind, title, prompt, hint, speech, q0, extra) => Object.assign({ kind, title, prompt, hint, speechIntro: speech, q0 }, extra);
  const reg = (kind, subjects, make, mount) => Games.register(kind, { subjects, make: (c, s) => (c < MIN_CLASS ? null : make(c, s)), mount });

  // ---------------------------------------------------------------- CASSAFORTE (matematica)
  reg("cassaforte", ["matematica"], (c, s) => {
    for (let i = 0; i < 12; i++) {
      const q = Q("matematica", c);
      if (!goodQ(q)) continue;
      const a = String(q.a[q.c]).trim();
      if (/^\d{1,3}$/.test(a)) return base("cassaforte", "Cassaforte", q.q, "Gira le cifre e prova il codice. Due tentativi sbagliati si perdonano, al terzo la cassaforte si blocca.", "Cassaforte. Componi il codice con le cifre. La domanda è:", q, { code: a, expl: q.e || "" });
    }
    return null;
  }, (el, r, onDone) => {
    const n = r.code.length, cur = Array(n).fill(0); let m = 0, done = false, state = [];
    function draw() {
      el.innerHTML = `<div class="g2 g2-safe">${pips(m)}<div class="g2-dials">${cur.map((v, i) => `<div class="g2-dial ${state[i] || ""}"><button data-i="${i}" data-d="1" aria-label="Più">▲</button><b>${v}</b><button data-i="${i}" data-d="-1" aria-label="Meno">▼</button></div>`).join("")}</div>
        <div class="g2-legend">${state.length ? "Verde = cifra giusta · Rosso = sbagliata" : "Componi il codice con le frecce"}</div><button class="g2-go" data-go="1" ${done ? "disabled" : ""}>Prova il codice</button></div>`;
    }
    el.onclick = e => {
      if (done) return;
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.go) {
        state = cur.map((v, i) => (String(v) === r.code[i] ? "ok" : "ko"));
        if (state.every(x => x === "ok")) { done = true; draw(); tap(); onDone(true, r.code, r.expl, m); return; }
        m++; boom();
        if (m >= 3) { done = true; draw(); onDone(false, r.code, r.expl, 3); return; }
        draw(); return;
      }
      const i = +b.dataset.i; cur[i] = (cur[i] + +b.dataset.d + 10) % 10; state = []; tap(); draw();
    };
    draw();
  });

  // ---------------------------------------------------------------- RADAR
  const RPOS = [[26, 26], [74, 30], [28, 72], [72, 74], [50, 50]];
  reg("radar", ALL, (c, s) => {
    const q = Q(s, c); if (!goodQ(q) || q.a.length > 5) return null;
    return base("radar", "Radar", q.q, "Il radar scansiona: tocca il segnale con la risposta giusta. Due errori si perdonano.", "Radar. Tocca il segnale con la risposta giusta. La domanda è:", q, { opts: q.a, c: q.c, expl: q.e || "" });
  }, (el, r, onDone) => {
    let m = 0, done = false;
    const order = shuffle(r.opts.map((_, i) => i));
    el.innerHTML = `<div class="g2 g2-radar">${pips(0)}<div class="g2-rd"><div class="g2-sweep"></div>${order.map((o, k) => `<button class="g2-blip" data-i="${o}" style="left:${RPOS[k][0]}%;top:${RPOS[k][1]}%;font-size:${fsz(r.opts[o])}px">${esc(r.opts[o])}</button>`).join("")}</div><div class="g2-legend">Tocca il segnale giusto</div></div>`;
    el.onclick = e => {
      const b = e.target.closest(".g2-blip"); if (!b || done || b.classList.contains("ko")) return;
      const i = +b.dataset.i;
      if (i === r.c) { done = true; b.classList.add("ok"); tap(); onDone(true, r.opts[r.c], r.expl, m); return; }
      b.classList.add("ko"); m++; boom(); el.querySelector(".g2-pips").outerHTML = pips(m);
      if (m >= 3) { done = true; el.querySelectorAll(".g2-blip")[order.indexOf(r.c)].classList.add("ok"); onDone(false, r.opts[r.c], r.expl, 3); }
    };
  });

  // ---------------------------------------------------------------- PONTE DI VETRO
  reg("ponte", ALL, (c, s) => {
    const qs = seq(s, c, 4); if (!qs) return null;
    const rows = qs.map(q => ({ q: q.q, en: q.en, good: q.a[q.c], opts: shuffle([q.a[q.c], pick(q.a.filter((_, i) => i !== q.c))]), expl: q.e || "" }));
    return base("ponte", "Ponte di vetro", "Attraversa il ponte: a ogni passo scegli la lastra giusta.", "A ogni passo c'è una domanda e due lastre: una regge, l'altra si rompe. Due errori si perdonano.", "Ponte di vetro. A ogni passo scegli la lastra giusta. Prima domanda:", qs[0], { rows, expl: "" });
  }, (el, r, onDone) => {
    const R = r.rows; let cur = 0, m = 0, done = false;
    function draw() {
      el.innerHTML = `<div class="g2 g2-bridge">${pips(m)}<div class="g2-bq">${esc(R[cur] ? R[cur].q : "Ponte completato!")}</div><div class="g2-brs">${R.map((row, i) => `<div class="g2-br ${i < cur ? "done" : i === cur ? "cur" : ""}"><span>${i + 1}</span>${row.opts.map((t, k) => `<button class="g2-tile ${row.hit && row.hit[k] ? row.hit[k] : ""}" data-r="${i}" data-k="${k}" style="font-size:${fsz(t)}px">${esc(t)}</button>`).join("")}</div>`).join("")}</div></div>`;
    }
    el.onclick = e => {
      if (done) return;
      const b = e.target.closest(".g2-tile"); if (!b || +b.dataset.r !== cur) return;
      const row = R[cur], k = +b.dataset.k; row.hit = row.hit || {};
      if (row.hit[k]) return;
      if (row.opts[k] === row.good) { row.hit[k] = "ok"; tap(); cur++; if (cur >= R.length) { done = true; draw(); onDone(true, "", "Ponte attraversato!", m); return; } draw(); return; }
      row.hit[k] = "ko"; m++; boom();
      if (m >= 3) { done = true; row.hit[row.opts.indexOf(row.good)] = "ok"; draw(); onDone(false, row.good, row.expl, 3); return; }
      draw();
    };
    draw();
  });

  // ---------------------------------------------------------------- DUELLO
  const RIVALS = ["Bot Rex", "Bot Nova", "Bot Zed", "Bot Luna"];
  reg("duello", ALL, (c, s) => {
    const qs = seq(s, c, 5); if (!qs) return null;
    return base("duello", "Duello", "Sfida il bot: ogni risposta giusta lo colpisce, ogni errore colpisce te.", "Servono tre risposte giuste per battere il bot. Se sbagli tre volte, vince lui.", "Duello contro il bot. Tre risposte giuste lo battono. Prima domanda:", qs[0], { qs, rival: pick(RIVALS) });
  }, (el, r, onDone) => {
    const Qs = r.qs; let n = 0, hit = 0, m = 0, done = false, T = 0, busy = false;
    function draw() {
      const q = Qs[n];
      el.innerHTML = `<div class="g2 g2-duel"><div class="g2-fgt"><div class="g2-fi"><div class="g2-nm"><span>Tu</span></div><div class="g2-hp"><b style="width:${100 - m * 34}%"></b></div></div><div class="g2-vs">VS</div><div class="g2-fi"><div class="g2-nm"><span>${esc(r.rival)}</span></div><div class="g2-hp foe"><b style="width:${100 - hit * 34}%"></b></div></div></div>
        <div class="g2-tm"><b id="g2tm"></b></div><div class="g2-dq">${esc(q.q)}</div>${q.a.map((t, i) => `<button class="g2-ans" data-i="${i}"><em>${"ABCDE"[i]}</em><span style="font-size:${fsz(t) - 2}px">${esc(t)}</span></button>`).join("")}</div>`;
      const tm = el.querySelector("#g2tm"); tm.style.transition = "none"; tm.style.width = "100%";
      requestAnimationFrame(() => requestAnimationFrame(() => { if (alive(el)) { tm.style.transition = "width 14s linear"; tm.style.width = "0%"; } }));
      clearTimeout(T); T = setTimeout(() => { if (alive(el) && !busy && !done) pickAns(-1); }, 14000);
    }
    function pickAns(i) {
      if (busy || done) return; busy = true; clearTimeout(T);
      const q = Qs[n], ok = i === q.c;
      el.querySelectorAll(".g2-ans").forEach((b, k) => { if (k === q.c) b.classList.add("ok"); else if (k === i) b.classList.add("ko"); });
      if (ok) { hit++; tap(); } else { m++; boom(); }
      const hb = el.querySelectorAll(".g2-hp b"); hb[0].style.width = 100 - m * 34 + "%"; hb[1].style.width = 100 - hit * 34 + "%";
      if (hit >= 3) { done = true; setTimeout(() => alive(el) && onDone(true, "", "Hai battuto " + r.rival + "!", m), 700); return; }
      if (m >= 3) { done = true; setTimeout(() => alive(el) && onDone(false, q.a[q.c], q.e || "", 3), 700); return; }
      setTimeout(() => { if (!alive(el)) return; n++; busy = false; draw(); }, 1000);
    }
    el.onclick = e => { const b = e.target.closest(".g2-ans"); if (b) pickAns(+b.dataset.i); };
    draw();
  });

  // ---------------------------------------------------------------- DISINNESCA
  const WIRES = ["#4da3ff", "#ffd23f", "#ff5c8a", "#8CF59E", "#c79bff"];
  reg("disinnesca", ALL, (c, s) => {
    const q = Q(s, c); if (!goodQ(q) || q.a.length > 5) return null;
    return base("disinnesca", "Disinnesca la bomba", q.q, "Taglia il filo con la risposta giusta prima che scada il tempo. Ogni errore costa 5 secondi, al terzo la bomba esplode.", "Disinnesca la bomba. Taglia il filo con la risposta giusta. La domanda è:", q, { opts: q.a, c: q.c, expl: q.e || "" });
  }, (el, r, onDone) => {
    let t = 30, m = 0, done = false, iv = 0; const cut = {};
    function draw() {
      el.innerHTML = `<div class="g2 g2-bomb">${pips(m)}<div class="g2-bb"><small>Tempo alla detonazione</small><div class="g2-bt">00:${String(Math.max(t, 0)).padStart(2, "0")}</div></div><div class="g2-wires">${r.opts.map((o, i) => `<button class="g2-wire ${cut[i] ? "cut " + cut[i] : ""}" data-i="${i}" style="--w:${WIRES[i % 5]}"><span style="font-size:${fsz(o) - 1}px">${esc(o)}</span><i></i></button>`).join("")}</div></div>`;
    }
    function end(ok) { done = true; clearInterval(iv); cut[r.c] = "ok"; draw(); onDone(ok, r.opts[r.c], r.expl, ok ? m : 3); }
    iv = setInterval(() => { if (!alive(el) || done) return clearInterval(iv); t--; if (t <= 0) { t = 0; boom(); end(false); return; } el.querySelector(".g2-bt").textContent = "00:" + String(t).padStart(2, "0"); }, 1000);
    el.onclick = e => {
      const b = e.target.closest(".g2-wire"); if (!b || done) return; const i = +b.dataset.i; if (cut[i]) return;
      if (i === r.c) { tap(); end(true); return; }
      cut[i] = "ko"; m++; t -= 5; boom();
      if (m >= 3 || t <= 0) { end(false); return; }
      draw();
    };
    draw();
  });

  // ---------------------------------------------------------------- RITMO (carte da Smista nelle scatole)
  reg("ritmo", ALL, (c, s) => {
    const g = H.makeScatole(c, s); if (!g) return null;
    const T = rnd(0, 1), lab = g.labels[T], notes = g.items.map(it => ({ t: it.t, good: it.b === T }));
    if (notes.filter(x => x.good).length < 2) return null;
    return base("ritmo", "Ritmo", `Colpisci solo: «${lab}».`, "Le note scendono: tocca la corsia quando la nota giusta arriva sulla linea. Lascia passare le altre. Due errori si perdonano.", "Ritmo. Tocca la corsia quando arriva una nota giusta, lascia passare le altre. Devi colpire:", null, { notes: shuffle(notes), lab });
  }, (el, r, onDone) => {
    let m = 0, done = false, k = 0, last = 0, wait = 0; const live = [];
    el.innerHTML = `<div class="g2 g2-rit">${pips(0)}<div class="g2-lanes">${[0, 1, 2].map(i => `<div class="g2-lane" data-l="${i}"><div class="g2-zone"></div></div>`).join("")}</div><div class="g2-pads">${[0, 1, 2].map(i => `<button class="g2-pad" data-l="${i}">TOCCA</button>`).join("")}</div></div>`;
    const lanes = [...el.querySelectorAll(".g2-lane")], pp = () => el.querySelector(".g2-pips");
    const H0 = () => lanes[0].clientHeight || 300, ZB = 10, ZH = 56, NH = 42;
    const mistake = why => { m++; boom(); pp().outerHTML = pips(m); if (m >= 3) finish(false); };
    function finish(ok) { if (done) return; done = true; onDone(ok, ok ? "" : r.lab, ok ? "Che ritmo!" : "", ok ? m : 3); }
    function frame(ts) {
      if (done || !alive(el)) return;
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
      wait -= dt;
      if (k < r.notes.length && wait <= 0) {
        const nt = r.notes[k++], l = rnd(0, 2), e = document.createElement("div");
        e.className = "g2-note"; e.style.fontSize = fsz(nt.t) - 3 + "px"; e.textContent = nt.t; e.style.top = -NH + "px"; lanes[l].appendChild(e);
        live.push({ e, y: -NH, l, nt }); wait = 1.25;
      }
      const h = H0();
      for (let i = live.length - 1; i >= 0; i--) {
        const n = live[i]; n.y += 150 * dt; n.e.style.top = n.y + "px";
        if (n.y > h) { n.e.remove(); live.splice(i, 1); if (n.nt.good) mistake("perso"); }
      }
      if (!done && k >= r.notes.length && !live.length) { finish(true); return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    el.onpointerdown = e => {
      const b = e.target.closest(".g2-pad"); if (!b || done) return; e.preventDefault();
      const l = +b.dataset.l, h = H0(), top = h - ZB - ZH - 18, bot = h - ZB + 4;
      const c = live.filter(n => n.l === l && n.y + NH > top && n.y < bot).sort((a, b2) => b2.y - a.y)[0];
      if (!c) return;
      c.e.classList.add(c.nt.good ? "ok" : "ko"); const ee = c.e; setTimeout(() => ee.remove(), 220); live.splice(live.indexOf(c), 1);
      if (c.nt.good) tap(); else mistake("sbagliata");
    };
  });

  // ---------------------------------------------------------------- SLOT FRASI (banca scritta a mano)
  const SLOT = {
    inglese: [
      ["Frase al presente semplice", "My brother", [["plays", "play", "playing"], ["football", "the football", "a football"], ["every Sunday", "yesterday", "last week"]]],
      ["Frase al passato semplice", "Yesterday I", [["go", "went", "goed"], ["to the cinema", "cinema", "at cinema"], ["with my friends", "with me friends", "of my friends"]]],
      ["Frase al futuro con «will»", "Tomorrow it", [["will rain", "rains", "rained"], ["in London", "at London", "on London"], ["all day", "all the day", "whole day"]]],
      ["Frase con il present perfect", "I", [["have seen", "has seen", "am seeing"], ["this film", "these film", "this films"], ["three times", "three time", "since three times"]]],
      ["Frase con il comparativo", "This bag", [["is more cheaper", "is cheaper", "is cheap"], ["than", "then", "that"], ["the red one", "red one the", "the one red"]]],
      ["Frase al presente continuo", "Right now they", [["are watching", "watch", "is watching"], ["a film", "film a", "the films a"], ["on TV", "in TV", "at TV"]]],
      ["Frase con «there is»", "There", [["is", "are", "be"], ["a big park", "big a park", "park big"], ["near my house", "near of my house", "near to house my"]]],
      ["Frase al passato semplice (verbo irregolare)", "Last summer we", [["swam", "swimmed", "swim"], ["in the sea", "in sea", "at the sea in"], ["every day", "each days", "everyday"]]]
    ],
    italiano: [
      ["Frase al congiuntivo", "Penso che Marco", [["sia", "è", "fosse"], ["già arrivato", "già arrivati", "già arrivando"], ["a casa", "in a casa", "di casa"]]],
      ["Frase al futuro", "Domani", [["andremo", "andiamo ieri", "andammo"], ["a Roma", "in Roma", "da Roma a"], ["in treno", "con il treno su", "per treno su"]]],
      ["Frase al passato prossimo", "Ieri Lucia", [["ha mangiato", "mangiava ora", "è mangiata"], ["una pizza", "un pizza", "uno pizza"], ["con le amiche", "con le amici", "da le amiche"]]],
      ["Frase con l'apostrofo giusto", "", [["Un'amica", "Un amica", "Una amica"], ["è arrivata", "sono arrivata", "è arrivato"], ["alla stazione", "a la stazione", "nella stazione a"]]],
      ["Frase con il periodo ipotetico", "Se studiassi di più", [["prenderesti", "prendi", "prenderai"], ["voti migliori", "voti migliore", "voto migliori"], ["a scuola", "di scuola a", "in scuola"]]],
      ["Frase con «sebbene»", "Sebbene", [["piova", "piove", "pioverà"], ["usciremo", "usciamo ieri", "uscivamo"], ["lo stesso", "stesso lo", "il stesso"]]],
      ["Frase con l'accordo giusto", "Le mie sorelle sono", [["molto", "moltissimi", "tanti"], ["simpatiche", "simpatici", "simpatica"], ["e gentili", "e gentile", "e gentilo"]]],
      ["Frase con il pronome relativo", "Il libro", [["che ho letto", "che ho letta", "chi ho letto"], ["era molto", "erano molto", "era molte"], ["interessante", "interessanti", "interessantissime"]]]
    ]
  };
  let lastSlot = -1;
  reg("slot", ["inglese", "italiano"], (c, s) => {
    const bank = SLOT[s]; if (!bank) return null;
    let i; do { i = rnd(0, bank.length - 1); } while (i === lastSlot && bank.length > 1); lastSlot = i;
    const [rule, fixed, reels] = bank[i];
    const eng = s === "inglese";
    return base("slot", "Slot frasi", `${rule}: ferma i rulli sulle parole giuste.`, "Tocca un rullo per girarlo, poi controlla la frase. Due controlli sbagliati si perdonano.", "Slot frasi. " + rule + ". Ferma i rulli sulle parole giuste.", null, { rule, fixed, reels, eng });
  }, (el, r, onDone) => {
    const pos = r.reels.map(() => 0); let m = 0, done = false, state = [];
    const correct = r.reels.map(x => x[0]);   // la prima voce di ogni rullo è quella giusta (si mescola solo la posizione di partenza)
    const order = r.reels.map(x => shuffle(x.map((_, i) => i)));
    order.forEach((o, i) => { pos[i] = rnd(0, 2); });
    const txt = () => (r.fixed ? r.fixed + " " : "") + correct.join(" ") + ".";
    function draw() {
      el.innerHTML = `<div class="g2 g2-slot">${pips(m)}${r.fixed ? `<div class="g2-fix">${esc(r.fixed)} …</div>` : ""}<div class="g2-reels">${r.reels.map((rl, i) => {
        const L = order[i].length, o = order[i];
        return `<button class="g2-reel ${state[i] || ""}" data-i="${i}">${[-1, 0, 1].map(d => `<div class="${d ? "" : "c"}">${esc(rl[o[(pos[i] + d + L) % L]])}</div>`).join("")}</button>`;
      }).join("")}</div><div class="g2-legend">Tocca un rullo per girarlo</div><button class="g2-go" data-go="1" ${done ? "disabled" : ""}>Controlla la frase</button></div>`;
    }
    el.onclick = e => {
      if (done) return;
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.go) {
        state = r.reels.map((rl, i) => (rl[order[i][pos[i]]] === correct[i] ? "ok" : "ko"));
        if (state.every(x => x === "ok")) { done = true; draw(); tap(); onDone(true, txt(), "", m); return; }
        m++; boom();
        if (m >= 3) { done = true; draw(); onDone(false, txt(), "", 3); return; }
        draw(); return;
      }
      const i = +b.dataset.i; pos[i] = (pos[i] + 1) % order[i].length; state = []; tap(); draw();
    };
    draw();
  });

  // ---------------------------------------------------------------- SWIPE (carte da Smista nelle scatole)
  reg("swipe", ALL, (c, s) => {
    const g = H.makeScatole(c, s); if (!g) return null;
    return base("swipe", "Swipe", `Trascina ogni carta: «${g.labels[0]}» a sinistra, «${g.labels[1]}» a destra.`, "Trascina la carta a sinistra o a destra, oppure usa i due pulsanti. Due errori si perdonano.", `Swipe. Sinistra: ${g.labels[0]}. Destra: ${g.labels[1]}. Prima carta:`, null, { items: g.items, labels: g.labels });
  }, (el, r, onDone) => {
    const I = r.items, L = r.labels; let n = 0, m = 0, done = false, busy = false;
    el.innerHTML = `<div class="g2 g2-swipe">${pips(0)}<div class="g2-sl"><span style="color:#59D7FF">← ${esc(L[0])}</span><span style="color:#FFC94A">${esc(L[1])} →</span></div><div class="g2-stack"></div><div class="g2-swb"><button data-s="0">← ${esc(L[0])}</button><button data-s="1">${esc(L[1])} →</button></div></div>`;
    const stk = el.querySelector(".g2-stack");
    function build() {
      stk.innerHTML = "";
      for (let k = Math.min(2, I.length - n - 1); k >= 0; k--) { const d = document.createElement("div"); d.className = "g2-card" + (k ? " b" + k : ""); d.style.fontSize = fsz(I[n + k].t) + 12 + "px"; d.textContent = I[n + k].t; stk.appendChild(d); }
      const top = stk.lastElementChild; if (!top) return;
      let sx = null, dx = 0;
      top.onpointerdown = e => { if (busy || done) return; sx = e.clientX; try { top.setPointerCapture(e.pointerId); } catch (x) {} };
      top.onpointermove = e => { if (sx == null) return; dx = e.clientX - sx; top.style.transform = `translateX(${dx}px) rotate(${dx / 14}deg)`; top.style.borderColor = dx > 40 ? "#FFC94A" : dx < -40 ? "#59D7FF" : ""; };
      top.onpointerup = () => { if (sx == null) return; sx = null; if (Math.abs(dx) > 90) decide(dx > 0 ? 1 : 0); else { top.style.transform = ""; top.style.borderColor = ""; } dx = 0; };
    }
    function decide(side) {
      if (busy || done) return; const top = stk.lastElementChild; if (!top) return; busy = true;
      const ok = side === I[n].b;
      top.style.transition = "transform .25s,opacity .25s"; top.style.transform = `translateX(${side ? 360 : -360}px) rotate(${side ? 20 : -20}deg)`; top.style.opacity = "0"; top.style.borderColor = ok ? "#8CF59E" : "#FF5C8A";
      if (ok) tap(); else { m++; boom(); el.querySelector(".g2-pips").outerHTML = pips(m); }
      setTimeout(() => {
        if (!alive(el)) return; n++; busy = false;
        if (m >= 3) { done = true; onDone(false, "", "", 3); return; }
        if (n >= I.length) { done = true; onDone(true, "", "Tutte le carte al posto giusto!", m); return; }
        build();
      }, 270);
    }
    el.onclick = e => { const b = e.target.closest(".g2-swb button"); if (b) decide(+b.dataset.s); };
    build();
  });

  // ---------------------------------------------------------------- PIOGGIA DI LETTERE (parole da Salva l'omino)
  reg("pioggia", ALL, (c, s) => {
    const g = H.makeImpiccato(c, s); if (!g) return null;
    const w = String(g.clue.r).toUpperCase(); if (!/^[A-Z0-9ÀÈÉÌÒÙ]+$/.test(w) || w.length < 3 || w.length > 9) return null;
    return base("pioggia", "Pioggia di lettere", g.ask.text, "Le lettere cadono: tocca quelle che compongono la parola, nell'ordine giusto. Due errori si perdonano.", "Pioggia di lettere. Cattura le lettere nell'ordine giusto. " , null, { word: w, show: String(g.clue.r), eng: g.eng, rEn: g.rEn });
  }, (el, r, onDone) => {
    const W = r.word; let i = 0, m = 0, done = false, last = 0, wait = 0; const live = [];
    const ALPHA = "ABCDEFGHILMNOPRSTUVZ";
    el.innerHTML = `<div class="g2 g2-rain">${pips(0)}<div class="g2-rn"><div class="g2-word">${[...W].map(() => "<i></i>").join("")}</div></div></div>`;
    const R = el.querySelector(".g2-rn"), slots = () => [...el.querySelectorAll(".g2-word i")];
    function frame(ts) {
      if (done || !alive(el)) return;
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts; wait -= dt;
      if (wait <= 0) {
        const need = W[i], ch = Math.random() < 0.5 ? need : (Math.random() < 0.3 ? W[rnd(0, W.length - 1)] : ALHA());
        const e = document.createElement("div"); e.className = "g2-lt"; e.textContent = ch; e.style.left = Math.random() * Math.max(0, R.clientWidth - 54) + "px"; e.style.top = "-54px"; R.appendChild(e);
        live.push({ e, y: -54, ch }); wait = 0.62;
      }
      for (let k = live.length - 1; k >= 0; k--) { const n = live[k]; n.y += 125 * dt; n.e.style.top = n.y + "px"; if (n.y > R.clientHeight) { n.e.remove(); live.splice(k, 1); } }
      requestAnimationFrame(frame);
    }
    function ALHA() { return ALPHA[rnd(0, ALPHA.length - 1)]; }
    requestAnimationFrame(frame);
    R.onpointerdown = e => {
      const t = e.target.closest(".g2-lt"); if (!t || done) return; e.preventDefault();
      const k = live.findIndex(n => n.e === t); if (k < 0) return; const n = live[k]; live.splice(k, 1);
      if (n.ch === W[i]) { t.classList.add("ok"); slots()[i].textContent = n.ch; i++; tap(); setTimeout(() => t.remove(), 160); if (i >= W.length) { done = true; setTimeout(() => alive(el) && onDone(true, r.show, "", m), 450); } }
      else { t.classList.add("ko"); setTimeout(() => t.remove(), 160); m++; boom(); el.querySelector(".g2-pips").outerHTML = pips(m); if (m >= 3) { done = true; slots().forEach((s2, q) => { if (q >= i) { s2.textContent = W[q]; s2.classList.add("miss"); } }); onDone(false, r.show, "", 3); } }
    };
  });

  // ---------------------------------------------------------------- CAMPO DEI MULTIPLI (matematica)
  const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  reg("campo", ["matematica"], (c, s) => {
    let title, label, test, pool;
    if (c >= 5 && Math.random() < 0.4) { label = "numeri primi"; test = isPrime; pool = [2, 100]; title = "Trova tutti i numeri primi"; }
    else { const N = c <= 3 ? rnd(2, 6) : c <= 5 ? rnd(3, 9) : rnd(4, 12); label = "multipli di " + N; test = v => v % N === 0; pool = [N, N * 12]; title = "Trova tutti i multipli di " + N; }
    const yes = new Set(), no = new Set(); let g = 0;
    while ((yes.size < 5 || no.size < 11) && g++ < 600) { const v = rnd(pool[0], pool[1]); if (test(v)) { if (yes.size < 5) yes.add(v); } else if (no.size < 11) no.add(v); }
    if (yes.size < 4 || no.size < 8) return null;
    const cells = shuffle([...[...yes].slice(0, 4), ...[...no].slice(0, 12 - 4)]);
    return base("campo", "Campo dei numeri", title + " nella griglia.", "Tocca solo i numeri giusti. Due errori si perdonano, al terzo si perde.", title + " nella griglia.", null, { cells, test: cells.map(test), label });
  }, (el, r, onDone) => {
    let m = 0, done = false, found = 0; const need = r.test.filter(Boolean).length, mark = {};
    function draw() { el.innerHTML = `<div class="g2 g2-field">${pips(m)}<div class="g2-legend">Ne restano ${need - found}</div><div class="g2-mf">${r.cells.map((v, i) => `<button class="g2-mc ${mark[i] || ""}" data-i="${i}">${v}</button>`).join("")}</div></div>`; }
    el.onclick = e => {
      const b = e.target.closest(".g2-mc"); if (!b || done) return; const i = +b.dataset.i; if (mark[i]) return;
      if (r.test[i]) { mark[i] = "ok"; found++; tap(); if (found >= need) { done = true; draw(); onDone(true, "", "Trovati tutti!", m); return; } }
      else { mark[i] = "ko"; m++; boom(); if (m >= 3) { done = true; r.test.forEach((t, k) => { if (t && !mark[k]) mark[k] = "ok"; }); draw(); onDone(false, "", "", 3); return; } }
      draw();
    };
    draw();
  });

  // ---------------------------------------------------------------- BILANCIA (matematica)
  reg("bilancia", ["matematica"], (c, s) => {
    let a, x, tot, expr;
    const t = Math.random();
    if (c >= 5 && t < 0.35) { a = rnd(2, 9); x = rnd(3, 12); tot = a * x; expr = `${a} × ? = ${tot}`; }
    else if (c >= 4 && t < 0.6) { x = rnd(4, 30); a = x + rnd(5, 40); tot = a; expr = `${a} − ? = ${a - x}`; tot = a - x; a = a; return finishBil(expr, x, a, "sub", tot); }
    else { a = rnd(6, c <= 3 ? 40 : 90); x = rnd(4, c <= 3 ? 40 : 80); tot = a + x; expr = `${a} + ? = ${tot}`; return finishBil(expr, x, a, "add", tot); }
    return finishBil(expr, x, a, "mul", tot);
    function finishBil(expr2, x2, a2, op, total) {
      const wrong = new Set(); let g = 0;
      while (wrong.size < 3 && g++ < 60) { const d = pick([-10, -2, -1, 1, 2, 10, rnd(3, 9) * (Math.random() < 0.5 ? -1 : 1)]); const w = x2 + d; if (w > 0 && w !== x2) wrong.add(w); }
      if (wrong.size < 3) return null;
      return base("bilancia", "Bilancia", `Equilibra la bilancia: ${expr2}`, "Scegli il numero che manca: la bilancia si inclina finché non è in equilibrio. Due errori si perdonano.", `Bilancia. Equilibra la bilancia: ${expr2.replace("?", "quanto")}.`, null, { a: a2, op, total, x: x2, chips: shuffle([x2, ...wrong]), expr: expr2 });
    }
  }, (el, r, onDone) => {
    let w = null, m = 0, done = false; const sym = { add: "+", sub: "−", mul: "×" }[r.op];
    const val = v => (r.op === "add" ? r.a + v : r.op === "sub" ? r.a - v : r.a * v), target = r.total;
    function draw() {
      const L = w == null ? 0 : val(w), d = w == null ? 0 : Math.max(-14, Math.min(14, (target - L) * (r.op === "mul" ? 0.25 : 0.5))), dy = d * 2.2;
      el.innerHTML = `<div class="g2 g2-bil">${pips(m)}<div class="g2-beamw"><div class="g2-post"></div><div class="g2-beam" style="transform:rotate(${d}deg)"></div>
        <div class="g2-pan" style="left:4px;top:${62 - dy}px"><div class="w">${r.a} ${sym} ${w == null ? "?" : w}</div><div class="tray"></div></div><div class="g2-pan" style="right:4px;top:${62 + dy}px"><div class="w">${target}</div><div class="tray"></div></div></div>
        <div class="g2-legend">Quale numero mette in equilibrio?</div><div class="g2-chips">${r.chips.map(c => `<button class="g2-chip ${w === c ? (done ? "ok" : "ko") : ""}" data-c="${c}">${c}</button>`).join("")}</div></div>`;
    }
    el.onclick = e => {
      const b = e.target.closest(".g2-chip"); if (!b || done) return; w = +b.dataset.c;
      if (w === r.x) { done = true; draw(); tap(); onDone(true, String(r.x), "", m); return; }
      m++; boom();
      if (m >= 3) { done = true; draw(); onDone(false, String(r.x), "", 3); return; }
      draw();
    };
    draw();
  });

  // ---------------------------------------------------------------- TERMINALE
  reg("terminale", ALL, (c, s) => {
    const qs = seq(s, c, 3); if (!qs) return null;
    return base("terminale", "Terminale", "Decifra il codice: tre missioni, una risposta giusta per ognuna.", "Scegli la risposta giusta per ogni missione. Due errori si perdonano, al terzo il sistema si blocca.", "Terminale. Tre missioni. Prima missione:", qs[0], { qs });
  }, (el, r, onDone) => {
    const Qs = r.qs; let n = 0, m = 0, done = false, busy = false, typed = 0, tv = 0;
    function draw() {
      const q = Qs[n];
      el.innerHTML = `<div class="g2 g2-term">${pips(m)}<div class="g2-tt"><div class="mu">// missione ${n + 1} di ${Qs.length}</div><div class="gr">&gt; decifra il codice</div><div class="q" id="g2q"></div><div class="bank">${q.a.map((t, i) => `<button class="g2-tc" data-i="${i}" style="font-size:${fsz(t)}px">${esc(t)}</button>`).join("")}</div><div class="out" id="g2o"></div></div></div>`;
      const box = el.querySelector("#g2q"); typed = 0; clearInterval(tv);
      tv = setInterval(() => { if (!alive(el)) return clearInterval(tv); typed += 3; box.textContent = q.q.slice(0, typed); if (typed >= q.q.length) clearInterval(tv); }, 18);
    }
    el.onclick = e => {
      const b = e.target.closest(".g2-tc"); if (!b || done || busy) return; const q = Qs[n], i = +b.dataset.i, ok = i === q.c;
      clearInterval(tv); el.querySelector("#g2q").textContent = q.q;
      b.classList.add(ok ? "ok" : "ko"); const out = el.querySelector("#g2o");
      if (ok) { tap(); out.innerHTML = `<span class="gr">✔ codice accettato</span>`; busy = true; setTimeout(() => { if (!alive(el)) return; n++; busy = false; if (n >= Qs.length) { done = true; onDone(true, "", "Sistema sbloccato!", m); } else draw(); }, 800); }
      else { m++; boom(); out.innerHTML = `<span class="rd">✖ errore, riprova</span>`; el.querySelector(".g2-pips").outerHTML = pips(m); if (m >= 3) { done = true; onDone(false, q.a[q.c], q.e || "", 3); } }
    };
    draw();
  });
})();
