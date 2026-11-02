"use strict";
/* WORT-ABENTEUER V1 – Spiellogik. Wörter: words.js */
const KEY = "wortabenteuer.v1";
const $ = s => document.querySelector(s), app = $("#app");
const DEF = { name: "Abenteurer", pts: 0, unl: [1], stars: {}, acc: {}, done: {}, rounds: 0, ach: [],
  ms: [], words: {}, review: [], daily: "", av: "🦊", avs: ["🦊"], bs: false };
// Belohnungen: [Punkte, Symbol, Name]
const MS = [[100,"🥉","Bronze-Pokal"],[250,"🥈","Silber-Pokal"],[500,"🥇","Gold-Pokal"],[750,"🐼","Neuer Avatar: Panda"],[1000,"🎁","Schatztruhe"]];
const ACH = [["🚀","Erste Runde",() => S.rounds >= 1],["🌟","5 Sterne gesammelt",() => stars() >= 5],
  ["🏆","Wortmeister (3 Sterne)",() => Object.values(S.stars).some(x => x === 3)],
  ["📅","Tagesheld",() => !!S.daily],["🔥","5er-Serie",() => S.bs]];
let S = load(), G = null, dashFilter = "all", dashQuery = "", dashLevel = "all";

function load() { try { return Object.assign(JSON.parse(JSON.stringify(DEF)), JSON.parse(localStorage[KEY] || "{}")); } catch (e) { return JSON.parse(JSON.stringify(DEF)); } }
function save() { try { S.updatedAt = Date.now(); localStorage[KEY] = JSON.stringify(S); } catch (e) {} }
const stars = () => Object.values(S.stars).reduce((a, b) => a + b, 0);
const today = () => { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const curLevel = () => Math.max(...S.unl);

/* ---------- Audio ---------- */
let voice = null;
const hasTTS = "speechSynthesis" in window;
const VOICE_KEY = "wortabenteuer.voice.v1";
function germanVoices() {
  if (!hasTTS) return [];
  return speechSynthesis.getVoices().filter(x => /^de(?:-|$)/i.test(x.lang)).sort((a,b) => voiceScore(b)-voiceScore(a));
}
function voiceScore(v) {
  return (/^de-DE$/i.test(v.lang) ? 100 : 0) + (/natural|neural|premium|enhanced|siri|google|online/i.test(v.name) ? 30 : 0) + (!v.localService ? 10 : 0);
}
function pickVoice() {
  if (!hasTTS) { voice = null; return; }
  const v = germanVoices(), pref = localStorage.getItem(VOICE_KEY);
  voice = pref && pref !== "__system__" ? v.find(x => x.name + "|" + x.lang === pref) || null : null;
}
function refreshVoicePicker() {
  const select = $("#voice-select"); if (!select) return;
  pickVoice(); const v = germanVoices();
  const systemOption = `<option value="__system__" ${voice ? "" : "selected"}>Gerätestimme verwenden (Systemauswahl)</option>`;
  select.innerHTML = systemOption + v.map(x => { const key = x.name + "|" + x.lang; return `<option value="${esc(key)}" ${voice && voice.name === x.name && voice.lang === x.lang ? "selected" : ""}>${esc(x.name)} (${esc(x.lang)})${/natural|neural|premium|enhanced|siri|google|online/i.test(x.name) ? " · Natürlich/Online" : ""}</option>`; }).join("");
}
function reloadVoices() {
  if (!hasTTS) return;
  speechSynthesis.cancel();
  speechSynthesis.getVoices();
  setTimeout(() => { pickVoice(); refreshVoicePicker(); const status = $("#voice-status"); if (status) status.textContent = germanVoices().length ? "Stimmenliste aktualisiert. Mit „Stimme testen“ anhören." : "Keine deutsche Stimme an den Browser gemeldet. Safari vollständig schließen und erneut öffnen."; }, 250);
}
function testVoice() {
  if (!hasTTS) return;
  pickVoice(); speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance("Guten Tag! Ich spreche jetzt das deutsche Wort: Abend.");
  utterance.lang = voice ? voice.lang : "de-DE"; utterance.rate = 0.9;
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}
function changeVoice(key) { if (key === "__system__") localStorage.removeItem(VOICE_KEY); else localStorage.setItem(VOICE_KEY, key); pickVoice(); }
if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = () => { pickVoice(); refreshVoicePicker(); }; }
addEventListener("pageshow", () => { if (document.querySelector("#voice-select")) reloadVoices(); });
document.addEventListener("visibilitychange", () => { if (!document.hidden && document.querySelector("#voice-select")) reloadVoices(); });
if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = () => { pickVoice(); refreshVoicePicker(); }; }
function play() {
  if (!G || !hasTTS) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(G.q[G.i].w);
  u.lang = "de-DE"; u.rate = 0.9; u.pitch = 1;
  pickVoice(); if (voice) { u.voice = voice; u.lang = voice.lang; }
  const sp = $("#spk"); u.onstart = () => sp && sp.classList.add("talk"); u.onend = u.onerror = () => sp && sp.classList.remove("talk");
  speechSynthesis.speak(u);
}
let ac;
function tone(f) { try { ac = ac || new AudioContext(); const t = ac.currentTime;
  f.forEach((x, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = x; o.connect(g); g.connect(ac.destination);
    g.gain.setValueAtTime(.15, t + i * .12); g.gain.exponentialRampToValueAtTime(.001, t + i * .12 + .2); o.start(t + i * .12); o.stop(t + i * .12 + .22); }); } catch (e) {} }
