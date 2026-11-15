// platform.js – dünne Schicht zwischen App und Gerät.
// Alles, was sich auf Android (Capacitor) anders verhalten wird als im Browser, läuft hier durch:
// Speicher, Zurück-Taste, Version. Im Browser verhält sich alles exakt wie vorher.
// Siehe docs/ANDROID_ROADMAP.md.
(function (root) {
  "use strict";
  const cap = root.Capacitor;
  const isNative = !!(cap && typeof cap.isNativePlatform === "function" && cap.isNativePlatform());

  // Speicher: Standard = localStorage. Für Android kann hier später Preferences/SQLite eingehängt werden.
  const mem = {};
  const Store = {
    get(key) {
      try { const v = root.localStorage.getItem(key); return v === null ? null : v; } catch (e) { return key in mem ? mem[key] : null; }
    },
    set(key, value) {
      try { root.localStorage.setItem(key, value); } catch (e) { mem[key] = String(value); throw e; }
    },
    remove(key) {
      try { root.localStorage.removeItem(key); } catch (e) { delete mem[key]; }
    },
  };

  // Zurück-Taste (Android) / Escape: Handler werden in Reihenfolge abgefragt, der erste, der true liefert, gewinnt.
  const backHandlers = [];
  const Nav = {
    onBack(fn) { backHandlers.unshift(fn); },
    back() {
      for (const fn of backHandlers) { try { if (fn() === true) return true; } catch (e) {} }
      return false;
    },
  };

  const Platform = {
    isNative,
    name: isNative && cap.getPlatform ? cap.getPlatform() : "web",
    APP_VERSION: "6.0.0",
    SCHEMA_VERSION: 6,
    Store,
    Nav,
  };

  if (isNative && cap.Plugins && cap.Plugins.App && cap.Plugins.App.addListener) {
    cap.Plugins.App.addListener("backButton", () => {
      if (!Nav.back() && cap.Plugins.App.exitApp) cap.Plugins.App.exitApp();
    });
  }
  root.Platform = Platform;
  if (typeof module !== "undefined" && module.exports) module.exports = Platform;
})(typeof window !== "undefined" ? window : globalThis);
