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

LEVEL-UP MINI-GAME REWARDS
When a classic level unlocks its next level, or a learning-world level earns a star that newly unlocks the next level, a two-minute mini-game starts automatically as the reward. The child can return to the results early or finish the full two minutes. Unplayed rewards remain available from Home. Rewards rotate in order through Flappy Bird, Classic Snake, Balloon Pop and Star Catcher. The result screen and Home show any unplayed rewards. The child can play now, return to the lesson, or save the reward for later. Mini-game rewards use local browser rendering, work with touch and keyboard controls, and require no network service. Reward queue and alternation progress are stored per child profile and included in backup/Drive sync.


V4.1 FIXES
- Bilder-Detektiv: every picture now comes from an exact word-to-picture list (PICTURES in app.js). Words without a clear picture (e.g. Rabe) are skipped instead of getting a category guess. To add a picture, add one entry such as Kuchen:"🍰".
- Satz-Abenteuer: the blank is only made at a whole word (no more blanks inside "Apfelsaft").
- Weiter button: after an answer, the input, check button and tip button are hidden and the Weiter button stays pinned to the bottom of the screen, so no scrolling is needed in any game mode. The finished word is shown in the feedback.
- Appearance: Settings > Aussehen offers Hell, Dunkel and Automatisch (follows the device). The choice is saved per device. Dark mode replaces purchased shop backgrounds with a dark scene; they return in Hell mode.

V4.2 IMPROVEMENTS
- Flappy Bird is easier: slower movement, wider gaps and a hand-drawn right-facing bird with animated wings.
- Classic Snake has a clearly visible snake, larger game board drawing, and a clean directional pad for touch screens; keyboard arrows/WASD also work.
- Two additional level-up reward games rotate with the original rewards: Balloon Pop and Star Catcher.
- The Parent Dashboard has a mini-game preview/launch panel. The preview buttons launch directly; the dashboard parent access remains in place. Preview sessions do not consume a saved level reward.
- The yellow speaker control in audio games is about two-thirds its former size.
- Artikel-Detektiv is a new practice mode for choosing der, die or das. It uses vocabulary whose example sentence explicitly establishes the correct article, so the app does not guess from the word ending. Current library coverage is 127 words, including the new B1 levels.

V4.2.1 FIX
- Classic Snake now renders as a visible 20×20 touch-friendly grid from the first frame, with a high-contrast snake head/body and apple. Movement updates the grid directly, avoiding the canvas rendering issue.
- Removed the extra PIN prompt from the Parent Dashboard mini-game preview buttons.

V4.2.2 VISIBILITY UPDATE
- Snake segments are now black with a yellow-outlined head and are rendered with inline high-contrast styles. The initial snake has four segments.


V4.2.3 FIX
- Fixed the Snake coordinate format so the starting segments and movement renderer use the same {x, y} shape. The PWA continues to cache the game for offline play.


V4.2.4 MOVEMENT FIX
- Removed a duplicate stale drawMiniRewardFrame override. The stale version was winning over the Snake updater and repeatedly returning when it found no canvas, so input changed the direction but never advanced the snake. The reward loop now explicitly schedules the active window.drawMiniRewardFrame handler.


V4.2.5 — DEUTSCH B1 VOCABULARY
- Added five Deutsch B1 vocabulary levels (Levels 11–15), with 10 words and an example sentence per level: Wohnen und Alltag; Beruf und Ausbildung; Termine und Kommunikation; Meinung und Gesellschaft; Umwelt und Gesundheit.
- The 50 added words are available through the existing game modes and article practice.
- All original Lessing Schule 2b vocabulary and other existing entries in words.js are preserved.
- The B1 topics and vocabulary selection are guided by the Goethe-Zertifikat B1 vocabulary list. The example sentences are newly written for this app.
Reference: https://www.goethe.de/pro/relaunch/prf/id/Goethe-Zertifikat_B1_Wortliste.pdf
