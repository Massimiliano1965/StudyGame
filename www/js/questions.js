// ===== Banca domande =====
// Campi: q (testo), a (opzioni), c (indice risposta giusta 0-based),
// facoltativi: bonus, malus (se assenti valgono quelli di CONFIG).
const QUESTIONS = {
  matematica: [
    { q: "Quanto fa 7 + 8?",            a: ["14", "15", "16"],        c: 1 },
    { q: "Quanto fa 6 × 7?",            a: ["42", "36", "48"],        c: 0 },
    { q: "Quanto fa 81 : 9?",           a: ["8", "9", "7"],           c: 1 },
    { q: "Qual è la metà di 50?",       a: ["20", "30", "25"],        c: 2 },
    { q: "Quanti lati ha un esagono?",  a: ["5", "6", "8"],           c: 1 },
    { q: "Quanto fa 125 − 48?",         a: ["77", "87", "73"],        c: 0, bonus: 5, malus: 3 },
    { q: "Qual è il doppio di 13?",     a: ["23", "26", "36"],        c: 1 },
    { q: "Quanto fa 3/4 di 20?",        a: ["12", "15", "16"],        c: 1, bonus: 5, malus: 3 }
  ],
  italiano: [
    { q: "Quale parola è un verbo?",               a: ["casa", "correre", "bello"],        c: 1 },
    { q: "Qual è il plurale di «uovo»?",           a: ["uovi", "uove", "uova"],            c: 2 },
    { q: "Come si scrive correttamente?",          a: ["qualcuno", "qualcun'o", "qualquno"], c: 0 },
    { q: "Il contrario di «alto» è…",              a: ["grande", "basso", "lungo"],        c: 1 },
    { q: "Quale articolo va con «zaino»?",         a: ["il", "lo", "la"],                  c: 1 },
    { q: "«Ieri ___ al parco.» Completa:",         a: ["vado", "andrò", "sono andato"],    c: 2 },
    { q: "Quale è un aggettivo?",                  a: ["felice", "saltare", "sopra"],      c: 0 },
    { q: "Come si scrive?",                        a: ["c'è", "cè", "c'é"],                c: 0, bonus: 5, malus: 3 }
  ],
  inglese: [
    { q: "«Cat» significa…",                 a: ["cane", "gatto", "topo"],          c: 1 },
    { q: "Come si dice «rosso»?",            a: ["red", "blue", "green"],           c: 0 },
    { q: "«I ___ a student.» Completa:",     a: ["is", "are", "am"],                c: 2 },
    { q: "Come si dice «dieci»?",            a: ["ten", "two", "twelve"],           c: 0 },
    { q: "Il plurale di «child» è…",         a: ["childs", "children", "childes"],  c: 1, bonus: 5, malus: 3 },
    { q: "«Good morning» si usa…",           a: ["di mattina", "di sera", "di notte"], c: 0 },
    { q: "Come si dice «mela»?",             a: ["pear", "apple", "orange"],        c: 1 },
    { q: "«She ___ a dog.» Completa:",       a: ["have", "has", "having"],          c: 1 }
  ]
};

// Aspetto delle materie nella home: nome, icona, colore, sottotitolo
const SUBJECT_META = {
  matematica: { label: "Matematica", icon: "🔢", color: "#3b82f6", sub: "Conti e problemi" },
  italiano:   { label: "Italiano",   icon: "📖", color: "#f97316", sub: "Parole e grammatica" },
  inglese:    { label: "Inglese",    icon: "🇬🇧", color: "#10b981", sub: "Words & phrases" }
};
