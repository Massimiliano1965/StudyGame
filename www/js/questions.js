// ===== Banca domande =====
// Campi: q (testo), a (4 opzioni), c (indice risposta giusta, 0 = prima),
//        e (spiegazione mostrata dopo la risposta).
// Facoltativi: bonus, malus (se assenti valgono quelli di CONFIG).
const QUESTIONS = {
  matematica: [
    { q: "Quanto fa 7 × 8?", a: ["54", "56", "64", "48"], c: 1, e: "7 per 8 fa 56." },
    { q: "Se hai 15 mele e ne regali 6, quante te ne restano?", a: ["8", "9", "10", "7"], c: 1, e: "15 meno 6 fa 9." },
    { q: "Qual è la metà di 90?", a: ["40", "45", "50", "35"], c: 1, e: "90 diviso 2 fa 45." },
    { q: "Quanto fa 81 : 9?", a: ["8", "7", "9", "11"], c: 2, e: "9 per 9 fa 81, quindi 81 diviso 9 fa 9." },
    { q: "Quanti lati ha un esagono?", a: ["5", "6", "7", "8"], c: 1, e: "Esa- vuol dire sei: l'esagono ha 6 lati." },
    { q: "Quanto fa 125 − 48?", a: ["77", "87", "73", "83"], c: 0, e: "125 meno 50 fa 75, più 2 fa 77.", bonus: 5, malus: 3 },
    { q: "Quanto fa 3/4 di 20?", a: ["12", "15", "16", "10"], c: 1, e: "Un quarto di 20 è 5, tre quarti sono 15.", bonus: 5, malus: 3 },
    { q: "Un'ora quanti minuti ha?", a: ["100", "30", "60", "24"], c: 2, e: "Un'ora dura 60 minuti." }
  ],
  italiano: [
    { q: "Qual è il plurale di «lupo»?", a: ["Lupi", "Lupe", "Lupetti", "Lupo"], c: 0, e: "I nomi maschili in -o fanno il plurale in -i: lupo, lupi." },
    { q: "Qual è il verbo in «Il gatto dorme sul divano»?", a: ["Gatto", "Dorme", "Divano", "Sul"], c: 1, e: "«Dorme» è l'azione che fa il gatto: è il verbo." },
    { q: "Qual è un sinonimo di «felice»?", a: ["Triste", "Stanco", "Contento", "Veloce"], c: 2, e: "«Contento» vuol dire quasi la stessa cosa di «felice»." },
    { q: "Qual è il plurale di «uovo»?", a: ["Uovi", "Uove", "Uova", "Uovo"], c: 2, e: "«Uovo» è irregolare: al plurale diventa «uova»." },
    { q: "Quale articolo va con «zaino»?", a: ["Il", "Lo", "La", "L'"], c: 1, e: "Davanti a parole che iniziano con z si usa «lo»." },
    { q: "Come si scrive correttamente?", a: ["Cè", "C'é", "C'è", "Ce'"], c: 2, e: "«C'è» è «ci è» con l'apostrofo, e la è ha l'accento grave." },
    { q: "Qual è il contrario di «alto»?", a: ["Grande", "Basso", "Lungo", "Largo"], c: 1, e: "Il contrario di alto è basso." },
    { q: "Completa: «Ieri ___ al parco.»", a: ["vado", "andrò", "sono andato", "andiamo"], c: 2, e: "«Ieri» è passato, quindi serve un verbo al passato." }
  ],
  inglese: [
    { q: "Come si dice «cane» in inglese?", a: ["Cat", "Dog", "Bird", "Rabbit"], c: 1, e: "«Dog» significa cane." },
    { q: "Che colore è «yellow»?", a: ["Rosso", "Blu", "Giallo", "Verde"], c: 2, e: "«Yellow» significa giallo." },
    { q: "Completa: «I ___ a student.»", a: ["is", "are", "am", "be"], c: 2, e: "Con «I» si usa sempre «am»: I am." },
    { q: "Come si dice «dieci»?", a: ["Ten", "Two", "Twelve", "Tree"], c: 0, e: "«Ten» è dieci." },
    { q: "Il plurale di «child» è…", a: ["Childs", "Children", "Childes", "Childrens"], c: 1, e: "«Child» è irregolare: il plurale è «children».", bonus: 5, malus: 3 },
    { q: "Quando si dice «good morning»?", a: ["Di mattina", "Di sera", "Di notte", "A pranzo"], c: 0, e: "«Morning» vuol dire mattina." },
    { q: "Come si dice «mela»?", a: ["Pear", "Apple", "Orange", "Banana"], c: 1, e: "«Apple» significa mela." },
    { q: "Completa: «She ___ a dog.»", a: ["have", "has", "having", "haves"], c: 1, e: "Con he, she, it si usa «has»." }
  ],
  storia_geo: [
    { q: "Qual è la capitale dell'Italia?", a: ["Milano", "Roma", "Napoli", "Torino"], c: 1, e: "Roma è la capitale d'Italia." },
    { q: "Dove si trovano le grandi piramidi?", a: ["In Italia", "In Egitto", "In Grecia", "In Spagna"], c: 1, e: "Le grandi piramidi sono in Egitto, vicino al fiume Nilo." },
    { q: "Qual è il fiume più lungo d'Italia?", a: ["Tevere", "Arno", "Po", "Adige"], c: 2, e: "Il Po è lungo circa 650 km." },
    { q: "Quanti sono i continenti?", a: ["5", "6", "7", "4"], c: 2, e: "Di solito se ne contano 7: Europa, Asia, Africa, America del Nord, America del Sud, Oceania, Antartide." },
    { q: "Chi viveva nelle caverne e scopriva il fuoco?", a: ["Gli uomini preistorici", "I Romani", "Gli Egizi", "I cavalieri"], c: 0, e: "Gli uomini della preistoria impararono a usare il fuoco." },
    { q: "Qual è il monte più alto d'Italia?", a: ["Etna", "Monte Bianco", "Vesuvio", "Cervino"], c: 1, e: "Il Monte Bianco supera i 4800 metri." },
    { q: "Il mare che bagna Venezia è…", a: ["Tirreno", "Ligure", "Adriatico", "Ionio"], c: 2, e: "Venezia si affaccia sul mare Adriatico." },
    { q: "In quale città c'è il Colosseo?", a: ["Firenze", "Roma", "Pisa", "Verona"], c: 1, e: "Il Colosseo fu costruito dagli antichi Romani a Roma." }
  ]
};

// Aspetto delle materie: nome, icona FontAwesome, colore
const SUBJECT_META = {
  matematica: { label: "Matematica", icon: "fa-calculator", color: "#3b82f6" },
  italiano:   { label: "Italiano",   icon: "fa-book",       color: "#10b981" },
  inglese:    { label: "Inglese",    icon: "fa-language",   color: "#a855f7" },
  storia_geo: { label: "Storia/Geo", icon: "fa-globe",      color: "#f59e0b" }
};
