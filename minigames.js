/* WORT-ABENTEUER – Mini-Spiele (Level-Belohnungen)
   ------------------------------------------------------------------
   Jedes Spiel ist ein Eintrag in der Registry:
     register({ id, icon, title, hint:[de,en], summary:n=>[de,en],
                start(stage, api) -> { stop(), score(), key?(event,key), keyup?(event,key) } })
   Neues Spiel hinzufügen = eine register()-Funktion am Ende dieser Datei ergänzen. Alles andere
   (Zeitlimit, Eltern-Einstellungen, Rotation der Belohnungen, Vorschau im Dashboard) passiert automatisch. */
const MiniGames = (function () {
  "use strict";
  const defs = {},
    order = [];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const num = (x) => Number(x || 0);
  const L = (pair) => tr(pair[0], pair[1]);
  let run = null; // laufendes Spiel

  function register(def) {
    defs[def.id] = def;
    order.push(def.id);
  }

  /* ---------- kleine DOM-Helfer ---------- */
  function h(tag, cls, html, onclick) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html !== undefined) el.innerHTML = html;
    if (onclick) el.addEventListener("click", onclick);
    return el;
  }
  // Halte-Taste (links/rechts): reagiert sofort beim Drücken und hört beim Loslassen auf.
  function holdButton(el, onDown, onUp) {
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      onDown();
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((t) => el.addEventListener(t, onUp));
  }

  /* ---------- Canvas-Bühne mit Spielschleife ---------- */
  function canvasStage(stage, w, hgt, opts) {
    const dpr = Math.min(2, (typeof devicePixelRatio === "number" && devicePixelRatio) || 1),
      canvas = document.createElement("canvas");
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(hgt * dpr);
    canvas.setAttribute("aria-label", opts.label || "");
    canvas.style.touchAction = "none";
    stage.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (ctx && ctx.scale) ctx.scale(dpr, dpr);
    const point = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / (r.width || w)) * w, y: ((e.clientY - r.top) / (r.height || hgt)) * hgt };
    };
    ["pointerdown", "pointermove", "pointerup", "pointercancel"].forEach((type) => {
      if (opts[type])
        canvas.addEventListener(type, (e) => {
          if (type === "pointerdown" && e.pointerId !== undefined && canvas.setPointerCapture) {
            try {
              canvas.setPointerCapture(e.pointerId);
            } catch (err) {}
          }
          opts[type](point(e), e);
        });
    });
    let raf = 0,
      last = 0,
      stopped = false;
    function frame(ts) {
      if (stopped) return;
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      if (opts.update) opts.update(dt);
      opts.draw(ctx, dt);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return {
      canvas,
      ctx,
      stop() {
        stopped = true;
        cancelAnimationFrame(raf);
      },
    };
  }
  const text = (ctx, str, x, y, size, color, align, weight) => {
    ctx.font = `${weight || "bold"} ${size}px system-ui, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = align || "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(str, x, y);
  };
  const emoji = (ctx, e, x, y, size) => {
    ctx.font = `${size}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";
    ctx.fillText(e, x, y);
  };
  const roundRect = (ctx, x, y, w, hgt, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + hgt, r);
    ctx.arcTo(x + w, y + hgt, x, y + hgt, r);
    ctx.arcTo(x, y + hgt, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  /* ---------- Eltern-Einstellungen für Belohnungen ---------- */
  function rewardSettings() {
    return Object.assign({ enabled: true, minutes: 2, dailyMax: 3 }, S.rewardSettings || {});
  }
  const todayKey = () => localDateKey(new Date());
  function playedToday() {
    const r = S.rewardsToday;
    return r && r.date === todayKey() ? num(r.count) : 0;
  }
  function rewardStatus() {
    const s = rewardSettings();
    if (!s.enabled) return "off";
    if (playedToday() >= s.dailyMax) return "cap";
    return "ok";
  }
  // Neue Belohnung in die Warteschlange legen (rotiert durch alle Spiele). Gibt die Spiel-ID zurück oder null.
  function grant(levelName) {
    if (!rewardSettings().enabled || !order.length) return null;
    const kind = order[num(S.rewardSeq) % order.length];
    S.rewardSeq = num(S.rewardSeq) + 1;
    S.levelRewards = Array.isArray(S.levelRewards) ? S.levelRewards : [];
    S.levelRewards.push({ kind, level: levelName, createdAt: Date.now() });
    return kind;
  }

  /* ---------- Spiel-Rahmen ---------- */
  const title = (kind) => (defs[kind] ? defs[kind].title : tr("Mini-Spiel", "Mini game"));
  const fmtClock = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  function start(kind, level, place, preview) {
    const def = defs[kind];
    if (!def) return;
    stop();
    const seconds = Math.round(rewardSettings().minutes * 60);
    run = {
      kind,
      level,
      preview: !!preview,
      seconds,
      elapsed: 0,
      lastTick: Date.now(),
      returnKind: preview ? "dashboard" : place,
      returnHTML: app.innerHTML,
      ctl: null,
      clock: null,
    };
    app.innerHTML = `<section class="mini-reward-page"><div class="top"><span class="pill">${preview ? "🔎 " + tr("Vorschau", "Preview") : "🎉 " + esc(level || "")}</span><span class="pill mini-clock" id="mini-clock" aria-live="off">${fmtClock(seconds)}</span><button class="filter-btn" onclick="leaveMiniReward()">⏸ ${tr("Zurück", "Back")}</button></div>
      <h1 class="mini-title">${def.icon} ${esc(def.title)}</h1>
      <p class="sub">${preview ? tr("Eltern-Vorschau · Spiel jederzeit beenden", "Parent preview · leave at any time") : tr("Deine Level-Belohnung · spiel einfach zum Spaß!", "Your level reward · just play for fun!")}</p>
      <div class="card mini-game-card"><div id="mini-stage" class="mini-stage"></div><p class="mini-game-hint">${esc(L(def.hint))}</p></div>
      <button class="filter-btn" onclick="leaveMiniReward()">${tr("Zurück", "Back")}</button></section>`;
    const api = { avatar: S.av || "🦊", tone, shuffle, h, holdButton, canvasStage, text, emoji, roundRect, clamp, rand, esc, PICTURES, tr };
    run.ctl = def.start(document.getElementById("mini-stage"), api);
    addEventListener("keydown", onKey);
    addEventListener("keyup", onKeyUp);
    run.clock = setInterval(tick, 250);
  }
  function stop() {
    if (!run) return;
    if (run.clock) clearInterval(run.clock);
    if (run.ctl && run.ctl.stop) run.ctl.stop();
    removeEventListener("keydown", onKey);
    removeEventListener("keyup", onKeyUp);
    run = null;
  }
  function onKey(e) {
    if (run && run.ctl && run.ctl.key) run.ctl.key(e, String(e.key).toLowerCase());
  }
  function onKeyUp(e) {
    if (run && run.ctl && run.ctl.keyup) run.ctl.keyup(e, String(e.key).toLowerCase());
  }
  function tick() {
    if (!run) return;
    const now = Date.now();
    if (document.visibilityState !== "hidden") run.elapsed += Math.min(1, (now - run.lastTick) / 1000);
    run.lastTick = now;
    const remaining = Math.max(0, run.seconds - Math.floor(run.elapsed)),
      clock = document.getElementById("mini-clock");
    if (clock) clock.textContent = fmtClock(remaining);
    if (remaining <= 0) finish();
  }

  /* ---------- Ende / Rückkehr ---------- */
  function restoreScreen() {
    const saved = run ? run.returnHTML : miniSaved.html,
      kind = run ? run.returnKind : miniSaved.kind;
    if ((kind === "result" || kind === "dashboard") && saved) app.innerHTML = saved;
    else home();
  }
  let miniSaved = { html: "", kind: "home" };
  function leave() {
    if (!run) return home();
    miniSaved = { html: run.returnHTML, kind: run.returnKind };
    stop();
    restoreScreen();
    miniSaved = { html: "", kind: "home" };
  }
  function finish() {
    if (!run) return;
    const kind = run.kind,
      preview = run.preview,
      def = defs[kind],
      score = run.ctl && run.ctl.score ? run.ctl.score() : 0;
    miniSaved = { html: run.returnHTML, kind: run.returnKind };
    stop();
    if (!preview) {
      if (S.levelRewards && S.levelRewards.length) S.levelRewards.shift();
      S.rewardsToday = { date: todayKey(), count: playedToday() + 1 };
      save();
      if (miniSaved.kind === "result" && miniSaved.html)
        miniSaved.html = miniSaved.html.replace(/<div class="level-reward-cta">[\s\S]*?<\/div>/, levelRewardResultHTML());
    }
    app.innerHTML = `<section class="mini-reward-page"><div class="card center mini-finished"><div class="chest">${def.icon}</div>
      <h1>${preview ? tr("Vorschau beendet", "Preview finished") : tr("Super gespielt!", "Well played!")}</h1>
      <p class="big">${preview ? tr("Das Spiel ist bereit für die Kinder.", "The game is ready for the children.") : tr(`Deine Spielzeit mit ${esc(def.title)} ist vorbei!`, `Your time with ${esc(def.title)} is over!`)}</p>
      <p>${esc(L(def.summary(score)))}</p><button class="btn go" onclick="returnFromMiniReward()">${preview ? tr("Zurück zum Dashboard", "Back to the dashboard") : tr("Weiter", "Continue") + " ➜"}</button></div></section>`;
  }
  function returnHome() {
    restoreScreen();
    miniSaved = { html: "", kind: "home" };
  }

  /* ---------- Belohnungs-Karten (Home / Ergebnis) ---------- */
  function levelRewardButtonHTML(place = "result") {
    const reward = (S.levelRewards || [])[0];
    if (!reward) return "";
    const status = rewardStatus();
    if (status === "off") return "";
    if (status === "cap")
      return `<div class="level-reward-cta"><h2>🎁 ${tr("Deine Belohnung wartet!", "Your reward is waiting!")}</h2><p>${tr("Für heute sind die Belohnungs-Spiele aufgebraucht – morgen darfst du wieder spielen.", "Today's reward games are used up – you can play again tomorrow.")}</p></div>`;
    const minutes = rewardSettings().minutes;
    return `<div class="level-reward-cta"><h2>🎁 ${tr("Deine Belohnung wartet!", "Your reward is waiting!")}</h2><p>${esc(reward.level)} ${tr("geschafft – jetzt", "done – now play")} ${minutes} ${tr("Minuten", "min of")} ${esc(title(reward.kind))} ${tr("spielen.", "")}</p><button class="btn go" onclick="startNextLevelReward('${place}')">🎮 ${tr("Jetzt spielen", "Play now")} · ${fmtClock(minutes * 60)}</button><button class="filter-btn" onclick="${place === "result" ? "deferLevelReward()" : "skipLevelReward()"}">${place === "result" ? tr("Zur Abenteuerkarte", "Back to the map") : tr("Belohnung überspringen", "Skip reward")}</button></div>`;
  }
  function startNextReward(place = "home") {
    const reward = (S.levelRewards || [])[0];
    if (!reward || rewardStatus() !== "ok") return;
    start(defs[reward.kind] ? reward.kind : order[0], reward.level, place, false);
  }
  function skipReward() {
    stop();
    if (S.levelRewards && S.levelRewards.length) S.levelRewards.shift();
    save();
    home();
  }
  function previewPanelHTML() {
    return `<section class="card mini-preview-panel"><h2>🎮 ${tr("Mini-Spiele ansehen", "Preview mini games")}</h2><p>${tr("Vorschau oder starte ein Spiel – das verbraucht keine Belohnung.", "Preview or start a game – this does not use up a reward.")}</p><div class="mini-preview-grid">${order
      .map((k) => `<button class="filter-btn" onclick="launchMiniGamePreview('${k}')">${defs[k].icon} ${esc(defs[k].title)}</button>`)
      .join("")}</div></section>`;
  }

  /* =========================================================================
     SPIELE
     ========================================================================= */

  /* ----- Flappy Bird (mit dem Avatar des Kindes) ----- */
  register({
    id: "flappy",
    icon: "🐦",
    title: "Flappy Bird",
    hint: ["Tippe oder drücke die Leertaste. Dein Tier fliegt langsam – halte es zwischen den weiten Lücken.", "Tap or press space. Your animal flies slowly – keep it inside the wide gaps."],
    summary: (n) => [`Du bist an ${n} Röhren vorbeigeflogen.`, `You flew past ${n} pipes.`],
    start(stage, api) {
      const W = 360,
        H = 500,
        ground = 466,
        birdX = 88,
        gap = 194;
      const st = { bird: { y: 245, vy: 0 }, pipes: [{ x: 390, gapY: 245 }], passed: 0 };
      const flap = () => (st.bird.vy = -228); // Pixel pro Sekunde – unabhängig von der Bildwiederholrate
      const cv = canvasStage(stage, W, H, {
        label: "Flappy Bird",
        pointerdown: flap,
        update(dt) {
          const b = st.bird;
          b.vy += 372 * dt;
          b.y += b.vy * dt;
          st.pipes.forEach((p) => (p.x -= 72 * dt));
          if (st.pipes[st.pipes.length - 1].x < 218) st.pipes.push({ x: 390, gapY: 148 + Math.random() * 204 });
          st.pipes = st.pipes.filter((p) => p.x > -70);
          let hit = b.y < 14 || b.y > ground - 15;
          st.pipes.forEach((p) => {
            if (p.x + 42 < birdX && !p.counted) {
              p.counted = true;
              st.passed++;
            }
            if (birdX + 18 > p.x && birdX - 17 < p.x + 42 && (b.y - 11 < p.gapY - gap / 2 || b.y + 11 > p.gapY + gap / 2)) {
              hit = true;
              p.x += 72; // sanft zurückschieben: ein neuer Versuch ohne Game-Over
            }
          });
          if (hit) {
            b.y = clamp(b.y, 32, ground - 32);
            b.vy = 0;
          }
        },
        draw(ctx) {
          const sky = ctx.createLinearGradient(0, 0, 0, H);
          sky.addColorStop(0, "#83d9ff");
          sky.addColorStop(1, "#f1fcff");
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(48, 70, 20, 0, 7);
          ctx.arc(76, 70, 28, 0, 7);
          ctx.arc(108, 70, 20, 0, 7);
          ctx.fill();
          st.pipes.forEach((p) => {
            ctx.fillStyle = "#6bc96d";
            ctx.fillRect(p.x, 0, 42, p.gapY - gap / 2);
            ctx.fillRect(p.x, p.gapY + gap / 2, 42, ground - p.gapY - gap / 2);
            ctx.fillStyle = "#42ae4c";
            ctx.fillRect(p.x - 5, p.gapY - gap / 2 - 13, 52, 13);
            ctx.fillRect(p.x - 5, p.gapY + gap / 2, 52, 13);
          });
          ctx.fillStyle = "#77d66c";
          ctx.fillRect(0, ground, W, H - ground);
          ctx.save();
          ctx.translate(birdX, st.bird.y);
          ctx.rotate(clamp(st.bird.vy / 700, -0.35, 0.5));
          emoji(ctx, api.avatar, 0, 0, 38);
          ctx.restore();
          text(ctx, `${api.tr("Durchflogene Röhren", "Pipes passed")}: ${st.passed}`, W / 2, ground + 27, 20, "#2b2d5b");
        },
      });
      stage.appendChild(api.h("button", "btn go flappy-tap", `${api.avatar} ${api.tr("Tippen zum Fliegen", "Tap to fly")}`, flap));
      return {
        stop: cv.stop,
        score: () => st.passed,
        key(e, k) {
          if (k === " " || k === "arrowup") {
            e.preventDefault();
            flap();
          }
        },
      };
    },
  });

  /* ----- Classic Snake (Canvas, Wischen + Steuerkreuz) ----- */
  register({
    id: "snake",
    icon: "🐍",
    title: "Classic Snake",
    hint: ["Wische über das Spielfeld, tippe die Richtungstasten oder nutze die Pfeiltasten. Sammle Äpfel!", "Swipe on the board, tap the direction buttons or use the arrow keys. Collect apples!"],
    summary: (n) => [`Du hast ${n} ${n === 1 ? "Apfel" : "Äpfel"} gesammelt.`, `You collected ${n} ${n === 1 ? "apple" : "apples"}.`],
    start(stage, api) {
      const N = 20,
        cell = 18,
        size = N * cell,
        dirs = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
      const startSnake = () => [10, 9, 8, 7].map((x) => ({ x, y: 10 }));
      const st = { snake: startSnake(), dir: dirs.right, next: dirs.right, food: { x: 15, y: 10 }, apples: 0, acc: 0, flash: 0 };
      const scoreEl = api.h("p", "snake-score", `🍎 ${api.tr("Äpfel gesammelt", "Apples collected")}: 0`);
      function setDir(name) {
        const d = dirs[name];
        if (d && !(d.x === -st.dir.x && d.y === -st.dir.y)) st.next = d; // keine direkte Umkehr in den eigenen Körper
      }
      function freeCell() {
        let f;
        do f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
        while (st.snake.some((p) => p.x === f.x && p.y === f.y));
        return f;
      }
      function step() {
        st.dir = st.next;
        const head = st.snake[0],
          nx = { x: (head.x + st.dir.x + N) % N, y: (head.y + st.dir.y + N) % N },
          ate = nx.x === st.food.x && nx.y === st.food.y;
        // Das Schwanzende wandert in diesem Schritt weg – es zählt nur dann als Hindernis, wenn die Schlange gerade wächst.
        const body = ate ? st.snake : st.snake.slice(0, -1);
        if (body.some((p) => p.x === nx.x && p.y === nx.y)) {
          st.snake = startSnake();
          st.dir = st.next = dirs.right;
          st.flash = 1.4;
          api.tone([330, 262]);
          return;
        }
        st.snake.unshift(nx);
        if (ate) {
          st.apples++;
          st.food = freeCell();
          scoreEl.textContent = `🍎 ${api.tr("Äpfel gesammelt", "Apples collected")}: ${st.apples}`;
          api.tone([660, 880]);
        } else st.snake.pop();
      }
      let swipe = null;
      const cv = canvasStage(stage, size, size, {
        label: "Snake",
        pointerdown: (p) => (swipe = p),
        pointerup(p) {
          if (!swipe) return;
          const dx = p.x - swipe.x,
            dy = p.y - swipe.y;
          swipe = null;
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
          setDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
        },
        update(dt) {
          st.acc += dt;
          if (st.flash > 0) st.flash -= dt;
          if (st.acc >= 0.16) {
            st.acc = 0;
            step();
          }
        },
        draw(ctx) {
          ctx.fillStyle = "#e9f5dc";
          ctx.fillRect(0, 0, size, size);
          for (let x = 0; x < N; x += 2) {
            ctx.fillStyle = "#e0efd1";
            ctx.fillRect(x * cell, 0, cell, size);
          }
          ctx.strokeStyle = "#c9e0b8";
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let p = 0; p <= size; p += cell) {
            ctx.moveTo(p, 0);
            ctx.lineTo(p, size);
            ctx.moveTo(0, p);
            ctx.lineTo(size, p);
          }
          ctx.stroke();
          emoji(ctx, "🍎", st.food.x * cell + cell / 2, st.food.y * cell + cell / 2, 16);
          for (let i = st.snake.length - 1; i >= 1; i--) {
            const p = st.snake[i];
            roundRect(ctx, p.x * cell + 1, p.y * cell + 1, cell - 2, cell - 2, 6);
            ctx.fillStyle = "#050505";
            ctx.fill();
            ctx.strokeStyle = "#3a3a3a";
            ctx.stroke();
          }
          const hd = st.snake[0],
            cx = hd.x * cell + cell / 2,
            cy = hd.y * cell + cell / 2;
          ctx.beginPath();
          ctx.arc(cx, cy, cell / 2 - 1, 0, Math.PI * 2);
          ctx.fillStyle = "#050505";
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#ffd84d";
          ctx.stroke();
          ctx.lineWidth = 1;
          const px = -st.dir.y,
            py = st.dir.x; // Querrichtung für die Augen
          [-1, 1].forEach((s) => {
            const ex = cx + st.dir.x * 3 + px * s * 3.5,
              ey = cy + st.dir.y * 3 + py * s * 3.5;
            ctx.beginPath();
            ctx.arc(ex, ey, 2.6, 0, Math.PI * 2);
            ctx.fillStyle = "#fff";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ex + st.dir.x, ey + st.dir.y, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = "#172a20";
            ctx.fill();
          });
          if (st.flash > 0) {
            ctx.globalAlpha = Math.min(1, st.flash);
            roundRect(ctx, 50, 150, 260, 60, 18);
            ctx.fillStyle = "#fff8d8";
            ctx.fill();
            text(ctx, api.tr("Hoppla! Weiter geht's 🐍", "Oops! Keep going 🐍"), 180, 188, 22, "#7a4b00");
            ctx.globalAlpha = 1;
          }
        },
      });
      stage.appendChild(scoreEl);
      const pad = api.h("div", "snake-pad");
      pad.setAttribute("aria-label", api.tr("Snake-Steuerung", "Snake controls"));
      [
        ["up", "▲", api.tr("Nach oben", "Up")],
        ["left", "◀", api.tr("Nach links", "Left")],
        ["right", "▶", api.tr("Nach rechts", "Right")],
        ["down", "▼", api.tr("Nach unten", "Down")],
      ].forEach(([d, label, aria]) => {
        const b = api.h("button", "pad-" + d, label, () => setDir(d));
        b.setAttribute("aria-label", aria);
        pad.appendChild(b);
      });
      pad.insertBefore(api.h("span", "pad-center", "🐍"), pad.children[2]);
      stage.appendChild(pad);
      const keyMap = { arrowup: "up", w: "up", arrowdown: "down", s: "down", arrowleft: "left", a: "left", arrowright: "right", d: "right" };
      return {
        stop: cv.stop,
        score: () => st.apples,
        key(e, k) {
          if (keyMap[k]) {
            e.preventDefault();
            setDir(keyMap[k]);
          }
        },
        _state: st,
      };
    },
  });

  /* ----- Balloon Pop ----- */
  register({
    id: "balloons",
    icon: "🎈",
    title: "Balloon Pop",
    hint: ["Tippe auf einen Ballon oder auf den großen Knopf. Ganz ohne Zeitdruck.", "Tap a balloon or the big button. No time pressure at all."],
    summary: (n) => [`Du hast ${n} Ballons geplatzt.`, `You popped ${n} balloons.`],
    start(stage, api) {
      const mk = (i) => ({ x: 38 + i * 47 + Math.random() * 18, y: 150 + Math.random() * 280, hue: Math.floor(Math.random() * 360), phase: Math.random() * 6 });
      const st = { balloons: Array.from({ length: 7 }, (_, i) => mk(i)), score: 0, bursts: [] };
      function pop(b) {
        st.bursts.push({ x: b.x, y: b.y, t: 0, hue: b.hue });
        b.y = 520 + Math.random() * 40;
        b.x = 25 + Math.random() * 310;
        b.hue = Math.random() * 360;
        st.score++;
        api.tone([520 + (st.score % 5) * 90]);
      }
      const cv = canvasStage(stage, 360, 500, {
        label: "Balloon Pop",
        pointerdown(p) {
          let best = null,
            dist = Infinity;
          st.balloons.forEach((b) => {
            const d = Math.hypot(b.x - p.x, b.y - p.y);
            if (d < dist) {
              best = b;
              dist = d;
            }
          });
          if (best && dist <= 52) pop(best);
        },
        update(dt) {
          st.balloons.forEach((b) => {
            b.y -= 20 * dt;
            b.phase += dt * 2;
            if (b.y < -50) {
              b.y = 520 + Math.random() * 100;
              b.x = 25 + Math.random() * 310;
              b.hue = Math.random() * 360;
            }
          });
          st.bursts.forEach((s) => (s.t += dt));
          st.bursts = st.bursts.filter((s) => s.t < 0.5);
        },
        draw(ctx) {
          const sky = ctx.createLinearGradient(0, 0, 0, 500);
          sky.addColorStop(0, "#b8eaff");
          sky.addColorStop(1, "#fff5d7");
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, 360, 500);
          st.balloons.forEach((b) => {
            const x = b.x + Math.sin(b.phase) * 8,
              y = b.y;
            ctx.strokeStyle = "#65758b";
            ctx.beginPath();
            ctx.moveTo(x, y + 24);
            ctx.quadraticCurveTo(x + 7, y + 38, x - 2, y + 52);
            ctx.stroke();
            ctx.fillStyle = `hsl(${b.hue} 78% 59%)`;
            ctx.beginPath();
            ctx.ellipse(x, y, 18, 24, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x - 4, y + 22);
            ctx.lineTo(x + 4, y + 22);
            ctx.lineTo(x, y + 30);
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.65)";
            ctx.beginPath();
            ctx.ellipse(x - 6, y - 7, 4, 7, -0.35, 0, Math.PI * 2);
            ctx.fill();
          });
          st.bursts.forEach((s) => {
            ctx.strokeStyle = `hsl(${s.hue} 80% 55%)`;
            ctx.lineWidth = 3;
            for (let i = 0; i < 8; i++) {
              const a = (i / 8) * Math.PI * 2,
                r1 = 10 + s.t * 60,
                r2 = r1 + 10;
              ctx.beginPath();
              ctx.moveTo(s.x + Math.cos(a) * r1, s.y + Math.sin(a) * r1);
              ctx.lineTo(s.x + Math.cos(a) * r2, s.y + Math.sin(a) * r2);
              ctx.stroke();
            }
          });
          text(ctx, `${api.tr("Ballons geplatzt", "Balloons popped")}: ${st.score}`, 180, 470, 23, "#343052");
        },
      });
      stage.appendChild(
        api.h("button", "btn go balloon-tap", `🎈 ${api.tr("Ballon antippen!", "Pop a balloon!")}`, () => {
          pop(st.balloons.reduce((a, b) => (a.y > b.y ? a : b)));
        }),
      );
      return { stop: cv.stop, score: () => st.score };
    },
  });

  /* ----- Star Catcher (Avatar fängt Sterne im Korb) ----- */
  register({
    id: "catch",
    icon: "⭐",
    title: "Star Catcher",
    hint: ["Halte die Pfeile gedrückt, tippe aufs Spielfeld oder nutze die Pfeiltasten und fange die Sterne.", "Hold the arrows, tap the board or use the arrow keys to catch the stars."],
    summary: (n) => [`Du hast ${n} Sterne gefangen.`, `You caught ${n} stars.`],
    start(stage, api) {
      const st = { x: 180, move: 0, stars: [], spawn: 0, score: 0 };
      const cv = canvasStage(stage, 360, 500, {
        label: "Star Catcher",
        pointerdown: (p) => (st.x = clamp(p.x, 38, 322)),
        pointermove: (p, e) => {
          if (e.buttons || e.pointerType === "touch") st.x = clamp(p.x, 38, 322);
        },
        update(dt) {
          st.x = clamp(st.x + st.move * 190 * dt, 38, 322);
          st.spawn += dt;
          if (st.spawn > 0.65) {
            st.spawn = 0;
            st.stars.push({ x: 18 + Math.random() * 324, y: -15, v: 55 + Math.random() * 35 });
          }
          st.stars.forEach((s) => (s.y += s.v * dt));
          st.stars = st.stars.filter((s) => {
            if (s.y > 405 && s.y < 452 && Math.abs(s.x - st.x) < 43) {
              st.score++;
              api.tone([784, 988]);
              return false;
            }
            return s.y < 520;
          });
        },
        draw(ctx) {
          ctx.fillStyle = "#20284f";
          ctx.fillRect(0, 0, 360, 500);
          for (let i = 0; i < 32; i++) {
            ctx.fillStyle = i % 3 ? "rgba(255,255,255,0.6)" : "#ffe47a";
            ctx.fillRect((i * 79) % 360, (i * 137) % 470, i % 4 === 0 ? 3 : 2, i % 4 === 0 ? 3 : 2);
          }
          st.stars.forEach((s) => emoji(ctx, "⭐", s.x, s.y, 26));
          emoji(ctx, api.avatar, st.x, 412, 34);
          ctx.fillStyle = "#68d9e8";
          ctx.beginPath();
          ctx.moveTo(st.x - 36, 434);
          ctx.lineTo(st.x - 28, 464);
          ctx.lineTo(st.x + 28, 464);
          ctx.lineTo(st.x + 36, 434);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#eaffff";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(st.x - 36, 434);
          ctx.lineTo(st.x + 36, 434);
          ctx.stroke();
          text(ctx, `${api.tr("Sterne gefangen", "Stars caught")}: ${st.score}`, 180, 48, 22, "#fff");
        },
      });
      const controls = api.h("div", "catch-controls");
      const left = api.h("button", "", "◀"),
        right = api.h("button", "", "▶");
      left.setAttribute("aria-label", api.tr("Nach links", "Left"));
      right.setAttribute("aria-label", api.tr("Nach rechts", "Right"));
      api.holdButton(left, () => (st.move = -1), () => st.move === -1 && (st.move = 0));
      api.holdButton(right, () => (st.move = 1), () => st.move === 1 && (st.move = 0));
      controls.append(left, right);
      stage.appendChild(controls);
      const map = { arrowleft: -1, a: -1, arrowright: 1, d: 1 };
      return {
        stop: cv.stop,
        score: () => st.score,
        key(e, k) {
          if (map[k]) {
            e.preventDefault();
            st.move = map[k];
          }
        },
        keyup(e, k) {
          if (map[k] && st.move === map[k]) st.move = 0;
        },
      };
    },
  });

  /* ----- Memory-Paare: Wort ↔ Bild ----- */
  register({
    id: "memory",
    icon: "🃏",
    title: "Memory",
    hint: ["Finde die Paare: Ein Wort gehört zu seinem Bild. Du hast alle Zeit der Welt.", "Find the pairs: each word belongs to its picture. Take all the time you need."],
    summary: (n) => [`Du hast ${n} Paare gefunden.`, `You found ${n} pairs.`],
    start(stage, api) {
      let cards = [],
        open = [],
        lock = false,
        pairs = 0,
        timers = [];
      const later = (fn, ms) => {
        const t = setTimeout(() => {
          timers = timers.filter((x) => x !== t);
          fn();
        }, ms);
        timers.push(t);
      };
      const bar = api.h("p", "mini-score", ""),
        grid = api.h("div", "memory-grid");
      stage.append(bar, grid);
      const setBar = (msg) => (bar.textContent = msg || `🃏 ${api.tr("Paare gefunden", "Pairs found")}: ${pairs}`);
      function deal() {
        const keys = api.shuffle(Object.keys(api.PICTURES).filter((k) => k.length <= 9)).slice(0, 6);
        cards = api.shuffle(keys.flatMap((k) => [{ k, type: "w" }, { k, type: "p" }]));
        open = [];
        lock = false;
        grid.innerHTML = "";
        cards.forEach((c, i) => {
          const b = api.h("button", "memory-card", `<span class="mc-back">${api.avatar}</span>`, () => flip(c));
          b.setAttribute("aria-label", api.tr("Karte", "Card") + " " + (i + 1));
          c.el = b;
          grid.appendChild(b);
        });
        setBar();
      }
      function face(c) {
        c.el.classList.add("open");
        c.el.innerHTML = c.type === "w" ? `<span class="mc-word">${api.esc(c.k)}</span>` : `<span class="mc-pic">${api.PICTURES[c.k]}</span>`;
        c.el.setAttribute("aria-label", c.type === "w" ? c.k : api.PICTURES[c.k]);
      }
      function back(c) {
        c.el.classList.remove("open");
        c.el.innerHTML = `<span class="mc-back">${api.avatar}</span>`;
      }
      function flip(c) {
        if (lock || c.done || open.includes(c)) return;
        face(c);
        api.tone([440]);
        open.push(c);
        if (open.length < 2) return;
        const [a, b] = open;
        if (a.k === b.k && a.type !== b.type) {
          a.done = b.done = true;
          a.el.classList.add("match");
          b.el.classList.add("match");
          pairs++;
          open = [];
          api.tone([523, 659, 784]);
          setBar();
          if (cards.every((x) => x.done)) {
            setBar(`🎉 ${api.tr("Alle Paare gefunden! Neue Karten kommen …", "All pairs found! New cards coming …")}`);
            lock = true;
            later(deal, 1600);
          }
        } else {
          lock = true;
          later(() => {
            back(a);
            back(b);
            open = [];
            lock = false;
          }, 950);
        }
      }
      deal();
      return {
        stop() {
          timers.forEach(clearTimeout);
          timers = [];
        },
        score: () => pairs,
      };
    },
  });

  /* ----- Simon-Melodie ----- */
  register({
    id: "simon",
    icon: "🎵",
    title: "Simon-Melodie",
    hint: ["Schau und hör genau hin, dann spiele die Melodie nach. Bei einem Fehler wird sie einfach noch einmal gezeigt.", "Watch and listen, then repeat the melody. After a mistake it is simply shown again."],
    summary: (n) => [`Deine längste Melodie hatte ${n} Töne.`, `Your longest melody had ${n} notes.`],
    start(stage, api) {
      const colors = ["#ff6b6b", "#4dabf7", "#51cf66", "#ffd43b"],
        freqs = [262, 330, 392, 523];
      let seq = [],
        idx = 0,
        mode = "wait",
        best = 0,
        timers = [];
      const later = (fn, ms) => {
        const t = setTimeout(() => {
          timers = timers.filter((x) => x !== t);
          fn();
        }, ms);
        timers.push(t);
      };
      const status = api.h("p", "mini-score", ""),
        grid = api.h("div", "simon-grid");
      stage.append(status, grid);
      const pads = colors.map((c, i) => {
        const b = api.h("button", "simon-pad", "", () => press(i));
        b.style.setProperty("--pad", c);
        b.setAttribute("aria-label", api.tr("Klangfeld", "Sound pad") + " " + (i + 1));
        grid.appendChild(b);
        return b;
      });
      const say = (m) => (status.textContent = m);
      function flash(i) {
        pads[i].classList.add("lit");
        api.tone([freqs[i]]);
        later(() => pads[i].classList.remove("lit"), 380);
      }
      function play() {
        mode = "show";
        say(api.tr("Schau und hör genau hin …", "Watch and listen …"));
        let i = 0;
        const next = () => {
          if (i >= seq.length) {
            mode = "input";
            idx = 0;
            say(api.tr("Du bist dran! 🎶", "Your turn! 🎶"));
            return;
          }
          flash(seq[i++]);
          later(next, 650);
        };
        later(next, 700);
      }
      function more() {
        seq.push(Math.floor(Math.random() * 4));
        play();
      }
      function press(i) {
        if (mode !== "input") return;
        flash(i);
        if (i === seq[idx]) {
          idx++;
          if (idx === seq.length) {
            best = Math.max(best, seq.length);
            mode = "wait";
            say(`🎉 ${api.tr("Super! Melodie mit", "Great! Melody with")} ${seq.length} ${api.tr("Tönen", "notes")}`);
            later(more, 1100);
          }
        } else {
          mode = "wait";
          say(api.tr("Fast! Wir hören sie noch einmal.", "Almost! Let's hear it once more."));
          later(() => api.tone([220, 196]), 250);
          later(play, 1300);
        }
      }
      later(more, 500);
      return {
        stop() {
          timers.forEach(clearTimeout);
          timers = [];
        },
        score: () => best,
      };
    },
  });

  /* ----- Maulwurf-Klopfen ----- */
  register({
    id: "whack",
    icon: "🔨",
    title: "Maulwurf-Klopfen",
    hint: ["Tippe auf die Maulwürfe, wenn sie aus ihren Löchern schauen.", "Tap the moles when they peek out of their holes."],
    summary: (n) => [`Du hast ${n} Maulwürfe erwischt.`, `You tapped ${n} moles.`],
    start(stage, api) {
      const xs = [70, 180, 290],
        ys = [165, 295, 425];
      const holes = [];
      ys.forEach((y) => xs.forEach((x) => holes.push({ x, y, h: 0, state: "idle", t: 0, hold: 1, hit: 0 })));
      const st = { score: 0, spawn: 0.5 };
      const cv = canvasStage(stage, 360, 500, {
        label: "Maulwurf-Klopfen",
        pointerdown(p) {
          holes.forEach((hl) => {
            if (hl.state !== "up" && hl.state !== "rising") return;
            if (Math.abs(p.x - hl.x) < 46 && p.y > hl.y - 90 && p.y < hl.y + 18) {
              hl.state = "hit";
              hl.t = 0;
              hl.hit = 0.45;
              st.score++;
              api.tone([660, 990]);
            }
          });
        },
        update(dt) {
          st.spawn -= dt;
          if (st.spawn <= 0) {
            const idle = holes.filter((hl) => hl.state === "idle");
            if (idle.length) {
              const hl = idle[Math.floor(Math.random() * idle.length)];
              hl.state = "rising";
              hl.t = 0;
              hl.hold = rand(1.1, 1.7);
            }
            st.spawn = rand(0.55, 1.0);
          }
          holes.forEach((hl) => {
            hl.t += dt;
            if (hl.state === "rising") {
              hl.h = Math.min(1, hl.t / 0.22);
              if (hl.h >= 1) {
                hl.state = "up";
                hl.t = 0;
              }
            } else if (hl.state === "up" && hl.t > hl.hold) {
              hl.state = "sinking";
              hl.t = 0;
            } else if (hl.state === "sinking" || hl.state === "hit") {
              hl.h = Math.max(0, hl.h - dt / 0.25);
              if (hl.h <= 0) {
                hl.state = "idle";
                hl.hit = 0;
              }
            }
          });
        },
        draw(ctx) {
          const g = ctx.createLinearGradient(0, 0, 0, 500);
          g.addColorStop(0, "#9be58a");
          g.addColorStop(1, "#5cbf5a");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, 360, 500);
          holes.forEach((hl) => {
            ctx.fillStyle = "#4a2f1a";
            ctx.beginPath();
            ctx.ellipse(hl.x, hl.y, 46, 17, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.save();
            ctx.beginPath();
            ctx.rect(hl.x - 60, hl.y - 120, 120, 120 + 1);
            ctx.clip();
            const top = hl.y + 30 - hl.h * 78; // Kopf-Oberkante
            ctx.fillStyle = "#7b5336";
            ctx.beginPath();
            ctx.ellipse(hl.x, top + 32, 30, 36, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#e9a7b0";
            ctx.beginPath();
            ctx.ellipse(hl.x, top + 24, 10, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#222";
            [-1, 1].forEach((s) => {
              ctx.beginPath();
              ctx.arc(hl.x + s * 13, top + 12, 3.2, 0, Math.PI * 2);
              ctx.fill();
            });
            ctx.restore();
            ctx.fillStyle = "#6a4326";
            ctx.beginPath();
            ctx.ellipse(hl.x, hl.y + 4, 48, 14, 0, 0, Math.PI);
            ctx.fill();
            if (hl.hit > 0) {
              hl.hit -= 0.016;
              emoji(ctx, "⭐", hl.x, hl.y - 70, 28);
            }
          });
          text(ctx, `${api.tr("Maulwürfe erwischt", "Moles tapped")}: ${st.score}`, 180, 44, 24, "#1f4d2a");
        },
      });
      return { stop: cv.stop, score: () => st.score };
    },
  });

  /* ----- Hüpf-Abenteuer (Doodle-Jump-Stil mit dem Avatar) ----- */
  register({
    id: "jump",
    icon: "☁️",
    title: "Hüpf-Abenteuer",
    hint: ["Dein Tier hüpft von selbst von Wolke zu Wolke. Steuere mit den Pfeilen, mit dem Finger oder den Pfeiltasten. Fällst du, hüpfst du einfach weiter.", "Your animal bounces from cloud to cloud by itself. Steer with the arrows, your finger or the arrow keys. If you fall, you just keep bouncing."],
    summary: (n) => [`Du bist ${n} Meter hoch gehüpft.`, `You bounced ${n} metres high.`],
    start(stage, api) {
      const W = 360,
        H = 500;
      const st = { p: { x: 180, y: 400, vy: -520 }, plats: [], height: 0, move: 0, target: null };
      for (let y = 470; y > -100; y -= 78) st.plats.push({ x: rand(0, W - 74), y, w: 74 });
      st.plats[0].x = 143;
      st.plats[0].y = 450;
      const cv = canvasStage(stage, W, H, {
        label: "Hüpf-Abenteuer",
        pointerdown: (p) => (st.target = p.x),
        pointermove: (p, e) => {
          if (e.buttons || e.pointerType === "touch") st.target = p.x;
        },
        pointerup: () => (st.target = null),
        update(dt) {
          const p = st.p;
          if (st.target !== null) p.x += clamp(st.target - p.x, -260 * dt, 260 * dt);
          else p.x += st.move * 220 * dt;
          if (p.x < -10) p.x = W + 10;
          if (p.x > W + 10) p.x = -10;
          const prevY = p.y;
          p.vy += 900 * dt;
          p.y += p.vy * dt;
          if (p.vy > 0)
            st.plats.forEach((pl) => {
              if (prevY + 16 <= pl.y && p.y + 16 >= pl.y && p.x > pl.x - 8 && p.x < pl.x + pl.w + 8) {
                p.vy = -520;
                api.tone([392]);
              }
            });
          if (p.y < 230) {
            const d = 230 - p.y;
            p.y = 230;
            st.height += d;
            st.plats.forEach((pl) => (pl.y += d));
          }
          st.plats = st.plats.filter((pl) => pl.y < H + 20);
          while (Math.min(...st.plats.map((pl) => pl.y)) > -20) st.plats.push({ x: rand(0, W - 74), y: Math.min(...st.plats.map((pl) => pl.y)) - rand(62, 92), w: 74 });
          if (p.y > H + 40) {
            // Sanft wieder aufsetzen statt Game-Over
            const pl = st.plats.filter((q) => q.y > 200 && q.y < 440).sort((a, b) => b.y - a.y)[0] || st.plats[0];
            p.x = pl.x + pl.w / 2;
            p.y = pl.y - 20;
            p.vy = -520;
          }
        },
        draw(ctx) {
          const g = ctx.createLinearGradient(0, 0, 0, H);
          g.addColorStop(0, "#74c7ff");
          g.addColorStop(1, "#e6f8ff");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
          st.plats.forEach((pl) => {
            ctx.fillStyle = "#fff";
            roundRect(ctx, pl.x, pl.y - 2, pl.w, 16, 8);
            ctx.fill();
            ctx.fillStyle = "#e4f1fb";
            roundRect(ctx, pl.x + 6, pl.y + 8, pl.w - 12, 8, 4);
            ctx.fill();
          });
          emoji(ctx, api.avatar, st.p.x, st.p.y - 4, 34);
          text(ctx, `${api.tr("Höhe", "Height")}: ${Math.floor(st.height / 10)} m`, 180, 36, 22, "#1e3a5f");
        },
      });
      const controls = api.h("div", "catch-controls");
      const left = api.h("button", "", "◀"),
        right = api.h("button", "", "▶");
      left.setAttribute("aria-label", api.tr("Nach links", "Left"));
      right.setAttribute("aria-label", api.tr("Nach rechts", "Right"));
      api.holdButton(left, () => ((st.target = null), (st.move = -1)), () => st.move === -1 && (st.move = 0));
      api.holdButton(right, () => ((st.target = null), (st.move = 1)), () => st.move === 1 && (st.move = 0));
      controls.append(left, right);
      stage.appendChild(controls);
      const map = { arrowleft: -1, a: -1, arrowright: 1, d: 1 };
      return {
        stop: cv.stop,
        score: () => Math.floor(st.height / 10),
        _state: st,
        key(e, k) {
          if (map[k]) {
            e.preventDefault();
            st.target = null;
            st.move = map[k];
          }
        },
        keyup(e, k) {
          if (map[k] && st.move === map[k]) st.move = 0;
        },
      };
    },
  });

  /* ----- Ziegel-Ball (Breakout) ----- */
  register({
    id: "breakout",
    icon: "🧱",
    title: "Ziegel-Ball",
    hint: ["Schiebe den Schläger mit dem Finger, den Pfeilen oder den Pfeiltasten und lass den Ball die Ziegel treffen. Fällt der Ball, kommt gleich ein neuer.", "Move the paddle with your finger, the arrows or the arrow keys and let the ball hit the bricks. If the ball falls, a new one comes right away."],
    summary: (n) => [`Du hast ${n} Ziegel getroffen.`, `You hit ${n} bricks.`],
    start(stage, api) {
      const W = 360,
        H = 500,
        cols = 8,
        rows = 5,
        bw = 40,
        bh = 18,
        padY = 470,
        pw = 84,
        r = 7;
      const colors = ["#ff6b6b", "#ffa94d", "#ffd43b", "#69db7c", "#4dabf7"];
      const st = { px: 180, move: 0, bricks: [], ball: { x: 180, y: padY - 12, vx: 0, vy: 0, stuck: true, wait: 0.8 }, score: 0, speed: 250 };
      function fill() {
        st.bricks = [];
        for (let rr = 0; rr < rows; rr++) for (let c = 0; c < cols; c++) st.bricks.push({ x: 8 + c * (bw + 2), y: 70 + rr * (bh + 2), c: colors[rr] });
      }
      fill();
      function serve() {
        const a = rand(-0.5, 0.5);
        st.ball.vx = Math.sin(a) * st.speed;
        st.ball.vy = -Math.cos(a) * st.speed;
        st.ball.stuck = false;
      }
      const cv = canvasStage(stage, W, H, {
        label: "Ziegel-Ball",
        pointerdown: (p) => (st.px = clamp(p.x, pw / 2, W - pw / 2)),
        pointermove: (p, e) => {
          if (e.buttons || e.pointerType === "touch" || e.pointerType === "mouse") st.px = clamp(p.x, pw / 2, W - pw / 2);
        },
        update(dt) {
          st.px = clamp(st.px + st.move * 260 * dt, pw / 2, W - pw / 2);
          const b = st.ball;
          if (b.stuck) {
            b.x = st.px;
            b.y = padY - 12;
            b.wait -= dt;
            if (b.wait <= 0) serve();
            return;
          }
          for (let s = 0; s < 2; s++) {
            b.x += (b.vx * dt) / 2;
            b.y += (b.vy * dt) / 2;
            if (b.x < r) ((b.x = r), (b.vx = Math.abs(b.vx)));
            if (b.x > W - r) ((b.x = W - r), (b.vx = -Math.abs(b.vx)));
            if (b.y < r) ((b.y = r), (b.vy = Math.abs(b.vy)));
            if (b.vy > 0 && b.y + r >= padY && b.y + r <= padY + 16 && Math.abs(b.x - st.px) <= pw / 2 + r) {
              // Abprallwinkel hängt von der Trefferstelle ab; ein kleiner Zufall verhindert endloses Hoch-und-runter in einer Spalte.
              const off = clamp((b.x - st.px) / (pw / 2), -1, 1),
                a = clamp(off * 1.0 + rand(-0.22, 0.22), -1.1, 1.1);
              b.vx = Math.sin(a) * st.speed;
              b.vy = -Math.cos(a) * st.speed;
              b.y = padY - r;
              api.tone([330]);
            }
            for (const br of st.bricks) {
              if (b.x + r > br.x && b.x - r < br.x + bw && b.y + r > br.y && b.y - r < br.y + bh) {
                const ox = Math.min(b.x + r - br.x, br.x + bw - (b.x - r)),
                  oy = Math.min(b.y + r - br.y, br.y + bh - (b.y - r));
                if (ox < oy) b.vx = -b.vx;
                else b.vy = -b.vy;
                st.bricks.splice(st.bricks.indexOf(br), 1);
                st.score++;
                api.tone([520 + (st.score % 6) * 70]);
                break;
              }
            }
          }
          if (!st.bricks.length) {
            st.speed = Math.min(330, st.speed + 15);
            fill();
            b.stuck = true;
            b.wait = 1;
          }
          if (b.y > H + 20) {
            b.stuck = true;
            b.wait = 0.8;
          }
        },
        draw(ctx) {
          const g = ctx.createLinearGradient(0, 0, 0, H);
          g.addColorStop(0, "#2d2a63");
          g.addColorStop(1, "#4b3f8f");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
          st.bricks.forEach((br) => {
            ctx.fillStyle = br.c;
            roundRect(ctx, br.x, br.y, bw, bh, 4);
            ctx.fill();
          });
          ctx.fillStyle = "#e8f6ff";
          roundRect(ctx, st.px - pw / 2, padY, pw, 12, 6);
          ctx.fill();
          emoji(ctx, api.avatar, st.px, padY - 16, 22);
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(st.ball.x, st.ball.y, r, 0, Math.PI * 2);
          ctx.fill();
          text(ctx, `${api.tr("Ziegel getroffen", "Bricks hit")}: ${st.score}`, 180, 40, 22, "#fff");
        },
      });
      const controls = api.h("div", "catch-controls");
      const left = api.h("button", "", "◀"),
        right = api.h("button", "", "▶");
      left.setAttribute("aria-label", api.tr("Nach links", "Left"));
      right.setAttribute("aria-label", api.tr("Nach rechts", "Right"));
      api.holdButton(left, () => (st.move = -1), () => st.move === -1 && (st.move = 0));
      api.holdButton(right, () => (st.move = 1), () => st.move === 1 && (st.move = 0));
      controls.append(left, right);
      stage.appendChild(controls);
      const map = { arrowleft: -1, a: -1, arrowright: 1, d: 1 };
      return {
        stop: cv.stop,
        score: () => st.score,
        _state: st,
        key(e, k) {
          if (map[k]) {
            e.preventDefault();
            st.move = map[k];
          }
        },
        keyup(e, k) {
          if (map[k] && st.move === map[k]) st.move = 0;
        },
      };
    },
  });

  /* ----- Schiebepuzzle (3×3, ruhig, ohne Zeitdruck) ----- */
  register({
    id: "slide",
    icon: "🧩",
    title: "Schiebepuzzle",
    hint: ["Tippe ein Teil neben der Lücke an, um es zu verschieben. Setze das Tierbild wieder zusammen.", "Tap a tile next to the gap to slide it. Put the animal picture back together."],
    summary: (n) => [`Du hast ${n} Puzzle gelöst.`, `You solved ${n} puzzles.`],
    start(stage, api) {
      const animals = ["🐶", "🐱", "🐭", "🐻", "🦊", "🦁", "🐯", "🐵", "🐼", "🐰", "🦄", "🐸", "🐧", "🐷"];
      let solved = 0,
        order = [],
        picture = null,
        timers = [],
        animalIdx = Math.floor(Math.random() * animals.length),
        done = false;
      const bar = api.h("p", "mini-score", ""),
        grid = api.h("div", "slide-grid");
      stage.append(bar, grid);
      const setBar = (m) => (bar.textContent = m || `🧩 ${api.tr("Gelöst", "Solved")}: ${solved}`);
      function makePicture() {
        const c = document.createElement("canvas");
        c.width = c.height = 300;
        const x = c.getContext("2d");
        if (!x) return null;
        const g = x.createLinearGradient(0, 0, 300, 300);
        g.addColorStop(0, "#ffe9a8");
        g.addColorStop(1, "#bfe8ff");
        x.fillStyle = g;
        x.fillRect(0, 0, 300, 300);
        // Heller Kreis als Hintergrund und eine feste Textfarbe: Auf Geräten, die den Emoji nur einfarbig zeichnen,
        // wurde er sonst im Farbverlauf der Hintergrundfarbe gezeichnet und war unsichtbar.
        x.fillStyle = "rgba(255,255,255,0.65)";
        x.beginPath();
        x.arc(150, 150, 128, 0, Math.PI * 2);
        x.fill();
        x.font = '200px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui, sans-serif';
        x.textAlign = "center";
        x.textBaseline = "middle";
        x.fillStyle = "#3a2f2a";
        x.fillText(animals[animalIdx], 150, 158);
        return c;
      }
      function shuffleBoard() {
        order = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 8 = Lücke
        let gap = 8,
          prev = -1;
        for (let i = 0; i < 70; i++) {
          const nb = neighbours(gap).filter((n) => n !== prev),
            pick = nb[Math.floor(Math.random() * nb.length)];
          [order[gap], order[pick]] = [order[pick], order[gap]];
          prev = gap;
          gap = pick;
        }
        if (order.every((v, i) => v === i)) return shuffleBoard();
      }
      function neighbours(i) {
        const r = Math.floor(i / 3),
          c = i % 3,
          out = [];
        if (r > 0) out.push(i - 3);
        if (r < 2) out.push(i + 3);
        if (c > 0) out.push(i - 1);
        if (c < 2) out.push(i + 1);
        return out;
      }
      function render() {
        grid.innerHTML = "";
        order.forEach((piece, i) => {
          const b = api.h("button", "slide-tile" + (piece === 8 && !done ? " gap" : ""));
          b.dataset.piece = piece; // 0–7 = Teile, 8 = Lücke (auch für Tests und Hilfsprogramme nützlich)
          if (piece !== 8 || done) {
            const t = document.createElement("canvas");
            t.width = t.height = 100;
            const x = t.getContext("2d");
            if (x && picture) x.drawImage(picture, (piece % 3) * 100, Math.floor(piece / 3) * 100, 100, 100, 0, 0, 100, 100);
            b.appendChild(t);
            b.setAttribute("aria-label", api.tr("Puzzleteil", "Puzzle tile") + " " + (piece + 1));
          } else b.setAttribute("aria-label", api.tr("Lücke", "Gap"));
          b.addEventListener("click", () => move(i));
          grid.appendChild(b);
        });
      }
      function move(i) {
        if (done) return;
        const gap = order.indexOf(8);
        if (!neighbours(i).includes(gap)) return;
        [order[i], order[gap]] = [order[gap], order[i]];
        api.tone([300 + i * 25]);
        render();
        if (order.every((v, k) => v === k)) {
          done = true;
          solved++;
          api.tone([523, 659, 784, 1047]);
          setBar(`🎉 ${api.tr("Geschafft! Das nächste Bild kommt …", "Done! Next picture coming …")}`);
          render();
          const t = setTimeout(newPuzzle, 1800);
          timers.push(t);
        }
      }
      function newPuzzle() {
        done = false;
        animalIdx = (animalIdx + 1 + Math.floor(Math.random() * 3)) % animals.length;
        picture = makePicture();
        shuffleBoard();
        render();
        setBar();
      }
      newPuzzle();
      return {
        stop() {
          timers.forEach(clearTimeout);
          timers = [];
        },
        score: () => solved,
      };
    },
  });

  /* ---------- öffentliche Schnittstelle ---------- */
  return {
    order,
    defs,
    register,
    start,
    stop,
    leave,
    finish,
    returnHome,
    grant,
    title,
    rewardSettings,
    rewardStatus,
    playedToday,
    levelRewardButtonHTML,
    startNextReward,
    skipReward,
    previewPanelHTML,
    current: () => run,
  };
})();

