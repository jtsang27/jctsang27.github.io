// ---- Generative loader plates -------------------------------------------
// One scene (sun, hills, sea) is redrawn procedurally in eight art media and
// the loader flips through them like a flipbook. No image assets needed.
const TAU = Math.PI * 2;

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ridge = (w, base, amp, ph, step = 6) => {
  const p = [];
  for (let x = 0; x <= w; x += step) p.push([x, base - Math.sin((x / w) * 3.1 + ph) * amp - Math.sin((x / w) * 7 + ph * 2) * amp * 0.25]);
  return p;
};
const scene = (w, h, step = 6) => ({
  sun: { x: w * 0.64, y: h * 0.3, r: w * 0.15 },
  back: ridge(w, h * 0.58, h * 0.12, 0.9, step),
  front: ridge(w, h * 0.74, h * 0.1, 2.3, step),
  seaPts: Array.from({ length: Math.floor(w / step) + 1 }, (_, i) => [i * step, h * 0.84 + Math.sin(i * step * 0.045) * 5]),
  sea: h * 0.84,
});
const shape = (g, pts, w, h) => {
  g.beginPath(); g.moveTo(0, h);
  pts.forEach(([x, y]) => g.lineTo(x, y));
  g.lineTo(w, h); g.closePath();
};
const circ = (g, x, y, rad, seg, j, r) => {
  g.beginPath();
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * TAU, k = rad + (r() - 0.5) * j;
    if (i) g.lineTo(x + Math.cos(a) * k, y + Math.sin(a) * k); else g.moveTo(x + Math.cos(a) * k, y + Math.sin(a) * k);
  }
  g.closePath();
};
const trace = (g, pts, j, r, dy = 0) => {
  g.beginPath();
  pts.forEach(([x, y], i) => {
    const px = x + (r() - 0.5) * j, py = y + dy + (r() - 0.5) * j;
    if (i) g.lineTo(px, py); else g.moveTo(px, py);
  });
  g.stroke();
};

