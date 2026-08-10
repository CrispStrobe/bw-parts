# Current Ratings for DRC

> bw-parts owns the data (datasheets, sourcing). bw-board owns the
> semantics (what the number means, how each DRC uses it).

## Two budgets, not one

A servo draws 350mA — from the supply rail, not from the MCU pin.
The pin carries a 50Hz PWM signal into a high-impedance input:
microamps. If the chip-budget DRC counts the servo's motor current,
every servo circuit trips a false 120mA warning.

This is a new category: **a large consumer that is not the chip's
consumer**. The same applies to DC motors (via H-bridge), NeoPixels
(VCC rail powered, data pin is signal), relay coils (via transistor),
ultrasonic sensors (own VCC), and all external ICs (own supply pins).

So `current-ratings.json` now has **two fields per part**:

| Field | Budget | Limit | DRC question |
|---|---|---|---|
| `chip_mA` | MCU I/O pin current | 120mA total (STC12 §4.1), 20mA per pin | "Will this brown out the chip?" |
| `supply_mA` | Power rail current | 500mA (USB), battery capacity | "Will this brown out the supply?" |

Each field uses the same four-state convention:

| Value | Meaning |
|---|---|
| `number` | Rated max in mA |
| `0` | Not a consumer for this budget |
| `"circuit"` | Depends on wiring — cannot rate from kind alone |
| `null` | Not yet rated |

### The decision, and why

A servo is `chip_mA: 0, supply_mA: 350`. The chip budget ignores it
(correct — no pin current). The supply budget counts it (correct —
350mA from the rail). A circuit with an MCU and two servos shows:

- Chip budget: "at least 20 mA" (just the MCU)
- Supply budget: "at least 720 mA" (MCU + 2x servo) → over USB limit

