WORT-ABENTEUER / Worte Spiele – Version 6
==========================================

NEU IN V6
- B1-Wortschatz ist jetzt überall sichtbar: Standard-Lernprofil = "Alle Stufen" (A1+A2+B1).
  Eltern können in den Einstellungen wieder auf "Grundschule" (A1+A2) umstellen.
- Volle Wortabdeckung: Jede Runde bevorzugt zuerst fällige, dann noch nie gesehene Wörter.
  Alle 455 Wörter erscheinen in allen Spielmodi; das Eltern-Dashboard zeigt "gesehen" und "sicher".
- Bestehender Fortschritt bleibt erhalten (Sterne, Punkte, Münzen, Wörter, PIN). Neue Stufen werden
  automatisch freigeschaltet, wenn die Genauigkeit der Vorstufe passt. B1-Welt "cefr-B1" kommt dazu.
- Vorbereitet für B2/C1/C2: neue Wortlisten als "Pack" (docs/ARCHITECTURE.md, vocab-packs/TEMPLATE-pack.js,
  Prüfung mit: node tools/check-vocab.js).
- Jahreszeiten-Hintergrund (Frühling Blüten, Sommer Sonne, Herbst Blätter, Winter Schnee,
  Automatisch nach Datum oder Aus) – Einstellungen > Jahreszeit, pro Profil. Pausiert in Minispielen.
- Neue Startseite: 4 Kacheln (Abenteuer, Spiele, Meine Belohnungen, Eltern) + Tagesziel.
  Belohnungen, Shop, Pokale und Avatar liegen gebündelt in "Meine Belohnungen".
- Android-Vorbereitung: platform.js (Speicher, Zurück-Taste), docs/ANDROID_ROADMAP.md.

INSTALLATION / UPDATE (GitHub Pages)
1. Alle Dateien dieses Ordners ins Repository hochladen und bestehende ersetzen.
   Alte Datei v4-enhancements.js (falls vorhanden) löschen.
   Neue Dateien: platform.js, vocab-core.js, ui-home.js, seasons.js, vocab-packs/, docs/, tools/.
2. Die App einmal neu laden; bei "Neue Version bereit" auf "Jetzt neu laden" tippen.
   Der Spielstand liegt im Browser (localStorage) und bleibt erhalten.

DATEIEN
index.html, style.css, manifest.json, service-worker.js, icons/
platform.js, words.js, vocab-core.js, artikel.js, drive-config.js, progress-merge.js,
app.js, cefr.js, ui-home.js, seasons.js, article-mode.js, minigames.js, main.js
vocab-packs/ (Vorlage für B2/C1), tools/check-vocab.js, docs/

Google Drive Sync (optional): wie in V5, Client-ID in drive-config.js oder in den Einstellungen.
