/* WORT-ABENTEUER – Jahreszeiten-Hintergründe (V6)
   Frühling: Blütenblätter · Sommer: Sonnenschein & Glühwürmchen · Herbst: fallende Blätter · Winter: Schneefall.
   Die Auswahl steht in den Einstellungen (pro Profil): Automatisch (nach Datum), 4 Jahreszeiten oder Aus.
   Technik: ein einziges Canvas hinter der App, ~30 Bilder/s, pausiert bei verstecktem Tab und in Mini-Spielen,
   bei „Bewegung reduzieren“ (prefers-reduced-motion) wird nur ein ruhiges Standbild gezeichnet.
   Android: läuft unverändert in der WebView; es werden keine externen Dateien oder Emojis gebraucht. */
const Seasons = (function () {
  "use strict";
  const INFO = {
    spring: { icon: "🌸", de: "Frühling", en: "Spring" },
    summer: { icon: "☀️", de: "Sommer", en: "Summer" },
    autumn: { icon: "🍂", de: "Herbst", en: "Autumn" },
    winter: { icon: "❄️", de: "Winter", en: "Winter" },
  };
  const CHOICES = ["auto", "spring", "summer", "autumn", "winter", "off"];
  // Meteorologische Jahreszeiten der Nordhalbkugel: Frühling März–Mai, Sommer Juni–August, Herbst September–November.
  const seasonOf = (date) => {
    const m = (date || new Date()).getMonth();
    return m >= 2 && m <= 4 ? "spring" : m >= 5 && m <= 7 ? "summer" : m >= 8 && m <= 10 ? "autumn" : "winter";
  };
  const resolve = (choice) => (choice === "off" ? "off" : INFO[choice] ? choice : seasonOf(new Date()));

  const rnd = (a, b) => a + Math.random() * (b - a);
  const LEAF = ["#ffd23f", "#f6b21a", "#ee8a1c", "#d9531e", "#b9712a"];
  const PETAL = ["#ffc4da", "#ffd9e7", "#fff0f6", "#ffb3cf"];
  const COUNT = { spring: 24, summer: 30, autumn: 26, winter: 70 };

  let canvas = null, ctx = null, W = 0, H = 0, dpr = 1;
  let kind = "off", parts = [], raf = 0, last = 0, acc = 0, paused = false, running = false;
  const reduced = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  function make(first) {
    const p = { x: rnd(0, W), y: first ? rnd(-20, H) : rnd(-40, -10), ph: rnd(0, 6.28), rot: rnd(0, 6.28) };
    if (kind === "autumn") Object.assign(p, { s: rnd(9, 17), vy: rnd(28, 62), sway: rnd(18, 44), spin: rnd(-1.6, 1.6), c: LEAF[Math.floor(rnd(0, LEAF.length))] });
    else if (kind === "winter") Object.assign(p, { s: rnd(1.4, 4.2), vy: rnd(22, 58), sway: rnd(8, 26), spin: 0 });
    else if (kind === "spring") Object.assign(p, { s: rnd(5, 9), vy: rnd(18, 40), sway: rnd(24, 52), spin: rnd(-1.2, 1.2), c: PETAL[Math.floor(rnd(0, PETAL.length))] });
    else Object.assign(p, { s: rnd(1.6, 3.8), vy: -rnd(6, 20), sway: rnd(10, 30), spin: 0, y: first ? rnd(0, H) : H + 10 });
    return p;
  }
  function leaf(p) {
    const s = p.s;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.95, -s * 0.5, s * 0.9, s * 0.5, 0, s);
    ctx.bezierCurveTo(-s * 0.9, s * 0.5, -s * 0.95, -s * 0.5, 0, -s);
    ctx.fill();
    ctx.strokeStyle = "rgba(120,60,10,0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(0, s + 3);
    ctx.stroke();
    ctx.restore();
  }
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    if (kind === "summer") {
      const g = ctx.createRadialGradient(W - 40, 20, 4, W - 40, 20, Math.max(180, W * 0.45));
      g.addColorStop(0, "rgba(255,244,170,0.75)");
      g.addColorStop(1, "rgba(255,244,170,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
    parts.forEach((p) => {
      if (kind === "autumn") leaf(p);
      else if (kind === "spring") {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (kind === "winter") {
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const a = 0.35 + 0.55 * Math.abs(Math.sin(t / 700 + p.ph));
        ctx.fillStyle = `rgba(255,236,120,${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
  function step(dt, t) {
    parts.forEach((p, i) => {
      p.y += p.vy * dt;
      p.ph += dt * 1.4;
      p.x += Math.sin(p.ph) * p.sway * dt;
      p.rot += p.spin * dt;
      if (p.x < -30) p.x = W + 20;
      if (p.x > W + 30) p.x = -20;
      if (p.vy > 0 ? p.y > H + 30 : p.y < -20) parts[i] = make(false);
    });
  }
  function loop(ts) {
    raf = 0;
    if (!running || paused || document.hidden) return;
    raf = requestAnimationFrame(loop);
    const dt = last ? Math.min(0.1, (ts - last) / 1000) : 0;
    acc += dt;
    last = ts;
    if (acc < 1 / 30) return; // ~30 Bilder pro Sekunde reichen und sparen Akku
    step(acc, ts);
    draw(ts);
    acc = 0;
  }
  function size() {
    if (!canvas) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function ensureCanvas() {
    if (canvas || !document.body) return !!canvas;
    canvas = document.createElement("canvas");
    canvas.id = "season-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.insertBefore(canvas, document.body.firstChild);
    ctx = canvas.getContext("2d");
    size();
    window.addEventListener("resize", () => {
      size();
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) kick();
    });
    return !!ctx;
  }
  function kick() {
    if (running && !paused && !raf && !reduced()) {
      last = 0;
      raf = requestAnimationFrame(loop);
    }
  }
  // Auswahl anwenden (aus Profil S.season; „auto“ = nach Datum).
  function apply(choice) {
    const next = resolve(choice || "auto");
    document.body && (document.body.dataset.season = next);
    if (next === "off" || !ensureCanvas() || !ctx) {
      running = false;
      kind = "off";
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (canvas) canvas.style.display = "none";
      return next;
    }
    canvas.style.display = "";
    kind = next;
    size();
    parts = Array.from({ length: COUNT[next] }, () => make(true));
    running = true;
    if (reduced()) draw(0); // ruhiges Standbild
    else kick();
    return next;
  }
  const pause = () => {
    paused = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };
  const resume = () => {
    paused = false;
    kick();
  };
  return { INFO, CHOICES, seasonOf, resolve, apply, pause, resume, current: () => kind };
})();
if (typeof module !== "undefined") module.exports = Seasons;
