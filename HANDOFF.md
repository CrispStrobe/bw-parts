# bw-parts handoff — 2026-08-16 (session 7)

## DONE this session (pushed, verified on remote)

### bw-parts (main fe47816)
- **74HC244** DIP-20 octal buffer sidecar (per-group /OE, interleaved pinout)
- **74LS32** DIP-14 quad OR gate sidecar (TTL equivalent of 74HC32)

### bw-board (master 7b8bc06)
- **556** dual 555 timer device (timer-555.js): two independent sections sharing VCC/GND
- **74HC374** octal D-FF with tri-state /OE (chip-composer.js)
- **74HC688** 8-bit identity comparator with /G enable (chip-composer.js)
- **74C922** 16-key encoder, params-driven key/pressed (tier2-parts.js)
- **74HC244** octal buffer device with per-group /OE (tier2-parts.js)
- **74LS32** registered as TTL alias of 74HC32 (chip-composer.js)
- **z80-extract.js**: OR gate (74HC32/74LS32), buffer (74HC244), transceiver (74HC245) now visible as address-decode glue
- **z80-ctc.js** merge conflict resolved (trivial blank-line)
- Test: z80-extract exercised with 74LS32 + 74HC244 in a Searle-shape decode (5/5 pass)

### bw-circuit-ui (master 1186f76)
- **KNOWN_GAPS → 0**: all 5 entries burned (556→device, 74c922→device, 74hc374→device, 74hc688→device, pololu_motor_ctrl→PASSTHROUGH_KINDS)
- palette-engine-coverage.test.js: 3/3 pass, 0 orphans

## DONE prior sessions
- 231+ sidecars, Wokwi+KiCad importers, 50/50 importer tests, DIP bodies, palette entries, matrix face, KNOWN_GAPS 39→0

## IN FLIGHT (exact next steps)

1. **UM245R USB FIFO**: BLOCKED — `docs/Z80-BENCH-PAINFULDIODES.md` spec not found on this host. Need the spec file or the repo that contains it cloned locally.
2. **max7219 face**: engine device exists, palette added, but no BoardCanvas face case yet (bw-cui2 lane)
3. **PARTS-CATALOG.md**: needs updating with new parts (74hc244, 74ls32 + all prior session additions)

## BLOCKED

- **UM245R USB FIFO**: spec file `docs/Z80-BENCH-PAINFULDIODES.md` not found anywhere under `/mnt/volume1/code/`. Need repo cloned or spec provided.
- **AT89C2051 emulator config**: waiting on emu8051 integration (not this agent's lane)
- **max7219 BoardCanvas face**: bw-cui2 lane

## Sidecar format constraints (unchanged)

- `functions: null` = not audited, `[]` = audited and none.
- RST polarity NOT in sidecars. bw-board hard-codes per kind.
- 28C256 uses `ceb`, 62256 uses `csb` — different names, same pin 20.
- AT89C2051 uses `p3_0` format (underscore for 8051 P3.0 dot notation).
