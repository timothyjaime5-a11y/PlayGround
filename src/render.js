/* ============================================================
   IRONROOT & IVY — frame renderer
   ============================================================ */
import { TAU, clamp, lerp, hash, DAY_START, DAY_END, SHOP, WEAPONS } from './data.js';
import { drawPlot, drawTree, drawRock, drawBush, drawDecor, drawTargetRing } from './art.js';
import { drawBarn, drawShopBack, drawCounter, drawForge, drawLedger, drawPedestal, drawWell, drawWindmill, drawCave, drawLantern } from './buildings.js';
import { drawPlayer, drawCustomer, drawBubble } from './chars.js';

export function createRenderer(canvas, state, world, groundCanvas) {
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  const motes = Array.from({ length: 46 }, (_, i) => ({
    x: hash(i, 3) * 1.2 - .1,
    y: hash(i, 7) * 1.2 - .1,
    s: .6 + hash(i, 11) * 1.8,
    speed: .008 + hash(i, 13) * .02,
    phase: hash(i, 17) * TAU,
  }));

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (w === W && h === H && canvas.width === Math.round(w * dpr)) return;
    W = w; H = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
  }

  function worldTransform(view) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(view.scale, view.scale);
    ctx.translate(-view.x, -view.y);
  }

  function visible(x, y, view, margin = 180) {
    const halfW = W / (2 * view.scale) + margin;
    const halfH = H / (2 * view.scale) + margin;
    return Math.abs(x - view.x) < halfW && Math.abs(y - view.y) < halfH;
  }

  function drawWater(view, t) {
    const p = world.pond;
    if (!visible(p.x, p.y, view, 260)) return;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.rx - 8, p.ry - 6, 0, 0, TAU);
    ctx.clip();
    // shimmer
    ctx.strokeStyle = 'rgba(219, 246, 242, .18)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      const yy = p.y - p.ry * .6 + i * 26;
      const off = Math.sin(t * .7 + i * 1.4) * 18;
      ctx.beginPath();
      ctx.ellipse(p.x + off, yy, 24 + i * 9, 3, 0, 0, TAU);
      ctx.stroke();
    }
    // glints
    for (let i = 0; i < 6; i++) {
      const a = t * .3 + i * 1.7;
      const gx = p.x + Math.cos(a) * p.rx * .62;
      const gy = p.y + Math.sin(a * 1.4) * p.ry * .5;
      ctx.fillStyle = `rgba(245, 255, 249, ${.12 + Math.sin(t * 2 + i) * .08})`;
      ctx.beginPath();
      ctx.ellipse(gx, gy, 5, 1.3, 0, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
    // ducks
    const dx = p.x + Math.sin(t * .18) * 55 - 30;
    const dy = p.y + Math.cos(t * .24) * 22 + 10;
    ctx.save();
    ctx.translate(dx, dy);
    ctx.fillStyle = 'rgba(235, 228, 200, .92)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 4.6, 0, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -4, 3.4, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#d59a3a';
    ctx.beginPath();
    ctx.moveTo(10, -4);
    ctx.lineTo(14, -2.6);
    ctx.lineTo(10, -1.4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#3e3a2c';
    ctx.beginPath();
    ctx.arc(8.2, -4.8, .7, 0, TAU);
    ctx.fill();
    ctx.restore();
    // wake
    ctx.strokeStyle = 'rgba(229, 248, 243, .22)';
    ctx.beginPath();
    ctx.ellipse(dx - 14, dy + 1, 12, 2, 0, 0, TAU);
    ctx.stroke();
  }

  function drawParticles(particles) {
    for (const p of particles) {
      const a = clamp(p.life / p.maxLife, 0, 1);
      ctx.save();
      ctx.globalAlpha = a;
      if (p.type === 'coin') {
        ctx.fillStyle = '#efc45b';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, 3.2, 4.2, p.rot || 0, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = '#9f6f1d';
        ctx.lineWidth = .7;
        ctx.stroke();
      } else if (p.type === 'spark') {
        ctx.strokeStyle = p.color || '#f6d37a';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * .02, p.y - p.vy * .02);
        ctx.stroke();
      } else if (p.type === 'leaf') {
        ctx.fillStyle = p.color || '#7fa85d';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, 3.4, 1.7, p.rot || 0, 0, TAU);
        ctx.fill();
      } else if (p.type === 'chip') {
        ctx.fillStyle = p.color || '#a8a49a';
        ctx.fillRect(p.x, p.y, p.size || 2, p.size || 2);
      } else if (p.type === 'water') {
        ctx.fillStyle = 'rgba(139, 201, 220, .8)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size || 1.6, 0, TAU);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color || 'rgba(226, 213, 174, .7)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size || 1.8, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawFloaters(floaters) {
    for (const f of floaters) {
      const a = clamp(f.life / f.maxLife, 0, 1);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.font = `700 ${f.size || 13}px "Avenir Next", "Segoe UI", sans-serif`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(27, 40, 28, .45)';
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = f.color || '#f6e4a7';
      ctx.fillText(f.text, f.x, f.y);
      ctx.restore();
    }
  }

  function lighting(view, t) {
    const m = state.time;
    const phase = state.phase;
    let night = 0;
    if (m > 990) night = clamp((m - 990) / 170, 0, 1);
    let tint = 'rgba(0,0,0,0)';
    if (m < 585) {
      const k = 1 - clamp((m - DAY_START) / 105, 0, 1);
      tint = `rgba(255, 206, 152, ${.10 * k})`;
    } else if (m > 900 && m < 1020) {
      const k = clamp((m - 900) / 120, 0, 1);
      tint = `rgba(255, 142, 78, ${.13 * k})`;
    } else if (m >= 1020) {
      const k = clamp((m - 1020) / 160, 0, 1);
      tint = `rgba(26, 43, 84, ${.15 + .31 * k})`;
    }
    if (phase === 'title') {
      tint = `rgba(255, 186, 110, ${.06 + Math.sin(t * .1) * .015})`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (tint !== 'rgba(0,0,0,0)') {
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, W, H);
    }

    // warm light pools
    if (night > .05 || phase === 'title') {
      const lights = [
        { x: SHOP.sign.x, y: SHOP.sign.y + 60, r: 190, a: .5 },
        { x: SHOP.forge.x + 28, y: SHOP.forge.y + 30, r: 170, a: .7 },
        { x: 1040, y: 1330, r: 120, a: .4 },
        { x: 1410, y: 1330, r: 120, a: .4 },
        { x: world.cave.x - 10, y: world.cave.y + 14, r: 120, a: .35, cool: true },
      ];
      for (const l of world.lanterns) lights.push({ x: l.x + 10, y: l.y - l.h + 14, r: 145, a: .55 });
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const l of lights) {
        const sx = (l.x - view.x) * view.scale + W / 2;
        const sy = (l.y - view.y) * view.scale + H / 2;
        const r = l.r * view.scale;
        if (sx < -r || sy < -r || sx > W + r || sy > H + r) continue;
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
        const a = l.a * (night * .85 + (phase === 'title' ? .5 : .06));
        if (l.cool) {
          g.addColorStop(0, `rgba(148, 124, 220, ${a * .5})`);
          g.addColorStop(.5, `rgba(96, 78, 160, ${a * .18})`);
        } else {
          g.addColorStop(0, `rgba(255, 216, 130, ${a})`);
          g.addColorStop(.45, `rgba(255, 181, 84, ${a * .35})`);
        }
        g.addColorStop(1, 'rgba(255, 180, 80, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    // fireflies / pollen
    ctx.save();
    for (const mo of motes) {
      const x = ((mo.x + t * mo.speed * .06) % 1.2 - .1) * W;
      const y = ((mo.y + Math.sin(t * .3 + mo.phase) * .01) % 1.2 - .1) * H;
      if (night > .3) {
        const blink = Math.max(0, Math.sin(t * 1.8 + mo.phase * 3));
        ctx.globalAlpha = blink * .55 * night;
        ctx.fillStyle = '#f7e39a';
        ctx.shadowColor = '#f6d36d';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 1.4 + mo.s * .5, 0, TAU);
        ctx.fill();
      } else {
        ctx.globalAlpha = .18 + Math.sin(t * .5 + mo.phase) * .08;
        ctx.fillStyle = '#fff3cb';
        ctx.beginPath();
        ctx.arc(x, y, mo.s * .7, 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();

    // vignette
    const v = ctx.createRadialGradient(W / 2, H * .46, Math.min(W, H) * .34, W / 2, H * .5, Math.max(W, H) * .78);
    v.addColorStop(0, 'rgba(20, 30, 20, 0)');
    v.addColorStop(1, `rgba(15, 24, 17, ${.18 + night * .18})`);
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }

  function draw(t, view, player, nearest, particles, floaters) {
    resize();
    worldTransform(view);

    // ground
    ctx.drawImage(groundCanvas, 0, 0, groundCanvas.width, groundCanvas.height, 0, 0, 2400, 1800);
    drawWater(view, t);

    // interaction ring under objects
    if (nearest && state.phase === 'playing' && !state.modal) {
      drawTargetRing(ctx, nearest.x, nearest.y, nearest.r || 30, t);
    }

    const items = [];
    const add = (base, fn) => items.push({ base, fn });

    for (const p of world.plots) {
      if (!visible(p.cx, p.cy, view)) continue;
      add(p.y + p.h, () => drawPlot(ctx, p, t));
    }
    for (const n of world.nodes) {
      if (!visible(n.x, n.y, view)) continue;
      add(n.y + 8, () => (n.kind === 'tree' ? drawTree(ctx, n, t) : drawRock(ctx, n, t)));
    }
    for (const d of world.decoTrees) {
      if (!visible(d.x, d.y, view)) continue;
      add(d.y + 8, () => drawTree(ctx, d, t, true));
    }
    for (const b of world.bushes) {
      if (!visible(b.x, b.y, view)) continue;
      add(b.y + 4, () => drawBush(ctx, b, t));
    }
    for (const d of world.decorations) {
      if (!visible(d.x, d.y, view)) continue;
      add(d.y + 2, () => drawDecor(ctx, d, t));
    }

    if (visible(world.barn.x, world.barn.y, view, 320)) add(world.barn.y + world.barn.h, () => drawBarn(ctx, world.barn));
    if (visible(SHOP.wall.x, SHOP.wall.y, view, 320)) add(SHOP.wall.y + SHOP.wall.h, () => drawShopBack(ctx, t));
    if (visible(SHOP.counter.x, SHOP.counter.y, view, 260)) add(SHOP.counter.y + SHOP.counter.h, () => drawCounter(ctx));
    if (visible(SHOP.forge.x, SHOP.forge.y, view, 220)) add(SHOP.forge.y + SHOP.forge.h, () => drawForge(ctx, t));
    if (visible(SHOP.ledger.x, SHOP.ledger.y, view, 200)) add(SHOP.ledger.y + SHOP.ledger.h, () => drawLedger(ctx, t));
    state.pedestals.forEach((ped, i) => {
      if (!visible(ped.x, ped.y, view, 180)) return;
      add(ped.y + 16, () => drawPedestal(ctx, ped, i, t));
    });
    if (visible(world.well.x, world.well.y, view, 240)) add(world.well.y + 38, () => drawWell(ctx, world.well, t));
    if (visible(world.windmill.x, world.windmill.y, view, 300)) add(world.windmill.y + 42, () => drawWindmill(ctx, world.windmill, t));
    if (visible(world.cave.x, world.cave.y, view, 320)) add(world.cave.y + 70, () => drawCave(ctx, world.cave, t));
    for (const l of world.lanterns) {
      if (!visible(l.x, l.y, view, 140)) continue;
      add(l.y + 2, () => drawLantern(ctx, l, t));
    }

    // people
    if (state.phase !== 'title') {
      for (const c of state.customers) {
        if (!visible(c.x, c.y, view, 120)) continue;
        add(c.y + 2, () => drawCustomer(ctx, c, t));
      }
    }
    add(player.y + 2, () => drawPlayer(ctx, player, t, player.tool));

    items.sort((a, b) => a.base - b.base);
    for (const item of items) item.fn();

    // bubbles & floaters above everything
    if (state.phase !== 'title') {
      for (const c of state.customers) {
        if (!visible(c.x, c.y, view, 160)) continue;
        if (c.bubble) drawBubble(ctx, c, c.bubble, t);
      }
    }
    drawParticles(particles);
    drawFloaters(floaters);

    ctx.restore();
    lighting(view, t);
  }

  return { draw, resize, get size() { return { W, H, dpr }; } };
}
