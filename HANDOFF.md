# bw-parts handoff — 2026-08-11

> **Last commit:** `8e63037`
> **Tree:** clean, pushed to origin main

## Done and pushed

- **124 catalog kinds**, 123 SVGs, 123 JSON sidecars (one kind,
  `breadboard`, is catalog-only with no art — it is a placement
  surface, not a component)
- **Breadboard footprints** on all 123 sidecars (`b44aec7`):
  `refTerminal`, `leads`, `straddlesGutter`, `minCols` — consumed
  by bw-circuit-ui for breadboard placement
- **`functions` field on all 866 terminals** — no unknowns remain.
  167 terminals have alternate functions recorded (MCU/IC sidecars,
  datasheet-sourced). 699 terminals audited as genuinely no alternates
  (passives, fixed-pin ICs). Zero null.
  Schema per spec-update 007, confirmed by all three repos
- **Three datasheet-audited pin tables:**
  - STC12C5A60S2 vs datasheet rev 2011-07-15 (`fbfacf8`) — 40 pins,
    three-way check against `stc/docs/PINOUT.md`
  - ATmega328P vs Microchip DS40002061B (`465ac3a`)
  - RP2040 vs 2023-03-02 datasheet (`465ac3a`)
- **Spec-updates 004–007** plus the cross-repo scan convention
  (`CONVENTION.md`) with the enumerate-don't-remember fix (`b1e3e4b`)
- **Pi Pico engine status** updated from `drawable-only` to
  `modeled (rp2040js)` after lite added its adapter (`44947b5`)

## What was ruled out and why

These are decisions, not omissions. They are documented in
`SESSION-STATE.md` and in the transform script comments.

### Vocabulary deliberately skipped

The following pin functions exist in the audited pin tables but were
not encoded into `functions` arrays because no vocabulary slug was
agreed. If bw-board adds slugs, re-run `scripts/add-functions-to-sidecars.py`
with updated lookup tables.

| Function | MCU | Why skipped |
|---|---|---|
| ECI (PCA external clock input) | STC12 | No slug in vocabulary |
| Power-down wake INT (unnumbered) | STC12 | Not a standard external interrupt; distinct from INT0/INT1 |
| WR / RD (external memory bus) | STC12 | Bus control, not relevant to simulator |
| A8–A15, AD0–AD7 (address/data bus) | STC12 | External memory interface, not simulatable |
| XCK (synchronous USART clock) | ATmega328P | Rare usage, no slug |
| CLKO (clock output, fuse-dependent) | ATmega328P | Not runtime-selectable |

### Sidecar format constraints

- **Alternate-function data is in `functions`, not in terminal names.**
  Sidecars carry `P1.0`, not `ADC0`. The pin chooser reads alternates
  from the `functions` array.
- **RST polarity is NOT in sidecars.** bw-board hard-codes it per part
  kind in the engine.
- **`functions: null` means not audited, `[]` means audited and none.**
  A missing `functions` key is a schema error. This is binding.

### Scope

- esp8266 declined (WiFi simulation out of scope)
- RP2040 full pin mux matrix not documented (SDK defaults only)
- No automated test suite beyond visual `verify-art.js`
- Terminal positions mathematically placed, never tested in a running renderer

## Open — owned by bw-parts

**Functions: no unknowns remain (866/866 decided, 167 populated, 699
empty, 0 null).** New parts added in the future need a `functions`
entry on every terminal — use `scripts/audit-simple-parts-functions.py`
as the template.

**4 unverified identifications:** clock_display, attiny85, microbit,
gas_sensor — need external confirmation of which specific component
the catalog entry represents.

**Licence settled: MPL-2.0.** Owner-confirmed for bw-parts,
bw-circuit-ui, bw-cfront, bw-bundle, and sb3-creator. The reasoning:
MPL-2.0 requires attribution, keeps improvements open at file level,
permits combination into a larger work under other terms, and §3.3
leaves the door open to GPL or AGPL later (the reverse would not).
sb3-creator was explicitly relicensed from AGPL-3.0 to MPL-2.0
because AGPL anywhere in a bundle blocks app-store distribution
(brickwright-lite vendors ten of its files into a BSD-3 tree).
Repos NOT under MPL are constrained by upstream: ucsim-stc (GPL-2,
inherited from ucsim), emu8051-stc (MIT, inherited from Jari Komppa),
brickwright-lite (BSD-3, from upstream), stc lab (MIT + Apache-2.0
NOTICE for two derived examples). Do not reopen.

## Open — owned elsewhere

**Twin `pin-functions.js` implementations** (spec-update 007):
- `bw-board/src/pin-functions.js` — engine-side, 1231 tests
- `bw-circuit-ui/src/model/pin-functions.js` — UI-side, reads vendored sidecars

Both handle all four states (`null`, `[]`, `[...]`, `["analog_only"]`)
and agree as of 2026-08-11. Neither file names the other. A fifth state
or a change to `analog_only` semantics that updates one side only will
not fail — the UI will render one thing and the engine will believe
another. Spec-update 007 records this; each file should add a comment
pointing to the other.

**10 slug mismatches** (spec-update 003) need action from bw-board and
bw-circuit-ui.

**Spec-update 004** items for bw-board: register `arduino_nano` and
`pi_pico` board kinds, expose pin alternate-function data, handle
3.3V vs 5V logic levels. bw-board's MNA is frozen for agents.
