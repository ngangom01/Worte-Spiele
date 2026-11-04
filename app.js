"use strict";
/* WORT-ABENTEUER V1 – Spiellogik. Wörter: words.js */
const KEY = "wortabenteuer.v1";
const $ = s => document.querySelector(s), app = $("#app");
const DEF = { name: "Abenteurer", pts: 0, unl: [1], stars: {}, acc: {}, done: {}, rounds: 0, ach: [],
  ms: [], words: {}, review: [], daily: "", av: "🦊", avs: ["🦊"], bs: false,
  uiLang: "de", parentPin: "1234", worldStars: {}, worldDone: [], dailyChallenge: null,
  dailyCompleted: [], mastery: {}, recentWrong: [], listenAnswered: 0, achievementsV3: {},
  coins: 0, ownedItems: [], equipped: { accessory: "", background: "default", mascot: "", celebration: "⭐" },
  adaptive: { current: "easy", recent: [] }, dailyGoalMinutes: 10, totalPracticeSeconds: 0,
  practiceTimeByDate: {}, modePlayed: {}, modeRecent: {}, history: [], worldRewards: [], levelUps: 0, levelRewards: [] };
// Belohnungen: [Punkte, Symbol, Name]
const MS = [[100,"🥉","Bronze-Pokal"],[250,"🥈","Silber-Pokal"],[500,"🥇","Gold-Pokal"],[750,"🐼","Neuer Avatar: Panda"],[1000,"🎁","Schatztruhe"]];
const ACH = [["🚀","Erste Runde",() => S.rounds >= 1],["🌟","5 Sterne gesammelt",() => stars() >= 5],
  ["🏆","Wortmeister (3 Sterne)",() => Object.values(S.stars).some(x => x === 3)],
  ["📅","Tagesheld",() => !!S.daily],["🔥","5er-Serie",() => S.bs]];
let S = null, G = null, dashFilter = "all", dashQuery = "", dashLevel = "all", dashDifficulty = "all", parentUnlocked = false;
let selectedDifficulty = "easy";
let miniGameState=null,miniAnimation=0,miniClock=null,miniReturnHTML="",miniReturnKind="home",miniLastFrame=0;
const GAME_MODES = [
  { id: "listen", icon: "🔊", name: "Hören & Schreiben", desc: "Hör genau hin und schreibe das Wort.", difficulty: "Ohr-Detektiv" },
  { id: "picture", icon: "🕵️", name: "Bilder-Detektiv", desc: "Welches Wort passt zum Bild?", difficulty: "Bild-Wortschatz" },
  { id: "missing", icon: "🧩", name: "Fehlende Buchstaben", desc: "Fülle die Lücken im Wort.", difficulty: "Buchstaben-Puzzle" },
  { id: "scramble", icon: "🔀", name: "Buchstaben-Mix", desc: "Bringe die Buchstaben in die richtige Reihenfolge.", difficulty: "Buchstaben-Puzzle" },
  { id: "sentence", icon: "📖", name: "Satz-Abenteuer", desc: "Hör den Satz und finde das fehlende Wort.", difficulty: "Satz-Verständnis" }
];
const DIFFICULTIES = { easy: "Leicht", medium: "Mittel", hard: "Knifflig" };
const AVATARS=["🦊","🐱","🐰","🐼","🦄"];
const SHOP_ITEMS=[
  {id:"scarf",group:"accessory",emoji:"🧣",name:"Bunter Schal",cost:8},{id:"glasses",group:"accessory",emoji:"👓",name:"Sternenbrille",cost:12},{id:"crown",group:"accessory",emoji:"👑",name:"Kleine Krone",cost:18},{id:"bow",group:"accessory",emoji:"🎀",name:"Zauberschleife",cost:14},
  {id:"forest",group:"background",emoji:"🌲",name:"Zauberwald",cost:15},{id:"sunset",group:"background",emoji:"🌅",name:"Abendhimmel",cost:18},{id:"space",group:"background",emoji:"🌌",name:"Sternenwelt",cost:22},{id:"berry",group:"background",emoji:"🍓",name:"Beerenwiese",cost:16},
  {id:"sparkles",group:"mascot",emoji:"✨",name:"Funkelnde Begleiter",cost:10},{id:"flower",group:"mascot",emoji:"🌼",name:"Blumenfreund",cost:12},{id:"butterfly",group:"mascot",emoji:"🦋",name:"Schmetterlingsfreund",cost:15},
  {id:"hearts",group:"celebration",emoji:"💖",name:"Herzchen-Regen",cost:20},{id:"rainbow",group:"celebration",emoji:"🌈",name:"Regenbogen-Party",cost:25}
];
const V3_ACHIEVEMENTS = [
  ["first-word","🔤","First Word","Erstes Wort","Answer your first word.","Beantworte dein erstes Wort."],
  ["spelling-star","🌟","Spelling Star","Rechtschreib-Stern","Get 10 words right.","Schreibe 10 Wörter richtig."],
  ["perfect-ten","💯","Perfect Ten","Zehn auf einen Streich","Finish a 10-word round without a mistake.","Schaffe eine Runde mit 10 Wörtern ohne Fehler."],
  ["word-explorer","🗺️","Word Explorer","Wort-Entdecker","Complete five world levels.","Schließe fünf Welt-Level ab."],
  ["listening-champion","🎧","Listening Champion","Hör-Champion","Complete 20 Listen & Spell questions.","Beantworte 20 Fragen bei Hören & Schreiben."],
  ["vocabulary-master","👑","Vocabulary Master","Wortschatz-Meister","Master 100 different words.","Meistere 100 verschiedene Wörter."],
  ["daily-hero","📅","Daily Hero","Tagesheld","Complete daily challenges on five days.","Schaffe Tagesaufgaben an fünf Tagen."]
];
const PROFILE_KEYS = ["name","pts","unl","stars","acc","done","rounds","ach","ms","words","review","daily","av","avs","bs","worldStars","worldDone","dailyChallenge","dailyCompleted","mastery","recentWrong","listenAnswered","achievementsV3","modeRecent","history","coins","ownedItems","equipped","adaptive","dailyGoalMinutes","totalPracticeSeconds","practiceTimeByDate","modePlayed","worldRewards","levelUps","levelRewards"];
S=load();selectedDifficulty=S.adaptive.current||"easy";
function clone(value){return JSON.parse(JSON.stringify(value));}
function profileSnapshot(source){const out={};PROFILE_KEYS.forEach(k=>{out[k]=source[k]===undefined?clone(DEF[k]):clone(source[k]);});return out;}
function initializeProfiles(source){
  const data=Object.assign(clone(DEF),source||{});
  if(!data.profiles||typeof data.profiles!=="object"||Array.isArray(data.profiles))data.profiles={};
  if(!Array.isArray(data.profileOrder)||!data.profileOrder.length)data.profileOrder=Object.keys(data.profiles);
  if(!data.profileOrder.length){data.profileOrder=["child-1"];data.activeProfileId="child-1";data.profiles["child-1"]=profileSnapshot(data);}
  const defaults=["child-1","child-2","child-3"];
  defaults.forEach((id,i)=>{if(!data.profileOrder.includes(id)){data.profileOrder.push(id);data.profiles[id]=profileSnapshot(Object.assign(clone(DEF),{name:i===0?data.name:`Kind ${i+1}`}));}});
  data.profileOrder.forEach(id=>{if(!data.profiles[id])data.profiles[id]=profileSnapshot(Object.assign(clone(DEF),{name:`Kind ${data.profileOrder.indexOf(id)+1}`}));});
  if(!data.activeProfileId||!data.profileOrder.includes(data.activeProfileId))data.activeProfileId=data.profileOrder[0];
  data.profiles[data.activeProfileId]=profileSnapshot(data);
  data.coins=Number(data.coins||0);data.ownedItems=Array.isArray(data.ownedItems)?data.ownedItems:[];
  data.equipped=Object.assign(clone(DEF.equipped),data.equipped||{});data.adaptive=Object.assign(clone(DEF.adaptive),data.adaptive||{});
  data.levelUps=Number(data.levelUps||0);data.levelRewards=Array.isArray(data.levelRewards)?data.levelRewards:[];
  return data;
}
const isEnglish = () => S.uiLang === "en";
const tr = (de, en) => isEnglish() ? en : de;
function languageToggle(){return `<div class="lang-toggle" role="group" aria-label="Language"><button class="${isEnglish()?"":"active"}" onclick="setLanguage('de')">DE</button><button class="${isEnglish()?"active":""}" onclick="setLanguage('en')">EN</button></div>`;}
function setLanguage(lang){S.uiLang=lang==="en"?"en":"de";save();if(parentUnlocked&&document.querySelector("#dash-level"))dashboard();else if(document.querySelector("#voice-select")||document.querySelector("#drive-client-id"))settings();else home();}
const DRIVE_CLIENT_KEY = "wortabenteuer.googleClientId.v1";

