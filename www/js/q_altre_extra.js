// ===== Tecnologia, Arte, Musica, Educazione civica: altre domande (si aggiungono a quelle di q_altre.js) =====
// Formato: { q, a: [4 risposte], c: 0 (la prima è giusta, poi vengono mescolate), e: spiegazione }
// Fasce: A = 1ª–2ª elementare, B = 3ª–5ª elementare, C = medie
(function () {
  const S = (q, a, e) => ({ q, a, c: 0, e });
  const add = (subject, band, list) => { QBANK[subject][band] = QBANK[subject][band].concat(list); };

  // ===================== TECNOLOGIA =====================
  add("tecnologia", "A", [
    S("Quale oggetto usiamo per aprire una porta chiusa a chiave?", ["La chiave", "Il pettine", "La matita", "Il cucchiaio"], "La chiave gira nella serratura."),
    S("Quale elettrodomestico cuoce la pizza?", ["Il forno", "Il frigorifero", "La lavatrice", "L'aspirapolvere"], "Il forno scalda e cuoce."),
    S("Quale oggetto toglie la polvere dal pavimento?", ["L'aspirapolvere", "Il forno", "La radio", "Il microfono"], "L'aspirapolvere aspira polvere e briciole."),
    S("Quale oggetto serve per asciugare i capelli?", ["Il phon", "Il tostapane", "La lavatrice", "Il frigorifero"], "Il phon soffia aria calda."),
    S("Che cosa scalda la casa d'inverno?", ["Il termosifone", "Il frigorifero", "L'ombrello", "Il cuscino"], "Il termosifone dà calore."),
    S("Quale strumento serve per guardare le stelle da lontano?", ["Il telescopio", "Il righello", "Il pettine", "Il martello"], "Il telescopio avvicina le cose lontane."),
    S("Quale oggetto ci dice che ora è?", ["L'orologio", "La bilancia", "Il termometro", "Il righello"], "L'orologio segna le ore."),
    S("Quale oggetto serve per pesare la frutta?", ["La bilancia", "Il righello", "L'orologio", "Il termometro"], "La bilancia misura il peso."),
    S("Quale oggetto misura la febbre?", ["Il termometro", "La bilancia", "Il righello", "L'orologio"], "Il termometro misura la temperatura."),
    S("Che cosa usiamo per guardare i cartoni animati?", ["La televisione", "Il pettine", "La scopa", "Il martello"], "La televisione mostra immagini e suoni."),
    S("Quale mezzo porta tante persone per le strade della città?", ["L'autobus", "L'aereo", "La nave", "Il sottomarino"], "L'autobus è un mezzo pubblico."),
    S("Quale mezzo va sott'acqua?", ["Il sottomarino", "L'autobus", "L'elicottero", "Il treno"], "Il sottomarino naviga sotto il mare."),
    S("Quale mezzo ha le pale che girano sopra e vola?", ["L'elicottero", "La barca", "La moto", "Il tram"], "L'elicottero ha un'elica sopra."),
    S("Da quale animale si ricava la lana?", ["Dalla pecora", "Dalla mucca", "Dal pesce", "Dal gallo"], "La lana è il pelo della pecora."),
    S("I pneumatici della bici sono fatti di…", ["Gomma", "Vetro", "Carta", "Lana"], "La gomma è elastica."),
    S("Di che materiale è fatta di solito una pentola?", ["Di metallo", "Di carta", "Di stoffa", "Di lana"], "Il metallo resiste al calore."),
    S("Che cosa serve per salire in alto, appoggiata al muro?", ["La scala", "Il cuscino", "La coperta", "Il tappeto"], "La scala ha i pioli."),
    S("Che cosa succede se premi l'interruttore della luce?", ["Si accende la lampadina", "Si apre la porta", "Parte il treno", "Cade la pioggia"], "L'interruttore fa passare la corrente.")
  ]);

  add("tecnologia", "B", [
    S("Che cos'è una macchina semplice?", ["Uno strumento che aiuta a fare meno fatica", "Un computer molto veloce", "Un robot da cucina", "Un motore elettrico"], "Leva, ruota, piano inclinato e vite sono macchine semplici."),
    S("Quale strumento serve per tagliare il legno?", ["La sega", "Il righello", "La pinza", "Il pennello"], "La sega ha i denti per tagliare."),
    S("A che cosa serve una pinza?", ["A stringere e afferrare", "A misurare", "A dipingere", "A scrivere"], "La pinza stringe."),
    S("Da quale materiale si ottiene il mattone?", ["Dall'argilla cotta", "Dal vetro", "Dalla plastica", "Dalla gomma"], "L'argilla cotta nel forno diventa mattone."),
    S("Il cotone è una fibra che si ricava…", ["Da una pianta", "Da un animale", "Dal petrolio", "Dalla sabbia"], "Il cotone cresce in una pianta."),
    S("La seta si ricava…", ["Dal baco da seta", "Dalla pecora", "Dal cotone", "Dal petrolio"], "Il baco da seta fa il bozzolo."),
    S("La lana si ricava…", ["Dal pelo della pecora", "Dalle foglie", "Dalla sabbia", "Dal petrolio"], "La lana è una fibra animale."),
    S("Che cosa produce una centrale idroelettrica?", ["Energia elettrica dall'acqua che cade", "Acqua potabile", "Benzina", "Gas"], "L'acqua fa girare una turbina."),
    S("In una compostiera i rifiuti organici diventano…", ["Concime (compost)", "Plastica", "Vetro", "Carta"], "Si trasformano in terriccio."),
    S("Dove si butta la buccia di una mela?", ["Nell'umido (organico)", "Nella carta", "Nel vetro", "Nella plastica"], "Gli scarti di cibo vanno nell'organico."),
    S("Che cos'è un robot?", ["Una macchina programmata per svolgere compiti", "Un tipo di batteria", "Un cavo", "Una pagina web"], "Un robot esegue istruzioni."),
    S("Che cos'è un'e-mail?", ["Un messaggio inviato tramite Internet", "Una lettera di carta", "Una telefonata", "Un videogioco"], "L'e-mail è posta elettronica."),
    S("Quale password è più sicura?", ["Lunga, con lettere, numeri e simboli", "Il tuo nome", "1234", "La tua data di nascita"], "Una password difficile è più sicura."),
    S("Quale tasto serve per scrivere una lettera maiuscola?", ["Maiusc (Shift)", "Invio", "Esc", "Canc"], "Maiusc più una lettera."),
    S("Quale tasto serve per andare a capo?", ["Invio", "Esc", "Maiusc", "Alt"], "Invio fa iniziare una nuova riga."),
    S("Quale unità misura la memoria di un computer?", ["Il byte", "Il metro", "Il litro", "Il grado"], "Si usano byte, kilobyte, megabyte."),
    S("Quale periferica serve per parlare al computer?", ["Il microfono", "Lo scanner", "La stampante", "Il monitor"], "Il microfono registra la voce."),
    S("Che cosa fa uno scanner?", ["Trasforma un foglio in un'immagine digitale", "Stampa un foglio", "Taglia la carta", "Ascolta la voce"], "Lo scanner legge i fogli."),
    S("Quale periferica serve solo per inserire dati?", ["La tastiera", "Il monitor", "La stampante", "Le casse"], "Tastiera e mouse sono periferiche di input."),
    S("Che cos'è una batteria?", ["Un dispositivo che immagazzina energia elettrica", "Un tipo di cavo", "Una lampadina", "Un interruttore"], "Alimenta telefoni e giocattoli.")
  ]);

  add("tecnologia", "C", [
    S("Che cos'è l'energia geotermica?", ["Il calore che viene dall'interno della Terra", "L'energia del vento", "L'energia delle onde", "L'energia del Sole"], "Si usa il vapore e l'acqua calda sotterranea."),
    S("Che cosa fa un pannello fotovoltaico?", ["Trasforma la luce solare in elettricità", "Gira con il vento", "Scalda il petrolio", "Cuoce il cibo"], "Le celle fotovoltaiche producono corrente."),
    S("Quale gas è il principale responsabile dell'effetto serra tra questi?", ["L'anidride carbonica", "L'ossigeno", "L'azoto", "L'elio"], "La CO₂ trattiene il calore."),
    S("Che cos'è un trasformatore elettrico?", ["Un dispositivo che cambia il valore della tensione", "Una batteria", "Una lampadina", "Un interruttore"], "Alza o abbassa la tensione alternata."),
    S("Qual è l'unità di misura della potenza elettrica?", ["Il watt", "Il volt", "L'ampere", "L'ohm"], "Watt = joule al secondo."),
    S("Che cos'è un circuito in serie?", ["Un circuito con i componenti collegati uno dopo l'altro", "Un circuito con tanti rami paralleli", "Un circuito senza batteria", "Un circuito aperto"], "In serie la corrente ha un solo percorso."),
    S("Che cos'è la CPU?", ["Il processore del computer", "La memoria di massa", "La scheda audio", "Il monitor"], "È il «cervello» che esegue le istruzioni."),
    S("Che cos'è il cloud (la «nuvola») informatico?", ["Server su Internet dove si salvano dati e programmi", "Una nuvola vera", "Un tipo di cavo", "Un monitor"], "I dati stanno su computer remoti."),
    S("Che cos'è un database?", ["Un archivio organizzato di dati", "Un gioco", "Una stampante", "Una password"], "Permette di cercare e ordinare i dati."),
    S("Che cos'è un virus informatico?", ["Un programma dannoso che si diffonde nei computer", "Un tipo di antivirus", "Un componente della scheda madre", "Un sito di notizie"], "Può danneggiare file e programmi."),
    S("Che cos'è il «codice» di un programma?", ["L'insieme delle istruzioni scritte in un linguaggio", "Una password", "Il numero di serie del PC", "Un file immagine"], "Il programmatore scrive il codice."),
    S("Quale struttura di programmazione ripete un blocco di istruzioni?", ["Il ciclo (loop)", "La variabile", "Il commento", "Il file"], "Il ciclo evita di riscrivere la stessa cosa."),
    S("Che cos'è una variabile in programmazione?", ["Un contenitore con un nome che memorizza un valore", "Un errore", "Un tipo di cavo", "Un disegno"], "Il suo valore può cambiare."),
    S("Quale di questi è un formato di immagine?", ["JPEG", "TXT", "MP3", "DOC"], "JPEG comprime le fotografie."),
    S("Quale di questi è un formato audio compresso?", ["MP3", "JPEG", "PDF", "XLS"], "MP3 comprime la musica."),
    S("Che cos'è il PDF?", ["Un formato di documento che mantiene l'impaginazione", "Un linguaggio di programmazione", "Un tipo di cavo", "Un antivirus"], "Il PDF si vede uguale su ogni dispositivo."),
    S("Che cosa riduce l'attrito tra due superfici?", ["Un lubrificante (olio)", "La sabbia", "La colla", "La ruggine"], "L'olio rende le superfici più scivolose."),
    S("Che cos'è la ruggine?", ["L'ossidazione del ferro", "Una vernice", "Una lega", "Un tipo di legno"], "Il ferro si ossida con aria e acqua."),
    S("Che cos'è il cemento armato?", ["Calcestruzzo rinforzato con barre di acciaio", "Cemento e vetro", "Solo mattoni", "Legno e ferro"], "L'acciaio resiste alla trazione."),
    S("A che cosa serve l'interruttore differenziale («salvavita»)?", ["A interrompere la corrente se c'è una dispersione pericolosa", "Ad aumentare la tensione", "A risparmiare luce", "A ricaricare il telefono"], "Protegge dalle scosse elettriche."),
    S("Che cos'è l'Internet delle cose (IoT)?", ["Oggetti di uso quotidiano collegati a Internet", "Un social network", "Un gioco online", "Un linguaggio di programmazione"], "Frigoriferi, orologi e lampade possono essere connessi.")
  ]);

  // ===================== ARTE =====================
  add("arte", "A", [
    S("Che cosa serve per cancellare un disegno a matita?", ["La gomma", "Il pennarello", "La colla", "Il righello"], "La gomma cancella la matita."),
    S("Nero e bianco mescolati danno…", ["Grigio", "Verde", "Arancione", "Viola"], "Il grigio è un nero schiarito."),
    S("Di che colore è un limone?", ["Giallo", "Blu", "Viola", "Nero"], "Il limone è giallo."),
    S("Di che colore è l'erba?", ["Verde", "Rosso", "Viola", "Arancione"], "L'erba è verde."),
    S("Quanti sono i colori dell'arcobaleno?", ["7", "5", "10", "3"], "Rosso, arancione, giallo, verde, azzurro, blu, viola."),
    S("Che cos'è una linea curva?", ["Una linea che si piega, senza spigoli", "Una linea dritta", "Una linea spezzata", "Un punto"], "La curva è morbida."),
    S("Quale linea è fatta di tanti pezzi dritti con gli spigoli?", ["La linea spezzata", "La linea curva", "Il cerchio", "Il punto"], "La spezzata cambia direzione."),
    S("Quale forma ha una ruota?", ["Cerchio", "Quadrato", "Triangolo", "Rettangolo"], "La ruota è rotonda."),
    S("Che cos'è un disegno a mano libera?", ["Un disegno fatto senza righello", "Un disegno con il compasso", "Una fotografia", "Un disegno al computer"], "Si disegna solo con la mano."),
    S("Che cosa fai con la plastilina?", ["La modelli con le mani", "La mangi", "La accendi", "La bevi"], "La plastilina si modella."),
    S("Che cos'è un fumetto?", ["Una storia raccontata con disegni e nuvolette", "Una poesia", "Un quadro a olio", "Una scultura"], "Le nuvolette contengono i dialoghi."),
    S("Che cos'è una cornice?", ["Il bordo che racchiude un quadro", "Un tipo di colore", "Un pennello", "Una statua"], "La cornice incornicia il quadro."),
    S("Che cos'è una statua?", ["Una figura scolpita", "Una pittura sul muro", "Un disegno", "Una fotografia"], "La statua è una scultura."),
    S("Che cosa si fa con gli acquerelli?", ["Si dipinge con colori diluiti in acqua", "Si scolpisce", "Si costruiscono case", "Si suona"], "L'acquerello è trasparente."),
    S("Se aggiungi bianco a un colore, diventa…", ["Più chiaro", "Più scuro", "Più nero", "Invisibile"], "Il bianco schiarisce."),
    S("Se aggiungi nero a un colore, diventa…", ["Più scuro", "Più chiaro", "Più giallo", "Trasparente"], "Il nero scurisce."),
    S("Su che cosa dipinge il pittore a olio?", ["Sulla tela", "Sul righello", "Sulla lavagna", "Sul quaderno"], "La tela è un tessuto teso su un telaio.")
  ]);

  add("arte", "B", [
    S("Chi era Leonardo da Vinci?", ["Un artista e scienziato del Rinascimento", "Un musicista barocco", "Un re francese", "Un esploratore"], "Dipinse la Gioconda e studiò anche le macchine."),
    S("Che cos'è la street art?", ["Arte realizzata sui muri e negli spazi pubblici", "Arte solo nei musei", "Un tipo di musica", "Un genere teatrale"], "I murales sono street art."),
    S("Che cos'è una scultura a tutto tondo?", ["Una statua che si può vedere da ogni lato", "Un disegno su carta", "Un affresco", "Un mosaico"], "Si gira intorno."),
    S("Chi costruì il Colosseo?", ["I Romani", "I Greci", "Gli Egizi", "I Vichinghi"], "L'anfiteatro Flavio è a Roma."),
    S("Che cosa sono le piramidi di Giza?", ["Tombe dei faraoni egizi", "Templi greci", "Castelli medievali", "Acquedotti"], "Sono monumenti dell'antico Egitto."),
    S("Chi era Michelangelo Buonarroti?", ["Scultore, pittore e architetto del Rinascimento", "Un compositore", "Un navigatore", "Un re"], "Scolpì il David."),
    S("Dove si trova il Colosseo?", ["A Roma", "A Venezia", "A Milano", "A Napoli"], "Nel centro di Roma."),
    S("In quale città si trova la Torre pendente?", ["A Pisa", "A Firenze", "A Torino", "A Bologna"], "Si inclina a Piazza dei Miracoli."),
    S("In quale città si trova il museo del Louvre?", ["A Parigi", "A Londra", "A Roma", "A Madrid"], "Il Louvre ospita la Gioconda."),
    S("Che cos'era un acquedotto romano?", ["Una struttura ad archi che portava l'acqua alle città", "Un tipo di nave", "Un tempio", "Un teatro"], "Sfruttava la pendenza."),
    S("Che cos'è la tela?", ["Il tessuto su cui si dipinge", "Un tipo di pennello", "Una statua", "Un colore"], "Si tende su un telaio."),
    S("Che cos'è il cavalletto?", ["Il sostegno su cui si appoggia la tela", "Un pennello speciale", "Un tipo di colore", "Una statua piccola"], "Il pittore lavora davanti al cavalletto."),
    S("Che cos'è l'arte rupestre?", ["Le pitture dei popoli preistorici sulle pareti delle grotte", "Le pitture di Giotto", "L'arte dei computer", "Le statue greche"], "Rappresentavano animali e scene di caccia."),
    S("In quale Paese si trovano le grotte di Lascaux con pitture preistoriche?", ["In Francia", "In Giappone", "In Brasile", "In Egitto"], "Le pitture risalgono a circa 17 000 anni fa."),
    S("Chi dipinse «La ragazza con l'orecchino di perla»?", ["Vermeer", "Van Gogh", "Monet", "Giotto"], "Johannes Vermeer era olandese."),
    S("Chi dipinse le «Ninfee»?", ["Claude Monet", "Michelangelo", "Picasso", "Raffaello"], "Monet dipinse tante ninfee nel suo giardino."),
    S("Chi fu Giotto?", ["Un pittore italiano del Trecento", "Un compositore", "Uno scultore romano", "Un architetto moderno"], "Affrescò la Cappella degli Scrovegni."),
    S("Che cos'è l'architettura?", ["L'arte di progettare e costruire edifici", "L'arte di scolpire", "L'arte di dipingere", "L'arte di recitare"], "Case, chiese e ponti sono architettura."),
    S("In quale città si trova la Sagrada Família?", ["A Barcellona", "A Roma", "A Lisbona", "A Londra"], "È la grande chiesa di Gaudí."),
    S("In quale città si trova la Torre Eiffel?", ["A Parigi", "A Roma", "A Berlino", "A Madrid"], "Fu costruita nel 1889.")
  ]);

  add("arte", "C", [
    S("Chi dipinse «Les Demoiselles d'Avignon»?", ["Pablo Picasso", "Henri Matisse", "Paul Cézanne", "Edgar Degas"], "È considerato un'opera che apre al Cubismo."),
    S("Chi dipinse «Impressione, levar del sole»?", ["Claude Monet", "Vincent van Gogh", "Edvard Munch", "Gustav Klimt"], "Da questo quadro deriva il nome «Impressionismo»."),
    S("Che cos'è il Surrealismo?", ["Un movimento che esplora sogni e inconscio", "Un movimento che imita la realtà", "Un movimento sulla velocità", "Un movimento solo astratto"], "Dalì e Magritte sono surrealisti."),
    S("Quale artista è tra i pionieri dell'arte astratta?", ["Vasilij Kandinskij", "Raffaello", "Giotto", "Canova"], "Kandinskij dipinse composizioni di forme e colori."),
    S("Chi dipinse «Las Meninas»?", ["Diego Velázquez", "Francisco Goya", "El Greco", "Caravaggio"], "Velázquez era pittore alla corte spagnola."),
    S("Chi dipinse «La zattera della Medusa»?", ["Théodore Géricault", "Claude Monet", "Piero della Francesca", "Giorgione"], "È un'opera del Romanticismo francese."),
    S("Che cos'è il Romanticismo in arte?", ["Un movimento che esalta emozioni e natura", "Un movimento di pittura geometrica", "Il ritorno ai classici greci", "Un'arte solo religiosa"], "Valorizza il sentimento e il sublime."),
    S("Chi dipinse «La libertà che guida il popolo»?", ["Eugène Delacroix", "Caravaggio", "Raffaello", "Giotto"], "Ricorda la rivoluzione di luglio del 1830."),
    S("Chi progettò la Sagrada Família?", ["Antoni Gaudí", "Le Corbusier", "Frank Lloyd Wright", "Palladio"], "Gaudí fu il grande architetto catalano."),
    S("Chi progettò il Guggenheim Museum di Bilbao?", ["Frank Gehry", "Brunelleschi", "Palladio", "Bernini"], "Ha forme curve rivestite di titanio."),
    S("Chi progettò il colonnato di Piazza San Pietro?", ["Gian Lorenzo Bernini", "Michelangelo", "Bramante", "Palladio"], "Il colonnato abbraccia i fedeli."),
    S("Che cos'è l'arte concettuale?", ["Arte in cui conta l'idea più dell'oggetto", "Arte che imita la natura", "Arte medievale", "Arte della prospettiva"], "Nasce negli anni Sessanta."),
    S("Che cos'è un readymade?", ["Un oggetto comune presentato come opera d'arte", "Un affresco", "Un tipo di cornice", "Un bozzetto"], "Duchamp lo inventò."),
    S("Chi dipinse «Il Giudizio Universale» nella Cappella Sistina?", ["Michelangelo", "Raffaello", "Leonardo", "Botticelli"], "Si trova sulla parete dell'altare."),
    S("Che cos'è una pala d'altare?", ["Un grande dipinto sopra l'altare di una chiesa", "Un attrezzo agricolo", "Una scultura di bronzo", "Un tipo di affresco"], "È spesso a soggetto sacro."),
    S("Chi scolpì il «David» in bronzo, primo nudo del Rinascimento?", ["Donatello", "Michelangelo", "Bernini", "Canova"], "Donatello lo realizzò a Firenze."),
    S("Chi dipinse «La Venere di Urbino»?", ["Tiziano", "Caravaggio", "Giotto", "Botticelli"], "Tiziano fu un grande pittore veneziano."),
    S("Chi scolpì «Il pensatore»?", ["Auguste Rodin", "Michelangelo", "Canova", "Donatello"], "Rodin è lo scultore francese dell'Ottocento."),
    S("Che cos'è il chiaroscuro?", ["L'uso di luci e ombre per dare volume", "L'uso di soli colori caldi", "Un tipo di cornice", "Un disegno senza ombre"], "Caravaggio ne fece un marchio."),
    S("Chi dipinse «Campo di grano con volo di corvi»?", ["Vincent van Gogh", "Paul Gauguin", "Claude Monet", "Edvard Munch"], "Fu una delle ultime opere di Van Gogh.")
  ]);

  // ===================== MUSICA =====================
  add("musica", "A", [
    S("Quale strumento ha le corde che si pizzicano con le dita ed è a forma di triangolo curvo?", ["L'arpa", "Il tamburo", "La tromba", "Le maracas"], "L'arpa ha molte corde."),
    S("Quale strumento fa «bum bum» quando lo batti?", ["Il tamburo", "Il flauto", "Il violino", "L'arpa"], "Il tamburo è una percussione."),
    S("Quale strumento a fiato si suona soffiando in un tubo con tanti fori?", ["Il flauto", "Il tamburo", "Il violino", "Il pianoforte"], "Il flauto dolce si usa a scuola."),
    S("Che cosa usiamo per cantare?", ["La voce", "I piedi", "Gli occhi", "Le ginocchia"], "Il canto nasce dalla voce."),
    S("Quale strumento di metallo suona il trombettiere?", ["La tromba", "Il violino", "Il tamburo", "L'arpa"], "La tromba è un ottone."),
    S("Nella scala «Do, Re, Mi, Fa…» dopo il Fa viene…", ["Sol", "Re", "Si", "La"], "Do Re Mi Fa Sol La Si."),
    S("Dopo il Do viene…", ["Re", "Mi", "Fa", "Si"], "La scala parte da Do e sale."),
    S("Quale nota viene dopo il Mi?", ["Fa", "Re", "Sol", "Do"], "Mi, Fa, Sol."),
    S("Che cosa sono le maracas?", ["Strumenti da scuotere", "Strumenti ad arco", "Strumenti a fiato", "Strumenti a tastiera"], "Dentro hanno semi che fanno rumore."),
    S("Come si chiama chi canta da solo?", ["Solista", "Direttore", "Coro", "Compositore"], "Il solista canta o suona da solo."),
    S("Come si chiama un gruppo che suona tanti strumenti insieme?", ["Orchestra", "Coro", "Classe", "Squadra"], "L'orchestra ha il direttore."),
    S("Come si chiama la canzone dolce che si canta ai bambini per farli dormire?", ["Ninna nanna", "Marcia", "Sirena", "Danza"], "La ninna nanna è lenta e tranquilla."),
    S("Quale musica ha il ritmo adatto a camminare in fila come i soldati?", ["La marcia", "La ninna nanna", "Il silenzio", "Il fruscio"], "La marcia ha un passo regolare."),
    S("Che cosa fai quando balli?", ["Muovi il corpo a tempo di musica", "Dormi", "Mangi", "Scrivi"], "Il ballo segue il ritmo."),
    S("Come si chiama chi suona il pianoforte?", ["Pianista", "Violinista", "Chitarrista", "Trombettista"], "Il pianista suona il piano."),
    S("Come si chiama chi suona il violino?", ["Violinista", "Pianista", "Batterista", "Flautista"], "Il violinista usa l'archetto."),
    S("Il rumore di un tuono è un suono…", ["Basso e forte", "Acuto e debole", "Silenzioso", "Dolce"], "Il tuono rimbomba.")
  ]);

  add("musica", "B", [
    S("Che cos'è una stanghetta in musica?", ["La linea che separa le battute", "Una pausa", "La chiave", "Un diesis"], "Divide il pentagramma in battute."),
    S("Che cos'è un brano cantato «a cappella»?", ["Cantato solo con le voci, senza strumenti", "Cantato con tre chitarre", "Cantato con l'orchestra", "Cantato in silenzio"], "Le voci fanno tutto."),
    S("Quale strumento tipico della Scozia ha le canne e una sacca d'aria?", ["La cornamusa", "Il flauto", "La chitarra", "Il sax"], "La cornamusa si suona soffiando nella sacca."),
    S("Quale strumento a fiato tipico del jazz ha le chiavi e un'ancia?", ["Il sassofono", "Il violino", "L'arpa", "Il tamburo"], "Il sax è molto usato nel jazz."),
    S("Che cos'è il ritmo?", ["L'organizzazione dei suoni lunghi e brevi nel tempo", "L'altezza di un suono", "Il volume", "Il colore del suono"], "Il ritmo scandisce il tempo."),
    S("Che cos'è la melodia?", ["Una successione di note che forma un motivo", "Un rumore", "Il battito della batteria", "Il volume"], "È il motivo che si canticchia."),
    S("Che cos'è l'armonia?", ["L'insieme di note suonate insieme", "Un solo suono", "Il silenzio", "Il ritmo"], "Gli accordi creano l'armonia."),
    S("Quale strumento ha il suono più grave?", ["Il contrabbasso", "Il flauto", "Il violino", "L'ottavino"], "Il contrabbasso è il più grande della famiglia degli archi."),
    S("Che cos'è il timpano?", ["Uno strumento a percussione dell'orchestra", "Una nota", "Un coro", "Un compositore"], "Il timpano ha una membrana tesa."),
    S("Chi fu Wolfgang Amadeus Mozart?", ["Un compositore austriaco", "Un pittore", "Un poeta", "Un re"], "Visse nel Settecento."),
    S("Chi fu Ludwig van Beethoven?", ["Un compositore tedesco", "Un violinista italiano", "Un pittore", "Un cantante pop"], "Compose nove sinfonie."),
    S("Chi compose «Aida»?", ["Giuseppe Verdi", "Giacomo Puccini", "Gioachino Rossini", "Antonio Vivaldi"], "Aida è ambientata nell'antico Egitto."),
    S("Chi compose «La bohème»?", ["Giacomo Puccini", "Giuseppe Verdi", "Gioachino Rossini", "Mozart"], "Puccini scrisse anche «Tosca»."),
    S("Chi compose «Il lago dei cigni»?", ["Pëtr Il'ič Čajkovskij", "Mozart", "Verdi", "Vivaldi"], "È un famoso balletto."),
    S("Come si chiama la danza classica sulle punte?", ["Balletto", "Valzer", "Tango", "Samba"], "Il balletto è un'arte nata nelle corti europee."),
    S("Di quale Paese è tipico il flamenco?", ["La Spagna", "Il Giappone", "L'Egitto", "Il Canada"], "Nasce in Andalusia."),
    S("Di quale Paese è tipico il tango?", ["L'Argentina", "La Svezia", "La Cina", "La Svizzera"], "Nasce a Buenos Aires."),
    S("Che cosa sono le note?", ["I segni che indicano suoni di diversa altezza", "Le parole delle canzoni", "Gli strumenti", "I cantanti"], "Le note si scrivono sul pentagramma."),
    S("Che cosa significa il tempo di 3/4?", ["Tre movimenti per battuta, come il valzer", "Due movimenti per battuta", "Quattro movimenti per battuta", "Cinque movimenti per battuta"], "Il valzer si balla in tre tempi.")
  ]);

  add("musica", "C", [
    S("Chi compose «Le nozze di Figaro»?", ["Wolfgang Amadeus Mozart", "Giuseppe Verdi", "Giacomo Puccini", "Johann Sebastian Bach"], "È un'opera comica del 1786."),
    S("Chi compose la «Cavalleria rusticana»?", ["Pietro Mascagni", "Gioachino Rossini", "Giacomo Puccini", "Giuseppe Verdi"], "È un'opera in un solo atto."),
    S("Chi compose «Madama Butterfly»?", ["Giacomo Puccini", "Giuseppe Verdi", "Claudio Monteverdi", "Gioachino Rossini"], "La protagonista è giapponese."),
    S("Chi compose il «Messia» con il coro «Alleluja»?", ["Georg Friedrich Händel", "Fryderyk Chopin", "Gioachino Rossini", "Claude Debussy"], "È un oratorio barocco."),
    S("Chi compose la «Sinfonia dal nuovo mondo»?", ["Antonín Dvořák", "Mozart", "Verdi", "Čajkovskij"], "Dvořák la scrisse negli Stati Uniti."),
    S("Chi compose «Per Elisa»?", ["Beethoven", "Mozart", "Bach", "Chopin"], "È un celebre pezzo per pianoforte."),
    S("Chi fu Johann Sebastian Bach?", ["Un compositore barocco tedesco", "Un pittore", "Un direttore moderno", "Un cantante pop"], "Scrisse fughe e toccate."),
    S("Quale periodo musicale segue il Classicismo?", ["Il Romanticismo", "Il Barocco", "Il Medioevo", "Il Rinascimento"], "Il Romanticismo fiorisce nell'Ottocento."),
    S("Quale periodo musicale precede il Classicismo?", ["Il Barocco", "Il Romanticismo", "Il Novecento", "Il Medioevo"], "Il Barocco è del Seicento e del primo Settecento."),
    S("Che cos'è il canto gregoriano?", ["Un canto liturgico medievale a una sola voce", "Un tipo di opera", "Una canzone jazz", "Una danza"], "Si canta senza accompagnamento."),
    S("Che cos'è una fuga?", ["Un brano in cui un tema viene ripreso da più voci", "Un brano veloce", "Una danza", "Un coro"], "Bach ne scrisse molte."),
    S("Che cos'è il contrappunto?", ["La sovrapposizione di più melodie indipendenti", "Il volume", "Il colore", "Una pausa lunga"], "Più linee melodiche si intrecciano."),
    S("Che cos'è il rap?", ["Un genere con testo parlato a ritmo", "Un'opera lirica", "Un canto gregoriano", "Una danza classica"], "Nasce negli Stati Uniti."),
    S("Chi è considerato «il re del rock and roll»?", ["Elvis Presley", "Frank Sinatra", "Bob Marley", "Mozart"], "Elvis fu un'icona degli anni Cinquanta."),
    S("Da quale Paese proviene il reggae?", ["Giamaica", "Argentina", "Italia", "Russia"], "Bob Marley è il suo simbolo."),
    S("Qual è l'unità di misura dell'intensità di un suono?", ["Il decibel", "Il metro", "Il watt", "Il litro"], "Si misura in dB."),
    S("Da che cosa dipende l'altezza di un suono?", ["Dalla frequenza", "Dall'ampiezza", "Dal timbro", "Dal luogo"], "Più alta la frequenza, più acuto il suono."),
    S("Da che cosa dipende il volume di un suono?", ["Dall'ampiezza dell'onda", "Dalla frequenza", "Dal timbro", "Dalla velocità"], "Onde più ampie fanno suoni più forti."),
    S("Qual è l'unità di misura della frequenza?", ["Hertz", "Decibel", "Metro", "Newton"], "Un hertz è un'oscillazione al secondo."),
    S("Che cos'è un quartetto d'archi?", ["Un gruppo di quattro strumenti ad arco", "Quattro cantanti", "Quattro pianoforti", "Una canzone"], "Due violini, una viola e un violoncello.")
  ]);

  // ===================== EDUCAZIONE CIVICA =====================
  add("civica", "A", [
    S("Che cosa si dice quando si chiede un favore?", ["Per favore", "Scusa", "Basta", "Non voglio"], "Per favore è una parola gentile."),
    S("Che cosa si dice quando si sbaglia?", ["Scusa", "Prego", "Ciao", "Ehi"], "Chiedere scusa è un gesto di rispetto."),
    S("Che cosa si fa quando si è in fila?", ["Si aspetta il proprio turno", "Si passa avanti", "Si spinge", "Si urla"], "In fila si rispetta chi è arrivato prima."),
    S("Dove si buttano le bottiglie di vetro?", ["Nel bidone del vetro", "Nel bidone della carta", "Nell'umido", "Per terra"], "Il vetro si ricicla."),
    S("Dove si butta la buccia della banana?", ["Nell'umido (organico)", "Nella carta", "Nel vetro", "Nella plastica"], "L'umido diventa concime."),
    S("Che cosa si fa con la luce quando si esce da una stanza?", ["La si spegne", "La si lascia accesa", "La si rompe", "La si copre"], "Spegnere la luce risparmia energia."),
    S("Che cosa è meglio fare con l'acqua del rubinetto?", ["Non sprecarla", "Lasciarla sempre aperta", "Giocare a lungo", "Buttarla via"], "L'acqua è preziosa."),
    S("Chi ci aiuta a imparare a scuola?", ["L'insegnante", "Il vigile", "Il cuoco", "Il pompiere"], "L'insegnante spiega e ci guida."),
    S("Chi dirige il traffico agli incroci?", ["Il vigile", "Il cuoco", "Il maestro", "Il pittore"], "Il vigile urbano aiuta a passare in sicurezza."),
    S("Chi porta i malati in ospedale con la sirena?", ["L'ambulanza", "Il pulmino", "Il camion dei rifiuti", "La bicicletta"], "L'ambulanza ha la sirena."),
    S("Quando andiamo in bicicletta, che cosa dobbiamo indossare in testa?", ["Il casco", "Il cappello di lana", "La cuffia", "Gli occhiali da sole"], "Il casco protegge la testa."),
    S("Prima di attraversare la strada, che cosa fai?", ["Guardo a destra e a sinistra", "Chiudo gli occhi", "Corro", "Chiamo un amico"], "Si controlla che non arrivino auto."),
    S("Se un compagno è triste, che cosa puoi fare?", ["Provare a consolarlo", "Prenderlo in giro", "Ignorarlo", "Andare via"], "La gentilezza aiuta."),
    S("Quale è un diritto dei bambini?", ["Andare a scuola", "Lavorare tutto il giorno", "Non mangiare", "Stare sempre soli"], "Ogni bambino ha diritto all'istruzione."),
    S("Che cosa significa rispettare gli altri?", ["Trattarli con gentilezza", "Dare ordini", "Rubare le loro cose", "Prenderli in giro"], "Il rispetto vale per tutti."),
    S("Che cos'è una famiglia?", ["Persone legate dall'affetto che si vogliono bene", "Un negozio", "Una scuola", "Una squadra di calcio"], "La famiglia si prende cura di noi."),
    S("Quale è il simbolo del nostro Paese?", ["La bandiera tricolore", "Un cappello rosso", "Un pallone", "Un ombrello"], "Verde, bianco e rosso."),
    S("Che cosa si fa con i giochi che si usano insieme?", ["Si condividono", "Si nascondono", "Si rompono", "Si buttano via"], "Condividere è bello.")
  ]);

  add("civica", "B", [
    S("Che cos'è il Comune?", ["L'ente più vicino ai cittadini, che amministra la città", "Un partito", "Una legge", "Una banca"], "Il sindaco guida il Comune."),
    S("Che cos'è un diritto?", ["Qualcosa che spetta a ogni persona", "Un obbligo", "Una punizione", "Una moneta"], "Per esempio il diritto allo studio."),
    S("Che cos'è un dovere?", ["Qualcosa che dobbiamo fare per la comunità", "Un gioco", "Un premio", "Una vacanza"], "Per esempio rispettare le regole."),
    S("Chi controlla che le regole sulle strade siano rispettate?", ["La Polizia stradale", "I pompieri", "I cuochi", "I maestri"], "Controlla velocità e documenti."),
    S("Quando si celebra la Giornata della Terra?", ["Il 22 aprile", "Il 25 dicembre", "Il 1° gennaio", "Il 14 febbraio"], "Serve a pensare alla salute del pianeta."),
    S("Quando si celebra la Giornata mondiale dei diritti dell'infanzia?", ["Il 20 novembre", "Il 2 giugno", "Il 25 aprile", "Il 1° maggio"], "Ricorda i diritti dei bambini."),
    S("Quando si celebra la Giornata internazionale della donna?", ["L'8 marzo", "Il 25 aprile", "Il 4 novembre", "Il 6 gennaio"], "Ricorda le conquiste e i diritti delle donne."),
    S("Perché si fa la raccolta differenziata?", ["Per riciclare i materiali e inquinare meno", "Per riempire le discariche", "Per bruciare tutto", "Per risparmiare carta"], "Dividere i rifiuti permette di riciclarli."),
    S("Che cos'è la discriminazione?", ["Trattare qualcuno in modo ingiusto per come è", "Aiutare chi ha bisogno", "Giocare in squadra", "Condividere"], "È contraria alla Costituzione."),
    S("Che cos'è l'inclusione?", ["Far sentire tutti accolti", "Escludere chi è diverso", "Dare i voti", "Giocare da soli"], "Tutti hanno diritto di partecipare."),
    S("Chi fa rispettare la legge e ferma chi commette reati?", ["Le forze dell'ordine", "I cuochi", "I maestri", "I medici"], "Polizia e Carabinieri."),
    S("In quale città ha sede la Commissione europea?", ["A Bruxelles", "A Roma", "A Parigi", "A Berlino"], "Bruxelles è la capitale del Belgio."),
    S("Quanti sono oggi gli Stati membri dell'Unione europea?", ["27", "28", "15", "50"], "Il Regno Unito è uscito nel 2020."),
    S("Che cos'è un cittadino?", ["Una persona con diritti e doveri in uno Stato", "Un abitante solo delle città", "Un turista", "Un animale"], "Il cittadino partecipa alla vita dello Stato."),
    S("Che cos'è la Protezione civile?", ["L'organizzazione che aiuta in caso di calamità", "Un partito", "Una scuola", "Una banca"], "Interviene per terremoti e alluvioni."),
    S("Che cos'è il volontariato?", ["Aiutare gli altri gratuitamente", "Lavorare per guadagnare", "Studiare", "Viaggiare"], "I volontari donano il loro tempo."),
    S("Che cos'è l'inquinamento?", ["L'immissione di sostanze dannose nell'ambiente", "Una pioggia fresca", "Un vento leggero", "Una nuvola"], "Danneggia aria, acqua e suolo."),
    S("Che cosa si intende per «bene comune»?", ["Ciò che appartiene e serve a tutti, come un parco", "La casa di una persona", "Il denaro di uno solo", "Un giocattolo"], "I beni comuni vanno rispettati."),
    S("Che cos'è il voto?", ["Il modo con cui i cittadini scelgono i loro rappresentanti", "Un tipo di moneta", "Un regalo", "Una gara"], "Votare è un diritto e un dovere."),
    S("Che cos'è una legge?", ["Una regola valida per tutti, fatta dallo Stato", "Un consiglio", "Un gioco", "Una canzone"], "Le leggi regolano la convivenza.")
  ]);

  add("civica", "C", [
    S("Che cos'è il suffragio universale?", ["Il diritto di voto per tutti i cittadini adulti", "Il voto solo degli uomini", "Il voto dei ricchi", "Il voto dei giudici"], "In Italia vale per tutti dal 1946."),
    S("Che cos'è una Repubblica parlamentare?", ["Una forma di Stato in cui il Parlamento ha un ruolo centrale", "Una monarchia assoluta", "Una dittatura", "Un impero"], "L'Italia è una Repubblica parlamentare."),
    S("Che cos'è il Consiglio dei ministri?", ["L'organo collegiale del Governo", "L'assemblea dei giudici", "Un tribunale", "Il Senato"], "È presieduto dal Presidente del Consiglio."),
    S("Quanti sono i senatori elettivi (dopo la riforma del 2020)?", ["200", "315", "630", "100"], "Prima erano 315."),
    S("Che cos'è un decreto-legge?", ["Un atto del Governo con forza di legge, in casi di urgenza", "Una sentenza", "Un voto popolare", "Una norma comunale"], "Il Parlamento deve convertirlo in legge."),
    S("Che cosa afferma l'articolo 2 della Costituzione?", ["La Repubblica riconosce i diritti inviolabili dell'uomo", "L'Italia ripudia la guerra", "La scuola è aperta a tutti", "L'Italia è fondata sul lavoro"], "Insieme ai doveri di solidarietà."),
    S("Che cosa afferma l'articolo 32 della Costituzione?", ["La Repubblica tutela la salute", "La Repubblica tutela il lavoro", "L'arte è libera", "La Repubblica è una e indivisibile"], "La salute è un diritto fondamentale."),
    S("Che cosa afferma l'articolo 33 della Costituzione?", ["L'arte e la scienza sono libere e libero ne è l'insegnamento", "L'Italia ripudia la guerra", "La libertà personale è inviolabile", "Il lavoro è un diritto"], "Tutela la libertà di insegnamento."),
    S("Quale articolo dice che il voto è un dovere civico?", ["L'articolo 48", "L'articolo 11", "L'articolo 1", "L'articolo 139"], "Il voto è personale, uguale, libero e segreto."),
    S("Che cosa significa che la Costituzione è «rigida»?", ["Si modifica solo con procedure speciali", "Si modifica con una legge ordinaria", "Non è scritta", "Non ha articoli"], "Serve una procedura aggravata."),
    S("Che cos'è la magistratura?", ["L'insieme dei giudici e dei pubblici ministeri", "Il Parlamento", "Il Governo", "L'esercito"], "Esercita il potere giudiziario."),
    S("Che cos'è la NATO?", ["Un'alleanza militare tra Paesi", "Una banca", "Un partito", "Una squadra sportiva"], "L'Italia ne fa parte dal 1949."),
    S("Che cosa sono i diritti umani?", ["Diritti fondamentali di ogni persona", "Diritti solo dei cittadini ricchi", "Privilegi dei governanti", "Regole del traffico"], "Valgono per tutti gli esseri umani."),
    S("Che cosa fa la Banca centrale europea?", ["Gestisce la moneta euro e i tassi di interesse", "Fa le leggi europee", "Giudica i Paesi", "Controlla il traffico"], "Ha sede a Francoforte."),
    S("In quale città ha sede il Parlamento italiano?", ["A Roma", "A Milano", "A Firenze", "A Torino"], "Montecitorio e Palazzo Madama sono a Roma."),
    S("Che cos'è la mafia?", ["Un'organizzazione criminale", "Un partito politico", "Un'associazione sportiva", "Un tipo di governo"], "Va combattuta con la legalità."),
    S("Che cos'è l'educazione finanziaria?", ["Imparare a gestire il denaro", "Una materia di storia", "Un tipo di moneta", "Un gioco"], "Aiuta a risparmiare e a non indebitarsi."),
    S("Che cos'è l'inflazione?", ["L'aumento generale dei prezzi", "La diminuzione dei prezzi", "L'aumento dei salari", "La fine dell'euro"], "I soldi comprano meno cose."),
    S("Che cos'è un mutuo?", ["Un prestito per comprare casa", "Un tipo di polizza", "Una tassa", "Uno stipendio"], "Si restituisce a rate."),
    S("Che cos'è una fake news?", ["Una notizia falsa diffusa come vera", "Una notizia vera", "Un giornale", "Un social network"], "Prima di condividere bisogna verificare le fonti.")
  ]);
})();
