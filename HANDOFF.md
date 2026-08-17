# bw-parts handoff — 2026-08-17 (session 7, continued)

## DONE this session (pushed, exact-SHA verified on remote)

### bw-parts (main 3201e9e)
- **74HC244** DIP-20 octal buffer sidecar
- **74LS32** DIP-14 quad OR gate sidecar
- **74LS04** DIP-14 hex inverter sidecar
- **UM245R** USB FIFO module sidecar (15 terminals)

### bw-board (master 90ba112)
- **KNOWN_GAPS devices**: 556, 74HC374, 74HC688, 74C922, 74HC244, 74LS32, 74LS04
- **UM245R USB FIFO** device (dual FIFOs, empty-FIFO-repeats-last-byte trap)
- **z80-extract**: OR/NOT/buf/xcvr glue, /RD+/WR cycle signals, UM245R port decode
- Tests: 12 z80-extract + 6 UM245R device, all pass

### bw-circuit-ui (master 1676772)
- **KNOWN_GAPS → 0**: all 5 entries burned
- **UM245R** sidecar in parts-data

### sb3-creator (audit-l2 0231d74)
- **AUDIT-L2**: all 8 netlist errors fixed
  - arduino-06-knock: piezo pos/neg → a/b wire rename
  - pc81/82/83/86: decade_counter terminals + 555→clk, qN→LED wiring
  - pc84/85: lm358 terminals + astable oscillator wiring
  - pc88: sound_module terminals + ao→NPN base resistors
  - Validated: 8/8 pass engine terminal check

## IN FLIGHT

1. **PARTS-CATALOG.md**: needs updating with all new parts from sessions 6-7

## BLOCKED

- **AT89C2051 emulator config**: waiting on emu8051 integration
- **max7219 BoardCanvas face**: bw-cui2 lane
