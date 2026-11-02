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
];
const LEVELS = RAW.map(l => ({ ...l, words: l.words.map(([w, cat, s]) =>
  ({ w, cat, s, diff: w.length <= 5 ? "leicht" : w.length <= 8 ? "mittel" : "schwer" })) }));
