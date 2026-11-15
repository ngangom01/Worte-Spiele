/* WORT-ABENTEUER – Wortschatz-Kern (V6)
   ------------------------------------------------------------------
   Verwaltet die Sprachstufen (GER/CEFR), die Lerninhalte pro Profil („Tracks“) und Erweiterungspakete.
   Wird NACH words.js geladen. Reine Daten-Logik ohne DOM-Zugriff (auch in Node/Tests nutzbar).

   NEUE STUFE HINZUFÜGEN (z. B. B2 oder C1), ohne Code zu ändern und ohne bestehenden Fortschritt zu berühren:
     1. Datei vocab-packs/words-b2.js nach dem Muster von vocab-packs/TEMPLATE-pack.js anlegen
        (registerLevels([...]) mit neuen Level-IDs, z. B. 16–25 für B2, 26–35 für C1).
     2. In index.html ein <script src="vocab-packs/words-b2.js"></script> NACH artikel.js einfügen
        und die Datei in service-worker.js (FILES) eintragen.
     3. Fertig: Die Stufe erscheint automatisch in den Level-Karten, Spielen, Lernwelten und im Eltern-Dashboard.
   Bestehende Level-IDs und alle Spielstände (Sterne, Freischaltungen, Wortstatistik) bleiben unverändert. */
const CEFR_BANDS = [
  { id: "A1", de: "Anfänger", en: "Beginner" },
  { id: "A2", de: "Grundlegende Kenntnisse", en: "Elementary" },
  { id: "B1", de: "Fortgeschrittene Sprachverwendung", en: "Intermediate" },
  { id: "B2", de: "Selbstständige Sprachverwendung", en: "Upper intermediate" },
  { id: "C1", de: "Fachkundige Sprachkenntnisse", en: "Advanced" },
  { id: "C2", de: "Annähernd muttersprachlich", en: "Proficient" },
];
// Zuordnung der mitgelieferten Level aus words.js (unverändert): 1–7 = A1, 8–10 = A2, 11–15 = B1.
const legacyBand = (id) => (id <= 7 ? "A1" : id <= 10 ? "A2" : "B1");
LEVELS.forEach((l) => {
  if (!l.cefr) l.cefr = legacyBand(l.id);
});

const VOCAB_PACKS = []; // Namen der geladenen Erweiterungspakete (für Diagnose / Dashboard)
// Prüft und ergänzt Level. Rückgabe: { added: [...ids], errors: [...], warnings: [...] }. Fehlerhafte Level werden übersprungen.
function registerLevels(levels, packName) {
  const result = { added: [], errors: [], warnings: [] };
  (levels || []).forEach((raw) => {
    const where = `Level ${raw && raw.id}`;
    if (!raw || !Number.isInteger(raw.id) || raw.id < 1) return result.errors.push(`${where}: id muss eine ganze Zahl ≥ 1 sein`);
    if (LEVELS.some((l) => l.id === raw.id)) return result.errors.push(`${where}: id ist bereits vergeben`);
    if (!CEFR_BANDS.some((b) => b.id === raw.cefr)) return result.errors.push(`${where}: cefr muss A1–C2 sein`);
    if (!raw.name || !Array.isArray(raw.words) || !raw.words.length) return result.errors.push(`${where}: name und words fehlen`);
    const words = [];
    raw.words.forEach((entry, i) => {
      const [w, cat, s, art] = Array.isArray(entry) ? entry : [entry.w, entry.cat, entry.s, entry.art];
      if (!w || !cat || !s) return result.warnings.push(`${where}, Wort ${i + 1}: Wort, Kategorie und Beispielsatz sind nötig`);
      if (!s.includes(w) && !s.toLowerCase().includes(String(w).toLowerCase().slice(0, 4)))
        result.warnings.push(`${where}: Beispielsatz enthält „${w}“ nicht (Satz-Abenteuer braucht das Wort im Satz)`);
      const word = { w, cat, s, diff: w.length <= 5 ? "leicht" : w.length <= 8 ? "mittel" : "schwer" };
      if (["der", "die", "das"].includes(art)) word.art = art;
      else if (typeof ARTICLES !== "undefined" && ARTICLES[w]) word.art = ARTICLES[w];
      words.push(word);
    });
    if (!words.length) return result.errors.push(`${where}: keine gültigen Wörter`);
    LEVELS.push({ id: raw.id, name: raw.name, icon: raw.icon || "📘", req: raw.req === undefined ? 75 : raw.req, cefr: raw.cefr, words, pack: packName || "" });
    result.added.push(raw.id);
  });
  LEVELS.sort((a, b) => a.id - b.id);
  if (packName && result.added.length) VOCAB_PACKS.push(packName);
  if (typeof console !== "undefined") [...result.errors, ...result.warnings].forEach((m) => console.warn("[Wortpaket " + (packName || "?") + "] " + m));
  return result;
}

/* Lerninhalt pro Profil. bands: null = alle Stufen. Neue Stufen (B2, C1 …) sind in „alle“ automatisch enthalten. */
const TRACKS = {
  grundschule: { de: "Grundschule (A1–A2, Klasse 2)", en: "Primary school (A1–A2, Grade 2)", bands: ["A1", "A2"] },
  b1: { de: "Deutsch B1 (Lernende)", en: "German B1 (learners)", bands: ["B1"] },
  alle: { de: "Alle Stufen", en: "All levels", bands: null },
};
function registerTrack(id, def) {
  if (id && def && (def.bands === null || Array.isArray(def.bands))) TRACKS[id] = def;
}
const DEFAULT_TRACK = "alle";
const trackLevels = (trackId) => {
  const t = TRACKS[trackId] || TRACKS[DEFAULT_TRACK];
  return LEVELS.filter((l) => !t.bands || t.bands.includes(l.cefr));
};
// Stufen, in denen es tatsächlich Wörter gibt (in Reihenfolge A1 → C2).
const presentBands = () => CEFR_BANDS.filter((b) => LEVELS.some((l) => l.cefr === b.id));
const levelById = (id) => LEVELS.find((l) => l.id === id);
if (typeof module !== "undefined") module.exports = { CEFR_BANDS, registerLevels, registerTrack, TRACKS, trackLevels, presentBands, levelById, VOCAB_PACKS };
