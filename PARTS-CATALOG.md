# Parts Catalog — bw-circuit-designer

> **This is the single canonical parts list for the circuit designer.**
> bw-board owns engine kind names; this file owns everything else:
> catalogue entry, slug, art, variants, identification confidence.
> Chip designations (74HC08, TMP36, L293D, etc.) are manufacturer names.
>
> **Last updated:** 2026-08-09 — reconciled against verified Tinkercad
> library (114 parts) + coordinator target inventory.

## How to read this catalog

| Column | Meaning |
|--------|---------|
| **Kind slug** | The key. Art files, sidecars, engine registrations, and UI palette all key on this. Changing it requires updating all four. |
| **Engine** | `modeled` = in bw-board solver. `registry-candidate` = plugin interface exists. `drawable-only` = art/palette only. |
| **Art** | `done` / `dip-gen` / `pending`. |
| **Confidence** | `verified` = part number confirmed from Tinkercad slug or label. `standard` = conventional part for that function. **`unverified`** = more than one candidate is plausible; the sidecar documents the assumption. *(blank)* = generic component. |

### Variant collapses

Multiple catalogue entries in the reference library sometimes map to a single
kind slug + SVG. The collapse is explicit here so nobody re-discovers it as a gap.

| Catalogue entries | Kind slug | How collapsed |
|---|---|---|
| NeoPixel Ring 12 / 16 / 24 | `neopixel_ring` | One SVG, `variants.leds: [12, 16, 24]` |
| NeoPixel Strip 4 / 6 / 8 / 10 / 12 / 16 / 20 | `neopixel_strip` | One SVG, `variants.leds: [4, 6, 8, 10, 12, 16, 20]` |
| DIP Switch SPST x4 / x6 | `dip_switch_spst` | One SVG, `variants.positions: [4, 6]` |
| DC Motor with Encoder / (large) | `dc_motor_encoder` | One SVG; large variant is same behaviour, bigger body |
| Small-signal nMOS + Power nMOS | `nmos` + `nmos_power` | Two distinct slugs (different packages: TO-92 vs TO-220) |
| Small-signal pMOS + Power pMOS | `pmos` + `pmos_power` | Two distinct slugs (different packages) |

### Unverified identifications

These four parts are marked **unverified** because Tinkercad does not name
a specific part and more than one candidate is plausible. The uncertainty
is documented in the JSON sidecar `_note` field, not just here.

| Kind slug | What is uncertain | Assumed | Alternative |
|---|---|---|---|
| `seven_segment_clock` | Controller IC | generic clk/dio terminals | HT16K33 (I2C) vs TM1637 (custom 2-wire) — NOT interchangeable |
| `attiny85` | ATtiny variant | ATtiny85 (8-pin, usual one) | Could be ATtiny45 or ATtiny25 |
| `microbit` | Board generation | generic | v1 (nRF51822) vs v2 (nRF52833) |
| `gas_sensor` | MQ-series variant | generic MQ-style | MQ-2/MQ-3/MQ-4 span air/smoke/alcohol/methane |

---

## Passives / General (6 kinds)

| # | Kind slug | Name EN / DE | Terminals | Engine | Art |
|---|-----------|-------------|-----------|--------|-----|
| 1 | `resistor` | Resistor / Widerstand | a, b | modeled | done |
| 2 | `capacitor` | Capacitor / Kondensator | a, b | modeled | done |
| 3 | `polarized_cap` | Polarized Capacitor / Elektrolytkondensator | pos, neg | drawable-only | done |
| 4 | `diode` | Diode / Diode | anode, cathode | modeled | done |
| 5 | `zener` | Zener Diode / Zener-Diode | anode, cathode | modeled | done |
| 6 | `inductor` | Inductor / Spule | a, b | modeled | done |

## Inputs (22 kinds)

