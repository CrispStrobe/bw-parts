# bw-parts close-out

## What was delivered

12+ commits taking an empty repo to a production-ready parts library:

- **115 SVGs** with JSON terminal sidecars (27 DIP-generated, 88 hand-drawn)
- **`generate-dip.js`** — parametric DIP template; add a chip in 3 lines
- **`PARTS-CATALOG.md`** — single canonical parts list for the fleet (118 kinds)
- **`PARTS-RECONCILIATION.md`** — cross-repo slug/coverage table (17 mismatches named)
- **`CURRENT-RATINGS.md` + `current-ratings.json`** — sourced current ratings for chip-budget DRC
- **`DIP-AUDIT.md`** — every DIP pin map verified against its manufacturer datasheet
- **`ART-PROVENANCE.md`** — which drawings are stylised vs datasheet-sourced, no third-party traces
- **`EVIDENCE-NOTE.md`** — the STC12 pin map case for the evidence taxonomy

## What was wrong and when it was caught

| Error | Commit that shipped it | Commit that fixed it | How caught |
|---|---|---|---|
| STC12 pin map used generic 8051 names (PSEN/ALE/EA don't exist on this part) | 8173386 | eeb54b9 | Checked against stc/docs/PINOUT.md |
| L293D right-side pins scrambled (en2/in3/out3 in wrong positions) | initial hand-drawn | f7389af | Audited against TI SLRS008 |
| 5 art files wrongly deleted during reconciliation | 811bcdc | e3c6ebf | Compared against verified reference catalogue |
| Current ratings: passives as null instead of 0 | 126a878 | 8882a86 | Disagreement with bw-board's semantics |

## Assert the property, not the symptom

Three repos arrived at this rule independently tonight. In bw-parts it
showed up twice:

**The pin map audit.** The STC12 fix (eeb54b9) initially checked only
that PSEN was absent. bw-bundle's test did it right: assert that pin 32
IS P0.7, that P0 runs descending, that RST is pin 9 and VCC is pin 40.
A sidecar with every pin shifted by one, or P0 ascending, or `rxd`
where `P3.0` belongs, would pass "PSEN absent" and fail "pin 32 is
P0.7". Testing for the absence of one specific wrong thing catches only
that thing; asserting what the pinout *is* catches the whole class.

The DIP audit (f7389af) applied this: it verified every pin of every
chip against its datasheet, not just the ones known to be traps. The
L293D error was not a known trap — nobody had flagged the right-side
pin order as a risk. It was found because the audit checked what each
pin IS, not whether any specific wrong pin was present.

**The current ratings.** The original ratings used two states (number
or null). The fix (8882a86) adopted three: number (rated consumer),
0 (not a consumer), `"circuit"` (depends on wiring). The two-state
version tested "does this part have a rating?" — the symptom. The
three-state version asserts what kind of part it is — the property.
A resistor is not "a part we haven't rated yet"; it is "a part that
is not a consumer". Those are different facts, and a DRC that can
distinguish them gives a different and better message.

## What I did not verify

- Terminal positions are mathematically placed but not cross-validated
  in a running bw-circuit-ui renderer
- The 4 unverified identifications remain unverified (seven_segment_clock
  controller, ATtiny variant, micro:bit generation, gas sensor family)
- Breadboard hole grids are visual art; the circuit model's hole-to-node
  mapping is bw-circuit-ui's responsibility

## Ownership boundaries

- **bw-parts owns:** the catalogue, the art, the terminal geometry,
  the current ratings data, the variant collapses
- **bw-board owns:** engine kind names, the DRC semantics (what 0 vs
  null vs "circuit" means to the warning text), device model behaviour
- **bw-circuit-ui owns:** hit-testing, snapping, rendering, the
  electrical meaning of terminals, which net a terminal joins
