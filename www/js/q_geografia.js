// ===== Banco domande di GEOGRAFIA =====
// Formato: { q, a: [4 risposte], c: 0 (la prima è giusta, poi vengono mescolate), e: spiegazione }
(function () {
  const S = (q, a, e) => ({ q, a, c: 0, e });

  // 1ª–2ª elementare: paesaggi, punti cardinali, Italia
  const A = [
    S("Come si chiama la capitale d'Italia?", ["Roma", "Milano", "Napoli", "Torino"], "Roma è la capitale d'Italia."),
    S("Che forma ha l'Italia sulla carta geografica?", ["Uno stivale", "Un cerchio", "Un quadrato", "Una stella"], "L'Italia sembra proprio uno stivale."),
    S("Che cos'è un lago?", ["Acqua circondata dalla terra", "Terra circondata dall'acqua", "Una montagna", "Un fiume salato"], "Il lago è una grande distesa d'acqua circondata dalla terra."),
    S("Che cos'è un'isola?", ["Terra circondata dall'acqua", "Acqua circondata dalla terra", "Una montagna di ghiaccio", "Un deserto"], "Un'isola ha il mare tutto intorno."),
    S("Quale di questi è un fiume?", ["Il Po", "L'Etna", "Il Garda", "Le Alpi"], "Il Po è il fiume più lungo d'Italia."),
    S("Dove si trovano le onde e la sabbia?", ["Al mare", "In montagna", "In città", "Nel deserto"], "Le onde e le spiagge sono al mare."),
    S("La parte più alta di una montagna si chiama…", ["Cima", "Valle", "Riva", "Foce"], "La cima, o vetta, è il punto più alto."),
    S("Com'è una pianura?", ["Una zona piatta", "Una zona molto alta", "Un grande lago", "Un'isola"], "La pianura è una distesa di terra piatta."),
    S("Da quale parte sorge il sole?", ["A est", "A ovest", "A nord", "A sud"], "Il sole sorge a est e tramonta a ovest."),
    S("Che cosa mostra una carta geografica?", ["Un luogo visto dall'alto, in piccolo", "Quanti anni hai", "Che tempo farà domani", "Le ricette"], "La carta disegna il territorio visto dall'alto."),
    S("Che colore si usa di solito per il mare sulle carte?", ["Azzurro", "Rosso", "Nero", "Giallo"], "Il mare si disegna con l'azzurro o il blu."),
    S("Dove vivono i pinguini?", ["Al Polo Sud", "Nel deserto", "Nella savana", "Nelle città"], "I pinguini vivono in Antartide, vicino al Polo Sud."),
    S("Venezia è famosa per i suoi…", ["Canali", "Vulcani", "Deserti", "Ghiacciai"], "A Venezia le strade sono canali pieni d'acqua."),
    S("In quale città si trova il Colosseo?", ["Roma", "Parigi", "Milano", "Venezia"], "Il Colosseo è nel centro di Roma.")
  ];

  // 3ª–5ª elementare: Italia, Europa, continenti
  const B = [
    S("Qual è il fiume più lungo d'Italia?", ["Il Po", "Il Tevere", "L'Arno", "L'Adige"], "Il Po attraversa tutta la pianura padana."),
    S("Quale catena montuosa si trova a nord dell'Italia?", ["Le Alpi", "Gli Appennini", "I Pirenei", "Le Ande"], "Le Alpi chiudono l'Italia a nord."),
    S("Quale catena montuosa attraversa l'Italia da nord a sud?", ["Gli Appennini", "Le Alpi", "Gli Urali", "Le Montagne Rocciose"], "Gli Appennini sono la «spina dorsale» dell'Italia."),
    S("Quante regioni ha l'Italia?", ["20", "15", "10", "25"], "L'Italia è divisa in 20 regioni."),
    S("Qual è il capoluogo della Lombardia?", ["Milano", "Torino", "Venezia", "Genova"], "Milano è il capoluogo della Lombardia."),
    S("Qual è il capoluogo del Piemonte?", ["Torino", "Milano", "Aosta", "Cuneo"], "Torino è il capoluogo del Piemonte."),
    S("Qual è il capoluogo della Toscana?", ["Firenze", "Pisa", "Siena", "Livorno"], "Firenze è il capoluogo della Toscana."),
    S("Qual è il capoluogo della Sicilia?", ["Palermo", "Catania", "Messina", "Siracusa"], "Palermo è il capoluogo della Sicilia."),
    S("Qual è il capoluogo della Campania?", ["Napoli", "Salerno", "Caserta", "Avellino"], "Napoli è il capoluogo della Campania."),
    S("Qual è il capoluogo del Veneto?", ["Venezia", "Verona", "Padova", "Treviso"], "Venezia è il capoluogo del Veneto."),
    S("Qual è il capoluogo della Sardegna?", ["Cagliari", "Sassari", "Olbia", "Nuoro"], "Cagliari è il capoluogo della Sardegna."),
    S("Quali sono le due isole più grandi d'Italia?", ["Sicilia e Sardegna", "Capri e Ischia", "Elba e Giglio", "Lampedusa e Pantelleria"], "Sicilia e Sardegna sono le isole maggiori."),
    S("Qual è il vulcano attivo più alto della Sicilia?", ["L'Etna", "Il Vesuvio", "Lo Stromboli", "Il Vulture"], "L'Etna domina la costa orientale della Sicilia."),
    S("Quale vulcano si trova vicino a Napoli?", ["Il Vesuvio", "L'Etna", "Lo Stromboli", "Il Monte Bianco"], "Il Vesuvio sovrasta il golfo di Napoli."),
    S("Qual è il lago più grande d'Italia?", ["Il lago di Garda", "Il lago Maggiore", "Il lago di Como", "Il lago Trasimeno"], "Il Garda è il più esteso lago italiano."),
    S("Quale mare si trova a est dell'Italia?", ["L'Adriatico", "Il Tirreno", "Il Mar Ligure", "Il Mar Nero"], "L'Adriatico bagna la costa orientale."),
    S("Quale mare bagna la costa occidentale della penisola (Toscana, Lazio, Campania)?", ["Il Tirreno", "L'Adriatico", "Il Mar Baltico", "Il Mar Rosso"], "Il Tirreno è a ovest della penisola."),
    S("Quale piccolo stato si trova dentro la città di Roma?", ["Città del Vaticano", "San Marino", "Monaco", "Malta"], "Il Vaticano è lo stato più piccolo del mondo."),
    S("Quale di questi stati confina con l'Italia?", ["La Svizzera", "La Spagna", "Il Portogallo", "La Polonia"], "L'Italia confina con Francia, Svizzera, Austria e Slovenia."),
    S("Qual è la capitale della Francia?", ["Parigi", "Londra", "Madrid", "Berlino"], "Parigi è la capitale della Francia."),
    S("Qual è la capitale della Spagna?", ["Madrid", "Barcellona", "Lisbona", "Siviglia"], "Madrid è la capitale della Spagna."),
    S("Qual è la capitale della Germania?", ["Berlino", "Monaco", "Amburgo", "Vienna"], "Berlino è la capitale della Germania."),
    S("Quale di questi NON è un continente?", ["L'Italia", "L'Africa", "L'Asia", "L'Europa"], "L'Italia è uno stato, non un continente."),
    S("Qual è il continente più grande?", ["L'Asia", "L'Africa", "L'Europa", "L'Oceania"], "L'Asia è il continente più esteso."),
    S("Come si chiama il grande deserto dell'Africa del nord?", ["Sahara", "Gobi", "Kalahari", "Atacama"], "Il Sahara è il deserto caldo più grande del mondo."),
    S("Qual è l'oceano più grande?", ["L'oceano Pacifico", "L'oceano Atlantico", "L'oceano Indiano", "L'oceano Artico"], "Il Pacifico occupa quasi un terzo del pianeta."),
    S("Dove fa più caldo sulla Terra?", ["Vicino all'Equatore", "Al Polo Nord", "Al Polo Sud", "Sulle Alpi"], "Il sole arriva più dritto vicino all'Equatore."),
    S("Qual è la montagna più alta delle Alpi?", ["Il Monte Bianco", "Il Cervino", "Il Monviso", "Il Gran Sasso"], "Il Monte Bianco supera i 4800 metri.")
  ];

  // medie: mondo, capitali, fiumi e montagne, clima
  const C = [
    S("Qual è la capitale del Canada?", ["Ottawa", "Toronto", "Montréal", "Vancouver"], "La capitale è Ottawa, non Toronto."),
    S("Qual è la capitale dell'Australia?", ["Canberra", "Sydney", "Melbourne", "Perth"], "La capitale è Canberra, non Sydney."),
    S("Qual è la capitale del Brasile?", ["Brasilia", "Rio de Janeiro", "San Paolo", "Salvador"], "Brasilia è stata costruita apposta come capitale."),
    S("Qual è la capitale della Turchia?", ["Ankara", "Istanbul", "Smirne", "Antalya"], "La capitale è Ankara, anche se Istanbul è più grande."),
    S("Qual è la capitale della Svizzera?", ["Berna", "Zurigo", "Ginevra", "Basilea"], "La capitale svizzera è Berna."),
    S("Qual è la capitale dell'Egitto?", ["Il Cairo", "Alessandria", "Luxor", "Giza"], "Il Cairo sorge lungo il Nilo."),
    S("Qual è la capitale del Giappone?", ["Tokyo", "Osaka", "Kyoto", "Hiroshima"], "Tokyo è la capitale del Giappone."),
    S("Qual è la capitale della Polonia?", ["Varsavia", "Cracovia", "Danzica", "Praga"], "Varsavia è la capitale della Polonia."),
    S("Qual è il fiume più lungo d'Europa?", ["Il Volga", "Il Danubio", "Il Reno", "La Senna"], "Il Volga scorre in Russia ed è lungo oltre 3500 km."),
    S("Quale fiume attraversa l'Egitto?", ["Il Nilo", "Il Tigri", "Il Danubio", "Il Gange"], "L'Egitto vive lungo il Nilo."),
    S("Qual è la montagna più alta del mondo?", ["L'Everest", "Il K2", "Il Monte Bianco", "Il Kilimangiaro"], "L'Everest, in Asia, supera gli 8800 metri."),
    S("Dove si trova la catena dell'Himalaya?", ["In Asia", "In Africa", "In Europa", "In America"], "L'Himalaya è in Asia."),
    S("Quale catena montuosa separa in parte Europa e Asia?", ["Gli Urali", "Le Alpi", "I Pirenei", "Gli Appennini"], "Gli Urali sono il confine convenzionale."),
    S("Dove si trovano le Dolomiti?", ["Nel nord-est dell'Italia", "In Sicilia", "In Sardegna", "In Puglia"], "Le Dolomiti sono tra Veneto, Trentino e Alto Adige."),
    S("Qual è la regione italiana più estesa?", ["La Sicilia", "La Lombardia", "Il Piemonte", "La Toscana"], "La Sicilia è la regione più grande d'Italia."),
    S("Qual è la regione italiana più piccola?", ["La Valle d'Aosta", "Il Molise", "La Liguria", "L'Umbria"], "La Valle d'Aosta è la più piccola."),
    S("Quale stretto separa la Sicilia dal resto d'Italia?", ["Lo Stretto di Messina", "Lo Stretto di Gibilterra", "Il Canale di Suez", "Il Bosforo"], "Lo Stretto di Messina è tra Sicilia e Calabria."),
    S("Quale stretto collega il Mediterraneo all'Atlantico?", ["Gibilterra", "Messina", "Bosforo", "Dover"], "Lo stretto di Gibilterra è tra Spagna e Marocco."),
    S("Il Canale di Suez unisce il Mediterraneo al…", ["Mar Rosso", "Mar Nero", "Mar Baltico", "Oceano Pacifico"], "Il canale di Suez, in Egitto, collega due mari."),
    S("Quale oceano si trova tra l'Africa e l'Australia?", ["L'oceano Indiano", "L'oceano Atlantico", "L'oceano Pacifico", "L'oceano Artico"], "L'oceano Indiano bagna Africa, Asia e Australia."),
    S("In quale continente si trova la Foresta Amazzonica?", ["America del Sud", "Africa", "Asia", "Europa"], "L'Amazzonia è in Sud America, soprattutto in Brasile."),
    S("Quale continente ha più abitanti?", ["L'Asia", "L'Europa", "L'Africa", "L'Oceania"], "In Asia vive più della metà dell'umanità."),
    S("Qual è lo stato più grande del mondo per superficie?", ["La Russia", "Il Canada", "La Cina", "Gli Stati Uniti"], "La Russia si estende su due continenti."),
    S("Come sono le estati e gli inverni nel clima mediterraneo?", ["Estati calde e secche, inverni miti", "Inverni freddissimi tutto l'anno", "Piogge continue", "Sempre neve"], "Il clima mediterraneo è tipico delle coste dell'Italia."),
    S("Che cosa è un delta?", ["La foce di un fiume divisa in più rami", "Una montagna", "Un deserto", "Un lago ghiacciato"], "Il Po e il Nilo finiscono in mare con un delta."),
    S("Che linea immaginaria divide la Terra in emisfero nord e sud?", ["L'Equatore", "Il Meridiano di Greenwich", "Il Tropico del Cancro", "Il Circolo polare"], "L'Equatore è il parallelo più lungo."),
    S("A che cosa servono i paralleli e i meridiani?", ["A individuare un punto sulla Terra", "A misurare la temperatura", "A contare gli abitanti", "A disegnare i confini"], "Latitudine e longitudine formano le coordinate geografiche."),
    S("Quale moneta si usa in Italia e in Germania?", ["L'euro", "Il dollaro", "La sterlina", "Il franco"], "L'euro è la moneta di molti stati dell'Unione Europea.")
  ];

  QBANK.geografia = { A, B, C };
})();
