/* ============================================================
   IRONROOT & IVY — game systems
   ============================================================ */
import {
  WORLD, GOAL, DAYS, DAY_START, DAY_END, TIME_RATE, clamp, lerp, rand, pick, dist, fmt, TAU,
  SHOP, CROPS, WEAPONS, WEAPON_ORDER, RESOURCES, RES_ORDER, CUSTOMER_TYPES, QUESTS, createWorld,
} from './data.js';
import { buildGround } from './ground.js';
import { createRenderer } from './render.js';
import { createAudio } from './audio.js';
import { createUI } from './ui.js';

const canvas = document.getElementById('game');
const world = createWorld();
const ground = buildGround(world);
const audio = createAudio();
let renderer = null;
let ui = null;

const state = {
  phase: 'title',
  day: 1,
  time: DAY_START,
  gold: 60,
  earned: 0,
  totalSales: 0,
  dayEarned: 0,
  daySales: 0,
  resources: Object.fromEntries(RES_ORDER.map((r) => [r, 0])),
  weapons: Object.fromEntries(WEAPON_ORDER.map((w) => [w, 0])),
  pedestals: SHOP.pedestals.map((p, i) => ({
    ...p, unlocked: i < 2, weapon: null, qty: 0, mult: 1, price: 0,
  })),
  upgrades: { sign: false, bellows: false },
  quests: Object.fromEntries(QUESTS.map((q) => [q.id, { progress: 0 }])),
  customers: [],
  particles: [],
  floaters: [],
  modal: null,
  firstDisplay: false,
  firstHarvest: false,
  firstCraft: false,
  customerTimer: 9,
  endless: false,
  resultWin: false,
  shake: 0,
  ambientTimer: 0,
  hudTimer: 0,
  timeAccum: 0,
  attract: 0,
  lastPrompt: '',
};

const player = {
  x: 1210, y: 1590, r: 16,
  facing: -Math.PI / 2,
  moving: false,
  walkTime: 0,
  tool: null,
};

const view = { x: 900, y: 900, scale: 1 };
const keys = new Set();
let touchVec = { x: 0, y: 0 };
let currentNearest = null;
let lastPromptSig = '';
let lastTime = 0;
let clock = 0;

renderer = createRenderer(canvas, state, world, ground);

/* ============================================================
   actions passed to the interface
   ============================================================ */
const actions = {
  startGame,
  craft,
  placeWeapon,
  adjustPrice,
  addStock,
  clearPedestal,
  buyUpgrade,
  endDay,
  nextDay,
  endMain,
  pause,
  resume,
  restart,
};

/* ============================================================
   small helpers
   ============================================================ */
function valueBonus() { return state.upgrades.bellows ? 1.2 : 1; }
function weaponBase(id) { return WEAPONS[id].base * valueBonus(); }
function pedPrice(ped) { return Math.round(weaponBase(ped.weapon) * (ped.mult || 1)); }

function addParticle(x, y, opts = {}) {
  if (state.particles.length > 260) state.particles.shift();
  state.particles.push({
    x, y,
    vx: opts.vx ?? rand(-30, 30),
    vy: opts.vy ?? rand(-50, -10),
    gravity: opts.gravity ?? 0,
    drag: opts.drag ?? .98,
    life: opts.life ?? rand(.5, 1),
    maxLife: opts.life ?? 1,
    size: opts.size ?? rand(1.2, 2.8),
    color: opts.color,
    type: opts.type || 'dust',
    rot: opts.rot ?? rand(0, TAU),
    spin: opts.spin ?? rand(-4, 4),
  });
}

function burst(x, y, count, opts = {}) {
  for (let i = 0; i < count; i++) {
    const a = opts.angle !== undefined ? opts.angle + rand(-opts.spread || -.6, opts.spread || .6) : rand(0, TAU);
    const speed = opts.speed ?? rand(25, 90);
    addParticle(x, y, {
      ...opts,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed - (opts.lift ?? 20),
      life: opts.life ?? rand(.35, .9),
      maxLife: opts.life ?? .9,
    });
  }
}

function floater(x, y, text, color = '#f6e4a7', size = 13) {
  state.floaters.push({ x, y, text, color, size, life: 1.5, maxLife: 1.5 });
}

function bumpQuest(id, n = 1) {
  const def = QUESTS.find((q) => q.id === id);
  const q = state.quests[id];
  if (!def || !q || q.progress >= def.target) return;
  q.progress = Math.min(def.target, q.progress + n);
  if (q.progress >= def.target) {
    state.gold += def.reward;
    state.earned += def.reward;
    state.dayEarned += def.reward;
    audio.play('quest');
    ui.toast(`Quest complete — ${def.text} · +${def.reward}g`, { kind: 'gold', icon: 'spark', duration: 4200 });
    floater(player.x, player.y - 58, `+${def.reward}g`, '#f6d37a', 15);
  }
  ui.sync();
}

function addResource(id, n, x, y) {
  state.resources[id] = (state.resources[id] || 0) + n;
  floater(x, y, `+${n} ${RESOURCES[id].name}`, RESOURCES[id].color, 12);
  ui.sync();
}

/* ============================================================
   start / pause
   ============================================================ */