| # | Kind slug | Name EN / DE | Terminals | Engine | Art | Confidence |
|---|-----------|-------------|-----------|--------|-----|------------|
| 7 | `button` | Push Button / Taster | a, b | modeled | done | |
| 8 | `potentiometer` | Potentiometer / Potentiometer | a, b, wiper | modeled | done | |
| 9 | `slide_switch` | Slide Switch / Schiebeschalter | a, com, b | drawable-only | done | |
| 10 | `dip_switch_spst` | DIP Switch SPST x4 / DIP-Schalter SPST | 1a-4a, 1b-4b | drawable-only | done | |
| 11 | `dip_switch_dpst` | DIP Switch DPST / DIP-Schalter DPST | (composite) | drawable-only | done | |
| 12 | `ldr` | Photoresistor / Fotowiderstand | a, b | modeled | done | |
| 13 | `photodiode` | Photodiode / Fotodiode | anode, cathode | drawable-only | done | |
| 14 | `light_sensor` | Ambient Light Sensor / Umgebungslichtsensor | vcc, gnd, out | drawable-only | done | `label`: phototransistor |
| 15 | `flex_sensor` | Flex Sensor / Biegesensor | a, b | drawable-only | done | `standard`: flex resistor |
| 16 | `force_sensor` | Force Sensor (FSR) / Kraftsensor | a, b | drawable-only | done | `standard`: FSR |
| 17 | `ir_receiver` | IR Sensor / IR-Empfaenger | vcc, gnd, out | modeled | done | |
| 18 | `ultrasonic` | Ultrasonic Distance Sensor (4-pin) / Ultraschall 4-Pin | vcc, trig, echo, gnd | drawable-only | done | |
| 19 | `ultrasonic_3pin` | Ultrasonic Distance Sensor (3-pin) / Ultraschall 3-Pin | vcc, sig, gnd | drawable-only | done | `standard`: Parallax PING))) |
| 20 | `pir` | PIR Motion Sensor / PIR-Bewegungssensor | vcc, out, gnd | drawable-only | done | `standard`: HC-SR501 |
| 21 | `soil_moisture` | Soil Moisture Sensor / Bodenfeuchtesensor | vcc, gnd, sig | drawable-only | done | `standard`: resistive probe |
| 22 | `tilt_switch` | Tilt Sensor / Neigungsschalter | a, b | drawable-only | done | |
| 23 | `tilt_switch_v2` | Tilt Sensor 4-pin / Neigungsschalter (Kugel) | a, b | drawable-only | done | `standard`: ball switch |
| 24 | `tmp36` | Temperature Sensor TMP36 / Temperatursensor TMP36 | vcc, vout, gnd | drawable-only | done | `label` |
| 25 | `gas_sensor` | Gas Sensor / Gassensor | vcc, gnd, aout, dout | drawable-only | done | **unverified**: MQ-series |
| 26 | `keypad_4x4` | 4x4 Keypad / 4x4-Matrixtastatur | r0-r3, c0-c3 | drawable-only | done | `standard` |
| 27 | `ir_remote` | IR Remote / IR-Fernbedienung | (standalone) | drawable-only | done | |

## Outputs (17 kinds)

| # | Kind slug | Name EN / DE | Terminals | Engine | Art | Confidence |
|---|-----------|-------------|-----------|--------|-----|------------|
| 28 | `led` | LED / LED | anode, cathode | modeled | done | |
| 29 | `rgb_led` | RGB LED / RGB-LED | r_anode, g_anode, b_anode, cathode | modeled | done | |
| 30 | `light_bulb` | Light Bulb / Gluehlampe | a, b | drawable-only | done | |
| 31 | `neopixel` | NeoPixel (single) / NeoPixel (einzeln) | din, vcc, gnd, dout | drawable-only | done | `slug`: WS2812B |
| 32 | `neopixel_jewel` | NeoPixel Jewel / NeoPixel Jewel | din, vcc, gnd, dout | drawable-only | done | `slug`: WS2812B x7 |
| 33 | `neopixel_ring` | NeoPixel Ring / NeoPixel-Ring | din, vcc, gnd, dout | drawable-only | done | `slug`: WS2812B |
| 34 | `neopixel_strip` | NeoPixel Strip / NeoPixel-Streifen | din, vcc, gnd, dout | drawable-only | done | `slug`: WS2812B |
| 35 | `vibration_motor` | Vibration Motor / Vibrationsmotor | a, b | drawable-only | done | |
| 36 | `dc_motor` | DC Motor / Gleichstrommotor | a, b | modeled | done | |
| 37 | `dc_motor_encoder` | DC Motor with Encoder / Motor mit Encoder | a, b, enc_a, enc_b | drawable-only | done | |
| 38 | `servo` | Micro Servo / Micro-Servo | signal, vcc, gnd | modeled | done | `standard`: SG90-class |
| 39 | `hobby_gearmotor` | Hobby Gearmotor / Hobby-Getriebemotor | a, b | registry-candidate | done | |
| 40 | `buzzer` | Piezo / Piezo-Summer | a, b | modeled | done | |
| 41 | `seven_segment` | 7-Segment Display / 7-Segment-Anzeige | (composite) | modeled | done | |
| 42 | `seven_segment_clock` | 7-Segment Clock Display / 7-Segment-Uhranzeige | clk, dio, vcc, gnd | drawable-only | done | **unverified**: HT16K33 vs TM1637 |
| 43 | `char_lcd` | LCD 16x2 / LCD 16x2 | rs, rw, e, d0-d7, vcc, gnd, vo, bl_a, bl_k | modeled | done | `standard`: HD44780 |
| 44 | `lcd_i2c` | LCD 16x2 (I2C) / LCD 16x2 (I2C) | vcc, gnd, sda, scl | drawable-only | done | `standard`: HD44780 + PCF8574 |

