#!/usr/bin/env node
/* Prüft die Wortbibliothek (words.js + Wortpakete in vocab-packs/): Struktur, doppelte Level-IDs, Beispielsätze, Artikel,
   Wörter pro Stufe. Aufruf im Projektordner:  node tools/check-vocab.js          (Exit-Code 1 bei Fehlern) */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..", fs.existsSync(path.join(__dirname, "..", "app", "words.js")) ? "app" : ".");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const ctx = { console };
vm.createContext(ctx);
const run = (f) => vm.runInContext(read(f), ctx, { filename: f });
run("words.js");
vm.runInContext(read("vocab-core.js").replace(/if \(typeof module[\s\S]*$/, ""), ctx, { filename: "vocab-core.js" });
try { run("artikel.js"); } catch (e) {}
const packDir = path.join(root, "vocab-packs");
const packs = fs.existsSync(packDir) ? fs.readdirSync(packDir).filter((f) => /^words-.*\.js$/.test(f)) : [];
let errors = 0;
packs.forEach((f) => { try { run("vocab-packs/" + f); } catch (e) { errors++; console.error("FEHLER in", f, e.message); } });
const out = vm.runInContext(`JSON.stringify({levels: LEVELS.map(l=>({id:l.id,cefr:l.cefr,name:l.name,n:l.words.length,noArt:l.words.filter(w=>/^[A-ZÄÖÜ]/.test(w.w)&&!w.art).length,
  noWord:l.words.filter(w=>!w.s.toLowerCase().includes(w.w.toLowerCase().slice(0,Math.max(2,w.w.length-2)))).map(w=>w.w)})), packs: VOCAB_PACKS})`, ctx);
const data = JSON.parse(out);
const seen = new Map(), dups = [];
vm.runInContext("LEVELS.forEach(l=>l.words.forEach(w=>{(globalThis.__w=globalThis.__w||[]).push([l.id,w.w])}))", ctx);
ctx.__w.forEach(([id, w]) => (seen.has(w) ? dups.push(`${w} (Level ${seen.get(w)} und ${id})`) : seen.set(w, id)));
const byBand = {};
data.levels.forEach((l) => { byBand[l.cefr] = byBand[l.cefr] || { levels: 0, words: 0 }; byBand[l.cefr].levels++; byBand[l.cefr].words += l.n; });
console.log("Stufen:", JSON.stringify(byBand));
console.log("Pakete:", packs.join(", ") || "(keine)");
data.levels.forEach((l) => {
  if (l.n < 10) { errors++; console.error(`Level ${l.id} (${l.name}) hat nur ${l.n} Wörter (mindestens 10)`); }
  if (l.noWord.length) console.warn(`Level ${l.id}: Beispielsatz enthält das Wort nicht: ${l.noWord.slice(0, 5).join(", ")}${l.noWord.length > 5 ? " …" : ""}`);
  if (l.noArt) console.log(`Level ${l.id}: ${l.noArt} Nomen ohne Artikel (ok, wenn mehrdeutig oder Mehrzahl)`);
});
console.log(`${seen.size} verschiedene Wörter, ${dups.length} Wiederholungen über Level hinweg.`);
process.exit(errors ? 1 : 0);
