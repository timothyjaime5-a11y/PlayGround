# Ironroot & Ivy

**A cozy farm · forge · shop fable.**

Farm peculiar crops, delve the old quarry, hammer humble ore into weapons worth bragging about — then stock your display pedestals, set your prices, and read the room. You have seven days to earn **1,200 gold** before the harvest festival, or the valley's oldest forge-shop closes for good.

Built as a dependency-free static web game: plain HTML, CSS, and JavaScript ES modules, with all art and audio generated procedurally in the browser. No build step, no external assets.

## Play

The game needs to be served over HTTP because it uses ES modules:

```bash
# from the project root
npx serve .
# or
python3 -m http.server 8000
```

Then open the printed URL (for example `http://localhost:8000`) and choose **Open the shop**.

## The loop

1. **Grow** — plant turnips, wheat, and sunbloom in the farm plots. Watering doubles growth speed; harvest when the sparkle appears.
2. **Delve** — chop oak in the woods and mine stone, iron, and crystal in the quarry. Nodes respawn over time.
3. **Forge** — bring crops, wood, and ore to the forge and craft one of six weapons.
4. **Sell** — carry a weapon to a display pedestal, choose a price, and keep it stocked. Customers browse, judge the price against their budget and taste, then buy — or walk away.
5. **Invest** — spend gold in the shop ledger on a painted sign (more customers), another pedestal, or forge bellows (+20% weapon value).
6. **Survive the week** — reach 1,200 gold by the end of day 7. Win and you can keep trading in endless mode; lose and you can try the week again.

Rangers chase swift blades, knights want weight, mages pay for crystal, and farmers need a good scythe. Collectors want the exceptional — and will pay for it.

## Controls

| Action | Desktop | Mobile |
| --- | --- | --- |
| Move | `WASD` / arrow keys | Virtual joystick |
| Interact / plant / harvest / mine / forge | `E` or `Space` | Action button |
| Sprint | `Shift` | — |
| Sound on/off | `M` | HUD sound button |
| Pause / close | `Esc` | HUD pause button |

The game is responsive down to phone widths and uses safe-area insets on notched devices.

## Features

- Hand-painted-feeling procedural world, characters, weapons, weather, and day/night lighting — all drawn on canvas at runtime.
- Six craftable weapons with distinct tags, values, and customer appeal.
- A customer simulation with budgets, type preferences, browsing, counter sales, and walk-outs.
- Quest checklist, satchel inventory, shop ledger upgrades, day summaries, win/lose screens, and endless mode.
- Procedural sound effects and ambient music via the Web Audio API.
- Zero console errors and no external network requests at runtime.

## Project layout

```
index.html        App shell, SVG icon sprite, HUD, overlays, and modals
styles.css        Visual design, responsive layout, and animation
src/game.js       Game state, input, interactions, economy, customers, day flow
src/data.js       Constants, resources, crops, weapons, customers, quests, world layout
src/ground.js     Static world ground painting
src/art.js        Weapons, plots, trees, rocks, and props
src/buildings.js  Shop, barn, forge, pedestals, and landmarks
src/chars.js      Player, customers, and speech bubbles
src/render.js     Frame composition, lighting, and particles
src/ui.js         HUD sync, modals, toasts, overlays, and actions
src/audio.js      Procedural SFX and music
```

## Debug helpers

For development, `window.__ironroot` exposes the live state and helpers such as `teleport(x, y)`, `give(resource, n)`, `addWeapon(id, n)`, `setGold(n)`, `setTime(minutes)`, `openCraft()`, `openLedger()`, `openPedestal(i)`, `spawnCustomer()`, and `fastForward(seconds)`.

---

<!-- omgithub:readme:start -->
## 🚀 Build, play, and remix with OMGithub

**Created using [OMGithub.com](https://omgithub.com).**

[![OMGithub](https://img.shields.io/badge/OMGithub-Open%20project-orange?style=for-the-badge)](https://omgithub.com/timothyjaime5-a11y/PlayGround)
[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?logo=github&style=for-the-badge)](https://github.com/timothyjaime5-a11y/PlayGround)

- 🎮 [Open the project](https://omgithub.com/timothyjaime5-a11y/PlayGround).
- ✨ [Remix this project](https://omgithub.com/?remix=timothyjaime5-a11y%2FPlayGround).
- 💻 [Explore the source](https://github.com/timothyjaime5-a11y/PlayGround).
- 🛠️ [Check build runs](https://github.com/timothyjaime5-a11y/PlayGround/actions).
- 🐛 [Report an issue](https://github.com/timothyjaime5-a11y/PlayGround/issues).
- 👤 [Explore the creator's projects](https://omgithub.com/timothyjaime5-a11y).
- 🌍 [Create with OMGithub](https://omgithub.com).
<!-- omgithub:readme:end -->
