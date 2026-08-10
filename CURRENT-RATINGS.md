# Current Ratings for Chip-Budget DRC

> Consumed by bw-board `getMaxCurrent(kind)`.
> bw-parts owns the data (datasheets, sourcing). bw-board owns the
> semantics (what the number means, how the DRC uses it).
>
> **Four states in `current-ratings.json`:**
>
> | Value | Meaning | DRC behaviour |
> |---|---|---|
> | `number` | Rated max supply current in mA | Sum into budget |
> | `0` | Not a consumer of chip supply current (passives, sources, infrastructure) | Ignore — does not affect budget |
> | `"circuit"` | Depends on circuit wiring — cannot be rated from kind alone | Display "depends on your circuit" |
> | `null` | Not yet rated — could be rated with more research | Display "not yet rated" |
>
> The `0` vs `"circuit"` distinction settles the passive disagreement:
> a resistor is a current-limiter, not a current-consumer — it has no
> Icc, no VCC pin, and contributes 0 to the chip supply budget.
> An LED *does* draw from VCC but how much depends on its series
> resistor, so it is `"circuit"` not `0`.

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

| State | Count | DRC effect |
|---|---|---|
| Rated (number > 0) | 33 | Summed into "at least X mA" |
| Not a consumer (0) | 44 | Ignored — no budget impact |
| Circuit-dependent (`"circuit"`) | 21 | "depends on your circuit" |
| Not yet rated (`null`) | 5 | "N parts not yet rated" |

Machine-readable data is in `current-ratings.json`.
