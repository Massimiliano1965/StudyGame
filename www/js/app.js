// ===== Controller: collega stato, schermate e moduli =====
(() => {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);
  let state;
  let busy = false; // evita doppi tap durante il feedback

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
  }

  // ---------- Home ----------
  function renderHome() {
    const box = $("#subjects");
    box.innerHTML = "";
    Object.keys(QUESTIONS).forEach(key => {
      const b = document.createElement("button");
      b.className = "btn";
      b.textContent = SUBJECT_LABELS[key] || key;
      b.onclick = () => openQuiz(key);
      box.appendChild(b);
    });
    show("scr-home");
  }

  // ---------- Quiz ----------
  function openQuiz(subject) {
    Quiz.start(subject);
    $("#quiz-subject").textContent = SUBJECT_LABELS[subject] || subject;
    nextQuestion();
    show("scr-quiz");
  }

  function nextQuestion() {
    const q = Quiz.next();
    $("#quiz-text").textContent = q.q;
    $("#quiz-feedback").textContent = "";
    $("#quiz-feedback").className = "feedback";

    const box = $("#quiz-options");
    box.innerHTML = "";
    q.options.forEach((text, i) => {
      const b = document.createElement("button");
      b.className = "btn";
      b.textContent = text;
      b.onclick = () => handleAnswer(q, i, b);
      box.appendChild(b);
    });
    busy = false;
  }

  function handleAnswer(q, i, btn) {
    if (busy) return;
    busy = true;

    const ok = i === q.correctIndex;
    const res = Credit.answer(ok, q);
    const buttons = $("#quiz-options").children;

    btn.classList.add(ok ? "correct" : "wrong");
    if (!ok) buttons[q.correctIndex].classList.add("correct");

    const fb = $("#quiz-feedback");
    fb.className = "feedback " + (ok ? "ok" : "ko");
    fb.textContent = ok
      ? `Giusto! +${res.delta} min`
      : `Sbagliato: ${res.delta} min`;

    setTimeout(() => (res.reached ? showWin() : nextQuestion()), CONFIG.FEEDBACK_MS);
  }

  // ---------- Vittoria ----------
  function showWin() {
    state.phase = "win";
    Storage.save(state);
    show("scr-win");
  }

  // ---------- Gioco (countdown) ----------
  function startPlay() {
    const minutes = state.credit;
    state.phase = "play";
    state.playEndsAt = Date.now() + minutes * 60 * 1000;
    Storage.save(state);
    Lock.unlock(minutes);
    runCountdown();
  }

  function runCountdown() {
    show("scr-play");
    Timer.start(
      state.playEndsAt,
      left => ($("#countdown").textContent = Timer.format(left)),
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
    if (state.phase === "win") return show("scr-win");
    if (state.phase === "end") return show("scr-end");
    Lock.lock();
    renderHome();
  }

  // Tasto indietro Android: in gioco/vittoria non fa uscire per errore
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
