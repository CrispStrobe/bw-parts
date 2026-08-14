# Parts Catalog — bw-circuit-designer

> **This is the single canonical parts list for the circuit designer.**
> bw-board owns engine kind names; this file owns everything else:
> catalogue entry, slug, art, variants, identification confidence.
> Chip designations (74HC08, TMP36, L293D, etc.) are manufacturer names.
>
> **Last updated:** 2026-08-09 — reconciled against the verified Tinkercad
> Circuits library (114 parts) + coordinator target inventory.

## How to read this catalog

| Column | Meaning |
|--------|---------|
| **Kind slug** | The key. Art files, sidecars, engine registrations, and UI palette all key on this. Changing it requires updating all four. |
| **Engine** | `modeled` = in bw-board solver. `registry-candidate` = plugin interface exists. `drawable-only` = art/palette only. |
| **Art** | `done` / `dip-gen` / `pending`. |
| **Confidence** | `verified` = part number confirmed from Tinkercad's thumbnail slug or UI label. `standard` = conventional part for that function. **`unverified`** = more than one candidate is plausible; the sidecar documents the assumption. *(blank)* = generic component. |

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
| `clock_display` | Controller IC | generic clk/dio terminals | HT16K33 (I2C) vs TM1637 (custom 2-wire) — NOT interchangeable |
| ~~`attiny85`~~ | ~~ATtiny variant~~ | **Verified**: ATtiny85 DIP-8 | Audited against DS40001941C |
| ~~`microbit`~~ | ~~Board generation~~ | **Verified**: V2 (nRF52833) | Touch logo, speaker, mic distinguish V2 |
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
| 39 | `gearmotor` | Hobby Gearmotor / Hobby-Getriebemotor | a, b | registry-candidate | done | |
| 40 | `buzzer` | Piezo / Piezo-Summer | a, b | modeled | done | |
| 41 | `seven_segment` | 7-Segment Display / 7-Segment-Anzeige | (composite) | modeled | done | |
| 42 | `clock_display` | 7-Segment Clock Display / 7-Segment-Uhranzeige | clk, dio, vcc, gnd | drawable-only | done | **unverified**: HT16K33 vs TM1637 |
| 43 | `char_lcd` | LCD 16x2 / LCD 16x2 | vss, vdd, v0, rs, rw, e, d0-d7, a, k | modeled | done | `verified`: HD44780U (ADE-207-272(Z)) |
| 44 | `char_lcd_i2c` | LCD 16x2 (I2C) / LCD 16x2 (I2C) | vcc, gnd, sda, scl | drawable-only | done | `standard`: HD44780 + PCF8574 |

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
| 63 | `l293d` | H-Bridge L293D / H-Bruecke L293D | (16-pin DIP) | registry-candidate | done |

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
| 88 | `556` | 556 Dual Timer (NE556) / 556-Doppeltimer | (14-pin DIP) | drawable-only | dip-gen | `slug` |
| 89 | `opamp` | Op-Amp 741 (uA741) / Operationsverstaerker | inp, inn, out | modeled | done | `slug` |
| 90 | `lm393` | Dual Comparator LM393 / Komparator LM393 | (8-pin DIP) | drawable-only | dip-gen | `slug` |
| 91 | `lm339` | Quad Comparator LM339 / Komparator LM339 | (14-pin DIP) | drawable-only | dip-gen | `slug` |
| 92 | `optocoupler` | Optocoupler 4N35 / Optokoppler 4N35 | anode, cathode, emitter, collector | drawable-only | done | `slug` |

## MCU Boards (7 kinds + 1 declined)

| # | Kind slug | Name EN / DE | Engine | Art | Confidence |
|---|-----------|-------------|--------|-----|------------|
| 93 | `arduino_uno` | Arduino Uno R3 / Arduino Uno R3 | modeled (avr8js) | done | `standard`: ATmega328P (also covers ATmega168P — pin-compatible) |
| 94 | `arduino_nano` | Arduino Nano / Arduino Nano | modeled (avr8js) | done | `standard`: ATmega328P (also covers ATmega168P — pin-compatible) |
| 95 | `attiny85` | ATtiny85 / ATtiny85 | modeled (avr8js, a7fef9a) | done | `verified`: ATtiny85 DIP-8 (DS40001941C) |
| 96 | `microbit` | micro:bit V2 / micro:bit V2 | drawable-only | done | `verified`: V2 (nRF52833) |
| 97 | `stc_mcu` | STC12/STC15 MCU / STC-MCU | modeled (emu8051) | dip-gen | unique to bw |
| 98 | `pi_pico` | Raspberry Pi Pico / Raspberry Pi Pico | modeled (rp2040js) | done | `standard`: RP2040 |
| 99 | `arduino_mega` | Arduino Mega 2560 / Arduino Mega 2560 | drawable-only | done | `verified`: ATmega2560 (DS40002211A) |
| — | ~~`esp8266`~~ | ~~ESP8266 WiFi~~ | **declined** | — | WiFi simulation out of scope |

