// Tutorial video engine: turns a story (stories/<id>.js) into 1920x1080 frames and an H.264 MP4.
// No audio: every step is explained by an on-screen subtitle.
// App coordinates are CSS px of the captured page (viewport 1600x900, content scrolls, navbar/sidebar fixed).
const W = 1920, H = 1080, FPS = 30;
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const F = 'PJS, sans-serif';
const COL = { navy: '#215679', ink: '#10243a', muted: '#5d7286', green: '#56cc99', green2: '#2fae78' };

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const eo = t => 1 - Math.pow(1 - t, 3);
const eio = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eback = t => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const P = (t, s, d) => clamp((t - s) / d);

// ---------- assets ----------
const IMG = {}, ICONS = {};
function loadImg(src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('img ' + src)); i.src = src; });
}
async function loadIcons(names) {
  await Promise.all(names.map(async n => {
    let s = await (await fetch(`vendor/icons/${n}.svg`)).text();
    s = s.replace(/currentColor/g, '#ffffff').replace(/width="24"/, 'width="192"').replace(/height="24"/, 'height="192"');
    ICONS[n] = await loadImg(URL.createObjectURL(new Blob([s], { type: 'image/svg+xml' })));
  }));
}
const iconCache = new Map();
function icon(name, x, y, size, color) {
  const px = Math.max(16, Math.round(size * 2)), key = name + color + px;
  let c = iconCache.get(key);
  if (!c) {
    c = document.createElement('canvas'); c.width = c.height = px;
    const g = c.getContext('2d'); g.drawImage(ICONS[name], 0, 0, px, px);
    g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, px, px);
    iconCache.set(key, c);
  }
  ctx.drawImage(c, x - size / 2, y - size / 2, size, size);
}