## Power (9 kinds)

| # | Kind slug | Name EN / DE | Terminals | Engine | Art |
|---|-----------|-------------|-----------|--------|-----|
| 45 | `battery_9v` | 9V Battery / 9V-Batterie | pos, neg | drawable-only | done |
| 46 | `battery_aa` | 1.5V AA Battery / AA-Batterie 1,5V | pos, neg | drawable-only | done |
| 47 | `battery_coin` | 3V Coin Cell / Knopfzelle CR2032 | pos, neg | drawable-only | done |
| 48 | `solar_cell` | Solar Cell / Solarzelle | pos, neg | drawable-only | done |
| 49 | `potato_battery` | Potato Battery / Kartoffelbatterie | pos, neg | drawable-only | done |
| 50 | `lemon_battery` | Lemon Battery / Zitronenbatterie | pos, neg | drawable-only | done |
| 51 | `lm7805` | LM7805 5V Regulator / LM7805 5V-Regler | vin, gnd, vout | drawable-only | done |
| 52 | `ld1117v33` | LD1117V33 3.3V LDO / LD1117V33 3,3V-LDO | gnd, vout, vin | drawable-only | done |
| 53 | `breadboard_psu` | Breadboard Power Supply / Breadboard-Netzteil | 5v, 3v3, gnd | drawable-only | done |

## Power Control / Discrete (10 kinds)

| # | Kind slug | Name EN / DE | Terminals | Engine | Art |
|---|-----------|-------------|-----------|--------|-----|
| 54 | `npn` | NPN Transistor (BJT) / NPN-Transistor | base, collector, emitter | modeled | done |
| 55 | `pnp` | PNP Transistor (BJT) / PNP-Transistor | base, collector, emitter | modeled | done |
| 56 | `nmos` | Small Signal nMOS / nMOS (Kleinsignal) | gate, drain, source | modeled | done |
| 57 | `pmos` | Small Signal pMOS / pMOS (Kleinsignal) | gate, drain, source | modeled | done |
| 58 | `nmos_power` | nMOS Power MOSFET / nMOS Leistungs-MOSFET | gate, drain, source | drawable-only | done |
| 59 | `pmos_power` | pMOS Power MOSFET / pMOS Leistungs-MOSFET | gate, source, drain | drawable-only | done |
| 60 | `tip120` | TIP120 Darlington / TIP120-Darlington | base, collector, emitter | drawable-only | done |
| 61 | `relay` | Relay SPDT / SPDT-Relais | coil_a, coil_b, com, nc, no | modeled | done |
| 62 | `relay_dpdt` | Relay DPDT / DPDT-Relais | coil_a, coil_b, no1, com1, nc1, no2, com2, nc2 | drawable-only | done |
| 63 | `motor_driver_l293d` | H-Bridge L293D / H-Bruecke L293D | (16-pin DIP) | registry-candidate | done |

## Logic ICs — DIP family (23 kinds)

Generated by `generate-dip.js`. Pin maps from manufacturer datasheets.

