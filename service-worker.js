// Offline-Cache. Programmdateien werden „Netz zuerst“ geladen (bei Verbindung immer die neueste Version),
// ohne Netz kommt die zuletzt gespeicherte Kopie. Bei neuen Dateien die Versionsnummer erhöhen.
const CACHE = "wort-abenteuer-v5-1";
const FILES = [
  "./", "index.html", "style.css", "app.js", "artikel.js", "article-mode.js", "cefr.js", "main.js", "minigames.js",
  "progress-merge.js", "words.js", "drive-config.js", "manifest.json",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

function networkFirst(request) {
  const network = fetch(request).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(request, copy));
    }
    return res;
  });
  // Bei langsamem Netz nach 4 Sekunden auf die gespeicherte Kopie ausweichen.
  const timeout = new Promise((_, reject) => setTimeout(reject, 4000));
  return Promise.race([network, timeout]).catch(() => caches.match(request).then((hit) => hit || network.catch(() => caches.match("index.html"))));
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const code = req.mode === "navigate" || ["script", "style", "document", "manifest"].includes(req.destination);
  e.respondWith(code ? networkFirst(req) : caches.match(req).then((hit) => hit || fetch(req).catch(() => caches.match("index.html"))));
});
