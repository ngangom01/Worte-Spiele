# WORT-ABENTEUER — README

## Start

1. Extract the package ZIP.
2. Keep all files together and open `index.html` in a modern browser.
3. Offline play works after the files have loaded. Google Drive sync requires an internet connection and an HTTPS site (or localhost for development).

## Home, Settings, and Parent Dashboard

Open **Eltern-Dashboard** to view weekly activity and vocabulary progress, filter by level, and scroll the word list. The weekly history begins with rounds played after this update.

Use the gear button at the bottom of Home for **Settings**. Backup download/import, the Google Drive OAuth Client-ID field, Drive sync, voice choice, and reset are all in Settings only.

## Save before leaving a play

Tap the house button during an active round. The app asks whether to save before leaving. **Speichern & synchronisieren** records the already answered words locally and pushes the latest state to Google Drive. An unfinished round receives no stars or level-completion bonus. If Drive sync fails, the local save is retained and the prompt offers Settings or leaving with the local save. **Weiter spielen** returns to the remaining words; **Ohne Speichern verlassen** discards the unfinished round results.

## Google Drive sync setup

1. Host the app at an HTTPS address.
2. In Google Cloud, create a Google OAuth 2.0 **Web application Client ID**, enable the Google Drive API, configure the OAuth consent screen, and add the exact site origin to **Authorized JavaScript origins**.
3. In Settings, enter the Client ID and tap **Client-ID speichern**. Do not enter a client secret.
4. Tap **Jetzt synchronisieren**, choose the Google account, and grant access.
5. On each other device, open the same hosted app, enter the same Client ID, and sync using the same Google account.

The app stores its sync file in Google Drive’s private `appDataFolder`, using the `drive.appdata` scope. That file is not shown in Drive’s regular file list. Sync compares timestamps and loads the newer copy or uploads the newer local copy; it does not merge separate device histories. Sync after playing before switching devices.

## Downloadable backup

In Settings, choose **Sicherungsdatei herunterladen**, upload the JSON file to a normal Drive folder, then download it on another device and choose **Sicherungsdatei importieren**. Import replaces that device’s current progress after confirmation.

## Speech

Speech uses voices exposed by the browser/device. Choose an installed German voice or **Gerätestimme verwenden (Systemauswahl)**. The browser may expose a different list from accessibility’s Speak Selection voices.

## Package files

- `index.html` — app entry and Google Identity Services loader
- `app.js` — game, Drive sync, dashboard, settings, and backup logic
- `words.js` — vocabulary, including seven Lessing 2b stages
- `style.css` — responsive interface
- `manifest.json` — installable app metadata
- `service-worker.js` — offline cache
- `drive-config.js` — optional fallback Client ID configuration