function startGame() {
  if (state.phase !== 'title') return;
  state.phase = 'playing';
  audio.init();
  audio.play('start');
  ui.setPhase('playing');
  snapCamera();
  ui.sync();
  ui.toast('Welcome to Ironroot &amp; Ivy', { icon: 'leaf', duration: 3600 });
  setTimeout(() => {
    if (state.phase === 'playing' || state.phase === 'paused') {
      ui.toast(`Seven days to earn <b>${fmt(GOAL)} gold</b>. Farm, forge, and fill the shelves.`, { icon: 'coin', kind: 'gold', duration: 5200 });
    }
  }, 1100);
  setTimeout(() => {
    if (state.phase === 'playing') ui.hint('The checklist on the left is a gentle nudge — not a rule.');
  }, 2200);
}

function pause() {
  if (state.phase !== 'playing') return;
  ui.updatePrompt(null);
  ui.showPause();
  audio.play('page');
}

function resume() {
  if (state.phase !== 'paused') return;
  ui.hidePause();
  state.phase = 'playing';
  ui.setPhase('playing');
  snapCamera();
}

function restart() {
  location.reload();
}

/* ============================================================
   economy actions
   ============================================================ */
function craft(id) {
  const w = WEAPONS[id];
  if (!w) return false;
  for (const [res, n] of Object.entries(w.cost)) {
    if ((state.resources[res] || 0) < n) {
      audio.play('error');
      ui.toast(`Not enough ${RESOURCES[res].name.toLowerCase()} for the ${w.name}.`, { kind: 'warn', icon: 'leaf' });
      return false;
    }
  }
  for (const [res, n] of Object.entries(w.cost)) state.resources[res] -= n;
  state.weapons[id] = (state.weapons[id] || 0) + 1;
  state.shake = 2.5;
  burst(SHOP.forge.x + 28, SHOP.forge.y + 28, 22, { type: 'spark', color: '#f6c96c', speed: 90, lift: 40, life: .8 });
  burst(SHOP.forge.x + 28, SHOP.forge.y + 40, 8, { type: 'dust', color: 'rgba(210,190,160,.5)', speed: 30, lift: 10 });
  audio.play('craft');
  ui.toast(`<b>${w.name}</b> forged. It is waiting in your satchel.`, { icon: 'hammer', kind: 'gold', duration: 3400 });
  bumpQuest('craft');
  if (!state.firstCraft) {
    state.firstCraft = true;
    setTimeout(() => {
      if (state.phase === 'playing') ui.toast('Carry it to a display pedestal in front of the shop.', { icon: 'shop' });
    }, 900);
  }
  ui.sync();
  return true;
}

function placeWeapon(index, id) {
  const ped = state.pedestals[index];
  if (!ped || !ped.unlocked || ped.weapon) return;
  if ((state.weapons[id] || 0) < 1) return;
  state.weapons[id] -= 1;
  ped.weapon = id;
  ped.qty = 1;
  ped.mult = 1;
  ped.price = pedPrice(ped);
  audio.play('ui');
  if (!state.firstDisplay) {
    state.firstDisplay = true;
    state.customerTimer = 3.5;
    ui.toast('The first display is up. Word is beginning to travel.', { icon: 'shop', kind: 'gold', duration: 4200 });
  }
  bumpQuest('display');
  ui.sync();
}

function adjustPrice(index, delta) {
  const ped = state.pedestals[index];
  if (!ped || !ped.weapon) return;
  ped.mult = clamp(Math.round(((ped.mult || 1) + delta * .05) * 100) / 100, .7, 1.5);
  ped.price = pedPrice(ped);
  audio.play('ui');
  ui.sync();
}

function addStock(index) {
  const ped = state.pedestals[index];
  if (!ped || !ped.weapon || ped.qty >= 3) return;
  if ((state.weapons[ped.weapon] || 0) < 1) {
    audio.play('error');
    ui.toast('No more of that weapon in your satchel.', { kind: 'warn', icon: 'leaf' });
    return;
  }
  state.weapons[ped.weapon] -= 1;
  ped.qty += 1;
  audio.play('ui');
  ui.sync();
}

function clearPedestal(index) {
  const ped = state.pedestals[index];
  if (!ped || !ped.weapon) return;
  state.weapons[ped.weapon] = (state.weapons[ped.weapon] || 0) + ped.qty;
  ped.weapon = null;
  ped.qty = 0;
  ped.mult = 1;
  ped.price = 0;
  audio.play('page');
  ui.sync();
}

function buyUpgrade(id) {
  const up = state.upgrades;
  if (id === 'sign') {
    if (up.sign) return;
    if (state.gold < 140) { audio.play('error'); return; }
    state.gold -= 140;
    up.sign = true;
    ui.toast('A fresh painted sign. More customers will find you.', { icon: 'shop', kind: 'gold' });
  } else if (id === 'pedestal') {
    const locked = state.pedestals.find((p) => !p.unlocked);
    if (!locked) return;
    if (state.gold < 180) { audio.play('error'); return; }
    state.gold -= 180;
    locked.unlocked = true;
    ui.toast('Another display pedestal is ready for a weapon.', { icon: 'hammer', kind: 'gold' });
  } else if (id === 'bellows') {
    if (up.bellows) return;
    if (state.gold < 240) { audio.play('error'); return; }
    state.gold -= 240;
    up.bellows = true;
    for (const ped of state.pedestals) if (ped.weapon) ped.price = pedPrice(ped);
    ui.toast('The bellows roar. Every weapon is now worth 20% more.', { icon: 'spark', kind: 'gold' });
  }
  audio.play('upgrade');
  ui.sync();
}

