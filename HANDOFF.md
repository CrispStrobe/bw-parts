# bw-parts handoff — 2026-08-13

> **Last commit:** `6154a4e`
> **Tree:** clean, pushed to origin main

## Done and pushed

- **125 catalog kinds**, 124 SVGs, 124 JSON sidecars (one kind,
  `breadboard`, is catalog-only with no art — it is a placement
  surface, not a component)
- **Footprint fix: Nano, Pico, 555** (`aac8f67`): the right-side
  `dCol` values were reversed in all three sidecars. Pins at the
  same physical position (same SVG y) now share the same `dCol`,
  matching the correct pattern established by the STC12 and ATtiny85
  sidecars. Verified programmatically.
- **ATtiny85 DIP-8 datasheet audit** (`72ff13f`): all 8 pins audited
  against Microchip DS40001941C. Fixed: PB5 was missing ADC0, PB0
  had incorrect `adc0` (is AIN0, analog comparator, NOT ADC), PB0
  missing `pwm_t0a`, PB1 missing `pwm_t1a`, PB2 missing `scl`,
  `int0`, `t0`. Resized to 60×48 matching 555 DIP-8 package. House-
  style SVG replaces dip-gen. Unverified → verified.
- **Arduino Mega 2560** (`918dbc6`): new canvas board part (78
  terminals: D0-D53, A0-A15, 8 power pins). Pin functions audited
  against ATmega2560 DS40002211A. 15 PWM outputs, 4 UARTs, 6
  external interrupts, SPI, I2C, 16 ADC channels. footprint: null
  (too large for breadboard).
- **micro:bit V2** (`6154a4e`): confirmed as V2 (nRF52833). Added
  PWM to P0/P1/P2 functions. SVG updated with V2-specific touch logo
  and speaker grille. Unverified → verified.
- **Breadboard footprints** on all 124 sidecars:
  `refTerminal`, `leads`, `straddlesGutter`, `minCols` — consumed
  by bw-circuit-ui for breadboard placement
- **`functions` field on all 891 terminals** — no unknowns remain.
  Schema per spec-update 007, confirmed by all three repos
- **Five datasheet-audited pin tables:**
  - STC12C5A60S2 vs datasheet rev 2011-07-15
  - ATmega328P vs Microchip DS40002061B
  - RP2040 vs 2023-03-02 datasheet
  - ATtiny85 vs Microchip DS40001941C (this session)
  - ATmega2560 vs Microchip DS40002211A (this session)
- **Spec-updates 004–007** plus the cross-repo scan convention
  (`CONVENTION.md`) with the enumerate-don't-remember fix

## What was ruled out and why

These are decisions, not omissions.

### Vocabulary deliberately skipped

The following pin functions exist in the audited pin tables but were
not encoded into `functions` arrays because no vocabulary slug was
agreed. If bw-board adds slugs, re-run `scripts/add-functions-to-sidecars.py`
with updated lookup tables.

| Function | MCU | Why skipped |
|---|---|---|
| ECI (PCA external clock input) | STC12 | No slug in vocabulary |
| Power-down wake INT (unnumbered) | STC12 | Not a standard external interrupt |
| WR / RD (external memory bus) | STC12 | Bus control, not relevant to simulator |
| A8–A15, AD0–AD7 (address/data bus) | STC12 | External memory interface |
| XCK (synchronous USART clock) | ATmega328P | Rare usage, no slug |
| CLKO (clock output, fuse-dependent) | ATmega328P | Not runtime-selectable |
| OC1C (D13, ATmega2560) | ATmega2560 | Second PWM on same pin; pwm_t0a is primary |
| ALE, RD, WR (D39-D41, ATmega2560) | ATmega2560 | External bus signals |
| XTAL/TOSC pins | ATtiny85, ATmega2560 | Crystal/oscillator, not simulator-relevant |

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
- No automated test suite beyond visual verification
- Terminal positions mathematically placed, tested via cross-gutter
  alignment validation (this session)

## Open — owned by bw-parts

**Functions: no unknowns remain (891/891 decided).** New parts added
in the future need a `functions` entry on every terminal.

**2 unverified identifications remain:** `clock_display`,
`gas_sensor` — need external confirmation.

**Licence settled: MPL-2.0.** See previous handoff for full reasoning.

## Open — owned elsewhere

**Twin `pin-functions.js` implementations** (spec-update 007):
both handle all four states and agree. A fifth state that updates
one side only will silently diverge.

**Vendored sidecars in bw-circuit-ui** — `npm run sync:parts` in
bw-circuit-ui brings them current. Run after every bw-parts change.

**10 slug mismatches** (spec-update 003) need action from bw-board
and bw-circuit-ui.

**Spec-update 004** items for bw-board: register `arduino_nano`,
`pi_pico`, and `arduino_mega` board kinds, expose pin alternate-
function data, handle 3.3V vs 5V logic levels.