function rain(e) { for (let i = 0; i < 18; i++) { const s = document.createElement("span"); s.className = "fall"; s.textContent = e;
  s.style.left = Math.random() * 95 + "vw"; s.style.animationDelay = Math.random() * 1.2 + "s"; document.body.appendChild(s); setTimeout(() => s.remove(), 4500); } }

/* ---------- Rechtschreibung ---------- */
const norm = s => s.normalize("NFC").trim().replace(/^./, c => c.toLowerCase());
const same = (a, b) => norm(a) === norm(b); // ä≠ae, ß≠ss, nur 1. Buchstabe egal
function hint(w) {
  let m = w.match(/([a-zäöüß])\1/i);
  if (m) return "Achtung! Dieses Wort hat zwei " + m[1] + ".";
  if (/sch/i.test(w)) return "Hör genau hin: Sch oder S?";
  if (/ie/i.test(w)) return "Denk an das ie!";
  if (/ß/.test(w)) return "Hör genau hin: ß oder ss?";
  if (/[äöü]/i.test(w)) return "Achtung! Hier ist ein Umlaut versteckt: ä, ö oder ü?";
  if (/ch/i.test(w)) return "Denk an das ch!";
  return "Das Wort hat " + w.length + " Buchstaben und beginnt mit " + w[0].toUpperCase() + ".";
}
const hl = w => w.replace(/(sch|ch|ie|[äöüß]|([a-zA-Z])\2)/gi, "<mark>$&</mark>");

