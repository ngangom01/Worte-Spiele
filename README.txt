WORT-ABENTEUER — VERSION 2

START
Extract the package and keep all files together. Open index.html in a modern browser, or host the folder on GitHub Pages. Google Drive sync requires HTTPS and an internet connection.

VERSION 2 GAME MODES
The home screen offers five games using the existing words.js vocabulary:
- Hören & Schreiben: listen to the German word, then spell it.
- Bilder-Detektiv: use a friendly emoji picture and category clue to identify a word.
- Fehlende Buchstaben: type the letters missing from the displayed word.
- Buchstaben-Mix: tap letter tiles in the correct order; tap a selected tile to return it.
- Satz-Abenteuer: listen to a sentence with the answer omitted, then enter the missing word.

Choose Leicht, Mittel, or Knifflig before starting. Difficulty is estimated from word length and spelling features, including umlauts and ß. The game chooses words randomly and remembers recent words per mode to reduce repetition. Every eligible word comes from the preserved vocabulary file; picture clues use built-in emoji/category matching and require no external API.

SCORING
A correct answer without a hint or previous mistake earns 15 points. A correct answer after a hint or another attempt earns 10 points. Every three consecutive correct answers adds a 10-point bonus. Wrong answers never subtract points; the child can retry as often as needed. Existing level and daily challenges, rewards, parent dashboard, local progress, backup and Google Drive sync remain available.

PROGRESS AND SYNC
Progress continues to use the existing local storage record, preserving V1 scores, level unlocks, stars, word results, settings and dashboard history. As before, use the Settings page to export/import a backup or configure Google Drive. For Drive setup, create a Google OAuth Web Client ID, enable the Google Drive API, and authorize the hosted site origin. Enter the Client ID in Settings on each device and sync with the same Google account. Device sync compares timestamps and loads the newer saved copy; it does not merge divergent changes.

FILES
- index.html: app entry point and Google sign-in script
- app.js: home, five game modes, round/scoring logic, dashboard, settings and Drive sync
- words.js: original vocabulary dataset (preserved)
- style.css: responsive visual design and game controls
- service-worker.js: offline cache (V2 cache version)
- manifest.json: installable app metadata
- drive-config.js: optional OAuth Client ID fallback
