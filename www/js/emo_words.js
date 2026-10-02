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
  [/egizi|faraon/, "🔺"], [/^sumeri$|tavolette/, "📜"], [/^greci$|partenone/, "🏛️"], [/^romani$/, "@colosseo"], [/^etruschi$|tombe dipinte/, "🏺"],
  // storia: personaggi
  [/^romolo$|remo/, "@lupa"], [/giulio cesare/, "🗡️"], [/^augusto$/, "👑"], [/^annibale$/, "🐘"], [/^colombo$/, "@caravella"], [/^leonardo$|gioconda/, "🖼️"],
  [/napoleone/, "🇫🇷"], [/garibaldi/, "🇮🇹"], [/gutenberg/, "📰"], [/lutero/, "✝️"],
  // storia: eventi
  [/nascita di roma/, "@lupa"], [/caduta di roma/, "@colosseo"], [/scoperta dell'america/, "@caravella"], [/rivoluzione francese/, "🇫🇷"],
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

// figurine disegnate (SVG) per cose che nelle emoji non esistono o sono moderne: si usano con il segnaposto "@nome"
const _SV = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" style="width:1em;height:1em;display:inline-block;vertical-align:-0.12em"';
const EMO_SVG = {
  // la Lupa Capitolina con Romolo e Remo
  "@lupa": `<svg ${_SV}><path d="M2 55h60" stroke="#8B6B3E" stroke-width="3" stroke-linecap="round"/>
<path d="M52 29q10-8 9 6q-3-7-9-3z" fill="#6E737C"/>
<ellipse cx="36" cy="32" rx="18" ry="9" fill="#8A8F98"/>
<path d="M18 24h10v13l-10-3z" fill="#8A8F98"/>
<rect x="18" y="36" width="5" height="17" rx="2.5" fill="#6E737C"/><rect x="25" y="38" width="5" height="15" rx="2.5" fill="#6E737C"/>
<rect x="46" y="36" width="5" height="17" rx="2.5" fill="#6E737C"/><rect x="53" y="35" width="5" height="18" rx="2.5" fill="#6E737C"/>
<ellipse cx="13" cy="27" rx="8" ry="6.5" fill="#8A8F98"/><ellipse cx="6.5" cy="30" rx="5.5" ry="3.2" fill="#A3A8B0"/>
<circle cx="2.5" cy="29.5" r="1.8" fill="#222"/><circle cx="12" cy="25" r="1.4" fill="#222"/>
<path d="M13 21l4-9 4 11z" fill="#6E737C"/>
<ellipse cx="34" cy="50.5" rx="3.6" ry="2.8" fill="#E9B98A"/><circle cx="33" cy="45.5" r="3.2" fill="#F2CBA2"/>
<ellipse cx="41.5" cy="51" rx="3.4" ry="2.6" fill="#E9B98A"/><circle cx="41" cy="46.2" r="3" fill="#F2CBA2"/></svg>`,
  // caravella di Colombo
  "@caravella": `<svg ${_SV}><path d="M0 54q8-4 16 0t16 0t16 0t16 0v10H0z" fill="#4FA3E0"/>
<path d="M6 42h52q-3 12-16 12H20Q9 54 6 42z" fill="#8B5A2B"/><path d="M6 42h52v3H6z" fill="#6B4220"/>
<path d="M32 6v37M16 20v23M49 24v19" stroke="#5A3A1C" stroke-width="2.2" stroke-linecap="round"/>
<path d="M20 9q12 4 24 0v25q-12 4-24 0z" fill="#FFF4D6" stroke="#C9B58A" stroke-width="1"/>
<path d="M32 12v21M24 20h16" stroke="#D32F2F" stroke-width="3.2"/>
<path d="M9 23q7 3 14 0v15q-7 3-14 0z" fill="#FFF4D6" stroke="#C9B58A" stroke-width="1"/><path d="M16 26v9M12 30h8" stroke="#D32F2F" stroke-width="2.2"/>
<path d="M43 27q6 3 12 0v12q-6 2-12 0z" fill="#FFF4D6" stroke="#C9B58A" stroke-width="1"/>
<path d="M32 6l9 3-9 3z" fill="#D32F2F"/></svg>`,
  // Colosseo (un po' diroccato, per la caduta di Roma)
  "@colosseo": `<svg ${_SV}><path d="M2 56h60" stroke="#8B6B3E" stroke-width="3" stroke-linecap="round"/>
<path d="M5 56V30q0-8 8-8h22l6 7 8-3 7 7 3 3v20z" fill="#D9A66A"/>
<path d="M5 56V30q0-8 8-8h22l6 7 8-3 7 7 3 3v20z" fill="none" stroke="#B07B45" stroke-width="1.5"/>
<g fill="#7A4E2B">
<path d="M9 33v-4a2.6 2.6 0 015.2 0v4zM17 33v-4a2.6 2.6 0 015.200 0v4zM25 33v-4a2.6 2.6 0 015.200 0v4zM33 33v-4a2.6 2.6 0 015.200 0v4z"/>
<path d="M9 44v-4a2.6 2.6 0 015.200 0v4zM17 44v-4a2.6 2.6 0 015.200 0v4zM25 44v-4a2.6 2.6 0 015.200 0v4zM33 44v-4a2.6 2.6 0 015.200 0v4zM41 44v-4a2.6 2.6 0 015.200 0v4zM49 44v-4a2.6 2.6 0 015.200 0v4z"/>
<path d="M9 55v-5a2.6 2.6 0 015.200 0v5zM17 55v-5a2.6 2.6 0 015.200 0v5zM25 55v-5a2.6 2.6 0 015.200 0v5zM33 55v-5a2.6 2.6 0 015.200 0v5zM41 55v-5a2.6 2.6 0 015.200 0v5zM49 55v-5a2.6 2.6 0 015.200 0v5z"/></g>
<path d="M44 56l3-5 4 5zM54 56l2-4 4 4z" fill="#B07B45"/></svg>`
};
function iconHtml(e) { return EMO_SVG[e] || e; }