/* ============================================================
   farming, mining, interaction
   ============================================================ */
function findNearest() {
  if (state.phase !== 'playing' || state.modal) return null;
  const px = player.x, py = player.y;
  const candidates = [];

  for (const plot of world.plots) {
    const d = dist(px, py, plot.cx, plot.cy);
    if (d > 78) continue;
    const crop = CROPS[plot.crop];
    let prompt = '';
    let action = 'plot';
    if (plot.empty) prompt = `<em>Plant</em> ${crop.name.toLowerCase()}`;
    else if (plot.stage >= 3) prompt = `<em>Harvest</em> ${crop.name.toLowerCase()}`;
    else if (!plot.watered) prompt = `<em>Water</em> ${crop.name.toLowerCase()} · ${Math.round(plot.growth * 100)}%`;
    else prompt = `${crop.name} growing · ${Math.round(plot.growth * 100)}%`;
    candidates.push({
      id: plot.id, action, plot, x: plot.cx, y: plot.cy + 30, r: 28, prompt, d,
      tool: plot.empty ? 'hoe' : plot.stage >= 3 ? null : 'hoe',
    });
  }

  for (const node of world.nodes) {
    if (!node.alive) continue;
    const d = dist(px, py, node.x, node.y);
    if (d > 84) continue;
    const name = node.kind === 'tree' ? 'oak' : node.resource === 'crystal' ? 'crystal vein' : `${node.resource} vein`;
    const verb = node.kind === 'tree' ? 'Chop' : 'Mine';
    const hits = node.hp;
    candidates.push({
      id: node.id, action: 'node', node, x: node.x, y: node.y + 8, r: node.kind === 'tree' ? 30 : 27,
      prompt: `<em>${verb}</em> ${name} · ${hits} ${hits === 1 ? 'hit' : 'hits'} left`,
      d, tool: node.kind === 'tree' ? 'axe' : 'pick',
    });
  }

  {
    const fx = SHOP.forge.x + SHOP.forge.w / 2;
    const fy = SHOP.forge.y + SHOP.forge.h / 2;
    const d = dist(px, py, fx, fy);
    if (d < 88) candidates.push({
      id: 'forge', action: 'forge', x: fx, y: SHOP.forge.y + SHOP.forge.h + 2, r: 34,
      prompt: '<em>Open</em> the forge', d, tool: 'hammer',
    });
  }
  state.pedestals.forEach((ped, i) => {
    const d = dist(px, py, ped.x, ped.y);
    if (d > 70) return;
    candidates.push({
      id: `ped-${i}`, action: 'pedestal', index: i, x: ped.x, y: ped.y + 6, r: 26,
      prompt: !ped.unlocked ? '<em>Inspect</em> covered display' : ped.weapon ? `<em>Adjust</em> display ${i + 1}` : `<em>Stock</em> display ${i + 1}`,
      d, tool: null,
    });
  });
  {
    const lx = SHOP.ledger.x + SHOP.ledger.w / 2;
    const ly = SHOP.ledger.y + SHOP.ledger.h / 2;
    const d = dist(px, py, lx, ly);
    if (d < 78) candidates.push({
      id: 'ledger', action: 'ledger', x: lx, y: SHOP.ledger.y + SHOP.ledger.h + 2, r: 28,
      prompt: '<em>Open</em> the shop ledger', d, tool: null,
    });
  }

  if (!candidates.length) return null;
  candidates.sort((a, b) => a.d - b.d);
  return candidates[0];
}