// ---------- text / shapes ----------
function font(s, w) { return `${w} ${s}px ${F}`; }
function txt(g, s, x, y, o = {}) {
  g.save(); g.font = font(o.s || 32, o.w || 600); g.fillStyle = o.c || COL.ink;
  g.textAlign = o.a || 'left'; g.textBaseline = o.b || 'alphabetic';
  if (o.ls) g.letterSpacing = o.ls + 'px';
  if (o.al !== undefined) g.globalAlpha *= o.al;
  g.fillText(s, x, y); g.restore();
}
function tw(s, size, w, ls) { ctx.save(); ctx.font = font(size, w); if (ls) ctx.letterSpacing = ls + 'px'; const m = ctx.measureText(s).width; ctx.restore(); return m; }
// Largest font size (up to `size`) at which `s` fits in `maxW` pixels.
function fitSize(s, size, w, maxW) { const m = tw(s, size, w); return m > maxW ? Math.floor(size * maxW / m) : size; }
function wrap(s, size, w, maxW) {
  const words = s.split(' '), lines = []; let cur = '';
  for (const wd of words) { const t = cur ? cur + ' ' + wd : wd; if (tw(t, size, w) > maxW && cur) { lines.push(cur); cur = wd; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}
function card(g, x, y, w, h, r, o = {}) {
  g.save();
  if (o.sh !== false) { g.shadowColor = o.shc || 'rgba(16,36,58,0.13)'; g.shadowBlur = o.sb ?? 40; g.shadowOffsetY = o.sy ?? 14; }
  g.fillStyle = o.f || '#fff'; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); g.restore();
}
function blob(g, x, y, r, rgb, a) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
let DOTS;
function bgLight(t) {
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#f7fbfd'); g.addColorStop(1, '#e6f1f7');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  blob(ctx, W * 0.86 + Math.sin(t * 0.31) * 70, H * 0.12 + Math.cos(t * 0.23) * 50, 620, '86,204,153', 0.2);
  blob(ctx, W * 0.08 + Math.cos(t * 0.21) * 60, H * 0.92 + Math.sin(t * 0.27) * 50, 680, '33,86,121', 0.12);
  if (!DOTS) {
    DOTS = document.createElement('canvas'); DOTS.width = W + 80; DOTS.height = H + 80;
    const d = DOTS.getContext('2d'); d.fillStyle = 'rgba(33,86,121,0.085)';
    for (let y = 0; y < DOTS.height; y += 40) for (let x = 0; x < DOTS.width; x += 40) { d.beginPath(); d.arc(x, y, 1.6, 0, 7); d.fill(); }
  }
  ctx.drawImage(DOTS, -((t * 6) % 40), -((t * 4) % 40));
}

// ---------- timeline ----------
let S, L, TL;
const VW = 1600, VH = 900;
const SUB_SPACE = 150;            // video px reserved for the subtitle bar when framing targets

function camFor(target, zoomMax = 2.2, pad = 36) {
  if (target === 'full' || !target) return { x: VW / 2, y: VH / 2, z: 1 };
  const [x, y, w, h] = target;
  const availH = VH - SUB_SPACE / 1.2;
  const z = clamp(Math.min(VW / (w + pad * 2), availH / (h + pad * 2)), 1, zoomMax);
  // place the target in the upper part of the frame so the subtitle bar does not cover it
  return { x: x + w / 2, y: y + h / 2 + (SUB_SPACE / 1.2 / 2) / z, z };
}
function clampCam(c) {
  const hw = VW / 2 / c.z, hh = VH / 2 / c.z;
  return { x: clamp(c.x, hw, VW - hw), y: clamp(c.y, hh, VH - hh), z: c.z };
}
const stepDur = (st) => st.dur ?? clamp((st.text || '').length / 16 + 1.2, 3.8, 9);
const CLICK_TO_STATE = 0.08;   // the screen reacts right at the button press
const CLICK_FADE = 0.15;       // how fast a click's result appears
const OPEN_LEAD = 0.5;         // after a click that opens the next screen, how long before the camera moves on

// A click that opens the next step's screen (a menu item, a link) must show that screen immediately.
// Move that click to the end of its step (the cursor points at it while the subtitle is read), give it the
// next step's screen, and let the next step's camera move follow right after.
function responsiveSteps(steps) {
  steps = steps.map(s => ({ ...s, actions: (s.actions || []).map(a => ({ ...a })) }));
  for (let i = 0; i < steps.length - 1; i++) {
    const st = steps[i], nx = steps[i + 1], acts = st.actions;
    if (!acts.length || !nx.state) continue;
    const last = acts[acts.length - 1];
    if (!last.click || last.state || last.type) continue;
    const md = last.to ? (last.dur ?? 0.8) : 0;
    const want = stepDur(st) - (st.openLead ?? OPEN_LEAD) - md;
    if (want > last.at) last.at = want;
    last.state = nx.state;
    last.fade = Math.min(nx.fade ?? CLICK_FADE, 0.2);
  }
  return steps;
}

function buildTimeline(story) {
  const tl = { cam: [], scroll: [], state: [], cursor: [], clicks: [], hl: [], subs: [], chapters: [], types: [], hides: [] };
  const intro = story.intro ?? 5.5, outro = story.outro ?? 6;
  let t = intro;
  let cam = { x: VW / 2, y: VH / 2, z: 1 }, scroll = 0, state = story.steps.find(s => s.state)?.state || 'base';
  let cur = { x: VW * 0.72, y: VH * 1.08 }, chapter = '';
  tl.cam.push({ t: 0, ...cam }); tl.scroll.push({ t: 0, y: 0 }); tl.state.push({ t: 0, s: state });
  tl.cursor.push({ t: 0, x: cur.x, y: cur.y });
  for (const st of responsiveSteps(story.steps)) {
    const dur = stepDur(st);
    const t0 = t;
    if (st.chapter) { tl.chapters.push({ t: +t0.toFixed(1), label: st.chapter }); chapter = st.chapter; }
    // scroll + camera move together in the first second
    const newScroll = st.scroll ?? scroll;
    const tgt = st.cam === undefined ? null : st.cam;
    let newCam = cam;
    if (tgt !== null) {
      const vr = tgt === 'full' ? 'full' : [tgt[0], tgt[1] - (st.camFixed ? 0 : newScroll), tgt[2], tgt[3]];
      newCam = clampCam(camFor(vr, st.zoomMax ?? 2.0));
    }
    const mv = st.move ?? 1.0;
    tl.cam.push({ t: t0, ...cam }, { t: t0 + mv, ...newCam });
    tl.scroll.push({ t: t0, y: scroll }, { t: t0 + mv, y: newScroll });
    cam = newCam; scroll = newScroll;
    if (st.state && st.state !== state) { tl.state.push({ t: t0, s: st.state, f: st.fade ?? 0.35 }); state = st.state; }
    if (st.hl) {
      // A highlight points at something on the current screen. When the cursor clicks somewhere outside it
      // (opening a menu, another field), the screen changes, so the highlight fades out by that click.
      let t1 = t0 + dur - 0.25;
      const pad = 12, [hx, hy, hw, hh] = st.hl;
      for (const a of st.actions || []) {
        if (!a.click || !a.to) continue;
        const sameSpace = !!a.fixed === !!st.hlFixed;
        const inside = sameSpace && a.to[0] >= hx - pad && a.to[0] <= hx + hw + pad && a.to[1] >= hy - pad && a.to[1] <= hy + hh + pad;
        if (!inside) { t1 = Math.min(t1, t0 + a.at + (a.to ? (a.dur ?? 0.8) : 0) + 0.05); break; }
      }
      tl.hl.push({ t0: t0 + mv * 0.7, t1, r: st.hl, fixed: !!st.hlFixed, scroll: newScroll, cut: t1 < t0 + dur - 0.25, text: st.text });
    }
    tl.subs.push({ t0: t0 + 0.15, t1: t0 + dur - 0.1, text: st.text, label: st.label ?? chapter });
    for (const a of st.actions || []) {
      const at = t0 + a.at, md = a.to ? (a.dur ?? 0.8) : 0;
      if (a.to) {
        const vx = a.to[0], vy = a.to[1] - (a.fixed ? 0 : scroll);
        tl.cursor.push({ t: at, x: cur.x, y: cur.y }, { t: at + md, x: vx, y: vy, arc: a.arc ?? 1 });
        cur = { x: vx, y: vy };
      }
      if (a.click) tl.clicks.push({ t: at + md + 0.05 });
      const ts = at + md + (a.click ? CLICK_TO_STATE : 0.05);
      if (a.type) {
        // typing: the field shows empty right after the click, then fills in character by character
        const n = Math.max(1, a.type.n || 1);
        const td = a.typeDur ?? clamp(n * 0.085, 0.45, 2.4);
        tl.types.push({ t0: ts + 0.1, t1: ts + 0.1 + td, box: a.type, fixed: !!a.fixed, scroll });
        if (a.hide) tl.hides.push({ t0: ts - 0.01, t1: ts + 0.1 + td + (a.hideExtra ?? 0.35), r: a.hide, bg: a.hideBg || a.type.bg, fixed: !!a.fixed, scroll });
      }
      // typing swaps instantly; a click's result appears quickly; other changes (a file picked, a calendar closing) use their own fade
      const f = a.type ? 0.06 : a.click ? Math.min(a.fade ?? CLICK_FADE, CLICK_FADE) : (a.fade ?? 0.28);
      if (a.state) { tl.state.push({ t: ts, s: a.state, f }); state = a.state; }
    }
    t += dur;
  }
  tl.appEnd = t; tl.total = t + outro; tl.intro = intro;
  // zoom back out to the whole page while the video shrinks into the outro card
  tl.cam.push({ t, ...cam }, { t: t + 0.9, x: VW / 2, y: VH / 2, z: 1 });
  // cursor leaves at the end
  tl.cursor.push({ t: t - 0.2, x: cur.x, y: cur.y }, { t: t + 0.8, x: VW * 0.8, y: VH * 1.1 });
  return tl;
}
function track(arr, t, keys) {
  if (t <= arr[0].t) return arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (t < arr[i].t) {
      const a = arr[i - 1], b = arr[i];
      const u = eio(clamp((t - a.t) / Math.max(0.001, b.t - a.t)));
      const o = {}; for (const k of keys) o[k] = lerp(a[k], b[k], u); o.u = u; o.a = a; o.b = b; return o;
    }
  }
  return arr[arr.length - 1];
}
function stateAt(t) {
  let cur = TL.state[0].s, prev = cur, since = -99, fd = 0.28;
  for (const s of TL.state) if (s.t <= t) { prev = cur; cur = s.s; since = s.t; fd = s.f ?? 0.28; }
  const f = clamp((t - since) / Math.max(0.01, fd));
  return { cur, prev, f };
}

