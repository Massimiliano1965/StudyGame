// ===== Controller: collega stato, schermate e moduli =====
(() => {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);
  const RING_LEN = 553; // circonferenza anello countdown (2π·88)
  let state;
  let busy = false;   // evita doppi tap durante il feedback
  let streak = 0;     // risposte giuste di fila
  let playTotalMs = 0;

  const meta = key => SUBJECT_META[key] || { label: key, icon: "📝", color: "#7c3aed", sub: "" };

  // ---------- Navigazione ----------
  function show(id) {
    $$(".screen").forEach(s => (s.hidden = s.id !== id));
    $("#hud").hidden = !(id === "scr-home" || id === "scr-quiz");
  }

  // ---------- HUD ----------
  function renderCredit(credit) {
    $$("[data-credit]").forEach(el => (el.textContent = credit));
    $$("[data-target]").forEach(el => (el.textContent = CONFIG.TARGET));
    $(".bar-fill").style.width = Credit.progress() * 100 + "%";
    const left = CONFIG.TARGET - credit;
    $("#hud-hint").textContent = left > 0
      ? `Ancora ${left} minuti al premio!`
      : "Premio sbloccato!";
  }

  function bumpHud() {
    const c = $(".hud-card");
    c.classList.remove("bump");
    void c.offsetWidth; // riavvia l'animazione
    c.classList.add("bump");
  }

  // ---------- Home ----------
  function renderHome() {
    const box = $("#subjects");
    box.innerHTML = "";
    Object.keys(QUESTIONS).forEach(key => {
      const m = meta(key);
      const b = document.createElement("button");
      b.className = "tile";
      b.innerHTML = `
        <span class="tile-icon" style="background:${m.color}22">${m.icon}</span>
        <span>
          <span class="tile-name" style="color:${m.color}">${m.label}</span><br>
          <span class="tile-sub">${m.sub}</span>
        </span>
        <span class="tile-arrow">›</span>`;
      b.onclick = () => openQuiz(key);
      box.appendChild(b);
    });
    $(".pill-ok").textContent = `✓ giusta +${CONFIG.BONUS}`;
    $(".pill-ko").textContent = `✗ sbagliata −${CONFIG.MALUS}`;
    show("scr-home");
  }

  // ---------- Quiz ----------
  function openQuiz(subject) {
    const m = meta(subject);
    Quiz.start(subject);
    streak = 0;
    renderStreak();
    const tag = $("#quiz-subject");
    tag.textContent = `${m.icon} ${m.label}`;
    tag.style.background = m.color;
    nextQuestion();
    show("scr-quiz");
  }

  function renderStreak() {
    $("#streak").textContent = streak >= 2 ? `🔥 ${streak}` : "";
  }

  function nextQuestion() {
    const q = Quiz.next();
    $("#quiz-text").textContent = q.q;
    const fb = $("#quiz-feedback");
    fb.textContent = "";
    fb.className = "feedback";

    const box = $("#quiz-options");
    box.innerHTML = "";
    q.options.forEach((text, i) => {
      const b = document.createElement("button");
      b.className = "opt";
      b.innerHTML = `<span class="opt-letter">${"ABCD"[i]}</span><span></span><span class="opt-mark"></span>`;
      b.children[1].textContent = text;
      b.onclick = () => handleAnswer(q, i);
      box.appendChild(b);
    });
    busy = false;
  }

  function handleAnswer(q, i) {
    if (busy) return;
    busy = true;

    const ok = i === q.correctIndex;
    const res = Credit.answer(ok, q);
    const buttons = [...$("#quiz-options").children];

    // Segni visivi (non solo colore): ✓ sulla giusta, ✗ sulla scelta sbagliata
    buttons.forEach((b, idx) => {
      if (idx === q.correctIndex) {
        b.classList.add("correct");
        b.querySelector(".opt-mark").textContent = "✓";
      } else if (idx === i) {
        b.classList.add("wrong");
        b.querySelector(".opt-mark").textContent = "✗";
      } else {
        b.classList.add("dim");
      }
    });

    streak = ok ? streak + 1 : 0;
    renderStreak();
    bumpHud();

    const fb = $("#quiz-feedback");
    fb.className = "feedback " + (ok ? "ok" : "ko");
    fb.textContent = ok
      ? `🎉 Bravo! +${res.delta} min`
      : (res.delta < 0 ? `😬 Ops! ${res.delta} min` : "😬 Ops! Riprova");
    if (!ok && navigator.vibrate) navigator.vibrate(150);

    setTimeout(() => (res.reached ? showWin() : nextQuestion()), CONFIG.FEEDBACK_MS);
  }

  // ---------- Vittoria ----------
  function makeConfetti() {
    const box = $(".confetti");
    box.innerHTML = "";
    const colors = ["#fde047", "#fff", "#34d399", "#60a5fa", "#f472b6"];
    for (let i = 0; i < 40; i++) {
      const c = document.createElement("i");
      c.style.left = Math.random() * 100 + "%";
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 2.5 + Math.random() * 3 + "s";
      c.style.animationDelay = -Math.random() * 5 + "s";
      box.appendChild(c);
    }
  }

  function showWin() {
    state.phase = "win";
    Storage.save(state);
    makeConfetti();
    show("scr-win");
    if (navigator.vibrate) navigator.vibrate([100, 80, 100, 80, 300]);
  }

  // ---------- Gioco (countdown) ----------
  function startPlay() {
    const minutes = state.credit;
    state.phase = "play";
    state.playEndsAt = Date.now() + minutes * 60 * 1000;
    state.playTotalMs = minutes * 60 * 1000;
    Storage.save(state);
    Lock.unlock(minutes);
    runCountdown();
  }

  function runCountdown() {
    show("scr-play");
    playTotalMs = state.playTotalMs || Math.max(1, state.playEndsAt - Date.now());
    const ring = $("#ring-fg");
    Timer.start(
      state.playEndsAt,
      left => {
        $("#countdown").textContent = Timer.format(left);
        ring.style.strokeDashoffset = RING_LEN * (1 - left / playTotalMs);
      },
      endPlay
    );
  }

  function endPlay() {
    Lock.lock();
    state.phase = "end";
    state.credit = 0;
    state.playEndsAt = null;
    Storage.save(state);
    renderCredit(0);
    if (navigator.vibrate) navigator.vibrate([400, 200, 400]);
    show("scr-end");
  }

  function restart() {
    const day = state.day;
    state = Storage.fresh();
    // Stesso giorno: niente nuovo bonus, si riparte da 0
    if (day === state.day) state.credit = 0;
    Storage.save(state);
    Credit.init(state);
    Lock.lock();
    renderHome();
  }

  // ---------- Avvio ----------
  function boot() {
    state = Storage.load();
    Credit.onChange(renderCredit);
    Credit.init(state);

    $("#btn-exit").onclick = renderHome;
    $("#btn-premio").onclick = startPlay;
    $("#btn-restart").onclick = restart;

    // Riprende dalla fase salvata
    if (state.phase === "play" && state.playEndsAt > Date.now()) return runCountdown();
    if (state.phase === "play") return endPlay();
    if (state.phase === "win") { makeConfetti(); return show("scr-win"); }
    if (state.phase === "end") return show("scr-end");
    Lock.lock();
    renderHome();
  }

  // Tasto indietro Android: dal quiz torna alla home, altrove non fa niente
  document.addEventListener("backbutton", e => {
    e.preventDefault();
    if (!$("#scr-quiz").hidden) renderHome();
  }, false);

  // Quando l'app torna in primo piano, riallinea il timer
  document.addEventListener("resume", () => {
    if (state && state.phase === "play") {
      state.playEndsAt > Date.now() ? runCountdown() : endPlay();
    }
  }, false);

  if (window.cordova) document.addEventListener("deviceready", boot, false);
  else document.addEventListener("DOMContentLoaded", boot);
})();
