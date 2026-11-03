WORT-ABENTEUER — VERSION 4: SMART LEARNING & REWARDS

START
Keep all files together and open index.html in a modern browser, or host the folder on GitHub Pages. Google Drive sync requires HTTPS and an internet connection. The app uses vanilla HTML, CSS and JavaScript and has no paid services or external backend.

VOCABULARY AND GAME MODES
The original words.js textbook vocabulary is preserved. Every existing level, world and game mode continues to use this library, including the Lessing Schule 2b vocabulary. The five modes are Hören & Schreiben, Bilder-Detektiv, Fehlende Buchstaben, Buchstaben-Mix and Satz-Abenteuer. Each game uses Leicht, Mittel or Knifflig and offers encouraging feedback, hints and touch-friendly controls.

V4 SMART LEARNING
Word-level records track attempts, right and wrong answers, last practice date, a difficulty score and a learning status: New, Learning, Difficult or Mastered. Difficult and due words are prioritized in regular practice. Wrong answers schedule a review for the following day and are repeated later in the same round; correct answers advance spaced reviews through 1, 3, 7 and 14 days. Three correct practice rounds can mark a word mastered. Difficulty adjusts gradually from first-try accuracy and remains bounded between Leicht and Knifflig. No words are permanently skipped.

PROFILES
The home screen has three independent child profiles. Each profile keeps its own scores, progress, avatar, coins, review schedule and goals. Switch profiles from the selector on the home screen. Existing V1–V3 progress is migrated into the first profile; the other profiles start separately.

WORD COINS AND AVATARS
A completed practice round earns 5 Word Coins; a five-answer clean streak earns a 2-coin bonus; completing the daily challenge adds 10 coins; completing all levels in a learning world adds 20 coins. The virtual shop offers avatar accessories, mascot decorations, backgrounds and celebration effects. Coins are virtual only and cannot be purchased. Choose Fox, Cat, Rabbit, Panda or Unicorn from rewards/shop.

SPELLING FEEDBACK
After an incorrect attempt, the game explains likely differences such as umlauts, ß/ss, ie/ei, double consonants, letter groups or noun capitalization. It does not show the answer until the child has attempted it; after three wrong tries the existing answer reveal remains available.

PARENT DASHBOARD AND GOALS
Open the Parent Dashboard from Home; the default PIN is 1234 and can be changed in Settings. The dashboard keeps the V3 level/difficulty filters and word list, and adds weekly charts, practice time, newly mastered words, due revisions, accuracy change and spelling category strengths/weaknesses. Parents can select a daily goal of 5, 10, 15 or 20 minutes in Settings; changing it requires the parent PIN.

PROGRESS, BACKUP AND SYNC
Progress is stored locally in the browser and separated by profile. The Settings screen can export or import a JSON backup containing all profiles. To move data manually, download the backup, place it in Google Drive, then import it on another device. Google Drive sync remains available in Settings and uses the same OAuth Web Client ID and Google account on each device. Drive chooses the newest saved copy; simultaneous divergent edits are not merged.

CLASSIC LEVELS AND WORLD MAP
The Home screen’s progress summary combines activity from all games. The older classic V1 level list is retained in a collapsible section. V3 learning worlds, stars, daily challenge, achievements and revision activities remain available.

FILES
- index.html: app entry point
- app.js: game modes, adaptive learning, profiles, rewards, dashboard, backup and Drive sync
- words.js: preserved textbook vocabulary
- style.css: responsive interface and V4 styles
- service-worker.js: offline cache (V4 cache version)
- manifest.json: installable app metadata
- drive-config.js: optional OAuth Client ID fallback