// ---------- app view ----------
const appCv = document.createElement('canvas'); appCv.width = W; appCv.height = H;
const actx = appCv.getContext('2d');
// Page states are full-height screenshots scrolled here, keeping the panel's navbar and sidebar fixed.
// Viewport states (dialogs, toasts) are drawn as captured; plain states (website, login, wizard) scroll as a whole.
const VIEWPORT = new Set(), PLAIN = new Set(), OFFSET = {};
function drawState(g, img, scroll, alpha, name) {
  if (!img || alpha <= 0) return;
  const d = L.dpr;
  g.save(); g.globalAlpha *= alpha;
  if (PLAIN.has(name) && (scroll >= 0.5 || OFFSET[name])) {
    // offsetY: the page was scrolled by this much when the shot was taken (image row 0 = page y offsetY)
    const sy = Math.max(0, Math.min(scroll - (OFFSET[name] || 0), img.height / d - VH));   // never past the end of the page
    g.drawImage(img, 0, sy * d, VW * d, VH * d, 0, 0, VW, VH);
  } else if (scroll < 0.5 || VIEWPORT.has(name)) {
    g.drawImage(img, 0, 0, VW * d, VH * d, 0, 0, VW, VH);
  } else {
    g.drawImage(img, L.side * d, (L.top + scroll) * d, (VW - L.side) * d, (VH - L.top) * d, L.side, L.top, VW - L.side, VH - L.top);
    g.drawImage(img, 0, 0, VW * d, L.top * d, 0, 0, VW, L.top);                                   // fixed navbar
    g.drawImage(img, 0, L.top * d, L.side * d, (VH - L.top) * d, 0, L.top, L.side, VH - L.top);   // fixed sidebar
  }
  g.restore();
}
function renderApp(t) {
  const g = actx;
  const cam = track(TL.cam, t, ['x', 'y', 'z']);
  const scroll = track(TL.scroll, t, ['y']).y;
  const k = 1.2 * cam.z;
  g.setTransform(k, 0, 0, k, W / 2 - cam.x * k, H / 2 - cam.y * k);
  g.fillStyle = '#f5f7fb'; g.fillRect(0, 0, VW, VH);
  const st = stateAt(t);
  if (st.f < 1) drawState(g, IMG[st.prev], scroll, 1, st.prev);
  drawState(g, IMG[st.cur], scroll, st.f < 1 ? eio(st.f) : 1, st.cur);
  // typing: hide the not-yet-typed part of the value and draw a caret
  for (const ty of TL.types) {
    if (t < ty.t0 - 0.12 || t > ty.t1 + 0.02) continue;
    const [x, y0, w, h] = ty.box.r; const y = y0 - (ty.fixed ? 0 : scroll);
    const n = Math.max(1, ty.box.n || 1);
    const k = Math.floor(clamp((t - ty.t0) / (ty.t1 - ty.t0)) * n + 1e-6) / n;
    const shown = (ty.box.textW || 0) * k;
    g.fillStyle = ty.box.bg || '#fff';
    g.fillRect(x + shown, y + 3, Math.max(0, w - shown), h - 6);
    if (t < ty.t1) { g.fillStyle = '#1f2d3d'; g.fillRect(x + shown + 0.6, y + h * 0.26, 1.5, h * 0.48); }
  }
  for (const hd of TL.hides) {
    if (t < hd.t0 || t > hd.t1) continue;
    const [x, y0, w, h] = hd.r; const y = y0 - (hd.fixed ? 0 : scroll);
    g.fillStyle = hd.bg || '#fff'; g.fillRect(x, y, w, h);
  }
  // spotlight
  for (const h of TL.hl) {
    const a = P(t, h.t0, 0.35) * (1 - P(t, h.t1 - 0.3, 0.3));
    if (a <= 0) continue;
    const [x, y0, w, hh] = h.r; const y = y0 - (h.fixed ? 0 : scroll);
    const pad = 8, r = 14;
    g.save();
    g.beginPath(); g.rect(-50, -50, VW + 100, VH + 100); g.roundRect(x - pad, y - pad, w + 2 * pad, hh + 2 * pad, r);
    g.fillStyle = `rgba(10,26,40,${0.42 * a})`; g.fill('evenodd');
    g.shadowColor = `rgba(86,204,153,${0.8 * a})`; g.shadowBlur = 18 / k * 1.2;
    g.strokeStyle = `rgba(86,204,153,${a})`; g.lineWidth = 3.2 / k * 1.2;
    g.beginPath(); g.roundRect(x - pad, y - pad, w + 2 * pad, hh + 2 * pad, r); g.stroke();
    g.restore();
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
  // cursor (video space, constant size)
  const c = track(TL.cursor, t, ['x', 'y']);
  let cx = c.x, cy = c.y;
  if (c.a && c.b && c.b.arc) { cy -= Math.sin(c.u * Math.PI) * 26 * c.b.arc; }
  const px = W / 2 + (cx - cam.x) * k, py = H / 2 + (cy - cam.y) * k;
  let press = 0;
  for (const cl of TL.clicks) {
    const u = (t - cl.t);
    if (u > -0.1 && u < 0.6) {
      press = Math.max(press, 1 - Math.abs(u) / 0.12);
      if (u > 0) {
        const rr = eo(clamp(u / 0.5));
        g.save(); g.globalAlpha = (1 - rr) * 0.7; g.strokeStyle = COL.green; g.lineWidth = 4;
        g.beginPath(); g.arc(px, py, 10 + rr * 34, 0, 7); g.stroke(); g.restore();
      }
    }
  }
  drawCursor(g, px, py, 1 - clamp(press) * 0.14);
}
function drawCursor(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(1.25 * s, 1.25 * s);
  g.shadowColor = 'rgba(0,0,0,0.35)'; g.shadowBlur = 8; g.shadowOffsetY = 3;
  const p = new Path2D('M0 0 L0 22 L5.6 16.8 L9.4 25.6 L13.2 24 L9.5 15.4 L17 15.4 Z');
  g.fillStyle = '#111'; g.fill(p); g.shadowColor = 'transparent';
  g.strokeStyle = '#fff'; g.lineWidth = 1.8; g.lineJoin = 'round'; g.stroke(p);
  g.restore();
}

// ---------- subtitles ----------
function drawSub(t) {
  for (const s of TL.subs) {
    if (t < s.t0 || t > s.t1) continue;
    const a = P(t, s.t0, 0.25) * (1 - P(t, s.t1 - 0.25, 0.25));
    const size = 33, lines = wrap(s.text, size, 600, 1400);
    const lh = 46, labelH = s.label ? 34 : 0;
    const w = Math.max(...lines.map(l => tw(l, size, 600)), s.label ? tw(s.label.toUpperCase(), 17, 800, 3) : 0) + 72;
    const h = lines.length * lh + labelH + 38;
    const x = (W - w) / 2, y = H - h - 38 + (1 - eo(a)) * 12;
    ctx.save(); ctx.globalAlpha = a;
    card(ctx, x, y, w, h, 20, { f: 'rgba(9,24,37,0.9)', sb: 40, sy: 12, shc: 'rgba(0,0,0,0.35)' });
    if (s.label) txt(ctx, s.label.toUpperCase(), x + 36, y + 42, { s: 17, w: 800, c: COL.green, ls: 3 });
    lines.forEach((l, i) => txt(ctx, l, x + 36, y + 19 + labelH + (i + 1) * lh - 12, { s: size, w: 600, c: '#fff' }));
    ctx.restore();
  }
}

// ---------- intro / outro ----------
function frameRect(u) {   // u=0 -> preview card on the right, u=1 -> full frame
  const a = { x: 980, y: 250, w: 840, h: 472.5, r: 22 };
  return { x: lerp(a.x, 0, u), y: lerp(a.y, 0, u), w: lerp(a.w, W, u), h: lerp(a.h, H, u), r: lerp(a.r, 0, u) };
}
function drawFramed(fr, shadow) {
  ctx.save();
  if (shadow) { ctx.shadowColor = 'rgba(12,32,52,0.28)'; ctx.shadowBlur = 70; ctx.shadowOffsetY = 28; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(fr.x, fr.y, fr.w, fr.h, fr.r); ctx.fill(); }
  ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.roundRect(fr.x, fr.y, fr.w, fr.h, fr.r); ctx.clip();
  ctx.drawImage(appCv, fr.x, fr.y, fr.w, fr.h); ctx.restore();
}
function introCard(t) {
  const s = S, D = TL.intro;
  bgLight(t);
  const o = 1 - eio(P(t, D - 1.1, 0.6));
  const lx = 120;
  const ta = eo(P(t, 0.2, 0.7));
  ctx.save(); ctx.globalAlpha = ta * o; ctx.translate((1 - ta) * -30, 0);
  txt(ctx, s.overline, lx, 300, { s: 22, w: 800, c: COL.green2, ls: 5 });
  txt(ctx, s.title, lx, 400, { s: fitSize(s.title, 92, 800, 820), w: 800, c: COL.ink });
  txt(ctx, s.subtitle, lx, 462, { s: 34, w: 500, c: COL.muted });
  ctx.restore();
  txt(ctx, 'IN THIS TUTORIAL', lx, 560, { s: 18, w: 800, c: COL.muted, ls: 4, al: eo(P(t, 0.8, 0.5)) * o });
  s.learn.forEach((l, i) => {
    const a = eo(P(t, 1.0 + i * 0.35, 0.5)) * o;
    ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - a) * -20, 0);
    ctx.fillStyle = 'rgba(86,204,153,0.18)'; ctx.beginPath(); ctx.arc(lx + 20, 612 + i * 62, 20, 0, 7); ctx.fill();
    icon('check', lx + 20, 612 + i * 62, 22, COL.green2);
    txt(ctx, l, lx + 58, 622 + i * 62, { s: 29, w: 600, c: COL.ink });
    ctx.restore();
  });
  const pa = eo(P(t, 0.4, 0.9));
  const u = eio(P(t, D - 0.9, 0.9));
  renderApp(TL.intro);
  // optional preview screen for the title card (story.previewState); it hands over to the first step as it grows
  if (s.previewState && IMG[s.previewState] && u < 1) {
    actx.setTransform(1.2, 0, 0, 1.2, 0, 0);
    drawState(actx, IMG[s.previewState], 0, 1 - u, s.previewState);
    actx.setTransform(1, 0, 0, 1, 0, 0);
  }
  const fr = frameRect(u);
  ctx.save(); ctx.globalAlpha = pa; ctx.translate((1 - pa) * 80 * (1 - u), 0);
  drawFramed(fr, true); ctx.restore();
}
function outroCard(t) {
  const s = S, t0 = TL.appEnd, lt = t - t0, D = TL.total - t0;
  bgLight(t);
  const u = 1 - eio(P(lt, 0, 0.9));
  renderApp(Math.min(t, TL.appEnd + 0.9));
  const fade = 1 - P(lt, D - 0.7, 0.7);
  ctx.save(); ctx.globalAlpha = fade; drawFramed(frameRect(u), true); ctx.restore();
  const lx = 120, a1 = eo(P(lt, 0.6, 0.7)) * fade;
  ctx.save(); ctx.globalAlpha = a1; ctx.translate((1 - a1) * -30, 0);
  txt(ctx, 'TUTORIAL COMPLETE', lx, 300, { s: 22, w: 800, c: COL.green2, ls: 5 });
  txt(ctx, s.doneTitle, lx, 390, { s: fitSize(s.doneTitle, 76, 800, 820), w: 800, c: COL.ink });
  ctx.restore();
  s.recap.forEach((l, i) => {
    const a = eo(P(lt, 1.0 + i * 0.3, 0.5)) * fade;
    ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - a) * -20, 0);
    ctx.fillStyle = 'rgba(86,204,153,0.18)'; ctx.beginPath(); ctx.arc(lx + 20, 470 + i * 60, 20, 0, 7); ctx.fill();
    icon('check', lx + 20, 470 + i * 60, 22, COL.green2);
    txt(ctx, l, lx + 58, 480 + i * 60, { s: 28, w: 600, c: COL.ink });
    ctx.restore();
  });
  const na = eo(P(lt, 2.2, 0.6)) * fade;
  if (s.next) {
    ctx.save(); ctx.globalAlpha = na;
    const label = 'Next: ' + s.next, w = tw(label, 28, 700) + 100;
    const y = 470 + s.recap.length * 60 + 40;
    card(ctx, lx, y, w, 68, 34, { f: COL.navy, sb: 30, sy: 10, shc: 'rgba(33,86,121,0.35)' });
    icon('arrow-right', lx + 38, y + 34, 26, COL.green);
    txt(ctx, label, lx + 66, y + 35, { s: 28, w: 700, c: '#fff', b: 'middle' });
    ctx.restore();
  }
  const fb = P(lt, D - 0.5, 0.5);
  if (fb > 0) { ctx.fillStyle = `rgba(0,0,0,${fb})`; ctx.fillRect(0, 0, W, H); }
}

