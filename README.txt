# WORT-ABENTEUER — README

## Start the game

1. Extract `Lessing-2b.zip` into a folder.
2. Open `index.html` in a modern browser.
3. The game works offline after its files have loaded once. Speech voices may require an internet connection or an installed device voice.

Keep `index.html`, `app.js`, `words.js`, `style.css`, `manifest.json`, `service-worker.js`, and `drive-config.js` together in the same folder.

## Parent dashboard and settings

On the home screen, select **Eltern-Dashboard** to review vocabulary progress and filter words by level. Select the gear button at the bottom of the home screen to open settings and choose a German speech voice.

The voice picker only lists German voices exposed by the browser and device. If no voice appears, install a German text-to-speech voice in the device settings, restart the browser, and reopen the game. A voice preference transfers in a backup only if the other device has the same voice available.

## Move progress between devices with Google Drive

The simplest method is to transfer a backup file manually:

1. On the original device, open **Settings** or **Eltern-Dashboard** and select **Sicherungsdatei herunterladen**.
2. Upload the downloaded JSON file to Google Drive.
3. On the other device, download that JSON file from Google Drive.
4. In the game, select **Sicherungsdatei importieren** and choose the downloaded file.

Importing replaces the progress currently stored on that device. The app asks for confirmation before importing. Keep a copy of your backup in Drive in case you need it later.

## Optional direct Google Drive sync

The package also includes a direct sync button. It is inactive until a Google OAuth 2.0 Web client ID is configured in `drive-config.js` and the app is hosted at an authorized HTTPS origin (or localhost for development). The Google Drive API must be enabled for the associated Google Cloud project. The app requests access only to its private Drive app-data area.

Do not put a client secret in `drive-config.js`. If direct sync is not configured, use the manual backup and restore method above.

## Files

- `index.html` — app entry page
- `app.js` — game, dashboard, settings, and backup logic
- `words.js` — vocabulary levels, including Lessing 2b
- `style.css` — app styling
- `manifest.json` — installable app metadata
- `service-worker.js` — offline cache
- `drive-config.js` — optional Google Drive OAuth client ID configuration
