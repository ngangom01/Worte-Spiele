# Android-Roadmap (Worte Spiele)

Ziel: Wenn die Funktionen ausgereift und geprüft sind, die PWA als Android-App ausliefern – ohne Neuentwicklung.

## Empfehlung: Capacitor (Web-Code wiederverwenden)
| Option | Vorteil | Nachteil |
|---|---|---|
| **Capacitor** (empfohlen) | gleicher Code, Zugriff auf native Plugins (Preferences, TTS, Back-Taste, Google Sign-In), Play-Store-tauglich | Build-Toolchain (Android Studio) nötig |
| TWA (Bubblewrap) | minimal, nutzt die gehostete PWA | kaum native Funktionen, Drive-Login/TTS wie im Browser, Chrome nötig |

Schritte: `npm i @capacitor/core @capacitor/cli @capacitor/android` → `npx cap init` (webDir = Projektordner) → `npx cap add android` → `npx cap sync` → in Android Studio bauen.

## Schon vorbereitet (V6)
- `platform.js`: Speicher (`Platform.Store`), Zurück-Taste (`Platform.Nav`), Versionsnummern, `isNative`. Aller Speicherzugriff läuft darüber.
- Schema-Versionierung + Migration (`schemaVersion`), Sicherung/Wiederherstellung als JSON.
- Wortschatz als Daten (Packs), keine Logik in Wortlisten.
- Manifest mit maskierbarem Icon, Offline-Cache per Service Worker.

## Noch zu tun vor dem Android-Release
1. **Speicher**: localStorage kann von Android bei Platzmangel geleert werden → `Platform.Store` auf `@capacitor/preferences` (oder SQLite) umstellen; `navigator.storage.persist()` beim Web-Betrieb anfragen. Einmalige Übernahme der alten localStorage-Daten.
2. **Sprachausgabe**: Android-WebView hat oft keine deutsche Stimme geladen → `@capacitor-community/text-to-speech` hinter einer `speak()`-Funktion (bisher 15 direkte `speechSynthesis`-Stellen in app.js bündeln).
3. **Google Drive**: Web-GSI-Login funktioniert in der WebView nicht → natives Google Sign-In (Plugin) + Drive-REST mit Access-Token; `drive-config.js` pro Plattform.
4. **Zurück-Taste**: Handler in `main.js` registriert; auf Geräten testen (Spiel → Startseite → App schließen).
5. **Icons/Splash**: Adaptive Icons (Vorder-/Hintergrund), `@capacitor/assets` generiert alle Größen.
6. **Kinder-Richtlinien (Play Families / COPPA / DSGVO-K)**: keine Werbung, kein Tracking, Datenschutzerklärung-URL, Eltern-PIN als Gate für Drive/Export/Shop, Zielgruppe „Kinder" korrekt in der Play Console angeben, Data-Safety-Formular (lokal gespeichert; optional Google Drive des Nutzers).
7. **Offline**: alle Ressourcen bündeln (Google-GSI-Skript nur wenn online laden).
8. **Test**: echte Geräte (kleines Telefon, Tablet), Querformat für Spiele, Systemschriftgröße, Dunkelmodus, geschlossene Tests in Play Console (mind. 12 Tester / 14 Tage bei neuen privaten Entwicklerkonten).
9. **Versionierung**: `Platform.APP_VERSION` = `versionName`; `versionCode` bei jedem Upload erhöhen; Schema-Migration vor Release testen.

## Regeln für neue Funktionen
Keine direkten `localStorage`/`speechSynthesis`/`window.open`-Aufrufe in neuem Code – immer über `platform.js`. Touch-Ziele ≥ 44 px. Kein Hover-Zwang. Jede Datenänderung bekommt eine Migration.
