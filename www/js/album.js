// ===== Album di figurine (10/10/2026): tre album diversi per fascia =====
// piccoli (1ª–3ª elementare): adesivi, alcuni «coi brillantini» (r = 1); ragazzi (4ª–5ª): carte comuni/rare/epiche;
// teen (medie): collezione digitale comune/raro/epico/leggendario. Una figurina a ogni gioco vinto (non nei ripassi).
// I doppioni danno punti scambio (ragazzi) o frammenti (medie): con SWAP_COST si sceglie un pezzo che manca.
// Dati: e = emoji, n = nome, s = dato breve (carte 4ª–5ª), f = curiosità (letta dalla voce), r = rarità.
const Album = (() => {
  const K = "sg2_album";
  const SWAP_COST = 5;
  const BANDS = {
    piccoli: { title: "Il mio album di adesivi", sets: [
      { id: "fattoria", ic: "🐮", name: "Animali della fattoria", items: [
        { e: "🐮", n: "Mucca", f: "Fa «muu» e ci dà il latte." },
        { e: "🐷", n: "Maiale", f: "Si rotola nel fango per stare fresco." },
        { e: "🐴", n: "Cavallo", f: "Corre veloce e sa dormire anche in piedi." },
        { e: "🐑", n: "Pecora", f: "Fa «beee» e ci dà la lana.", r: 1 },
        { e: "🐔", n: "Gallina", f: "Fa «coccodè» e depone le uova." },
        { e: "🐰", n: "Coniglio", f: "Ha le orecchie lunghe e salta veloce." }] },
      { id: "mondo", ic: "🦁", name: "Animali del mondo", items: [
        { e: "🦁", n: "Leone", f: "È chiamato il re della savana." },
        { e: "🐘", n: "Elefante", f: "Usa la proboscide come una mano." },
        { e: "🦒", n: "Giraffa", f: "Ha il collo lunghissimo per mangiare le foglie in alto.", r: 1 },
        { e: "🐒", n: "Scimmia", f: "Si arrampica sugli alberi con mani e piedi." },
        { e: "🦓", n: "Zebra", f: "Ogni zebra ha strisce diverse da tutte le altre." },
        { e: "🐧", n: "Pinguino", f: "È un uccello che non vola, ma nuota benissimo." }] },
      { id: "frutta", ic: "🍓", name: "La frutta", items: [
        { e: "🍎", n: "Mela", f: "Può essere rossa, gialla o verde." },
        { e: "🍌", n: "Banana", f: "Cresce a grappoli sulla pianta di banano." },
        { e: "🍓", n: "Fragola", f: "Ha i semini fuori, sulla buccia.", r: 1 },
        { e: "🍇", n: "Uva", f: "Cresce a grappoli sulla vite." },
        { e: "🍉", n: "Anguria", f: "È piena d'acqua: perfetta d'estate." },
        { e: "🍊", n: "Arancia", f: "È piena di vitamina C." }] },
      { id: "mezzi", ic: "🚂", name: "I mezzi di trasporto", items: [
        { e: "🚂", n: "Treno", f: "Corre sui binari e porta tante persone." },
        { e: "✈️", n: "Aereo", f: "Vola alto sopra le nuvole." },
        { e: "🚢", n: "Nave", f: "Attraversa il mare." },
        { e: "🚲", n: "Bicicletta", f: "Va avanti con la forza delle gambe." },
        { e: "🚌", n: "Autobus", f: "Si ferma alle fermate per far salire la gente." },
        { e: "🚀", n: "Razzo", f: "Va fino nello spazio!", r: 1 }] }
    ] },
    ragazzi: { title: "Le mie carte", sets: [
      { id: "dino", ic: "🦖", name: "Dinosauri", tag: "DINO", items: [
        { e: "🦖", n: "T-Rex", s: "Lungo 12 m", f: "Il tirannosauro era lungo circa 12 metri e aveva denti grandi come banane.", r: 2 },
        { e: "🦕", n: "Brachiosauro", s: "Alto 13 m", f: "Il brachiosauro era alto come un palazzo di quattro piani e mangiava foglie.", r: 1 },
        { e: "🦈", n: "Megalodonte", s: "Oltre 15 m", f: "Il megalodonte era uno squalo preistorico enorme, lungo più di 15 metri.", r: 1 },
        { e: "🥚", n: "Uovo fossile", s: "Diventato pietra", f: "Sono state trovate uova di dinosauro diventate pietra." },
        { e: "🦴", n: "Osso fossile", s: "Milioni di anni", f: "In milioni di anni le ossa possono diventare pietra: si chiamano fossili." },
        { e: "🐚", n: "Ammonite", s: "Conchiglia a spirale", f: "Le ammoniti erano animali marini con la conchiglia a spirale." },
        { e: "☄️", n: "L'asteroide", s: "66 milioni di anni fa", f: "Circa 66 milioni di anni fa un enorme asteroide colpì la Terra e i grandi dinosauri scomparvero.", r: 2 },
        { e: "🌋", n: "Vulcano", s: "Rocce di lava", f: "Molte rocce antichissime sono nate dalla lava dei vulcani." },
        { e: "🐊", n: "Coccodrillo", s: "Antichissimo", f: "I coccodrilli esistevano già ai tempi dei dinosauri." }] },
      { id: "spazio", ic: "🪐", name: "Spazio", tag: "SPAZIO", items: [
        { e: "☀️", n: "Sole", s: "Una stella", f: "Il Sole è una stella: dentro ci starebbero più di un milione di Terre.", r: 1 },
        { e: "🌍", n: "Terra", s: "Pianeta della vita", f: "La Terra è l'unico pianeta dove sappiamo che c'è la vita." },
        { e: "🌕", n: "Luna", s: "384.000 km", f: "La Luna è lontana circa 384 mila chilometri dalla Terra." },
        { e: "🪐", n: "Saturno", s: "Anelli di ghiaccio", f: "Gli anelli di Saturno sono fatti di pezzi di ghiaccio e roccia.", r: 1 },
        { e: "🌠", n: "Stella cadente", s: "Un sassolino", f: "Una stella cadente è un sassolino che brucia entrando nell'aria." },
        { e: "👨‍🚀", n: "Astronauta", s: "Senza peso", f: "Nella stazione spaziale gli astronauti galleggiano: sembra di non pesare niente." },
        { e: "🛰️", n: "Satellite", s: "Gira intorno a noi", f: "I satelliti girano intorno alla Terra e ci mandano il meteo e la televisione." },
        { e: "🔭", n: "Telescopio", s: "Galileo", f: "Galileo Galilei puntò il telescopio verso il cielo e vide le lune di Giove.", r: 1 },
        { e: "🌌", n: "Via Lattea", s: "Miliardi di stelle", f: "La nostra galassia, la Via Lattea, contiene miliardi di stelle.", r: 2 }] },
      { id: "record", ic: "🏆", name: "Animali record", tag: "RECORD", items: [
        { e: "🐆", n: "Ghepardo", s: "110 km/h", f: "Il ghepardo è l'animale di terra più veloce: arriva a circa 110 chilometri all'ora.", r: 2 },
        { e: "🐋", n: "Balenottera azzurra", s: "30 m", f: "La balenottera azzurra è l'animale più grande mai esistito: è lunga fino a 30 metri.", r: 1 },
        { e: "🦒", n: "Giraffa", s: "5,5 m", f: "La giraffa è l'animale più alto: arriva a cinque metri e mezzo." },
        { e: "🐘", n: "Elefante africano", s: "6 tonnellate", f: "L'elefante africano è l'animale di terra più pesante." },
        { e: "🐢", n: "Tartaruga gigante", s: "Oltre 100 anni", f: "Le tartarughe giganti possono vivere più di cento anni.", r: 1 },
        { e: "🐙", n: "Polpo", s: "3 cuori", f: "Il polpo ha tre cuori e il sangue blu." },
        { e: "🦘", n: "Canguro", s: "Salti di 9 m", f: "Il canguro rosso può fare salti lunghi fino a nove metri." },
        { e: "🦥", n: "Bradipo", s: "Lentissimo", f: "Il bradipo si muove lentissimo e dorme gran parte del giorno." },
        { e: "🐜", n: "Formica", s: "Fortissima", f: "La formica può sollevare oggetti molto più pesanti di lei." }] },
      { id: "inventori", ic: "💡", name: "Inventori", tag: "INVENZIONI", items: [
        { e: "💡", n: "Lampadina", s: "Edison, 1879", f: "Nel 1879 Thomas Edison costruì una lampadina che restava accesa a lungo.", r: 1 },
        { e: "📻", n: "Radio", s: "Marconi", f: "L'italiano Guglielmo Marconi mandò messaggi senza fili con le onde radio.", r: 2 },
        { e: "🔋", n: "Pila", s: "Volta, 1800", f: "Alessandro Volta, di Como, inventò la pila elettrica nel 1800.", r: 1 },
        { e: "☎️", n: "Telefono", s: "Meucci", f: "L'italiano Antonio Meucci inventò uno dei primi telefoni." },
        { e: "✈️", n: "Aereo", s: "1903", f: "Nel 1903 i fratelli Wright fecero volare il primo aereo a motore." },
        { e: "📖", n: "Stampa", s: "Gutenberg", f: "Intorno al 1450 Gutenberg inventò la stampa a caratteri mobili." },
        { e: "📷", n: "Fotografia", s: "Ore di posa", f: "Per le prime fotografie, nell'Ottocento, bisognava stare fermi per ore." },
        { e: "🚲", n: "Bicicletta", s: "Senza pedali", f: "Le prime biciclette non avevano i pedali: si spingevano con i piedi." },
        { e: "💉", n: "Vaccino", s: "Jenner, 1796", f: "Nel 1796 Edward Jenner creò il primo vaccino, contro il vaiolo.", r: 1 }] }
    ] },
    teen: { title: "Collezione", sets: [
      { id: "scienziati", ic: "🔬", name: "Grandi scienziati", items: [
        { e: "🍎", n: "Isaac Newton", f: "Spiegò la gravitazione universale: la stessa forza fa cadere la mela e tiene la Luna in orbita.", r: 3 },
        { e: "🔭", n: "Galileo Galilei", f: "Con il telescopio scoprì quattro lune di Giove e sostenne che la Terra gira intorno al Sole.", r: 2 },
        { e: "⏳", n: "Albert Einstein", f: "Con la relatività dimostrò che il tempo scorre in modo diverso a seconda della velocità.", r: 3 },
        { e: "☢️", n: "Marie Curie", f: "Studiò la radioattività: è l'unica persona premiata con il Nobel sia per la fisica sia per la chimica.", r: 2 },
        { e: "🐢", n: "Charles Darwin", f: "Osservando gli animali delle isole Galápagos sviluppò la teoria dell'evoluzione.", r: 1 },
        { e: "🔋", n: "Alessandro Volta", f: "Inventò la pila nel 1800: da lui prende il nome il volt.", r: 1 },
        { e: "🌱", n: "Gregor Mendel", f: "Incrociando piante di pisello scoprì le leggi dell'ereditarietà.", r: 1 },
        { e: "🦠", n: "Louis Pasteur", f: "Dimostrò che molte malattie sono causate dai microbi e inventò la pastorizzazione." },
        { e: "⚛️", n: "Enrico Fermi", f: "Premio Nobel per la fisica nel 1938, nel 1942 costruì il primo reattore nucleare.", r: 1 },
        { e: "🧠", n: "Rita Levi-Montalcini", f: "Scoprì il fattore di crescita delle cellule nervose: premio Nobel nel 1986.", r: 2 },
        { e: "⚡", n: "Nikola Tesla", f: "Sviluppò la corrente alternata, quella che arriva nelle nostre case." },
        { e: "🧬", n: "Rosalind Franklin", f: "Le sue immagini ai raggi X furono decisive per scoprire la forma a doppia elica del DNA." }] },
      { id: "meraviglie", ic: "🏛️", name: "Meraviglie del mondo", items: [
        { e: "🏛️", n: "Colosseo", f: "L'anfiteatro più grande dell'antica Roma: poteva ospitare circa 50.000 spettatori.", r: 2 },
        { e: "🧱", n: "Grande Muraglia", f: "Costruita in molti secoli per difendere la Cina: è lunga migliaia di chilometri.", r: 1 },
        { e: "🔺", n: "Piramidi di Giza", f: "La Grande Piramide ha circa 4500 anni ed è l'unica delle sette meraviglie antiche ancora in piedi.", r: 3 },
        { e: "🕌", n: "Taj Mahal", f: "Mausoleo di marmo bianco in India, fatto costruire da un imperatore per la moglie.", r: 1 },
        { e: "⛰️", n: "Machu Picchu", f: "Città degli Inca sulle Ande, a circa 2400 metri di altezza.", r: 2 },
        { e: "🗽", n: "Statua della Libertà", f: "Dono della Francia agli Stati Uniti, inaugurata nel 1886." },
        { e: "🗼", n: "Torre Eiffel", f: "Costruita a Parigi per l'Esposizione universale del 1889." },
        { e: "🏜️", n: "Petra", f: "Città scolpita nella roccia rosa, in Giordania, più di 2000 anni fa.", r: 1 },
        { e: "🗻", n: "Monte Fuji", f: "Il vulcano più alto del Giappone: circa 3776 metri." },
        { e: "🏞️", n: "Grand Canyon", f: "Una gola enorme scavata dal fiume Colorado in milioni di anni." },
        { e: "🐠", n: "Grande barriera corallina", f: "In Australia: la struttura costruita da esseri viventi più grande della Terra.", r: 1 },
        { e: "🛶", n: "Venezia", f: "Città costruita su più di cento isole, collegate da centinaia di ponti." }] },
      { id: "spazio", ic: "🚀", name: "Missioni spaziali", items: [
        { e: "🛰️", n: "Sputnik 1", f: "Nel 1957 fu il primo satellite artificiale della storia.", r: 1 },
        { e: "🐕", n: "Laika", f: "Nel 1957 fu il primo animale a orbitare intorno alla Terra." },
        { e: "👨‍🚀", n: "Jurij Gagarin", f: "Nel 1961 fu il primo essere umano nello spazio.", r: 2 },
        { e: "🌕", n: "Apollo 11", f: "Nel 1969 Neil Armstrong fu il primo uomo a camminare sulla Luna.", r: 3 },
        { e: "👩‍🚀", n: "Valentina Tereškova", f: "Nel 1963 fu la prima donna nello spazio.", r: 1 },
        { e: "☕", n: "Samantha Cristoforetti", f: "Astronauta italiana: nel 2015 bevve il primo espresso preparato nello spazio.", r: 1 },
        { e: "🔭", n: "Telescopio Hubble", f: "Lanciato nel 1990, ha fotografato galassie lontanissime.", r: 1 },
        { e: "📡", n: "Voyager 1", f: "Lanciata nel 1977, è l'oggetto costruito dall'uomo più lontano dalla Terra.", r: 2 },
        { e: "🚙", n: "Rover su Marte", f: "I rover come Perseverance esplorano Marte e cercano tracce di vita antica." },
        { e: "☄️", n: "Rosetta", f: "Nel 2014 la sonda europea fece atterrare un piccolo robot su una cometa.", r: 1 },
        { e: "🌌", n: "Telescopio James Webb", f: "Lanciato nel 2021, osserva le prime galassie dell'universo.", r: 2 },
        { e: "🚀", n: "Space Shuttle", f: "Navetta spaziale riutilizzabile: ha volato dal 1981 al 2011." }] },
      { id: "tech", ic: "💻", name: "Tecnologie che cambiano il mondo", items: [
        { e: "🌐", n: "Internet", f: "Una rete che collega miliardi di dispositivi in tutto il mondo.", r: 1 },
        { e: "🕸️", n: "World Wide Web", f: "Inventato da Tim Berners-Lee nel 1989, al CERN di Ginevra.", r: 2 },
        { e: "📱", n: "Smartphone", f: "Un computer tascabile, più potente dei computer delle missioni Apollo." },
        { e: "📍", n: "GPS", f: "Usa i segnali di decine di satelliti per sapere dove ti trovi.", r: 1 },
        { e: "💾", n: "Floppy disk", f: "Il dischetto degli anni '80 e '90: conteneva circa 1,4 MB." },
        { e: "🤖", n: "Robot", f: "Macchine programmabili che lavorano nelle fabbriche, negli ospedali e nello spazio.", r: 1 },
        { e: "💬", n: "Intelligenza artificiale", f: "Programmi che imparano dai dati: riconoscono immagini, traducono e rispondono.", r: 3 },
        { e: "🖨️", n: "Stampante 3D", f: "Costruisce oggetti strato dopo strato." },
        { e: "🔌", n: "Auto elettrica", f: "Va a batteria e mentre viaggia non produce gas di scarico." },
        { e: "☀️", n: "Pannello solare", f: "Trasforma la luce del Sole in elettricità." },
        { e: "🎮", n: "Videogiochi", f: "Tra i primi videogiochi famosi c'è «Pong», del 1972.", r: 1 },
        { e: "💻", n: "Computer", f: "I primi computer occupavano stanze intere: oggi stanno in uno zaino.", r: 2 }] }
    ] }
  };
  // probabilità delle rarità (le più rare escono meno)
  const WEIGHT = { piccoli: [1, 1], ragazzi: [70, 25, 5], teen: [60, 28, 10, 2] };
  const RNAME = { ragazzi: ["Comune", "Rara", "Epica"], teen: ["Comune", "Raro", "Epico", "Leggendario"] };

  // ogni pezzo ha un codice fisso: fascia-set-posizione
  Object.keys(BANDS).forEach(b => BANDS[b].sets.forEach(s => s.items.forEach((it, i) => {
    it.id = `${b[0]}-${s.id}-${i}`; it.r = it.r || 0; it.no = i + 1; it.set = s.id;
  })));

  function load() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(K)); } catch (e) {}
    return d && d.own ? d : { own: {}, pts: {}, fresh: {} };
  }
  function save(d) { try { localStorage.setItem(K, JSON.stringify(d)); } catch (e) {} }
  const all = band => BANDS[band].sets.flatMap(s => s.items);
  const find = id => { for (const b in BANDS) { const it = all(b).find(x => x.id === id); if (it) return it; } return null; };

  // una figurina nuova a ogni gioco vinto. Piccoli: quasi sempre una che manca (niente delusioni).
  function draw(band) {
    if (!BANDS[band]) return null;
    const d = load(), list = all(band), missing = list.filter(x => !d.own[x.id]);
    let it;
    if (band === "piccoli") it = (missing.length && Math.random() < 0.85) ? pick(missing) : pick(list);
    else {
      const w = WEIGHT[band], tot = w.reduce((a, b) => a + b, 0);
      let x = Math.random() * tot, r = 0;
      while (x >= w[r] && r < w.length - 1) { x -= w[r]; r++; }
      const tier = list.filter(i => i.r === r);
      it = pick(tier.length ? tier : list);
    }
    const dup = !!d.own[it.id];
    d.own[it.id] = (d.own[it.id] || 0) + 1;
    if (dup && band !== "piccoli") d.pts[band] = (d.pts[band] || 0) + 1;
    if (!dup) d.fresh[it.id] = 1;
    save(d);
    const set = BANDS[band].sets.find(s => s.id === it.set);
    return { id: it.id, dup, setDone: !dup && set.items.every(i => d.own[i.id]) ? set.name : "" };
  }
  // con i punti scambio si prende un pezzo che manca
  function swap(band, id) {
    const d = load(), it = find(id);
    if (!it || d.own[id] || (d.pts[band] || 0) < SWAP_COST) return false;
    d.pts[band] -= SWAP_COST; d.own[id] = 1; d.fresh[id] = 1; save(d);
    return true;
  }
  function seen(id) { const d = load(); if (d.fresh[id]) { delete d.fresh[id]; save(d); } }
  function stats(band) {
    const d = load(), list = all(band);
    return { own: list.filter(x => d.own[x.id]).length, total: list.length, pts: d.pts[band] || 0, fresh: list.filter(x => d.fresh[x.id]).length };
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  return { BANDS, RNAME, SWAP_COST, draw, swap, seen, stats, find, load, reset: () => { try { localStorage.removeItem(K); } catch (e) {} } };
})();
