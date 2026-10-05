// ===== Seconda lingua: francese, spagnolo o tedesco (si sceglie nelle Impostazioni) =====
// Un unico vocabolario [italiano, francese, spagnolo, tedesco] per categoria, da cui si
// generano le domande a risposta multipla e i temi per i giochi di collegamento.
// Le domande hanno `en` (le parole straniere nella domanda) e `ae` (risposte tutte straniere),
// così la voce legge le parole straniere con la lingua giusta (vedi Voice.setForeign).
const L2 = (() => {
  const LANGS = {
    fr: { name: "Francese", adj: "francese", wordAdj: "francese", loc: "fr-FR", flag: "🇫🇷", col: 1 },
    es: { name: "Spagnolo", adj: "spagnolo", wordAdj: "spagnola", loc: "es-ES", flag: "🇪🇸", col: 2 },
    de: { name: "Tedesco", adj: "tedesco", wordAdj: "tedesca", loc: "de-DE", flag: "🇩🇪", col: 3 }
  };
  const DEFAULT = "fr";

  // [italiano, francese, spagnolo, tedesco]
  const CATS = [
    { name: "saluti", rows: [
      ["ciao", "salut", "hola", "hallo"], ["buongiorno", "bonjour", "buenos días", "guten Morgen"],
      ["buonasera", "bonsoir", "buenas tardes", "guten Abend"], ["buonanotte", "bonne nuit", "buenas noches", "gute Nacht"],
      ["arrivederci", "au revoir", "adiós", "auf Wiedersehen"], ["grazie", "merci", "gracias", "danke"],
      ["prego", "de rien", "de nada", "bitte"], ["scusa", "pardon", "perdón", "Entschuldigung"],
      ["sì", "oui", "sí", "ja"]
    ] },
    { name: "numeri", rows: [
      ["uno", "un", "uno", "eins"], ["due", "deux", "dos", "zwei"], ["tre", "trois", "tres", "drei"],
      ["quattro", "quatre", "cuatro", "vier"], ["cinque", "cinq", "cinco", "fünf"], ["sei", "six", "seis", "sechs"],
      ["sette", "sept", "siete", "sieben"], ["otto", "huit", "ocho", "acht"], ["nove", "neuf", "nueve", "neun"],
      ["dieci", "dix", "diez", "zehn"]
    ] },
    { name: "colori", rows: [
      ["rosso", "rouge", "rojo", "rot"], ["blu", "bleu", "azul", "blau"], ["verde", "vert", "verde", "grün"],
      ["giallo", "jaune", "amarillo", "gelb"], ["nero", "noir", "negro", "schwarz"], ["bianco", "blanc", "blanco", "weiß"],
      ["arancione", "orange", "naranja", "orange"], ["grigio", "gris", "gris", "grau"], ["marrone", "marron", "marrón", "braun"]
    ] },
    { name: "famiglia", rows: [
      ["madre", "mère", "madre", "Mutter"], ["padre", "père", "padre", "Vater"], ["fratello", "frère", "hermano", "Bruder"],
      ["sorella", "sœur", "hermana", "Schwester"], ["nonno", "grand-père", "abuelo", "Großvater"],
      ["nonna", "grand-mère", "abuela", "Großmutter"], ["amico", "ami", "amigo", "Freund"], ["bambino", "enfant", "niño", "Kind"]
    ] },
    { name: "animali", rows: [
      ["cane", "chien", "perro", "Hund"], ["gatto", "chat", "gato", "Katze"], ["cavallo", "cheval", "caballo", "Pferd"],
      ["uccello", "oiseau", "pájaro", "Vogel"], ["pesce", "poisson", "pez", "Fisch"], ["mucca", "vache", "vaca", "Kuh"],
      ["maiale", "cochon", "cerdo", "Schwein"], ["coniglio", "lapin", "conejo", "Kaninchen"], ["topo", "souris", "ratón", "Maus"],
      ["leone", "lion", "león", "Löwe"], ["elefante", "éléphant", "elefante", "Elefant"]
    ] },
    { name: "cibo e bevande", rows: [
      ["pane", "pain", "pan", "Brot"], ["acqua", "eau", "agua", "Wasser"], ["latte", "lait", "leche", "Milch"],
      ["mela", "pomme", "manzana", "Apfel"], ["formaggio", "fromage", "queso", "Käse"], ["uovo", "œuf", "huevo", "Ei"],
      ["carne", "viande", "carne", "Fleisch"], ["riso", "riz", "arroz", "Reis"], ["burro", "beurre", "mantequilla", "Butter"],
      ["zucchero", "sucre", "azúcar", "Zucker"], ["patata", "pomme de terre", "patata", "Kartoffel"], ["banana", "banane", "plátano", "Banane"]
    ] },
    { name: "scuola", rows: [
      ["scuola", "école", "escuela", "Schule"], ["libro", "livre", "libro", "Buch"], ["quaderno", "cahier", "cuaderno", "Heft"],
      ["matita", "crayon", "lápiz", "Bleistift"], ["zaino", "sac à dos", "mochila", "Rucksack"],
      ["insegnante", "professeur", "profesor", "Lehrer"], ["classe", "classe", "clase", "Klasse"], ["lavagna", "tableau", "pizarra", "Tafel"]
    ] },
    { name: "casa", rows: [
      ["casa", "maison", "casa", "Haus"], ["porta", "porte", "puerta", "Tür"], ["finestra", "fenêtre", "ventana", "Fenster"],
      ["tavolo", "table", "mesa", "Tisch"], ["sedia", "chaise", "silla", "Stuhl"], ["letto", "lit", "cama", "Bett"],
      ["cucina", "cuisine", "cocina", "Küche"], ["camera", "chambre", "habitación", "Zimmer"], ["giardino", "jardin", "jardín", "Garten"]
    ] },
    { name: "città e natura", rows: [
      ["macchina", "voiture", "coche", "Auto"], ["città", "ville", "ciudad", "Stadt"], ["strada", "rue", "calle", "Straße"],
      ["sole", "soleil", "sol", "Sonne"], ["luna", "lune", "luna", "Mond"], ["mare", "mer", "mar", "Meer"],
      ["albero", "arbre", "árbol", "Baum"], ["fiore", "fleur", "flor", "Blume"], ["pioggia", "pluie", "lluvia", "Regen"],
      ["neve", "neige", "nieve", "Schnee"], ["vento", "vent", "viento", "Wind"], ["montagna", "montagne", "montaña", "Berg"]
    ] },
    { name: "corpo", rows: [
      ["testa", "tête", "cabeza", "Kopf"], ["mano", "main", "mano", "Hand"], ["occhio", "œil", "ojo", "Auge"],
      ["naso", "nez", "nariz", "Nase"], ["bocca", "bouche", "boca", "Mund"], ["piede", "pied", "pie", "Fuß"],
      ["cuore", "cœur", "corazón", "Herz"], ["orecchio", "oreille", "oreja", "Ohr"]
    ] },
    { name: "giorni della settimana", rows: [
      ["lunedì", "lundi", "lunes", "Montag"], ["martedì", "mardi", "martes", "Dienstag"], ["mercoledì", "mercredi", "miércoles", "Mittwoch"],
      ["giovedì", "jeudi", "jueves", "Donnerstag"], ["venerdì", "vendredi", "viernes", "Freitag"],
      ["sabato", "samedi", "sábado", "Samstag"], ["domenica", "dimanche", "domingo", "Sonntag"]
    ] },
    { name: "verbi", rows: [
      ["mangiare", "manger", "comer", "essen"], ["bere", "boire", "beber", "trinken"], ["parlare", "parler", "hablar", "sprechen"],
      ["andare", "aller", "ir", "gehen"], ["giocare", "jouer", "jugar", "spielen"], ["leggere", "lire", "leer", "lesen"],
      ["scrivere", "écrire", "escribir", "schreiben"], ["dormire", "dormir", "dormir", "schlafen"], ["amare", "aimer", "amar", "lieben"]
    ] },
    { name: "vestiti", rows: [
      ["maglietta", "t-shirt", "camiseta", "T-Shirt"], ["pantaloni", "pantalon", "pantalones", "Hose"], ["scarpe", "chaussures", "zapatos", "Schuhe"],
      ["cappello", "chapeau", "sombrero", "Hut"], ["giacca", "veste", "chaqueta", "Jacke"], ["gonna", "jupe", "falda", "Rock"],
      ["calzini", "chaussettes", "calcetines", "Socken"], ["sciarpa", "écharpe", "bufanda", "Schal"], ["guanti", "gants", "guantes", "Handschuhe"]
    ] },
    { name: "trasporti", rows: [
      ["treno", "train", "tren", "Zug"], ["aereo", "avion", "avión", "Flugzeug"], ["nave", "bateau", "barco", "Schiff"],
      ["bicicletta", "vélo", "bicicleta", "Fahrrad"], ["autobus", "bus", "autobús", "Bus"], ["moto", "moto", "moto", "Motorrad"],
      ["stazione", "gare", "estación", "Bahnhof"], ["biglietto", "billet", "billete", "Fahrkarte"]
    ] },
    { name: "frutta e verdura", rows: [
      ["pera", "poire", "pera", "Birne"], ["fragola", "fraise", "fresa", "Erdbeere"], ["uva", "raisin", "uva", "Traube"],
      ["limone", "citron", "limón", "Zitrone"], ["ciliegia", "cerise", "cereza", "Kirsche"], ["pomodoro", "tomate", "tomate", "Tomate"],
      ["carota", "carotte", "zanahoria", "Karotte"], ["cipolla", "oignon", "cebolla", "Zwiebel"], ["insalata", "salade", "ensalada", "Salat"]
    ] },
    { name: "mesi e stagioni", rows: [
      ["primavera", "printemps", "primavera", "Frühling"], ["estate", "été", "verano", "Sommer"], ["autunno", "automne", "otoño", "Herbst"],
      ["inverno", "hiver", "invierno", "Winter"], ["gennaio", "janvier", "enero", "Januar"], ["febbraio", "février", "febrero", "Februar"],
      ["aprile", "avril", "abril", "April"], ["maggio", "mai", "mayo", "Mai"], ["giugno", "juin", "junio", "Juni"]
    ] },
    { name: "aggettivi", rows: [
      ["felice", "heureux", "feliz", "glücklich"], ["triste", "triste", "triste", "traurig"], ["grande", "grand", "grande", "groß"],
      ["piccolo", "petit", "pequeño", "klein"], ["bello", "beau", "bonito", "schön"], ["nuovo", "nouveau", "nuevo", "neu"],
      ["vecchio", "vieux", "viejo", "alt"], ["caldo", "chaud", "caliente", "heiß"], ["freddo", "froid", "frío", "kalt"]
    ] },
    { name: "lavori e luoghi", rows: [
      ["medico", "médecin", "médico", "Arzt"], ["cuoco", "cuisinier", "cocinero", "Koch"], ["pompiere", "pompier", "bombero", "Feuerwehrmann"],
      ["panettiere", "boulanger", "panadero", "Bäcker"], ["pittore", "peintre", "pintor", "Maler"], ["ospedale", "hôpital", "hospital", "Krankenhaus"],
      ["negozio", "magasin", "tienda", "Geschäft"], ["parco", "parc", "parque", "Park"], ["biblioteca", "bibliothèque", "biblioteca", "Bibliothek"]
    ] },
    { name: "sport e tempo libero", rows: [
      ["calcio", "football", "fútbol", "Fußball"], ["palla", "ballon", "pelota", "Ball"], ["nuoto", "natation", "natación", "Schwimmen"],
      ["gioco", "jeu", "juego", "Spiel"], ["musica", "musique", "música", "Musik"], ["film", "film", "película", "Film"],
      ["canzone", "chanson", "canción", "Lied"]
    ] },
    { name: "natura", rows: [
      ["stella", "étoile", "estrella", "Stern"], ["nuvola", "nuage", "nube", "Wolke"], ["cielo", "ciel", "cielo", "Himmel"],
      ["fiume", "fleuve", "río", "Fluss"], ["lago", "lac", "lago", "See"], ["foresta", "forêt", "bosque", "Wald"],
      ["isola", "île", "isla", "Insel"], ["spiaggia", "plage", "playa", "Strand"], ["erba", "herbe", "hierba", "Gras"],
      ["terra", "terre", "tierra", "Erde"], ["fuoco", "feu", "fuego", "Feuer"], ["ghiaccio", "glace", "hielo", "Eis"]
    ] },
    { name: "in casa", rows: [
      ["divano", "canapé", "sofá", "Sofa"], ["lampada", "lampe", "lámpara", "Lampe"], ["specchio", "miroir", "espejo", "Spiegel"],
      ["armadio", "armoire", "armario", "Schrank"], ["bagno", "salle de bain", "baño", "Badezimmer"], ["telefono", "téléphone", "teléfono", "Telefon"],
      ["chiave", "clé", "llave", "Schlüssel"], ["tetto", "toit", "techo", "Dach"], ["scala", "escalier", "escalera", "Treppe"],
      ["orologio", "horloge", "reloj", "Uhr"], ["tappeto", "tapis", "alfombra", "Teppich"]
    ] },
    { name: "pasti e dolci", rows: [
      ["colazione", "petit-déjeuner", "desayuno", "Frühstück"], ["pranzo", "déjeuner", "almuerzo", "Mittagessen"], ["cena", "dîner", "cena", "Abendessen"],
      ["pasta", "pâtes", "pasta", "Nudeln"], ["zuppa", "soupe", "sopa", "Suppe"], ["gelato", "crème glacée", "helado", "Eiscreme"],
      ["torta", "gâteau", "tarta", "Kuchen"], ["biscotto", "biscuit", "galleta", "Keks"], ["succo", "jus", "zumo", "Saft"],
      ["tè", "thé", "té", "Tee"], ["cioccolato", "chocolat", "chocolate", "Schokolade"], ["pollo", "poulet", "pollo", "Hähnchen"]
    ] },
    { name: "numeri fino a venti e oltre", rows: [
      ["undici", "onze", "once", "elf"], ["dodici", "douze", "doce", "zwölf"], ["tredici", "treize", "trece", "dreizehn"],
      ["quattordici", "quatorze", "catorce", "vierzehn"], ["quindici", "quinze", "quince", "fünfzehn"], ["sedici", "seize", "dieciséis", "sechzehn"],
      ["diciassette", "dix-sept", "diecisiete", "siebzehn"], ["diciotto", "dix-huit", "dieciocho", "achtzehn"], ["diciannove", "dix-neuf", "diecinueve", "neunzehn"],
      ["venti", "vingt", "veinte", "zwanzig"], ["trenta", "trente", "treinta", "dreißig"], ["quaranta", "quarante", "cuarenta", "vierzig"],
      ["cinquanta", "cinquante", "cincuenta", "fünfzig"], ["cento", "cent", "cien", "hundert"]
    ] },
    { name: "altri verbi", rows: [
      ["cantare", "chanter", "cantar", "singen"], ["ballare", "danser", "bailar", "tanzen"], ["correre", "courir", "correr", "laufen"],
      ["saltare", "sauter", "saltar", "springen"], ["aprire", "ouvrir", "abrir", "öffnen"], ["chiudere", "fermer", "cerrar", "schließen"],
      ["vedere", "voir", "ver", "sehen"], ["comprare", "acheter", "comprar", "kaufen"], ["capire", "comprendre", "entender", "verstehen"],
      ["vivere", "vivre", "vivir", "leben"], ["abitare", "habiter", "habitar", "wohnen"]
    ] },
    { name: "altri aggettivi", rows: [
      ["veloce", "rapide", "rápido", "schnell"], ["lento", "lent", "lento", "langsam"], ["forte", "fort", "fuerte", "stark"],
      ["giovane", "jeune", "joven", "jung"], ["difficile", "difficile", "difícil", "schwierig"], ["facile", "facile", "fácil", "leicht"],
      ["buono", "bon", "bueno", "gut"], ["cattivo", "mauvais", "malo", "schlecht"], ["pulito", "propre", "limpio", "sauber"],
      ["sporco", "sale", "sucio", "schmutzig"], ["ricco", "riche", "rico", "reich"], ["povero", "pauvre", "pobre", "arm"]
    ] },
    { name: "altri animali", rows: [
      ["orso", "ours", "oso", "Bär"], ["lupo", "loup", "lobo", "Wolf"], ["volpe", "renard", "zorro", "Fuchs"],
      ["scimmia", "singe", "mono", "Affe"], ["pecora", "mouton", "oveja", "Schaf"], ["anatra", "canard", "pato", "Ente"],
      ["farfalla", "papillon", "mariposa", "Schmetterling"], ["ape", "abeille", "abeja", "Biene"], ["rana", "grenouille", "rana", "Frosch"],
      ["serpente", "serpent", "serpiente", "Schlange"], ["tartaruga", "tortue", "tortuga", "Schildkröte"], ["delfino", "dauphin", "delfín", "Delfin"]
    ] },
    { name: "altri mesi", rows: [
      ["marzo", "mars", "marzo", "März"], ["luglio", "juillet", "julio", "Juli"], ["agosto", "août", "agosto", "August"],
      ["settembre", "septembre", "septiembre", "September"], ["ottobre", "octobre", "octubre", "Oktober"],
      ["novembre", "novembre", "noviembre", "November"], ["dicembre", "décembre", "diciembre", "Dezember"]
    ] },
    { name: "in città", rows: [
      ["ponte", "pont", "puente", "Brücke"], ["piazza", "place", "plaza", "Platz"], ["chiesa", "église", "iglesia", "Kirche"],
      ["mercato", "marché", "mercado", "Markt"], ["ristorante", "restaurant", "restaurante", "Restaurant"], ["farmacia", "pharmacie", "farmacia", "Apotheke"],
      ["aeroporto", "aéroport", "aeropuerto", "Flughafen"], ["castello", "château", "castillo", "Schloss"], ["museo", "musée", "museo", "Museum"],
      ["cinema", "cinéma", "cine", "Kino"]
    ] },
    { name: "emozioni", rows: [
      ["arrabbiato", "fâché", "enfadado", "wütend"], ["contento", "content", "contento", "zufrieden"], ["spaventato", "effrayé", "asustado", "erschrocken"],
      ["stanco", "fatigué", "cansado", "müde"], ["innamorato", "amoureux", "enamorado", "verliebt"], ["calmo", "calme", "tranquilo", "ruhig"],
      ["sorpreso", "surpris", "sorprendido", "überrascht"], ["timido", "timide", "tímido", "schüchtern"], ["allegro", "joyeux", "alegre", "fröhlich"]
    ] },
    { name: "che tempo fa", rows: [
      ["temporale", "orage", "tormenta", "Gewitter"], ["nebbia", "brouillard", "niebla", "Nebel"], ["arcobaleno", "arc-en-ciel", "arcoíris", "Regenbogen"],
      ["fulmine", "éclair", "rayo", "Blitz"], ["tuono", "tonnerre", "trueno", "Donner"], ["grandine", "grêle", "granizo", "Hagel"],
      ["nuvoloso", "nuageux", "nublado", "bewölkt"], ["soleggiato", "ensoleillé", "soleado", "sonnig"]
    ] },
    { name: "parole per fare domande", rows: [
      ["chi", "qui", "quién", "wer"], ["che cosa", "quoi", "qué", "was"], ["dove", "où", "dónde", "wo"], ["quando", "quand", "cuándo", "wann"],
      ["perché", "pourquoi", "por qué", "warum"], ["come", "comment", "cómo", "wie"], ["quanto", "combien", "cuánto", "wie viel"], ["quale", "quel", "cuál", "welcher"]
    ] },
    { name: "dove si trova", rows: [
      ["sopra", "sur", "encima", "auf"], ["sotto", "sous", "debajo", "unter"], ["dentro", "dedans", "dentro", "drinnen"], ["fuori", "dehors", "fuera", "draußen"],
      ["davanti", "devant", "delante", "vor"], ["dietro", "derrière", "detrás", "hinter"], ["vicino", "près", "cerca", "nah"], ["lontano", "loin", "lejos", "fern"],
      ["destra", "droite", "derecha", "rechts"], ["sinistra", "gauche", "izquierda", "links"]
    ] },
    { name: "strumenti musicali", rows: [
      ["chitarra", "guitare", "guitarra", "Gitarre"], ["pianoforte", "piano", "piano", "Klavier"], ["violino", "violon", "violín", "Geige"],
      ["tamburo", "tambour", "tambor", "Trommel"], ["flauto", "flûte", "flauta", "Flöte"], ["tromba", "trompette", "trompeta", "Trompete"], ["arpa", "harpe", "arpa", "Harfe"]
    ] },
    { name: "materie di scuola", rows: [
      ["matematica", "mathématiques", "matemáticas", "Mathematik"], ["storia", "histoire", "historia", "Geschichte"], ["geografia", "géographie", "geografía", "Erdkunde"],
      ["scienze", "sciences", "ciencias", "Naturwissenschaften"], ["inglese", "anglais", "inglés", "Englisch"], ["arte", "art", "arte", "Kunst"],
      ["educazione fisica", "éducation physique", "educación física", "Sport"], ["compiti", "devoirs", "deberes", "Hausaufgaben"], ["ricreazione", "récréation", "recreo", "Pause"]
    ] },
    { name: "forme", rows: [
      ["cerchio", "cercle", "círculo", "Kreis"], ["quadrato", "carré", "cuadrado", "Quadrat"], ["triangolo", "triangle", "triángulo", "Dreieck"],
      ["rettangolo", "rectangle", "rectángulo", "Rechteck"], ["linea", "ligne", "línea", "Linie"], ["punto", "point", "punto", "Punkt"]
    ] },
    { name: "altri colori", rows: [
      ["rosa", "rose", "rosa", "rosa"], ["viola", "violet", "morado", "lila"], ["azzurro", "bleu clair", "celeste", "hellblau"],
      ["dorato", "doré", "dorado", "golden"], ["argentato", "argenté", "plateado", "silbern"], ["turchese", "turquoise", "turquesa", "türkis"]
    ] },
    { name: "azioni di ogni giorno", rows: [
      ["svegliarsi", "se réveiller", "despertarse", "aufwachen"], ["lavarsi", "se laver", "lavarse", "sich waschen"], ["vestirsi", "s'habiller", "vestirse", "sich anziehen"],
      ["studiare", "étudier", "estudiar", "lernen"], ["lavorare", "travailler", "trabajar", "arbeiten"], ["ascoltare", "écouter", "escuchar", "hören"],
      ["guardare", "regarder", "mirar", "schauen"], ["cucinare", "cuisiner", "cocinar", "kochen"], ["nuotare", "nager", "nadar", "schwimmen"], ["disegnare", "dessiner", "dibujar", "zeichnen"]
    ] },
    { name: "altre parti del corpo", rows: [
      ["braccio", "bras", "brazo", "Arm"], ["gamba", "jambe", "pierna", "Bein"], ["capelli", "cheveux", "cabello", "Haare"], ["dente", "dent", "diente", "Zahn"],
      ["dito", "doigt", "dedo", "Finger"], ["pancia", "ventre", "barriga", "Bauch"], ["schiena", "dos", "espalda", "Rücken"], ["collo", "cou", "cuello", "Hals"], ["ginocchio", "genou", "rodilla", "Knie"]
    ] }
  ];

  // frasi e il verbo «essere»: [italiano, francese, spagnolo, tedesco]
  const PHRASES = [
    ["Come stai?", "Comment ça va ?", "¿Cómo estás?", "Wie geht's?"],
    ["Sto bene", "Ça va bien", "Estoy bien", "Mir geht es gut"],
    ["Come ti chiami?", "Comment tu t'appelles ?", "¿Cómo te llamas?", "Wie heißt du?"],
    ["Mi chiamo Luca", "Je m'appelle Luca", "Me llamo Luca", "Ich heiße Luca"],
    ["Io sono italiano", "Je suis italien", "Soy italiano", "Ich bin Italiener"],
    ["Ho dieci anni", "J'ai dix ans", "Tengo diez años", "Ich bin zehn Jahre alt"],
    ["Buon appetito", "Bon appétit", "Buen provecho", "Guten Appetit"],
    ["A domani", "À demain", "Hasta mañana", "Bis morgen"],
    ["Non capisco", "Je ne comprends pas", "No entiendo", "Ich verstehe nicht"],
    ["Parli italiano?", "Tu parles italien ?", "¿Hablas italiano?", "Sprichst du Italienisch?"],
    ["Dov'è la scuola?", "Où est l'école ?", "¿Dónde está la escuela?", "Wo ist die Schule?"],
    ["Quanto costa?", "Combien ça coûte ?", "¿Cuánto cuesta?", "Wie viel kostet das?"],
    ["Che ora è?", "Quelle heure est-il ?", "¿Qué hora es?", "Wie spät ist es?"],
    ["Benvenuto", "Bienvenue", "Bienvenido", "Willkommen"],
    ["Buon compleanno", "Joyeux anniversaire", "Feliz cumpleaños", "Alles Gute zum Geburtstag"],
    ["Ho fame", "J'ai faim", "Tengo hambre", "Ich habe Hunger"],
    ["Ho sete", "J'ai soif", "Tengo sed", "Ich habe Durst"],
    ["Sono stanco", "Je suis fatigué", "Estoy cansado", "Ich bin müde"],
    ["Dove abiti?", "Où habites-tu ?", "¿Dónde vives?", "Wo wohnst du?"],
    ["Che cos'è?", "Qu'est-ce que c'est ?", "¿Qué es esto?", "Was ist das?"],
    ["Aiuto!", "Au secours !", "¡Socorro!", "Hilfe!"],
    ["Buon viaggio", "Bon voyage", "Buen viaje", "Gute Reise"],
    ["Che tempo fa?", "Quel temps fait-il ?", "¿Qué tiempo hace?", "Wie ist das Wetter?"],
    ["Oggi piove", "Il pleut aujourd'hui", "Hoy llueve", "Heute regnet es"],
    ["Ho un fratello", "J'ai un frère", "Tengo un hermano", "Ich habe einen Bruder"],
    ["Mi piace il gelato", "J'aime la glace", "Me gusta el helado", "Ich mag Eis"],
    ["Non mi piace", "Je n'aime pas ça", "No me gusta", "Das mag ich nicht"],
    ["Per favore", "S'il te plaît", "Por favor", "Bitte"],
    ["Ripeti, per favore", "Répète, s'il te plaît", "Repite, por favor", "Wiederhole bitte"],
    ["Quanti anni hai?", "Quel âge as-tu ?", "¿Cuántos años tienes?", "Wie alt bist du?"],
    ["Ho un cane", "J'ai un chien", "Tengo un perro", "Ich habe einen Hund"],
    ["Fa freddo", "Il fait froid", "Hace frío", "Es ist kalt"],
    ["Fa caldo", "Il fait chaud", "Hace calor", "Es ist heiß"],
    ["Andiamo!", "Allons-y !", "¡Vamos!", "Los geht's!"],
    ["Dov'è il bagno?", "Où sont les toilettes ?", "¿Dónde está el baño?", "Wo ist die Toilette?"],
    ["Posso andare in bagno?", "Je peux aller aux toilettes ?", "¿Puedo ir al baño?", "Darf ich auf die Toilette?"]
  ];
  const ESSERE = [
    ["io sono", "Je suis", "Yo soy", "Ich bin"], ["tu sei", "Tu es", "Tú eres", "Du bist"],
    ["lui è", "Il est", "Él es", "Er ist"], ["noi siamo", "Nous sommes", "Nosotros somos", "Wir sind"],
    ["voi siete", "Vous êtes", "Vosotros sois", "Ihr seid"], ["loro sono", "Ils sont", "Ellos son", "Sie sind"]
  ];

  const S = (q, a, e, extra) => Object.assign({ q, a, c: 0, e }, extra);
  const clean = w => w.replace(/[?!.,¿¡]/g, "").trim();         // per segnare le parole straniere nel testo
  const uniq = (answer, list, n) => {                            // n risposte sbagliate diverse tra loro
    const seen = new Set([answer.toLowerCase()]), out = [];
    for (const x of list) {
      const k = x.toLowerCase();
      if (!seen.has(k)) { seen.add(k); out.push(x); }
      if (out.length === n) break;
    }
    return out;
  };
  // risposte sbagliate prese dalla stessa categoria, a salti: sempre le stesse per la stessa domanda
  const others = (rows, i, col) => {
    const rot = rows.map((_, k) => rows[(i + 1 + k) % rows.length]).filter((_, k) => (i + 1 + k) % rows.length !== i);
    const stepped = rot.filter((_, k) => k % 2 === 0).concat(rot.filter((_, k) => k % 2 === 1));
    return stepped.map(r => r[col]);
  };

  // domande di una categoria per una lingua
  function questionsFor(code, rows, kind) {
    const L = LANGS[code], col = L.col, out = [];
    rows.forEach((r, i) => {
      const it = r[0], fo = r[col];
      if (it.toLowerCase() === fo.toLowerCase()) return;           // parola uguale: la domanda non avrebbe senso
      const wrongFo = uniq(fo, others(rows, i, col), 3);
      const wrongIt = uniq(it, others(rows, i, 0), 3);
      if (wrongFo.length < 3 || wrongIt.length < 3) return;
      out.push(S(`Come si dice «${it}» in ${L.adj}?`, [fo, ...wrongFo], `${fo} = ${it}.`, { ae: true }));
      const key = kind === "word" ? `Che cosa significa la parola ${L.wordAdj} «${fo}»?` : `Che cosa significa «${fo}»?`;
      out.push(S(key, [it, ...wrongIt], `${fo} = ${it}.`, { en: [clean(fo)] }));
    });
    return out;
  }

  const BANKS = {}, THEMES = {};
  Object.keys(LANGS).forEach(code => {
    let list = [];
    CATS.forEach(c => { list = list.concat(questionsFor(code, c.rows, "word")); });
    list = list.concat(questionsFor(code, PHRASES, "phrase"), questionsFor(code, ESSERE, "phrase"));
    BANKS[code] = { A: list, B: list, C: list };
    // temi per Incastro, Memory, Palloncini, Lettere mescolate e Trova l'intruso: [parola straniera, significato]
    const L = LANGS[code];
    const themes = CATS.filter(c => c.rows.length >= 5).map(c => ({
      prompt: `Collega ogni parola ${L.wordAdj} al suo significato (${c.name}).`,
      pairs: c.rows.filter(r => r[0].toLowerCase() !== r[L.col].toLowerCase()).map(r => [r[L.col], r[0]])
    }));
    THEMES[code] = { A: themes, B: themes, C: themes };
  });

  // file da mettere in ordine (numeri, giorni, mesi) per il gioco «Metti in fila»: [{p, items}] nella lingua scelta
  function seqs(code) {
    const L = LANGS[code || cur], col = L.col, out = [];
    const rowsOf = name => (CATS.find(c => c.name === name) || { rows: [] }).rows;
    const allRows = CATS.flatMap(c => c.rows);
    const pickIt = list => list.map(it => (allRows.find(r => r[0] === it) || [])[col]).filter(Boolean);
    const num = pickIt(["uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci"]);
    if (num.length === 10) out.push({ p: `Metti in fila i numeri da uno a dieci in ${L.adj}.`, items: num });
    const num2 = pickIt(["undici", "dodici", "tredici", "quattordici", "quindici", "sedici", "diciassette", "diciotto", "diciannove", "venti"]);
    if (num2.length === 10) out.push({ p: `Metti in fila i numeri da undici a venti in ${L.adj}.`, items: num2 });
    const days = rowsOf("giorni della settimana").map(r => r[col]);
    if (days.length === 7) out.push({ p: `Metti in fila i giorni della settimana in ${L.adj}, da lunedì.`, items: days });
    const months = pickIt(["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"]);
    if (months.length === 12) out.push({ p: `Metti in fila i mesi dell'anno in ${L.adj}, da gennaio.`, items: months });
    return out;
  }

  let cur = DEFAULT;
  const use = code => {
    cur = LANGS[code] ? code : DEFAULT;
    if (typeof QBANK !== "undefined") QBANK.lingua2 = BANKS[cur];
    return cur;
  };
  use(DEFAULT);

  return {
    LANGS, DEFAULT,
    codes: () => Object.keys(LANGS),
    use,
    code: () => cur,
    loc: () => LANGS[cur].loc,
    name: () => LANGS[cur].name,
    pairs: () => THEMES[cur],
    seqs: () => seqs(cur),
    banks: BANKS
  };
})();