function load() { try { return initializeProfiles(JSON.parse(localStorage[KEY] || "{}")); } catch (e) { return initializeProfiles(DEF); } }
function save() { try { S.updatedAt = Date.now();if(S.profiles&&S.activeProfileId)S.profiles[S.activeProfileId]=profileSnapshot(S);localStorage[KEY] = JSON.stringify(S); } catch (e) {} }
function ensureWordStat(word){const stat=S.words[word]||(S.words[word]={ok:0,bad:0});stat.ok=Number(stat.ok||0);stat.bad=Number(stat.bad||0);stat.correct=Number(stat.correct??stat.ok);stat.incorrect=Number(stat.incorrect??stat.bad);stat.attempts=Number(stat.attempts??(stat.ok+stat.bad));stat.lastPracticeDate=stat.lastPracticeDate||"";stat.difficultyScore=Number(stat.difficultyScore||0);return stat;}
function refreshWordClassification(word,stat){const attempts=stat.attempts||0;stat.difficultyScore=attempts?Math.round((stat.incorrect||stat.bad||0)/attempts*100):0;const mastery=S.mastery[word];stat.masteryStatus=attempts===0?"new":mastery?.mastered?"mastered":attempts>=3&&stat.difficultyScore>=40?"difficult":"learning";}
function countDueWords(){const date=localDateKey(new Date());return Object.values(S.words||{}).filter(x=>x.nextReviewAt&&x.nextReviewAt<=date).length;}
function recordMiss(word){const stat=ensureWordStat(word);stat.bad++;stat.incorrect++;stat.attempts++;stat.lastPracticeDate=localDateKey(new Date());stat.reviewStep=0;const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);stat.nextReviewAt=localDateKey(tomorrow);S.mastery[word]=S.mastery[word]||{correctRounds:0,lastRound:"",mastered:false};S.mastery[word].correctRounds=0;S.mastery[word].mastered=false;delete S.mastery[word].masteredAt;S.mastery[word].lastRound=G?.roundId||"";refreshWordClassification(word,stat);S.review=Array.isArray(S.review)?S.review:[];if(!S.review.includes(word))S.review.push(word);S.recentWrong=Array.isArray(S.recentWrong)?S.recentWrong:[];S.recentWrong.push({word,date:localDateKey(new Date())});S.recentWrong=S.recentWrong.slice(-250);save();}
function scheduleCorrectWord(word,stat){const delays=[1,3,7,14],step=Math.min(3,Number(stat.reviewStep||0)),next=new Date();next.setDate(next.getDate()+delays[step]);stat.nextReviewAt=localDateKey(next);stat.reviewStep=Math.min(3,step+1);}
function recordRoundProgress(){if(!G||G.progressRecorded)return;G.progressRecorded=true;const masterySeen=new Set(),scheduleSeen=new Set();G.log.forEach(([word])=>{const stat=ensureWordStat(word);stat.ok++;stat.correct++;stat.attempts++;stat.lastPracticeDate=localDateKey(new Date());const master=S.mastery[word]||(S.mastery[word]={correctRounds:0,lastRound:"",mastered:false});if(!masterySeen.has(word)&&master.lastRound!==G.roundId){master.correctRounds++;master.lastRound=G.roundId;if(master.correctRounds>=3&&!master.mastered){master.mastered=true;master.masteredAt=localDateKey(new Date());S.review=S.review.filter(x=>x!==word);}}if(!scheduleSeen.has(word))scheduleCorrectWord(word,stat);refreshWordClassification(word,stat);masterySeen.add(word);scheduleSeen.add(word);if(G.mode==="listen")S.listenAnswered=(S.listenAnswered||0)+1;});if(Object.values(S.words).reduce((n,x)=>n+(x.ok||0),0)>=10)unlockV3("spelling-star");if(G.mode==="listen"&&(S.listenAnswered||0)>=20)unlockV3("listening-champion");if(Object.values(S.mastery).filter(x=>x.mastered).length>=100)unlockV3("vocabulary-master");save();}
function recordDuration(){if(!G||G.durationRecorded)return;const seconds=Math.max(0,Math.round((Date.now()-(G.startedAt||Date.now()))/1000)),date=localDateKey(new Date());G.durationRecorded=true;G.durationSeconds=seconds;S.totalPracticeSeconds=(S.totalPracticeSeconds||0)+seconds;S.practiceTimeByDate=S.practiceTimeByDate||{};S.practiceTimeByDate[date]=(S.practiceTimeByDate[date]||0)+seconds;}
function adjustAdaptiveDifficulty(){const order=["easy","medium","hard"],now=S.adaptive?.current||"easy",score=G.baseTotal?Number(G.firstTryCorrect||0)/G.baseTotal*100:0;S.adaptive=S.adaptive||{current:"easy",recent:[]};S.adaptive.recent=Array.isArray(S.adaptive.recent)?S.adaptive.recent:[];S.adaptive.recent.push(Math.round(score));S.adaptive.recent=S.adaptive.recent.slice(-12);let i=Math.max(0,order.indexOf(now));if(score<60)i=Math.max(0,i-1);else if(score>85)i=Math.min(order.length-1,i+1);S.adaptive.current=order[i];selectedDifficulty=order[i];}
function awardRoundAchievements(){if((G.baseTotal||G.q.length)===10&&(G.baseCorrect||0)===10&&!(G.mistakes||[]).length)unlockV3("perfect-ten");if((S.worldDone||[]).length>=5)unlockV3("word-explorer");if((S.dailyCompleted||[]).length>=5)unlockV3("daily-hero");}
const stars = () => Object.values(S.stars).reduce((a, b) => a + b, 0) + Object.values(S.worldStars||{}).reduce((a,b)=>a+Number(b||0),0);
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
  const systemOption = `<option value="__system__" ${voice ? "" : "selected"}>${tr("Gerätestimme verwenden (Systemauswahl)","Use device voice (system default)")}</option>`;
  select.innerHTML = systemOption + v.map(x => { const key = x.name + "|" + x.lang; return `<option value="${esc(key)}" ${voice && voice.name === x.name && voice.lang === x.lang ? "selected" : ""}>${esc(x.name)} (${esc(x.lang)})${/natural|neural|premium|enhanced|siri|google|online/i.test(x.name) ? " · Natürlich/Online" : ""}</option>`; }).join("");
}
function reloadVoices() {
  if (!hasTTS) return;
  speechSynthesis.cancel();
  speechSynthesis.getVoices();
  setTimeout(() => { pickVoice(); refreshVoicePicker(); const status = $("#voice-status"); if (status) status.textContent = germanVoices().length ? tr("Stimmenliste aktualisiert. Mit „Stimme testen“ anhören.","Voice list updated. Tap ‘Test voice’ to listen.") : tr("Keine deutsche Stimme an den Browser gemeldet. Safari vollständig schließen und erneut öffnen.","The browser did not report a German voice. Fully close Safari and reopen it."); }, 250);
}
function testVoice() {
  if (!hasTTS) return;
  pickVoice(); speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance("Guten Tag! Ich spreche jetzt das deutsche Wort: Abend.");
  utterance.lang = voice ? voice.lang : "de-DE"; utterance.rate = 0.9;
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}
function changeVoice(key) { if (key === "__system__") localStorage.removeItem(VOICE_KEY); else localStorage.setItem(VOICE_KEY, key); pickVoice(); S.updatedAt = Date.now(); save(); }
if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = () => { pickVoice(); refreshVoicePicker(); }; }
addEventListener("pageshow", () => { if (document.querySelector("#voice-select")) reloadVoices(); });
document.addEventListener("visibilitychange", () => { if (!document.hidden && document.querySelector("#voice-select")) reloadVoices(); });
function play() {
  if (!G || !hasTTS) return;
  speechSynthesis.cancel();
  const item = G.q[G.i];
  const spoken = G.mode === "sentence" ? blankSentence(item, "…") : item.w;
  const u = new SpeechSynthesisUtterance(spoken);
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
const norm = s => s.normalize("NFC").trim().replace(/^./, c => c.toLocaleLowerCase("de"));
const same = (a, b) => {const x=String(a).normalize("NFC").trim(),y=String(b).normalize("NFC").trim(),first=y[0];return first&&first!==first.toLocaleLowerCase("de")?x===y:norm(x)===norm(y);};
function spellingExplanation(correct,attempt){const c=correct.toLocaleLowerCase("de"),a=attempt.toLocaleLowerCase("de");if(correct[0]!==correct[0].toLocaleLowerCase("de")&&a===c)return "Fast richtig! Dieses Nomen beginnt mit einem großen Buchstaben.";for(const [letter,plain]of [["ä","a"],["ö","o"],["ü","u"]])if(c.includes(letter)&&c.replaceAll(letter,plain)===a)return `Fast richtig! Hier braucht das Wort ein ${letter}. Schau dir die zwei Punkte über dem Buchstaben an!`;if(c.includes("ß")&&c.replaceAll("ß","ss")===a)return "Fast richtig! Hier schreibt man ß statt ss.";if(c.includes("ss")&&c.replaceAll("ss","ß")===a)return "Fast richtig! Hier schreibt man ss statt ß.";if(c.includes("ie")&&c.replaceAll("ie","ei")===a)return "Hör genau hin: Hier stehen i und e als ie, nicht als ei.";if(c.includes("ei")&&c.replaceAll("ei","ie")===a)return "Hör genau hin: Hier stehen e und i als ei, nicht als ie.";const doubled=c.match(/(.)\1/);if(doubled&&c.replace(doubled[0],doubled[1])===a)return `Fast! ${doubled[1]} steht hier zweimal hintereinander.`;for(const cluster of ["sch","ch","sp","st"])if(c.includes(cluster)&&!a.includes(cluster))return `Achte auf die Buchstabengruppe ${cluster}.`;return "Fast richtig! Schau noch einmal auf die Reihenfolge und jeden einzelnen Buchstaben.";}
function wordStatus(word){const x=S.words[word]||{},tries=Number(x.attempts||((x.ok||0)+(x.bad||0)));if(!tries)return "new";if(S.mastery[word]?.mastered)return "mastered";if(tries>=3&&Number(x.difficultyScore||0)>=35)return "difficult";return "learning";}
function applyTheme(){if(document.body)document.body.dataset.theme=(S.equipped&&S.equipped.background)||"default";}

/* ---------- Design: Hell / Dunkel / Automatisch (gilt für dieses Gerät) ---------- */
const THEME_KEY="wortabenteuer.theme";
function themeMode(){const t=localStorage.getItem(THEME_KEY);return t==="dark"||t==="auto"?t:"light";}
function applyMode(){const m=themeMode(),dark=m==="dark"||(m==="auto"&&window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.mode=dark?"dark":"light";const mt=document.querySelector('meta[name="theme-color"]');if(mt)mt.content=dark?"#1d2150":"#36b5e8";}
function setThemeMode(m){try{localStorage.setItem(THEME_KEY,m);}catch(e){}applyMode();settings();}
try{matchMedia("(prefers-color-scheme: dark)").addEventListener("change",applyMode);}catch(e){}
function themePanel(){const m=themeMode(),b=(id,ico,de,en)=>`<button class="seg-btn ${m===id?"on":""}" onclick="setThemeMode('${id}')" aria-pressed="${m===id}">${ico} ${tr(de,en)}</button>`;return `<div class="card"><h2>🎨 ${tr("Aussehen","Appearance")}</h2><p>${tr("Wähle ein helles oder dunkles Design.","Choose a light or dark theme.")}</p><div class="theme-toggle" role="group" aria-label="${tr("Design","Theme")}">${b("light","☀️","Hell","Light")}${b("dark","🌙","Dunkel","Dark")}${b("auto","📱","Automatisch","Auto")}</div></div>`;}
applyMode();
function avatarPresentation(){const accessory=SHOP_ITEMS.find(x=>x.id===S.equipped?.accessory),mascot=SHOP_ITEMS.find(x=>x.id===S.equipped?.mascot);return `${S.av||"🦊"}${accessory?accessory.emoji:""}${mascot?mascot.emoji:""}`;}
function mascotCheer(){const lines=["Du schaffst das!","Juhu, toll gemacht!","Weiter so, Wortheldin!","Dein Maskottchen feuert dich an!"];return lines[Math.floor(Math.random()*lines.length)];}
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
  G = null; parentUnlocked=false;applyTheme(); if (hasTTS) speechSynthesis.cancel();
  const nx = MS.find(m => S.pts < m[0]), pv = [...MS].reverse().find(m => S.pts >= m[0]), lo = pv ? pv[0] : 0;
  const pc = nx ? Math.round((S.pts - lo) / (nx[0] - lo) * 100) : 100;
  const dDone = S.daily === today();
  const practiced=Object.values(S.words||{}).filter(x=>(x.attempts||((x.ok||0)+(x.bad||0)))>0).length,mastered=Object.values(S.mastery||{}).filter(x=>x.mastered).length,due=countDueWords(),todayMinutes=Math.floor(Number((S.practiceTimeByDate||{})[localDateKey(new Date())]||0)/60),modeCount=Object.values(S.modePlayed||{}).reduce((a,b)=>a+(b||0),0);
  app.innerHTML = `<h1>WORT-ABENTEUER</h1><p class="sub">Hör zu, schreib richtig und werde ein Wortmeister!</p>
  <div class="card profile-bar"><label for="profile-select">👧 ${tr("Wer spielt heute?","Who is playing?")}</label><select id="profile-select" class="dash-select" onchange="switchProfile(this.value)">${S.profileOrder.map(id=>`<option value="${esc(id)}" ${id===S.activeProfileId?"selected":""}>${esc(S.profiles[id]?.name||"Kind")}</option>`).join("")}</select><small>${tr("Jedes Kind hat eigene Wörter, Sterne und Münzen.","Each child has separate words, stars and coins.")}</small></div>
  ${levelRewardHomeHTML()}
  <div class="card center"><button class="ghost" onclick="rename()" style="font-size:20px;width:100%"><span class="avatar-face">${avatarPresentation()}</span> ${esc(S.name)} ✏️</button>
   <div class="row" style="margin-top:10px"><span class="pill">Level ${curLevel()}</span><span class="pill">🪙 ${S.pts} Punkte</span><span class="pill">🪙 ${Number(S.coins||0)} Word Coins</span><span class="pill">⭐ ${stars()} Sterne</span></div>
   <p style="margin:10px 0 0">${nx ? "Nächste Belohnung: " + nx[1] + " bei " + nx[0] + " Punkten" : "Alle Belohnungen geschafft! 🎉"}</p><div class="bar"><i style="width:${pc}%"></i></div></div>
  <div class="card all-progress"><h2>📊 Dein Fortschritt in allen Spielen</h2><div class="row"><span class="pill">📚 ${practiced} Wörter geübt</span><span class="pill">👑 ${mastered} gemeistert</span><span class="pill">🔁 ${due} zur Wiederholung</span><span class="pill">🎮 ${modeCount} Runden</span></div><p>${todayMinutes}/${S.dailyGoalMinutes} Minuten heute · Tagesziel</p><div class="bar"><i style="width:${Math.min(100,todayMinutes/S.dailyGoalMinutes*100)}%"></i></div><small>Wortbibliothek: Lessing Schule 2b · ${[...new Set(LEVELS.flatMap(l=>l.words.map(w=>w.w)))].length} Wörter</small></div>
  <section class="world-home"><div class="world-heading"><h2>🌍 Meine Lernwelt</h2><span class="pill">⭐ ${Object.values(S.worldStars||{}).reduce((n,x)=>n+Number(x||0),0)} Level-Sterne</span></div><div class="world-map">${WORLDS.map(w=>{const earned=w.levels.reduce((n,l)=>n+Number(S.worldStars[l.id]||0),0);return `<button class="world-card world-${w.id}" onclick="openWorld('${w.id}')"><span>${w.icon}</span><b>${w.de}</b><small>${w.en} · ${earned} ⭐ · ${w.levels.length} Level</small></button>`;}).join("")}</div></section>
  <section class="mode-section"><h2>🎮 Such dir ein Spiel aus!</h2><div class="difficulty-pick" role="group" aria-label="Schwierigkeit">${Object.entries(DIFFICULTIES).map(([id,label]) => `<button class="difficulty-chip ${selectedDifficulty===id?"selected":""}" onclick="setDifficulty('${id}')">${id==="easy"?"🌱":id==="medium"?"⭐":"🚀"} ${label}</button>`).join("")}</div>
  <div class="mode-grid">${GAME_MODES.map(m=>`<button class="mode-card mode-${m.id}" onclick="startMode('${m.id}')"><span class="mode-icon">${m.icon}</span><b>${m.name}</b><small>${m.desc}</small><span class="mode-meta">${availableWords(m.id,selectedDifficulty)} Wörter · ${DIFFICULTIES[selectedDifficulty]}</span></button>`).join("")}</div></section>
  <details class="legacy-levels"><summary>🗺️ Klassische Level öffnen</summary><p>Die Lessing Schule 2b Wortbibliothek bleibt in den Spielen verfügbar.</p>
  ${LEVELS.map((L, i) => { const open = S.unl.includes(L.id);
    return `<button class="lv ${open ? "" : "lock"}" onclick="${open ? `playLevel(${L.id})` : `lockMsg(${L.id})`}"><span class="ic">${open ? L.icon : "🔒"}</span>
    <span><b>Level ${L.id}: ${L.name}</b><small>${open ? "⭐".repeat(S.stars[L.id] || 0) + "☆".repeat(3 - (S.stars[L.id] || 0)) : "Gesperrt – tippe für den Tipp"}</small></span></button>`; }).join("")}</details>
  <button class="btn alt" onclick="startDaily()" ${dDone ? "disabled" : ""}>📅 ${dDone ? "Tagesaufgabe geschafft ✓" : "Tagesaufgabe: 10 Wörter · +50 Punkte"}</button>
  <button class="btn" onclick="revision()">🧠 Wörter üben</button>
  <button class="btn go" onclick="wordShop()">🛍️ Word-Coin-Shop (${S.coins||0})</button>
  <button class="btn" onclick="rewards()">🏆 Meine Belohnungen</button>
  <button class="btn alt" onclick="trophyCabinet()">🏆 Trophäenschrank</button>
  <button class="btn" onclick="dashboard()">👨‍👩‍👧 Eltern-Dashboard</button>
  <p class="center"><button class="ghost" onclick="settings()" aria-label="Einstellungen">⚙️</button></p>`;
}
function openWorld(id){const world=WORLDS.find(w=>w.id===id);if(!world)return;G=null;if(hasTTS)speechSynthesis.cancel();const starsEarned=world.levels.reduce((n,l)=>n+Number(S.worldStars[l.id]||0),0);
  app.innerHTML=`<div class="top"><button class="ghost" onclick="home()">🏠</button><h2>${world.icon} ${world.de} · ${world.en}</h2><span class="pill">⭐ ${starsEarned}</span></div><p class="sub">Sammle mindestens einen Stern, um das nächste Level zu öffnen!</p><p class="star-legend">⭐ 1 Stern: 5–6 richtig · ⭐⭐ 2 Sterne: 7–8 · ⭐⭐⭐ 3 Sterne: 9–10</p><div class="world-level-list">${world.levels.map((l)=>{const open=worldLevelOpen(l.id),score=Number(S.worldStars[l.id]||0),done=(S.worldDone||[]).includes(l.id);return `<button class="world-level ${open?"":"locked"}" ${open?`onclick="startWorldLevel('${l.id}')"`:`onclick="worldLockMessage('${l.id}')"`}><span class="world-level-icon">${open?"🗺️":"🔒"}</span><span class="world-level-copy"><b>${esc(l.name)}${isEnglish()?` · Level ${l.index+1}`:""}</b><small>${open?`${l.words.length} Wörter · ${done?"Geschafft":"Bereit"}`:"Erst im vorherigen Level einen Stern verdienen"}</small></span><span class="world-level-stars">${"⭐".repeat(score)}${"☆".repeat(3-score)}</span></button>`;}).join("")}</div><button class="btn" onclick="home()">Zurück zur Abenteuerkarte</button>`;
}
function worldLockMessage(id){const i=WORLD_LEVELS.findIndex(l=>l.id===id),p=WORLD_LEVELS[i-1];alert(tr(`🔒 Spiele zuerst „${p.name}“ und verdiene mindestens einen Stern.`,`🔒 First earn at least one star in “${p.name}”.`));}
function startWorldLevel(id){const level=WORLD_LEVELS.find(l=>l.id===id);if(!level||!worldLevelOpen(id)){worldLockMessage(id);return;}selectedDifficulty="medium";startRound(shuffle(level.words).slice(0,10),"world",id);}
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function lockMsg(id) { const L = LEVELS[id - 1], p = LEVELS[id - 2]; alert("🔒 Spiele zuerst „" + p.name + "“ und schreibe mindestens " + L.req + "% richtig. Dann geht dieses Level auf!"); }
function rename() { const n = prompt("Wie heißt du?", S.name); if (n && n.trim()) { S.name = n.trim().slice(0, 16); save(); home(); } }
function switchProfile(id){
  if(!S.profileOrder.includes(id)||id===S.activeProfileId)return;
  const profiles=S.profiles,order=S.profileOrder,language=S.uiLang,pin=S.parentPin;
  save();const next=clone(profiles[id]);PROFILE_KEYS.forEach(k=>{S[k]=next[k]===undefined?clone(DEF[k]):clone(next[k]);});
  S.profiles=profiles;S.profileOrder=order;S.activeProfileId=id;S.uiLang=language;S.parentPin=pin;
  selectedDifficulty=S.adaptive.current||"easy";parentUnlocked=false;applyTheme();save();home();
}
function reset() {
  const a = 3 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7);
  if(String(prompt(tr("Eltern-PIN eingeben:","Enter parent PIN:"),""))!==String(S.parentPin||"1234")){alert(tr("Falsche PIN.","Incorrect PIN."));return;}
  if (confirm(tr("Den gesamten Spielstand wirklich löschen?","Permanently erase all saved progress?")) && prompt(tr("Elternfrage:","Parent check:") + " " + a + " + " + b + " = ?") == a + b) { S = initializeProfiles(DEF);selectedDifficulty="easy";save();home(); }
}
function parentGate(){const value=prompt(tr("Eltern-PIN eingeben:","Enter parent PIN:"),"");if(String(value||"")!==String(S.parentPin||"1234")){alert(tr("Falsche PIN. Das Dashboard bleibt gesperrt.","Incorrect PIN. The dashboard remains locked."));return;}parentUnlocked=true;dashboard();}
function changeParentPin(){const old=prompt(tr("Aktuelle Eltern-PIN:","Current parent PIN:"),"");if(String(old||"")!==String(S.parentPin||"1234")){alert(tr("Falsche PIN.","Incorrect PIN."));return;}const next=prompt(tr("Neue 4- bis 8-stellige PIN eingeben:","Enter a new 4–8 digit PIN:"),"");if(!/^\d{4,8}$/.test(next||"")){alert(tr("Die PIN muss aus 4 bis 8 Ziffern bestehen.","PIN must contain 4 to 8 digits."));return;}S.parentPin=next;save();alert(tr("Eltern-PIN gespeichert.","Parent PIN saved."));settings();}
function setDailyGoal(value){const entered=prompt(tr("Eltern-PIN eingeben:","Enter parent PIN:"),"");if(entered===null){settings();return;}if(String(entered)!==String(S.parentPin||"1234")){alert(tr("Falsche PIN.","Incorrect PIN."));settings();return;}S.dailyGoalMinutes=Math.max(5,Math.min(20,Number(value)||10));save();settings();}


