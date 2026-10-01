// ===== Altre domande: Latino, Storia (fascia A), Geografia (fascia A), Arte, Musica, Educazione civica (fascia A) =====
// Si aggiungono ai banchi già esistenti. Formato: la risposta giusta è sempre la prima, poi vengono mescolate.
(function () {
  const S = (q, a, e) => ({ q, a, c: 0, e });
  const add = (subject, band, list) => { QBANK[subject][band] = QBANK[subject][band].concat(list); };

  // ===================== LATINO (solo dalla 2ª media) =====================
  const LAT = [
    S("Che cosa significa «ager»?", ["Campo", "Aquila", "Agnello", "Aria"], "Ager = campo."),
    S("Che cosa significa «silva»?", ["Bosco", "Sale", "Seta", "Sera"], "Silva = bosco, selva."),
    S("Che cosa significa «ignis»?", ["Fuoco", "Ignoto", "Isola", "Inverno"], "Ignis = fuoco."),
    S("Che cosa significa «urbs»?", ["Città", "Orso", "Orto", "Urna"], "Urbs = città."),
    S("Che cosa significa «civis»?", ["Cittadino", "Civetta", "Cibo", "Cesto"], "Civis = cittadino."),
    S("Che cosa significa «miles»?", ["Soldato", "Miele", "Mille", "Mulo"], "Miles = soldato."),
    S("Che cosa significa «bellum»?", ["Guerra", "Bello", "Bue", "Barca"], "Bellum = guerra."),
    S("Che cosa significa «pax»?", ["Pace", "Pane", "Pazzo", "Pesce"], "Pax = pace."),
    S("Che cosa significa «mors»?", ["Morte", "Mora", "Mare", "Morso"], "Mors = morte."),
    S("Che cosa significa «homo»?", ["Uomo", "Omero", "Oro", "Onda"], "Homo = uomo."),
    S("Che cosa significa «deus»?", ["Dio", "Due", "Dente", "Dado"], "Deus = dio."),
    S("Che cosa significa «mons»?", ["Monte", "Mondo", "Mano", "Moneta"], "Mons = monte."),
    S("Che cosa significa «flumen»?", ["Fiume", "Fiore", "Fumo", "Fiamma"], "Flumen = fiume."),
    S("Che cosa significa «caelum»?", ["Cielo", "Cella", "Cena", "Casa"], "Caelum = cielo."),
    S("Che cosa significa «oculus»?", ["Occhio", "Orecchio", "Osso", "Ottimo"], "Oculus = occhio."),
    S("Che cosa significa «manus»?", ["Mano", "Mamma", "Mantello", "Mare"], "Manus = mano."),
    S("Che cosa significa «tempus»?", ["Tempo", "Tempio", "Tempesta", "Tenda"], "Tempus = tempo."),
    S("Che cosa significa «lux»?", ["Luce", "Lusso", "Luna", "Lupo"], "Lux = luce."),
    S("Che cosa significa «navis»?", ["Nave", "Neve", "Notte", "Naso"], "Navis = nave."),
    S("Che cosa significa «gladius»?", ["Spada", "Gladiatore", "Ghiaccio", "Gelato"], "Gladius = spada."),
    S("Che cosa significa «templum»?", ["Tempio", "Tempo", "Tenda", "Tetto"], "Templum = tempio."),
    S("Che cosa significa «insula»?", ["Isola", "Insalata", "Insetto", "Ingresso"], "Insula = isola."),
    S("Che cosa significa «magister»?", ["Maestro", "Magro", "Mago", "Maggio"], "Magister = maestro."),
    S("Che cosa significa «servus»?", ["Servo", "Sera", "Serpente", "Sedia"], "Servus = servo, schiavo."),
    S("Che cosa significa «pecunia»?", ["Denaro", "Pecora", "Pelle", "Pelo"], "Pecunia = denaro."),
    S("Che cosa significa «habeo»?", ["Io ho", "Tu hai", "Egli ha", "Noi abbiamo"], "Habeo = io ho."),
    S("Che cosa significa «video»?", ["Io vedo", "Tu vedi", "Egli vede", "Noi vediamo"], "Video = io vedo."),
    S("Che cosa significa «laudo»?", ["Io lodo", "Tu lodi", "Egli loda", "Essi lodano"], "Laudo = io lodo."),
    S("Che cosa significa «scribo»?", ["Io scrivo", "Tu scrivi", "Egli scrive", "Noi scriviamo"], "Scribo = io scrivo."),
    S("Come si dice «voi siete» in latino?", ["Estis", "Sumus", "Sunt", "Es"], "Estis = voi siete."),
    S("Come si dice «io amo» in latino?", ["Amo", "Amas", "Amat", "Amamus"], "Amo = io amo."),
    S("Come si dice «noi amiamo» in latino?", ["Amamus", "Amatis", "Amant", "Amo"], "Amamus = noi amiamo."),
    S("Che cosa significa «Cogito, ergo sum»?", ["Penso, dunque sono", "Sono, dunque penso", "Vedo, dunque credo", "Parlo, dunque esisto"], "Frase del filosofo Cartesio."),
    S("Che cosa significa «Tempus fugit»?", ["Il tempo fugge", "Il tempo è denaro", "Il tempo guarisce", "Il tempo si ferma"], "Il tempo passa in fretta."),
    S("Che cosa significa «Panem et circenses»?", ["Pane e giochi del circo", "Pane e vino", "Pace e guerra", "Casa e lavoro"], "Il popolo romano chiedeva cibo e spettacoli."),
    S("Che cosa significa «Ora et labora»?", ["Prega e lavora", "Studia e impara", "Mangia e dormi", "Corri e salta"], "È il motto dei monaci benedettini."),
    S("Che cosa significa «Memento mori»?", ["Ricordati che devi morire", "Ricordati di vivere", "Ricordati di me", "Ricordati la lezione"], "Un richiamo alla brevità della vita."),
    S("Che cosa significa «Per aspera ad astra»?", ["Attraverso le difficoltà fino alle stelle", "Dalle stelle alla terra", "Dopo la pioggia il sereno", "Chi dorme non piglia pesci"], "Con fatica si arriva in alto."),
    S("Che cosa significa «Hic et nunc»?", ["Qui e ora", "Su e giù", "Prima o poi", "Sempre e mai"], "Hic = qui, nunc = ora."),
    S("Che cosa significa «In vino veritas»?", ["Nel vino sta la verità", "Il vino è buono", "La verità è amara", "Bevi con moderazione"], "Si diceva che il vino sciogliesse la lingua."),
    S("Che cosa significa «Homo sapiens»?", ["Uomo che sa, uomo saggio", "Uomo antico", "Uomo forte", "Uomo primitivo"], "È il nome scientifico della nostra specie."),
    S("Che cosa significa «exempli gratia» (e.g.)?", ["Per esempio", "Per grazia ricevuta", "Come sopra", "In breve"], "Si usa per introdurre un esempio."),
    S("Che cosa significa «et cetera»?", ["E le altre cose", "E basta", "E poi", "E dopo"], "Si usa per chiudere un elenco."),
    S("Che cosa significa «ad hoc»?", ["Per questo scopo", "A casa", "Alla fine", "Per sempre"], "Fatto apposta per una situazione."),
    S("Che cosa significa «post scriptum» (P.S.)?", ["Scritto dopo", "Scritto prima", "Scritto male", "Scritto a mano"], "Si aggiunge in fondo a una lettera."),
    S("Quale caso si usa per il complemento di termine («a chi?»)?", ["Il dativo", "Il genitivo", "L'accusativo", "Il nominativo"], "Il dativo risponde a «a chi? a che cosa?»."),
    S("Quale caso si usa per chiamare o invocare qualcuno?", ["Il vocativo", "L'ablativo", "Il genitivo", "Il dativo"], "Il vocativo serve a chiamare."),
    S("Qual è il dativo singolare di «rosa»?", ["Rosae", "Rosam", "Rosas", "Rosarum"], "Rosa, rosae, rosae..."),
    S("Qual è il genitivo plurale di «rosa»?", ["Rosarum", "Rosae", "Rosis", "Rosas"], "Rosarum = delle rose."),
    S("Qual è il nominativo plurale di «dominus»?", ["Domini", "Dominum", "Dominorum", "Dominis"], "Dominus, domini (plurale: domini)."),
    S("Chi scrisse le «Metamorfosi»?", ["Ovidio", "Virgilio", "Cesare", "Seneca"], "Ovidio racconta trasformazioni mitologiche."),
    S("Chi fu Cicerone?", ["Un grande oratore romano", "Un imperatore", "Un gladiatore", "Un poeta greco"], "Cicerone è famoso per i suoi discorsi.")
  ];
  ["A", "B", "C"].forEach(b => add("latino", b, LAT));

  // ===================== STORIA, fascia A =====================
  add("storia", "A", [
    S("Che cosa studia uno storico?", ["Il passato", "Il futuro", "Le stelle", "Gli animali"], "Lo storico racconta com'era la vita nel passato."),
    S("Che cosa sono le fonti storiche?", ["Oggetti e documenti che ci raccontano il passato", "Sorgenti d'acqua", "Giochi del cortile", "Fiumi di montagna"], "Con le fonti scopriamo cosa è successo."),
    S("Come si procuravano il cibo gli uomini primitivi?", ["Cacciando e raccogliendo frutti", "Andando al supermercato", "Ordinando una pizza", "Usando il frigorifero"], "Cacciavano animali e raccoglievano frutti."),
    S("Che cosa imparò a usare l'uomo primitivo per scaldarsi e cuocere il cibo?", ["Il fuoco", "L'elettricità", "Il gas", "La batteria"], "Il fuoco fu una grande scoperta."),
    S("Dove dipingevano gli uomini primitivi?", ["Sulle pareti delle caverne", "Sui fogli di carta", "Sui computer", "Sui tablet"], "Disegnavano animali sulle rocce."),
    S("Che cosa sono le piramidi?", ["Le tombe dei faraoni egizi", "Le case dei Romani", "I castelli medievali", "I teatri greci"], "Le piramidi si trovano in Egitto."),
    S("Chi erano i gladiatori?", ["Combattenti che si sfidavano nell'arena", "Maestri di scuola", "Pescatori", "Cuochi romani"], "Combattevano nel Colosseo."),
    S("Che cosa indossavano i cavalieri per proteggersi?", ["L'armatura", "Il pigiama", "Il grembiule", "Il costume da bagno"], "L'armatura era fatta di metallo."),
    S("Che cosa usavano per scrivere ai tempi dei castelli?", ["La penna d'oca", "La penna a sfera", "Il computer", "Il pennarello"], "Si intingeva la penna nell'inchiostro."),
    S("Quale invenzione aiutò gli uomini a spostare i pesi?", ["La ruota", "Il telefono", "La lampadina", "Il televisore"], "La ruota è un'invenzione antichissima."),
    S("Quale mezzo non esisteva ai tempi dei Romani?", ["L'automobile", "Il carro", "La nave", "Il cavallo"], "L'automobile fu inventata molto dopo."),
    S("Come si illuminavano le case prima della luce elettrica?", ["Con candele e lampade a olio", "Con le lampadine", "Con i led", "Con il neon"], "Si usavano candele e lampade a olio.")
  ]);

  // ===================== GEOGRAFIA, fascia A =====================
  add("geografia", "A", [
    S("Che cos'è una pianura?", ["Un terreno piatto", "Una montagna alta", "Un mare profondo", "Un vulcano"], "In pianura non ci sono salite."),
    S("Che cos'è una collina?", ["Un rilievo meno alto della montagna", "Un fiume", "Un lago", "Un deserto"], "Le colline sono più basse delle montagne."),
    S("Com'è l'acqua del mare?", ["Salata", "Dolce", "Zuccherata", "Frizzante"], "Il mare contiene sale."),
    S("Che cos'è una spiaggia?", ["Una striscia di sabbia vicino al mare", "Una cima di montagna", "Una strada", "Una foresta"], "Sulla spiaggia si gioca vicino alle onde."),
    S("Dove si trovano i ghiacciai?", ["In alta montagna e ai poli", "Nel deserto", "In pianura", "Sul mare caldo"], "Dove fa molto freddo."),
    S("Quale continente è chiamato il «continente bianco»?", ["L'Antartide", "L'Africa", "L'Europa", "L'Asia"], "È coperto di ghiaccio."),
    S("Quale strumento ci mostra dove si trovano i luoghi?", ["La carta geografica", "Il termometro", "La bilancia", "Il metro da sarta"], "Ci aiuta a orientarci."),
    S("Come si chiama il pianeta dove viviamo?", ["La Terra", "Marte", "La Luna", "Il Sole"], "Viviamo sul pianeta Terra."),
    S("Che forma ha la Terra?", ["Sferica, come una palla", "Piatta come un piatto", "Quadrata", "A forma di cubo"], "La Terra è una sfera."),
    S("Con quale mezzo si attraversa il mare?", ["Con la nave", "Con il trattore", "Con la bicicletta", "Con i pattini"], "La nave naviga sull'acqua."),
    S("Dove nasce di solito un fiume?", ["In montagna", "Nel deserto", "In mezzo al mare", "In città"], "Nasce dove sgorga l'acqua dalla roccia."),
    S("Che cosa si trova in una città?", ["Case, strade e negozi", "Soltanto prati", "Soltanto onde", "Soltanto ghiaccio"], "In città vivono tante persone."),
    S("Che cosa si coltiva in campagna?", ["Grano, ortaggi e frutta", "Ghiaccio", "Sabbia", "Onde"], "I contadini coltivano la terra.")
  ]);

  // ===================== ARTE, fascia A =====================
  add("arte", "A", [
    S("Mescolando giallo e blu che colore si ottiene?", ["Verde", "Arancione", "Viola", "Rosa"], "Giallo + blu = verde."),
    S("Mescolando rosso e giallo che colore si ottiene?", ["Arancione", "Verde", "Viola", "Azzurro"], "Rosso + giallo = arancione."),
    S("Mescolando rosso e blu che colore si ottiene?", ["Viola", "Verde", "Arancione", "Rosa"], "Rosso + blu = viola."),
    S("Mescolando bianco e nero che colore si ottiene?", ["Grigio", "Rosso", "Verde", "Giallo"], "Bianco + nero = grigio."),
    S("Quale strumento serve per disegnare linee dritte?", ["Il righello", "Il pennello", "La spugna", "La gomma"], "Il righello ha il bordo dritto."),
    S("Che cos'è un paesaggio in pittura?", ["Un'immagine di un luogo", "Il ritratto di un re", "Una statua", "Un vaso"], "Mostra montagne, campi, mare..."),
    S("Chi realizza le statue?", ["Lo scultore", "Il pittore", "Il fotografo", "Il musicista"], "Lo scultore lavora la pietra o l'argilla."),
    S("Chi dipinge i quadri?", ["Il pittore", "Lo scultore", "Il pilota", "Il cuoco"], "Il pittore usa pennelli e colori."),
    S("Che cos'è la tela?", ["Il tessuto su cui si dipinge", "Un tipo di pennello", "Un colore", "Un paio di forbici"], "Molti pittori dipingono su tela."),
    S("Quali sono i colori caldi?", ["Rosso, giallo e arancione", "Blu e azzurro", "Grigio e nero", "Bianco e argento"], "Ricordano il fuoco e il sole."),
    S("Quali sono i colori freddi?", ["Blu, azzurro e verde", "Rosso e arancione", "Giallo e oro", "Rosa e rosso"], "Ricordano il mare e il ghiaccio.")
  ]);

  // ===================== MUSICA, fascia A =====================
  add("musica", "A", [
    S("Come si chiama la prima nota della scala musicale?", ["Do", "Sol", "La", "Si"], "Do, re, mi, fa, sol, la, si."),
    S("Chi guida un'orchestra?", ["Il direttore d'orchestra", "Il cuoco", "Il vigile", "L'idraulico"], "Il direttore dà il tempo ai musicisti."),
    S("Quale strumento a corde si suona con l'archetto?", ["Il violino", "Il flauto", "Il tamburo", "La tromba"], "L'archetto sfrega le corde."),
    S("Quale grande strumento a canne si suona in chiesa?", ["L'organo", "Il tamburo", "Il triangolo", "Il violino"], "L'organo ha tante canne e una tastiera."),
    S("Quale strumento di ottone fa un suono squillante?", ["La tromba", "Il violino", "Il pianoforte", "Il tamburo"], "La tromba si suona soffiando."),
    S("Come si chiama chi suona la chitarra?", ["Chitarrista", "Pianista", "Violinista", "Trombettista"], "Chi suona la chitarra è un chitarrista."),
    S("Che cos'è il ritmo?", ["Il susseguirsi di suoni e pause nel tempo", "Il colore di una canzone", "Il testo di una canzone", "Il volume della radio"], "Il ritmo è come il battito del cuore."),
    S("In musica, che cosa significa «piano»?", ["Con volume basso", "Con volume alto", "Più veloce", "Più lento"], "Piano = suonare piano, a bassa voce.")
  ]);

  // ===================== EDUCAZIONE CIVICA, fascia A =====================
  add("civica", "A", [
    S("Che cosa si fa quando il semaforo è rosso?", ["Ci si ferma", "Si passa di corsa", "Si suona il clacson", "Si salta"], "Rosso = stop."),
    S("Quando si attraversa sulle strisce pedonali?", ["Quando è sicuro, guardando a destra e a sinistra", "Sempre di corsa", "A occhi chiusi", "Solo di notte"], "Prima si guarda bene."),
    S("Dove si buttano le bottiglie di plastica?", ["Nella raccolta della plastica", "Per strada", "Nel fiume", "Nel prato"], "La plastica si ricicla."),
    S("Dove si butta la carta?", ["Nel bidone della carta", "Nel bidone del vetro", "Per terra", "Nel mare"], "La carta si ricicla."),
    S("Come ci si comporta in fila?", ["Si aspetta il proprio turno", "Si passa avanti", "Si spingono gli altri", "Si urla"], "Rispettare il turno è educazione."),
    S("Che cosa vuol dire rispettare le regole?", ["Fare ciò che è giusto per tutti", "Fare quello che si vuole", "Saltare la fila", "Non ascoltare"], "Le regole servono a vivere bene insieme."),
    S("Chi ci può aiutare se ci perdiamo in città?", ["Un vigile o un poliziotto", "Chiunque ci inviti a seguirlo", "Nessuno", "Un cane"], "Ci si rivolge a chi lavora per la sicurezza."),
    S("Quale numero si chiama in Europa in caso di emergenza?", ["112", "333", "999", "000"], "Il 112 è il numero unico di emergenza."),
    S("A chi appartengono i giardini pubblici?", ["A tutti, e vanno rispettati", "Solo ai bambini", "A nessuno", "Solo ai cani"], "Sono beni comuni."),
    S("Che cosa dobbiamo fare con l'acqua?", ["Non sprecarla", "Sprecarla", "Buttarla", "Ignorarla"], "L'acqua è preziosa.")
  ]);
})();