/* ---------- Startseite ---------- */
function home() {
  G = null; if (hasTTS) speechSynthesis.cancel();
  const nx = MS.find(m => S.pts < m[0]), pv = [...MS].reverse().find(m => S.pts >= m[0]), lo = pv ? pv[0] : 0;
  const pc = nx ? Math.round((S.pts - lo) / (nx[0] - lo) * 100) : 100;
  const dDone = S.daily === today();
  app.innerHTML = `<h1>WORT-ABENTEUER</h1><p class="sub">Hör zu, schreib richtig und werde ein Wortmeister!</p>
  <div class="card center"><button class="ghost" onclick="rename()" style="font-size:20px;width:100%">${S.av} ${esc(S.name)} ✏️</button>
   <div class="row" style="margin-top:10px"><span class="pill">Level ${curLevel()}</span><span class="pill">🪙 ${S.pts} Punkte</span><span class="pill">⭐ ${stars()} Sterne</span></div>
   <p style="margin:10px 0 0">${nx ? "Nächste Belohnung: " + nx[1] + " bei " + nx[0] + " Punkten" : "Alle Belohnungen geschafft! 🎉"}</p><div class="bar"><i style="width:${pc}%"></i></div></div>
  <button class="btn play" onclick="playLevel(curLevel())">▶ SPIELEN</button>
  <h2>🗺️ Abenteuerkarte</h2>${LEVELS.map((L, i) => { const open = S.unl.includes(L.id);
    return `<button class="lv ${open ? "" : "lock"}" onclick="${open ? `playLevel(${L.id})` : `lockMsg(${L.id})`}"><span class="ic">${open ? L.icon : "🔒"}</span>
    <span><b>Level ${L.id}: ${L.name}</b><small>${open ? "⭐".repeat(S.stars[L.id] || 0) + "☆".repeat(3 - (S.stars[L.id] || 0)) : "Gesperrt – tippe für den Tipp"}</small></span></button>`; }).join("")}
  <button class="btn alt" onclick="startDaily()" ${dDone ? "disabled" : ""}>📅 ${dDone ? "Tagesaufgabe geschafft ✓" : "Tagesaufgabe: +50 Punkte"}</button>
  <button class="btn" onclick="rewards()">🏆 Meine Belohnungen</button>
  <button class="btn" onclick="dashboard()">👨‍👩‍👧 Eltern-Dashboard</button>
  <p class="center"><button class="ghost" onclick="settings()" aria-label="Einstellungen">⚙️</button></p>`;
}
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function lockMsg(id) { const L = LEVELS[id - 1], p = LEVELS[id - 2]; alert("🔒 Spiele zuerst „" + p.name + "“ und schreibe mindestens " + L.req + " von 100 Wörtern richtig. Dann geht dieses Level auf!"); }
function rename() { const n = prompt("Wie heißt du?", S.name); if (n && n.trim()) { S.name = n.trim().slice(0, 16); save(); home(); } }
function reset() {
  const a = 3 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7);
  if (confirm("Nur für Eltern: Den gesamten Spielstand löschen?") && prompt("Elternfrage: " + a + " + " + b + " = ?") == a + b) { S = JSON.parse(JSON.stringify(DEF)); save(); home(); }
}


/* ---------- Google Drive Spielstand ---------- */
let driveTokenClient = null, driveToken = null, driveMessage = "";
function driveStatus(message) { driveMessage = message; const el = $("#drive-status"); if (el) el.textContent = message; }
function syncProgress() {
  const clientId = window.WORT_GOOGLE_CLIENT_ID || "";
  if (!clientId || clientId.includes("YOUR_GOOGLE")) { alert("Für Google Drive muss zuerst eine OAuth Web-Client-ID in drive-config.js eingetragen werden. Die Einrichtungshinweise stehen dort."); return; }
  if (location.protocol === "file:") { alert("Google Drive benötigt eine sichere Webadresse (HTTPS) oder localhost. Öffne das Spiel über seine gehostete Adresse."); return; }
  driveStatus("Verbinde mit Google …");
  if (window.google?.accounts?.oauth2) requestDriveToken(clientId); else {
    const script = document.createElement("script"); script.src = "https://accounts.google.com/gsi/client"; script.onload = () => requestDriveToken(clientId); script.onerror = () => driveStatus("Google-Anmeldung konnte nicht geladen werden. Prüfe deine Internetverbindung."); document.head.appendChild(script);
  }
}
function requestDriveToken(clientId) {
  try {
    driveTokenClient = google.accounts.oauth2.initTokenClient({ client_id: clientId, scope: "https://www.googleapis.com/auth/drive.appdata", callback: async result => {
      if (result.error) { driveStatus("Google Drive Anmeldung fehlgeschlagen."); return; }
      driveToken = result.access_token;
      try { await syncDriveFile(); } catch (e) { driveStatus("Synchronisierung fehlgeschlagen: " + (e.message || "Verbindungsfehler")); }
    }});
    driveTokenClient.requestAccessToken({ prompt: "" });
  } catch (e) { driveStatus("Google-Anmeldung konnte nicht gestartet werden."); }
}
async function syncDriveFile() {
  driveStatus("Suche den Spielstand in Google Drive …");
  const headers = { Authorization: "Bearer " + driveToken };
  const q = encodeURIComponent("name='wort-abenteuer-progress.json' and 'appDataFolder' in parents and trashed=false");
  const listRes = await fetch("https://www.googleapis.com/drive/v3/files?q=" + q + "&spaces=appDataFolder&fields=files(id,name,modifiedTime)", { headers });
  if (!listRes.ok) throw new Error("Google Drive konnte nicht gelesen werden.");
  const files = (await listRes.json()).files || [], remoteFile = files[0];
  const localTime = Number(S.updatedAt || 0);
  if (remoteFile) {
    const getRes = await fetch("https://www.googleapis.com/drive/v3/files/" + encodeURIComponent(remoteFile.id) + "?alt=media", { headers });
    if (!getRes.ok) throw new Error("Der gespeicherte Spielstand konnte nicht geladen werden.");
    const remote = await getRes.json();
    if (Number(remote.updatedAt || 0) > localTime) {
      S = Object.assign(JSON.parse(JSON.stringify(DEF)), remote); save();
      driveStatus("Neuester Spielstand von Google Drive geladen."); dashboard(); return;
    }
  }
  const metadata = remoteFile ? { name: "wort-abenteuer-progress.json" } : { name: "wort-abenteuer-progress.json", parents: ["appDataFolder"] };
  const body = new FormData();
  body.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  body.append("file", new Blob([JSON.stringify(S)], { type: "application/json" }));
  const url = remoteFile ? "https://www.googleapis.com/upload/drive/v3/files/" + encodeURIComponent(remoteFile.id) + "?uploadType=multipart" : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
  const putRes = await fetch(url, { method: remoteFile ? "PATCH" : "POST", headers, body });
  if (!putRes.ok) throw new Error("Der Spielstand konnte nicht in Google Drive gespeichert werden.");
  driveStatus("Spielstand in Google Drive gespeichert. Auf einem anderen Gerät synchronisiere mit demselben Google-Konto.");
}