/* ---------- Google Drive Spielstand ---------- */
let driveTokenClient = null, driveToken = null, driveMessage = "", gsiLoading = false, driveCompletion = null;
function driveStatus(message) { driveMessage = message; const shown=localizedDriveMessage(message),el = $("#drive-status"); if (el) el.textContent = shown; const leave=$("#leave-status"); if(leave)leave.textContent=shown; }
function localizedDriveMessage(message){if(!isEnglish())return message;const pairs={"OAuth Client-ID auf diesem Gerät gespeichert.":"OAuth client ID saved on this device.","Keine OAuth Client-ID gespeichert.":"No OAuth client ID saved.","Trage zuerst eine Google OAuth Web-Client-ID in Einstellungen ein und speichere sie.":"Enter and save a Google OAuth Web Client ID in Settings first.","Google Drive benötigt HTTPS oder localhost. Lokal gespeichert; öffne das Spiel über seine gehostete Adresse.":"Google Drive requires HTTPS or localhost. Progress is saved locally; open the hosted app URL.","Verbinde mit Google …":"Connecting to Google …","Google-Anmeldung wird geladen. Tippe danach erneut auf „Jetzt synchronisieren“.":"Loading Google sign-in. Tap ‘Sync now’ again when ready.","Google-Anmeldung bereit. Tippe erneut auf „Speichern & synchronisieren“.":"Google sign-in is ready. Tap ‘Sync now’ again.","Google-Anmeldung konnte nicht geladen werden. Prüfe die Internetverbindung.":"Could not load Google sign-in. Check your internet connection.","Google-Anmeldung wird noch geladen. Bitte kurz warten.":"Google sign-in is still loading. Please wait.","Google Drive Anmeldung fehlgeschlagen.":"Google Drive sign-in failed.","Google-Anmeldung konnte nicht gestartet werden.":"Could not start Google sign-in.","Suche den Spielstand in Google Drive …":"Looking for progress in Google Drive …","Neuester Spielstand von Google Drive geladen.":"Loaded the newest saved progress from Google Drive.","Spielstand in Google Drive gespeichert. Auf einem anderen Gerät synchronisiere mit demselben Google-Konto.":"Progress saved in Google Drive. Sync on your other device using the same Google account."};if(pairs[message])return pairs[message];if(message.startsWith("Synchronisierung fehlgeschlagen:"))return "Sync failed: "+message.slice("Synchronisierung fehlgeschlagen:".length).trim();return message;}
function finishDriveSync(ok) { const callback=driveCompletion; driveCompletion=null; if(callback)callback(ok); }
function getDriveClientId() { return localStorage.getItem(DRIVE_CLIENT_KEY) || window.WORT_GOOGLE_CLIENT_ID || ""; }
function saveDriveClientId() { const input = $("#drive-client-id"), value = input ? input.value.trim() : ""; if (value) localStorage.setItem(DRIVE_CLIENT_KEY,value); else localStorage.removeItem(DRIVE_CLIENT_KEY); driveStatus(value ? "OAuth Client-ID auf diesem Gerät gespeichert." : "Keine OAuth Client-ID gespeichert."); }
function drivePanel() { return `<div class="card"><h2>☁️ ${tr("Fortschritt mit Google Drive","Google Drive progress sync")}</h2><p>${tr("Füge deine Google OAuth Web-Client-ID ein (kein Client Secret). Google Drive API muss aktiviert sein; die App muss über HTTPS oder localhost geöffnet werden.","Enter your Google OAuth Web Client ID (never a client secret). Enable the Google Drive API and open the app over HTTPS or localhost.")}</p><label for="drive-client-id"><b>${tr("OAuth Client-ID","OAuth Client ID")}</b></label><input id="drive-client-id" class="dash-search" autocomplete="off" placeholder="…apps.googleusercontent.com" value="${esc(getDriveClientId())}"><button class="filter-btn" onclick="saveDriveClientId()">${tr("Client-ID speichern","Save client ID")}</button><p id="drive-status" class="drive-status">${esc(driveMessage ? localizedDriveMessage(driveMessage) : tr("Nach dem Speichern kannst du den Fortschritt synchronisieren.","After saving, you can sync progress."))}</p><button class="btn alt" onclick="syncProgress()">☁️ ${tr("Jetzt synchronisieren","Sync now")}</button></div>`; }
function syncProgress(onComplete) {
  if(typeof onComplete === "function")driveCompletion=onComplete;
  const clientId = getDriveClientId();
  if (!clientId || clientId.includes("YOUR_GOOGLE")) { driveStatus("Trage zuerst eine Google OAuth Web-Client-ID in Einstellungen ein und speichere sie."); finishDriveSync(false); return; }
  if (location.protocol === "file:") { driveStatus("Google Drive benötigt HTTPS oder localhost. Lokal gespeichert; öffne das Spiel über seine gehostete Adresse."); finishDriveSync(false); return; }
  driveStatus("Verbinde mit Google …");
  if (window.google?.accounts?.oauth2) requestDriveToken(clientId); else if (!gsiLoading) {
    gsiLoading = true; driveStatus("Google-Anmeldung wird geladen. Tippe danach erneut auf „Jetzt synchronisieren“.");
    const script = document.createElement("script"); script.src = "https://accounts.google.com/gsi/client"; script.async = true;
    script.onload = () => { gsiLoading = false; driveStatus("Google-Anmeldung bereit. Tippe erneut auf „Speichern & synchronisieren“."); };
    script.onerror = () => { gsiLoading = false; driveStatus("Google-Anmeldung konnte nicht geladen werden. Prüfe die Internetverbindung."); finishDriveSync(false); }; document.head.appendChild(script);
  } else driveStatus("Google-Anmeldung wird noch geladen. Bitte kurz warten.");
}
function requestDriveToken(clientId) {
  try {
    driveTokenClient = google.accounts.oauth2.initTokenClient({ client_id: clientId, scope: "https://www.googleapis.com/auth/drive.appdata", callback: async result => {
      if (result.error) { driveStatus("Google Drive Anmeldung fehlgeschlagen."); finishDriveSync(false); return; }
      driveToken = result.access_token;
      try { await syncDriveFile(); finishDriveSync(true); } catch (e) { driveStatus("Synchronisierung fehlgeschlagen: " + (e.message || "Verbindungsfehler")); finishDriveSync(false); }
    }});
    driveTokenClient.requestAccessToken({ prompt: "" });
  } catch (e) { driveStatus("Google-Anmeldung konnte nicht gestartet werden."); finishDriveSync(false); }
}
async function syncDriveFile() {
  driveStatus("Suche den Spielstand in Google Drive …");
  const headers = { Authorization: "Bearer " + driveToken };
  const q = encodeURIComponent("name='wort-abenteuer-progress.json' and 'appDataFolder' in parents and trashed=false");
  const listRes = await fetch("https://www.googleapis.com/drive/v3/files?q=" + q + "&spaces=appDataFolder&fields=files(id,name,modifiedTime)", { headers });
  if (!listRes.ok) throw new Error("Google Drive konnte nicht gelesen werden.");
  const files = (await listRes.json()).files || [], remoteFile = files[0];
  let localTime = Number(S.updatedAt || 0);
  if (!localTime && localStorage[KEY]) { save(); localTime = Number(S.updatedAt || Date.now()); }
  if (remoteFile) {
    const getRes = await fetch("https://www.googleapis.com/drive/v3/files/" + encodeURIComponent(remoteFile.id) + "?alt=media", { headers });
    if (!getRes.ok) throw new Error("Der gespeicherte Spielstand konnte nicht geladen werden.");
    const remote = await getRes.json(), remoteProgress = remote.progress || remote;
    const remoteTime = Number(remoteProgress.updatedAt || Date.parse(remoteFile.modifiedTime) || 0);
    if (remoteTime > localTime) {
      remoteProgress.updatedAt = remoteTime;
      S = initializeProfiles(Object.assign(JSON.parse(JSON.stringify(DEF)), remoteProgress));selectedDifficulty=S.adaptive.current||"easy";
      if (remote.settings && remote.settings.voice) localStorage.setItem(VOICE_KEY,remote.settings.voice); else localStorage.removeItem(VOICE_KEY);
      save(); driveStatus("Neuester Spielstand von Google Drive geladen."); home(); return;
    }
  }
  const metadata = remoteFile ? { name: "wort-abenteuer-progress.json" } : { name: "wort-abenteuer-progress.json", parents: ["appDataFolder"] };
  const payload = { format: "wort-abenteuer-drive-sync", version: 1, updatedAt: localTime, progress: S, settings: { voice: localStorage.getItem(VOICE_KEY) || "" } };
  const boundary = "wortabenteuer_" + Date.now().toString(16);
  const body = "--" + boundary + "\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n" + JSON.stringify(metadata) + "\r\n--" + boundary + "\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n" + JSON.stringify(payload) + "\r\n--" + boundary + "--";
  const url = remoteFile ? "https://www.googleapis.com/upload/drive/v3/files/" + encodeURIComponent(remoteFile.id) + "?uploadType=multipart" : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
  const putRes = await fetch(url, { method: remoteFile ? "PATCH" : "POST", headers: { ...headers, "Content-Type": "multipart/related; boundary=" + boundary }, body });
  if (!putRes.ok) throw new Error("Der Spielstand konnte nicht in Google Drive gespeichert werden.");
  driveStatus("Spielstand in Google Drive gespeichert. Auf einem anderen Gerät synchronisiere mit demselben Google-Konto.");
}

