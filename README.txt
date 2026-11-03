WORT-ABENTEUER — VERSION 3: MY LEARNING WORLD

START
Extract the package and keep all files together. Open index.html in a modern browser, or host the folder on GitHub Pages. Google Drive sync requires HTTPS and an internet connection.

VERSION 2 GAME MODES (PRESERVED)
The home screen offers five games using the existing words.js vocabulary:
- Hören & Schreiben: listen to the German word, then spell it.
- Bilder-Detektiv: use a friendly emoji picture and category clue to identify a word.
- Fehlende Buchstaben: type the letters missing from the displayed word.
- Buchstaben-Mix: tap letter tiles in the correct order; tap a selected tile to return it.
- Satz-Abenteuer: listen to a sentence with the answer omitted, then enter the missing word.

Choose Leicht, Mittel, or Knifflig before starting. Difficulty is estimated from word length and spelling features, including umlauts and ß. The game chooses words randomly and remembers recent words per mode to reduce repetition. Every eligible word comes from the preserved vocabulary file; picture clues use built-in emoji/category matching and require no external API.

VERSION 3: MY LEARNING WORLD
The home screen includes five worlds: Tierwelt (Animals), Schulwelt (School), Naturwelt (Nature), Alltagswelt (Everyday Life), and Wortmeister-Welt (Word Master). Each world contains levels of 10 words. The vocabulary is grouped using the existing category and spelling data; the Word Master world revisits challenging spellings. A level needs at least one star to unlock the next level. Level stars use first-try correct answers: 1 star for 5–6, 2 for 7–8, and 3 for 9–10. Children may retry missed words, but those retries do not increase the level's star count. Completed levels can be replayed.

The daily challenge contains 10 randomly selected words and is stored by the browser's local date. Refreshing the page keeps the same word set for that date. Completing it awards 50 points. Smart Revision offers difficult words, recently incorrect words, and mastered words. Words remain on the revision list until they have been correct in three separate rounds.

V3 achievements are shown in the dedicated trophy cabinet. The Parent Dashboard asks for a PIN (default 1234); change it in Settings. The dashboard has a Leicht/Mittel/Knifflig difficulty filter and shows practice totals, accuracy, completed levels, points, daily/weekly activity, and difficult/repeatedly missed words. The dashboard and Settings screens have a DE/EN language toggle. Settings progress reset requires the parent PIN and an additional confirmation.

Progress remains in the existing localStorage record, retaining V1/V2 data. V3 worlds, stars, mastery, daily challenge, achievements, language and parent PIN are saved alongside it. Google Drive sync and JSON backup include these additions as part of the saved progress.

SCORING
A correct answer without a hint or previous mistake earns 15 points. A correct answer after a hint or another attempt earns 10 points. Every three consecutive correct answers adds a 10-point bonus. Wrong answers never subtract points; the child can retry as often as needed. After the third wrong answer to a question, the game offers to reveal the correct word; revealing it awards no points and lets the child continue. Existing level and daily challenges, rewards, parent dashboard, local progress, backup and Google Drive sync remain available.

PROGRESS AND SYNC
Progress continues to use the existing local storage record, preserving V1 scores, level unlocks, stars, word results, settings and dashboard history. As before, use the Settings page to export/import a backup or configure Google Drive. For Drive setup, create a Google OAuth Web Client ID, enable the Google Drive API, and authorize the hosted site origin. Enter the Client ID in Settings on each device and sync with the same Google account. Device sync compares timestamps and loads the newer saved copy; it does not merge divergent changes.

FILES
- index.html: app entry point and Google sign-in script
- app.js: V1/V2 modes, five V3 worlds, achievements, revision, bilingual parent dashboard/settings and Drive sync
- words.js: original vocabulary dataset (preserved)
- style.css: responsive visual design and game controls
- service-worker.js: offline cache (V3 cache version)
- manifest.json: installable app metadata
- drive-config.js: optional OAuth Client ID fallback
