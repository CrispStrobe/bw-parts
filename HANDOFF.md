# bw-parts handoff — 2026-08-13 (session 2)

> **Last commit:** (pending push)
> **Tree:** clean, pushed to origin main

## Done and pushed (this session)

- **DIP-gen dCol audit**: all 36 straddlesGutter sidecars verified
  correct. The 3 fixed in previous session (555, nano, pico) were
  the only ones with the reversed-dCol bug.
- **5 retro-tier parts** (`ac9d745`): W65C02 CPU DIP-40, W65C22 VIA
  DIP-40, W65C51 ACIA DIP-28, 28C256 EEPROM DIP-28, 62256 SRAM
  DIP-28. All pin tables datasheet-audited against WDC/Microchip/
  Alliance datasheets (cited in sidecar `_note`). 28C256 and 62256
  are pin-compatible.
- **74HC00 datasheet citation** added (TI SN74HC00N SCLS024I).
- **Spec-update 008**: board part rendering guidance for bw-circuit-ui.
  `footprint: null` is correct for canvas-only boards (Mega, Uno,
  micro:bit). bw-circuit-ui needs `SvgParts` render cases and
  `hittest.js` FOOTPRINTS entries — no work needed from bw-parts.

## Done and pushed (previous session, still current)

- **130 catalog kinds**, 129 SVGs, 129 JSON sidecars (one kind,
  `breadboard`, is catalog-only with no art)
- **Footprint fix: Nano, Pico, 555** (`aac8f67`): reversed right-side
  dCol values corrected
- **ATtiny85 DIP-8** (`72ff13f`): datasheet-audited (DS40001941C),
  house-style SVG, unverified → verified
- **Arduino Mega 2560** (`918dbc6`): 78-terminal canvas board part,
  DS40002211A audit
- **micro:bit V2** (`6154a4e`): confirmed nRF52833, PWM added
- **11 datasheet-audited pin tables** (see catalog)
- **Spec-updates 004–008**

## Sidecar format constraints

- `functions: null` = not audited, `[]` = audited and none. Missing
  key is a schema error. Binding.
- RST polarity NOT in sidecars. bw-board hard-codes per kind.
- Alternate-function data in `functions`, not terminal names.

## Open — owned by bw-parts

**2 unverified identifications remain:** `clock_display`, `gas_sensor`.

**Licence settled: MPL-2.0.** (See previous handoffs for reasoning.)

## Open — owned elsewhere

**Spec-update 008** (board part rendering): bw-circuit-ui needs
`SvgParts` cases for `arduino_uno`, `arduino_nano`, `arduino_mega`,
`pi_pico`, `microbit` and matching `FOOTPRINTS` entries in
`hittest.js`. All art and sidecars are ready in `src/parts-data/`.

**10 slug mismatches** (spec-update 003) need action from bw-board
and bw-circuit-ui.

**Spec-update 004**: register `arduino_mega` board kind in bw-board,
plus `w65c02`, `w65c22`, `w65c51`, `28c256`, `62256` if the 6502
machine config targets engine-level simulation.
