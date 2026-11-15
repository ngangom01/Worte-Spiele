/* WORT-ABENTEUER – Startseite und Hauptbereiche (V6)
   Aufbau der Startseite (bewusst nur wenige große Flächen):
     Kopfzeile (Profil · Münzen · Sterne) → Fortschrittskarte → Tagesaufgabe →
     4 Kacheln: 🎮 Spiele · 🗺️ Abenteuer · 🧠 Wörter üben · 🎁 Meine Belohnungen → unten klein: Eltern · Einstellungen.
   „Meine Belohnungen“ bündelt Belohnungs-Spiel, Shop, Trophäen, Pokale und Figur in einem Bereich mit Reitern.
   Reine Darstellungs-Logik: Daten und Spielregeln bleiben in app.js (gut wiederverwendbar für eine spätere Android-Version). */
let adventureTab = "worlds",
  rewardsTab = "overview";

const tabBar = (tabs, cur, fn) =>
  `<div class="tab-bar" role="tablist">${tabs
    .map(
      ([id, ico, de, en]) =>
        `<button type="button" role="tab" aria-selected="${cur === id}" class="tab-btn ${cur === id ? "on" : ""}" onclick="${fn}('${id}')"><span aria-hidden="true">${ico}</span><b>${tr(de, en)}</b></button>`,
    )
    .join("")}</div>`;
const subpageTop = (title, pill) =>
  `<div class="top"><button class="ghost" onclick="home()" aria-label="${tr("Startseite", "Home")}">🏠</button><h2>${title}</h2>${pill ? `<span class="pill">${pill}</span>` : "<span></span>"}</div>`;

