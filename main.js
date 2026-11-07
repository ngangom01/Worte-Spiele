/* WORT-ABENTEUER – Start der App: PIN-Migration, dauerhafter Speicher, Offline-Modus, erste Ansicht. */
(async function boot() {
  try {
    await migratePin();
  } catch (e) {}
  applyTrack();
  applyTheme();
  home();
  // Browser bitten, den Spielstand nicht automatisch zu löschen (hilft besonders auf iPhone/iPad).
  try {
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
  } catch (e) {}
  if ("serviceWorker" in navigator) {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker
      .register("service-worker.js")
      .then((reg) => {
        reg.update().catch(() => {});
      })
      .catch(() => {});
    // Neue Version erkannt: freundlicher Hinweis statt mitten in der Runde neu zu laden.
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController || document.getElementById("update-banner")) return;
      const bar = document.createElement("div");
      bar.id = "update-banner";
      bar.setAttribute("role", "status");
      bar.innerHTML = `🔄 ${tr("Eine neue Version ist bereit.", "A new version is ready.")} <button type="button" onclick="location.reload()">${tr("Jetzt neu laden", "Reload now")}</button>`;
      document.body.appendChild(bar);
    });
  }
})();
