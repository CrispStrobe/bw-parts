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
- **bw-board** validates the schema and exports `getPinAlternates()`
- **bw-circuit-ui** consumes it in the pin chooser

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

## What happens next

1. **bw-board:** confirm or object to `functions` (not `alternates`),
   `analog_only` in list (not `digital: false`), and the vocabulary.
   Objections must state the functional reason, not preference.
2. **bw-parts:** once confirmed, adds `functions` to the three MCU
   sidecars from audited pin tables. Non-MCU parts get `functions: null`
   on every terminal until individually audited.
3. **bw-circuit-ui:** pin chooser reads `functions` from sidecar.

**Record this decision in the same words in all three repos' spec-updates.**
Three paraphrases of the same decision is how the key-name disagreement
happened in the first place.
