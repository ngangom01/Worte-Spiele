/* WORT-ABENTEUER – Artikel-Detektiv (der / die / das).
   Eigene Statistik (S.articles): Artikel-Fehler zählen NICHT als Rechtschreibfehler und
   beeinflussen weder die Wort-Meisterschaft noch die Wiederholungsliste der Rechtschreibung. */
const ArticleMode = (function () {
  const CHOICES = ["der", "die", "das"];
  const cap = (a) => a[0].toLocaleUpperCase("de") + a.slice(1);
  const dateIn = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return localDateKey(d);
  };
  function stat(word) {
    S.articles = S.articles || {};
    const a = S.articles[word] || (S.articles[word] = { ok: 0, bad: 0, attempts: 0, difficultyScore: 0, last: "", nextReviewAt: "" });
    return a;
  }
  function refresh(a) {
    a.attempts = a.ok + a.bad;
    a.difficultyScore = a.attempts ? Math.round((a.bad / a.attempts) * 100) : 0;
    a.last = localDateKey(new Date());
  }
  function recordMiss(word) {
    const a = stat(word);
    a.bad++;
    refresh(a);
    a.nextReviewAt = dateIn(1);
    save();
  }
  function recordCorrect(word) {
    const a = stat(word);
    a.ok++;
    refresh(a);
    a.nextReviewAt = dateIn(a.bad > a.ok ? 1 : 3);
  }
  function question() {
    G.att = 0;
    G.hinted = false;
    G.revealed = false;
    G.lock = false;
    G.articleSelection = "";
    const word = G.q[G.i];
    app.innerHTML = `<div class="top"><button class="ghost" onclick="askSaveBeforeLeave()" aria-label="${tr("Spiel verlassen", "Leave game")}">🏠</button><b style="font-size:20px">${G.i + 1} ${tr("von", "of")} ${G.q.length}</b><span class="pill">🪙 ${S.pts + G.pts}</span></div>
      <div class="bar"><i style="width:${(G.i / G.q.length) * 100}%"></i></div>
      <div class="card center game-card article-card"><div class="game-mode-label">📘 Artikel-Detektiv · ${DIFFICULTIES[G.difficulty] || ""}</div>
      <p class="big">${tr("Welcher Artikel passt?", "Which article fits?")}</p><div class="article-word">${esc(word.w)}</div><p class="clue-caption">${esc(word.cat)}</p>
      <div class="article-options" role="group" aria-label="${tr("Artikel auswählen", "Choose an article")}">${CHOICES.map(
        (a) => `<button type="button" class="article-choice" id="article-${a}" onclick="selectArticle('${a}')">${cap(a)}</button>`,
      ).join("")}</div>
      <button id="chk" class="btn go" onclick="check()">✅ ${tr("Das ist meine Antwort!", "That is my answer!")}</button><div id="fb" aria-live="polite"></div></div>`;
  }
  function select(article) {
    if (!G || G.mode !== "article" || G.lock || !CHOICES.includes(article)) return;
    G.articleSelection = article;
    CHOICES.forEach((c) => {
      const b = $("#article-" + c);
      if (b) b.classList.toggle("selected", c === article);
    });
  }
  function check() {
    if (!G || G.mode !== "article" || G.lock || !G.articleSelection) return;
    const w = G.q[G.i],
      fb = $("#fb"),
      picked = G.articleSelection;
    if (picked === w.article) {
      const clean = !G.att,
        p = clean ? 15 : 10;
      let bonus = 0;
      if (clean) G.first++;
      else G.second++;
      if (G.i < G.baseTotal) {
        G.baseCorrect++;
        if (clean) G.baseFirst++;
        if (!G.att) G.firstTryCorrect = (G.firstTryCorrect || 0) + 1;
      }
      G.streak++;
      if (clean) {
        G.perfectStreak++;
        if (G.perfectStreak % 5 === 0) G.coinBonus += 2;
      } else G.perfectStreak = 0;
      if (G.streak % 3 === 0) {
        bonus = 10;
        G.sb = true;
      }
      G.ok++;
      G.pts += p + bonus;
      G.log.push([w.w, clean ? "f" : "s"]);
      if (!clean) G.bad.push(w);
      unlockV3("first-word");
      lockQ();
      tone([523, 659, 784]);
      rain(SHOP_ITEMS.find((x) => x.id === S.equipped?.celebration)?.emoji || "⭐");
      fb.innerHTML = `<div class="good"><div class="mascot-cheer">${avatarPresentation()}</div><div class="stars">🌟✨🌟</div><h2>${mascotCheer()}</h2>
        <p class="word">${cap(w.article)} ${hl(w.w)}</p><p>+${p} ${tr("Punkte", "points")}${bonus ? ` ${tr("und", "and")} +${bonus} ${tr("Serien-Bonus", "streak bonus")} 🔥` : ""}</p>
        <p class="sent">${esc(w.s)}</p><button class="btn go next-btn" onclick="nextQ()">${tr("Weiter", "Next")} ➜</button></div>`;
    } else {
      G.att++;
      G.streak = 0;
      G.perfectStreak = 0;
      G.mistakes.push(w.w);
      if (!G.bad.some((x) => x.w === w.w)) G.bad.push(w);
      recordMiss(w.w); // eigene Artikel-Statistik – kein Rechtschreibfehler
      if (G.i < G.baseTotal && !G.revisionAdded[w.w]) {
        G.revisionAdded[w.w] = true;
        G.revisionQueue.push(w);
      }
      tone([330, 330]);
      const b = $("#article-" + picked);
      if (b) {
        b.disabled = true;
        b.classList.remove("selected");
        b.classList.add("wrong");
      }
      G.articleSelection = "";
      fb.innerHTML = `<div class="try"><h2>${avatarPresentation()} ${tr("Guter Versuch! 🌈 Probier einen anderen Artikel.", "Good try! 🌈 Pick another article.")}</h2>
        <p class="spelling-tip">💡 ${tr("Lies das Wort noch einmal und denk an den Klang: der Hund, die Katze, das Pferd …", "Read the word again and listen to how it sounds: der Hund, die Katze, das Pferd …")}</p>
        ${G.att >= 2 ? `<button class="btn alt" onclick="revealAnswer()">👀 ${tr("Antwort anzeigen", "Show the answer")}</button>` : ""}</div>`;
    }
  }
  function reveal() {
    if (!G || G.mode !== "article" || G.lock) return;
    const w = G.q[G.i];
    G.revealed = true;
    lockQ();
    const fb = $("#fb");
    if (fb)
      fb.innerHTML = `<div class="try answer-revealed"><h2>${tr("Der richtige Artikel ist:", "The correct article is:")}</h2><p class="word">${cap(w.article)} ${hl(w.w)}</p>
        <p class="sent">${esc(w.s)}</p><button class="btn go next-btn" onclick="nextQ()">${tr("Weiter", "Next")} ➜</button></div>`;
  }
  return { question, select, check, reveal, recordCorrect, recordMiss, stat };
})();
function selectArticle(article) {
  ArticleMode.select(article);
}
