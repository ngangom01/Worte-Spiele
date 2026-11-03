// WORT-ABENTEUER – Wortlisten. Eintrag: [Wort, Kategorie, Beispielsatz]
// Lessing 2b ist nach Wortlänge und orthografischen Besonderheiten in 7 Stufen sortiert.
const RAW = [
  {
    "id": 1,
    "name": "Tierwelt",
    "icon": "🦊",
    "req": 0,
    "words": [
      [
        "Hund",
        "Haustier",
        "Der Hund bellt laut."
      ],
      [
        "Katze",
        "Haustier",
        "Die Katze schläft auf dem Sofa."
      ],
      [
        "Maus",
        "Kleintier",
        "Die Maus mag Käse."
      ],
      [
        "Bär",
        "Wildtier",
        "Der Bär brummt im Wald."
      ],
      [
        "Wolf",
        "Wildtier",
        "Der Wolf heult in der Nacht."
      ],
      [
        "Fuchs",
        "Wildtier",
        "Der Fuchs ist schlau."
      ],
      [
        "Ente",
        "Vogel",
        "Die Ente schwimmt im Teich."
      ],
      [
        "Kuh",
        "Bauernhof",
        "Die Kuh gibt Milch."
      ],
      [
        "Pferd",
        "Bauernhof",
        "Das Pferd galoppiert schnell."
      ],
      [
        "Fisch",
        "Wassertier",
        "Der Fisch schwimmt im Fluss."
      ],
      [
        "Vogel",
        "Vogel",
        "Der Vogel singt ein Lied."
      ],
      [
        "Hase",
        "Wildtier",
        "Der Hase hoppelt über die Wiese."
      ],
      [
        "Ziege",
        "Bauernhof",
        "Die Ziege klettert auf den Felsen."
      ],
      [
        "Löwe",
        "Wildtier",
        "Der Löwe brüllt laut."
      ],
      [
        "Affe",
        "Wildtier",
        "Der Affe isst eine Banane."
      ],
      [
        "Esel",
        "Bauernhof",
        "Der Esel trägt einen Sack."
      ],
      [
        "Schaf",
        "Bauernhof",
        "Das Schaf hat weiche Wolle."
      ],
      [
        "Tiger",
        "Wildtier",
        "Der Tiger hat Streifen."
      ],
      [
        "Igel",
        "Wildtier",
        "Der Igel hat Stacheln."
      ],
      [
        "Biene",
        "Insekt",
        "Die Biene sammelt Honig."
      ]
    ]
  },
  {
    "id": 2,
    "name": "Meine Schule",
    "icon": "🏫",
    "req": 60,
    "words": [
      [
        "Schule",
        "Ort",
        "Ich gehe gern in die Schule."
      ],
      [
        "Klasse",
        "Ort",
        "Meine Klasse ist lustig."
      ],
      [
        "Tafel",
        "Klassenzimmer",
        "Die Lehrerin schreibt an die Tafel."
      ],
      [
        "Tasche",
        "Schulsachen",
        "Die Tasche ist schwer."
      ],
      [
        "Heft",
        "Schulsachen",
        "Ich schreibe in mein Heft."
      ],
      [
        "Buch",
        "Schulsachen",
        "Das Buch hat bunte Bilder."
      ],
      [
        "Stift",
        "Schulsachen",
        "Mein Stift ist rot."
      ],
      [
        "Lehrer",
        "Menschen",
        "Der Lehrer erklärt die Aufgabe."
      ],
      [
        "Kreide",
        "Schulsachen",
        "Die Kreide ist weiß."
      ],
      [
        "Lineal",
        "Schulsachen",
        "Mit dem Lineal ziehe ich eine Linie."
      ],
      [
        "Radiergummi",
        "Schulsachen",
        "Der Radiergummi löscht Fehler."
      ],
      [
        "Fenster",
        "Klassenzimmer",
        "Das Fenster ist offen."
      ],
      [
        "Ranzen",
        "Schulsachen",
        "Mein Ranzen ist blau."
      ],
      [
        "Mäppchen",
        "Schulsachen",
        "Im Mäppchen liegen viele Stifte."
      ],
      [
        "Pause",
        "Schulalltag",
        "In der Pause spielen wir."
      ],
      [
        "Turnen",
        "Schulalltag",
        "Beim Turnen springen wir hoch."
      ],
      [
        "Papier",
        "Schulsachen",
        "Ich male auf Papier."
      ],
      [
        "Schere",
        "Schulsachen",
        "Die Schere ist scharf."
      ],
      [
        "malen",
        "Tätigkeit",
        "Ich male ein Bild."
      ],
      [
        "lesen",
        "Tätigkeit",
        "Ich kann schon gut lesen."
      ]
    ]
  },
  {
    "id": 3,
    "name": "Natur und Umwelt",
    "icon": "🌳",
    "req": 70,
    "words": [
      [
        "Blume",
        "Pflanze",
        "Die Blume duftet gut."
      ],
      [
        "Baum",
        "Pflanze",
        "Der Baum ist sehr groß."
      ],
      [
        "Wolke",
        "Wetter",
        "Die Wolke ist weiß und weich."
      ],
      [
        "Sonne",
        "Wetter",
        "Die Sonne scheint hell."
      ],
      [
        "Regen",
        "Wetter",
        "Der Regen fällt auf das Dach."
      ],
      [
        "Himmel",
        "Landschaft",
        "Der Himmel ist blau."
      ],
      [
        "Wiese",
        "Landschaft",
        "Auf der Wiese blühen Blumen."
      ],
      [
        "Garten",
        "Landschaft",
        "Im Garten wachsen Tomaten."
      ],
      [
        "Blätter",
        "Pflanze",
        "Im Herbst fallen die Blätter."
      ],
      [
        "Schmetterling",
        "Insekt",
        "Der Schmetterling fliegt von Blume zu Blume."
      ],
      [
        "Regenbogen",
        "Wetter",
        "Ein Regenbogen hat viele Farben."
      ],
      [
        "Blumenwiese",
        "Landschaft",
        "Auf der Blumenwiese summen Bienen."
      ],
      [
        "Wasser",
        "Natur",
        "Das Wasser im Bach ist klar."
      ],
      [
        "Berge",
        "Landschaft",
        "Auf den Bergen liegt Schnee."
      ],
      [
        "Wald",
        "Landschaft",
        "Im Wald wohnen viele Tiere."
      ],
      [
        "Frühling",
        "Jahreszeit",
        "Im Frühling blühen die Blumen."
      ],
      [
        "Herbst",
        "Jahreszeit",
        "Im Herbst werden die Blätter bunt."
      ],
      [
        "Schnecke",
        "Tier",
        "Die Schnecke ist sehr langsam."
      ],
      [
        "Wind",
        "Wetter",
        "Der Wind weht den Drachen hoch."
      ],
      [
        "Schnee",
        "Wetter",
        "Im Winter fällt Schnee."
      ]
    ]
  },
  {
    "id": 4,
    "name": "Lessing 2b – Stufe 1",
    "icon": "🐝",
    "req": 75,
    "words": [
      [
        "da",
        "Wort",
        "Mein Vater ist da."
      ],
      [
        "du",
        "Wort",
        "Du bist mein Freund."
      ],
      [
        "Ei",
        "Essen",
        "Das Ei liegt im Nest."
      ],
      [
        "er",
        "Wort",
        "Er spielt mit dem Ball."
      ],
      [
        "es",
        "Wort",
        "Es regnet heute."
      ],
      [
        "im",
        "Wort",
        "Ich bin im Haus."
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
        "so",
        "Wort",
        "Das ist so schön."
      ],
      [
        "um",
        "Wort",
        "Wir treffen uns um acht Uhr."
      ],
      [
        "wo",
        "Wort",
        "Wo ist mein Buch?"
      ],
      [
        "als",
        "Wort",
        "Er ist größer als ich."
      ],
      [
        "alt",
        "Wort",
        "Der Baum ist sehr alt."
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
        "aus",
        "Wort",
        "Ich komme aus Deutschland."
      ],
      [
        "bei",
        "Wort",
        "Ich bin bei meiner Oma."
      ],
      [
        "Bub",
        "Person",
        "Der Bub spielt im Garten."
      ],
      [
        "das",
        "Wort",
        "Das ist mein Buch."
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
        "dir",
        "Wort",
        "Ich helfe dir."
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
        "eng",
        "Eigenschaft",
        "Die Schuhe sind zu eng."
      ],
      [
        "gut",
        "Eigenschaft",
        "Du hast das gut gemacht."
      ],
      [
        "Hai",
        "Tier",
        "Der Hai schwimmt im Meer."
      ],
      [
        "her",
        "Wort",
        "Komm bitte hierher."
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
        "ihr",
        "Wort",
        "Ist das ihr Buch?"
      ],
      [
        "Kuh",
        "Tier",
        "Die Kuh gibt Milch."
      ],
      [
        "Mai",
        "Monat",
        "Im Mai blühen viele Blumen."
      ],
      [
        "man",
        "Wort",
        "Man soll freundlich sein."
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
        "neu",
        "Eigenschaft",
        "Ich habe ein neues Buch."
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
        "Oma",
        "Familie",
        "Meine Oma backt einen Kuchen."
      ],
      [
        "Opa",
        "Familie",
        "Mein Opa erzählt Geschichten."
      ],
      [
        "rot",
        "Farbe",
        "Die Tomate ist rot."
      ],
      [
        "Tag",
        "Zeit",
        "Heute ist ein schöner Tag."
      ],
      [
        "tun",
        "Tätigkeit",
        "Was kann ich für dich tun?"
      ],
      [
        "Uhr",
        "Gegenstand",
        "Die Uhr zeigt acht Uhr."
      ],
      [
        "und",
        "Wort",
        "Ich esse Brot und Käse."
      ],
      [
        "vor",
        "Wort",
        "Ich stehe vor der Tür."
      ],
      [
        "was",
        "Wort",
        "Was möchtest du spielen?"
      ],
      [
        "Weg",
        "Ort",
        "Der Weg führt durch den Wald."
      ],
      [
        "wer",
        "Wort",
        "Wer spielt heute mit mir?"
      ],
      [
        "wir",
        "Wort",
        "Wir spielen zusammen."
      ],
      [
        "aber",
        "Wort",
        "Ich möchte spielen, aber es regnet."
      ],
      [
        "also",
        "Wort",
        "Also gehen wir jetzt nach Hause."
      ],
      [
        "Auge",
        "Körper",
        "Das Auge ist blau."
      ],
      [
        "Auto",
        "Fahrzeug",
        "Das Auto ist schnell."
      ]
    ]
  },
  {
    "id": 5,
    "name": "Lessing 2b – Stufe 2",
    "icon": "🐞",
    "req": 75,
    "words": [
      [
        "Baby",
        "Familie",
        "Das Baby schläft."
      ],
      [
        "Bank",
        "Gegenstand",
        "Wir sitzen auf der Bank."
      ],
      [
        "Baum",
        "Natur",
        "Der Baum ist sehr groß."
      ],
      [
        "Bein",
        "Körper",
        "Mein Bein tut weh."
      ],
      [
        "Bild",
        "Gegenstand",
        "Das Bild hängt an der Wand."
      ],
      [
        "blau",
        "Farbe",
        "Der Himmel ist blau."
      ],
      [
        "Brot",
        "Essen",
        "Ich esse ein Stück Brot."
      ],
      [
        "bunt",
        "Farbe",
        "Der Schmetterling ist bunt."
      ],
      [
        "Cent",
        "Geld",
        "Das kostet fünf Cent."
      ],
      [
        "dick",
        "Eigenschaft",
        "Das Buch ist dick."
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
        "eins",
        "Zahl",
        "Ich zähle bis eins."
      ],
      [
        "Ende",
        "Wort",
        "Das Ende der Geschichte ist schön."
      ],
      [
        "Ente",
        "Tier",
        "Die Ente schwimmt auf dem See."
      ],
      [
        "Erde",
        "Natur",
        "Die Erde ist unser Zuhause."
      ],
      [
        "Esel",
        "Tier",
        "Der Esel steht auf der Wiese."
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
        "Frau",
        "Person",
        "Die Frau liest ein Buch."
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
        "Gras",
        "Natur",
        "Das Gras ist grün."
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
        "Hemd",
        "Kleidung",
        "Mein Hemd ist blau."
      ],
      [
        "Hexe",
        "Person",
        "Die Hexe fliegt auf ihrem Besen."
      ],
      [
        "Igel",
        "Tier",
        "Der Igel schläft im Laub."
      ],
      [
        "Jahr",
        "Zeit",
        "Ein Jahr hat zwölf Monate."
      ],
      [
        "Juli",
        "Monat",
        "Im Juli sind Sommerferien."
      ],
      [
        "Juni",
        "Monat",
        "Im Juni scheint oft die Sonne."
      ],
      [
        "kalt",
        "Eigenschaft",
        "Im Winter ist es kalt."
      ],
      [
        "Kind",
        "Person",
        "Das Kind spielt im Garten."
      ],
      [
        "Kopf",
        "Körper",
        "Mein Kopf tut weh."
      ],
      [
        "laut",
        "Eigenschaft",
        "Die Musik ist laut."
      ],
      [
        "Maus",
        "Tier",
        "Die Maus frisst Käse."
      ],
      [
        "Mund",
        "Körper",
        "Mit dem Mund kann ich sprechen."
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
        "nein",
        "Wort",
        "Nein, ich möchte kein Eis."
      ],
      [
        "neun",
        "Zahl",
        "Ich zähle bis neun."
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
        "Rabe",
        "Tier",
        "Der Rabe sitzt auf dem Zaun."
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
        "Saft",
        "Essen",
        "Ich trinke einen Apfelsaft."
      ],
      [
        "Salz",
        "Essen",
        "Das Salz steht auf dem Tisch."
      ],
      [
        "Satz",
        "Sprache",
        "Ich schreibe einen schönen Satz."
      ],
      [
        "sehr",
        "Wort",
        "Das gefällt mir sehr."
      ],
      [
        "sein",
        "Wort",
        "Ich möchte freundlich sein."
      ],
      [
        "Sohn",
        "Familie",
        "Der Sohn spielt mit seinem Vater."
      ]
    ]
  },
  {
    "id": 6,
    "name": "Lessing 2b – Stufe 3",
    "icon": "🦋",
    "req": 75,
    "words": [
      [
        "Vase",
        "Gegenstand",
        "Die Vase steht auf dem Tisch."
      ],
      [
        "warm",
        "Eigenschaft",
        "Im Sommer ist es warm."
      ],
      [
        "weil",
        "Wort",
        "Ich freue mich, weil heute Sonntag ist."
      ],
      [
        "Wind",
        "Wetter",
        "Der Wind bewegt die Blätter."
      ],
      [
        "Wolf",
        "Tier",
        "Der Wolf läuft durch den Wald."
      ],
      [
        "Wort",
        "Sprache",
        "Das Wort steht im Buch."
      ],
      [
        "Zahl",
        "Mathematik",
        "Die Zahl ist zehn."
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
        "Zeit",
        "Zeit",
        "Es ist Zeit für die Schule."
      ],
      [
        "zwei",
        "Zahl",
        "Ich habe zwei Augen."
      ],
      [
        "ich",
        "Wort",
        "Ich spiele heute im Garten."
      ],
      [
        "die",
        "Wort",
        "Die Katze schläft."
      ],
      [
        "See",
        "Natur",
        "Die Ente schwimmt auf dem See."
      ],
      [
        "sie",
        "Wort",
        "Sie spielt mit ihrer Freundin."
      ],
      [
        "wie",
        "Wort",
        "Wie heißt du?"
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
        "Abend",
        "Wort",
        "Der Abend ist heute schön."
      ],
      [
        "Ampel",
        "Verkehr",
        "Die Ampel ist rot."
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
        "baden",
        "Tätigkeit",
        "Im Sommer gehen wir baden."
      ],
      [
        "bauen",
        "Tätigkeit",
        "Wir bauen einen Turm."
      ],
      [
        "Birne",
        "Obst",
        "Die Birne ist süß."
      ],
      [
        "Blume",
        "Natur",
        "Die Blume blüht im Frühling."
      ],
      [
        "Boden",
        "Natur",
        "Das Spielzeug liegt auf dem Boden."
      ],
      [
        "braun",
        "Farbe",
        "Der Hund ist braun."
      ],
      [
        "Clown",
        "Person",
        "Der Clown macht lustige Sachen."
      ],
      [
        "Feder",
        "Gegenstand",
        "Der Vogel hat eine Feder verloren."
      ],
      [
        "fremd",
        "Eigenschaft",
        "Der Mann ist mir fremd."
      ],
      [
        "Gabel",
        "Gegenstand",
        "Ich esse mit einer Gabel."
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
        "haben",
        "Tätigkeit",
        "Wir haben einen Hund."
      ],
      [
        "Hecke",
        "Natur",
        "Der Vogel sitzt in der Hecke."
      ],
      [
        "heute",
        "Zeit",
        "Heute gehe ich schwimmen."
      ],
      [
        "ihnen",
        "Wort",
        "Ich helfe ihnen."
      ],
      [
        "Junge",
        "Person",
        "Der Junge spielt Fußball."
      ],
      [
        "Katze",
        "Tier",
        "Die Katze schläft auf dem Sofa."
      ],
      [
        "Kiste",
        "Gegenstand",
        "Die Kiste ist voll."
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
        "krank",
        "Eigenschaft",
        "Heute bin ich krank."
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
        "leise",
        "Eigenschaft",
        "Bitte sei leise."
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
        "malen",
        "Tätigkeit",
        "Ich male ein buntes Bild."
      ],
      [
        "Monat",
        "Zeit",
        "Ein Monat hat viele Tage."
      ],
      [
        "Nadel",
        "Gegenstand",
        "Die Nadel ist sehr dünn."
      ],
      [
        "Nebel",
        "Wetter",
        "Am Morgen liegt Nebel über dem Feld."
      ],
      [
        "Onkel",
        "Familie",
        "Mein Onkel wohnt in München."
      ]
    ]
  },
  {
    "id": 7,
    "name": "Lessing 2b – Stufe 4",
    "icon": "🦉",
    "req": 75,
    "words": [
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
        "Platz",
        "Ort",
        "Wir spielen auf dem Platz."
      ],
      [
        "Raupe",
        "Tier",
        "Die Raupe kriecht auf dem Blatt."
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
        "rufen",
        "Tätigkeit",
        "Ich rufe meinen Freund."
      ],
      [
        "sagen",
        "Tätigkeit",
        "Ich möchte dir etwas sagen."
      ],
      [
        "sehen",
        "Tätigkeit",
        "Ich kann einen Vogel sehen."
      ],
      [
        "Seife",
        "Gegenstand",
        "Ich wasche meine Hände mit Seife."
      ],
      [
        "Sport",
        "Freizeit",
        "Ich mache gern Sport."
      ],
      [
        "Stein",
        "Natur",
        "Der Stein liegt auf dem Weg."
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
        "Tante",
        "Familie",
        "Meine Tante besucht uns."
      ],
      [
        "unter",
        "Wort",
        "Der Ball liegt unter dem Tisch."
      ],
      [
        "Vater",
        "Familie",
        "Mein Vater liest eine Zeitung."
      ],
      [
        "Vogel",
        "Tier",
        "Der Vogel fliegt hoch in den Himmel."
      ],
      [
        "warum",
        "Wort",
        "Warum lachst du?"
      ],
      [
        "wenig",
        "Wort",
        "Ich habe nur wenig Zeit."
      ],
      [
        "Wolke",
        "Wetter",
        "Eine weiße Wolke steht am Himmel."
      ],
      [
        "acht",
        "Zahl",
        "Ich bin acht Jahre alt."
      ],
      [
        "Buch",
        "Schule",
        "Ich lese ein spannendes Buch."
      ],
      [
        "dich",
        "Wort",
        "Ich sehe dich."
      ],
      [
        "doch",
        "Wort",
        "Doch, ich habe Zeit."
      ],
      [
        "alle",
        "Wort",
        "Alle Kinder spielen zusammen."
      ],
      [
        "Ball",
        "Spielzeug",
        "Der Ball liegt im Garten."
      ],
      [
        "denn",
        "Wort",
        "Was machst du denn?"
      ],
      [
        "Haar",
        "Körper",
        "Mein Haar ist braun."
      ],
      [
        "hell",
        "Eigenschaft",
        "Das Zimmer ist hell."
      ],
      [
        "Herr",
        "Person",
        "Der Herr wartet an der Tür."
      ],
      [
        "Mann",
        "Person",
        "Der Mann liest die Zeitung."
      ],
      [
        "Tier",
        "Natur",
        "Der Hund ist ein Tier."
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
        "wann",
        "Wort",
        "Wann gehen wir nach Hause?"
      ],
      [
        "böse",
        "Gefühl",
        "Der Junge ist böse."
      ],
      [
        "fünf",
        "Zahl",
        "Ich habe fünf Finger an einer Hand."
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
        "heiß",
        "Eigenschaft",
        "Der Tee ist heiß."
      ],
      [
        "Löwe",
        "Tier",
        "Der Löwe lebt in Afrika."
      ],
      [
        "März",
        "Monat",
        "Im März beginnt der Frühling."
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
        "weiß",
        "Farbe",
        "Der Schnee ist weiß."
      ],
      [
        "Ameise",
        "Tier",
        "Die Ameise trägt ein Blatt."
      ],
      [
        "August",
        "Monat",
        "Im August sind Sommerferien."
      ],
      [
        "backen",
        "Tätigkeit",
        "Wir backen einen Kuchen."
      ],
      [
        "Bruder",
        "Familie",
        "Mein Bruder spielt Fußball."
      ],
      [
        "danken",
        "Tätigkeit",
        "Ich möchte dir danken."
      ],
      [
        "denken",
        "Tätigkeit",
        "Ich muss gut nachdenken."
      ],
      [
        "dunkel",
        "Eigenschaft",
        "Der Himmel ist dunkel."
      ],
      [
        "Eltern",
        "Familie",
        "Meine Eltern sind zu Hause."
      ],
      [
        "fahren",
        "Tätigkeit",
        "Wir fahren mit dem Auto."
      ]
    ]
  },
  {
    "id": 8,
    "name": "Lessing 2b – Stufe 5",
    "icon": "🦊",
    "req": 75,
    "words": [
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
        "fragen",
        "Tätigkeit",
        "Ich möchte etwas fragen."
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
        "Garten",
        "Natur",
        "Im Garten spielen die Kinder."
      ],
      [
        "gesund",
        "Eigenschaft",
        "Obst und Gemüse sind gesund."
      ],
      [
        "helfen",
        "Tätigkeit",
        "Ich helfe meiner Mutter."
      ],
      [
        "Herbst",
        "Jahreszeit",
        "Im Herbst fallen die Blätter."
      ],
      [
        "hinter",
        "Wort",
        "Der Ball liegt hinter dem Schrank."
      ],
      [
        "Januar",
        "Monat",
        "Im Januar ist es oft kalt."
      ],
      [
        "Kaiser",
        "Person",
        "Der Kaiser trägt eine Krone."
      ],
      [
        "kaufen",
        "Tätigkeit",
        "Wir kaufen frisches Brot."
      ],
      [
        "laufen",
        "Tätigkeit",
        "Ich laufe schnell."
      ],
      [
        "lernen",
        "Tätigkeit",
        "Ich lerne Deutsch."
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
        "nehmen",
        "Tätigkeit",
        "Ich nehme einen Apfel."
      ],
      [
        "Ostern",
        "Fest",
        "Zu Ostern suchen wir Eier."
      ],
      [
        "Pinsel",
        "Schule",
        "Mit dem Pinsel male ich ein Bild."
      ],
      [
        "quaken",
        "Tierlaut",
        "Die Frösche quaken am Teich."
      ],
      [
        "reisen",
        "Tätigkeit",
        "Wir reisen in den Urlaub."
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
        "sparen",
        "Tätigkeit",
        "Ich spare mein Taschengeld."
      ],
      [
        "stehen",
        "Tätigkeit",
        "Das Fahrrad steht vor dem Haus."
      ],
      [
        "Stunde",
        "Zeit",
        "Eine Stunde hat sechzig Minuten."
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
        "turnen",
        "Sport",
        "Die Kinder turnen in der Turnhalle."
      ],
      [
        "warten",
        "Tätigkeit",
        "Ich warte auf den Bus."
      ],
      [
        "weiter",
        "Wort",
        "Wir gehen jetzt weiter."
      ],
      [
        "werden",
        "Tätigkeit",
        "Ich werde bald acht Jahre alt."
      ],
      [
        "Winter",
        "Jahreszeit",
        "Im Winter fällt manchmal Schnee."
      ],
      [
        "wohnen",
        "Tätigkeit",
        "Wir wohnen in Deutschland."
      ],
      [
        "Wurzel",
        "Natur",
        "Der Baum hat eine große Wurzel."
      ],
      [
        "zahlen",
        "Tätigkeit",
        "Wir zahlen an der Kasse."
      ],
      [
        "zeigen",
        "Tätigkeit",
        "Ich möchte dir mein Bild zeigen."
      ],
      [
        "Zucker",
        "Essen",
        "Der Zucker ist süß."
      ],
      [
        "Bauch",
        "Körper",
        "Mein Bauch ist voll."
      ],
      [
        "durch",
        "Wort",
        "Wir gehen durch den Wald."
      ],
      [
        "Licht",
        "Gegenstand",
        "Das Licht ist hell."
      ],
      [
        "Nacht",
        "Zeit",
        "In der Nacht schlafe ich."
      ],
      [
        "nicht",
        "Wort",
        "Ich bin heute nicht müde."
      ],
      [
        "reich",
        "Eigenschaft",
        "Der König ist reich."
      ],
      [
        "sechs",
        "Zahl",
        "Ich habe sechs Buntstifte."
      ],
      [
        "Woche",
        "Zeit",
        "Eine Woche hat sieben Tage."
      ],
      [
        "Biene",
        "Tier",
        "Die Biene fliegt zur Blume."
      ],
      [
        "Blatt",
        "Natur",
        "Das Blatt fällt vom Baum."
      ],
      [
        "Brief",
        "Gegenstand",
        "Ich schreibe einen Brief."
      ],
      [
        "essen",
        "Tätigkeit",
        "Wir essen zusammen."
      ],
      [
        "immer",
        "Wort",
        "Ich spiele immer gern."
      ],
      [
        "Pizza",
        "Essen",
        "Ich esse gern Pizza."
      ],
      [
        "Puppe",
        "Spielzeug",
        "Das Mädchen spielt mit ihrer Puppe."
      ]
    ]
  },
  {
    "id": 9,
    "name": "Lessing 2b – Stufe 6",
    "icon": "🐬",
    "req": 75,
    "words": [
      [
        "Sonne",
        "Wetter",
        "Die Sonne scheint heute."
      ],
      [
        "still",
        "Eigenschaft",
        "Im Unterricht bin ich still."
      ],
      [
        "Teddy",
        "Spielzeug",
        "Mein Teddy liegt auf dem Bett."
      ],
      [
        "Wiese",
        "Natur",
        "Auf der Wiese wachsen viele Blumen."
      ],
      [
        "Ziege",
        "Tier",
        "Die Ziege frisst Gras."
      ],
      [
        "Blüte",
        "Natur",
        "Die Biene sitzt auf der Blüte."
      ],
      [
        "Käfer",
        "Tier",
        "Der Käfer krabbelt auf dem Blatt."
      ],
      [
        "zwölf",
        "Zahl",
        "Ein Jahr hat zwölf Monate."
      ],
      [
        "Aufgabe",
        "Schule",
        "Ich mache meine Aufgabe."
      ],
      [
        "bewegen",
        "Tätigkeit",
        "Wir bewegen unsere Arme."
      ],
      [
        "bleiben",
        "Tätigkeit",
        "Wir bleiben heute zu Hause."
      ],
      [
        "bringen",
        "Tätigkeit",
        "Ich bringe dir ein Buch."
      ],
      [
        "Februar",
        "Monat",
        "Der Februar ist ein Wintermonat."
      ],
      [
        "Fenster",
        "Haus",
        "Ich öffne das Fenster."
      ],
      [
        "Freitag",
        "Wochentag",
        "Am Freitag ist die Schule vorbei."
      ],
      [
        "gestern",
        "Zeit",
        "Gestern war ich im Park."
      ],
      [
        "Lexikon",
        "Buch",
        "Im Lexikon stehen viele Wörter."
      ],
      [
        "Oktober",
        "Monat",
        "Im Oktober ist Herbst."
      ],
      [
        "Partner",
        "Person",
        "Mein Partner hilft mir beim Spiel."
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
        "Quadrat",
        "Form",
        "Das Quadrat hat vier Ecken."
      ],
      [
        "Samstag",
        "Wochentag",
        "Am Samstag spiele ich draußen."
      ],
      [
        "Telefon",
        "Gegenstand",
        "Das Telefon klingelt."
      ],
      [
        "trinken",
        "Tätigkeit",
        "Ich trinke ein Glas Wasser."
      ],
      [
        "Verkehr",
        "Verkehr",
        "Im Verkehr muss man gut aufpassen."
      ],
      [
        "Frucht",
        "Essen",
        "Der Apfel ist eine Frucht."
      ],
      [
        "leicht",
        "Eigenschaft",
        "Die Tasche ist leicht."
      ],
      [
        "machen",
        "Tätigkeit",
        "Ich mache meine Hausaufgaben."
      ],
      [
        "suchen",
        "Tätigkeit",
        "Ich suche meinen Schlüssel."
      ],
      [
        "bitten",
        "Tätigkeit",
        "Ich möchte dich um Hilfe bitten."
      ],
      [
        "fallen",
        "Tätigkeit",
        "Die Blätter fallen vom Baum."
      ],
      [
        "Himmel",
        "Natur",
        "Die Wolken sind am Himmel."
      ],
      [
        "Klasse",
        "Schule",
        "Unsere Klasse ist sehr nett."
      ],
      [
        "kommen",
        "Tätigkeit",
        "Meine Freunde kommen heute."
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
        "Mutter",
        "Familie",
        "Meine Mutter liest ein Buch."
      ],
      [
        "Quelle",
        "Natur",
        "Das Wasser kommt aus einer Quelle."
      ],
      [
        "rollen",
        "Tätigkeit",
        "Der Ball kann über den Boden rollen."
      ],
      [
        "sieben",
        "Zahl",
        "Eine Woche hat sieben Tage."
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
        "Wasser",
        "Natur",
        "Ich trinke ein Glas Wasser."
      ],
      [
        "Wetter",
        "Wetter",
        "Das Wetter ist heute schön."
      ],
      [
        "wieder",
        "Wort",
        "Morgen sehen wir uns wieder."
      ],
      [
        "wollen",
        "Tätigkeit",
        "Wir wollen draußen spielen."
      ],
      [
        "Zimmer",
        "Haus",
        "Mein Zimmer ist aufgeräumt."
      ],
      [
        "Busch",
        "Natur",
        "Der Vogel sitzt im Busch."
      ],
      [
        "Schaf",
        "Tier",
        "Das Schaf frisst grünes Gras."
      ],
      [
        "schon",
        "Wort",
        "Ich bin schon fertig."
      ],
      [
        "Tisch",
        "Möbel",
        "Das Buch liegt auf dem Tisch."
      ],
      [
        "blühen",
        "Natur",
        "Die Blumen blühen im Garten."
      ],
      [
        "dürfen",
        "Tätigkeit",
        "Wir dürfen draußen spielen."
      ],
      [
        "Flügel",
        "Körper",
        "Der Vogel hat zwei Flügel."
      ]
    ]
  },
  {
    "id": 10,
    "name": "Lessing 2b – Stufe 7",
    "icon": "🏆",
    "req": 75,
    "words": [
      [
        "Gemüse",
        "Essen",
        "Ich esse gern Gemüse."
      ],
      [
        "heißen",
        "Tätigkeit",
        "Ich heiße Anna."
      ],
      [
        "Körper",
        "Körper",
        "Mein Körper ist stark."
      ],
      [
        "Rücken",
        "Körper",
        "Mein Rücken ist gerade."
      ],
      [
        "zählen",
        "Mathematik",
        "Ich kann bis hundert zählen."
      ],
      [
        "arbeiten",
        "Tätigkeit",
        "Meine Mutter muss heute arbeiten."
      ],
      [
        "Computer",
        "Gegenstand",
        "Ich lerne am Computer."
      ],
      [
        "Dezember",
        "Monat",
        "Im Dezember feiern wir Weihnachten."
      ],
      [
        "November",
        "Monat",
        "Im November wird es kalt."
      ],
      [
        "Gesicht",
        "Körper",
        "Ich wasche mein Gesicht."
      ],
      [
        "rechnen",
        "Schule",
        "Ich kann gut rechnen."
      ],
      [
        "Strauch",
        "Natur",
        "Der Vogel sitzt im Strauch."
      ],
      [
        "Tochter",
        "Familie",
        "Die Tochter spielt im Garten."
      ],
      [
        "Familie",
        "Familie",
        "Meine Familie ist sehr nett."
      ],
      [
        "fliegen",
        "Tätigkeit",
        "Der Vogel kann fliegen."
      ],
      [
        "Sonntag",
        "Wochentag",
        "Am Sonntag besuchen wir Oma."
      ],
      [
        "spielen",
        "Tätigkeit",
        "Die Kinder spielen im Garten."
      ],
      [
        "stellen",
        "Tätigkeit",
        "Ich stelle das Glas auf den Tisch."
      ],
      [
        "Zwiebel",
        "Gemüse",
        "Die Zwiebel liegt in der Küche."
      ],
      [
        "frisch",
        "Eigenschaft",
        "Das Brot ist frisch."
      ],
      [
        "Schere",
        "Schule",
        "Mit der Schere schneide ich Papier."
      ],
      [
        "Schule",
        "Schule",
        "Ich gehe jeden Morgen in die Schule."
      ],
      [
        "Tasche",
        "Gegenstand",
        "Meine Tasche steht neben dem Tisch."
      ],
      [
        "Stängel",
        "Natur",
        "Die Blume hat einen langen Stängel."
      ],
      [
        "antworten",
        "Tätigkeit",
        "Ich kann die Frage beantworten."
      ],
      [
        "Füller",
        "Schule",
        "Ich schreibe mit meinem Füller."
      ],
      [
        "können",
        "Tätigkeit",
        "Ich kann gut schwimmen."
      ],
      [
        "müssen",
        "Tätigkeit",
        "Ich muss meine Zähne putzen."
      ],
      [
        "September",
        "Monat",
        "Im September beginnt die Schule."
      ],
      [
        "brauchen",
        "Tätigkeit",
        "Ich brauche einen Stift."
      ],
      [
        "sprechen",
        "Tätigkeit",
        "Wir sprechen Deutsch."
      ],
      [
        "Dienstag",
        "Wochentag",
        "Am Dienstag gehe ich zur Schule."
      ],
      [
        "schön",
        "Eigenschaft",
        "Die Blume ist schön."
      ],
      [
        "Quatsch",
        "Wort",
        "Wir machen keinen Quatsch."
      ],
      [
        "schauen",
        "Tätigkeit",
        "Wir schauen einen Film."
      ],
      [
        "schwarz",
        "Farbe",
        "Die Katze ist schwarz."
      ],
      [
        "waschen",
        "Tätigkeit",
        "Ich wasche meine Hände."
      ],
      [
        "Frühling",
        "Jahreszeit",
        "Im Frühling blühen die Blumen."
      ],
      [
        "Schnee",
        "Wetter",
        "Im Winter liegt Schnee auf dem Boden."
      ],
      [
        "Mädchen",
        "Person",
        "Das Mädchen spielt mit einer Puppe."
      ],
      [
        "flüssig",
        "Eigenschaft",
        "Wasser ist flüssig."
      ],
      [
        "aufpassen",
        "Tätigkeit",
        "Ich muss im Unterricht aufpassen."
      ],
      [
        "Mittwoch",
        "Wochentag",
        "Am Mittwoch gehe ich zum Sport."
      ],
      [
        "scheinen",
        "Tätigkeit",
        "Die Sonne scheint heute."
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
        "schnell",
        "Eigenschaft",
        "Der Hase läuft schnell."
      ],
      [
        "Donnerstag",
        "Wochentag",
        "Am Donnerstag habe ich Sport."
      ],
      [
        "schneiden",
        "Tätigkeit",
        "Ich schneide das Papier."
      ],
      [
        "schreiben",
        "Schule",
        "Ich schreibe einen Brief."
      ],
      [
        "Schwester",
        "Familie",
        "Meine Schwester spielt mit mir."
      ],
      [
        "schreien",
        "Tätigkeit",
        "Bitte nicht so laut schreien."
      ],
      [
        "wünschen",
        "Tätigkeit",
        "Ich wünsche mir ein Fahrrad."
      ],
      [
        "Weihnachten",
        "Fest",
        "Zu Weihnachten bekommen wir Geschenke."
      ]
    ]
  }
];
const LEVELS = RAW.map(l => ({ ...l, words: l.words.map(([w, cat, s]) =>
  ({ w, cat, s, diff: w.length <= 5 ? "leicht" : w.length <= 8 ? "mittel" : "schwer" })) }));
