/* WORT-ABENTEUER – Sprachniveau nach GER / CEFR (Eltern-Dashboard).
   WICHTIG: Das ist eine Schätzung aus Wortschatz und Rechtschreibung in dieser App – keine offizielle Einstufung.
   Zuordnung der Wortlisten zu Stufen (siehe README): A1 = Level 1–7, A2 = Level 8–10, B1 = Level 11–15.
   Die Lerninhalte pro Profil (TRACKS) stehen in app.js.
   Ein Wort zählt nur einmal (in der niedrigsten Stufe, in der es vorkommt). */
const CEFR = (function () {
  const BANDS = [
    { id: "A1", levels: [1, 2, 3, 4, 5, 6, 7], de: "Anfänger", en: "Beginner" },
    { id: "A2", levels: [8, 9, 10], de: "Grundlegende Kenntnisse", en: "Elementary" },
    { id: "B1", levels: [11, 12, 13, 14, 15], de: "Fortgeschrittene Sprachverwendung", en: "Intermediate" },
  ];
  const TARGET = 0.7; // Anteil „sicherer“ Wörter, ab dem eine Stufe als erreicht gilt
  const num = (x) => Number(x || 0);
  const bandOfLevel = (id) => BANDS.find((b) => b.levels.includes(id));

  function bandWords() {
    const out = Object.fromEntries(BANDS.map((b) => [b.id, []])),
      seen = new Set();
    LEVELS.forEach((level) => {
      const band = bandOfLevel(level.id);
      if (!band) return;
      level.words.forEach((w) => {
        if (!seen.has(w.w)) {
          seen.add(w.w);
          out[band.id].push(w.w);
        }
      });
    });
    return out;
  }
  // „Sicher“ = gemeistert, oder mindestens 2× richtig bei höchstens 25 % Fehlversuchen.
  function isSecure(word, prof) {
    if (prof.mastery && prof.mastery[word] && prof.mastery[word].mastered) return true;
    const s = prof.words && prof.words[word];
    if (!s) return false;
    const attempts = num(s.attempts ?? num(s.ok) + num(s.bad)),
      correct = num(s.correct ?? s.ok),
      wrong = num(s.incorrect ?? s.bad);
    return attempts >= 2 && correct >= 2 && wrong / attempts <= 0.25;
  }
  const attempted = (word, prof) => {
    const s = prof.words && prof.words[word];
    return !!s && num(s.attempts ?? num(s.ok) + num(s.bad)) > 0;
  };

  function evaluate(prof) {
    const lists = bandWords(),
      track = TRACKS[prof.track] || TRACKS.grundschule;
    const bands = BANDS.map((b) => {
      const words = lists[b.id],
        active = b.levels.some((id) => track.levels.includes(id));
      let secure = 0,
        seen = 0,
        correct = 0,
        wrong = 0;
      words.forEach((w) => {
        if (isSecure(w, prof)) secure++;
        if (attempted(w, prof)) {
          seen++;
          const s = prof.words[w];
          correct += num(s.correct ?? s.ok);
          wrong += num(s.incorrect ?? s.bad);
        }
      });
      const need = Math.ceil(words.length * TARGET);
      return {
        id: b.id,
        de: b.de,
        en: b.en,
        active,
        total: words.length,
        secure,
        seen,
        need,
        pct: words.length ? Math.round((secure / words.length) * 100) : 0,
        accuracy: correct + wrong ? Math.round((correct / (correct + wrong)) * 100) : null,
        achieved: active && secure >= need,
      };
    });
    // Aktuelles Niveau: höchste erreichte Stufe, wobei alle davor liegenden aktiven Stufen ebenfalls erreicht sein müssen.
    let current = null,
      next = null;
    for (const b of bands) {
      if (!b.active) continue;
      if (b.achieved) current = b;
      else {
        next = b;
        break;
      }
    }
    const articleWords = Object.keys(prof.articles || {}),
      articleSecure = articleWords.filter((w) => {
        const a = prof.articles[w];
        return num(a.ok) >= 2 && num(a.bad) <= num(a.ok) / 2;
      }).length;
    const articleTotal = new Set(LEVELS.filter((l) => track.levels.includes(l.id)).flatMap((l) => l.words.filter((w) => w.art).map((w) => w.w))).size;
    return {
      bands,
      current,
      next,
      track,
      articles: { secure: articleSecure, total: articleTotal },
      totalSecure: bands.reduce((n, b) => n + b.secure, 0),
    };
  }

  const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  // Tagesstand speichern (ein Eintrag pro Tag, die letzten ~120 Tage) – Grundlage für den Verlauf im Dashboard.
  function snapshot(prof) {
    const ev = evaluate(prof);
    prof.cefrHistory = Array.isArray(prof.cefrHistory) ? prof.cefrHistory : [];
    const entry = { d: dayKey(new Date()), t: ev.totalSecure, A1: ev.bands[0].secure, A2: ev.bands[1].secure, B1: ev.bands[2].secure, lv: ev.current ? ev.current.id : "" };
    const i = prof.cefrHistory.findIndex((h) => h.d === entry.d);
    if (i >= 0) prof.cefrHistory[i] = entry;
    else prof.cefrHistory.push(entry);
    prof.cefrHistory = prof.cefrHistory.slice(-120);
    return entry;
  }

  function weeklySeries(prof) {
    const hist = (prof.cefrHistory || []).slice(),
      weeks = new Map();
    hist.forEach((h) => {
      const [y, m, d] = h.d.split("-").map(Number),
        date = new Date(y, m - 1, d),
        monday = new Date(date);
      monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
      weeks.set(dayKey(monday), h.t);
    });
    return [...weeks.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-8);
  }
  function weekChartSVG(series) {
    if (series.length < 2) return "";
    const max = Math.max(1, ...series.map((s) => s[1])),
      bw = 34,
      gap = 12,
      h = 90,
      w = series.length * (bw + gap) + gap;
    return `<svg class="cefr-chart" viewBox="0 0 ${w} ${h + 28}" role="img" aria-label="${tr("Sichere Wörter pro Woche", "Secure words per week")}">${series
      .map(([d, v], i) => {
        const bh = Math.max(2, Math.round((v / max) * h)),
          x = gap + i * (bw + gap);
        return `<rect x="${x}" y="${h - bh + 14}" width="${bw}" height="${bh}" rx="6" class="cefr-bar"/><text x="${x + bw / 2}" y="${h - bh + 10}" text-anchor="middle" class="cefr-val">${v}</text><text x="${x + bw / 2}" y="${h + 26}" text-anchor="middle" class="cefr-wk">${d.slice(8)}.${d.slice(5, 7)}.</text>`;
      })
      .join("")}</svg>`;
  }
  function gainLastDays(prof, days) {
    const hist = prof.cefrHistory || [];
    if (hist.length < 2) return null;
    const last = hist[hist.length - 1],
      limit = new Date();
    limit.setDate(limit.getDate() - days);
    const ref = hist.find((h) => h.d >= dayKey(limit)) || hist[0];
    return ref === last ? null : last.t - ref.t;
  }

  function profileView(id) {
    return id === S.activeProfileId ? S : S.profiles[id];
  }
  function panelHTML() {
    const prof = S,
      ev = evaluate(prof),
      lang = (b) => tr(b.de, b.en);
    const level = ev.current ? ev.current.id : tr("Vor A1", "Pre-A1"),
      sub = ev.current ? lang(ev.current) : tr("Einstieg – die ersten Wörter sitzen schon", "Starting out – the first words are taking shape");
    const target = ev.next,
      toNext = target ? Math.max(0, target.need - target.secure) : 0;
    const gain = gainLastDays(prof, 7);
    const goal = target
      ? tr(
          `Nächstes Ziel: <b>${target.id}</b> – noch <b>${toNext}</b> sichere Wörter (${target.secure} von ${target.total}, Ziel: ${Math.round(TARGET * 100)} %).`,
          `Next goal: <b>${target.id}</b> – <b>${toNext}</b> more secure words (${target.secure} of ${target.total}, target: ${Math.round(TARGET * 100)}%).`,
        )
      : tr("Alle Stufen dieses Lernprofils sind erreicht. 🎉", "All levels of this learning profile are reached. 🎉");
    const rows = ev.bands
      .map((b) => {
        const state = !b.active ? "off" : b.achieved ? "done" : "work";
        return `<div class="cefr-row cefr-${state}"><div class="cefr-head"><b>${b.id}</b><span>${lang(b)}</span><em>${
          !b.active ? tr("nicht im Lernprofil", "not in learning profile") : b.achieved ? "✓ " + tr("erreicht", "reached") : b.pct + " %"
        }</em></div><div class="bar" role="progressbar" aria-valuenow="${b.pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${b.pct}%"></i><s style="left:${Math.round(TARGET * 100)}%"></s></div><small>${b.secure} ${tr("von", "of")} ${b.total} ${tr("Wörtern sicher", "words secure")} · ${b.seen} ${tr("geübt", "practised")}${b.accuracy === null ? "" : " · " + b.accuracy + " % " + tr("richtig", "correct")}</small></div>`;
      })
      .join("");
    const overview = S.profileOrder
      .map((id) => {
        const p = profileView(id),
          e = evaluate(p);
        return `<tr><td>${esc(p.name || id)}</td><td>${esc(tr(e.track.de, e.track.en))}</td><td><b>${e.current ? e.current.id : tr("Vor A1", "Pre-A1")}</b></td><td>${e.totalSecure}</td></tr>`;
      })
      .join("");
    return `<div class="card cefr-card"><h3>🎓 ${tr("Sprachniveau (GER / CEFR)", "Language level (CEFR)")}</h3>
      <div class="cefr-hero"><div class="cefr-badge" aria-label="${tr("Aktuelles Niveau", "Current level")}">${level}</div><div><b>${sub}</b><br><small>${esc(S.name)} · ${esc(tr(ev.track.de, ev.track.en))}</small>${
        gain === null ? "" : `<br><small>${gain >= 0 ? "▲ +" : "▼ "}${gain} ${tr("sichere Wörter in 7 Tagen", "secure words in 7 days")}</small>`
      }</div></div>
      <p>${goal}</p>${rows}
      <p class="cefr-article">📘 ${tr("Artikel-Detektiv", "Article detective")}: <b>${ev.articles.secure}</b> ${tr("von", "of")} ${ev.articles.total} ${tr("Artikeln sicher", "articles secure")}</p>
      ${weekChartSVG(weeklySeries(prof)) ? `<h4>${tr("Sichere Wörter pro Woche", "Secure words per week")}</h4>${weekChartSVG(weeklySeries(prof))}` : `<p class="note">${tr("Der Wochenverlauf erscheint nach den ersten Übungstagen.", "The weekly trend appears after the first days of practice.")}</p>`}
      <details class="cefr-all"><summary>${tr("Alle Profile im Überblick", "All profiles at a glance")}</summary><table class="cefr-table"><thead><tr><th>${tr("Profil", "Profile")}</th><th>${tr("Lerninhalt", "Content")}</th><th>${tr("Niveau", "Level")}</th><th>${tr("Sichere Wörter", "Secure words")}</th></tr></thead><tbody>${overview}</tbody></table></details>
      <p class="note">${tr(
        "So wird gerechnet: Ein Wort ist „sicher“, wenn es gemeistert ist oder mindestens zweimal richtig geschrieben wurde (höchstens 25 % Fehlversuche). Eine Stufe gilt ab 70 % sicherer Wörter als erreicht (Markierung im Balken). A1 = Level 1–7, A2 = Level 8–10, B1 = Level 11–15 (Goethe-Zertifikat-B1-Themen). Das ist eine Schätzung aus Wortschatz und Rechtschreibung – keine offizielle Einstufung; Hören, Sprechen und Textverständnis werden nicht gemessen.",
        "How it is calculated: a word is “secure” once it is mastered or has been spelled correctly at least twice (at most 25% failed attempts). A level counts as reached at 70% secure words (marker on the bar). A1 = levels 1–7, A2 = levels 8–10, B1 = levels 11–15 (Goethe-Zertifikat B1 topics). This is an estimate from vocabulary and spelling only – not an official placement; listening, speaking and reading comprehension are not measured.",
      )}</p></div>`;
  }
  return { BANDS, evaluate, snapshot, panelHTML, isSecure };
})();
