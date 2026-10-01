// ===== Domande =====
// Formato: { q, a: [4 risposte], c: indice giusta (0 = prima), e: spiegazione }
// Le risposte vengono mescolate quando la domanda viene mostrata.
// La matematica è generata dal programma (infinita) in base alla classe.

const QBANK = {
  italiano: {
    // 1ª–2ª elementare
    A: [
      { q: "Quale parola comincia con la sillaba «SO»?", a: ["Sole", "Luna", "Mare", "Pane"], c: 0, e: "SO-le comincia proprio con SO." },
      { q: "Quante sillabe ha la parola «farfalla»?", a: ["2", "3", "4", "5"], c: 1, e: "Far-fal-la: tre colpi di tamburo, quindi 3 sillabe." },
      { q: "Qual è il plurale di «gatto»?", a: ["Gatti", "Gatte", "Gatto", "Gattini"], c: 0, e: "Un gatto, tanti gatti." },
      { q: "Quale parola è scritta bene?", a: ["Scuola", "Squola", "Scola", "Scuolla"], c: 0, e: "Si scrive SCUOLA, con la C." },
      { q: "Completa: «Il cane ___ nel giardino.»", a: ["corre", "correre", "corrono", "corsa"], c: 0, e: "Il cane è uno solo, quindi «corre»." },
      { q: "Quale parola ha una lettera doppia?", a: ["Pizza", "Pane", "Sole", "Luna"], c: 0, e: "Pizza ha due Z: z-z." }
    ],
    // 3ª–5ª elementare
    B: [
      { q: "Qual è il contrario di «generoso»?", a: ["Avaro", "Gentile", "Ricco", "Forte"], c: 0, e: "Chi è generoso dona, chi è avaro tiene tutto per sé." },
      { q: "Quale parola è un aggettivo?", a: ["Veloce", "Correre", "Tavolo", "Ieri"], c: 0, e: "«Veloce» dice com'è qualcosa: è un aggettivo." },
      { q: "Nella frase «Luca mangia una mela», chi è il soggetto?", a: ["Luca", "Mangia", "Mela", "Una"], c: 0, e: "Il soggetto è chi compie l'azione: Luca." },
      { q: "Quale verbo racconta qualcosa già successo?", a: ["Ho mangiato", "Mangerò", "Mangio", "Mangiando"], c: 0, e: "«Ho mangiato» è passato." },
      { q: "Quale si scrive correttamente?", a: ["Un'amica", "Un'amico", "Un'zaino", "Un'albero"], c: 0, e: "Davanti a un nome femminile si usa un'. Per «amico» e «albero» basta un." },
      { q: "Quale parola è un nome proprio?", a: ["Roma", "Città", "Fiume", "Montagna"], c: 0, e: "I nomi propri indicano qualcuno o qualcosa di unico e hanno la maiuscola." }
    ],
    // medie
    C: [
      { q: "Quale di queste è una congiunzione?", a: ["Perché", "Sotto", "Bello", "Correre"], c: 0, e: "«Perché» unisce due frasi." },
      { q: "In «Il cane di Marco abbaia forte», «di Marco» è un complemento di…", a: ["Specificazione", "Luogo", "Tempo", "Mezzo"], c: 0, e: "Dice a chi appartiene il cane: specificazione." },
      { q: "Chi ha scritto «I promessi sposi»?", a: ["Alessandro Manzoni", "Dante Alighieri", "Giovanni Pascoli", "Italo Calvino"], c: 0, e: "Lo scrisse Alessandro Manzoni nell'Ottocento." },
      { q: "Che modo verbale è «venissi» in «Se venissi, sarei felice»?", a: ["Congiuntivo", "Indicativo", "Imperativo", "Infinito"], c: 0, e: "«Venissi» è congiuntivo imperfetto." },
      { q: "Quale figura retorica c'è in «Sei una roccia»?", a: ["Metafora", "Similitudine", "Onomatopea", "Iperbole"], c: 0, e: "Non c'è «come»: è una metafora." },
      { q: "In «Maria è più alta di Luca» l'aggettivo è di grado…", a: ["Comparativo di maggioranza", "Superlativo assoluto", "Positivo", "Superlativo relativo"], c: 0, e: "Si confrontano due persone con «più … di»." }
    ]
  },
  inglese: {
    // 1ª–2ª elementare
    A: [
      { q: "Come si dice «gatto» in inglese?", a: ["Cat", "Dog", "Bird", "Fish"], c: 0, e: "Gatto in inglese è cat.", ae: true, en: ["cat"] },
      { q: "Come si dice «rosso» in inglese?", a: ["Red", "Blue", "Green", "Yellow"], c: 0, e: "Rosso in inglese è red.", ae: true, en: ["red"] },
      { q: "Come si dice «tre» in inglese?", a: ["Three", "Two", "Four", "Five"], c: 0, e: "Tre in inglese è three.", ae: true, en: ["three"] },
      { q: "Che cosa significa «apple»?", a: ["Mela", "Pera", "Banana", "Arancia"], c: 0, e: "Apple vuol dire mela.", en: ["apple"] },
      { q: "Come si dice «ciao» in inglese?", a: ["Hello", "Goodbye", "Thanks", "Please"], c: 0, e: "Per salutare si dice hello.", ae: true, en: ["hello"] },
      { q: "Che cosa significa «book»?", a: ["Libro", "Penna", "Zaino", "Banco"], c: 0, e: "Book vuol dire libro.", en: ["book"] }
    ],
    // 3ª–5ª elementare
    B: [
      { q: "Completa: «I ___ a student.»", a: ["am", "is", "are", "be"], c: 0, e: "Con «I» si usa «am»: I am.", ae: true, en: ["I ___ a student", "I am", "I", "am"] },
      { q: "Che cosa significa «Thank you»?", a: ["Grazie", "Prego", "Scusa", "Ciao"], c: 0, e: "Thank you vuol dire grazie.", en: ["Thank you"] },
      { q: "Come si dice «Come ti chiami?» in inglese?", a: ["What's your name?", "How old are you?", "Where are you from?", "How are you?"], c: 0, e: "Per chiedere il nome si dice «What's your name?».", ae: true, en: ["What's your name"] },
      { q: "Completa: «She ___ a cat.»", a: ["has", "have", "haves", "having"], c: 0, e: "Con «she» (lei) si usa «has».", ae: true, en: ["She ___ a cat", "she", "has"] },
      { q: "Quale parola è un giorno della settimana?", a: ["Monday", "Winter", "Green", "Apple"], c: 0, e: "Monday è lunedì.", ae: true, en: ["Monday"] },
      { q: "Che cosa significa «brother»?", a: ["Fratello", "Sorella", "Padre", "Nonno"], c: 0, e: "Brother vuol dire fratello.", en: ["brother"] }
    ],
    // medie
    C: [
      { q: "Completa: «Yesterday I ___ to school.»", a: ["went", "go", "goes", "going"], c: 0, e: "«Yesterday» indica il passato: il passato di go è went.", ae: true, en: ["Yesterday I ___ to school", "Yesterday", "go", "went"] },
      { q: "Qual è il plurale di «child»?", a: ["Children", "Childs", "Childes", "Childrens"], c: 0, e: "Child ha un plurale irregolare: children.", ae: true, en: ["child", "children"] },
      { q: "Completa: «He ___ football every Sunday.»", a: ["plays", "play", "playing", "played"], c: 0, e: "Con he/she/it, al presente, il verbo prende la -s: plays.", ae: true, en: ["He ___ football every Sunday", "he/she/it", "plays"] },
      { q: "Quale frase è corretta?", a: ["There are three books on the table.", "There is three books on the table.", "There am three books on the table.", "There be three books on the table."], c: 0, e: "Con un plurale si usa «there are».", ae: true, en: ["there are"] },
      { q: "Che cosa significa «although»?", a: ["Anche se", "Perché", "Quando", "Dopo"], c: 0, e: "Although vuol dire «anche se».", en: ["although"] },
      { q: "Completa: «If it rains, we ___ at home.»", a: ["will stay", "stayed", "staying", "stays"], c: 0, e: "Dopo «if» + presente si usa will + verbo: will stay.", ae: true, en: ["If it rains, we ___ at home", "if", "will stay", "will"] }
    ]
  }
};

