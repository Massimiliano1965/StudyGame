// ===== Geografia: altre domande (si aggiungono a quelle di q_geografia.js) =====
// Formato: la risposta giusta è sempre la prima, poi vengono mescolate.
(function () {
  const S = (q, a, e) => ({ q, a, c: 0, e });

  const A = [
    S("Quale di questi è un mare?", ["Il Mediterraneo", "Il Po", "Le Alpi", "Il Garda"], "Il Mediterraneo è il mare che bagna l'Italia."),
    S("Quanti sono i punti cardinali?", ["4", "2", "6", "8"], "Nord, sud, est e ovest."),
    S("Da quale parte tramonta il sole?", ["A ovest", "A est", "A nord", "A sud"], "Il sole tramonta a ovest."),
    S("Dove vivono i cammelli?", ["Nel deserto", "Al Polo Nord", "Nel mare", "Sulle Alpi"], "I cammelli resistono al caldo e alla sete del deserto."),
    S("In quale continente si trova l'Italia?", ["Europa", "Africa", "Asia", "America"], "L'Italia è in Europa."),
    S("Che cos'è un vulcano?", ["Una montagna da cui può uscire la lava", "Un lago", "Una pianura", "Una spiaggia"], "Dal vulcano può uscire la lava."),
    S("Che cos'è la sorgente di un fiume?", ["Il punto dove nasce", "Il punto dove finisce", "Un ponte", "Una cascata"], "La sorgente è dove l'acqua comincia a scorrere."),
    S("Un fiume di solito finisce nel…", ["Mare", "Deserto", "Vulcano", "Ghiacciaio"], "I fiumi sfociano nel mare o in un lago."),
    S("Di che colori è la bandiera italiana?", ["Verde, bianco e rosso", "Blu, bianco e rosso", "Giallo e nero", "Verde e giallo"], "Il tricolore italiano è verde, bianco e rosso."),
    S("In quale città si trova la Torre pendente?", ["Pisa", "Bologna", "Torino", "Bari"], "La Torre di Pisa pende da secoli."),
    S("Quale di questi animali vive nella savana?", ["Il leone", "Il pinguino", "L'orso polare", "La foca"], "Il leone vive nella savana africana."),
    S("Quale strumento indica il nord?", ["La bussola", "Il metro", "L'orologio", "Il termometro"], "L'ago della bussola punta verso nord."),
    S("Che cosa c'è al Polo Nord?", ["Ghiaccio", "Un deserto di sabbia", "Una foresta tropicale", "Una savana"], "Al Polo Nord c'è il mare ghiacciato."),
    S("Com'è il clima in montagna d'inverno?", ["Freddo, con la neve", "Caldissimo", "Sempre secco", "Senza vento"], "In alta quota fa freddo e nevica.")
  ];

  const B = [
    S("Qual è il capoluogo della Liguria?", ["Genova", "Savona", "La Spezia", "Imperia"], "Genova è il capoluogo ligure."),
    S("Qual è il capoluogo dell'Emilia-Romagna?", ["Bologna", "Modena", "Parma", "Ravenna"], "Il capoluogo è Bologna."),
    S("Qual è il capoluogo della Puglia?", ["Bari", "Lecce", "Taranto", "Foggia"], "Il capoluogo pugliese è Bari."),
    S("Qual è il capoluogo del Lazio?", ["Roma", "Latina", "Viterbo", "Frosinone"], "Roma è anche capoluogo del Lazio."),
    S("Qual è il capoluogo del Friuli-Venezia Giulia?", ["Trieste", "Udine", "Gorizia", "Pordenone"], "Il capoluogo è Trieste."),
    S("Qual è il capoluogo delle Marche?", ["Ancona", "Pesaro", "Macerata", "Ascoli Piceno"], "Il capoluogo delle Marche è Ancona."),
    S("Qual è il capoluogo dell'Umbria?", ["Perugia", "Terni", "Assisi", "Orvieto"], "Il capoluogo dell'Umbria è Perugia."),
    S("Qual è il capoluogo della Calabria?", ["Catanzaro", "Reggio Calabria", "Cosenza", "Crotone"], "Il capoluogo calabrese è Catanzaro."),
    S("Qual è la capitale del Regno Unito?", ["Londra", "Edimburgo", "Dublino", "Manchester"], "Londra è sul fiume Tamigi."),
    S("Qual è la capitale del Portogallo?", ["Lisbona", "Porto", "Madrid", "Siviglia"], "Lisbona è la capitale portoghese."),
    S("Qual è la capitale della Grecia?", ["Atene", "Salonicco", "Sparta", "Creta"], "Atene è la capitale della Grecia."),
    S("Qual è la capitale dell'Austria?", ["Vienna", "Salisburgo", "Berna", "Praga"], "Vienna è la capitale austriaca."),
    S("Quale fiume attraversa Roma?", ["Il Tevere", "L'Arno", "Il Po", "L'Adige"], "Il Tevere scorre nel centro di Roma."),
    S("Quale fiume attraversa Firenze?", ["L'Arno", "Il Tevere", "Il Po", "Il Ticino"], "L'Arno passa sotto Ponte Vecchio."),
    S("Come si chiama la grande pianura del Nord Italia?", ["Pianura Padana", "Tavoliere", "Maremma", "Campidano"], "La Pianura Padana è attraversata dal Po."),
    S("Quale città è chiamata «la città eterna»?", ["Roma", "Firenze", "Venezia", "Napoli"], "Roma è detta la città eterna."),
    S("Quale catena montuosa si trova in America del Sud?", ["Le Ande", "Le Alpi", "Gli Urali", "Gli Appennini"], "Le Ande attraversano il Sud America."),
    S("Qual è l'animale simbolo dell'Australia?", ["Il canguro", "Il leone", "La tigre", "L'orso"], "Il canguro vive in Australia."),
    S("Com'è il clima del deserto?", ["Molto secco, caldo di giorno", "Piovoso e freddo", "Sempre nevoso", "Umido e fresco"], "Nel deserto piove pochissimo."),
    S("Che cos'è una penisola?", ["Terra circondata dal mare su tre lati", "Terra circondata dal mare su tutti i lati", "Acqua circondata dalla terra", "Un fiume con molte foci"], "L'Italia è una penisola."),
    S("Che cos'è un arcipelago?", ["Un gruppo di isole vicine", "Una montagna", "Un lago salato", "Un deserto"], "Esempio: l'arcipelago delle Eolie."),
    S("Che cos'è la foce di un fiume?", ["Il punto in cui il fiume sfocia", "Il punto in cui nasce", "Un ponte", "Un affluente"], "La foce è dove il fiume entra nel mare.")
  ];

  const C = [
    S("Qual è la capitale dell'Argentina?", ["Buenos Aires", "Santiago", "Lima", "Montevideo"], "Buenos Aires è la capitale argentina."),
    S("Qual è la capitale della Cina?", ["Pechino", "Shanghai", "Hong Kong", "Canton"], "Pechino è la capitale cinese."),
    S("Qual è la capitale dell'India?", ["Nuova Delhi", "Mumbai", "Calcutta", "Bangalore"], "La capitale è Nuova Delhi."),
    S("Qual è la capitale della Russia?", ["Mosca", "San Pietroburgo", "Kiev", "Minsk"], "Mosca è la capitale russa."),
    S("Qual è la capitale del Messico?", ["Città del Messico", "Cancún", "Guadalajara", "Acapulco"], "La capitale è Città del Messico."),
    S("Qual è la capitale della Norvegia?", ["Oslo", "Stoccolma", "Helsinki", "Copenaghen"], "Oslo è la capitale norvegese."),
    S("Qual è la capitale della Svezia?", ["Stoccolma", "Oslo", "Helsinki", "Copenaghen"], "Stoccolma è la capitale svedese."),
    S("Qual è la capitale del Belgio?", ["Bruxelles", "Anversa", "Amsterdam", "Lussemburgo"], "Bruxelles è la capitale belga."),
    S("Qual è la capitale dei Paesi Bassi?", ["Amsterdam", "Rotterdam", "L'Aia", "Bruxelles"], "Amsterdam è la capitale olandese."),
    S("Qual è la capitale degli Stati Uniti?", ["Washington D.C.", "New York", "Los Angeles", "Chicago"], "La capitale federale è Washington."),
    S("Qual è la capitale del Marocco?", ["Rabat", "Casablanca", "Marrakech", "Tunisi"], "Rabat è la capitale marocchina."),
    S("Qual è la capitale della Corea del Sud?", ["Seul", "Pusan", "Pyongyang", "Tokyo"], "Seul è la capitale sudcoreana."),
    S("Qual è il più grande deserto caldo del mondo?", ["Il Sahara", "Il Gobi", "Il Kalahari", "L'Atacama"], "Il Sahara copre gran parte dell'Africa del nord."),
    S("Qual è l'oceano più piccolo?", ["L'Artico", "L'Indiano", "L'Atlantico", "Il Pacifico"], "L'oceano Artico è il più piccolo."),
    S("Quale continente è quasi tutto coperto di ghiaccio?", ["L'Antartide", "L'Oceania", "L'Europa", "L'Africa"], "L'Antartide è il continente del Polo Sud."),
    S("Quale fiume attraversa Parigi?", ["La Senna", "Il Reno", "Il Danubio", "La Loira"], "La Senna scorre nel centro di Parigi."),
    S("Quale fiume attraversa Londra?", ["Il Tamigi", "La Senna", "L'Elba", "Il Tevere"], "Il Tamigi attraversa Londra."),
    S("Qual è il capoluogo dell'Abruzzo?", ["L'Aquila", "Pescara", "Chieti", "Teramo"], "Il capoluogo abruzzese è L'Aquila."),
    S("Che cos'è l'Unione europea?", ["Un'unione di Stati europei che cooperano", "Un solo grande Stato", "Un continente", "Un oceano"], "I Paesi membri condividono regole e decisioni."),
    S("Qual è l'isola più grande del mondo?", ["La Groenlandia", "Il Madagascar", "L'Islanda", "Cuba"], "La Groenlandia è la più grande isola."),
    S("Qual è lo stato più esteso dell'Africa?", ["L'Algeria", "Il Sudan", "La Libia", "L'Egitto"], "L'Algeria è oggi il più grande stato africano."),
    S("Che differenza c'è tra tempo atmosferico e clima?", ["Il clima è l'andamento medio del tempo su molti anni", "Sono la stessa cosa", "Il clima dura un solo giorno", "Il tempo vale per tutta la vita"], "Il tempo cambia ogni giorno, il clima dura anni.")
  ];

  const add = (band, list) => { QBANK.geografia[band] = QBANK.geografia[band].concat(list); };
  add("A", A); add("B", B); add("C", C);
})();
