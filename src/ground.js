/* ============================================================
   IRONROOT & IVY — static ground painting
   ============================================================ */
import { WORLD, GROUND_SCALE, mulberry32, TAU, rr, ellipsePath } from './data.js';

function strokePath(g, pts, width, color) {
  g.strokeStyle = color;
  g.lineWidth = width;
  g.beginPath();
  g.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
  g.stroke();
}

function paintPath(g, pts, width, rng) {
  g.save();
  g.lineCap = 'round';
  g.lineJoin = 'round';
  strokePath(g, pts, width + 18, 'rgba(91, 74, 48, .16)');
  strokePath(g, pts, width + 10, '#a78c60');
  strokePath(g, pts, width, '#bea374');
  strokePath(g, pts, width * 0.58, 'rgba(211, 188, 146, .55)');
  g.restore();

  // pebbles & worn edges
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const steps = Math.floor(len / 15);
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const x = a.x + (b.x - a.x) * t + (rng() - .5) * width * .92;
      const y = a.y + (b.y - a.y) * t + (rng() - .5) * width * .92;
      const r = .6 + rng() * 1.8;
      g.fillStyle = rng() > .5 ? 'rgba(140, 116, 80, .35)' : 'rgba(228, 210, 172, .4)';
      g.beginPath();
      g.arc(x, y, r, 0, TAU);
      g.fill();
    }
  }
}

function flower(g, x, y, color, size, rng) {
  g.fillStyle = 'rgba(45, 78, 45, .32)';
  g.beginPath();
  g.ellipse(x + 1, y + 2, size * 1.3, size * .6, 0, 0, TAU);
  g.fill();
  g.fillStyle = color;
  for (let p = 0; p < 5; p++) {
    const a = (p / 5) * TAU + rng() * .3;
    g.beginPath();
    g.arc(x + Math.cos(a) * size * .7, y + Math.sin(a) * size * .7, size * .55, 0, TAU);
    g.fill();
  }
  g.fillStyle = 'rgba(250, 224, 140, .95)';
  g.beginPath();
  g.arc(x, y, size * .38, 0, TAU);
  g.fill();
}

function grassBlade(g, x, y, h, color, lean) {
  g.strokeStyle = color;
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + lean * .4, y - h * .55, x + lean, y - h);
  g.stroke();
}

function drawFence(g, x, y, w, h) {
  const post = (px, py) => {
    g.fillStyle = 'rgba(58, 48, 28, .22)';
    g.beginPath();
    g.ellipse(px + 3, py + 2, 7, 3, 0, 0, TAU);
    g.fill();
    g.fillStyle = '#9a7244';
    g.fillRect(px - 3, py - 20, 6, 23);
    g.fillStyle = '#c39a62';
    g.fillRect(px - 3, py - 20, 2, 23);
    g.fillStyle = '#6e4e2b';
    g.beginPath();
    g.moveTo(px - 4, py - 20);
    g.lineTo(px, py - 25);
    g.lineTo(px + 4, py - 20);
    g.closePath();
    g.fill();
  };
  // rails
  g.strokeStyle = '#b98e57';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(x + 8, y - 13);
  g.lineTo(x + w - 8, y - 13);
  g.moveTo(x + 8, y - 6);
  g.lineTo(x + w - 8, y - 6);
  g.stroke();
  g.strokeStyle = 'rgba(255, 236, 198, .35)';
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(x + 8, y - 14.5);
  g.lineTo(x + w - 8, y - 14.5);
  g.stroke();
  for (let px = x + 8; px <= x + w - 4; px += 32) post(px, y);
  if (h) {
    for (let py = y; py <= y + h; py += 32) {
      post(x, py);
      post(x + w, py);
    }
    g.strokeStyle = '#b98e57';
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(x, y - 12);
    g.lineTo(x, y + h - 4);
    g.moveTo(x + w, y - 12);
    g.lineTo(x + w, y + h - 4);
    g.stroke();
  }
}