## Instruments (4 kinds)

Instruments are netlist parts with UI — they need art and catalogue entries
like any other part (per bw-board ruling f5250e1).

| # | Kind slug | Name EN / DE | Terminals | Engine | Art |
|---|-----------|-------------|-----------|--------|-----|
| 100 | `multimeter` | Multimeter / Multimeter | probe_a, probe_b | modeled | done |
| 101 | `power_supply` | Power Supply / Netzteil | pos, neg | modeled | done |
| 102 | `function_gen` | Function Generator / Funktionsgenerator | out, gnd | modeled | done |
| 103 | `oscilloscope` | Oscilloscope / Oszilloskop | ch1, ch2, gnd | modeled | done |

> `power_supply` is `vsource` with a settable V/I-limit. The existing
> `vsource` art covers it; the slug alias will be resolved in bw-board.

## Boards / Connectors (7 kinds)

| # | Kind slug | Name EN / DE | Engine | Art |
|---|-----------|-------------|--------|-----|
| 104 | `breadboard_full` | Breadboard Standard / Steckbrett | drawable-only | done |
| 105 | `breadboard_half` | Breadboard Small / Steckbrett Klein | drawable-only | done |
| 106 | `breadboard_mini` | Breadboard Mini / Steckbrett Mini | drawable-only | done |
| 107 | `header` | 8-Pin Header / 8-Pin-Stiftleiste | drawable-only | done |
| 108 | `usb_a` | USB-A Connector / USB-A-Stecker | drawable-only | done |
| 109 | `microbit_breakout` | micro:bit with Breakout / micro:bit mit Breakout | drawable-only | done |
| 110 | `pololu_motor_ctrl` | Pololu Motor Controller / Pololu-Motorsteuerung | drawable-only | done |

## Retro Tier (13 kinds)

Parts for hand-wired retro breadboard builds (6502, Z80, 6507 SBC). All pin
tables datasheet-audited against manufacturer documents (cited in
sidecars). 62256/28C256/74HC00 are shared across both presets.

| # | Kind slug | Name | Pins | Datasheet | Art |
|---|-----------|------|------|-----------|-----|
| 111 | `w65c02` | W65C02S CPU | 40 | WDC W65C02S (rev 2018-10-08) | done |
| 112 | `w65c22` | W65C22S VIA | 40 | WDC W65C22S (rev 2018-10-08) | done |
| 113 | `w65c51` | W65C51N ACIA | 28 | WDC W65C51N (rev 2018-10-08) | done |
| 114 | `28c256` | AT28C256 EEPROM | 28 | Microchip AT28C256 (doc 0006) | done |
| 115 | `62256` | 62256 SRAM | 28 | Alliance AS6C62256 (rev 2.0) | done |
| 116 | `z80` | Z80 CPU | 40 | Zilog Z80 PS0178 (rev 06) | done |
| 117 | `mc6850` | MC6850 ACIA | 24 | Motorola DS9493 (rev 4) | done |
| 118 | `r6507` | R6507 CPU (28-pin 6502) | 28 | Rockwell R6507 | done |
| 119 | `mos6532` | MOS 6532 RIOT | 40 | MOS Technology 6532 | done |
| 120 | `74c922` | 74C922 Keypad Encoder | 18 | National Semi / TI 74C922 | done |
| 121 | `74hc374` | 74HC374 Octal D Flip-Flop | 20 | TI 74HC374 (SCLS125) | done |
| 122 | `74hc688` | 74HC688 8-Bit Comparator | 20 | TI 74HC688 (SCLS252) | done |
| 123 | `ns16c550` | NS16C550 UART | 40 | TI PC16550D (SNLS378F) | done |

