# Parts Catalog — bw-circuit-designer

> **This is the single canonical parts list for the circuit designer.**
> bw-board owns engine kind names; this file owns everything else:
> catalogue entry, slug, art, variants, identification confidence.
> Chip designations (74HC08, TMP36, L293D, etc.) are manufacturer names.
>
> **Last updated:** 2026-08-19 — 246 parts. Session 8: matrix reconciliation,
> A2 device parts, footprint audit (35 fixes), sensor long-tail batch,
> vl53l0x ToF ranger, ELECFREAKS micro:bit arcade shield.

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
| 9 | `slide_switch` | Slide Switch / Schiebeschalter | a, com, b | modeled | done | |
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
| 88 | `556` | 556 Dual Timer (NE556) / 556-Doppeltimer | (14-pin DIP) | modeled | dip-gen | `slug` |
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

## Tier 2 — Engine-modeled additions (9 kinds)

Parts with full engine models on bw-board master, added beyond the reference
library. All pin tables audited against manufacturer datasheets (cited in
sidecars).

| # | Kind slug | Name | Pins | Datasheet | Art |
|---|-----------|------|------|-----------|-----|
| 139 | `ds1302` | DS1302 RTC | 8 (5 modeled + x1/x2/vcc1 artwork) | Maxim DS1302 (19-5207 rev 4) | done |
| 140 | `ds18b20` | DS18B20 1-Wire Thermometer | 3 | Maxim DS18B20 (19-7487 rev 6) | done |
| 141 | `at24c02` | AT24C02 I2C EEPROM | 8 (4 modeled + a0/a1/a2/wp artwork) | Microchip AT24C02 (DS20005202) | done |
| 142 | `xpt2046` | XPT2046 Touch Controller Module | 10 | Xptek XPT2046 | done |
| 143 | `ky040` | KY-040 Rotary Encoder Module | 5 | — (module spec) | done |
| 144 | `74hc165` | 74HC165 8-Bit Par-In Shift Reg | 16 | TI SN74HC165 (SCLS195) | done |
| 145 | `st7920` | ST7920 128x64 Graphic LCD Module | 6 serial | Sitronix ST7920 (v3.3) | done |
| 146 | `74hc138` | 74HC138 3-to-8 Decoder | 16 | TI SN74HC138 (SCLS093) | done |
| 147 | `74hc245` | 74HC245 Octal Bus Transceiver | 20 | TI SN74HC245 (SCLS132) | done |

