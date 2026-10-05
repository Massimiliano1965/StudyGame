// ===== Altre domande (5/10/2026): materie con meno domande =====
// geografia A, musica A, storia A, scienze B, civica B, italiano B. La risposta giusta è sempre la prima (poi vengono mescolate).
(function () {
  const S = (q, a, e) => ({ q, a, c: 0, e });
  const add = (subject, band, list) => {   // salta le domande con lo stesso testo di una già presente
    const have = new Set(QBANK[subject][band].map(q => q.q));
    QBANK[subject][band] = QBANK[subject][band].concat(list.filter(q => !have.has(q.q) && have.add(q.q)));
  };

  // ===================== GEOGRAFIA, fascia A (1ª-2ª elementare) =====================
  add("geografia", "A", [
    S("Dove sorge il sole la mattina?", ["A est", "A ovest", "A nord", "Sotto terra"], "Il sole sorge a est e tramonta a ovest."),
    S("Dove tramonta il sole la sera?", ["A ovest", "A est", "A sud", "In cielo a metà"], "Il sole tramonta a ovest."),
    S("Che cos'è una mappa?", ["Un disegno di un luogo visto dall'alto", "Una foto di una persona", "Un libro di favole", "Un tipo di zaino"], "La mappa ci aiuta a trovare la strada."),
    S("Che cos'è un'isola?", ["Una terra circondata dall'acqua", "Una montagna di neve", "Un fiume molto lungo", "Una grande città"], "Intorno a un'isola c'è il mare o un lago."),
    S("Dove nasce di solito un fiume?", ["In montagna", "Nel mare", "In una piazza", "In un deserto di sabbia"], "Il fiume nasce in montagna e scende verso il mare."),
    S("Che cosa c'è in una valle?", ["Una pianura stretta tra le montagne", "Il mare aperto", "Un vulcano acceso", "Un'isola"], "La valle sta tra i monti, spesso con un fiume."),
    S("Com'è il terreno in pianura?", ["Piatto", "Molto ripido", "Pieno di cime", "Sempre ghiacciato"], "In pianura il terreno è piatto e facile da coltivare."),
    S("Quale animale vive in montagna?", ["Lo stambecco", "Il delfino", "Il cammello", "Il pinguino"], "Lo stambecco si arrampica sulle rocce."),
    S("Qual è la parte di spiaggia toccata dalle onde?", ["La riva", "La cima", "La sorgente", "Il bosco"], "Sulla riva arrivano le onde."),
    S("Che cos'è un lago?", ["Acqua dolce circondata dalla terra", "Acqua salata senza fine", "Una montagna alta", "Una strada lunga"], "Il lago è circondato dalla terra."),
    S("Com'è l'acqua del mare?", ["Salata", "Dolce", "Sempre calda", "Gassata"], "Il mare è salato, i laghi di solito no."),
    S("Che cos'è un paese?", ["Un piccolo centro abitato", "Un grande oceano", "Una montagna", "Un pianeta"], "Il paese è più piccolo di una città."),
    S("Che cosa indica il semaforo rosso per i pedoni?", ["Bisogna fermarsi", "Si può attraversare", "Bisogna correre", "Si può giocare in strada"], "Si attraversa solo con il verde."),
    S("In quale stagione cadono le foglie degli alberi?", ["In autunno", "In estate", "In primavera", "Mai"], "In autunno molte foglie ingialliscono e cadono."),
    S("Che cos'è la collina?", ["Un rilievo più basso della montagna", "Un fiume molto largo", "Un lago ghiacciato", "Una spiaggia"], "La collina è più bassa e arrotondata della montagna.")
  ]);

  // ===================== MUSICA, fascia A (1ª-2ª elementare) =====================
  add("musica", "A", [
    S("Quale strumento si suona soffiando?", ["Il flauto", "Il tamburo", "La chitarra", "Il pianoforte"], "Nel flauto si soffia."),
    S("Quale strumento si suona battendo con le bacchette?", ["Il tamburo", "Il violino", "La tromba", "L'arpa"], "Il tamburo si suona battendo."),
    S("Quale strumento ha le corde e si suona con l'archetto?", ["Il violino", "Il triangolo", "Il flauto", "Il tamburello"], "L'archetto sfrega le corde del violino."),
    S("Quale strumento ha tasti bianchi e neri?", ["Il pianoforte", "La chitarra", "Il tamburo", "Il flauto"], "Il pianoforte ha i tasti bianchi e neri."),
    S("Come si chiama chi dirige l'orchestra?", ["Il direttore d'orchestra", "Il cuoco", "Il pittore", "Il bidello"], "Il direttore guida i musicisti con la bacchetta."),
    S("Come si chiama un gruppo di persone che canta insieme?", ["Il coro", "La squadra", "La classe", "Il circo"], "Nel coro si canta tutti insieme."),
    S("Un suono forte è…", ["Un suono che si sente tanto", "Un suono che non si sente", "Un suono sempre lento", "Un colore"], "Il contrario di forte è piano."),
    S("Un suono acuto è…", ["Un suono alto e sottile, come un fischio", "Un suono basso e grosso", "Il silenzio", "Un rumore di passi"], "Il contrario di acuto è grave."),
    S("Un suono grave è…", ["Un suono basso e profondo, come un tuono", "Un suono sottile come un fischietto", "Il silenzio", "Un colore scuro"], "Il contrabbasso fa suoni gravi."),
    S("Quante sono le note musicali?", ["Sette", "Tre", "Dieci", "Cinque"], "Do, re, mi, fa, sol, la, si."),
    S("Qual è la prima nota della scala?", ["Do", "Si", "Fa", "La"], "La scala parte dal do."),
    S("Che cos'è il silenzio in musica?", ["Un momento senza suono", "Un suono fortissimo", "Uno strumento", "Una canzone allegra"], "Anche le pause fanno parte della musica."),
    S("Quale di questi è uno strumento musicale?", ["La chitarra", "La forchetta", "Il cuscino", "La scopa"], "La chitarra ha sei corde."),
    S("Quale strumento ha la forma di un triangolo?", ["Il triangolo", "Il violino", "La tromba", "Il pianoforte"], "Il triangolo si suona con una bacchetta di metallo."),
    S("Che cos'è una ninna nanna?", ["Una canzone dolce per far dormire i bambini", "Una marcia militare", "Un ballo veloce", "Un rumore forte"], "La ninna nanna si canta piano.")
  ]);

  // ===================== STORIA, fascia A (1ª-2ª elementare) =====================
  add("storia", "A", [
    S("Che cosa viene prima: la colazione o la cena?", ["La colazione", "La cena", "Arrivano insieme", "Nessuna delle due"], "La colazione si fa la mattina, la cena la sera."),
    S("Quale parola indica il tempo che è già passato?", ["Ieri", "Domani", "Dopodomani", "Fra un anno"], "Ieri è passato, domani deve ancora venire."),
    S("Quale parola indica il tempo che deve ancora venire?", ["Domani", "Ieri", "L'anno scorso", "Una volta"], "Domani è il futuro."),
    S("Quanti giorni ha una settimana?", ["Sette", "Cinque", "Dieci", "Trenta"], "Da lunedì a domenica sono sette giorni."),
    S("Quanti mesi ha un anno?", ["Dodici", "Dieci", "Sette", "Ventiquattro"], "Da gennaio a dicembre sono dodici mesi."),
    S("Quante sono le stagioni?", ["Quattro", "Due", "Sei", "Dodici"], "Primavera, estate, autunno e inverno."),
    S("Che cosa usavano i nonni per scrivere lettere prima dei cellulari?", ["Carta e penna", "Il tablet", "I messaggi vocali", "Il computer portatile"], "Le lettere si mandavano per posta."),
    S("Che cosa misura il calendario?", ["I giorni, le settimane e i mesi", "La temperatura", "Il peso", "L'altezza"], "Sul calendario si segnano i giorni."),
    S("Che cosa misura l'orologio?", ["Le ore e i minuti", "I chili", "I metri", "I colori"], "L'orologio misura il tempo che passa."),
    S("Che cos'è una fonte storica?", ["Una traccia del passato, come una foto o un oggetto vecchio", "Una fontana in piazza", "Un gioco nuovo", "Un cartone animato"], "Le fonti ci raccontano com'era il passato."),
    S("Che cos'è l'albero genealogico?", ["Il disegno della propria famiglia: genitori, nonni, bisnonni", "Un albero da frutto", "Un albero di Natale", "Un bosco"], "Mostra chi sono i nostri antenati."),
    S("Chi è il bisnonno?", ["Il papà del nonno o della nonna", "Il fratello del papà", "Il figlio dello zio", "Il vicino di casa"], "Il bisnonno è il papà di un nonno.")
  ]);

  // ===================== SCIENZE, fascia B (3ª-5ª elementare) =====================
  add("scienze", "B", [
    S("Di che cosa hanno bisogno le piante per fare la fotosintesi?", ["Luce, acqua e anidride carbonica", "Solo sale", "Buio e sabbia", "Latte e zucchero"], "Con la luce le piante producono zuccheri e ossigeno."),
    S("Quale gas producono le piante con la fotosintesi?", ["L'ossigeno", "Il fumo", "Il vapore di sale", "Il gas della cucina"], "Le piante liberano ossigeno nell'aria."),
    S("Come si chiamano gli animali che mangiano solo piante?", ["Erbivori", "Carnivori", "Onnivori", "Insettivori"], "Mucche e conigli sono erbivori."),
    S("Come si chiamano gli animali che mangiano sia piante sia carne?", ["Onnivori", "Erbivori", "Carnivori", "Vegetali"], "Anche l'uomo è onnivoro."),
    S("Che cos'è una catena alimentare?", ["La serie di chi mangia chi in un ambiente", "Una collana di frutta", "Una fila al supermercato", "Una ricetta"], "Erba, coniglio, volpe: ognuno è cibo per il successivo."),
    S("In quali tre stati si trova l'acqua?", ["Solido, liquido e gassoso", "Rosso, verde e blu", "Caldo, tiepido e freddo", "Dolce, salato e amaro"], "Ghiaccio, acqua e vapore."),
    S("A quanti gradi bolle l'acqua al livello del mare?", ["100 gradi", "10 gradi", "50 gradi", "0 gradi"], "A 0 gradi invece diventa ghiaccio."),
    S("Come si chiama il passaggio da liquido a gas?", ["Evaporazione", "Solidificazione", "Fusione", "Germinazione"], "L'acqua che evapora diventa vapore."),
    S("Come si chiama il passaggio da solido a liquido?", ["Fusione", "Evaporazione", "Condensazione", "Respirazione"], "Il ghiaccio fonde e diventa acqua."),
    S("Quale organo pompa il sangue nel corpo?", ["Il cuore", "Lo stomaco", "Il polmone", "Il fegato"], "Il cuore batte e spinge il sangue."),
    S("A che cosa servono i polmoni?", ["A respirare", "A digerire il cibo", "A pensare", "A muovere le gambe"], "Nei polmoni l'aria scambia ossigeno con il sangue."),
    S("Quanti sono i sensi dell'uomo?", ["Cinque", "Tre", "Sette", "Dieci"], "Vista, udito, olfatto, gusto e tatto."),
    S("Quale pianeta è il più vicino al Sole?", ["Mercurio", "Marte", "Giove", "Nettuno"], "Mercurio è il primo pianeta del sistema solare."),
    S("Che cos'è un vertebrato?", ["Un animale con la colonna vertebrale", "Un animale senza ossa", "Una pianta con le spine", "Un sasso"], "Pesci, uccelli e mammiferi sono vertebrati."),
    S("Quale di questi è un invertebrato?", ["La lumaca", "Il cane", "Il pesce rosso", "Il passero"], "La lumaca non ha la colonna vertebrale.")
  ]);

  // ===================== EDUCAZIONE CIVICA, fascia B (3ª-5ª elementare) =====================
  add("civica", "B", [
    S("Che cos'è la Costituzione italiana?", ["La legge più importante dello Stato", "Un libro di favole", "Una canzone", "Un regolamento della scuola"], "È in vigore dal 1° gennaio 1948."),
    S("Da quanti anni in su si vota in Italia?", ["Dai 18 anni", "Dai 10 anni", "Dai 14 anni", "Dai 30 anni"], "A 18 anni si diventa maggiorenni."),
    S("Che cosa festeggiamo il 2 giugno?", ["La Festa della Repubblica", "Il Natale", "L'inizio della scuola", "Il Capodanno"], "Il 2 giugno 1946 gli italiani scelsero la Repubblica."),
    S("Quali sono i colori della bandiera italiana?", ["Verde, bianco e rosso", "Blu, bianco e rosso", "Giallo e rosso", "Nero, rosso e oro"], "Il Tricolore ha tre bande verticali."),
    S("Come si chiama l'inno nazionale italiano?", ["Il Canto degli Italiani", "La Marsigliese", "L'Inno alla gioia", "Fratelli d'Europa"], "È chiamato anche «Inno di Mameli»."),
    S("Chi governa un Comune?", ["Il sindaco con la giunta e il consiglio comunale", "Il preside", "Il capitano della squadra", "Il medico"], "Il sindaco è eletto dai cittadini."),
    S("Che cosa vuol dire raccolta differenziata?", ["Dividere i rifiuti per tipo: carta, plastica, vetro, umido", "Buttare tutto insieme", "Bruciare i rifiuti in giardino", "Lasciare i rifiuti in strada"], "Così i materiali si possono riciclare."),
    S("Dove si butta una bottiglia di vetro?", ["Nel contenitore del vetro", "Nell'umido", "Nella carta", "Nel prato"], "Il vetro si ricicla moltissime volte."),
    S("Dove si buttano le bucce di frutta?", ["Nell'umido (organico)", "Nel vetro", "Nella plastica", "Nella carta"], "L'umido diventa compost, un concime."),
    S("Che cosa vuol dire rispettare le regole?", ["Seguirle per stare bene insieme", "Ignorarle quando non piacciono", "Cambiarle da soli", "Farle seguire solo agli altri"], "Le regole servono a convivere."),
    S("Che cosa fare se si vede un compagno preso in giro?", ["Aiutarlo e avvisare un adulto", "Ridere con gli altri", "Far finta di niente", "Unirsi agli altri"], "Il bullismo si ferma chiedendo aiuto."),
    S("Quale numero si chiama in Italia per le emergenze?", ["Il 112", "Il 1000", "Il 007", "Il 123456"], "Il 112 è il numero unico di emergenza."),
    S("Che cosa sono i diritti dei bambini?", ["Cose che spettano a ogni bambino, come studiare, giocare ed essere curati", "Regole solo per gli adulti", "Compiti per le vacanze", "Giochi da tavolo"], "Sono scritti in una Convenzione dell'ONU del 1989."),
    S("Che cos'è il volontariato?", ["Aiutare gli altri gratis, per scelta", "Un lavoro pagato molto", "Un obbligo per i bambini", "Uno sport"], "Molte associazioni vivono grazie ai volontari."),
    S("Qual è la capitale d'Italia, dove si trovano Parlamento e Governo?", ["Roma", "Milano", "Napoli", "Torino"], "Roma è la capitale dal 1871.")
  ]);

  // ===================== ITALIANO, fascia B (3ª-5ª elementare) =====================
  add("italiano", "B", [
    S("Qual è il plurale di «uovo»?", ["Le uova", "Gli uovi", "Le uove", "Gli uova"], "È un plurale irregolare."),
    S("Qual è il plurale di «uomo»?", ["Gli uomini", "Gli uomi", "I uomini", "Le uome"], "Anche questo è irregolare."),
    S("Quale parola è un verbo?", ["Correre", "Tavolo", "Rosso", "Sotto"], "I verbi indicano azioni."),
    S("Quale parola è un aggettivo?", ["Simpatico", "Mangiare", "Sedia", "Con"], "L'aggettivo dice com'è una cosa."),
    S("Qual è il contrario di «coraggioso»?", ["Pauroso", "Forte", "Veloce", "Allegro"], "Il coraggioso affronta le paure."),
    S("Qual è un sinonimo di «veloce»?", ["Rapido", "Lento", "Pigro", "Pesante"], "I sinonimi hanno lo stesso significato."),
    S("Quale frase è scritta giusta?", ["Ho mangiato una mela", "O mangiato una mela", "Ho mangiato un mela", "Hò mangiato una mela"], "«Ho» del verbo avere vuole l'h."),
    S("Quale frase è scritta giusta?", ["C'è un gatto in giardino", "Ce un gatto in giardino", "C'è una gatto in giardino", "Cè un gatto in giardino"], "«C'è» vuole l'apostrofo."),
    S("Come si scrive giusto?", ["Mamma", "Mama", "Mammma", "Mamah"], "Si scrive «mamma» con due m."),
    S("Che cos'è il soggetto della frase?", ["Chi compie l'azione o di chi si parla", "Il verbo", "Il punto finale", "Un aggettivo"], "In «Luca corre» il soggetto è Luca."),
    S("In «Il cane abbaia», qual è il predicato?", ["Abbaia", "Il cane", "Il", "Cane"], "Il predicato dice che cosa fa il soggetto."),
    S("Che tempo è il verbo in «domani andrò al mare»?", ["Futuro", "Passato", "Presente", "Imperfetto"], "«Andrò» indica una cosa che deve ancora succedere.")
  ]);
})();