function backupPanel() {
  return `<div class="card"><h2>💾 Spielstand sichern & übertragen</h2><p>Die Sicherungsdatei enthält den Spielstand und die ausgewählte Stimme. Lade sie herunter, speichere sie in Google Drive und importiere sie auf dem anderen Gerät.</p><button class="btn go" onclick="downloadBackup()">⬇️ Sicherungsdatei herunterladen</button><label class="btn alt backup-label" for="backup-file">⬆️ Sicherungsdatei importieren</label><input id="backup-file" class="backup-file" type="file" accept="application/json,.json" onchange="importBackup(this.files[0]);this.value=''"> <small class="voice-note">Beim Import wird der vorhandene Spielstand auf diesem Gerät ersetzt.</small></div>`;
}
function downloadBackup() {
  const payload = { format: "wort-abenteuer-backup", version: 1, exportedAt: new Date().toISOString(), progress: S, settings: { voice: localStorage.getItem(VOICE_KEY) || "" } };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob), link = document.createElement("a");
  link.href = url; link.download = "wort-abenteuer-backup-" + today() + ".json"; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
}
async function importBackup(file) {
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data.format !== "wort-abenteuer-backup" || !data.progress || !Array.isArray(data.progress.unl) || !data.progress.words || typeof data.progress.words !== "object" || !Array.isArray(data.progress.review)) throw new Error("Die Datei ist keine gültige WORT-ABENTEUER-Sicherung.");
    if (!confirm("Sicherung vom " + new Date(data.exportedAt || file.lastModified).toLocaleString("de-DE") + " importieren? Der aktuelle Spielstand auf diesem Gerät wird ersetzt.")) return;
    S = Object.assign(JSON.parse(JSON.stringify(DEF)), data.progress);
    if (data.settings && data.settings.voice) localStorage.setItem(VOICE_KEY, data.settings.voice); else localStorage.removeItem(VOICE_KEY);
    save(); alert("Spielstand und Einstellungen wurden importiert."); home();
  } catch (e) { alert(e.message || "Die Sicherungsdatei konnte nicht gelesen werden."); }
}
function settings() {
  G = null; if (hasTTS) speechSynthesis.cancel();
  app.innerHTML = `<div class="top"><button class="ghost" onclick="home()" aria-label="Zurück">🏠</button><h2>⚙️ Einstellungen</h2></div>
  ${backupPanel()}
  <div class="card"><h2>🔊 Sprachausgabe</h2><label for="voice-select"><b>Deutsche Stimme auswählen</b></label><select id="voice-select" class="dash-select" onchange="changeVoice(this.value)"><option>Deutsche Stimmen werden gesucht …</option></select><small class="voice-note">„Gerätestimme“ verwendet die aktuelle Systemauswahl. Einzelne Stimmen werden nur angeboten, wenn der Browser sie bereitstellt.</small><div class="row voice-actions"><button class="filter-btn" onclick="reloadVoices()">↻ Stimmen neu laden</button><button class="filter-btn" onclick="testVoice()">▶ Stimme testen</button></div><small id="voice-status" class="voice-note"></small></div>
  <button class="btn" onclick="dashboard()">👨‍👩‍👧 Eltern-Dashboard</button><button class="btn alt" onclick="reset()">Spielstand zurücksetzen</button>`;
  refreshVoicePicker();
}

