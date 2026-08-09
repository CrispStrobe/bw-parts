# Spec Update 001: Terminal position alignment between bw-parts sidecars and bw-circuit-ui

**Date:** 2026-08-09
**From:** bw-parts
**To:** bw-circuit-ui, coordinator

## Context

bw-parts sidecars (`parts/<kind>.json`) define terminal positions in SVG viewBox
coordinates. bw-circuit-ui's `BoardCanvas.jsx:terminalOffsetsForPart()` defines
terminal offsets as dx/dy from part center. The mapping is:

    sidecar.x = FOOTPRINT.w/2 + ui.dx
    sidecar.y = FOOTPRINT.h/2 + ui.dy

## Cross-validation results

### Matches (no action needed)

All tier-2 parts with FOOTPRINTS entries have matching dimensions:
- `shift_register`: 90x44 ✓
- `relay`: 70x50 ✓
- `dc_motor`: 70x70 ✓
- `servo`: 70x60 ✓
- Logic gates: 48x48 (default) ✓

### Mismatches requiring resolution

#### 1. `shift_register` — terminal count divergence

**bw-parts sidecar** (12 terminals): full 74HC595 DIP pinout — q0-q7, data, clock,
latch, oe. Positions on left/right edges at DIP pin spacing.

**bw-circuit-ui** (3 terminals): `data(-20,-15)`, `clock(0,-15)`, `latch(20,-15)` —
simplified to three pins along the top.

**Proposal:** The sidecar's 12-terminal layout is physically correct and matches
the engine model (`validate.js` lists all 12). The UI should adopt the sidecar
positions when it consumes sidecars for palette rendering. The simplified 3-pin
layout can remain as a "quick-wire" alias but should not be the only option.

#### 2. Multi-terminal parts using default 2-pin fallback

These parts have 3+ engine terminals but fall through to the UI's
`default: a(-15,0), b(15,0)`:

| Kind | Engine terminals | UI terminals used |
|------|-----------------|-------------------|
| `npn`, `pnp` | base, collector, emitter | a, b (default) |
| `nmos`, `pmos` | gate, drain, source | a, b (default) |
| `opamp` | inp, inn, out | a, b (default) |
| `diode`, `zener` | anode, cathode | a, b (default) |
| `vsource`, `isource` | pos, neg | a, b (default) |
| `relay` | coil_a, coil_b, com, nc, no | a, b (default) |
| `dc_motor` | a, b | a, b (default) ✓ |
| `servo` | signal, vcc, gnd | a, b (default) |
| `switch` | a, b | a, b (default) ✓ |
| `ldr`, `ntc` | a, b | a, b (default) ✓ |
| `rgb_led` | r_anode, g_anode, b_anode, cathode | a, b (default) |
| `led_matrix` | (composite) | a, b (simplified) |
| `led_cube` | sel_0-7, data_0-7 | (has specific offsets) ✓ |

**Proposal:** bw-parts sidecars will define physically correct terminal positions
for all terminals. When bw-circuit-ui adopts sidecar consumption, these replace
the default fallback. Until then, the mismatches are cosmetic — wiring targets
won't align for these parts when using sidecar data vs. the hardcoded offsets.
The UI team should add cases to `terminalOffsetsForPart` for each kind, or
(better) read offsets directly from sidecars.

#### 3. Terminal positions extending beyond footprint bounds

For some parts, UI offsets place terminals outside the FOOTPRINT box:
- `capacitor` (28x36): a(-15,0) → svgX = -1 (1px beyond left edge)
- `seven_segment` (50x70): a(-30,30) → svgX = -5 (5px beyond left edge)

This is physically correct (leads extend beyond package body). bw-parts sidecars
will match these positions exactly, using viewBox coordinates that may be negative
or exceed w/h. The SVG viewBox will be sized to include terminal points.

## Sidecar terminal position table for tier-1 parts

All positions computed from UI offsets where they exist, using physically
appropriate positions for parts with default fallback:

| Kind | w | h | Terminal positions (svgX, svgY) |
|------|---|---|-------------------------------|
| `vcc` | 36 | 40 | vcc(18,40) |
| `gnd` | 36 | 40 | gnd(18,10) |
| `resistor` | 64 | 20 | a(2,10), b(62,10) |
| `capacitor` | 28 | 36 | a(0,18), b(28,18) |
| `inductor` | 48 | 48 | a(9,24), b(39,24) |
| `diode` | 52 | 20 | anode(2,10), cathode(50,10) |
| `led` | 40 | 50 | anode(0,25), cathode(40,25) |
| `zener` | 52 | 20 | anode(2,10), cathode(50,10) |
| `potentiometer` | 60 | 60 | a(5,50), wiper(30,10), b(55,50) |
| `button` | 44 | 44 | a(7,22), b(37,22) |
| `switch` | 48 | 28 | a(9,14), b(39,14) |
| `buzzer` | 48 | 48 | a(9,24), b(39,24) |
| `npn`/`pnp` | 44 | 44 | base(0,22), collector(22,0), emitter(22,44) |
| `nmos`/`pmos` | 44 | 44 | gate(0,22), drain(22,0), source(22,44) |
| `opamp` | 60 | 50 | inp(0,15), inn(0,35), out(60,25) |
| `ldr` | 40 | 28 | a(5,14), b(35,14) |
| `ntc` | 40 | 28 | a(5,14), b(35,14) |
| `ir_receiver` | 36 | 44 | vcc(8,12), gnd(28,12), out(18,37) |
| `temp_sensor` | 32 | 44 | vcc(6,12), gnd(26,12), dq(16,37) |
| `eeprom` | 70 | 36 | sda(25,33), scl(45,33), vcc(55,3), gnd(15,3) |
| `seven_segment` | 50 | 70 | (composite — see engine) |
| `char_lcd` | 140 | 56 | rs(20,53), e(40,53), d4(60,53), d5(80,53), d6(100,53), d7(120,53) |
| `vsource` | 48 | 56 | pos(24,4), neg(24,52) |
| `isource` | 48 | 56 | pos(24,4), neg(24,52) |
| `rgb_led` | 48 | 48 | r_anode(8,48), g_anode(18,48), b_anode(28,48), cathode(38,48) |