// ---------- public ----------
window.initTutorial = async (story) => {
  S = story; L = story.layout;
  const ff = new FontFace('PJS', 'url(vendor/fonts/PlusJakartaSans-latin.woff2)', { weight: '200 800' });
  await ff.load(); document.fonts.add(ff);
  await Promise.all(['500', '600', '700', '800'].map(w => document.fonts.load(`${w} 40px PJS`)));
  await loadIcons(['check', 'arrow-right']);
  for (const [k, v] of Object.entries(story.states)) {
    // a state is a path, or { src, viewport: true } for a screenshot of the visible window only
    IMG[k] = await loadImg(typeof v === 'string' ? v : v.src);
    if (typeof v === 'object' && v.viewport) VIEWPORT.add(k);
    if (typeof v === 'object' && v.plain) PLAIN.add(k);
    if (typeof v === 'object' && v.offsetY) OFFSET[k] = v.offsetY;
  }
  TL = buildTimeline(story);
  window.TL = TL; window.DURATION = TL.total;
  return { duration: +TL.total.toFixed(2), chapters: TL.chapters };
};
window.renderAt = (t) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  if (t < TL.intro) { introCard(t); return; }
  if (t >= TL.appEnd) { outroCard(t); return; }
  renderApp(t);
  ctx.drawImage(appCv, 0, 0);
  drawSub(t);
};

