// ===== Figurine delle schede di fine gioco =====
// Regola: una parola riceve una figurina SOLO se l'immagine c'entra davvero. Meglio nessuna che sbagliata.
// EMO_WORDS: parola intera (minuscola) -> figurina (si controlla a sinistra e a destra della coppia).
// EMO_RULES: si controllano solo a SINISTRA della coppia, nell'ordine. EMO_RULES_R: solo a destra, se a sinistra non c'è niente.
// Per la seconda lingua (francese, spagnolo, tedesco) si guarda solo la parola italiana (a destra).
const EMO_WORDS = {
  // parole italiane della seconda lingua e di altre materie
  acqua: "💧", aereo: "✈️", aeroporto: "🛫", albero: "🌳", amare: "❤️", amico: "🤝", anatra: "🦆", andare: "🚶", ape: "🐝",
  aprire: "📂", arancione: "🟠", arrivederci: "👋", autobus: "🚌", autunno: "🍂", bagno: "🛁", ballare: "💃", bambino: "🧒",
  banana: "🍌", bere: "🥤", bianco: "⚪", biblioteca: "📚", bicicletta: "🚲", biglietto: "🎫", biscotto: "🍪", blu: "🔵",
  bocca: "👄", buonanotte: "🌙", buonasera: "🌆", buongiorno: "🌅", burro: "🧈", calcio: "⚽", calzini: "🧦", camera: "🛏️",
  cantare: "🎤", canzone: "🎵", capire: "💡", cappello: "🎩", carne: "🥩", carota: "🥕", casa: "🏠", castello: "🏰",
  cattivo: "👎", cena: "🍽️", cento: "💯", chiave: "🔑", chiesa: "⛪", chiudere: "🔒", ciao: "👋", cielo: "☁️",
  ciliegia: "🍒", cinema: "🎬", cinque: "5️⃣", cioccolato: "🍫", cipolla: "🧅", "città": "🏙️", classe: "🏫", colazione: "🥐",
  comprare: "🛒", coniglio: "🐰", correre: "🏃", cucina: "🍳", cuoco: "👨‍🍳", dieci: "🔟", divano: "🛋️", dormire: "😴", due: "2️⃣",
  elefante: "🐘", erba: "🌱", farfalla: "🦋", farmacia: "💊", film: "🎬", foresta: "🌲", formaggio: "🧀",
  fragola: "🍓", fratello: "👦", fuoco: "🔥", gelato: "🍦", ghiaccio: "🧊", giacca: "🧥", giallo: "🟡",
  giardino: "🏡", giocare: "🎲", gioco: "🎲", grazie: "🙏", guanti: "🧤", insalata: "🥗", insegnante: "👩‍🏫", lampada: "💡",
  latte: "🥛", leggere: "📖", letto: "🛏️", limone: "🍋", luna: "🌙", lupo: "🐺", macchina: "🚗", madre: "👩", maglietta: "👕",
  maiale: "🐷", mangiare: "🍽️", mano: "✋", marrone: "🟤", matita: "✏️", medico: "👨‍⚕️", moto: "🏍️", museo: "🏛️", musica: "🎵",
  nave: "🚢", negozio: "🏪", nero: "⚫", neve: "🌨️", nonna: "👵", nonno: "👴", nove: "9️⃣", nuoto: "🏊", nuvola: "☁️",
  occhio: "👁️", orecchio: "👂", orologio: "⏰", orso: "🐻", ospedale: "🏥", otto: "8️⃣", padre: "👨", palla: "⚽", pane: "🍞",
  panettiere: "🥖", pantaloni: "👖", parco: "🌳", parlare: "🗣️", pasta: "🍝", patata: "🥔", pera: "🍐", pesce: "🐟",
  piazza: "⛲", pioggia: "🌧️", pittore: "🎨", pollo: "🐔", pomodoro: "🍅", pompiere: "👨‍🚒", ponte: "🌉", porta: "🚪",
  quaderno: "📓", quattro: "4️⃣", ricco: "💰", riso: "🍚", ristorante: "🍴", rosso: "🔴", scarpe: "👟", sciarpa: "🧣",
  scimmia: "🐒", scrivere: "✍️", scuola: "🏫", sedia: "🪑", sei: "6️⃣", sette: "7️⃣", sole: "☀️", sorella: "👧",
  spiaggia: "🏖️", stazione: "🚉", stella: "⭐", strada: "🛣️", succo: "🧃", "sì": "✅", tartaruga: "🐢", topo: "🐭",
  torta: "🍰", tre: "3️⃣", treno: "🚆", "tè": "🍵", uccello: "🐦", uno: "1️⃣", uovo: "🥚", uva: "🍇", vecchio: "👴",
  vedere: "👀", vento: "🌬️", verde: "🟢", volpe: "🦊", zaino: "🎒", zuppa: "🍲",
  // latino (parola italiana a destra)
  ragazzo: "👦", ragazza: "👧", contadino: "👨‍🌾", re: "👑",
  // italiano e altre materie
  uomo: "👨", dito: "☝️", braccio: "💪", bue: "🐂", giornale: "📰", tastiera: "⌨️", mouse: "🖱️", stampante: "🖨️",
  schermo: "🖥️", casse: "🔊", microfono: "🎤", forbici: "✂️", metropolitana: "🚇", tamburo: "🥁", violino: "🎻",
  chitarra: "🎸", pianoforte: "🎹", tromba: "🎺", timpano: "🥁", lingua: "👅", natale: "🎄", tricolore: "🇮🇹", euro: "💶",
  parlamento: "🏛️", magistratura: "⚖️", unesco: "🏛️", unicef: "🧒", oms: "🏥", onu: "🌍"
};

