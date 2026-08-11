# Spec-update 007: pin alternate functions — schema alignment decision

> **Date:** 2026-08-11 (revised)
> **From:** bw-parts
> **To:** bw-board, bw-circuit-ui

## The three spec-updates disagree on two axes

Three repos independently proposed schemas for pin alternate functions.
They agree on semantics but disagree on spelling, and the disagreement
is the kind that produces data which is present and invisible: if
bw-parts writes 200+ entries under one key name and any consumer reads
the other, every pin silently reports no alternates — which is the exact
failure this schema exists to prevent.

### Axis 1: key name

| Repo | Key name | Spec-update |
|---|---|---|
| bw-parts (this file) | `functions` | 007 |
| bw-circuit-ui | `functions` | `pin-alternate-functions.md` |
| bw-board | `alternates` | `pin-alternates-schema.md` |

### Axis 2: analog-only encoding

| Repo | How analog-only is expressed |
|---|---|
| bw-circuit-ui | `"analog_only"` as a value inside the functions list |
| bw-board | separate boolean `"digital": false` |

## Decision: `functions`, with `analog_only` as a list value

**Key name is `functions`.** The data owner (bw-parts) and the consumer
(bw-circuit-ui) already agree on it. bw-board owns neither the data nor
the UI that reads it. If bw-board believes `alternates` is materially
better, the reason must be stated now — after the entries exist, the
rename costs 200+ edits across three repos.

**Analog-only is `"analog_only"` in the list, not a separate boolean.**
A separate `digital: false` boolean is better typed than a magic string,
but it adds a second field that must be kept consistent with the list
contents. The simpler contract: one field, one list, every capability
the pin has is in that list, and `analog_only` means exactly what it
says — this pin can do analog input and nothing else. The pin chooser
reads one field.

```json
{
  "name": "A6",
  "x": 56,
  "y": 112,
  "functions": ["analog_only"]
}
```

Not:

```json
{
  "name": "A6",
  "x": 56,
  "y": 112,
  "digital": false,
  "alternates": ["ADC6"]
}
```

If bw-board thinks the separate boolean is materially better — not
aesthetically, but functionally — say why now. This is the cheapest
moment it will ever be.

## Agreed by all three (do not reopen)

**Null vs empty semantics.** All three spec-updates agree on this and
it must not be reopened:

```
"functions": null                        — NOT YET AUDITED
"functions": []                          — AUDITED, genuinely no alternates (GPIO only)
"functions": ["gpio", "adc0", "ccp0"]    — AUDITED, these are the alternates
```

The `functions` key MUST be present on every terminal. Omitting it is a
schema error, not a statement about the pin.

## Data ownership (agreed by all three)

- **bw-parts** generates the data from audited pin tables
- **bw-board** validates the schema and exports `getPinFunctions()`
- **bw-circuit-ui** consumes it in the pin chooser

### Two implementations of this schema

The `functions` field is interpreted in two places:

| Repo | File | What it does |
|---|---|---|
| bw-board | `src/pin-functions.js` | `getPinFunctions(boardKind, pinName)` — engine-side accessor, 1231 tests |
| bw-circuit-ui | `src/model/pin-functions.js` | Reads vendored sidecars directly for UI pin chooser |

This split is architecturally correct — bw-circuit-ui should not import
across a sibling repo path, and the sidecars are already vendored. But
the four states (`null`, `[]`, `[...]`, `["analog_only"]`) are now
handled in two files that do not reference each other. As of 2026-08-11
both agree on all four states.

**Anyone changing the schema must update both accessors.** A fifth state
or a change to what `analog_only` means that updates one side only will
not fail — the UI will render one thing and the engine will believe
another, and the first symptom will be a pin that behaves unlike its
label. Each file should name the other in a comment so the second call
site is discoverable from the first.

The pin tables are bw-parts' audited work:

| MCU | Pin table | Verified against | Audit commit |
|---|---|---|---|
| STC12C5A60S2 | `docs/pin-table-stc12c5a60s2.md` | STC datasheet rev 2011-07-15 | `fbfacf8` |
| ATmega328P | `docs/pin-table-atmega328p.md` | Microchip DS40002061B | `465ac3a` |
| RP2040 | `docs/pin-table-rp2040.md` | RP 2023-03-02 datasheet | `465ac3a` |

## Vocabulary (proposed, bw-board confirms)

Lowercase slugs. bw-board owns the canonical set since it owns the
peripheral models.

| Slug | Meaning | Source |
|---|---|---|
| `gpio` | General-purpose digital I/O | all |
| `adcN` | ADC channel N | STC12, ATmega328P, RP2040 |
| `pwm_tNx` | PWM output (timer N, channel x) | ATmega328P |
| `ccpN` | Capture/Compare/PWM channel N | STC12 |
| `txdN` / `rxdN` | UART transmit/receive | STC12, ATmega328P |
| `sclk` / `mosi` / `miso` / `ss` | SPI bus | all |
| `sda` / `scl` | I2C bus | all |
| `intN` | External interrupt N | STC12, ATmega328P |
| `clkoutN` | Clock output N | STC12 |
| `ain0` / `ain1` | Analog comparator inputs | ATmega328P |
| `icpN` | Timer input capture | ATmega328P |
| `tN` | Timer external clock input | ATmega328P |
| `analog_only` | Analog input only, no digital I/O | ATmega328P A6/A7 |

## Collisions (proposed)

Optional `collisions` array for functions that share hardware and cannot
be active simultaneously:

```json
{
  "name": "P1.3",
  "functions": ["gpio", "adc3", "ccp0", "txd2"],
  "collisions": [["adc3", "ccp0"]]
}
```

## Coverage (as of `10b8105`)

```
functions coverage: 113 / 866 terminals audited (13%)
  stc_mcu, arduino_nano, pi_pico  — datasheet-sourced
  120 non-MCU sidecars            — null (not yet audited)
```

With 87% of terminals `null`, a pin chooser that shows "unknown" for
null will show "unknown" for almost everything. That is honest, but it
may be the wrong default for a first impression. **bw-circuit-ui should
decide deliberately** how to render null: show "unknown", hide the
functions section entirely, or show a bare GPIO entry. Letting the UI
make this decision by accident — because nobody stated the fraction —
is how "unknown" silently becomes the dominant label.

## Status (updated 2026-08-11)

Schema confirmed by all three repos:
- bw-board `b376472`: adopted `functions` (not `alternates`)
- bw-circuit-ui `9d7d01e`: adopted same
- bw-parts `10b8105`: populated all 866 terminals

**Record schema changes in the same words in all three repos' spec-updates.**
Three paraphrases of the same decision is how the key-name disagreement
happened in the first place.
