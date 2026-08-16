# bw-parts handoff — 2026-08-16 (session 7, final)

## DONE this session (pushed, exact-SHA verified on remote)

### bw-parts (main 489eb37)
- **74HC244** DIP-20 octal buffer sidecar (per-group /OE, interleaved pinout)
- **74LS32** DIP-14 quad OR gate sidecar (TTL equivalent of 74HC32)
- **74LS04** DIP-14 hex inverter sidecar (TTL equivalent of 74HC04)
- **UM245R** USB FIFO module sidecar (15 terminals: D0-D7, /RD, WR, /TXE, /RXF, /RESET, VCC, GND)

### bw-board (master 90ba112)
**KNOWN_GAPS devices:**
- **556** dual 555 timer device (timer-555.js): two independent sections sharing VCC/GND
- **74HC374** octal D-FF with tri-state /OE (chip-composer.js)
- **74HC688** 8-bit identity comparator with /G enable (chip-composer.js)
- **74C922** 16-key encoder, params-driven key/pressed (tier2-parts.js)
- **74HC244** octal buffer device with per-group /OE (tier2-parts.js)
- **74LS32** + **74LS04** TTL aliases of 74HC32/74HC04 (chip-composer.js)

**z80-extract glue visibility:**
- OR gate (74HC32/74LS32), NOT gate (74HC04/74LS04), buffer (74HC244), transceiver (74HC245) as address-decode glue
- /RD and /WR as cycle signals (port decodes that gate on bus strobes)

**UM245R USB FIFO (PainfulDiodes §8):**
- Engine device (um245r.js): dual FIFOs (128 rx / 384 tx), /RD drives bus + pops, WR falling edge latches, THE TRAP (empty FIFO repeats last byte)
- z80-extract: UM245R as port device (/RD = chip select, rsPin:null), CHIP label
- Test: 6 device tests + PainfulDiodes-shape z80-extract (ROM/RAM/UM245R at port $01)
- Merge: resolved coordinator's 74HC374-latch addition in z80-extract

### bw-circuit-ui (master 1676772)
- **KNOWN_GAPS → 0**: all 5 entries burned (556→device, 74c922→device, 74hc374→device, 74hc688→device, pololu_motor_ctrl→PASSTHROUGH_KINDS)
- **UM245R** sidecar in parts-data for palette visibility
- palette-engine-coverage.test.js: 3/3 pass, 0 orphans

## IN FLIGHT

1. **max7219 face**: engine device exists, palette added, but no BoardCanvas face case yet (bw-cui2 lane)
2. **PARTS-CATALOG.md**: needs updating with all new parts from sessions 6-7

## BLOCKED

- **AT89C2051 emulator config**: waiting on emu8051 integration (not this agent's lane)
- **max7219 BoardCanvas face**: bw-cui2 lane

## Sidecar format constraints (unchanged)

- `functions: null` = not audited, `[]` = audited and none.
- RST polarity NOT in sidecars. bw-board hard-codes per kind.
- 28C256 uses `ceb`, 62256 uses `csb` — different names, same pin 20.
- AT89C2051 uses `p3_0` format (underscore for 8051 P3.0 dot notation).
