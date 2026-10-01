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

  // ---------- utilità interfaccia ----------
  function toast(msg) {
    $toast.textContent = msg; $toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $toast.hidden = true; }, 2600);
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
      .replace(/cm²/g, " centimetri quadrati").replace(/\bcm\b/g, " centimetri");
  }

  // ====================================================================
  // CREAZIONE / MODIFICA PROFILO
  // ====================================================================
  function startWizard(editing, step) {
    wiz = {
      step: step || 0, editing: !!editing,
      d: editing && profile ? { ...profile } :
        { nick: "", classId: null, family: "creatura", color: Characters.COLORS[0].hex, photo: null, autoRead: true, sound: true }
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
        <label class="btn alt big" for="photo">📷 Scatta o scegli una foto</label>
        <input id="photo" type="file" accept="image/*" hidden>
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

  function handlePhoto(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const S = CONFIG.PHOTO_SIZE, m = Math.min(img.width, img.height);
        const c = document.createElement("canvas"); c.width = c.height = S;
        c.getContext("2d").drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
        wiz.d.photo = c.toDataURL("image/jpeg", 0.82);
        renderWizard();
      };
      img.onerror = () => toast("Non riesco ad aprire questa foto. Prova con un'altra.");
      img.src = reader.result;
    };
    reader.onerror = () => toast("Non riesco a leggere la foto.");
    reader.readAsDataURL(file);
  }

  function finishWizard() {
    const d = wiz.d;
    profile = { nick: d.nick.trim(), classId: d.classId, family: d.family, color: d.color, photo: d.photo || null,
      autoRead: wiz.editing ? !!d.autoRead : d.classId <= 1,
      sound: d.sound !== false };
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
    game = null;
    setTheme(profile.classId);
    renderHome();
  }

  function renderHome() {
    const p = profile, th = themeFor(p.classId);
    const min = Credit.get(), pct = Math.round(min / CONFIG.MAX_MINUTES * 100), mark = Math.round(CONFIG.MIN_MINUTES / CONFIG.MAX_MINUTES * 100);
    const subs = subjectsForClass(p.classId);
    $app.innerHTML = `<section class="screen">
      <div class="top">
        <button class="avatar-btn" data-act="settings" aria-label="Il mio profilo" style="border:0;background:none;padding:0">${avatarHtml(p)}</button>
        <div class="who"><h2>Ciao, ${esc(p.nick)}!</h2><span class="pill">${classLabel(p.classId)}</span></div>
        <button class="icon-btn" data-act="sound" aria-label="${p.sound === false ? "Attiva i suoni" : "Spegni i suoni"}">${p.sound === false ? "🔇" : "🔊"}</button>
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
      <h2>Scegli le sfide</h2>
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
    if (!ok.length) { toast("Scegli almeno una sfida con il bollino verde: Matematica o Italiano."); return; }
    game = { subjects: ok, streak: 0, right: 0, listening: false };
    nextQuestion();
  }

  function nextQuestion() {
    game.sid = pick(game.subjects);
    game.q = Questions.next(game.sid, profile.classId);
    game.answered = false; game.chosen = -1; game.mood = "happy"; game.fb = null; game.listening = false;
    renderGame();
    if (profile.autoRead) readQuestion();
  }

  function readQuestion() {
    const q = game.q;
    const ord = ["Prima", "Seconda", "Terza", "Quarta"];
    const txt = toSpeech(q.q) + ". " + q.a.map((a, i) => `${ord[i]}: ${toSpeech(a)}.`).join(" ");
    Voice.speak(txt);
  }

  function renderGame() {
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
        ${(canSpeak || canListen) && !game.answered ? `<div class="tools">
          ${canSpeak ? `<button class="btn ghost" data-act="read">🔊 Ascolta</button>` : ""}
          ${canListen ? `<button class="btn ghost ${game.listening ? "listening" : ""}" data-act="mic">${game.listening ? "🎤 Ti ascolto…" : "🎤 Rispondi a voce"}</button>` : ""}
        </div>` : ""}
      </div>
      <div class="answers">${q.a.map((a, i) => {
        let cls = "";
        if (game.answered) cls = i === q.c ? "right" : i === game.chosen ? "wrong" : "dim";
        return `<button class="ans ${cls}" data-act="ans" data-i="${i}" style="--ac:${ANS_COL[i]}" ${game.answered ? "disabled" : ""}>
          <span class="shape"><span>${SHAPES[i]}</span></span><span>${esc(a)}</span></button>`;
      }).join("")}</div>
      ${fb ? `<div class="card feedback">
        <div class="head"><h2>${esc(fb.title)}</h2><span class="delta ${fb.delta > 0 ? "up" : fb.delta < 0 ? "down" : ""}">${fb.delta > 0 ? "+" : fb.delta < 0 ? "−" : ""}${fb.delta === 0 ? "" : Math.abs(fb.delta) + " min"}</span></div>
        <p>${esc(fb.text)}</p>
        <button class="btn big" data-act="next-q">Avanti ▶</button>
      </div>` : ""}
    </section>`;
  }

  function answer(i) {
    if (!game || game.answered) return;
    Voice.stopSpeaking();
    const q = game.q, ok = i === q.c;
    const r = Credit.answer(ok);
    game.answered = true; game.chosen = i; game.mood = ok ? "cheer" : "sad"; game.listening = false;
    if (ok) { game.streak++; game.right++; } else { game.streak = 0; }
    const th = themeFor(profile.classId);
    let text = q.e || "";
    if (ok && r.delta === 0) text = (text ? text + " " : "") + "Hai già il massimo di oggi, ma continua pure per allenarti!";
    if (!ok && r.delta === 0) text = (text ? text + " " : "") + "I minuti garantiti restano tuoi.";
    game.fb = { title: ok ? pick(PRAISE[th]) : pick(OOPS), delta: r.delta, text };
    renderGame();
    const hero = document.getElementById("hero");
    if (hero) hero.classList.add(ok ? "hop" : "shake");
    if (ok) { Sfx.ok(); sparks(hero); } else { Sfx.no(); }
    window.scrollTo(0, document.body.scrollHeight);
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
  // IMPOSTAZIONI
  // ====================================================================
  function openModal(html) { $modal.innerHTML = `<div class="card sheet">${html}</div>`; $modal.hidden = false; }
  function closeModal() { $modal.hidden = true; $modal.innerHTML = ""; }

  function openSettings() {
    const p = profile;
    openModal(`
      <div class="top">${avatarHtml(p)}<div class="who"><h2>${esc(p.nick)}</h2><span class="pill">${classLabel(p.classId)}</span></div></div>
      <button class="btn alt" data-act="edit">✏️ Cambia nome, classe o compagno</button>
      <button class="btn alt" data-act="editphoto">📷 Cambia foto</button>
      <div class="row-set"><span>Leggi le domande ad alta voce</span><button class="switch ${p.autoRead ? "on" : ""}" data-act="toggle-read" aria-pressed="${!!p.autoRead}">${p.autoRead ? "Sì" : "No"}</button></div>
      <div class="row-set"><span>Suoni</span><button class="switch ${p.sound !== false ? "on" : ""}" data-act="toggle-sound" aria-pressed="${p.sound !== false}">${p.sound !== false ? "Sì" : "No"}</button></div>
      <button class="btn ghost" data-act="reset">🗑 Ricomincia da zero</button>
      <button class="btn" data-act="close">Chiudi</button>`);
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
    mic: () => listenForAnswer(),
    "next-q": () => nextQuestion(),
    exit: () => { Voice.stopSpeaking(); showHome(); },
    // impostazioni
    close: () => closeModal(),
    edit: () => { closeModal(); startWizard(true, 0); },
    editphoto: () => { closeModal(); startWizard(true, 3); },
    "toggle-read": () => { profile.autoRead = !profile.autoRead; Storage.saveProfile(profile); openSettings(); },
    "toggle-sound": () => { profile.sound = profile.sound === false; Storage.saveProfile(profile); openSettings(); renderHome(); },
    reset: () => confirmReset(),
    "reset-yes": () => { Storage.resetAll(); profile = null; closeModal(); Credit.refresh(); startWizard(false); }
  };

  document.addEventListener("click", e => {
    const el = e.target.closest("[data-act]");
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.act];
    if (fn) fn(el);
  });
  $modal.addEventListener("click", e => { if (e.target === $modal) closeModal(); });

  // nuovo giorno: i minuti ripartono dal minimo garantito
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { Voice.stopSpeaking(); return; }
    Credit.refresh();
    if (profile && !wiz && !game) renderHome();
  });

  // ---------- avvio ----------
  function boot() {
    if (profile) {
      if (typeof profile.classId !== "number") { Storage.resetAll(); profile = null; startWizard(false); }
      else {
        selected = subjectsForClass(profile.classId).filter(s => isReady(s.id)).map(s => s.id);
        showHome();
      }
    } else {
      startWizard(false);
    }
  }
  // Nell'app Android si aspetta che i plugin (voce, microfono) siano pronti
  if (window.cordova) document.addEventListener("deviceready", boot, false);
  else boot();
})();
