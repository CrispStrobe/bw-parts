# Parts Reconciliation Table

> **Single source of truth for cross-repo coverage.**
> Every repo's coverage gate keys off this table.
> Where a slug differs between repos, the canonical slug (this file) wins
> and the other repo renames once.
>
> **Last updated:** 2026-08-10

## Slug conventions

- **Canonical slug**: what bw-parts uses. This is the key.
- **bw-board slug**: what the engine registers. Where it differs, noted.
- **bw-circuit-ui slug**: what the UI palette uses. Where it differs, noted.

## Counts

| Repo | Reports | After reconciliation |
|---|---|---|
| bw-parts catalog | 118 kinds | 118 (canonical) |
| bw-board getPartKinds | ~108 kinds | maps to 118 via aliases below |
| bw-circuit-ui palette | ~68 kinds | maps to 118 (partial coverage) |
| coordinator first-pass | 88 kinds | discarded (over-collapsed) |

The difference is variant collapse: bw-board has `battery` (generic) where
bw-parts has `battery_9v` / `battery_aa` / `battery_coin` (3 kinds). Both
are valid but the catalogue granularity is canonical.

## Slug mismatches requiring rename

These are cases where the same physical part has a different slug in
different repos. **bw-parts slug wins.** The owning repo should rename.

### Resolved (bw-parts renamed to match consensus)

| Old bw-parts slug | New canonical | Reason |
|---|---|---|
| `hobby_gearmotor` | `gearmotor` | bw-board + bw-circuit-ui both used `gearmotor` |
| `motor_driver_l293d` | `l293d` | reference catalogue slug; shortest of three |
| `comparator_lm393` | `lm393` | shorter, matches reference catalogue slug |
| `comparator_lm339` | `lm339` | shorter, matches reference catalogue slug |
| `seven_segment_clock` | `clock_display` | bw-board + bw-circuit-ui both used it |
| `lcd_i2c` | `char_lcd_i2c` | bw-board + bw-circuit-ui both used it |
| `header_8pin` | `header` | files already used `header`; pin count is a param |

### Still open (other repos need to rename)

| Canonical (bw-parts) | bw-board uses | bw-circuit-ui uses | Action needed |
|---|---|---|---|
| `555` | `timer_555` | `555` | bw-board: rename to `555` |
| `556` | `timer_556` | — | bw-board: rename to `556` |
| `light_sensor` | `ambient_light` / `phototransistor` | — | bw-board: alias both to `light_sensor` |
| `l293d` | `h_bridge` | `l293d` | bw-board: rename `h_bridge` to `l293d` |
| `buzzer` | `piezo` | `buzzer` | bw-board: rename to `buzzer` |
| `pir` | `pir` | `pir_sensor` | bw-circuit-ui: rename to `pir` |
| `keypad_4x4` | `keypad_4x4` | `keypad` | bw-circuit-ui: rename to `keypad_4x4` |
| `dc_motor_encoder` | `dc_motor_encoder` | `motor_encoder` | bw-circuit-ui: rename to `dc_motor_encoder` |
| `tilt_switch` / `tilt_switch_v2` | `tilt_sensor` | `tilt_sensor` | Open: rename bw-parts to `tilt_sensor` + variant, or keep? |
| `dip_switch_spst` / `dip_switch_dpst` | `dip_switch` | `dip_switch` | Open: collapse to `dip_switch` + variant, or keep separate? |
| `74hc595` | `shift_register` + `74hc595` | `shift_register` | bw-board has both; UI has old name. DIP slug `74hc595` is canonical. |

## Full reconciliation table

Legend: ✓ = present, — = absent, *alias* = present under different slug

