// ===== Seconda lingua: francese, spagnolo o tedesco (si sceglie nelle Impostazioni) =====
// Un unico vocabolario [italiano, francese, spagnolo, tedesco] per categoria, da cui si
// generano le domande a risposta multipla e i temi per i giochi di collegamento.
// Le domande hanno `en` (le parole straniere nella domanda) e `ae` (risposte tutte straniere),
// così la voce legge le parole straniere con la lingua giusta (vedi Voice.setForeign).
const L2 = (() => {
  const LANGS = {
    fr: { name: "Francese", adj: "francese", wordAdj: "francese", loc: "fr-FR", flag: "🇫🇷", col: 1 },
    es: { name: "Spagnolo", adj: "spagnolo", wordAdj: "spagnola", loc: "es-ES", flag: "🇪🇸", col: 2 },
    de: { name: "Tedesco", adj: "tedesco", wordAdj: "tedesca", loc: "de-DE", flag: "🇩🇪", col: 3 }
  };
  const DEFAULT = "fr";

  // [italiano, francese, spagnolo, tedesco]
  const CATS = [
    { name: "saluti", rows: [
      ["ciao", "salut", "hola", "hallo"], ["buongiorno", "bonjour", "buenos días", "guten Morgen"],
      ["buonasera", "bonsoir", "buenas tardes", "guten Abend"], ["buonanotte", "bonne nuit", "buenas noches", "gute Nacht"],
      ["arrivederci", "au revoir", "adiós", "auf Wiedersehen"], ["grazie", "merci", "gracias", "danke"],
      ["prego", "de rien", "de nada", "bitte"], ["scusa", "pardon", "perdón", "Entschuldigung"],
      ["sì", "oui", "sí", "ja"]
    ] },
    { name: "numeri", rows: [
      ["uno", "un", "uno", "eins"], ["due", "deux", "dos", "zwei"], ["tre", "trois", "tres", "drei"],
      ["quattro", "quatre", "cuatro", "vier"], ["cinque", "cinq", "cinco", "fünf"], ["sei", "six", "seis", "sechs"],
      ["sette", "sept", "siete", "sieben"], ["otto", "huit", "ocho", "acht"], ["nove", "neuf", "nueve", "neun"],
      ["dieci", "dix", "diez", "zehn"]
    ] },
    { name: "colori", rows: [
      ["rosso", "rouge", "rojo", "rot"], ["blu", "bleu", "azul", "blau"], ["verde", "vert", "verde", "grün"],
      ["giallo", "jaune", "amarillo", "gelb"], ["nero", "noir", "negro", "schwarz"], ["bianco", "blanc", "blanco", "weiß"],
      ["arancione", "orange", "naranja", "orange"], ["grigio", "gris", "gris", "grau"], ["marrone", "marron", "marrón", "braun"]
    ] },
    { name: "famiglia", rows: [
      ["madre", "mère", "madre", "Mutter"], ["padre", "père", "padre", "Vater"], ["fratello", "frère", "hermano", "Bruder"],
      ["sorella", "sœur", "hermana", "Schwester"], ["nonno", "grand-père", "abuelo", "Großvater"],
      ["nonna", "grand-mère", "abuela", "Großmutter"], ["amico", "ami", "amigo", "Freund"], ["bambino", "enfant", "niño", "Kind"]
    ] },
    { name: "animali", rows: [
      ["cane", "chien", "perro", "Hund"], ["gatto", "chat", "gato", "Katze"], ["cavallo", "cheval", "caballo", "Pferd"],
      ["uccello", "oiseau", "pájaro", "Vogel"], ["pesce", "poisson", "pez", "Fisch"], ["mucca", "vache", "vaca", "Kuh"],
      ["maiale", "cochon", "cerdo", "Schwein"], ["coniglio", "lapin", "conejo", "Kaninchen"], ["topo", "souris", "ratón", "Maus"],
      ["leone", "lion", "león", "Löwe"], ["elefante", "éléphant", "elefante", "Elefant"]
    ] },
    { name: "cibo e bevande", rows: [
      ["pane", "pain", "pan", "Brot"], ["acqua", "eau", "agua", "Wasser"], ["latte", "lait", "leche", "Milch"],
      ["mela", "pomme", "manzana", "Apfel"], ["formaggio", "fromage", "queso", "Käse"], ["uovo", "œuf", "huevo", "Ei"],
      ["carne", "viande", "carne", "Fleisch"], ["riso", "riz", "arroz", "Reis"], ["burro", "beurre", "mantequilla", "Butter"],
      ["zucchero", "sucre", "azúcar", "Zucker"], ["patata", "pomme de terre", "patata", "Kartoffel"], ["banana", "banane", "plátano", "Banane"]
    ] },
    { name: "scuola", rows: [
      ["scuola", "école", "escuela", "Schule"], ["libro", "livre", "libro", "Buch"], ["quaderno", "cahier", "cuaderno", "Heft"],
      ["matita", "crayon", "lápiz", "Bleistift"], ["zaino", "sac à dos", "mochila", "Rucksack"],
      ["insegnante", "professeur", "profesor", "Lehrer"], ["classe", "classe", "clase", "Klasse"], ["lavagna", "tableau", "pizarra", "Tafel"]
    ] },
    { name: "casa", rows: [
      ["casa", "maison", "casa", "Haus"], ["porta", "porte", "puerta", "Tür"], ["finestra", "fenêtre", "ventana", "Fenster"],
      ["tavolo", "table", "mesa", "Tisch"], ["sedia", "chaise", "silla", "Stuhl"], ["letto", "lit", "cama", "Bett"],
      ["cucina", "cuisine", "cocina", "Küche"], ["camera", "chambre", "habitación", "Zimmer"], ["giardino", "jardin", "jardín", "Garten"]
    ] },
    { name: "città e natura", rows: [
      ["macchina", "voiture", "coche", "Auto"], ["città", "ville", "ciudad", "Stadt"], ["strada", "rue", "calle", "Straße"],
      ["sole", "soleil", "sol", "Sonne"], ["luna", "lune", "luna", "Mond"], ["mare", "mer", "mar", "Meer"],
      ["albero", "arbre", "árbol", "Baum"], ["fiore", "fleur", "flor", "Blume"], ["pioggia", "pluie", "lluvia", "Regen"],
      ["neve", "neige", "nieve", "Schnee"], ["vento", "vent", "viento", "Wind"], ["montagna", "montagne", "montaña", "Berg"]
    ] },
    { name: "corpo", rows: [
      ["testa", "tête", "cabeza", "Kopf"], ["mano", "main", "mano", "Hand"], ["occhio", "œil", "ojo", "Auge"],
      ["naso", "nez", "nariz", "Nase"], ["bocca", "bouche", "boca", "Mund"], ["piede", "pied", "pie", "Fuß"],
      ["cuore", "cœur", "corazón", "Herz"], ["orecchio", "oreille", "oreja", "Ohr"]
    ] },
    { name: "giorni della settimana", rows: [
      ["lunedì", "lundi", "lunes", "Montag"], ["martedì", "mardi", "martes", "Dienstag"], ["mercoledì", "mercredi", "miércoles", "Mittwoch"],
      ["giovedì", "jeudi", "jueves", "Donnerstag"], ["venerdì", "vendredi", "viernes", "Freitag"],
      ["sabato", "samedi", "sábado", "Samstag"], ["domenica", "dimanche", "domingo", "Sonntag"]
    ] },
    { name: "verbi", rows: [
      ["mangiare", "manger", "comer", "essen"], ["bere", "boire", "beber", "trinken"], ["parlare", "parler", "hablar", "sprechen"],
      ["andare", "aller", "ir", "gehen"], ["giocare", "jouer", "jugar", "spielen"], ["leggere", "lire", "leer", "lesen"],
      ["scrivere", "écrire", "escribir", "schreiben"], ["dormire", "dormir", "dormir", "schlafen"], ["amare", "aimer", "amar", "lieben"]
    ] }
  ];

  // frasi e il verbo «essere»: [italiano, francese, spagnolo, tedesco]
  const PHRASES = [
    ["Come stai?", "Comment ça va ?", "¿Cómo estás?", "Wie geht's?"],
    ["Sto bene", "Ça va bien", "Estoy bien", "Mir geht es gut"],
    ["Come ti chiami?", "Comment tu t'appelles ?", "¿Cómo te llamas?", "Wie heißt du?"],
    ["Mi chiamo Luca", "Je m'appelle Luca", "Me llamo Luca", "Ich heiße Luca"],
    ["Io sono italiano", "Je suis italien", "Soy italiano", "Ich bin Italiener"],
    ["Ho dieci anni", "J'ai dix ans", "Tengo diez años", "Ich bin zehn Jahre alt"],
    ["Buon appetito", "Bon appétit", "Buen provecho", "Guten Appetit"],
    ["A domani", "À demain", "Hasta mañana", "Bis morgen"],
    ["Non capisco", "Je ne comprends pas", "No entiendo", "Ich verstehe nicht"],
    ["Parli italiano?", "Tu parles italien ?", "¿Hablas italiano?", "Sprichst du Italienisch?"],
    ["Dov'è la scuola?", "Où est l'école ?", "¿Dónde está la escuela?", "Wo ist die Schule?"],
    ["Quanto costa?", "Combien ça coûte ?", "¿Cuánto cuesta?", "Wie viel kostet das?"],
    ["Che ora è?", "Quelle heure est-il ?", "¿Qué hora es?", "Wie spät ist es?"],
    ["Benvenuto", "Bienvenue", "Bienvenido", "Willkommen"],
    ["Buon compleanno", "Joyeux anniversaire", "Feliz cumpleaños", "Alles Gute zum Geburtstag"]
  ];
  const ESSERE = [
    ["io sono", "Je suis", "Yo soy", "Ich bin"], ["tu sei", "Tu es", "Tú eres", "Du bist"],
    ["lui è", "Il est", "Él es", "Er ist"], ["noi siamo", "Nous sommes", "Nosotros somos", "Wir sind"],
    ["voi siete", "Vous êtes", "Vosotros sois", "Ihr seid"], ["loro sono", "Ils sont", "Ellos son", "Sie sind"]
  ];

  const S = (q, a, e, extra) => Object.assign({ q, a, c: 0, e }, extra);
  const clean = w => w.replace(/[?!.,¿¡]/g, "").trim();         // per segnare le parole straniere nel testo
  const uniq = (answer, list, n) => {                            // n risposte sbagliate diverse tra loro
    const seen = new Set([answer.toLowerCase()]), out = [];
    for (const x of list) {
      const k = x.toLowerCase();
      if (!seen.has(k)) { seen.add(k); out.push(x); }
      if (out.length === n) break;
    }
    return out;
  };
  // risposte sbagliate prese dalla stessa categoria, a salti: sempre le stesse per la stessa domanda
  const others = (rows, i, col) => {
    const rot = rows.map((_, k) => rows[(i + 1 + k) % rows.length]).filter((_, k) => (i + 1 + k) % rows.length !== i);
    const stepped = rot.filter((_, k) => k % 2 === 0).concat(rot.filter((_, k) => k % 2 === 1));
    return stepped.map(r => r[col]);
  };

  // domande di una categoria per una lingua
  function questionsFor(code, rows, kind) {
    const L = LANGS[code], col = L.col, out = [];
    rows.forEach((r, i) => {
      const it = r[0], fo = r[col];
      if (it.toLowerCase() === fo.toLowerCase()) return;           // parola uguale: la domanda non avrebbe senso
      const wrongFo = uniq(fo, others(rows, i, col), 3);
      const wrongIt = uniq(it, others(rows, i, 0), 3);
      if (wrongFo.length < 3 || wrongIt.length < 3) return;
      out.push(S(`Come si dice «${it}» in ${L.adj}?`, [fo, ...wrongFo], `${fo} = ${it}.`, { ae: true }));
      const key = kind === "word" ? `Che cosa significa la parola ${L.wordAdj} «${fo}»?` : `Che cosa significa «${fo}»?`;
      out.push(S(key, [it, ...wrongIt], `${fo} = ${it}.`, { en: [clean(fo)] }));
    });
    return out;
  }

  const BANKS = {}, THEMES = {};
  Object.keys(LANGS).forEach(code => {
    let list = [];
    CATS.forEach(c => { list = list.concat(questionsFor(code, c.rows, "word")); });
    list = list.concat(questionsFor(code, PHRASES, "phrase"), questionsFor(code, ESSERE, "phrase"));
    BANKS[code] = { A: list, B: list, C: list };
    // temi per Incastro, Memory, Palloncini, Lettere mescolate e Trova l'intruso: [parola straniera, significato]
    const L = LANGS[code];
    const themes = CATS.filter(c => c.rows.length >= 5).map(c => ({
      prompt: `Collega ogni parola ${L.wordAdj} al suo significato (${c.name}).`,
      pairs: c.rows.filter(r => r[0].toLowerCase() !== r[L.col].toLowerCase()).map(r => [r[L.col], r[0]])
    }));
    THEMES[code] = { A: themes, B: themes, C: themes };
  });

  let cur = DEFAULT;
  const use = code => {
    cur = LANGS[code] ? code : DEFAULT;
    if (typeof QBANK !== "undefined") QBANK.lingua2 = BANKS[cur];
    return cur;
  };
  use(DEFAULT);

  return {
    LANGS, DEFAULT,
    codes: () => Object.keys(LANGS),
    use,
    code: () => cur,
    loc: () => LANGS[cur].loc,
    name: () => LANGS[cur].name,
    pairs: () => THEMES[cur],
    banks: BANKS
  };
})();
