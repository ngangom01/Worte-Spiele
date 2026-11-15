WORT-ADVENTURE / Word Games – Version 6
==========================================

NEW IN V6
- B1 vocabulary is now visible everywhere: Default learning profile = "All Levels" (A1+A2+B1).
  Parents can switch back to "Primary School" (A1+A2) in Settings.
- Full vocabulary coverage: Each round prioritizes words that are due first, followed by words that have never been seen before.
  All 455 words appear in all game modes; the Parent Dashboard displays "seen" and "mastered".
- Existing progress is preserved (stars, points, coins, words, PIN). New levels are
  automatically unlocked when the accuracy of the previous level is sufficient. The B1 world "cefr-B1" is added.
- Prepared for B2/C1/C2: new vocabulary lists as "Packs" (docs/ARCHITECTURE.md, vocab-packs/TEMPLATE-pack.js,
  validation with: node tools/check-vocab.js).
- Seasonal backgrounds (spring blossoms, summer sun, autumn leaves, winter snow,
  automatically based on date or off) – Settings > Season, per profile. Paused in minigames.
- New home screen: 4 tiles (Adventure, Games, My Rewards, Parents) + daily goal.
  Rewards, Shop, Trophies and Avatar are grouped together under "My Rewards".
- Android preparation: platform.js (storage, back button), docs/ANDROID_ROADMAP.md.

INSTALLATION / UPDATE (GitHub Pages)
1. Upload all files from this folder to the repository and replace the existing ones.
   Delete the old file v4-enhancements.js (if present).
   New files: platform.js, vocab-core.js, ui-home.js, seasons.js, vocab-packs/, docs/, tools/.
2. Reload the app once; if "New version available" appears, tap "Reload Now".
   The game progress is stored in the browser (localStorage) and remains preserved.

FILES
index.html, style.css, manifest.json, service-worker.js, icons/
platform.js, words.js, vocab-core.js, artikel.js, drive-config.js, progress-merge.js,
app.js, cefr.js, ui-home.js, seasons.js, article-mode.js, minigames.js, main.js
vocab-packs/ (template for B2/C1), tools/check-vocab.js, docs/

Google Drive Sync (optional): same as in V5, Client ID in drive-config.js or in Settings.