/* ---------- Runde ---------- */
function playLevel(id) {
  const L = LEVELS[id - 1], rev = shuffle(L.words.filter(x => S.review.includes(x.w))).slice(0, 3);
  const rest = shuffle(L.words.filter(x => !rev.includes(x)));
  startRound(shuffle(rev.concat(rest).slice(0, 10)), "lvl", id);
}
function startDaily() { if (S.daily === today()) return; startRound(shuffle(LEVELS.flatMap(l => l.words)).slice(0, 5), "daily", 0); }
function startRound(q, mode, lv) { G = { q, mode, lv, i: 0, att: 0, pts: 0, ok: 0, first: 0, second: 0, streak: 0, sb: false, bad: [], log: [], lock: false }; question(); setTimeout(play, 400); }

function question() {
  G.att = 0; G.lock = false;
  app.innerHTML = `<div class="top"><button class="ghost" onclick="if(confirm('Zur Karte zurück? Diese Runde wird nicht gespeichert.'))home()">🏠</button><b style="font-size:20px">Frage ${G.i + 1} von ${G.q.length}</b><span class="pill">🪙 ${S.pts + G.pts}</span></div>
  <div class="bar"><i style="width:${G.i / G.q.length * 100}%"></i></div>
  <div class="card center"><p class="big">Hör gut zu! Welches Wort hörst du?</p>
   <button id="spk" class="speaker" onclick="play()" aria-label="Wort anhören">🔊</button>
   <button class="btn alt" onclick="play()">🔁 Noch einmal hören</button>
   ${hasTTS && voice !== null || !hasTTS ? "" : ""}${!hasTTS ? '<p class="note">Dein Gerät kann nicht sprechen. Bitte einen Erwachsenen um Hilfe (Chrome mit Sprachausgabe).</p>' : ""}
   <input id="in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Schreibe hier …" onkeydown="if(event.key==='Enter')G.lock?nextQ():check()">
   <button id="chk" class="btn go" onclick="check()">✅ Prüfen</button><div id="fb"></div></div>`;
  $("#in").focus();
}
function check() {
  if (G.lock) return;
  const w = G.q[G.i], inp = $("#in"), fb = $("#fb");
  if (!inp.value.trim()) { inp.focus(); return; }
  if (same(inp.value, w.w)) {
    const p = G.att ? 10 : 15; let b = 0;
    if (G.att) { G.second++; G.streak = 0; } else { G.first++; G.streak++; if (G.streak % 5 === 0) { b = 20; G.sb = true; } }
    G.ok++; G.pts += p + b; G.log.push([w.w, G.att ? "s" : "f"]); lockQ(); tone([523, 659, 784]); rain("⭐");
    fb.innerHTML = `<div class="good"><div class="stars">⭐⭐⭐</div><h2>SUPER! Das hast du toll gemacht!</h2><p>+${p} Punkte${b ? " und +" + b + " Serien-Bonus 🔥" : ""}</p><p class="sent">${w.s}</p>
      <button class="btn go" onclick="nextQ()">Weiter ➜</button></div>`;
  } else if (!G.att) {
    G.att = 1; tone([330, 330]);
    fb.innerHTML = `<div class="try"><h2>Guter Versuch! Schau noch einmal genau hin.</h2><p class="big">💡 ${hint(w.w)}</p><p>Du hast noch einen Versuch!</p></div>`;
    inp.select();
  } else {
    G.streak = 0; G.bad.push(w); G.log.push([w.w, "b"]); lockQ();
    fb.innerHTML = `<div class="try"><h2>Das richtige Wort ist</h2><p class="word">${hl(w.w)}</p><p>Merke dir die bunten Buchstaben!</p><p class="sent">${w.s}</p>
      <button class="btn alt" onclick="play()">🔁 Noch einmal hören</button><button class="btn go" onclick="nextQ()">Weiter ➜</button></div>`;
  }
}
function lockQ() { G.lock = true; $("#in").readOnly = true; $("#chk").disabled = true; }
function nextQ() { G.i++; if (G.i >= G.q.length) endRound(); else { question(); setTimeout(play, 300); } }