/* ---- globale Funktionen für onclick-Handler und app.js ---- */
function miniRewardTitle(kind) {
  return MiniGames.title(kind);
}
function levelRewardButtonHTML(place) {
  return MiniGames.levelRewardButtonHTML(place);
}
function levelRewardResultHTML() {
  return MiniGames.levelRewardButtonHTML("result");
}
function levelRewardHomeHTML() {
  return MiniGames.levelRewardButtonHTML("home");
}
function startNextLevelReward(place) {
  MiniGames.startNextReward(place);
}
function skipLevelReward() {
  MiniGames.skipReward();
}
function deferLevelReward() {
  MiniGames.stop();
  home();
}
function leaveMiniReward() {
  MiniGames.leave();
}
function stopMiniGameLoop() {
  MiniGames.stop();
}
function finishLevelReward() {
  MiniGames.finish();
}
function returnFromMiniReward() {
  MiniGames.returnHome();
}
function launchMiniGamePreview(kind) {
  if (!parentUnlocked) {
    alert(tr("Bitte zuerst das Eltern-Dashboard öffnen.", "Please open the parent dashboard first."));
    return;
  }
  if (MiniGames.defs[kind]) MiniGames.start(kind, "Eltern-Vorschau", "dashboard", true);
}
function miniGamePreviewPanel() {
  return MiniGames.previewPanelHTML();
}
