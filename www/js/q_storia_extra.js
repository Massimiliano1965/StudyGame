// ===== Storia: altre domande (si aggiungono a quelle di q_storia.js) =====
// Formato: la risposta giusta è sempre la prima, poi vengono mescolate.
(function () {
  const S = (q, a, e) => ({ q, a, c: 0, e });

  const A = [
    S("Che cosa usavano gli uomini della preistoria per cacciare?", ["Lance e frecce di pietra", "Fucili", "Cannoni", "Coltelli di plastica"], "Costruivano le armi con pietre, ossa e legno."),
    S("Che cosa ha dato inizio alla storia?", ["La scrittura", "Il telefono", "L'aereo", "La televisione"], "La storia comincia quando gli uomini imparano a scrivere."),
    S("I faraoni erano i re dell'antico…", ["Egitto", "Giappone", "Messico", "Canada"], "Il faraone governava l'antico Egitto."),
    S("Chi costruì grandi strade e acquedotti?", ["I Romani", "Gli uomini delle caverne", "I Vichinghi", "Gli astronauti"], "I Romani furono grandi costruttori."),
    S("Come si vestivano gli antichi Romani?", ["Con la tunica e la toga", "Con i jeans", "Con la tuta", "Con la giacca a vento"], "Tunica e toga erano i vestiti dei Romani."),
    S("Quale mezzo si usava per navigare senza motore?", ["La nave a vela", "Il jet", "Il treno", "Il motorino"], "Le vele sfruttano il vento."),
    S("Che cos'è un museo?", ["Un posto dove si conservano oggetti del passato", "Un negozio di giocattoli", "Un campo di calcio", "Un ristorante"], "Nei musei si custodiscono e si guardano cose antiche."),
    S("Il Medioevo è il tempo dei…", ["Castelli e dei cavalieri", "Dinosauri", "Razzi spaziali", "Computer"], "Nel Medioevo c'erano castelli, cavalieri e dame."),
    S("Chi viveva dentro un castello?", ["Il signore con la sua famiglia", "Gli astronauti", "I dinosauri", "I faraoni"], "Il castello era la casa del signore."),
    S("A che cosa serve la linea del tempo?", ["A mettere in ordine gli eventi", "A misurare il caldo", "A disegnare i fiori", "A contare i passi"], "La linea del tempo mostra cosa è successo prima e cosa dopo."),
    S("Quanti giorni ha una settimana?", ["7", "5", "10", "6"], "Una settimana ha sette giorni."),
    S("Quale mese viene dopo dicembre?", ["Gennaio", "Novembre", "Febbraio", "Ottobre"], "Dopo dicembre ricomincia l'anno con gennaio."),
    S("Chi studia il passato scavando nella terra?", ["L'archeologo", "Il pasticciere", "Il pilota", "Il cuoco"], "L'archeologo trova oggetti antichi sotto terra.")
  ];

  const B = [
    S("Che cosa sono i geroglifici?", ["La scrittura degli antichi Egizi", "Un tipo di piramide", "Un dio greco", "Una moneta romana"], "I geroglifici erano disegni usati per scrivere."),
    S("Che cos'è una mummia?", ["Un corpo conservato con tecniche speciali", "Una statua", "Un papiro", "Un faraone vivo"], "Gli Egizi conservavano i corpi per l'aldilà."),
    S("Su che cosa scrivevano gli antichi Egizi?", ["Sul papiro", "Sulla carta", "Sul tablet", "Sulla plastica"], "Il papiro si ricavava da una pianta del Nilo."),
    S("Chi era Atena per i Greci?", ["La dea della saggezza, protettrice di Atene", "Il dio del mare", "Un re di Sparta", "Una città"], "Atena era la dea della sapienza."),
    S("Chi fu Alessandro Magno?", ["Un re macedone che conquistò un vasto impero", "Un imperatore romano", "Un faraone", "Un pittore"], "Alessandro conquistò terre fino all'India."),
    S("Chi fu Socrate?", ["Un filosofo greco", "Un generale romano", "Un faraone", "Un pirata"], "Socrate insegnava ad Atene facendo domande."),
    S("Quale città greca era famosa per i suoi guerrieri?", ["Sparta", "Atene", "Corinto", "Troia"], "Gli Spartani venivano educati alla guerra."),
    S("Dove si svolgeva la vita pubblica nell'antica Roma?", ["Nel Foro", "Nel Colosseo", "Nel Pantheon", "Nelle terme"], "Il Foro era la piazza principale di Roma."),
    S("Quale forma di governo ebbe Roma dopo i re?", ["La Repubblica", "L'Impero", "La monarchia assoluta", "La democrazia moderna"], "Dopo i re, Roma diventò una Repubblica (509 a.C.)."),
    S("Che cosa erano le terme romane?", ["Bagni pubblici", "Teatri", "Mercati", "Caserme"], "Alle terme i Romani si lavavano e si incontravano."),
    S("Chi erano i Vichinghi?", ["Navigatori e guerrieri del Nord Europa", "Cavalieri romani", "Mercanti egizi", "Guerrieri greci"], "I Vichinghi navigavano con le loro navi lunghe."),
    S("Come chiamavano i Romani i popoli stranieri fuori dai confini?", ["Barbari", "Cittadini", "Patrizi", "Consoli"], "«Barbari» voleva dire stranieri."),
    S("Quale animale allattò Romolo e Remo, secondo la leggenda?", ["Una lupa", "Una capra", "Un'aquila", "Una leonessa"], "La lupa trovò i gemelli sulle rive del Tevere."),
    S("Qual era la città di origine di Cristoforo Colombo?", ["Genova", "Venezia", "Firenze", "Napoli"], "Colombo nacque a Genova."),
    S("Che cos'era un monastero medievale?", ["Un luogo dove vivevano i monaci", "Un campo di battaglia", "Un porto", "Un mercato"], "Nei monasteri i monaci pregavano e copiavano i libri.")
  ];

  const C = [
    S("Che cos'è la democrazia, nata ad Atene?", ["Il governo del popolo", "Il governo di un solo re", "Il governo dei militari", "Il governo dei sacerdoti"], "Demos = popolo, kratos = potere."),
    S("Chi fu Pericle?", ["Un grande statista di Atene", "Un faraone", "Un imperatore romano", "Un re di Sparta"], "Sotto Pericle Atene visse la sua età d'oro."),
    S("Che cosa stabilì l'Editto di Milano del 313?", ["La libertà di culto, anche ai cristiani", "La fine della Repubblica", "La divisione dell'Impero", "La nascita dell'Italia"], "Lo emanò l'imperatore Costantino."),
    S("Chi fu Galileo Galilei?", ["Uno scienziato che osservò il cielo col telescopio", "Un pittore rinascimentale", "Un re di Francia", "Un esploratore"], "Galileo scoprì le lune di Giove."),
    S("Che cosa fu l'Illuminismo?", ["Un movimento culturale che puntava sulla ragione", "Una guerra del Settecento", "Un tipo di arte gotica", "Una dinastia reale"], "Gli illuministi volevano «illuminare» le menti con la ragione."),
    S("Che cosa fu il Risorgimento?", ["Il movimento che portò all'unità d'Italia", "Una guerra mondiale", "Un periodo della preistoria", "Una rivoluzione russa"], "Il Risorgimento è la storia dell'unificazione italiana."),
    S("Quale città divenne capitale d'Italia nel 1871?", ["Roma", "Firenze", "Torino", "Napoli"], "Dopo la presa di Roma, la capitale si spostò lì."),
    S("Chi fu Benito Mussolini?", ["Il dittatore fascista italiano", "Il primo re d'Italia", "Un patriota del Risorgimento", "Un papa"], "Guidò l'Italia durante il fascismo."),
    S("Che cos'è stata la Resistenza italiana?", ["La lotta contro il nazifascismo (1943-45)", "Una battaglia dell'antica Roma", "Un trattato di pace", "Una crociata"], "I partigiani combatterono per liberare l'Italia."),
    S("Chi fu Adolf Hitler?", ["Il dittatore nazista della Germania", "Un re d'Inghilterra", "Un presidente americano", "Un generale russo"], "Guidò la Germania nazista e scatenò la guerra."),
    S("Che cosa ricordiamo il 25 aprile?", ["La Liberazione dal nazifascismo", "La nascita della Repubblica", "L'Unità d'Italia", "La fine della Prima guerra mondiale"], "Il 25 aprile 1945 l'Italia fu liberata."),
    S("Che cosa ricordiamo il 2 giugno?", ["La nascita della Repubblica", "La Liberazione", "L'Unità d'Italia", "La Costituzione"], "Il 2 giugno 1946 gli italiani scelsero la Repubblica."),
    S("Quale organizzazione nacque nel 1945 per mantenere la pace fra le nazioni?", ["L'ONU", "La NATO", "L'Unione europea", "L'OPEC"], "L'ONU fu fondata alla fine della Seconda guerra mondiale."),
    S("In quale città fu firmato nel 1957 il trattato che fondò la Comunità economica europea?", ["Roma", "Parigi", "Bruxelles", "Berlino"], "Sono i Trattati di Roma del 1957."),
    S("In quale anno l'uomo sbarcò per la prima volta sulla Luna?", ["1969", "1957", "1981", "1999"], "Il 20 luglio 1969 con la missione Apollo 11.")
  ];

  const add = (band, list) => { QBANK.storia[band] = QBANK.storia[band].concat(list); };
  add("A", A); add("B", B); add("C", C);
})();
