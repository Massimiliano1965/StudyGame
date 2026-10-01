// ===== Banco domande di STORIA =====
// Formato: { q, a: [4 risposte], c: 0 (la prima è giusta, poi vengono mescolate), e: spiegazione }
(function () {
  const S = (q, a, e) => ({ q, a, c: 0, e });

  // 1ª–2ª elementare: il tempo, la vita di una volta, la preistoria
  const A = [
    S("Che cosa studia la storia?", ["Il passato", "Le stelle", "Gli animali", "I numeri"], "La storia ci racconta come si viveva nel passato."),
    S("Se oggi è lunedì, che giorno era ieri?", ["Domenica", "Martedì", "Mercoledì", "Sabato"], "Prima del lunedì c'è la domenica."),
    S("Quale mese viene subito dopo marzo?", ["Aprile", "Maggio", "Febbraio", "Giugno"], "Dopo marzo arriva aprile."),
    S("Quanti mesi ha un anno?", ["12", "10", "7", "30"], "L'anno ha 12 mesi, da gennaio a dicembre."),
    S("Quante stagioni ci sono in un anno?", ["4", "3", "5", "12"], "Primavera, estate, autunno e inverno: sono 4."),
    S("Dopo l'estate arriva…", ["L'autunno", "La primavera", "L'inverno", "Ancora l'estate"], "Le stagioni si ripetono: estate, autunno, inverno, primavera."),
    S("Quale di questi oggetti è più antico?", ["La candela", "La lampadina", "Il telefonino", "Il tablet"], "Prima della luce elettrica si usavano le candele."),
    S("Quale oggetto i nonni da piccoli non avevano?", ["Il tablet", "Il pane", "Le scarpe", "Il cappello"], "Il tablet è stato inventato molti anni dopo."),
    S("Gli uomini della preistoria vivevano…", ["Nelle caverne", "Nei grattacieli", "Nelle astronavi", "Nei castelli"], "Per ripararsi dal freddo usavano le grotte."),
    S("Perché l'uomo primitivo accendeva il fuoco?", ["Per scaldarsi e cuocere il cibo", "Per guardare la TV", "Per ricaricare il telefono", "Per fare le fotografie"], "Il fuoco dava calore, luce e permetteva di cuocere il cibo."),
    S("Come si chiamano i resti di animali o piante molto antichi?", ["Fossili", "Giocattoli", "Monete", "Libri"], "I fossili ci raccontano com'era la vita tanto tempo fa."),
    S("Quale di questi animali è un dinosauro?", ["Il tirannosauro", "L'elefante", "L'orso", "La tigre"], "Il tirannosauro viveva milioni di anni fa."),
    S("In quale paese sono state costruite le grandi piramidi?", ["Egitto", "Francia", "Giappone", "Canada"], "Le piramidi sono state costruite dagli antichi Egizi."),
    S("Che cos'è il Colosseo?", ["Una grande arena dell'antica Roma", "Un castello medievale", "Una piramide", "Un ponte"], "Nel Colosseo si facevano spettacoli e combattimenti."),
    S("I cavalieri del Medioevo vivevano spesso in…", ["Castelli", "Astronavi", "Capanne di ghiaccio", "Grattacieli"], "I signori e i cavalieri abitavano nei castelli."),
    S("Che cosa viene prima: ieri o domani?", ["Ieri", "Domani", "Nessuno dei due", "Vengono insieme"], "Ieri è già passato, domani deve ancora arrivare.")
  ];

  // 3ª–5ª elementare: dalla preistoria al Medioevo
  const B = [
    S("Che cos'è la Preistoria?", ["Il periodo prima dell'invenzione della scrittura", "Il periodo dei castelli", "L'epoca dei Romani", "Il tempo di oggi"], "La Preistoria arriva fino all'invenzione della scrittura."),
    S("Qual è il periodo più antico della Preistoria?", ["Paleolitico", "Neolitico", "Età del Bronzo", "Età del Ferro"], "Paleolitico vuol dire «età della pietra antica»."),
    S("Che cosa impara a fare l'uomo nel Neolitico?", ["Coltivare la terra e allevare animali", "Usare l'elettricità", "Costruire castelli", "Viaggiare nello spazio"], "Nel Neolitico nascono agricoltura e allevamento."),
    S("Quale popolo inventò la scrittura cuneiforme?", ["I Sumeri", "I Romani", "I Vichinghi", "I Maya"], "I Sumeri scrivevano su tavolette d'argilla."),
    S("Tra quali fiumi nacque la civiltà della Mesopotamia?", ["Tigri ed Eufrate", "Nilo e Po", "Tevere e Arno", "Reno e Danubio"], "Mesopotamia vuol dire «terra tra i due fiumi»."),
    S("Qual è il fiume degli antichi Egizi?", ["Il Nilo", "Il Tevere", "Il Po", "Il Tigri"], "L'Egitto è nato lungo le rive del Nilo."),
    S("Come si chiamava il re degli antichi Egizi?", ["Faraone", "Imperatore", "Console", "Sultano"], "Il re dell'Egitto era il faraone."),
    S("Come si chiamano le grandi tombe dei faraoni a forma di triangolo?", ["Piramidi", "Ziggurat", "Catacombe", "Pagode"], "Le piramidi custodivano le mummie dei faraoni."),
    S("Dove nacquero le Olimpiadi antiche?", ["In Grecia", "In Egitto", "A Roma", "In Cina"], "I primi giochi olimpici si facevano a Olimpia, in Grecia."),
    S("Chi era Zeus per gli antichi Greci?", ["Il re degli dei", "Un faraone", "Un imperatore", "Un filosofo"], "Zeus era il padre degli dei dell'Olimpo."),
    S("Come si chiamavano le città-stato dei Greci?", ["Poleis", "Piramidi", "Province", "Feudi"], "Atene e Sparta erano poleis (al singolare: polis)."),
    S("Secondo la leggenda, chi fondò Roma?", ["Romolo", "Giulio Cesare", "Augusto", "Nerone"], "Secondo la tradizione Romolo fondò Roma nel 753 a.C."),
    S("In quale anno, secondo la tradizione, nacque Roma?", ["753 a.C.", "476 d.C.", "1492", "1861"], "Il 753 a.C. è l'anno tradizionale della fondazione."),
    S("Chi fu il primo imperatore di Roma?", ["Augusto", "Giulio Cesare", "Nerone", "Costantino"], "Augusto diventò il primo imperatore nel 27 a.C."),
    S("Chi era Giulio Cesare?", ["Un grande generale e politico romano", "Un faraone", "Un re greco", "Un inventore"], "Cesare conquistò la Gallia e governò Roma."),
    S("Dove combattevano i gladiatori?", ["Nel Colosseo", "Nel Pantheon", "Nel Foro Romano", "Nelle Terme"], "Il Colosseo era la grande arena di Roma."),
    S("Che cosa portavano l'acqua nelle città romane?", ["Gli acquedotti", "Gli ascensori", "Gli aeroporti", "I semafori"], "Gli acquedotti erano ponti con un canale per l'acqua."),
    S("Quale lingua parlavano gli antichi Romani?", ["Latino", "Greco", "Inglese", "Arabo"], "Dal latino nascono l'italiano, il francese e lo spagnolo."),
    S("Chi viveva nell'antica Etruria?", ["Gli Etruschi", "I Sumeri", "Gli Egizi", "I Maya"], "Gli Etruschi vivevano nell'Italia centrale, soprattutto in Toscana."),
    S("Quale città fu sepolta dall'eruzione del Vesuvio nel 79 d.C.?", ["Pompei", "Roma", "Atene", "Firenze"], "Pompei fu coperta da cenere e lapilli."),
    S("Chi fu Annibale?", ["Un generale cartaginese che attraversò le Alpi con gli elefanti", "Un imperatore romano", "Un faraone", "Un filosofo greco"], "Annibale combatté contro Roma nelle guerre puniche."),
    S("Quando cadde l'Impero romano d'Occidente?", ["476 d.C.", "753 a.C.", "1492", "1789"], "Nel 476 d.C. finì l'Impero romano d'Occidente."),
    S("Quale periodo viene dopo l'età antica?", ["Il Medioevo", "La Preistoria", "L'età contemporanea", "L'età dei dinosauri"], "Dopo l'età antica comincia il Medioevo."),
    S("Chi viveva nei castelli medievali?", ["Signori feudali e cavalieri", "Faraoni", "Astronauti", "Gladiatori"], "I castelli erano le case fortificate dei signori."),
    S("Chi scoprì l'America nel 1492?", ["Cristoforo Colombo", "Marco Polo", "Galileo Galilei", "Leonardo da Vinci"], "Colombo sbarcò in America il 12 ottobre 1492."),
    S("Chi dipinse la Gioconda?", ["Leonardo da Vinci", "Michelangelo", "Raffaello", "Giotto"], "La Gioconda (Monna Lisa) è di Leonardo da Vinci.")
  ];

  // medie: dal Medioevo ai giorni nostri
  const C = [
    S("Quale evento segna convenzionalmente la fine del Medioevo?", ["La scoperta dell'America (1492)", "La caduta di Roma", "La Rivoluzione francese", "L'Unità d'Italia"], "Si usa il 1492 come data di passaggio all'età moderna."),
    S("Chi fu incoronato imperatore nell'anno 800?", ["Carlo Magno", "Napoleone", "Augusto", "Federico II"], "Carlo Magno fu incoronato a Roma, la notte di Natale dell'800."),
    S("Che cos'era il feudalesimo?", ["Un sistema in cui i signori davano terre in cambio di fedeltà", "Un tipo di governo democratico", "Una religione", "Una moneta"], "Il signore dava il feudo al vassallo, che gli giurava fedeltà."),
    S("Che cosa furono le Crociate?", ["Spedizioni per riconquistare la Terra Santa", "Viaggi per scoprire l'America", "Guerre contro Napoleone", "Gare di cavalleria"], "Le Crociate partirono dall'Europa verso Gerusalemme."),
    S("In quale secolo si diffuse in Europa la peste nera?", ["Nel Trecento", "Nel Settecento", "Nel Duecento", "Nel Novecento"], "La peste arrivò in Europa intorno al 1347."),
    S("Che cos'è stato il Rinascimento?", ["Un movimento di arte e cultura che riscoprì il mondo classico", "Una guerra", "Un'epidemia", "Un impero"], "Il Rinascimento (XV-XVI secolo) rimise l'uomo al centro."),
    S("Chi inventò la stampa a caratteri mobili intorno al 1450?", ["Johannes Gutenberg", "Galileo Galilei", "Isaac Newton", "Guglielmo Marconi"], "Gutenberg rese i libri molto più facili da produrre."),
    S("Quale famiglia governò Firenze nel Rinascimento?", ["I Medici", "I Borgia", "I Savoia", "I Visconti"], "I Medici furono grandi mecenati di artisti."),
    S("Chi diede inizio alla Riforma protestante nel 1517?", ["Martin Lutero", "Napoleone", "Carlo V", "Enrico VIII"], "Lutero espose le sue 95 tesi a Wittenberg."),
    S("In quale anno scoppiò la Rivoluzione francese?", ["1789", "1492", "1861", "1914"], "La presa della Bastiglia è del 14 luglio 1789."),
    S("Qual era il motto della Rivoluzione francese?", ["Libertà, uguaglianza, fratellanza", "Dio, patria, famiglia", "Pace, terra, pane", "Uno per tutti, tutti per uno"], "Liberté, égalité, fraternité."),
    S("Chi fu Napoleone Bonaparte?", ["Un generale che divenne imperatore dei Francesi", "Un re d'Inghilterra", "Un papa", "Uno zar russo"], "Napoleone si incoronò imperatore nel 1804."),
    S("Dove cominciò la Rivoluzione industriale?", ["In Gran Bretagna", "In Italia", "In Giappone", "In Brasile"], "Nel Settecento in Gran Bretagna nacquero fabbriche e macchine a vapore."),
    S("In quale anno fu proclamato il Regno d'Italia?", ["1861", "1848", "1900", "1946"], "Il Regno d'Italia fu proclamato il 17 marzo 1861."),
    S("Chi guidò la spedizione dei Mille?", ["Giuseppe Garibaldi", "Camillo Benso di Cavour", "Giuseppe Mazzini", "Vittorio Emanuele II"], "Garibaldi partì da Quarto nel 1860 per liberare il Sud."),
    S("Chi fu il primo re d'Italia?", ["Vittorio Emanuele II", "Umberto I", "Carlo Alberto", "Napoleone III"], "Vittorio Emanuele II di Savoia fu il primo re d'Italia."),
    S("Chi fu Cavour?", ["Il primo ministro piemontese che preparò l'Unità d'Italia", "Un papa", "Un pittore", "Un re di Francia"], "Cavour guidò la diplomazia del Regno di Sardegna."),
    S("In quale anno iniziò la Prima guerra mondiale?", ["1914", "1939", "1861", "1945"], "La Grande Guerra scoppiò nell'estate del 1914."),
    S("In quale anno finì la Seconda guerra mondiale?", ["1945", "1918", "1939", "1950"], "La guerra finì nel 1945."),
    S("Che cosa fu la Shoah?", ["Lo sterminio degli ebrei da parte dei nazisti", "Una battaglia navale", "Una rivoluzione", "Un trattato di pace"], "Milioni di ebrei furono uccisi: ricordarlo serve perché non accada più."),
    S("In quale anno nacque la Repubblica italiana?", ["1946", "1861", "1922", "1948"], "Il 2 giugno 1946 gli italiani scelsero la Repubblica con il referendum."),
    S("Quando entrò in vigore la Costituzione italiana?", ["1948", "1946", "1861", "1970"], "La Costituzione è in vigore dal 1° gennaio 1948."),
    S("In quale anno cadde il Muro di Berlino?", ["1989", "1945", "1961", "2001"], "Nel 1989 il Muro di Berlino fu aperto."),
    S("Chi depose Romolo Augustolo, ultimo imperatore d'Occidente?", ["Odoacre", "Attila", "Costantino", "Annibale"], "Lo depose Odoacre nel 476 d.C."),
    S("Le guerre puniche opposero Roma a…", ["Cartagine", "Atene", "La Persia", "L'Egitto"], "Roma e Cartagine si contesero il Mediterraneo."),
    S("Quale città fu distrutta dall'eruzione del Vesuvio nel 79 d.C. insieme a Ercolano?", ["Pompei", "Napoli", "Capua", "Taranto"], "Pompei ed Ercolano furono sepolte."),
    S("Chi fu Giuseppe Mazzini?", ["Un patriota che fondò la Giovine Italia", "Un re", "Un papa", "Uno scienziato"], "Mazzini voleva un'Italia unita e repubblicana.")
  ];

  QBANK.storia = { A, B, C };
})();