function interact() {
  if (state.phase !== 'playing' || state.modal) return;
  const target = findNearest();
  if (!target) return;

  if (target.action === 'plot') {
    const plot = target.plot;
    const crop = CROPS[plot.crop];
    if (plot.empty) {
      plot.empty = false;
      plot.growth = 0;
      plot.stage = 1;
      plot.watered = false;
      burst(plot.cx, plot.cy + 16, 8, { type: 'dust', color: 'rgba(120, 92, 55, .65)', speed: 22, lift: 6, life: .5 });
      audio.play('plant');
      ui.sync();
    } else if (plot.stage >= 3) {
      const amount = Math.round(rand(crop.yield[0], crop.yield[1] + .49));
      addResource(plot.crop, amount, plot.cx, plot.cy - 10);
      burst(plot.cx, plot.cy + 8, 14, { type: 'leaf', color: crop.color, speed: 55, lift: 25, life: .8 });
      audio.play('harvest');
      plot.empty = true;
      plot.growth = 0;
      plot.stage = 0;
      plot.watered = false;
      bumpQuest('harvest');
      if (!state.firstHarvest) {
        state.firstHarvest = true;
        setTimeout(() => {
          if (state.phase === 'playing') ui.toast('Water the next one to double its growth. The well is decorative — your watering can is not.', { icon: 'water', duration: 4600 });
        }, 700);
      }
      ui.sync();
    } else if (!plot.watered) {
      plot.watered = true;
      burst(plot.cx, plot.cy + 6, 12, { type: 'water', color: '#8bc9dc', speed: 30, lift: 24, life: .6 });
      audio.play('water');
      ui.sync();
    } else {
      const left = Math.max(1, Math.ceil(((1 - plot.growth) * crop.grow) / 2));
      ui.toast(`${crop.name} is growing nicely. About ${left}s until ripe.`, { icon: 'leaf', duration: 2200 });
    }
    return;
  }

  if (target.action === 'node') {
    const node = target.node;
    node.hp -= 1;
    node.shake = .32;
    state.shake = node.kind === 'tree' ? 3 : 4;
    const chipColor = node.kind === 'tree' ? '#b98b57' : node.resource === 'crystal' ? '#a99ae2' : node.resource === 'iron' ? '#b18b6c' : '#a8a49a';
    burst(node.x, node.y - 10, 10, { type: 'chip', color: chipColor, speed: 70, lift: 35, life: .55, size: rand(1.5, 3) });
    audio.play(node.kind === 'tree' ? 'chop' : 'mine');
    if (node.hp <= 0) {
      node.alive = false;
      node.respawn = node.kind === 'tree' ? 46 : node.resource === 'crystal' ? 78 : 58;
      let res = node.resource;
      let amount;
      if (node.kind === 'tree') {
        amount = Math.round(rand(2, 3.49));
        addResource('wood', amount, node.x, node.y - 30);
        bumpQuest('chop');
      } else if (res === 'stone') {
        amount = Math.round(rand(2, 3.49));
        addResource('stone', amount, node.x, node.y - 22);
        bumpQuest('mine');
      } else if (res === 'iron') {
        amount = Math.round(rand(1, 2.49));
        addResource('iron', amount, node.x, node.y - 24);
        addResource('stone', 1, node.x, node.y - 8);
        bumpQuest('mine');
      } else {
        amount = 1;
        addResource('crystal', 1, node.x, node.y - 28);
        addResource('stone', 2, node.x, node.y - 10);
        bumpQuest('mine');
      }
      burst(node.x, node.y - 10, 18, { type: 'chip', color: chipColor, speed: 100, lift: 45, life: .8, size: rand(1.5, 3.4) });
      audio.play('rockBreak');
      state.shake = 6;
      floater(node.x, node.y - 48, node.kind === 'tree' ? 'timber!' : 'crack!', '#f0dfb1', 12);
    }
    ui.sync();
    return;
  }

  if (target.action === 'forge') {
    ui.openModal('craft');
    audio.play('page');
    return;
  }
  if (target.action === 'pedestal') {
    ui.openModal('pedestal', { index: target.index });
    audio.play('page');
    return;
  }
  if (target.action === 'ledger') {
    ui.openModal('ledger');
    audio.play('page');
  }
}

/* ============================================================
   customers
   ============================================================ */
function spawnCustomer() {
  if (state.customers.length >= 4) return;
  const type = pick(CUSTOMER_TYPES);
  const side = Math.random() < .5 ? 'left' : 'right';
  const budget = Math.round((62 + state.day * 31 + rand(0, 138)) * type.budget);
  const c = {
    id: `cust-${Math.random().toString(36).slice(2, 8)}`,
    type,
    name: pick(type.names),
    x: side === 'left' ? 560 : 1878,
    y: 986,
    dir: side === 'left' ? 1 : -1,
    speed: rand(58, 76),
    budget,
    stage: 'enter',
    path: [{ x: 1220, y: 986 }, { x: 1220, y: 1576 }],
    wait: 0,
    moving: true,
    walkTime: 0,
    seed: Math.random() * 10,
    bubble: pick(['Good morning!', 'What a lovely shop.', 'I heard about this place.']),
    bubbleTimer: 2.4,
    targetPed: null,
    side,
    exitX: side === 'left' ? 500 : 1940,
    paid: false,
  };
  state.customers.push(c);
}

function moveCustomer(c, dt) {
  if (c.wait > 0) {
    c.wait -= dt;
    c.moving = false;
    if (c.wait <= 0) arriveCustomer(c);
    return;
  }
  if (!c.path.length) {
    c.moving = false;
    arriveCustomer(c);
    return;
  }
  const target = c.path[0];
  const d = dist(c.x, c.y, target.x, target.y);
  if (d < 5) {
    c.path.shift();
    c.moving = false;
    if (!c.path.length) arriveCustomer(c);
    return;
  }
  const step = Math.min(d, c.speed * dt);
  c.x += ((target.x - c.x) / d) * step;
  c.y += ((target.y - c.y) / d) * step;
  c.dir = target.x - c.x;
  c.moving = true;
  c.walkTime += dt;
}

