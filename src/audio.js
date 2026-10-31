/* ============================================================
   IRONROOT & IVY — procedural audio
   ============================================================ */
export function createAudio() {
  let ctx = null;
  let master = null;
  let musicGain = null;
  let enabled = true;
  let timer = null;
  let drone = null;

  function init() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = enabled ? .9 : 0;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = .16;
    musicGain.connect(master);
    startMusic();
  }

  function tone(freq, dur, opts = {}) {
    if (!ctx) return;
    const {
      type = 'sine', vol = .08, attack = .008, release = dur,
      slide = 0, delay = 0, dest = master,
    } = opts;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.max(attack + .01, release));
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t0);
    osc.stop(t0 + dur + .05);
  }

  function noise(dur, opts = {}) {
    if (!ctx) return;
    const { vol = .06, freq = 900, q = 1, delay = 0 } = opts;
    const t0 = ctx.currentTime + delay;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = q;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(t0);
    src.stop(t0 + dur + .02);
  }

  function bell(freq, dur = 2.4, vol = .035, delay = 0) {
    if (!ctx) return;
    tone(freq, dur, { type: 'sine', vol, attack: .02, release: dur, delay, dest: musicGain });
    tone(freq * 2.01, dur * .7, { type: 'sine', vol: vol * .25, attack: .01, release: dur * .7, delay, dest: musicGain });
  }

  function startMusic() {
    if (!ctx || timer) return;
    const pad = ctx.createOscillator();
    const padGain = ctx.createGain();
    pad.type = 'triangle';
    pad.frequency.value = 146.83;
    padGain.gain.value = .018;
    pad.connect(padGain);
    padGain.connect(musicGain);
    pad.start();
    drone = { pad, padGain };
    const scale = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25];
    let step = 0;
    timer = setInterval(() => {
      if (!enabled || !ctx) return;
      if (document.hidden) return;
      step++;
      const n = scale[(step * 3 + (step % 2)) % scale.length];
      bell(n, 2.6, .032);
      if (step % 3 === 0) bell(n / 2, 3.4, .018);
      if (step % 5 === 0) bell(scale[(step + 4) % scale.length], 2.2, .02);
    }, 2600);
  }

  const sfx = {
    click() { tone(620, .05, { type: 'triangle', vol: .03, slide: 80 }); },
    plant() { tone(300, .13, { type: 'triangle', vol: .05, slide: 150 }); noise(.09, { vol: .02, freq: 700 }); },
    water() { noise(.28, { vol: .035, freq: 1100, q: .7 }); tone(700, .2, { type: 'sine', vol: .015, slide: 300 }); },
    harvest() { tone(520, .12, { type: 'triangle', vol: .05 }); tone(780, .16, { type: 'triangle', vol: .04, delay: .06 }); },
    chop() { noise(.1, { vol: .07, freq: 320, q: 1.4 }); tone(150, .1, { type: 'square', vol: .03, slide: -50 }); },
    mine() { tone(1050, .07, { type: 'triangle', vol: .035, slide: -350 }); noise(.09, { vol: .04, freq: 1800, q: 1.2 }); },
    rockBreak() { noise(.26, { vol: .075, freq: 500, q: .8 }); tone(120, .22, { type: 'square', vol: .035, slide: -60 }); },
    craft() { [440, 554.37, 659.25, 880].forEach((f, i) => tone(f, .22, { type: 'triangle', vol: .045, delay: i * .07 })); },
    coin() { tone(880, .09, { type: 'sine', vol: .04 }); tone(1318.5, .16, { type: 'sine', vol: .03, delay: .06 }); },
    sale() { [659.25, 880, 1108.7].forEach((f, i) => tone(f, .18, { type: 'sine', vol: .04, delay: i * .06 })); },
    error() { tone(180, .14, { type: 'sawtooth', vol: .025, slide: -40 }); },
    quest() { [659.25, 880, 987.77].forEach((f, i) => tone(f, .2, { type: 'triangle', vol: .045, delay: i * .08 })); },
    upgrade() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, .28, { type: 'triangle', vol: .04, delay: i * .09 })); },
    day() { [392, 523.25, 659.25, 783.99].forEach((f, i) => tone(f, 1.4, { type: 'sine', vol: .035, delay: i * .11 })); },
    start() { [392, 523.25, 659.25, 880].forEach((f, i) => tone(f, .8, { type: 'triangle', vol: .04, delay: i * .12 })); },
    page() { noise(.1, { vol: .02, freq: 2200, q: .8 }); },
    ui() { tone(440, .06, { type: 'sine', vol: .018 }); },
  };

  return {
    init,
    get enabled() { return enabled; },
    play(name) {
      if (!enabled || !ctx) return;
      try { sfx[name]?.(); } catch {}
    },
    toggle() {
      enabled = !enabled;
      if (master) master.gain.setTargetAtTime(enabled ? .9 : 0, ctx.currentTime, .05);
      if (enabled) init();
      return enabled;
    },
    setEnabled(v) {
      enabled = v;
      if (master && ctx) master.gain.setTargetAtTime(v ? .9 : 0, ctx.currentTime, .05);
    },
  };
}