// ---------- encode (H.264 constant quality, no audio) ----------
window.encodeVideo = async ({ name, qp = 24 }) => {
  const { Muxer, ArrayBufferTarget } = await import('./vendor/mp4-muxer/mp4-muxer.mjs');
  const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: 'avc', width: W, height: H, frameRate: FPS }, fastStart: 'in-memory' });
  let err = null;
  const ve = new VideoEncoder({ output: (c, m) => muxer.addVideoChunk(c, m), error: e => { err = e; } });
  ve.configure({ codec: 'avc1.640028', width: W, height: H, framerate: FPS, bitrateMode: 'quantizer', avc: { format: 'avc' }, latencyMode: 'quality' });
  const N = Math.round(TL.total * FPS);
  for (let n = 0; n < N; n++) {
    renderAt(n / FPS);
    const f = new VideoFrame(cv, { timestamp: Math.round(n * 1e6 / FPS), duration: Math.round(1e6 / FPS) });
    ve.encode(f, { keyFrame: n % (FPS * 2) === 0, avc: { quantizer: qp } });
    f.close();
    while (ve.encodeQueueSize > 6) await new Promise(r => setTimeout(r, 2));
    if (err) throw err;
  }
  await ve.flush(); if (err) throw err;
  muxer.finalize();
  const r = await fetch('out/' + name, { method: 'PUT', body: new Blob([muxer.target.buffer], { type: 'video/mp4' }) });
  return await r.text();
};

// 1280x720 JPEG poster (the intro title card) for the docs cards and player.
window.savePoster = async ({ name, t }) => {
  renderAt(t ?? Math.min(4.2, TL.intro - 1.2));
  const c = document.createElement('canvas'); c.width = 1280; c.height = 720;
  const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(cv, 0, 0, 1280, 720);
  const blob = await new Promise(res => c.toBlob(res, 'image/jpeg', 0.85));
  const r = await fetch('out/' + name, { method: 'PUT', body: blob });
  return await r.text();
};
