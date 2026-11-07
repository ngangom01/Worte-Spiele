/* WORT-ABENTEUER – Artikel-Daten (der / die / das) für alle Nomen der Wortliste.
   Mehrdeutige Wörter (z. B. „See“: der See / die See) und reine Mehrzahl-Wörter (Berge, Leute, Eltern …)
   stehen bewusst NICHT in dieser Liste, damit der Artikel-Detektiv eindeutig bleibt.
   Neues Wort ergänzen: einfach in die passende Zeile schreiben. */
const ARTICLE_DATA = {
  der: `Hund Bär Wolf Fuchs Fisch Vogel Hase Löwe Affe Esel Tiger Igel Stift Lehrer Radiergummi Ranzen Baum Regen Himmel Garten
    Schmetterling Regenbogen Wald Frühling Herbst Wind Schnee Ast Bub Hai Mai Tag Weg Cent Euro Kopf Mund Name Rabe Ring Rock Saft
    Satz Sohn Zahn Fuß Abend Apfel April Boden Clown Junge Monat Nebel Onkel Platz Sport Stein Stern Vater Ball Herr Mann März
    August Bruder Finger Freund Januar Kaiser Montag Pinsel Winter Zucker Bauch Brief Teddy Käfer Februar Freitag Oktober Partner
    Samstag Verkehr Sommer Busch Tisch Flügel Körper Rücken Computer Dezember November Strauch Sonntag Stängel Füller September
    Dienstag Quatsch Mittwoch Donnerstag Juli Juni Opa Umzug Haushalt Vermieter Vertrag Lebenslauf Kollege Termin Vorschlag
    Vorteil Nachteil`,
  die: `Katze Maus Ente Kuh Ziege Biene Schule Klasse Tafel Tasche Kreide Pause Schere Blume Wolke Sonne Wiese Blumenwiese Schnecke
    Oma Uhr Bank Dose Erde Eule Frau Hexe Nase Vase Zahl Zeit Ampel Birne Feder Gabel Hecke Kiste Nadel Raupe Seife Tante Ameise
    Stunde Tomate Wurzel Nacht Woche Pizza Puppe Blüte Aufgabe Pflanze Frucht Mutter Quelle Tochter Familie Zwiebel Schwester
    Miete Nachbarschaft Heizung Reparatur Bewerbung Ausbildung Erfahrung Arbeitszeit Voraussetzung Vereinbarung Verschiebung
    Beschwerde Rückmeldung Einladung Meinung Entscheidung Verantwortung Möglichkeit Öffentlichkeit Entwicklung Umwelt Ernährung
    Bewegung Gesundheit Maßnahme Ursache Folge Veränderung Lösung`,
  das: `Pferd Schaf Heft Buch Lineal Fenster Mäppchen Turnen Papier Wasser Ei Eis Auge Auto Baby Bein Bild Brot Ende Feld Geld Gras
    Haus Hemd Jahr Kind Obst Salz Wort Kleid Haar Tier Licht Blatt Lexikon Quadrat Telefon Wetter Zimmer Gemüse Gesicht Mädchen
    Vorstellungsgespräch Missverständnis Verhalten`,
};
const ARTICLES = {};
Object.entries(ARTICLE_DATA).forEach(([article, list]) => list.split(/\s+/).filter(Boolean).forEach((word) => (ARTICLES[word] = article)));
LEVELS.forEach((level) =>
  level.words.forEach((word) => {
    if (ARTICLES[word.w]) word.art = ARTICLES[word.w];
  }),
);