const Questions = (() => {
  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = arr => arr[rnd(0, arr.length - 1)];

  function shuffleWithAnswer(q) {
    const items = q.a.map((t, i) => ({ t, ok: i === q.c }));
    for (let i = items.length - 1; i > 0; i--) {
      const j = rnd(0, i);
      [items[i], items[j]] = [items[j], items[i]];
    }
    const out = { q: q.q, a: items.map(x => x.t), c: items.findIndex(x => x.ok), e: q.e || "" };
    if (q.en) out.en = q.en;   // parole da leggere con voce inglese
    if (q.ae) out.ae = true;   // risposte tutte in inglese
    return out;
  }

  const fmt = n => n < 0 ? "−" + (-n) : String(n);

  // 4 risposte numeriche diverse tra loro, vicine alla giusta
  function numericOptions(correct, spread, neg) {
    const set = new Set([correct]);
    let guard = 0;
    while (set.size < 4 && guard++ < 200) {
      const d = rnd(1, spread) * (Math.random() < 0.5 ? -1 : 1);
      const v = correct + d;
      if (v >= 0 || neg) set.add(v);
    }
    let extra = 1;
    while (set.size < 4) set.add(correct + extra++);
    return [...set].map(fmt);
  }

  function build(q, correct, spread, expl, neg) {
    const opts = numericOptions(correct, spread, neg);
    return shuffleWithAnswer({ q, a: [fmt(correct), ...opts.filter(o => o !== fmt(correct))].slice(0, 4), c: 0, e: expl });
  }


  // ---------- problemini (testo + operazione che li risolve) ----------
  const NAMES = ["Franco", "Giulia", "Marco", "Sara", "Luca", "Anna", "Matteo", "Chiara", "Leo", "Elena", "Paolo", "Marta"];
  const THINGS = ["mele", "biglie", "figurine", "caramelle", "matite", "palloncini", "libri", "adesivi", "pere", "carte"];

  // Ritorna { text, answer, tokens (operazione vera che li risolve), expl }
  function problem(classId) {
    const N = pick(NAMES), T = pick(THINGS);
    const P = (text, answer, toks, expl) => ({ text, answer, tokens: toks.map(x => typeof x === "number" ? fmt(x) : x), expl });
    const gens = [];

    if (classId <= 1) {
      const lim = classId === 0 ? 12 : 60, hi = classId === 0 ? 9 : 30;
      gens.push(() => { const a = rnd(5, lim), b = rnd(1, Math.min(hi, a - 1));
        return P(`${N} ha ${a} ${T} e ne ${pick(["perde", "regala"])} ${b}. Quante ${T} rimangono a ${N}?`, a - b, [a, "−", b, "=", a - b], `${a} meno ${b} fa ${a - b}.`); });
      gens.push(() => { const a = rnd(2, lim - 3), b = rnd(2, hi);
        return P(`${N} ha ${a} ${T} e ne trova altre ${b}. Quante ${T} ha adesso?`, a + b, [a, "+", b, "=", a + b], `${a} più ${b} fa ${a + b}.`); });
      if (classId === 1) {
        gens.push(() => { const a = rnd(10, 50), b = rnd(10, 40);
          return P(`In una scatola ci sono ${a} ${T}, in un'altra ce ne sono ${b}. Quante ${T} ci sono in tutto?`, a + b, [a, "+", b, "=", a + b], `${a} più ${b} fa ${a + b}.`); });
        gens.push(() => { const t = rnd(2, 5), n = rnd(2, 10);
          return P(`${N} prepara ${t} sacchetti con ${n} ${T} ciascuno. Quante ${T} usa in tutto?`, t * n, [t, "×", n, "=", t * n], `${t} per ${n} fa ${t * n}.`); });
      }
    } else if (classId === 2) {
      gens.push(() => { const n = rnd(3, 10), k = rnd(3, 9);
        return P(`Una scatola contiene ${n} ${T}. Quante ${T} ci sono in ${k} scatole?`, k * n, [k, "×", n, "=", k * n], `${k} per ${n} fa ${k * n}.`); });
      gens.push(() => { const n = rnd(2, 10), k = rnd(2, 9);
        return P(`${N} divide ${k * n} ${T} in parti uguali tra ${k} amici. Quante ${T} riceve ogni amico?`, n, [k * n, ":", k, "=", n], `${k * n} diviso ${k} fa ${n}.`); });
      gens.push(() => { const a = rnd(120, 480), b = rnd(20, 110);
        return P(`Un negozio ha ${a} ${T} e ne vende ${b}. Quante ${T} restano?`, a - b, [a, "−", b, "=", a - b], `${a} meno ${b} fa ${a - b}.`); });
    } else if (classId === 3) {
      gens.push(() => { const k = rnd(2, 6), n = rnd(6, 12), b = rnd(3, Math.min(20, k * n - 1));
        return P(`${N} compra ${k} confezioni da ${n} ${T} e ne regala ${b}. Quante ${T} rimangono a ${N}?`, k * n - b, [k, "×", n, "−", b, "=", k * n - b], `${k} per ${n} fa ${k * n}, poi ${k * n} meno ${b} fa ${k * n - b}.`); });
      gens.push(() => { const p = rnd(2, 5), q = rnd(3, 9), k = rnd(2, 5);
        return P(`Una penna costa ${p} euro e un quaderno ${q} euro. Quanto spendi per ${k} penne e un quaderno?`, k * p + q, [k, "×", p, "+", q, "=", k * p + q], `${k} penne costano ${k * p} euro, più ${q} fa ${k * p + q} euro.`); });
    } else {
      const sconto = () => { const x = pick([20, 40, 60, 80, 100, 120, 200]), p = pick(classId === 4 ? [10, 25, 50] : [10, 20, 25, 30, 50]), d = x * p / 100;
        return P(`Un gioco da ${x} euro ha lo sconto del ${p}%. Quanto costa ora?`, x - d, [x, "−", d, "=", x - d], `Lo sconto è ${d} euro: ${x} meno ${d} fa ${x - d}.`); };
      const bici = () => { const n = pick([20, 40, 60, 80, 100]), p = pick([10, 25, 50]), v = n * p / 100;
        return P(`In una scuola ci sono ${n} alunni e il ${p}% va a scuola in bicicletta. Quanti alunni vanno in bicicletta?`, v, [n, "×", p, ":", 100, "=", v], `Il ${p}% di ${n} è ${v}.`); };
      const velocita = () => { const v = pick([40, 50, 60, 80, 90, 100, 120]), t = rnd(2, 5);
        return P(`Un'auto viaggia a ${v} km/h per ${t} ore. Quanti chilometri percorre?`, v * t, [v, "×", t, "=", v * t], `${v} per ${t} fa ${v * t} chilometri.`); };
      if (classId === 4) {
        gens.push(sconto, bici);
        gens.push(() => { const c = rnd(2, 6), s = c * rnd(3, 9), a = rnd(1, s - 1), b = s - a;
          return P(`${N} ha ${a} ${T} e ne riceve altre ${b}, poi le divide in ${c} gruppi uguali. Quante ${T} ci sono in ogni gruppo?`, s / c, ["(", a, "+", b, ")", ":", c, "=", s / c], `${a} più ${b} fa ${s}, poi ${s} diviso ${c} fa ${s / c}.`); });
      } else if (classId === 5) {
        gens.push(sconto, bici, velocita);
      } else if (classId === 6) {
        gens.push(sconto, velocita);
        gens.push(() => { const a = rnd(2, 9), b = rnd(2, 14);
          return P(`La mattina la temperatura è di ${fmt(-a)} gradi. A mezzogiorno è salita di ${b} gradi. Quanti gradi ci sono a mezzogiorno?`, b - a, [fmt(-a), "+", b, "=", b - a], `Parti da ${fmt(-a)} e sali di ${b}: ottieni ${fmt(b - a)}.`); });
      } else {
        gens.push(sconto, velocita);
        gens.push(() => { const a = rnd(2, 9), x = rnd(2, 12), b = rnd(1, 15), c = a * x + b;
          return P(`Pensa a un numero: moltiplicalo per ${a} e aggiungi ${b}. Ottieni ${c}. Qual è il numero?`, x, [a, "×", x, "+", b, "=", c], `${c} meno ${b} fa ${c - b}, poi ${c - b} diviso ${a} fa ${x}.`); });
      }
    }
    return pick(gens)();
  }

  function problemQuiz(classId) {
    const p = problem(classId);
    return build(p.text, p.answer, Math.max(3, Math.round(Math.abs(p.answer) / 5)), p.expl, p.answer < 0);
  }

  // ---------- matematica generata per classe ----------
  function math(classId) {
    if (Math.random() < 0.3) return problemQuiz(classId);
    switch (classId) {
      case 0: { // 1ª el.: fino a 20
        if (Math.random() < 0.5) {
          const a = rnd(1, 9), b = rnd(1, 10);
          return build(`Quanto fa ${a} + ${b}?`, a + b, 3, `${a} più ${b} fa ${a + b}.`);
        }
        const a = rnd(6, 18), b = rnd(1, 5);
        return build(`Hai ${a} biglie e ne regali ${b}. Quante ne restano?`, a - b, 3, `${a} meno ${b} fa ${a - b}.`);
      }
      case 1: { // 2ª el.: fino a 100, tabelline 2-5-10
        const r = Math.random();
        if (r < 0.34) { const a = rnd(11, 59), b = rnd(10, 40); return build(`Quanto fa ${a} + ${b}?`, a + b, 10, `${a} più ${b} fa ${a + b}.`); }
        if (r < 0.67) { const a = rnd(40, 99), b = rnd(10, 39); return build(`Quanto fa ${a} − ${b}?`, a - b, 10, `${a} meno ${b} fa ${a - b}.`); }
        const t = pick([2, 5, 10]), n = rnd(2, 10);
        return build(`Quanto fa ${t} × ${n}?`, t * n, 6, `${t} per ${n} fa ${t * n}.`);
      }
      case 2: { // 3ª el.: tabelline complete, divisioni
        const r = Math.random();
        if (r < 0.5) { const a = rnd(2, 10), b = rnd(2, 10); return build(`Quanto fa ${a} × ${b}?`, a * b, 8, `${a} per ${b} fa ${a * b}.`); }
        if (r < 0.8) { const b = rnd(2, 9), x = rnd(2, 10); return build(`Quanto fa ${b * x} : ${b}?`, x, 3, `${x} per ${b} fa ${b * x}, quindi ${b * x} diviso ${b} fa ${x}.`); }
        const a = rnd(120, 480), b = rnd(100, 390); return build(`Quanto fa ${a} + ${b}?`, a + b, 20, `${a} più ${b} fa ${a + b}.`);
      }
      case 3: { // 4ª el.: moltiplicazioni a più cifre, frazioni di quantità, perimetro
        const r = Math.random();
        if (r < 0.34) { const a = rnd(12, 48), b = rnd(2, 9); return build(`Quanto fa ${a} × ${b}?`, a * b, 12, `${a} per ${b} fa ${a * b}.`); }
        if (r < 0.67) { const d = pick([2, 3, 4, 5]), n = rnd(2, 8) * d; return build(`Quanto è 1/${d} di ${n}?`, n / d, 3, `Si divide ${n} in ${d} parti uguali: ogni parte è ${n / d}.`); }
        const l = rnd(3, 12), h = rnd(2, 9); return build(`Un rettangolo ha i lati di ${l} cm e ${h} cm. Quanto misura il perimetro?`, 2 * (l + h), 4, `Perimetro = 2 × (${l} + ${h}) = ${2 * (l + h)} cm.`);
      }
      case 4: { // 5ª el.: area, percentuali semplici
        const r = Math.random();
        if (r < 0.4) { const l = rnd(3, 15), h = rnd(2, 12); return build(`Quanto misura l'area di un rettangolo di ${l} cm per ${h} cm?`, l * h, 8, `Area = base × altezza = ${l} × ${h} = ${l * h} cm².`); }
        if (r < 0.75) { const p = pick([10, 50, 25]), n = rnd(2, 10) * 20; const v = n * p / 100; return build(`Quanto è il ${p}% di ${n}?`, v, Math.max(3, Math.round(v / 4)), `Il ${p}% di ${n} è ${v}.`); }
        const a = rnd(130, 890), b = rnd(130, 890); return build(`Quanto fa ${a} + ${b}?`, a + b, 30, `${a} più ${b} fa ${a + b}.`);
      }
      case 5: { // 1ª media: potenze, MCD/mcm, multipli
        const r = Math.random();
        if (r < 0.34) { const b = rnd(2, 9), e = pick([2, 3]); return build(`Quanto fa ${b} elevato alla ${e === 2 ? "seconda" : "terza"} (${b}^${e})?`, Math.pow(b, e), Math.max(3, b), `${b}^${e} = ${Array(e).fill(b).join(" × ")} = ${Math.pow(b, e)}.`); }
        if (r < 0.67) { const g = pick([2, 3, 4, 5, 6]), a = g * pick([2, 3]), b = g * pick([5, 7]); return build(`Qual è il MCD (massimo comun divisore) di ${a} e ${b}?`, g, 2, `Il numero più grande che divide sia ${a} che ${b} è ${g}.`); }
        const a = rnd(2, 6), b = rnd(7, 12); return build(`Quanto fa ${a * b} : ${a} + ${b}?`, b + b, 4, `${a * b} : ${a} = ${b}, poi ${b} + ${b} = ${b + b}.`);
      }
      case 6: { // 2ª media: numeri relativi, radici
        const r = Math.random();
        if (r < 0.5) {
          const a = rnd(2, 12), b = rnd(2, 15), ans = -a + b;
          const opts = [...new Set([ans, ans + 2, ans - 2, -ans, ans + 1, ans - 1].map(v => String(v).replace("-", "−")))];
          const right = String(ans).replace("-", "−");
          return shuffleWithAnswer({ q: `Quanto fa −${a} + ${b}?`, a: [right, ...opts.filter(o => o !== right)].slice(0, 4), c: 0, e: `Parti da −${a} e sali di ${b}: ottieni ${right}.` });
        }
        const x = rnd(3, 15); return build(`Quanto vale la radice quadrata di ${x * x}?`, x, 3, `${x} × ${x} = ${x * x}, quindi la radice è ${x}.`);
      }
      default: { // 3ª media: equazioni
        const x = rnd(2, 14), a = rnd(2, 9), b = rnd(1, 20);
        if (Math.random() < 0.5) return build(`Risolvi: x + ${b} = ${x + b}. Quanto vale x?`, x, 3, `x = ${x + b} − ${b} = ${x}.`);
        return build(`Risolvi: ${a}x = ${a * x}. Quanto vale x?`, x, 3, `x = ${a * x} : ${a} = ${x}.`);
      }
    }
  }

  function italian(classId) {
    const band = classId <= 1 ? "A" : classId <= 4 ? "B" : "C";
    return shuffleWithAnswer(pick(QBANK.italiano[band]));
  }

  function english(classId) {
    const band = classId <= 1 ? "A" : classId <= 4 ? "B" : "C";
    return shuffleWithAnswer(pick(QBANK.inglese[band]));
  }

  // Una domanda per la materia e la classe scelte
  function next(subjectId, classId) {
    if (subjectId === "matematica") return math(classId);
    if (subjectId === "italiano") return italian(classId);
    if (subjectId === "inglese") return english(classId);
    return null;
  }

  return { next, problem };
})();