function backupPanel() {
  return `<div class="card"><h2>💾 ${tr("Spielstand sichern & übertragen","Back up & transfer progress")}</h2><p>${tr("Die Sicherungsdatei enthält den Spielstand und die ausgewählte Stimme. Lade sie herunter, speichere sie in Google Drive und importiere sie auf dem anderen Gerät.","The backup includes progress and the selected voice. Download it, save it to Google Drive, then import it on another device.")}</p><button class="btn go" onclick="downloadBackup()">⬇️ ${tr("Sicherungsdatei herunterladen","Download backup")}</button><label class="btn alt backup-label" for="backup-file">⬆️ ${tr("Sicherungsdatei importieren","Import backup")}</label><input id="backup-file" class="backup-file" type="file" accept="application/json,.json" onchange="importBackup(this.files[0]);this.value=''"> <small class="voice-note">${tr("Beim Import wird der vorhandene Spielstand auf diesem Gerät ersetzt.","Import replaces progress already on this device.")}</small></div>`;
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
    if (!confirm(tr("Sicherung vom ","Import backup from ") + new Date(data.exportedAt || file.lastModified).toLocaleString(isEnglish()?"en-GB":"de-DE") + tr(" importieren? Der aktuelle Spielstand auf diesem Gerät wird ersetzt.","? Existing progress on this device will be replaced."))) return;
    S = initializeProfiles(Object.assign(JSON.parse(JSON.stringify(DEF)), data.progress));selectedDifficulty=S.adaptive.current||"easy";
    if (data.settings && data.settings.voice) localStorage.setItem(VOICE_KEY, data.settings.voice); else localStorage.removeItem(VOICE_KEY);
    save(); alert(tr("Spielstand und Einstellungen wurden importiert.","Progress and settings imported.")); home();
  } catch (e) { alert(e.message || tr("Die Sicherungsdatei konnte nicht gelesen werden.","Could not read the backup file.")); }
}
function settings() {
  G = null; if (hasTTS) speechSynthesis.cancel();
  app.innerHTML = `<div class="top settings-top"><button class="ghost" onclick="home()" aria-label="${tr("Zurück","Back")}">🏠</button><h2>⚙️ ${tr("Einstellungen","Settings")}</h2>${languageToggle()}</div>
  ${themePanel()}
  ${backupPanel()}
  ${drivePanel()}
  <div class="card"><h2>🔊 ${tr("Sprachausgabe","Speech")}</h2><label for="voice-select"><b>${tr("Deutsche Stimme auswählen","Choose German voice")}</b></label><select id="voice-select" class="dash-select" onchange="changeVoice(this.value)"><option>${tr("Deutsche Stimmen werden gesucht …","Loading German voices …")}</option></select><small class="voice-note">${tr("„Gerätestimme“ verwendet die aktuelle Systemauswahl. Einzelne Stimmen werden nur angeboten, wenn der Browser sie bereitstellt.","“Use device voice” follows the system choice. Individual voices appear only when provided by the browser.")}</small><div class="row voice-actions"><button class="filter-btn" onclick="reloadVoices()">↻ ${tr("Stimmen neu laden","Reload voices")}</button><button class="filter-btn" onclick="testVoice()">▶ ${tr("Stimme testen","Test voice")}</button></div><small id="voice-status" class="voice-note"></small></div>
  <div class="card"><h2>🔐 ${tr("Elternschutz","Parent controls")}</h2><p>${tr("Standard-PIN: 1234. Ändere die PIN, damit nur Erwachsene das Dashboard öffnen oder den Spielstand zurücksetzen können.","Default PIN: 1234. Change it so only an adult can open the dashboard or reset progress.")}</p><button class="filter-btn" onclick="changeParentPin()">${tr("Eltern-PIN ändern","Change parent PIN")}</button></div>
  <div class="card"><h2>🎯 ${tr("Tägliches Lernziel","Daily learning goal")}</h2><p>${tr("Wähle ein freundliches Tagesziel von 5 bis 20 Minuten.","Choose a gentle daily goal from 5 to 20 minutes.")}</p><select class="dash-select" onchange="setDailyGoal(this.value)">${[5,10,15,20].map(n=>`<option value="${n}" ${Number(S.dailyGoalMinutes)===n?"selected":""}>${n} ${tr("Minuten","minutes")}</option>`).join("")}</select></div>
  <button class="btn" onclick="dashboard()">👨‍👩‍👧 ${tr("Eltern-Dashboard öffnen","Open Parent Dashboard")}</button><button class="btn alt" onclick="reset()">${tr("Spielstand zurücksetzen","Reset progress")}</button>`;
  refreshVoicePicker();
}

function askSaveBeforeLeave() {
  if (!G) { home(); return; }
  if ($("#leave-dialog")) return;
  document.body.insertAdjacentHTML("beforeend", `<div class="leave-backdrop" id="leave-dialog"><section class="leave-dialog" role="dialog" aria-modal="true" aria-labelledby="leave-title"><h2 id="leave-title">💾 Vor dem Verlassen speichern?</h2><p>Speichere die bereits beantworteten Wörter und synchronisiere sie mit Google Drive. Für diese unvollständige Runde gibt es keine Sterne oder Level-Boni.</p><p id="leave-status" class="leave-status"></p><div class="leave-actions"><button class="btn go" onclick="saveAndLeave()">💾 Speichern & synchronisieren</button><button class="btn" onclick="continuePlaying()">▶ Weiter spielen</button><button id="leave-settings" class="btn" style="display:none" onclick="openSettingsAfterLocalSave()">OAuth-ID in Einstellungen eingeben</button><button id="leave-local" class="btn alt" style="display:none" onclick="leaveWithLocalSave()">Nur lokal gespeichert verlassen</button><button id="leave-discard" class="ghost leave-discard" onclick="leaveWithoutSaving()">Ohne Speichern verlassen</button></div></section></div>`);
}
function commitPartialRound() {
  if (!G || G.partialCommitted) return;
  if (G.log.length) {
    S.pts += G.pts; S.rounds++;recordRoundProgress();recordDuration();
    if (G.sb) S.bs=true;
    S.history=Array.isArray(S.history)?S.history:[];
    S.history.push({date:localDateKey(new Date()),mode:G.mode,level:G.lv,total:G.i+1,correct:G.baseCorrect||0,firstTry:G.baseFirst||0,duration:G.durationSeconds||0,needsPractice:G.bad.map(x=>x.w),partial:true});
    S.history=S.history.slice(-365);
    MS.forEach(m=>{if(S.pts>=m[0]&&!S.ms.includes(m[0])){S.ms.push(m[0]);if(m[0]===750)S.avs.push("🐼");}});
    ACH.forEach((a,i)=>{if(!S.ach.includes(i)&&a[2]())S.ach.push(i);});
  }
  G.partialCommitted=true; save();
}
function saveAndLeave() {
  if (!G) return;
  commitPartialRound();
  const status=$("#leave-status"); if(status)status.textContent="Lokal gespeichert. Synchronisiere jetzt mit Google Drive …";
  syncProgress(ok=>{
    if(ok){closeLeaveDialog();G=null;home();}
    else {const msg=$("#leave-status");if(msg)msg.textContent="Lokal gespeichert, aber Drive-Sync fehlgeschlagen. Prüfe Client-ID/Verbindung in Einstellungen oder verlasse nur mit lokalem Spielstand.";const local=$("#leave-local"),settingsButton=$("#leave-settings");if(local)local.style.display="block";if(settingsButton)settingsButton.style.display="block";const discard=$("#leave-discard");if(discard)discard.textContent="Ohne Synchronisieren verlassen";}
  });
}
function continuePlaying() {
  driveCompletion=null; closeLeaveDialog(); if(!G)return;
  if(G.partialCommitted){const remain=G.q.slice(G.i+(G.lock?1:0));if(!remain.length){G=null;home();return;}const old=G;G={q:remain,mode:old.mode,lv:old.lv,worldLevel:old.worldLevel,roundId:`${Date.now()}-${Math.random().toString(36).slice(2)}`,startedAt:Date.now(),difficulty:old.difficulty,baseTotal:remain.length,baseCorrect:0,baseFirst:0,revisionQueue:[],revisionAdded:{},revisionLoaded:false,i:0,att:0,hinted:false,scramblePick:[],pts:0,ok:0,first:0,firstTryCorrect:0,second:0,streak:0,perfectStreak:0,coinBonus:0,sb:false,bad:[],mistakes:[],log:[],lock:false,partialCommitted:false,continuation:true};question();if(usesSpeech(G.mode))setTimeout(play,300);}
}
function openSettingsAfterLocalSave(){driveCompletion=null;closeLeaveDialog();G=null;settings();}
function leaveWithLocalSave(){driveCompletion=null;closeLeaveDialog();G=null;home();}
function leaveWithoutSaving(){driveCompletion=null;closeLeaveDialog();G=null;home();}
function closeLeaveDialog(){const modal=$("#leave-dialog");if(modal)modal.remove();}

