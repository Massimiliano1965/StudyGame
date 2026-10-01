// ===== Banco domande di SCIENZE =====
// Formato: { q, a: [4 risposte], c: 0 (la prima è giusta, poi vengono mescolate), e: spiegazione }
(function () {
  const S = (q, a, e) => ({ q, a, c: 0, e });

  // 1ª–2ª elementare: i sensi, piante, animali, acqua
  const A = [
    S("Con quale organo vediamo?", ["Gli occhi", "Le orecchie", "Il naso", "La lingua"], "Vediamo con gli occhi."),
    S("Con quale organo sentiamo gli odori?", ["Il naso", "Gli occhi", "Le orecchie", "Le mani"], "Gli odori si sentono con il naso."),
    S("Con che cosa ascoltiamo i suoni?", ["Le orecchie", "Gli occhi", "Il naso", "I piedi"], "Si ascolta con le orecchie."),
    S("Con quale parte del corpo sentiamo il sapore?", ["La lingua", "Il naso", "Le dita dei piedi", "I capelli"], "I sapori si sentono con la lingua."),
    S("Quale animale vola?", ["Il passero", "Il cane", "La mucca", "Il pesce"], "Il passero ha le ali."),
    S("Dove vivono i pesci?", ["Nell'acqua", "Sugli alberi", "Sotto la sabbia del deserto", "Nelle nuvole"], "I pesci vivono nell'acqua."),
    S("Di che cosa hanno bisogno le piante per vivere?", ["Acqua, luce e aria", "Solo caramelle", "Solo buio", "Plastica"], "Senza acqua e luce le piante appassiscono."),
    S("Quale parte della pianta sta sotto terra?", ["La radice", "Il fiore", "La foglia", "Il frutto"], "Le radici sono sotto terra e bevono."),
    S("Da che cosa nasce una nuova pianta?", ["Dal seme", "Dal sasso", "Dalla sabbia", "Dal vento"], "Dal seme nasce una pianta."),
    S("Quale animale depone le uova?", ["La gallina", "La mucca", "Il cane", "Il gatto"], "La gallina depone le uova."),
    S("Il ghiaccio è acqua allo stato…", ["Solido", "Liquido", "Gassoso", "Colorato"], "Il ghiaccio è acqua solida."),
    S("Che cosa succede al ghiaccio al sole?", ["Si scioglie e diventa acqua", "Diventa più duro", "Diventa legno", "Diventa sabbia"], "Il calore scioglie il ghiaccio."),
    S("Quale di questi è un essere vivente?", ["Un albero", "Un sasso", "Una sedia", "Una matita"], "Gli alberi nascono, crescono e muoiono."),
    S("Che cosa ci dà il Sole?", ["Luce e calore", "Pioggia", "Vento", "Buio"], "Il Sole ci illumina e ci scalda."),
    S("Che cosa mangia un erbivoro?", ["Erba e piante", "Carne", "Pesce", "Sassi"], "Gli erbivori mangiano vegetali."),
    S("Quale animale è un insetto?", ["La formica", "Il gatto", "La rana", "Il cavallo"], "La formica è un insetto."),
    S("Quante zampe ha un insetto?", ["6", "4", "8", "2"], "Gli insetti hanno sei zampe."),
    S("In quale stagione cadono le foglie di molti alberi?", ["Autunno", "Primavera", "Estate", "Inverno"], "In autunno molte foglie cadono."),
    S("Che cosa ci serve per respirare?", ["L'aria", "Il sale", "La sabbia", "Lo zucchero"], "Respiriamo l'aria."),
    S("Quale organo pompa il sangue?", ["Il cuore", "Il cervello", "Lo stomaco", "Le ossa"], "Il cuore fa girare il sangue."),
    S("Con quali organi respiriamo?", ["Con i polmoni", "Con lo stomaco", "Con il cuore", "Con le ossa"], "L'aria entra nei polmoni."),
    S("Che cosa sostiene il nostro corpo?", ["Lo scheletro", "I capelli", "Le unghie", "La pelle"], "Lo scheletro è fatto di ossa."),
    S("Quale animale vive nel mare?", ["Il delfino", "La mucca", "Il gatto", "L'elefante"], "Il delfino vive nel mare."),
    S("Quale di questi cibi viene da una pianta?", ["La mela", "Il formaggio", "Il pesce", "L'uovo"], "La mela cresce sull'albero."),
    S("Che cosa succede se non annaffi una pianta?", ["Appassisce", "Cresce più veloce", "Diventa blu", "Diventa un animale"], "Senza acqua la pianta muore."),
    S("Quale animale produce il miele?", ["L'ape", "La mosca", "La formica", "Il ragno"], "Le api producono il miele."),
    S("Da dove viene la pioggia?", ["Dalle nuvole", "Dal mare", "Dalle montagne", "Dal Sole"], "L'acqua cade dalle nuvole.")
  ];

  // 3ª–5ª elementare
  const B = [
    S("In che stato è l'acqua nel vapore?", ["Gassoso", "Solido", "Liquido", "Nessuno"], "Il vapore è acqua allo stato gassoso."),
    S("A quale temperatura bolle l'acqua a livello del mare?", ["100 °C", "0 °C", "50 °C", "200 °C"], "L'acqua bolle a 100 gradi."),
    S("A quale temperatura gela l'acqua?", ["0 °C", "10 °C", "−10 °C", "100 °C"], "L'acqua diventa ghiaccio a 0 gradi."),
    S("Che cos'è la fotosintesi?", ["Le piante producono nutrimento con luce, acqua e aria", "Le piante dormono", "Le piante si riproducono", "Le piante bevono"], "Con la luce le foglie fabbricano il cibo della pianta."),
    S("Quale gas assorbono le piante per la fotosintesi?", ["Anidride carbonica", "Ossigeno", "Azoto", "Elio"], "Le piante usano l'anidride carbonica."),
    S("Quale gas producono le piante con la fotosintesi?", ["Ossigeno", "Anidride carbonica", "Metano", "Idrogeno"], "Le piante rilasciano ossigeno."),
    S("Qual è il pianeta più vicino al Sole?", ["Mercurio", "Venere", "Marte", "Giove"], "Mercurio è il più vicino al Sole."),
    S("Qual è il pianeta più grande del Sistema solare?", ["Giove", "Saturno", "La Terra", "Nettuno"], "Giove è il gigante del Sistema solare."),
    S("Quanti sono i pianeti del Sistema solare?", ["8", "9", "7", "10"], "I pianeti sono otto."),
    S("Che cos'è la Luna?", ["Il satellite naturale della Terra", "Una stella", "Un pianeta", "Una cometa"], "La Luna gira intorno alla Terra."),
    S("In quanto tempo la Terra gira intorno al Sole?", ["Un anno", "Un giorno", "Un mese", "Una settimana"], "La rivoluzione dura circa 365 giorni."),
    S("Che cosa provoca il giorno e la notte?", ["La rotazione della Terra su se stessa", "Il giro della Luna", "Le nuvole", "Il vento"], "La Terra gira su se stessa in 24 ore."),
    S("Come si chiamano gli animali che mangiano sia carne sia vegetali?", ["Onnivori", "Erbivori", "Carnivori", "Insettivori"], "Gli onnivori mangiano di tutto."),
    S("Quale di questi animali è un mammifero?", ["Il delfino", "Lo squalo", "Il pinguino", "La tartaruga"], "Il delfino allatta i cuccioli."),
    S("Come respirano i pesci?", ["Con le branchie", "Con i polmoni", "Con il naso", "Con la pelle asciutta"], "Le branchie prendono l'ossigeno dall'acqua."),
    S("Di che cosa è coperto il corpo degli uccelli?", ["Di piume", "Di peli", "Di squame", "Di spine"], "Gli uccelli hanno le piume."),
    S("Che cos'è un anfibio?", ["Un animale che vive sia in acqua sia sulla terra", "Un animale che vola", "Un animale solo marino", "Un insetto"], "La rana è un anfibio."),
    S("Quale di questi animali è un rettile?", ["Il serpente", "La rana", "Il delfino", "Il gatto"], "Il serpente è un rettile."),
    S("Quale organo ci permette di pensare?", ["Il cervello", "Il cuore", "Lo stomaco", "Il fegato"], "Il cervello controlla il corpo e i pensieri."),
    S("Quanti sono i sensi dell'uomo?", ["5", "3", "4", "7"], "Vista, udito, olfatto, gusto e tatto."),
    S("Quale organo digerisce gran parte del cibo?", ["Lo stomaco", "I polmoni", "Il cuore", "Il cervello"], "Nello stomaco il cibo viene sciolto."),
    S("Quale materiale conduce bene la corrente elettrica?", ["Il rame", "La gomma", "Il legno", "La plastica"], "I metalli, come il rame, conducono l'elettricità."),
    S("Che cosa attira una calamita?", ["Il ferro", "Il legno", "La carta", "Il vetro"], "Il ferro è attratto dalle calamite."),
    S("Come si chiama il passaggio da liquido a gas?", ["Evaporazione", "Fusione", "Solidificazione", "Condensazione"], "Con il calore l'acqua evapora."),
    S("Come si chiama il passaggio da solido a liquido?", ["Fusione", "Evaporazione", "Condensazione", "Sublimazione"], "Il ghiaccio fonde e diventa acqua."),
    S("Che cos'è una catena alimentare?", ["Chi mangia chi in un ambiente", "Una catena di ferro", "Un elenco di cibi", "Una dieta"], "Mostra chi si nutre di chi."),
    S("Quale di questi è un produttore nella catena alimentare?", ["L'erba", "Il leone", "Il lupo", "L'aquila"], "Le piante producono il proprio nutrimento."),
    S("Quale di questi è un combustibile fossile?", ["Il petrolio", "Il vento", "Il Sole", "L'acqua"], "Il petrolio si è formato in milioni di anni."),
    S("Perché si fa la raccolta differenziata?", ["Per riciclare e inquinare meno", "Per fare più rifiuti", "Per sporcare", "Per riempire le strade"], "Riciclare riduce i rifiuti e l'inquinamento.")
  ];

  // medie
  const C = [
    S("Qual è l'unità fondamentale degli esseri viventi?", ["La cellula", "L'atomo", "L'organo", "La molecola"], "Tutti gli esseri viventi sono fatti di cellule."),
    S("In quale parte della cellula si trova il DNA?", ["Nel nucleo", "Nella membrana", "Nel citoplasma", "Nei ribosomi"], "Nelle cellule eucariote il DNA sta nel nucleo."),
    S("A che cosa servono i globuli rossi?", ["A trasportare ossigeno", "A combattere i virus", "A coagulare il sangue", "A produrre ormoni"], "I globuli rossi portano ossigeno ai tessuti."),
    S("Qual è la formula chimica dell'acqua?", ["H₂O", "CO₂", "O₂", "NaCl"], "Due atomi di idrogeno e uno di ossigeno."),
    S("Qual è la formula dell'anidride carbonica?", ["CO₂", "H₂O", "O₂", "CH₄"], "Un atomo di carbonio e due di ossigeno."),
    S("Che cos'è un atomo?", ["La più piccola parte di un elemento", "Una molecola d'acqua", "Una cellula", "Una stella"], "Tutta la materia è fatta di atomi."),
    S("Quali particelle si trovano nel nucleo di un atomo?", ["Protoni e neutroni", "Solo elettroni", "Elettroni e fotoni", "Solo neutrini"], "Gli elettroni girano intorno al nucleo."),
    S("Che carica elettrica ha l'elettrone?", ["Negativa", "Positiva", "Neutra", "Variabile"], "L'elettrone ha carica negativa."),
    S("Qual è l'unità di misura della forza?", ["Il newton", "Il joule", "Il watt", "Il pascal"], "La forza si misura in newton."),
    S("Quale unità misura l'energia?", ["Il joule", "Il newton", "Il watt", "Il volt"], "L'energia si misura in joule."),
    S("Quale grandezza si misura in volt?", ["La tensione elettrica", "La forza", "La velocità", "La massa"], "Il volt misura la tensione elettrica."),
    S("A che velocità viaggia la luce nel vuoto?", ["Circa 300.000 km al secondo", "Circa 300 km al secondo", "Circa 30.000 km all'ora", "Circa 3.000 km al secondo"], "La luce è velocissima: circa 300.000 km/s."),
    S("Chi formulò la legge di gravitazione universale?", ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Charles Darwin"], "Secondo la tradizione, Newton la formulò guardando cadere una mela."),
    S("Chi propose la teoria dell'evoluzione per selezione naturale?", ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Marie Curie"], "Darwin la presentò in «L'origine delle specie»."),
    S("Chi studiò l'ereditarietà con le piante di pisello?", ["Gregor Mendel", "Charles Darwin", "Louis Pasteur", "Isaac Newton"], "Mendel scoprì le leggi dell'ereditarietà."),
    S("Qual è il gas più abbondante nell'atmosfera?", ["L'azoto", "L'ossigeno", "L'anidride carbonica", "L'argon"], "L'aria è per circa il 78% azoto."),
    S("In quale strato dell'atmosfera si trova lo strato di ozono?", ["Stratosfera", "Troposfera", "Mesosfera", "Esosfera"], "L'ozono ci protegge dai raggi ultravioletti."),
    S("Che cosa misura il pH?", ["L'acidità di una sostanza", "La temperatura", "La densità", "La durezza"], "Il pH dice se una sostanza è acida o basica."),
    S("Quale pH ha una sostanza neutra come l'acqua pura?", ["7", "0", "14", "1"], "Il pH 7 è neutro."),
    S("Che cos'è una reazione chimica?", ["Una trasformazione in cui si formano nuove sostanze", "Un cambiamento di stato", "Una miscela di liquidi", "Un movimento di atomi nel vuoto"], "Nelle reazioni le sostanze di partenza cambiano."),
    S("Chi scoprì il polonio e il radio?", ["Marie Curie", "Rosalind Franklin", "Rita Levi-Montalcini", "Ada Lovelace"], "Marie Curie vinse due premi Nobel."),
    S("Quale scienziata italiana vinse il Nobel per la medicina nel 1986?", ["Rita Levi-Montalcini", "Margherita Hack", "Marie Curie", "Maria Montessori"], "Studiò il fattore di crescita nervosa."),
    S("Qual è l'organo più grande del corpo umano?", ["La pelle", "Il fegato", "L'intestino", "Il cuore"], "La pelle copre tutto il corpo."),
    S("Quanti cromosomi ha una cellula umana?", ["46", "23", "48", "44"], "Sono 23 coppie, cioè 46."),
    S("Che cosa sono le placche tettoniche?", ["Grandi blocchi della crosta terrestre in movimento", "Strati di nuvole", "Pezzi della Luna", "Rocce vulcaniche"], "Il loro movimento provoca terremoti e vulcani."),
    S("A quale tipo di rocce appartiene il granito?", ["Magmatiche", "Sedimentarie", "Metamorfiche", "Organiche"], "Il granito nasce dal raffreddamento del magma."),
    S("Che cos'è l'effetto serra?", ["Il calore trattenuto dall'atmosfera", "La formazione dei ghiacciai", "Il vento solare", "Il ciclo dell'acqua"], "Certi gas trattengono il calore e riscaldano la Terra."),
    S("Che cos'è la densità?", ["Il rapporto tra massa e volume", "Il peso dei corpi", "La velocità", "La temperatura"], "Densità = massa : volume."),
    S("In quali organelli della cellula vegetale avviene la fotosintesi?", ["Nei cloroplasti", "Nei mitocondri", "Nel nucleo", "Nei vacuoli"], "I cloroplasti contengono la clorofilla."),
    S("Dove si produce energia nella cellula?", ["Nei mitocondri", "Nei cloroplasti", "Nel nucleo", "Nella membrana"], "I mitocondri sono le centrali energetiche."),
    S("Che energia possiede un corpo in movimento?", ["Cinetica", "Potenziale", "Termica", "Chimica"], "L'energia del movimento si chiama cinetica.")
  ];

  QBANK.scienze = { A, B, C };
})();
