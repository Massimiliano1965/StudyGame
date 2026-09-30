// ===== Controller: collega stato, schermate e moduli =====
(() => {
  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);
  let state;
  let answered = false;   // evita doppi tap dopo la risposta
  let subject = "all";    // materia selezionata

  const meta = key => SUBJECT_META[key] || { label: key, icon: "fa-pen", color: "#4f46e5" };

  // ---------- Viste ----------
  function showView(id) {
    ["view-quiz", "view-play", "view-end"].forEach(v => ($("#" + v).hidden = v !== id));
    window.scrollTo(0, 0);
  }

  // ---------- Credito e barra ----------
  function renderCredit(credit) {
    $$("[data-credit]").forEach(el => (el.textContent = credit));
    $$("[data-target]").forEach(el => (el.textContent = CONFIG.TARGET));
    const pct = Math.round(Credit.progress() * 100);
    $("#progress-fill").style.width = pct + "%";
    $("#progress-pct").textContent = pct + "%";
    const left = CONFIG.TARGET - credit;
    $("#progress-hint").textContent = left > 0 ? `Mancano ${left} min al premio` : "Premio sbloccato!";
  }

  function animateCard(ok) {
    const c = $("#credit-card");
    c.classList.remove("pulse", "shake");
    void c.offsetWidth; // riavvia l'animazione
    c.classList.add(ok ? "pulse" : "shake");
  }

  // ---------- Schede materie ----------
  function renderTabs() {
    const tabs = [{ key: "all", label: "Tutte", icon: "fa-layer-group", color: null }]
      .concat(Object.keys(QUESTIONS).map(k => ({ key: k, ...meta(k) })));
    const box = $("#tabs");
    box.innerHTML = "";
    tabs.forEach(t => {
      const b = document.createElement("button");
      b.className = "tab" + (t.key === subject ? " active" : "");
      b.innerHTML = `<i class="fa-solid ${t.icon}"${t.color ? ` style="color:${t.color}"` : ""}></i> ${t.label}`;
      b.onclick = () => selectSubject(t.key);
      box.appendChild(b);
    });
  }

  function selectSubject(key) {
    if (answered) return; // non cambia materia mentre si legge la spiegazione
    subject = key;
    renderTabs();
    Quiz.start(subject);
    nextQuestion();
  }

  // ---------- Domande ----------
  function nextQuestion() {
    answered = false;
    const q = Quiz.next();
    const m = meta(q.subject);

    const box = $("#quiz-box");
    box.style.animation = "none"; void box.offsetWidth; box.style.animation = "";

    const cat = $("#q-cat");
    cat.textContent = m.label;
    cat.style.color = m.color;
    cat.style.background = m.color + "1a";
    $("#q-num").textContent = `Domanda #${q.number}`;
    $("#q-text").textContent = q.q;
    $("#feedback").hidden = true;

    const opts = $("#options");
    opts.innerHTML = "";
    q.options.forEach((text, i) => {
      const b = document.createElement("button");
      b.className = "opt";
      b.innerHTML = `<span></span><i class="fa-regular fa-circle"></i>`;
      b.firstChild.textContent = text;
      b.onclick = () => answer(q, i);
      opts.appendChild(b);
    });
  }

  function answer(q, i) {
    if (answered) return;
    answered = true;

    const ok = i === q.correctIndex;
    const res = Credit.answer(ok, q);

    // Evidenzia: icona ✓/✗ oltre al colore
    [...$("#options").children].forEach((b, idx) => {
      const icon = b.querySelector("i");
      if (idx === q.correctIndex) {
        b.classList.add("correct");
        icon.className = "fa-solid fa-circle-check";
      } else if (idx === i) {
        b.classList.add("wrong");
        icon.className = "fa-solid fa-circle-xmark";
      } else {
        b.classList.add("dim");
      }
    });

    animateCard(ok);
    if (!ok && navigator.vibrate) navigator.vibrate(150);

    const fb = $("#feedback");
    fb.className = "feedback " + (ok ? "ok" : "ko");
    $("#fb-icon").className = "fb-icon fa-solid " + (ok ? "fa-circle-check" : "fa-circle-xmark");
    $("#fb-title").textContent = ok
      ? `Risposta corretta! (+${res.delta} min)`
      : `Risposta sbagliata (${res.delta < 0 ? res.delta : "−0"} min)`;
    $("#fb-text").textContent = q.e || "";
    fb.hidden = false;

    if (res.reached) setTimeout(showWin, 900);
  }

  // ---------- Premio ----------
  function showWin() {
    state.phase = "win";
    Storage.save(state);
    $("#modal-win").hidden = false;
    if (navigator.vibrate) navigator.vibrate([100, 80, 100, 80, 300]);
  }

  // ---------- Gioco (countdown, senza pausa) ----------
  function startPlay() {
    const minutes = state.credit;
    state.phase = "play";
    state.playTotalMs = minutes * 60 * 1000;
    state.playEndsAt = Date.now() + state.playTotalMs;
    Storage.save(state);
    $("#modal-win").hidden = true;
    Lock.unlock(minutes);
    runCountdown();
  }

  function runCountdown() {
    showView("view-play");
    const total = state.playTotalMs || Math.max(1, state.playEndsAt - Date.now());
    Timer.start(
      state.playEndsAt,
      left => {
        $("#countdown").textContent = Timer.format(left);
        $("#play-fill").style.width = (left / total) * 100 + "%";
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
    showView("view-end");
  }

  function restart() {
    const day = state.day;
    state = Storage.fresh();
    if (day === state.day) state.credit = 0; // stesso giorno: niente nuovo bonus
    Storage.save(state);
    Credit.init(state);
    Lock.lock();
    showView("view-quiz");
    Quiz.start(subject);
    nextQuestion();
  }

  // ---------- Avvio ----------
  function boot() {
    $("#app-name").textContent = CONFIG.APP_NAME;
    $("#footer-name").textContent = CONFIG.APP_NAME;
    $("#rule-ok").textContent = `+${CONFIG.BONUS}m giusta`;
    $("#rule-ko").textContent = `−${CONFIG.MALUS}m sbagliata`;

    state = Storage.load();
    Credit.onChange(renderCredit);
    Credit.init(state);

    $("#btn-next").onclick = nextQuestion;
    $("#btn-premio").onclick = startPlay;
    $("#btn-restart").onclick = restart;

    renderTabs();
    Quiz.start(subject);
    nextQuestion();

    // Riprende dalla fase salvata
    if (state.phase === "play" && state.playEndsAt > Date.now()) return runCountdown();
    if (state.phase === "play") return endPlay();
    if (state.phase === "end") return showView("view-end");
    showView("view-quiz");
    if (state.phase === "win") return showWin();
    Lock.lock();
  }

  // Tasto indietro Android: non esce dall'app per errore
  document.addEventListener("backbutton", e => e.preventDefault(), false);

  // Quando l'app torna in primo piano, riallinea il timer
  document.addEventListener("resume", () => {
    if (state && state.phase === "play") {
      state.playEndsAt > Date.now() ? runCountdown() : endPlay();
    }
  }, false);

  if (window.cordova) document.addEventListener("deviceready", boot, false);
  else document.addEventListener("DOMContentLoaded", boot);
})();
