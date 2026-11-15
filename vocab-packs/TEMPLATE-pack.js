/* VORLAGE für ein Wortpaket (z. B. B2 oder C1). Nicht geladen, solange sie nicht in index.html steht.
   Kopiere diese Datei nach vocab-packs/words-b2.js und ersetze die Beispiele.

   Regeln:
   - id: neue, noch nie vergebene Zahl. Empfehlung: B2 = 16–25, C1 = 26–35, C2 = 36–45. words.js belegt 1–15.
   - cefr: "B2", "C1" … (siehe CEFR_BANDS in vocab-core.js)
   - req: nötige Trefferquote in % im vorherigen Level, um dieses freizuschalten (Standard 75)
   - Wort: [Wort, Kategorie, Beispielsatz, (optional) Artikel "der"|"die"|"das"]; Nomen groß schreiben.
     Der Beispielsatz muss das Wort genau so enthalten (für das Satz-Abenteuer).
   Danach prüfen:  node tools/check-vocab.js   */
registerLevels(
  [
    {
      id: 16,
      cefr: "B2",
      name: "Deutsch B2 – Beispiel",
      icon: "📘",
      req: 75,
      words: [
        ["Beispiel", "Allgemein", "Ein Beispiel hilft beim Verstehen.", "das"],
        // ... mindestens 10 Wörter pro Level, besser 20–30
      ],
    },
  ],
  "b2",
);
// Optional: eigener Lerninhalt nur für diese Stufe (erscheint in den Einstellungen)
// registerTrack("b2", { de: "Deutsch B2", en: "German B2", bands: ["B2"] });