/* ---------- Rundenende ---------- */
function endRound() {
  const n = G.q.length, acc = Math.round(G.ok / n * 100), fa = Math.round(G.first / n * 100);
  let bonus = 0, earned = 0, unlocked = null, notes = [];
  if (G.mode === "lvl") {
    let st = 1; if (acc >= 80) st = 2; if (acc >= 90 && G.second <= 1) st = 3;
    earned = Math.max(0, st - (S.stars[G.lv] || 0)); S.stars[G.lv] = Math.max(st, S.stars[G.lv] || 0);
    G.st = st; S.acc[G.lv] = Math.max(acc, S.acc[G.lv] || 0);
    if (!S.done[G.lv]) { S.done[G.lv] = 1; bonus += 30; notes.push("🎉 Rundenbonus +30 (einmal pro Level)"); }
    const nl = LEVELS[G.lv]; if (nl && acc >= nl.req && !S.unl.includes(nl.id)) { S.unl.push(nl.id); unlocked = nl; }
  } else if (S.daily !== today()) { S.daily = today(); bonus += 50; notes.push("📅 Tagesaufgabe geschafft: +50 Punkte!"); }
  if (G.sb) S.bs = true;
  S.pts += G.pts + bonus; S.rounds++;
  G.log.forEach(([w, r]) => { const x = S.words[w] || (S.words[w] = { ok: 0, bad: 0 });
    if (r === "b") { x.bad++; if (!S.review.includes(w)) S.review.push(w); } else { x.ok++; if (r === "f") S.review = S.review.filter(y => y !== w); } });
  MS.forEach(m => { if (S.pts >= m[0] && !S.ms.includes(m[0])) { S.ms.push(m[0]); notes.push(m[1] + " Neue Belohnung: " + m[2] + "!"); if (m[0] === 750) S.avs.push("🐼"); } });
  ACH.forEach((a, i) => { if (!S.ach.includes(i) && a[2]()) { S.ach.push(i); notes.push(a[0] + " Neues Abzeichen: " + a[1] + "!"); } });
  save(); rain("🎉"); tone([523, 659, 784, 1047]);
  const mastered = G.log.filter(x => x[1] !== "b").map(x => x[0]);
  app.innerHTML = `<h1>Juhu! Du hast es geschafft!</h1><div class="card center"><div class="chest">🎁</div>
   ${G.mode === "lvl" ? `<div class="stars">${"⭐".repeat(G.st)}${"☆".repeat(3 - G.st)}</div>` : ""}
   <p class="big">🪙 ${G.pts + bonus} Punkte</p>
   <p>✅ Richtig: ${G.ok} von ${n} · ❌ Noch üben: ${G.bad.length}<br>Beim 1. Versuch richtig: ${fa} % · Insgesamt richtig: ${acc} %${G.mode === "lvl" ? "<br>Neue Sterne: +" + earned : ""}</p>
   ${notes.map(t => `<div class="toast">${t}</div>`).join("")}${unlocked ? `<div class="toast">🔓 Level ${unlocked.id} „${unlocked.name}“ ist offen!</div>` : ""}
   <p><b>Gemeistert:</b> ${mastered.length ? mastered.join(", ") : "–"}</p>
   <p><b>Nochmal üben:</b> ${G.bad.length ? G.bad.map(x => hl(x.w)).join(", ") : "Nichts – super! 🌟"}</p></div>
   <button class="btn go" onclick="playLevel(${G.mode === "lvl" ? G.lv : curLevel()})">🔁 Noch einmal spielen</button>
   <button class="btn alt" onclick="playLevel(${G.mode === "lvl" && S.unl.includes(G.lv + 1) ? G.lv + 1 : G.mode === "lvl" ? G.lv : curLevel()})">➡️ Nächste Runde</button>
   <button class="btn" onclick="home()">🗺️ Zur Abenteuerkarte</button>`;
}


