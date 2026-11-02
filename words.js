// WORT-ABENTEUER – Wortlisten. Eintrag: [Wort, Kategorie, Beispielsatz]
// Neue Wörter einfach als weitere Zeile eintragen (Rechtschreibung genau prüfen!).
const RAW = [
  { id: 1, name: "Tierwelt", icon: "🦊", req: 0, words: [
    ["Hund","Haustier","Der Hund bellt laut."],["Katze","Haustier","Die Katze schläft auf dem Sofa."],
    ["Maus","Kleintier","Die Maus mag Käse."],["Bär","Wildtier","Der Bär brummt im Wald."],
    ["Wolf","Wildtier","Der Wolf heult in der Nacht."],["Fuchs","Wildtier","Der Fuchs ist schlau."],
    ["Ente","Vogel","Die Ente schwimmt im Teich."],["Kuh","Bauernhof","Die Kuh gibt Milch."],
    ["Pferd","Bauernhof","Das Pferd galoppiert schnell."],["Fisch","Wassertier","Der Fisch schwimmt im Fluss."],
    ["Vogel","Vogel","Der Vogel singt ein Lied."],["Hase","Wildtier","Der Hase hoppelt über die Wiese."],
    ["Ziege","Bauernhof","Die Ziege klettert auf den Felsen."],["Löwe","Wildtier","Der Löwe brüllt laut."],
    ["Affe","Wildtier","Der Affe isst eine Banane."],["Esel","Bauernhof","Der Esel trägt einen Sack."],
    ["Schaf","Bauernhof","Das Schaf hat weiche Wolle."],["Tiger","Wildtier","Der Tiger hat Streifen."],
    ["Igel","Wildtier","Der Igel hat Stacheln."],["Biene","Insekt","Die Biene sammelt Honig."]
  ]},
  { id: 2, name: "Meine Schule", icon: "🏫", req: 60, words: [
    ["Schule","Ort","Ich gehe gern in die Schule."],["Klasse","Ort","Meine Klasse ist lustig."],
    ["Tafel","Klassenzimmer","Die Lehrerin schreibt an die Tafel."],["Tasche","Schulsachen","Die Tasche ist schwer."],
    ["Heft","Schulsachen","Ich schreibe in mein Heft."],["Buch","Schulsachen","Das Buch hat bunte Bilder."],
    ["Stift","Schulsachen","Mein Stift ist rot."],["Lehrer","Menschen","Der Lehrer erklärt die Aufgabe."],
    ["Kreide","Schulsachen","Die Kreide ist weiß."],["Lineal","Schulsachen","Mit dem Lineal ziehe ich eine Linie."],
    ["Radiergummi","Schulsachen","Der Radiergummi löscht Fehler."],["Fenster","Klassenzimmer","Das Fenster ist offen."],
    ["Ranzen","Schulsachen","Mein Ranzen ist blau."],["Mäppchen","Schulsachen","Im Mäppchen liegen viele Stifte."],
    ["Pause","Schulalltag","In der Pause spielen wir."],["Turnen","Schulalltag","Beim Turnen springen wir hoch."],
    ["Papier","Schulsachen","Ich male auf Papier."],["Schere","Schulsachen","Die Schere ist scharf."],
    ["malen","Tätigkeit","Ich male ein Bild."],["lesen","Tätigkeit","Ich kann schon gut lesen."]
  ]},
  { id: 3, name: "Natur und Umwelt", icon: "🌳", req: 70, words: [
    ["Blume","Pflanze","Die Blume duftet gut."],["Baum","Pflanze","Der Baum ist sehr groß."],
    ["Wolke","Wetter","Die Wolke ist weiß und weich."],["Sonne","Wetter","Die Sonne scheint hell."],
    ["Regen","Wetter","Der Regen fällt auf das Dach."],["Himmel","Landschaft","Der Himmel ist blau."],
    ["Wiese","Landschaft","Auf der Wiese blühen Blumen."],["Garten","Landschaft","Im Garten wachsen Tomaten."],
    ["Blätter","Pflanze","Im Herbst fallen die Blätter."],["Schmetterling","Insekt","Der Schmetterling fliegt von Blume zu Blume."],
    ["Regenbogen","Wetter","Ein Regenbogen hat viele Farben."],["Blumenwiese","Landschaft","Auf der Blumenwiese summen Bienen."],
    ["Wasser","Natur","Das Wasser im Bach ist klar."],["Berge","Landschaft","Auf den Bergen liegt Schnee."],
    ["Wald","Landschaft","Im Wald wohnen viele Tiere."],["Frühling","Jahreszeit","Im Frühling blühen die Blumen."],
    ["Herbst","Jahreszeit","Im Herbst werden die Blätter bunt."],["Schnecke","Tier","Die Schnecke ist sehr langsam."],
    ["Wind","Wetter","Der Wind weht den Drachen hoch."],["Schnee","Wetter","Im Winter fällt Schnee."]
  ]}
  ,{
    "id": 4,
    "name": "Lessing 2b",
    "icon": "📚",
    "req": 75,
    "words": [
      [
        "Abend",
        "Wort",
        "Der Abend ist heute schön."
      ],
      [
        "aber",
        "Wort",
        "Ich möchte spielen, aber es regnet."
      ],
      [
        "acht",
        "Zahl",
        "Ich bin acht Jahre alt."
      ],
      [
        "alle",
        "Wort",
        "Alle Kinder spielen zusammen."
      ],
      [
        "als",
        "Wort",
        "Er ist größer als ich."
      ],
      [
        "also",
        "Wort",
        "Also gehen wir jetzt nach Hause."
      ],
      [
        "alt",
        "Wort",
        "Der Baum ist sehr alt."
      ],
      [
        "Ameise",
        "Tier",
        "Die Ameise trägt ein Blatt."
      ],
      [
        "Ampel",
        "Verkehr",
        "Die Ampel ist rot."
      ],
      [
        "antworten",
        "Tätigkeit",
        "Ich kann die Frage beantworten."
      ],
      [
        "Apfel",
        "Obst",
        "Der Apfel ist rot."
      ],
      [
        "April",
        "Monat",
        "Im April blühen viele Blumen."
      ],
      [
        "arbeiten",
        "Tätigkeit",
        "Meine Mutter muss heute arbeiten."
      ],
      [
        "Ast",
        "Natur",
        "Der Vogel sitzt auf einem Ast."
      ],
      [
        "auf",
        "Wort",
        "Das Buch liegt auf dem Tisch."
      ],
      [
        "Aufgabe",
        "Schule",
        "Ich mache meine Aufgabe."
      ],
      [
        "aufpassen",
        "Tätigkeit",
        "Ich muss im Unterricht aufpassen."
      ],
      [
        "Auge",
        "Körper",
        "Das Auge ist blau."
      ],
      [
        "August",
        "Monat",
        "Im August sind Sommerferien."
      ],
      [
        "aus",
        "Wort",
        "Ich komme aus Deutschland."
      ],
      [
        "Auto",
        "Fahrzeug",
        "Das Auto ist schnell."
      ],
      [
        "Baby",
        "Familie",
        "Das Baby schläft."
      ],
      [
        "backen",
        "Tätigkeit",
        "Wir backen einen Kuchen."
      ],
      [
        "baden",
        "Tätigkeit",
        "Im Sommer gehen wir baden."
      ],
      [
        "Ball",
        "Spielzeug",
        "Der Ball liegt im Garten."
      ],
      [
        "Bank",
        "Gegenstand",
        "Wir sitzen auf der Bank."
      ],
      [
        "Bauch",
        "Körper",
        "Mein Bauch ist voll."
      ],
      [
        "bauen",
        "Tätigkeit",
        "Wir bauen einen Turm."
      ],
      [
        "Baum",
        "Natur",
        "Der Baum ist sehr groß."
      ],
      [
        "bei",
        "Wort",
        "Ich bin bei meiner Oma."
      ],
      [
        "Bein",
        "Körper",
        "Mein Bein tut weh."
      ],
      [
        "bewegen",
        "Tätigkeit",
        "Wir bewegen unsere Arme."
      ],
      [
        "Biene",
        "Tier",
        "Die Biene fliegt zur Blume."
      ],
      [
        "Bild",
        "Gegenstand",
        "Das Bild hängt an der Wand."
      ],
      [
        "Birne",
        "Obst",
        "Die Birne ist süß."
      ],
      [
        "bitten",
        "Tätigkeit",
        "Ich möchte dich um Hilfe bitten."
      ],
      [
        "Blatt",
        "Natur",
        "Das Blatt fällt vom Baum."
      ],
      [
        "blau",
        "Farbe",
        "Der Himmel ist blau."
      ],
      [
        "bleiben",
        "Tätigkeit",
        "Wir bleiben heute zu Hause."
      ],
      [
        "Blume",
        "Natur",
        "Die Blume blüht im Frühling."
      ],
      [
        "blühen",
        "Natur",
        "Die Blumen blühen im Garten."
      ],
      [
        "Blüte",
        "Natur",
        "Die Biene sitzt auf der Blüte."
      ],
      [
        "Boden",
        "Natur",
        "Das Spielzeug liegt auf dem Boden."
      ],
      [
        "böse",
        "Gefühl",
        "Der Junge ist böse."
      ],
      [
        "brauchen",
        "Tätigkeit",
        "Ich brauche einen Stift."
      ],
      [
        "braun",
        "Farbe",
        "Der Hund ist braun."
      ],
      [
        "Brief",
        "Gegenstand",
        "Ich schreibe einen Brief."
      ],
      [
        "bringen",
        "Tätigkeit",
        "Ich bringe dir ein Buch."
      ],
      [
        "Brot",
        "Essen",
        "Ich esse ein Stück Brot."
      ],
      [
        "Bruder",
        "Familie",
        "Mein Bruder spielt Fußball."
      ],
      [
        "Bub",
        "Person",
        "Der Bub spielt im Garten."
      ],
      [
        "Buch",
        "Schule",
        "Ich lese ein spannendes Buch."
      ],
      [
        "bunt",
        "Farbe",
        "Der Schmetterling ist bunt."
      ],
      [
        "Busch",
        "Natur",
        "Der Vogel sitzt im Busch."
      ],
      [
        "Cent",
        "Geld",
        "Das kostet fünf Cent."
      ],
      [
        "Clown",
        "Person",
        "Der Clown macht lustige Sachen."
      ],
      [
        "Computer",
        "Gegenstand",
        "Ich lerne am Computer."
      ],
      [
        "da",
        "Wort",
        "Mein Vater ist da."
      ],
      [
        "danken",
        "Tätigkeit",
        "Ich möchte dir danken."
      ],
      [
        "das",
        "Wort",
        "Das ist mein Buch."
      ],
      [
        "denken",
        "Tätigkeit",
        "Ich muss gut nachdenken."
      ],
      [
        "denn",
        "Wort",
        "Was machst du denn?"
      ],
      [
        "der",
        "Wort",
        "Der Hund ist klein."
      ],
      [
        "des",
        "Wort",
        "Das Spiel des Kindes ist schön."
      ],
      [
        "Dezember",
        "Monat",
        "Im Dezember feiern wir Weihnachten."
      ],
      [
        "dich",
        "Wort",
        "Ich sehe dich."
      ],
      [
        "dick",
        "Eigenschaft",
        "Das Buch ist dick."
      ],
      [
        "die",
        "Wort",
        "Die Katze schläft."
      ],
      [
        "Dienstag",
        "Wochentag",
        "Am Dienstag gehe ich zur Schule."
      ],
      [
        "dir",
        "Wort",
        "Ich helfe dir."
      ],
      [
        "doch",
        "Wort",
        "Doch, ich habe Zeit."
      ],
      [
        "Donnerstag",
        "Wochentag",
        "Am Donnerstag habe ich Sport."
      ],
      [
        "Dose",
        "Gegenstand",
        "Die Dose ist leer."
      ],
      [
        "drei",
        "Zahl",
        "Ich habe drei Äpfel."
      ],
      [
        "du",
        "Wort",
        "Du bist mein Freund."
      ],
      [
        "dunkel",
        "Eigenschaft",
        "Der Himmel ist dunkel."
      ],
      [
        "durch",
        "Wort",
        "Wir gehen durch den Wald."
      ],
      [
        "dürfen",
        "Tätigkeit",
        "Wir dürfen draußen spielen."
      ],
      [
        "Ei",
        "Essen",
        "Das Ei liegt im Nest."
      ],
      [
        "eins",
        "Zahl",
        "Ich zähle bis eins."
      ],
      [
        "Eis",
        "Essen",
        "Im Sommer esse ich Eis."
      ],
      [
        "elf",
        "Zahl",
        "Es sind elf Kinder da."
      ],
      [
        "Eltern",
        "Familie",
        "Meine Eltern sind zu Hause."
      ],
      [
        "Ende",
        "Wort",
        "Das Ende der Geschichte ist schön."
      ],
      [
        "eng",
        "Eigenschaft",
        "Die Schuhe sind zu eng."
      ],
      [
        "Ente",
        "Tier",
        "Die Ente schwimmt auf dem See."
      ],
      [
        "er",
        "Wort",
        "Er spielt mit dem Ball."
      ],
      [
        "Erde",
        "Natur",
        "Die Erde ist unser Zuhause."
      ],
      [
        "es",
        "Wort",
        "Es regnet heute."
      ],
      [
        "Esel",
        "Tier",
        "Der Esel steht auf der Wiese."
      ],
      [
        "essen",
        "Tätigkeit",
        "Wir essen zusammen."
      ],
      [
        "Eule",
        "Tier",
        "Die Eule sitzt auf einem Ast."
      ],
      [
        "Euro",
        "Geld",
        "Das kostet einen Euro."
      ],
      [
        "fahren",
        "Tätigkeit",
        "Wir fahren mit dem Auto."
      ],
      [
        "fallen",
        "Tätigkeit",
        "Die Blätter fallen vom Baum."
      ],
      [
        "Familie",
        "Familie",
        "Meine Familie ist sehr nett."
      ],
      [
        "Februar",
        "Monat",
        "Der Februar ist ein Wintermonat."
      ],
      [
        "Feder",
        "Gegenstand",
        "Der Vogel hat eine Feder verloren."
      ],
      [
        "fein",
        "Eigenschaft",
        "Das Essen schmeckt fein."
      ],
      [
        "Feld",
        "Natur",
        "Auf dem Feld wachsen Blumen."
      ],
      [
        "Fenster",
        "Haus",
        "Ich öffne das Fenster."
      ],
      [
        "finden",
        "Tätigkeit",
        "Ich kann meinen Stift nicht finden."
      ],
      [
        "Finger",
        "Körper",
        "Ich habe zehn Finger."
      ],
      [
        "fliegen",
        "Tätigkeit",
        "Der Vogel kann fliegen."
      ],
      [
        "Flügel",
        "Körper",
        "Der Vogel hat zwei Flügel."
      ],
      [
        "flüssig",
        "Eigenschaft",
        "Wasser ist flüssig."
      ],
      [
        "fragen",
        "Tätigkeit",
        "Ich möchte etwas fragen."
      ],
      [
        "Frau",
        "Person",
        "Die Frau liest ein Buch."
      ],
      [
        "Freitag",
        "Wochentag",
        "Am Freitag ist die Schule vorbei."
      ],
      [
        "fremd",
        "Eigenschaft",
        "Der Mann ist mir fremd."
      ],
      [
        "freuen",
        "Gefühl",
        "Ich freue mich auf den Geburtstag."
      ],
      [
        "Freund",
        "Person",
        "Mein Freund spielt mit mir."
      ],
      [
        "frisch",
        "Eigenschaft",
        "Das Brot ist frisch."
      ],
      [
        "Frucht",
        "Essen",
        "Der Apfel ist eine Frucht."
      ],
      [
        "Frühling",
        "Jahreszeit",
        "Im Frühling blühen die Blumen."
      ],
      [
        "Füller",
        "Schule",
        "Ich schreibe mit meinem Füller."
      ],
      [
        "fünf",
        "Zahl",
        "Ich habe fünf Finger an einer Hand."
      ],
      [
        "für",
        "Wort",
        "Dieses Geschenk ist für dich."
      ],
      [
        "Fuß",
        "Körper",
        "Mein Fuß ist kalt."
      ],
      [
        "Gabel",
        "Gegenstand",
        "Ich esse mit einer Gabel."
      ],
      [
        "Garten",
        "Natur",
        "Im Garten spielen die Kinder."
      ],
      [
        "geben",
        "Tätigkeit",
        "Kannst du mir bitte den Ball geben?"
      ],
      [
        "gehen",
        "Tätigkeit",
        "Wir gehen in die Schule."
      ],
      [
        "gelb",
        "Farbe",
        "Die Sonne ist gelb."
      ],
      [
        "Geld",
        "Gegenstand",
        "Ich spare mein Geld."
      ],
      [
        "Gemüse",
        "Essen",
        "Ich esse gern Gemüse."
      ],
      [
        "Gesicht",
        "Körper",
        "Ich wasche mein Gesicht."
      ],
      [
        "gestern",
        "Zeit",
        "Gestern war ich im Park."
      ],
      [
        "gesund",
        "Eigenschaft",
        "Obst und Gemüse sind gesund."
      ],
      [
        "Gras",
        "Natur",
        "Das Gras ist grün."
      ],
      [
        "groß",
        "Eigenschaft",
        "Der Elefant ist groß."
      ],
      [
        "grün",
        "Farbe",
        "Das Gras ist grün."
      ],
      [
        "gut",
        "Eigenschaft",
        "Du hast das gut gemacht."
      ],
      [
        "Haar",
        "Körper",
        "Mein Haar ist braun."
      ],
      [
        "haben",
        "Tätigkeit",
        "Wir haben einen Hund."
      ],
      [
        "Hai",
        "Tier",
        "Der Hai schwimmt im Meer."
      ],
      [
        "hart",
        "Eigenschaft",
        "Der Stein ist hart."
      ],
      [
        "Hase",
        "Tier",
        "Der Hase hoppelt über die Wiese."
      ],
      [
        "Haus",
        "Gebäude",
        "Unser Haus hat ein rotes Dach."
      ],
      [
        "Hecke",
        "Natur",
        "Der Vogel sitzt in der Hecke."
      ],
      [
        "heiß",
        "Eigenschaft",
        "Der Tee ist heiß."
      ],
      [
        "heißen",
        "Tätigkeit",
        "Ich heiße Anna."
      ],
      [
        "helfen",
        "Tätigkeit",
        "Ich helfe meiner Mutter."
      ],
      [
        "hell",
        "Eigenschaft",
        "Das Zimmer ist hell."
      ],
      [
        "Hemd",
        "Kleidung",
        "Mein Hemd ist blau."
      ],
      [
        "her",
        "Wort",
        "Komm bitte hierher."
      ],
      [
        "Herbst",
        "Jahreszeit",
        "Im Herbst fallen die Blätter."
      ],
      [
        "Herr",
        "Person",
        "Der Herr wartet an der Tür."
      ],
      [
        "heute",
        "Zeit",
        "Heute gehe ich schwimmen."
      ],
      [
        "Hexe",
        "Person",
        "Die Hexe fliegt auf ihrem Besen."
      ],
      [
        "Himmel",
        "Natur",
        "Die Wolken sind am Himmel."
      ],
      [
        "hinter",
        "Wort",
        "Der Ball liegt hinter dem Schrank."
      ],
      [
        "ich",
        "Wort",
        "Ich spiele heute im Garten."
      ],
      [
        "Igel",
        "Tier",
        "Der Igel schläft im Laub."
      ],
      [
        "ihm",
        "Wort",
        "Ich gebe ihm einen Ball."
      ],
      [
        "ihn",
        "Wort",
        "Ich sehe ihn im Garten."
      ],
      [
        "ihnen",
        "Wort",
        "Ich helfe ihnen."
      ],
      [
        "ihr",
        "Wort",
        "Ist das ihr Buch?"
      ],
      [
        "im",
        "Wort",
        "Ich bin im Haus."
      ],
      [
        "immer",
        "Wort",
        "Ich spiele immer gern."
      ],
      [
        "in",
        "Wort",
        "Ich gehe in die Schule."
      ],
      [
        "ja",
        "Wort",
        "Ja, ich komme mit."
      ],
      [
        "Jahr",
        "Zeit",
        "Ein Jahr hat zwölf Monate."
      ],
      [
        "Januar",
        "Monat",
        "Im Januar ist es oft kalt."
      ],
      [
        "Juli",
        "Monat",
        "Im Juli sind Sommerferien."
      ],
      [
        "Junge",
        "Person",
        "Der Junge spielt Fußball."
      ],
      [
        "Juni",
        "Monat",
        "Im Juni scheint oft die Sonne."
      ],
      [
        "Käfer",
        "Tier",
        "Der Käfer krabbelt auf dem Blatt."
      ],
      [
        "Kaiser",
        "Person",
        "Der Kaiser trägt eine Krone."
      ],
      [
        "kalt",
        "Eigenschaft",
        "Im Winter ist es kalt."
      ],
      [
        "Katze",
        "Tier",
        "Die Katze schläft auf dem Sofa."
      ],
      [
        "kaufen",
        "Tätigkeit",
        "Wir kaufen frisches Brot."
      ],
      [
        "Kind",
        "Person",
        "Das Kind spielt im Garten."
      ],
      [
        "Kiste",
        "Gegenstand",
        "Die Kiste ist voll."
      ],
      [
        "Klasse",
        "Schule",
        "Unsere Klasse ist sehr nett."
      ],
      [
        "Kleid",
        "Kleidung",
        "Das Kleid ist schön."
      ],
      [
        "klein",
        "Eigenschaft",
        "Die Maus ist klein."
      ],
      [
        "kommen",
        "Tätigkeit",
        "Meine Freunde kommen heute."
      ],
      [
        "können",
        "Tätigkeit",
        "Ich kann gut schwimmen."
      ],
      [
        "Kopf",
        "Körper",
        "Mein Kopf tut weh."
      ],
      [
        "Körper",
        "Körper",
        "Mein Körper ist stark."
      ],
      [
        "krank",
        "Eigenschaft",
        "Heute bin ich krank."
      ],
      [
        "Kuh",
        "Tier",
        "Die Kuh gibt Milch."
      ],
      [
        "laufen",
        "Tätigkeit",
        "Ich laufe schnell."
      ],
      [
        "laut",
        "Eigenschaft",
        "Die Musik ist laut."
      ],
      [
        "leben",
        "Tätigkeit",
        "Wir leben in Deutschland."
      ],
      [
        "legen",
        "Tätigkeit",
        "Ich lege das Buch auf den Tisch."
      ],
      [
        "leicht",
        "Eigenschaft",
        "Die Tasche ist leicht."
      ],
      [
        "leise",
        "Eigenschaft",
        "Bitte sei leise."
      ],
      [
        "lernen",
        "Tätigkeit",
        "Ich lerne Deutsch."
      ],
      [
        "lesen",
        "Tätigkeit",
        "Ich lese ein Buch."
      ],
      [
        "Leute",
        "Personen",
        "Viele Leute gehen durch die Stadt."
      ],
      [
        "Lexikon",
        "Buch",
        "Im Lexikon stehen viele Wörter."
      ],
      [
        "Licht",
        "Gegenstand",
        "Das Licht ist hell."
      ],
      [
        "lieben",
        "Gefühl",
        "Ich liebe meine Familie."
      ],
      [
        "liegen",
        "Tätigkeit",
        "Das Buch liegt auf dem Tisch."
      ],
      [
        "Löwe",
        "Tier",
        "Der Löwe lebt in Afrika."
      ],
      [
        "machen",
        "Tätigkeit",
        "Ich mache meine Hausaufgaben."
      ],
      [
        "Mädchen",
        "Person",
        "Das Mädchen spielt mit einer Puppe."
      ],
      [
        "Mai",
        "Monat",
        "Im Mai blühen viele Blumen."
      ],
      [
        "malen",
        "Tätigkeit",
        "Ich male ein buntes Bild."
      ],
      [
        "man",
        "Wort",
        "Man soll freundlich sein."
      ],
      [
        "Mann",
        "Person",
        "Der Mann liest die Zeitung."
      ],
      [
        "März",
        "Monat",
        "Im März beginnt der Frühling."
      ],
      [
        "Maus",
        "Tier",
        "Die Maus frisst Käse."
      ],
      [
        "mir",
        "Wort",
        "Mir gefällt das Bild."
      ],
      [
        "mit",
        "Wort",
        "Ich spiele mit meinem Bruder."
      ],
      [
        "Mittwoch",
        "Wochentag",
        "Am Mittwoch gehe ich zum Sport."
      ],
      [
        "Monat",
        "Zeit",
        "Ein Monat hat viele Tage."
      ],
      [
        "Montag",
        "Wochentag",
        "Am Montag beginnt die Schule."
      ],
      [
        "morgen",
        "Zeit",
        "Morgen gehe ich schwimmen."
      ],
      [
        "Mund",
        "Körper",
        "Mit dem Mund kann ich sprechen."
      ],
      [
        "müssen",
        "Tätigkeit",
        "Ich muss meine Zähne putzen."
      ],
      [
        "Mutter",
        "Familie",
        "Meine Mutter liest ein Buch."
      ],
      [
        "Nacht",
        "Zeit",
        "In der Nacht schlafe ich."
      ],
      [
        "Nadel",
        "Gegenstand",
        "Die Nadel ist sehr dünn."
      ],
      [
        "Name",
        "Wort",
        "Wie ist dein Name?"
      ],
      [
        "Nase",
        "Körper",
        "Meine Nase ist kalt."
      ],
      [
        "Nebel",
        "Wetter",
        "Am Morgen liegt Nebel über dem Feld."
      ],
      [
        "nehmen",
        "Tätigkeit",
        "Ich nehme einen Apfel."
      ],
      [
        "nein",
        "Wort",
        "Nein, ich möchte kein Eis."
      ],
      [
        "neu",
        "Eigenschaft",
        "Ich habe ein neues Buch."
      ],
      [
        "neun",
        "Zahl",
        "Ich zähle bis neun."
      ],
      [
        "nicht",
        "Wort",
        "Ich bin heute nicht müde."
      ],
      [
        "November",
        "Monat",
        "Im November wird es kalt."
      ],
      [
        "nun",
        "Wort",
        "Nun können wir spielen."
      ],
      [
        "nur",
        "Wort",
        "Ich esse nur einen Apfel."
      ],
      [
        "Obst",
        "Essen",
        "Ich esse gern Obst."
      ],
      [
        "oder",
        "Wort",
        "Möchtest du Tee oder Wasser?"
      ],
      [
        "Oktober",
        "Monat",
        "Im Oktober ist Herbst."
      ],
      [
        "Oma",
        "Familie",
        "Meine Oma backt einen Kuchen."
      ],
      [
        "Onkel",
        "Familie",
        "Mein Onkel wohnt in München."
      ],
      [
        "Opa",
        "Familie",
        "Mein Opa erzählt Geschichten."
      ],
      [
        "Ostern",
        "Fest",
        "Zu Ostern suchen wir Eier."
      ],
      [
        "Partner",
        "Person",
        "Mein Partner hilft mir beim Spiel."
      ],
      [
        "Pause",
        "Schule",
        "In der Pause spiele ich mit Freunden."
      ],
      [
        "Pferd",
        "Tier",
        "Das Pferd läuft über die Wiese."
      ],
      [
        "Pflanze",
        "Natur",
        "Die Pflanze braucht Wasser."
      ],
      [
        "pflegen",
        "Tätigkeit",
        "Wir pflegen die Blumen."
      ],
      [
        "Pinsel",
        "Schule",
        "Mit dem Pinsel male ich ein Bild."
      ],
      [
        "Pizza",
        "Essen",
        "Ich esse gern Pizza."
      ],
      [
        "Platz",
        "Ort",
        "Wir spielen auf dem Platz."
      ],
      [
        "Puppe",
        "Spielzeug",
        "Das Mädchen spielt mit ihrer Puppe."
      ],
      [
        "Quadrat",
        "Form",
        "Das Quadrat hat vier Ecken."
      ],
      [
        "quaken",
        "Tierlaut",
        "Die Frösche quaken am Teich."
      ],
      [
        "Quatsch",
        "Wort",
        "Wir machen keinen Quatsch."
      ],
      [
        "Quelle",
        "Natur",
        "Das Wasser kommt aus einer Quelle."
      ],
      [
        "Rabe",
        "Tier",
        "Der Rabe sitzt auf dem Zaun."
      ],
      [
        "Raupe",
        "Tier",
        "Die Raupe kriecht auf dem Blatt."
      ],
      [
        "rechnen",
        "Schule",
        "Ich kann gut rechnen."
      ],
      [
        "reden",
        "Tätigkeit",
        "Wir reden miteinander."
      ],
      [
        "Regen",
        "Wetter",
        "Der Regen fällt auf das Dach."
      ],
      [
        "reich",
        "Eigenschaft",
        "Der König ist reich."
      ],
      [
        "reisen",
        "Tätigkeit",
        "Wir reisen in den Urlaub."
      ],
      [
        "Ring",
        "Gegenstand",
        "Der Ring glänzt im Licht."
      ],
      [
        "Rock",
        "Kleidung",
        "Der Rock ist rot."
      ],
      [
        "rollen",
        "Tätigkeit",
        "Der Ball kann über den Boden rollen."
      ],
      [
        "rot",
        "Farbe",
        "Die Tomate ist rot."
      ],
      [
        "Rücken",
        "Körper",
        "Mein Rücken ist gerade."
      ],
      [
        "rufen",
        "Tätigkeit",
        "Ich rufe meinen Freund."
      ],
      [
        "Saft",
        "Essen",
        "Ich trinke einen Apfelsaft."
      ],
      [
        "sagen",
        "Tätigkeit",
        "Ich möchte dir etwas sagen."
      ],
      [
        "Salz",
        "Essen",
        "Das Salz steht auf dem Tisch."
      ],
      [
        "Samstag",
        "Wochentag",
        "Am Samstag spiele ich draußen."
      ],
      [
        "Satz",
        "Sprache",
        "Ich schreibe einen schönen Satz."
      ],
      [
        "Schaf",
        "Tier",
        "Das Schaf frisst grünes Gras."
      ],
      [
        "schauen",
        "Tätigkeit",
        "Wir schauen einen Film."
      ],
      [
        "scheinen",
        "Tätigkeit",
        "Die Sonne scheint heute."
      ],
      [
        "Schere",
        "Schule",
        "Mit der Schere schneide ich Papier."
      ],
      [
        "schlafen",
        "Tätigkeit",
        "Das Kind schläft im Bett."
      ],
      [
        "schlagen",
        "Tätigkeit",
        "Ich schlage den Ball."
      ],
      [
        "Schnee",
        "Wetter",
        "Im Winter liegt Schnee auf dem Boden."
      ],
      [
        "schneiden",
        "Tätigkeit",
        "Ich schneide das Papier."
      ],
      [
        "schnell",
        "Eigenschaft",
        "Der Hase läuft schnell."
      ],
      [
        "schon",
        "Wort",
        "Ich bin schon fertig."
      ],
      [
        "schön",
        "Eigenschaft",
        "Die Blume ist schön."
      ],
      [
        "schreiben",
        "Schule",
        "Ich schreibe einen Brief."
      ],
      [
        "schreien",
        "Tätigkeit",
        "Bitte nicht so laut schreien."
      ],
      [
        "Schule",
        "Schule",
        "Ich gehe jeden Morgen in die Schule."
      ],
      [
        "schwarz",
        "Farbe",
        "Die Katze ist schwarz."
      ],
      [
        "Schwester",
        "Familie",
        "Meine Schwester spielt mit mir."
      ],
      [
        "sechs",
        "Zahl",
        "Ich habe sechs Buntstifte."
      ],
      [
        "See",
        "Natur",
        "Die Ente schwimmt auf dem See."
      ],
      [
        "sehen",
        "Tätigkeit",
        "Ich kann einen Vogel sehen."
      ],
      [
        "sehr",
        "Wort",
        "Das gefällt mir sehr."
      ],
      [
        "Seife",
        "Gegenstand",
        "Ich wasche meine Hände mit Seife."
      ],
      [
        "sein",
        "Wort",
        "Ich möchte freundlich sein."
      ],
      [
        "September",
        "Monat",
        "Im September beginnt die Schule."
      ],
      [
        "sie",
        "Wort",
        "Sie spielt mit ihrer Freundin."
      ],
      [
        "sieben",
        "Zahl",
        "Eine Woche hat sieben Tage."
      ],
      [
        "singen",
        "Tätigkeit",
        "Wir singen ein schönes Lied."
      ],
      [
        "sitzen",
        "Tätigkeit",
        "Ich sitze auf dem Stuhl."
      ],
      [
        "so",
        "Wort",
        "Das ist so schön."
      ],
      [
        "Sohn",
        "Familie",
        "Der Sohn spielt mit seinem Vater."
      ],
      [
        "sollen",
        "Tätigkeit",
        "Ich soll meine Hausaufgaben machen."
      ],
      [
        "Sommer",
        "Jahreszeit",
        "Im Sommer ist es warm."
      ],
      [
        "Sonne",
        "Wetter",
        "Die Sonne scheint heute."
      ],
      [
        "Sonntag",
        "Wochentag",
        "Am Sonntag besuchen wir Oma."
      ],
      [
        "sparen",
        "Tätigkeit",
        "Ich spare mein Taschengeld."
      ],
      [
        "spielen",
        "Tätigkeit",
        "Die Kinder spielen im Garten."
      ],
      [
        "Sport",
        "Freizeit",
        "Ich mache gern Sport."
      ],
      [
        "sprechen",
        "Tätigkeit",
        "Wir sprechen Deutsch."
      ],
      [
        "Stängel",
        "Natur",
        "Die Blume hat einen langen Stängel."
      ],
      [
        "stehen",
        "Tätigkeit",
        "Das Fahrrad steht vor dem Haus."
      ],
      [
        "Stein",
        "Natur",
        "Der Stein liegt auf dem Weg."
      ],
      [
        "stellen",
        "Tätigkeit",
        "Ich stelle das Glas auf den Tisch."
      ],
      [
        "Stern",
        "Natur",
        "Ein Stern leuchtet am Himmel."
      ],
      [
        "Stift",
        "Schule",
        "Mit dem Stift schreibe ich meinen Namen."
      ],
      [
        "still",
        "Eigenschaft",
        "Im Unterricht bin ich still."
      ],
      [
        "Strauch",
        "Natur",
        "Der Vogel sitzt im Strauch."
      ],
      [
        "Stunde",
        "Zeit",
        "Eine Stunde hat sechzig Minuten."
      ],
      [
        "suchen",
        "Tätigkeit",
        "Ich suche meinen Schlüssel."
      ],
      [
        "Tag",
        "Zeit",
        "Heute ist ein schöner Tag."
      ],
      [
        "Tante",
        "Familie",
        "Meine Tante besucht uns."
      ],
      [
        "Tasche",
        "Gegenstand",
        "Meine Tasche steht neben dem Tisch."
      ],
      [
        "Teddy",
        "Spielzeug",
        "Mein Teddy liegt auf dem Bett."
      ],
      [
        "Telefon",
        "Gegenstand",
        "Das Telefon klingelt."
      ],
      [
        "Tier",
        "Natur",
        "Der Hund ist ein Tier."
      ],
      [
        "Tisch",
        "Möbel",
        "Das Buch liegt auf dem Tisch."
      ],
      [
        "Tochter",
        "Familie",
        "Die Tochter spielt im Garten."
      ],
      [
        "Tomate",
        "Gemüse",
        "Die Tomate ist rot."
      ],
      [
        "tragen",
        "Tätigkeit",
        "Ich trage meine Schultasche."
      ],
      [
        "trinken",
        "Tätigkeit",
        "Ich trinke ein Glas Wasser."
      ],
      [
        "tun",
        "Tätigkeit",
        "Was kann ich für dich tun?"
      ],
      [
        "turnen",
        "Sport",
        "Die Kinder turnen in der Turnhalle."
      ],
      [
        "Uhr",
        "Gegenstand",
        "Die Uhr zeigt acht Uhr."
      ],
      [
        "um",
        "Wort",
        "Wir treffen uns um acht Uhr."
      ],
      [
        "und",
        "Wort",
        "Ich esse Brot und Käse."
      ],
      [
        "unter",
        "Wort",
        "Der Ball liegt unter dem Tisch."
      ],
      [
        "üben",
        "Tätigkeit",
        "Ich übe jeden Tag Deutsch."
      ],
      [
        "über",
        "Wort",
        "Der Vogel fliegt über das Haus."
      ],
      [
        "Vase",
        "Gegenstand",
        "Die Vase steht auf dem Tisch."
      ],
      [
        "Vater",
        "Familie",
        "Mein Vater liest eine Zeitung."
      ],
      [
        "Verkehr",
        "Verkehr",
        "Im Verkehr muss man gut aufpassen."
      ],
      [
        "viel",
        "Wort",
        "Ich habe viel gelernt."
      ],
      [
        "vier",
        "Zahl",
        "Ein Auto hat vier Räder."
      ],
      [
        "Vogel",
        "Tier",
        "Der Vogel fliegt hoch in den Himmel."
      ],
      [
        "vor",
        "Wort",
        "Ich stehe vor der Tür."
      ],
      [
        "wann",
        "Wort",
        "Wann gehen wir nach Hause?"
      ],
      [
        "warm",
        "Eigenschaft",
        "Im Sommer ist es warm."
      ],
      [
        "warten",
        "Tätigkeit",
        "Ich warte auf den Bus."
      ],
      [
        "warum",
        "Wort",
        "Warum lachst du?"
      ],
      [
        "was",
        "Wort",
        "Was möchtest du spielen?"
      ],
      [
        "waschen",
        "Tätigkeit",
        "Ich wasche meine Hände."
      ],
      [
        "Wasser",
        "Natur",
        "Ich trinke ein Glas Wasser."
      ],
      [
        "Weg",
        "Ort",
        "Der Weg führt durch den Wald."
      ],
      [
        "Weihnachten",
        "Fest",
        "Zu Weihnachten bekommen wir Geschenke."
      ],
      [
        "weil",
        "Wort",
        "Ich freue mich, weil heute Sonntag ist."
      ],
      [
        "weiß",
        "Farbe",
        "Der Schnee ist weiß."
      ],
      [
        "weiter",
        "Wort",
        "Wir gehen jetzt weiter."
      ],
      [
        "wenig",
        "Wort",
        "Ich habe nur wenig Zeit."
      ],
      [
        "wer",
        "Wort",
        "Wer spielt heute mit mir?"
      ],
      [
        "werden",
        "Tätigkeit",
        "Ich werde bald acht Jahre alt."
      ],
      [
        "Wetter",
        "Wetter",
        "Das Wetter ist heute schön."
      ],
      [
        "wie",
        "Wort",
        "Wie heißt du?"
      ],
      [
        "wieder",
        "Wort",
        "Morgen sehen wir uns wieder."
      ],
      [
        "Wiese",
        "Natur",
        "Auf der Wiese wachsen viele Blumen."
      ],
      [
        "Wind",
        "Wetter",
        "Der Wind bewegt die Blätter."
      ],
      [
        "Winter",
        "Jahreszeit",
        "Im Winter fällt manchmal Schnee."
      ],
      [
        "wir",
        "Wort",
        "Wir spielen zusammen."
      ],
      [
        "wo",
        "Wort",
        "Wo ist mein Buch?"
      ],
      [
        "Woche",
        "Zeit",
        "Eine Woche hat sieben Tage."
      ],
      [
        "wohnen",
        "Tätigkeit",
        "Wir wohnen in Deutschland."
      ],
      [
        "Wolf",
        "Tier",
        "Der Wolf läuft durch den Wald."
      ],
      [
        "Wolke",
        "Wetter",
        "Eine weiße Wolke steht am Himmel."
      ],
      [
        "wollen",
        "Tätigkeit",
        "Wir wollen draußen spielen."
      ],
      [
        "Wort",
        "Sprache",
        "Das Wort steht im Buch."
      ],
      [
        "wünschen",
        "Tätigkeit",
        "Ich wünsche mir ein Fahrrad."
      ],
      [
        "Wurzel",
        "Natur",
        "Der Baum hat eine große Wurzel."
      ],
      [
        "Zahl",
        "Mathematik",
        "Die Zahl ist zehn."
      ],
      [
        "zahlen",
        "Tätigkeit",
        "Wir zahlen an der Kasse."
      ],
      [
        "zählen",
        "Mathematik",
        "Ich kann bis hundert zählen."
      ],
      [
        "Zahn",
        "Körper",
        "Mein Zahn ist gesund."
      ],
      [
        "zehn",
        "Zahl",
        "Ich habe zehn Finger."
      ],
      [
        "zeigen",
        "Tätigkeit",
        "Ich möchte dir mein Bild zeigen."
      ],
      [
        "Zeit",
        "Zeit",
        "Es ist Zeit für die Schule."
      ],
      [
        "Ziege",
        "Tier",
        "Die Ziege frisst Gras."
      ],
      [
        "Zimmer",
        "Haus",
        "Mein Zimmer ist aufgeräumt."
      ],
      [
        "Zucker",
        "Essen",
        "Der Zucker ist süß."
      ],
      [
        "zwei",
        "Zahl",
        "Ich habe zwei Augen."
      ],
      [
        "Zwiebel",
        "Gemüse",
        "Die Zwiebel liegt in der Küche."
      ],
      [
        "zwölf",
        "Zahl",
        "Ein Jahr hat zwölf Monate."
      ]
    ]
  }
];
const LEVELS = RAW.map(l => ({ ...l, words: l.words.map(([w, cat, s]) =>
  ({ w, cat, s, diff: w.length <= 5 ? "leicht" : w.length <= 8 ? "mittel" : "schwer" })) }));
