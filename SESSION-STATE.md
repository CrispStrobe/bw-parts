# Session state — 2026-08-10/11

## Where things stand

124 catalog kinds, 123 SVG files, 123 JSON sidecars, all with breadboard
footprint data (80 with footprints, 43 explicit null). Everything pushed
through `b44aec7`.

## What was done

1. **Slug renames** (db77e8b): 7 bw-parts slugs renamed to match
   bw-board/bw-circuit-ui consensus.
2. **Final two SVGs** (faa08a3): microbit_breakout, pololu_motor_ctrl.
3. **Four engine-only parts** (88b6928): fuse, solenoid, stepper,
   ir_transmitter.
4. **README** (bb57d0c): written from scratch — repo had none.
5. **Naming corrections** (38e1256, 6af32e0): wokwi-elements attribution
   restored; Tinkercad naming restored in private internal files.
6. **Multi-arch boards** (465ac3a): Arduino Nano sidecar+SVG (30 terminals),
   Pi Pico sidecar+SVG (43 terminals), ATmega328P pin table (audited
   against Microchip DS40002061B), RP2040 pin table (audited against
   2023-03-02 datasheet).
7. **STC12 three-way audit** (fbfacf8): stc_mcu.json checked against
   STC12C5A60S2 datasheet AND stc/docs/PINOUT.md. All 40 pins agree
   across all three sources. Five known traps verified (VCC pin 40,
   P0 descending, no EA/PSEN, only P4.4–P4.7, RST active high).
8. **Spec-update 004** (6ab8a9b): durable doc for bw-board (frozen) on
   what it must do for Nano and Pico. Names the boundary: parts and pin
   tables delivered, simulation for non-8051 cores neither built nor
   designed.
9. **Spec-update 005** (e817263): vendored sidecars in bw-circuit-ui are
   stale (115 vs 123). Lists the 8 missing and 4 renamed files.
10. **Breadboard footprints** (b44aec7): footprint field added to all 123
    sidecars, matching bw-circuit-ui's proposed shape (refTerminal, leads,
    straddlesGutter, minCols).

## What was ruled out and why

### Sidecar format decisions (deliberate constraints)

- **Alternate-function data does NOT go in sidecars.** The STC audit
  (fbfacf8) confirmed sidecars carry port names only (P1.0, not ADC0).
  This is deliberate — the pin-chooser dialog must read alternate
  functions from the pin tables (`docs/pin-table-*.md`), not from
  sidecars. bw-board's `rst-polarity` spec-update (in their repo)
  makes the same point. If bw-board needs structured JSON for pin
  functions, it should specify the schema and bw-parts will produce it.
  Until then, the human-readable markdown tables are the source.

- **RST polarity is NOT in the sidecar format.** bw-board decided
  (spec-updates/rst-polarity.md in their repo) that the engine
  hard-codes reset polarity per part kind, not per sidecar instance.
  The sidecar format deliberately cannot express it. This is a binding
  constraint: the next person adding a part with unusual reset behaviour
  (e.g., active-low AVR vs active-high 8051) needs to know the sidecar
  won't carry that information — it lives in the engine's per-family
  table. Documented here so it is not rediscovered as a gap.

### Slug decisions (left open for owner)

- **tilt_switch → tilt_sensor**: both other repos use tilt_sensor, but
  bw-parts has two variants (2-pin and 4-pin) as separate slugs.
  Collapsing changes the sidecar contract. Left open.
- **dip_switch collapse**: same pattern. Left open.

### Scope decisions

- **esp8266**: declined, WiFi simulation out of scope.
- **RP2040 full pin mux matrix**: pin tables show SDK defaults only.
  Documenting every possible GPIO-to-peripheral assignment would be a
  matrix, not a table. The pin chooser should show defaults with a note
  that remapping is possible.
- **Automated test suite**: not built. verify-art.js is visual only.
  A future session could add JSON schema validation or
  terminal-position-in-viewBox checks.
- **Terminal cross-validation in a running renderer**: not done. Positions
  are mathematically placed but never tested in bw-circuit-ui.

### Footprint assumptions

- DIP footprints use the standard convention: pin 1 top-left, numbering
  goes down the left side then up the right side. `dRow=0` is the left
  row, `dRow=5` is the right row (across gutter).
- Inline parts (resistor, LED, etc.) assume standard through-hole
  breadboard spacing. A resistor spans 4 columns (1 inch); an LED spans
  1 column (adjacent holes). These match common breadboard practice but
  are not mechanically derived from component datasheets.
- Parts without a breadboard footprint (`null`) include batteries,
  instruments, motors, abstract parts, and modules too large for
  standard breadboard placement (Arduino Uno, relays, displays).
  The Uno gets `null` because it's too wide to straddle the gutter —
  it sits beside the board and connects via wires.

## Next concrete steps

1. bw-circuit-ui needs to re-sync vendored sidecars (spec-update 005).
   123 files now, with footprint data they need for breadboard placement.
2. bw-board needs to register arduino_nano and pi_pico (spec-update 004).
   bw-board is frozen — they will find the spec-update cold.
3. If bw-board or bw-circuit-ui needs pin alt-function data as structured
   JSON (not markdown), bw-parts should produce it. No schema has been
   proposed.
4. The 10 remaining slug mismatches (spec-update 003) need action from
   bw-board and bw-circuit-ui.
5. No licence file exists. The owner has not ruled.
6. Four unverified identifications (clock_display, attiny85, microbit,
   gas_sensor) need external confirmation.
