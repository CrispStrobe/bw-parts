# bw-parts

SVG part art and terminal metadata for the bw-circuit-designer campaign.
122 component kinds, each with a bench-style SVG and a JSON sidecar that
positions terminals for hit-testing. Not a fork — written from scratch.

## What is in the repo

| Artefact | Count / size | Notes |
|---|---|---|
| SVG part drawings (`parts/*.svg`) | 121 files | 29 DIP-generated, 92 hand-drawn |
| JSON terminal sidecars (`parts/*.json`) | 121 files | `{kind, w, h, terminals:[{name,x,y}]}` |
| Parts catalog (`PARTS-CATALOG.md`) | 122 kinds | Single source of truth for the fleet |
| Current ratings (`current-ratings.json`) | 124 entries | Two-budget: `chip_mA` (pin) + `supply_mA` (rail) |
| DIP generator (`generate-dip.js`) | 29 pin maps | Parametric template; add a chip in 3 lines |
| Cross-repo reconciliation (`PARTS-RECONCILIATION.md`) | 122 rows | Slug/coverage alignment with bw-board and bw-circuit-ui |
| Art proof montage (`ART-PROOF.png`) | 121 thumbnails | Playwright screenshot of all SVGs on one page |
| DIP pin map audit (`DIP-AUDIT.md`) | 29 chips | Each checked against its manufacturer datasheet |

The 122 catalog kinds map to 121 SVG files because `power_supply` shares
the `vsource` art (the engine resolves the slug alias).

### Variant collapses

Multiple reference-library entries collapse to a single SVG with a
`variants` field in the sidecar:

- NeoPixel Ring 12/16/24 → `neopixel_ring`
- NeoPixel Strip 4–20 → `neopixel_strip`
- DIP Switch SPST x4/x6 → `dip_switch_spst`
- DC Motor with Encoder + large variant → `dc_motor_encoder`

### Categories

Passives (6), inputs (22), outputs (17), power (9), power control (10),
logic ICs (23), analog ICs (6), MCU boards (4), instruments (4),
connectors/boards (7), engine-only extras (15). One kind (`esp8266`)
was declined — WiFi simulation is out of scope.

## How to run

```bash
# Prerequisites: Node.js, Playwright (npx playwright install chromium)
npm install

# Generate all DIP IC SVGs from pin maps
node generate-dip.js

# Generate one specific chip
node generate-dip.js 74hc00

# Render all SVGs into a montage and screenshot it
node verify-art.js
# Produces: art-montage.html (gitignored) and ART-PROOF.png
```

There is no test suite. Verification is visual (the montage) and
documentary (the DIP audit).

## Verification status

All evidence categories reference `stc/docs/EVIDENCE-CATEGORIES.md`.

**Nothing in this repository has been validated on real hardware.** Terminal
positions are mathematically placed (DIP spacing for ICs, physically
plausible for hand-drawn parts) but have not been cross-validated in a
running bw-circuit-ui renderer.

| Claim | Category | Basis | What would raise it |
|---|---|---|---|
| DIP pin maps match datasheets | 2b | Each of 29 chips checked against its named datasheet document (see `DIP-AUDIT.md`) | Category 1: probe a physical chip's pins with a multimeter |
| STC12 pin map specifically | 2b | Checked against `stc/docs/PINOUT.md`; an earlier version used wrong generic 8051 names and was caught this way (see `EVIDENCE-NOTE.md`) | Category 1: measure pin 29 on a real STC12C5A60S2 |
| Terminal positions match bw-circuit-ui offsets | 3 | Computed from UI source code offsets where they existed; no runtime test | Category 2b: render in bw-circuit-ui and compare |
| Current ratings sourced to datasheets | 2b | Named datasheet per chip in `_src` fields; motors at stall, NeoPixels at 60 mA/pixel | Category 1: measure real parts |
| SVG art renders correctly | 3 | Visual inspection of Playwright montage (`ART-PROOF.png`) | Unchanged — this is inherently visual |

### Four unverified identifications

These parts are drawn generically because the reference library does not
name a specific part number and more than one candidate is plausible.
Documented in each JSON sidecar's `_note` field:

| Kind slug | What is uncertain |
|---|---|
| `clock_display` | HT16K33 (I2C) vs TM1637 (custom 2-wire) — not interchangeable |
| `attiny85` | Could be ATtiny45 or ATtiny25 |
| `microbit` | v1 (nRF51822) vs v2 (nRF52833) |
| `gas_sensor` | MQ-2/MQ-3/MQ-4 span different gases |

## What is not done

- **No runtime validation.** Terminal positions have not been tested in a
  live renderer. The spec-update in `spec-updates/001-terminal-position-alignment.md`
  documents 12 parts where the UI falls back to a 2-pin default for
  multi-terminal parts — those will mis-align until bw-circuit-ui reads
  sidecars directly.
- **10 cross-repo slug mismatches remain open.** bw-parts resolved its 7
  (where it was the outlier); the rest require renames in bw-board or
  bw-circuit-ui. Listed in `spec-updates/003-slug-renames.md`.
- **No test suite.** There are no automated tests. The DIP audit is a
  one-time document, not a CI check.
- **No licence file.** The repo has no LICENSE. SVG art is original work
  (see `ART-PROVENANCE.md`); wokwi-elements was a style reference only,
  not a code source (see `THIRD-PARTY.md`).

## Repo structure

```
parts/              121 SVGs + 121 JSON sidecars
generate-dip.js     Parametric DIP IC generator (29 pin maps)
verify-art.js       Montage renderer (Playwright screenshot)
current-ratings.json Two-budget current ratings (124 entries)
spec-updates/       Cross-repo coordination files (3 spec-updates)
docs/               Reference catalogue (private, not for public use)
PARTS-CATALOG.md    Canonical parts list (122 kinds)
PARTS-RECONCILIATION.md  Cross-repo slug/coverage table
CURRENT-RATINGS.md  Human-readable rating methodology
CONSUMING-RATINGS.md Consumer guide for the ratings schema
DIP-AUDIT.md        Pin map audit against datasheets
ART-PROVENANCE.md   Provenance statement for the public bundle
ART-PROOF.png       Visual proof montage (121 thumbnails)
THIRD-PARTY.md      Attribution for external references
EVIDENCE-NOTE.md    STC12 pin map case for the evidence taxonomy
CLOSE-OUT.md        Delivery summary and error log
BLOCKED.md          Current blockers (none)
```

## Relationship to other repos

bw-parts is the art and metadata provider. It does not contain simulation
logic or UI code.

- **bw-board** consumes `current-ratings.json` for DRC and references
  catalog slugs for engine registration.
- **bw-circuit-ui** consumes SVGs and JSON sidecars for palette rendering
  and terminal hit-testing.
- Communication is via `spec-updates/` files in this repo (the coordinator
  relays). bw-parts never edits sibling repos directly.
