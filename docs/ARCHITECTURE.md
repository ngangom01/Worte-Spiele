# Architektur (V6)

Reines HTML/CSS/JS, klassische Skripte im globalen Scope; Reihenfolge in `index.html` zählt:
`platform.js → words.js → vocab-core.js → artikel.js → (vocab-packs/*.js) → drive-config.js → progress-merge.js → app.js → cefr.js → ui-home.js → seasons.js → article-mode.js → minigames.js → main.js`

| Datei | Aufgabe |
|---|---|
| platform.js | Speicher, Zurück-Taste, Version (Android-Schicht) |
| words.js / artikel.js | Wortlisten A1, A2, B1 (+ Artikel-Daten) |
| vocab-core.js | CEFR-Stufen, `registerLevels`, Tracks, Level-Lookup |
| app.js | Zustand `S`, Profile, Runden, Spielmodi, Einstellungen, Drive-Sync |
| cefr.js | Eltern-Dashboard: Niveau, Abdeckung |
| ui-home.js | Startseite (4 Kacheln), Abenteuer, Spiele, „Meine Belohnungen" |
| seasons.js | Jahreszeiten-Hintergrund (Canvas) |
| minigames.js | 10 Minispiele |
| progress-merge.js | Zusammenführen von Spielständen (Drive/Backup) |

## Zustand & Migration
`localStorage`-Schlüssel `wortabenteuer.v1`. `schemaVersion` = 6. Migrationen in `initializeProfiles` (`fromVersion < N`). Pro-Profil-Felder stehen in `PROFILE_KEYS`; PIN-Hash und Schlüssel verlassen das Gerät nie (Backup/Drive).
V6: Track `grundschule` → `alle` (B1 sichtbar). Level-IDs bleiben stabil, Sterne/Fortschritt unverändert.

## Neue Wortstufe (B2/C1/C2) hinzufügen
1. `vocab-packs/TEMPLATE-pack.js` kopieren (z. B. `b2.js`), Wörter eintragen. Reservierte IDs: B2 16–25, C1 26–35, C2 36–45.
2. `<script src="vocab-packs/b2.js">` in `index.html` nach `artikel.js` und Datei in `FILES` im `service-worker.js` eintragen; Cache-Name erhöhen.
3. `node tools/check-vocab.js` ausführen (Duplikate, Pflichtfelder, Artikel).
Dashboard, Abenteuer-Welten, Spielmodi und Abdeckung erkennen die Stufe automatisch; bestehender Fortschritt bleibt unberührt.

## Neues Minispiel
In `minigames.js` per `register({...})` anlegen (id, Titel, `start(ctx)` mit `ctl.stop/key`), Reihenfolge in `order`.

## Tests
`test/harness.js` (jsdom) lädt die App; `test/t_*.js` sind Szenario-Tests; `node tools/check-vocab.js` prüft Wortdaten.
