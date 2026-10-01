// ===== Altre domande: storia (fasce A e B) e tecnologia (fasce A e B) =====
// La risposta giusta è sempre la prima (poi vengono mescolate).
(function () {
  const S = (q, a, e) => ({ q, a, c: 0, e });
  const key = q => q.q + "|" + q.a[0];
  const add = (subject, band, list) => {   // salta le domande già presenti
    const have = new Set(QBANK[subject][band].map(key));
    QBANK[subject][band] = QBANK[subject][band].concat(list.filter(q => !have.has(key(q)) && have.add(key(q))));
  };

  // ===================== STORIA, fascia A (1ª-2ª elementare) =====================
  add("storia", "A", [
    S("Il giorno prima di oggi si chiama…", ["Ieri", "Domani", "Dopodomani", "Stasera"], "Ieri è il giorno passato."),
    S("Il giorno dopo oggi si chiama…", ["Domani", "Ieri", "L'altro ieri", "Oggi"], "Domani è il giorno che viene."),
    S("Quale giorno viene dopo il sabato?", ["Domenica", "Venerdì", "Lunedì", "Giovedì"], "Sabato, domenica, lunedì…"),
    S("Quale mese viene prima di giugno?", ["Maggio", "Luglio", "Aprile", "Agosto"], "Maggio viene prima di giugno."),
    S("Quale mese è il più corto dell'anno?", ["Febbraio", "Gennaio", "Marzo", "Dicembre"], "Febbraio ha 28 giorni (29 negli anni bisestili)."),
    S("Quale stagione viene prima dell'estate?", ["La primavera", "L'autunno", "L'inverno", "Nessuna"], "Inverno, primavera, estate, autunno."),
    S("In quale giorno dell'anno si festeggia il Natale?", ["Il 25 dicembre", "Il 1° gennaio", "Il 2 giugno", "Il 14 febbraio"], "Il Natale è il 25 dicembre."),
    S("Quale strumento ci dice che giorno è?", ["Il calendario", "Il righello", "La bilancia", "Il termometro"], "Il calendario segna giorni e mesi."),
    S("Chi sono i genitori di tua mamma?", ["I tuoi nonni", "I tuoi cugini", "I tuoi zii", "I tuoi vicini"], "I genitori dei genitori sono i nonni."),
    S("Che cos'è una vecchia fotografia?", ["Un ricordo del passato", "Una cosa del futuro", "Un gioco", "Un cibo"], "Le foto ci raccontano com'era la vita una volta."),
    S("Quali animali cacciavano gli uomini primitivi?", ["Mammut e cervi", "Delfini addestrati", "Elefanti da circo", "Dinosauri"], "I dinosauri erano già estinti."),
    S("Con che cosa si vestivano gli uomini primitivi?", ["Con pelli di animali", "Con jeans", "Con tute da ginnastica", "Con giacche a vento"], "Usavano le pelli degli animali cacciati."),
    S("Che cosa vuol dire «preistoria»?", ["Il tempo prima che si scrivesse", "Il tempo di oggi", "Il tempo dei castelli", "Il tempo del futuro"], "La preistoria viene prima della scrittura."),
    S("Qual è il grande fiume dell'antico Egitto?", ["Il Nilo", "Il Po", "Il Tevere", "L'Arno"], "Gli Egizi vivevano lungo il Nilo."),
    S("Che cosa mettevano gli Egizi dentro le piramidi?", ["Il corpo del faraone e i suoi tesori", "I giocattoli dei bambini", "I libri di scuola", "Le automobili"], "Le piramidi erano tombe."),
    S("Con che cosa combattevano i gladiatori?", ["Con spade e scudi", "Con fucili", "Con pistole ad acqua", "Con missili"], "Combattevano nell'arena."),
    S("Che cosa difendeva un castello dai nemici?", ["Le alte mura e il fossato", "Un giardino fiorito", "Una porta di carta", "Una finestra aperta"], "Mura e fossato proteggevano il castello."),
    S("Che cosa usavano i Romani per scrivere?", ["Tavolette di cera e penne di canna", "Tastiere", "Telefonini", "Penne a sfera"], "Scrivevano anche su papiro.")
  ]);

  // ===================== STORIA, fascia B (3ª-5ª elementare) =====================
  add("storia", "B", [
    S("Quanti anni dura un secolo?", ["100", "10", "1000", "50"], "Un secolo = 100 anni."),
    S("Che cosa significa «a.C.»?", ["Avanti Cristo, cioè prima della nascita di Gesù", "Dopo Cristo", "Antica Civiltà", "Anno Corrente"], "Gli anni a.C. si contano all'indietro."),
    S("Chi erano i Fenici?", ["Navigatori e mercanti, inventori di un alfabeto", "Guerrieri a cavallo", "Re egizi", "Filosofi greci"], "Il loro alfabeto diede origine a quello greco."),
    S("Dove nacque la democrazia?", ["Ad Atene", "A Roma", "A Sparta", "In Egitto"], "Ad Atene i cittadini votavano nell'assemblea."),
    S("Che cos'era il Senato nell'antica Roma?", ["Un'assemblea di cittadini autorevoli che guidava la città", "Un teatro", "Un esercito", "Un mercato"], "Il Senato consigliava e governava Roma."),
    S("Chi erano i consoli della Repubblica romana?", ["Due magistrati eletti ogni anno", "Due re", "Due gladiatori", "Due schiavi"], "Governavano per un anno."),
    S("Chi fu Costantino?", ["Un imperatore che concesse libertà ai cristiani", "Un faraone", "Un re longobardo", "Un generale cartaginese"], "Nel 313 l'Editto di Milano."),
    S("Dove nacquero le prime città?", ["In Mesopotamia", "In Groenlandia", "In Australia", "In Alaska"], "Tra i fiumi Tigri ed Eufrate."),
    S("Che cos'era un legionario?", ["Un soldato dell'esercito romano", "Un contadino", "Un sacerdote egizio", "Un mercante greco"], "La legione era l'unità dell'esercito."),
    S("Che cos'erano i patrizi nell'antica Roma?", ["I nobili", "Gli schiavi", "I soldati", "I mercanti stranieri"], "I plebei erano il popolo."),
    S("Che cos'era l'acropoli di una città greca?", ["La parte alta e fortificata con i templi", "Il porto", "Il mercato", "La campagna"], "L'Acropoli di Atene ospita il Partenone."),
    S("Chi era Poseidone per i Greci?", ["Il dio del mare", "Il dio della guerra", "La dea della caccia", "Il dio del sole"], "Era il dio del mare."),
    S("Chi fu Cleopatra?", ["L'ultima regina dell'antico Egitto", "Una dea greca", "Una imperatrice romana", "Una poetessa"], "Governò l'Egitto prima della conquista romana."),
    S("Come si chiama l'uomo moderno, cioè la nostra specie?", ["Homo sapiens", "Homo erectus", "Neanderthal", "Australopiteco"], "«Homo sapiens» significa uomo che sa."),
    S("Che cos'è la Via Appia?", ["Una famosa strada dell'antica Roma", "Un fiume", "Un acquedotto", "Un tempio"], "Collegava Roma al Sud Italia."),
    S("Che cos'è un anfiteatro romano?", ["Un edificio per spettacoli, come il Colosseo", "Una tomba", "Un tempio", "Una scuola"], "Vi si svolgevano giochi e combattimenti."),
    S("Quali strumenti servivano ai Romani per costruire archi e ponti?", ["Mattoni e malta o cemento romano", "Plastica", "Acciaio moderno", "Vetro"], "Furono grandi ingegneri."),
    S("Chi sono gli storici che studiano la preistoria scavando?", ["Gli archeologi", "I pittori", "I cuochi", "I geometri"], "Gli archeologi studiano i resti del passato.")
  ]);

  // ===================== TECNOLOGIA, fascia A =====================
  add("tecnologia", "A", [
    S("Quale oggetto serve per vedere meglio le cose molto piccole?", ["La lente d'ingrandimento", "Lo specchio", "Il righello", "La forbice"], "La lente ingrandisce."),
    S("Quale mezzo ha quattro ruote e va sulla strada?", ["L'automobile", "Il treno", "La nave", "L'aereo"], "L'automobile ha quattro ruote."),
    S("Che cosa si usa per attraversare un fiume senza bagnarsi?", ["Un ponte", "Una scala", "Una nuvola", "Un tavolo"], "Il ponte collega le due rive."),
    S("Dove si buttano gli avanzi di cibo?", ["Nel bidone dell'umido", "Nel bidone della carta", "Nel bidone della plastica", "Nella campana del vetro"], "L'umido diventa concime."),
    S("Dove si butta una bottiglia di vetro?", ["Nella campana del vetro", "Nel bidone dell'umido", "Nel bidone della carta", "Per terra"], "Il vetro si ricicla."),
    S("Quale oggetto serve per scrivere a mano?", ["La penna", "La forchetta", "Il bicchiere", "La scopa"], "Penne e matite servono per scrivere."),
    S("Quale elettrodomestico lava i piatti?", ["La lavastoviglie", "La lavatrice", "Il forno", "Il frigorifero"], "La lavastoviglie lava le stoviglie."),
    S("Quale elettrodomestico scalda il cibo in pochi minuti?", ["Il forno a microonde", "Il frigorifero", "Il phon", "Il ventilatore"], "Il microonde scalda in fretta."),
    S("Quale macchina taglia l'erba del prato?", ["Il tosaerba", "L'aspirapolvere", "Il trapano", "La lavatrice"], "Il tosaerba taglia l'erba."),
    S("Con che cosa si va sulla Luna?", ["Con un razzo", "Con una bicicletta", "Con un treno", "Con una barca"], "I razzi portano gli astronauti nello spazio."),
    S("Quale mezzo spegne gli incendi?", ["Il camion dei pompieri", "Il taxi", "Il trattore", "L'autobus"], "I pompieri usano l'acqua."),
    S("Quale oggetto ci ripara dalla pioggia?", ["L'ombrello", "Il cappello di lana", "La sciarpa", "Gli occhiali"], "L'ombrello ripara dall'acqua."),
    S("Quale strumento serve per colorare un disegno?", ["I pastelli", "Le forbici", "Il martello", "Il pettine"], "I pastelli e i pennarelli colorano."),
    S("Quale macchina porta i bambini a scuola e ha molti posti?", ["Lo scuolabus", "La moto", "Il monopattino", "Il camion"], "Lo scuolabus ha tanti posti."),
    S("Quale oggetto serve per scoprire che ora è?", ["L'orologio", "Il righello", "La bussola", "Il termometro"], "L'orologio segna le ore."),
    S("Quale mezzo si usa per spostarsi sulla neve?", ["La slitta", "Il treno", "La nave", "La moto d'acqua"], "La slitta scivola sulla neve.")
  ]);

  // ===================== TECNOLOGIA, fascia B =====================
  add("tecnologia", "B", [
    S("A che cosa serve una carrucola?", ["A sollevare pesi tirando una corda", "A tagliare il legno", "A misurare il tempo", "A scaldare l'acqua"], "Una carrucola cambia la direzione della forza."),
    S("A che cosa servono le ruote?", ["A spostare più facilmente le cose", "A fermare i veicoli", "A scaldare", "A fare luce"], "Le ruote riducono l'attrito."),
    S("Che cos'è un circuito aperto?", ["Un circuito dove la corrente non può passare", "Un circuito con la batteria nuova", "Un circuito che funziona sempre", "Una presa elettrica"], "Per accendere la lampadina il circuito deve essere chiuso."),
    S("Quale materiale conduce bene il calore?", ["Il metallo", "Il legno", "La gomma", "La lana"], "Per questo le pentole sono di metallo."),
    S("Che cos'è un virus informatico?", ["Un programma dannoso che disturba il computer", "Un'influenza del computer", "Un tasto speciale", "Un gioco"], "Va evitato non aprendo file strani."),
    S("A che cosa serve un antivirus?", ["A proteggere il computer dai programmi dannosi", "A scrivere meglio", "A stampare", "A velocizzare internet"], "Un antivirus controlla i file."),
    S("Che cos'è un motore di ricerca?", ["Un sito che aiuta a trovare informazioni sul web", "Un motore di automobile", "Un programma per disegnare", "Un gioco di parole"], "Per esempio Google."),
    S("Che cosa vuol dire «scaricare» (download) un file?", ["Copiarlo da Internet sul proprio dispositivo", "Cancellarlo", "Stamparlo", "Spegnerlo"], "Download = scaricare."),
    S("Che cos'è il Wi-Fi?", ["Una rete senza fili per collegarsi a Internet", "Un tipo di cavo", "Un computer", "Una batteria"], "Wi-Fi collega i dispositivi senza cavi."),
    S("Che cosa NON bisogna mai fare online?", ["Dare i propri dati personali a sconosciuti", "Cercare informazioni", "Guardare un video educativo", "Scrivere a un parente"], "Nome, indirizzo e password vanno protetti."),
    S("Che cos'è il cyberbullismo?", ["Prendere in giro o minacciare qualcuno con telefono o Internet", "Un gioco online", "Un tipo di computer", "Un'app di musica"], "Va segnalato a un adulto."),
    S("Chi è considerato l'inventore della radio?", ["Guglielmo Marconi", "Galileo Galilei", "Leonardo da Vinci", "Alessandro Volta"], "Marconi ricevette il Nobel per la fisica nel 1909."),
    S("Chi inventò la pila elettrica?", ["Alessandro Volta", "Guglielmo Marconi", "Galileo Galilei", "Leonardo da Vinci"], "Volta presentò la pila nel 1800."),
    S("Quale invenzione di Gutenberg permise di stampare molti libri?", ["La stampa a caratteri mobili", "La penna d'oca", "Il telegrafo", "La macchina da scrivere"], "Verso il 1450."),
    S("Che cos'è un motore?", ["Una macchina che trasforma energia in movimento", "Un tipo di ruota", "Un cavo", "Una luce"], "Si trova in auto, treni e frullatori."),
    S("Quale oggetto trasforma l'energia elettrica in luce?", ["La lampadina", "Il frullatore", "Il ventilatore", "Il forno"], "Una lampadina illumina."),
    S("Quale oggetto trasforma l'energia elettrica in movimento?", ["Il ventilatore", "La lampadina", "Il televisore spento", "Il termosifone"], "Il motore elettrico fa girare le pale."),
    S("A che cosa serve un fusibile?", ["A proteggere l'impianto elettrico dai sovraccarichi", "A fare luce", "A scaldare il cibo", "A suonare"], "Se c'è troppa corrente, interrompe il circuito.")
  ]);
})();
