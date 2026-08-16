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
  diagram.json support — 35+ wokwi part types mapped, pin name aliases,
  position preservation, round-trip export.
- **Test suite** (`test/importers.test.js`): 22 tests (6 suites) — sexpr
  parser, KiCad mapping, Wokwi import/export, registry dispatch, Eater
  8-bit acceptance corpus. All green.

This work lives in bw-circuit-ui; bw-parts owns only the sidecar data
that informed the pin mapping tables.

## Current session: acceptance & hardening

- [ ] Clone Upcycle-Electronics/8-Bit-Breadboard-Computer (MIT), test
      KiCad importer against real exported netlists
- [ ] Wokwi diagram.json acceptance with real-world files
- [ ] Push checkpoint

## Sidecar format constraints (unchanged)

- `functions: null` = not audited, `[]` = audited and none.
- RST polarity NOT in sidecars. bw-board hard-codes per kind.
- 28C256 uses `ceb`, 62256 uses `csb` — different names, same pin 20.

## Open — owned by bw-parts

**2 unverified identifications remain:** `clock_display`, `gas_sensor`.

## Open — owned elsewhere

**Spec-update 008** (board part rendering): bw-circuit-ui needs
`SvgParts` cases for board-type parts.
