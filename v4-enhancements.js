/* V4.2 refinements: game rewards, parent preview, audio control and article practice. */
(function () {
  const baseQuestion = window.question;
  const baseCheck = window.check;
  const baseDashboard = window.dashboard;
  const baseRevealAnswer = window.revealAnswer;
  const articleChoices = ["der", "die", "das"];
  const rewardKinds = ["flappy", "snake", "balloons", "catch"];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const articleOf = word => {
    const escaped = word.w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = word.s.match(new RegExp("(?:^|[.!?]\\s+)(der|die|das)\\s+" + escaped + "(?![A-Za-zÄÖÜäöüß])", "i"));
    return match ? match[1].toLocaleLowerCase("de") : null;
  };

  GAME_MODES.push({ id: "article", icon: "📘", name: "Artikel-Detektiv", desc: "Finde den passenden Artikel: der, die oder das.", difficulty: "Wort-Artikel" });
  window.modeAll = function (mode) {
    const all = [...new Map(LEVELS.flatMap(level => level.words).map(word => [word.w, word])).values()];
    if (mode === "article") return all.map(word => ({ ...word, article: articleOf(word) })).filter(word => word.article);
    if (mode === "picture") return all.filter(word => pictureFor(word));
    if (mode === "sentence") return all.filter(word => word.s && word.s.split(/\s+/).length >= 4 && blankSentence(word, "_", true) !== null);
    return all;
  };
  window.question = function () {
    if (!G || G.mode !== "article") return baseQuestion();
    G.att = 0; G.hinted = false; G.revealed = false; G.lock = false; G.articleSelection = "";
    const word = G.q[G.i];
    app.innerHTML = `<div class="top"><button class="ghost" onclick="askSaveBeforeLeave()" aria-label="Spiel verlassen">🏠</button><b style="font-size:20px">${G.i + 1} von ${G.q.length}</b><span class="pill">🪙 ${S.pts + G.pts}</span></div><div class="bar"><i style="width:${G.i / G.q.length * 100}%"></i></div><div class="card center game-card article-card"><div class="game-mode-label">📘 Artikel-Detektiv · ${DIFFICULTIES[G.difficulty] || ""}</div><p class="big">Welcher Artikel passt?</p><div class="article-word">${esc(word.w)}</div><p class="clue-caption">${esc(word.cat)}</p><div class="article-options" role="group" aria-label="Artikel auswählen">${articleChoices.map(article => `<button type="button" class="article-choice" id="article-${article}" onclick="selectArticle('${article}')">${article[0].toLocaleUpperCase("de") + article.slice(1)}</button>`).join("")}</div><input id="in" class="article-sync" autocomplete="off" tabindex="-1" aria-hidden="true"><button id="chk" class="btn go" onclick="check()">✅ Das ist meine Antwort!</button><div id="fb" aria-live="polite"></div></div>`;
  };
  window.selectArticle = function (article) {
    if (!G || G.lock || !articleChoices.includes(article)) return;
    G.articleSelection = article;
    articleChoices.forEach(choice => { const button = $("#article-" + choice); if (button) button.classList.toggle("selected", choice === article); });
  };
  window.check = function () {
    if (!G || G.mode !== "article") return baseCheck();
    if (!G.articleSelection || G.lock) return;
    const input = $("#in"), selectedCorrectly = G.articleSelection === G.q[G.i].article;
    if (input) input.value = selectedCorrectly ? G.q[G.i].w : "falscher Artikel";
    const savedDifficulty = G.difficulty;
    G.difficulty = "medium";
    baseCheck();
    G.difficulty = savedDifficulty;
    if (input) input.blur();
    const feedback = $("#fb");
    if (!feedback) return;
    if (selectedCorrectly) {
      const sentence = feedback.querySelector(".sent");
      if (sentence) sentence.innerHTML = `Artikel richtig: <b>${G.q[G.i].article[0].toLocaleUpperCase("de") + G.q[G.i].article.slice(1)} ${esc(G.q[G.i].w)}</b><br>${esc(G.q[G.i].s)}`;
    } else {
      const tip = feedback.querySelector(".spelling-tip");
      if (tip) tip.textContent = "💡 Lies das Wort noch einmal und probiere einen anderen Artikel.";
      const offer = feedback.querySelector(".answer-offer");
      if (offer) offer.textContent = "Schon drei Versuche! Möchtest du den passenden Artikel sehen?";
    }
  };
  window.revealAnswer = function () {
    if (!G || G.mode !== "article") return baseRevealAnswer();
    const word = G.q[G.i]; G.revealed = true; lockQ();
    const feedback = $("#fb");
    if (feedback) feedback.innerHTML = `<div class="try answer-revealed"><h2>Der richtige Artikel ist:</h2><p class="word">${word.article[0].toLocaleUpperCase("de") + word.article.slice(1)} ${hl(word.w)}</p><p class="sent">${esc(word.s)}</p><button class="btn go next-btn" onclick="nextQ()">Weiter ➜</button></div>`;
  };

  window.miniRewardTitle = function (kind) {
    return ({ flappy: "Flappy Bird", snake: "Classic Snake", balloons: "Balloon Pop", catch: "Star Catcher" })[kind] || "Mini-Spiel";
  };
  function newMiniState(kind, level, preview) {
    return {
      kind, level, preview: !!preview, remaining: 120, startedAt: Date.now(),
      bird: { y: 245, vy: 0, wing: 0, safe: 0 }, pipes: [{ x: 390, gapY: 245 }], passed: 0,
      snake: [{ x: 7, y: 10 }, { x: 6, y: 10 }, { x: 5, y: 10 }, { x: 4, y: 10 }], direction: { x: 1, y: 0 }, nextDirection: { x: 1, y: 0 }, food: { x: 15, y: 10 }, apples: 0, stepElapsed: 0,
      balloons: Array.from({ length: 7 }, (_, i) => ({ x: 38 + i * 47 + Math.random() * 18, y: 150 + Math.random() * 280, hue: Math.floor(Math.random() * 360), phase: Math.random() * 6 })), balloonScore: 0,
      catcher: { x: 180, move: 0 }, fallingStars: [], starScore: 0, starSpawn: 0
    };
  }
  window.resetMiniSnake = function () {
    if (!miniGameState) return;
    miniGameState.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
    miniGameState.direction = { x: 1, y: 0 };
    miniGameState.nextDirection = { x: 1, y: 0 };
    miniGameState.stepElapsed = 0;
  };
  function runMiniGame(kind, level, place, preview) {
    stopMiniGameLoop();
    miniReturnKind = preview ? "dashboard" : place;
    miniReturnHTML = app.innerHTML;
    miniGameState = newMiniState(kind, level, preview);
    renderMiniRewardGame();
    addEventListener("keydown", handleMiniGameKey);
    miniClock = setInterval(updateMiniGameClock, 250);
    miniLastFrame = 0;
    miniAnimation = requestAnimationFrame(window.drawMiniRewardFrame);
  }
  window.startNextLevelReward = function (place = "home") {
    const reward = (S.levelRewards || [])[0];
    if (reward) runMiniGame(reward.kind, reward.level, place, false);
  };
  window.renderMiniRewardGame = function () {
    const state = miniGameState, kind = state.kind, snake = kind === "snake", flappy = kind === "flappy", balloons = kind === "balloons", catchStars = kind === "catch";
    let controls = "", hint = "";
    if (snake) {
      controls = `<div class="snake-pad" aria-label="Snake-Steuerung"><button class="pad-up" aria-label="Nach oben" onclick="miniGameDirection('up')">▲</button><button class="pad-left" aria-label="Nach links" onclick="miniGameDirection('left')">◀</button><span class="pad-center">🐍</span><button class="pad-right" aria-label="Nach rechts" onclick="miniGameDirection('right')">▶</button><button class="pad-down" aria-label="Nach unten" onclick="miniGameDirection('down')">▼</button></div>`;
      hint = "Tippe die Richtungstasten oder nutze die Pfeiltasten. Sammle Äpfel.";
    } else if (flappy) {
      controls = `<button class="btn go flappy-tap" onclick="miniFlap()">🐦 Tippen zum Fliegen</button>`;
      hint = "Der Vogel fliegt langsam. Tippe leicht, um ihn zwischen den weiten Lücken zu halten.";
    } else if (balloons) {
      controls = `<button class="btn go balloon-tap" onclick="miniBalloonTap()">🎈 Ballon antippen!</button>`;
      hint = "Tippe auf einen Ballon oder auf den großen Knopf. Ganz ohne Zeitdruck.";
    } else if (catchStars) {
      controls = `<div class="catch-controls"><button aria-label="Nach links" onclick="miniGameDirection('left')">◀</button><button aria-label="Nach rechts" onclick="miniGameDirection('right')">▶</button></div>`;
      hint = "Bewege den Korb nach links und rechts und fange die Sterne.";
    }
    const title = miniRewardTitle(kind);
    app.innerHTML = `<section class="mini-reward-page"><div class="top"><span class="pill">${state.preview ? "🔎 Vorschau" : `🎉 ${esc(state.level)}`}</span><span class="pill mini-clock" id="mini-clock">02:00</span><button class="filter-btn" onclick="leaveMiniReward()">⏸ Zurück</button></div><h1 class="mini-title">${kind === "flappy" ? "🐦" : kind === "snake" ? "🐍" : kind === "balloons" ? "🎈" : "⭐"} ${title}</h1><p class="sub">${state.preview ? "Eltern-Vorschau · Spiel jederzeit beenden" : "Deine Level-Belohnung · Noch zwei Minuten zum Spielen!"}</p><div class="card mini-game-card">${snake ? `<div id="snake-board" class="snake-board" role="img" aria-label="Snake Spielfeld"></div><p id="snake-score" class="snake-score">🍎 Äpfel gesammelt: 0</p>` : `<canvas id="mini-game-canvas" width="360" height="500" aria-label="${title} Spielfeld"></canvas>`}${controls}<p class="mini-game-hint">${hint}</p></div><button class="filter-btn" onclick="leaveMiniReward()">${tr("Zurück", "Back")}</button></section>`;
    if (snake) { renderSnakeBoard(state); return; }
    const canvas = $("#mini-game-canvas");
    if (!canvas) return;
    if (kind === "flappy") canvas.addEventListener("pointerdown", miniFlap);
    if (kind === "balloons") canvas.addEventListener("pointerdown", miniBalloonTap);
    if (kind === "catch") canvas.addEventListener("pointerdown", event => {
      const rect = canvas.getBoundingClientRect();
      miniGameState.catcher.x = clamp((event.clientX - rect.left) / rect.width * canvas.width, 38, 322);
    });
  };
  window.miniFlap = function () { if (miniGameState?.kind === "flappy") miniGameState.bird.vy = -3.8; };
  window.miniGameDirection = function (direction) {
    if (!miniGameState) return;
    if (miniGameState.kind === "snake") {
      const dirs = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }, next = dirs[direction], current = miniGameState.direction;
      if (next && !(next.x === -current.x && next.y === -current.y)) miniGameState.nextDirection = next;
    } else if (miniGameState.kind === "catch") {
      const shift = direction === "left" ? -46 : direction === "right" ? 46 : 0;
      miniGameState.catcher.x = clamp(miniGameState.catcher.x + shift, 38, 322);
    }
  };
  window.miniBalloonTap = function (event) {
    if (miniGameState?.kind !== "balloons") return;
    const canvas = $("#mini-game-canvas");
    if (event && canvas) {
      const rect = canvas.getBoundingClientRect(), x = (event.clientX - rect.left) / rect.width * canvas.width, y = (event.clientY - rect.top) / rect.height * canvas.height;
      let nearest = -1, distance = Infinity;
      miniGameState.balloons.forEach((balloon, i) => { const d = Math.hypot(balloon.x - x, balloon.y - y); if (d < distance) { nearest = i; distance = d; } });
      if (distance > 52) return;
      const balloon = miniGameState.balloons[nearest]; balloon.y = 520; balloon.x = 25 + Math.random() * 310; balloon.hue = Math.random() * 360;
    } else {
      const balloon = miniGameState.balloons.reduce((a, b) => a.y > b.y ? a : b);
      balloon.y = 520; balloon.x = 25 + Math.random() * 310; balloon.hue = Math.random() * 360;
    }
    miniGameState.balloonScore++;
  };
  window.handleMiniGameKey = function (event) {
    if (!miniGameState) return;
    const key = event.key.toLowerCase();
    if (miniGameState.kind === "flappy" && (key === " " || key === "arrowup")) { event.preventDefault(); miniFlap(); }
    else if (miniGameState.kind === "snake") {
      const dirs = { arrowup: "up", w: "up", arrowdown: "down", s: "down", arrowleft: "left", a: "left", arrowright: "right", d: "right" };
      if (dirs[key]) { event.preventDefault(); miniGameDirection(dirs[key]); }
    } else if (miniGameState.kind === "catch") {
      const dirs = { arrowleft: "left", a: "left", arrowright: "right", d: "right" };
      if (dirs[key]) { event.preventDefault(); miniGameDirection(dirs[key]); }
    }
  };
  window.drawMiniRewardFrame = function (timestamp) {
    if (!miniGameState) return;
    if (miniGameState.kind === "snake") {
      const dt = miniLastFrame ? Math.min(.05, (timestamp - miniLastFrame) / 1000) : 0;
      miniLastFrame = timestamp;
      if (advanceSnake(miniGameState, dt)) renderSnakeBoard(miniGameState);
      miniAnimation = requestAnimationFrame(window.drawMiniRewardFrame);
      return;
    }
    const canvas = $("#mini-game-canvas"), ctx = canvas?.getContext?.("2d");
    if (!ctx) { miniAnimation = requestAnimationFrame(window.drawMiniRewardFrame); return; }
    const dt = miniLastFrame ? Math.min(.05, (timestamp - miniLastFrame) / 1000) : 0;
    miniLastFrame = timestamp;
    if (miniGameState.kind === "flappy") drawFlappyEasy(ctx, miniGameState, dt);
    else if (miniGameState.kind === "snake") drawSnakeClear(ctx, miniGameState, dt);
    else if (miniGameState.kind === "balloons") drawBalloonPop(ctx, miniGameState, dt);
    else drawStarCatch(ctx, miniGameState, dt);
    miniAnimation = requestAnimationFrame(window.drawMiniRewardFrame);
  };
  function drawFlappyEasy(ctx, state, dt) {
    const W = 360, H = 500, ground = 466, birdX = 88, gap = 194, bird = state.bird;
    bird.vy += 6.2 * dt; bird.y += bird.vy; bird.wing += dt * 12;
    state.pipes.forEach(pipe => pipe.x -= 72 * dt);
    if (state.pipes.at(-1).x < 218) state.pipes.push({ x: 390, gapY: 148 + Math.random() * 204 });
    state.pipes = state.pipes.filter(pipe => pipe.x > -70);
    let hit = bird.y < 14 || bird.y > ground - 15;
    state.pipes.forEach(pipe => {
      if (pipe.x + 42 < birdX && !pipe.counted) { pipe.counted = true; state.passed++; }
      const overlaps = birdX + 18 > pipe.x && birdX - 17 < pipe.x + 42;
      if (overlaps && (bird.y - 11 < pipe.gapY - gap / 2 || bird.y + 11 > pipe.gapY + gap / 2)) { hit = true; pipe.x += 72; }
    });
    if (hit) { bird.y = clamp(bird.y, 32, ground - 32); bird.vy = 0; }
    const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#83d9ff"); sky.addColorStop(1, "#f1fcff"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#6bc96d";
    state.pipes.forEach(pipe => { ctx.fillRect(pipe.x, 0, 42, pipe.gapY - gap / 2); ctx.fillRect(pipe.x, pipe.gapY + gap / 2, 42, ground - pipe.gapY - gap / 2); ctx.fillStyle = "#42ae4c"; ctx.fillRect(pipe.x - 5, pipe.gapY - gap / 2 - 13, 52, 13); ctx.fillRect(pipe.x - 5, pipe.gapY + gap / 2, 52, 13); ctx.fillStyle = "#6bc96d"; });
    ctx.fillStyle = "#77d66c"; ctx.fillRect(0, ground, W, H - ground); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(48, 70, 20, 0, 7); ctx.arc(76, 70, 28, 0, 7); ctx.arc(108, 70, 20, 0, 7); ctx.fill();
    drawRightBird(ctx, birdX, bird.y, bird.wing);
    ctx.fillStyle = "#2b2d5b"; ctx.font = "bold 20px system-ui"; ctx.textAlign = "center"; ctx.fillText(`Durchflogene Röhren: ${state.passed}`, W / 2, ground + 27);
  }
  function drawRightBird(ctx, x, y, phase) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "#b75e32"; ctx.beginPath(); ctx.moveTo(-17, 0); ctx.lineTo(-29, -8); ctx.lineTo(-27, 7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ffc928"; ctx.beginPath(); ctx.ellipse(0, 1, 20, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.rotate(Math.sin(phase) * .45); ctx.fillStyle = "#e99518"; ctx.beginPath(); ctx.ellipse(-2, -5, 11, 5, -.25, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#ffdc62"; ctx.beginPath(); ctx.arc(10, -9, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ed6a32"; ctx.beginPath(); ctx.moveTo(17, -8); ctx.lineTo(30, -4); ctx.lineTo(17, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(13, -12, 3.8, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(14.5, -12, 1.8, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function drawSnakeClear(ctx, state, dt) {
    const cell = 18, board = 360; state.stepElapsed += dt;
    if (state.stepElapsed >= .17) {
      state.stepElapsed = 0; state.direction = state.nextDirection;
      const head = state.snake[0], next = { x: (head.x + state.direction.x + 20) % 20, y: (head.y + state.direction.y + 20) % 20 };
      const ate = next.x === state.food.x && next.y === state.food.y;
      if (state.snake.some(point => point.x === next.x && point.y === next.y)) resetMiniSnake();
      else {
        state.snake.unshift(next);
        if (ate) { state.apples++; let food; do { food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) }; } while (state.snake.some(point => point.x === food.x && point.y === food.y)); state.food = food; }
        else state.snake.pop();
      }
    }
    ctx.fillStyle = "#f5f8ea"; ctx.fillRect(0, 0, 360, 500); ctx.fillStyle = "#e5f3d6"; ctx.fillRect(0, 0, board, board);
    ctx.strokeStyle = "#d4e8c5"; ctx.lineWidth = 1; for (let p = 0; p <= board; p += cell) { ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, board); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(board, p); ctx.stroke(); }
    ctx.fillStyle = "#e74646"; ctx.beginPath(); ctx.arc(state.food.x * cell + 9, state.food.y * cell + 9, 7, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#317d3a"; ctx.fillRect(state.food.x * cell + 8, state.food.y * cell + 1, 3, 5);
    state.snake.slice().reverse().forEach((point, reverseIndex) => { const i = state.snake.length - reverseIndex - 1, x = point.x * cell + 1, y = point.y * cell + 1; ctx.fillStyle = i === 0 ? "#79c943" : i % 2 ? "#238b51" : "#32a966"; ctx.fillRect(x, y, cell - 2, cell - 2); });
    const head = state.snake[0], hx = head.x * cell + 9, hy = head.y * cell + 9;
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(hx + (state.direction.x ? state.direction.x * 3 : -3), hy + (state.direction.y ? state.direction.y * 3 : -4), 2.8, 0, Math.PI * 2); ctx.arc(hx + (state.direction.x ? state.direction.x * 3 : 4), hy + (state.direction.y ? state.direction.y * 3 : -4), 2.8, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#172a20"; ctx.beginPath(); ctx.arc(hx + (state.direction.x ? state.direction.x * 4 : -3), hy + (state.direction.y ? state.direction.y * 4 : -4), 1.2, 0, Math.PI * 2); ctx.arc(hx + (state.direction.x ? state.direction.x * 4 : 4), hy + (state.direction.y ? state.direction.y * 4 : -4), 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#263650"; ctx.font = "bold 22px system-ui"; ctx.textAlign = "center"; ctx.fillText(`🍎 Äpfel gesammelt: ${state.apples}`, 180, 398); ctx.font = "16px system-ui"; ctx.fillText("Die grüne Schlange sammelt Äpfel!", 180, 431);
  }
  function advanceSnake(state, dt) {
    state.stepElapsed += dt;
    if (state.stepElapsed < .16) return false;
    state.stepElapsed = 0;
    state.direction = state.nextDirection;
    const head = state.snake[0];
    const next = { x: (head.x + state.direction.x + 20) % 20, y: (head.y + state.direction.y + 20) % 20 };
    const ate = next.x === state.food.x && next.y === state.food.y;
    if (state.snake.some(point => point.x === next.x && point.y === next.y)) { resetMiniSnake(); return true; }
    state.snake.unshift(next);
    if (ate) {
      state.apples++;
      let food;
      do { food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) }; }
      while (state.snake.some(point => point.x === food.x && point.y === food.y));
      state.food = food;
    } else state.snake.pop();
    return true;
  }
  function renderSnakeBoard(state) {
    const board = $("#snake-board");
    if (!board) return;
    if (board.children.length !== 400) board.innerHTML = Array.from({ length: 400 }, () => `<span class="snake-cell"></span>`).join("");
    const cells = board.children;
    for (let i = 0; i < cells.length; i++) { cells[i].className = "snake-cell"; cells[i].style.cssText = ""; cells[i].textContent = ""; }
    const foodIndex = state.food.y * 20 + state.food.x;
    cells[foodIndex].classList.add("snake-food");
    cells[foodIndex].textContent = "🍎";
    state.snake.forEach((point, index) => {
      const cell = cells[point.y * 20 + point.x];
      cell.classList.add(index === 0 ? "snake-head" : "snake-body");
      cell.style.setProperty("background-color", "#050505", "important");
      cell.style.setProperty("border-radius", index === 0 ? "50%" : "6px", "important");
      cell.style.setProperty("box-shadow", index === 0 ? "0 0 0 2px #ffd84d, inset 0 0 0 2px #fff" : "inset 0 0 0 1px #333", "important");
      cell.style.setProperty("opacity", "1", "important");
      cell.style.setProperty("z-index", index === 0 ? "2" : "1", "important");
    });
    const score = $("#snake-score");
    if (score) score.textContent = `🍎 Äpfel gesammelt: ${state.apples}`;
  }
  function drawBalloonPop(ctx, state, dt) {
    const sky = ctx.createLinearGradient(0, 0, 0, 500); sky.addColorStop(0, "#b8eaff"); sky.addColorStop(1, "#fff5d7"); ctx.fillStyle = sky; ctx.fillRect(0, 0, 360, 500);
    state.balloons.forEach(balloon => {
      balloon.y -= 20 * dt; balloon.phase += dt * 2;
      if (balloon.y < -50) { balloon.y = 520 + Math.random() * 100; balloon.x = 25 + Math.random() * 310; balloon.hue = Math.random() * 360; }
      const x = balloon.x + Math.sin(balloon.phase) * 8, y = balloon.y;
      ctx.strokeStyle = "#65758b"; ctx.beginPath(); ctx.moveTo(x, y + 24); ctx.quadraticCurveTo(x + 7, y + 38, x - 2, y + 52); ctx.stroke();
      ctx.fillStyle = `hsl(${balloon.hue} 78% 59%)`; ctx.beginPath(); ctx.ellipse(x, y, 18, 24, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 4, y + 22); ctx.lineTo(x + 4, y + 22); ctx.lineTo(x, y + 30); ctx.fill();
      ctx.fillStyle = "#ffffffa8"; ctx.beginPath(); ctx.ellipse(x - 6, y - 7, 4, 7, -.35, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = "#343052"; ctx.font = "bold 23px system-ui"; ctx.textAlign = "center"; ctx.fillText(`Ballons geplatzt: ${state.balloonScore}`, 180, 470);
  }
  function drawStarCatch(ctx, state, dt) {
    ctx.fillStyle = "#20284f"; ctx.fillRect(0, 0, 360, 500);
    for (let i = 0; i < 32; i++) { const x = (i * 79) % 360, y = (i * 137) % 470; ctx.fillStyle = i % 3 ? "#ffffff99" : "#ffe47a"; ctx.fillRect(x, y, i % 4 === 0 ? 3 : 2, i % 4 === 0 ? 3 : 2); }
    state.starSpawn += dt; if (state.starSpawn > .65) { state.starSpawn = 0; state.fallingStars.push({ x: 18 + Math.random() * 324, y: -15, speed: 55 + Math.random() * 35 }); }
    state.fallingStars.forEach(star => star.y += star.speed * dt);
    state.fallingStars = state.fallingStars.filter(star => { if (star.y > 405 && star.y < 452 && Math.abs(star.x - state.catcher.x) < 43) { state.starScore++; return false; } return star.y < 520; });
    state.catcher.x = clamp(state.catcher.x + state.catcher.move * 95 * dt, 38, 322);
    ctx.font = "26px system-ui"; ctx.textAlign = "center"; state.fallingStars.forEach(star => ctx.fillText("⭐", star.x, star.y));
    ctx.fillStyle = "#68d9e8"; ctx.beginPath(); ctx.moveTo(state.catcher.x - 36, 434); ctx.lineTo(state.catcher.x - 28, 464); ctx.lineTo(state.catcher.x + 28, 464); ctx.lineTo(state.catcher.x + 36, 434); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#eaffff"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(state.catcher.x - 36, 434); ctx.lineTo(state.catcher.x + 36, 434); ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.font = "bold 22px system-ui"; ctx.fillText(`Sterne gefangen: ${state.starScore}`, 180, 48);
  }
  window.leaveMiniReward = function () {
    stopMiniGameLoop(); miniGameState = null;
    const saved = miniReturnHTML, kind = miniReturnKind; miniReturnHTML = "";
    if ((kind === "result" || kind === "dashboard") && saved) app.innerHTML = saved; else home();
  };
  window.finishLevelReward = function () {
    if (!miniGameState) return;
    const state = miniGameState, kind = state.kind, preview = state.preview;
    const score = kind === "snake" ? state.apples : kind === "balloons" ? state.balloonScore : kind === "catch" ? state.starScore : state.passed;
    stopMiniGameLoop(); miniGameState = null;
    if (!preview && S.levelRewards?.length) S.levelRewards.shift();
    save();
    if (!preview && miniReturnKind === "result" && miniReturnHTML) miniReturnHTML = miniReturnHTML.replace(/<div class="level-reward-cta">[\s\S]*?<\/div>/, levelRewardResultHTML());
    app.innerHTML = `<section class="mini-reward-page"><div class="card center mini-finished"><div class="chest">${kind === "flappy" ? "🐦" : kind === "snake" ? "🐍" : kind === "balloons" ? "🎈" : "⭐"}</div><h1>${preview ? "Vorschau beendet" : "Super gespielt!"}</h1><p class="big">${preview ? "Das Spiel ist bereit für die Kinder." : `Deine zwei Minuten ${miniRewardTitle(kind)} sind vorbei!`}</p><p>${kind === "snake" ? `Du hast ${score} Äpfel gesammelt.` : kind === "balloons" ? `Du hast ${score} Ballons geplatzt.` : kind === "catch" ? `Du hast ${score} Sterne gefangen.` : `Du bist an ${score} Röhren vorbeigeflogen.`}</p><button class="btn go" onclick="returnFromMiniReward()">${preview ? "Zurück zum Dashboard" : "Weiter ➜"}</button></div></section>`;
  };
  window.returnFromMiniReward = function () {
    const saved = miniReturnHTML, kind = miniReturnKind; miniReturnHTML = "";
    if ((kind === "result" || kind === "dashboard") && saved) app.innerHTML = saved; else home();
  };
  window.launchMiniGamePreview = function (kind) {
    if (!parentUnlocked) { alert("Bitte zuerst das Eltern-Dashboard öffnen."); return; }
    if (!rewardKinds.includes(kind)) return;
    runMiniGame(kind, "Eltern-Vorschau", "dashboard", true);
  };
  function miniGamePreviewPanel() {
    return `<section class="card mini-preview-panel"><h2>🎮 Mini-Spiele ansehen</h2><p>Vorschau oder starte ein Spiel.</p><div class="mini-preview-grid">${rewardKinds.map(kind => `<button class="filter-btn" onclick="launchMiniGamePreview('${kind}')">${kind === "flappy" ? "🐦" : kind === "snake" ? "🐍" : kind === "balloons" ? "🎈" : "⭐"} ${miniRewardTitle(kind)}</button>`).join("")}</div></section>`;
  }
  window.dashboard = function () {
    baseDashboard();
    if (!$("#dash-level") || $("#mini-preview-panel")) return;
    const weekly = document.querySelector(".weekly-card");
    if (weekly) weekly.insertAdjacentHTML("afterend", `<div id="mini-preview-panel">${miniGamePreviewPanel()}</div>`);
    else app.insertAdjacentHTML("beforeend", `<div id="mini-preview-panel">${miniGamePreviewPanel()}</div>`);
  };

  // Existing game storage/level unlock remains intact; choose a new, simple reward in turn.
  const originalQuestionModes = GAME_MODES;
  void originalQuestionModes;
  home();
})();