function bestPedestal(c) {
  const options = state.pedestals
    .filter((p) => p.unlocked && p.weapon && p.qty > 0)
    .map((p) => {
      const w = WEAPONS[p.weapon];
      const affinity = c.type.tags.includes(w.tag) ? 1.3 : 1;
      const budget = c.budget * affinity;
      const score = (p.price <= budget ? 100 : 0) + affinity * 18 - (p.price / Math.max(1, c.budget)) * 12 + rand(0, 6);
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);
  return options[0]?.p || null;
}

function arriveCustomer(c) {
  if (c.stage === 'enter') {
    const ped = bestPedestal(c);
    if (!ped) {
      c.bubble = pick(['No wares yet?', 'An empty shelf...', 'I was told there would be weapons.']);
      c.bubbleTimer = 3;
      c.wait = 1.8;
      c.stage = 'leavingSoon';
      return;
    }
    c.targetPed = ped;
    c.path = [{ x: ped.x, y: ped.y + 54 }];
    c.stage = 'toBrowse';
    c.bubble = null;
    return;
  }
  if (c.stage === 'toBrowse') {
    const ped = c.targetPed;
    const w = ped?.weapon ? WEAPONS[ped.weapon] : null;
    c.stage = 'browse';
    c.wait = rand(1.7, 2.9);
    if (w) {
      const affinity = c.type.tags.includes(w.tag);
      c.bubble = affinity ? pick(c.type.lines) : pick(['Hm. Sturdy enough.', 'Not quite my style.', 'That has character.']);
      c.bubbleTimer = 3.4;
    }
    return;
  }
  if (c.stage === 'browse') {
    const ped = c.targetPed;
    if (!ped || !ped.weapon || ped.qty <= 0) {
      c.bubble = 'Sold out? Ah, well.';
      c.bubbleTimer = 2.4;
      startLeaving(c);
      return;
    }
    const w = WEAPONS[ped.weapon];
    const affinity = c.type.tags.includes(w.tag);
    const willing = c.budget * (affinity ? 1.32 : 1);
    if (ped.price <= willing || (affinity && ped.price <= willing * 1.08 && Math.random() < .4)) {
      c.bubble = pick(["I'll take it!", 'Wrap it up for me.', 'That one. Definitely that one.']);
      c.bubbleTimer = 2.6;
      c.stage = 'toCounter';
      c.path = [{ x: SHOP.customerStand.x, y: SHOP.customerStand.y }];
      c.wait = 0;
    } else {
      c.bubble = pick(['A bit rich for me.', 'Lovely... but no.', 'I shall admire it from here.']);
      c.bubbleTimer = 3;
      c.stage = 'leavingSoon';
      c.wait = 1.6;
    }
    return;
  }
  if (c.stage === 'toCounter') {
    c.stage = 'paying';
    c.wait = .9;
    return;
  }
  if (c.stage === 'paying') {
    completeSale(c);
    c.bubble = pick(['Pleasure doing business.', 'A fine shop. I shall return.', 'Worth every coin.']);
    c.bubbleTimer = 2.6;
    startLeaving(c);
    return;
  }
  if (c.stage === 'leavingSoon') {
    startLeaving(c);
    return;
  }
  if (c.stage === 'leaving') {
    c.gone = true;
  }
}

function startLeaving(c) {
  c.stage = 'leaving';
  c.path = [
    { x: 1220, y: 1576 },
    { x: 1220, y: 986 },
    { x: c.exitX, y: 986 },
    { x: c.side === 'left' ? 430 : 2010, y: 986 },
  ];
  c.wait = 0;
}

function completeSale(c) {
  const ped = c.targetPed;
  if (!ped || !ped.weapon || ped.qty <= 0) return;
  const w = WEAPONS[ped.weapon];
  const price = ped.price;
  ped.qty -= 1;
  state.gold += price;
  state.earned += price;
  state.dayEarned += price;
  state.totalSales += 1;
  state.daySales += 1;
  c.paid = true;
  floater(c.x, c.y - 64, `+${fmt(price)}g`, '#f6d37a', 15);
  for (let i = 0; i < 9; i++) {
    addParticle(c.x, c.y - 38, {
      type: 'coin', vx: rand(-70, 70), vy: rand(-130, -60), gravity: 260,
      life: rand(.7, 1.1), maxLife: 1.1, size: rand(2.2, 3.4), spin: rand(-8, 8),
    });
  }
  if (ped.qty <= 0) {
    ped.weapon = null;
    ped.qty = 0;
    ped.mult = 1;
    ped.price = 0;
    setTimeout(() => {
      if (state.phase === 'playing') ui.hint(`Sold out of ${w.name}. The forge awaits.`, 3800);
    }, 900);
  }
  audio.play('sale');
  setTimeout(() => audio.play('coin'), 90);
  ui.sale(w.name, price);
  bumpQuest('sell');
  ui.sync();
}

function updateCustomers(dt) {
  for (const c of state.customers) {
    if (c.bubbleTimer > 0) {
      c.bubbleTimer -= dt;
      if (c.bubbleTimer <= 0) c.bubble = null;
    }
    moveCustomer(c, dt);
  }
  state.customers = state.customers.filter((c) => !c.gone);

  if (state.firstDisplay && state.time < 18.5 * 60 && state.customers.length < 4) {
    state.customerTimer -= dt;
    if (state.customerTimer <= 0) {
      spawnCustomer();
      const hasStock = state.pedestals.some((p) => p.unlocked && p.qty > 0);
      let interval = 12 - state.day * .45 - (state.upgrades.sign ? 2.6 : 0) + rand(-1.5, 2.5);
      if (!hasStock) interval *= 1.55;
      state.customerTimer = Math.max(4.4, interval);
    }
  }
}

/* ============================================================
   day flow
   ============================================================ */
function endDay() {
  if (state.phase !== 'playing' && state.phase !== 'paused') return;
  if (state.modal) ui.closeModal(true);
  ui.updatePrompt(null);
  ui.hidePause();
  state.phase = 'summary';
  state.customers = [];
  state.shake = 0;
  audio.play('day');
  const final = state.day >= DAYS && !state.endless;
  let title, sub, tip;
  if (state.daySales === 0) {
    title = 'A quiet day in the valley.';
    sub = 'The lanterns are lit, but the till is still sleeping.';
  } else if (state.dayEarned >= 220) {
    title = 'The till is singing.';
    sub = 'Word of your little shop is travelling farther than you think.';
  } else {
    title = 'The lanterns are lit.';
    sub = 'A good, honest day of work.';
  }
  if (!state.firstDisplay) tip = 'Forge a weapon, then stock a pedestal. Customers cannot buy what they cannot see.';
  else if (!state.pedestals.some((p) => p.unlocked && p.qty > 0)) tip = 'Your shelves are empty. Restock before the morning rush.';
  else if (state.gold < (GOAL / DAYS) * state.day) tip = 'Try a higher price on a rare weapon — the right collector will pay for it.';
  else if (state.upgrades.sign || state.upgrades.bellows) tip = 'A little investment goes a long way. The ledger is always open.';
  else tip = 'Rangers chase swift blades. Knights want weight. Mages pay for crystal.';
  ui.showDay({ day: state.day, earned: state.dayEarned, sales: state.daySales, gold: state.gold, final, title, sub, tip });
  ui.sync();
}

function nextDay() {
  if (state.phase !== 'summary') return;
  ui.hideDay();
  if (state.day >= DAYS && !state.endless) {
    showEnd();
    return;
  }
  state.day += 1;
  state.time = DAY_START;
  state.dayEarned = 0;
  state.daySales = 0;
  state.customerTimer = 8;
  state.customers = [];
  state.phase = 'playing';
  for (const p of world.plots) {
    if (!p.empty) {
      p.growth = Math.min(1, p.growth + .42);
      p.stage = p.growth >= 1 ? 3 : p.growth >= .72 ? 2 : 1;
    }
  }
  for (const n of world.nodes) {
    if (!n.alive) {
      n.respawn = Math.max(0, n.respawn - 26);
      if (n.respawn <= 0) { n.alive = true; n.hp = n.maxHp; }
    }
  }
  snapCamera();
  ui.setPhase('playing');
  ui.toast(`Day ${state.day} — the valley stirs.`, { icon: 'sunbloom', kind: 'gold' });
  ui.sync();
  audio.play('day');
}

function showEnd() {
  const win = state.gold >= GOAL;
  state.resultWin = win;
  const result = {
    win,
    gold: state.gold,
    earned: state.earned,
    sales: state.totalSales,
    title: win ? 'The shop is saved.' : 'The bank came calling.',
    sub: win
      ? 'The valley has its forge-shop for another season. The lanterns stay lit, the forge stays warm, and the shelves are yours to fill.'
      : `You needed ${fmt(GOAL)} gold and finished with ${fmt(state.gold)}. The old shop closes its shutters — but the valley remembers a good try.`,
  };
  ui.showEnd(result);
  audio.play(win ? 'start' : 'error');
}

function endMain() {
  if (state.phase !== 'end') return;
  if (state.resultWin) {
    state.endless = true;
    state.day += 1;
    state.time = DAY_START;
    state.dayEarned = 0;
    state.daySales = 0;
    state.customerTimer = 8;
    state.customers = [];
    state.phase = 'playing';
    ui.hideEnd();
    snapCamera();
    ui.setPhase('playing');
    ui.toast('Endless season — the shop stays open.', { icon: 'leaf', kind: 'gold' });
    ui.sync();
  } else {
    restart();
  }
}

/* ============================================================
   player & camera
   ============================================================ */
function collides(x, y, r) {
  if (x < 34 || y < 34 || x > WORLD.w - 34 || y > WORLD.h - 34) return true;
  for (const c of world.colliders) {
    if (c.node && !c.node.alive) continue;
    if (c.type === 'rect') {
      const nx = clamp(x, c.x, c.x + c.w);
      const ny = clamp(y, c.y, c.y + c.h);
      if ((x - nx) ** 2 + (y - ny) ** 2 < r * r) return true;
    } else if (c.type === 'circle') {
      if ((x - c.x) ** 2 + (y - c.y) ** 2 < (r + c.r) ** 2) return true;
    } else if (c.type === 'ellipse') {
      const ex = (x - c.x) / (c.rx + r);
      const ey = (y - c.y) / (c.ry + r);
      if (ex * ex + ey * ey < 1) return true;
    }
  }
  return false;
}

function movePlayer(dx, dy) {
  if (!collides(player.x + dx, player.y, player.r)) player.x += dx;
  if (!collides(player.x, player.y + dy, player.r)) player.y += dy;
}

function updatePlayer(dt) {
  let ix = 0, iy = 0;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) ix -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) ix += 1;
  if (keys.has('KeyW') || keys.has('ArrowUp')) iy -= 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) iy += 1;
  ix += touchVec.x;
  iy += touchVec.y;
  const len = Math.hypot(ix, iy);
  const sprint = keys.has('ShiftLeft') || keys.has('ShiftRight');
  if (len > .08) {
    ix /= Math.max(1, len);
    iy /= Math.max(1, len);
    const speed = sprint ? 292 : 214;
    movePlayer(ix * speed * dt, iy * speed * dt);
    player.facing = Math.atan2(iy, ix);
    player.moving = true;
    player.walkTime += dt * (sprint ? 1.35 : 1);
    if (Math.random() < dt * 7) {
      addParticle(player.x + rand(-5, 5), player.y + 1, {
        type: 'dust', vx: rand(-8, 8), vy: rand(-15, -5), life: .5, maxLife: .5,
        size: rand(1.2, 2.2), color: 'rgba(214, 198, 162, .45)',
      });
    }
  } else {
    player.moving = false;
  }
}