| # | Canonical slug | Collapsed from | Engine (bw-board) | Palette (bw-circuit-ui) | Art (bw-parts) | Notes |
|---|---|---|---|---|---|---|
| 1 | `resistor` | — | ✓ | ✓ | ✓ | |
| 2 | `capacitor` | — | ✓ | ✓ | ✓ | |
| 3 | `polarized_cap` | — | ✓ | — | ✓ | |
| 4 | `diode` | — | ✓ | ✓ | ✓ | |
| 5 | `zener` | — | ✓ | ✓ | ✓ | |
| 6 | `inductor` | — | ✓ | ✓ | ✓ | |
| 7 | `button` | — | ✓ | ✓ | ✓ | |
| 8 | `potentiometer` | — | ✓ | ✓ | ✓ | |
| 9 | `slide_switch` | — | *switch* | ✓ | ✓ | engine has `switch`; UI has `slide_switch` |
| 10 | `dip_switch_spst` | SPST x4, x6 | *dip_switch* | *dip_switch* | ✓ | engine/UI collapse both DIP types |
| 11 | `dip_switch_dpst` | — | *dip_switch* | *dip_switch* | ✓ | |
| 12 | `ldr` | — | ✓ | ✓ | ✓ | |
| 13 | `photodiode` | — | ✓ | ✓ | ✓ | |
| 14 | `light_sensor` | Ambient Light Sensor | *ambient_light* | — | ✓ | reference catalogue: phototransistor |
| 15 | `flex_sensor` | — | ✓ | — | ✓ | |
| 16 | `force_sensor` | — | ✓ | — | ✓ | |
| 17 | `ir_receiver` | IR sensor | ✓ | ✓ | ✓ | |
| 18 | `ultrasonic` | 4-pin | ✓ | ✓ | ✓ | |
| 19 | `ultrasonic_3pin` | 3-pin PING | — | — | ✓ | engine does not model yet |
| 20 | `pir` | — | ✓ | *pir_sensor* | ✓ | |
| 21 | `soil_moisture` | — | ✓ | ✓ | ✓ | |
| 22 | `tilt_switch` | Tilt Sensor 2-pin | *tilt_sensor* | *tilt_sensor* | ✓ | |
| 23 | `tilt_switch_v2` | Tilt Sensor 4-pin | *tilt_sensor* | *tilt_sensor* | ✓ | |
| 24 | `tmp36` | — | ✓ | ✓ | ✓ | |
| 25 | `gas_sensor` | MQ-series | ✓ | ✓ | ✓ | **unverified** |
| 26 | `keypad_4x4` | — | ✓ | *keypad* | ✓ | |
| 27 | `ir_remote` | — | ✓ | ✓ | ✓ | |
| 28 | `led` | — | ✓ | ✓ | ✓ | |
| 29 | `rgb_led` | — | ✓ | ✓ | ✓ | |
| 30 | `light_bulb` | — | ✓ | ✓ | ✓ | |
| 31 | `neopixel` | single + strip + ring + jewel variants | ✓ | ✓ | ✓ | 4 SVGs for 13 catalogue entries |
| 32 | `neopixel_jewel` | NeoPixel Jewel (7 LEDs) | — | — | ✓ | |
| 33 | `neopixel_ring` | Ring 12/16/24 | — | — | ✓ | variants: 12, 16, 24 |
| 34 | `neopixel_strip` | Strip 4/6/8/10/12/16/20 | — | — | ✓ | variants: 4-20 |
| 35 | `vibration_motor` | — | ✓ | ✓ | ✓ | |
| 36 | `dc_motor` | — | ✓ | ✓ | ✓ | |
| 37 | `dc_motor_encoder` | + large variant | ✓ | *motor_encoder* | ✓ | |
| 38 | `servo` | — | ✓ | ✓ | ✓ | |
| 39 | `gearmotor` | — | ✓ | ✓ | done | renamed from `hobby_gearmotor` |
| 40 | `buzzer` | Piezo | *piezo* | ✓ | ✓ | |
| 41 | `seven_segment` | — | ✓ | ✓ | ✓ | |
| 42 | `clock_display` | 4-digit clock | ✓ | ✓ | done | renamed from `seven_segment_clock`; **unverified** |
| 43 | `char_lcd` | LCD 16x2 | ✓ | ✓ | ✓ | |
| 44 | `char_lcd_i2c` | LCD 16x2 I2C | ✓ | ✓ | done | renamed from `lcd_i2c` |
| 45 | `battery_9v` | — | ✓ | — | ✓ | engine also has generic `battery` |
| 46 | `battery_aa` | — | ✓ | — | ✓ | |
| 47 | `battery_coin` | — | ✓ | — | ✓ | |
| 48 | `solar_cell` | — | ✓ | ✓ | ✓ | |
| 49 | `potato_battery` | — | — | — | ✓ | pedagogical |
| 50 | `lemon_battery` | — | — | — | ✓ | pedagogical |
| 51 | `lm7805` | — | ✓ | — | ✓ | engine also has generic `vreg` |
| 52 | `ld1117v33` | — | ✓ | — | ✓ | |
| 53 | `breadboard_psu` | — | — | — | ✓ | |
| 54 | `npn` | — | ✓ | ✓ | ✓ | |
| 55 | `pnp` | — | ✓ | ✓ | ✓ | |
| 56 | `nmos` | Small signal | ✓ | ✓ | ✓ | |
| 57 | `pmos` | Small signal | ✓ | ✓ | ✓ | |
| 58 | `nmos_power` | Power MOSFET | — | — | ✓ | |
| 59 | `pmos_power` | Power MOSFET | — | — | ✓ | |
| 60 | `tip120` | TIP120 Darlington | *darlington_driver* | ✓ | ✓ | |
| 61 | `relay` | SPDT | ✓ | ✓ | ✓ | |
| 62 | `relay_dpdt` | DPDT | ✓ | ✓ | ✓ | |
| 63 | `l293d` | H-bridge | *h_bridge* | ✓ | done | renamed from `motor_driver_l293d`; bw-board still uses `h_bridge` |
| 64 | `optocoupler` | 4N35 | ✓ | — | ✓ | |
| 65-81 | `74hc00`..`74hc132` | 17 logic ICs | ✓ (most) | ✓ (6 of 17) | dip-gen | |
| 82 | `74hc283` | 4-bit Adder | ✓ | — | dip-gen | |
| 83 | `74hc595` | Shift Register | ✓ + *shift_register* | *shift_register* | dip-gen | |
| 84 | `cd4017` | Decade Counter | *decade_counter* | — | dip-gen | |
| 85 | `cd4511` | BCD-to-7-Seg | ✓ | — | dip-gen | |
| 86 | `pcf8574` | I2C Expander | ✓ | ✓ | dip-gen | |
| 87 | `74hc75` | Quad Latch | ✓ | — | dip-gen | |
| 88 | `74hc95` | 4-bit Shift Reg | ✓ | — | dip-gen | |
| 89 | `555` | NE555 Timer | *timer_555* | ✓ | done | |
| 90 | `556` | NE556 Dual Timer | *timer_556* | — | dip-gen | |
| 91 | `opamp` | uA741 | ✓ | ✓ | done | |
| 92 | `lm393` | LM393 Dual | ✓ | — | dip-gen | renamed from `comparator_lm393` |
| 93 | `lm339` | LM339 Quad | ✓ | — | dip-gen | renamed from `comparator_lm339` |
| 94 | `arduino_uno` | — | ✓ (as mcu) | ✓ (as mcu) | done | |
| 95 | `attiny85` | — | ✓ (avr8js, a7fef9a) | — | dip-gen | **unverified** |
| 96 | `microbit` | — | — | — | done | **unverified** |
| 97 | `stc_mcu` | — | — | — | done | unique to bw |
| 98 | `multimeter` | — | — | *meter* | done | |
| 99 | `power_supply` | — | ✓ (as vsource) | ✓ (as vsource) | done (vsource art) | |
| 100 | `function_gen` | — | ✓ (as vsource variant) | — | done | |
| 101 | `oscilloscope` | — | — | — | done | |
| 102 | `breadboard_full` | — | — | *breadboard* | done | |
| 103 | `breadboard_half` | — | — | — | done | |
| 104 | `breadboard_mini` | — | — | — | done | |
| 105 | `header` | — | ✓ | ✓ | done | renamed from `header_8pin` |
| 106 | `usb_a` | ✓ | ✓ | done | |
| 107 | `microbit_breakout` | — | — | — | done | combo part |
| 108 | `pololu_motor_ctrl` | — | — | — | done | help-page-only |
| 109 | `switch` | — | ✓ | ✓ | done | engine-only; kept alongside slide_switch |
| 110 | `ntc` | — | ✓ | ✓ | done | |
| 111 | `eeprom` | — | ✓ | ✓ | done | |
| 112 | `temp_sensor` | — | ✓ | ✓ | done | DS18B20 |
| 113 | `led_matrix` | — | ✓ | ✓ | done | |
| 114 | `led_cube` | — | ✓ | ✓ | done | |
| 115 | `mcu` | — | ✓ | ✓ | done | generic MCU |
| 116 | `vcc` | — | ✓ | ✓ | done | |
| 117 | `gnd` | — | ✓ | ✓ | done | |
| 118 | `vsource` | — | ✓ | ✓ | done | |
| 119 | `isource` | — | ✓ | ✓ | done | |

## Engine-only kinds not yet in catalogue

bw-board registers these but bw-parts has no catalogue entry:

| bw-board slug | What it is | Action |
|---|---|---|
| `battery` | Generic battery | Alias to battery_9v/aa/coin by params |
| `vreg` | Generic voltage regulator | Alias to lm7805/ld1117v33 by params |
| `fuse` | Fuse | Add to catalogue if desired |
| `solenoid` | Solenoid | Add to catalogue if desired |
| `stepper` | Stepper motor | Add to catalogue if desired |
| `gate_and/or/not/nand/nor/xor` | Abstract logic gates | Superseded by 74HC DIP family; keep as engine shorthand |
| `dff` / `jkff` | Abstract flip-flops | Superseded by 74HC73/74; keep as engine shorthand |
| `shift_register` | Abstract shift register | Superseded by 74HC595; keep as engine shorthand |
| `decade_counter` | Abstract decade counter | Superseded by CD4017; keep as engine shorthand |
| `ir_transmitter` | IR transmitter | Separate from ir_remote? Clarify |

## Proposed slug renames — completed

All 7 bw-parts renames have been executed (see "Resolved" above). The
remaining open items are for bw-board and bw-circuit-ui to resolve.
