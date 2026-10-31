/* ============================================================
   IRONROOT & IVY — people
   ============================================================ */
import { TAU, rr, clamp } from './data.js';

export function drawPlayer(ctx, p, t, tool) {
  const walk = p.moving ? Math.sin(p.walkTime * 11) : 0;
  const bob = p.moving ? Math.abs(Math.sin(p.walkTime * 11)) * 2.2 : Math.sin(t * 2) * .7;
  const face = Math.cos(p.facing) < 0 ? -1 : 1;
  const lean = clamp(Math.cos(p.facing), -1, 1) * 1.4;
  ctx.save();
  ctx.translate(p.x, p.y);

  // shadow
  ctx.fillStyle = 'rgba(28, 42, 25, .3)';
  ctx.beginPath();
  ctx.ellipse(1, 2, 15, 5.5, 0, 0, TAU);
  ctx.fill();

  // legs
  ctx.save();
  ctx.translate(0, -bob);
  for (const side of [-1, 1]) {
    const swing = walk * side * 3.4;
    ctx.strokeStyle = '#3f5b45';
    ctx.lineWidth = 5.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(side * 4.4, -14);
    ctx.lineTo(side * 4.8 + swing, -2);
    ctx.stroke();
    ctx.fillStyle = '#5c3e27';
    ctx.beginPath();
    ctx.ellipse(side * 4.8 + swing, -1, 4.3, 2.3, 0, 0, TAU);
    ctx.fill();
  }
  // body / overalls
  ctx.fillStyle = '#4d7154';
  rr(ctx, -9 + lean * .3, -31, 18, 19, 7);
  ctx.fill();
  ctx.fillStyle = '#5f8762';
  rr(ctx, -8 + lean * .3, -31, 16, 5, 3);
  ctx.fill();
  // shirt
  ctx.fillStyle = '#e9d9b4';
  rr(ctx, -9.5, -34, 19, 8, 4);
  ctx.fill();
  // apron pocket
  ctx.fillStyle = '#426149';
  rr(ctx, -6, -24, 12, 8, 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(230, 212, 170, .4)';
  ctx.lineWidth = .8;
  rr(ctx, -6, -24, 12, 8, 2);
  ctx.stroke();
  // satchel strap
  ctx.strokeStyle = '#8a5f34';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-8, -33);
  ctx.lineTo(7, -17);
  ctx.stroke();
  ctx.fillStyle = '#a07444';
  rr(ctx, 5, -19, 8, 8, 2);
  ctx.fill();
  ctx.strokeStyle = '#6f4b28';
  ctx.lineWidth = .8;
  rr(ctx, 5, -19, 8, 8, 2);
  ctx.stroke();

  // arms
  for (const side of [-1, 1]) {
    const swing = walk * side * 2.6;
    ctx.strokeStyle = '#e6d4ad';
    ctx.lineWidth = 3.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(side * 8.2, -31);
    ctx.lineTo(side * 10.5 + swing, -21);
    ctx.stroke();
    ctx.fillStyle = '#d9a67b';
    ctx.beginPath();
    ctx.arc(side * 10.5 + swing, -20, 2.3, 0, TAU);
    ctx.fill();
  }

  // head
  const hx = lean * .8;
  ctx.fillStyle = '#d9a67b';
  ctx.beginPath();
  ctx.arc(hx, -41, 7.4, 0, TAU);
  ctx.fill();
  // ear
  ctx.fillStyle = '#c98f66';
  ctx.beginPath();
  ctx.arc(hx - face * 6.6, -41, 2, 0, TAU);
  ctx.fill();
  // hair
  ctx.fillStyle = '#6b4328';
  ctx.beginPath();
  ctx.arc(hx, -43.5, 7.2, Math.PI * .92, Math.PI * 2.08);
  ctx.fill();
  // eyes
  ctx.fillStyle = '#3c2b1e';
  const eyeShift = clamp(Math.cos(p.facing), -.9, .9) * 1.7;
  ctx.beginPath();
  ctx.arc(hx - 2.5 + eyeShift, -40.5, 1.05, 0, TAU);
  ctx.arc(hx + 2.5 + eyeShift, -40.5, 1.05, 0, TAU);
  ctx.fill();
  // smile
  ctx.strokeStyle = 'rgba(110, 65, 40, .7)';
  ctx.lineWidth = .9;
  ctx.beginPath();
  ctx.arc(hx + eyeShift * .6, -37.4, 2.4, .15, Math.PI - .15);
  ctx.stroke();
  // cheeks
  ctx.fillStyle = 'rgba(214, 120, 96, .22)';
  ctx.beginPath();
  ctx.arc(hx - 5, -38.6, 1.8, 0, TAU);
  ctx.arc(hx + 5, -38.6, 1.8, 0, TAU);
  ctx.fill();

  // straw hat
  ctx.fillStyle = '#d6b26a';
  ctx.beginPath();
  ctx.ellipse(hx, -46, 14.5, 4.2, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#c39c52';
  ctx.beginPath();
  ctx.ellipse(hx, -45.6, 14.2, 3.6, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = '#dcba74';
  ctx.beginPath();
  ctx.ellipse(hx, -49.5, 7.4, 5, 0, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#8a5a32';
  rr(ctx, hx - 7.4, -47.8, 14.8, 2.6, 1);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 240, 201, .35)';
  ctx.beginPath();
  ctx.ellipse(hx - 2, -51, 3.4, 1.5, -.4, 0, TAU);
  ctx.fill();

  // held tool
  if (tool) {
    ctx.save();
    ctx.translate(10.5, -21);
    ctx.rotate(.18);
    drawTool(ctx, tool, face);
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
}

function drawTool(ctx, tool, face) {
  ctx.save();
  ctx.scale(face, 1);
  if (tool === 'axe' || tool === 'pick') {
    ctx.strokeStyle = '#8b5e33';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(2, -17);
    ctx.stroke();
    ctx.fillStyle = '#aab7c0';
    if (tool === 'axe') {
      ctx.beginPath();
      ctx.moveTo(1, -19);
      ctx.quadraticCurveTo(10, -22, 12, -15);
      ctx.quadraticCurveTo(9, -11, 2, -12);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#5f6d78';
      ctx.lineWidth = .8;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-5, -15);
      ctx.quadraticCurveTo(1, -21, 10, -18);
      ctx.quadraticCurveTo(3, -13, -5, -15);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#5f6d78';
      ctx.lineWidth = .8;
      ctx.stroke();
    }
  } else if (tool === 'hoe') {
    ctx.strokeStyle = '#8b5e33';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(2, -17);
    ctx.stroke();
    ctx.fillStyle = '#aab7c0';
    ctx.beginPath();
    ctx.moveTo(1, -17);
    ctx.lineTo(9, -20);
    ctx.lineTo(10, -16);
    ctx.lineTo(2, -14);
    ctx.closePath();
    ctx.fill();
  } else if (tool === 'hammer') {
    ctx.strokeStyle = '#8b5e33';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(2, -14);
    ctx.stroke();
    ctx.fillStyle = '#8b99a5';
    rr(ctx, -2, -19, 10, 6, 1.5);
    ctx.fill();
  }
  ctx.restore();
}

export function drawCustomer(ctx, c, t) {
  const walk = c.moving ? Math.sin(c.walkTime * 9) : 0;
  const bob = c.moving ? Math.abs(Math.sin(c.walkTime * 9)) * 2 : Math.sin(t * 1.8 + c.seed) * .5;
  const face = c.dir < 0 ? -1 : 1;
  const type = c.type;
  ctx.save();
  ctx.translate(c.x, c.y);
  // shadow
  ctx.fillStyle = 'rgba(28, 40, 24, .28)';
  ctx.beginPath();
  ctx.ellipse(1, 2, 13, 4.8, 0, 0, TAU);
  ctx.fill();

  ctx.save();
  ctx.translate(0, -bob);
  // legs
  for (const side of [-1, 1]) {
    const swing = walk * side * 3;
    ctx.strokeStyle = '#4b4237';
    ctx.lineWidth = 4.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(side * 4, -13);
    ctx.lineTo(side * 4.5 + swing, -1);
    ctx.stroke();
    ctx.fillStyle = '#3f3326';
    ctx.beginPath();
    ctx.ellipse(side * 4.5 + swing, 0, 3.6, 2, 0, 0, TAU);
    ctx.fill();
  }
  // cloak / body
  const g = ctx.createLinearGradient(-9, -34, 9, -12);
  g.addColorStop(0, type.cloak);
  g.addColorStop(1, shade(type.cloak, -.22));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(-8.5, -32);
  ctx.quadraticCurveTo(-11, -20, -10, -11);
  ctx.lineTo(10, -11);
  ctx.quadraticCurveTo(11, -20, 8.5, -32);
  ctx.closePath();
  ctx.fill();
  // trim
  ctx.strokeStyle = type.trim;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-9, -13);
  ctx.lineTo(9, -13);
  ctx.stroke();
  // belt
  ctx.fillStyle = '#6f5230';
  rr(ctx, -9, -22, 18, 3, 1);
  ctx.fill();
  ctx.fillStyle = '#d8b15c';
  rr(ctx, -1.5, -22.5, 3, 4, 1);
  ctx.fill();

  // arms
  for (const side of [-1, 1]) {
    const swing = walk * side * 2.2;
    ctx.strokeStyle = shade(type.cloak, .08);
    ctx.lineWidth = 3.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(side * 7.5, -29);
    ctx.lineTo(side * 9.5 + swing, -19);
    ctx.stroke();
    ctx.fillStyle = type.skin;
    ctx.beginPath();
    ctx.arc(side * 9.5 + swing, -18.5, 2, 0, TAU);
    ctx.fill();
  }

  // head
  ctx.fillStyle = type.skin;
  ctx.beginPath();
  ctx.arc(0, -38, 6.6, 0, TAU);
  ctx.fill();
  // eyes
  ctx.fillStyle = '#3a2a1e';
  const es = face * 1.2;
  ctx.beginPath();
  ctx.arc(-2.2 + es, -38, .9, 0, TAU);
  ctx.arc(2.2 + es, -38, .9, 0, TAU);
  ctx.fill();
  // nose
  ctx.fillStyle = shade(type.skin, -.08);
  ctx.beginPath();
  ctx.arc(face * 1.2, -36.6, .9, 0, TAU);
  ctx.fill();

  // hats / hair
  if (type.hat === 'hood') {
    ctx.fillStyle = shade(type.cloak, -.12);
    ctx.beginPath();
    ctx.arc(0, -39, 7.7, Math.PI * .88, Math.PI * 2.12);
    ctx.lineTo(6.5, -32);
    ctx.lineTo(-6.5, -32);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = type.trim;
    ctx.lineWidth = .8;
    ctx.beginPath();
    ctx.arc(0, -39, 7.4, Math.PI * 1.02, Math.PI * 1.98);
    ctx.stroke();
  } else if (type.hat === 'helm') {
    ctx.fillStyle = '#9aa5b0';
    ctx.beginPath();
    ctx.arc(0, -39.5, 7.6, Math.PI, 0);
    ctx.lineTo(7.6, -36);
    ctx.lineTo(3, -36);
    ctx.lineTo(3, -33);
    ctx.lineTo(-3, -33);
    ctx.lineTo(-3, -36);
    ctx.lineTo(-7.6, -36);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#5d6872';
    ctx.lineWidth = .9;
    ctx.stroke();
    ctx.fillStyle = '#c9d2da';
    ctx.fillRect(-1, -44, 2, 9);
    ctx.fillStyle = '#b85c3e';
    ctx.beginPath();
    ctx.ellipse(0, -46, 2, 3.2, 0, 0, TAU);
    ctx.fill();
  } else if (type.hat === 'wizard') {
    ctx.fillStyle = shade(type.cloak, -.1);
    ctx.beginPath();
    ctx.moveTo(-8.5, -43);
    ctx.lineTo(0, -59);
    ctx.lineTo(8.5, -43);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = type.trim;
    ctx.beginPath();
    ctx.ellipse(0, -43, 9, 2.4, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#f2d67f';
    ctx.beginPath();
    ctx.arc(2.5, -51, 1.2, 0, TAU);
    ctx.fill();
  } else if (type.hat === 'straw') {
    ctx.fillStyle = '#d3ae68';
    ctx.beginPath();
    ctx.ellipse(0, -44, 12.5, 3.4, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#c19a50';
    ctx.beginPath();
    ctx.ellipse(0, -46.5, 6, 4, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#8b5f32';
    ctx.fillRect(-6, -45.5, 12, 1.6);
  } else {
    ctx.fillStyle = '#4f4132';
    ctx.beginPath();
    ctx.arc(0, -41, 6.9, Math.PI, TAU);
    ctx.fill();
    ctx.fillStyle = '#6a5842';
    ctx.beginPath();
    ctx.ellipse(0, -44, 8, 2.2, 0, 0, TAU);
    ctx.fill();
  }

  // accessories
  if (type.id === 'ranger') {
    ctx.strokeStyle = '#7a5430';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-6, -30);
    ctx.lineTo(-11, -21);
    ctx.stroke();
    ctx.strokeStyle = '#b9a26a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-7, -29);
    ctx.lineTo(-12, -20);
    ctx.stroke();
  }
  if (type.id === 'knight') {
    ctx.fillStyle = '#d8b15c';
    ctx.beginPath();
    ctx.arc(6.5, -28, 2.2, 0, TAU);
    ctx.fill();
  }
  if (type.id === 'mage') {
    ctx.strokeStyle = '#8a6437';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-9, -4);
    ctx.lineTo(-11, -38);
    ctx.stroke();
    ctx.fillStyle = `rgba(179, 154, 235, ${.65 + Math.sin(t * 2 + c.seed) * .2})`;
    ctx.beginPath();
    ctx.arc(-11, -41, 3.4, 0, TAU);
    ctx.fill();
  }
  if (type.id === 'collector') {
    ctx.strokeStyle = '#c9a45a';
    ctx.lineWidth = .9;
    ctx.beginPath();
    ctx.arc(2.2, -38, 2.2, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(3.4, -36.5);
    ctx.lineTo(6, -34.5);
    ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
}

function shade(hex, amt) {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = clamp(Math.round(r + 255 * amt), 0, 255);
  g = clamp(Math.round(g + 255 * amt), 0, 255);
  b = clamp(Math.round(b + 255 * amt), 0, 255);
  return `rgb(${r},${g},${b})`;
}

export function drawBubble(ctx, c, text, t) {
  if (!text) return;
  const x = c.x;
  const y = c.y - 78;
  ctx.save();
  ctx.font = '600 10.5px "Avenir Next", "Segoe UI", sans-serif';
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > 120 && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 18;
  const h = lines.length * 13 + 12;
  const bob = Math.sin(t * 2 + c.seed) * 1.2;
  ctx.translate(x, y + bob);
  ctx.fillStyle = 'rgba(30, 40, 28, .2)';
  rr(ctx, -w / 2 + 2, -h + 3, w, h, 8);
  ctx.fill();
  ctx.fillStyle = '#fbf3df';
  rr(ctx, -w / 2, -h, w, h, 8);
  ctx.fill();
  ctx.strokeStyle = '#c6b184';
  ctx.lineWidth = 1;
  rr(ctx, -w / 2, -h, w, h, 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-5, 0);
  ctx.lineTo(0, 6);
  ctx.lineTo(5, 0);
  ctx.closePath();
  ctx.fillStyle = '#fbf3df';
  ctx.fill();
  ctx.strokeStyle = '#c6b184';
  ctx.beginPath();
  ctx.moveTo(-5, 0);
  ctx.lineTo(0, 6);
  ctx.lineTo(5, 0);
  ctx.stroke();
  ctx.fillStyle = '#3c3a2d';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, 0, -h + 13 + i * 13));
  ctx.restore();
}
