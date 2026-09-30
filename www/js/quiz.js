// ===== Gestione domande: estrazione senza ripetizioni =====
// subject = chiave materia oppure "all" per tutte le materie mescolate
const Quiz = (() => {
  let subject = "all";
  let pool = [];
  let count = 0;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function source() {
    const keys = subject === "all" ? Object.keys(QUESTIONS) : [subject];
    return keys.flatMap(k => QUESTIONS[k].map(q => ({ ...q, subject: k })));
  }

  function start(subj) {
    subject = subj;
    pool = shuffle(source());
    count = 0;
  }

  // Prossima domanda con opzioni mescolate
  function next() {
    if (pool.length === 0) pool = shuffle(source());
    const q = pool.pop();
    const order = shuffle(q.a.map((_, i) => i));
    count++;
    return {
      ...q,
      number: count,
      options: order.map(i => q.a[i]),
      correctIndex: order.indexOf(q.c)
    };
  }

  return { start, next };
})();