/* ---------- Eltern-Dashboard ---------- */
function dashboard() {
  G = null; if (hasTTS) speechSynthesis.cancel();
  const all = LEVELS.flatMap(L => L.words.map(w => ({ ...w, level: L.name })));
  const scope = dashLevel === "all" ? [...new Map(all.map(w => [w.w, w])).values()] : all.filter(w => w.level === dashLevel);
  const status = w => S.review.includes(w) ? "practice" : S.words[w] && S.words[w].ok > 0 ? "known" : "new";
  const counts = { known: 0, practice: 0, new: 0 };
  scope.forEach(w => counts[status(w.w)]++);
  const shown = scope.filter(w => {
    const st = status(w.w);
    return (dashFilter === "all" || dashFilter === st) && (!dashQuery || (w.w + " " + w.cat + " " + w.level).toLocaleLowerCase("de").includes(dashQuery.toLocaleLowerCase("de")));
  });
  app.innerHTML = `<div class="top"><button class="ghost" onclick="home()" aria-label="Zurück">🏠</button><h2>👨‍👩‍👧 Eltern-Dashboard</h2><span class="pill">${scope.length} Wörter</span></div>
  <p class="sub">Wortkenntnis und Rechtschreibung im Überblick</p>
  <div class="row dash-summary"><button class="dash-count known" onclick="dashFilter='known';dashboard()"><b>✓ ${counts.known}</b><span>kennt sie</span></button><button class="dash-count practice" onclick="dashFilter='practice';dashboard()"><b>✗ ${counts.practice}</b><span>braucht Übung</span></button><button class="dash-count new" onclick="dashFilter='new';dashboard()"><b>○ ${counts.new}</b><span>noch nicht geübt</span></button></div>
  <div class="card"><label for="dash-level"><b>Level</b></label><select id="dash-level" class="dash-select" onchange="setDashLevel(this.value)"><option value="all" ${dashLevel === "all" ? "selected" : ""}>Alle Levels</option>${LEVELS.map(L => `<option value="${esc(L.name)}" ${dashLevel === L.name ? "selected" : ""}>Level ${L.id}: ${esc(L.name)}</option>`).join("")}</select>
  <label for="dash-search"><b>Wörter suchen</b></label><input id="dash-search" class="dash-search" placeholder="Wort oder Level eingeben …" value="${esc(dashQuery)}" oninput="setDashQuery(this.value)">
  <div class="card voice-card"><label for="voice-select"><b>🔊 Deutsche Stimme</b></label><select id="voice-select" class="dash-select" onchange="changeVoice(this.value)"><option>Deutsche Stimmen werden gesucht …</option></select><small class="voice-note">Die verfügbaren Stimmen hängen von Gerät und Browser ab. Stimmen mit „Natural“ oder „Online“ klingen oft natürlicher.</small><div class="row voice-actions"><button class="filter-btn" onclick="reloadVoices()">↻ Stimmen neu laden</button><button class="filter-btn" onclick="testVoice()">▶ Stimme testen</button></div><small id="voice-status" class="voice-note"></small></div>
  <div class="row dash-filters"><button class="filter-btn" onclick="dashFilter='all';dashboard()">Alle (${scope.length})</button><button class="filter-btn" onclick="dashFilter='known';dashboard()">✓ Kennt sie</button><button class="filter-btn" onclick="dashFilter='practice';dashboard()">✗ Üben</button><button class="filter-btn" onclick="dashFilter='new';dashboard()">○ Ungeübt</button></div>
  <div id="dash-list" class="dash-list">${dashRows(shown, status)}</div></div>
  <p class="note">✓ Mindestens einmal richtig geschrieben und nicht mehr auf der Übungsliste. ✗ Beim Spielen noch nicht richtig geschrieben. ○ Noch keine gespeicherten Ergebnisse.</p>
  ${backupPanel()}
  <div class="card"><h2>☁️ Fortschritt auf Google Drive</h2><p id="drive-status" class="drive-status">${esc(driveMessage || "Mit einer Google Drive Verbindung kannst du den Spielstand auf ein anderes Gerät übertragen.")}</p><button class="btn alt" onclick="syncProgress()">☁️ Jetzt mit Google Drive synchronisieren</button></div>
  <button class="btn alt" onclick="reset()">⚙️ Spielstand zurücksetzen</button><button class="btn" onclick="home()">Zur Abenteuerkarte</button>`;
  refreshVoicePicker();
}
function dashRows(words, status) {
  if (!words.length) return '<p>Keine passenden Wörter gefunden.</p>';
  return words.map(w => { const st = status(w.w), icon = st === "known" ? "✓" : st === "practice" ? "✗" : "○", label = st === "known" ? "Kennt sie" : st === "practice" ? "Braucht Übung" : "Noch ungeübt";
    const data = S.words[w.w], detail = data ? `Richtig: ${data.ok} · Fehler: ${data.bad}` : "Noch nicht gespielt";
    return `<div class="dash-word ${st}"><span class="dash-mark" aria-label="${label}">${icon}</span><span class="dash-word-main"><b>${esc(w.w)}</b><small>${esc(w.cat)} · ${esc(w.level)}</small></span><span class="dash-detail">${detail}</span></div>`;
  }).join("");
}
function setDashLevel(value) { dashLevel = value; dashboard(); }
function setDashQuery(value) {
  dashQuery = value;
  const all = LEVELS.flatMap(L => L.words.map(w => ({ ...w, level: L.name })));
  const scope = dashLevel === "all" ? [...new Map(all.map(w => [w.w, w])).values()] : all.filter(w => w.level === dashLevel);
  const status = w => S.review.includes(w) ? "practice" : S.words[w] && S.words[w].ok > 0 ? "known" : "new";
  const shown = scope.filter(w => (dashFilter === "all" || dashFilter === status(w.w)) && (!dashQuery || (w.w + " " + w.cat + " " + w.level).toLocaleLowerCase("de").includes(dashQuery.toLocaleLowerCase("de"))));
  const list = $("#dash-list"); if (list) list.innerHTML = dashRows(shown, status);
}

