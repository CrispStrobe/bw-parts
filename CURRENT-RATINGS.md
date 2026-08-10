# Current Ratings for Chip-Budget DRC

> Consumed by bw-board `getMaxCurrent(kind)`.
> Every `null` lands in the "Y parts not counted" bucket.
>
> **Three states:** rated (number + source), circuit-dependent (null,
> cannot be rated from kind alone), not-yet-rated (null, work remaining).

## Rated parts — defensible max supply current (mA)

These are the Icc / Iq / operating current the part draws from the
supply, not what it can source or sink to a load. Source is cited for
every figure.

### Logic ICs — 74HC family

All 74HC quiescent Icc is ≤80µA per TI datasheets (VCC=6V, outputs
unloaded). At typical switching frequencies (~1MHz), add ~1mA per chip.
Conservative rating: **1 mA per chip** (covers quiescent + moderate switching).

Source: TI 74HC-family datasheets, "Supply Current" Icc parameter,
e.g. SN74HC00 SCLS154 §6.7: Icc max = 80µA (quiescent, VCC=6V).

| Kind | mA | Source |
|---|---|---|
| `74hc00` | 1 | TI SCLS series, Icc max 80µA quiescent + switching margin |
| `74hc02` | 1 | same family datasheet |
| `74hc04` | 1 | same |
| `74hc08` | 1 | same |
| `74hc10` | 1 | same |
| `74hc11` | 1 | same |
| `74hc14` | 1 | same |
| `74hc20` | 1 | same |
| `74hc21` | 1 | same |
| `74hc27` | 1 | same |
| `74hc32` | 1 | same |
| `74hc73` | 1 | same |
| `74hc74` | 1 | same |
| `74hc75` | 1 | same |
| `74hc86` | 1 | same |
| `74hc93` | 1 | same |
| `74hc95` | 1 | same |
| `74hc132` | 1 | same |
| `74hc283` | 1 | same |
| `74hc595` | 1 | same |

### CMOS logic — CD4xxx family

| Kind | mA | Source |
|---|---|---|
| `cd4017` | 1 | TI CD4017B SCHS027: Idd max 1mA at VDD=5V |
| `cd4511` | 1 | TI CD4511B SCHS052: Idd max 1mA (logic only; segment drive is load-dependent) |

### I2C expander

| Kind | mA | Source |
|---|---|---|
| `pcf8574` | 0.1 | NXP PCF8574 Rev 5: Idd max 100µA |

### Analog ICs

| Kind | mA | Source |
|---|---|---|
| `555` | 15 | TI NE555 SLFS022: Icc max 15mA (high-state output) |
| `556` | 30 | TI NE556 SLFS023: two 555s, Icc max 30mA total |
| `opamp` | 3 | TI uA741 SLOS094: Icc max 2.8mA |
| `lm393` | 2.5 | TI LM393 SLCS007: Icc max 2.5mA (both comparators) |
| `lm339` | 2.5 | TI LM339 SLCS006: Icc max 2.5mA (all four comparators) |
| `optocoupler` | 0 | 4N35: phototransistor output draws from load circuit, not from the IC supply |

### Sensors

| Kind | mA | Source |
|---|---|---|
| `tmp36` | 0.05 | Analog Devices TMP36: Iq max 50µA |
| `pir` | 0.15 | HC-SR501 typical: 50-150µA quiescent |
| `ultrasonic` | 15 | HC-SR04: operating current ~15mA (Elecfreaks datasheet) |
| `ultrasonic_3pin` | 15 | Parallax PING))): operating current ~15mA (Parallax datasheet) |
| `ir_receiver` | 5 | TSOP-series: Icc max ~5mA typical |
| `gas_sensor` | 150 | MQ-series: heater coil draws ~150mA (significant!) |
| `light_sensor` | 0.1 | Phototransistor: Icc negligible, collector current is load-dependent |
| `soil_moisture` | 0.05 | Resistive probe: negligible quiescent |

### Displays

| Kind | mA | Source |
|---|---|---|
| `char_lcd` | 2 | HD44780 logic: ~1-2mA (backlight is load-dependent, not counted here) |
| `lcd_i2c` | 2 | HD44780 + PCF8574: logic ~2mA total (backlight separate) |
| `seven_segment_clock` | 10 | I2C driver + LEDs at typical brightness, estimated from HT16K33 datasheet: Icc ~10mA |