/* ---------- Startseite ---------- */
function home() {
  G = null;
  parentUnlocked = false;
  applyTheme();
  if (hasTTS) speechSynthesis.cancel();
  const nx = MS.find((m) => S.pts < m[0]),
    pv = [...MS].reverse().find((m) => S.pts >= m[0]),
    lo = pv ? pv[0] : 0,
    pc = nx ? Math.round(((S.pts - lo) / (nx[0] - lo)) * 100) : 100,
    dDone = S.daily === today(),
    words = [...new Map(learnLevels().flatMap((l) => l.words).map((w) => [w.w, w])).values()],
    discovered = words.filter((w) => wordTries((S.words || {})[w.w]) > 0).length,
    due = countDueWords(),
    mins = Math.floor(Number((S.practiceTimeByDate || {})[localDateKey(new Date())] || 0) / 60),
    goal = Number(S.dailyGoalMinutes || 10),
    rewardWaiting = (S.levelRewards || []).length > 0 && MiniGames.rewardStatus() === "ok";
  const tile = (cls, ico, de, en, sub, fn, dot) =>
    `<button type="button" class="home-tile ${cls}" onclick="${fn}"><span class="tile-ico" aria-hidden="true">${ico}</span><b>${tr(de, en)}</b><small>${sub}</small>${dot ? `<i class="tile-dot" aria-label="${tr("Neu", "New")}"></i>` : ""}</button>`;
  app.innerHTML = `<header class="home-head">
    <div class="home-who"><span class="avatar-face" aria-hidden="true">${avatarPresentation()}</span>
      <select id="profile-select" class="who-select" aria-label="${tr("Wer spielt heute?", "Who is playing?")}" onchange="switchProfile(this.value)">${S.profileOrder
        .map((id) => `<option value="${esc(id)}" ${id === S.activeProfileId ? "selected" : ""}>${esc(id === S.activeProfileId ? S.name : S.profiles[id]?.name || id)}</option>`)
        .join("")}</select>
      <button type="button" class="icon-btn" onclick="rename()" aria-label="${tr("Namen ändern", "Change name")}">✏️</button></div>
    <div class="home-pills"><span class="pill">🪙 ${Number(S.coins || 0)}</span><span class="pill">⭐ ${stars()}</span></div></header>
  <h1 class="home-title">WORT-ABENTEUER</h1>
  ${levelRewardHomeHTML()}
  <section class="card hero-card"><div class="hero-line"><b>${tr("Hallo", "Hi")}, ${esc(S.name)}!</b><span class="pill">Level ${curLevel()}</span></div>
    <div class="bar" role="progressbar" aria-valuenow="${pc}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pc}%"></i></div>
    <p class="hero-meta">🪙 ${S.pts} ${tr("Punkte", "points")} · ${nx ? `${nx[1]} ${tr("bei", "at")} ${nx[0]}` : tr("Alle Belohnungen geschafft! 🎉", "All rewards earned! 🎉")}</p>
    <p class="hero-meta">📚 ${discovered} ${tr("von", "of")} ${words.length} ${tr("Wörtern entdeckt", "words discovered")}${due ? ` · 🔁 ${due} ${tr("zur Wiederholung", "to review")}` : ""}</p></section>
  <button type="button" class="daily-cta ${dDone ? "done" : ""}" onclick="startDaily()" ${dDone ? "disabled" : ""}><span class="tile-ico" aria-hidden="true">📅</span><span><b>${dDone ? tr("Tagesaufgabe geschafft ✓", "Daily task done ✓") : tr("Tagesaufgabe", "Daily task")}</b><small>${dDone ? `${mins}/${goal} ${tr("Min. heute", "min today")}` : tr("10 Wörter · +50 Punkte", "10 words · +50 points")}</small></span></button>
  <nav class="home-tiles" aria-label="${tr("Hauptmenü", "Main menu")}">
    ${tile("t-games", "🎮", "Spiele", "Games", `${GAME_MODES.length} ${tr("Spielarten", "game types")}`, "gamesScreen()")}
    ${tile("t-adventure", "🗺️", "Abenteuer", "Adventure", tr("Lernwelten & Level", "Worlds & levels"), "adventure()")}
    ${tile("t-practice", "🧠", "Wörter üben", "Practice", due ? `${due} ${tr("fällig", "due")}` : tr("Fehler verbessern", "Improve mistakes"), "revision()")}
    ${tile("t-rewards", "🎁", "Meine Belohnungen", "My rewards", `🪙 ${Number(S.coins || 0)} · 🏆 ${V3_ACHIEVEMENTS.filter((a) => S.achievementsV3[a[0]]).length}`, "rewards()", rewardWaiting)}
  </nav>
  <footer class="home-foot"><button type="button" class="ghost-link" onclick="dashboard()">👨‍👩‍👧 ${tr("Eltern", "Parents")}</button><button type="button" class="ghost-link" onclick="settings()">⚙️ ${tr("Einstellungen", "Settings")}</button></footer>`;
}

/* ---------- Spiele ---------- */
function gamesScreen() {
  G = null;
  if (hasTTS) speechSynthesis.cancel();
  app.innerHTML = `${subpageTop("🎮 " + tr("Spiele", "Games"), "")}<p class="sub">${tr("Such dir ein Spiel aus! Neue Wörter kommen zuerst dran.", "Pick a game! New words come first.")}</p>
  <div class="difficulty-pick" role="group" aria-label="${tr("Schwierigkeit", "Difficulty")}">${Object.entries(DIFFICULTIES)
    .map(([id, label]) => `<button class="difficulty-chip ${selectedDifficulty === id ? "selected" : ""}" onclick="setDifficulty('${id}')">${id === "easy" ? "🌱" : id === "medium" ? "⭐" : "🚀"} ${label}</button>`)
    .join("")}</div>
  <div class="mode-grid">${GAME_MODES.map((m) => {
    const total = new Set(modeAll(m.id).map((w) => w.w)).size;
    return `<button class="mode-card mode-${m.id}" onclick="startMode('${m.id}')"><span class="mode-icon">${m.icon}</span><b>${m.name}</b><small>${m.desc}</small><span class="mode-meta">${total} ${tr("Wörter", "words")} · ${newWordsInMode(m.id)} ${tr("neu", "new")}</span></button>`;
  }).join("")}</div>`;
}

