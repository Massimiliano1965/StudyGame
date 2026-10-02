// Parole troppo difficili per la classe: tolte da domande e coppie dei giochi.
// Fascia A = 1ª–2ª elementare, fascia B = 3ª–5ª elementare (le medie non sono filtrate).
// Per aggiungere una parola basta una radice nella lista (senza accenti obbligatori).
const Parole = (() => {
  const HARD = {
    A: /acquedott|addestrat|antichissim|bisestil|compositor|elettrodomestic|erbivor|carnivor|onnivor|esclamativ|interrogativ|apostrof|scioglilingua|pentagramm|percussion|fisarmonic|soffiett|archeolog|gladiator|vichingh|tirannosaur|medioev|medieval|sfoci|sorgent|pendente|irregolar|tavolozz|ritratt|paesaggi|incornici|diluisc|schiaris|schiarit|scurisc|ceramist|geografic|ghiacciai|mammifer|scheletr|sottomarin|termosifon|tosaerba|avvit|seghettat|microonde|lavastoviglie|trasparent|ingrandiment|elastic|improvvis|susseguir|squillant|rimbomb|tintinn|sonagli|spartit|archett|trombettier|trombettist|flautist|batterist|chitarrist|violinist|cacciavit|tropical|continent|mediterrane|antartid|territori|digitale|preistori|armatur|escavator|autopomp|aspirapolver|custodisc|sfrutt|procurav|permettev|scrivesse|racchiud|realizz|comporta|includer|condivid|circondat|discrimin|invisibil|espression|cronolog|elettricit|statuin|dettagli|prospettiv|ottengono|contengono|resistono|conservan|riproduc|indicazion/i,
    B: /nazifascism|computazional|javascript|referendum|sublimazion|solidificazion|decompositor|insettivor|invertebrat|vertebral|impollinator|idroelettric|sovraccaric|stanghett|tratteggi|chiaroscur|bassorilievo|autoritratt|marsigliese|contrabbass|ottavin|neanderthal|australopitec|cuneiform|cyberbullism|discriminazion|autobiograf|sostenibilit|intonac|refettori|longobard|anidride|immission|sovrappopolaz|democrazi|costituzion|magistrat|parlament|cartaginese|cavalletto|clorofillian|compostier|combustibil|ingranagg|processor|programmazion|hardware|dispositiv|evaporazion|condensazion|digestione|digeriscon/i
  };
  const bandOf = c => (c <= 1 ? "A" : c <= 4 ? "B" : "C");
  const hard = (txt, classId) => { const re = HARD[bandOf(classId)]; return !!re && re.test(String(txt)); };
  const qText = q => [q.q, ...(q.a || []), q.e || ""].join(" ");

  // filtra i banchi di domande (una volta, al caricamento). Inglese, seconda lingua e latino non si toccano.
  function filterBanks() {
    if (typeof QBANK === "undefined") return;
    const rep = {};
    Object.keys(QBANK).forEach(sub => {
      if (/^(inglese|lingua2|latino)$/.test(sub)) return;
      ["A", "B"].forEach(b => {
        const arr = QBANK[sub][b]; if (!arr) return;
        const keep = arr.filter(q => !HARD[b].test(qText(q)));
        if (keep.length >= 12 && keep.length < arr.length) { rep[sub + b] = arr.length - keep.length; QBANK[sub][b] = keep; }
      });
    });
    Parole.removed = rep;
  }

  // filtra le coppie dei temi di collegamento: toglie le coppie difficili, scarta i temi con meno di 3 coppie
  function themes(list, classId) {
    const re = HARD[bandOf(classId)]; if (!re) return list;
    const out = [];
    list.forEach(t => {
      const pairs = t.pairs.filter(p => !re.test(p[0] + " " + p[1]));
      if (pairs.length >= 3) out.push(pairs.length === t.pairs.length ? t : Object.assign({}, t, { pairs }));
    });
    return out.length ? out : list;
  }
  return { hard, themes, filterBanks, removed: {} };
})();
Parole.filterBanks();
