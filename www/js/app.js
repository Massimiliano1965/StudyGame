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
  let viewClass = null;   // classe degli esercizi scelta nella home (null = la propria)
  let pinCb = null;       // cosa fare dopo che il PIN dei genitori è giusto
  const $narr = document.getElementById("narrate");

  const pick = a => a[Math.floor(Math.random() * a.length)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const themeFor = id => (id == null || id <= 2) ? "piccoli" : id <= 4 ? "ragazzi" : "teen";
  const setTheme = id => { document.body.dataset.theme = themeFor(id); };
  const classLabel = id => CONFIG.CLASSES[id].label;
  const isReady = id => READY_SUBJECTS.includes(id);
  // la classe REALE (profile.classId) è bloccata dal PIN; gli esercizi possono essere di un'altra classe e il premio cambia
  const playClass = () => viewClass == null ? profile.classId : viewClass;
  const relOf = c => c < profile.classId ? -1 : c > profile.classId ? 1 : 0;
  const subsNow = () => subjectsForClass(playClass()).filter(s => isReady(s.id)).map(s => s.id);
  const hashPin = v => { let h = 5381; const t = "gei|" + v + "|2026"; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return "p1" + (h >>> 0).toString(36); };
  // il PIN dei genitori passa anche alla parte nativa: chiede il PIN davanti a Impostazioni di Android e alla disinstallazione
  const syncPin = () => { if (profile && profile.pin) Lock.setPin(profile.pin); syncContacts(); };
  const syncContacts = () => { if (profile && Array.isArray(profile.contacts)) Lock.setContacts(profile.contacts); };
  const presetPin = () => (typeof PIN_PRESET === "string" && PIN_PRESET) || "";
  let pendingPin = "";    // PIN scelto nella prima schermata di una installazione nuova
  let pendingCalm = false; // "figlio fotosensibile": scelta fatta nella schermata di benvenuto
  const pinValid = () => !!wiz && /^\d{4}$/.test(wiz.pin1 || "") && wiz.pin1 === wiz.pin2;

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
      // jingle originale "funky" per l'omino che balla (sincopato, basso + melodia)
      ok: () => play(() => {
        const s = .13;
        [[110,0],[110,2],[131,3],[110,4],[147,6],[131,7]].forEach(([f, k]) => tone(f, k * s, .12, "square", .1));
        [[659,0,.1],[784,1,.1],[659,2,.1],[587,3,.1],[523,4,.1],[587,5,.1],[659,6,.2],[880,8,.35]].forEach(([f, k, d]) => tone(f, k * s, d + .06, "triangle", .2));
      }),
      // fanfara della festa dei traguardi: scala che sale, scintille veloci e accordo finale
      fest: () => play(() => {
        const s = .11;
        [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, k) => tone(f, k * s, .2, "triangle", .22));
        [262, 330, 392, 523].forEach((f, k) => tone(f, k * s * 1.7, .3, "square", .08));
        for (let k = 0; k < 14; k++) tone(1800 + (k % 5) * 260, .9 + k * .05, .06, "sine", .1);
        [523, 659, 784, 1047].forEach(f => tone(f, 1.7, .9, "triangle", .2));
      }),
      no: () => play(() => { tone(220, 0, .18, "sawtooth", .12); tone(165, .14, .26, "sawtooth", .12); }),
      tap: () => play(() => tone(520, 0, .06, "triangle", .12))
    };
  })();

  // Voce OFF = non parla niente, in nessuna schermata, finché non si riaccende dal pulsante in cima
  const _speak = Voice.speak;
  // Tono per personaggio, da piccolo a grandicello: Pufo (acuto) → Bip → Rudy (più grave). f = femmina, m = maschio.
  const VOICE_TONES = {
    creatura:    { f: { pitch: 1.5, rate: 1.0 },  m: { pitch: 1.3, rate: 1.0 } },
    robot:       { f: { pitch: 1.25, rate: 0.97 }, m: { pitch: 1.08, rate: 0.97 } },
    esploratore: { f: { pitch: 1.05, rate: 0.95 }, m: { pitch: 0.88, rate: 0.95 } }
  };
  function applyVoiceStyle() {
    const g = profile && profile.voiceG === "m" ? "m" : "f";
    const fam = profile ? profile.family : (typeof wiz !== "undefined" && wiz && wiz.d && wiz.d.family);
    const t = (VOICE_TONES[fam] || VOICE_TONES.creatura)[g];
    Voice.setStyle({ ...t, g });
  }
  Voice.speak = function (...a) { if (profile && !profile.autoRead) return; applyVoiceStyle(); return _speak.apply(Voice, a); };

  Music.init(() => !!profile && profile.music !== false);
  const JINGLE_GAP = 90000;   // dentro una sfida con tante materie, uno stacchetto al massimo ogni 90 secondi
  let lastJingle = { sid: null, at: 0 };

  Games.setTap(() => Sfx.tap());
  Games.setBoom(() => Sfx.no());
  Games.setAvatar(() => charSvg(profile, "happy"));
  Games.setSpeak(card => Voice.speak(fin(card.sort ? sortSegs(card) : card.words ? oddSegs(card) : vfSegs(card)), msg => toast(msg, 6000)), () => !!(profile && profile.autoRead), () => Voice.canSpeak() && !!(profile && profile.autoRead));

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
    if (fxCalm()) return;
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
  // primo avvio: schermata parlante con i tre compagni, per i più piccoli che ancora non leggono
  function showWelcome() {
    setTheme(null);
    const fams = Characters.FAMILIES;
    $app.innerHTML = `<section class="screen welcome wz">
      ${brandHtml()}
      <div class="center"><h1>Ciao! Benvenuto!</h1></div>
      <div class="trio">${fams.map(f => `<div class="mate">${Characters.svg({ family: f.id, color: Characters.COLORS[fams.indexOf(f) % Characters.COLORS.length].hex, stage: 0, mood: "cheer" })}<b>${esc(f.pet)}</b></div>`).join("")}</div>
      <p class="center muted">Giochiamo insieme e vinciamo minuti di telefono!</p>
      <div class="fx-ask" style="margin:10px 0 14px">
        <p class="center" style="font-size:1.05rem;font-weight:700;margin-bottom:8px">⚠️ Per i genitori: vostro figlio è sensibile alle luci intermittenti (fotosensibile)?</p>
        <p class="center muted" style="font-size:.95rem;margin-bottom:10px">L'app usa colori vivaci e piccoli effetti di luce. Se premete «Sì» vengono attenuati. Si può cambiare quando si vuole da Impostazioni → Effetti e luci.</p>
        <div class="grid2">
          <button class="choice ${pendingCalm ? "sel" : ""}" data-act="fx-yes" data-fx="yes" style="padding:14px 8px"><span style="font-size:1.05rem;font-weight:800">Sì, attenua gli effetti</span></button>
          <button class="choice ${pendingCalm ? "" : "sel"}" data-act="fx-no" data-fx="no" style="padding:14px 8px"><span style="font-size:1.05rem;font-weight:800">No, lascia così</span></button>
        </div>
      </div>
      <button class="btn big flash" data-act="welcome-go">Avanti ▶</button>
    </section>`;
    document.body.classList.toggle("calm", pendingCalm);
    Voice.speak("Ciao! Benvenuto in Gioca e Impara! Io sono Pufo, lui è Bip e lui è Rudy. Giocheremo insieme! Tocca il pulsante che lampeggia.", msg => toast(msg, 6000));
  }

  // scelta "figlio fotosensibile" nella schermata di benvenuto: si aggiorna sul posto (senza ridisegnare, così la voce non riparte)
  function setFxChoice(yes) {
    pendingCalm = !!yes;
    document.body.classList.toggle("calm", pendingCalm);
    document.querySelectorAll(".fx-ask [data-fx]").forEach(b => b.classList.toggle("sel", (b.dataset.fx === "yes") === pendingCalm));
    Sfx.tap();
  }

  // installazione nuova: prima il PIN dei genitori (a meno che sia già deciso dalla build), poi il profilo
  // Ordine: 1) informazioni (restano aperte finché si tocca OK) 2) configurazione genitori (blocco e PIN) 3) profilo del bambino.
  // Nel frattempo esiste un profilo provvisorio (setup:true) che tiene PIN e permessi anche se Android chiude l'app.
  const setupOn = () => !!(profile && profile.setup);
  function beginSetup(yes) {
    pendingAuto = yes;
    profile = { setup: true, autoRead: !!yes, narrAsked: true, sound: true, calm: pendingCalm, infoSeen: true, fxSeen: true };
    Storage.saveProfile(profile);
    setTheme(null);
    $app.innerHTML = `<section class="screen wz">${brandHtml()}</section>`;
    openInfo(true);
  }
  function startChildSetup() {
    closeModal();
    pendingCalm = !!(profile && profile.calm);
    pendingAuto = profile ? profile.autoRead !== false : true;
    startWizard(false);
  }

  function startWizard(editing, step) {
    wiz = {
      step: step || 0, editing: !!editing,
      d: editing && profile ? { ...profile } :
        { nick: "", classId: null, family: "creatura", color: Characters.COLORS[0].hex, photo: null, autoRead: pendingAuto, sound: true, calm: pendingCalm }
    };
    renderWizard();
  }

  function dotsHtml(step) {
    if (wiz && wiz.pinOnly) return "";
    const n = 4;
    return `<div class="dots" aria-label="Passo ${step + 1} di ${n}">${Array.from({ length: n }, (_, i) => `<i class="${i === step ? "on" : ""}"></i>`).join("")}</div>`;
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
        <div class="center"><h1>Ciao! Come ti chiami?</h1><p class="muted" style="margin-top:6px">${smallKids() ? "Dì il tuo nome al microfono, oppure chiedi a mamma o papà di scriverlo." : "Scrivi il tuo nome o un soprannome inventato."}</p></div>
        ${!wiz.editing && smallKids() && Voice.canListen() ? `<button class="btn big alt ${canNickNow || wiz.listening ? "" : "flash"}" data-act="name-mic">${wiz.listening ? "🎤 Ti ascolto…" : "🎤 Tocca e dì il tuo nome"}</button>` : ""}
        <input id="nick" class="field" type="text" inputmode="text" autocomplete="off" autocapitalize="words" maxlength="${CONFIG.NICK_MAX}" placeholder="Il tuo nome" value="${esc(d.nick)}" aria-label="Il tuo nome o soprannome">`;
    } else if (s === 1) {
      canNext = d.classId != null;
      const grp = (title, from, to) => `<div class="group-title">${title}</div><div class="grid2 cls-grid">${CONFIG.CLASSES.slice(from, to).map(c =>
        `<button class="choice ${d.classId === c.id ? "sel" : ""}" data-act="class" data-id="${c.id}"><span class="big-num">${c.short}</span><span>${c.level === "Medie" ? "media" : "elementare"}</span></button>`).join("")}</div>`;
      body = `<div class="center"><h1>Che classe fai?</h1><p class="muted" style="margin-top:6px">Così ti preparo le sfide giuste.${wiz.editing ? "" : " Attenzione: dopo, la classe si cambia solo con il PIN dei genitori."}</p></div>
        ${grp("Elementari", 0, 5)}${grp("Medie", 5, 8)}`;
    } else if (s === 2) {
      const st = d.classId == null ? 0 : d.classId;
      body = `<div class="center"><h1>Scegli il tuo compagno</h1><p class="muted" style="margin-top:6px">Crescerà con te, classe dopo classe!</p></div>
        ${wiz.say ? `<div id="intro" class="bubble intro" style="--tail:${[17, 50, 83][Math.max(0, Characters.FAMILIES.findIndex(f => f.id === d.family))]}%">${esc(wiz.say)}</div>` : ""}
        <div class="grid2" style="grid-template-columns:repeat(3,1fr);gap:10px">${Characters.FAMILIES.map(f =>
          `<button class="choice family ${d.family === f.id ? "sel" : ""}" data-act="family" data-id="${f.id}" aria-label="${f.name}">${Characters.svg({ family: f.id, color: d.color, stage: st, mood: "happy" })}<span><b>${f.pet}</b><small>${f.name}</small></span></button>`).join("")}</div>
        <div class="colors" role="group" aria-label="Colore">${Characters.COLORS.map(c =>
          `<button class="dot ${d.color === c.hex ? "sel" : ""}" data-act="color" data-hex="${c.hex}" style="background:${c.hex}" aria-label="${c.name}"></button>`).join("")}</div>`;
    } else if (s === 3) {
      nextLabel = "Ho finito! ✔";
      body = `<div class="center"><h1>Vuoi metterci la tua foto?</h1><p class="muted" style="margin-top:6px">È facoltativa. La foto resta solo su questo telefono e non viene mai inviata.</p></div>
        ${avatarHtml(d, "xl")}
        ${navigator.camera ? `<div class="btn-row"><button class="btn alt big flash" data-act="photo-cam">📷 Scatta</button><button class="btn alt big" data-act="photo-gal">🖼️ Galleria</button></div>`
          : `<label class="btn alt big flash" for="photo">📷 Scegli una foto</label><input id="photo" type="file" accept="image/*" hidden>`}
        ${d.photo ? `<button class="btn ghost" data-act="nophoto">Togli la foto</button>` : `<p class="muted center">Se non la metti, usi il tuo compagno come avatar.</p>`}`;
    } else {
      nextLabel = "Ho finito! ✔";
      canNext = pinValid();
      body = `<div class="center"><h1>🔐 PIN dei genitori</h1>${wiz.pinFirst ? `<p class="parent-note">👨‍👩‍👧 Chiedi ai tuoi genitori! Queste impostazioni sono molto difficili e vanno fatte da un adulto.</p>` : ""}<p class="muted" style="margin-top:6px">${wiz.pinFirst ? "Genitori: Gioca e Impara blocca le altre app del telefono finché il bambino non guadagna minuti giocando. Scegliete" : "Genitori: scegliete"} un PIN di 4 cifre. Serve per cambiare nome o classe, decidere il tempo di telefono, spegnere il blocco e ricominciare da zero. Non ditelo ai bambini e <b>ricordatelo</b>: se lo dimenticate bisogna reinstallare l'app.</p></div>
        <input id="pin1" class="adult-in" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="PIN (4 cifre)" value="${esc(wiz.pin1 || "")}" aria-label="PIN a 4 cifre">
        <input id="pin2" class="adult-in" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="Ripeti il PIN" value="${esc(wiz.pin2 || "")}" aria-label="Ripeti il PIN" style="margin-top:10px">
        <p class="muted center">Se lo dimenticate, bisogna reinstallare l'app.</p>`;
    }

    $app.innerHTML = `<section class="screen wz">${dotsHtml(s)}${body}
      <div class="nav">
        ${wiz.pinOnly ? (wiz.pinForce ? "" : `<button class="btn ghost" data-act="cancel">Annulla</button>`) : s > 0 ? `<button class="btn ghost" data-act="back">◀ Indietro</button>` : (wiz.editing ? `<button class="btn ghost" data-act="cancel">Annulla</button>` : "")}
        <button id="next" class="btn ${canNext && s !== 3 ? "flash" : ""}" data-act="next" ${canNext ? "" : "disabled"}>${nextLabel}</button>
      </div></section>`;

    const nick = document.getElementById("nick");
    if (nick) {
      nick.addEventListener("input", () => {
        wiz.d.nick = nick.value;
        const nx = document.getElementById("next"), okn = nick.value.trim().length >= 2;
        nx.disabled = !okn; nx.classList.toggle("flash", okn);
      });
    }
    // profilo nuovo: ogni passo si legge da solo, una volta
    if (!wiz.editing) {
      const key = wiz.pinFirst ? "pin" : s;
      wiz.said = wiz.said || {};
      if (!wiz.said[key]) {
        wiz.said[key] = true;
        const t = wiz.pinFirst ? STEP_SAY.pin : stepSay(s);
        if (t && pendingAuto !== false) Voice.speak(t, msg => toast(msg, 6000));
      }
    }
    const p1 = document.getElementById("pin1"), p2 = document.getElementById("pin2");
    if (p1 && p2) {
      const upd = () => { wiz.pin1 = p1.value.replace(/\D/g, ""); wiz.pin2 = p2.value.replace(/\D/g, ""); const nx = document.getElementById("next"); nx.disabled = !pinValid(); nx.classList.toggle("flash", pinValid()); };
      p1.addEventListener("input", upd); p2.addEventListener("input", upd);
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
    const firstTime = !wiz.editing && (!profile || setupOn() && !profile.pin);
    const old = profile || {};
    profile = { ...old, nick: d.nick.trim(), classId: d.classId, family: d.family, color: d.color, photo: d.photo || null,
      autoRead: !!d.autoRead, narrAsked: true,
      sound: d.sound !== false, l2: d.l2 || undefined, infoSeen: seen, calm: !!d.calm,
      pin: pinValid() ? hashPin(wiz.pin1) : (old.pin || pendingPin || presetPin()) };
    pendingPin = "";
    delete profile.setup;
    if (!Storage.saveProfile(profile)) toast("Non riesco a salvare sul telefono: lo spazio è pieno.");
    syncPin();
    applyCalm();
    wiz = null;
    viewClass = null;
    Credit.setLimits(profile.lim, profile.classId); Credit.setClass(profile.classId);
    Credit.refresh();
    selected = subsNow();
    showHome();
    // installazione nuova: i genitori attivano subito il blocco (impostazioni difficili, da adulti)
    if (firstTime && !presetPin() && !profile.pin) setTimeout(openLockOffer, 700);
  }

  // ====================================================================
  // HOME
  // ====================================================================
  const GREET = {
    piccoli: ["Che sfida scegliamo oggi?", "Pronto a giocare? Io sì!", "Oggi impariamo un sacco di cose!"],
    ragazzi: ["Sei in forma? Si parte!", "Quante ne indovini di fila?", "Scegli la sfida, ci penso io al tifo!"],
    teen: ["Pronti? Scegli la sfida.", "Facciamo vedere chi comanda.", "Un'altra serie da record?"]
  };

  // ---- ripresa del gioco: se Android chiude l'app in secondo piano, al ritorno si riparte da dove era ----
  const K_RESUME = "sg2_resume";
  const RESUME_MAX_MS = 6 * 3600 * 1000;
  function saveResume() {
    try {
      if (!game || wiz) return;
      const g = game;
      localStorage.setItem(K_RESUME, JSON.stringify({
        at: Date.now(), day: Storage.today(), classId: profile && profile.classId,
        g: { subjects: g.subjects, streak: g.streak, right: g.right, lastKind: g.lastKind, cls: g.cls, rel: g.rel, sec: g.sec,
          rounds: g.rounds, okCount: g.okCount, loseRun: g.loseRun, help: g.help, helpAt: g.helpAt, nextBreak: g.nextBreak },
        cur: g.answered ? null : plain({ sid: g.sid, q: g.q, round: g.round, practice: !!g.practice })
      }));
    } catch (e) {}
  }
  // copia "pulita" (solo dati); se c'è dentro una funzione non si può salvare e si torna a null
  function plain(o) {
    try {
      let bad = false;
      const t = JSON.stringify(o, (k, v) => { if (typeof v === "function") bad = true; return v; });
      return bad ? null : JSON.parse(t);
    } catch (e) { return null; }
  }
  function clearResume() { try { localStorage.removeItem(K_RESUME); } catch (e) {} }
  function tryResume() {
    let r = null;
    try { r = JSON.parse(localStorage.getItem(K_RESUME)); } catch (e) {}
    clearResume();
    if (Credit.cooling()) return false;
    if (!r || !r.g || r.day !== Storage.today() || Date.now() - r.at > RESUME_MAX_MS || r.classId !== profile.classId) return false;
    const subjects = (r.g.subjects || []).filter(isReady);
    if (!subjects.length) return false;
    setTheme(profile.classId);
    game = Object.assign({ listening: false, round: null }, r.g, { subjects });
    lastJingle = { sid: game.subjects[0], at: Date.now() };   // niente stacchetto al rientro
    const c = r.cur;
    if (c && c.sid && (c.q || c.round) && game.subjects.includes(c.sid)) {
      Games.stop();
      game.sid = c.sid; game.q = c.round ? null : c.q; game.round = c.round || null; game.practice = !!c.practice;
      game.orig = plain({ q: game.q, round: game.round });
      game.answered = false; game.chosen = -1; game.mood = "happy"; game.fb = null; game.listening = false;
      if (game.sid === "lingua2") { L2.use(profile.l2); Voice.setForeign(L2.loc()); } else Voice.setForeign("en-US");
      renderGame();
      return true;
    }
    nextQuestion();
    return true;
  }

  function showHome() {
    Games.stop();
    game = null; cdOpen = false; clearInterval(cdTimer); homeCool = Credit.cooling();
    clearResume();
    setTheme(profile.classId);
    renderHome();
    maybeShowInfo();
  }

  const brandHtml = () => `<div class="brand">${Logo.svg("brand-em")}<span class="b1">Gioca</span><span class="b2">e</span><span class="b3">Impara</span></div>${DEDICA ? `<div class="brand-for">Ideata per ${esc(DEDICA)} ❤️</div>` : ""}`;

  function renderHome() {
    const p = profile, th = themeFor(p.classId);
    const min = Credit.get(), cap = Credit.max(), pct = Math.round(min / cap * 100), mark = Math.round(Credit.minG() / cap * 100);
    const pc = playClass(), rel = relOf(pc), subs = subjectsForClass(pc);
    const hiFull = rel > 0 && Credit.highFull();
    const tag = rel < 0 ? "Più facili: " + Credit.fmtDelta(CONFIG.RIGHT.low) + " min a risposta giusta" : rel > 0 ? (hiFull ? "Tetto di oggi raggiunto: valgono come i tuoi" : "Più difficili: " + Credit.fmtDelta(CONFIG.RIGHT.high) + " min a risposta giusta e nessun minuto perso") : "Il tuo livello: " + Credit.fmtDelta(CONFIG.RIGHT.same) + " min a risposta giusta";
    $app.innerHTML = `<section class="screen">
      ${brandHtml()}
      <div class="top">
        <button class="avatar-btn" data-act="settings" aria-label="Il mio profilo" style="border:0;background:none;padding:0">${avatarHtml(p)}</button>
        <div class="who"><h2>Ciao, ${esc(p.nick)}!</h2><span class="pill">${classLabel(p.classId)}</span></div>
        <button class="icon-btn" data-act="settings" aria-label="Impostazioni"><svg viewBox="0 0 24 24" width="30" height="30" fill="#FFD21F" aria-hidden="true"><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6a.5.5 0 0 0 .1-.6l-2-3.5a.5.5 0 0 0-.6-.2l-2.5 1a7.3 7.3 0 0 0-1.7-1l-.4-2.6a.5.5 0 0 0-.5-.4h-4a.5.5 0 0 0-.5.4l-.4 2.6a7.3 7.3 0 0 0-1.7 1l-2.5-1a.5.5 0 0 0-.6.2l-2 3.5a.5.5 0 0 0 .1.6L4.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6a.5.5 0 0 0-.1.6l2 3.5c.1.2.4.3.6.2l2.5-1c.5.4 1.1.7 1.7 1l.4 2.6c0 .2.2.4.5.4h4c.3 0 .5-.2.5-.4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.5 1c.2.1.5 0 .6-.2l2-3.5a.5.5 0 0 0-.1-.6zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg></button>
      </div>
      <div class="bubble">${esc(pick(GREET[th]))}</div>
      <div id="hero" class="hero" data-act="intro">${charSvg(p, "happy")}</div>
      <div class="card time">
        <div class="row"><h3>Tempo di telefono</h3><span class="muted">oggi</span></div>
        <div class="row"><span class="num">${esc(Credit.format(min))}</span></div>
        <div class="bar" role="img" aria-label="${Math.floor(min)} minuti su ${cap}"><i style="width:${pct}%"></i><b style="left:${mark}%"></b></div>
        <div class="bar-labels"><span>${esc(Credit.format(Credit.minG()))} garantiti</span><span>massimo ${esc(Credit.format(cap))}</span></div>
        ${lockHomeHtml()}
      </div>
      <div class="lvl-box lvl${rel}"><button class="icon-btn" data-act="lvl-down" aria-label="Esercizi più facili" ${pc <= 0 ? "disabled" : ""}>◀</button>
        <div class="lvl-mid"><small>Esercizi di</small><b>${esc(classLabel(pc))}</b><span class="lvl-tag">${esc(tag)}</span></div>
        <button class="icon-btn" data-act="lvl-up" aria-label="Esercizi più difficili" ${pc >= 7 ? "disabled" : ""}>▶</button></div>
      ${cdBannerHtml()}
      <div class="sel-head"><h2>Scegli le sfide</h2>
        <span class="sel-btns"><button class="btn ghost small" data-act="sel-all">✔ Tutte</button><button class="btn ghost small" data-act="sel-none">✖ Nessuna</button></span></div>
      <div class="subjects">${subs.map(s => {
        const ready = isReady(s.id), sel = selected.includes(s.id);
        return `<button class="tile ${ready ? "" : "soon"} ${sel ? "sel" : ""}" data-act="subject" data-id="${s.id}" style="--tc:${s.color}" aria-pressed="${sel}">
          <span class="ic">${s.icon}</span><span>${esc(s.name)}</span>${ready ? "" : "<small>arriva presto</small>"}</button>`;
      }).join("")}</div>
      <div class="dock">
        <button class="btn alt" data-act="surprise">🎲 Sorprendimi</button>
        <button class="btn flash" data-act="play">▶ Gioca!</button>
      </div></section>`;
  }

  // ====================================================================
  // SFIDA (quiz)
  // ====================================================================
  const SHAPES = ["▲", "●", "■", "★"];
  const ANS_COL = ["#FFD23F", "#7ED9FF", "#FF9EC0", "#B9F27A"];
  const PRAISE = { piccoli: ["Bravo!", "Grande!", "Evviva!", "Che forza!"], ragazzi: ["Esatto!", "Centro!", "Che mito!", "Forte!"], teen: ["Boom!", "Esatto!", "Livello su!", "Sei un mostro!"] };
  const OOPS = ["Quasi!", "Ci sei vicino!", "Ci riprovi col prossimo!"];

  // ====================================================================
  // PAUSA DEL CERVELLO (cooldown): dopo una sessione di guadagno, per un po' non si guadagnano altri minuti
  // ====================================================================
  let cdOpen = false, cdTimer = 0, homeCool = false;
  const fmtCd = ms => { const m = Math.max(1, Math.ceil(ms / 60000)), h = Math.floor(m / 60); return h ? `${h} h ${String(m % 60).padStart(2, "0")} min` : `${m} min`; };
  const CD_SAY = "Basta così! Il tuo cervello è esploso! Hai giocato tantissimo. Adesso spegni il telefono e vai a fare qualcos'altro.";
  function showCooldown() {
    Games.stop(); Music.stop(); Voice.stopSpeaking();
    game = null; clearResume(); cdOpen = true;
    setTheme(profile.classId);
    $app.innerHTML = `<section class="screen cd">
      ${brandHtml()}
      <div class="center"><div class="cd-ic">🤯</div><h1>Il tuo cervello è esploso!</h1>
        <p class="muted" style="margin-top:6px">Hai giocato tantissimo. Basta così: spegni il telefono e vai a fare qualcos'altro, a giocare fuori, a leggere, a muoverti.</p></div>
      <div class="cd-box"><small>Gli esercizi tornano tra</small><b id="cd-left">${fmtCd(Credit.cdLeft())}</b></div>
      <p class="center muted">I minuti che hai già guadagnato restano tuoi.</p>
      <button class="btn big flash" data-act="cd-home">🏠 Vai alla home</button>
      <button class="btn ghost" data-act="cd-skip">🙋 Genitori: salta la pausa</button></section>`;
    clearInterval(cdTimer);
    cdTimer = setInterval(cdTick, 1000);
    if (profile.autoRead) Voice.speak(CD_SAY, msg => toast(msg, 6000));
  }
  function cdTick() {
    const el = document.getElementById("cd-left");
    if (!el || !cdOpen) { clearInterval(cdTimer); return; }
    if (!Credit.cooling()) { clearInterval(cdTimer); cdOpen = false; toast("Il cervello si è riposato: si può giocare!", 3500); showHome(); return; }
    el.textContent = fmtCd(Credit.cdLeft());
  }
  const cdBannerHtml = () => Credit.cooling() ? `<p class="cd-banner">🤯 Basta telefono per ora: gli esercizi tornano tra <b id="cd-home-left">${fmtCd(Credit.cdLeft())}</b></p>` : "";

  // la pausa parte a fine esercizio: se il tempo di gioco è raggiunto si avvia ora, e si mostra la schermata
  function cdGate() {
    if (Credit.cooldownDue()) Credit.startCooldown();
    if (Credit.cooling()) { showCooldown(); return true; }
    return false;
  }

  function startGame(ids) {
    if (cdGate()) return;
    const ok = ids.filter(isReady);
    if (!ok.length) { toast("Scegli almeno una sfida con il bollino verde."); return; }
    game = { subjects: ok, streak: 0, right: 0, listening: false, lastKind: "", round: null, cls: playClass(), rel: relOf(playClass()),
      sec: 0, rounds: 0, okCount: 0, loseRun: 0, help: false, helpAt: 0, nextBreak: 2700 };
    lastJingle = { sid: null, at: 0 };
    nextQuestion();
  }

  function nextQuestion() {
    if (cdGate()) return;
    Games.stop();
    game.sid = pick(game.subjects);
    // lingua straniera della voce: inglese, oppure quella scelta nelle Impostazioni per la seconda lingua
    if (game.sid === "lingua2") { L2.use(profile.l2); Voice.setForeign(L2.loc()); }
    else Voice.setForeign("en-US");
    game.round = Games.pick(game.sid, game.cls, game.lastKind, themeFor(profile.classId) === "piccoli" ? CONFIG.GAME_SHARE_SMALL : CONFIG.GAME_SHARE);
    game.lastKind = game.round ? game.round.kind : "quiz";
    game.q = game.round ? null : Questions.next(game.sid, game.cls);
    game.answered = false; game.chosen = -1; game.mood = "happy"; game.fb = null; game.listening = false;
    game.practice = false; game.orig = plain({ q: game.q, round: game.round });
    renderGame();
    saveResume();
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

  // una carta di "Smista nelle scatole": la parola (nella sua lingua) e le due scatole, senza dire dove va
  function sortSegs(card) {
    return [{ t: "Dove va: " }, { t: toSpeech(card.item.t), l: card.item.en ? "en" : "" },
      { t: `? Nella scatola ${toSpeech(card.labels[0])}, o nella scatola ${toSpeech(card.labels[1])}?` }];
  }

  const OPS = { "+": "più", "−": "meno", "×": "per", ":": "diviso", "=": "uguale a", "(": "apri parentesi", ")": "chiudi parentesi" };
  function roundSpeech(r) {
    if (r.speechIntro) return fin([{ t: r.speechIntro + " " }, ...langSegs(r.prompt, r.q0 && r.q0.en)]);
    if (r.kind === "frase") return "Metti le parole in ordine per fare una frase. Le parole sono: " + r.items.map(w => w.replace(/[.,;:!?]/g, "")).join(", ") + ".";
    if (r.kind === "operazione") return (r.problem ? toSpeech(r.prompt) + " " : "") + "Metti in ordine numeri e segni per fare l'operazione. Ci sono: " +
      r.items.map(t => OPS[t] || (/^−\d/.test(t) ? "meno " + t.slice(1) : t)).join(", ") + ".";
    if (r.kind === "corsa") {
      const q = r.q, pos = ["A sinistra: ", "Al centro: ", "A destra: "], segs = [{ t: "Premi Via e porta il personaggio nella corsia giusta. " }, ...langSegs(r.prompt, q && q.en)];
      r.opts.forEach((o, i) => segs.push({ t: " " + pos[i] }, ...ansSegs(q, o), { t: "." }));
      return fin(segs);
    }
    if (r.kind === "vf") return fin([{ t: "Vero o falso. Per ogni frase tocca vero se la risposta è giusta, falso se è sbagliata. Prima frase: " }, ...vfSegs(r.cards[0])]);
    if (r.kind === "scatole") return fin([{ t: `Smista nelle scatole. Metti ogni carta nella scatola giusta: ${toSpeech(r.labels[0])}, oppure ${toSpeech(r.labels[1])}. Trascina la carta o tocca la scatola. Due errori si perdonano, al terzo si perde. Prima carta: ` },
      { t: toSpeech(r.items[0].t), l: r.items[0].en ? "en" : "" }, { t: "." }]);
    if (r.kind === "intruso") return fin([{ t: "Trova l'intruso. Tocca la parola che non c'entra con le altre tre. Primo giro: " }, ...oddSegs(r.rounds[0])]);
    if (r.kind === "lettere" || r.kind === "impiccato") {
      const a = r.ask, intro = r.kind === "lettere" ? "Rimetti in ordine le lettere per formare la parola. " : "Salva l'omino. Indovina la parola toccando le lettere. ";
      const outro = r.kind === "lettere" ? " Tocca le lettere nell'ordine giusto. Due errori si perdonano." : " Due errori si perdonano, al terzo l'omino cade in acqua.";
      if (!a) return fin([{ t: intro + "La parola da trovare corrisponde a: " }, { t: toSpeech(r.clue.l), l: r.eng ? "en" : "" }, { t: ". " + toSpeech(r.hint || "") }]);
      return fin(a.bare ? [{ t: intro + toSpeech(a.text) + outro }]
        : [{ t: intro + toSpeech(a.pre.replace(/«$/, "")) }, { t: toSpeech(r.clue.l), l: r.eng ? "en" : "" }, { t: toSpeech(a.post.replace(/^»/, "")) + outro }]);
    }
    if (r.kind === "linee") {
      const segs = [{ t: "Collega con le linee. " + toSpeech(r.prompt) + " Parole a sinistra: " }];
      r.pairs.forEach((p, i) => segs.push({ t: toSpeech(p.l) + (i < r.pairs.length - 1 ? ", " : "."), l: r.eng ? "en" : "" }));
      segs.push({ t: " Parole a destra: " });
      r.order.forEach((k, i) => segs.push({ t: toSpeech(r.pairs[k].r) + (i < r.order.length - 1 ? ", " : "."), l: r.rEn ? "en" : "" }));
      return fin(segs);
    }
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
    const q = r.q, segs = [{ t: r.kind === "pesca" ? "Pesca il pesce con la risposta giusta. " : r.kind === "talpa" ? "Colpisci la talpa con la risposta giusta. " : r.kind === "taglia" ? "Taglia al volo la risposta giusta, passando il dito sopra. " : "Colpisci il bersaglio con la risposta giusta. " }, ...langSegs(r.prompt, q && q.en), { t: " Le risposte sono: " }];
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
      } else if (r && (r.kind === "lettere" || r.kind === "impiccato") && r.eng) {
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
        <div class="head"><h2>${esc(fb.title)}</h2><span class="delta ${fb.delta > 0 ? "up" : fb.delta < 0 ? "down" : ""}">${fb.delta > 0 ? "+" : fb.delta < 0 ? "−" : ""}${fb.delta === 0 ? "" : Credit.fmtDelta(fb.delta) + " min"}</span></div>
        ${showSol && fb.correct ? `<p class="sol">Soluzione: <b>${esc(fb.correct)}</b></p>` : ""}
        ${fb.tr && fb.tr.length ? `<p class="sol tr">🔤 ${fb.tr.map(x => `<b>${esc(x)}</b>`).join(" · ")}</p>` : ""}
        ${fb.text ? `<p>${esc(fb.text)}</p>` : ""}
        <button class="btn big flash" data-act="next-q">Avanti ▶</button>
        <button class="btn alt big" data-act="repeat-q">🔁 Ripeti questa sfida</button>
        ${game && game.help ? `<button class="btn alt big" data-act="help">🙋 Serve aiuto? Chiama mamma o papà</button>` : ""}
      </div>`;
  }

  // schermata di un gioco (puzzle o tiro a segno)
  new MutationObserver(() => document.body.classList.toggle("playing", !!$app.querySelector(".screen.play"))).observe($app, { childList: true });
  function renderRound() {
    const r = game.round, sub = SUBJECTS.find(s => s.id === game.sid);
    $app.innerHTML = `<section class="screen play">
      <div class="gtop">
        <button class="icon-btn" data-act="exit" aria-label="Esci dalla sfida">✕</button>
        <span class="chip" id="gmins" aria-label="Minuti di oggi">⏱ ${esc(Credit.format(Credit.get()))}</span>
        <span class="chip" id="gstreak" aria-label="Serie di risposte giuste">🔥 ${game.streak}</span>
      </div>
      <div id="hero" class="hero narr">${charSvg(profile, game.mood)}</div>
      <div class="nbub" id="bubble"><span class="bsub" style="--sc:${sub.color}">${sub.icon} ${esc(sub.name)} · ${esc(r.title)}</span>${esc(r.prompt)}</div>
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
    $app.innerHTML = `<section class="screen play quiz">
      <div class="gtop">
        <button class="icon-btn" data-act="exit" aria-label="Esci dalla sfida">✕</button>
        <span class="chip" aria-label="Minuti di oggi">⏱ ${esc(Credit.format(min))}</span>
        <span class="chip" aria-label="Serie di risposte giuste">🔥 ${game.streak}</span>
      </div>
      <div id="hero" class="hero narr">${charSvg(profile, game.mood)}</div>
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

  function finishRound(ok, expl, correct, mistakes, single) {
    Voice.stopSpeaking();
    // esercizio = fino a 3 risposte giuste: con errori consentiti vale 3 − errori; se perde, 0 giuste e le sbagliate si pagano
    const m = typeof mistakes === "number" ? mistakes : null;
    const right = single ? (ok ? 1 : 0) : ok ? (m == null ? 3 : Math.max(0, 3 - m)) : 0;
    const wrong = single ? (ok ? 0 : 1) : ok ? (m == null ? 0 : m) : (m == null ? 1 : Math.max(1, Math.min(3, m)));
    const r = game.practice ? { delta: 0, rel: game.rel } : Credit.result(right, wrong, game.rel);
    game.fest = game.practice ? 0 : (r.milestone || 0);
    if (!game.practice) {
      Stats.round(game.sid, ok, r.rel === 0 && game.rel < 0 ? -1 : game.rel);
      game.rounds++; if (ok) { game.okCount++; game.loseRun = 0; } else game.loseRun++;
    }
    // il piccolo è in difficoltà: 5 sbagliati di fila, oppure più di 20 minuti con meno del 30% di giuste
    if (!game.help && Date.now() - game.helpAt > 600000 &&
        (game.loseRun >= 5 || (game.sec >= 1200 && game.rounds >= 5 && game.okCount / game.rounds < 0.3))) game.help = true;
    game.answered = true; game.mood = ok ? "cheer" : "sad"; game.listening = false;
    if (!game.practice) { if (ok) { game.streak++; game.right++; } else { game.streak = 0; } }
    const th = themeFor(profile.classId);
    let text = expl || "";
    if (!single && ok && m != null && m > 0) text = (text ? text + " " : "") + "Risposte giuste: " + (3 - m) + " su 3.";
    if (game.practice) text = (text ? text + " " : "") + "Ripasso: i minuti non cambiano.";
    else if (ok && r.delta === 0 && Credit.get() >= Credit.max()) text = (text ? text + " " : "") + "Hai già il massimo di oggi, ma continua pure per allenarti!";
    if (!game.practice && !ok && r.delta === 0) text = (text ? text + " " : "") + (r.rel > 0 ? "Livello più alto: non perdi minuti, e provando si impara!" : "I minuti garantiti restano tuoi.");
    if (r.cooldown || Credit.cooldownDue()) text = (text ? text + " " : "") + "Hai giocato tantissimo: il cervello sta per esplodere! Dopo questo esercizio basta, si spegne il telefono.";
    // ogni tanto (circa 1 volta su 3) l'elogio dice anche il nome del bambino: "Bravo, Luca!"
    let title = ok ? pick(PRAISE[th]) : pick(OOPS);
    const nm = (profile.nick || "").trim();
    if (ok && nm && Math.random() < 0.34) title = title.replace(/!$/, "") + ", " + nm + "!";
    // lingue straniere: la traduzione resta anche per iscritto (la voce del telefono non sempre si capisce)
    const rr = game.round; let tr = [];
    if (ok && rr && rr.eng) tr = rr.clue ? [`${rr.clue.l} = ${rr.clue.r}`] : (rr.pairs ? rr.pairs.map(x => `${x.l} = ${x.r}`) : []);
    game.fb = { title, delta: r.delta, text, correct: ok ? "" : (correct || ""), tr };
  }

  // ---- esultanze ----
  const FAILS = ["squash", "ribalta", "cade", "stordito", "tremolio", "sgonfia", "rotola", "svenuto"];
  const CHEERS = ["capriola", "pirouette", "saltoindietro", "ruota", "saltelli", "trottola", "dondolo", "razzo"];
  // effetti luminosi ridotti: dal profilo (genitori) oppure dalle impostazioni del telefono
  function fxCalm() {
    return !!(profile && profile.calm) || !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  function applyCalm() { document.body.classList.toggle("calm", !!(profile && profile.calm)); }
  // contorno della festa: coriandoli, stelline oppure un alone morbido (uno solo per volta, lento, mai lampeggiante)
  function cheerFx(hero) {
    if (fxCalm() || !hero) return;
    const kind = pick(["coriandoli", "stelline", "alone"]);
    if (kind === "stelline") { sparks(hero); return; }
    if (kind === "alone") {
      const a = document.createElement("span");
      a.className = "halo"; hero.appendChild(a);
      setTimeout(() => a.remove(), 2000);
      return;
    }
    const r = hero.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 3;
    const cols = ["#ff5a8a", "#ffd23f", "#4cc9f0", "#7ed957", "#b085ff"];
    for (let i = 0; i < 18; i++) {
      const c = document.createElement("span");
      c.className = "confetto"; c.style.left = cx + "px"; c.style.top = cy + "px";
      c.style.background = pick(cols);
      c.style.setProperty("--dx", (Math.random() * 280 - 140) + "px");
      c.style.setProperty("--dy", (Math.random() * -160 - 20) + "px");
      c.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 1100);
    }
  }

  // sbagliato: il personaggio si schiaccia e piange; giusto: una delle 8 esultanze (capriole, pirouette, ecc.)
  function animateHero(hero, ok) {
    hero.classList.remove("hop", "shake", "squash", "dance", ...FAILS.map(f => "fail-" + f));
    hero.querySelectorAll(".tear,.cry,.halo").forEach(n => n.remove());
    void hero.offsetWidth;
    if (ok) {
      // 8 esultanze diverse, mai la stessa due volte di fila; con gli effetti ridotti: un semplice salto
      let d = pick(CHEERS), g = 0;
      while (d === animateHero.last && g++ < 8) d = pick(CHEERS);
      animateHero.last = d;
      hero.style.setProperty("--dance", fxCalm() ? "cheerhop" : d);
      hero.classList.add("dance");
      cheerFx(hero);
    } else {
      // 8 reazioni diverse all'errore, mai la stessa due volte di fila; con gli effetti ridotti: un semplice tremolio
      let f = pick(FAILS), g = 0;
      while (f === animateHero.lastFail && g++ < 8) f = pick(FAILS);
      animateHero.lastFail = f;
      if (fxCalm()) { hero.classList.add("shake"); return; }
      if (f === "squash") hero.insertAdjacentHTML("beforeend", '<span class="tear l"></span><span class="tear r"></span><span class="cry">😭</span>');
      else if (f === "stordito") hero.insertAdjacentHTML("beforeend", '<span class="cry">💫</span>');
      else if (f === "sgonfia") hero.insertAdjacentHTML("beforeend", '<span class="cry">💨</span>');
      else if (f === "svenuto") hero.insertAdjacentHTML("beforeend", '<span class="cry">😵</span>');
      hero.classList.add(f === "squash" ? "squash" : "fail-" + f);
    }
  }

  // Fumetto animato: ogni tanto il compagno dice una frase (ogni famiglia ha le sue, che cambiano)
  const SAY = {
    esploratore: {   // hip hop
      ok: ["Bella Zio!", "Bro!", "Fra'!", "Hey Bro!", "Che figata!", "Sei un mito!", "Top, Bro!", "Spacchi!", "Daje!", "Tosto!", "Fico!", "Gallo!"],
      no: ["Tranqui, Bro!", "Fra', riprova!", "Zero stress!", "Dai Bro!", "Capita, Fra'!"],
      idle: ["Hey Bro!", "Fra'!", "Bro!", "Bella Zio!", "Si gioca?", "Andiamo, Fra'!"]
    },
    creatura: {      // creature fantasy, per i più piccoli
      ok: ["Evviva!", "Che bravo!", "Bravissimo!", "Wow!", "Sei super!", "Magico!", "Urrà!", "Stupendo!", "Che forza!", "Hai fatto centro!"],
      no: ["Non fa niente!", "Riprova, ce la fai!", "Quasi quasi!", "Coraggio!", "Ci riproviamo?"],
      idle: ["Giochiamo?", "Che bello!", "Sono qui!", "Pronti, via!", "Ciao ciao!", "Che si fa?"]
    },
    robot: {         // robot e spazio
      ok: ["Esatto!", "Calcolo perfetto!", "Missione compiuta!", "Beep, bravo!", "Sistemi al massimo!", "Dati corretti!", "Segnale forte!", "Che precisione!", "Motori accesi!"],
      no: ["Errore, riproviamo!", "Ricalcolo...", "Beep! Riprova!", "Nessun problema!", "Ricarico le batterie!"],
      idle: ["Beep beep!", "Sistemi attivi!", "Pronto a giocare!", "Si parte?", "Antenne alzate!", "Scansione in corso..."]
    }
  };
  function heroSay(hero, kind) {
    const set = hero && profile && SAY[profile.family];
    if (!set) return;
    hero.querySelectorAll(".rudy-say").forEach(n => n.remove());
    const b = document.createElement("span");
    b.className = "rudy-say"; b.setAttribute("aria-hidden", "true");
    let t = pick(set[kind]), g = 0;
    while (t === heroSay.last && g++ < 6) t = pick(set[kind]);   // non ripete mai la stessa frase due volte di fila
    heroSay.last = t; b.textContent = t;
    hero.appendChild(b);
    setTimeout(() => { if (b.parentNode) b.remove(); }, 2700);
  }
  function heroIntro(hero) {
    const f = profile && Characters.FAMILIES.find(x => x.id === profile.family);
    if (!f) return;
    const greet = document.querySelector(".bubble:not(.intro)");
    if (greet) {
      if (!greet.dataset.old) greet.dataset.old = greet.textContent;
      greet.textContent = f.hi;
      greet.classList.remove("intro"); void greet.offsetWidth; greet.classList.add("intro");
      clearTimeout(heroIntro.t);
      heroIntro.t = setTimeout(() => { greet.textContent = greet.dataset.old; delete greet.dataset.old; greet.classList.remove("intro"); }, 4500);
    }
    Voice.speak(f.hi);
  }
  setInterval(() => {
    if (document.hidden) return;
    const h = document.getElementById("hero");
    if (!h || h.classList.contains("squash") || h.classList.contains("dance") || document.querySelector(".bubble")) return;   // in home c'è già il saluto
    const r = h.getBoundingClientRect();
    if (r.bottom < 40 || r.top > innerHeight - 40) return;
    if (Math.random() < 0.5) heroSay(h, "idle");
  }, 16000);

  function afterResult(ok) {
    const hero = document.getElementById("hero");
    if (hero) animateHero(hero, ok);
    if (hero && Math.random() < (ok ? 0.45 : 0.6)) heroSay(hero, ok ? "ok" : "no");
    if (ok) { Sfx.ok(); sparks(hero); } else { Sfx.no(); }
    window.scrollTo(0, document.body.scrollHeight);
    if (game && game.fest) { const fm = game.fest; game.fest = 0; setTimeout(() => celebrate(fm), 1100); }
    // se scorrendo in basso l'omino è uscito dallo schermo, la sua reazione appare un attimo al centro (non blocca i tocchi)
    requestAnimationFrame(() => showHeroFx(ok, hero));
    if (profile.autoRead) Voice.speak(feedbackSpeech(), msg => toast(msg, 6000));
  }


  // ---- festa dei traguardi (3/10/2026): schermo intero, pupazzetto grande, coriandoli, fuochi, striscioni, musichetta e vibrazione ----
  function minLabel(m) {
    const h = Math.floor(m / 60), r = m % 60;
    if (!h) return m + " minuti";
    const ore = h === 1 ? "1 ora" : h + " ore";
    return r === 0 ? ore : r === 30 ? ore + " e mezza" : ore + " e " + r + " minuti";
  }
  function celebrate(m) {
    const old = document.getElementById("fest"); if (old) old.remove();
    const calm = fxCalm();
    const ov = document.createElement("div");
    ov.id = "fest"; ov.className = "fest" + (calm ? " calm" : "");
    const cols = ["#ff5a8a", "#ffd23f", "#4cc9f0", "#7ed957", "#b085ff", "#ff8a1f"];
    let bits = "";
    if (!calm) {
      for (let i = 0; i < 70; i++) bits += `<i class="fc" style="left:${Math.random() * 100}%;background:${cols[i % cols.length]};animation-delay:${(Math.random() * 2.2).toFixed(2)}s;animation-duration:${(2.6 + Math.random() * 2).toFixed(2)}s"></i>`;
      for (let b = 0; b < 6; b++) {
        const x = 12 + Math.random() * 76, y = 10 + Math.random() * 40, c = cols[b % cols.length], d = (0.2 + b * 0.55).toFixed(2);
        let dots = "";
        for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2, rr = 70 + Math.random() * 40; dots += `<u style="--dx:${Math.round(Math.cos(a) * rr)}px;--dy:${Math.round(Math.sin(a) * rr)}px;background:${c};animation-delay:${d}s"></u>`; }
        bits += `<span class="fw" style="left:${x}%;top:${y}%">${dots}</span>`;
      }
    }
    ov.innerHTML = `${bits}<div class="fest-in">
      <div class="fest-banner b1">HAI GUADAGNATO</div>
      <div class="fest-banner b2">${esc(minLabel(m))} DI GIOCO!</div>
      <div id="fest-hero" class="hero">${charSvg(profile, "cheer")}</div>
      <div class="fest-tap">Tocca per continuare</div></div>`;
    document.body.appendChild(ov);
    const h = document.getElementById("fest-hero");
    if (h) animateHero(h, true);
    Sfx.fest();
    try { if (navigator.vibrate) navigator.vibrate(calm ? [200, 100, 200] : [250, 100, 250, 100, 500, 150, 900]); } catch (e) {}
    const close = () => { clearTimeout(t); if (ov.parentNode) ov.remove(); };
    const t = setTimeout(close, 7000);
    ov.addEventListener("click", close);
  }

  function showHeroFx(ok, hero) {
    const old = document.getElementById("hero-fx");
    if (old) old.remove();
    if (hero) {
      const r = hero.getBoundingClientRect();
      if (r.bottom > 40 && r.top < innerHeight - 40) return;   // si vede già: basta quello
    }
    if (!game) return;
    const fx = document.createElement("div");
    fx.id = "hero-fx"; fx.className = "hero fx";
    fx.innerHTML = charSvg(profile, game.mood || (ok ? "cheer" : "happy"));
    document.body.appendChild(fx);
    animateHero(fx, ok);
    if (Math.random() < 0.45) heroSay(fx, ok ? "ok" : "no");
    if (ok) sparks(fx);
    setTimeout(() => { if (fx.parentNode) fx.remove(); }, 2800);
  }

  function answer(i) {
    if (!game || game.answered || game.round) return;
    const q = game.q, ok = i === q.c;
    game.chosen = i;
    finishRound(ok, q.e, q.a[q.c], null, true);
    renderGame();
    afterResult(ok);
  }

  // un gioco è finito: aggiorno minuti, personaggio e riquadro del risultato senza ridisegnare il gioco
  function roundDone(ok, correct, expl, mistakes) {
    if (!game || !game.round || game.answered) return;
    finishRound(ok, expl, correct, mistakes);
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
  // frasi lette a voce durante la creazione del profilo (per chi ancora non sa leggere)
  const STEP_SAY = {
    pin: "Fermo! Questa parte è per i grandi. Chiedi ai tuoi genitori: sono impostazioni molto difficili e le deve fare un adulto.",
    steps: [null,
      "Che classe fai? Tocca il tuo numero. Se non lo sai, chiedi a mamma e papà.",
      "Scegli il tuo compagno: Pufo, Bip o Rudy. Tocca quello che ti piace di più.",
      "Vuoi mettere una fotografia? Tocca la macchina fotografica, oppure fatti aiutare da mamma e papà. Se non vuoi, tocca Ho finito."]
  };

  // la versione con dedica (quella di Pietro, 10 anni) sa già scrivere: niente microfono né aiuto dei genitori per il nome
  const smallKids = () => !(typeof DEDICA === "string" && DEDICA);
  const nameSay = () => !smallKids() ? "Come ti chiami? Scrivi il tuo nome nella casella." : Voice.canListen()
    ? "Come ti chiami? Tocca il microfono e dì il tuo nome. Oppure chiedi a mamma o papà di scrivere il tuo nome."
    : "Come ti chiami? Chiedi a mamma o papà di scrivere il tuo nome.";
  const stepSay = i => i === 0 ? nameSay() : STEP_SAY.steps[i];

  // il nome a voce, per chi ancora non sa scrivere
  function listenName() {
    if (!wiz || wiz.listening || wiz.step !== 0) return;
    Voice.stopSpeaking();
    wiz.listening = true; renderWizard();
    const done = () => { if (wiz) wiz.listening = false; };
    Voice.listen().then(matches => {
      if (!wiz) return;
      done();
      const raw = String((matches && matches[0]) || "").trim()
        .replace(/^(ciao\s+)?(il mio nome è|mi chiamo|mi chiamano|io sono|sono)\s+/i, "");
      let name = (raw.split(/\s+/)[0] || "").replace(/[^A-Za-zÀ-ÿ'\-]/g, "");
      name = (name.charAt(0).toUpperCase() + name.slice(1)).slice(0, CONFIG.NICK_MAX);
      renderWizard();
      if (name.length >= 2) { wiz.d.nick = name; renderWizard(); Voice.speak("Piacere, " + name + "!"); }
      else toast("Non ho capito bene. Riprova, oppure chiedi a mamma o papà di scrivere il tuo nome.", 5000);
    }).catch(() => {
      done(); if (wiz) renderWizard();
      toast("Il microfono non è disponibile. Chiedi a mamma o papà di scrivere il tuo nome.", 5000);
    });
  }

  function askNarration(cb) {
    askCb = cb;
    setTheme(null);
    $app.innerHTML = `<section class="screen wz">
      ${brandHtml()}
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
    if (cdOpen) return CD_SAY;
    if (askCb) return "Vuoi che ti legga le domande? Tocca sì, leggimele, oppure no, grazie.";
    if (wiz && wiz.pinFirst) return STEP_SAY.pin;
    if (wiz) return stepSay(wiz.step) || "";
    if (game) return game.answered && game.fb ? feedbackSpeech() : (game.round ? roundSpeech(game.round) : questionSpeech());
    if (!profile) return "Ciao! Benvenuto in Gioca e Impara! Io sono Pufo, lui è Bip e lui è Rudy. Giocheremo insieme! Tocca il pulsante che lampeggia.";
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
        $mt.innerHTML = m ? '🎵<span class="tx"> Musica ON</span>' : '🎵<span class="tx"> Musica OFF</span>';
        $mt.classList.toggle("off", !m);
        $mt.setAttribute("aria-pressed", String(m));
        $mt.setAttribute("aria-label", m ? "Musica accesa: tocca per spegnerla" : "Musica spenta: tocca per accenderla");
      }
    }
    const show = !!profile && !askCb && Voice.canSpeak();
    $vt.hidden = !show;
    if (!show) return;
    const on = !!profile.autoRead;
    $vt.innerHTML = on ? '🔊<span class="tx"> Voce ON</span>' : '🔇<span class="tx"> Voce OFF</span>';
    $vt.classList.toggle("off", !on);
    $vt.setAttribute("aria-pressed", String(on));
    $vt.setAttribute("aria-label", on ? "Voce accesa: tocca per spegnerla" : "Voce spenta: tocca per accenderla");
  }
  new MutationObserver(() => { refreshVoiceToggle(); refreshNarrate(); }).observe($app, { childList: true });

  // ====================================================================
  // IMPOSTAZIONI
  // ====================================================================
  function openModal(html) { $modal.innerHTML = `<div class="card sheet">${html}</div>`; $modal.hidden = false; }
  function closeModal() { $modal.hidden = true; $modal.innerHTML = ""; lockStepsOpen = false; lockPinStage = false; }

  function openSettings() {
    const p = profile;
    openModal(`
      <div class="top">${avatarHtml(p)}<div class="who"><h2>${esc(p.nick)}</h2><span class="pill">${classLabel(p.classId)}</span></div></div>
      <button class="btn alt" data-act="edit">✏️ Cambia nome o classe</button>
      <button class="btn alt" data-act="editphoto">📷 Cambia foto</button>
      ${L2.codes().length < 2 ? "" : `<div class="row-set l2-set"><span class="set-label">Seconda lingua</span><div class="l2-pick">${L2.codes().map(c => `<button class="switch ${(p.l2 || L2.DEFAULT) === c ? "on" : ""}" data-act="set-l2" data-id="${c}" aria-pressed="${(p.l2 || L2.DEFAULT) === c}"><span class="fl">${L2.LANGS[c].flag}</span><span>${L2.LANGS[c].name}</span></button>`).join("")}</div></div>`}
      <div class="row-set voice-set"><span class="set-label">Voce di ${esc(((Characters.FAMILIES.find(f => f.id === p.family) || {}).pet) || "")}</span><div class="l2-pick"><button class="switch ${p.voiceG !== "m" ? "on" : ""}" data-act="set-voice" data-id="f" aria-pressed="${p.voiceG !== "m"}">👧 Femmina</button><button class="switch ${p.voiceG === "m" ? "on" : ""}" data-act="set-voice" data-id="m" aria-pressed="${p.voiceG === "m"}">👦 Maschio</button><button class="switch" data-act="test-voice">▶ Prova</button></div></div>
      <div class="row-set"><span>Suoni</span><button class="switch ${p.sound !== false ? "on" : ""}" data-act="toggle-sound" aria-pressed="${p.sound !== false}">${p.sound !== false ? "Sì" : "No"}</button></div>
      <div class="row-set"><span>Effetti e luci</span><button class="switch ${p.calm ? "" : "on"}" data-act="toggle-fx" aria-pressed="${!p.calm}">${p.calm ? "Ridotti" : "Sì"}</button></div>
      ${lockBoxHtml()}
      <button class="btn alt" data-act="time-set">⏱ Tempo di telefono (genitori)</button>
      ${Lock.available() ? `<button class="btn alt" data-act="em-open">📞 Numeri per chiamare mamma e papà</button>` : ""}
      <button class="btn alt" data-act="report">📊 Resoconto per i genitori</button>
      <button class="btn ghost" data-act="change-pin">🔐 Cambia PIN dei genitori</button>
      <button class="btn ghost" data-act="info">ℹ️ Avvertenze</button>
      <button class="btn ghost" data-act="reset">🗑 Ricomincia da zero</button>
      <button class="btn" data-act="close">Chiudi</button>`);
    if (Lock.available()) refreshLockBox();
  }

  // ---------- blocco telefono ----------
  function lockHomeHtml() {
    if (!Lock.ready()) return "";
    const av = Credit.available(), left = Lock.get().leftMin;
    return `<div class="lock-home"><div class="lock-state">${left > 0 ? "🔓 Telefono sbloccato: ancora " + left + " min" : "🔒 Telefono in pausa"}</div>
      <button class="btn alt small" data-act="lock-claim" ${av > 0 ? "" : "disabled"}>📱 Usa i miei minuti (${av})</button></div>`;
  }

  function lockBoxHtml() {
    if (!Lock.available()) return "";
    const s = Lock.get();
    let body = `<p class="muted lock-note">Le altre app si aprono solo con i minuti guadagnati qui. Chiamate e sveglia non si bloccano mai. Con la protezione attiva, le Impostazioni di Android e la disinstallazione dell'app chiedono il PIN dei genitori.</p>`;
    if (s.enabled && (!s.overlay || !s.usage)) body += `<button class="btn small flash" data-act="lock-steps">▶ Attiva il blocco, passo dopo passo</button>`;
    if (s.enabled && s.overlay && s.usage) body += `<p class="lock-ok">✅ Blocco attivo${s.emergencyToday ? " · sblocchi di emergenza oggi: " + s.emergencyToday : ""}</p>
      <button class="btn ghost small" data-act="lock-emergency">🆘 Emergenza: sblocca 10 minuti</button>`;
    if (s.enabled && s.overlay && s.usage) body += s.admin
      ? `<p class="lock-ok">🛡️ Protezione dalla disinstallazione attiva</p><button class="btn ghost small" data-act="admin-off">🔓 Togli la protezione (genitori)</button>`
      : `<button class="btn small flash" data-act="lock-admin">🛡️ Attiva la protezione dalla disinstallazione</button>`;
    return `<div class="lock-box" id="lockbox"><div class="row-set"><span>🔒 Blocco telefono</span><button class="switch ${s.enabled ? "on" : ""}" data-act="lock-toggle" aria-pressed="${!!s.enabled}">${s.enabled ? "Sì" : "No"}</button></div>${body}</div>`;
  }



  // dopo la creazione del profilo: le impostazioni del blocco sono difficili, le deve fare un adulto
  function openLockOffer() {
    const blocco = Lock.available() && !Lock.ready();
    const setup = setupOn();
    openModal(`<h2>👨‍👩‍👧 ${setup ? "Configurazione dei genitori" : "Chiedi ai tuoi genitori!"}</h2>
      ${blocco ? `<p class="center">Adesso si attiva il <b>blocco del telefono</b>: le altre app si aprono solo con i minuti guadagnati qui.</p>` : `<p class="center">Adesso serve il <b>PIN dei genitori</b>.</p>`}
      <p class="center">${setup ? "Prima si configura l'app per i genitori (blocco e PIN); poi si crea il profilo del bambino." : "Sono impostazioni <b>molto difficili</b>, vanno fatte da un adulto."}</p>
      <button class="btn big" data-act="lock-offer-go">${setup ? "Avanti ▶" : "Ci sono i miei genitori ▶"}</button>
      <button class="btn ghost small" data-act="lock-offer-later">Più tardi: solo il PIN</button>`);
    lockPinStage = false;
    if (profile && profile.autoRead && !setup) Voice.speak("Chiedi ai tuoi genitori. Sono impostazioni molto difficili e le deve fare un adulto.", () => {});
  }

  // ultimo passo della guida: il PIN dei genitori (il bambino non lo vede)
  let lockPinStage = false;
  function renderParentPin(totalSteps) {
    lockPinStage = true; lockStepsOpen = true;
    openModal(`<div class="step-dots">${Array.from({ length: totalSteps }, (_, i) => `<span class="${i < totalSteps - 1 ? "done" : "now"}"></span>`).join("")}</div>
      <h2>Passo ${totalSteps} di ${totalSteps}</h2>
      <p class="step-name">Il PIN dei genitori</p>
      <p class="muted center" style="font-size:15px;margin:0 0 6px">Gioca e Impara blocca le altre app finché il bambino non guadagna minuti giocando. Il PIN serve per cambiare nome o classe, decidere il tempo di telefono, spegnere il blocco e ricominciare da zero. Non ditelo ai bambini e <b>ricordatelo</b>: se lo dimenticate bisogna reinstallare l'app.</p>
      <input id="lpin1" class="adult-in" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="PIN (4 cifre)" aria-label="PIN a 4 cifre">
      <input id="lpin2" class="adult-in" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="Ripeti il PIN" aria-label="Ripeti il PIN" style="margin-top:8px">
      <button id="lpin-ok" class="btn big" data-act="lock-pin-ok" disabled>Fatto ✔</button>`);
    const a = document.getElementById("lpin1"), b = document.getElementById("lpin2"), ok = document.getElementById("lpin-ok");
    const chk = () => { ok.disabled = !(/^\d{4}$/.test(a.value) && a.value === b.value); };
    a.addEventListener("input", chk); b.addEventListener("input", chk);
  }

  // procedura guidata dei permessi, un passo alla volta: si aggiorna da sola quando si torna dalle impostazioni di Android
  let lockStepsOpen = false;
  function openLockSteps() { lockStepsOpen = true; renderLockSteps(); }
  function renderLockSteps() {
    const s = Lock.get();
    const needPin = !(profile && profile.pin);
    const total = needPin ? 6 : 5;
    const dots = n => `<div class="step-dots">${Array.from({ length: total }, (_, k) => k + 1).map(i => `<span class="${i < n ? "done" : i === n ? "now" : ""}"></span>`).join("")}</div>`;
    lockStepsOpen = true;
    if (lockPinStage) return;   // sta scrivendo il PIN: non ridisegno
    if (s.overlay && s.usage && !s.admin && !(profile && profile.adminLater)) {
      openModal(`${dots(5)}<h2>Passo 5 di ${total}</h2>
        <p class="step-name">Protezione dalla disinstallazione</p>
        <ol class="guide-steps">
          <li><span class="gi">1️⃣</span><span>Tocca <b>«Attiva la protezione»</b> qui sotto.</span></li>
          <li><span class="gi">2️⃣</span><span>Android chiede «Attivare l'amministratore del dispositivo?»: tocca <b>Attiva</b>. Non dà nessun controllo sul telefono.</span></li>
          <li><span class="gi">3️⃣</span><span>Poi l'app non si può più disinstallare, e le Impostazioni di Android chiedono il PIN dei genitori.</span></li>
        </ol>
        <button class="btn big" data-act="lock-admin">🛡️ Attiva la protezione</button>
        <button class="btn ghost small" data-act="lock-admin-later">Non adesso</button>`);
      lockStepsOpen = true;
      return;
    }
    if (s.overlay && s.usage && needPin) { renderParentPin(total); return; }
    if (s.overlay && s.usage) {
      openModal(`<h2>✅ Tutto pronto!</h2><p class="center">Il blocco è attivo: le altre app si aprono solo con i minuti guadagnati qui.</p>
        <button class="btn" data-act="lock-steps-done">Fatto</button>`);
      lockStepsOpen = true;
      return;
    }
    const prof = profile || {};
    const mk = (n, title, items, mainAct, mainLabel, extra) => openModal(`${dots(n)}<h2>Passo ${n} di ${total}</h2>
      <p class="step-name">${title}</p>
      <ol class="guide-steps">${items.map((t, i) => `<li><span class="gi">${i + 1}️⃣</span><span>${t}</span></li>`).join("")}</ol>
      <button class="btn big" data-act="${mainAct}">${mainLabel}</button>${extra || ""}
      <button class="btn ghost small" data-act="lock-steps-done">Più tardi</button>`);
    if (!s.overlay) {
      if (!prof.lkTried) {
        mk(1, "Prima prova: «Mostra sopra le altre app»", [
          "Tocca <b>«Apri la pagina»</b> qui sotto.",
          "Cerca <b>Gioca e Impara</b>, toccalo e prova ad attivare l'interruttore.",
          "Android dirà di no (<b>«Impostazione con restrizioni»</b>): è normale. Chiudi e torna qui."],
          "lock-perm-overlay", "📲 Apri la pagina",
          `<button class="btn alt" data-act="lock-tried">✅ Fatto, Android ha detto di no</button>`);
        return;
      }
      if (!prof.lkUnlocked) {
        mk(2, "Sblocca l'app", [
          "Tocca <b>«Apri Info app»</b> qui sotto.",
          "In alto a destra tocca i <b>tre puntini ⋮</b>.",
          "Tocca <b>«Consenti impostazioni con restrizioni»</b> e conferma con impronta o PIN del telefono."],
          "lock-appinfo", "⚙️ Apri Info app",
          `<button class="btn alt" data-act="lock-unlocked">✅ Fatto, avanti</button>`);
        return;
      }
      mk(3, "Ora attiva «Mostra sopra le altre app»", [
        "Tocca <b>«Apri la pagina»</b> qui sotto.",
        "Cerca <b>Gioca e Impara</b> e attiva l'interruttore: adesso funziona.",
        "Torna qui con la freccia indietro."],
        "lock-perm-overlay", "📲 Apri la pagina",
        `<button class="btn ghost small" data-act="lock-guide">❓ Dice ancora di no: ricomincia dal passo 1</button>`);
      return;
    }
    mk(4, "Attiva «Accesso all'uso»", [
      "Tocca <b>«Apri la pagina»</b> qui sotto.",
      "Cerca <b>Gioca e Impara</b> e attiva l'interruttore.",
      "Torna qui con la freccia indietro."],
      "lock-perm-usage", "📲 Apri la pagina",
      `<button class="btn ghost small" data-act="lock-guide">❓ Dice di no: ricomincia dal passo 1</button>`);
  }

  // guida per «Consenti impostazioni con restrizioni» (Android 13+, app installate a mano)
  function openLockGuide() {
    openModal(`<h2>🔓 «Impostazione con restrizioni»</h2>
      <p class="muted" style="margin:0 0 4px">Succede con le app installate a mano. I <b>tre puntini</b> compaiono solo <b>dopo</b> che Android ha bloccato il permesso:</p>
      <ol class="guide-steps">
        <li><span class="gi">1️⃣</span><span>Prima prova: tocca «Apri la pagina» e prova ad attivare Gioca e Impara. Android lo blocca e scrive «Impostazione con restrizioni»: è normale.</span></li>
        <li><span class="gi">2️⃣</span><span>Torna qui e tocca <b>«Apri Info app»</b>.</span></li>
        <li><span class="gi">3️⃣</span><span>In alto a destra ora ci sono i <b>tre puntini ⋮</b>: toccali.</span></li>
        <li><span class="gi">4️⃣</span><span>Tocca <b>«Consenti impostazioni con restrizioni»</b> e conferma con PIN o impronta.</span></li>
        <li><span class="gi">5️⃣</span><span>Torna ai passi e attiva il permesso: ora funziona.</span></li>
      </ol>
      <button class="btn" data-act="lock-appinfo">⚙️ Apri Info app</button>
      <button class="btn alt" data-act="lock-guide-done">✅ Fatto, torna ai passi</button>`);
  }

  // rilegge lo stato dal telefono e aggiorna riquadro nelle impostazioni e home
  function refreshLockBox() {
    return Lock.status().then(() => {
      const el = document.getElementById("lockbox");
      if (lockStepsOpen && !$modal.hidden) { renderLockSteps(); return; }
      if (el && !$modal.hidden) el.outerHTML = lockBoxHtml();
      if (profile && !setupOn() && !wiz && !game && !askCb) renderHome();
    });
  }

  // PIN dei genitori: serve per cambiare nome/classe, spegnere il blocco e ricominciare da zero
  function pinWait() { const u = (profile && profile.pinLock) || 0; return u > Date.now() ? Math.ceil((u - Date.now()) / 60000) : 0; }
  // ---------- numeri di emergenza: dalla schermata di blocco si può chiamare mamma, papà o un altro numero ----------
  function openContacts() {
    const c = (profile.contacts || []).slice(0, 3), def = ["Mamma", "Papà", "Altro"];
    const row = i => { const x = c[i] || {}; return `<div class="row-set" style="flex-direction:column;align-items:stretch;gap:6px">
      <input id="em-n${i}" class="adult-in" type="text" maxlength="20" autocomplete="off" placeholder="Nome (${def[i]})" value="${esc(x.n || "")}">
      <input id="em-t${i}" class="adult-in" type="tel" inputmode="tel" maxlength="20" autocomplete="off" placeholder="Numero di telefono" value="${esc(x.t || "")}"></div>`; };
    openModal(`<h2>📞 Numeri per chiamare</h2>
      <p class="muted">Quando il telefono è in pausa, questi tre tasti permettono di chiamare lo stesso. Finita la chiamata, il telefono si riblocca. Lascia vuoto un numero per non mostrarlo.</p>
      ${row(0)}${row(1)}${row(2)}
      <button class="btn" data-act="em-save">Salva</button>
      <button class="btn ghost" data-act="close">Annulla</button>`);
  }
  function askPin(title, cb) {
    if (!profile.pin) { cb(); return; }
    const w = pinWait();
    if (w > 0) { toast("Troppi tentativi sbagliati. Riprova tra " + w + " min.", 4000); return; }
    pinCb = cb;
    openModal(`<h2>🔐 ${esc(title)}</h2><p>Inserisci il PIN dei genitori.</p>
      <input id="pin-in" class="adult-in" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="PIN">
      <button class="btn" data-act="pin-go">OK</button>
      <button class="btn ghost" data-act="close">Annulla</button>`);
  }

  const fmtSec = t => { const m = Math.round(t / 60), h = Math.floor(m / 60); return h ? `${h} h ${String(m % 60).padStart(2, "0")} min` : `${m} min`; };
  function openHelp() {
    openModal(`<h2>🙋 Aiuto dei genitori</h2><p>Regala dei minuti oppure togli per oggi la penalità delle risposte sbagliate.</p>
      <div class="btn-row"><button class="btn alt" data-act="gift" data-n="5">🎁 +5 min</button><button class="btn alt" data-act="gift" data-n="10">🎁 +10 min</button><button class="btn alt" data-act="gift" data-n="15">🎁 +15 min</button></div>
      <button class="btn" data-act="nopen">Oggi nessuna penalità</button>
      <button class="btn ghost" data-act="close">Chiudi</button>`);
  }
  // ---------- tempo di telefono: lo decidono i genitori (si arriva qui solo col PIN) ----------
  let timeDraft = null;
  const suggestedMax = () => Credit.bandMax();
  function openTimeSet() {
    const d = timeDraft, st = CONFIG.LIM_STEP;
    const oldSheet = document.querySelector("#modal .sheet"), keepScroll = oldSheet ? oldSheet.scrollTop : 0;
    const [a0, a1] = CONFIG.LIM_MIN_RANGE, [b0, b1] = CONFIG.LIM_MAX_RANGE, [c0, c1] = CONFIG.LIM_PLAY_RANGE;
    const row = (k, label, v, lo, hi, sugg) => `<div class="time-row"><div class="time-lab"><b>${label}</b><small>suggeriti: ${esc(Credit.format(sugg))}</small></div>
      <div class="time-ctl"><button class="icon-btn" data-act="time-adj" data-k="${k}" data-d="${-st}" aria-label="Meno ${label}" ${v <= lo ? "disabled" : ""}>−</button>
      <span class="time-val" aria-live="polite">${esc(Credit.format(v))}</span>
      <button class="icon-btn" data-act="time-adj" data-k="${k}" data-d="${st}" aria-label="Più ${label}" ${v >= hi ? "disabled" : ""}>+</button></div></div>`;
    openModal(`<h2>⏱ Tempo di telefono</h2>
      <p class="muted">Quanto tempo di telefono al giorno lo decidete voi. I valori suggeriti sono prudenti: potete alzarli o abbassarli quando volete.</p>
      ${row("min", "Minuti garantiti", d.min, a0, a1, CONFIG.MIN_MINUTES)}
      <p class="muted time-note">Li ha ogni giorno, anche senza giocare.</p>
      ${row("play", "Esercizi al giorno", d.play, c0, c1, Credit.playSugg())}
      <p class="muted time-note">Dopo tanti minuti di esercizi nella giornata il «cervello esplode»: gli esercizi si fermano per ${esc(Credit.format(CONFIG.COOLDOWN_MIN))}.</p>
      ${row("max", "Massimo al giorno", d.max, Math.max(b0, d.min), b1, suggestedMax())}
      <p class="muted time-note">Oltre questo tetto non si guadagnano altri minuti.</p>
      <button class="btn" data-act="time-save">Salva</button>
      <button class="btn ghost" data-act="time-default">Rimetti i suggeriti</button>
      <button class="btn ghost" data-act="close">Annulla</button>`);
    // la scheda viene ricreata a ogni tocco: rimetti lo scorrimento dov'era, senza farla tornare in cima
    const newSheet = document.querySelector("#modal .sheet"); if (newSheet) newSheet.scrollTop = keepScroll;
  }
  function saveTime(lim) {
    if (lim) profile.lim = lim; else delete profile.lim;
    if (!Storage.saveProfile(profile)) toast("Non riesco a salvare sul telefono: lo spazio è pieno.");
    Credit.setLimits(profile.lim, profile.classId); Credit.refresh();
    closeModal(); renderHome();
    toast(`Salvato: ${Credit.format(Credit.minG())} garantiti, massimo ${Credit.format(Credit.max())}, esercizi ${Credit.format(Credit.playMin())}.`, 4000);
  }

  function openReport() {
    Stats.flush();
    const d = Stats.days(7), t = d[0], pc = (a, b) => (a + b) ? Math.round(a / (a + b) * 100) + "%" : "–";
    const subj = Object.entries(t.subj).map(([id, v]) => { const s = SUBJECTS.find(x => x.id === id); return `<li><span>${s ? s.icon + " " + esc(s.name) : esc(id)}</span><span>✅ ${v[0]} · ❌ ${v[1]}</span></li>`; }).join("");
    const lv = (k, n) => t.lvl[k][0] + t.lvl[k][1] ? `<li><span>${n}</span><span>✅ ${t.lvl[k][0]} · ❌ ${t.lvl[k][1]}</span></li>` : "";
    const rows = d.map(x => `<li><span>${esc(x.date.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" }))}</span><span>${fmtSec(x.sec)} · ✅ ${x.ok} · ❌ ${x.ko}</span></li>`).join("");
    openModal(`<h2>📊 Resoconto di ${esc(profile.nick)}</h2>
      <div class="report">
        <h3>Oggi</h3>
        <ul class="rep-list">
          <li><span>Tempo nell'app</span><span>${fmtSec(t.sec)}</span></li>
          <li><span>Minuti di telefono guadagnati</span><span>${esc(Credit.format(Credit.get()))}</span></li>
          <li><span>Giochi fatti</span><span>${t.rounds}</span></li>
          <li><span>Riusciti</span><span>✅ ${t.ok} (${pc(t.ok, t.ko)})</span></li>
          <li><span>Non riusciti</span><span>❌ ${t.ko}</span></li>
          ${t.gift ? `<li><span>Minuti regalati</span><span>🎁 ${t.gift}</span></li>` : ""}
          ${t.help ? `<li><span>Richieste di aiuto</span><span>🙋 ${t.help}</span></li>` : ""}
        </ul>
        ${subj ? `<h3>Per materia</h3><ul class="rep-list">${subj}</ul>` : ""}
        ${(t.lvl.low[0] + t.lvl.low[1] + t.lvl.same[0] + t.lvl.same[1] + t.lvl.high[0] + t.lvl.high[1]) ? `<h3>Per livello</h3><ul class="rep-list">${lv("low", "⬇ Più facili")}${lv("same", "⭐ Della sua classe")}${lv("high", "⬆ Più difficili")}</ul>` : ""}
        <h3>Ultimi 7 giorni</h3><ul class="rep-list">${rows}</ul>
      </div>
      <button class="btn" data-act="close">Chiudi</button>`);
  }

  function openInfo(setup) {
    openModal(`<h2>ℹ️ Avvertenze e informazioni</h2>
      <p><b>Chi l'ha pensata.</b> Gioca e Impara è stata ideata e creata da <b>Massimiliano Previtali</b>, educatore linguistico con 20 anni di esperienza nell'insegnamento delle lingue.</p>
      <p><b>L'idea.</b> Sono convinto che la ripetizione faccia la perfezione, e che il divertimento abbia un potere d'insegnamento infinitamente superiore a quello «imposto»: ciò che si impara giocando resta. Per questo il nome comincia con «Gioca».</p>
      <p><b>Il telefono: meglio usarlo bene.</b> Sono contrario all'uso spropositato dei cellulari. Ma viviamo in un mondo tecnologico e i bambini la tecnologia la usano comunque: allora cerchiamo di usarla al meglio, e di impedire che la usino male. Qui il tempo di telefono si guadagna: prima si gioca e si impara, poi arriva il tempo per i propri giochi.</p>
      <p><b>Non sostituisce la scuola.</b> Gioca e Impara non sostituisce l'insegnamento né l'aiuto dei genitori: è solo un piccolo aiuto per fissare in mente alcune cose divertendosi, perché la ripetizione è ciò che fa davvero imparare e diventare bravi in qualcosa.</p>
      <p><b>Da dove vengono le domande.</b> Si basano sui programmi ministeriali italiani, consultati su internet: le <i>Indicazioni nazionali per il curricolo della scuola dell'infanzia e del primo ciclo d'istruzione</i> (D.M. 254 del 16 novembre 2012, con il documento di aggiornamento «Indicazioni nazionali e nuovi scenari» del 2018), ancora in vigore nell'anno scolastico 2026/27 per quasi tutte le classi. Le nuove Indicazioni (D.M. 221 del 9 dicembre 2025, Gazzetta Ufficiale n. 21 del 27 gennaio 2026) dal 2026/27 si applicano solo alle classi prime di primaria e media e poi, anno dopo anno, alle altre. Le domande sono state scritte per questa app e possono contenere errori.</p>
      <p><b>Come si guadagnano i minuti.</b> La classe vera si sceglie all'inizio e si cambia solo con il PIN dei genitori. Ogni esercizio vale fino a 3 risposte giuste. Gli esercizi della propria classe danno ${Credit.fmtDelta(CONFIG.RIGHT.same)} minuto a risposta giusta; quelli di classi inferiori ${Credit.fmtDelta(CONFIG.RIGHT.low)} (e le risposte sbagliate costano di più); quelli di classi superiori ${Credit.fmtDelta(CONFIG.RIGHT.high)} e le risposte sbagliate non tolgono niente. Alla 1ª e 2ª elementare le risposte sbagliate non tolgono mai minuti.</p>
      <p><b>Il tempo lo decidono i genitori.</b> Nessuno meglio di mamma e papà sa quanto telefono va bene per il proprio figlio. L'app parte con valori prudenti: ${CONFIG.MIN_MINUTES} minuti garantiti al giorno e un massimo di ${CONFIG.MAX_BY_BAND[0]} minuti alle elementari, ${CONFIG.MAX_BY_BAND[2]} alle medie. Sono solo un suggerimento: si cambiano quando volete, in su o in giù, da <b>Impostazioni → Tempo di telefono</b>, con il PIN dei genitori.</p>
      <p><b>Il cervello che esplode.</b> Anche giocare qui dentro è tempo di schermo. Dopo un certo tempo di esercizi nella giornata (suggeriti: ${CONFIG.PLAY_MIN_BY_CLASS[0]} minuti fino alla 3ª elementare, ${Credit.format(CONFIG.PLAY_MIN_BY_CLASS[3])} in 4ª e 5ª, ${Credit.format(CONFIG.PLAY_MIN_BY_CLASS[5])} alle medie) compare il cervello che esplode e gli esercizi si fermano per ${Credit.format(CONFIG.COOLDOWN_MIN)}; i minuti già guadagnati restano. Anche questo lo decidete voi, dallo stesso posto.</p>
      <p><b>Luci ed effetti.</b> L'app usa colori vivaci, piccoli movimenti e qualche coriandolo, ma niente lampeggi rapidi. Alcune persone, anche bambini, sono sensibili alle luci intermittenti (fotosensibilità, epilessia fotosensibile): se è il vostro caso, o nel dubbio, spegnete gli effetti da <b>Impostazioni → Effetti e luci</b> e parlatene con il medico. Se durante il gioco il bambino ha disturbi (mal di testa, vista offuscata, capogiri), fermatelo subito.</p>
      <p><b>Genitori.</b> Si raccomanda a mamma e papà di tenere sotto controllo i figli quando usano il cellulare, soprattutto se sono piccoli, e di usare sempre buon senso e discrezione sul tempo davanti allo schermo.</p>
      <p><b>Un grazie speciale.</b> A Pietro: è per lui che papà ha pensato questa app, e sarà lui il primo a collaudarla.</p>
      ${setup ? `<button class="btn big flash" data-act="info-setup-ok">Ok, ho letto ▶</button>` : `<button class="btn" data-act="close">Ho capito</button>`}`);
    const sh = document.querySelector("#modal .sheet"); if (sh) sh.scrollTop = 0;
  }

  function maybeShowInfo() {
    if (!profile || (profile.infoSeen && profile.fxSeen) || wiz || askCb) return;
    profile.infoSeen = true; profile.fxSeen = true; Storage.saveProfile(profile);
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
    family: el => {
      wiz.d.family = el.dataset.id;
      const f = Characters.FAMILIES.find(x => x.id === wiz.d.family);
      wiz.say = f ? f.hi : "";
      clearTimeout(wiz.sayT);
      wiz.sayT = setTimeout(() => { if (wiz) wiz.say = ""; const i = document.getElementById("intro"); if (i) i.remove(); }, 4500);
      renderWizard();
      if (f) Voice.speak(f.hi);
    },
    // tocco sul personaggio in home: si presenta
    intro: el => heroIntro(el),
    color: el => { wiz.d.color = el.dataset.hex; renderWizard(); },
    nophoto: () => { wiz.d.photo = null; renderWizard(); },
    back: () => { wiz.step = Math.max(0, wiz.step - 1); renderWizard(); },
    cancel: () => { wiz = null; showHome(); },
    next: () => {
      const d = wiz.d;
      if (wiz.step === 0 && d.nick.trim().length < 2) return;
      if (wiz.step === 1 && d.classId == null) return;
      if (wiz.step < 3) { wiz.step++; renderWizard(); window.scrollTo(0, 0); }
      else if (wiz.pinFirst) { if (!pinValid()) return; pendingPin = hashPin(wiz.pin1); startWizard(false); }
      else { if (wiz.step === 4 && !pinValid()) return; finishWizard(); }
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
    surprise: () => startGame([pick(subjectsForClass(playClass()).filter(s => isReady(s.id))).id]),
    "lvl-down": () => { viewClass = Math.max(0, playClass() - 1); selected = subsNow(); Sfx.tap(); renderHome(); },
    "lvl-up": () => { viewClass = Math.min(7, playClass() + 1); selected = subsNow(); Sfx.tap(); renderHome(); },
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
    "cd-home": () => showHome(),
    "cd-skip": () => {
      if (!profile.pin) { toast("Serve il PIN dei genitori: si imposta da Impostazioni.", 4000); return; }
      askPin("Salta la pausa", () => { Credit.endCooldown(); toast("Pausa saltata dai genitori.", 3000); showHome(); });
    },
    "repeat-q": () => {
      if (!game || !game.orig) return;
      Voice.stopSpeaking(); Games.stop();
      const o = plain(game.orig);
      game.q = o.round ? null : o.q; game.round = o.round || null;
      game.practice = true; game.answered = false; game.chosen = -1; game.mood = "happy"; game.fb = null; game.listening = false;
      renderGame(); saveResume();
      if (profile.autoRead) readQuestion();
    },
    exit: () => { Voice.stopSpeaking(); Music.stop(); showHome(); },
    // impostazioni
    close: () => closeModal(),
    edit: () => askPin("Cambia nome o classe", () => startWizard(true, 0)),
    "change-pin": () => askPin("Cambia PIN", () => { wiz = { step: 4, editing: true, pinOnly: true, pin1: "", pin2: "", d: { ...profile } }; renderWizard(); }),
    "pin-go": () => {
      const el = document.getElementById("pin-in"), v = el ? el.value : "";
      if (profile.pin && hashPin(v) === profile.pin) {
        profile.pinFails = 0; Storage.saveProfile(profile);
        const cb = pinCb; pinCb = null; closeModal(); if (cb) cb(); return;
      }
      profile.pinFails = (profile.pinFails || 0) + 1;
      if (profile.pinFails >= CONFIG.PIN_TRIES) {
        profile.pinFails = 0; profile.pinLock = Date.now() + CONFIG.PIN_PAUSE_MIN * 60000;
        Storage.saveProfile(profile); closeModal();
        toast("PIN sbagliato troppe volte. Pausa di " + CONFIG.PIN_PAUSE_MIN + " minuti.", 4000); return;
      }
      Storage.saveProfile(profile); toast("PIN sbagliato.");
    },
    editphoto: () => { closeModal(); startWizard(true, 3); },
    "sel-all": () => { selected = subsNow(); Sfx.tap(); renderHome(); },
    "sel-none": () => { selected = []; Sfx.tap(); renderHome(); },
    info: () => openInfo(),
    "set-voice": el => { profile.voiceG = el.dataset.id === "m" ? "m" : "f"; Storage.saveProfile(profile); openSettings(); applyVoiceStyle(); _speak.call(Voice, "Ciao! Questa è la mia voce.", msg => toast(msg, 6000)); },
    "test-voice": () => { applyVoiceStyle(); const f = Characters.FAMILIES.find(x => x.id === profile.family); _speak.call(Voice, (f && f.hi) || "Ciao! Giochiamo insieme?", msg => toast(msg, 6000)); },
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
    "toggle-fx": () => { profile.calm = !profile.calm; Storage.saveProfile(profile); applyCalm(); openSettings(); },
    "toggle-sound": () => { profile.sound = profile.sound === false; Storage.saveProfile(profile); openSettings(); renderHome(); },
    "lock-toggle": () => {
      if (Lock.get().enabled) { askPin("Spegni il blocco", () => Lock.setEnabled(false).then(() => { toast("Blocco spento"); openSettings(); renderHome(); })); return; }
      Lock.setEnabled(true).then(st => { if (st.overlay && st.usage) openSettings(); else openLockSteps(); });
    },
    "lock-steps": () => { Lock.status().then(openLockSteps); },
    "lock-restr-ok": () => { profile.lockRestr = true; Storage.saveProfile(profile); renderLockSteps(); },
    "lock-restr-again": () => { profile.lockRestr = false; Storage.saveProfile(profile); renderLockSteps(); },
    "lock-offer-go": () => {
      if (Lock.available() && !Lock.ready()) Lock.setEnabled(true).then(() => openLockSteps());
      else renderParentPin(1);
    },
    "lock-offer-later": () => renderParentPin(1),
    "lock-pin-ok": () => {
      const a = document.getElementById("lpin1"), b = document.getElementById("lpin2");
      if (!a || !/^\d{4}$/.test(a.value) || a.value !== b.value) return;
      profile.pin = hashPin(a.value); profile.pinFails = 0; Storage.saveProfile(profile); syncPin();
      lockPinStage = false;
      openModal(setupOn()
        ? `<h2>✅ Genitori: fatto!</h2><p class="center">Ricordate il PIN. Ora tocca al bambino: creiamo il suo profilo.</p><button class="btn big flash" data-act="lock-steps-done">Avanti ▶</button>`
        : `<h2>✅ Tutto pronto!</h2><p class="center">Ricordate il PIN. Ora si può giocare!</p><button class="btn" data-act="lock-steps-done">Fatto</button>`);
      lockStepsOpen = false; if (!setupOn()) renderHome();
    },
    "info-setup-ok": () => openLockOffer(),
    "lock-steps-done": () => {
      lockStepsOpen = false; lockPinStage = false;
      if (profile && !profile.pin) { renderParentPin(1); return; }
      if (setupOn()) { startChildSetup(); return; }
      closeModal(); renderHome();
    },
    "lock-guide": () => { profile.lkTried = false; profile.lkUnlocked = false; Storage.saveProfile(profile); renderLockSteps(); },
    "lock-tried": () => { profile.lkTried = true; Storage.saveProfile(profile); renderLockSteps(); },
    "lock-unlocked": () => { profile.lkUnlocked = true; Storage.saveProfile(profile); renderLockSteps(); },
    "lock-appinfo": () => { Lock.openAppInfo(); },
    "lock-admin": () => { if (profile) { profile.adminLater = false; Storage.saveProfile(profile); } Lock.requestAdmin(); },
    "lock-admin-later": () => { if (profile) { profile.adminLater = true; Storage.saveProfile(profile); } renderLockSteps(); },
    "admin-off": () => askPin("Togli la protezione", () => Lock.releaseAdmin().then(() => {
      if (profile) { profile.adminLater = true; Storage.saveProfile(profile); }
      toast("Protezione tolta: ora l'app si può disinstallare.", 4500); openSettings();
    })),
    "lock-guide-done": () => { openLockSteps(); },
    "lock-perm-overlay": () => { Lock.openOverlaySettings(); },
    "lock-perm-usage": () => { Lock.openUsageSettings(); },
    "lock-emergency": () => askPin("Sblocca 10 minuti", () => { Lock.emergency().then(() => { toast("Telefono sbloccato per 10 minuti", 4000); refreshLockBox(); }); }),
    "em-open": openContacts,
    "em-save": () => {
      const g = id => (document.getElementById(id) || {}).value || "";
      const list = [0, 1, 2].map(i => ({ n: g("em-n" + i).trim(), t: g("em-t" + i).replace(/[^0-9+*#]/g, "") }));
      profile.contacts = list; Storage.saveProfile(profile); syncContacts();
      toast(list.some(x => x.t) ? "Numeri salvati. Compaiono quando il telefono è in pausa." : "Numeri tolti.", 3500);
      closeModal(); openSettings();
    },
    "lock-claim": () => {
      const n = Credit.claim();
      if (!n) return;
      Lock.unlock(n).then(() => { toast("📱 Telefono sbloccato per " + n + " minuti. Buon divertimento!", 4000); renderHome(); });
    },
    reset: () => askPin("Ricominciare da zero", confirmReset),
    report: () => askPin("Resoconto", openReport),
    "time-set": () => askPin("Tempo di telefono", () => { timeDraft = { min: Credit.minG(), max: Credit.max(), play: Credit.playMin() }; openTimeSet(); }),
    "time-adj": el => {
      if (!timeDraft || !el) return;
      const k = el.dataset.k, d = +el.dataset.d, [a0, a1] = CONFIG.LIM_MIN_RANGE, [b0, b1] = CONFIG.LIM_MAX_RANGE, [c0, c1] = CONFIG.LIM_PLAY_RANGE;
      if (k === "play") timeDraft.play = Math.max(c0, Math.min(c1, timeDraft.play + d));
      else if (k === "min") { timeDraft.min = Math.max(a0, Math.min(a1, timeDraft.min + d)); if (timeDraft.max < timeDraft.min) timeDraft.max = Math.min(b1, timeDraft.min); }
      else timeDraft.max = Math.max(b0, timeDraft.min, Math.min(b1, timeDraft.max + d));
      openTimeSet();
    },
    "time-save": () => { if (timeDraft) saveTime({ min: timeDraft.min, max: timeDraft.max, play: timeDraft.play }); timeDraft = null; },
    "time-default": () => { timeDraft = null; saveTime(null); },
    help: () => askPin("Aiuto dei genitori", openHelp),
    gift: el => {
      const n = +el.dataset.n, got = Credit.gift(n);
      Stats.gift(n); game.help = false; game.helpAt = Date.now(); game.loseRun = 0; Stats.help();
      closeModal(); toast(got > 0 ? "🎁 Regalati " + Credit.fmtDelta(got) + " minuti!" : "Hai già il massimo di oggi.", 3500);
      const m = document.getElementById("gmins"); if (m) m.textContent = "⏱ " + Credit.format(Credit.get());
      const fb = document.querySelector(".feedback"); if (fb) { const b = fb.querySelector('[data-act="help"]'); if (b) b.remove(); }
    },
    nopen: () => {
      Credit.noPenalty(); game.help = false; game.helpAt = Date.now(); game.loseRun = 0; Stats.help();
      closeModal(); toast("Per oggi le risposte sbagliate non tolgono minuti.", 3500);
      const fb = document.querySelector(".feedback"); if (fb) { const b = fb.querySelector('[data-act="help"]'); if (b) b.remove(); }
    },
    "welcome-go": () => beginSetup(true),
    "fx-yes": () => setFxChoice(true),
    "fx-no": () => setFxChoice(false),
    "name-mic": () => listenName(),
    "reset-yes": () => { Lock.setPin(""); Storage.resetAll(); Stats.wipe(); profile = null; viewClass = null; pendingCalm = false; closeModal(); Credit.refresh(); showWelcome(); }
  };

  document.addEventListener("click", e => {
    const el = e.target.closest("[data-act]");
    if (!el || el.disabled) return;
    if (el.dataset.act !== "narrate") Voice.stopSpeaking();
    const fn = actions[el.dataset.act];
    if (fn) fn(el);
  });
  $modal.addEventListener("click", e => { if (e.target === $modal && !setupOn()) closeModal(); });   // durante la prima configurazione non si chiude toccando fuori

  // tempo passato nelle sfide (solo con l'app davanti) + pausa ogni 45 minuti di gioco
  setInterval(() => {
    if (!game || document.hidden) return;
    game.sec++; Stats.tick(); Credit.playTick();
    if (game.sec % 15 === 0) { Stats.flush(); saveResume(); }
    if (game.sec >= game.nextBreak && $modal.hidden) {
      game.nextBreak += 2700;
      Voice.stopSpeaking();
      openModal(`<h2>⏸ Pausa!</h2><p>Hai giocato per tanto tempo. Alzati, muoviti e bevi un po' d'acqua. Poi torni più in forma!</p>
        <button class="btn big flash" data-act="close">Ok, faccio una pausa</button>`);
      if (profile && profile.autoRead) Voice.speak("Pausa! Alzati, muoviti e bevi un po' d'acqua. Poi torni più in forma!");
    }
  }, 1000);

  // pausa del cervello: il conto alla rovescia in home scorre, e quando finisce la home si ridisegna
  setInterval(() => {
    if (!profile || setupOn() || wiz || game || cdOpen || document.hidden || !$modal.hidden) return;
    const c = Credit.cooling();
    if (c !== homeCool) { homeCool = c; renderHome(); return; }
    const el = document.getElementById("cd-home-left");
    if (el) el.textContent = fmtCd(Credit.cdLeft());
  }, 5000);

  // nuovo giorno: i minuti ripartono dal minimo garantito
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { Voice.stopSpeaking(); Stats.flush(); saveResume(); return; }
    Credit.refresh();
    if (Lock.available()) { refreshLockBox(); return; }
    if (profile && !setupOn() && !wiz && !game && !askCb) renderHome();
  });

  // ---------- avvio ----------
  function boot() {
    Splash.done();
    Voice.warmUp();
    refreshNarrate();
    if (Lock.available()) refreshLockBox();
    if (profile && !profile.setup && typeof profile.classId !== "number") { Storage.resetAll(); profile = null; }
    if (!profile) { showWelcome(); return; }
    if (profile.setup) {   // prima configurazione interrotta (Android ha chiuso l'app): si riprende da dove era
      pendingCalm = !!profile.calm; pendingAuto = profile.autoRead !== false;
      applyCalm(); setTheme(null);
      if (profile.pin) { startChildSetup(); return; }
      $app.innerHTML = `<section class="screen wz">${brandHtml()}</section>`;
      openLockOffer();
      return;
    }
    applyCalm();
    Credit.setLimits(profile.lim, profile.classId); Credit.setClass(profile.classId); Credit.refresh();
    selected = subsNow();
    if (!profile.pin && presetPin()) { profile.pin = presetPin(); Storage.saveProfile(profile); }
    syncPin();
    // profili senza PIN (creati prima): i genitori lo scelgono adesso
    const go = () => {
      if (!profile.pin && presetPin()) { profile.pin = presetPin(); Storage.saveProfile(profile); }
      if (profile.pin) { if (!tryResume()) showHome(); return; }
      showHome();
      setTimeout(openLockOffer, 700);   // senza PIN: parte per i genitori (blocco e PIN), mai davanti al bambino come schermata a sé
    };
    if (profile.narrAsked) go();
    else askNarration(yes => { profile.autoRead = yes; profile.narrAsked = true; Storage.saveProfile(profile); go(); });
  }
  // Tasto indietro di Android: torna alla pagina precedente invece di chiudere l'app.
  // Si esce dall'app solo dalla schermata principale (non c'è niente prima).
  function onBack() {
    if (!$modal.hidden) { if (!setupOn()) closeModal(); return; }
    if (cdOpen) { showHome(); return; }
    if (wiz) {
      if (wiz.pinForce) { if (navigator.app && navigator.app.exitApp) navigator.app.exitApp(); return; }
      if (wiz.pinOnly) { wiz = null; showHome(); return; }
      if (wiz.step > 0) { wiz.step--; renderWizard(); window.scrollTo(0, 0); return; }
      if (profile && !setupOn()) { wiz = null; showHome(); return; }
    } else if (game) { Voice.stopSpeaking(); Music.stop(); showHome(); return; }
    if (navigator.app && navigator.app.exitApp) navigator.app.exitApp();
  }

  // Nell'app Android si aspetta che i plugin (voce, microfono) siano pronti
  if (window.cordova) {
    document.addEventListener("deviceready", () => { document.addEventListener("backbutton", onBack, false); document.addEventListener("pause", () => { Stats.flush(); saveResume(); }, false); boot(); }, false);
  } else boot();
})();