const EMO_RULES = [
  // stati (bandiere)
  [/^francia$/, "🇫🇷"], [/^spagna$/, "🇪🇸"], [/^germania$/, "🇩🇪"], [/^regno unito$/, "🇬🇧"], [/^portogallo$/, "🇵🇹"], [/^grecia$/, "🇬🇷"],
  [/^canada$/, "🇨🇦"], [/^australia$/, "🇦🇺"], [/^brasile$/, "🇧🇷"], [/^turchia$/, "🇹🇷"], [/^svizzera$/, "🇨🇭"], [/^egitto$/, "🇪🇬"],
  [/^giappone$/, "🇯🇵"], [/^polonia$/, "🇵🇱"], [/unione europea/, "🇪🇺"],
  // città, fiumi, montagne
  [/^venezia$/, "🚤"], [/^milano$/, "⛪"], [/^napoli$/, "🌋"], [/^roma$/, "🏛️"], [/^genova$/, "⚓"],
  [/^(senna|tamigi|tevere|arno|nilo|po)$/, "🏞️"],
  [/everest/, "🏔️"], [/kilimangiaro/, "🌋"], [/monte bianco/, "⛰️"], [/aconcagua/, "🏔️"],
  // storia: popoli
  [/egizi|faraon/, "🔺"], [/^sumeri$|tavolette/, "📜"], [/^greci$|partenone/, "🏛️"], [/^romani$/, "🏟️"], [/^etruschi$|tombe dipinte/, "🏺"],
  // storia: personaggi
  [/^romolo$/, "🐺"], [/giulio cesare/, "🗡️"], [/^augusto$/, "👑"], [/^annibale$/, "🐘"], [/^colombo$/, "⛵"], [/^leonardo$|gioconda/, "🖼️"],
  [/napoleone/, "🇫🇷"], [/garibaldi/, "🇮🇹"], [/gutenberg/, "📰"], [/lutero/, "✝️"],
  // storia: eventi
  [/nascita di roma/, "🐺"], [/caduta di roma/, "🏚️"], [/scoperta dell'america/, "⛵"], [/rivoluzione francese/, "🇫🇷"],
  [/unità d'italia/, "🇮🇹"], [/prima guerra mondiale/, "🎖️"], [/repubblica italiana/, "🗳️"], [/caduta del muro/, "🧱"],
  // storia e arte: periodi
  [/feudalesimo/, "🏰"], [/rinascimento/, "🖼️"], [/rivoluzione industriale/, "🏭"], [/crociate/, "⚔️"], [/illuminismo/, "💡"],
  // scienze
  [/^fe$/, "🔩"], [/^na$/, "🧂"], [/^au$/, "🥇"], [/chilogrammo/, "⚖️"],
  // tecnologia
  [/^carta$/, "📄"], [/^solare$/, "☀️"], [/^eolica$/, "🌬️"], [/^idroelettrica$/, "💧"], [/^geotermica$/, "🌋"], [/^petrolio$/, "🛢️"],
  [/^volt$/, "⚡"], [/^ampere$/, "🔌"], [/^watt$/, "💡"], [/kilowattora/, "🔋"], [/^algoritmo$/, "🧮"], [/^browser$/, "🌐"], [/^url$/, "🔗"],
  [/^password$/, "🔑"], [/^firewall$/, "🛡️"],
  // civica
  [/caserma dei pompieri/, "🚒"], [/stazione di polizia/, "🚓"], [/semaforo rosso/, "🔴"], [/semaforo verde/, "🟢"], [/semaforo giallo/, "🟡"],
  [/strisce pedonali/, "🚸"], [/marciapiede/, "🚶"], [/buccia di banana/, "🍌"], [/lattina/, "🥫"], [/bottiglia di vetro/, "🍾"],
  [/festa della repubblica/, "🇮🇹"], [/festa della liberazione/, "🕊️"], [/festa dei lavoratori/, "🛠️"], [/costituzione/, "📜"],
  [/canto degli italiani/, "🎶"],
  // arte
  [/scultore/, "🗿"], [/fotografo/, "📷"], [/disegnatore/, "✏️"], [/ceramista/, "🏺"], [/michelangelo|^david$/, "🗿"], [/van gogh/, "🌌"],
  [/botticelli/, "🌸"], [/cappella sistina/, "⛪"], [/ultima cena/, "🍽️"], [/acquerello/, "💧"], [/affresco/, "🧱"], [/mosaico/, "🧩"],
  [/collage/, "✂️"], [/scultura/, "🗿"], [/^arena$/, "🏟️"], [/basilica di san marco/, "⛪"]
];

// solo seconda lingua (parola italiana a destra): qui "forte" è l'aggettivo, in musica vorrebbe dire altro
const EMO_WORDS_L2 = { forte: "💪" };

// solo a destra, quando a sinistra c'è una frase lunga (passaggi di stato)
const EMO_RULES_R = [
  [/^fusione$/, "🧊"], [/^evaporazione$/, "♨️"], [/^condensazione$/, "💧"], [/^solidificazione$/, "❄️"]
];
