# Spec Update 002: 74HC595 cube wiring check — result: no 595 in cube path

**Date:** 2026-08-10
**From:** bw-parts
**Finding:** The LED cube does NOT use a 74HC595 shift register.

## What was checked

The coordinator asked whether the 74HC595's non-contiguous Q0 (pin 15,
not adjacent to Q1-Q7 on pins 1-7) affects the LED cube's voxel mapping.

## Result

**The cube is parallel-driven, not shift-register-driven.** The STC12
drives 64 LEDs through:
- P0[7:0] = column data (8 bits)
- P2[7:0] = layer select (8 scan lines, active-low)

No 74HC595 is in the cube's data path. The firmware (`main.c`) writes
P0 and P2 directly — no serial shifting, no latch clock.

The 74HC595 is used in a **separate example** (`examples/09-shift-register`)
which drives 8 LEDs through P3.4 (data), P3.6 (shift clock), P3.5
(latch). That circuit is independent of the cube.

## The cube's actual critical mapping

The voxel map — `(select, bit) → (x, y, z)` — depends on how the
physical LEDs are wired to P0 and P2, not on any shift register.
That table is **still empty** in `src/20-ledcube/README.md` and
can only be filled by running `probe.c` on a real cube.

## 595 shift register example: verified correct

`examples/09-shift-register/09-shift-register.c` shifts MSB-first
via `bw_part_leds()`. After shifting byte `b`:
- Bit 7 (first in) → QH (pin 7)
- Bit 0 (last in) → QA (pin 15)

The walking-1 pattern `~{0x01..0x80}` correctly lights one LED at a
time, stepping QA→QB→...→QH (pin 15→1→2→...→7). The non-contiguous
QA on pin 15 is handled by the MSB-first shift order — no wiring
error possible as long as LEDs are connected to pins in Q-order
(not physical pin order).

The sidecar pin map (`parts/74hc595.json`) is verified correct per
the DIP audit against TI SN74HC595 (SCLS146).