| # | Kind slug | Name | Pins | Function | Datasheet src | Art |
|---|-----------|------|------|----------|---------------|-----|
| 64 | `74hc00` | 74HC00 Quad NAND | 14 | 4x 2-input NAND | `slug` | dip-gen |
| 65 | `74hc02` | 74HC02 Quad NOR | 14 | 4x 2-input NOR | `slug` | dip-gen |
| 66 | `74hc04` | 74HC04 Hex Inverter | 14 | 6x NOT | `slug` | dip-gen |
| 67 | `74hc08` | 74HC08 Quad AND | 14 | 4x 2-input AND | `slug` | dip-gen |
| 68 | `74hc10` | 74HC10 Triple NAND3 | 14 | 3x 3-input NAND | `slug` | dip-gen |
| 69 | `74hc11` | 74HC11 Triple AND3 | 14 | 3x 3-input AND | `slug` | dip-gen |
| 70 | `74hc14` | 74HC14 Hex Schmitt Inv | 14 | 6x Schmitt inverter | `slug` | dip-gen |
| 71 | `74hc20` | 74HC20 Dual NAND4 | 14 | 2x 4-input NAND | `slug` | dip-gen |
| 72 | `74hc21` | 74HC21 Dual AND4 | 14 | 2x 4-input AND | `slug` | dip-gen |
| 73 | `74hc27` | 74HC27 Triple NOR3 | 14 | 3x 3-input NOR | `slug` | dip-gen |
| 74 | `74hc32` | 74HC32 Quad OR | 14 | 4x 2-input OR | `slug` | dip-gen |
| 75 | `74hc73` | 74HC73 Dual JK-FF | 14 | 2x JK flip-flop | `slug` | dip-gen |
| 76 | `74hc74` | 74HC74 Dual D-FF | 14 | 2x D flip-flop | `slug` | dip-gen |
| 77 | `74hc75` | 74HC75 Quad Latch | 16 | 4x bistable latch | `slug` | dip-gen |
| 78 | `74hc86` | 74HC86 Quad XOR | 14 | 4x 2-input XOR | `slug` | dip-gen |
| 79 | `74hc93` | 74HC93 4-Bit Counter | 14 | 4-bit ripple counter | `slug` | dip-gen |
| 80 | `74hc95` | 74HC95 4-Bit Shift Reg | 14 | 4-bit parallel shift register | — | dip-gen |
| 81 | `74hc132` | 74HC132 Schmitt NAND | 14 | 4x 2-input Schmitt NAND | `slug` | dip-gen |
| 82 | `74hc283` | 74HC283 4-Bit Adder | 16 | 4-bit binary full adder | `slug` | dip-gen |
| 83 | `74hc595` | 74HC595 Shift Register | 16 | 8-bit serial-in/parallel-out | `slug` | dip-gen |
| 84 | `cd4017` | CD4017 Decade Counter | 16 | Johnson decade counter | `slug` | dip-gen |
| 85 | `cd4511` | CD4511 BCD-to-7-Seg | 16 | BCD to 7-seg decoder/driver | `slug` | dip-gen |
| 86 | `pcf8574` | PCF8574 I2C Expander | 16 | 8-bit I2C I/O expander | `slug` | dip-gen |

## Analog ICs (6 kinds)

| # | Kind slug | Name EN / DE | Terminals | Engine | Art | Confidence |
|---|-----------|-------------|-----------|--------|-----|------------|
| 87 | `555` | 555 Timer (NE555) / 555-Timer | gnd, trigger, output, reset, control, threshold, discharge, vcc | registry-candidate | done | `slug` |
| 88 | `556` | 556 Dual Timer (NE556) / 556-Doppeltimer | (14-pin DIP) | drawable-only | pending | `slug` |
| 89 | `opamp` | Op-Amp 741 (uA741) / Operationsverstaerker | inp, inn, out | modeled | done | `slug` |
| 90 | `comparator_lm393` | Dual Comparator LM393 / Komparator LM393 | inp, inn, out, vcc, gnd | drawable-only | pending | `slug` |
| 91 | `comparator_lm339` | Quad Comparator LM339 / Komparator LM339 | (14-pin DIP) | drawable-only | pending | `slug` |
| 92 | `optocoupler` | Optocoupler 4N35 / Optokoppler 4N35 | anode, cathode, emitter, collector | drawable-only | done | `slug` |

## MCU Boards (4 kinds + 1 declined)

| # | Kind slug | Name EN / DE | Engine | Art | Confidence |
|---|-----------|-------------|--------|-----|------------|
| 93 | `arduino_uno` | Arduino Uno R3 / Arduino Uno R3 | drawable-only | done | `standard`: ATmega328P |
| 94 | `attiny85` | ATtiny / ATtiny | drawable-only | pending | **unverified**: probably ATtiny85 |
| 95 | `microbit` | micro:bit / micro:bit | drawable-only | pending | **unverified**: v1 vs v2 |
| 96 | `stc_mcu` | STC12/STC15 MCU / STC-MCU | drawable-only | pending | unique to bw |
| — | ~~`esp8266`~~ | ~~ESP8266 WiFi~~ | **declined** | — | WiFi simulation out of scope |

