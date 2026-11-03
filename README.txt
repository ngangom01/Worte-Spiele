# WORT-ABENTEUER — README

## Start

1. Extract `Lessing-2b.zip`.
2. Keep all files together and open `index.html` in a modern browser.
3. Offline play is supported after the files have loaded. Google Drive sync requires an internet connection and an HTTPS website (or localhost for development).

## Levels and parent dashboard

The vocabulary formerly grouped as Lessing 2b is now arranged across seven increasingly complex stages: **Lessing 2b – Stufe 1** through **Stufe 7**. Existing local progress is retained; prior access to Level 4 becomes access to Stufe 1.

Open **Eltern-Dashboard** from the home page to filter vocabulary by level, see known/practice/new counts, and review weekly activity, accuracy, first-try results, and words to practise. Weekly history starts with rounds played after this update. The word list scrolls within its panel.

## Google Drive sync

1. In the app, open **Einstellungen** or **Eltern-Dashboard**.
2. Paste your Google OAuth 2.0 **Web application Client ID** into the Client-ID field and choose **Client-ID speichern**. This is a public client ID; never enter a client secret.
3. In Google Cloud, enable the Google Drive API, configure the OAuth consent screen, and add the exact HTTPS site origin under the Web client’s authorized JavaScript origins.
4. Choose **Jetzt synchronisieren**, select the Google account, and grant access.
5. On another device, open the same hosted app, enter the same Client ID, and choose **Jetzt synchronisieren** with the same Google account.

The app stores one progress file in Google Drive’s private `appDataFolder`, using the `drive.appdata` scope. This folder is managed by the app and is not visible in the regular Drive file list. The app compares timestamps and loads the newer copy, or uploads the local copy if it is newer. The selected voice preference is included; the other device must provide that voice, or use its device voice.

A Google OAuth Client ID alone does not create a Google Cloud project or configure the allowed website origin. Direct sync does not work when opening the app as a local `file://` page.

## Downloadable backup

Use **Sicherungsdatei herunterladen** in Settings or the Parent Dashboard to create a portable JSON backup. Upload it to a normal Google Drive folder if you want to see/manage the file yourself. On the other device, download the JSON file and choose **Sicherungsdatei importieren**. Import replaces that device’s current progress after confirmation.

## Speech

The game uses voices exposed by the browser/device. Select an installed German voice or choose **Gerätestimme verwenden (Systemauswahl)** to let the browser choose. Use **Stimmen neu laden** after installing voices and **Stimme testen** to preview. Browser voice lists can differ from accessibility “Speak Selection” voices.

## Files

- `index.html` — app entry page and Google Identity Services loader
- `app.js` — game logic, Drive sync, dashboard, settings, and backup/restore
- `words.js` — vocabulary levels
- `style.css` — responsive interface
- `manifest.json` — installable app metadata
- `service-worker.js` — offline cache
- `drive-config.js` — optional fallback for a Web client ID; app entry is also available in Settings
