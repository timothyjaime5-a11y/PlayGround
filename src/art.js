/* ============================================================
   IRONROOT & IVY — procedural world art
   ============================================================ */
import { TAU, rr, ellipsePath, hash, CROPS, WEAPONS } from './data.js';

/* ---------------- weapons ---------------- */
export function drawWeapon(ctx, id, x, y, scale = 1, angle = 0, opts = {}) {
  const w = WEAPONS[id];
  if (!w) return;
  const p = w.palette;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  if (opts.glow) {
    ctx.shadowColor = p.accent;
    ctx.shadowBlur = 16;
  }
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (w.kind === 'sword') {
    // blade
    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.lineTo(4.2, -29);
    ctx.lineTo(4.2, 1);
    ctx.lineTo(0, 5);
    ctx.lineTo(-4.2, 1);
    ctx.lineTo(-4.2, -29);
    ctx.closePath();
    ctx.fillStyle = p.metal;
    ctx.fill();
    ctx.strokeStyle = p.dark;
    ctx.lineWidth = 1.1;
    ctx.stroke();
    // edge highlight
    ctx.beginPath();
    ctx.moveTo(-1.8, -32.5);
    ctx.lineTo(-1.8, 0);
    ctx.strokeStyle = p.edge;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // fuller
    ctx.beginPath();
    ctx.moveTo(1.4, -26);
    ctx.lineTo(1.4, -1);
    ctx.strokeStyle = 'rgba(50, 64, 72, .3)';
    ctx.lineWidth = .8;
    ctx.stroke();
    // guard
    ctx.beginPath();
    ctx.moveTo(-11, 4);
    ctx.quadraticCurveTo(0, 8.5, 11, 4);
    ctx.quadraticCurveTo(0, 10.5, -11, 4);
    ctx.fillStyle = p.accent;
    ctx.fill();
    ctx.strokeStyle = p.dark;
    ctx.lineWidth = 1;
    ctx.stroke();
    // grip
    rr(ctx, -3.2, 7, 6.4, 13, 2.4);
    ctx.fillStyle = p.grip;
    ctx.fill();
    ctx.strokeStyle = 'rgba(43, 27, 12, .55)';
    ctx.lineWidth = .8;
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-3.2, 9.5 + i * 3.6);
      ctx.lineTo(3.2, 10.7 + i * 3.6);
      ctx.strokeStyle = 'rgba(238, 220, 180, .4)';
      ctx.lineWidth = .8;
      ctx.stroke();
    }
    // pommel
    ctx.beginPath();
    ctx.arc(0, 22, 3.1, 0, TAU);
    ctx.fillStyle = p.accent;
    ctx.fill();
    ctx.strokeStyle = p.dark;
    ctx.lineWidth = .8;
    ctx.stroke();
  } else if (w.kind === 'axe') {
    // handle
    ctx.beginPath();
    ctx.moveTo(-1.5, 26);
    ctx.lineTo(2.5, -24);
    ctx.strokeStyle = p.grip;
    ctx.lineWidth = 4.4;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-1.5, 26);
    ctx.lineTo(2.5, -24);
    ctx.strokeStyle = 'rgba(244, 218, 171, .25)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // head
    ctx.beginPath();
    ctx.moveTo(2, -27);
    ctx.quadraticCurveTo(17, -34, 21, -22);
    ctx.quadraticCurveTo(17, -12, 3, -10);
    ctx.quadraticCurveTo(7, -19, 2, -27);
    ctx.closePath();
    ctx.fillStyle = p.metal;
    ctx.fill();
    ctx.strokeStyle = p.dark;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5, -26);
    ctx.quadraticCurveTo(16, -31, 19, -22);
    ctx.strokeStyle = p.edge;
    ctx.lineWidth = 1.1;
    ctx.stroke();
    // crystal spikes
    if (id === 'greataxe') {
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(6 + i * 3.5, -15 - i * 1.2);
        ctx.lineTo(10 + i * 3.5, -22 - i * 2.5);
        ctx.lineTo(12 + i * 3.5, -14 - i * 1.2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(185, 166, 241, .9)';
        ctx.fill();
        ctx.strokeStyle = '#6c58ad';
        ctx.lineWidth = .7;
        ctx.stroke();
      }
    }
    // grip wrap
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-1.8, 4 + i * 5);
      ctx.lineTo(1.6, 5.2 + i * 5);
      ctx.strokeStyle = 'rgba(240, 220, 180, .35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  } else if (w.kind === 'scythe') {
    // snath
    ctx.beginPath();
    ctx.moveTo(3, 27);
    ctx.quadraticCurveTo(-1, 2, -7, -26);
    ctx.strokeStyle = p.grip;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(3, 27);
    ctx.quadraticCurveTo(-1, 2, -7, -26);
    ctx.strokeStyle = 'rgba(246, 220, 175, .22)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // blade
    ctx.beginPath();
    ctx.moveTo(-7, -26);
    ctx.bezierCurveTo(6, -37, 20, -30, 24, -17);
    ctx.bezierCurveTo(16, -22, 5, -22, -7, -26);
    ctx.closePath();
    ctx.fillStyle = p.metal;
    ctx.fill();
    ctx.strokeStyle = p.dark;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-5, -25);
    ctx.bezierCurveTo(7, -33, 18, -28, 21, -19);
    ctx.strokeStyle = p.edge;
    ctx.lineWidth = 1.1;
    ctx.stroke();
    // binding
    ctx.beginPath();
    ctx.moveTo(-9, -22);
    ctx.lineTo(-4, -27);
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 2.4;
    ctx.stroke();
  }
  ctx.restore();
}

