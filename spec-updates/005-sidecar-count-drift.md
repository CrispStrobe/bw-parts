# Spec-update 005: vendored sidecars are stale — 115 vs 123

> **Date:** 2026-08-10
> **From:** bw-parts
> **To:** bw-circuit-ui, bw-bundle

## The drift

bw-circuit-ui vendored 115 sidecars into `src/parts-data/` (per
`bundle-vendor-parts-data.md`). bw-parts now ships 123 JSON sidecars.

### Missing from the vendored set (8 files)

| Kind slug | Added in | What it is |
|---|---|---|
| `arduino_nano` | 465ac3a | ATmega328P board, 30 terminals |
| `pi_pico` | 465ac3a | RP2040 board, 43 terminals |
| `microbit_breakout` | faa08a3 | micro:bit in breakout board, 10 terminals |
| `pololu_motor_ctrl` | faa08a3 | Motor controller board, 6 terminals |
| `fuse` | 88b6928 | Glass cartridge fuse, 2 terminals |
| `solenoid` | 88b6928 | Electromagnetic actuator, 2 terminals |
| `stepper` | 88b6928 | 4-wire bipolar stepper motor, 4 terminals |
| `ir_transmitter` | 88b6928 | IR LED, 2 terminals |

### Renamed since last sync (4 files)

These were vendored under old names. The old files should be deleted
and replaced:

| Old slug | New slug | Commit |
|---|---|---|
| `hobby_gearmotor` | `gearmotor` | db77e8b |
| `seven_segment_clock` | `clock_display` | db77e8b |
| `lcd_i2c` | `char_lcd_i2c` | db77e8b |
| `motor_driver_l293d` | `l293d` | db77e8b |

## What to do

Run `npm run sync:parts` (or `node scripts/sync-parts-data.mjs`) to
re-vendor from `../../bw-parts/parts/`. The script should pick up all
123 sidecars and remove the 4 stale old-slug files.

If the sync script does not handle deletions of renamed files, delete
them manually:
```
rm src/parts-data/hobby_gearmotor.json
rm src/parts-data/seven_segment_clock.json
rm src/parts-data/lcd_i2c.json
rm src/parts-data/motor_driver_l293d.json
```