function drawPond(g, pond, rng) {
  const { x, y, rx, ry } = pond;
  g.save();
  // mud bank
  ellipsePath(g, x, y, rx + 24, ry + 20);
  g.fillStyle = '#8b7a55';
  g.fill();
  ellipsePath(g, x, y, rx + 13, ry + 11);
  g.fillStyle = '#a29168';
  g.fill();
  ellipsePath(g, x, y, rx, ry);
  const grad = g.createRadialGradient(x - rx * .3, y - ry * .35, 20, x, y, rx);
  grad.addColorStop(0, '#71aab0');
  grad.addColorStop(.55, '#4e8b99');
  grad.addColorStop(1, '#386c7d');
  g.fillStyle = grad;
  g.fill();
  // ripples
  g.strokeStyle = 'rgba(213, 240, 236, .25)';
  g.lineWidth = 1.2;
  for (let i = 0; i < 9; i++) {
    const rx2 = 24 + rng() * (rx - 40);
    const ry2 = 6 + rng() * (ry - 20);
    g.beginPath();
    g.ellipse(x + (rng() - .5) * rx * 1.1, y + (rng() - .5) * ry * 1.1, rx2, ry2 * .18, 0, 0, TAU);
    g.stroke();
  }
  // lily pads
  const lilies = [[-96, -32], [60, 38], [-38, 52], [118, -44], [8, -66]];
  for (const [lx, ly] of lilies) {
    const px = x + lx, py = y + ly;
    g.fillStyle = '#5f945c';
    g.beginPath();
    g.ellipse(px, py, 13, 8, rng() * TAU, .35, TAU);
    g.closePath();
    g.fill();
    g.strokeStyle = 'rgba(43, 82, 49, .4)';
    g.lineWidth = .8;
    g.stroke();
    if (rng() > .6) {
      g.fillStyle = '#f2c1cf';
      g.beginPath();
      g.arc(px + 2, py - 2, 2.3, 0, TAU);
      g.fill();
    }
  }
  // reeds
  for (let i = 0; i < 20; i++) {
    const a = rng() * TAU;
    const px = x + Math.cos(a) * (rx + 6 + rng() * 18);
    const py = y + Math.sin(a) * (ry + 4 + rng() * 14);
    g.strokeStyle = i % 3 === 0 ? '#5e7c44' : '#78904f';
    g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(px, py + 4);
    g.quadraticCurveTo(px + (rng() - .5) * 7, py - 10, px + (rng() - .5) * 12, py - 20 - rng() * 8);
    g.stroke();
    if (i % 4 === 0) {
      g.fillStyle = '#8a6337';
      g.beginPath();
      g.ellipse(px + 1, py - 22, 1.8, 4, .2, 0, TAU);
      g.fill();
    }
  }
  g.restore();
}

function drawShopFloor(g, x, y, w, h) {
  g.save();
  g.fillStyle = 'rgba(40, 32, 18, .22)';
  rr(g, x + 5, y + 7, w, h, 10);
  g.fill();
  rr(g, x, y, w, h, 8);
  const grad = g.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, '#b58d58');
  grad.addColorStop(1, '#9a7446');
  g.fillStyle = grad;
  g.fill();
  g.strokeStyle = 'rgba(83, 58, 30, .38)';
  g.lineWidth = 1;
  for (let py = y + 18; py < y + h; py += 24) {
    g.beginPath();
    g.moveTo(x + 6, py);
    g.lineTo(x + w - 6, py);
    g.stroke();
    for (let px = x + 20; px < x + w - 10; px += 48) {
      g.fillStyle = 'rgba(70, 47, 22, .22)';
      g.beginPath();
      g.arc(px + (py % 48), py + 9, 1.1, 0, TAU);
      g.fill();
    }
  }
  // green rug under pedestals
  g.fillStyle = 'rgba(30, 54, 35, .28)';
  rr(g, x + 54, y + 168, w - 108, 112, 8);
  g.fill();
  g.fillStyle = 'rgba(64, 96, 62, .55)';
  rr(g, x + 58, y + 172, w - 116, 104, 6);
  g.fill();
  g.strokeStyle = 'rgba(217, 186, 118, .35)';
  g.lineWidth = 1.4;
  rr(g, x + 66, y + 180, w - 132, 88, 4);
  g.stroke();
  // edge trim
  g.strokeStyle = 'rgba(74, 51, 25, .55)';
  g.lineWidth = 2;
  rr(g, x + 1, y + 1, w - 2, h - 2, 8);
  g.stroke();
  g.restore();
}

