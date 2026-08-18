# Footprint Consistency Audit — 2026-08-18

Compared every sidecar footprint in `parts/*.json` against
`bw-circuit-ui/src/model/footprints.js` BUILTIN_FOOTPRINTS.

## Results: 51 match, 3 need UI alignment, 141 sidecar-only, 24 ui-only

### Fixed in this commit (35 sidecars)

All had rows 0/5 swapped (DIP pin-1 convention) and/or pin
order/spacing mismatches. bw-circuit-ui is the seating authority.

| Kind | Issue fixed |
|------|-----------|
| 28c256 | rows flipped, refTerminal a14→vcc |
| 62256 | rows flipped, refTerminal a14→vcc |
| 74hc00 | rows flipped, refTerminal 1a→vcc |
| 74hc595 | rows flipped, refTerminal qb→vcc |
| attiny13 | rows flipped, refTerminal pb5→vcc |
| attiny2313 | rows flipped, refTerminal pa2→vcc |
| attiny85 | rows flipped, refTerminal pb5→vcc |
| attiny88 | rows flipped, refTerminal pc6→pb1 |
| capacitor | b spacing (0,2)→(0,1) |
| char_lcd | refTerminal vss→rs, pin positions aligned to 6-pin subset |
| char_lcd_i2c | refTerminal vcc→gnd, vcc/gnd swapped |
| diode | cathode spacing (0,4)→(0,2) |
| dip_switch | refTerminal s0_a→s1_a, removed straddlesGutter, aligned s1_a/s1_b |
| inductor | b spacing (0,4)→(0,3) |
| ir_receiver | pin order: vcc/gnd/out → out/vcc/gnd, refTerminal vcc→out |
| ldr | b spacing (0,4)→(0,2) |
| mc6850 | rows flipped, refTerminal vss→ctsb |
| mcu | rows flipped, refTerminal P1.0→VCC |
| nmos | pin order: gate/drain/source → source/gate/drain, refTerminal gate→source |
| npn | pin order: base/collector/emitter → emitter/base/collector, refTerminal base→emitter |
| ntc | b spacing (0,4)→(0,1) |
| pmos | pin order: gate/drain/source → source/gate/drain, refTerminal gate→source |
| pnp | pin order: base/collector/emitter → emitter/base/collector, refTerminal base→emitter |
| rgb_led | pin order: r/g/b/k → r/k/g/b |
| seven_segment | aligned to UI 2-pin subset |
| solar_cell | neg spacing (0,1)→(0,3) |
| switch | b spacing (0,4)→(0,3) |
| temp_sensor | pin order: vcc/gnd/dq → dq/vcc/gnd, refTerminal vcc→dq |
| tilt_sensor | b spacing (0,3)→(0,1) |
| tip120 | pin order: base/collector/emitter → emitter/base/collector, refTerminal base→emitter |
| w65c02 | rows flipped, refTerminal vpb→resb |
| w65c22 | rows flipped, refTerminal vss→ca1 |
| w65c51 | rows flipped, refTerminal vss→vdd |
| z80 | rows flipped, refTerminal a11→a10 |
| zener | cathode spacing (0,4)→(0,2) |

### Needs bw-circuit-ui alignment (3 kinds)

These have terminal NAME mismatches — sidecar uses datasheet names,
UI uses house names. bw-circuit-ui owns the fix.

| Kind | Sidecar-only terminals | UI-only terminals | Note |
|------|----------------------|------------------|------|
| l293d | vcc2, in3, out3, gnd3, gnd4, out4, in4, vcc1 | vs, vcc | Sidecar has full 16-pin DIP, UI has simplified 10-pin |
| pcf8574 | a0, a1, a2, vss, int, vdd | gnd, vcc | Sidecar uses datasheet names, UI uses house names |
| usb_a | vbus, dm, dp | vcc, d_minus, d_plus | Sidecar uses USB spec names, UI uses common names |

### Sidecar-only (141 kinds)

Parts with sidecar footprints but no BUILTIN entry. These fall through
to the Proxy in footprints.js and seat from the sidecar data — no
conflict, working as designed.

### UI-only (24 kinds)

BUILTIN entries without sidecar footprints. These are either engine
aliases (gate_and, gate_or, etc.), simplified UI-side kinds (keypad,
meter, shift_register), or parts whose sidecars don't declare a
footprint (dc_motor, relay, servo, etc.).
