// ===== Italiano: ancora altre domande (si aggiungono ai banchi esistenti) =====
// Formato: { q, a: [4 risposte], c: 0 (la prima è giusta, poi vengono mescolate), e: spiegazione }
(function () {
  const S = (q, a, e) => ({ q, a, c: 0, e });
  const add = (band, list) => { QBANK.italiano[band] = QBANK.italiano[band].concat(list); };

  // 1ª–2ª elementare
  add("A", [
    S("Quale parola ha la doppia?", ["Palla", "Pane", "Sole", "Mare"], "In «palla» c'è la doppia L."),
    S("Quante sono le lettere dell'alfabeto italiano?", ["21", "26", "19", "30"], "L'alfabeto italiano ha 21 lettere."),
    S("Qual è il plurale di «cane»?", ["Cani", "Cane", "Canii", "Canni"], "Un cane, due cani."),
    S("Come si scrive il numero 3 in lettere?", ["Tre", "Tree", "Trè", "Trre"], "Si scrive TRE, senza accento."),
    S("Quale parola è il nome di una città?", ["Roma", "Rosa", "Rosso", "Ramo"], "Roma è una città."),
    S("Quale frase finisce con il punto esclamativo?", ["Evviva, ho vinto!", "Come stai?", "Oggi piove.", "Vado a scuola."], "L'esclamazione finisce con il punto esclamativo."),
    S("Completa: «___ mamma è in cucina.»", ["La", "Lo", "Il", "Un"], "Si dice «la mamma»."),
    S("Qual è il contrario di «sopra»?", ["Sotto", "Dentro", "Fuori", "Dietro"], "Il contrario di sopra è sotto."),
    S("Con quale lettera comincia la parola «scuola»?", ["S", "C", "Q", "Z"], "Scuola comincia con la S."),
    S("Quale parola dice come è una cosa?", ["Piccola", "Correre", "Quaderno", "Luca"], "«Piccola» dice com'è una cosa."),
    S("Completa: «Io ___ contento.»", ["sono", "siamo", "è", "sei"], "Io sono contento."),
    S("Quale parola fa rima con «gatto»?", ["Matto", "Mano", "Pollo", "Nero"], "Gatto e matto finiscono con -atto."),
    S("Qual è il contrario di «salire»?", ["Scendere", "Correre", "Andare", "Dormire"], "Il contrario di salire è scendere."),
    S("Quale parola indica una persona?", ["Maestra", "Matita", "Mela", "Mare"], "La maestra è una persona."),
    S("Quale parola comincia con la sillaba «PA»?", ["Pane", "Sole", "Luna", "Mare"], "PA-ne comincia con PA.")
  ]);

  // 3ª–5ª elementare
  add("B", [
    S("Qual è il verbo in «I bambini giocano nel parco»?", ["Giocano", "Bambini", "Parco", "Nel"], "Il verbo dice l'azione: giocano."),
    S("Qual è il plurale di «amico»?", ["Amici", "Amichi", "Amiche", "Amicci"], "Un amico, due amici."),
    S("Qual è il femminile di «attore»?", ["Attrice", "Attora", "Attoressa", "Attrica"], "Attore → attrice."),
    S("Completa: «Nel frigo ___ il latte.»", ["c'è", "ce", "cé", "c'e"], "C'è = ci è, con l'apostrofo e l'accento."),
    S("Quale frase è scritta correttamente?", ["Ho un'amica simpatica.", "Ho un amica simpatica.", "Ho un'amico simpatico.", "Ho una'amica simpatica."], "Davanti a nome femminile si scrive un'amica, con l'apostrofo."),
    S("Che cos'è un sinonimo?", ["Una parola con lo stesso significato", "Una parola con significato opposto", "Una parola che suona uguale", "Una parola straniera"], "Bello e grazioso sono sinonimi."),
    S("Qual è l'ausiliare in «Io ho mangiato»?", ["Avere", "Essere", "Fare", "Stare"], "«Ho» è il verbo avere."),
    S("Quale tempo verbale è «mangerò»?", ["Futuro", "Passato", "Presente", "Imperfetto"], "Mangerò indica una cosa che accadrà."),
    S("Quale tempo verbale è «giocavo»?", ["Imperfetto", "Futuro", "Presente", "Passato remoto"], "Giocavo è un'azione abituale del passato."),
    S("Quale segno si usa prima di un elenco?", ["I due punti", "Il punto", "Il punto interrogativo", "Le virgolette"], "Dopo i due punti si elencano le cose."),
    S("Quante sillabe ha «cavallo»?", ["3", "2", "4", "1"], "Ca-val-lo: tre sillabe."),
    S("Quale parola è un avverbio?", ["Velocemente", "Veloce", "Velocità", "Velocista"], "Gli avverbi dicono come avviene l'azione."),
    S("Che cosa significa «gigantesco»?", ["Molto grande", "Molto piccolo", "Molto veloce", "Molto vecchio"], "Gigantesco = enorme."),
    S("Quale parola contiene un dittongo?", ["Piede", "Casa", "Sole", "Mano"], "In «piede» c'è il dittongo IE."),
    S("Quale parola è un verbo all'infinito?", ["Dormire", "Dormo", "Dormito", "Dorme"], "L'infinito finisce in -are, -ere, -ire."),
    S("Qual è il plurale di «bosco»?", ["Boschi", "Bosci", "Bosche", "Boscoi"], "Bosco → boschi."),
    S("Che cosa indica il punto interrogativo?", ["Una domanda", "Una pausa lunga", "Un elenco", "Un'esclamazione"], "Si mette alla fine delle domande.")
  ]);

  // medie
  add("C", [
    S("In «Marco legge un libro», qual è il complemento oggetto?", ["Un libro", "Marco", "Legge", "Marco legge"], "Risponde alla domanda «che cosa?»."),
    S("Quale parola è una congiunzione?", ["Perché", "Veloce", "Tavolo", "Correre"], "Le congiunzioni collegano parole o frasi."),
    S("Qual è il congiuntivo presente di «essere» (che io…)?", ["Sia", "Sono", "Fossi", "Ero"], "Che io sia."),
    S("Completa: «Se avessi tempo, ___ al cinema.»", ["andrei", "andavo", "andrò", "vado"], "Il periodo ipotetico vuole il condizionale."),
    S("Che cos'è un'antitesi?", ["L'accostamento di due idee opposte", "Un paragone con «come»", "La ripetizione di una parola", "Un'esagerazione"], "Es. «Amore e odio»."),
    S("Che cos'è l'anafora?", ["La ripetizione di una parola all'inizio di versi o frasi", "Un paragone", "Un'esagerazione", "Un contrasto"], "È una figura retorica di ripetizione."),
    S("Chi scrisse «Il Principe»?", ["Niccolò Machiavelli", "Dante Alighieri", "Alessandro Manzoni", "Francesco Petrarca"], "Machiavelli scrisse Il Principe nel 1513."),
    S("Chi scrisse «Se questo è un uomo»?", ["Primo Levi", "Italo Calvino", "Cesare Pavese", "Giuseppe Ungaretti"], "Primo Levi racconta la sua prigionia nel lager."),
    S("Chi scrisse «Il fu Mattia Pascal»?", ["Luigi Pirandello", "Italo Svevo", "Giovanni Verga", "Alessandro Manzoni"], "È un romanzo di Pirandello."),
    S("Chi scrisse «La coscienza di Zeno»?", ["Italo Svevo", "Luigi Pirandello", "Giovanni Verga", "Alberto Moravia"], "Svevo è triestino."),
    S("Che cos'è il soggetto di una frase?", ["Chi o che cosa compie l'azione", "La parola che indica il luogo", "Il tempo del verbo", "L'aggettivo"], "Il soggetto fa l'azione espressa dal verbo."),
    S("Che cos'è il predicato verbale?", ["Il verbo che dice che cosa fa il soggetto", "Il nome della persona", "Un complemento di luogo", "Un aggettivo"], "Es. «Luca corre»: corre è il predicato."),
    S("Quale frase contiene un complemento di luogo?", ["Vado a Roma.", "Mangio una mela.", "Leggo con attenzione.", "Parlo con Anna."], "«A Roma» dice dove."),
    S("Che cos'è la parafrasi?", ["Riscrivere un testo poetico con parole più semplici", "Riassumere un romanzo", "Tradurre in inglese", "Commentare criticamente"], "Si spiega il testo in prosa."),
    S("Che cos'è un riassunto?", ["Una versione breve che conserva le informazioni principali", "Una copia del testo", "Un commento personale", "Un elenco di domande"], "Il riassunto è breve e fedele."),
    S("Qual è il participio passato di «chiudere»?", ["Chiuso", "Chiusato", "Chiudito", "Chiudo"], "Ho chiuso la porta."),
    S("Qual è il passato remoto di «andare» (io)?", ["Andai", "Andavo", "Andrò", "Sono andato"], "Io andai."),
    S("Che cos'è un aggettivo qualificativo?", ["Una parola che dice com'è un nome", "Una parola che indica l'azione", "Una parola che sostituisce il nome", "Una parola che collega frasi"], "Es. «una casa grande»."),
    S("Quale parola è una preposizione?", ["Con", "Veloce", "Dopo che", "Mai"], "Le preposizioni (di, a, da, in, con, su, per, tra, fra) introducono i complementi."),
    S("Che cos'è la metafora?", ["Un paragone senza «come»: «sei un leone»", "Una ripetizione", "Un suono imitato", "Un'esagerazione"], "La metafora identifica due cose."),
    S("Quale genere letterario racconta in versi le imprese di eroi?", ["Il poema epico", "Il diario", "La fiaba", "Il giallo"], "L'Iliade è un poema epico.")
  ]);
})();
