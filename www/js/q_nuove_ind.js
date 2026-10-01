// ===== Nuove Indicazioni nazionali (D.M. 221/2025, dal 2026/27 per le classi prime) + altre domande =====
// Si aggiungono ai banchi esistenti. La risposta giusta è sempre la prima (poi vengono mescolate).
// Una domanda con cl: [dalla, alla] compare solo in quelle classi (0 = 1ª elementare … 5 = 1ª media, 6 = 2ª, 7 = 3ª media).
(function () {
  const S = (q, a, e, cl) => { const o = { q, a, c: 0, e }; if (cl) o.cl = cl; return o; };
  const key = q => q.q + "|" + q.a[0];
  const add = (subject, band, list) => {   // salta le domande già presenti nel banco
    const have = new Set(QBANK[subject][band].map(key));
    QBANK[subject][band] = QBANK[subject][band].concat(list.filter(q => !have.has(key(q)) && have.add(key(q))));
  };

  // ============ STORIA, medie: 1ª media = dai Longobardi alla Guerra dei Trent'anni ============
  add("storia", "C", [
    S("Quale popolo germanico entrò in Italia nel 568 guidato da re Alboino?", ["I Longobardi", "I Franchi", "I Vichinghi", "Gli Unni"], "I Longobardi si stabilirono nel Nord e al Centro-Sud.", [5, 6]),
    S("Qual era la capitale del regno dei Longobardi?", ["Pavia", "Roma", "Napoli", "Torino"], "Pavia fu la capitale longobarda.", [5, 6]),
    S("Chi fu Giustiniano?", ["Un imperatore bizantino che fece raccogliere le leggi romane", "Un re longobardo", "Un papa", "Un generale cartaginese"], "Il suo «Corpus iuris civilis» riunì il diritto romano.", [5, 6]),
    S("Chi fu Maometto?", ["Il profeta fondatore dell'Islam", "Un imperatore romano", "Un re franco", "Un filosofo greco"], "L'Islam nacque in Arabia nel VII secolo.", [5, 6]),
    S("Qual è il motto dei monaci benedettini, fondati da san Benedetto da Norcia?", ["Ora et labora", "Veni, vidi, vici", "Pax et bonum", "Carpe diem"], "«Prega e lavora»: i monasteri conservarono i libri antichi.", [5, 6]),
    S("Che cosa erano i Comuni, nati in Italia dopo l'anno Mille?", ["Città governate dai propri cittadini", "Regni governati da un solo re", "Monasteri fortificati", "Accampamenti militari"], "I Comuni difendevano la loro autonomia.", [5, 6]),
    S("Dove, nel 1176, la Lega lombarda sconfisse Federico Barbarossa?", ["A Legnano", "A Roma", "A Pavia", "A Bologna"], "La battaglia di Legnano fu una vittoria dei Comuni.", [5, 6]),
    S("Chi fu Federico II di Svevia?", ["Un imperatore e re di Sicilia, amante della cultura", "Un papa", "Un re longobardo", "Un navigatore genovese"], "Fu detto «stupor mundi», meraviglia del mondo.", [5, 6]),
    S("Chi fu Marco Polo?", ["Un mercante veneziano che viaggiò fino in Cina", "Un esploratore dell'America", "Un pittore del Rinascimento", "Un re di Venezia"], "Raccontò i suoi viaggi nel «Milione».", [5, 6]),
    S("Quali Paesi si combatterono nella Guerra dei Cent'anni (1337-1453)?", ["Francia e Inghilterra", "Italia e Spagna", "Roma e Cartagine", "Germania e Russia"], "Fu una lunga guerra tra Francesi e Inglesi.", [5, 6]),
    S("Chi fu Giovanna d'Arco?", ["Una giovane che guidò i Francesi contro gli Inglesi", "Una regina d'Inghilterra", "Una badessa italiana", "Una pittrice"], "Fu condannata al rogo nel 1431.", [5, 6]),
    S("Che cosa accadde nel 1453?", ["I Turchi conquistarono Costantinopoli", "Fu scoperta l'America", "Nacque il Regno d'Italia", "Morì Carlo Magno"], "Finì così l'Impero romano d'Oriente.", [5, 6]),
    S("Che cos'erano le Signorie italiane?", ["Governi di una sola famiglia su una città", "Repubbliche di contadini", "Monasteri", "Eserciti"], "Esempi: i Medici a Firenze, i Visconti a Milano.", [5, 6]),
    S("Quale famiglia governò Milano dopo i Visconti?", ["Gli Sforza", "I Medici", "I Savoia", "I Borgia"], "Gli Sforza succedettero ai Visconti nel 1450.", [5, 6]),
    S("Che cos'è stato l'Umanesimo?", ["Un movimento culturale che mise l'uomo al centro e riscoprì i classici", "Una guerra di religione", "Un'epidemia", "Un impero"], "Si sviluppò nel Quattrocento in Italia.", [5, 6]),
    S("Chi dipinse la «Gioconda»?", ["Leonardo da Vinci", "Michelangelo", "Raffaello", "Giotto"], "Leonardo fu pittore, scienziato e inventore.", [5, 6]),
    S("Chi raggiunse l'India navigando intorno all'Africa nel 1498?", ["Vasco da Gama", "Cristoforo Colombo", "Amerigo Vespucci", "Marco Polo"], "Il portoghese Vasco da Gama aprì la rotta per le Indie.", [5, 6]),
    S("Quale spedizione compì il primo giro del mondo (1519-1522)?", ["Quella di Magellano", "Quella di Colombo", "Quella di Marco Polo", "Quella di Vasco da Gama"], "Magellano morì durante il viaggio; tornò la nave di Elcano.", [5, 6]),
    S("Che cos'è stata la Controriforma?", ["La risposta della Chiesa cattolica alla Riforma protestante", "Una guerra tra Francia e Spagna", "Una rivoluzione di contadini", "Una riforma delle scuole"], "Si riunì il Concilio di Trento (1545-1563).", [5, 6]),
    S("Chi fu Carlo V d'Asburgo?", ["Un imperatore con un impero «su cui non tramontava mai il sole»", "Un re longobardo", "Un papa", "Un generale di Napoleone"], "Governò Spagna, Paesi Bassi, parte della Germania e l'America spagnola.", [5, 6]),
    S("Quando si combatté la Guerra dei Trent'anni?", ["1618-1648", "1337-1453", "1789-1799", "1914-1918"], "Coinvolse molti Stati europei.", [5, 6]),
    S("Con quale pace finì la Guerra dei Trent'anni?", ["La pace di Vestfalia", "La pace di Utrecht", "Il trattato di Versailles", "La pace di Roma"], "La pace di Vestfalia è del 1648.", [5, 6])
  ]);

  // ============ GEOGRAFIA: l'Italia (regioni, città, corsi d'acqua) ============
  const GEO_IT = [
    S("Qual è il capoluogo della Liguria?", ["Genova", "La Spezia", "Savona", "Imperia"], "Genova è il capoluogo ligure."),
    S("Qual è il capoluogo dell'Emilia-Romagna?", ["Bologna", "Modena", "Parma", "Ravenna"], "Bologna è il capoluogo."),
    S("Qual è il capoluogo del Lazio?", ["Roma", "Latina", "Viterbo", "Frosinone"], "Roma è anche la capitale d'Italia."),
    S("Qual è il capoluogo della Puglia?", ["Bari", "Lecce", "Taranto", "Foggia"], "Bari è il capoluogo pugliese."),
    S("Qual è il capoluogo della Calabria?", ["Catanzaro", "Reggio Calabria", "Cosenza", "Crotone"], "Catanzaro è il capoluogo della regione."),
    S("Qual è il capoluogo delle Marche?", ["Ancona", "Pesaro", "Macerata", "Ascoli Piceno"], "Ancona si affaccia sull'Adriatico."),
    S("Qual è il capoluogo dell'Umbria?", ["Perugia", "Terni", "Assisi", "Orvieto"], "Perugia è il capoluogo umbro."),
    S("Qual è il capoluogo della Basilicata?", ["Potenza", "Matera", "Melfi", "Policoro"], "Potenza è il capoluogo."),
    S("Qual è il capoluogo del Molise?", ["Campobasso", "Isernia", "Termoli", "Venafro"], "Campobasso è il capoluogo molisano."),
    S("Qual è il capoluogo del Friuli-Venezia Giulia?", ["Trieste", "Udine", "Pordenone", "Gorizia"], "Trieste è il capoluogo."),
    S("Qual è il capoluogo della Valle d'Aosta?", ["Aosta", "Courmayeur", "Cervinia", "Torino"], "Aosta è l'unico capoluogo della regione."),
    S("Qual è il capoluogo del Trentino-Alto Adige?", ["Trento", "Bolzano", "Merano", "Bressanone"], "Trento è il capoluogo della regione; Bolzano lo è dell'Alto Adige."),
    S("Da quale monte nasce il fiume Po?", ["Dal Monviso", "Dal Monte Bianco", "Dal Gran Sasso", "Dall'Etna"], "Il Po nasce dal Monviso, nelle Alpi."),
    S("In quale mare sfocia il fiume Po?", ["Adriatico", "Tirreno", "Ionio", "Ligure"], "Il Po forma un grande delta nell'Adriatico."),
    S("Quale fiume attraversa Verona?", ["L'Adige", "Il Tevere", "L'Arno", "Il Piave"], "L'Adige è il secondo fiume d'Italia per lunghezza."),
    S("Quale fiume attraversa Roma?", ["Il Tevere", "L'Arno", "Il Po", "L'Adige"], "Il Tevere sfocia nel Tirreno."),
    S("Quale fiume attraversa Firenze e Pisa?", ["L'Arno", "Il Tevere", "Il Po", "Il Ticino"], "L'Arno sfocia nel Tirreno."),
    S("Quale dei laghi italiani è il più profondo e noto per la sua forma a «Y» rovesciata?", ["Il lago di Como", "Il lago di Garda", "Il lago Trasimeno", "Il lago di Bolsena"], "Il lago di Como è uno dei più profondi d'Europa."),
    S("In quale regione si trova il lago Trasimeno?", ["Umbria", "Toscana", "Lazio", "Marche"], "Il Trasimeno è il più grande lago dell'Italia peninsulare."),
    S("Quale vulcano si trova in Sicilia?", ["L'Etna", "Il Vesuvio", "Lo Stromboli", "Il Vulture"], "L'Etna è il vulcano attivo più alto d'Europa."),
    S("Quale vulcano si trova vicino a Napoli?", ["Il Vesuvio", "L'Etna", "Lo Stromboli", "Il Gran Sasso"], "Il Vesuvio distrusse Pompei nel 79 d.C."),
    S("Qual è la montagna più alta delle Alpi italiane?", ["Il Monte Bianco", "Il Gran Sasso", "Il Monviso", "Il Cervino"], "Il Monte Bianco supera i 4800 metri."),
    S("Qual è la pianura più estesa d'Italia?", ["La Pianura Padana", "Il Tavoliere delle Puglie", "La Maremma", "La Pianura Pontina"], "È attraversata dal fiume Po."),
    S("Quali due Stati si trovano dentro il territorio italiano?", ["San Marino e Città del Vaticano", "Monaco e Malta", "Andorra e Liechtenstein", "Slovenia e Croazia"], "Sono enclave interamente circondate dall'Italia."),
    S("Con quanti Stati confina l'Italia per terra?", ["Quattro: Francia, Svizzera, Austria, Slovenia", "Due", "Sei", "Tre"], "Ci sono poi San Marino e la Città del Vaticano."),
    S("Quale mare bagna la costa occidentale della Sicilia e della Sardegna?", ["Il Tirreno e il mare di Sardegna", "L'Adriatico", "Il Mar Nero", "Il Mar Baltico"], "L'Italia è circondata da Tirreno, Ionio, Adriatico e mar Ligure."),
    S("Quante sono le regioni a statuto speciale in Italia?", ["Cinque", "Tre", "Otto", "Dieci"], "Sicilia, Sardegna, Valle d'Aosta, Trentino-Alto Adige, Friuli-Venezia Giulia."),
    S("Quale regione ha come capoluogo Cagliari?", ["La Sardegna", "La Sicilia", "La Calabria", "La Puglia"], "Cagliari è il capoluogo sardo."),
    S("Quale catena montuosa fa da «spina dorsale» alla penisola italiana?", ["Gli Appennini", "Le Alpi", "Gli Urali", "I Pirenei"], "Gli Appennini la percorrono da nord a sud."),
    S("In quale regione si trova Matera, con i suoi famosi Sassi?", ["Basilicata", "Puglia", "Calabria", "Campania"], "I Sassi di Matera sono patrimonio UNESCO.")
  ];
  add("geografia", "C", GEO_IT);
  add("geografia", "B", GEO_IT.slice(0, 14).concat(GEO_IT.slice(14, 16), GEO_IT.slice(19, 21), [GEO_IT[23]]));

  // ============ TECNOLOGIA e informatica: algoritmi, intelligenza artificiale, energia, donne nella scienza ============
  const TEC_NEW = [
    S("Che cos'è un algoritmo?", ["Una sequenza ordinata di istruzioni per risolvere un problema", "Un tipo di computer", "Un cavo di rete", "Un videogioco"], "Anche una ricetta di cucina è un algoritmo."),
    S("Che cos'è il pensiero computazionale?", ["Risolvere un problema scomponendolo in piccoli passi", "Sapere usare molti giochi", "Pensare solo a numeri", "Imparare a memoria"], "Si scompone, si cercano schemi, si scrivono i passi."),
    S("Che cos'è un «bug» in un programma?", ["Un errore", "Un virus del corpo", "Un tasto speciale", "Un insetto davvero"], "Trovare e correggere i bug si chiama debugging."),
    S("Qual è la più piccola unità di informazione di un computer?", ["Il bit", "Il pixel", "Il byte grande", "Il file"], "Un bit vale 0 oppure 1."),
    S("Quanti bit ci sono in un byte?", ["8", "2", "10", "16"], "1 byte = 8 bit."),
    S("Che cos'è un linguaggio di programmazione?", ["Un insieme di regole per dare istruzioni al computer", "Una lingua parlata", "Un tipo di tastiera", "Un social network"], "Esempi: Python, Scratch, JavaScript."),
    S("Che cos'è il sistema operativo?", ["Il programma che gestisce il dispositivo (per esempio Android)", "Un gioco", "Un sito web", "Una cuffia"], "Gestisce memoria, schermo, app."),
    S("Quale password è più sicura?", ["Una lunga, con lettere, numeri e simboli", "Il tuo nome", "12345", "La data di nascita"], "E non va mai riusata ovunque."),
    S("Che cos'è l'intelligenza artificiale?", ["Programmi che svolgono compiti che richiedono «intelligenza», come riconoscere immagini o scrivere testi", "Un robot con sentimenti", "Un tipo di cavo", "Un videogioco antico"], "Va usata con spirito critico."),
    S("Perché bisogna controllare le risposte di un'intelligenza artificiale?", ["Perché può sbagliare o inventare informazioni", "Perché non risponde mai", "Perché è sempre infallibile", "Perché costa troppo"], "L'uomo deve sempre verificare."),
    S("Che cos'è il «cloud»?", ["Uno spazio su computer lontani dove si salvano i dati via internet", "Una nuvola vera", "Un tipo di tastiera", "Una stampante"], "Cloud significa «nuvola»."),
    S("Come si scrive 2 in numeri binari?", ["10", "2", "11", "01"], "In binario: 1, 10, 11, 100…"),
    S("Come si scrive 5 in numeri binari?", ["101", "110", "111", "100"], "5 = 4 + 1 = 101 in binario."),
    S("Quale fonte di energia è rinnovabile?", ["Il sole", "Il petrolio", "Il carbone", "Il gas naturale"], "Sole, vento e acqua si rinnovano."),
    S("Quale fonte di energia NON è rinnovabile?", ["Il petrolio", "Il vento", "Il sole", "L'acqua dei fiumi"], "Il petrolio si esaurisce."),
    S("Che cosa fa un pannello fotovoltaico?", ["Trasforma la luce del sole in elettricità", "Scalda l'acqua dei fiumi", "Brucia il carbone", "Produce vento"], "Il fotovoltaico produce corrente dal Sole."),
    S("Che cosa sfrutta una pala eolica?", ["Il vento", "Il sole", "Il carbone", "Il petrolio"], "Eolico viene da Eolo, dio dei venti."),
    S("Che cosa significa «sostenibilità»?", ["Soddisfare i bisogni di oggi senza rovinare il futuro", "Costruire cose molto pesanti", "Spendere meno", "Correre più veloci"], "È pensare anche alle generazioni future."),
    S("Chi fu Ada Lovelace?", ["Una matematica, considerata la prima programmatrice", "Una regina", "Una pittrice", "Un'esploratrice polare"], "Scrisse il primo algoritmo per la macchina di Babbage."),
    S("Chi fu Marie Curie?", ["Una scienziata che studiò la radioattività e vinse due Nobel", "Una pittrice", "Un'astronauta", "Una cantante"], "Premi Nobel per la fisica (1903) e la chimica (1911)."),
    S("Chi fu Rita Levi-Montalcini?", ["Una neurologa italiana, premio Nobel per la medicina nel 1986", "Un'astronauta italiana", "Una scrittrice", "Una atleta"], "Scoprì il fattore di crescita nervoso."),
    S("Chi fu Margherita Hack?", ["Un'astrofisica italiana", "Una pittrice del Rinascimento", "Una navigatrice", "Una pianista"], "Studiò le stelle."),
    S("Che cos'è l'effetto serra?", ["Il calore trattenuto nell'atmosfera da certi gas, come l'anidride carbonica", "Il freddo dei poli", "Una tecnica agricola", "La luce della Luna"], "Troppo effetto serra provoca il riscaldamento globale.")
  ];
  add("tecnologia", "C", TEC_NEW);
  add("tecnologia", "B", [TEC_NEW[0], TEC_NEW[1], TEC_NEW[2], TEC_NEW[3], TEC_NEW[5], TEC_NEW[17]]);

  // ============ SCIENZE: laboratorio e metodo sperimentale ============
  add("scienze", "C", [
    S("Qual è il primo passo del metodo scientifico?", ["Osservare un fenomeno e porsi una domanda", "Scrivere le conclusioni", "Comprare gli strumenti", "Copiare un libro"], "Si parte sempre dall'osservazione."),
    S("Che cos'è un'ipotesi?", ["Una possibile spiegazione da verificare con un esperimento", "Una verità certa", "Un tipo di strumento", "Un risultato finale"], "Se l'esperimento la smentisce, si cambia ipotesi."),
    S("Perché un esperimento va ripetuto più volte?", ["Per controllare che il risultato sia affidabile", "Per rovinare i materiali", "Per perdere tempo", "Perché è obbligatorio"], "Un solo risultato può essere un caso."),
    S("In un esperimento, che cos'è una «variabile»?", ["Una condizione che può cambiare e che si vuole studiare", "Un errore", "Uno strumento", "Una conclusione"], "Si cambia una variabile alla volta."),
    S("Quale strumento si usa per misurare la temperatura?", ["Il termometro", "Il righello", "La bilancia", "Il cronometro"], "Il termometro misura i gradi."),
    S("Che cos'è un combustibile fossile?", ["Una fonte di energia formata in milioni di anni, come il petrolio", "Un tipo di pannello solare", "Un'acqua minerale", "Un animale"], "Carbone, petrolio e gas naturale."),
    S("Perché è importante risparmiare energia?", ["Perché le risorse sono limitate e inquinare fa male all'ambiente", "Perché costa meno comprare di più", "Per niente", "Per non usare mai l'elettricità"], "Meno sprechi, meno inquinamento."),
    S("Che cos'è un ecosistema?", ["Un ambiente con esseri viventi e non viventi che interagiscono", "Un tipo di animale", "Un tipo di pianta", "Una macchina"], "Esempi: un bosco, uno stagno.")
  ]);

  // ============ MUSICA: coro e improvvisazione ============
  add("musica", "A", [
    S("Che cos'è un coro?", ["Un gruppo di persone che cantano insieme", "Uno strumento", "Un tipo di danza", "Una canzone sola"], "Nel coro le voci si fondono."),
    S("Che cosa vuol dire improvvisare?", ["Inventare la musica sul momento", "Leggere uno spartito", "Stare zitti", "Spegnere lo stereo"], "Improvvisare è creare mentre si suona."),
    S("Quale strumento si suona battendo?", ["Il tamburo", "Il flauto", "Il violino", "L'arpa"], "Il tamburo è uno strumento a percussione.")
  ]);
  add("musica", "B", [
    S("Che cos'è un coro?", ["Un gruppo di cantanti che cantano insieme, anche a più voci", "Uno strumento a fiato", "Un compositore", "Una pausa"], "Un coro può cantare a una o più voci."),
    S("Che cosa vuol dire improvvisare in musica?", ["Inventare melodie o ritmi mentre si suona", "Suonare senza strumento", "Copiare un brano", "Stonare apposta"], "Nel jazz si improvvisa moltissimo."),
    S("Quali sono le voci principali di un coro?", ["Soprano, contralto, tenore e basso", "Do, re, mi, fa", "Violino e viola", "Piano e forte"], "Dalla più acuta alla più grave.")
  ]);
  add("musica", "C", [
    S("Che cos'è un coro a quattro voci?", ["Un gruppo che canta con soprano, contralto, tenore e basso", "Un'orchestra", "Una band rock", "Un solo cantante"], "Ogni voce canta una linea diversa."),
    S("Che cos'è l'improvvisazione musicale?", ["Creare musica sul momento, senza spartito", "Leggere note difficili", "Registrare un disco", "Accordare uno strumento"], "È tipica del jazz e del blues."),
    S("Che cos'è il canto corale?", ["Il canto di un gruppo, il coro", "Un tipo di tamburo", "Un solo di chitarra", "Un suono elettronico"], "Il canto corale unisce più voci.")
  ]);

  // ============ ITALIANO, 1ª-2ª elementare: scrittura a mano, sillabe, versi ============
  add("italiano", "A", [
    S("Come si chiama la scrittura con le lettere unite tra loro?", ["Corsivo", "Stampatello", "Maiuscolo", "Digitale"], "Il corsivo si scrive senza staccare la penna."),
    S("Che cosa si mette alla fine di una frase che racconta?", ["Il punto", "La virgola", "Il trattino", "Niente"], "Il punto chiude la frase."),
    S("Quante sillabe ha la parola «ombrello»?", ["3", "2", "4", "5"], "Om-brel-lo."),
    S("Come si divide in sillabe la parola «fiore»?", ["fio-re", "fi-ore", "f-io-re", "fior-e"], "Fio-re: due sillabe."),
    S("Come si chiamano le righe di una poesia?", ["Versi", "Capitoli", "Titoli", "Paragrafi"], "Un gruppo di versi è una strofa."),
    S("Quale parola fa rima con «mare»?", ["Altare", "Mela", "Gatto", "Casa"], "Mare e altare finiscono con -are."),
    S("Quale parola fa rima con «sole»?", ["Viole", "Luna", "Fiore", "Rosa"], "Sole e viole finiscono con -ole."),
    S("Completa con l'apostrofo: «___ albero è alto.»", ["L'", "Lo", "La", "Le"], "L'albero: l'apostrofo al posto della vocale."),
    S("Quale parola è scritta bene?", ["Pesce", "Pescie", "Pessce", "Pesse"], "Si scrive «pesce» con SCE."),
    S("Quale parola è scritta bene?", ["Sciarpa", "Siarpa", "Sciarppa", "Sciarpia"], "Si scrive «sciarpa» con SCI."),
    S("Qual è la prima lettera dell'alfabeto?", ["A", "B", "Z", "C"], "L'alfabeto comincia con la A."),
    S("Quale lettera viene dopo la «C»?", ["D", "B", "E", "F"], "A B C D…"),
    S("Quale parola ha una lettera maiuscola all'inizio?", ["Italia", "gatto", "mela", "casa"], "I nomi di Paesi hanno la maiuscola."),
    S("Quale frase è scritta bene?", ["Marco va a scuola.", "marco va a scuola.", "Marco Va A Scuola.", "marco va a scuola"], "Maiuscola all'inizio e punto alla fine."),
    S("Quale parola vuol dire «tanti libri»?", ["Libri", "Libro", "Librino", "Libretto"], "Il plurale di «libro» è «libri».")
  ]);

  // ============ ETICHETTE DI CLASSE sui banchi esistenti ============
  const txt = q => (q.q + " " + q.a[0] + " " + (q.e || "")).toLowerCase();
  const tag = (subject, band, re, cl) => QBANK[subject][band].forEach(q => { if (!q.cl && re.test(txt(q))) q.cl = cl; });
  // Storia: Settecento e dopo = 2ª e 3ª media (la 1ª media va fino alla Guerra dei Trent'anni)
  tag("storia", "C", /rivoluzione francese|1789|bastiglia|napoleone|rivoluzione industriale|regno d'italia|1861|garibaldi|cavour|mazzini|primo re d'italia|risorgimento|illuminismo|galileo|guerra mondiale|1914|1945|shoah|repubblica italiana|1946|costituzione|1948|muro di berlino|1989|mussolini|hitler|resistenza|25 aprile|2 giugno|\bonu\b|1957|sbarcò|1969|1871|fascis|nazis|unità d'italia/, [6, 7]);
  // Italiano: congiuntivo e condizionale, analisi del periodo, parafrasi, autori del Novecento = 2ª e 3ª media
  tag("italiano", "C", /congiuntivo|condizionale|se avessi|subordinata|parafrasi|pirandello|svevo|primo levi|calvino|antitesi|anafora|specificazione|complemento di luogo|iperbole/, [6, 7]);
})();