function computeScale() {
  const w = window.innerWidth, h = window.innerHeight;
  if (w < 900) return clamp(Math.max(w / 620, h / 880), .82, 1.15);
  return clamp(Math.min(w / 1220, h / 780), .95, 1.35);
}

function clampCamera() {
  view.scale = computeScale();
  const halfW = window.innerWidth / (2 * view.scale);
  const halfH = window.innerHeight / (2 * view.scale);
  view.x = WORLD.w > halfW * 2 ? clamp(view.x, halfW, WORLD.w - halfW) : WORLD.w / 2;
  view.y = WORLD.h > halfH * 2 ? clamp(view.y, halfH, WORLD.h - halfH) : WORLD.h / 2;
}

function snapCamera() {
  view.x = player.x;
  view.y = player.y - 30;
  view.scale = computeScale();
  clampCamera();
}

function updateCamera(dt) {
  view.scale = computeScale();
  const tx = player.x + Math.cos(player.facing) * 16;
  const ty = player.y - 24 + Math.sin(player.facing) * 10;
  view.x = lerp(view.x, tx, 1 - Math.pow(.002, dt));
  view.y = lerp(view.y, ty, 1 - Math.pow(.002, dt));
  clampCamera();
}

function updateAttract(dt) {
  state.attract += dt * .034;
  const pts = [
    { x: 760, y: 690 }, { x: 1130, y: 1120 }, { x: 1520, y: 700 }, { x: 1000, y: 480 },
  ];
  const raw = state.attract % pts.length;
  const i = Math.floor(raw);
  const t = raw - i;
  const ease = t * t * (3 - 2 * t);
  const a = pts[i], b = pts[(i + 1) % pts.length];
  view.x = lerp(a.x, b.x, ease);
  view.y = lerp(a.y, b.y, ease);
  view.scale = computeScale() * .98;
  clampCamera();
  player.facing = -Math.PI / 2 + Math.sin(state.attract * 1.4) * .2;
}