### MCU boards

| Kind | mA | Source |
|---|---|---|
| `arduino_uno` | 50 | ATmega328P Icc max ~20mA (Microchip DS40002061) + regulator Iq + power LED; 50mA is widely cited for the board |
| `attiny85` | 12 | Microchip ATtiny85 DS2586: Icc max 12mA at 20MHz, 5V |
| `stc_mcu` | 20 | STC12C5A60S2 datasheet; per contract (PINOUT.md): total chip budget ~120mA, Icc typ ~20mA |
| `mcu` | 20 | Generic MCU, use STC12 figure as default |

### Voltage regulators (quiescent only — output current is load)

| Kind | mA | Source |
|---|---|---|
| `lm7805` | 5 | TI LM7805 SLVS056: Iq max ~8mA, typ ~5mA |
| `ld1117v33` | 5 | ST LD1117 datasheet: Iq typ 5mA |
| `breadboard_psu` | 10 | AMS1117-based modules: Iq ~5-10mA |

### Motors and electromechanical

| Kind | mA | Source |
|---|---|---|
| `servo` | 350 | SG90-class stall: ~350mA (Tower Pro SG90 datasheet) |
| `vibration_motor` | 80 | Coin-type vibration motor: ~60-100mA typical |
| `buzzer` | 30 | Piezo buzzer: typical operating ~20-30mA |

### Instruments and infrastructure

| Kind | mA | Source |
|---|---|---|
| `multimeter` | 0 | Virtual instrument, no supply draw |
| `oscilloscope` | 0 | Virtual instrument |
| `function_gen` | 0 | Virtual instrument |
| `power_supply` | 0 | This is a source, not a sink |

---

## Circuit-dependent — cannot be rated from kind alone

These return `null` and should display as "depends on your circuit" rather
than "not yet rated". Their current is determined by external components
(resistor values, supply voltage, load) and genuinely cannot be summed
without solving the netlist.

| Kind | Why circuit-dependent |
|---|---|
| `resistor` | I = V/R, depends on applied voltage and ohms param |
| `capacitor` | Transient/AC current depends on frequency and voltage |
| `polarized_cap` | Same as capacitor |
| `inductor` | Current depends on applied voltage and time |
| `diode` | Forward current set by external circuit |
| `zener` | Current set by series resistor and supply |
| `led` | Current set by series resistor — the LED does not limit it |
| `rgb_led` | Same — three channels, each set by its resistor |
| `light_bulb` | I = V/R, depends on ohms param and supply |
| `neopixel` | Up to 60mA per pixel at full white, but depends on color/brightness — cannot rate without knowing the pattern |
| `neopixel_jewel` | Same (7 pixels, up to ~420mA, but depends on use) |
| `neopixel_ring` | Same (12-24 pixels, up to ~1.4A, but depends on use) |
| `neopixel_strip` | Same (4-20 pixels) |
| `seven_segment` | Depends on which segments are lit and series resistors |
| `button` | Contact closure — passes whatever the circuit provides |
| `switch` | Same |
| `slide_switch` | Same |
| `dip_switch_spst` | Same |
| `dip_switch_dpst` | Same |
| `tilt_switch` | Same |
| `tilt_switch_v2` | Same |
| `potentiometer` | Current depends on where it sits in the circuit |
| `ldr` | Resistance varies with light — current depends on circuit |
| `photodiode` | Photocurrent is µA-scale, external circuit sets operating point |
| `flex_sensor` | Variable resistance — current depends on circuit |
| `force_sensor` | Variable resistance — current depends on circuit |
| `npn` | Collector current set by base drive and load |
| `pnp` | Same |
| `nmos` | Drain current set by gate voltage and load |
| `pmos` | Same |
| `nmos_power` | Same |
| `pmos_power` | Same |
| `tip120` | Darlington — collector current set by base drive and load |
| `relay` | Coil current is fixed (~70mA typical), but varies by relay; contact current depends on load |
| `relay_dpdt` | Same |
| `motor_driver_l293d` | Quiescent Icc ~24mA (TI L293D), but motor current depends on load |
| `dc_motor` | Stall current varies by motor (200mA to >1A); no single figure |
| `dc_motor_encoder` | Same as dc_motor plus encoder (~10mA) |
| `hobby_gearmotor` | Same as dc_motor |
| `ir_remote` | Standalone unit, no supply connection to the circuit |
| `ntc` | Variable resistance — current depends on circuit |
| `temp_sensor` | DS18B20 Icc ~1mA, but this is a 1-wire device and current depends on bus pull-up |
| `eeprom` | I2C EEPROM Icc ~3mA (write), but bus current depends on pull-ups |
| `keypad_4x4` | Passive matrix — current depends on scanning circuit |

