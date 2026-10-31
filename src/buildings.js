/* ============================================================
   IRONROOT & IVY — buildings, shop & landmarks
   ============================================================ */
import { TAU, rr, hash, SHOP } from './data.js';
import { drawWeapon } from './art.js';

function shadow(ctx, x, y, rx, ry, a = .25) {
  ctx.fillStyle = `rgba(32, 40, 26, ${a})`;
  ctx.beginPath();
  ctx.ellipse(x + 4, y + 3, rx, ry, 0, 0, TAU);
  ctx.fill();
}

/* ---------------- barn ---------------- */
export function drawBarn(ctx, b) {
  const { x, y, w, h } = b;
  const base = y + h;
  ctx.save();
  shadow(ctx, x + w / 2, base, w * .55, 15, .22);

  // body
  const body = ctx.createLinearGradient(x, y, x + w, y + h);
  body.addColorStop(0, '#b34e38');
  body.addColorStop(.55, '#9a3f2e');
  body.addColorStop(1, '#7c3327');
  ctx.fillStyle = body;
  rr(ctx, x, y + 56, w, h - 56, 3);
  ctx.fill();
  // plank lines
  ctx.strokeStyle = 'rgba(91, 35, 25, .3)';
  ctx.lineWidth = 1;
  for (let px = x + 10; px < x + w; px += 14) {
    ctx.beginPath();
    ctx.moveTo(px, y + 58);
    ctx.lineTo(px, base - 2);
    ctx.stroke();
  }
  // roof
  ctx.beginPath();
  ctx.moveTo(x - 12, y + 62);
  ctx.lineTo(x + w * .17, y + 10);
  ctx.lineTo(x + w * .5, y + 34);
  ctx.lineTo(x + w * .83, y + 10);
  ctx.lineTo(x + w + 12, y + 62);
  ctx.closePath();
  const roof = ctx.createLinearGradient(0, y + 8, 0, y + 64);
  roof.addColorStop(0, '#5b3c30');
  roof.addColorStop(1, '#3e2a22');
  ctx.fillStyle = roof;
  ctx.fill();
  ctx.strokeStyle = 'rgba(35, 23, 18, .5)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  // roof shingles
  ctx.strokeStyle = 'rgba(142, 103, 78, .22)';
  ctx.lineWidth = 1;
  for (let ry = y + 20; ry < y + 60; ry += 7) {
    ctx.beginPath();
    ctx.moveTo(x - 4 + (ry - y) * .3, ry);
    ctx.lineTo(x + w + 4 - (ry - y) * .3, ry);
    ctx.stroke();
  }
  // white trim
  ctx.strokeStyle = '#e9dcc0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 57);
  ctx.lineTo(x + w, y + 57);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 3, y + 60, w - 6, h - 62);

  // big doors
  const dx = x + w * .31, dw = w * .38, dy = y + 92, dh = h - 94;
  ctx.fillStyle = '#6e2f24';
  rr(ctx, dx, dy, dw, dh, 2);
  ctx.fill();
  ctx.strokeStyle = '#e4d5b5';
  ctx.lineWidth = 2;
  ctx.strokeRect(dx + 2, dy + 2, dw - 4, dh - 4);
  ctx.beginPath();
  ctx.moveTo(dx + dw / 2, dy + 2);
  ctx.lineTo(dx + dw / 2, dy + dh - 2);
  ctx.stroke();
  // door cross braces
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(dx + 4, dy + 6);
  ctx.lineTo(dx + dw / 2 - 4, dy + dh - 8);
  ctx.moveTo(dx + dw - 4, dy + 6);
  ctx.lineTo(dx + dw / 2 + 4, dy + dh - 8);
  ctx.stroke();
  // handles
  ctx.fillStyle = '#d9b45e';
  ctx.beginPath();
  ctx.arc(dx + dw / 2 - 8, dy + dh * .58, 2.4, 0, TAU);
  ctx.arc(dx + dw / 2 + 8, dy + dh * .58, 2.4, 0, TAU);
  ctx.fill();

  // hayloft window
  ctx.fillStyle = '#3d2a20';
  ctx.beginPath();
  ctx.moveTo(x + w / 2 - 16, y + 56);
  ctx.lineTo(x + w / 2 - 16, y + 82);
  ctx.lineTo(x + w / 2 + 16, y + 82);
  ctx.lineTo(x + w / 2 + 16, y + 56);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#e4d5b5';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.strokeStyle = '#c9b48d';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + 58);
  ctx.lineTo(x + w / 2, y + 80);
  ctx.moveTo(x + w / 2 - 14, y + 69);
  ctx.lineTo(x + w / 2 + 14, y + 69);
  ctx.stroke();

  // side window
  ctx.fillStyle = '#f0d99e';
  rr(ctx, x + w - 40, y + 100, 22, 18, 2);
  ctx.fill();
  ctx.strokeStyle = '#5a3b2c';
  ctx.lineWidth = 1.6;
  ctx.strokeRect(x + w - 40, y + 100, 22, 18);
  ctx.beginPath();
  ctx.moveTo(x + w - 29, y + 100);
  ctx.lineTo(x + w - 29, y + 118);
  ctx.stroke();

  // weather vane
  ctx.strokeStyle = '#4a3a2c';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x + w * .5, y + 32);
  ctx.lineTo(x + w * .5, y - 8);
  ctx.stroke();
  ctx.fillStyle = '#c9a24a';
  ctx.beginPath();
  ctx.moveTo(x + w * .5, y - 12);
  ctx.lineTo(x + w * .5 + 14, y - 7);
  ctx.lineTo(x + w * .5, y - 2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + w * .5 - 5, y + 1, 2, 0, TAU);
  ctx.fill();

  // ivy on corner
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = i % 2 ? '#4f7f45' : '#629454';
    ctx.beginPath();
    ctx.ellipse(x + 8 + Math.sin(i) * 4, y + 150 - i * 12, 3.4, 2.2, i, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

/* ---------------- shop ---------------- */
export function drawShopBack(ctx, t) {
  const { x, y, w, h } = SHOP.wall;
  const base = y + h;
  ctx.save();
  shadow(ctx, x + w / 2, base + 2, w * .52, 18, .24);

  // posts
  ctx.fillStyle = '#6f4c2c';
  rr(ctx, x + 2, y + 26, 12, h - 24, 2);
  ctx.fill();
  rr(ctx, x + w - 14, y + 26, 12, h - 24, 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(217, 180, 118, .28)';
  ctx.fillRect(x + 3, y + 28, 3, h - 28);
  ctx.fillRect(x + w - 13, y + 28, 3, h - 28);

  // wall planks
  const wall = ctx.createLinearGradient(0, y + 28, 0, base);
  wall.addColorStop(0, '#a47a4b');
  wall.addColorStop(1, '#8b6238');
  ctx.fillStyle = wall;
  rr(ctx, x + 12, y + 28, w - 24, h - 28, 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(86, 56, 27, .28)';
  ctx.lineWidth = 1;
  for (let px = x + 26; px < x + w - 14; px += 17) {
    ctx.beginPath();
    ctx.moveTo(px, y + 30);
    ctx.lineTo(px, base);
    ctx.stroke();
  }

  // awning
  const ax = x - 22, aw = w + 44, ay = y - 42, ah = 48;
  ctx.save();
  ctx.beginPath();
  ctx.rect(ax, ay, aw, ah + 9);
  ctx.clip();
  for (let i = 0; i < 11; i++) {
    ctx.fillStyle = i % 2 ? '#f0dfba' : '#b65a3f';
    ctx.fillRect(ax + i * (aw / 11), ay, aw / 11 + 1, ah + 8);
  }
  ctx.restore();
  // scalloped hem
  for (let i = 0; i < 11; i++) {
    ctx.fillStyle = i % 2 ? '#f0dfba' : '#b65a3f';
    ctx.beginPath();
    ctx.arc(ax + (i + .5) * (aw / 11), ay + ah + 4, aw / 22, 0, Math.PI);
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(86, 56, 27, .35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(ax + aw, ay);
  ctx.stroke();
  // awning shadow
  const sh = ctx.createLinearGradient(0, ay + ah, 0, ay + ah + 18);
  sh.addColorStop(0, 'rgba(54, 34, 18, .28)');
  sh.addColorStop(1, 'rgba(54, 34, 18, 0)');
  ctx.fillStyle = sh;
  ctx.fillRect(ax, ay + ah + 4, aw, 18);

  // shelves left & right
  for (const sx of [x + 26, x + w - 100]) {
    ctx.fillStyle = '#6b4727';
    ctx.fillRect(sx, y + 92, 72, 5);
    ctx.fillStyle = 'rgba(219, 183, 123, .25)';
    ctx.fillRect(sx, y + 92, 72, 1.5);
    // jars
    for (let i = 0; i < 4; i++) {
      const jx = sx + 7 + i * 17;
      const col = ['#7ca06b', '#c98b56', '#8b79b5', '#d5b260'][i];
      ctx.fillStyle = col;
      rr(ctx, jx, y + 75, 10, 17, 3);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, .3)';
      ctx.fillRect(jx + 2, y + 78, 2, 10);
      ctx.fillStyle = '#6a4a2a';
      ctx.fillRect(jx, y + 72, 10, 3);
    }
  }

  // hanging sign
  const sx = x + 111, sw = 228, sy = y + 54;
  ctx.strokeStyle = '#5c3d20';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(sx + 34, y + 30);
  ctx.lineTo(sx + 34, sy);
  ctx.moveTo(sx + sw - 34, y + 30);
  ctx.lineTo(sx + sw - 34, sy);
  ctx.stroke();
  ctx.fillStyle = 'rgba(45, 30, 14, .25)';
  rr(ctx, sx + 4, sy + 5, sw, 58, 5);
  ctx.fill();
  const sg = ctx.createLinearGradient(sx, sy, sx, sy + 58);
  sg.addColorStop(0, '#3c5940');
  sg.addColorStop(1, '#2b4433');
  ctx.fillStyle = sg;
  rr(ctx, sx, sy, sw, 58, 5);
  ctx.fill();
  ctx.strokeStyle = '#c9a45a';
  ctx.lineWidth = 1.4;
  rr(ctx, sx + 3, sy + 3, sw - 6, 52, 3);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f0dcab';
  ctx.font = '700 17px "Iowan Old Style", Georgia, serif';
  ctx.fillText('IRONROOT', sx + sw / 2, sy + 26);
  ctx.fillStyle = '#d9b469';
  ctx.font = 'italic 11px "Iowan Old Style", Georgia, serif';
  ctx.fillText('& IVY', sx + sw / 2, sy + 42);
  ctx.strokeStyle = 'rgba(217, 180, 105, .6)';
  ctx.lineWidth = .8;
  ctx.beginPath();
  ctx.moveTo(sx + 72, sy + 48);
  ctx.lineTo(sx + sw - 72, sy + 48);
  ctx.stroke();
  // ivy on sign
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 ? '#5d8a4d' : '#4c7742';
    ctx.beginPath();
    ctx.ellipse(sx + 10 + Math.sin(i * 1.7) * 3, sy + 8 + i * 10, 3.2, 2, .7, 0, TAU);
    ctx.fill();
  }

  // hanging lanterns
  for (const lx of [x + 52, x + w - 52]) {
    ctx.strokeStyle = '#4a3520';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(lx, y + 18);
    ctx.lineTo(lx, y + 54);
    ctx.stroke();
    ctx.fillStyle = '#3d3126';
    rr(ctx, lx - 6, y + 54, 12, 15, 2);
    ctx.fill();
    ctx.fillStyle = `rgba(248, 201, 105, ${.65 + Math.sin(t * 2 + lx) * .12})`;
    rr(ctx, lx - 4, y + 57, 8, 9, 1.5);
    ctx.fill();
    ctx.strokeStyle = '#6c512c';
    ctx.lineWidth = 1;
    ctx.strokeRect(lx - 6, y + 54, 12, 15);
  }

  // ivy on posts
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = i % 2 ? '#5c8a4b' : '#48743e';
    const side = i < 5 ? x + 8 : x + w - 8;
    ctx.beginPath();
    ctx.ellipse(side + (i % 5) * 1.2, y + 40 + i * 10, 3.4, 2.1, i * .7, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

export function drawCounter(ctx) {
  const { x, y, w, h } = SHOP.counter;
  const base = y + h;
  ctx.save();
  shadow(ctx, x + w / 2, base, w * .55, 9, .2);
  // front
  const g = ctx.createLinearGradient(0, y, 0, base);
  g.addColorStop(0, '#a87a46');
  g.addColorStop(1, '#7e562e');
  ctx.fillStyle = g;
  rr(ctx, x, y + 7, w, h - 7, 3);
  ctx.fill();
  // top
  ctx.fillStyle = '#c2965b';
  rr(ctx, x - 5, y, w + 10, 11, 3);
  ctx.fill();
  ctx.strokeStyle = 'rgba(86, 56, 27, .5)';
  ctx.lineWidth = 1;
  rr(ctx, x - 5, y, w + 10, 11, 3);
  ctx.stroke();
  // panels
  ctx.strokeStyle = 'rgba(84, 54, 26, .45)';
  for (let i = 0; i < 3; i++) {
    rr(ctx, x + 10 + i * 59, y + 24, 48, h - 31, 2);
    ctx.stroke();
  }
  // bell
  ctx.fillStyle = '#c8a14a';
  ctx.beginPath();
  ctx.moveTo(x + w * .28 - 5, y + 1);
  ctx.quadraticCurveTo(x + w * .28 - 5, y - 7, x + w * .28, y - 7);
  ctx.quadraticCurveTo(x + w * .28 + 5, y - 7, x + w * .28 + 5, y + 1);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8e6924';
  ctx.fillRect(x + w * .28 - 5, y + 1, 10, 1.5);
  // coins
  ctx.fillStyle = '#e2b34e';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(x + w * .68 + i * 2, y - 1 - i * 2.5, 4, 1.8, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = '#a8781f';
    ctx.lineWidth = .6;
    ctx.stroke();
  }
  // mug
  ctx.fillStyle = '#8b6339';
  rr(ctx, x + w * .52, y - 7, 8, 8, 2);
  ctx.fill();
  ctx.strokeStyle = '#8b6339';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(x + w * .52 + 9, y - 3, 3, -.9, .9);
  ctx.stroke();
  ctx.restore();
}

/* ---------------- forge ---------------- */
export function drawForge(ctx, t) {
  const { x, y, w, h } = SHOP.forge;
  const base = y + h;
  ctx.save();
  shadow(ctx, x + w / 2, base, 38, 10, .22);
  // chimney
  ctx.fillStyle = '#6a655c';
  rr(ctx, x + 12, y - 42, 20, 36, 2);
  ctx.fill();
  ctx.strokeStyle = '#4d4a43';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(x + 13, y - 38 + i * 7);
    ctx.lineTo(x + 31, y - 38 + i * 7);
    ctx.stroke();
  }
  // smoke
  for (let i = 0; i < 3; i++) {
    const sy = y - 46 - i * 11 + Math.sin(t * .8 + i) * 3;
    ctx.fillStyle = `rgba(214, 210, 195, ${.16 - i * .04})`;
    ctx.beginPath();
    ctx.arc(x + 22 + Math.sin(t + i) * 5, sy, 5 + i * 2, 0, TAU);
    ctx.fill();
  }
  // furnace body
  const body = ctx.createLinearGradient(x, y, x + w, y + h);
  body.addColorStop(0, '#8f897d');
  body.addColorStop(1, '#6b665d');
  ctx.fillStyle = body;
  rr(ctx, x + 4, y - 8, 48, h + 8, 5);
  ctx.fill();
  ctx.strokeStyle = '#514d46';
  ctx.lineWidth = 1.2;
  rr(ctx, x + 4, y - 8, 48, h + 8, 5);
  ctx.stroke();
  // stone lines
  ctx.strokeStyle = 'rgba(63, 60, 53, .35)';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 3 + i * 12);
    ctx.lineTo(x + 51, y + 3 + i * 12);
    ctx.stroke();
  }
  // fire mouth
  const flick = .7 + Math.sin(t * 7) * .15 + Math.sin(t * 11) * .1;
  const fg = ctx.createRadialGradient(x + 28, y + 36, 1, x + 28, y + 36, 24);
  fg.addColorStop(0, `rgba(255, 236, 167, ${flick})`);
  fg.addColorStop(.45, `rgba(246, 158, 56, ${flick * .9})`);
  fg.addColorStop(1, 'rgba(163, 52, 21, 0)');
  ctx.fillStyle = fg;
  ctx.beginPath();
  ctx.arc(x + 28, y + 38, 26, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#2e2017';
  ctx.beginPath();
  ctx.moveTo(x + 16, y + 48);
  ctx.quadraticCurveTo(x + 17, y + 22, x + 28, y + 20);
  ctx.quadraticCurveTo(x + 39, y + 22, x + 40, y + 48);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = `rgba(248, 169, 64, ${flick})`;
  ctx.beginPath();
  ctx.moveTo(x + 21, y + 48);
  ctx.quadraticCurveTo(x + 22, y + 32, x + 28, y + 29);
  ctx.quadraticCurveTo(x + 34, y + 33, x + 35, y + 48);
  ctx.closePath();
  ctx.fill();
  // anvil
  ctx.fillStyle = '#4e5257';
  rr(ctx, x + 55, y + 38, 26, 10, 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 55, y + 38);
  ctx.lineTo(x + 62, y + 30);
  ctx.lineTo(x + 80, y + 30);
  ctx.lineTo(x + 81, y + 38);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#383b3e';
  ctx.fillRect(x + 62, y + 46, 8, 12);
  ctx.fillRect(x + 57, y + 55, 18, 5);
  // hammer leaning
  ctx.strokeStyle = '#7b5430';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(x + 72, y + 60);
  ctx.lineTo(x + 84, y + 36);
  ctx.stroke();
  ctx.fillStyle = '#7d868c';
  rr(ctx, x + 79, y + 30, 10, 7, 1.5);
  ctx.fill();
  // bucket
  ctx.fillStyle = '#7a5a36';
  rr(ctx, x + 4, y + 50, 13, 12, 2);
  ctx.fill();
  ctx.fillStyle = '#5b8b95';
  ctx.beginPath();
  ctx.ellipse(x + 10.5, y + 50, 6, 2, 0, 0, TAU);
  ctx.fill();
  // sparks
  for (let i = 0; i < 4; i++) {
    const a = t * 3 + i * 1.7;
    ctx.fillStyle = `rgba(255, 196, 92, ${.3 + Math.sin(a * 2) * .2})`;
    ctx.beginPath();
    ctx.arc(x + 28 + Math.cos(a) * (12 + i * 2), y + 34 + Math.sin(a * 1.3) * 14, 1.2, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

/* ---------------- ledger desk ---------------- */
export function drawLedger(ctx, t) {
  const { x, y, w, h } = SHOP.ledger;
  const base = y + h;
  ctx.save();
  shadow(ctx, x + w / 2, base, 30, 8, .2);
  // desk
  ctx.fillStyle = '#8a6038';
  rr(ctx, x, y + 12, w, h - 12, 3);
  ctx.fill();
  ctx.fillStyle = '#b0834d';
  rr(ctx, x - 3, y + 8, w + 6, 9, 2);
  ctx.fill();
  ctx.strokeStyle = '#6a4624';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(x + 5, y + 24, w - 10, h - 27);
  // book
  ctx.fillStyle = '#e8dcc0';
  ctx.beginPath();
  ctx.moveTo(x + 12, y + 7);
  ctx.lineTo(x + 30, y + 3);
  ctx.lineTo(x + 48, y + 7);
  ctx.lineTo(x + 48, y + 14);
  ctx.lineTo(x + 30, y + 11);
  ctx.lineTo(x + 12, y + 14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#b7a480';
  ctx.lineWidth = .8;
  ctx.beginPath();
  ctx.moveTo(x + 30, y + 4);
  ctx.lineTo(x + 30, y + 11);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(90, 70, 40, .45)';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(x + 15, y + 7 + i * 2);
    ctx.lineTo(x + 27, y + 6 + i * 2);
    ctx.moveTo(x + 33, y + 6 + i * 2);
    ctx.lineTo(x + 45, y + 7 + i * 2);
    ctx.stroke();
  }
  // candle
  ctx.fillStyle = '#f0e3c2';
  rr(ctx, x + 50, y - 8, 6, 15, 2);
  ctx.fill();
  ctx.fillStyle = `rgba(255, 205, 105, ${.8 + Math.sin(t * 6) * .1})`;
  ctx.beginPath();
  ctx.ellipse(x + 53, y - 12, 2.4, 4, 0, 0, TAU);
  ctx.fill();
  const glow = ctx.createRadialGradient(x + 53, y - 12, 0, x + 53, y - 12, 30);
  glow.addColorStop(0, 'rgba(255, 205, 105, .28)');
  glow.addColorStop(1, 'rgba(255, 205, 105, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + 53, y - 12, 30, 0, TAU);
  ctx.fill();
  // ink pot & quill
  ctx.fillStyle = '#3d4650';
  ctx.beginPath();
  ctx.ellipse(x + 40, y + 4, 4.4, 2.2, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = '#e5dbc2';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x + 40, y + 3);
  ctx.quadraticCurveTo(x + 44, y - 10, x + 51, y - 18);
  ctx.stroke();
  ctx.fillStyle = '#e5dbc2';
  ctx.beginPath();
  ctx.ellipse(x + 51, y - 18, 2.4, 4.5, -.5, 0, TAU);
  ctx.fill();
  ctx.restore();
}

/* ---------------- display pedestals ---------------- */
export function drawPedestal(ctx, ped, index, t) {
  const x = ped.x, y = ped.y;
  ctx.save();
  shadow(ctx, x, y + 10, 24, 8, .2);

  // base
  const g = ctx.createLinearGradient(x - 20, y, x + 20, y + 12);
  g.addColorStop(0, '#9a9588');
  g.addColorStop(1, '#6d6a61');
  ctx.fillStyle = g;
  rr(ctx, x - 21, y - 2, 42, 16, 4);
  ctx.fill();
  ctx.strokeStyle = 'rgba(70, 68, 60, .5)';
  ctx.lineWidth = 1;
  rr(ctx, x - 21, y - 2, 42, 16, 4);
  ctx.stroke();
  // wood top
  ctx.fillStyle = '#a87a46';
  rr(ctx, x - 24, y - 10, 48, 10, 3);
  ctx.fill();
  ctx.fillStyle = '#c49a62';
  rr(ctx, x - 24, y - 10, 48, 3, 2);
  ctx.fill();
  // cushion
  ctx.fillStyle = ped.weapon ? '#a34b3e' : '#5d6f54';
  rr(ctx, x - 18, y - 15, 36, 7, 3);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, .16)';
  rr(ctx, x - 16, y - 14, 32, 2, 1);
  ctx.fill();

  if (!ped.unlocked) {
    // dust cloth
    ctx.fillStyle = '#d8c9a8';
    ctx.beginPath();
    ctx.moveTo(x - 22, y - 12);
    ctx.quadraticCurveTo(x - 8, y - 34, x + 4, y - 30);
    ctx.quadraticCurveTo(x + 17, y - 26, x + 22, y - 10);
    ctx.lineTo(x + 16, y + 1);
    ctx.lineTo(x - 16, y + 1);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(150, 130, 96, .5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // rope
    ctx.strokeStyle = '#8a6538';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x - 19, y - 8);
    ctx.quadraticCurveTo(x, y - 2, x + 19, y - 8);
    ctx.stroke();
    // lock
    ctx.fillStyle = '#b08b3f';
    rr(ctx, x - 5, y - 7, 10, 8, 1.5);
    ctx.fill();
    ctx.strokeStyle = '#7d5e22';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, y - 8, 3, Math.PI, 0);
    ctx.stroke();
    // sign
    ctx.fillStyle = '#4f4130';
    ctx.font = '700 6px "Avenir Next", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LEDGER', x, y + 24);
  } else if (ped.weapon) {
    const float = Math.sin(t * 2 + index) * 2.5;
    // glow
    const glow = ctx.createRadialGradient(x, y - 38, 2, x, y - 38, 32);
    glow.addColorStop(0, 'rgba(238, 198, 104, .2)');
    glow.addColorStop(1, 'rgba(238, 198, 104, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y - 38, 32, 0, TAU);
    ctx.fill();
    drawWeapon(ctx, ped.weapon, x, y - 37 + float, 1.06, Math.sin(t * .7 + index) * .05, { glow: true });
    // sparkles
    for (let i = 0; i < 2; i++) {
      const a = t * 1.4 + i * 2.4 + index;
      ctx.fillStyle = `rgba(255, 231, 158, ${.35 + Math.sin(a * 2) * .25})`;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * 19, y - 38 + Math.sin(a * 1.3) * 17, 1.4, 0, TAU);
      ctx.fill();
    }
  } else {
    // empty marker
    ctx.strokeStyle = 'rgba(240, 205, 122, .55)';
    ctx.lineWidth = 1.3;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(x, y - 36, 14, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(240, 205, 122, .75)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 36);
    ctx.lineTo(x + 6, y - 36);
    ctx.moveTo(x, y - 42);
    ctx.lineTo(x, y - 30);
    ctx.stroke();
  }

  // price tag
  if (ped.unlocked && ped.weapon) {
    const tx = x + 24, ty = y - 22;
    ctx.strokeStyle = '#6c4b28';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 15, y - 12);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.fillStyle = 'rgba(45, 32, 16, .2)';
    rr(ctx, tx + 1, ty - 2, 30, 15, 2);
    ctx.fill();
    ctx.fillStyle = '#efe0bd';
    rr(ctx, tx, ty - 3, 30, 15, 2);
    ctx.fill();
    ctx.strokeStyle = '#b49a68';
    ctx.lineWidth = .8;
    rr(ctx, tx, ty - 3, 30, 15, 2);
    ctx.stroke();
    ctx.fillStyle = '#7a5a22';
    ctx.font = '700 8px "Avenir Next", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(ped.price)}g`, tx + 15, ty + 7);
  }
  // stock pips
  if (ped.unlocked && ped.weapon && ped.qty > 0) {
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i < ped.qty ? 'rgba(240, 205, 122, .9)' : 'rgba(240, 205, 122, .2)';
      ctx.beginPath();
      ctx.arc(x - 8 + i * 8, y + 17, 1.6, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();
}

/* ---------------- well ---------------- */
export function drawWell(ctx, w, t) {
  const { x, y } = w;
  ctx.save();
  shadow(ctx, x, y + 34, 44, 12, .22);
  // stone ring
  ctx.fillStyle = '#8d8a7c';
  ctx.beginPath();
  ctx.ellipse(x, y + 26, 36, 16, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#a5a190';
  ctx.beginPath();
  ctx.ellipse(x, y + 22, 36, 16, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = '#6f6d61';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * 32, y + 22 + Math.sin(a) * 13);
    ctx.lineTo(x + Math.cos(a) * 36, y + 26 + Math.sin(a) * 16);
    ctx.stroke();
  }
  // water
  ctx.fillStyle = '#3c6875';
  ctx.beginPath();
  ctx.ellipse(x, y + 21, 27, 11, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = 'rgba(148, 205, 211, .3)';
  ctx.beginPath();
  ctx.ellipse(x - 8, y + 19, 9, 3, -.2, 0, TAU);
  ctx.fill();
  // posts
  ctx.fillStyle = '#7a5430';
  ctx.fillRect(x - 27, y - 42, 6, 60);
  ctx.fillRect(x + 21, y - 42, 6, 60);
  // roof
  ctx.beginPath();
  ctx.moveTo(x - 38, y - 42);
  ctx.lineTo(x, y - 64);
  ctx.lineTo(x + 38, y - 42);
  ctx.closePath();
  ctx.fillStyle = '#6b4530';
  ctx.fill();
  ctx.strokeStyle = '#4f3324';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  // crossbar & rope
  ctx.strokeStyle = '#5d4024';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(x - 24, y - 36);
  ctx.lineTo(x + 24, y - 36);
  ctx.stroke();
  ctx.strokeStyle = '#c8b48b';
  ctx.lineWidth = 1;
  const swing = Math.sin(t * .7) * 3;
  ctx.beginPath();
  ctx.moveTo(x, y - 36);
  ctx.lineTo(x + swing, y + 2);
  ctx.stroke();
  // bucket
  ctx.fillStyle = '#8d6738';
  rr(ctx, x + swing - 5, y - 2, 10, 9, 2);
  ctx.fill();
  ctx.strokeStyle = '#5f4323';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + swing - 5, y - 2, 10, 9);
  ctx.restore();
}

/* ---------------- windmill ---------------- */
export function drawWindmill(ctx, w, t) {
  const { x, y } = w;
  ctx.save();
  shadow(ctx, x, y + 40, 38, 12, .22);
  // tower
  const g = ctx.createLinearGradient(x - 30, 0, x + 30, 0);
  g.addColorStop(0, '#8f846d');
  g.addColorStop(.5, '#b1a58a');
  g.addColorStop(1, '#7d735f');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - 26, y + 36);
  ctx.lineTo(x - 18, y - 52);
  ctx.lineTo(x + 18, y - 52);
  ctx.lineTo(x + 26, y + 36);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#6a6252';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  // stone lines
  ctx.strokeStyle = 'rgba(90, 84, 70, .3)';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(x - 24 + i * .6, y + 26 - i * 13);
    ctx.lineTo(x + 24 - i * .6, y + 26 - i * 13);
    ctx.stroke();
  }
  // door
  ctx.fillStyle = '#5c4024';
  ctx.beginPath();
  ctx.moveTo(x - 8, y + 36);
  ctx.lineTo(x - 8, y + 18);
  ctx.quadraticCurveTo(x, y + 10, x + 8, y + 18);
  ctx.lineTo(x + 8, y + 36);
  ctx.closePath();
  ctx.fill();
  // window
  ctx.fillStyle = '#efd598';
  ctx.beginPath();
  ctx.arc(x, y - 22, 5.5, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = '#5f4a2e';
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 5.5, y - 22);
  ctx.lineTo(x + 5.5, y - 22);
  ctx.moveTo(x, y - 27.5);
  ctx.lineTo(x, y - 16.5);
  ctx.stroke();
  // cap
  ctx.fillStyle = '#5e4430';
  ctx.beginPath();
  ctx.arc(x, y - 52, 20, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#7c5c3f';
  ctx.beginPath();
  ctx.arc(x, y - 52, 16, Math.PI, 0);
  ctx.fill();
  // blades
  const hub = { x, y: y - 56 };
  const a0 = t * .55;
  ctx.translate(hub.x, hub.y);
  ctx.rotate(a0);
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = 'rgba(72, 55, 35, .3)';
    ctx.fillRect(2, -2.5, 44, 5);
    ctx.fillStyle = '#d9c9a6';
    ctx.beginPath();
    ctx.moveTo(5, -2);
    ctx.lineTo(44, -7);
    ctx.lineTo(48, 0);
    ctx.lineTo(44, 7);
    ctx.lineTo(5, 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#8e7a56';
    ctx.lineWidth = .9;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(120, 100, 70, .55)';
    ctx.beginPath();
    ctx.moveTo(8, -1);
    ctx.lineTo(42, -4);
    ctx.moveTo(8, 1);
    ctx.lineTo(42, 4);
    ctx.stroke();
  }
  ctx.rotate(-a0);
  ctx.fillStyle = '#5b432b';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, TAU);
  ctx.fill();
  ctx.restore();
}

/* ---------------- cave / quarry mouth ---------------- */
export function drawCave(ctx, c, t) {
  const { x, y } = c;
  ctx.save();
  shadow(ctx, x, y + 54, 82, 22, .28);
  // rocks
  const blobs = [
    [-72, 20, 34, 30], [-46, -8, 36, 40], [-8, -28, 44, 42], [38, -12, 34, 36],
    [70, 18, 32, 28], [18, 30, 40, 30], [-38, 34, 38, 26],
  ];
  for (const [bx, by, rx, ry] of blobs) {
    const g = ctx.createLinearGradient(x + bx - rx, y + by - ry, x + bx + rx, y + by + ry);
    g.addColorStop(0, '#9a978c');
    g.addColorStop(1, '#66645c');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x + bx, y + by, rx, ry, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = 'rgba(74, 72, 65, .45)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // opening
  const hole = ctx.createRadialGradient(x, y + 6, 6, x, y + 16, 58);
  hole.addColorStop(0, '#181c1c');
  hole.addColorStop(.7, '#242a28');
  hole.addColorStop(1, '#3b3f38');
  ctx.fillStyle = hole;
  ctx.beginPath();
  ctx.ellipse(x, y + 12, 42, 34, 0, Math.PI, TAU);
  ctx.lineTo(x + 42, y + 46);
  ctx.lineTo(x - 42, y + 46);
  ctx.closePath();
  ctx.fill();
  // crystals in the dark
  for (const [cx, cy, s] of [[-16, 22, 1], [8, 28, .8], [24, 18, .7]]) {
    ctx.fillStyle = `rgba(152, 131, 219, ${.5 + Math.sin(t * 1.6 + cx) * .2})`;
    ctx.beginPath();
    ctx.moveTo(x + cx, y + cy - 12 * s);
    ctx.lineTo(x + cx + 4 * s, y + cy);
    ctx.lineTo(x + cx - 4 * s, y + cy);
    ctx.closePath();
    ctx.fill();
  }
  // wooden supports
  ctx.strokeStyle = '#6d4b2a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - 48, y + 46);
  ctx.lineTo(x - 48, y - 10);
  ctx.lineTo(x + 48, y - 10);
  ctx.lineTo(x + 48, y + 46);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(213, 172, 109, .25)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x - 46, y + 46);
  ctx.lineTo(x - 46, y - 8);
  ctx.lineTo(x + 46, y - 8);
  ctx.stroke();
  // warning sign
  ctx.fillStyle = '#8a6235';
  ctx.fillRect(x - 70, y + 26, 3, 22);
  ctx.fillStyle = '#d9c29a';
  rr(ctx, x - 86, y + 14, 34, 14, 2);
  ctx.fill();
  ctx.strokeStyle = '#9d8058';
  ctx.lineWidth = .8;
  rr(ctx, x - 86, y + 14, 34, 14, 2);
  ctx.stroke();
  ctx.fillStyle = '#6e4d2a';
  ctx.font = '700 6px "Avenir Next", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OLD QUARRY', x - 69, y + 23);
  // vines
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? '#527c45' : '#426b3a';
    ctx.beginPath();
    ctx.ellipse(x - 58 + i * 2, y + 38 - i * 11, 3.4, 2, i, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

/* ---------------- lantern posts ---------------- */
export function drawLantern(ctx, l, t) {
  const { x, y, h } = l;
  const glow = .55 + Math.sin(t * 2.2 + x) * .12;
  ctx.save();
  shadow(ctx, x, y, 9, 3.5, .2);
  ctx.fillStyle = '#5e4327';
  ctx.fillRect(x - 2.2, y - h, 4.4, h);
  ctx.fillStyle = 'rgba(219, 180, 113, .3)';
  ctx.fillRect(x - 2.2, y - h, 1.4, h);
  // arm
  ctx.strokeStyle = '#5e4327';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(x, y - h + 4);
  ctx.lineTo(x + 10, y - h + 4);
  ctx.stroke();
  // lantern
  const lx = x + 10, ly = y - h + 14;
  ctx.fillStyle = '#3c3125';
  rr(ctx, lx - 6, ly - 4, 12, 16, 2);
  ctx.fill();
  const g = ctx.createRadialGradient(lx, ly + 4, 1, lx, ly + 4, 15);
  g.addColorStop(0, `rgba(255, 226, 142, ${glow})`);
  g.addColorStop(1, 'rgba(255, 200, 90, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(lx, ly + 4, 15, 0, TAU);
  ctx.fill();
  ctx.fillStyle = `rgba(250, 207, 116, ${.7 + Math.sin(t * 3 + x) * .1})`;
  rr(ctx, lx - 4, ly - 1, 8, 10, 1.5);
  ctx.fill();
  ctx.strokeStyle = '#6c512c';
  ctx.lineWidth = 1;
  ctx.strokeRect(lx - 6, ly - 4, 12, 16);
  // cap
  ctx.fillStyle = '#4d3a24';
  ctx.beginPath();
  ctx.moveTo(lx - 8, ly - 4);
  ctx.lineTo(lx, ly - 10);
  ctx.lineTo(lx + 8, ly - 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
