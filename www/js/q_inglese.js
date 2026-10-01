// ===== Banco domande di INGLESE (circa 300) =====
// Stesso formato di questions.js: { q, a: [4 risposte], c: 0, e, en?, ae? }
//  - en: parole inglesi che la voce legge con accento inglese
//  - ae: tutte le risposte sono in inglese
// Il vocabolario è generato da liste di coppie [inglese, italiano]: ogni parola dà
// due domande (che cosa significa / come si dice), con risposte sbagliate dello stesso tema.
(function () {
  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  function shuffled(a) {
    const x = a.slice();
    for (let i = x.length - 1; i > 0; i--) { const j = rnd(0, i); [x[i], x[j]] = [x[j], x[i]]; }
    return x;
  }
  // 3 parole diverse dalla giusta, dello stesso tema
  const others = (list, w) => shuffled(list.filter(x => x[0] !== w[0] && x[1] !== w[1])).slice(0, 3);

  function vocab(list) {
    const out = [];
    list.forEach(w => {
      const [en, it] = w, o = others(list, w);
      out.push({ q: `Che cosa significa «${en}»?`, a: [it, ...o.map(x => x[1])], c: 0, e: `${cap(en)} vuol dire ${it}.`, en: [en] });
      out.push({ q: `Come si dice «${it}» in inglese?`, a: [en, ...o.map(x => x[0])], c: 0, e: `${cap(it)} in inglese si dice ${en}.`, ae: true, en: [en] });
    });
    return out;
  }
  // G: risposte tutte in inglese; M: risposte in italiano
  const G = (q, a, e, en) => ({ q, a, c: 0, e, ae: true, en });
  const M = (q, a, e, en) => ({ q, a, c: 0, e, en });

  // ---------------- 1ª–2ª elementare ----------------
  const A_WORDS = [
    // colori
    ["red", "rosso"], ["blue", "blu"], ["green", "verde"], ["yellow", "giallo"], ["black", "nero"], ["white", "bianco"], ["pink", "rosa"], ["orange", "arancione"],
    // animali
    ["dog", "cane"], ["cat", "gatto"], ["bird", "uccello"], ["fish", "pesce"], ["horse", "cavallo"], ["cow", "mucca"], ["rabbit", "coniglio"], ["duck", "anatra"], ["pig", "maiale"], ["sheep", "pecora"],
    // numeri
    ["one", "uno"], ["two", "due"], ["three", "tre"], ["four", "quattro"], ["five", "cinque"], ["six", "sei"], ["seven", "sette"], ["eight", "otto"], ["nine", "nove"], ["ten", "dieci"],
    // famiglia
    ["mother", "madre"], ["father", "padre"], ["brother", "fratello"], ["sister", "sorella"], ["grandmother", "nonna"], ["grandfather", "nonno"],
    // cibo
    ["bread", "pane"], ["milk", "latte"], ["water", "acqua"], ["cheese", "formaggio"], ["egg", "uovo"], ["pizza", "pizza"],
    // corpo
    ["head", "testa"], ["hand", "mano"], ["foot", "piede"], ["eye", "occhio"], ["nose", "naso"], ["mouth", "bocca"]
  ].filter(w => w[0] !== w[1]);   // «pizza» è uguale in italiano: niente domanda

  // le liste sopra sono ordinate per tema: i distrattori vengono dal tema giusto
  const themed = (list, sizes) => { let i = 0; const out = []; sizes.forEach(n => { out.push(...vocab(list.slice(i, i + n))); i += n; }); return out; };

  const A = [
    ...themed(A_WORDS, [8, 10, 10, 6, 5, 6]),
    M("Che cosa significa «apple»?", ["Mela", "Pera", "Banana", "Arancia"], "Apple vuol dire mela.", ["apple"]),
    M("Che cosa significa «book»?", ["Libro", "Penna", "Zaino", "Banco"], "Book vuol dire libro.", ["book"]),
    G("Come si dice «ciao» in inglese?", ["Hello", "Goodbye", "Thanks", "Please"], "Per salutare si dice hello.", ["hello"]),
    G("Come si dice «Buongiorno» in inglese?", ["Good morning", "Good night", "Good evening", "Goodbye"], "Buongiorno si dice good morning.", ["Good morning"]),
    G("Come si dice «Buonanotte» in inglese?", ["Good night", "Good morning", "Good afternoon", "Hello"], "Buonanotte si dice good night.", ["Good night"]),
    G("Come si dice «Arrivederci» in inglese?", ["Goodbye", "Hello", "Please", "Sorry"], "Arrivederci si dice goodbye.", ["Goodbye"]),
    G("Come si dice «Grazie» in inglese?", ["Thank you", "Please", "Sorry", "Hello"], "Grazie si dice thank you.", ["Thank you"]),
    G("Come si dice «Per favore» in inglese?", ["Please", "Sorry", "Thank you", "Goodbye"], "Per favore si dice please.", ["Please"]),
    G("Come si dice «Scusa» in inglese?", ["Sorry", "Please", "Hello", "Yes"], "Scusa si dice sorry.", ["Sorry"]),
    G("Come si dice «Sì» in inglese?", ["Yes", "No", "Hello", "Please"], "Sì si dice yes.", ["Yes"]),
    G("Come si dice «No» in inglese?", ["No", "Yes", "Sorry", "Hello"], "No si dice no.", ["No"]),
    M("Che cosa significa «How are you?»", ["Come stai?", "Come ti chiami?", "Quanti anni hai?", "Dove abiti?"], "How are you? vuol dire come stai?", ["How are you"]),
    M("Che cosa significa «I am fine»?", ["Sto bene", "Ho fame", "Ho sonno", "Sono stanco"], "I am fine vuol dire sto bene.", ["I am fine"]),
    G("Qual è il colore del cielo sereno? «The sky is ___.»", ["blue", "red", "black", "pink"], "Il cielo sereno è blu: blue.", ["The sky is ___", "blue"]),
    G("Qual è il colore delle foglie? «Leaves are ___.»", ["green", "blue", "white", "black"], "Le foglie sono verdi: green.", ["Leaves are ___", "green"]),
    G("Qual è il colore del sole? «The sun is ___.»", ["yellow", "green", "blue", "black"], "Il sole è giallo: yellow.", ["The sun is ___", "yellow"]),
    M("Quale animale dice «meow»?", ["Il gatto", "Il cane", "La mucca", "Il cavallo"], "Il gatto fa meow, cioè miao!", ["meow"]),
    M("Quale animale dice «woof»?", ["Il cane", "Il gatto", "L'anatra", "La pecora"], "Il cane fa woof, cioè bau!", ["woof"]),
    G("Quanto fa «one plus one»?", ["two", "three", "one", "four"], "One plus one fa two: 1 + 1 = 2.", ["one plus one", "two"]),
    G("Quanto fa «two plus two»?", ["four", "three", "five", "six"], "Two plus two fa four: 2 + 2 = 4.", ["two plus two", "four"])
  ];

  // ---------------- 3ª–5ª elementare ----------------
  const B_WORDS = [
    // scuola
    ["pencil", "matita"], ["desk", "banco"], ["teacher", "insegnante"], ["bag", "zaino"], ["window", "finestra"], ["door", "porta"], ["chair", "sedia"], ["pen", "penna"], ["ruler", "righello"],
    // casa
    ["kitchen", "cucina"], ["bedroom", "camera da letto"], ["bathroom", "bagno"], ["garden", "giardino"], ["table", "tavolo"], ["bed", "letto"],
    // vestiti
    ["shirt", "camicia"], ["shoes", "scarpe"], ["hat", "cappello"], ["jacket", "giacca"], ["socks", "calzini"], ["dress", "vestito"],
    // tempo atmosferico
    ["sun", "sole"], ["rain", "pioggia"], ["snow", "neve"], ["wind", "vento"], ["cloud", "nuvola"], ["hot", "caldo"], ["cold", "freddo"],
    // verbi
    ["to eat", "mangiare"], ["to drink", "bere"], ["to sleep", "dormire"], ["to run", "correre"], ["to read", "leggere"], ["to write", "scrivere"],
    // dove sono le cose
    ["under", "sotto"], ["behind", "dietro"], ["next to", "accanto a"], ["between", "tra"], ["in front of", "davanti a"]
  ];

  const B = [
    ...themed(B_WORDS, [9, 6, 6, 7, 6, 5]),
    G("Completa: «I ___ a student.»", ["am", "is", "are", "be"], "Con «I» si usa «am»: I am.", ["I ___ a student", "I am", "I", "am"]),
    M("Che cosa significa «Thank you»?", ["Grazie", "Prego", "Scusa", "Ciao"], "Thank you vuol dire grazie.", ["Thank you"]),
    G("Come si dice «Come ti chiami?» in inglese?", ["What's your name?", "How old are you?", "Where are you from?", "How are you?"], "Per chiedere il nome si dice «What's your name?».", ["What's your name"]),
    G("Completa: «She ___ a cat.»", ["has", "have", "haves", "having"], "Con «she» (lei) si usa «has».", ["She ___ a cat", "she", "has"]),
    G("Quale parola è un giorno della settimana?", ["Monday", "Winter", "Green", "Apple"], "Monday è lunedì.", ["Monday"]),
    G("Completa: «They ___ my friends.»", ["are", "is", "am", "be"], "Con «they» (loro) si usa «are».", ["They ___ my friends", "They are", "are"]),
    G("Completa: «He ___ a brother.»", ["has", "have", "haves", "having"], "Con «he» (lui) si usa «has».", ["He ___ a brother", "has"]),
    G("Completa: «We ___ football on Saturday.»", ["play", "plays", "playing", "played"], "Con «we» (noi) il verbo non cambia: play.", ["We ___ football on Saturday", "play"]),
    G("Completa: «___ is your name?»", ["What", "Where", "Who", "When"], "Per chiedere il nome si dice «What is your name?».", ["is your name", "What"]),
    G("Completa: «___ are you from?»", ["Where", "What", "Who", "How old"], "«Where» vuol dire dove: Where are you from?", ["are you from", "Where"]),
    G("Completa: «How ___ are you?» (per chiedere l'età)", ["old", "years", "age", "long"], "Per chiedere l'età si dice «How old are you?».", ["How ___ are you", "How old are you", "old"]),
    G("Completa: «This is ___ apple.»", ["an", "a", "any", "many"], "Davanti a una vocale si usa «an»: an apple.", ["This is ___ apple", "an apple", "an"]),
    G("Completa: «This is ___ book.»", ["a", "an", "any", "some"], "Davanti a una consonante si usa «a»: a book.", ["This is ___ book", "a book"]),
    G("Completa: «There ___ two cats in the garden.»", ["are", "is", "am", "be"], "Con un plurale (due gatti) si usa «are».", ["There ___ two cats in the garden", "There are", "are"]),
    G("Che giorno viene dopo «Monday»?", ["Tuesday", "Wednesday", "Sunday", "Friday"], "Dopo Monday (lunedì) c'è Tuesday (martedì).", ["Monday", "Tuesday"]),
    G("Che mese viene dopo «March»?", ["April", "May", "June", "February"], "Dopo March (marzo) c'è April (aprile).", ["March", "April"]),
    G("Quale parola è un mese dell'anno?", ["January", "Monday", "Summer", "Morning"], "January è gennaio.", ["January"]),
    M("Che cosa significa «She can swim»?", ["Lei sa nuotare", "Lei vuole nuotare", "Lei nuota ogni giorno", "Lei ha nuotato"], "«Can» vuol dire sapere o potere: she can swim, lei sa nuotare.", ["She can swim"]),
    G("Completa: «I ___ like pizza.» (non mi piace)", ["don't", "doesn't", "isn't", "not"], "Con «I» la forma negativa è «don't».", ["I ___ like pizza", "don't"]),
    G("Completa: «She ___ like milk.» (non le piace)", ["doesn't", "don't", "isn't", "not"], "Con «she» la forma negativa è «doesn't».", ["She ___ like milk", "doesn't"]),
    G("Completa: «My mother ___ in a hospital.»", ["works", "work", "working", "worked"], "Con «my mother» (lei) il verbo prende la -s: works.", ["My mother ___ in a hospital", "works"]),
    G("Qual è il plurale di «box»?", ["boxes", "boxs", "boxen", "boxies"], "Le parole che finiscono in -x fanno il plurale con -es: boxes.", ["box", "boxes"]),
    G("Qual è il plurale di «man»?", ["men", "mans", "manes", "mens"], "Man ha un plurale irregolare: men.", ["man", "men"]),
    G("Come si dice «Che ore sono?» in inglese?", ["What time is it?", "What day is it?", "How old are you?", "Where are you?"], "Per chiedere l'ora si dice «What time is it?».", ["What time is it"]),
    G("Come si dice «Mi piace il gelato» in inglese?", ["I like ice cream.", "I am ice cream.", "I have ice cream.", "I want ice."], "«I like» vuol dire mi piace: I like ice cream.", ["I like ice cream"]),
    G("Qual è il contrario di «big»?", ["small", "tall", "fast", "old"], "Il contrario di big (grande) è small (piccolo).", ["big", "small"]),
    G("Qual è il contrario di «hot»?", ["cold", "dry", "fast", "dark"], "Il contrario di hot (caldo) è cold (freddo).", ["hot", "cold"]),
    G("Completa: «This is my sister. ___ name is Anna.»", ["Her", "His", "Their", "Our"], "Per una femmina si usa «her»: her name.", ["This is my sister", "name is Anna", "Her"]),
    G("Completa: «Tom has a dog. ___ dog is black.»", ["His", "Her", "Their", "Its"], "Per un maschio si usa «his»: his dog.", ["Tom has a dog", "dog is black", "His"]),
    G("Completa: «Look at ___ boys!» (quei ragazzi, lontani)", ["those", "that", "this", "a"], "Per più cose lontane si usa «those»: those boys.", ["Look at ___ boys", "those"]),
    M("Che cosa significa «How many?»", ["Quanti?", "Quanto costa?", "Come stai?", "Chi è?"], "How many? vuol dire quanti?", ["How many"]),
    M("Che cosa significa «How much is it?»", ["Quanto costa?", "Quanti anni hai?", "Che ore sono?", "Dov'è?"], "How much is it? vuol dire quanto costa?", ["How much is it"]),
    M("Che numero è «fifteen»?", ["15", "50", "14", "16"], "Fifteen è 15.", ["fifteen"]),
    M("Che numero è «twenty»?", ["20", "12", "22", "2"], "Twenty è 20.", ["twenty"]),
    G("Come si scrive 30 in inglese?", ["thirty", "thirteen", "thirsty", "three"], "30 si scrive thirty.", ["thirty"]),
    G("Come si scrive 12 in inglese?", ["twelve", "twenty", "eleven", "ten"], "12 si scrive twelve.", ["twelve"])
  ];

  // ---------------- medie ----------------
  const C_WORDS = [
    ["however", "tuttavia"], ["because", "perché"], ["always", "sempre"], ["never", "mai"], ["together", "insieme"],
    ["during", "durante"], ["enough", "abbastanza"], ["borrow", "prendere in prestito"], ["lend", "prestare"],
    ["arrive", "arrivare"], ["forget", "dimenticare"], ["remember", "ricordare"], ["improve", "migliorare"]
  ];

  const C = [
    ...vocab(C_WORDS),
    G("Completa: «Yesterday I ___ to school.»", ["went", "go", "goes", "going"], "«Yesterday» indica il passato: il passato di go è went.", ["Yesterday I ___ to school", "Yesterday", "go", "went"]),
    G("Qual è il plurale di «child»?", ["children", "childs", "childes", "childrens"], "Child ha un plurale irregolare: children.", ["child", "children"]),
    G("Completa: «He ___ football every Sunday.»", ["plays", "play", "playing", "played"], "Con he/she/it, al presente, il verbo prende la -s: plays.", ["He ___ football every Sunday", "he/she/it", "plays"]),
    G("Quale frase è corretta?", ["There are three books on the table.", "There is three books on the table.", "There am three books on the table.", "There be three books on the table."], "Con un plurale si usa «there are».", ["there are"]),
    M("Che cosa significa «although»?", ["Anche se", "Perché", "Quando", "Dopo"], "Although vuol dire «anche se».", ["although"]),
    G("Completa: «If it rains, we ___ at home.»", ["will stay", "stayed", "staying", "stays"], "Dopo «if» + presente si usa will + verbo: will stay.", ["If it rains, we ___ at home", "if", "will stay", "will"]),
    // passato semplice
    G("Completa: «Last week we ___ a film.»", ["watched", "watch", "watching", "watches"], "«Last week» indica il passato: watched.", ["Last week we ___ a film", "Last week", "watched"]),
    G("Completa: «She ___ her keys yesterday.»", ["lost", "lose", "loses", "losing"], "Il passato di lose è lost.", ["She ___ her keys yesterday", "lose", "lost"]),
    G("Completa: «They ___ to London in 2019.»", ["went", "go", "gone", "going"], "Con una data nel passato si usa il passato semplice: went.", ["They ___ to London in 2019", "went"]),
    G("Completa: «I ___ breakfast at seven this morning.»", ["had", "have", "has", "having"], "Il passato di have è had.", ["I ___ breakfast at seven this morning", "had"]),
    G("Completa: «What time ___ you get up yesterday?»", ["did", "do", "does", "are"], "Nelle domande al passato si usa «did».", ["What time ___ you get up yesterday", "did"]),
    G("Completa: «He didn't ___ his homework.»", ["do", "did", "does", "done"], "Dopo «didn't» il verbo torna alla forma base: do.", ["He didn't ___ his homework", "didn't", "do"]),
    G("Qual è il passato di «buy»?", ["bought", "buyed", "boughten", "buys"], "Buy è irregolare: bought.", ["buy", "bought"]),
    G("Qual è il passato di «see»?", ["saw", "seen", "seed", "sees"], "See è irregolare: saw.", ["see", "saw"]),
    G("Qual è il passato di «write»?", ["wrote", "written", "writed", "writes"], "Write è irregolare: wrote.", ["write", "wrote"]),
    G("Qual è il passato di «take»?", ["took", "taken", "taked", "takes"], "Take è irregolare: took.", ["take", "took"]),
    G("Qual è il passato di «swim»?", ["swam", "swum", "swimmed", "swims"], "Swim è irregolare: swam.", ["swim", "swam"]),
    G("Qual è il passato di «drink»?", ["drank", "drunk", "drinked", "drinks"], "Drink è irregolare: drank.", ["drink", "drank"]),
    // present perfect
    G("Completa: «I have ___ my homework.»", ["finished", "finish", "finishing", "finishes"], "Dopo «have» serve il participio passato: finished.", ["I have ___ my homework", "have", "finished"]),
    G("Completa: «She has never ___ sushi.»", ["eaten", "ate", "eat", "eating"], "Dopo «has» serve il participio passato di eat: eaten.", ["She has never ___ sushi", "has", "eaten"]),
    G("Completa: «We have lived here ___ 2015.»", ["since", "for", "from", "during"], "Con una data di partenza si usa «since».", ["We have lived here ___ 2015", "since"]),
    G("Completa: «They have lived here ___ ten years.»", ["for", "since", "from", "ago"], "Con una durata si usa «for».", ["They have lived here ___ ten years", "for"]),
    G("Completa: «Have you ___ been to Rome?»", ["ever", "never", "yet", "already"], "Nelle domande sull'esperienza si usa «ever»: have you ever…?", ["Have you ___ been to Rome", "ever"]),
    // confronti
    G("Completa: «My brother is ___ than me.»", ["taller", "tall", "tallest", "more tall"], "Con gli aggettivi corti il comparativo si fa con -er: taller.", ["My brother is ___ than me", "taller"]),
    G("Completa: «This is the ___ film I have ever seen.»", ["best", "better", "good", "most good"], "Il superlativo di good è best.", ["This is the ___ film I have ever seen", "best"]),
    G("Completa: «Gold is ___ than silver.»", ["more expensive", "expensiver", "most expensive", "expensive"], "Con gli aggettivi lunghi si usa «more»: more expensive.", ["Gold is ___ than silver", "more expensive"]),
    G("Qual è il superlativo di «big»?", ["biggest", "bigger", "most big", "more big"], "Big raddoppia la g: bigger, biggest.", ["big", "biggest"]),
    G("Qual è il comparativo di «good»?", ["better", "gooder", "best", "more good"], "Good è irregolare: better, best.", ["good", "better"]),
    G("Completa: «She runs ___ than me.»", ["faster", "fast", "fastest", "more fast"], "Fast è corto: faster.", ["She runs ___ than me", "faster"]),
    // verbi modali e dintorni
    G("Completa: «You ___ do your homework.» (è un consiglio)", ["should", "shoulds", "shoulding", "to should"], "«Should» dà un consiglio e non cambia mai.", ["You ___ do your homework", "should"]),
    G("Completa: «I ___ swim when I was five.»", ["could", "can", "may", "must"], "Il passato di can è could.", ["I ___ swim when I was five", "could"]),
    G("Completa: «You ___ park here: it's forbidden.»", ["mustn't", "must", "can", "should"], "«Mustn't» vuol dire che è vietato.", ["You ___ park here", "mustn't"]),
    G("Quale frase è corretta? (forma negativa)", ["He doesn't like carrots.", "He don't like carrots.", "He not like carrots.", "He doesn't likes carrots."], "Con he si usa «doesn't» e il verbo resta alla forma base.", ["doesn't like"]),
    G("Quale frase è corretta? (quanti)", ["How many apples are there?", "How much apples are there?", "How many apple is there?", "How much apple are there?"], "Con le cose che si contano si usa «how many» e il plurale.", ["How many apples are there"]),
    G("Completa: «There isn't ___ milk in the fridge.»", ["any", "some", "many", "a"], "Nelle frasi negative si usa «any».", ["There isn't ___ milk in the fridge", "any"]),
    G("Completa: «I'd like ___ water, please.»", ["some", "any", "many", "a"], "Nelle richieste cortesi si usa «some».", ["I'd like ___ water, please", "some"]),
    G("Completa: «She is ___ her homework now.»", ["doing", "does", "do", "did"], "«Now» vuole il presente continuo: is doing.", ["She is ___ her homework now", "is doing", "doing"]),
    G("Completa: «Look! It ___.»", ["is raining", "rains", "rained", "rain"], "«Look!» indica qualcosa che succede ora: is raining.", ["Look", "It ___", "is raining"]),
    G("Completa: «Tomorrow I ___ visit my grandma.»", ["am going to", "went to", "was going", "go to"], "Per un programma si usa «am going to» + verbo.", ["Tomorrow I ___ visit my grandma", "am going to"]),
    G("Completa: «If I ___ rich, I would buy a boat.»", ["were", "am", "will be", "are"], "Nel periodo ipotetico irreale si usa «were».", ["If I ___ rich, I would buy a boat", "were"]),
    G("Completa: «If you heat ice, it ___.»", ["melts", "melting", "melt", "to melt"], "Per una verità sempre vera si usa il presente: it melts.", ["If you heat ice, it ___", "melts"]),
    G("Completa: «The book ___ written by Tolkien.»", ["was", "were", "did", "has"], "Nel passivo al passato si usa «was» + participio.", ["The book ___ written by Tolkien", "was"]),
    G("Completa: «English ___ spoken all over the world.»", ["is", "are", "does", "has"], "Nel passivo al presente si usa «is» + participio.", ["English ___ spoken all over the world", "is"]),
    G("Completa: «The girl ___ lives next door is my friend.»", ["who", "which", "whose", "where"], "Per le persone si usa «who».", ["The girl ___ lives next door is my friend", "who"]),
    G("Completa: «This is the house ___ I was born.»", ["where", "who", "which", "whose"], "Per un luogo si usa «where».", ["This is the house ___ I was born", "where"]),
    M("In «I used to play tennis», che cosa significa «used to»?", ["Una volta giocavo (ora non più)", "Gioco ogni giorno", "Giocherò domani", "Ho appena giocato"], "«Used to» indica un'abitudine del passato che ora non c'è più.", ["I used to play tennis", "used to"]),
    G("Quale frase è al futuro?", ["I will call you tomorrow.", "I called you yesterday.", "I am calling you now.", "I have called you."], "«Will» + verbo indica il futuro.", ["I will call you tomorrow"]),
    G("Quale parola è un avverbio di frequenza?", ["usually", "quickly", "yesterday", "beautiful"], "«Usually» (di solito) dice ogni quanto si fa qualcosa.", ["usually"])
  ];

  QBANK.inglese = { A, B, C };
})();
