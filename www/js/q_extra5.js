// ===== Altre domande: tecnologia e arte (fasce A, B e C) =====
// La risposta giusta è sempre la prima (poi vengono mescolate).
(function () {
  const S = (q, a, e) => ({ q, a, c: 0, e });
  const key = q => q.q + "|" + q.a[0];
  const add = (subject, band, list) => {   // salta le domande già presenti
    const have = new Set(QBANK[subject][band].map(key));
    QBANK[subject][band] = QBANK[subject][band].concat(list.filter(q => !have.has(key(q)) && have.add(key(q))));
  };

  // ===================== TECNOLOGIA, fascia A (1ª-2ª elementare) =====================
  add("tecnologia", "A", [
    S("Quale oggetto usiamo per spazzare il pavimento?", ["La scopa", "Il pettine", "La forchetta", "La lampadina"], "La scopa raccoglie la polvere."),
    S("Con che cosa si taglia il pane?", ["Con il coltello", "Con la gomma", "Con il righello", "Con la colla"], "Il coltello da pane ha la lama seghettata."),
    S("Quale oggetto serve per bere l'acqua?", ["Il bicchiere", "La scarpa", "Il cuscino", "Il libro"], "Il bicchiere contiene l'acqua."),
    S("Che cosa serve per cucire un bottone?", ["Ago e filo", "Martello e chiodi", "Colla e forbici", "Pennello e colori"], "Con ago e filo si cuce."),
    S("Di che materiale sono fatte le monete?", ["Di metallo", "Di carta", "Di stoffa", "Di legno"], "Le monete sono di metallo."),
    S("Di che materiale è fatto un palloncino?", ["Di gomma", "Di vetro", "Di legno", "Di ferro"], "La gomma si gonfia e si allunga."),
    S("Quale oggetto serve per tenere in ordine i libri?", ["La libreria", "La lavatrice", "Il frigorifero", "Il forno"], "I libri stanno sugli scaffali della libreria."),
    S("Quale mezzo usano i pompieri per spegnere il fuoco?", ["L'autopompa", "Il trattore", "La bicicletta", "Il monopattino"], "L'autopompa porta l'acqua."),
    S("Quale oggetto ci protegge dalla pioggia?", ["L'ombrello", "Il ventaglio", "Gli occhiali da sole", "La pala"], "L'ombrello ci tiene all'asciutto."),
    S("Che cosa usiamo per scrivere su una lavagna bianca?", ["Il pennarello", "Il gessetto", "La penna d'oca", "Il pennello a olio"], "Sulla lavagna bianca si scrive con i pennarelli."),
    S("Quale macchina serve per scavare la terra?", ["L'escavatore", "La lavatrice", "Il frullatore", "Il phon"], "L'escavatore ha una grande pala."),
    S("Che cosa serve per accendere la televisione da lontano?", ["Il telecomando", "La scopa", "Il cucchiaio", "La spazzola"], "Il telecomando comanda gli apparecchi a distanza."),
    S("Che cosa dobbiamo fare prima di attraversare la strada?", ["Fermarci e guardare a destra e a sinistra", "Chiudere gli occhi", "Correre più forte", "Guardare il cellulare"], "Si attraversa solo quando la strada è libera."),
    S("Con che cosa ci pettiniamo?", ["Con il pettine", "Con il martello", "Con le forbici", "Con il righello"], "Il pettine sistema i capelli.")
  ]);

  // ===================== TECNOLOGIA, fascia B (3ª-5ª elementare) =====================
  add("tecnologia", "B", [
    S("Che cos'è un ingranaggio?", ["Una ruota dentata che ne muove un'altra", "Un tipo di chiodo", "Un cavo elettrico", "Una colla speciale"], "Gli ingranaggi trasmettono il movimento."),
    S("Che cosa succede a un circuito se si apre l'interruttore?", ["La corrente si interrompe", "La corrente aumenta", "La lampadina si rompe", "Il filo si scioglie"], "Il circuito aperto non fa passare corrente."),
    S("Quale metallo si usa più spesso per fare i fili elettrici?", ["Il rame", "Il piombo", "L'oro", "Il mercurio"], "Il rame conduce bene l'elettricità ed è economico."),
    S("Quale di queste azioni risparmia energia?", ["Spegnere la luce uscendo da una stanza", "Lasciare la TV accesa", "Tenere il frigo aperto", "Accendere tutte le lampade"], "Spegnere ciò che non serve fa risparmiare."),
    S("Che cosa significa «riusare» un oggetto?", ["Usarlo ancora, anche in un altro modo", "Buttarlo subito", "Bruciarlo", "Nasconderlo"], "Riusare evita di produrre rifiuti."),
    S("In quale contenitore si butta una bottiglia di vetro?", ["In quello del vetro", "In quello della carta", "In quello dell'umido", "In nessuno: si lascia per terra"], "Il vetro si ricicla con la raccolta differenziata."),
    S("Che cos'è un tablet?", ["Un computer portatile con schermo tattile", "Un tipo di stampante", "Una penna speciale", "Un cavo"], "Si usa toccando lo schermo con le dita."),
    S("A che cosa serve il comando «Salva»?", ["A conservare il file", "A cancellare il file", "A stampare il file", "A spegnere il computer"], "Se non salvi, il lavoro si può perdere."),
    S("Che cosa significa «scaricare» un file da Internet?", ["Copiarlo sul proprio dispositivo", "Cancellarlo dalla rete", "Stamparlo", "Spegnerlo"], "Il download porta il file sul tuo dispositivo."),
    S("Quale regola vale quando si naviga su Internet?", ["Non dare mai dati personali a sconosciuti", "Dire a tutti dove abiti", "Dare la password agli amici", "Aprire ogni messaggio che arriva"], "I dati personali vanno protetti."),
    S("Quale strumento serve per misurare il tempo che passa?", ["Il cronometro", "Il righello", "Il termometro", "La bilancia"], "Il cronometro misura anche i secondi."),
    S("Il legno è un materiale…", ["Naturale, ricavato dagli alberi", "Prodotto solo in fabbrica", "Metallico", "Liquido"], "Il legno viene dai tronchi degli alberi."),
    S("La plastica è un materiale…", ["Artificiale, prodotto dall'uomo", "Naturale, ricavato dagli alberi", "Vivo", "Sempre trasparente"], "La plastica si ottiene con processi industriali.")
  ]);

  // ===================== TECNOLOGIA, fascia C (scuola media) =====================
  add("tecnologia", "C", [
    S("Che cos'è l'HTML?", ["Il linguaggio con cui si costruiscono le pagine web", "Un tipo di cavo di rete", "Un formato audio", "Un antivirus"], "HTML = HyperText Markup Language."),
    S("Che cos'è una porta USB?", ["Un ingresso per collegare periferiche e dispositivi", "Un tipo di antenna", "Un sistema operativo", "Un linguaggio di programmazione"], "USB = Universal Serial Bus."),
    S("Che cos'è un motore di ricerca?", ["Un programma per cercare informazioni sul web", "Un motore elettrico", "Un tipo di antivirus", "Una stampante"], "Google, Bing e DuckDuckGo sono motori di ricerca."),
    S("Che cos'è un sensore?", ["Un dispositivo che rileva una grandezza fisica", "Un tipo di batteria", "Un cavo speciale", "Un programma di disegno"], "Per esempio rileva luce, temperatura o movimento."),
    S("Che cosa misura un amperometro?", ["L'intensità della corrente", "La tensione", "La resistenza", "La temperatura"], "Si misura in ampere."),
    S("Che cosa misura un voltmetro?", ["La tensione elettrica", "L'intensità della corrente", "Il peso", "La lunghezza"], "Si misura in volt."),
    S("Quale materiale è alla base dei chip dei computer?", ["Il silicio", "Il legno", "La lana", "Il cemento"], "Il silicio è un semiconduttore."),
    S("Su che cosa si basa una centrale nucleare?", ["Sulla fissione di atomi pesanti, come l'uranio", "Sulla combustione del carbone", "Sulla forza del vento", "Sulla caduta dell'acqua"], "La fissione libera molto calore."),
    S("Che cosa significa «open source»?", ["Che il codice è pubblico e chiunque può studiarlo", "Che il programma è segreto", "Che funziona solo online", "Che non ha alcuna licenza"], "Il codice aperto si può leggere e migliorare."),
    S("Che cos'è il cyberbullismo?", ["Prepotenze e offese fatte con strumenti digitali", "Un gioco online di squadra", "Un tipo di virus", "Un programma di scrittura"], "È una forma di bullismo, e fa male come l'altra."),
    S("Quale struttura permette a un programma di scegliere tra due strade?", ["La condizione («se… allora… altrimenti…»)", "Il ciclo", "La variabile", "Il commento"], "In molti linguaggi si scrive con if/else."),
    S("Che cosa fa un compilatore?", ["Traduce il codice in linguaggio macchina", "Disegna le immagini", "Pulisce il disco", "Stampa il codice"], "Il computer esegue il codice tradotto."),
    S("Che cos'è un prototipo?", ["Un modello di prova di un oggetto da costruire", "Un oggetto già venduto", "Un progetto buttato via", "Una copia illegale"], "Prima si prova, poi si migliora."),
    S("Che cos'è un brevetto?", ["Il diritto esclusivo di sfruttare un'invenzione", "Un tipo di ingranaggio", "Un permesso di guida", "Una colla speciale"], "Protegge chi ha inventato qualcosa di nuovo.")
  ]);

  // ===================== ARTE, fascia A (1ª-2ª elementare) =====================
  add("arte", "A", [
    S("Con che cosa si può disegnare sul marciapiede?", ["Con i gessetti", "Con la colla", "Con le forbici", "Con il righello"], "I gessetti colorati si lavano via."),
    S("Con che cosa si fa la pittura a dita?", ["Con le dita", "Con il martello", "Con il righello", "Con le forbici"], "Basta intingere le dita nel colore."),
    S("Di che colore dipingi il cielo quando è sereno?", ["Azzurro", "Marrone", "Nero", "Rosa"], "Il cielo sereno è azzurro."),
    S("Di che colore diventano le foglie in autunno?", ["Gialle, arancioni e marroni", "Solo blu", "Solo bianche", "Viola e rosa"], "In autunno le foglie cambiano colore e cadono."),
    S("Come si chiama la linea lontana dove sembra finire la terra e iniziare il cielo?", ["L'orizzonte", "La cornice", "La tela", "Il confine"], "È l'orizzonte."),
    S("Che cosa si fa con carta colorata e forbici?", ["Si ritagliano forme per un collage", "Si cuoce il pane", "Si misura la febbre", "Si ascolta la musica"], "Ritagli e incolli: nasce un collage."),
    S("Quale forma disegni per fare il sole?", ["Un cerchio", "Un quadrato", "Un triangolo", "Un rettangolo"], "Il sole si disegna rotondo, con i raggi."),
    S("Che cosa si disegna bene con il compasso?", ["Un cerchio", "Un quadrato", "Un triangolo", "Una linea storta"], "Il compasso gira intorno a un punto."),
    S("A che cosa serve una maschera di Carnevale?", ["A travestirsi", "A pesare", "A scrivere", "A misurare"], "A Carnevale ci si veste in maschera."),
    S("Di che colore è una fragola matura?", ["Rossa", "Blu", "Viola", "Nera"], "La fragola matura è rossa."),
    S("Che cosa vedi in un arcobaleno?", ["Tanti colori in fila", "Solo il nero", "Solo il bianco", "Un colore solo"], "L'arcobaleno ha sette colori."),
    S("Quale pennello è adatto per i dettagli piccoli?", ["Quello sottile", "Quello molto largo", "Un rullo", "Una spugna"], "La punta sottile è precisa."),
    S("Che cosa succede ai colori se li mescoli con tanta acqua?", ["Diventano più chiari e trasparenti", "Diventano più scuri e densi", "Diventano neri", "Diventano una statua"], "L'acqua diluisce il colore."),
    S("Quali colori usi per dipingere un tramonto?", ["Arancione, rosso e giallo", "Solo verde", "Solo nero", "Grigio e bianco"], "Il tramonto ha colori caldi.")
  ]);

  // ===================== ARTE, fascia B (3ª-5ª elementare) =====================
  add("arte", "B", [
    S("Che cos'è l'ombra in un disegno?", ["La zona scura dove non arriva la luce", "Un colore caldo", "Una cornice", "Una tela"], "Le ombre danno profondità."),
    S("Che cos'è il chiaroscuro?", ["Il gioco di luci e di ombre in un'opera", "Un colore nuovo", "Un tipo di cornice", "Una scultura di legno"], "Il chiaroscuro dà volume alle figure."),
    S("In quale città si trova la Galleria degli Uffizi?", ["Firenze", "Roma", "Venezia", "Napoli"], "Gli Uffizi sono a Firenze."),
    S("Che cosa sono i colori a tempera?", ["Colori coprenti che si diluiscono con l'acqua", "Colori a olio", "Matite colorate", "Colori per il vetro"], "La tempera si usa molto a scuola."),
    S("Che cos'è la ceramica?", ["L'arte di modellare e cuocere l'argilla", "La pittura su tela", "Il disegno al computer", "La scultura nel ghiaccio"], "Piatti, vasi e tazze si fanno con la ceramica."),
    S("Che cos'è un bassorilievo?", ["Una scultura che sporge poco da una superficie piana", "Una statua staccata dal muro", "Un quadro a olio", "Un mosaico di vetro"], "Si trova spesso su porte e monumenti."),
    S("Che cos'è la fotografia?", ["Un'immagine ottenuta con la luce e una macchina", "Un disegno a matita", "Una scultura", "Un affresco"], "Foto significa «luce»."),
    S("Chi era Raffaello Sanzio?", ["Un grande pittore del Rinascimento", "Un re francese", "Un navigatore", "Un musicista barocco"], "Dipinse «La scuola di Atene»."),
    S("Come si chiama il riquadro che contiene una scena del fumetto?", ["Vignetta", "Tavolozza", "Cornice", "Cavalletto"], "Più vignette fanno una striscia."),
    S("Quale strumento usa lo scultore per lavorare il marmo?", ["Lo scalpello", "Il pennello", "Il pennarello", "La matita"], "Lo scalpello toglie il marmo in eccesso."),
    S("Che cos'è il disegno tecnico?", ["Un disegno preciso, fatto con strumenti, per progettare", "Un disegno a mano libera senza regole", "Una pittura a olio", "Un fumetto"], "Serve a costruire oggetti ed edifici."),
    S("Che cos'è il tratteggio?", ["Tante linee ravvicinate per creare ombre", "Un colore", "Una tela", "Un museo"], "Più le linee sono vicine, più l'ombra è scura."),
    S("Che cosa sono i geroglifici?", ["La scrittura per immagini degli antichi Egizi", "Un tipo di statua greca", "Un dipinto romano", "Un colore"], "Si trovano sui muri dei templi e sui papiri."),
    S("In quale città si trova la Basilica di San Marco?", ["Venezia", "Milano", "Torino", "Genova"], "È famosa per i suoi mosaici dorati.")
  ]);

  // ===================== ARTE, fascia C (scuola media) =====================
  add("arte", "C", [
    S("Chi dipinse «Il bacio» del Romanticismo italiano, con due giovani in abiti medievali?", ["Francesco Hayez", "Gustav Klimt", "Giotto", "Raffaello"], "Hayez lo dipinse nel 1859."),
    S("Chi è Banksy?", ["Un artista di street art dall'identità sconosciuta", "Un architetto rinascimentale", "Un musicista barocco", "Un pittore impressionista"], "Le sue opere compaiono sui muri delle città."),
    S("Che cos'è il Cubismo?", ["Una corrente che scompone gli oggetti in forme geometriche", "Una corrente che dipinge solo paesaggi", "Una corrente che imita l'antica Roma", "Una corrente che usa solo il bianco e nero"], "Lo fondarono Picasso e Braque."),
    S("Chi dipinse «Il giuramento degli Orazi»?", ["Jacques-Louis David", "Claude Monet", "Vincent van Gogh", "Giotto"], "È un'opera del Neoclassicismo."),
    S("Quale ingegnere diede il nome alla Torre Eiffel?", ["Gustave Eiffel", "Antoni Gaudí", "Filippo Brunelleschi", "Renzo Piano"], "La torre fu costruita per l'Esposizione universale del 1889."),
    S("Quale architetto italiano ha progettato il Centro Pompidou di Parigi insieme a Richard Rogers?", ["Renzo Piano", "Gio Ponti", "Carlo Scarpa", "Aldo Rossi"], "Piano è nato a Genova."),
    S("Che cos'è l'Art Nouveau?", ["Uno stile di fine Ottocento con linee curve e decorazioni ispirate alla natura", "Lo stile dell'antica Grecia", "Lo stile del Medioevo", "L'arte rupestre"], "In Italia si chiama anche Liberty."),
    S("Chi era Jackson Pollock?", ["Un pittore che faceva «dripping», colando il colore sulla tela", "Un architetto gotico", "Uno scultore greco", "Un pittore del Seicento"], "Il dripping è tipico dell'espressionismo astratto."),
    S("Chi era Artemisia Gentileschi?", ["Una pittrice barocca italiana", "Una scultrice greca", "Un'architetta del Novecento", "Una poetessa romana"], "Fu una delle prime donne a sfondare nella pittura."),
    S("Che cosa si intende per «arte contemporanea»?", ["L'arte più recente, del nostro tempo", "L'arte dell'antico Egitto", "L'arte del Medioevo", "L'arte rupestre"], "Comprende opere di oggi, anche digitali."),
    S("Che cos'è la Biennale di Venezia?", ["Una grande esposizione internazionale d'arte", "Un tipo di gondola", "Un museo di storia", "Una gara di nuoto"], "Si tiene a Venezia ogni due anni."),
    S("Che cos'è il restauro di un'opera d'arte?", ["Il recupero e la cura di un'opera danneggiata", "La creazione di una copia falsa", "La vendita di un quadro", "La distruzione di un'opera"], "Serve a conservare le opere per il futuro."),
    S("Che cos'è un trittico?", ["Un'opera composta da tre pannelli", "Una statua con tre teste", "Un quadro con tre colori", "Un edificio con tre torri"], "Spesso i pannelli laterali si chiudono su quello centrale."),
    S("Che cos'è una miniatura nei manoscritti medievali?", ["Una piccola illustrazione dipinta a mano nei libri", "Una statua piccolissima", "Un tipo di orologio", "Un quadro gigante"], "I monaci miniavano i libri con colori e oro.")
  ]);
  // niente domande doppie (stesso testo) nei banchi di tecnologia e arte
  ["tecnologia", "arte"].forEach(sub => ["A", "B", "C"].forEach(band => {
    const seen = new Set();
    QBANK[sub][band] = QBANK[sub][band].filter(q => !seen.has(q.q) && seen.add(q.q));
  }));
})();