export function drawWeaponIcon(canvas, id) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const size = 74;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);
  const grad = ctx.createRadialGradient(size / 2, size * .42, 2, size / 2, size * .5, size * .55);
  grad.addColorStop(0, 'rgba(216, 165, 65, .17)');
  grad.addColorStop(1, 'rgba(63, 78, 58, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  drawWeapon(ctx, id, size / 2, size / 2 + 3, 1.16, -0.08, { glow: true });
}

/* ---------------- farm plots ---------------- */
export function drawPlot(ctx, p, t) {
  const { x, y, w, h } = p;
  ctx.save();
  // soil
  ctx.fillStyle = 'rgba(50, 38, 20, .22)';
  rr(ctx, x + 2, y + 4, w, h, 7);
  ctx.fill();
  const soil = ctx.createLinearGradient(x, y, x, y + h);
  if (p.watered) {
    soil.addColorStop(0, '#5c452b');
    soil.addColorStop(1, '#49361f');
  } else {
    soil.addColorStop(0, '#775736');
    soil.addColorStop(1, '#624729');
  }
  ctx.fillStyle = soil;
  rr(ctx, x, y, w, h, 6);
  ctx.fill();
  ctx.strokeStyle = 'rgba(44, 32, 16, .35)';
  ctx.lineWidth = 1;
  rr(ctx, x + .5, y + .5, w - 1, h - 1, 6);
  ctx.stroke();
  // furrows
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = p.watered ? 'rgba(36, 27, 14, .38)' : 'rgba(87, 64, 37, .5)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 12 + i * 13);
    ctx.quadraticCurveTo(x + w / 2, y + 10 + i * 13, x + w - 8, y + 12 + i * 13);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(179, 141, 91, .22)';
    ctx.lineWidth = .8;
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 13.5 + i * 13);
    ctx.quadraticCurveTo(x + w / 2, y + 11.5 + i * 13, x + w - 8, y + 13.5 + i * 13);
    ctx.stroke();
  }
  // water sheen
  if (p.watered) {
    for (let i = 0; i < 5; i++) {
      const wx = x + 9 + hash(i, x) * (w - 18);
      const wy = y + 9 + hash(y, i) * (h - 18);
      ctx.fillStyle = 'rgba(140, 196, 208, .28)';
      ctx.beginPath();
      ctx.ellipse(wx, wy, 2.4, 1.1, -.3, 0, TAU);
      ctx.fill();
    }
  }
  if (!p.empty) drawCrop(ctx, p, t);
  ctx.restore();
}