Without the split, the chip budget would either cry wolf (counting
350mA against a 120mA limit that doesn't apply) or stay silent about
a real USB brownout hazard. Both are wrong; the split is the only
answer that is right for both warnings.

### Parts that moved

| Kind | Old (single field) | New chip_mA | New supply_mA | Why |
|---|---|---|---|---|
| `servo` | 350 | 0 | 350 | Pin is signal; motor current is rail |
| `vibration_motor` | 80 | 0 | 80 | Same — driven from supply via transistor |
| `ultrasonic` | 15 | 0 | 15 | Own VCC pin, not driven by MCU I/O |
| `pir` | 0.15 | 0 | 0.15 | Own VCC pin |
| `tmp36` | 0.05 | 0 | 0.05 | Own VCC pin |
| `gas_sensor` | 150 | 0 | 150 | Heater on VCC rail |
| `neopixel*` | "circuit" | 0 | "circuit" | Data pin is signal; power is rail |
| `relay*` | "circuit" | 0 | "circuit" | Coil via transistor, not direct MCU pin |
| All ICs (74HC, 555, etc.) | 1-30 | 0 | 1-30 | ICs have own VCC pins |
| `char_lcd` / `lcd_i2c` | 2 | 0 | 2 | Own VCC |
| `lm7805` / `ld1117v33` | 5 | 0 | 5 | Regulators — own supply path |

The general rule: if a part has its own VCC pin (not connected to an
MCU I/O pin), its current is `supply_mA`, not `chip_mA`. Parts whose
current flows through an MCU I/O pin (LEDs driven directly, buzzers
connected to a port pin) are `chip_mA`.

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

## Not consumers — rated 0

Passives, switches, and variable resistors are current-limiters, not
current-consumers. They have no Icc, no VCC pin, and contribute 0 to
the chip supply budget. A resistor in a voltage divider draws current,
but that current flows *through* the supply's budget, not *from* it
as a separate consumer.

| Kind | Why 0 |
|---|---|
| `resistor` | Current-limiter — no Icc of its own |
| `capacitor` | Energy storage — no steady-state supply draw |
| `polarized_cap` | Same |
| `inductor` | Energy storage |
| `diode` | Current-limiter — forward current set by circuit |
| `zener` | Current-limiter — set by series resistor |
| `button` | Contact closure — passes current, does not consume it |
| `switch` | Same |
| `slide_switch` | Same |
| `dip_switch_spst` | Same |
| `dip_switch_dpst` | Same |
| `tilt_switch` | Same |
| `tilt_switch_v2` | Same |
| `potentiometer` | Variable resistor — no Icc |
| `ldr` | Variable resistor |
| `photodiode` | Photocurrent is µA, no supply pin |
| `flex_sensor` | Variable resistor |
| `force_sensor` | Variable resistor |
| `ntc` | Variable resistor |
| `keypad_4x4` | Passive matrix — no supply pin |
| `ir_remote` | Standalone unit — no supply connection to circuit |

## Circuit-dependent (`"circuit"`) — cannot be rated from kind alone

These parts DO draw from the supply, but how much depends on external
wiring. The DRC should display "depends on your circuit" for these,
not "not counted". They are `"circuit"` in the JSON, not `null`.

| Kind | Why circuit-dependent |
|---|---|
| `led` | Current set by series resistor — the LED does not limit it |
| `rgb_led` | Same — three channels, each set by its resistor |
| `light_bulb` | I = V/R, depends on ohms param and supply |
| `neopixel` | Up to 60mA/pixel at full white, depends on color/brightness |
| `neopixel_jewel` | Same (7 pixels, up to ~420mA) |
| `neopixel_ring` | Same (12-24 pixels, up to ~1.4A) |
| `neopixel_strip` | Same (4-20 pixels) |
| `seven_segment` | Depends on which segments lit and series resistors |
| `npn` | Collector current set by base drive and load |
| `pnp` | Same |
| `nmos` | Drain current set by gate voltage and load |
| `pmos` | Same |
| `nmos_power` | Same |
| `pmos_power` | Same |
| `tip120` | Darlington — collector current set by base drive and load |
| `relay` | Coil current ~70mA typical but varies by relay; contact current depends on load |
| `relay_dpdt` | Same |
| `motor_driver_l293d` | Quiescent Icc ~24mA (TI L293D SLRS008), but motor current depends on load |
| `dc_motor` | Stall current varies by motor (200mA to >1A) |
| `dc_motor_encoder` | Same as dc_motor plus encoder (~10mA) |
| `hobby_gearmotor` | Same as dc_motor |

## Not yet rated (`null`) — work remaining

These could be rated with more research. They are distinct from
"circuit-dependent" — they have a knowable Icc that nobody has
looked up yet.

| Kind | What is needed |
|---|---|
| `temp_sensor` | DS18B20 Icc ~1mA (datasheet), but 1-wire bus current depends on pull-up — could rate the IC portion |
| `eeprom` | 24LC256 Icc ~3mA write / ~1mA read (Microchip datasheet) — could rate |
| `led_matrix` | Composite — depends on how many LEDs lit; could rate per-LED |
| `led_cube` | Same |
| `microbit` | Board — could rate base MCU Icc once v1/v2 is resolved |

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

---

## Counts

### chip_mA (MCU I/O pin budget)

| State | Count | DRC effect |
|---|---|---|
| Rated > 0 | 2 | Summed: LEDs/buzzers driven directly from MCU pin |
| Not a pin consumer (0) | 92 | Most parts — own VCC or passive |
| Circuit-dependent | 15 | LEDs, transistors — depends on wiring |
| Not yet rated | 5 | temp_sensor, eeprom, led_matrix, led_cube, microbit |

### supply_mA (power rail budget)

| State | Count | DRC effect |
|---|---|---|
| Rated > 0 | 33 | Summed: ICs, sensors, motors, MCU boards |
| Not a supply consumer (0) | 44 | Passives, switches, sources, infrastructure |
| Circuit-dependent | 21 | Motors, transistors, NeoPixels, relays |
| Not yet rated | 5 | Same 5 as above |

Machine-readable data is in `current-ratings.json`.