/* ---------- Runde ---------- */
function playLevel(id) {
  const L = LEVELS[id - 1], rev = shuffle(L.words.filter(x => S.review.includes(x.w))).slice(0, 3);
  const rest = shuffle(L.words.filter(x => !rev.includes(x)));
  startRound(shuffle(rev.concat(rest).slice(0, 10)), "lvl", id);
}
function dailyWords(){const date=localDateKey(new Date());if(!S.dailyChallenge||S.dailyChallenge.date!==date||!Array.isArray(S.dailyChallenge.words)){const all=[...new Map(LEVELS.flatMap(l=>l.words).map(w=>[w.w,w])).values()];S.dailyChallenge={date,words:shuffle(all).slice(0,10).map(w=>w.w)};save();}const byWord=new Map(LEVELS.flatMap(l=>l.words).map(w=>[w.w,w]));return S.dailyChallenge.words.map(w=>byWord.get(w)).filter(Boolean);}
function startDaily() { if (S.daily === today()) return; const q=dailyWords();if(!q.length)return;startRound(q.slice(0,10), "daily", 0); }
function usesSpeech(mode){return ["lvl","listen","daily","sentence","world"].includes(mode);}
function wordDifficulty(w) {
  if (/[äöüß]/i.test(w.w) || w.w.length >= 10) return "hard";
  if (w.w.length >= 6 || /sch|ch|ie|ei|au|eu/i.test(w.w)) return "medium";
  return "easy";
}
const WORLD_INFO = [
  {id:"animals",de:"Tierwelt",en:"Animal World",icon:"🦊",match:c=>/Tier|Vogel|Insekt|Haustier|Kleintier|Wildtier|Bauernhof|Wassertier/i.test(c)},
  {id:"school",de:"Schulwelt",en:"School World",icon:"🎒",match:c=>/Schule|Schul|Buch|Sprache|Mathematik/i.test(c)},
  {id:"nature",de:"Naturwelt",en:"Nature World",icon:"🌿",match:c=>/Pflanze|Wetter|Landschaft|Natur|Jahreszeit/i.test(c)},
  {id:"everyday",de:"Alltagswelt",en:"Everyday World",icon:"🏡",match:()=>false},
  {id:"master",de:"Wortmeister-Welt",en:"Word Master World",icon:"👑",match:()=>false}
];
function chunksOfTen(words){const padded=words.slice();if(padded.length)while(padded.length%10)padded.push(words[padded.length%words.length]);const out=[];for(let i=0;i<padded.length;i+=10)out.push(padded.slice(i,i+10));return out;}
function buildWorlds(){
  const unique=[...new Map(LEVELS.flatMap(l=>l.words).map(w=>[w.w,w])).values()];
  const taken=new Set();
  const prepared=WORLD_INFO.map((info,index)=>{
    let list;
    if(index===3)list=unique.filter(w=>!WORLD_INFO.slice(0,3).some(x=>x.match(w.cat))&&!/[äöüß]/i.test(w.w)&&w.w.length<10);
    else if(index===4)list=unique.filter(w=>wordDifficulty(w)==="hard").sort((a,b)=>b.w.length-a.w.length);
    else list=unique.filter(w=>info.match(w.cat));
    const needed=Math.max(20,list.length<20?20:0);
    if(list.length<needed){const add=unique.filter(w=>!list.some(x=>x.w===w.w)).sort((a,b)=>wordDifficulty(b).localeCompare(wordDifficulty(a))||b.w.length-a.w.length);list=list.concat(add.slice(0,needed-list.length));}
    list.forEach(w=>taken.add(w.w));
    return {...info,words:list,levels:chunksOfTen(list).map((words,i)=>({id:`${info.id}-${i+1}`,index:i,worldId:info.id,name:`${info.de} · ${i+1}`,words}))};
  });
  return prepared;
}
const WORLDS=buildWorlds();
const WORLD_LEVELS=WORLDS.flatMap(w=>w.levels);
function worldLevelOpen(id){const i=WORLD_LEVELS.findIndex(l=>l.id===id);return i<=0||Number(S.worldStars[WORLD_LEVELS[i-1].id]||0)>=1;}
function unlockV3(id){if(S.achievementsV3[id])return;S.achievementsV3[id]=true;save();}
function modeAll(mode) {
  const all = LEVELS.flatMap(l=>l.words);
  if (mode === "picture") return all.filter(w=>pictureFor(w));
  if (mode === "sentence") return all.filter(w=>w.s && w.s.split(/\s+/).length >= 4 && blankSentence(w,"_",true) !== null);
  return all;
}
function modeWords(mode, difficulty) {
  const pool = modeAll(mode);
  let eligible = pool.filter(w=>wordDifficulty(w)===difficulty);
  if (eligible.length < 10 && (mode === "picture" || mode === "sentence")) eligible = eligible.concat(shuffle(pool.filter(w=>!eligible.includes(w)))).slice(0, Math.max(eligible.length, 10));
  return eligible.length ? eligible : pool;
}
function availableWords(mode, difficulty) { return modeWords(mode,difficulty).length; }
function setDifficulty(id) { if (!DIFFICULTIES[id]) return; selectedDifficulty=id;S.adaptive.current=id;save();home(); }
function startMode(mode) {
  if (!GAME_MODES.some(m=>m.id===mode)) return;
  const all=[...new Map(LEVELS.flatMap(l=>l.words).map(w=>[w.w,w])).values()],eligible=modeWords(mode,selectedDifficulty),recent=(S.modeRecent&&S.modeRecent[mode])||[],todayKey=localDateKey(new Date());
  const priority=eligible.filter(w=>{const x=S.words[w.w]||{},tries=Number(x.attempts||((x.ok||0)+(x.bad||0)));return (x.nextReviewAt&&x.nextReviewAt<=todayKey)||(tries>=3&&Number(x.difficultyScore||0)>=35);}).sort((a,b)=>{const x=S.words[a.w]||{},y=S.words[b.w]||{},xd=x.nextReviewAt&&x.nextReviewAt<=todayKey?0:1,yd=y.nextReviewAt&&y.nextReviewAt<=todayKey?0:1;return xd-yd+(Number(y.difficultyScore||0)-Number(x.difficultyScore||0))/100;});
  let fresh=shuffle(eligible.filter(w=>!recent.includes(w.w)&&!priority.some(p=>p.w===w.w)));if(fresh.length<Math.min(8,eligible.length/2))fresh=shuffle(eligible.filter(w=>!priority.some(p=>p.w===w.w)));
  const q=priority.slice(0,10);for(const w of fresh)if(q.length<10)q.push(w);if(q.length<10){for(const w of shuffle(modeAll(mode).filter(x=>!q.some(y=>y.w===x.w))))if(q.length<10)q.push(w);}
  S.modeRecent=S.modeRecent||{}; S.modeRecent[mode]=recent.concat(q.map(w=>w.w)).slice(-Math.min(20,eligible.length)); save();
  startRound(q,mode,0);
}
const PICTURES={Hund:"🐶",Katze:"🐱",Maus:"🐭",Bär:"🐻",Wolf:"🐺",Fuchs:"🦊",Ente:"🦆",Kuh:"🐮",Pferd:"🐴",Fisch:"🐟",Vogel:"🐦",Hase:"🐰",Ziege:"🐐",Löwe:"🦁",Affe:"🐵",Schaf:"🐑",Tiger:"🐯",Igel:"🦔",Biene:"🐝",Ameise:"🐜",Eule:"🦉",Hai:"🦈",Käfer:"🐞",Raupe:"🐛",Schnecke:"🐌",Schmetterling:"🦋",Apfel:"🍎",Birne:"🍐",Tomate:"🍅",Zwiebel:"🧅",Pizza:"🍕",Ei:"🥚",Eis:"🍦",Brot:"🍞",Gemüse:"🥕",Salz:"🧂",Saft:"🧃",Auto:"🚗",Ampel:"🚦",Ball:"⚽",Baum:"🌳",Blume:"🌸",Sonne:"☀️",Wolke:"☁️",Regen:"🌧️",Schnee:"❄️",Stern:"⭐",Haus:"🏠",Uhr:"🕐",Telefon:"☎️",Computer:"💻",Buch:"📖",Stift:"✏️",Schere:"✂️",Tasche:"👜",Ranzen:"🎒",Fenster:"🪟",Gabel:"🍴",Ring:"💍",Kleid:"👗",Hemd:"👕",Auge:"👁️",Nase:"👃",Mund:"👄",Bein:"🦵",Fuß:"🦶",Zahn:"🦷",Baby:"👶",Oma:"👵",Opa:"👴",Hexe:"🧙",Clown:"🤡",Teddy:"🧸",Brief:"✉️",Euro:"💶",Kiste:"📦",Dose:"🥫",Seife:"🧼",Licht:"💡",Berge:"⛰️",Wald:"🌲",Regenbogen:"🌈",Wasser:"💧",Herbst:"🍂",Winter:"⛄",Weihnachten:"🎄",Ostern:"🐣",Blatt:"🍃",See:"🏞️",Nebel:"🌫️",Wind:"💨",Bild:"🖼️",Schule:"🏫",Lineal:"📏",Papier:"📄",Heft:"📓",Pinsel:"🖌️",Erde:"🌍",Pflanze:"🪴",Familie:"👪"};
// Nur Wörter mit eindeutigem Bild: Kein Raten über die Kategorie mehr (Fehler: Schaf zeigte einen Traktor).
function pictureFor(w){return Object.prototype.hasOwnProperty.call(PICTURES,w.w)?PICTURES[w.w]:null;}
function blankSentence(w,fill,strict){const re=new RegExp("(^|[^A-Za-zÄÖÜäöüß])("+w.w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")(?![A-Za-zÄÖÜäöüß])","i");if(re.test(w.s))return w.s.replace(re,(m,p)=>p+fill);return strict?null:w.s.replace(new RegExp(w.w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i"),fill);}
function startRound(q, mode, lv) { G = { q:q.slice(), mode, lv, worldLevel:mode==="world"?lv:null, roundId:`${Date.now()}-${Math.random().toString(36).slice(2)}`, startedAt:Date.now(),difficulty:selectedDifficulty,baseTotal:q.length,baseCorrect:0,baseFirst:0,revisionQueue:[],revisionAdded:{},revisionLoaded:false,i: 0, att: 0, hinted:false, scramblePick:[], pts: 0, ok: 0, first: 0, firstTryCorrect:0, second: 0, streak: 0, perfectStreak:0,coinBonus:0,sb: false, bad: [], mistakes:[], log: [], lock: false };S.modePlayed=S.modePlayed||{};S.modePlayed[mode]=(S.modePlayed[mode]||0)+1;save();question(); if(usesSpeech(mode))setTimeout(play, 400); }

function missingPattern(word) {
  const chars=[...word], wanted=G.difficulty==="easy"?1:G.difficulty==="medium"?Math.max(2,Math.ceil(chars.length*.3)):Math.max(3,Math.ceil(chars.length*.45));
  const indexes=shuffle(chars.map((_,i)=>i).filter(i=>i>0&&i<chars.length-1)).slice(0,wanted);
  return chars.map((c,i)=>indexes.includes(i)?"_":c).join(" ");
}
function showHint(){if(!G||G.lock)return;G.hinted=true;const w=G.q[G.i].w,detail=G.difficulty==="easy"?` Das Wort hat ${w.length} Buchstaben und beginnt mit ${w[0]}.`:"",box=$("#hint-box");if(box)box.innerHTML=`<div class="hint-bubble">💡 ${esc(hint(w)+detail)}</div>`;}
function toggleTile(i){if(!G||G.lock)return;const pos=G.scramblePick.indexOf(i);if(pos>=0)G.scramblePick.splice(pos,1);else G.scramblePick.push(i);renderScramble();}
function renderScramble(){const area=$("#scramble-area");if(!area)return;const chars=G.scrambleLetters;area.innerHTML=`<div class="scramble-answer" aria-label="Ausgewählte Buchstaben">${G.scramblePick.length?G.scramblePick.map(i=>`<button class="letter-tile chosen" onclick="toggleTile(${i})">${esc(chars[i])}</button>`).join(""):'<span>Tippe die Buchstaben an …</span>'}</div><div class="letter-bank">${chars.map((c,i)=>`<button class="letter-tile" ${G.scramblePick.includes(i)?"disabled":""} onclick="toggleTile(${i})">${esc(c)}</button>`).join("")}</div>`;}

function question() {
  G.att = 0; G.hinted=false; G.revealed=false; G.scramblePick=[]; G.lock = false;
  const w=G.q[G.i], mode=G.mode;
  const m=GAME_MODES.find(x=>x.id===mode), isListen=mode==="listen"||mode==="lvl"||mode==="daily"||mode==="world";
  let prompt="", placeholder="Schreibe hier …";
  if(isListen) prompt=`<p class="big">Hör gut zu! Welches Wort hörst du?</p><button id="spk" class="speaker" onclick="play()" aria-label="Wort anhören">🔊</button><button class="btn alt" onclick="play()">🔁 Noch einmal hören</button>${!hasTTS?'<p class="note">Die Sprachausgabe ist auf diesem Gerät nicht verfügbar.</p>':""}`;
  else if(mode==="picture") prompt=`<p class="big">Welches Wort passt zu diesem Bild?</p><div class="picture-clue" role="img" aria-label="Bildhinweis">${pictureFor(w)}</div><p class="clue-caption">${esc(w.cat)}</p>`;
  else if(mode==="missing") { const chars=[...w.w], pool=chars.map((_,i)=>i>0&&i<chars.length-1?i:-1).filter(i=>i>=0), positions=pool.length?pool:chars.map((_,i)=>i), wanted=G.difficulty==="easy"?1:G.difficulty==="medium"?Math.max(2,Math.ceil(chars.length*.3)):Math.max(3,Math.ceil(chars.length*.45)); G.missingIndexes=shuffle(positions).slice(0,Math.min(positions.length,wanted)).sort((a,b)=>a-b); prompt=`<p class="big">Fülle die fehlenden Buchstaben aus!</p><div class="missing-word">${chars.map((c,i)=>G.missingIndexes.includes(i)?`<span class="blank">_</span>`:`<span>${esc(c)}</span>`).join("")}</div><p class="clue-caption">${esc(w.cat)} · ${G.missingIndexes.length} ${G.missingIndexes.length===1?"Lücke":"Lücken"}</p>`; placeholder="Fehlende Buchstaben …"; }
  else if(mode==="scramble") { G.scrambleLetters=shuffle([...w.w]);prompt=`<p class="big">Bringe die Buchstaben in die richtige Reihenfolge!</p><div id="scramble-area"></div>`; }
  else if(mode==="sentence") { const blank=blankSentence(w,"________"); prompt=`<p class="big">Hör den Satz und finde das fehlende Wort!</p><div class="sentence-clue">${esc(blank)}</div><button id="spk" class="speaker small-speaker" onclick="play()" aria-label="Satz anhören">🔊</button><button class="btn alt" onclick="play()">🔁 Satz noch einmal hören</button>`; }
  app.innerHTML = `<div class="top"><button class="ghost" onclick="askSaveBeforeLeave()" aria-label="Spiel verlassen">🏠</button><b style="font-size:20px">${G.i + 1} von ${G.q.length}${G.i>=G.baseTotal?` · ${tr("Wiederholung","Review")}`:""}</b><span class="pill">🪙 ${S.pts + G.pts}</span></div><div class="bar"><i style="width:${G.i / G.q.length * 100}%"></i></div>
  <div class="card center game-card"><div class="game-mode-label">${m?m.icon+" "+m.name:mode==="world"?"🌍 Lernwelt · "+esc(WORLD_LEVELS.find(l=>l.id===G.worldLevel)?.name||"Level"):mode==="lvl"?`🗺️ Level ${G.lv}: ${esc(LEVELS[G.lv-1]?.name||"")}`:"📅 Tagesaufgabe"} · ${DIFFICULTIES[G.difficulty]||""}</div>${prompt}
   ${mode==="scramble"?"":`<input id="in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${placeholder}" aria-label="${mode==="missing"?"Fehlende Buchstaben eingeben":"Antwort eingeben"}" onkeydown="if(event.key==='Enter')check()">`}
   <button id="chk" class="btn go" onclick="check()">✅ Das ist meine Antwort!</button><button class="hint-button" onclick="showHint()">💡 Tipp</button><div id="hint-box"></div><div id="fb" aria-live="polite"></div></div>`;
  if(mode==="scramble")renderScramble();else $("#in").focus();
}
function check() {
  if (G.lock) return;
  const w = G.q[G.i], inp = $("#in"), fb = $("#fb");
  let answer=G.mode==="scramble"?G.scramblePick.map(i=>G.scrambleLetters[i]).join(""):(inp?inp.value.trim():"");
  const expected=G.mode==="missing"?G.missingIndexes.map(i=>[...w.w][i]).join(""):w.w;
  if (!answer.trim()) { if(inp)inp.focus(); return; }
  if (G.mode==="missing"?norm(answer)===norm(expected):same(answer,w.w)) {
    const clean=!G.att&&!G.hinted,p=clean?15:10; let b = 0;
    if (!clean) G.second++; else G.first++;
    if(G.i<G.baseTotal){G.baseCorrect++;if(clean)G.baseFirst++;if(!G.att)G.firstTryCorrect=(G.firstTryCorrect||0)+1;}
    G.streak++;if(clean){G.perfectStreak++;if(G.perfectStreak%5===0)G.coinBonus+=2;}else G.perfectStreak=0; if (G.streak % 3 === 0) { b = 10; G.sb = true; }
    G.ok++; G.pts += p + b; G.log.push([w.w, G.att ? "s" : "f"]); unlockV3("first-word"); lockQ(); tone([523, 659, 784]); rain(SHOP_ITEMS.find(x=>x.id===S.equipped?.celebration)?.emoji||"⭐");
    if(G.att||G.hinted){G.bad.push(w);G.log[G.log.length-1][1]="s";}
    fb.innerHTML = `<div class="good"><div class="mascot-cheer">${avatarPresentation()}</div><div class="stars">🌟✨🌟</div><h2>${mascotCheer()}</h2><p class="word">${hl(w.w)}</p><p>+${p} Punkte${b ? " und +" + b + " Serien-Bonus 🔥" : ""}${clean&&G.perfectStreak%5===0?" · +2 Word Coins!": ""}</p><p class="sent">${w.s}</p>
      <button class="btn go next-btn" onclick="nextQ()">Weiter ➜</button></div>`;
  } else {
    G.att++; G.streak=0;G.perfectStreak=0; G.mistakes.push(w.w); tone([330,330]); if(!G.bad.some(x=>x.w===w.w))G.bad.push(w); recordMiss(w.w);if(G.i<G.baseTotal&&!G.revisionAdded[w.w]){G.revisionAdded[w.w]=true;G.revisionQueue.push(w);}
    fb.innerHTML = `<div class="try"><h2>${avatarPresentation()} Guter Versuch! 🌈 Probier es noch einmal.</h2><p class="spelling-tip">💡 ${esc(spellingExplanation(w.w,answer))}</p><p>Kein Problem – du kannst es so oft versuchen, wie du möchtest.</p>${usesSpeech(G.mode)?'<button class="filter-btn" onclick="play()">🔁 Noch einmal hören</button>':""}${G.att>=3?'<p class="answer-offer">Schon drei Versuche! Möchtest du dir das richtige Wort ansehen?</p><button class="btn alt" onclick="revealAnswer()">👀 Antwort anzeigen</button>':""}</div>`;
    if(inp){inp.select();inp.focus();} else G.scramblePick=[];if(G.difficulty==="easy"&&G.att===1)showHint();
  }
}
function lockQ() { G.lock = true; const gc=$(".game-card"); if(gc) gc.classList.add("answered"); const input=$("#in"),button=$("#chk");if(input)input.readOnly=true;if(button)button.disabled=true; }
function revealAnswer(){if(!G||G.lock)return;const w=G.q[G.i];G.revealed=true;lockQ();const fb=$("#fb");if(fb)fb.innerHTML=`<div class="try answer-revealed"><h2>Das richtige Wort ist:</h2><p class="word">${hl(w.w)}</p><p class="sent">${esc(w.s)}</p><button class="btn go next-btn" onclick="nextQ()">Weiter ➜</button></div>`;}
function nextQ() { G.i++;if(G.i>=G.baseTotal&&!G.revisionLoaded&&G.revisionQueue.length){G.q=G.q.slice(0,G.baseTotal).concat(G.revisionQueue);G.revisionLoaded=true;} if (G.i >= G.q.length) endRound(); else { question(); if(usesSpeech(G.mode))setTimeout(play,300); } }

/* ---------- Rundenende ---------- */
function endRound() {
  const n = G.baseTotal||G.q.length, correct=Number(G.baseCorrect??G.ok), first=Number(G.baseFirst??G.first), acc = Math.round(correct / n * 100), fa = Math.round(first / n * 100);
  let bonus = 0, earned = 0, unlocked = null, levelUp = null, notes = [];
  if (G.mode === "lvl" && !G.continuation) {
    let st = 1; if (acc >= 80) st = 2; if (acc >= 90 && G.second <= 1) st = 3;
    earned = Math.max(0, st - (S.stars[G.lv] || 0)); S.stars[G.lv] = Math.max(st, S.stars[G.lv] || 0);
    G.st = st; S.acc[G.lv] = Math.max(acc, S.acc[G.lv] || 0);
    if (!S.done[G.lv]) { S.done[G.lv] = 1; bonus += 30; notes.push("🎉 Rundenbonus +30 (einmal pro Level)"); }
    const nl = LEVELS[G.lv]; if (nl && acc >= nl.req && !S.unl.includes(nl.id)) { S.unl.push(nl.id); unlocked = nl; levelUp={name:`Level ${nl.id}: ${nl.name}`,id:nl.id}; }
  } else if (G.mode === "world" && !G.continuation) {
    const firstCorrect=Number(G.firstTryCorrect||0),score=firstCorrect>=9?3:firstCorrect>=7?2:firstCorrect>=5?1:0,id=G.worldLevel,previous=Number(S.worldStars[id]||0);
    const worldIndex=WORLD_LEVELS.findIndex(l=>l.id===id),nextWorld=worldIndex>=0?WORLD_LEVELS[worldIndex+1]:null,nextWasOpen=nextWorld?worldLevelOpen(nextWorld.id):true;
    S.worldStars[id]=Math.max(previous,score);earned=Math.max(0,score-previous);
    S.worldDone=Array.isArray(S.worldDone)?S.worldDone:[];if(!S.worldDone.includes(id))S.worldDone.push(id);
    if(score>=1&&nextWorld&&!nextWasOpen&&worldLevelOpen(nextWorld.id))levelUp={name:nextWorld.name,id:nextWorld.id};
    if(score)notes.push(`🌟 ${score} ${score===1?"Stern":"Sterne"} verdient! ${score<3?"Für drei Sterne: mindestens 9 richtige Antworten.":"Wunderbar!"}`);
  } else if (G.mode === "daily" && S.daily !== today() && !G.continuation) { S.daily = today(); bonus += 50; notes.push("📅 Tagesaufgabe geschafft: +50 Punkte!");const date=localDateKey(new Date());S.dailyCompleted=Array.isArray(S.dailyCompleted)?S.dailyCompleted:[];if(!S.dailyCompleted.includes(date))S.dailyCompleted.push(date); }
  const world=WORLDS.find(x=>x.levels.some(l=>l.id===G.worldLevel));let worldCoin=0;
  if(levelUp&&!G.continuation){S.levelUps=Number(S.levelUps||0)+1;S.levelRewards=Array.isArray(S.levelRewards)?S.levelRewards:[];const kind=S.levelUps%2===1?"flappy":"snake";S.levelRewards.push({kind,level:levelUp.name,createdAt:Date.now()});notes.push(`🎮 Levelaufstieg! ${levelUp.name} ist offen. Deine 2-Minuten-Belohnung: ${kind==="flappy"?"Flappy Bird":"Classic Snake"}!`);}
  if(G.mode==="world"&&!G.continuation&&world&&world.levels.every(l=>(S.worldDone||[]).includes(l.id))&&!S.worldRewards.includes(world.id)){S.worldRewards.push(world.id);worldCoin=20;notes.push("🌍 Lernwelt abgeschlossen: +20 Word Coins!");}
  const coinEarned=(G.continuation?0:5)+(G.mode==="daily"&&!G.continuation?10:0)+worldCoin+(G.coinBonus||0);
  if (G.sb) S.bs = true;
  S.pts += G.pts + bonus; S.rounds++;recordRoundProgress();recordDuration();adjustAdaptiveDifficulty();
  if(!G.continuation){S.coins=(S.coins||0)+coinEarned;if(coinEarned)notes.push(`🪙 +${coinEarned} Word Coins!`);}
  if(G.mode==="daily"&&(S.dailyCompleted||[]).length>=5)unlockV3("daily-hero");
  awardRoundAchievements();
  MS.forEach(m => { if (S.pts >= m[0] && !S.ms.includes(m[0])) { S.ms.push(m[0]); notes.push(m[1] + " Neue Belohnung: " + m[2] + "!"); if (m[0] === 750) S.avs.push("🐼"); } });
  ACH.forEach((a, i) => { if (!S.ach.includes(i) && a[2]()) { S.ach.push(i); notes.push(a[0] + " Neues Abzeichen: " + a[1] + "!"); } });
  S.history = Array.isArray(S.history) ? S.history : [];
  S.history.push({ date: localDateKey(new Date()), mode: G.mode, level: G.lv, total: n, correct, firstTry:first, duration:G.durationSeconds||0, needsPractice: G.bad.map(x => x.w) });
  S.history = S.history.slice(-365);
  save(); rain("🎉"); tone([523, 659, 784, 1047]);
  const mastered = G.log.filter(x => S.mastery[x[0]]?.mastered).map(x => x[0]);
  app.innerHTML = `<h1>Juhu! Du hast es geschafft!</h1><div class="card center"><div class="chest">🎁</div>
   ${G.mode === "lvl" ? `<div class="stars">${"⭐".repeat(G.st)}${"☆".repeat(3 - G.st)}</div>` : G.mode==="world"?`<div class="stars">${"⭐".repeat(Number(S.worldStars[G.worldLevel]||0))}${"☆".repeat(3-Number(S.worldStars[G.worldLevel]||0))}</div><p>${G.firstTryCorrect||0} von 10 beim ersten Versuch richtig · ${Number(S.worldStars[G.worldLevel]||0)} Sterne</p>`:""}
  <p class="big">⭐ ${G.pts + bonus} Punkte</p><p>🪙 Word Coins: +${coinEarned} · Gesamt ${S.coins||0}</p><p class="mascot-cheer">${avatarPresentation()} ${mascotCheer()}</p>
   <p>✅ Richtig: ${correct} von ${n} · ❌ Noch üben: ${G.bad.length}<br>Beim 1. Versuch richtig: ${fa} % · Insgesamt richtig: ${acc} %${G.mode === "lvl" ? "<br>Neue Sterne: +" + earned : ""}</p>
   ${notes.map(t => `<div class="toast">${t}</div>`).join("")}${unlocked ? `<div class="toast">🔓 Level ${unlocked.id} „${unlocked.name}“ ist offen!</div>` : ""}
   ${levelRewardResultHTML()}
   <p><b>Gemeistert:</b> ${mastered.length ? mastered.join(", ") : "–"}</p>
   <p><b>Nochmal üben:</b> ${G.bad.length ? G.bad.map(x => hl(x.w)).join(", ") : "Nichts – super! 🌟"}</p></div>
   <button class="btn go" onclick="replayRound()">🔁 Noch einmal spielen</button>
   <button class="btn alt" onclick="nextRound()">➡️ Nächste Runde</button>
   <button class="btn" onclick="home()">🗺️ Zur Abenteuerkarte</button>`;
  if(levelUp&&!G.continuation)startNextLevelReward("result");
}
function replayRound(){if(!G)return;const m=G.mode,l=G.lv;if(m==="lvl")playLevel(l);else if(m==="world")startWorldLevel(l);else if(m==="daily")home();else startMode(m);}
function nextRound(){if(!G)return;const m=G.mode,l=G.lv;if(m==="lvl")playLevel(S.unl.includes(l+1)?l+1:l);else if(m==="world"){const i=WORLD_LEVELS.findIndex(x=>x.id===l);startWorldLevel(i>=0&&i<WORLD_LEVELS.length-1&&worldLevelOpen(WORLD_LEVELS[i+1].id)?WORLD_LEVELS[i+1].id:l);}else if(m==="daily")home();else startMode(m);}

/* ---------- Level-up mini-game rewards ---------- */
function miniRewardTitle(kind){return kind==="flappy"?"Flappy Bird":"Classic Snake";}
function levelRewardButtonHTML(place="result"){
  const reward=(S.levelRewards||[])[0];if(!reward)return "";
  return `<div class="level-reward-cta"><h2>🎁 Deine Level-Belohnung wartet!</h2><p>${esc(reward.level)} geschafft – jetzt 2 Minuten ${miniRewardTitle(reward.kind)} spielen.</p><button class="btn go" onclick="startNextLevelReward('${place}')">🎮 Jetzt spielen · 02:00</button><button class="filter-btn" onclick="${place==="result"?"deferLevelReward()":"skipLevelReward()"}">${place==="result"?"Zur Abenteuerkarte":"Belohnung überspringen"}</button></div>`;
}
function levelRewardResultHTML(){return levelRewardButtonHTML("result");}
function levelRewardHomeHTML(){return levelRewardButtonHTML("home");}
function skipLevelReward(){if(miniGameState)stopMiniGameLoop();miniGameState=null;if(S.levelRewards?.length)S.levelRewards.shift();save();miniReturnHTML="";home();}
function deferLevelReward(){miniReturnHTML="";home();}
function startNextLevelReward(place="home"){
  const reward=(S.levelRewards||[])[0];if(!reward)return;
  stopMiniGameLoop();miniReturnKind=place;miniReturnHTML=app.innerHTML;
  miniGameState={kind:reward.kind,level:reward.level,remaining:120,startedAt:Date.now(),bird:{y:245,vy:0},pipes:[{x:390,gapY:245}],passed:0,snake:[[10,10],[9,10],[8,10]],direction:{x:1,y:0},nextDirection:{x:1,y:0},food:{x:15,y:10},apples:0,stepElapsed:0};
  renderMiniRewardGame();addEventListener("keydown",handleMiniGameKey);miniClock=setInterval(updateMiniGameClock,250);miniLastFrame=0;miniAnimation=requestAnimationFrame(drawMiniRewardFrame);
}
function renderMiniRewardGame(){
  const snake=miniGameState.kind==="snake";
  app.innerHTML=`<section class="mini-reward-page"><div class="top"><span class="pill">🎉 ${esc(miniGameState.level)}</span><span class="pill mini-clock" id="mini-clock">02:00</span><button class="filter-btn" onclick="leaveMiniReward()">⏸ Zurück</button></div><h1 class="mini-title">${snake?"🐍 Classic Snake":"🐤 Flappy Bird"}</h1><p class="sub">Deine Level-Belohnung · Noch zwei Minuten zum Spielen!</p><div class="card mini-game-card"><canvas id="mini-game-canvas" width="360" height="500" aria-label="${snake?"Snake Spielfeld":"Flappy Bird Spielfeld"}"></canvas>${snake?`<div class="snake-controls"><button onclick="miniGameDirection('up')">⬆️</button><div><button onclick="miniGameDirection('left')">⬅️</button><button onclick="miniGameDirection('down')">⬇️</button><button onclick="miniGameDirection('right')">➡️</button></div></div>`:`<button class="btn go flappy-tap" onclick="miniFlap()">🐤 Tippe hier zum Fliegen!</button>`}<p class="mini-game-hint">${snake?"Steuere mit den Pfeilen oder den Tasten WASD. Sammle Äpfel.":"Tippe, klicke oder drücke die Leertaste, damit der Vogel fliegt."} Kein Punktestand-Druck – spiel einfach zum Spaß.</p></div><button class="filter-btn" onclick="leaveMiniReward()">Zurück zum Ergebnis</button></section>`;
  const canvas=$("#mini-game-canvas");if(canvas)canvas.addEventListener("pointerdown",snake?()=>{}:miniFlap);
}
function leaveMiniReward(){stopMiniGameLoop();miniGameState=null;const saved=miniReturnHTML;miniReturnHTML="";if(miniReturnKind==="result"&&saved)app.innerHTML=saved;else home();}
function stopMiniGameLoop(){if(miniAnimation){cancelAnimationFrame(miniAnimation);miniAnimation=0;}if(miniClock){clearInterval(miniClock);miniClock=null;}removeEventListener("keydown",handleMiniGameKey);}
function handleMiniGameKey(event){if(!miniGameState)return;const key=event.key.toLowerCase();if(miniGameState.kind==="flappy"&&(key===" "||key==="arrowup")){event.preventDefault();miniFlap();}else if(miniGameState.kind==="snake"){const dirs={arrowup:"up",w:"up",arrowdown:"down",s:"down",arrowleft:"left",a:"left",arrowright:"right",d:"right"};if(dirs[key]){event.preventDefault();miniGameDirection(dirs[key]);}}}
function miniFlap(){if(miniGameState?.kind==="flappy")miniGameState.bird.vy=-5.7;}
function miniGameDirection(direction){if(!miniGameState||miniGameState.kind!=="snake")return;const dirs={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}},next=dirs[direction],current=miniGameState.direction;if(next&&!(next.x===-current.x&&next.y===-current.y))miniGameState.nextDirection=next;}
function updateMiniGameClock(){if(!miniGameState)return;miniGameState.remaining=Math.max(0,120-Math.floor((Date.now()-miniGameState.startedAt)/1000));const clock=$("#mini-clock");if(clock)clock.textContent=`${String(Math.floor(miniGameState.remaining/60)).padStart(2,"0")}:${String(miniGameState.remaining%60).padStart(2,"0")}`;if(miniGameState.remaining<=0)finishLevelReward();}
function finishLevelReward(){if(!miniGameState)return;const kind=miniGameState.kind,apples=miniGameState.apples||0;stopMiniGameLoop();miniGameState=null;if(S.levelRewards?.length)S.levelRewards.shift();save();if(miniReturnKind==="result"&&miniReturnHTML)miniReturnHTML=miniReturnHTML.replace(/<div class="level-reward-cta">[\s\S]*?<\/div>/,levelRewardResultHTML());app.innerHTML=`<section class="mini-reward-page"><div class="card center mini-finished"><div class="chest">${kind==="snake"?"🐍":"🐤"}</div><h1>Super gespielt!</h1><p class="big">🎉 Deine zwei Minuten ${miniRewardTitle(kind)} sind vorbei!</p>${kind==="snake"?`<p>Du hast ${apples} ${apples===1?"Apfel":"Äpfel"} gesammelt. Toll gemacht!</p>`:"<p>Danke fürs Mitspielen. Dein Level-Erfolg bleibt gespeichert!</p>"}<button class="btn go" onclick="returnFromMiniReward()">Weiter ➜</button></div></section>`;}
function returnFromMiniReward(){const saved=miniReturnHTML;miniReturnHTML="";if(miniReturnKind==="result"&&saved)app.innerHTML=saved;else home();}
function resetMiniSnake(){miniGameState.snake=[[10,10],[9,10],[8,10]];miniGameState.direction={x:1,y:0};miniGameState.nextDirection={x:1,y:0};miniGameState.stepElapsed=0;}
function drawMiniRewardFrame(timestamp){
  if(!miniGameState)return;const state=miniGameState,canvas=$("#mini-game-canvas"),ctx=canvas?.getContext?.("2d");if(!ctx){miniAnimation=requestAnimationFrame(drawMiniRewardFrame);return;}
  const dt=miniLastFrame?Math.min(.05,(timestamp-miniLastFrame)/1000):0;miniLastFrame=timestamp;
  if(state.kind==="flappy")drawFlappyFrame(ctx,state,dt);else drawSnakeFrame(ctx,state,dt);
  miniAnimation=requestAnimationFrame(drawMiniRewardFrame);
}
function drawFlappyFrame(ctx,state,dt){
  const w=360,h=500,ground=466,birdX=94;state.bird.vy+=15*dt;state.bird.y+=state.bird.vy;state.pipes.forEach(p=>p.x-=120*dt);if(state.pipes.at(-1).x<205)state.pipes.push({x:390,gapY:125+Math.random()*230});state.pipes=state.pipes.filter(p=>p.x>-65);
  let hit=state.bird.y<13||state.bird.y>ground-16;state.pipes.forEach(p=>{if(p.x+54<birdX&&!p.counted){p.counted=true;state.passed++;}if(birdX+17>p.x&&birdX-15<p.x+54&&(state.bird.y-14<p.gapY-77||state.bird.y+14>p.gapY+77))hit=true;});if(hit){state.bird.y=245;state.bird.vy=0;state.pipes=[{x:390,gapY:125+Math.random()*230}];}
  const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,"#8edcff");sky.addColorStop(1,"#e3f9ff");ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);ctx.fillStyle="#6bc96d";state.pipes.forEach(p=>{ctx.fillRect(p.x,0,54,p.gapY-77);ctx.fillRect(p.x,p.gapY+77,54,ground-p.gapY-77);ctx.fillStyle="#42ae4c";ctx.fillRect(p.x-5,p.gapY-90,64,14);ctx.fillRect(p.x-5,p.gapY+77,64,14);ctx.fillStyle="#6bc96d";});ctx.fillStyle="#77d66c";ctx.fillRect(0,ground,w,h-ground);ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(52,72,22,0,7);ctx.arc(78,72,30,0,7);ctx.arc(108,72,22,0,7);ctx.fill();ctx.font="36px system-ui";ctx.textAlign="center";ctx.fillText("🐤",birdX,state.bird.y+13);ctx.fillStyle="#2b2d5b";ctx.font="bold 22px system-ui";ctx.fillText(`Durchflogene Röhren: ${state.passed}`,w/2,ground+27);
}
function drawSnakeFrame(ctx,state,dt){
  const cell=18,size=20;state.stepElapsed+=dt;if(state.stepElapsed>=.13){state.stepElapsed=0;state.direction=state.nextDirection;const head=state.snake[0],next={x:(head.x+state.direction.x+size)%size,y:(head.y+state.direction.y+size)%size},ate=next.x===state.food.x&&next.y===state.food.y;if(state.snake.some(p=>p.x===next.x&&p.y===next.y)){resetMiniSnake();}else{state.snake.unshift(next);if(ate){state.apples++;let f;do{f={x:Math.floor(Math.random()*size),y:Math.floor(Math.random()*size)}}while(state.snake.some(p=>p.x===f.x&&p.y===f.y));state.food=f;}else state.snake.pop();}}
  ctx.fillStyle="#e8f8d9";ctx.fillRect(0,0,360,360);ctx.strokeStyle="#d6edc3";ctx.lineWidth=1;for(let p=0;p<=360;p+=cell){ctx.beginPath();ctx.moveTo(p,0);ctx.lineTo(p,360);ctx.stroke();ctx.beginPath();ctx.moveTo(0,p);ctx.lineTo(360,p);ctx.stroke();}ctx.font="16px system-ui";ctx.textAlign="center";ctx.fillText("🍎",state.food.x*cell+9,state.food.y*cell+15);state.snake.forEach((p,i)=>{ctx.fillStyle=i?"#54b878":"#1e9150";ctx.fillRect(p.x*cell+1,p.y*cell+1,cell-2,cell-2);});ctx.fillStyle="#2b2d5b";ctx.font="bold 22px system-ui";ctx.fillText(`Äpfel gesammelt: ${state.apples}`,180,395);ctx.font="16px system-ui";ctx.fillText("Weiterlaufen und Spaß haben!",180,423);
}