/* ---------- Belohnungen ---------- */
function setAv(a) { S.av = a; save(); rewards(); }
function rewards() {
  app.innerHTML = `<div class="top"><button class="ghost" onclick="home()">🏠</button><h2>🏆 Meine Belohnungen</h2><span class="pill">⭐ ${stars()}</span></div>
  <div class="card"><h2>Pokale & Schätze</h2><div class="grid">${MS.map(m => `<div class="tile ${S.ms.includes(m[0]) ? "" : "off"}"><b>${m[1]}</b>${m[2]}<br>${m[0]} Punkte</div>`).join("")}</div></div>
  <div class="card"><h2>Abzeichen</h2><div class="grid">${ACH.map((a, i) => `<div class="tile ${S.ach.includes(i) ? "" : "off"}"><b>${a[0]}</b>${a[1]}</div>`).join("")}</div></div>
  <div class="card"><h2>Meine Figur</h2><div class="grid">${S.avs.map(a => `<div class="tile ${a === S.av ? "sel" : ""}" onclick="setAv('${a}')"><b>${a}</b>${a === S.av ? "Gewählt" : "Wählen"}</div>`).join("")}</div></div>
  ${S.ms.includes(1000) ? `<div class="card center"><div class="chest">💎</div><p class="big">Du hast den Wortschatz gefunden!</p></div>` : ""}`;
}

if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));
home();