/* ---------- Abenteuer: Lernwelten + Level nach Sprachstufe ---------- */
function adventure(tab) {
  if (tab) adventureTab = tab;
  G = null;
  if (hasTTS) speechSynthesis.cancel();
  const starTotal = Object.values(S.worldStars || {}).reduce((n, x) => n + Number(x || 0), 0);
  let body;
  if (adventureTab === "levels") body = levelsHTML();
  else
    body = `<section class="world-home"><div class="world-map">${WORLDS.map((w) => {
      const earned = w.levels.reduce((n, l) => n + Number(S.worldStars[l.id] || 0), 0);
      return `<button class="world-card world-${w.id}" onclick="openWorld('${w.id}')"><span>${w.icon}</span><b>${w.de}</b><small>${w.en} · ${earned} ⭐ · ${w.levels.length} Level</small></button>`;
    }).join("")}</div></section>`;
  app.innerHTML = `${subpageTop("🗺️ " + tr("Abenteuer", "Adventure"), `⭐ ${adventureTab === "levels" ? stars() : starTotal}`)}
  ${tabBar([["worlds", "🌍", "Lernwelten", "Worlds"], ["levels", "📶", "Level", "Levels"]], adventureTab, "adventure")}${body}`;
}
function levelsHTML() {
  const tl = learnLevels(),
    stat = S.words || {};
  const groups = presentBands()
    .map((b) => [b, tl.filter((l) => l.cefr === b.id)])
    .filter((g) => g[1].length);
  return groups
    .map(([b, lv]) => {
      const words = [...new Map(lv.flatMap((l) => l.words).map((w) => [w.w, w])).values()],
        seen = words.filter((w) => wordTries(stat[w.w]) > 0).length;
      return `<section class="level-group"><h3>${b.id} · ${tr(b.de, b.en)}</h3><p class="muted">${seen}/${words.length} ${tr("Wörter entdeckt", "words discovered")}</p>${lv
        .map((L) => {
          const open = S.unl.includes(L.id),
            lw = new Set(L.words.map((w) => w.w)),
            ls = L.words.filter((w) => wordTries(stat[w.w]) > 0).length;
          return `<button class="lv ${open ? "" : "lock"}" onclick="${open ? `playLevel(${L.id})` : `lockMsg(${L.id})`}"><span class="ic">${open ? L.icon : "🔒"}</span>
          <span><b>Level ${L.id}: ${esc(L.name)}</b><small>${open ? "⭐".repeat(S.stars[L.id] || 0) + "☆".repeat(3 - (S.stars[L.id] || 0)) + ` · ${ls}/${lw.size} ${tr("Wörter", "words")}` : tr("Gesperrt – tippe für den Tipp", "Locked – tap for a hint")}</small></span></button>`;
        })
        .join("")}</section>`;
    })
    .join("");
}

