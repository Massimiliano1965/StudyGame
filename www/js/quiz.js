// ===== Gestione domande: estrazione senza ripetizioni =====
const Quiz = (() => {
  let subject = null;
  let pool = [];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function start(subj) {
    subject = subj;
    pool = shuffle(QUESTIONS[subj]);
  }

  // Ritorna la prossima domanda con opzioni mescolate
  function next() {
    if (pool.length === 0) pool = shuffle(QUESTIONS[subject]); // ricomincia il giro
    const q = pool.pop();
    const order = shuffle(q.a.map((_, i) => i));
    return {
      ...q,
      options: order.map(i => q.a[i]),
      correctIndex: order.indexOf(q.c)
    };
  }

  const currentSubject = () => subject;

  return { start, next, currentSubject };
})();
