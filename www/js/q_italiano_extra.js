// ===== Italiano: altre domande (si aggiungono a quelle di questions.js) =====
// Formato: { q, a: [4 risposte], c: 0 (la prima è giusta, poi vengono mescolate), e: spiegazione }
(function () {
  const S = (q, a, e) => ({ q, a, c: 0, e });

  // 1ª–2ª elementare
  const A = [
    S("Quale parola fa rima con «casa»?", ["Rosa", "Luna", "Pane", "Sole"], "Casa e rosa finiscono con lo stesso suono: -osa / -asa."),
    S("Qual è il contrario di «grande»?", ["Piccolo", "Alto", "Lungo", "Largo"], "Il contrario di grande è piccolo."),
    S("Quante sono le vocali dell'alfabeto italiano?", ["5", "4", "7", "21"], "Le vocali sono a, e, i, o, u: cinque."),
    S("Quale parola è il nome di un animale?", ["Coniglio", "Tavolo", "Rosso", "Correre"], "Il coniglio è un animale."),
    S("Quale parola indica un'azione?", ["Saltare", "Sedia", "Rosso", "Piccolo"], "Saltare è qualcosa che si fa: è un'azione."),
    S("Quale parola con la Q è scritta bene?", ["Quadro", "Cuadro", "Qadro", "Quaddro"], "Si scrive QUADRO: la Q vuole sempre la U."),
    S("Completa: «Luca ___ un gatto.»", ["ha", "a", "ah", "hà"], "Luca ha un gatto: «ha» è il verbo avere, con la H."),
    S("Quale parola comincia con la sillaba «LU»?", ["Luna", "Sole", "Mare", "Casa"], "LU-na comincia proprio con LU."),
    S("Quante sillabe ha la parola «pane»?", ["2", "1", "3", "4"], "Pa-ne: due sillabe."),
    S("Qual è il femminile di «bambino»?", ["Bambina", "Bambini", "Bambine", "Bambinetto"], "Il maschile è bambino, il femminile bambina."),
    S("Quale frase è una domanda?", ["Come ti chiami?", "Che bella giornata.", "Corri veloce!", "Oggi piove."], "Le domande finiscono con il punto interrogativo."),
    S("Quale parola va scritta con la lettera maiuscola?", ["Marco", "sedia", "gatto", "pane"], "I nomi di persona cominciano con la maiuscola."),
    S("Completa: «Le bambine ___ al parco.»", ["giocano", "gioca", "giocare", "giocato"], "Le bambine sono tante, quindi «giocano»."),
    S("Come si scrive il liquido che si beve?", ["Acqua", "Aqua", "Acua", "Aqqua"], "Si scrive ACQUA, con CQ."),
    S("Completa: «___ zaino è pesante.»", ["Lo", "La", "Il", "Una"], "Davanti a «zaino» si usa «lo»."),
    S("Quale parola contiene il suono «GN»?", ["Gnomo", "Gatto", "Gufo", "Giro"], "Gnomo ha il suono GN."),
    S("Come si scrive il gruppo di mamma, papà e figli?", ["Famiglia", "Famigla", "Famiglja", "Familia"], "Si scrive FAMIGLIA, con GLI."),
    S("Qual è il plurale di «uovo»?", ["Uova", "Uovi", "Uove", "Uovia"], "Un uovo, due uova: plurale irregolare."),
    S("Quale parola viene prima nell'ordine alfabetico?", ["Albero", "Casa", "Dado", "Zaino"], "La A viene prima di tutte le altre lettere."),
    S("Quale parola contiene la lettera «Q»?", ["Quaderno", "Pennarello", "Matita", "Zaino"], "Quaderno comincia con la Q."),
    S("Quale parola è un colore?", ["Verde", "Verbo", "Vento", "Vetro"], "Il verde è un colore."),
    S("Qual è il contrario di «pieno»?", ["Vuoto", "Largo", "Dolce", "Forte"], "Il contrario di pieno è vuoto."),
    S("Quale parola indica più di uno?", ["Fiori", "Fiore", "Albero", "Pane"], "Fiori è plurale: ce ne sono tanti."),
    S("Quale parola si scrive con «CH»?", ["Chiave", "Cena", "Casa", "Cuore"], "Chiave si scrive con CH."),
    S("Quale parola contiene «GH»?", ["Ghiaccio", "Gelato", "Giro", "Gatto"], "Ghiaccio si scrive con GH.")
  ];

  // 3ª–5ª elementare
  const B = [
    S("Quale parola è un verbo?", ["Scrivere", "Quaderno", "Gentile", "Dietro"], "Scrivere dice un'azione: è un verbo."),
    S("Qual è un sinonimo di «felice»?", ["Contento", "Triste", "Stanco", "Arrabbiato"], "Felice e contento significano la stessa cosa."),
    S("Qual è il contrario di «antico»?", ["Moderno", "Vecchio", "Lontano", "Grande"], "Il contrario di antico è moderno."),
    S("Nella frase «La mamma cucina una torta», qual è il verbo?", ["Cucina", "La", "Mamma", "Torta"], "Il verbo dice l'azione: cucina."),
    S("Quale parola è un nome collettivo?", ["Gregge", "Pecora", "Lana", "Pascolo"], "Un gregge è un gruppo di pecore."),
    S("Quale parola è un articolo?", ["Il", "Se", "Ma", "Con"], "«Il» è un articolo determinativo."),
    S("Completa: «Domani io ___ al mare.»", ["andrò", "andai", "sono andato", "andavo"], "Domani è futuro: andrò."),
    S("Quale parola è una preposizione?", ["Con", "Lento", "Tavolo", "Correre"], "«Con» è una preposizione semplice."),
    S("Qual è il femminile di «dottore»?", ["Dottoressa", "Dottora", "Dottoresso", "Dottoriera"], "Il femminile di dottore è dottoressa."),
    S("Qual è il plurale di «uomo»?", ["Uomini", "Uomi", "Uomoni", "Uomos"], "Uomo ha un plurale irregolare: uomini."),
    S("Quale parola, che indica calma, è scritta bene?", ["Tranquillo", "Tranquilo", "Trancuillo", "Tranqillo"], "Si scrive TRANQUILLO, con QU e LL."),
    S("Completa: «I miei amici ___ una bicicletta nuova.»", ["hanno", "anno", "ano", "hano"], "«Hanno» è il verbo avere, con la H."),
    S("Quale frase è scritta bene?", ["È arrivato Luca.", "E arrivato Luca.", "È arivato Luca.", "È arrivato luca."], "Servono l'accento su È, le due R e la maiuscola per Luca."),
    S("Quale segno di punteggiatura chiude una frase di meraviglia?", ["Il punto esclamativo", "La virgola", "I due punti", "Il punto e virgola"], "Il punto esclamativo esprime stupore o emozione."),
    S("Che cosa indica un aggettivo?", ["Com'è una persona, un animale o una cosa", "Che cosa fa qualcuno", "Dove si trova qualcosa", "Quando succede qualcosa"], "L'aggettivo descrive come è un nome."),
    S("In «Il cane abbaia», che parte del discorso è «abbaia»?", ["Verbo", "Nome", "Aggettivo", "Articolo"], "«Abbaia» dice che cosa fa il cane."),
    S("Quale parola è un nome astratto?", ["Amicizia", "Amico", "Casa", "Gatto"], "L'amicizia non si può toccare: è un nome astratto."),
    S("Quale parola è un nome comune?", ["Fiume", "Po", "Italia", "Giulia"], "«Fiume» è un nome comune, «Po» è proprio."),
    S("Quale frase è al passato?", ["Ieri ho giocato a calcio.", "Domani giocherò a calcio.", "Oggi gioco a calcio.", "Giocare è bello."], "«Ieri ho giocato» racconta qualcosa già successo."),
    S("Che cos'è una favola?", ["Un racconto con animali che insegna una morale", "Un elenco della spesa", "Una lettera ufficiale", "Una ricetta"], "Nelle favole gli animali parlano e c'è un insegnamento."),
    S("Quale parola è un sinonimo di «bello»?", ["Grazioso", "Brutto", "Piccolo", "Vecchio"], "Bello e grazioso hanno un significato simile."),
    S("Quale frase usa bene l'apostrofo?", ["Un'altra volta", "Un' altro libro", "Un'uomo alto", "L'scuola"], "Altra è femminile, quindi un'altra con l'apostrofo."),
    S("Qual è l'infinito di «mangiavo»?", ["Mangiare", "Mangiato", "Mangiando", "Mangio"], "L'infinito è la forma base: mangiare."),
    S("Come si chiama il testo in cui una persona racconta la propria vita?", ["Autobiografia", "Biografia", "Romanzo", "Poesia"], "Auto-biografia: la vita raccontata da chi l'ha vissuta."),
    S("Un testo che dà istruzioni su come fare qualcosa è un testo…", ["Regolativo", "Poetico", "Narrativo", "Descrittivo"], "Le ricette e le regole dei giochi sono testi regolativi.")
  ];

  // medie
  const C = [
    S("Chi ha scritto la «Divina Commedia»?", ["Dante Alighieri", "Francesco Petrarca", "Giovanni Boccaccio", "Ludovico Ariosto"], "La scrisse Dante Alighieri nel Trecento."),
    S("Chi ha scritto il «Decameron»?", ["Giovanni Boccaccio", "Dante Alighieri", "Francesco Petrarca", "Niccolò Machiavelli"], "Il Decameron è la raccolta di novelle di Boccaccio."),
    S("Chi ha scritto il «Canzoniere»?", ["Francesco Petrarca", "Giovanni Boccaccio", "Ugo Foscolo", "Giacomo Leopardi"], "Il Canzoniere è l'opera poetica di Petrarca."),
    S("Chi ha scritto la poesia «L'infinito»?", ["Giacomo Leopardi", "Giosuè Carducci", "Eugenio Montale", "Salvatore Quasimodo"], "«L'infinito» è di Giacomo Leopardi."),
    S("Chi ha scritto «Il Principe»?", ["Niccolò Machiavelli", "Dante Alighieri", "Ludovico Ariosto", "Torquato Tasso"], "Il Principe è un trattato politico di Machiavelli."),
    S("Chi ha scritto «Pinocchio»?", ["Carlo Collodi", "Edmondo De Amicis", "Giovanni Verga", "Luigi Pirandello"], "Pinocchio è di Carlo Collodi."),
    S("Chi ha scritto il libro «Cuore»?", ["Edmondo De Amicis", "Carlo Collodi", "Giovanni Verga", "Dino Buzzati"], "«Cuore» è di Edmondo De Amicis."),
    S("Chi ha scritto «Il barone rampante»?", ["Italo Calvino", "Umberto Eco", "Primo Levi", "Elsa Morante"], "Il barone rampante è di Italo Calvino."),
    S("Chi ha scritto «Se questo è un uomo»?", ["Primo Levi", "Italo Svevo", "Cesare Pavese", "Alberto Moravia"], "Primo Levi racconta la sua esperienza ad Auschwitz."),
    S("Il complemento oggetto risponde alla domanda…", ["Chi? Che cosa?", "Dove?", "Quando?", "Con che cosa?"], "Il complemento oggetto dice su chi o su che cosa cade l'azione."),
    S("«Domani andrò a Roma»: che tempo verbale è «andrò»?", ["Futuro semplice", "Passato remoto", "Imperfetto", "Condizionale presente"], "Domani è futuro: andrò è futuro semplice."),
    S("In «Corse velocemente», che cos'è «velocemente»?", ["Un avverbio", "Un aggettivo", "Un nome", "Una preposizione"], "Gli avverbi che finiscono in -mente dicono come si fa un'azione."),
    S("Qual è il passato remoto di «io vedo»?", ["Vidi", "Vedevo", "Ho visto", "Vedrò"], "Io vidi: passato remoto di vedere."),
    S("Qual è il condizionale presente di «io mangio»?", ["Mangerei", "Mangiassi", "Mangerò", "Mangiavo"], "Io mangerei: condizionale presente."),
    S("In «Penso che tu abbia ragione», «abbia» è…", ["Congiuntivo presente", "Indicativo presente", "Condizionale", "Imperativo"], "Dopo «penso che» si usa il congiuntivo: abbia."),
    S("Quale parola è un pronome?", ["Egli", "Fiume", "Veloce", "Sopra"], "«Egli» sostituisce un nome: è un pronome personale."),
    S("Che cos'è una similitudine?", ["Un confronto introdotto da «come»", "Un nome al posto di un altro", "Un suono imitato", "Un'esagerazione"], "«Veloce come il vento» è una similitudine."),
    S("Quale figura retorica c'è in «Te l'ho detto mille volte»?", ["Iperbole", "Metafora", "Onomatopea", "Similitudine"], "Mille volte è un'esagerazione: iperbole."),
    S("Quale figura retorica imita un suono?", ["Onomatopea", "Metafora", "Iperbole", "Similitudine"], "«Din don» e «bum» sono onomatopee."),
    S("Quale tipo di testo racconta fatti con personaggi, tempo e luogo?", ["Narrativo", "Regolativo", "Argomentativo", "Espositivo"], "Il testo narrativo racconta una storia."),
    S("Quanti versi ha un sonetto?", ["14", "12", "16", "10"], "Un sonetto ha 14 versi: due quartine e due terzine."),
    S("Da quanti versi è formata una terzina?", ["3", "2", "4", "5"], "La terzina ha tre versi."),
    S("Come si chiama il verso di 11 sillabe?", ["Endecasillabo", "Settenario", "Novenario", "Decasillabo"], "Endeca- vuol dire undici."),
    S("Quale frase è corretta?", ["Se avessi tempo, verrei.", "Se avrei tempo, verrei.", "Se avessi tempo, verrò.", "Se ho avuto tempo, verrei."], "Il periodo ipotetico vuole il congiuntivo e il condizionale."),
    S("Quale forma è corretta?", ["Qual è", "Qual'è", "Quàl è", "Qual'é"], "«Qual è» si scrive senza apostrofo."),
    S("Che cosa significa «effimero»?", ["Che dura poco", "Molto grande", "Antico", "Pericoloso"], "Effimero è ciò che dura pochissimo."),
    S("Che cosa significa «ostinato»?", ["Testardo", "Gentile", "Stanco", "Veloce"], "Chi è ostinato non cambia idea."),
    S("Il predicato nominale è formato da…", ["Il verbo essere e un nome o un aggettivo", "Solo un verbo di movimento", "Un avverbio e una preposizione", "Un articolo e un nome"], "Esempio: «Il cielo è azzurro»."),
    S("Che cos'è una frase subordinata?", ["Una frase che dipende da un'altra", "Una frase senza verbo", "Una frase molto lunga", "Una frase di meraviglia"], "La subordinata non sta in piedi da sola: dipende dalla principale.")
  ];

  const add = (band, list) => { QBANK.italiano[band] = QBANK.italiano[band].concat(list); };
  add("A", A); add("B", B); add("C", C);
})();