> 28C256 and 62256 are pin-compatible (same DIP-28 pinout). Pin 20
> is CEB on the EEPROM, CSB on the SRAM — both active low.
> Z80 address and data pins are NOT in sequential pin order on the
> DIP-40 — this matches the physical chip (A11 at pin 1, D4 at pin 7).
> R6507 is the 28-pin NMOS variant of the 6502 — only A0-A12, no
> IRQ/NMI/SYNC pins. Used in the Atari 2600. PHI2 sits between D4
> and D5 (pin 21), matching the Rockwell datasheet.
> MOS 6532 RIOT: 128B RAM + 2x 8-bit I/O + timer. RSB = reset
> active low, CS2B = chip-select 2 active low, IRQB = interrupt
> active low. RS (pin 32) selects RAM vs I/O registers.
> NS16C550: Intel bus mode adopted (WRB/RDB active-low strobes);
> CSB = /CS2 per uniform memory-select naming; IRQ is active HIGH
> (no b suffix). Modem lines all active-low with b suffix.
> 74HC132 pinout identical to 74HC00 — extractors alias to NAND;
> separate DIP for Wilson-primer builds to wire the real part number.
> 74C922 data outputs use datasheet letters: a=D0(LSB), b=D1,
> c=D2, d=D3(MSB); DA = data available (active high).

## Engine-only parts (not in reference library)

Modeled in bw-board, useful, not in the Tinkercad library. Kept as extras.

| # | Kind slug | Notes | Art |
|---|-----------|-------|-----|
| 124 | `switch` | SPST toggle (engine has it alongside slide_switch) | done |
| 125 | `ntc` | NTC thermistor (engine models it; TMP36 is analog alternative) | done |
| 126 | `eeprom` | I2C EEPROM (24LC256-class) | done |
| 127 | `temp_sensor` | DS18B20 1-wire temp sensor (different from TMP36) | done |
| 128 | `led_matrix` | 8x8 LED matrix (standalone, no MAX7219) | done |
| 129 | `led_cube` | LED cube (unique to bw) | done |
| 130 | `mcu` | Generic MCU (base for arch-specific boards) | done |
| 131 | `vcc` | VCC supply rail | done |
| 132 | `gnd` | Ground reference | done |
| 133 | `vsource` | Ideal voltage source | done |
| 134 | `isource` | Ideal current source | done |
| 135 | `fuse` | Fuse (glass cartridge) | done |
| 136 | `solenoid` | Solenoid (electromagnetic actuator) | done |
| 137 | `stepper` | Stepper motor (4-wire bipolar) | done |
| 138 | `ir_transmitter` | IR LED transmitter | done |

---

## Summary

| | Kinds | With art |
|---|---|---|
| Reference library match | 107 | 107 |
| Multi-arch boards | 3 | 3 |
| Retro tier | 13 | 13 |
| Engine-only extras | 15 | 15 |
| Declined | 1 | — |
| **Total** | **138 + 1 declined** | **138** |

### Art status: complete

All 138 parts have SVG art and JSON terminal sidecars (breadboard is catalog-only). No pending items.

### Pin tables (datasheet-audited)

| Part | IC | Pin table | Datasheet |
|---|---|---|---|
| Arduino Uno R3 / Nano | ATmega328P | `docs/pin-table-atmega328p.md` | Microchip DS40002061B |
| Arduino Mega 2560 | ATmega2560 | (sidecar `_note`) | Microchip DS40002211A |
| ATtiny85 | ATtiny85 | (sidecar `_note`) | Microchip DS40001941C |
| Raspberry Pi Pico | RP2040 | `docs/pin-table-rp2040.md` | Raspberry Pi RP2040 (2023-03-02) |
| STC12C5A60S2 | 8051-core | `stc/docs/PINOUT.md` (cross-repo) | STC MCU Limited rev 2011-07-15 |
| W65C02 CPU | W65C02S | (sidecar `_note`) | WDC W65C02S (rev 2018-10-08) |
| W65C22 VIA | W65C22S | (sidecar `_note`) | WDC W65C22S (rev 2018-10-08) |
| W65C51 ACIA | W65C51N | (sidecar `_note`) | WDC W65C51N (rev 2018-10-08) |
| 28C256 EEPROM | AT28C256 | (sidecar `_note`) | Microchip AT28C256 (doc 0006) |
| 62256 SRAM | AS6C62256 | (sidecar `_note`) | Alliance AS6C62256 (rev 2.0) |
| 74HC00 NAND | SN74HC00N | (sidecar `_note`) | TI SN74HC00N (SCLS024I) |
| Z80 CPU | Z80 | (sidecar `_note`) | Zilog Z80 PS0178 (rev 06) |
| MC6850 ACIA | MC6850 | (sidecar `_note`) | Motorola DS9493 (rev 4) |
