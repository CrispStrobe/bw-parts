# bw-parts handoff — 2026-08-16 (session 6)

> **Last commit:** bea76ca
> **Tree:** clean, pushed to origin main

## Done and pushed (prior sessions)

- **218 part JSON sidecars + 218 SVGs** in parts/
- **2 board face SVGs + 2 board JSONs** in parts/boards/
- **214 parts in PARTS-CATALOG.md** (0 inventory gaps)
- **CI workflow** (.github/workflows/ci.yml): validate-parts +
  verify-seating + playwright ART-PROOF montage. All green.
- **5 SAP-1 TTL tier sidecars**: 74LS173/161/189/157/107

## Boundary crossing: importer registry in bw-circuit-ui

Per coordinator override, the bw-parts agent built the following in
**bw-circuit-ui** (commits fe78641..d1f114b):

- **Importer registry** (`src/importers/index.js`): `importCircuit(format, text)`
  dispatcher with `getSupportedFormats()`.
- **KiCad netlist importer** (`src/importers/kicad-netlist.js`): parses
  `.net` s-expression netlists, maps 40+ KiCad libsource part names to
  engine kind slugs with datasheet-audited pin tables. Handles rescue
  suffixes, library prefixes, value-based fallback, passive inference.
- **S-expression parser** (`src/importers/sexpr.js`): minimal recursive-
  descent parser for KiCad's Lisp-like format.
- **Wokwi importer + exporter** (`src/importers/wokwi.js`): bidirectional
  diagram.json support — 36 wokwi part types mapped (incl. breadboard),
  pin name aliases (74HC595, LED polarity, instance/side suffixes),
  v1 array + v2 object connection formats, position preservation,
  round-trip export.
- **Test suite** (`test/importers.test.js`): **50 tests (12 suites)** —
  sexpr parser, KiCad mapping (s-expr + XML), Wokwi import/export,
  registry dispatch, Eater 8-bit acceptance corpus (embedded + real XML),
  3 real Wokwi fixture acceptance suites. All green.
- **Test fixtures** (`test/fixtures/`): 3 public Wokwi diagram.json files
  (wokwi/arduino-simon-game, arcostasi/avr8js-electron-playground blink,
  Aruack/7LED breadboard).

This work lives in bw-circuit-ui; bw-parts owns only the sidecar data
that informed the pin mapping tables.

## Session 6 acceptance results

- **KiCad XML**: 274/275 Eater 8-bit components mapped, 902 wires,
  0 unmapped, 0 warnings. XML auto-detected.
- **Wokwi Simon Game**: 14 parts, 48 wires, 74HC595 pin aliases verified
- **Wokwi Blink (v2)**: 3 parts, 3 wires, object-style connections parsed
- **Wokwi 7LED**: 18 parts (incl. breadboard), 42 wires, hole coords OK

## Sidecar format constraints (unchanged)

- `functions: null` = not audited, `[]` = audited and none.
- RST polarity NOT in sidecars. bw-board hard-codes per kind.
- 28C256 uses `ceb`, 62256 uses `csb` — different names, same pin 20.

## Open — owned by bw-parts

**2 unverified identifications remain:** `clock_display`, `gas_sensor`.

## Open — owned elsewhere

**Spec-update 008** (board part rendering): bw-circuit-ui needs
`SvgParts` cases for board-type parts.