## Instruments (4 kinds)

Instruments are netlist parts with UI — they need art and catalogue entries
like any other part (per bw-board ruling 2db84b2).

| # | Kind slug | Name EN / DE | Terminals | Engine | Art |
|---|-----------|-------------|-----------|--------|-----|
| 97 | `multimeter` | Multimeter / Multimeter | probe_a, probe_b | modeled | pending |
| 98 | `power_supply` | Power Supply / Netzteil | pos, neg | modeled | done |
| 99 | `function_gen` | Function Generator / Funktionsgenerator | out, gnd | modeled | pending |
| 100 | `oscilloscope` | Oscilloscope / Oszilloskop | ch1, ch2, gnd | modeled | pending |

> `power_supply` is `vsource` with a settable V/I-limit. The existing
> `vsource` art covers it; the slug alias will be resolved in bw-board.

## Boards / Connectors (7 kinds)

| # | Kind slug | Name EN / DE | Engine | Art |
|---|-----------|-------------|--------|-----|
| 101 | `breadboard_full` | Breadboard Standard / Steckbrett | drawable-only | pending |
| 102 | `breadboard_half` | Breadboard Small / Steckbrett Klein | drawable-only | pending |
| 103 | `breadboard_mini` | Breadboard Mini / Steckbrett Mini | drawable-only | pending |
| 104 | `header_8pin` | 8-Pin Header / 8-Pin-Stiftleiste | drawable-only | pending |
| 105 | `usb_a` | USB-A Connector / USB-A-Stecker | drawable-only | pending |
| 106 | `microbit_breakout` | micro:bit with Breakout / micro:bit mit Breakout | drawable-only | pending |
| 107 | `pololu_motor_ctrl` | Pololu Motor Controller / Pololu-Motorsteuerung | drawable-only | pending |

## Engine-only parts (not in reference library)

Modeled in bw-board, useful, not in the Tinkercad reference. Kept as extras.

| # | Kind slug | Notes | Art |
|---|-----------|-------|-----|
| 108 | `switch` | SPST toggle (engine has it alongside slide_switch) | done |
| 109 | `ntc` | NTC thermistor (engine models it; TMP36 is analog alternative) | done |
| 110 | `eeprom` | I2C EEPROM (24LC256-class) | done |
| 111 | `temp_sensor` | DS18B20 1-wire temp sensor (different from TMP36) | done |
| 112 | `led_matrix` | 8x8 LED matrix (standalone, no MAX7219) | done |
| 113 | `led_cube` | LED cube (unique to bw) | done |
| 114 | `mcu` | Generic MCU (base for arch-specific boards) | done |
| 115 | `vcc` | VCC supply rail | done |
| 116 | `gnd` | Ground reference | done |
| 117 | `vsource` | Ideal voltage source | done |
| 118 | `isource` | Ideal current source | done |

---

## Summary

| | Kinds | With art |
|---|---|---|
| Reference library match | 107 | 92 |
| Engine-only extras | 11 | 11 |
| Declined | 1 | — |
| **Total** | **118 + 1 declined** | **103** |

### Art remaining (15 kinds needing art)

| Priority | Kind slug | Effort |
|---|---|---|
| 1 | `556` | DIP-gen (14-pin, add pin map) |
| 2 | `comparator_lm393` | DIP-gen (8-pin) |
| 3 | `comparator_lm339` | DIP-gen (14-pin) |
| 4 | `attiny85` | DIP-gen (8-pin) |
| 5 | `multimeter` | New drawing (instrument) |
| 6 | `function_gen` | New drawing (instrument) |
| 7 | `oscilloscope` | New drawing (instrument) |
| 8 | `breadboard_full` | New drawing |
| 9 | `breadboard_half` | New drawing |
| 10 | `breadboard_mini` | New drawing |
| 11 | `header_8pin` | New drawing (trivial) |
| 12 | `usb_a` | New drawing (trivial) |
| 13 | `microbit` | New drawing (board) |
| 14 | `stc_mcu` | New drawing (board, unique to bw) |
| 15 | `microbit_breakout` | New drawing (board + breakout) |
| low | `pololu_motor_ctrl` | New drawing (board, help-page-only) |
