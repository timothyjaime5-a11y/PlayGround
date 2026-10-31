/* ============================================================
   IRONROOT & IVY — interface controller
   ============================================================ */
import { WEAPONS, WEAPON_ORDER, RESOURCES, RES_ORDER, QUESTS, GOAL, DAYS, fmt, clamp } from './data.js';
import { drawWeaponIcon } from './art.js';

const TAG_LABEL = { swift: 'Swift blade', heavy: 'Heavy weapon', farm: 'Field tool', arcane: 'Arcane arm' };
const DAY_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export function createUI({ state, actions, audio }) {
  const $ = (id) => document.getElementById(id);
  const el = {
    hud: $('hud'),
    start: $('startScreen'),
    startBtn: $('startBtn'),
    startHelp: $('startHelpBtn'),
    dayNum: $('dayNum'),
    clock: $('clock'),
    dayPhase: $('dayPhase'),
    sunDot: $('sunDot'),
    gold: $('gold'),
    goalText: $('goalText'),
    goalFill: $('goalFill'),
    questList: $('questList'),
    questCount: $('questCount'),
    questDots: $('questDots'),
    inventory: $('inventory'),
    satchel: $('satchel'),
    prompt: $('prompt'),
    promptKey: $('promptKey'),
    promptText: $('promptText'),
    toasts: $('toasts'),
    saleBanner: $('saleBanner'),
    cornerHint: $('cornerHint'),
    modalLayer: $('modalLayer'),
    modalBody: $('modalBody'),
    dayScreen: $('dayScreen'),
    dayEyebrow: $('dayEyebrow'),
    dayTitle: $('dayTitle'),
    daySub: $('daySub'),
    dayStats: $('dayStats'),
    dayGoalFill: $('dayGoalFill'),
    dayGoalText: $('dayGoalText'),
    dayTip: $('dayTip'),
    nextDayBtn: $('nextDayBtn'),
    endScreen: $('endScreen'),
    endSeal: $('endSeal'),
    endEyebrow: $('endEyebrow'),
    endTitle: $('endTitle'),
    endSub: $('endSub'),
    endStats: $('endStats'),
    endMainBtn: $('endMainBtn'),
    endNewBtn: $('endNewBtn'),
    pauseScreen: $('pauseScreen'),
    resumeBtn: $('resumeBtn'),
    pauseHelp: $('pauseHelpBtn'),
    restartBtn: $('restartBtn'),
    soundBtn: $('soundBtn'),
    helpBtn: $('helpBtn'),
    pauseBtn: $('pauseBtn'),
    touch: $('touch'),
    actionBtn: $('actionBtn'),
  };

  let currentModal = null;
  let toastTimer = 0;
  let saleTimer = 0;
  let hintTimer = 0;
  let lastWeaponSig = '';
  let lastGold = state.gold;
  const resEls = {};
  let touchEnabled = false;

  /* ---------------- init ---------------- */
  function init() {
    el.inventory.innerHTML = RES_ORDER.map((id) => {
      const r = RESOURCES[id];
      return `<div class="res-chip zero" data-res="${id}" title="${r.name}">
        <svg><use href="#i-${r.icon}"/></svg>
        <span class="res-num">0</span>
        <span class="res-name">${r.name}</span>
      </div>`;
    }).join('');
    for (const id of RES_ORDER) resEls[id] = el.inventory.querySelector(`[data-res="${id}"]`);

    el.questList.innerHTML = QUESTS.map((q) => `
      <li data-quest="${q.id}">
        <span class="q-box"><svg><use href="#i-check"/></svg></span>
        <span class="q-text">${q.text}</span>
        <span class="q-reward">+${q.reward}g</span>
      </li>`).join('');
    el.questDots.innerHTML = QUESTS.map(() => '<i></i>').join('');

    el.startBtn.addEventListener('click', () => { audio.init(); audio.play('start'); actions.startGame(); });
    el.startHelp.addEventListener('click', () => { audio.init(); audio.play('ui'); openModal('help'); });
    el.soundBtn.addEventListener('click', () => { const on = audio.toggle(); updateSoundIcon(on); audio.play('ui'); });
    el.helpBtn.addEventListener('click', () => { audio.play('ui'); openModal('help'); });
    el.pauseBtn.addEventListener('click', () => { audio.play('ui'); actions.pause(); });
    el.resumeBtn.addEventListener('click', () => { audio.play('ui'); actions.resume(); });
    el.pauseHelp.addEventListener('click', () => { audio.play('ui'); openModal('help'); });
    el.restartBtn.addEventListener('click', () => actions.restart());
    el.nextDayBtn.addEventListener('click', () => { audio.play('ui'); actions.nextDay(); });
    el.endMainBtn.addEventListener('click', () => { audio.play('ui'); actions.endMain(); });
    el.endNewBtn.addEventListener('click', () => { audio.play('ui'); actions.restart(); });

    el.modalLayer.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-modal]')) {
        audio.play('ui');
        closeModal();
        return;
      }
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      handleAction(btn.dataset.action, btn.dataset, btn);
    });

    window.addEventListener('resize', () => { updateTouchVisibility(); });
    updateSoundIcon(audio.enabled);
    updateTouchVisibility();
    sync();
  }

  function updateTouchVisibility() {
    const should = state.phase === 'playing' && (window.innerWidth < 820 || matchMedia('(pointer: coarse)').matches);
    touchEnabled = should;
    el.touch.classList.toggle('is-hidden', !should);
  }

  function updateSoundIcon(on) {
    el.soundBtn.innerHTML = `<svg><use href="#i-${on ? 'sound' : 'muted'}"/></svg>`;
    el.soundBtn.title = on ? 'Sound on (M)' : 'Sound off (M)';
  }

  /* ---------------- phases ---------------- */
  function setPhase(phase) {
    if (phase === 'title') {
      el.start.classList.remove('out');
      el.start.style.display = '';
      el.hud.classList.add('is-hidden');
      el.touch.classList.add('is-hidden');
      el.dayScreen.classList.add('is-hidden');
      el.endScreen.classList.add('is-hidden');
      el.pauseScreen.classList.add('is-hidden');
      closeModal(true);
    } else if (phase === 'playing') {
      if (!el.start.classList.contains('out')) {
        el.start.classList.add('out');
        setTimeout(() => { el.start.style.display = 'none'; }, 650);
      }
      el.hud.classList.remove('is-hidden');
      el.dayScreen.classList.add('is-hidden');
      el.endScreen.classList.add('is-hidden');
      el.pauseScreen.classList.add('is-hidden');
      updateTouchVisibility();
    } else if (phase === 'summary') {
      el.hud.classList.remove('is-hidden');
      el.touch.classList.add('is-hidden');
    } else if (phase === 'end') {
      el.hud.classList.remove('is-hidden');
      el.touch.classList.add('is-hidden');
    } else if (phase === 'paused') {
      el.pauseScreen.classList.remove('is-hidden');
      el.touch.classList.add('is-hidden');
    }
  }

  /* ---------------- HUD sync ---------------- */
  function sync() {
    el.dayNum.textContent = state.day;
    const mins = Math.floor(state.time);
    const hh = String(Math.floor(mins / 60)).padStart(2, '0');
    const mm = String(mins % 60).padStart(2, '0');
    el.clock.textContent = `${hh}:${mm}`;
    el.dayPhase.textContent = mins < 660 ? 'Morning' : mins < 900 ? 'Afternoon' : mins < 1080 ? 'Evening' : 'Night';
    const dayPct = clamp((state.time - 480) / 720, 0, 1);
    el.sunDot.style.left = `${dayPct * 100}%`;

    el.gold.textContent = fmt(state.gold);
    el.goalText.textContent = `${fmt(state.gold)} / ${fmt(GOAL)}g`;
    el.goalFill.style.width = `${clamp(state.gold / GOAL, 0, 1) * 100}%`;
    if (state.gold > lastGold) {
      el.gold.animate?.(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }],
        { duration: 320, easing: 'ease-out' }
      );
    }
    lastGold = state.gold;

    for (const id of RES_ORDER) {
      const node = resEls[id];
      if (!node) continue;
      const val = state.resources[id] || 0;
      const num = node.querySelector('.res-num');
      if (num.textContent !== String(val)) {
        num.textContent = val;
        if (Number(num.dataset.prev || 0) < val) {
          node.classList.remove('bump');
          void node.offsetWidth;
          node.classList.add('bump');
        }
        num.dataset.prev = val;
      }
      node.classList.toggle('zero', val === 0);
    }

    // quests
    let done = 0;
    let activeFound = false;
    for (const q of QUESTS) {
      const qs = state.quests[q.id];
      const row = el.questList.querySelector(`[data-quest="${q.id}"]`);
      if (!row) continue;
      const isDone = qs.progress >= q.target;
      if (isDone) done++;
      row.classList.toggle('done', isDone);
      const isActive = !isDone && !activeFound;
      if (isActive) activeFound = true;
      row.classList.toggle('active', isActive);
      row.querySelector('.q-text').textContent = isDone ? q.text : `${q.text}${q.target > 1 ? ` · ${Math.min(qs.progress, q.target)}/${q.target}` : ''}`;
    }
    el.questCount.textContent = `${done} / ${QUESTS.length}`;
    [...el.questDots.children].forEach((d, i) => d.classList.toggle('on', i < done));

    // satchel
    const sig = WEAPON_ORDER.map((id) => `${id}:${state.weapons[id] || 0}`).join('|');
    if (sig !== lastWeaponSig) {
      lastWeaponSig = sig;
      renderSatchel();
    }

    // day goal if visible
    if (!el.dayScreen.classList.contains('is-hidden')) {
      el.dayGoalFill.style.width = `${clamp(state.gold / GOAL, 0, 1) * 100}%`;
      el.dayGoalText.textContent = `${fmt(state.gold)} / ${fmt(GOAL)}g`;
    }
  }

  function renderSatchel() {
    const entries = WEAPON_ORDER.filter((id) => (state.weapons[id] || 0) > 0);
    const total = entries.reduce((s, id) => s + state.weapons[id], 0);
    if (!entries.length) {
      el.satchel.innerHTML = `<div class="satchel-head"><span>Satchel</span><b>empty</b></div><div class="satchel-empty">Forge a weapon, then stock a pedestal.</div>`;
      return;
    }
    const shown = entries.slice(0, 4);
    el.satchel.innerHTML = `<div class="satchel-head"><span>Satchel</span><b>${total} wares</b></div>
      <div class="satchel-list">${shown.map((id) => {
        const w = WEAPONS[id];
        const icon = w.kind === 'axe' ? 'axe' : w.kind === 'scythe' ? 'scythe' : 'sword';
        return `<span class="satchel-item" title="${w.name}"><svg><use href="#i-${icon}"/></svg><b>${state.weapons[id]}</b></span>`;
      }).join('')}${entries.length > 4 ? `<span class="satchel-item"><b>+${entries.length - 4}</b></span>` : ''}</div>`;
  }

  /* ---------------- prompt ---------------- */
  function updatePrompt(nearest) {
    if (!nearest || state.modal || state.phase !== 'playing') {
      el.prompt.classList.add('is-hidden');
      return;
    }
    el.prompt.classList.remove('is-hidden');
    el.promptText.innerHTML = nearest.prompt;
    if (nearest.key) el.promptKey.textContent = nearest.key;
  }

  /* ---------------- toasts ---------------- */
  function toast(text, opts = {}) {
    const { kind = '', icon = 'leaf', duration = 3400 } = opts;
    while (el.toasts.children.length >= 4) el.toasts.firstElementChild.remove();
    const node = document.createElement('div');
    node.className = `toast ${kind}`;
    node.innerHTML = `<span class="t-ico"><svg><use href="#i-${icon}"/></svg></span><span>${text}</span>`;
    el.toasts.appendChild(node);
    setTimeout(() => {
      node.classList.add('out');
      setTimeout(() => node.remove(), 320);
    }, duration);
  }

  function sale(name, price) {
    el.saleBanner.innerHTML = `<div class="sb-eyebrow"><svg><use href="#i-spark"/></svg> Sold at the counter</div>
      <div class="sb-name">${name}</div>
      <div class="sb-price">+<b>${fmt(price)} gold</b> · a happy customer</div>`;
    el.saleBanner.classList.add('show');
    clearTimeout(saleTimer);
    saleTimer = setTimeout(() => el.saleBanner.classList.remove('show'), 3400);
  }

  function hint(text, duration = 4200) {
    el.cornerHint.textContent = text;
    el.cornerHint.classList.add('show');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => el.cornerHint.classList.remove('show'), duration);
  }

  /* ---------------- modal ---------------- */
  function openModal(type, data = {}) {
    currentModal = { type, data };
    state.modal = { type, data };
    el.modalLayer.classList.remove('is-hidden');
    renderModal();
  }

  function closeModal(silent = false) {
    currentModal = null;
    state.modal = null;
    el.modalLayer.classList.add('is-hidden');
    if (!silent) audio.play('page');
  }

  function refreshModal() {
    if (!currentModal) return;
    renderModal();
  }

  function renderModal() {
    if (!currentModal) return;
    let html = '';
    if (currentModal.type === 'craft') html = renderCraft();
    else if (currentModal.type === 'pedestal') html = renderPedestal(currentModal.data.index);
    else if (currentModal.type === 'ledger') html = renderLedger();
    else if (currentModal.type === 'help') html = renderHelp();
    el.modalBody.innerHTML = html;
    el.modalBody.scrollTop = 0;
    for (const c of el.modalBody.querySelectorAll('canvas[data-weapon]')) drawWeaponIcon(c, c.dataset.weapon);
  }

  function bonus() { return state.upgrades.bellows ? 1.2 : 1; }

  function renderCraft() {
    const cards = WEAPON_ORDER.map((id) => {
      const w = WEAPONS[id];
      const can = Object.entries(w.cost).every(([r, n]) => (state.resources[r] || 0) >= n);
      const costs = Object.entries(w.cost).map(([r, n]) => {
        const have = state.resources[r] || 0;
        return `<span class="cost-chip ${have < n ? 'missing' : ''}"><svg><use href="#i-${RESOURCES[r].icon}"/></svg>${n}</span>`;
      }).join('');
      return `<article class="recipe-card ${can ? '' : 'cant'}">
        <canvas class="weapon-thumb" data-weapon="${id}" width="74" height="74"></canvas>
        <div class="recipe-info">
          <h3>${w.name}</h3>
          <span class="recipe-tag">${TAG_LABEL[w.tag]}</span>
          <p class="recipe-desc">${w.desc}</p>
          <div class="cost-row">${costs}</div>
        </div>
        <div class="recipe-foot">
          <span class="recipe-value">${fmt(w.base * bonus())}g<small>value</small></span>
          <button class="craft-btn" data-action="craft" data-id="${id}" ${can ? '' : 'disabled'}>Forge</button>
        </div>
      </article>`;
    }).join('');
    return `<div class="modal-head">
      <div class="head-row">
        <div>
          <p class="eyebrow">The forge</p>
          <h2>Hammer something worth selling</h2>
          <p>Everything you grow and dig comes together here. Forge a weapon, then carry it to a display pedestal.</p>
        </div>
        <span class="forge-bonus"><svg><use href="#i-spark"/></svg>${state.upgrades.bellows ? 'Bellows lit · +20% value' : 'Bellows unlit'}</span>
      </div>
    </div>
    <div class="recipe-grid">${cards}</div>
    <div class="craft-note"><svg><use href="#i-shop"/></svg>Weapons wait in your satchel until you stock them on a pedestal.</div>`;
  }

  function renderPedestal(index) {
    const ped = state.pedestals[index];
    if (!ped) return '';
    if (!ped.unlocked) {
      return `<div class="modal-head"><p class="eyebrow">Display ${index + 1}</p><h2>A covered pedestal</h2>
        <p>This spot is waiting for a little investment. Buy another display pedestal from the shop ledger and put it to work.</p></div>
        <button class="btn btn-paper" data-action="open-ledger">Open the shop ledger <span>→</span></button>`;
    }
    if (!ped.weapon) {
      const entries = WEAPON_ORDER.filter((id) => (state.weapons[id] || 0) > 0);
      const cards = entries.map((id) => {
        const w = WEAPONS[id];
        return `<article class="stock-card">
          <canvas data-weapon="${id}" width="78" height="78"></canvas>
          <h3>${w.name}</h3>
          <small>${state.weapons[id]} in satchel · ${fmt(w.base * bonus())}g base</small>
          <button data-action="place" data-id="${id}">Place here</button>
        </article>`;
      }).join('');
      return `<div class="modal-head"><p class="eyebrow">Display ${index + 1}</p><h2>Dress the pedestal</h2>
        <p>Choose a weapon from your satchel. Customers will browse whatever is on show.</p></div>
        ${entries.length ? `<div class="stock-grid">${cards}</div>` : `<div class="empty-note">Your satchel is empty. Visit the forge and make something beautiful.</div>
        <button class="btn btn-paper" style="margin-top:14px" data-action="open-forge">Open the forge <span>→</span></button>`}`;
    }
    const w = WEAPONS[ped.weapon];
    const mult = ped.mult || 1;
    const demand = mult <= .92 ? ['Bargain', 'They will queue for this', 92]
      : mult <= 1.1 ? ['Fair', 'Most will bite', 66]
        : mult <= 1.3 ? ['Dear', 'Only keen collectors', 38]
          : ['Bold', 'Expect a lot of browsing', 18];
    const pricePct = clamp((mult - .7) / .8, 0, 1) * 100;
    return `<div class="modal-head"><p class="eyebrow">Display ${index + 1}</p><h2>Set the price</h2>
      <p>Low prices empty the shelf. High prices fill the ledger — if the right customer walks in.</p></div>
      <div class="display-grid">
        <div class="display-preview">
          <canvas data-weapon="${ped.weapon}" width="150" height="150"></canvas>
          <span class="dp-stock">In stock ×${ped.qty}</span>
        </div>
        <div class="display-info">
          <span class="display-tag">${TAG_LABEL[w.tag]} · base ${fmt(w.base * bonus())}g</span>
          <h2>${w.name}</h2>
          <p class="display-desc">${w.desc}</p>
          <div class="price-editor">
            <button class="price-btn" data-action="price" data-delta="-1" aria-label="Lower price">−</button>
            <div class="price-main"><b>${fmt(ped.price)}g</b><small>asking price</small></div>
            <button class="price-btn" data-action="price" data-delta="1" aria-label="Raise price">+</button>
          </div>
          <div class="demand">
            <div class="demand-head"><span>Customer appetite</span><b>${demand[0]}</b></div>
            <div class="demand-track"><span style="width:${pricePct}%"></span></div>
            <div class="demand-head" style="margin-top:4px"><span>${demand[1]}</span><span>${Math.round(mult * 100)}% of base</span></div>
          </div>
          <div class="display-actions">
            <button class="btn btn-paper" data-action="addstock" ${(state.weapons[ped.weapon] || 0) > 0 && ped.qty < 3 ? '' : 'disabled'}>Add stock (${state.weapons[ped.weapon] || 0} left)</button>
            <button class="btn btn-outline" data-action="clear">Return to satchel</button>
          </div>
        </div>
      </div>`;
  }

  function renderLedger() {
    const unlocked = state.pedestals.filter((p) => p.unlocked).length;
    const up = state.upgrades;
    const upgradeCard = (id, icon, title, desc, cost, owned) => `
      <article class="upgrade-card">
        <span class="u-ico"><svg><use href="#i-${icon}"/></svg></span>
        <h4>${title}</h4>
        <p>${desc}</p>
        <div class="u-buy">
          ${owned ? `<span class="u-owned">Owned</span>` : `<span class="u-price"><svg><use href="#i-coin"/></svg>${cost}</span>`}
          ${owned ? '' : `<button data-action="buy-upgrade" data-id="${id}" ${state.gold < cost ? 'disabled' : ''}>Buy</button>`}
        </div>
      </article>`;
    return `<div class="modal-head"><p class="eyebrow">The shop ledger</p><h2>Keep the lights on</h2>
      <p>Seven days to earn <b>${fmt(GOAL)} gold</b>. Spend a little to make the shop busier, brighter, and harder to ignore.</p></div>
      <div class="ledger-stats">
        <div class="stat-tile"><span>Shop fund</span><b class="gold">${fmt(state.gold)}g</b></div>
        <div class="stat-tile"><span>Total earned</span><b>${fmt(state.earned)}g</b></div>
        <div class="stat-tile"><span>Weapons sold</span><b>${state.totalSales}</b></div>
        <div class="stat-tile"><span>Day</span><b>${state.day} / ${DAYS}</b></div>
      </div>
      <div class="ledger-section">
        <h3><svg><use href="#i-spark"/></svg>Investments</h3>
        <div class="upgrade-grid">
          ${upgradeCard('sign', 'shop', 'Painted sign', 'Word travels faster. More customers visit each day.', 140, up.sign)}
          ${upgradeCard('pedestal', 'hammer', 'Display pedestal', `One more shelf for your wares. ${unlocked} of 4 in use.`, 180, unlocked >= 4)}
          ${upgradeCard('bellows', 'spark', 'Forge bellows', 'A hotter fire. Every weapon is worth 20% more.', 240, up.bellows)}
        </div>
      </div>
      <div class="ledger-foot">
        <p>Close up early and the day still counts. The festival waits for no one.</p>
        <button class="btn btn-paper" data-action="end-day">Close up for the night</button>
      </div>`;
  }

  function renderHelp() {
    const steps = [
      ['Grow', 'Interact with a farm plot to plant. Water it to double the growth. Harvest when the sparkle appears.'],
      ['Delve', 'Chop oak in the wood, mine stone and iron in the quarry. Crystal hides near the old cave.'],
      ['Forge', 'The forge by the shop turns crops, wood, and ore into six kinds of weapon.'],
      ['Sell', 'Place a weapon on a pedestal. Set the price, keep it stocked, and customers will do the rest.'],
      ['Read the room', 'Rangers like swift blades. Knights want weight. Mages chase crystal. Farmers need a scythe.'],
      ['Save the shop', `Reach ${fmt(GOAL)} gold before the end of day ${DAYS}. Upgrade the shop along the way.`],
    ];
    return `<div class="modal-head"><p class="eyebrow">A field guide</p><h2>How to run a shop</h2>
      <p>Farm by dawn, forge by dusk, sell by lantern light. There is no wrong way to spend a day — only a shop that stays open.</p></div>
      <div class="help-grid">${steps.map((s, i) => `<div class="help-step"><span class="h-num">${i + 1}</span><div><h4>${s[0]}</h4><p>${s[1]}</p></div></div>`).join('')}</div>
      <div class="help-controls">
        <span><kbd>WASD</kbd> / <kbd>↑↓←→</kbd> move</span>
        <span><kbd>E</kbd> / <kbd>Space</kbd> interact</span>
        <span><kbd>Shift</kbd> hurry</span>
        <span><kbd>M</kbd> sound</span>
        <span><kbd>Esc</kbd> pause / close</span>
      </div>`;
  }

  function handleAction(action, data, btn) {
    audio.play('ui');
    if (action === 'craft') {
      actions.craft(data.id);
      refreshModal();
      sync();
    } else if (action === 'place') {
      actions.placeWeapon(currentModal.data.index, data.id);
      refreshModal();
      sync();
    } else if (action === 'price') {
      actions.adjustPrice(currentModal.data.index, Number(data.delta));
      refreshModal();
      sync();
    } else if (action === 'addstock') {
      actions.addStock(currentModal.data.index);
      refreshModal();
      sync();
    } else if (action === 'clear') {
      actions.clearPedestal(currentModal.data.index);
      refreshModal();
      sync();
    } else if (action === 'buy-upgrade') {
      actions.buyUpgrade(data.id);
      refreshModal();
      sync();
    } else if (action === 'open-ledger') {
      openModal('ledger');
    } else if (action === 'open-forge') {
      openModal('craft');
    } else if (action === 'end-day') {
      closeModal(true);
      actions.endDay();
    }
  }

  /* ---------------- day / end / pause ---------------- */
  function showDay(summary) {
    el.dayEyebrow.textContent = `Day ${DAY_WORDS[summary.day - 1] || summary.day}, closed`;
    el.dayTitle.textContent = summary.title;
    el.daySub.textContent = summary.sub;
    el.dayStats.innerHTML = `
      <div class="stat-tile"><span>Earned today</span><b class="gold">${fmt(summary.earned)}g</b></div>
      <div class="stat-tile"><span>Weapons sold</span><b>${summary.sales}</b></div>
      <div class="stat-tile"><span>Shop fund</span><b>${fmt(summary.gold)}g</b></div>`;
    el.dayGoalFill.style.width = `${clamp(summary.gold / GOAL, 0, 1) * 100}%`;
    el.dayGoalText.textContent = `${fmt(summary.gold)} / ${fmt(GOAL)}g`;
    el.dayTip.textContent = summary.tip;
    el.nextDayBtn.innerHTML = summary.final ? 'See how the week ends <span>→</span>' : 'Sleep until morning <span>→</span>';
    el.dayScreen.classList.remove('is-hidden');
    state.phase = 'summary';
    setPhase('summary');
  }

  function hideDay() {
    el.dayScreen.classList.add('is-hidden');
  }

  function showEnd(result) {
    el.endSeal.innerHTML = `<svg><use href="#i-${result.win ? 'spark' : 'leaf'}"/></svg>`;
    el.endEyebrow.textContent = result.win ? 'Seven days later' : 'The festival morning';
    el.endTitle.textContent = result.title;
    el.endSub.textContent = result.sub;
    el.endStats.innerHTML = `
      <div class="stat-tile"><span>Shop fund</span><b class="gold">${fmt(result.gold)}g</b></div>
      <div class="stat-tile"><span>Total earned</span><b>${fmt(result.earned)}g</b></div>
      <div class="stat-tile"><span>Weapons sold</span><b>${result.sales}</b></div>`;
    el.endMainBtn.textContent = result.win ? 'Keep trading' : 'Try again';
    el.endNewBtn.classList.toggle('is-hidden', !result.win);
    el.endScreen.classList.remove('is-hidden');
    state.phase = 'end';
    setPhase('end');
  }

  function hideEnd() {
    el.endScreen.classList.add('is-hidden');
  }

  function showPause() {
    el.pauseScreen.classList.remove('is-hidden');
    state.phase = 'paused';
    setPhase('paused');
  }

  function hidePause() {
    el.pauseScreen.classList.add('is-hidden');
  }

  return {
    init, sync, setPhase, updatePrompt, toast, sale, hint, openModal, closeModal, refreshModal,
    showDay, hideDay, showEnd, hideEnd, showPause, hidePause, updateSoundIcon, updateTouchVisibility,
    get currentModal() { return currentModal; },
    get touchEnabled() { return touchEnabled; },
  };
}