/* ============================================================
   ambient particles & frame update
   ============================================================ */
function updateParticles(dt) {
  for (const p of state.particles) {
    p.life -= dt;
    p.vy += (p.gravity || 0) * dt;
    p.vx *= Math.pow(p.drag ?? .98, dt * 60);
    p.vy *= Math.pow(p.drag ?? .98, dt * 60);
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot = (p.rot || 0) + (p.spin || 0) * dt;
  }
  state.particles = state.particles.filter((p) => p.life > 0);
  for (const f of state.floaters) {
    f.life -= dt;
    f.y -= 26 * dt;
  }
  state.floaters = state.floaters.filter((f) => f.life > 0);
  if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 24);
}

function updateAmbient(dt) {
  state.ambientTimer -= dt;
  if (state.ambientTimer <= 0) {
    state.ambientTimer = rand(.7, 2.2);
    const x = player.x + rand(-380, 380);
    const y = player.y + rand(-280, 180);
    addParticle(x, y, {
      type: 'leaf', vx: rand(8, 26), vy: rand(10, 24), drag: .995,
      life: rand(2.5, 4.5), maxLife: 4.5, size: rand(1.8, 3.2),
      color: pick(['#8fb36c', '#b7a95f', '#7ca45c', '#d9b86a']),
      rot: rand(0, TAU), spin: rand(-1.6, 1.6), gravity: 3,
    });
  }
}

function updateGame(dt) {
  state.time += dt * TIME_RATE;
  if (state.time >= DAY_END) {
    state.time = DAY_END;
    endDay();
    return;
  }

  updatePlayer(dt);
  updateCamera(dt);
  updateAmbient(dt);

  for (const p of world.plots) {
    if (p.empty || p.growth >= 1) continue;
    const crop = CROPS[p.crop];
    p.growth = Math.min(1, p.growth + (dt / crop.grow) * (p.watered ? 2 : 1));
    if (p.growth >= 1) {
      p.stage = 3;
      p.growth = 1;
      burst(p.cx, p.cy + 6, 5, { type: 'spark', color: '#f6e0a0', speed: 20, lift: 16, life: .6 });
    } else if (p.growth >= .7) p.stage = 2;
    else p.stage = 1;
  }

  for (const n of world.nodes) {
    if (n.shake > 0) n.shake = Math.max(0, n.shake - dt);
    if (!n.alive) {
      n.respawn -= dt;
      if (n.respawn <= 0) {
        n.alive = true;
        n.hp = n.maxHp;
        n.shake = 0;
        burst(n.x, n.y - 8, 8, { type: 'dust', color: 'rgba(200, 210, 190, .4)', speed: 30, lift: 20, life: .7 });
      }
    }
  }

  updateCustomers(dt);

  currentNearest = findNearest();
  player.tool = currentNearest?.tool || null;

  state.hudTimer -= dt;
  if (state.hudTimer <= 0) {
    state.hudTimer = .14;
    ui.sync();
  }

  const sig = currentNearest ? `${currentNearest.id}|${currentNearest.prompt}` : 'none';
  if (sig !== lastPromptSig) {
    lastPromptSig = sig;
    ui.updatePrompt(currentNearest);
  }
}