> DS1302/AT24C02 DIP-8: artwork-only pins (x1/x2/vcc1 and a0/a1/a2/wp
> respectively) are in the sidecar terminal list for correct breadboard
> footprint placement but are not wired by the engine model.
> DS18B20 (`ds18b20`) is a separate kind from `temp_sensor` (#127) — the
> engine model uses 1-Wire protocol with device serial, vs the generic
> analog temperature sensor.
> ST7920: PSB pin shown on artwork strapped to GND (serial mode); not
> in the terminal list as the engine assumes serial-only operation.

## Bench Instruments — Engine-modeled (4 kinds)

Dedicated bench measurement instruments with live-state display. SVGs are
static palette thumbnails; bw-circuit-ui renders live readings/needle/lamp
via `getDeviceState` in JSX (same pattern as meter/oscilloscope).

| # | Kind slug | Name | Terminals | State fields | Art |
|---|-----------|------|-----------|-------------|-----|
| 148 | `voltmeter` | Bench Voltmeter | a (+), b (-) | value, unit | done |
| 149 | `ammeter` | Bench Ammeter (series) | a (+), b (-) | value, unit | done |
| 150 | `analog_meter` | Analog Panel Meter | a (+), b (-) | state.deflection (0..1), params.fullScale | done |
| 151 | `logic_probe` | Logic Probe | vcc, gnd, tip | state.level (high/low/float), state.pulsing | done |

> Engine source: bench-meters.js. Voltmeter and analog_meter are parallel
> instruments; ammeter is a series instrument (internal shunt). Logic probe
> needs VCC/GND power plus a tip contact.
> Live state rendering is a bw-circuit-ui responsibility — these SVGs show
> static representative values as palette thumbnails only.

## Sensors & Modules — Session 3+ additions (15 kinds)

Engine-modeled sensor modules from bw-board kit-sensors.js and thirtyseven.js.
Terminal names match engine kind tables exactly.

| # | Kind slug | Name | Terminals | Engine source | Art |
|---|-----------|------|-----------|---------------|-----|
| 152 | `dht11` | DHT11 Temp/Humidity | vcc, data, gnd | kit-sensors.js | done |
| 153 | `joystick` | Dual-Axis Joystick Module | vcc, gnd, vrx, vry, sw | kit-sensors.js | done |
| 154 | `ds3231` | DS3231 RTC Module | vcc, gnd, sda, scl | rtc-display.js | done |
| 155 | `max7219` | MAX7219 8x8 LED Matrix Module | vcc, gnd, din, clk, cs, dout | rtc-display.js | done |
| 156 | `hall_analog` | Hall Effect Analog Sensor | vcc, gnd, ao, do | thirtyseven.js | done |
| 157 | `hall_digital` | Hall Effect Digital Sensor | vcc, gnd, do | thirtyseven.js | done |
| 158 | `reed_switch` | Reed Switch | a, b | thirtyseven.js | done |
| 159 | `touch_ttp223` | TTP223 Capacitive Touch Sensor | vcc, gnd, do | thirtyseven.js | done |
| 160 | `photo_interrupter` | Photo Interrupter (Slot Opto) | vcc, gnd, do | thirtyseven.js | done |
| 161 | `flame_sensor` | Flame Sensor Module | vcc, gnd, ao, do | thirtyseven.js | done |
| 162 | `ir_reflect` | IR Reflective Sensor | vcc, gnd, do | thirtyseven.js | done |
| 163 | `sound_module` | Sound Sensor Module | vcc, gnd, ao, do | thirtyseven.js | done |
| 164 | `heartbeat` | Heartbeat / Pulse Sensor | vcc, gnd, ao | thirtyseven.js | done |
| 165 | `led_7color` | 7-Color Auto-Cycling LED | a, k | thirtyseven.js | done |
| 166 | `mpu6050` | MPU-6050 IMU (GY-521 Module) | vcc, gnd, sda, scl, ad0, int | mpu6050.js | done |

> 37-in-1 kit modules (hall_analog through led_7color) use the small
> blue-PCB breakout style. reed_switch and led_7color are 2-terminal
> discrete components, not modules.
> mpu6050 is drawn as the GY-521 breakout module face, not the bare QFN.

## Audio & I2C — Session 3+ additions (5 kinds)

Audio ICs from audio-parts.js and I2C display from ssd1306.js.

| # | Kind slug | Name | Terminals | Engine source | Art |
|---|-----------|------|-----------|---------------|-----|
| 167 | `um66t` | UM66T Melody Generator | vdd, gnd, out | audio-parts.js | done |
| 168 | `kd9561` | KD9561 4-Sound Effect IC | vdd, gnd, out, sel1, sel2 | audio-parts.js | done |
| 169 | `isd1820` | ISD1820 Voice Record/Playback | vcc, gnd, rec, playe, playl, mic, sp_p, sp_n | audio-parts.js | done |
| 170 | `ssd1306` | SSD1306 128x64 OLED Module | vcc, gnd, sda, scl | ssd1306.js | done |
| 171 | `ili9341` | ILI9341 2.4" TFT (SPI Module) | vcc, gnd, cs, rst, dc, mosi, sck, miso, led | ili9341.js | done |

> um66t and kd9561 are TO-92 / DIP-style packages (no module PCB).
> kd9561 has DIP layout with straddlesGutter footprint.
> isd1820 is an 8-pin red-PCB module with electret mic and speaker terminals.
> ssd1306: framebuffer-driven (fb Uint8Array 1024, displayOn, inverted).
> ili9341: 9-pin SPI header, engine-registered kind with exact terminal match.

## Video & Retro — Session 3+ additions (5 kinds)

Video display processors and card modules for retro breadboard builds.

| # | Kind slug | Name | Pins | Datasheet | Art |
|---|-----------|------|------|-----------|-----|
| 172 | `tms9918` | TMS9918A Video Display Processor | 40 | TI SPPS017 | done |
| 173 | `mc6845` | MC6845 CRT Controller | 40 | Motorola DS9563 | done |
| 174 | `simplevga_card` | SimpleVGA6502 Card | 3 (vcc, gnd, bus) | — (gfoot, Unlicense) | done |
| 175 | `vga_prop_card` | VGA Propeller Tile Card | 3 (vcc, gnd, bus) | — (card module) | done |
| 176 | `ili9341_parallel` | ILI9341 TFT (8080 Parallel) | 16 | ILI9341 datasheet | done |
| 177 | `tilevga` | TileVGA Card (rene6502) | 3 (vcc, gnd, bus) | — (machine chip) | done |

> tilevga: rene6502/6502-vga-prop (public domain). P8X32A Propeller
> driving 320x240 VGA, 40x30 tiles, 16-of-64 colors. 16K dual-port
> VRAM window. System font: funscii (public domain, Wuerfel21).
> Machine-level chip (kind 'tilevga' in m6502-machine.js).
> tms9918: CPU bus d0-d7, VRAM pins (ad0-ad7, rd0-rd7) are decorative —
> the machine owns VRAM. Pin 1 and 40 are NC on TMS9918A (were VBB/VCC
> +12V on the original TMS9918).
> mc6845: Motorola pinout. MA0-MA13 memory address, RA0-RA4 row address,
> D0-D7 CPU data bus. Control via E/R̄W̄/C̄S̄/RS. VSS=pin 1, VDD=pin 20.
> simplevga_card and vga_prop_card are machine-level card faces with
> placeholder bus terminal — art is what matters.
> ili9341_parallel: 16-pin 8080-style header (WR#, RD#, D0-D7), distinct
> from the 9-pin SPI module (ili9341).

## Engine-kind gap closure (session 5) — 34 kinds

All bw-board `registerDevice()` kinds that previously lacked sidecars.
Terminal names match the engine exactly.

| # | Kind slug | Name | Terminals | Art |
|---|-----------|------|-----------|-----|
| 178 | `piezo` | Piezoelectric element | a, b | done |
| 179 | `tilt_sensor` | Tilt sensor (ball switch) | a, b | done |
| 180 | `phototransistor` | Phototransistor | collector, emitter | done |
| 181 | `solar_cell` | Solar cell | pos, neg | done |
| 182 | `vreg` | Generic voltage regulator | in, out, gnd | done |
| 183 | `ambient_light` | Ambient light sensor | vcc, out, gnd | done |
| 184 | `rf433_tx` | RF 433MHz transmitter | vcc, gnd, data | done |
| 185 | `rf433_rx` | RF 433MHz receiver | vcc, gnd, data | done |
| 186 | `spectrum_display` | Spectrum analyzer display | vcc, gnd | done |
| 187 | `hx711` | HX711 load cell ADC | vcc, gnd, dout, sck | done |
| 188 | `ze08_ch2o` | ZE08-CH2O formaldehyde sensor | vcc, gnd, tx, rx | done |
| 189 | `usb_a` | USB Type-A connector | vbus, dm, dp, gnd | done |
| 190 | `dfplayer_mini` | DFPlayer Mini MP3 module | vcc, gnd, rx, tx, busy | done |
| 191 | `msgeq7` | MSGEQ7 graphic EQ filter | vcc, gnd, strobe, reset, out | done |
| 192 | `dff` | D flip-flop (single) | d, clk, set, rst, q, q_bar | done |
| 193 | `hc05` | HC-05 Bluetooth module | vcc, gnd, rxd, txd, key, state | done |
| 194 | `jkff` | JK flip-flop (single) | j, k, clk, set, rst, q, q_bar | done |
| 195 | `dip_switch` | DIP switch 4-position | s0_a/b, s1_a/b, s2_a/b, s3_a/b | done |
| 196 | `tcs3200` | TCS3200 color sensor | vcc, gnd, s0-s3, oe, out | done |
| 197 | `nrf24l01` | nRF24L01 2.4GHz wireless | vcc, gnd, ce, csn, sck, mosi, miso, irq | done |
| 198 | `lm393` | LM393 dual comparator | 1_pos/neg/out, 2_pos/neg/out, vcc, gnd | done |
| 199 | `lm339` | LM339 quad comparator | 1-4_pos/neg/out, vcc, gnd | done |
| 200 | `lm358` | LM358 dual op-amp | vcc, gnd, 1_pos/neg/out, 2_pos/neg/out | done |
| 201 | `level_shifter4` | 4-ch level shifter | lv, hv, gnd, lv1-lv4, hv1-hv4 | done |
| 202 | `h_bridge` | L293D H-bridge motor driver | vcc, gnd, en1/2, in1-in4, out1-out4 | done |
| 203 | `decade_counter` | CD4017 decade counter | clk, rst, en, q0-q9, co | done |
| 204 | `timer_556` | Dual 555 timer (556) | 1/2_trigger/threshold/control/discharge/output/reset, vcc, gnd | done |
| 205 | `lm3915` | LM3915 dot/bar driver | vcc, gnd, sig, mode, l1-l10 | done |
| 206 | `darlington_driver` | ULN2003/2803 Darlington array | in0-in7, out0-out7, com, gnd | done |
| 207 | `bargraph` | 10-segment LED bargraph | a0/k0 through a9/k9 | done |
| 208 | `matrix8x8` | 8x8 LED matrix (bare) | col0-col7, row0-row7 | done |
| 209 | `mcp3008` | MCP3008 8-ch SPI ADC | vcc, gnd, vref, csb, clk, din, dout, ch0-ch7 | done |
| 210 | `cd74hc4067` | CD74HC4067 16-ch analog mux | vcc, gnd, s0-s3, eb, z, c0-c15 | done |
| 211 | `ili9341_par` | ILI9341 TFT (8080 parallel, engine names) | vcc, gnd, cs, rst, rs, wr, rd, d0-d7, led | done |
| 212 | `adxl335` | ADXL335 3-axis accelerometer | vcc, gnd, xout, yout, zout, st | done |
| 213 | `memsic2125` | Memsic MX2125 2-axis accelerometer | vcc, gnd, xout, yout | done |
| 214 | `attiny88` | ATtiny88 MCU (DIP-28) | PB0-7, PC0-7, PD0-7, PA0-3, VCC, GND, AVCC | done |
| — | `battery` | Generic battery (alias) | pos, neg | done |
| — | `timer_555` | Timer 555 (engine alias of 555) | (same as 555) | done |
| — | `hd44780` | HD44780 LCD (datasheet names, alias of char_lcd) | vss, vdd, v0, rs, rw, e, d0-d7, a, k | done |
| — | `eater6502` | Ben Eater 6502 (board preset) | via1.pa0-pa7, via1.pb0-pb7, 5v, gnd | done |

> Engine aliases with matching sidecars:
> - `battery` (pos/neg): generic base for battery_9v/aa/coin
> - `timer_555`: engine alias of 555 with identical terminals
> - `hd44780`: datasheet terminal names (vss/vdd/v0/a/k), same
>   silicon as char_lcd (house names vcc/gnd/vo/bl_a/bl_k)
> - `ili9341_par`: engine-canonical terminals (rs/wr/rd), distinct
>   from the old ili9341_parallel sidecar (dc/wrb/rdb)
> - `eater6502`: board preset (via1.pa0-pa7, via1.pb0-pb7, 5v, gnd)

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

## Session 6–7 additions (17 kinds)

Parts from the KNOWN_GAPS burn-down, z80-extract glue visibility,
PainfulDiodes bench, and German kit canon.

| # | Kind slug | Name | Pins | Engine | Art |
|---|-----------|------|------|--------|-----|
| 215 | `74hc244` | 74HC244 Octal Buffer | 20 | modeled | done |
| 216 | `74ls32` | 74LS32 Quad OR (TTL) | 14 | modeled | done |
| 217 | `74ls04` | 74LS04 Hex Inverter (TTL) | 14 | modeled | done |
| 218 | `um245r` | UM245R USB FIFO Module | 15 | modeled | done |
| 219 | `dht22` | DHT22 / AM2302 Temp+Humidity | 3 | modeled | done |
| 220 | `tm1637` | TM1637 Clock Display Controller | 4 | drawable-only | done |
| 221 | `ky002` | KY-002 Vibration Sensor | 2 | drawable-only | done |
| 222 | `matrix16x8` | LED Matrix 16×8 | 24 | modeled | done |
| 223 | `matrix9x9` | LED Matrix 9×9 | 18 | modeled | done |
| 224 | `seven_seg_3` | 3-Digit 7-Segment (056SMG) | 11 | modeled | done |
| 225 | `mcp4725` | MCP4725 I²C DAC | 6 | modeled | done |
| 226 | `attiny2313` | ATtiny2313 MCU (DIP-20) | 20 | drawable-only | done |
| 227 | `attiny13` | ATtiny13 MCU (DIP-8) | 8 | drawable-only | done |
| 228 | `74ls107` | 74LS107 Dual JK-FF | 14 | modeled | done |
| 229 | `74ls157` | 74LS157 Quad 2-Mux | 16 | modeled | done |
| 230 | `74ls161` | 74LS161 4-Bit Counter | 16 | modeled | done |
| 231 | `74ls173` | 74LS173 Quad D Reg | 16 | modeled | done |

> 74HC244/74LS32/74LS04: z80-extract.js sees these as address-decode glue
> (OR, NOT, buffer gates) — chip-select nets routed through them are no
> longer undriven.
> UM245R: FTDI USB-parallel-FIFO (PainfulDiodes §8). Dual FIFOs (128 rx /
> 384 tx). THE TRAP: empty FIFO repeats last byte, not zero.
> seven_seg_3: engine composite (24 synthetic LEDs, multiplexed segments +
> 3 commons). seven_segment sidecar also fixed: was a 2-terminal stub,
> now has all 9 terminals (a–g, dp, common).
> 74LS series: SAP-1 computer chips from bw-board sap1-chips.js.

## Session 8 additions (15 kinds)

Parts found by reconciling the completeness matrix past 231: sidecars that
existed without catalog rows, plus new engine kinds that lacked sidecars.

| # | Kind slug | Name | Pins | Engine | Art |
|---|-----------|------|------|--------|-----|
| 232 | `cd4093` | CD4093 Quad Schmitt NAND | 14 | modeled | dip-gen |
| 233 | `74ls189` | 74LS189 16x4-Bit RAM | 16 | modeled | dip-gen |
| 234 | `at89c2051` | AT89C2051 8051-core MCU | 20 | **blocked** (emu8051) | dip-gen |
| 235 | `stc15_mcu` | STC15 MCU (DIP-40) | 40 | **blocked** (emu8051) | dip-gen |
| 236 | `at24c64` | AT24C64 I2C EEPROM (64 Kbit) | 8 | modeled | done |
| 237 | `ps2` | PS/2 Keyboard Interface | 9 | modeled | done |
| 238 | `seven_seg_8` | 8-Digit 7-Segment Display (2x4) | 16 | drawable-only | done |
| 239 | `ledbank8` | 8-LED Bank (port-driven) | 10 | drawable-only | done |
| 240 | `bmp280` | BMP280 Pressure/Temp Sensor | 6 | drawable-only | done |
| 241 | `tcs34725` | TCS34725 RGB Color Sensor | 5 | drawable-only | done |
| 242 | `max6675` | MAX6675 Thermocouple Converter | 5 | drawable-only | done |
| 243 | `ina219` | INA219 Current/Power Monitor | 6 | drawable-only | done |
| 244 | `ads1115` | ADS1115 16-bit 4-ch ADC | 10 | drawable-only | done |
| 245 | `vl53l0x` | VL53L0X ToF Laser Ranger | 6 | drawable-only | done |
| 246 | `microbit_arcade` | ELECFREAKS micro:bit Arcade Shield | 14 | drawable-only | done |

> cd4093: CMOS quad Schmitt-trigger NAND (TI CD4093B SCHS053). Same DIP-14
> pinout as 74HC00/74HC132. Used in Wilson-primer SBC address decode with
> hysteresis. Engine: chip-composer.js schmitt_nand gates.
> 74ls189: 16x4-bit static RAM with INVERTED outputs (TI SN74LS189 SDLS135).
> DIP-16. THE CLASSIC TRAP: outputs are active-low. SAP-1 computer RAM.
> at89c2051: Atmel 8051-core MCU (doc0368). DIP-20, 2 KB flash, 128 B RAM.
> Engine registration exists in bw-circuit-ui palette but emu8051 adapter
> config not yet wired — stays blocked.
> stc15_mcu: STC15 series MCU, DIP-40 variant. Sidecar pin table from
> PINOUT-STC15.md. Engine blocked on emu8051 adapter config (same as AT89C2051).
> at24c64: Pin-compatible with AT24C02 (same DIP-8 pinout). Engine model
> in board-ics.js: 8 KB, 32-byte pages, I2C 0b1010|A2A1A0. Used by
> blinkenrocket pendant build.
> ps2: Machine-side peripheral — data flows through PS2Capture + ps2OnVia,
> not the MNA. Terminals (d0-d7, da) are for wiring display only. Wires to
> VIA PA0-PA7 + CA1 (6502) or 74HC245 buffer (Z80). Engine: ps2-device.js.
> seven_seg_8: 8-digit common-cathode 7-segment display in 2x4 layout
> (top row com0-com3, bottom row com4-com7). Shared segment bus (a-g, dp)
> + 8 digit-select commons. Same multiplexing pattern as seven_seg_3 but
> with 8 digits. 16 terminals total. Prechin console display.
> ledbank8: 8 discrete LEDs in a row, port-driven with active-low option.
> d0-d7 map to port bits, vcc + gnd for power. On A2: shares P2 with
> 7-seg digit select (documented conflict, compile WARNING). 10 terminals.
> keypad_4x4 fix: sidecar was missing c3 (7 of 8 terminals) and had no
> footprint — now 8 terminals (r0-r3, c0-c3) with footprint.
> bmp280: Bosch I2C barometric pressure + temperature sensor. 6-pin breakout
> (vcc, gnd, sda, scl, csb, sdo). BME280 pin-compatible. 300-1100 hPa.
> tcs34725: ams/TAOS I2C RGB color sensor. 5-pin breakout with white LED
> illumination enable. Reports RGBC 16-bit counts. Fixed addr 0x29.
> max6675: Maxim SPI thermocouple-to-digital converter. 5-pin breakout.
> 12-bit, 0-1024C in 0.25C steps. Read-only — no write registers.
> ina219: TI I2C high-side current/power monitor. 6-pin breakout with
> onboard 0.1 ohm shunt. Bus voltage 0-26V, 12-bit ADC. Default 0x40.
> ads1115: TI 16-bit 4-channel I2C ADC. 10-pin breakout. Programmable
> gain, 8-860 SPS. Single-ended (4 ch) or differential (2 ch).
> vl53l0x: STMicroelectronics I2C time-of-flight laser ranger. 6-pin
> breakout (vcc, gnd, sda, scl, xshut, gpio1). 940 nm VCSEL, 30-2000 mm.
> XSHUT for multi-sensor address assignment, GPIO1 interrupt.
> microbit_arcade: ELECFREAKS micro:bit Arcade Shield (Retro Programming
> Arcade). Composite: 160x128 TFT (ST7735, SPI), D-pad, A/B buttons,
> reset. micro:bit V2 plugs into edge connector. 14 logical terminals.
> Runs MakeCode Arcade (all MIT). The shield is a game console, not a
> bare sensor — drawn as a handheld face with display + controls.

---

## Gap ledger

Gaps tracked against the completeness matrix (`scripts/part-matrix.mjs`
in bw-circuit-ui). Each gap has an owner or a stated reason.

| Gap | Dependency | Owner |
|-----|-----------|-------|
| ~~max7219 BoardCanvas face~~ | **resolved** (7e6d57d) | bw-circuit-ui |
| AT89C2051 + STC15 emulation | needs emu8051 adapter config | emu8051-stc |
| attiny2313/attiny13 emulation | needs avr8js device config | bw-board |
| at24c64/ps2 palette + face + footprint | sidecars created, UI integration pending | bw-circuit-ui |
| 43 palette kinds without custom faces | needs SvgParts cases | bw-circuit-ui |
| DE BOM labels | i18n for all KIND_LABELS | bw-circuit-ui |
| ~155 sidecar-only kinds not in palette | catalog parts, not user-placeable | — (by design) |

---

## Summary

| | Kinds | With art |
|---|---|---|
| Reference library match | 107 | 107 |
| Multi-arch boards | 3 | 3 |
| Retro tier | 13 | 13 |
| Tier 2 additions | 9 | 9 |
| Bench instruments | 4 | 4 |
| Sensors & modules (session 3+) | 15 | 15 |
| Audio & I2C (session 3+) | 5 | 5 |
| Video & retro (session 3+) | 6 | 6 |
| Engine-kind gap closure (session 5) | 37 | 37 |
| Engine-only extras | 15 | 15 |
| Session 6–7 additions | 17 | 17 |
| Session 8 additions | 15 | 15 |
| Declined | 1 | — |
| **Total** | **246 + 1 declined** | **246** |

### Art status

All 246 cataloged parts have SVG art and JSON terminal sidecars. The
completeness matrix (`scripts/part-matrix.mjs` in bw-circuit-ui) tracks
247 total registered kinds — the delta includes reference-only sidecars
(sensor variants, board presets, aliases) that are not user-placeable
catalog entries, plus UI aliases (keypad, meter, shift_register, etc.).

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
| TMS9918A VDP | TMS9918A | (sidecar `_note`) | TI SPPS017 |
| MC6845 CRTC | MC6845 | (sidecar `_note`) | Motorola DS9563 |
