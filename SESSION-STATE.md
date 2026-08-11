# Session state — 2026-08-11

## Where things stand

124 catalog kinds, 123 SVG files, 123 JSON sidecars. All sidecars have
breadboard footprint data (80 with footprints, 43 explicit null) and a
`functions` field on every terminal (113 audited from datasheets, 753
null). Everything pushed through `258d1e5`.

## What was done

1. **Slug renames** (db77e8b): 7 bw-parts slugs renamed to match
   bw-board/bw-circuit-ui consensus.
2. **Final two SVGs** (faa08a3): microbit_breakout, pololu_motor_ctrl.
3. **Four engine-only parts** (88b6928): fuse, solenoid, stepper,
   ir_transmitter.
4. **README** (bb57d0c): written from scratch — repo had none.
5. **Naming corrections** (38e1256, 6af32e0): wokwi-elements attribution
   restored.
6. **Multi-arch boards** (465ac3a): Arduino Nano sidecar+SVG (30
   terminals), Pi Pico sidecar+SVG (43 terminals), ATmega328P pin table
   (audited against Microchip DS40002061B), RP2040 pin table (audited
   against 2023-03-02 datasheet).
7. **STC12 three-way audit** (fbfacf8): stc_mcu.json checked against
   STC12C5A60S2 datasheet AND stc/docs/PINOUT.md. All 40 pins agree
   across all three sources.
8. **Spec-update 004** (6ab8a9b, updated 44947b5): multi-arch boards for
   bw-board. Pi Pico updated from drawable-only to modeled (rp2040js)
   after lite added its adapter.
9. **Spec-update 005** (e817263): vendored sidecar drift (115 vs 123).
   Resolved — bw-circuit-ui resynced in 4064e96, 123/123, zero content
   mismatches.
10. **Spec-update 006** (59f6572): stale hobby_gearmotor refs in
    bw-circuit-ui. Resolved in de241d7.
11. **Breadboard footprints** (b44aec7): footprint field added to all
    123 sidecars.
12. **Pin alternate functions schema** (spec-update 007): settled key
    name (`functions` not `alternates`), analog-only encoding
    (`analog_only` in list, not separate boolean), null vs empty
    semantics. Confirmed by all three repos (bw-board b376472,
    bw-circuit-ui 9d7d01e).
13. **Functions data** (10b8105): `functions` field added to all 866
    terminals across 123 sidecars. 113 audited from pin tables, 753 null.
    Transform script at `scripts/add-functions-to-sidecars.py`.
14. **Cross-repo scan convention** (CONVENTION.md): producers write
    spec-updates, consumers enumerate `/mnt/volume1/code/*/spec-updates/`
    at session start. Enumerate-don't-remember fix after bw-blocks missed
    bw-cfront.
15. **Two-implementation warning** in 007: bw-board and bw-circuit-ui
    each have a `pin-functions.js` that interprets the same schema.
    Both agree on all four states as of 2026-08-11.
16. **Coverage stated**: 113/866 (13%). Flagged to bw-circuit-ui that
    87% null is a UI default decision to make deliberately.

## What was ruled out and why

### Sidecar format constraints

- **Alternate-function data is in `functions` arrays, not terminal
  names.** Sidecars carry `P1.0`, not `ADC0`. The pin chooser reads
  alternates from the `functions` field.
- **RST polarity is NOT in sidecars.** bw-board hard-codes it per part
  kind in the engine.
- **`functions: null` = not audited, `[]` = audited and none.** Missing
  key is a schema error. Binding.

### Vocabulary deliberately skipped

| Function | MCU | Why |
|---|---|---|
| ECI (PCA external clock) | STC12 | No vocabulary slug agreed |
| Power-down wake INT | STC12 | Not a numbered external interrupt |
| WR / RD (bus control) | STC12 | External memory, not simulatable |
| A8–A15, AD0–AD7 | STC12 | External memory bus |
| XCK (sync USART clock) | ATmega328P | Rare, no slug |
| CLKO (clock output) | ATmega328P | Fuse-dependent, not runtime |

### Slug decisions (left open)

- tilt_switch → tilt_sensor: two variants as separate slugs, collapsing
  changes the contract. Left open.
- dip_switch collapse: same pattern. Left open.

### Scope

- esp8266 declined (WiFi out of scope)
- RP2040 full pin mux matrix: SDK defaults only
- No automated test suite beyond visual verify-art.js
- Terminal positions not tested in a running renderer

### Footprint assumptions

- DIP: pin 1 top-left, down left side, up right side. dRow=0 left,
  dRow=5 right (across gutter).
- Inline parts: standard through-hole breadboard spacing.
- Null footprint: batteries, instruments, motors, modules too large
  for breadboard.

## Open items

### Owned by bw-parts

- **753 terminals with functions: null (87%).** Method established:
  audit against datasheet, add to lookup in
  `scripts/add-functions-to-sidecars.py`, re-run. Most non-MCU parts
  are simple (resistor: `[]`, LED: `[]`) so a bulk pass could raise
  coverage quickly. This data is rendered to users — bw-circuit-ui
  shows null as "GPIO ?".
- **4 unverified identifications:** clock_display, attiny85, microbit,
  gas_sensor.

### Owned elsewhere

- **Twin pin-functions.js** — bw-board and bw-circuit-ui each have one.
  Schema changes must update both. Neither file names the other yet.
- **10 slug mismatches** (spec-update 003) — bw-board and bw-circuit-ui.
- **Spec-update 004** items — bw-board: register arduino_nano and
  pi_pico, expose pin alt-function data, handle 3.3V vs 5V.

### Settled

- **Licence: MPL-2.0, owner-confirmed.** Applies to bw-parts,
  bw-circuit-ui, bw-cfront, bw-bundle, sb3-creator. Reasoning: file-
  level copyleft, combinable into larger works, §3.3 upgrade path to
  GPL/AGPL. Non-MPL repos constrained by upstream (ucsim-stc GPL-2,
  emu8051-stc MIT, brickwright-lite BSD-3, stc lab MIT + Apache-2.0).
