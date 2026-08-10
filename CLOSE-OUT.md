# bw-parts close-out

## What was delivered

20+ commits taking an empty repo to a production-ready parts library:

- **117 SVGs** with JSON terminal sidecars (27 DIP-generated, 90 hand-drawn)
- **`generate-dip.js`** — parametric DIP template; add a chip in 3 lines
- **`PARTS-CATALOG.md`** — single canonical parts list for the fleet (118 kinds)
- **`PARTS-RECONCILIATION.md`** — cross-repo slug/coverage table (7 of 17 mismatches resolved by renaming bw-parts slugs)
- **`CURRENT-RATINGS.md` + `current-ratings.json`** — two-budget current ratings (chip pin budget + supply rail budget), zero nulls, sourced to named datasheets
- **`CONSUMING-RATINGS.md`** — consumer guide for the ratings schema, including the `"circuit"` string coercion trap
- **`DIP-AUDIT.md`** — all 29 DIP pin maps verified against manufacturer datasheets (28 correct, 1 fixed)
- **`ART-PROVENANCE.md`** — provenance statement for the public bundle (see below)
- **`EVIDENCE-NOTE.md`** — the STC12 pin map case for the evidence taxonomy
- **`docs/reference-catalogue.md`** — versioned target list (private repo only, provenance-guarded)

## Art provenance — for the public bundle

**`ART-PROVENANCE.md` and `THIRD-PARTY.md` are being shipped into the
public bundle by bw-circuit-ui.** The provenance statement:

All 115 SVGs are original work. None is traced from, derived from, or
contains paths copied from any third-party asset. The two sources of
external input are:

1. **Manufacturer datasheet pin assignments** (factual data, not
   copyrightable) — cited per chip in `DIP-AUDIT.md` with document IDs
2. **The wokwi-elements visual style** as a reference for the rendering
   register (bench-style front-view components) — no code or SVG paths
   were copied; the style is independently reimplemented

The 27 DIP-generated chips use a **stylised generic DIP body** (black
rectangle, notch, pin-1 dot) that is not traced from any specific
manufacturer's package drawing. The 88 hand-drawn parts depict the
**general appearance** of each component type — not traced from any
photograph, technical drawing, or third-party SVG.

## What was wrong and when it was caught

| Error | Commit shipped | Commit fixed | How caught |
|---|---|---|---|
| STC12 pin map: generic 8051 names (PSEN/ALE/EA don't exist) | 8173386 | eeb54b9 | Checked against stc/docs/PINOUT.md |
| L293D: right-side pins scrambled | initial hand-drawn | f7389af | Audited against TI SLRS008 |
| 5 art files wrongly deleted during reconciliation | 811bcdc | e3c6ebf | Compared against verified reference catalogue |
| Current ratings: passives as null instead of 0 | 126a878 | 8882a86 | Disagreement with bw-board's semantics |
| Vendor name in 8 committed files | various | 25ac1c2, dbfe4f2 | Coordinator caught it; `git grep -il` found 2 more the first scrub missed |
| Rating schema changed without telling consumer | cf3eb7d | 0516aa1 | Coordinator caught vendored copy holding old shape |

## Two-budget current rating schema

A servo draws 350mA from the supply rail, not from the MCU pin. The
old single-number schema could not express this, so the ratings split
into `chip_mA` (120mA MCU I/O limit, §4.1) and `supply_mA` (500mA USB
limit). bw-board consumed this and built `getSupplyCurrent()`.

The `_per_unit_mA` field was added for parts whose total depends on
count: NeoPixels (60mA/pixel, WS2812B datasheet), seven-segment
displays (~20mA/segment), LED matrix and LED cube (~20mA/LED). The
fixed `supply_mA` stays `"circuit"` because actual draw depends on
brightness/color, but the per-unit max lets the DRC compute worst-case.

Motors are rated at **stall current** (800mA), not running (~200mA),
because stall is when brownout occurs. Noted as a class estimate.

## Assert the property, not the symptom

Three repos arrived at this rule independently. In bw-parts:

**Pin map audit**: "pin 32 IS P0.7" catches the whole error class
(ascending P0, shifted pins, rxd-where-P3.0-belongs). "PSEN absent"
catches only PSEN. The L293D was found not because anyone flagged its
pin order as a risk, but because the audit checked what each pin IS.

**Current ratings**: "resistor is not a consumer" (the property) is
different from "resistor has no rating" (the symptom). Same null,
different facts, different DRC message.

## Previously unfinished items — now complete

| Kind | Status | Completed |
|---|---|---|
| `microbit_breakout` | done (faa08a3) | micro:bit in breakout board with 10 exposed pins |
| `pololu_motor_ctrl` | done (faa08a3) | Board-level motor controller, 6 terminals |

All 118 catalog entries now have SVG art and JSON sidecars.

## What I did not verify

- Terminal positions are mathematically placed but not cross-validated
  in a running bw-circuit-ui renderer
- The 4 unverified identifications remain unverified (clock_display
  controller, ATtiny variant, micro:bit generation, gas sensor family)
- Breadboard hole grids are visual art; the circuit model's hole-to-node
  mapping is bw-circuit-ui's responsibility
- The LED cube does not use a 74HC595 (checked in spec-updates/002);
  the voxel map depends on P0/P2 wiring, not shift register pin order

## Ownership boundaries

- **bw-parts owns:** the catalogue, the art, the terminal geometry,
  the current ratings data, the variant collapses, the provenance
- **bw-board owns:** engine kind names, the DRC semantics (what 0 vs
  "circuit" vs null means to the warning text), device model behaviour
- **bw-circuit-ui owns:** hit-testing, snapping, rendering, the
  electrical meaning of terminals, which net a terminal joins