/* ---------- Meine Belohnungen (ein Bereich mit Reitern) ---------- */
function rewards(tab) {
  if (tab) rewardsTab = tab;
  G = null;
  if (hasTTS) speechSynthesis.cancel();
  applyTheme();
  const bodies = { overview: rewardsOverview, shop: rewardsShop, trophies: rewardsTrophies, avatar: rewardsAvatar };
  if (!bodies[rewardsTab]) rewardsTab = "overview";
  app.innerHTML = `${subpageTop("🎁 " + tr("Meine Belohnungen", "My rewards"), `🪙 ${Number(S.coins || 0)}`)}
  ${tabBar([["overview", "🎁", "Überblick", "Overview"], ["shop", "🛍️", "Shop", "Shop"], ["trophies", "🏆", "Trophäen", "Trophies"], ["avatar", "🦊", "Figur", "Avatar"]], rewardsTab, "rewards")}
  ${bodies[rewardsTab]()}`;
}
function wordShop() {
  rewards("shop");
}
function trophyCabinet() {
  rewards("trophies");
}
function rewardsOverview() {
  const r = MiniGames.rewardSettings(),
    waiting = levelRewardButtonHTML("home");
  const gameCard = !r.enabled
    ? `<p>${tr("Die Belohnungs-Spiele sind ausgeschaltet.", "Reward games are switched off.")}</p>`
    : waiting || `<p>${tr("Schaffe ein neues Level oder dein Tagesziel – dann wartet hier ein Mini-Spiel auf dich!", "Reach a new level or your daily goal – a mini game will wait for you here!")}</p>`;
  return `<div class="card"><h2>🎮 ${tr("Belohnungs-Spiel", "Reward game")}</h2>${gameCard}${r.enabled ? `<p class="muted">${tr("Heute gespielt", "Played today")}: ${MiniGames.playedToday()}/${r.dailyMax}</p>` : ""}</div>
  <div class="card"><h2>🪙 ${Number(S.coins || 0)} Word Coins</h2><p>${tr("Tausche Coins im Shop gegen Accessoires, Begleiter und Hintergründe.", "Trade coins in the shop for accessories, companions and backgrounds.")}</p><button class="btn go" onclick="rewards('shop')">🛍️ ${tr("Zum Shop", "Open shop")}</button></div>
  <div class="card"><h2>${tr("Pokale & Schätze", "Cups & treasures")}</h2><div class="grid">${MS.map((m) => `<div class="tile ${S.ms.includes(m[0]) ? "" : "off"}"><b>${m[1]}</b>${m[2]}<br>${m[0]} ${tr("Punkte", "points")}</div>`).join("")}</div></div>
  ${S.ms.includes(1000) ? `<div class="card center"><div class="chest">💎</div><p class="big">${tr("Du hast den Wortschatz gefunden!", "You found the treasure of words!")}</p></div>` : ""}`;
}
function rewardsShop() {
  return `<p class="sub">${tr("Verdiene Coins beim Spielen und wähle kostenlose virtuelle Extras.", "Earn coins while playing and pick free virtual extras.")}</p><div class="shop-grid">${SHOP_ITEMS.map((x) => {
    const owned = (S.ownedItems || []).includes(x.id),
      equipped = S.equipped?.[x.group] === x.id;
    return `<article class="shop-item ${equipped ? "equipped" : ""}"><span>${x.emoji}</span><b>${x.name}</b><small>${tr(x.group === "accessory" ? "Accessoire" : x.group === "background" ? "Hintergrund" : x.group === "mascot" ? "Begleiter" : "Feier", "Virtual cosmetic")}</small><button class="filter-btn" onclick="buyShopItem('${x.id}')" ${!owned && (S.coins || 0) < x.cost ? "disabled" : ""}>${equipped ? tr("Ausgewählt", "Selected") : owned ? tr("Anlegen", "Equip") : `🪙 ${x.cost}`}</button></article>`;
  }).join("")}</div>`;
}
function rewardsTrophies() {
  const unlocked = V3_ACHIEVEMENTS.filter((a) => S.achievementsV3[a[0]]).length;
  return `<div class="card"><h2>🏆 ${tr("Trophäenschrank", "Trophy cabinet")} <span class="pill">${unlocked}/${V3_ACHIEVEMENTS.length}</span></h2><div class="grid trophy-grid">${V3_ACHIEVEMENTS.map((a) => `<div class="tile ${S.achievementsV3[a[0]] ? "" : "off"}"><b>${S.achievementsV3[a[0]] ? a[1] : "🔒"}</b>${isEnglish() ? a[2] : a[3]}<small class="trophy-description">${isEnglish() ? a[4] : a[5]}</small></div>`).join("")}</div></div>
  <div class="card"><h2>${tr("Abzeichen", "Badges")}</h2><div class="grid">${ACH.map((a, i) => `<div class="tile ${S.ach.includes(i) ? "" : "off"}"><b>${a[0]}</b>${a[1]}</div>`).join("")}</div></div>`;
}
function rewardsAvatar() {
  return `<div class="avatar-picker card"><h3>${tr("Wähle deine Figur", "Choose your character")}</h3><div class="avatar-options">${AVATARS.map((a) => `<button class="avatar-option ${S.av === a ? "selected" : ""}" onclick="chooseAvatar('${a}')" aria-label="${a}">${a}</button>`).join("")}</div><p>${tr("Deine Figur", "Your character")}: <strong class="avatar-preview">${avatarPresentation()}</strong></p><button class="filter-btn" onclick="rewards('shop')">${tr("Accessoires im Shop", "Accessories in the shop")}</button></div>`;
}