function localDateKey(date) { return date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0"); }
function weeklyInsightsHTML() {
  const todayDate = new Date(), days = [];
  for (let i=6;i>=0;i--) { const d = new Date(todayDate.getFullYear(),todayDate.getMonth(),todayDate.getDate()-i); days.push({date:localDateKey(d),label:d.toLocaleDateString(isEnglish()?"en-GB":"de-DE",{weekday:"short"})}); }
  const start = days[0].date, current = (S.history||[]).filter(h => h.date >= start && h.date <= days[6].date);
  const words = current.reduce((n,h)=>n+(h.total||0),0), correct = current.reduce((n,h)=>n+(h.correct||0),0), firstTry = current.reduce((n,h)=>n+(h.firstTry||0),0);
  const top = {};
  current.forEach(h=>(h.needsPractice||[]).forEach(w=>top[w]=(top[w]||0)+1));
  const challenges = Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const max = Math.max(1,...days.map(d=>current.filter(h=>h.date===d.date).reduce((n,h)=>n+(h.total||0),0)));
  const bars = days.map(d=>{const n=current.filter(h=>h.date===d.date).reduce((sum,h)=>sum+(h.total||0),0);return `<div class="week-day"><span>${d.label}</span><div class="week-track"><i style="width:${Math.round(n/max*100)}%"></i></div><b>${n}</b></div>`;}).join("");
  const pct = words ? Math.round(correct/words*100) : 0, firstPct = words ? Math.round(firstTry/words*100) : 0;
  const priorStart=new Date(todayDate.getFullYear(),todayDate.getMonth(),todayDate.getDate()-13),priorKey=localDateKey(priorStart),prior=(S.history||[]).filter(h=>h.date>=priorKey&&h.date<start),priorN=prior.reduce((n,h)=>n+(h.total||0),0),priorC=prior.reduce((n,h)=>n+(h.correct||0),0),improvement=pct-(priorN?Math.round(priorC/priorN*100):pct);
  const minutes=Math.round(current.reduce((n,h)=>n+(h.duration||0),0)/60),masteredThis=Object.values(S.mastery||{}).filter(x=>x.mastered&&x.masteredAt>=start&&x.masteredAt<=days[6].date).length,masteredAll=Object.values(S.mastery||{}).filter(x=>x.mastered).length,due=countDueWords();
  const vocabulary=[...new Map(LEVELS.flatMap(l=>l.words).map(w=>[w.w,w])).values()],categories=[[/[äöü]/i,"Umlaute"],[/ß|ss/i,"ß / ss"],[/ie|ei/i,"ie / ei"],[/(.)\1/i,"Doppelkonsonanten"],[/sch|ch|sp|st/i,"Buchstabengruppen"],[/^[A-ZÄÖÜ]/,"Nomen-Großschreibung"]];
  const catScores=categories.map(([re,name])=>{const list=vocabulary.filter(w=>re.test(w.w)),vals=list.map(w=>S.words[w.w]).filter(Boolean),a=vals.reduce((n,x)=>n+(x.ok||0),0),b=vals.reduce((n,x)=>n+(x.bad||0),0);return{name,rate:a+b?Math.round(a/(a+b)*100):null,count:a+b};}).filter(x=>x.rate!==null).sort((a,b)=>b.rate-a.rate),best=catScores[0],weak=catScores.at(-1);
  return `<section class="card weekly-card"><div class="week-title"><h2>📈 ${tr("Diese Woche","This week")}</h2><small>${tr("Letzte 7 Tage","Last 7 days")}</small></div>
  ${current.length ? `<div class="row week-stats"><div><b>${words}</b><span>${tr("Wörter geübt","Words practised")}</span></div><div><b>${pct}%</b><span>${tr("richtig insgesamt","Overall correct")}</span></div><div><b>${firstPct}%</b><span>${tr("im 1. Versuch","First try")}</span></div><div><b>${minutes} min</b><span>${tr("Übungszeit","Practice time")}</span></div></div><div class="row week-stats"><div><b>${masteredThis}</b><span>${tr("neu gemeistert","Mastered this week")}</span></div><div><b>${masteredAll}</b><span>${tr("insgesamt gemeistert","Mastered total")}</span></div><div><b>${due}</b><span>${tr("zur Wiederholung","Due for review")}</span></div><div><b>${improvement>0?"+":""}${improvement}%</b><span>${tr("Wochenverbesserung","Weekly improvement")}</span></div></div><div class="week-chart">${bars}</div><div class="spell-categories"><b>${tr("Rechtschreib-Stärken","Spelling categories")}</b><p>${best?`💪 ${best.name} ${best.rate}%`:"–"} · ${weak?`🧩 ${weak.name} ${weak.rate}%`:"–"}</p>${catScores.slice(0,6).map(x=>`<div class="category-bar"><span>${x.name}</span><i><b style="width:${x.rate}%"></b></i><strong>${x.rate}%</strong></div>`).join("")}</div>
  <div class="week-insight"><b>💡 ${tr("Übungstipp","Practice tip")}</b><p>${challenges.length ? `${tr("Noch üben","Practise again")}: ${challenges.map(([w])=>esc(w)).join(", ")}. ${tr("Diese Wörter wurden diese Woche mehrfach nicht richtig geschrieben.","These words were missed more than once this week.")}` : tr("Bisher keine Wörter mit zwei falschen Versuchen. Weiter so!","No words have had repeated misses this week. Keep it up!")}</p></div>` : `<p>${tr("Die Wochenübersicht beginnt mit den Runden, die nach diesem Update gespielt werden.","Weekly insights begin with rounds played after this update.")}</p><div class="week-chart">${bars}</div>`}</section>`;
}

/* ---------- Eltern-Dashboard ---------- */
function dashboard() {
  if(!parentUnlocked){parentGate();return;}
  G = null; if (hasTTS) speechSynthesis.cancel();
  const all = LEVELS.flatMap(L => L.words.map(w => ({ ...w, level: L.name })));
  let scope = dashLevel === "all" ? [...new Map(all.map(w => [w.w, w])).values()] : all.filter(w => w.level === dashLevel);
  if(dashDifficulty!=="all")scope=scope.filter(w=>wordDifficulty(w)===dashDifficulty);
  const status = w => S.review.includes(w) ? "practice" : S.words[w] && S.words[w].ok > 0 ? "known" : "new";
  const counts = { known: 0, practice: 0, new: 0 };
  scope.forEach(w => counts[status(w.w)]++);
  const shown = scope.filter(w => {
    const st = status(w.w);
    return (dashFilter === "all" || dashFilter === st) && (!dashQuery || (w.w + " " + w.cat + " " + w.level).toLocaleLowerCase("de").includes(dashQuery.toLocaleLowerCase("de")));
  });
  const stats=Object.values(S.words||{}),practised=stats.filter(x=>(x.ok||0)+(x.bad||0)>0).length,correct=stats.reduce((n,x)=>n+(x.ok||0),0),wrong=stats.reduce((n,x)=>n+(x.bad||0),0),accuracy=correct+wrong?Math.round(correct/(correct+wrong)*100):0,completedLevels=(S.worldDone||[]).length+Object.keys(S.done||{}).filter(k=>S.done[k]).length,totalPracticeMinutes=Math.round(Number(S.totalPracticeSeconds||0)/60);
  const metadata=new Map(all.map(w=>[w.w,w])),ranked=Object.entries(S.words||{}).filter(([,x])=>(x.ok||0)+(x.bad||0)>0),hardest=ranked.slice().sort((a,b)=>((b[1].bad||0)/Math.max(1,(b[1].ok||0)+(b[1].bad||0)))-((a[1].bad||0)/Math.max(1,(a[1].ok||0)+(a[1].bad||0)))).slice(0,5),frequent=ranked.slice().sort((a,b)=>(b[1].bad||0)-(a[1].bad||0)).slice(0,5);
  app.innerHTML = `<div class="top dashboard-top"><button class="ghost" onclick="home()" aria-label="${tr("Zurück","Back")}">🏠</button><h2>👨‍👩‍👧 ${tr("Eltern-Dashboard","Parent Dashboard")}</h2>${languageToggle()}<button class="filter-btn" onclick="lockParentDashboard()">🔒 ${tr("Sperren","Lock")}</button></div>
  <p class="sub">${tr("Wortkenntnis und Rechtschreibung im Überblick","Vocabulary and spelling progress at a glance")}</p>
  <div class="parent-stats"><div><b>${practised}</b><span>${tr("Wörter geübt","Words practised")}</span></div><div><b>${correct}</b><span>${tr("Richtig beantwortet","Correct answers")}</span></div><div><b>${accuracy}%</b><span>${tr("Gesamtgenauigkeit","Overall accuracy")}</span></div><div><b>${completedLevels}</b><span>${tr("Level abgeschlossen","Levels completed")}</span></div><div><b>${totalPracticeMinutes} min</b><span>${tr("Übungszeit gesamt","Total practice time")}</span></div><div><b>${S.pts}</b><span>${tr("Punkte gesamt","Total points")}</span></div><div><b>${(S.dailyCompleted||[]).length}</b><span>${tr("Tagesaufgaben","Daily challenges")}</span></div></div>
  <div class="card parent-word-insights"><h3>📌 ${tr("Wort-Insights","Word insights")}</h3><div class="insight-columns"><section><b>⚠️ ${tr("Am schwierigsten","Most difficult")}</b>${rankedList(hardest,metadata,"ratio")}</section><section><b>🔁 ${tr("Am häufigsten falsch","Frequently incorrect")}</b>${rankedList(frequent,metadata,"count")}</section></div></div>
  ${weeklyInsightsHTML()}
  <div class="row dash-summary"><button class="dash-count known" onclick="dashFilter='known';dashboard()"><b>✓ ${counts.known}</b><span>${tr("kennt sie","Known")}</span></button><button class="dash-count practice" onclick="dashFilter='practice';dashboard()"><b>✗ ${counts.practice}</b><span>${tr("braucht Übung","Needs practice")}</span></button><button class="dash-count new" onclick="dashFilter='new';dashboard()"><b>○ ${counts.new}</b><span>${tr("noch nicht geübt","Not practised")}</span></button></div>
  <div class="card"><label for="dash-difficulty"><b>${tr("Schwierigkeit","Difficulty")}</b></label><select id="dash-difficulty" class="dash-select" onchange="setDashDifficulty(this.value)"><option value="all" ${dashDifficulty==="all"?"selected":""}>${tr("Alle Stufen","All difficulties")}</option>${[["easy","Leicht","Easy"],["medium","Mittel","Medium"],["hard","Knifflig","Tricky"]].map(([id,de,en])=>`<option value="${id}" ${dashDifficulty===id?"selected":""}>${tr(de,en)}</option>`).join("")}</select>
  <label for="dash-level"><b>${tr("Level","Level")}</b></label><select id="dash-level" class="dash-select" onchange="setDashLevel(this.value)"><option value="all" ${dashLevel === "all" ? "selected" : ""}>${tr("Alle Levels","All levels")}</option>${LEVELS.map(L => `<option value="${esc(L.name)}" ${dashLevel === L.name ? "selected" : ""}>Level ${L.id}: ${esc(L.name)}</option>`).join("")}</select>
  <label for="dash-search"><b>${tr("Wörter suchen","Search words")}</b></label><input id="dash-search" class="dash-search" placeholder="${tr("Wort oder Level eingeben …","Enter a word or level …")}" value="${esc(dashQuery)}" oninput="setDashQuery(this.value)">
  <div class="row dash-filters"><button class="filter-btn" onclick="dashFilter='all';dashboard()">${tr("Alle","All")} (${scope.length})</button><button class="filter-btn" onclick="dashFilter='known';dashboard()">✓ ${tr("Kennt sie","Known")}</button><button class="filter-btn" onclick="dashFilter='practice';dashboard()">✗ ${tr("Üben","Practice")}</button><button class="filter-btn" onclick="dashFilter='new';dashboard()">○ ${tr("Ungeübt","New")}</button></div>
  <h3 class="word-list-title">📚 ${tr("Wortliste","Word list")} <small>${tr("mit Mausrad oder Finger scrollen","Scroll with mouse wheel or touch")}</small></h3><div id="dash-list" class="dash-list">${dashRows(shown, status)}</div></div>
  <p class="note">${tr("✓ Mindestens einmal richtig geschrieben und nicht mehr auf der Übungsliste. ✗ Beim Spielen falsch beantwortet. ○ Noch keine gespeicherten Ergebnisse.","✓ Written correctly and not on the revision list. ✗ Answered incorrectly. ○ No saved results yet.")}</p>
  <button class="btn" onclick="home()">${tr("Zur Abenteuerkarte","Back to the adventure map")}</button>`;
}
function lockParentDashboard(){parentUnlocked=false;home();}
function rankedList(rows,metadata,mode){if(!rows.length)return `<p class="insight-empty">${tr("Noch keine Daten","No data yet")}</p>`;return `<ol>${rows.map(([word,x])=>{const n=(x.ok||0)+(x.bad||0),value=mode==="ratio"?`${Math.round((x.bad||0)/Math.max(1,n)*100)}% ${tr("Fehler","misses")}`:`${x.bad||0} ${tr("Fehler","misses")}`;return `<li><b>${esc(word)}</b><small>${esc(metadata.get(word)?.cat||"")} · ${value}</small></li>`;}).join("")}</ol>`;}
function dashRows(words, status) {
  if (!words.length) return `<p>${tr("Keine passenden Wörter gefunden.","No matching words found.")}</p>`;
  return words.map(w => { const st = status(w.w), icon = st === "known" ? "✓" : st === "practice" ? "✗" : "○", label = st === "known" ? tr("Kennt sie","Known") : st === "practice" ? tr("Braucht Übung","Needs practice") : tr("Noch ungeübt","Not practised");
    const data = S.words[w.w], detail = data ? `${tr("Richtig","Correct")}: ${data.ok||0} · ${tr("Fehler","Misses")}: ${data.bad||0}` : tr("Noch nicht gespielt","Not played yet"),statusLabel=({new:tr("Neu","New"),learning:tr("Lernt","Learning"),difficult:tr("Schwierig","Difficult"),mastered:tr("Gemeistert","Mastered")})[wordStatus(w.w)];
    return `<div class="dash-word ${st}"><span class="dash-mark" aria-label="${label}">${icon}</span><span class="dash-word-main"><b>${esc(w.w)}</b><small>${esc(w.cat)} · ${esc(w.level)} · ${statusLabel}</small></span><span class="dash-detail">${detail}${data?.nextReviewAt?` · ${tr("Wiederholung","Review")}: ${data.nextReviewAt}`:""}</span></div>`;
  }).join("");
}
function setDashLevel(value) { dashLevel = value; dashboard(); }
function setDashDifficulty(value){dashDifficulty=value;dashboard();}
function setDashQuery(value) {
  dashQuery = value;
  const all = LEVELS.flatMap(L => L.words.map(w => ({ ...w, level: L.name })));
  let scope = dashLevel === "all" ? [...new Map(all.map(w => [w.w, w])).values()] : all.filter(w => w.level === dashLevel);if(dashDifficulty!=="all")scope=scope.filter(w=>wordDifficulty(w)===dashDifficulty);
  const status = w => S.review.includes(w) ? "practice" : S.words[w] && S.words[w].ok > 0 ? "known" : "new";
  const shown = scope.filter(w => (dashFilter === "all" || dashFilter === status(w.w)) && (!dashQuery || (w.w + " " + w.cat + " " + w.level).toLocaleLowerCase("de").includes(dashQuery.toLocaleLowerCase("de"))));
  const list = $("#dash-list"); if (list) list.innerHTML = dashRows(shown, status);
}

/* ---------- Smart Revision ---------- */
function revision(){G=null;if(hasTTS)speechSynthesis.cancel();const master=Object.keys(S.mastery||{}).filter(w=>S.mastery[w].mastered),difficult=[...new Set([...S.review,...Object.keys(S.words||{}).filter(w=>wordDifficulty({w})==="hard")])],recent=[...new Set((S.recentWrong||[]).filter(x=>{const age=(Date.now()-new Date(x.date+"T00:00:00").getTime())/86400000;return age<=30;}).map(x=>x.word))];
  const cards=[{id:"difficult",icon:"🔥",name:tr("Schwierige Wörter","Difficult words"),count:difficult.length,copy:tr("Alle kniffligen und noch zu übenden Wörter.","Hard words and words that still need practice.")},{id:"recent",icon:"🕒",name:tr("Zuletzt falsch","Recently incorrect"),count:recent.length,copy:tr("Wörter mit Fehlern aus den letzten 30 Tagen.","Words missed in the last 30 days.")},{id:"mastered",icon:"👑",name:tr("Schon gemeistert","Previously mastered"),count:master.length,copy:tr("Wörter, die du schon richtig gut kannst.","Words you have mastered.")}];
  app.innerHTML=`<div class="top"><button class="ghost" onclick="home()">🏠</button><h2>🧠 ${tr("Wörter üben","Smart Revision")}</h2></div><p class="sub">${tr("Wähle deine nächste Wort-Mission!","Choose your next word mission!")}</p><div class="revision-grid">${cards.map(c=>`<button class="revision-card" onclick="startRevision('${c.id}')" ${c.count?"":"disabled"}><span>${c.icon}</span><b>${c.name}</b><small>${c.copy}</small><strong>${c.count} ${tr("Wörter","words")}</strong></button>`).join("")}</div><p class="note">${tr("Ein Wort ist gemeistert, wenn es in drei verschiedenen Runden richtig geschrieben wurde.","A word is mastered after correct answers in three separate rounds.")}</p><button class="btn" onclick="home()">${tr("Zurück","Back")}</button>`;
}
function startRevision(kind){const all=[...new Map(LEVELS.flatMap(l=>l.words).map(w=>[w.w,w])).values()];let words=[];if(kind==="difficult")words=all.filter(w=>S.review.includes(w.w)||wordDifficulty(w)==="hard");else if(kind==="recent")words=all.filter(w=>(S.recentWrong||[]).some(x=>x.word===w.w&&(Date.now()-new Date(x.date+"T00:00:00").getTime())/86400000<=30));else if(kind==="mastered")words=all.filter(w=>S.mastery[w.w]?.mastered);if(!words.length){revision();return;}startRound(shuffle(words),"listen",0);G.revisionType=kind;}

/* ---------- Belohnungen ---------- */
function chooseAvatar(a){if(!AVATARS.includes(a))return;S.av=a;if(!S.avs.includes(a))S.avs.push(a);save();rewards();}
function setAv(a) { if(AVATARS.includes(a)||S.avs.includes(a)){S.av=a;save();rewards();} }
function buyShopItem(id){const item=SHOP_ITEMS.find(x=>x.id===id);if(!item)return;S.ownedItems=S.ownedItems||[];if(!S.ownedItems.includes(id)){if((S.coins||0)<item.cost){alert(tr("Dafür brauchst du noch mehr Word Coins.","You need more Word Coins for this."));return;}S.coins-=item.cost;S.ownedItems.push(id);}S.equipped=S.equipped||{};S.equipped[item.group]=id;save();wordShop();}
function wordShop(){applyTheme();app.innerHTML=`<div class="top"><button class="ghost" onclick="home()">🏠</button><h2>🛍️ Word-Coin-Shop</h2><span class="pill">🪙 ${S.coins||0}</span></div><p class="sub">Verdiene Coins beim Spielen und wähle kostenlose virtuelle Extras.</p><div class="avatar-picker card"><h3>Wähle deine Figur</h3><div class="avatar-options">${AVATARS.map(a=>`<button class="avatar-option ${S.av===a?"selected":""}" onclick="chooseAvatar('${a}')">${a}</button>`).join("")}</div><p>Deine Figur: <strong class="avatar-preview">${avatarPresentation()}</strong></p></div><div class="shop-grid">${SHOP_ITEMS.map(x=>{const owned=(S.ownedItems||[]).includes(x.id),equipped=S.equipped?.[x.group]===x.id;return `<article class="shop-item ${equipped?"equipped":""}"><span>${x.emoji}</span><b>${x.name}</b><small>${tr(x.group==="accessory"?"Accessoire":x.group==="background"?"Hintergrund":x.group==="mascot"?"Begleiter":"Feier","Virtual cosmetic")}</small><button class="filter-btn" onclick="buyShopItem('${x.id}')" ${!owned&&(S.coins||0)<x.cost?"disabled":""}>${equipped?"Ausgewählt":owned?"Anlegen":`🪙 ${x.cost}`}</button></article>`;}).join("")}</div>`;}
function trophyCabinet(){const unlocked=V3_ACHIEVEMENTS.filter(a=>S.achievementsV3[a[0]]).length;app.innerHTML=`<div class="top"><button class="ghost" onclick="home()">🏠</button><h2>🏆 ${tr("Trophäenschrank","Trophy Cabinet")}</h2><span class="pill">${unlocked}/${V3_ACHIEVEMENTS.length}</span></div><p class="sub">${tr("Sammle Trophäen auf deinen Wort-Abenteuern!","Collect trophies on your word adventures!")}</p><div class="grid trophy-grid">${V3_ACHIEVEMENTS.map(a=>`<div class="tile ${S.achievementsV3[a[0]]?"":"off"}"><b>${S.achievementsV3[a[0]]?a[1]:"🔒"}</b>${isEnglish()?a[2]:a[3]}<small class="trophy-description">${isEnglish()?a[4]:a[5]}</small></div>`).join("")}</div><button class="btn" onclick="rewards()">${tr("Weitere Belohnungen","Other rewards")}</button>`;}
function rewards() {
  app.innerHTML = `<div class="top"><button class="ghost" onclick="home()">🏠</button><h2>🏆 Meine Belohnungen</h2><span class="pill">⭐ ${stars()}</span></div><div class="card"><h2>🪙 ${S.coins||0} Word Coins</h2><button class="btn go" onclick="wordShop()">Zum Word-Coin-Shop</button></div>
  <div class="card"><h2>Pokale & Schätze</h2><div class="grid">${MS.map(m => `<div class="tile ${S.ms.includes(m[0]) ? "" : "off"}"><b>${m[1]}</b>${m[2]}<br>${m[0]} Punkte</div>`).join("")}</div></div>
  <div class="card"><h2>🏆 Trophäenschrank · V3</h2><div class="grid">${V3_ACHIEVEMENTS.map(a=>`<div class="tile ${S.achievementsV3[a[0]]?"":"off"}"><b>${S.achievementsV3[a[0]]?a[1]:"🔒"}</b>${isEnglish()?a[2]:a[3]}<small class="trophy-description">${isEnglish()?a[4]:a[5]}</small></div>`).join("")}</div></div>
  <div class="card"><h2>Abzeichen</h2><div class="grid">${ACH.map((a, i) => `<div class="tile ${S.ach.includes(i) ? "" : "off"}"><b>${a[0]}</b>${a[1]}</div>`).join("")}</div></div>
  <div class="card"><h2>Meine Figur</h2><div class="grid">${AVATARS.map(a => `<button class="tile avatar-tile ${a === S.av ? "sel" : ""}" onclick="chooseAvatar('${a}')"><b>${a}</b>${a === S.av ? "Gewählt" : "Wählen"}</button>`).join("")}</div><button class="filter-btn" onclick="wordShop()">Accessoires freischalten</button></div>
  ${S.ms.includes(1000) ? `<div class="card center"><div class="chest">💎</div><p class="big">Du hast den Wortschatz gefunden!</p></div>` : ""}`;
}

if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));
home();
