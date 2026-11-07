/* WORT-ABENTEUER – Zusammenführen von Spielständen (Google Drive / zwei Geräte).
   Statt „der neuere Stand gewinnt“ werden beide Stände Wort für Wort zusammengeführt,
   damit Fortschritt von Handy und iPad nicht verloren geht. Reine Funktionen, keine DOM-Zugriffe. */
const ProgressMerge = (function () {
  const isObj = (x) => x && typeof x === "object" && !Array.isArray(x);
  const num = (x) => Number(x || 0);
  const union = (a, b) => [...new Set([...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])])];
  const keysOf = (a, b) => union(Object.keys(isObj(a) ? a : {}), Object.keys(isObj(b) ? b : {}));
  const mapMax = (a, b) => {
    const out = {};
    keysOf(a, b).forEach((k) => (out[k] = Math.max(num((a || {})[k]), num((b || {})[k]))));
    return out;
  };
  const dateMax = (x, y) => (String(x || "") >= String(y || "") ? x || "" : y || "");

  // Ein Wort-Statistik-Eintrag: die Seite mit mehr Versuchen ist die vollständigere; bei Gleichstand die neuere.
  function mergeStat(a, b) {
    if (!a) return b;
    if (!b) return a;
    const att = (s) => num(s.attempts ?? num(s.ok) + num(s.bad));
    if (att(a) !== att(b)) return att(a) > att(b) ? a : b;
    return String(a.lastPracticeDate || a.last || "") >= String(b.lastPracticeDate || b.last || "") ? a : b;
  }
  function mergeStatMap(a, b) {
    const out = {};
    keysOf(a, b).forEach((k) => (out[k] = mergeStat((a || {})[k], (b || {})[k])));
    return out;
  }
  function mergeMastery(a, b) {
    const out = {};
    keysOf(a, b).forEach((k) => {
      const x = (a || {})[k],
        y = (b || {})[k];
      if (!x || !y) return void (out[k] = x || y);
      const mastered = !!(x.mastered || y.mastered);
      out[k] = {
        ...(num(x.correctRounds) >= num(y.correctRounds) ? x : y),
        correctRounds: Math.max(num(x.correctRounds), num(y.correctRounds)),
        mastered,
      };
      if (mastered) out[k].masteredAt = x.masteredAt || y.masteredAt || "";
    });
    return out;
  }
  const byDateMax = (a, b) => {
    const out = {};
    keysOf(a, b).forEach((k) => (out[k] = Math.max(num((a || {})[k]), num((b || {})[k]))));
    return out;
  };
  function mergeHistory(a, b) {
    const seen = new Set(),
      out = [];
    [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])].forEach((h) => {
      const key = JSON.stringify(h);
      if (!seen.has(key)) {
        seen.add(key);
        out.push(h);
      }
    });
    return out.sort((x, y) => String(x.date || "").localeCompare(String(y.date || ""))).slice(-365);
  }

  // newer = true, wenn die erste Seite (a) insgesamt zuletzt geändert wurde: sie liefert „Entweder-oder“-Felder.
  function mergeProfile(a, b, newer) {
    a = a || {};
    b = b || {};
    const first = newer ? a : b,
      second = newer ? b : a;
    const out = { ...second, ...first };
    out.name = first.name || second.name;
    out.pts = Math.max(num(a.pts), num(b.pts));
    out.rounds = Math.max(num(a.rounds), num(b.rounds));
    out.unl = union(a.unl, b.unl).sort((x, y) => x - y);
    out.stars = mapMax(a.stars, b.stars);
    out.acc = mapMax(a.acc, b.acc);
    out.done = { ...(b.done || {}), ...(a.done || {}) };
    out.ach = union(a.ach, b.ach);
    out.ms = union(a.ms, b.ms);
    out.words = mergeStatMap(a.words, b.words);
    out.articles = mergeStatMap(a.articles, b.articles);
    out.mastery = mergeMastery(a.mastery, b.mastery);
    const masteredNow = (w) => out.mastery[w] && out.mastery[w].mastered;
    out.review = union(a.review, b.review).filter((w) => !masteredNow(w));
    out.worldStars = mapMax(a.worldStars, b.worldStars);
    out.worldDone = union(a.worldDone, b.worldDone);
    out.worldRewards = union(a.worldRewards, b.worldRewards);
    out.dailyCompleted = union(a.dailyCompleted, b.dailyCompleted);
    out.daily = first.daily || second.daily || "";
    out.recentWrong = [...(second.recentWrong || []), ...(first.recentWrong || [])].slice(-250);
    out.listenAnswered = Math.max(num(a.listenAnswered), num(b.listenAnswered));
    out.achievementsV3 = { ...(b.achievementsV3 || {}), ...(a.achievementsV3 || {}) };
    out.modePlayed = mapMax(a.modePlayed, b.modePlayed);
    out.practiceTimeByDate = byDateMax(a.practiceTimeByDate, b.practiceTimeByDate);
    out.totalPracticeSeconds = Math.max(
      num(a.totalPracticeSeconds),
      num(b.totalPracticeSeconds),
      Object.values(out.practiceTimeByDate).reduce((n, x) => n + num(x), 0),
    );
    out.history = mergeHistory(a.history, b.history);
    const hist = new Map();
    [...(second.cefrHistory || []), ...(first.cefrHistory || [])].forEach((h) => h && h.d && hist.set(h.d, h));
    out.cefrHistory = [...hist.values()].sort((x, y) => x.d.localeCompare(y.d)).slice(-120);
    out.avs = union(a.avs, b.avs);
    out.ownedItems = union(a.ownedItems, b.ownedItems);
    out.bs = !!(a.bs || b.bs);
    out.levelUps = Math.max(num(a.levelUps), num(b.levelUps));
    out.rewardSeq = Math.max(num(a.rewardSeq), num(b.rewardSeq));
    // „Entweder-oder“: Münzen (können ausgegeben werden), Auswahl, Ziele, offene Belohnungen kommen von der neueren Seite.
    out.coins = num(first.coins);
    out.equipped = first.equipped || second.equipped;
    out.adaptive = first.adaptive || second.adaptive;
    out.dailyGoalMinutes = first.dailyGoalMinutes || second.dailyGoalMinutes;
    out.dailyChallenge = first.dailyChallenge || second.dailyChallenge;
    out.modeRecent = first.modeRecent || second.modeRecent;
    out.levelRewards = Array.isArray(first.levelRewards) ? first.levelRewards : second.levelRewards || [];
    out.rewardsToday = dateMax(a.rewardsToday?.date, b.rewardsToday?.date) === (first.rewardsToday?.date || "") ? first.rewardsToday : second.rewardsToday;
    out.goalRewardDate = dateMax(a.goalRewardDate, b.goalRewardDate);
    out.track = first.track || second.track;
    out.rewardSettings = first.rewardSettings || second.rewardSettings;
    out.av = first.av || second.av;
    return out;
  }

  // local / remote: komplette Spielstände (mit profiles, profileOrder, activeProfileId, updatedAt).
  function mergeProgress(local, remote) {
    const lt = num(local.updatedAt),
      rt = num(remote.updatedAt),
      localNewer = lt >= rt;
    const base = localNewer ? local : remote; // globale Felder (Sprache, aktives Profil …)
    const out = { ...remote, ...local, ...base };
    const lp = local.profiles || {},
      rp = remote.profiles || {};
    out.profiles = {};
    keysOf(lp, rp).forEach((id) => (out.profiles[id] = mergeProfile(lp[id], rp[id], localNewer)));
    out.profileOrder = union(local.profileOrder, remote.profileOrder);
    out.activeProfileId = local.activeProfileId && out.profiles[local.activeProfileId] ? local.activeProfileId : out.profileOrder[0];
    Object.assign(out, out.profiles[out.activeProfileId]);
    out.updatedAt = Math.max(lt, rt, Date.now());
    return out;
  }

  // Geheimnisse (PIN) gehören nie in Sicherungsdateien oder die Cloud.
  function stripSecrets(progress) {
    const copy = JSON.parse(JSON.stringify(progress));
    ["parentPin", "parentPinHash", "pinSalt"].forEach((k) => delete copy[k]);
    return copy;
  }
  return { mergeProgress, mergeProfile, stripSecrets };
})();
if (typeof module !== "undefined") module.exports = ProgressMerge;
