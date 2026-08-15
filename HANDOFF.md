# bw-parts handoff — 2026-08-15 (session 5)

> **Last commit:** 9e75f15
> **Tree:** clean, pushed to origin main

## Done and pushed (this session)

- **15 sensor/module parts** (dht11, joystick, ds3231, max7219,
  hall_analog/digital, reed_switch, touch_ttp223, photo_interrupter,
  flame_sensor, ir_reflect, sound_module, heartbeat, led_7color, mpu6050)
- **5 audio/I2C parts** (um66t, kd9561, isd1820, ssd1306, ili9341 SPI)
- **5 video/retro parts** (tms9918 DIP-40, mc6845 DIP-40,
  simplevga_card, vga_prop_card, ili9341_parallel 8080 16-pin)
- **2 board face SVGs** (boards/yl39, boards/prechin-a2) with element
  geometry JSON sidecars (at:{x,y,w,h} for face descriptor adoption)
- **CI workflow** (.github/workflows/ci.yml): validate-parts + 
  verify-seating + playwright ART-PROOF montage. All green.
- **Seating verification test** (test/verify-seating.js): automated gate
  for 57 DIPs + 75 modules. Two fixes applied (kd9561 minCols,
  pi_pico SWD debug pads).
- **PARTS-CATALOG.md** updated: 151 → 176 cataloged parts across 3 new
  sections. Datasheet table updated with TMS9918A + MC6845.

## Inventory

- 210 part JSON sidecars + 210 SVGs in parts/
- 2 board face SVGs + 2 board JSONs in parts/boards/
- 212 files pass validate-parts.js
- 168 footprinted parts pass verify-seating.js (72 DIP, 96 module)
- 210/210 synced to bw-circuit-ui src/parts-data/
- 0 gaps vs bw-board registerDevice() kinds (116/116 covered)
- CI: green

## Sidecar format constraints (unchanged)

- `functions: null` = not audited, `[]` = audited and none.
- RST polarity NOT in sidecars. bw-board hard-codes per kind.
- 28C256 uses `ceb`, 62256 uses `csb` — different names, same pin 20.

## Open — owned by bw-parts

**2 unverified identifications remain:** `clock_display`, `gas_sensor`.

## Open — owned elsewhere

**Spec-update 008** (board part rendering): bw-circuit-ui needs
`SvgParts` cases for board-type parts.

Parts-data sync complete (176/176, bw-circuit-ui 3961ee6).
