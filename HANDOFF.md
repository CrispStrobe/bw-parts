# bw-parts handoff — 2026-08-16 (session 6, context cycle)

## DONE (pushed, verified on remote)

### bw-parts (main a0bf177)
- **KiCad importer** boundary crossing documented
- **ATtiny2313** DIP-20 + **ATtiny13** DIP-8 sidecars (datasheet-audited)
- **SSD1306** OLED palette + footprint (terminal contract matched)
- **German kit canon**: cd4093, mcp4725, dht22, tm1637, ky002 sidecars+SVGs
- **Bausatz canon**: at89c2051 DIP-20, matrix16x8, matrix9x9, seven_seg_3 sidecars+SVGs
- 231 validated, 184 seated, 0 errors

### bw-board (master 86d24b5, remote ahead at 71957c3)
- **CD4093** chip-composer (schmitt_nand ×4, CMOS)
- **MCP4725** I2C DAC device (first analog-output I2C part)
- **DHT22** device (dht11 buildFrame generalized, 16-bit ×10 encoding)
- **NxM LED matrix** (matrix8x8 generalized → matrix16x8, matrix9x9)
- **Slide switch** SPDT + dip_switch_spst + dip_switch_dpst devices
- Chip-composer count 15→16 (cd4093)

### bw-circuit-ui (master 9ebb36d, remote ahead at 4c5b580)
- **Wokwi importer**: real-file acceptance (3 fixtures, breadboard, v2 format)
- **KiCad XML netlist** support (auto-detect, 274/275 Eater corpus)
- **50/50 importer tests** green
- **DIP bodies**: attiny2313, attiny13, at89c2051 (DIP_CHIP_LABELS, mcuChipInfo, footprints)
- **Palette entries**: ssd1306, cd4093, mcp4725, dht22, ky002, matrix variants, max7219, seven_seg_3, at89c2051
- **NxM matrix face**: generalized rendering for 8×8/16×8/9×9
- **KNOWN_GAPS burn-down**: 39→6 (33 kinds healed via KIND_ALIASES, PASSTHROUGH, engine devices)
- **l293d alias fix**: was backwards (h_bridge→l293d), now correct (l293d→h_bridge)
- pendant-attiny88.test.js: fixed for device-true attiny88 kind

## IN FLIGHT (exact next steps)

1. **Remaining 6 KNOWN_GAPS**: `556` (dual 555 timer model), `74c922`/`74hc374`/`74hc688` (chip-composer entries), `pololu_motor_ctrl` (motor driver model), `seven_seg_3` (engine decomposition — bw-board agent may have started this at 71957c3)
2. **max7219 face**: engine device exists, palette added, but no BoardCanvas face case yet (bw-cui2 lane)
3. **seven_seg_3 engine**: needs multiplexed per-digit decomposition in board.js — check if bw-board 71957c3 landed this
4. **PARTS-CATALOG.md**: needs updating with new parts (at89c2051, matrix16x8, matrix9x9, seven_seg_3, cd4093, mcp4725, dht22, tm1637, ky002)

## BLOCKED

- **AT89C2051 emulator config**: waiting on emu8051 integration (not this agent's lane)
- **seven_seg_3 face rendering**: needs engine decomposition first (check bw-board 71957c3)
- **max7219 BoardCanvas face**: bw-cui2 lane

## Sidecar format constraints (unchanged)

- `functions: null` = not audited, `[]` = audited and none.
- RST polarity NOT in sidecars. bw-board hard-codes per kind.
- 28C256 uses `ceb`, 62256 uses `csb` — different names, same pin 20.
- AT89C2051 uses `p3_0` format (underscore for 8051 P3.0 dot notation).