function updatePaused(dt) {
  updateAmbient(dt);
}

/* ============================================================
   main loop
   ============================================================ */
function frame(now) {
  if (!lastTime) lastTime = now;
  let dt = (now - lastTime) / 1000;
  lastTime = now;
  dt = Math.min(dt, .05);
  clock += dt;

  if (state.phase === 'playing') {
    if (!state.modal) updateGame(dt);
    else updatePaused(dt);
    currentNearest = state.modal ? null : currentNearest;
    if (state.modal) {
      if (lastPromptSig !== 'modal') { lastPromptSig = 'modal'; ui.updatePrompt(null); }
    }
  } else if (state.phase === 'title') {
    updateAttract(dt);
    updateAmbient(dt);
  } else if (state.phase === 'summary' || state.phase === 'end') {
    updateAmbient(dt);
  } else if (state.phase === 'paused') {
    updatePaused(dt);
  }

  updateParticles(dt);
  renderer.draw(clock, view, player, state.phase === 'playing' ? currentNearest : null, state.particles, state.floaters);
  requestAnimationFrame(frame);
}

/* ============================================================
   input
   ============================================================ */
function onKeyDown(e) {
  const code = e.code;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) e.preventDefault();

  if (code === 'Escape') {
    if (state.modal) { ui.closeModal(); return; }
    if (state.phase === 'playing') { pause(); return; }
    if (state.phase === 'paused') { resume(); return; }
  }
  if (code === 'KeyM') {
    const on = audio.toggle();
    ui.updateSoundIcon(on);
    audio.play('ui');
    return;
  }
  if (state.phase === 'title') {
    if (code === 'Enter' || code === 'Space' || code === 'KeyE') {
      audio.init();
      audio.play('start');
      startGame();
    }
    return;
  }
  if (state.phase === 'paused') {
    if (code === 'KeyP') resume();
    return;
  }
  if (state.phase !== 'playing') return;
  if (state.modal) return;
  if (code === 'KeyE' || code === 'Space') {
    if (!e.repeat) interact();
    return;
  }
  if (code === 'KeyP') { pause(); return; }
  keys.add(code);
}

function onKeyUp(e) {
  keys.delete(e.code);
}

/* touch joystick */
function setupTouch() {
  const stick = document.getElementById('stick');
  const knob = document.getElementById('stickKnob');
  const actionBtn = document.getElementById('actionBtn');
  let pointerId = null;

  function updateStick(e) {
    const rect = stick.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const max = rect.width * .34;
    const len = Math.hypot(dx, dy);
    if (len > max) { dx = dx / len * max; dy = dy / len * max; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    touchVec.x = dx / max;
    touchVec.y = dy / max;
  }
  function resetStick() {
    pointerId = null;
    touchVec.x = 0; touchVec.y = 0;
    knob.style.transform = 'translate(0,0)';
  }
  stick.addEventListener('pointerdown', (e) => {
    if (state.phase !== 'playing' || state.modal) return;
    pointerId = e.pointerId;
    stick.setPointerCapture?.(e.pointerId);
    updateStick(e);
    e.preventDefault();
  });
  stick.addEventListener('pointermove', (e) => {
    if (pointerId !== e.pointerId) return;
    updateStick(e);
    e.preventDefault();
  });
  stick.addEventListener('pointerup', (e) => { if (pointerId === e.pointerId) resetStick(); });
  stick.addEventListener('pointercancel', resetStick);
  stick.addEventListener('lostpointercapture', resetStick);
  actionBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (state.phase === 'playing' && !state.modal) interact();
  });
}

/* ============================================================
   boot
   ============================================================ */
ui = createUI({ state, actions, audio });
ui.init();
ui.setPhase('title');
snapCamera();
view.x = 900;
view.y = 900;
clampCamera();
ui.sync();
setupTouch();
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.addEventListener('blur', () => { keys.clear(); touchVec = { x: 0, y: 0 }; });
requestAnimationFrame(frame);

/* expose a small debug surface for verification */
window.__ironroot = {
  state, player, world, view,
  startGame, interact, endDay, nextDay, craft, placeWeapon, adjustPrice, addStock, clearPedestal,
  spawnCustomer,
  teleport(x, y) { player.x = x; player.y = y; snapCamera(); },
  give(res, n) { state.resources[res] = (state.resources[res] || 0) + n; ui.sync(); },
  addWeapon(id, n = 1) { state.weapons[id] = (state.weapons[id] || 0) + n; ui.sync(); },
  setGold(n) { state.gold = n; ui.sync(); },
  setTime(min) { state.time = min; ui.sync(); },
  openCraft() { ui.openModal('craft'); },
  openLedger() { ui.openModal('ledger'); },
  openPedestal(i) { ui.openModal('pedestal', { index: i }); },
  closeModal() { ui.closeModal(); },
  fastForward(seconds) {
    let left = seconds;
    while (left > 0 && state.phase === 'playing') {
      updateGame(.05);
      updateParticles(.05);
      left -= .05;
    }
    ui.sync();
  },
  findNearest,
};