## Sources not in supply path — rated 0

| Kind | Why 0 |
|---|---|
| `vcc` | Supply rail node, not a consumer |
| `gnd` | Ground reference |
| `vsource` | Ideal source |
| `isource` | Ideal source |
| `battery_9v` | Source, not a consumer |
| `battery_aa` | Source |
| `battery_coin` | Source |
| `solar_cell` | Source |
| `potato_battery` | Source |
| `lemon_battery` | Source |

## Infrastructure — rated 0

| Kind | Why 0 |
|---|---|
| `breadboard_full` | Passive interconnect |
| `breadboard_half` | Passive interconnect |
| `breadboard_mini` | Passive interconnect |
| `header` | Passive connector |
| `usb_a` | Passive connector |
| `led_matrix` | Composite — current depends on how many LEDs are lit |
| `led_cube` | Composite — same |
| `microbit` | Board — current depends on what peripherals are active; not yet rated |

---

## Machine-readable summary

For `getMaxCurrent(kind)` implementation. `null` = cannot rate or not yet rated.

```
resistor:null, capacitor:null, polarized_cap:null, diode:null, zener:null,
inductor:null, button:null, potentiometer:null, slide_switch:null,
dip_switch_spst:null, dip_switch_dpst:null, ldr:null, photodiode:null,
light_sensor:0.1, flex_sensor:null, force_sensor:null, ir_receiver:5,
ultrasonic:15, ultrasonic_3pin:15, pir:0.15, soil_moisture:0.05,
tilt_switch:null, tilt_switch_v2:null, tmp36:0.05, gas_sensor:150,
keypad_4x4:null, ir_remote:null, led:null, rgb_led:null, light_bulb:null,
neopixel:null, neopixel_jewel:null, neopixel_ring:null, neopixel_strip:null,
vibration_motor:80, dc_motor:null, dc_motor_encoder:null, servo:350,
hobby_gearmotor:null, buzzer:30, seven_segment:null, seven_segment_clock:10,
char_lcd:2, lcd_i2c:2, battery_9v:0, battery_aa:0, battery_coin:0,
solar_cell:0, potato_battery:0, lemon_battery:0, lm7805:5, ld1117v33:5,
breadboard_psu:10, npn:null, pnp:null, nmos:null, pmos:null,
nmos_power:null, pmos_power:null, tip120:null, relay:null, relay_dpdt:null,
motor_driver_l293d:null, optocoupler:0, 74hc00:1, 74hc02:1, 74hc04:1,
74hc08:1, 74hc10:1, 74hc11:1, 74hc14:1, 74hc20:1, 74hc21:1, 74hc27:1,
74hc32:1, 74hc73:1, 74hc74:1, 74hc75:1, 74hc86:1, 74hc93:1, 74hc95:1,
74hc132:1, 74hc283:1, 74hc595:1, cd4017:1, cd4511:1, pcf8574:0.1,
555:15, 556:30, opamp:3, lm393:2.5, lm339:2.5, arduino_uno:50,
attiny85:12, stc_mcu:20, mcu:20, multimeter:0, oscilloscope:0,
function_gen:0, power_supply:0, vcc:0, gnd:0, vsource:0, isource:0,
breadboard_full:0, breadboard_half:0, breadboard_mini:0, header:0,
usb_a:0, switch:null, ntc:null, temp_sensor:null, eeprom:null,
led_matrix:null, led_cube:null, microbit:null
```

**Rated:** 55 kinds with a number (including 0 for sources/infra)
**Circuit-dependent:** 48 kinds that genuinely cannot be rated from kind alone
**Not yet rated:** ~5 kinds (microbit, led_matrix, led_cube, relay coil, L293D quiescent could be rated with more research)
