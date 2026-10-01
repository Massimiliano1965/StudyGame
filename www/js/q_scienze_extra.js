// ===== Scienze: altre domande (si aggiungono a quelle di q_scienze.js) =====
// Formato: { q, a: [4 risposte], c: 0 (la prima è giusta, poi vengono mescolate), e: spiegazione }
(function () {
  const S = (q, a, e) => ({ q, a, c: 0, e });
  const add = (band, list) => { QBANK.scienze[band] = QBANK.scienze[band].concat(list); };

  // 1ª–2ª elementare
  add("A", [
    S("Con quale parte del corpo sentiamo il caldo e il freddo?", ["Con la pelle", "Con gli occhi", "Con le orecchie", "Con i capelli"], "La pelle sente il tatto, il caldo e il freddo."),
    S("Quanti sono i sensi?", ["5", "3", "7", "10"], "Vista, udito, olfatto, gusto e tatto."),
    S("Quale animale è un mammifero?", ["Il cavallo", "Il pesce", "La rana", "Il serpente"], "I mammiferi allattano i cuccioli."),
    S("Quale animale ha le piume?", ["Il pappagallo", "Il gatto", "La rana", "Il pesce"], "Gli uccelli hanno le piume."),
    S("Quale animale ha le squame?", ["Il pesce", "Il gatto", "La mucca", "Il cane"], "I pesci hanno le squame."),
    S("Dove vive l'orso polare?", ["Tra i ghiacci del Polo Nord", "Nel deserto", "Nella giungla", "Sott'acqua"], "L'orso polare vive nell'Artico."),
    S("Che cosa diventa il bruco da grande?", ["Una farfalla", "Un ragno", "Un uccello", "Un pesce"], "Il bruco si trasforma in farfalla."),
    S("Quale stagione è la più calda?", ["L'estate", "L'inverno", "L'autunno", "La primavera"], "In estate fa più caldo."),
    S("Che cosa cade dal cielo quando fa molto freddo?", ["La neve", "La sabbia", "Le foglie", "I sassi"], "La neve è acqua ghiacciata."),
    S("Quale di questi è un frutto?", ["La pera", "La carota", "La patata", "La cipolla"], "La pera cresce sull'albero."),
    S("Quale organo usiamo per pensare?", ["Il cervello", "Il cuore", "Lo stomaco", "Il polmone"], "Il cervello sta nella testa."),
    S("Che cosa succede ai semi se li pianti e li annaffi?", ["Germogliano", "Si sciolgono", "Diventano sassi", "Volano via"], "Dal seme nasce una piantina."),
    S("Chi ci dà il latte?", ["La mucca", "La gallina", "L'ape", "Il pesce"], "La mucca dà il latte."),
    S("Perché di sera diventa buio?", ["Perché il Sole illumina l'altra parte della Terra", "Perché la Luna spegne il Sole", "Perché le nuvole mangiano la luce", "Perché si ferma il vento"], "La Terra gira: una parte è al buio."),
    S("Quando può comparire l'arcobaleno?", ["Quando c'è il Sole e piove", "Quando nevica", "Di notte", "Quando c'è nebbia"], "La luce del Sole si divide nelle gocce."),
    S("Di che cosa è fatto il vento?", ["Di aria in movimento", "Di acqua", "Di sabbia", "Di luce"], "Il vento è aria che si sposta."),
    S("Quale animale vive nel nido?", ["L'uccellino", "Il pesce", "La tartaruga", "Il cavallo"], "Gli uccellini nascono nel nido.")
  ]);

  // 3ª–5ª elementare
  add("B", [
    S("Che cos'è la fotosintesi clorofilliana?", ["Il processo con cui le piante producono il loro cibo con la luce", "Il processo con cui gli animali digeriscono", "Il ciclo dell'acqua", "La nascita dei semi"], "Le piante usano luce, acqua e anidride carbonica."),
    S("Quale gas assorbono le piante dall'aria?", ["Anidride carbonica", "Azoto", "Elio", "Idrogeno"], "Le piante «respirano» CO₂ per la fotosintesi."),
    S("Quanti pianeti ha il Sistema solare?", ["8", "9", "7", "10"], "Sono otto, da Mercurio a Nettuno."),
    S("Quale pianeta è famoso per i suoi anelli?", ["Saturno", "Marte", "Mercurio", "Venere"], "Gli anelli di Saturno sono molto visibili."),
    S("Quanto dura un giro completo della Terra intorno al Sole?", ["Un anno", "Un giorno", "Un mese", "Una settimana"], "La rivoluzione dura un anno."),
    S("Che cosa causa il giorno e la notte?", ["La rotazione della Terra su sé stessa", "La rivoluzione intorno al Sole", "Le fasi della Luna", "Le nuvole"], "La Terra ruota in 24 ore."),
    S("Come appare la Luna piena?", ["Tutto il disco illuminato", "Una piccola falce", "Invisibile", "Metà illuminata"], "A Luna piena vediamo tutta la faccia illuminata."),
    S("Che cosa sono i vertebrati?", ["Animali con la colonna vertebrale", "Animali senza ossa", "Animali con sei zampe", "Animali che volano"], "Pesci, anfibi, rettili, uccelli e mammiferi."),
    S("Quale animale è un invertebrato?", ["La medusa", "Il cane", "La rana", "Il serpente"], "La medusa non ha scheletro interno."),
    S("A che cosa servono i petali del fiore?", ["Ad attirare gli insetti", "A bere l'acqua", "A sostenere la pianta", "A produrre le radici"], "Colori e profumo attirano gli impollinatori."),
    S("Che cos'è l'habitat?", ["L'ambiente in cui vive un essere vivente", "Il cibo di un animale", "Il nido", "Il cucciolo"], "Ogni specie ha il suo habitat."),
    S("Che cos'è la catena alimentare?", ["La successione di chi mangia chi tra gli esseri viventi", "Un elenco di cibi", "Una catena di ferro", "Un piatto di carne"], "Dall'erba alla lepre alla volpe."),
    S("Chi sono i produttori in una catena alimentare?", ["Le piante", "I leoni", "I funghi", "Gli uccelli"], "Le piante producono il loro cibo."),
    S("Che cosa fanno i decompositori?", ["Trasformano i resti in humus", "Cacciano le prede", "Producono ossigeno", "Fanno le uova"], "Funghi e batteri decompongono."),
    S("Che cos'è un miscuglio?", ["Più sostanze mescolate che si possono separare", "Una sola sostanza", "Un gas", "Una pianta"], "Sabbia e acqua formano un miscuglio."),
    S("Come si può separare la sabbia dall'acqua?", ["Filtrando", "Congelando", "Bruciando", "Scuotendo"], "Il filtro trattiene la sabbia."),
    S("Che cosa succede all'acqua a 0 °C?", ["Diventa ghiaccio", "Bolle", "Diventa gas", "Si colora"], "A 0 °C l'acqua gela."),
    S("Qual è la principale fonte di energia della Terra?", ["Il Sole", "La Luna", "Il vento", "Il petrolio"], "Il Sole dà luce e calore."),
    S("Quale organo filtra il sangue e produce l'urina?", ["I reni", "Il fegato", "Il cuore", "I polmoni"], "I reni puliscono il sangue."),
    S("Dove avviene la digestione?", ["Nello stomaco e nell'intestino", "Nel cervello", "Nei polmoni", "Nel cuore"], "Il cibo viene scomposto nel tubo digerente.")
  ]);

  // medie
  add("C", [
    S("Qual è l'unità di misura dell'energia?", ["Il joule", "Il newton", "Il watt", "Il kelvin"], "L'energia si misura in joule (J)."),
    S("Qual è la formula della velocità?", ["Spazio : tempo", "Tempo : spazio", "Spazio × tempo", "Massa : volume"], "Velocità = spazio diviso tempo."),
    S("Qual è la formula del sale da cucina?", ["NaCl", "H₂O", "CO₂", "HCl"], "Cloruro di sodio."),
    S("Da quali elementi è formata l'anidride carbonica (CO₂)?", ["Carbonio e ossigeno", "Carbonio e idrogeno", "Azoto e ossigeno", "Calcio e ossigeno"], "CO₂ = 1 carbonio + 2 ossigeno."),
    S("Che cos'è il DNA?", ["La molecola che contiene le informazioni genetiche", "Una proteina del sangue", "Un ormone", "Una vitamina"], "Il DNA è il «libro» dell'ereditarietà."),
    S("Che cos'è un ecosistema?", ["L'insieme di esseri viventi e ambiente in cui vivono", "Un tipo di pianta", "Un animale raro", "Una roccia"], "Comprende organismi e ambiente fisico."),
    S("Chi scoprì la penicillina?", ["Alexander Fleming", "Louis Pasteur", "Marie Curie", "Charles Darwin"], "Fleming la scoprì nel 1928."),
    S("Chi propose il modello eliocentrico (Sole al centro)?", ["Niccolò Copernico", "Tolomeo", "Aristotele", "Newton"], "Copernico mise il Sole al centro."),
    S("Che cos'è un anno luce?", ["La distanza percorsa dalla luce in un anno", "Un anno di Sole", "Una velocità", "365 giorni"], "È una misura di distanza, non di tempo."),
    S("Quale principio dice che a ogni azione corrisponde una reazione uguale e contraria?", ["Il terzo principio della dinamica", "Il primo principio", "Il secondo principio", "La legge di Ohm"], "È il principio di azione e reazione."),
    S("Che cos'è l'inerzia?", ["La tendenza di un corpo a mantenere il proprio stato di moto", "La forza di gravità", "Un tipo di energia", "Un attrito"], "Un corpo fermo resta fermo, uno in moto continua."),
    S("Che cos'è l'attrito?", ["La forza che si oppone allo scorrimento tra due superfici", "Una forza che spinge in alto", "Una sorgente di energia", "Un tipo di velocità"], "Rallenta i corpi in movimento."),
    S("Che cos'è la mitosi?", ["La divisione di una cellula in due cellule identiche", "La nascita di un fiore", "La digestione", "Il battito del cuore"], "Serve a crescere e a rinnovare i tessuti."),
    S("Che cosa sono gli enzimi?", ["Proteine che accelerano le reazioni chimiche", "Vitamine", "Zuccheri", "Grassi"], "Gli enzimi facilitano la digestione e molte altre reazioni."),
    S("Quale vitamina produce la pelle con l'esposizione al Sole?", ["La vitamina D", "La vitamina C", "La vitamina A", "La vitamina B12"], "La vitamina D aiuta le ossa."),
    S("Che cos'è un acido?", ["Una sostanza con pH minore di 7", "Una sostanza con pH uguale a 7", "Una sostanza con pH maggiore di 7", "Un tipo di sale"], "Limone e aceto sono acidi."),
    S("A quanti kelvin bolle l'acqua a livello del mare?", ["373 K", "100 K", "273 K", "473 K"], "100 °C = 373 K."),
    S("Che cos'è un terremoto?", ["Una vibrazione della crosta terrestre", "Un'eruzione di lava", "Un'onda del mare", "Un forte vento"], "Nasce dal movimento delle placche."),
    S("Quale strato della Terra è il più esterno?", ["La crosta", "Il mantello", "Il nucleo", "L'astenosfera"], "La crosta è la «buccia» della Terra."),
    S("Quale organo è il centro del sistema nervoso?", ["Il cervello", "Il cuore", "Il fegato", "Il rene"], "Cervello e midollo spinale formano il sistema nervoso centrale."),
    S("Quale gruppo sanguigno è il donatore universale?", ["0 negativo", "AB positivo", "A positivo", "B negativo"], "Può donare a tutti i gruppi."),
    S("Che cosa sono i mammiferi?", ["Animali che allattano i piccoli", "Animali che depongono uova", "Animali senza ossa", "Animali con sei zampe"], "Allattano i cuccioli con il latte materno.")
  ]);
})();