function drawCrop(ctx, p, t) {
  const crop = CROPS[p.crop];
  const cx = p.cx;
  const cy = p.cy + 16;
  const stage = p.stage;
  const sway = Math.sin(t * 1.8 + p.sway) * (1 + stage * .35);
  const scale = [.34, .58, .82, 1][stage] || 1;
  ctx.save();
  ctx.translate(cx, cy);
  // little shadow
  ctx.fillStyle = 'rgba(40, 30, 14, .22)';
  ctx.beginPath();
  ctx.ellipse(0, 2, 15 * scale, 4 * scale, 0, 0, TAU);
  ctx.fill();

  if (p.crop === 'turnip') {
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * .38 + sway * .012;
      const len = 22 * scale;
      ctx.strokeStyle = i % 2 ? '#5c9a52' : '#75ad62';
      ctx.lineWidth = 2.2 * scale;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(Math.cos(a) * len * .55 + sway * .3, Math.sin(a) * len * .55, Math.cos(a) * len + sway, Math.sin(a) * len);
      ctx.stroke();
      ctx.fillStyle = i % 2 ? '#7fb76a' : '#8fc377';
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * len * .78 + sway * .6, Math.sin(a) * len * .78, 4.2 * scale, 2.4 * scale, a, 0, TAU);
      ctx.fill();
    }
    if (stage >= 2) {
      ctx.fillStyle = '#e59ab5';
      ctx.beginPath();
      ctx.ellipse(0, 1, 7.5 * scale, 6.5 * scale, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 213, 227, .55)';
      ctx.beginPath();
      ctx.ellipse(-2 * scale, -1.5 * scale, 2.4 * scale, 1.6 * scale, -.5, 0, TAU);
      ctx.fill();
    }
  } else if (p.crop === 'wheat') {
    for (let i = 0; i < 7; i++) {
      const ox = (i - 3) * 4.4 * scale;
      const hgt = (18 + (i % 3) * 5) * scale;
      const lean = sway * (1 + i * .1) + (i - 3) * 1.1;
      ctx.strokeStyle = '#b9953f';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ox, 0);
      ctx.quadraticCurveTo(ox + lean * .4, -hgt * .55, ox + lean, -hgt);
      ctx.stroke();
      if (stage >= 2) {
        ctx.fillStyle = stage >= 3 ? '#e2bc55' : '#c9a746';
        for (let k = 0; k < 3; k++) {
          ctx.beginPath();
          ctx.ellipse(ox + lean + (k - 1) * 1.8, -hgt + k * 3.2, 1.7, 3.2, .35, 0, TAU);
          ctx.fill();
        }
      }
    }
  } else {
    // sunbloom
    const hgt = 24 * scale;
    ctx.strokeStyle = '#5f9c55';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(sway * .4, -hgt * .55, sway, -hgt);
    ctx.stroke();
    // leaves
    for (const side of [-1, 1]) {
      ctx.fillStyle = '#6eaa5d';
      ctx.beginPath();
      ctx.ellipse(side * 6 * scale, -hgt * .45, 6.5 * scale, 3 * scale, side * .55, 0, TAU);
      ctx.fill();
    }
    if (stage >= 2) {
      const fx = sway, fy = -hgt;
      const open = stage >= 3 ? 1 : .55;
      ctx.fillStyle = '#f2c75b';
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU + sway * .01;
        ctx.beginPath();
        ctx.ellipse(fx + Math.cos(a) * 6 * open, fy + Math.sin(a) * 6 * open, 4.2 * open, 2.6 * open, a, 0, TAU);
        ctx.fill();
      }
      ctx.fillStyle = '#d98a2f';
      ctx.beginPath();
      ctx.arc(fx, fy, 3.3 * open, 0, TAU);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 245, 190, .65)';
      ctx.beginPath();
      ctx.arc(fx - 1, fy - 1, 1.1, 0, TAU);
      ctx.fill();
    }
  }
  // ripe sparkle
  if (stage >= 3) {
    const sp = .5 + Math.sin(t * 3 + p.sway) * .5;
    ctx.fillStyle = `rgba(255, 231, 151, ${.35 + sp * .5})`;
    for (const [sx, sy, ss] of [[-18, -20, 2.4], [16, -28, 1.8], [20, -8, 1.4]]) {
      ctx.beginPath();
      ctx.arc(sx + sway * .4, sy, ss, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();
}

/* ---------------- trees & rocks ---------------- */
export function drawTree(ctx, node, t, deco = false) {
  const s = node.size || node.s || 1;
  const x = node.x;
  const y = node.y;
  const sway = Math.sin(t * .9 + (node.sway || 0)) * 2.2;
  const shake = node.shake > 0 ? Math.sin(node.shake * 45) * node.shake * 9 : 0;
  ctx.save();
  ctx.translate(x + shake, y);
  // shadow
  ctx.fillStyle = 'rgba(35, 48, 27, .26)';
  ctx.beginPath();
  ctx.ellipse(4 * s, 3 * s, 28 * s, 9 * s, 0, 0, TAU);
  ctx.fill();

  if (node.alive === false) {
    // stump
    ctx.fillStyle = '#6f4c2a';
    rr(ctx, -10 * s, -15 * s, 20 * s, 16 * s, 4);
    ctx.fill();
    ctx.fillStyle = '#c49a61';
    ctx.beginPath();
    ctx.ellipse(0, -15 * s, 10 * s, 4.5 * s, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = '#8b6438';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, -15 * s, 5.5 * s, 2.4 * s, 0, 0, TAU);
    ctx.stroke();
    ctx.restore();
    return;
  }

  // trunk
  const trunk = ctx.createLinearGradient(-8 * s, 0, 8 * s, 0);
  trunk.addColorStop(0, '#5e4024');
  trunk.addColorStop(.45, '#8d6237');
  trunk.addColorStop(1, '#5a3d22');
  ctx.fillStyle = trunk;
  ctx.beginPath();
  ctx.moveTo(-8 * s, 2);
  ctx.quadraticCurveTo(-6 * s, -26 * s, -4 * s, -44 * s);
  ctx.lineTo(4 * s, -44 * s);
  ctx.quadraticCurveTo(6 * s, -26 * s, 8 * s, 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(54, 36, 18, .4)';
  ctx.lineWidth = .8;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(-3 * s + i * 3 * s, -3);
    ctx.quadraticCurveTo(-4 * s + i * 2 * s, -20 * s, -2 * s + i * 2 * s, -38 * s);
    ctx.stroke();
  }
  // roots
  ctx.strokeStyle = '#6a4928';
  ctx.lineWidth = 2.2 * s;
  ctx.beginPath();
  ctx.moveTo(-7 * s, 0);
  ctx.quadraticCurveTo(-13 * s, 1, -17 * s, 4);
  ctx.moveTo(7 * s, 0);
  ctx.quadraticCurveTo(13 * s, 1, 18 * s, 3);
  ctx.stroke();
  // axe cuts
  if (!deco && node.hp < node.maxHp) {
    ctx.strokeStyle = 'rgba(238, 219, 180, .75)';
    ctx.lineWidth = 1.4;
    for (let i = 0; i < node.maxHp - node.hp; i++) {
      ctx.beginPath();
      ctx.moveTo(2 * s, -12 * s - i * 7 * s);
      ctx.lineTo(8 * s, -8 * s - i * 7 * s);
      ctx.stroke();
    }
  }

  // canopy
  const cy = -55 * s;
  const blobs = [
    [-17, 8, 20, 17], [17, 7, 21, 18], [0, -8, 26, 22], [-9, 19, 19, 15],
    [12, 21, 17, 14], [0, 8, 29, 22],
  ];
  ctx.save();
  ctx.translate(sway * .6, 0);
  for (let i = 0; i < blobs.length; i++) {
    const [bx, by, brx, bry] = blobs[i];
    const g = ctx.createRadialGradient(
      bx * s - brx * .35, cy + by * s - bry * .4, 2,
      bx * s, cy + by * s, brx * s
    );
    const dark = i > 3;
    g.addColorStop(0, dark ? '#5a8c4c' : '#78aa5c');
    g.addColorStop(.72, dark ? '#467a43' : '#5f974e');
    g.addColorStop(1, dark ? '#356237' : '#4a803f');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(bx * s, cy + by * s, brx * s, bry * s, (hash(i, x) - .5) * .5, 0, TAU);
    ctx.fill();
  }
  // leaf highlights
  ctx.fillStyle = 'rgba(177, 208, 126, .42)';
  for (const [hx, hy, hr] of [[-18, -18, 4.2], [-7, -26, 3.2], [12, -18, 3.6], [2, -5, 2.8], [20, 2, 2.4]]) {
    ctx.beginPath();
    ctx.arc(hx * s + sway * .8, cy + hy * s, hr * s, 0, TAU);
    ctx.fill();
  }
  // tiny fruit / golden leaves
  if (hash(x, y) > .62) {
    ctx.fillStyle = 'rgba(232, 186, 82, .8)';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc((hash(i, x) - .5) * 44 * s, cy + (hash(i, y) - .5) * 32 * s, 1.6 * s, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();
  ctx.restore();
}

export function drawRock(ctx, node, t) {
  const x = node.x;
  const y = node.y;
  const isCrystal = node.resource === 'crystal';
  const isIron = node.resource === 'iron';
  const shake = node.shake > 0 ? Math.sin(node.shake * 55) * node.shake * 8 : 0;
  const s = node.size || 1;
  ctx.save();
  ctx.translate(x + shake, y);
  ctx.fillStyle = 'rgba(35, 40, 30, .26)';
  ctx.beginPath();
  ctx.ellipse(3, 2, 25 * s, 8 * s, 0, 0, TAU);
  ctx.fill();

  if (!node.alive) {
    ctx.fillStyle = '#7f8178';
    for (const [rx, ry, rr2] of [[-10, 0, 5], [6, -2, 6], [14, 2, 4], [-2, 3, 3.5]]) {
      ctx.beginPath();
      ctx.ellipse(rx, ry, rr2, rr2 * .65, 0, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  const base = isCrystal ? '#6d6296' : isIron ? '#8b8378' : '#92978f';
  const dark = isCrystal ? '#453b6e' : isIron ? '#5d554b' : '#5d645c';
  const light = isCrystal ? '#b4a5e8' : isIron ? '#b9a68c' : '#c3c7bd';

  ctx.beginPath();
  ctx.moveTo(-23 * s, 0);
  ctx.lineTo(-19 * s, -18 * s);
  ctx.lineTo(-7 * s, -30 * s);
  ctx.lineTo(10 * s, -28 * s);
  ctx.lineTo(22 * s, -15 * s);
  ctx.lineTo(19 * s, 0);
  ctx.closePath();
  const g = ctx.createLinearGradient(-20 * s, -30 * s, 20 * s, 2);
  g.addColorStop(0, light);
  g.addColorStop(.5, base);
  g.addColorStop(1, dark);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = dark;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // facets
  ctx.strokeStyle = 'rgba(48, 50, 43, .3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-7 * s, -30 * s);
  ctx.lineTo(-3 * s, -10 * s);
  ctx.lineTo(7 * s, 0);
  ctx.moveTo(10 * s, -28 * s);
  ctx.lineTo(3 * s, -11 * s);
  ctx.lineTo(-3 * s, -10 * s);
  ctx.moveTo(22 * s, -15 * s);
  ctx.lineTo(3 * s, -11 * s);
  ctx.stroke();

  if (isIron) {
    ctx.strokeStyle = 'rgba(168, 95, 55, .65)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-15 * s, -20 * s);
    ctx.lineTo(-7 * s, -12 * s);
    ctx.lineTo(-10 * s, -4 * s);
    ctx.moveTo(5 * s, -22 * s);
    ctx.lineTo(12 * s, -15 * s);
    ctx.stroke();
    ctx.fillStyle = 'rgba(198, 126, 72, .55)';
    ctx.beginPath();
    ctx.arc(13 * s, -18 * s, 2.4 * s, 0, TAU);
    ctx.fill();
  }
  if (isCrystal) {
    const pulse = .55 + Math.sin(t * 2 + x) * .2;
    for (const [cx, cy2, h, w] of [[-6, -24, 20, 4.2], [6, -26, 24, 4.8], [14, -20, 16, 3.4]]) {
      ctx.beginPath();
      ctx.moveTo(cx * s, (cy2 - h) * s);
      ctx.lineTo((cx + w) * s, (cy2 - h * .45) * s);
      ctx.lineTo((cx + w * .5) * s, (cy2 + 2) * s);
      ctx.lineTo((cx - w * .5) * s, (cy2 + 2) * s);
      ctx.lineTo((cx - w) * s, (cy2 - h * .45) * s);
      ctx.closePath();
      ctx.fillStyle = `rgba(174, 153, 235, ${pulse + .22})`;
      ctx.fill();
      ctx.strokeStyle = '#5f4c9f';
      ctx.lineWidth = .9;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(237, 227, 255, .65)';
      ctx.beginPath();
      ctx.moveTo(cx * s, (cy2 - h) * s);
      ctx.lineTo((cx - w * .4) * s, (cy2 - h * .35) * s);
      ctx.stroke();
    }
  }
  // cracks by damage
  const dmg = node.maxHp - node.hp;
  if (dmg > 0) {
    ctx.strokeStyle = 'rgba(45, 45, 38, .5)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < dmg; i++) {
      ctx.beginPath();
      ctx.moveTo((-6 + i * 6) * s, -22 * s);
      ctx.lineTo((-2 + i * 5) * s, -14 * s);
      ctx.lineTo((-5 + i * 4) * s, -7 * s);
      ctx.stroke();
    }
  }
  ctx.restore();
}

/* ---------------- small props ---------------- */
export function drawBush(ctx, b, t) {
  const s = b.s || 1;
  const sway = Math.sin(t * 1.3 + b.x) * 1.1;
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.fillStyle = 'rgba(32, 46, 26, .22)';
  ctx.beginPath();
  ctx.ellipse(2, 2, 20 * s, 6 * s, 0, 0, TAU);
  ctx.fill();
  for (const [bx, by, br, col] of [[-9, -8, 12, '#4c7a43'], [8, -9, 13, '#548448'], [0, -15, 14, '#5f914f'], [-3, -4, 12, '#46723e']]) {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(bx * s + sway * .4, by * s, br * s, br * .82 * s, 0, 0, TAU);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(163, 198, 116, .4)';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc((hash(i, b.x) - .5) * 22 * s, -11 * s + (hash(i, b.y) - .5) * 12 * s, 1.7 * s, 0, TAU);
    ctx.fill();
  }
  if (hash(b.x, b.y) > .55) {
    ctx.fillStyle = '#d77c75';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc((hash(i + 9, b.x) - .5) * 22 * s, -9 * s + (hash(i + 4, b.y) - .5) * 12 * s, 1.7 * s, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();
}

export function drawHay(ctx, o) {
  const s = o.s || 1;
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.fillStyle = 'rgba(40, 34, 18, .22)';
  ctx.beginPath();
  ctx.ellipse(2, 2, 17 * s, 6 * s, 0, 0, TAU);
  ctx.fill();
  const g = ctx.createLinearGradient(0, -22 * s, 0, 0);
  g.addColorStop(0, '#d7b45f');
  g.addColorStop(1, '#a8813b');
  ctx.fillStyle = g;
  rr(ctx, -16 * s, -22 * s, 32 * s, 22 * s, 6 * s);
  ctx.fill();
  ctx.strokeStyle = 'rgba(132, 95, 39, .5)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(-14 * s, -19 * s + i * 3.2 * s);
    ctx.lineTo(14 * s, -18 * s + i * 3.2 * s);
    ctx.stroke();
  }
  ctx.strokeStyle = '#7d5c2d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-16 * s, -15 * s);
  ctx.lineTo(16 * s, -15 * s);
  ctx.moveTo(-16 * s, -7 * s);
  ctx.lineTo(16 * s, -7 * s);
  ctx.stroke();
  ctx.restore();
}

export function drawCrate(ctx, o) {
  const s = o.s || 1;
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.fillStyle = 'rgba(38, 30, 18, .22)';
  ctx.beginPath();
  ctx.ellipse(2, 2, 16 * s, 5 * s, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#a87b49';
  rr(ctx, -15 * s, -25 * s, 30 * s, 25 * s, 2);
  ctx.fill();
  ctx.strokeStyle = '#76522c';
  ctx.lineWidth = 1.4;
  rr(ctx, -15 * s, -25 * s, 30 * s, 25 * s, 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(111, 76, 38, .55)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-15 * s, -12 * s);
  ctx.lineTo(15 * s, -12 * s);
  ctx.moveTo(-2 * s, -25 * s);
  ctx.lineTo(-2 * s, 0);
  ctx.stroke();
  ctx.fillStyle = 'rgba(232, 200, 145, .35)';
  ctx.fillRect(-15 * s, -25 * s, 30 * s, 2);
  ctx.restore();
}

export function drawBarrel(ctx, o) {
  const s = o.s || 1;
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.fillStyle = 'rgba(38, 30, 18, .22)';
  ctx.beginPath();
  ctx.ellipse(2, 2, 13 * s, 5 * s, 0, 0, TAU);
  ctx.fill();
  const g = ctx.createLinearGradient(-12 * s, 0, 12 * s, 0);
  g.addColorStop(0, '#74502e');
  g.addColorStop(.45, '#a57644');
  g.addColorStop(1, '#6c4928');
  ctx.fillStyle = g;
  rr(ctx, -12 * s, -26 * s, 24 * s, 26 * s, 7 * s);
  ctx.fill();
  ctx.fillStyle = '#8a6137';
  ctx.beginPath();
  ctx.ellipse(0, -26 * s, 12 * s, 4.2 * s, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = '#5b3d20';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, -26 * s, 12 * s, 4.2 * s, 0, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = '#5a4e3c';
  ctx.lineWidth = 2;
  for (const yy of [-20, -12, -4]) {
    ctx.beginPath();
    ctx.ellipse(0, yy * s, 12 * s, 3 * s, 0, 0, Math.PI);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawStump(ctx, o) {
  const s = o.s || 1;
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.fillStyle = 'rgba(40, 32, 18, .2)';
  ctx.beginPath();
  ctx.ellipse(2, 2, 12 * s, 4 * s, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#6f4c2a';
  rr(ctx, -9 * s, -13 * s, 18 * s, 14 * s, 3);
  ctx.fill();
  ctx.fillStyle = '#c59a61';
  ctx.beginPath();
  ctx.ellipse(0, -13 * s, 9 * s, 4 * s, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = '#8b6438';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, -13 * s, 4.5 * s, 2 * s, 0, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

export function drawBoulder(ctx, o) {
  const s = o.s || 1;
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.fillStyle = 'rgba(35, 40, 30, .22)';
  ctx.beginPath();
  ctx.ellipse(2, 2, 20 * s, 6 * s, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-18 * s, 0);
  ctx.lineTo(-14 * s, -14 * s);
  ctx.lineTo(-3 * s, -22 * s);
  ctx.lineTo(12 * s, -18 * s);
  ctx.lineTo(18 * s, -6 * s);
  ctx.lineTo(13 * s, 0);
  ctx.closePath();
  const g = ctx.createLinearGradient(-15 * s, -20 * s, 14 * s, 0);
  g.addColorStop(0, '#aab0a6');
  g.addColorStop(1, '#71786f');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = '#626960';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(70, 78, 68, .35)';
  ctx.beginPath();
  ctx.moveTo(-4 * s, -21 * s);
  ctx.lineTo(-1 * s, -8 * s);
  ctx.lineTo(8 * s, 0);
  ctx.stroke();
  ctx.restore();
}

export function drawMushrooms(ctx, o) {
  const s = o.s || 1;
  ctx.save();
  ctx.translate(o.x, o.y);
  for (const [mx, my, ms, col] of [[-7, 0, 1, '#b85c4d'], [4, -2, .8, '#c47a58'], [11, 1, .7, '#a94f45']]) {
    ctx.strokeStyle = '#e3d6b6';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(mx * s, my * s);
    ctx.lineTo(mx * s, (my - 6 * ms) * s);
    ctx.stroke();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(mx * s, (my - 6 * ms) * s, 4.6 * ms * s, 2.6 * ms * s, 0, Math.PI, TAU);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 234, 214, .6)';
    ctx.beginPath();
    ctx.arc((mx - 1) * s, (my - 7 * ms) * s, .8 * s, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

export function drawReeds(ctx, o) {
  const s = o.s || 1;
  ctx.save();
  ctx.translate(o.x, o.y);
  for (let i = 0; i < 9; i++) {
    const x = (hash(i, o.x) - .5) * 22 * s;
    const h = (10 + hash(i, o.y) * 18) * s;
    ctx.strokeStyle = i % 3 ? '#5e7c44' : '#78904f';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, 2);
    ctx.quadraticCurveTo(x + 3, -h * .6, x + (hash(i + 2, o.x) - .5) * 8, -h);
    ctx.stroke();
    if (i % 4 === 0) {
      ctx.fillStyle = '#8a6337';
      ctx.beginPath();
      ctx.ellipse(x + 1, -h, 1.5, 3.4, .15, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();
}

export function drawLily(ctx, o) {
  const s = o.s || 1;
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.fillStyle = 'rgba(54, 92, 57, .8)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 10 * s, 5.5 * s, .2, .4, TAU);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(35, 70, 40, .5)';
  ctx.lineWidth = .8;
  ctx.stroke();
  ctx.restore();
}

export function drawDecor(ctx, d, t) {
  switch (d.type) {
    case 'hay': drawHay(ctx, d); break;
    case 'crate': drawCrate(ctx, d); break;
    case 'barrel': drawBarrel(ctx, d); break;
    case 'stump': drawStump(ctx, d); break;
    case 'boulder': drawBoulder(ctx, d); break;
    case 'mushrooms': drawMushrooms(ctx, d); break;
    case 'reeds': drawReeds(ctx, d); break;
    case 'lily': drawLily(ctx, d); break;
  }
}

/* ---------------- interaction ring ---------------- */
export function drawTargetRing(ctx, x, y, r, t, color = 'rgba(240, 205, 122,') {
  const pulse = .5 + Math.sin(t * 3.2) * .5;
  ctx.save();
  ctx.strokeStyle = `${color} ${.45 + pulse * .35})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * .4, 0, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = `${color} ${.15 + pulse * .15})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x, y, r + 4, (r + 4) * .4, 0, 0, TAU);
  ctx.stroke();
  ctx.restore();
}
