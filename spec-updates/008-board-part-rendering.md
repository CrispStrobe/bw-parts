# spec-update 008 — Board part rendering in bw-circuit-ui

> **Date:** 2026-08-13
> **From:** bw-parts
> **For:** bw-circuit-ui

## Problem

`arduino_mega`, `arduino_uno`, and `arduino_nano` board parts have
vendored SVG art and complete sidecar JSONs in `src/parts-data/`, but
the renderer does not display them. `SvgParts` has no `case` for any
of these kind slugs — they fall through to `default: return null` and
render invisible. Only terminal dots appear.

Additionally, `hittest.js` `FOOTPRINTS` has no entry for any board
part. All three get `DEFAULT_FOOTPRINT = { w: 48, h: 48 }`, making
the click/drag target much smaller than the visual extent of the
board.

## What bw-parts provides

All board-part sidecars are complete and synced:

| Kind | w | h | Terminals | footprint |
|---|---|---|---|---|
| `arduino_uno` | 180 | 120 | 28 | `null` (canvas only) |
| `arduino_nano` | 60 | 160 | 30 | breadboard (straddlesGutter, minCols=15) |
| `arduino_mega` | 340 | 140 | 78 | `null` (canvas only, too large for breadboard) |
| `pi_pico` | 60 | 210 | 43 | breadboard (straddlesGutter, minCols=20) |
| `microbit` | 120 | 56 | 5 | `null` (edge connector, canvas only) |

SVG art files for all five are vendored in `src/parts-data/`.

## What bw-circuit-ui needs to do

### 1. Add render cases in `SvgParts` (or equivalent renderer)

For each board kind, load the vendored SVG and render it scaled to
the sidecar's `w` × `h` dimensions. The SVG `viewBox` already matches
these dimensions.

### 2. Add entries to `FOOTPRINTS` in `hittest.js`

```js
arduino_uno:  { w: 180, h: 120 },
arduino_nano: { w: 60,  h: 160 },
arduino_mega: { w: 340, h: 140 },
pi_pico:      { w: 60,  h: 210 },
microbit:     { w: 120, h: 56  },
```

### 3. No footprint change needed from bw-parts

`footprint: null` is correct for canvas-only boards (Mega, Uno,
micro:bit). The `arduino_nano` and `pi_pico` already have working
breadboard footprints (fixed in `aac8f67`).
