/* ============================================================
   IRONROOT & IVY — data, layout & tiny helpers
   ============================================================ */

export const TAU = Math.PI * 2;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
export const pick = (arr) => arr[(Math.random() * arr.length) | 0];
export const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
export const fmt = (n) => Math.round(n).toLocaleString('en-US');

export function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}
export function ellipsePath(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
}
export function hash(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/* ---------------- world & clock ---------------- */
export const WORLD = { w: 2400, h: 1800 };
export const GOAL = 1200;
export const DAYS = 7;
export const DAY_START = 8 * 60;
export const DAY_END = 20 * 60;
export const DAY_SECONDS = 205;
export const TIME_RATE = (DAY_END - DAY_START) / DAY_SECONDS;
export const GROUND_SCALE = 1.25;

/* ---------------- resources ---------------- */
export const RESOURCES = {
  wood: { name: 'Oak', icon: 'wood', color: '#b47b45' },
  stone: { name: 'Stone', icon: 'stone', color: '#9ba3a0' },
  iron: { name: 'Iron', icon: 'iron', color: '#8b99a5' },
  crystal: { name: 'Crystal', icon: 'crystal', color: '#8f7bd8' },
  turnip: { name: 'Turnip', icon: 'turnip', color: '#e59ab5' },
  wheat: { name: 'Wheat', icon: 'wheat', color: '#dfb955' },
  sunbloom: { name: 'Sunbloom', icon: 'sunbloom', color: '#f2c75b' },
};
export const RES_ORDER = ['wood', 'stone', 'iron', 'crystal', 'turnip', 'wheat', 'sunbloom'];

/* ---------------- crops ---------------- */
export const CROPS = {
  turnip: {
    name: 'Turnip', grow: 46, yield: [1, 2], color: '#e59ab5', accent: '#7cb46a',
    label: 'Turnip patch', short: 'Turnip',
  },
  wheat: {
    name: 'Wheat', grow: 58, yield: [1, 2], color: '#dfb955', accent: '#b58c35',
    label: 'Wheat patch', short: 'Wheat',
  },
  sunbloom: {
    name: 'Sunbloom', grow: 70, yield: [1, 2], color: '#f2c75b', accent: '#d98a2f',
    label: 'Sunbloom patch', short: 'Sunbloom',
  },
};

/* ---------------- weapons ---------------- */
export const WEAPONS = {
  oakblade: {
    id: 'oakblade', name: 'Oak Blade', kind: 'sword', tag: 'swift', base: 52,
    cost: { wood: 2, turnip: 1 },
    desc: 'A light, honest blade with a turnip-oil grip.',
    palette: { metal: '#cfd9df', edge: '#f5fafb', dark: '#687982', grip: '#8b5a2f', accent: '#d9a441' },
  },
  ironblade: {
    id: 'ironblade', name: 'Ironwood Saber', kind: 'sword', tag: 'swift', base: 118,
    cost: { wood: 2, iron: 2, wheat: 1 },
    desc: 'Valley iron, wheat-straw wrap, and a wicked curve.',
    palette: { metal: '#b9c8d2', edge: '#f1f7fa', dark: '#566772', grip: '#7d4f2b', accent: '#c98d39' },
  },
  scythe: {
    id: 'scythe', name: 'Harvest Scythe', kind: 'scythe', tag: 'farm', base: 168,
    cost: { iron: 2, wheat: 3, turnip: 1 },
    desc: 'Reaps wheat and, on a bad day, expectations.',
    palette: { metal: '#c6d2d9', edge: '#f3f8fa', dark: '#5f7078', grip: '#8a5b31', accent: '#b9a24e' },
  },
  sunblade: {
    id: 'sunblade', name: 'Sunforged Saber', kind: 'sword', tag: 'arcane', base: 310,
    cost: { iron: 3, sunbloom: 2, crystal: 1 },
    desc: 'Holds a sliver of noon. Warm to the touch.',
    palette: { metal: '#f3d68c', edge: '#fff6d2', dark: '#9d6f22', grip: '#6c4526', accent: '#f2c75b' },
  },
  embercleaver: {
    id: 'embercleaver', name: 'Ember Cleaver', kind: 'axe', tag: 'heavy', base: 365,
    cost: { iron: 3, crystal: 1, sunbloom: 2 },
    desc: 'A heavy head that remembers the forge fire.',
    palette: { metal: '#c0cbd3', edge: '#f0f7f9', dark: '#596a75', grip: '#744729', accent: '#c9663f' },
  },
  greataxe: {
    id: 'greataxe', name: 'Crystal Greataxe', kind: 'axe', tag: 'heavy', base: 450,
    cost: { stone: 4, iron: 2, crystal: 2, sunbloom: 2 },
    desc: 'Quarry crystal, old iron, and absolutely no subtlety.',
    palette: { metal: '#a99ae2', edge: '#eee8ff', dark: '#5b4a9b', grip: '#6d482d', accent: '#8f7bd8' },
  },
};
export const WEAPON_ORDER = ['oakblade', 'ironblade', 'scythe', 'sunblade', 'embercleaver', 'greataxe'];

/* ---------------- customers ---------------- */
export const CUSTOMER_TYPES = [
  {
    id: 'ranger', label: 'Ranger', tags: ['swift'], budget: 1.0,
    cloak: '#4f7a52', trim: '#d8c58e', skin: '#d9a67b', hat: 'hood',
    names: ['Mira', 'Elin', 'Rowan', 'Fenn', 'Sable'],
    lines: ['Light and quick. Just my sort.', 'A ranger never carries dead weight.'],
  },
  {
    id: 'knight', label: 'Knight', tags: ['heavy'], budget: 1.18,
    cloak: '#5d6c88', trim: '#c9d2dd', skin: '#c98f66', hat: 'helm',
    names: ['Tomas', 'Bram', 'Oda', 'Gareth', 'Hilde'],
    lines: ['Heft matters more than shine.', 'I want something with a story.'],
  },
  {
    id: 'mage', label: 'Mage', tags: ['arcane'], budget: 1.24,
    cloak: '#6f5a92', trim: '#e0c97a', skin: '#d8ab8c', hat: 'wizard',
    names: ['Ysolde', 'Pim', 'Arden', 'Nyx', 'Calder'],
    lines: ['Oh, that one hums nicely.', 'I can feel the noon in this.'],
  },
  {
    id: 'farmer', label: 'Farmer', tags: ['farm'], budget: 0.92,
    cloak: '#8a6a45', trim: '#d8c18c', skin: '#c78d62', hat: 'straw',
    names: ['Berta', 'Ollie', 'Hana', 'Wick', 'June'],
    lines: ['Need a good edge for the harvest.', 'Something honest and sturdy.'],
  },
  {
    id: 'collector', label: 'Collector', tags: ['swift', 'heavy', 'arcane', 'farm'], budget: 1.48,
    cloak: '#9a7c3b', trim: '#f0dfad', skin: '#d5a077', hat: 'cap',
    names: ['Percival', 'Vesta', 'Ludo', 'Ottoline', 'Crispin'],
    lines: ['I collect the exceptional.', 'Price is a detail. Beauty is not.'],
  },
];

/* ---------------- quests ---------------- */
export const QUESTS = [
  { id: 'harvest', text: 'Harvest 3 crops', target: 3, reward: 25 },
  { id: 'chop', text: 'Chop 2 oaks', target: 2, reward: 30 },
  { id: 'mine', text: 'Mine 3 rocks', target: 3, reward: 40 },
  { id: 'craft', text: 'Forge a weapon', target: 1, reward: 45 },
  { id: 'display', text: 'Stock a pedestal', target: 1, reward: 55 },
  { id: 'sell', text: 'Make 3 sales', target: 3, reward: 80 },
];

/* ---------------- world layout ---------------- */
export const SHOP = {
  floor: { x: 990, y: 1290, w: 470, h: 370 },
  wall: { x: 1000, y: 1258, w: 450, h: 98 },
  counter: { x: 1140, y: 1362, w: 190, h: 44 },
  forge: { x: 902, y: 1362, w: 82, h: 62 },
  ledger: { x: 1444, y: 1402, w: 60, h: 50 },
  pedestals: [
    { x: 1088, y: 1494 },
    { x: 1170, y: 1494 },
    { x: 1252, y: 1494 },
    { x: 1334, y: 1494 },
  ],
  customerStand: { x: 1240, y: 1442 },
  sign: { x: 1225, y: 1300 },
};

export function createWorld() {
  const plots = [];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 6; col++) {
      const crop = col < 2 ? 'turnip' : col < 4 ? 'wheat' : 'sunbloom';
      plots.push({
        id: `plot-${row}-${col}`,
        x: 392 + col * 81,
        y: 582 + row * 88,
        w: 64, h: 64,
        cx: 392 + col * 81 + 32,
        cy: 582 + row * 88 + 32,
        crop,
        empty: true,
        growth: 0,
        stage: 0,
        watered: false,
        sway: Math.random() * TAU,
      });
    }
  }

  const nodeDefs = [
    { kind: 'tree', x: 970, y: 526, size: 1.08 },
    { kind: 'tree', x: 1078, y: 430, size: 1.14 },
    { kind: 'tree', x: 1170, y: 548, size: 1.0 },
    { kind: 'tree', x: 1308, y: 424, size: 1.12 },
    { kind: 'tree', x: 1404, y: 548, size: 1.05 },
    { kind: 'tree', x: 1290, y: 662, size: 0.98 },
    { kind: 'tree', x: 912, y: 668, size: 1.04 },
    { kind: 'tree', x: 1502, y: 638, size: 1.1 },
    { kind: 'rock', x: 1722, y: 522, resource: 'stone' },
    { kind: 'rock', x: 1824, y: 612, resource: 'stone' },
    { kind: 'rock', x: 1738, y: 704, resource: 'stone' },
    { kind: 'rock', x: 1900, y: 462, resource: 'iron' },
    { kind: 'rock', x: 2022, y: 560, resource: 'iron' },
    { kind: 'rock', x: 1882, y: 664, resource: 'iron' },
    { kind: 'rock', x: 2086, y: 438, resource: 'crystal' },
    { kind: 'rock', x: 1996, y: 712, resource: 'crystal' },
  ];
  const nodes = nodeDefs.map((d, i) => {
    const isTree = d.kind === 'tree';
    return {
      id: `node-${i}`,
      kind: d.kind,
      x: d.x, y: d.y,
      resource: isTree ? 'wood' : d.resource,
      size: d.size || 1,
      hp: isTree ? 3 : d.resource === 'crystal' ? 4 : 3,
      maxHp: isTree ? 3 : d.resource === 'crystal' ? 4 : 3,
      alive: true,
      respawn: 0,
      shake: 0,
      flash: 0,
      sway: Math.random() * TAU,
      hit: 0,
    };
  });

  const decoTrees = [
    { x: 105, y: 190, s: 1.35 }, { x: 238, y: 128, s: 1.2 }, { x: 380, y: 176, s: 1.1 },
    { x: 545, y: 122, s: 1.28 }, { x: 700, y: 188, s: 1.06 }, { x: 852, y: 126, s: 1.22 },
    { x: 1548, y: 160, s: 1.24 }, { x: 1700, y: 118, s: 1.1 }, { x: 1888, y: 170, s: 1.3 },
    { x: 2048, y: 118, s: 1.15 }, { x: 2232, y: 188, s: 1.32 }, { x: 2338, y: 320, s: 1.16 },
    { x: 2288, y: 860, s: 1.25 }, { x: 2320, y: 1060, s: 1.1 }, { x: 2260, y: 1320, s: 1.28 },
    { x: 2310, y: 1560, s: 1.14 }, { x: 2120, y: 1690, s: 1.22 }, { x: 1870, y: 1712, s: 1.1 },
    { x: 1600, y: 1688, s: 1.25 }, { x: 1380, y: 1730, s: 1.08 }, { x: 1120, y: 1712, s: 1.2 },
    { x: 860, y: 1690, s: 1.12 }, { x: 620, y: 1722, s: 1.24 }, { x: 340, y: 1700, s: 1.15 },
    { x: 128, y: 1580, s: 1.3 }, { x: 92, y: 1360, s: 1.14 }, { x: 118, y: 1120, s: 1.24 },
    { x: 92, y: 890, s: 1.1 }, { x: 120, y: 660, s: 1.28 }, { x: 94, y: 450, s: 1.16 },
    { x: 882, y: 330, s: 1.08 }, { x: 1510, y: 300, s: 1.05 }, { x: 1580, y: 760, s: 1.1 },
    { x: 850, y: 790, s: 0.96 }, { x: 1480, y: 850, s: 0.98 }, { x: 760, y: 1500, s: 1.16 },
    { x: 680, y: 1640, s: 1.05 },
  ];

  const bushes = [
    { x: 320, y: 300, s: 1 }, { x: 480, y: 250, s: .9 }, { x: 640, y: 330, s: 1.1 },
    { x: 780, y: 250, s: .8 }, { x: 940, y: 230, s: 1 }, { x: 1480, y: 240, s: .9 },
    { x: 1600, y: 420, s: 1.05 }, { x: 900, y: 880, s: 1 }, { x: 1540, y: 900, s: .95 },
    { x: 760, y: 1150, s: .9 }, { x: 520, y: 1080, s: 1.05 }, { x: 150, y: 1010, s: .9 },
    { x: 1560, y: 1420, s: 1 }, { x: 1650, y: 1560, s: .9 }, { x: 300, y: 940, s: .85 },
    { x: 1950, y: 900, s: 1 }, { x: 2150, y: 1020, s: .9 }, { x: 900, y: 980, s: .8 },
  ];

  const lanterns = [
    { x: 1062, y: 1610, h: 74 }, { x: 1388, y: 1610, h: 74 },
    { x: 1150, y: 1208, h: 66 }, { x: 1310, y: 1208, h: 66 },
  ];

  const colliders = [
    { type: 'rect', x: 255, y: 368, w: 192, h: 150 },
    { type: 'rect', x: SHOP.wall.x, y: SHOP.wall.y, w: SHOP.wall.w, h: SHOP.wall.h },
    { type: 'rect', x: SHOP.counter.x, y: SHOP.counter.y, w: SHOP.counter.w, h: SHOP.counter.h },
    { type: 'rect', x: SHOP.forge.x, y: SHOP.forge.y, w: SHOP.forge.w, h: SHOP.forge.h },
    { type: 'rect', x: SHOP.ledger.x, y: SHOP.ledger.y, w: SHOP.ledger.w, h: SHOP.ledger.h },
    { type: 'circle', x: 918, y: 596, r: 43 },
    { type: 'circle', x: 878, y: 1132, r: 40 },
    { type: 'ellipse', x: 334, y: 1288, rx: 206, ry: 136 },
    { type: 'circle', x: 2172, y: 322, r: 76 },
    // farm fence
    { type: 'rect', x: 350, y: 535, w: 532, h: 12 },
    { type: 'rect', x: 350, y: 535, w: 12, h: 220 },
    { type: 'rect', x: 870, y: 535, w: 12, h: 220 },
    { type: 'rect', x: 350, y: 743, w: 236, h: 12 },
    { type: 'rect', x: 664, y: 743, w: 218, h: 12 },
  ];
  for (const p of SHOP.pedestals) colliders.push({ type: 'circle', x: p.x, y: p.y, r: 17 });
  for (const n of nodes) {
    colliders.push({ type: n.kind === 'tree' ? 'circle' : 'circle', x: n.x, y: n.y + 4, r: n.kind === 'tree' ? 15 : 21, node: n });
  }
  for (const t of decoTrees) colliders.push({ type: 'circle', x: t.x, y: t.y + 6, r: 14 * t.s });

  const decorations = [
    { type: 'hay', x: 486, y: 492, s: 1 },
    { type: 'hay', x: 522, y: 505, s: .9 },
    { type: 'crate', x: 968, y: 1512, s: 1 },
    { type: 'crate', x: 972, y: 1562, s: .9 },
    { type: 'barrel', x: 1468, y: 1520, s: 1 },
    { type: 'barrel', x: 1464, y: 1572, s: .9 },
    { type: 'barrel', x: 950, y: 1332, s: .9 },
    { type: 'stump', x: 1560, y: 540, s: 1 },
    { type: 'stump', x: 900, y: 420, s: .9 },
    { type: 'boulder', x: 2240, y: 720, s: 1.2 },
    { type: 'boulder', x: 1608, y: 350, s: .9 },
    { type: 'mushrooms', x: 1580, y: 660, s: 1 },
    { type: 'mushrooms', x: 960, y: 760, s: .8 },
    { type: 'reeds', x: 150, y: 1240, s: 1 },
    { type: 'reeds', x: 530, y: 1360, s: 1.1 },
    { type: 'lily', x: 300, y: 1250, s: 1 },
    { type: 'lily', x: 410, y: 1320, s: .9 },
    { type: 'lily', x: 250, y: 1350, s: .8 },
  ];

  return {
    plots, nodes, decoTrees, bushes, lanterns, decorations, colliders,
    barn: { x: 255, y: 340, w: 192, h: 178 },
    well: { x: 918, y: 596 },
    windmill: { x: 878, y: 1132 },
    cave: { x: 2172, y: 322 },
    pond: { x: 334, y: 1288, rx: 206, ry: 136 },
    forge: SHOP.forge,
    ledger: SHOP.ledger,
    sign: SHOP.sign,
    customerStand: SHOP.customerStand,
  };
}