export const plateStyles = [
  { name: 'Claymation', fn: (g, w, h, r, S) => {
    g.fillStyle = '#e2cfae'; g.fillRect(0, 0, w, h);
    const clay = (path, col) => {
      g.save(); g.shadowColor = 'rgba(60,35,20,.45)'; g.shadowBlur = 18; g.shadowOffsetY = 8; g.fillStyle = col; path(); g.fill(); g.restore();
      g.save(); path(); g.clip();
      const gr = g.createRadialGradient(w * 0.4, h * 0.2, 10, w * 0.5, h * 0.5, w);
      gr.addColorStop(0, 'rgba(255,255,255,.28)'); gr.addColorStop(1, 'rgba(0,0,0,.22)');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 260; i++) { g.fillStyle = r() > 0.5 ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.10)'; g.beginPath(); g.arc(r() * w, r() * h, r() * 2 + 0.5, 0, TAU); g.fill(); }
      g.strokeStyle = 'rgba(0,0,0,.10)'; g.lineWidth = 2;
      for (let i = 0; i < 14; i++) { g.beginPath(); g.arc(r() * w, r() * h, 8 + r() * 14, r() * 6, r() * 6 + 2.4); g.stroke(); }
      g.restore();
    };
    clay(() => circ(g, S.sun.x, S.sun.y, S.sun.r, 40, 6, r), '#e9a23b');
    clay(() => shape(g, S.back, w, h), '#7ea08a');
    clay(() => shape(g, S.front, w, h), '#c8643f');
    clay(() => shape(g, S.seaPts, w, h), '#3f7a93');
  } },
  { name: 'Pencil sketch', fn: (g, w, h, r, S) => {
    g.fillStyle = '#f1ede4'; g.fillRect(0, 0, w, h);
    g.lineCap = 'round'; g.strokeStyle = 'rgba(30,30,30,.6)'; g.lineWidth = 1.2;
    const hatch = (clipFn, gap, dir, a) => {
      g.save(); clipFn(); g.clip(); g.globalAlpha = a;
      for (let d = -h; d < w + h; d += gap) { g.beginPath(); g.moveTo(d + (r() - 0.5) * 3, 0); g.lineTo(d + dir * h * 0.6 + (r() - 0.5) * 3, h); g.stroke(); }
      g.restore();
    };
    for (let k = 0; k < 3; k++) { circ(g, S.sun.x, S.sun.y, S.sun.r, 40, 4, r); g.stroke(); }
    hatch(() => circ(g, S.sun.x, S.sun.y, S.sun.r, 40, 0, r), 7, 0.15, 0.4);
    for (let k = 0; k < 3; k++) { trace(g, S.back, 3, r); trace(g, S.front, 3, r); trace(g, S.seaPts, 3, r); }
    hatch(() => shape(g, S.back, w, h), 9, -1, 0.3);
    hatch(() => shape(g, S.front, w, h), 6, -1, 0.5);
    hatch(() => shape(g, S.front, w, h), 11, 1, 0.35);
    g.save(); shape(g, S.seaPts, w, h); g.clip(); g.globalAlpha = 0.45;
    for (let y = S.sea + 8; y < h; y += 7) { g.beginPath(); for (let x = 0; x <= w; x += 8) { const yy = y + Math.sin(x * 0.07 + y) * 2; if (x) g.lineTo(x, yy); else g.moveTo(x, yy); } g.stroke(); }
    g.restore();
  } },
  { name: 'Risograph', fn: (g, w, h, r, S) => {
    g.fillStyle = '#f4efe6'; g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = 'multiply';
    const dots = (clipFn, col, dx, gap, dens) => {
      g.save(); g.translate(dx, 0); clipFn(); g.clip(); g.fillStyle = col;
      for (let y = -gap; y < h + gap; y += gap) for (let x = -gap; x < w + gap; x += gap) {
        const ox = (Math.round(y / gap) % 2) * gap * 0.5, t = Math.max(0, Math.min(1, dens(x + ox, y)));
        if (t < 0.04) continue;
        g.beginPath(); g.arc(x + ox, y, gap * 0.62 * Math.sqrt(t), 0, TAU); g.fill();
      }
      g.restore();
    };
    dots(() => circ(g, S.sun.x, S.sun.y, S.sun.r, 40, 0, r), '#ff4f8b', 0, 8, (x, y) => 1.05 - Math.hypot(x - S.sun.x, y - S.sun.y) / (S.sun.r * 1.8));
    // each hill is clipped to its own band so the inks don't overprint into one dark block
    const band = (top, bottom) => () => {
      g.beginPath(); top.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
      for (let i = bottom.length - 1; i >= 0; i--) g.lineTo(bottom[i][0], bottom[i][1]);
      g.closePath();
    };
    dots(band(S.back, S.front), '#1f9d9b', 5, 9, (x, y) => 0.3 + (y - h * 0.45) / (h * 0.4));
    dots(band(S.front, S.seaPts), '#ff4f8b', 0, 8, (x, y) => 0.35 + (y - h * 0.62) / (h * 0.25));
    dots(() => shape(g, S.seaPts, w, h), '#1f9d9b', 5, 7, (x, y) => 0.3 + (y - S.sea) / (h - S.sea));
    g.globalCompositeOperation = 'source-over';
  } },
  { name: 'Linocut', fn: (g, w, h, r, S) => {
    const PAPER = '#efe9dc', INK = '#111';
    g.fillStyle = PAPER; g.fillRect(0, 0, w, h);
    g.fillStyle = INK;
    for (let i = 0; i < 44; i++) { const a = (i / 44) * TAU; g.beginPath(); g.moveTo(S.sun.x + Math.cos(a - 0.03) * S.sun.r * 1.2, S.sun.y + Math.sin(a - 0.03) * S.sun.r * 1.2); g.lineTo(S.sun.x + Math.cos(a) * S.sun.r * (1.6 + (i % 2) * 0.4), S.sun.y + Math.sin(a) * S.sun.r * (1.6 + (i % 2) * 0.4)); g.lineTo(S.sun.x + Math.cos(a + 0.03) * S.sun.r * 1.2, S.sun.y + Math.sin(a + 0.03) * S.sun.r * 1.2); g.fill(); }
    circ(g, S.sun.x, S.sun.y, S.sun.r, 48, 0, r); g.fill();
    g.strokeStyle = PAPER; g.lineWidth = 3;
    for (let k = 1; k < 5; k++) { g.beginPath(); g.arc(S.sun.x, S.sun.y, (S.sun.r * k) / 5, 0, TAU); g.stroke(); }
    const carve = (pts, gap, lw) => {
      g.fillStyle = INK; shape(g, pts, w, h); g.fill();
      g.save(); shape(g, pts, w, h); g.clip(); g.strokeStyle = PAPER; g.lineWidth = lw;
      for (let k = 1; k * gap < h; k++) trace(g, pts, 0, r, k * gap);
      g.restore();
      g.strokeStyle = PAPER; g.lineWidth = 5; trace(g, pts, 0, r);
    };
    carve(S.back, 14, 2.5); carve(S.front, 9, 3); carve(S.seaPts, 10, 3);
  } },
  { name: 'Watercolor', fn: (g, w, h, r, S) => {
    g.fillStyle = '#f6f1e7'; g.fillRect(0, 0, w, h);
    const wash = (rgb, pathFn, edgePts) => {
      for (let i = 0; i < 7; i++) { pathFn(); g.fillStyle = `rgba(${rgb},.09)`; g.fill(); }
      if (edgePts) { g.strokeStyle = `rgba(${rgb},.35)`; g.lineWidth = 1.5; trace(g, edgePts, 2, r); }
    };
    wash('235,150,60', () => circ(g, S.sun.x, S.sun.y, S.sun.r, 36, 12, r));
    wash('90,150,160', () => { g.beginPath(); g.moveTo(0, h); S.back.forEach(([x, y]) => g.lineTo(x + (r() - 0.5) * 8, y + (r() - 0.5) * 8)); g.lineTo(w, h); g.closePath(); }, S.back);
    wash('70,90,150', () => { g.beginPath(); g.moveTo(0, h); S.front.forEach(([x, y]) => g.lineTo(x + (r() - 0.5) * 8, y + (r() - 0.5) * 8)); g.lineTo(w, h); g.closePath(); }, S.front);
    wash('60,140,190', () => { g.beginPath(); g.moveTo(0, h); S.seaPts.forEach(([x, y]) => g.lineTo(x + (r() - 0.5) * 6, y + (r() - 0.5) * 6)); g.lineTo(w, h); g.closePath(); }, S.seaPts);
    for (let i = 0; i < 320; i++) { g.fillStyle = 'rgba(120,90,60,.07)'; g.fillRect(r() * w, r() * h, 1.5, 1.5); }
  } },
  { name: 'Pixel art', fn: (g, w, h) => {
    const tw = 96, th = Math.round((tw * h) / w), t = document.createElement('canvas');
    t.width = tw; t.height = th;
    const q = t.getContext('2d'), T = scene(tw, th, 1), sky = ['#2b1b4a', '#5a2a6e', '#a8416b', '#f0875a', '#ffd27a'];
    const band = th / 5.2;
    for (let y = 0; y < th; y++) {
      const b = Math.min(4, Math.floor(y / band)), edge = y - b * band < 2 && b > 0;
      for (let x = 0; x < tw; x++) { q.fillStyle = edge && (x + y) % 2 ? sky[b - 1] : sky[b]; q.fillRect(x, y, 1, 1); }
    }
    for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
      const d = Math.hypot(x - T.sun.x, y - T.sun.y);
      if (d <= T.sun.r) { q.fillStyle = d > T.sun.r - 2 ? '#ffb13b' : '#fff1a8'; q.fillRect(x, y, 1, 1); }
    }
    for (let x = 0; x < tw; x++) {
      const yb = Math.round(T.back[x][1]), yf = Math.round(T.front[x][1]), ys = Math.round(T.seaPts[x][1]);
      q.fillStyle = '#3a2f5c'; q.fillRect(x, yb, 1, th - yb);
      q.fillStyle = '#1d1a33'; q.fillRect(x, yf, 1, th - yf);
      for (let y = ys; y < th; y++) { q.fillStyle = (x + y * 3) % 11 === 0 ? '#4aa3c9' : '#1c4e80'; q.fillRect(x, y, 1, 1); }
    }
    g.imageSmoothingEnabled = false; g.drawImage(t, 0, 0, w, h);
  } },
  { name: 'Paper cut', fn: (g, w, h, r, S) => {
    g.fillStyle = '#f4e3c3'; g.fillRect(0, 0, w, h);
    const tear = (pts) => pts.map(([x, y]) => [x, y + (r() - 0.5) * 5]);
    const cut = (path, col) => {
      g.save(); g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 12; g.shadowOffsetY = 7; g.fillStyle = col; path(); g.fill(); g.restore();
      g.save(); path(); g.clip(); g.strokeStyle = 'rgba(255,255,255,.13)'; g.lineWidth = 1;
      for (let i = 0; i < 70; i++) { const x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 22, y + (r() - 0.5) * 22); g.stroke(); }
      g.restore();
    };
    cut(() => circ(g, S.sun.x, S.sun.y, S.sun.r, 40, 3, r), '#f2a93b');
    cut(() => circ(g, S.sun.x, S.sun.y, S.sun.r * 0.6, 36, 3, r), '#f7c566');
    const b = tear(S.back), f = tear(S.front);
    cut(() => shape(g, b, w, h), '#e07a5f');
    cut(() => shape(g, f, w, h), '#3d405b');
    [['#81b29a', -14], ['#4f8f86', 6], ['#2f6b6b', 26]].forEach(([c, dy]) => cut(() => shape(g, S.seaPts.map(([x, y]) => [x, y + dy + Math.sin(x * 0.06 + dy) * 3]), w, h), c));
  } },
  { name: 'Blueprint', fn: (g, w, h, r, S) => {
    g.fillStyle = '#183a6e'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 30) { g.strokeStyle = x % 150 ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.22)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y < h; y += 30) { g.strokeStyle = y % 150 ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.22)'; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = '#e8f0ff'; g.fillStyle = '#e8f0ff'; g.lineWidth = 1.6;
    g.beginPath(); g.arc(S.sun.x, S.sun.y, S.sun.r, 0, TAU); g.stroke();
    g.setLineDash([6, 5]); g.beginPath(); g.arc(S.sun.x, S.sun.y, S.sun.r * 0.6, 0, TAU); g.stroke();
    g.beginPath(); g.moveTo(S.sun.x - S.sun.r * 1.3, S.sun.y); g.lineTo(S.sun.x + S.sun.r * 1.3, S.sun.y); g.moveTo(S.sun.x, S.sun.y - S.sun.r * 1.3); g.lineTo(S.sun.x, S.sun.y + S.sun.r * 1.3); g.stroke(); g.setLineDash([]);
    trace(g, S.back, 0, r); trace(g, S.front, 0, r); trace(g, S.seaPts, 0, r);
    g.save(); shape(g, S.front, w, h); g.clip(); g.globalAlpha = 0.45;
    for (let d = -h; d < w + h; d += 9) { g.beginPath(); g.moveTo(d, h * 0.5); g.lineTo(d - h * 0.5, h); g.stroke(); }
    g.restore();
    const dy = S.sun.y + S.sun.r + 26;
    g.beginPath(); g.moveTo(S.sun.x - S.sun.r, dy); g.lineTo(S.sun.x + S.sun.r, dy); g.moveTo(S.sun.x - S.sun.r, dy - 7); g.lineTo(S.sun.x - S.sun.r, dy + 7); g.moveTo(S.sun.x + S.sun.r, dy - 7); g.lineTo(S.sun.x + S.sun.r, dy + 7); g.stroke();
    g.font = '13px ui-monospace, monospace'; g.textAlign = 'center'; g.fillText('2R = 126.0', S.sun.x, dy + 20);
    g.textAlign = 'right'; g.fillText('FIG. 08', w - 26, h - 26);
  } },
];

export function paintPlate(canvas, i, border = true) {
  const g = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  plateStyles[i % plateStyles.length].fn(g, w, h, rng(i * 9973 + 17), scene(w, h));
  if (border) { g.strokeStyle = 'rgba(242,239,233,.22)'; g.lineWidth = 1; g.strokeRect(14.5, 14.5, w - 29, h - 29); }
}

// Renders a plate to a data URL so it can be used as a CSS background.
export function plateURL(i, w, h, border) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  paintPlate(c, i, border);
  return c.toDataURL('image/jpeg', 0.85);
}

