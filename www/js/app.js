// ===== App: schermate, profilo, home e prima sfida =====
(() => {
  const $app = document.getElementById("app");
  const $modal = document.getElementById("modal");
  const $toast = document.getElementById("toast");

  let profile = Storage.loadProfile();
  let wiz = null;       // creazione/modifica profilo
  let selected = [];    // materie scelte nella home
  let game = null;      // sfida in corso
  let toastTimer = null;
  let askCb = null;      // schermata iniziale "vuoi la narrazione?"
  let pendingAuto = true; // scelta fatta in quella schermata
  const $narr = document.getElementById("narrate");

  const pick = a => a[Math.floor(Math.random() * a.length)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const themeFor = id => (id == null || id <= 2) ? "piccoli" : id <= 4 ? "ragazzi" : "teen";
  const setTheme = id => { document.body.dataset.theme = themeFor(id); };
  const classLabel = id => CONFIG.CLASSES[id].label;
  const isReady = id => READY_SUBJECTS.includes(id);

  // ---------- suoni ----------
  const Sfx = (() => {
    let ctx = null;
    function tone(freq, start, dur, type, vol) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, ctx.currentTime + start);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.02);
    }
    function play(fn) {
      if (profile && profile.sound === false) return;
      try {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === "suspended") ctx.resume();
        fn();
      } catch (e) {}
    }
    return {
      ok: () => play(() => { tone(660, 0, .12, "triangle", .2); tone(880, .1, .12, "triangle", .2); tone(1320, .2, .22, "triangle", .18); }),
      no: () => play(() => { tone(220, 0, .18, "sawtooth", .12); tone(165, .14, .26, "sawtooth", .12); }),
      tap: () => play(() => tone(520, 0, .06, "triangle", .12))
    };
  })();

  // Voce OFF = non parla niente, in nessuna schermata, finché non si riaccende dal pulsante in cima
  const _speak = Voice.speak;
  Voice.speak = function (...a) { if (profile && !profile.autoRead) return; return _speak.apply(Voice, a); };

  Music.init(() => !!profile && profile.music !== false);
  const JINGLE_GAP = 90000;   // dentro una sfida con tante materie, uno stacchetto al massimo ogni 90 secondi
  let lastJingle = { sid: null, at: 0 };

  Games.setTap(() => Sfx.tap());
  Games.setBoom(() => Sfx.no());
  Games.setAvatar(() => charSvg(profile, "happy"));
  Games.setSpeak(card => Voice.speak(fin(card.words ? oddSegs(card) : vfSegs(card)), msg => toast(msg, 6000)), () => !!(profile && profile.autoRead), () => Voice.canSpeak() && !!(profile && profile.autoRead));

  // ---------- utilità interfaccia ----------
  function toast(msg, ms) {
    $toast.textContent = msg; $toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $toast.hidden = true; }, ms || 2600);
  }

  function charSvg(p, mood, viewBox) {
    return Characters.svg({ family: p.family, color: p.color, stage: p.classId == null ? 0 : p.classId, mood: mood || "happy", viewBox });
  }
  function avatarHtml(p, cls) {
    const inner = p.photo ? `<img src="${p.photo}" alt="La tua foto">` : charSvg(p, "happy", "40 14 120 120");
    return `<div class="avatar ${cls || ""}">${inner}</div>`;
  }

  function sparks(fromEl) {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = fromEl ? fromEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 3, width: 0, height: 0 };
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let i = 0; i < 12; i++) {
      const s = document.createElement("span");
      s.className = "spark"; s.textContent = pick(["⭐", "✨", "🎉", "💫"]);
      s.style.left = cx + "px"; s.style.top = cy + "px";
      s.style.setProperty("--dx", (Math.random() * 260 - 130) + "px");
      s.style.setProperty("--dy", (Math.random() * -200 - 20) + "px");
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 950);
    }
  }

  // testo "da leggere ad alta voce" (simboli -> parole)
  function toSpeech(t) {
    return String(t)
      .replace(/(\d)\s*×\s*(\d)/g, "$1 per $2")
      .replace(/(\d)\s*:\s*(\d)/g, "$1 diviso $2")
      .replace(/\+/g, " più ").replace(/[−-](?=\d)/g, " meno ")
      .replace(/−/g, " meno ").replace(/=/g, " uguale a ")
      .replace(/\^(\d)/g, " alla $1 ").replace(/(\d+)\s*%/g, "$1 per cento")
      .replace(/(\d+)\/(\d+)/g, "$1 fratto $2")
      .replace(/km\/h/g, " chilometri all'ora")
      .replace(/√(\d+)/g, "radice di $1").replace(/(\d)²/g, "$1 alla seconda").replace(/(\d)³/g, "$1 alla terza")
      .replace(/→/g, ", ").replace(/·/g, ". ")
      .replace(/cm²/g, " centimetri quadrati").replace(/\bcm\b/g, " centimetri");
  }

  // ====================================================================
  // CREAZIONE / MODIFICA PROFILO
  // ====================================================================
  function startWizard(editing, step) {
    wiz = {
      step: step || 0, editing: !!editing,
      d: editing && profile ? { ...profile } :
        { nick: "", classId: null, family: "creatura", color: Characters.COLORS[0].hex, photo: null, autoRead: pendingAuto, sound: true }
    };
    renderWizard();
  }

  function dotsHtml(step) {
    return `<div class="dots" aria-label="Passo ${step + 1} di 4">${[0, 1, 2, 3].map(i => `<i class="${i === step ? "on" : ""}"></i>`).join("")}</div>`;
  }

  function renderWizard() {
    const d = wiz.d, s = wiz.step;
    setTheme(d.classId);
    let body = "", canNext = true, nextLabel = "Avanti ▶";

    if (s === 0) {
      const canNickNow = d.nick.trim().length >= 2;
      canNext = canNickNow;
      body = `
        <div class="hero small">${charSvg({ ...d, classId: d.classId == null ? 0 : d.classId }, "cheer")}</div>
        <div class="center"><h1>Ciao! Come ti chiami?</h1><p class="muted" style="margin-top:6px">Scrivi il tuo nome o un soprannome inventato.</p></div>
        <input id="nick" class="field" type="text" inputmode="text" autocomplete="off" autocapitalize="words" maxlength="${CONFIG.NICK_MAX}" placeholder="Il tuo nome" value="${esc(d.nick)}" aria-label="Il tuo nome o soprannome">`;
    } else if (s === 1) {
      canNext = d.classId != null;
      const grp = (title, from, to) => `<div class="group-title">${title}</div><div class="grid2">${CONFIG.CLASSES.slice(from, to).map(c =>
        `<button class="choice ${d.classId === c.id ? "sel" : ""}" data-act="class" data-id="${c.id}"><span class="big-num">${c.short}</span><span>${c.level === "Medie" ? "media" : "elementare"}</span></button>`).join("")}</div>`;
      body = `<div class="center"><h1>Che classe fai?</h1><p class="muted" style="margin-top:6px">Così ti preparo le sfide giuste.</p></div>
        ${grp("Elementari", 0, 5)}${grp("Medie", 5, 8)}`;
    } else if (s === 2) {
      const st = d.classId == null ? 0 : d.classId;
      body = `<div class="center"><h1>Scegli il tuo compagno</h1><p class="muted" style="margin-top:6px">Crescerà con te, classe dopo classe!</p></div>
        <div class="grid2" style="grid-template-columns:repeat(3,1fr);gap:10px">${Characters.FAMILIES.map(f =>
          `<button class="choice family ${d.family === f.id ? "sel" : ""}" data-act="family" data-id="${f.id}" aria-label="${f.name}">${Characters.svg({ family: f.id, color: d.color, stage: st, mood: "happy" })}<span>${f.name}</span></button>`).join("")}</div>
        <div class="colors" role="group" aria-label="Colore">${Characters.COLORS.map(c =>
          `<button class="dot ${d.color === c.hex ? "sel" : ""}" data-act="color" data-hex="${c.hex}" style="background:${c.hex}" aria-label="${c.name}"></button>`).join("")}</div>`;
    } else {
      nextLabel = "Ho finito! ✔";
      body = `<div class="center"><h1>Vuoi metterci la tua foto?</h1><p class="muted" style="margin-top:6px">È facoltativa. La foto resta solo su questo telefono e non viene mai inviata.</p></div>
        ${avatarHtml(d, "xl")}
        ${navigator.camera ? `<div class="btn-row"><button class="btn alt big" data-act="photo-cam">📷 Scatta</button><button class="btn alt big" data-act="photo-gal">🖼️ Galleria</button></div>`
          : `<label class="btn alt big" for="photo">📷 Scegli una foto</label><input id="photo" type="file" accept="image/*" hidden>`}
        ${d.photo ? `<button class="btn ghost" data-act="nophoto">Togli la foto</button>` : `<p class="muted center">Se non la metti, usi il tuo compagno come avatar.</p>`}`;
    }

    $app.innerHTML = `<section class="screen">${dotsHtml(s)}${body}
      <div class="nav">
        ${s > 0 ? `<button class="btn ghost" data-act="back">◀ Indietro</button>` : (wiz.editing ? `<button class="btn ghost" data-act="cancel">Annulla</button>` : "")}
        <button id="next" class="btn" data-act="next" ${canNext ? "" : "disabled"}>${nextLabel}</button>
      </div></section>`;

    const nick = document.getElementById("nick");
    if (nick) {
      nick.addEventListener("input", () => {
        wiz.d.nick = nick.value;
        document.getElementById("next").disabled = nick.value.trim().length < 2;
      });
    }
    const photo = document.getElementById("photo");
    if (photo) photo.addEventListener("change", () => { if (photo.files && photo.files[0]) handlePhoto(photo.files[0]); });
  }

  function takePhoto(camera) {
    if (!navigator.camera) return;
    navigator.camera.getPicture(b64 => handleDataUrl("data:image/jpeg;base64," + b64), () => {}, {
      quality: 80, destinationType: Camera.DestinationType.DATA_URL, encodingType: Camera.EncodingType.JPEG,
      sourceType: camera ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
      cameraDirection: Camera.Direction.FRONT, targetWidth: 800, targetHeight: 800, correctOrientation: true, saveToPhotoAlbum: false
    });
  }

  function handlePhoto(file) {
    const reader = new FileReader();
    reader.onload = () => handleDataUrl(reader.result);
    reader.onerror = () => toast("Non riesco a leggere la foto.");
    reader.readAsDataURL(file);
  }

  function handleDataUrl(dataUrl) {
    if (!wiz) return;
    const img = new Image();
    img.onload = () => {
      const S = CONFIG.PHOTO_SIZE, m = Math.min(img.width, img.height);
      const c = document.createElement("canvas"); c.width = c.height = S;
      c.getContext("2d").drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
      wiz.d.photo = c.toDataURL("image/jpeg", 0.82);
      renderWizard();
    };
    img.onerror = () => toast("Non riesco ad aprire questa foto. Prova con un'altra.");
    img.src = dataUrl;
  }

  function finishWizard() {
    const d = wiz.d, seen = !!(profile && profile.infoSeen);
    profile = { nick: d.nick.trim(), classId: d.classId, family: d.family, color: d.color, photo: d.photo || null,
      autoRead: !!d.autoRead, narrAsked: true,
      sound: d.sound !== false, l2: d.l2 || undefined, infoSeen: seen };
    if (!Storage.saveProfile(profile)) toast("Non riesco a salvare sul telefono: lo spazio è pieno.");
    wiz = null;
    Credit.refresh();
    selected = subjectsForClass(profile.classId).filter(s => isReady(s.id)).map(s => s.id);
    showHome();
  }

  // ====================================================================
  // HOME
  // ====================================================================
  const GREET = {
    piccoli: ["Che sfida scegliamo oggi?", "Pronto a giocare? Io sì!", "Oggi impariamo un sacco di cose!"],
    ragazzi: ["Sei in forma? Si parte!", "Quante ne indovini di fila?", "Scegli la sfida, ci penso io al tifo!"],
    teen: ["Pronti? Scegli la sfida.", "Facciamo vedere chi comanda.", "Un'altra serie da record?"]
  };

  function showHome() {
    Games.stop();
    game = null;
    setTheme(profile.classId);
    renderHome();
    maybeShowInfo();
  }

  function renderHome() {
    const p = profile, th = themeFor(p.classId);
    const min = Credit.get(), pct = Math.round(min / CONFIG.MAX_MINUTES * 100), mark = Math.round(CONFIG.MIN_MINUTES / CONFIG.MAX_MINUTES * 100);
    const subs = subjectsForClass(p.classId);
    $app.innerHTML = `<section class="screen">
      <div class="top">
        <button class="avatar-btn" data-act="settings" aria-label="Il mio profilo" style="border:0;background:none;padding:0">${avatarHtml(p)}</button>
        <div class="who"><h2>Ciao, ${esc(p.nick)}!</h2><span class="pill">${classLabel(p.classId)}</span></div>
        <button class="icon-btn" data-act="settings" aria-label="Impostazioni">⚙️</button>
      </div>
      <div class="bubble">${esc(pick(GREET[th]))}</div>
      <div id="hero" class="hero">${charSvg(p, "happy")}</div>
      <div class="card time">
        <div class="row"><h3>Tempo di telefono</h3><span class="muted">oggi</span></div>
        <div class="row"><span class="num">${esc(Credit.format(min))}</span></div>
        <div class="bar" role="img" aria-label="${min} minuti su ${CONFIG.MAX_MINUTES}"><i style="width:${pct}%"></i><b style="left:${mark}%"></b></div>
        <div class="bar-labels"><span>${CONFIG.MIN_MINUTES} min garantiti</span><span>massimo ${esc(Credit.format(CONFIG.MAX_MINUTES))}</span></div>
      </div>
      <div class="sel-head"><h2>Scegli le sfide</h2>
        <span class="sel-btns"><button class="btn ghost small" data-act="sel-all">✔ Tutte</button><button class="btn ghost small" data-act="sel-none">✖ Nessuna</button></span></div>
      <div class="subjects">${subs.map(s => {
        const ready = isReady(s.id), sel = selected.includes(s.id);
        return `<button class="tile ${ready ? "" : "soon"} ${sel ? "sel" : ""}" data-act="subject" data-id="${s.id}" style="--tc:${s.color}" aria-pressed="${sel}">
          <span class="ic">${s.icon}</span><span>${esc(s.name)}</span>${ready ? "" : "<small>arriva presto</small>"}</button>`;
      }).join("")}</div>
      <div class="dock">
        <button class="btn alt" data-act="surprise">🎲 Sorprendimi</button>
        <button class="btn" data-act="play">▶ Gioca!</button>
      </div></section>`;
  }

  // ====================================================================
  // SFIDA (quiz)
  // ====================================================================
  const SHAPES = ["▲", "●", "■", "★"];
  const ANS_COL = ["#FFD23F", "#7ED9FF", "#FF9EC0", "#B9F27A"];
  const PRAISE = { piccoli: ["Bravo!", "Grande!", "Evviva!", "Che forza!"], ragazzi: ["Esatto!", "Centro!", "Che mito!", "Forte!"], teen: ["Boom!", "Esatto!", "Livello su!", "Sei un mostro!"] };
  const OOPS = ["Quasi!", "Ci sei vicino!", "Ci riprovi col prossimo!"];

  function startGame(ids) {
    const ok = ids.filter(isReady);
    if (!ok.length) { toast("Scegli almeno una sfida con il bollino verde."); return; }
    game = { subjects: ok, streak: 0, right: 0, listening: false, lastKind: "", round: null };
    lastJingle = { sid: null, at: 0 };
    nextQuestion();
  }

  function nextQuestion() {
    Games.stop();
    game.sid = pick(game.subjects);
    // lingua straniera della voce: inglese, oppure quella scelta nelle Impostazioni per la seconda lingua
    if (game.sid === "lingua2") { L2.use(profile.l2); Voice.setForeign(L2.loc()); }
    else Voice.setForeign("en-US");
    game.round = Games.pick(game.sid, profile.classId, game.lastKind, themeFor(profile.classId) === "piccoli" ? CONFIG.GAME_SHARE_SMALL : CONFIG.GAME_SHARE);
    game.lastKind = game.round ? game.round.kind : "quiz";
    game.q = game.round ? null : Questions.next(game.sid, profile.classId);
    game.answered = false; game.chosen = -1; game.mood = "happy"; game.fb = null; game.listening = false;
    renderGame();
    // stacchetto musicale: all'inizio della sfida, poi solo se cambia materia e sono passati 90 secondi
    const now = Date.now();
    if (lastJingle.sid === null || (game.sid !== lastJingle.sid && now - lastJingle.at > JINGLE_GAP)) {
      if (Music.play(game.sid, profile.classId)) lastJingle = { sid: game.sid, at: now };
      else if (lastJingle.sid === null) lastJingle = { sid: game.sid, at: now };
    }
    if (profile.autoRead) {
      const cur = game.round || game.q;
      // la voce parte quando lo stacchetto è finito (se nel frattempo non si è già risposto)
      Music.whenDone(() => { if (game && (game.round || game.q) === cur && !game.answered) readQuestion(); });
    }
  }

  // ---- voce inglese: spezza il testo in pezzi italiani e inglesi ----
  const ALN = "A-Za-zÀ-ÿ0-9";
  function langSegs(text, en) {
    const t = toSpeech(text);
    const list = (en || []).filter(Boolean).sort((a, b) => b.length - a.length)
      .map(x => x.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&").replace(/\s+/g, "\\s+"));
    if (!list.length) return [{ t }];
    const re = new RegExp("(^|[^" + ALN + "])(" + list.join("|") + ")(?=$|[^" + ALN + "])", "gi");
    const out = []; let last = 0, m;
    while ((m = re.exec(t))) {
      const start = m.index + m[1].length;
      if (start > last) out.push({ t: t.slice(last, start) });
      out.push({ t: m[2], l: "en" });
      last = start + m[2].length;
    }
    if (last < t.length) out.push({ t: t.slice(last) });
    return out;
  }
  // una risposta: tutta inglese se la domanda ha ae, altrimenti solo le parole segnate
  const ansSegs = (q, t) => q && q.ae ? [{ t: toSpeech(t), l: "en" }] : langSegs(t, q && q.en);
  // se è tutto italiano torna una semplice stringa
  function fin(segs) {
    const out = [];
    segs.forEach(s => {
      const p = out[out.length - 1];
      if (p && (p.l || "") === (s.l || "")) p.t += s.t; else out.push({ t: s.t, l: s.l });
    });
    return out.length === 1 && !out[0].l ? out[0].t : out;
  }

  // una frase di "Vero o falso": domanda + risposta proposta
  function vfSegs(card) {
    return [...langSegs(card.q.q, card.q.en), { t: /[?!.:…]$/.test(card.q.q) ? " Risposta proposta: " : ". Risposta proposta: " }, ...ansSegs(card.q, card.cand), { t: "." }];
  }

  // le quattro parole di "Trova l'intruso"
  function oddSegs(card) {
    const segs = [{ t: "Quale parola non c'entra con le altre? Le parole sono: " }];
    card.words.forEach((w, i) => segs.push({ t: toSpeech(w) + (i < card.words.length - 1 ? ", " : "."), l: card.eng ? "en" : "" }));
    return segs;
  }

  const OPS = { "+": "più", "−": "meno", "×": "per", ":": "diviso", "=": "uguale a", "(": "apri parentesi", ")": "chiudi parentesi" };
  function roundSpeech(r) {
    if (r.kind === "frase") return "Metti le parole in ordine per fare una frase. Le parole sono: " + r.items.map(w => w.replace(/[.,;:!?]/g, "")).join(", ") + ".";
    if (r.kind === "operazione") return (r.problem ? toSpeech(r.prompt) + " " : "") + "Metti in ordine numeri e segni per fare l'operazione. Ci sono: " +
      r.items.map(t => OPS[t] || (/^−\d/.test(t) ? "meno " + t.slice(1) : t)).join(", ") + ".";
    if (r.kind === "corsa") {
      const q = r.q, pos = ["A sinistra: ", "Al centro: ", "A destra: "], segs = [{ t: "Premi Via e porta il personaggio nella corsia giusta. " }, ...langSegs(r.prompt, q && q.en)];
      r.opts.forEach((o, i) => segs.push({ t: " " + pos[i] }, ...ansSegs(q, o), { t: "." }));
      return fin(segs);
    }
    if (r.kind === "vf") return fin([{ t: "Vero o falso. Per ogni frase tocca vero se la risposta è giusta, falso se è sbagliata. Prima frase: " }, ...vfSegs(r.cards[0])]);
    if (r.kind === "intruso") return fin([{ t: "Trova l'intruso. Tocca la parola che non c'entra con le altre tre. Primo giro: " }, ...oddSegs(r.rounds[0])]);
    if (r.kind === "lettere") return fin([{ t: "Rimetti in ordine le lettere per formare la parola. La parola da trovare corrisponde a: " }, { t: toSpeech(r.clue.l), l: r.eng ? "en" : "" }, { t: ". " + toSpeech(r.hint) }]);
    if (r.kind === "fila") {
      const segs = [{ t: "Metti in fila. " + toSpeech(r.prompt) + " Gli elementi sono: " }];
      r.pool.forEach((w, i) => segs.push({ t: toSpeech(w) + (i < r.pool.length - 1 ? ", " : "."), l: r.eng ? "en" : "" }));
      return fin(segs);
    }
    if (r.kind === "memory") {
      const segs = [{ t: toSpeech(r.prompt) + " Le coppie sono: " }];
      r.pairs.forEach((p, i) => segs.push({ t: toSpeech(p.l), l: r.eng ? "en" : "" }, { t: " con " }, { t: toSpeech(p.r) + (i < r.pairs.length - 1 ? ", " : "."), l: r.rEn ? "en" : "" }));
      return fin(segs);
    }
    if (r.kind === "palloncino") {
      const segs = [{ t: toSpeech(r.prompt) + " Le parole sono: " }];
      r.pairs.forEach((p, i) => segs.push({ t: toSpeech(p.l) + (i < r.pairs.length - 1 ? ", " : "."), l: r.eng ? "en" : "" }));
      return fin(segs);
    }
    if (r.kind === "incastro" && r.eng) {
      const segs = [{ t: toSpeech(r.prompt) + " Da collegare: " }];
      r.pairs.forEach((p, i) => segs.push({ t: toSpeech(p.l) + (i < r.pairs.length - 1 ? ", " : ""), l: "en" }));
      segs.push({ t: ". I pezzi sono: " });
      r.order.forEach((k, i) => segs.push({ t: toSpeech(r.pairs[k].r) + (i < r.order.length - 1 ? ", " : ""), l: r.rEn ? "en" : "" }));
      segs.push({ t: "." });
      return fin(segs);
    }
    if (r.kind === "incastro") return toSpeech(r.prompt) + " Da collegare: " + r.pairs.map(p => toSpeech(p.l)).join(", ") + ". I pezzi sono: " + r.order.map(i => toSpeech(r.pairs[i].r)).join(", ") + ".";
    const q = r.q, segs = [{ t: r.kind === "pesca" ? "Pesca il pesce con la risposta giusta. " : r.kind === "talpa" ? "Colpisci la talpa con la risposta giusta. " : "Colpisci il bersaglio con la risposta giusta. " }, ...langSegs(r.prompt, q && q.en), { t: " Le risposte sono: " }];
    q.a.forEach((a, i) => segs.push(...ansSegs(q, a), { t: i < q.a.length - 1 ? ", " : "." }));
    return fin(segs);
  }

  function questionSpeech() {
    const q = game.q;
    const ord = ["Prima", "Seconda", "Terza", "Quarta"];
    const segs = [...langSegs(q.q, q.en), { t: ". " }];
    q.a.forEach((a, i) => segs.push({ t: ord[i] + ": " }, ...ansSegs(q, a), { t: ". " }));
    return fin(segs);
  }

  // testo letto dopo la risposta: esito, risposta giusta (se sbagliata) e spiegazione
  function feedbackSpeech() {
    const fb = game.fb, r = game.round, q = game.q || (r && r.q) || null;
    const segs = [{ t: fb.title + "." }];
    if (fb.correct) {
      segs.push({ t: " La risposta giusta era: " });
      if (r && r.kind === "fila") {
        r.items.forEach((w, i) => segs.push({ t: toSpeech(w) + (i < r.items.length - 1 ? ", " : "."), l: r.eng ? "en" : "" }));
      } else if (r && r.kind === "lettere" && r.eng) {
        segs.push({ t: toSpeech(r.clue.l), l: "en" }, { t: ", " }, { t: toSpeech(r.clue.r) + ".", l: r.rEn ? "en" : "" });
      } else if (r && r.pairs && r.eng) {
        r.pairs.forEach((p, i) => {
          segs.push({ t: toSpeech(p.l), l: "en" }, { t: ", " }, { t: toSpeech(p.r) + ". ", l: r.rEn ? "en" : "" });
        });
      } else segs.push(...ansSegs(q, fb.correct), { t: "." });
    }
    if (fb.text) segs.push({ t: " " }, ...langSegs(fb.text, q && q.en));
    return fin(segs);
  }

  function readQuestion() {
    Voice.speak(game.round ? roundSpeech(game.round) : questionSpeech(), msg => toast(msg, 6000));
  }

  function feedbackHtml(fb, showSol) {
    return `<div class="card feedback">
        <div class="head"><h2>${esc(fb.title)}</h2><span class="delta ${fb.delta > 0 ? "up" : fb.delta < 0 ? "down" : ""}">${fb.delta > 0 ? "+" : fb.delta < 0 ? "−" : ""}${fb.delta === 0 ? "" : Math.abs(fb.delta) + " min"}</span></div>
        ${showSol && fb.correct ? `<p class="sol">Soluzione: <b>${esc(fb.correct)}</b></p>` : ""}
        ${fb.text ? `<p>${esc(fb.text)}</p>` : ""}
        <button class="btn big" data-act="next-q">Avanti ▶</button>
      </div>`;
  }

  // schermata di un gioco (puzzle o tiro a segno)
  function renderRound() {
    const r = game.round, sub = SUBJECTS.find(s => s.id === game.sid);
    $app.innerHTML = `<section class="screen">
      <div class="gtop">
        <button class="icon-btn" data-act="exit" aria-label="Esci dalla sfida">✕</button>
        <span class="chip" id="gmins" aria-label="Minuti di oggi">⏱ ${esc(Credit.format(Credit.get()))}</span>
        <span class="space"></span>
        <span class="chip" id="gstreak" aria-label="Serie di risposte giuste">🔥 ${game.streak}</span>
      </div>
      <div id="hero" class="hero xs">${charSvg(profile, game.mood)}</div>
      <div class="card qcard">
        <span class="qsub" style="--sc:${sub.color}">${sub.icon} ${esc(sub.name)} · ${esc(r.title)}</span>
        <div class="qtext">${esc(r.prompt)}</div>
        ${r.hint ? `<p class="muted">${esc(r.hint)}</p>` : ""}
      </div>
      <div id="gbox"></div>
      <div id="gfb"></div>
    </section>`;
    Games.mount(document.getElementById("gbox"), r, roundDone);
  }

  function renderGame() {
    if (game.round) { renderRound(); return; }
    const q = game.q, sub = SUBJECTS.find(s => s.id === game.sid), fb = game.fb;
    const min = Credit.get();
    const canSpeak = Voice.canSpeak(), canListen = Voice.canListen();
    $app.innerHTML = `<section class="screen">
      <div class="gtop">
        <button class="icon-btn" data-act="exit" aria-label="Esci dalla sfida">✕</button>
        <span class="chip" aria-label="Minuti di oggi">⏱ ${esc(Credit.format(min))}</span>
        <span class="space"></span>
        <span class="chip" aria-label="Serie di risposte giuste">🔥 ${game.streak}</span>
      </div>
      <div id="hero" class="hero small">${charSvg(profile, game.mood)}</div>
      <div class="card qcard">
        <span class="qsub" style="--sc:${sub.color}">${sub.icon} ${esc(sub.name)}</span>
        <div class="qtext">${esc(q.q)}</div>
        ${canListen && !game.answered ? `<div class="tools">
          ${canListen ? `<button class="btn ghost ${game.listening ? "listening" : ""}" data-act="mic">${game.listening ? "🎤 Ti ascolto…" : "🎤 Rispondi a voce"}</button>` : ""}
        </div>` : ""}
      </div>
      <div class="answers">${q.a.map((a, i) => {
        let cls = "";
        if (game.answered) cls = i === q.c ? "right" : i === game.chosen ? "wrong" : "dim";
        return `<button class="ans ${cls}" data-act="ans" data-i="${i}" style="--ac:${ANS_COL[i]}" ${game.answered ? "disabled" : ""}>
          <span class="shape"><span>${SHAPES[i]}</span></span><span>${esc(a)}</span></button>`;
      }).join("")}</div>
      ${fb ? feedbackHtml(fb, false) : ""}
    </section>`;
  }

  function finishRound(ok, expl, correct) {
    Voice.stopSpeaking();
    const r = Credit.answer(ok);
    game.answered = true; game.mood = ok ? "cheer" : "sad"; game.listening = false;
    if (ok) { game.streak++; game.right++; } else { game.streak = 0; }
    const th = themeFor(profile.classId);
    let text = expl || "";
    if (ok && r.delta === 0) text = (text ? text + " " : "") + "Hai già il massimo di oggi, ma continua pure per allenarti!";
    if (!ok && r.delta === 0) text = (text ? text + " " : "") + "I minuti garantiti restano tuoi.";
    game.fb = { title: ok ? pick(PRAISE[th]) : pick(OOPS), delta: r.delta, text, correct: ok ? "" : (correct || "") };
  }

  // sbagliato: il personaggio si schiaccia e piange; giusto: balla (moonwalk, giravolta, posa)
  function animateHero(hero, ok) {
    hero.classList.remove("hop", "shake", "squash", "dance");
    hero.querySelectorAll(".tear,.cry,.hat,.glove").forEach(n => n.remove());
    void hero.offsetWidth;
    if (ok) {
      hero.style.setProperty("--dance", pick(["moonwalk", "spin", "lean"]));
      hero.insertAdjacentHTML("beforeend", '<span class="hat">🎩</span><span class="glove">🧤</span>');
      hero.classList.add("dance");
    } else {
      hero.insertAdjacentHTML("beforeend", '<span class="tear l"></span><span class="tear r"></span><span class="cry">😭</span>');
      hero.classList.add("squash");
    }
  }

  function afterResult(ok) {
    const hero = document.getElementById("hero");
    if (hero) animateHero(hero, ok);
    if (ok) { Sfx.ok(); sparks(hero); } else { Sfx.no(); }
    window.scrollTo(0, document.body.scrollHeight);
    if (profile.autoRead) Voice.speak(feedbackSpeech(), msg => toast(msg, 6000));
  }

  function answer(i) {
    if (!game || game.answered || game.round) return;
    const q = game.q, ok = i === q.c;
    game.chosen = i;
    finishRound(ok, q.e, q.a[q.c]);
    renderGame();
    afterResult(ok);
  }

  // un gioco è finito: aggiorno minuti, personaggio e riquadro del risultato senza ridisegnare il gioco
  function roundDone(ok, correct, expl) {
    if (!game || !game.round || game.answered) return;
    finishRound(ok, expl, correct);
    const hero = document.getElementById("hero"), m = document.getElementById("gmins"), st = document.getElementById("gstreak"), f = document.getElementById("gfb");
    if (hero) hero.innerHTML = charSvg(profile, game.mood);
    if (m) m.textContent = "⏱ " + Credit.format(Credit.get());
    if (st) st.textContent = "🔥 " + game.streak;
    if (f) f.innerHTML = feedbackHtml(game.fb, true);
    afterResult(ok);
  }

  function listenForAnswer() {
    if (!game || game.answered) return;
    if (game.listening) return;
    Voice.stopSpeaking();
    game.listening = true; renderGame();
    Voice.listen().then(matches => {
      if (!game || game.answered) return;
      game.listening = false;
      const idx = Voice.matchOption(matches, game.q.a);
      if (idx >= 0) answer(idx);
      else { renderGame(); toast("Non ho capito bene. Riprova o tocca la risposta."); }
    }).catch(() => {
      if (!game) return;
      game.listening = false; renderGame();
      toast("Il microfono non è disponibile. Tocca la risposta.");
    });
  }

  // ====================================================================
  // NARRAZIONE: scelta iniziale e pulsante su ogni schermata
  // ====================================================================
  function askNarration(cb) {
    askCb = cb;
    setTheme(null);
    $app.innerHTML = `<section class="screen">
      <div class="hero">${Characters.svg({ family: "creatura", color: Characters.COLORS[0].hex, stage: 0, mood: "happy" })}</div>
      <div class="center"><h1>Vuoi che ti legga le domande?</h1><p class="muted" style="margin-top:6px">Puoi cambiare idea quando vuoi, dalle impostazioni.</p></div>
      <button class="btn big" data-act="narr-yes">🔊 Sì, leggimele</button>
      <button class="btn alt big" data-act="narr-no">🔇 No, grazie</button>
    </section>`;
  }

  function narrChoice(yes) {
    const cb = askCb; askCb = null;
    if (yes) Voice.speak("Perfetto, ti leggerò le domande.", msg => toast(msg, 6000));
    if (cb) cb(yes);
  }

  function getNarration() {
    if (askCb) return "Vuoi che ti legga le domande? Tocca sì, leggimele, oppure no, grazie.";
    if (wiz) return ["Ciao! Come ti chiami? Scrivi il tuo nome o un soprannome inventato.",
      "Che classe fai? Così ti preparo le sfide giuste.",
      "Scegli il tuo compagno. Crescerà con te, classe dopo classe!",
      "Vuoi metterci la tua foto? È facoltativa e resta solo su questo telefono."][wiz.step] || "";
    if (game) return game.answered && game.fb ? feedbackSpeech() : (game.round ? roundSpeech(game.round) : questionSpeech());
    if (profile) return `Ciao ${profile.nick}! Oggi hai ${Credit.format(Credit.get())} di telefono. Scegli le sfide che vuoi e tocca Gioca.`;
    return "";
  }

  function refreshNarrate() {
    if (!$narr) return;
    const on = Voice.isSpeaking();
    $narr.hidden = !Voice.canSpeak();
    $narr.textContent = on ? "⏹" : "📖";
    $narr.classList.toggle("on", on);
    $narr.setAttribute("aria-label", on ? "Ferma la lettura" : "Leggi questa pagina");
  }
  Voice.onState(refreshNarrate);

  // interruttore Voce ON / Voce OFF: ricorda la scelta (profile.autoRead) per ogni esercizio e gioco
  const $vt = document.getElementById("voicetoggle"), $mt = document.getElementById("musictoggle");
  function refreshVoiceToggle() {
    if (!$vt) return;
    if ($mt) {
      const showM = !!profile && !askCb;
      $mt.hidden = !showM;
      if (showM) {
        const m = profile.music !== false;
        $mt.textContent = m ? "🎵 Musica ON" : "🎵 Musica OFF";
        $mt.classList.toggle("off", !m);
        $mt.setAttribute("aria-pressed", String(m));
        $mt.setAttribute("aria-label", m ? "Musica accesa: tocca per spegnerla" : "Musica spenta: tocca per accenderla");
      }
    }
    const show = !!profile && !askCb && Voice.canSpeak();
    $vt.hidden = !show;
    if (!show) return;
    const on = !!profile.autoRead;
    $vt.textContent = on ? "🔊 Voce ON" : "🔇 Voce OFF";
    $vt.classList.toggle("off", !on);
    $vt.setAttribute("aria-pressed", String(on));
    $vt.setAttribute("aria-label", on ? "Voce accesa: tocca per spegnerla" : "Voce spenta: tocca per accenderla");
  }
  new MutationObserver(() => { refreshVoiceToggle(); refreshNarrate(); }).observe($app, { childList: true });

  // ====================================================================
  // IMPOSTAZIONI
  // ====================================================================
  function openModal(html) { $modal.innerHTML = `<div class="card sheet">${html}</div>`; $modal.hidden = false; }
  function closeModal() { $modal.hidden = true; $modal.innerHTML = ""; }

  function openSettings() {
    const p = profile;
    openModal(`
      <div class="top">${avatarHtml(p)}<div class="who"><h2>${esc(p.nick)}</h2><span class="pill">${classLabel(p.classId)}</span></div></div>
      <button class="btn alt" data-act="edit">✏️ Cambia nome o classe</button>
      <button class="btn alt" data-act="editphoto">📷 Cambia foto</button>
      <div class="row-set l2-set"><span class="set-label">Seconda lingua</span><div class="l2-pick">${L2.codes().map(c => `<button class="switch ${(p.l2 || L2.DEFAULT) === c ? "on" : ""}" data-act="set-l2" data-id="${c}" aria-pressed="${(p.l2 || L2.DEFAULT) === c}"><span class="fl">${L2.LANGS[c].flag}</span><span>${L2.LANGS[c].name}</span></button>`).join("")}</div></div>
      <div class="row-set"><span>Suoni</span><button class="switch ${p.sound !== false ? "on" : ""}" data-act="toggle-sound" aria-pressed="${p.sound !== false}">${p.sound !== false ? "Sì" : "No"}</button></div>
      <button class="btn ghost" data-act="info">ℹ️ Avvertenze</button>
      <button class="btn ghost" data-act="reset">🗑 Ricomincia da zero</button>
      <button class="btn" data-act="close">Chiudi</button>`);
  }

  function openInfo() {
    openModal(`<h2>ℹ️ Avvertenze e informazioni</h2>
      <p><b>Non sostituisce la scuola.</b> Studia e Gioca non sostituisce l'insegnamento né l'aiuto dei genitori: è solo un piccolo aiuto per fissare in mente alcune cose divertendosi, perché la ripetizione è ciò che fa davvero imparare e diventare bravi in qualcosa.</p>
      <p><b>Da dove vengono le domande.</b> Si basano sui programmi ministeriali italiani, consultati su internet: le <i>Indicazioni nazionali per il curricolo della scuola dell'infanzia e del primo ciclo d'istruzione</i> (D.M. 254 del 16 novembre 2012, con il documento di aggiornamento «Indicazioni nazionali e nuovi scenari» del 2018), ancora in vigore nell'anno scolastico 2026/27 per quasi tutte le classi. Le nuove Indicazioni (D.M. 221 del 9 dicembre 2025, Gazzetta Ufficiale n. 21 del 27 gennaio 2026) dal 2026/27 si applicano solo alle classi prime di primaria e media e poi, anno dopo anno, alle altre. Le domande sono state scritte per questa app e possono contenere errori.</p>
      <p><b>Genitori.</b> Si raccomanda a mamma e papà di tenere sotto controllo i figli quando usano il cellulare, soprattutto se sono piccoli, e di usare sempre buon senso e discrezione sul tempo davanti allo schermo.</p>
      <button class="btn" data-act="close">Ho capito</button>`);
  }

  function maybeShowInfo() {
    if (!profile || profile.infoSeen || wiz || askCb) return;
    profile.infoSeen = true; Storage.saveProfile(profile);
    openInfo();
  }

  function confirmReset() {
    openModal(`<h2>Ricominciare da zero?</h2><p>Si cancellano nome, foto, compagno e minuti di oggi da questo telefono.</p>
      <button class="btn" data-act="reset-yes">Sì, cancella tutto</button>
      <button class="btn ghost" data-act="close">No, torna indietro</button>`);
  }

  // ====================================================================
  // EVENTI
  // ====================================================================
  const actions = {
    // creazione profilo
    class: el => { wiz.d.classId = +el.dataset.id; setTheme(wiz.d.classId); renderWizard(); },
    family: el => { wiz.d.family = el.dataset.id; renderWizard(); },
    color: el => { wiz.d.color = el.dataset.hex; renderWizard(); },
    nophoto: () => { wiz.d.photo = null; renderWizard(); },
    back: () => { wiz.step = Math.max(0, wiz.step - 1); renderWizard(); },
    cancel: () => { wiz = null; showHome(); },
    next: () => {
      const d = wiz.d;
      if (wiz.step === 0 && d.nick.trim().length < 2) return;
      if (wiz.step === 1 && d.classId == null) return;
      if (wiz.step < 3) { wiz.step++; renderWizard(); window.scrollTo(0, 0); }
      else finishWizard();
    },
    // home
    sound: () => { profile.sound = profile.sound === false; Storage.saveProfile(profile); renderHome(); Sfx.tap(); },
    settings: () => openSettings(),
    subject: el => {
      const id = el.dataset.id;
      if (!isReady(id)) { toast("Questa sfida arriva presto!"); return; }
      selected = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
      Sfx.tap(); renderHome();
    },
    surprise: () => startGame([pick(subjectsForClass(profile.classId).filter(s => isReady(s.id))).id]),
    play: () => startGame(selected),
    // sfida
    ans: el => answer(+el.dataset.i),
    read: () => readQuestion(),
    narrate: () => {
      if (Voice.isSpeaking()) { Voice.stopSpeaking(); return; }
      const t = getNarration();
      if (t) Voice.speak(t, msg => toast(msg, 6000));
    },
    "narr-yes": () => narrChoice(true),
    "narr-no": () => narrChoice(false),
    mic: () => listenForAnswer(),
    "next-q": () => nextQuestion(),
    exit: () => { Voice.stopSpeaking(); Music.stop(); showHome(); },
    // impostazioni
    close: () => closeModal(),
    edit: () => { closeModal(); startWizard(true, 0); },
    editphoto: () => { closeModal(); startWizard(true, 3); },
    "sel-all": () => { selected = subjectsForClass(profile.classId).filter(s => isReady(s.id)).map(s => s.id); Sfx.tap(); renderHome(); },
    "sel-none": () => { selected = []; Sfx.tap(); renderHome(); },
    info: () => openInfo(),
    "toggle-read": () => { profile.autoRead = !profile.autoRead; Storage.saveProfile(profile); refreshVoiceToggle(); openSettings(); },
    "voice-toggle": () => {
      profile.autoRead = !profile.autoRead; Storage.saveProfile(profile);
      Voice.stopSpeaking(); refreshVoiceToggle();
      if (profile.autoRead) { const t = getNarration(); if (t) Voice.speak(t, msg => toast(msg, 6000)); }
    },
    "music-toggle": () => {
      profile.music = profile.music === false;
      Storage.saveProfile(profile); refreshVoiceToggle();
      if (profile.music) Music.play(game ? game.sid : "italiano", profile.classId); else Music.stop(true);
    },
    "photo-cam": () => takePhoto(true),
    "photo-gal": () => takePhoto(false),
    "set-l2": el => { profile.l2 = L2.use(el.dataset.id); Storage.saveProfile(profile); openSettings(); },
    "toggle-sound": () => { profile.sound = profile.sound === false; Storage.saveProfile(profile); openSettings(); renderHome(); },
    reset: () => confirmReset(),
    "reset-yes": () => { Storage.resetAll(); profile = null; closeModal(); Credit.refresh(); askNarration(yes => { pendingAuto = yes; startWizard(false); }); }
  };

  document.addEventListener("click", e => {
    const el = e.target.closest("[data-act]");
    if (!el || el.disabled) return;
    if (el.dataset.act !== "narrate") Voice.stopSpeaking();
    const fn = actions[el.dataset.act];
    if (fn) fn(el);
  });
  $modal.addEventListener("click", e => { if (e.target === $modal) closeModal(); });
  // tap fuori dalla scheda (sullo sfondo) mentre si modifica il profilo: come Annulla
  $app.addEventListener("click", e => {
    if (wiz && wiz.editing && profile && (e.target === $app || e.target.classList.contains("screen"))) { wiz = null; showHome(); }
  });

  // nuovo giorno: i minuti ripartono dal minimo garantito
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { Voice.stopSpeaking(); return; }
    Credit.refresh();
    if (profile && !wiz && !game && !askCb) renderHome();
  });

  // ---------- avvio ----------
  function boot() {
    refreshNarrate();
    const first = yes => { pendingAuto = yes; startWizard(false); };
    if (profile && typeof profile.classId !== "number") { Storage.resetAll(); profile = null; }
    if (!profile) { askNarration(first); return; }
    selected = subjectsForClass(profile.classId).filter(s => isReady(s.id)).map(s => s.id);
    if (profile.narrAsked) showHome();
    else askNarration(yes => { profile.autoRead = yes; profile.narrAsked = true; Storage.saveProfile(profile); showHome(); });
  }
  // Tasto indietro di Android: torna alla pagina precedente invece di chiudere l'app.
  // Si esce dall'app solo dalla schermata principale (non c'è niente prima).
  function onBack() {
    if (!$modal.hidden) { closeModal(); return; }
    if (wiz) {
      if (wiz.step > 0) { wiz.step--; renderWizard(); window.scrollTo(0, 0); return; }
      if (profile) { wiz = null; showHome(); return; }
    } else if (game) { Voice.stopSpeaking(); Music.stop(); showHome(); return; }
    if (navigator.app && navigator.app.exitApp) navigator.app.exitApp();
  }

  // Nell'app Android si aspetta che i plugin (voce, microfono) siano pronti
  if (window.cordova) {
    document.addEventListener("deviceready", () => { document.addEventListener("backbutton", onBack, false); boot(); }, false);
  } else boot();
})();