function drawSignpost(g, x, y, label, angle = 0) {
  g.save();
  g.translate(x, y);
  g.rotate(angle);
  g.fillStyle = 'rgba(40, 31, 18, .22)';
  g.beginPath();
  g.ellipse(3, 2, 9, 3, 0, 0, TAU);
  g.fill();
  g.fillStyle = '#7b5732';
  g.fillRect(-2.5, -20, 5, 23);
  g.fillStyle = '#a87b48';
  rr(g, -34, -40, 68, 20, 3);
  g.fill();
  g.strokeStyle = 'rgba(74, 50, 24, .55)';
  g.lineWidth = 1;
  rr(g, -34, -40, 68, 20, 3);
  g.stroke();
  g.fillStyle = '#4e3a20';
  g.font = 'bold 7px "Avenir Next", sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(label, 0, -29.5);
  g.restore();
}

export function buildGround(world) {
  const c = document.createElement('canvas');
  c.width = Math.round(WORLD.w * GROUND_SCALE);
  c.height = Math.round(WORLD.h * GROUND_SCALE);
  const g = c.getContext('2d');
  g.scale(GROUND_SCALE, GROUND_SCALE);
  const rng = mulberry32(73921);

  // base meadow
  const base = g.createLinearGradient(0, 0, 0, WORLD.h);
  base.addColorStop(0, '#7ca868');
  base.addColorStop(.5, '#6f9d5d');
  base.addColorStop(1, '#618d51');
  g.fillStyle = base;
  g.fillRect(0, 0, WORLD.w, WORLD.h);

  // broad soft patches
  for (let i = 0; i < 120; i++) {
    const x = rng() * WORLD.w, y = rng() * WORLD.h;
    const rx = 60 + rng() * 210, ry = 40 + rng() * 150;
    const grad = g.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
    const tint = rng();
    const col = tint > .62 ? '126, 168, 103' : tint > .3 ? '91, 133, 76' : '143, 180, 111';
    grad.addColorStop(0, `rgba(${col}, .16)`);
    grad.addColorStop(1, `rgba(${col}, 0)`);
    g.fillStyle = grad;
    g.beginPath();
    g.ellipse(x, y, rx, ry, rng() * TAU, 0, TAU);
    g.fill();
  }

  // forest floor + quarry ground
  g.fillStyle = 'rgba(52, 84, 47, .24)';
  g.beginPath();
  g.ellipse(1200, 470, 470, 320, -.05, 0, TAU);
  g.fill();
  g.fillStyle = 'rgba(101, 97, 82, .28)';
  g.beginPath();
  g.moveTo(1620, 840);
  g.quadraticCurveTo(1640, 380, 1850, 300);
  g.quadraticCurveTo(2110, 220, 2240, 420);
  g.quadraticCurveTo(2320, 700, 2130, 830);
  g.quadraticCurveTo(1850, 900, 1620, 840);
  g.fill();

  // paths
  paintPath(g, [{ x: 1220, y: 820 }, { x: 1220, y: 1640 }], 148, rng);
  paintPath(g, [{ x: 500, y: 986 }, { x: 1940, y: 986 }], 126, rng);
  paintPath(g, [{ x: 600, y: 986 }, { x: 600, y: 772 }], 104, rng);
  paintPath(g, [{ x: 1862, y: 986 }, { x: 1988, y: 700 }], 98, rng);
  paintPath(g, [{ x: 1220, y: 826 }, { x: 1220, y: 600 }], 96, rng);

  // meadow grass blades
  const bladeColors = ['rgba(64, 104, 54, .4)', 'rgba(104, 148, 82, .45)', 'rgba(139, 174, 105, .38)', 'rgba(52, 90, 48, .3)'];
  for (let i = 0; i < 5200; i++) {
    const x = rng() * WORLD.w, y = rng() * WORLD.h;
    if (Math.hypot(x - 1220, y - 1450) < 300) continue;
    const h = 2 + rng() * 5;
    grassBlade(g, x, y, h, bladeColors[(rng() * bladeColors.length) | 0], (rng() - .5) * 4);
  }

  // wildflowers
  const flowerCols = ['#f4df9d', '#f0b3c4', '#c7b9ef', '#f2f0dc', '#e7a67a'];
  for (let i = 0; i < 680; i++) {
    const x = rng() * WORLD.w, y = rng() * WORLD.h;
    if (Math.hypot(x - 1220, y - 1450) < 250) continue;
    if (Math.abs(x - 1220) < 90 && y > 800) continue;
    if (Math.abs(y - 986) < 70 && x > 480 && x < 1960) continue;
    if (x > 360 && x < 880 && y > 550 && y < 760) continue;
    flower(g, x, y, flowerCols[(rng() * flowerCols.length) | 0], 1.1 + rng() * 1.6, rng);
  }

  // little stones in the meadow
  for (let i = 0; i < 110; i++) {
    const x = rng() * WORLD.w, y = rng() * WORLD.h;
    g.fillStyle = `rgba(${120 + rng() * 40}, ${118 + rng() * 36}, ${100 + rng() * 34}, .55)`;
    g.beginPath();
    g.ellipse(x, y, 1.5 + rng() * 3.4, 1 + rng() * 2.4, rng() * TAU, 0, TAU);
    g.fill();
  }

  // farm soil
  g.save();
  g.fillStyle = 'rgba(66, 52, 30, .22)';
  rr(g, 372, 560, 508, 198, 14);
  g.fill();
  g.fillStyle = '#7c5f3d';
  rr(g, 376, 564, 500, 190, 12);
  g.fill();
  g.fillStyle = 'rgba(111, 84, 52, .8)';
  for (let i = 0; i < 10; i++) {
    g.fillRect(384, 572 + i * 19, 484, 2);
  }
  g.restore();
  // crop patch signs
  drawSignpost(g, 456, 572, 'TURNIP', -.03);
  drawSignpost(g, 620, 572, 'WHEAT', .02);
  drawSignpost(g, 784, 572, 'SUNBLOOM', -.02);

  // farm fence
  drawFence(g, 350, 548, 532, 0);
  drawFence(g, 350, 548, 0, 196);
  drawFence(g, 882, 548, 0, 196);
  drawFence(g, 350, 748, 236, 0);
  drawFence(g, 664, 748, 218, 0);

  // pond
  drawPond(g, world.pond, rng);

  // shop floor
  drawShopFloor(g, 990, 1290, 470, 370);

  // shop path lantern glow pools (subtle static)
  for (const l of world.lanterns) {
    const grad = g.createRadialGradient(l.x, l.y, 2, l.x, l.y, 74);
    grad.addColorStop(0, 'rgba(245, 203, 112, .12)');
    grad.addColorStop(1, 'rgba(245, 203, 112, 0)');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(l.x, l.y, 74, 0, TAU);
    g.fill();
  }

  // signposts
  drawSignpost(g, 1108, 1062, 'SHOP', -.05);
  drawSignpost(g, 1780, 1076, 'QUARRY', .04);
  drawSignpost(g, 658, 1040, 'FARM', -.04);
  drawSignpost(g, 1264, 790, 'OAKWOOD', .03);

  // path-side detail: lantern posts base stones, footprints
  for (let i = 0; i < 60; i++) {
    const x = 1180 + (rng() - .5) * 120;
    const y = 860 + rng() * 720;
    g.fillStyle = 'rgba(104, 82, 52, .16)';
    g.beginPath();
    g.ellipse(x, y, 2.5, 1.2, rng() * .4, 0, TAU);
    g.fill();
  }

  // small hay scatter near barn
  for (let i = 0; i < 24; i++) {
    const x = 470 + rng() * 130, y = 530 + rng() * 24;
    g.strokeStyle = 'rgba(214, 177, 91, .55)';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + (rng() - .5) * 8, y + 2 + rng() * 3);
    g.stroke();
  }

  // border shading
  const edge = g.createRadialGradient(WORLD.w / 2, WORLD.h / 2, 620, WORLD.w / 2, WORLD.h / 2, 1450);
  edge.addColorStop(0, 'rgba(20, 40, 24, 0)');
  edge.addColorStop(1, 'rgba(20, 40, 24, .26)');
  g.fillStyle = edge;
  g.fillRect(0, 0, WORLD.w, WORLD.h);

  return c;
}
