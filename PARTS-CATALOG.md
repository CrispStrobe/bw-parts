# Parts Catalog — bw-circuit-designer

> Canonical inventory of every part the circuit designer will offer.
> bw-board picks engine work from this list; the UI palette renders from its metadata.
>
> **Last updated:** 2026-08-09

## Legend

| Column | Meaning |
|--------|---------|
| **Kind slug** | Identifier used in netlists and code |
| **Name EN / DE** | Display name for the palette |
| **Category** | Grouping in the part picker |
| **Terminals** | Pin/leg names (composite parts: variable) |
| **Key params** | User-settable parameters |
| **Engine** | `modeled` = in bw-board solver, `registry-candidate` = plugin interface exists but model not yet registered, `drawable-only` = art/palette only, no simulation |
| **Art** | `done` = SVG committed here, `pending` = not yet drawn |

---

## Tier 1 — Already modeled in bw-board (39 parts)

Parts with working engine models. These are the simulation backbone.

### Power & Sources

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 1 | `vcc` | VCC Supply | VCC-Versorgung | Power | vcc | voltage | modeled | done |
| 2 | `gnd` | Ground | Masse | Power | gnd | — | modeled | done |
| 3 | `vsource` | Voltage Source | Spannungsquelle | Power | pos, neg | voltage, waveform | modeled | done |
| 4 | `isource` | Current Source | Stromquelle | Power | pos, neg | amps, waveform | modeled | done |

### Passives

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 5 | `resistor` | Resistor | Widerstand | Passives | a, b | ohms | modeled | done |
| 6 | `capacitor` | Capacitor | Kondensator | Passives | a, b | farads | modeled | done |
| 7 | `inductor` | Inductor | Spule | Passives | a, b | henrys | modeled | done |
| 8 | `potentiometer` | Potentiometer | Potentiometer | Passives | a, b, wiper | ohms, position | modeled | done |

### Diodes & LEDs

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 9 | `diode` | Diode | Diode | Diodes | anode, cathode | vf | modeled | done |
| 10 | `led` | LED | LED | Diodes | anode, cathode | vf, color | modeled | done |
| 11 | `zener` | Zener Diode | Zener-Diode | Diodes | anode, cathode | vf, vz | modeled | done |
| 12 | `rgb_led` | RGB LED | RGB-LED | Diodes | r_anode, g_anode, b_anode, cathode | vf_r, vf_g, vf_b | modeled | done |

### Transistors

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 13 | `npn` | NPN Transistor | NPN-Transistor | Transistors | base, collector, emitter | beta, vbe | modeled | done |
| 14 | `pnp` | PNP Transistor | PNP-Transistor | Transistors | base, collector, emitter | beta, vbe | modeled | done |
| 15 | `nmos` | N-Channel MOSFET | N-Kanal MOSFET | Transistors | gate, drain, source | vth | modeled | done |
| 16 | `pmos` | P-Channel MOSFET | P-Kanal MOSFET | Transistors | gate, drain, source | vth | modeled | done |

### Analog ICs

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 17 | `opamp` | Op-Amp | Operationsverstaerker | Analog ICs | inp, inn, out | gain | modeled | done |

### Switches & Input

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 18 | `button` | Push Button | Taster | Input | a, b | — | modeled | done |
| 19 | `switch` | Toggle Switch | Schalter | Input | a, b | — | modeled | done |

### Sensors

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 20 | `ldr` | Photoresistor (LDR) | Fotowiderstand (LDR) | Sensors | a, b | rDark, rLight | modeled | done |
| 21 | `ntc` | NTC Thermistor | NTC-Thermistor | Sensors | a, b | rCold, rHot | modeled | done |
| 22 | `ir_receiver` | IR Receiver | IR-Empfaenger | Sensors | vcc, gnd, out | — | modeled | done |
| 23 | `temp_sensor` | Temperature Sensor | Temperatursensor | Sensors | vcc, gnd, dq | — | modeled | done |

### Outputs

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 24 | `buzzer` | Piezo Buzzer | Piezo-Summer | Outputs | a, b | — | modeled | done |

### Displays

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 25 | `seven_segment` | 7-Segment Display | 7-Segment-Anzeige | Displays | (composite) | digits | modeled | done |
| 26 | `char_lcd` | Character LCD 16x2 | Zeichen-LCD 16x2 | Displays | rs, rw, e, d0-d7, vcc, gnd, vo, bl_a, bl_k | rows, cols | modeled | done |
| 27 | `led_matrix` | LED Matrix | LED-Matrix | Displays | (composite) | rows, cols | modeled | done |
| 28 | `led_cube` | LED Cube | LED-Wuerfel | Displays | (composite) | size | modeled | done |

### Digital ICs

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 29 | `shift_register` | Shift Register 74HC595 | Schieberegister 74HC595 | Digital ICs | data, clock, latch, oe, q0-q7 | — | modeled | done |
| 30 | `eeprom` | I2C EEPROM | I2C-EEPROM | Digital ICs | sda, scl, vcc, gnd | — | modeled | done |
| 31 | `gate_and` | AND Gate | UND-Gatter | Logic Gates | in0, in1, out | inputs | modeled | done |
| 32 | `gate_or` | OR Gate | ODER-Gatter | Logic Gates | in0, in1, out | inputs | modeled | done |
| 33 | `gate_not` | NOT Gate (Inverter) | NICHT-Gatter (Inverter) | Logic Gates | in0, out | — | modeled | done |
| 34 | `gate_nand` | NAND Gate | NAND-Gatter | Logic Gates | in0, in1, out | inputs | modeled | done |
| 35 | `gate_nor` | NOR Gate | NOR-Gatter | Logic Gates | in0, in1, out | inputs | modeled | done |
| 36 | `gate_xor` | XOR Gate | XOR-Gatter | Logic Gates | in0, in1, out | inputs | modeled | done |

### Electromechanical

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 37 | `relay` | SPDT Relay | SPDT-Relais | Electromechanical | coil_a, coil_b, com, nc, no | coilR | modeled | done |
| 38 | `dc_motor` | DC Motor | Gleichstrommotor | Electromechanical | a, b | — | modeled | done |
| 39 | `servo` | Micro Servo | Micro-Servo | Electromechanical | signal, vcc, gnd | — | modeled | done |

### Microcontroller

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 40 | `mcu` | Microcontroller | Mikrocontroller | MCU | (dynamic pin IDs) | arch | modeled | done |

---

## Tier 2 — Engine models in flight (3 parts)

Models being built or about to land in bw-board's device plugin interface.

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 41 | `555` | 555 Timer | 555-Timer | Analog ICs | gnd, trigger, output, reset, control, threshold, discharge, vcc | — | registry-candidate | done |
| 42 | `hobby_gearmotor` | Hobby Gearmotor | Hobby-Getriebemotor | Electromechanical | a, b | gear_ratio | registry-candidate | done |
| 43 | `motor_driver_l293d` | H-Bridge L293D | H-Bruecke L293D | Digital ICs | en1, in1, out1, gnd1, gnd2, out2, in2, en2, vcc2, vcc1 | — | registry-candidate | done |

---

## Tier 3 — Catalog targets (68 parts)

Parts needed for parity with mainstream learning simulators. No engine model yet; art and palette metadata come first, simulation follows.

### Passives & Discrete

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 44 | `resistor_photo` | Photoresistor (round) | Fotowiderstand (rund) | Sensors | a, b | rDark, rLight | drawable-only | pending |
| 45 | `fuse` | Fuse | Sicherung | Passives | a, b | amps | drawable-only | pending |
| 46 | `crystal` | Crystal Oscillator | Quarzoszillator | Passives | a, b | freq_hz | drawable-only | pending |
| 47 | `transformer` | Transformer | Transformator | Passives | pri_a, pri_b, sec_a, sec_b | ratio | drawable-only | pending |
| 48 | `trimpot` | Trimmer Potentiometer | Trimmpotentiometer | Passives | a, b, wiper | ohms | drawable-only | pending |
| 49 | `electrolytic_cap` | Electrolytic Capacitor | Elektrolytkondensator | Passives | pos, neg | farads, voltage | drawable-only | pending |
| 50 | `ceramic_cap` | Ceramic Capacitor | Keramikkondensator | Passives | a, b | farads | drawable-only | pending |

### Diodes & LEDs

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 51 | `led_5mm` | LED 5mm (colored) | LED 5mm (farbig) | Diodes | anode, cathode | color, vf | drawable-only | pending |
| 52 | `neopixel_strip` | NeoPixel Strip (8) | NeoPixel-Streifen (8) | Displays | din, vcc, gnd, dout | leds | drawable-only | pending |
| 53 | `neopixel_ring` | NeoPixel Ring (16) | NeoPixel-Ring (16) | Displays | din, vcc, gnd, dout | leds | drawable-only | pending |
| 54 | `ir_led` | IR LED | IR-LED | Diodes | anode, cathode | — | drawable-only | pending |

### Switches

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 55 | `dip_switch` | DIP Switch | DIP-Schalter | Input | (composite) | positions | drawable-only | pending |
| 56 | `slide_switch` | Slide Switch | Schiebeschalter | Input | a, com, b | — | drawable-only | pending |
| 57 | `tilt_switch` | Tilt Switch | Neigungsschalter | Input | a, b | — | drawable-only | pending |
| 58 | `rotary_encoder` | Rotary Encoder | Drehgeber | Input | clk, dt, sw, vcc, gnd | — | drawable-only | pending |
| 59 | `keypad_4x4` | 4x4 Matrix Keypad | 4x4-Matrixtastatur | Input | r0, r1, r2, r3, c0, c1, c2, c3 | — | drawable-only | pending |
| 60 | `spdt_switch` | SPDT Switch | SPDT-Schalter | Input | a, com, b | — | drawable-only | pending |

### Sensors

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 61 | `force_sensor` | Force Sensor (FSR) | Kraftsensor (FSR) | Sensors | a, b | — | drawable-only | pending |
| 62 | `flex_sensor` | Flex Sensor | Biegesensor | Sensors | a, b | — | drawable-only | pending |
| 63 | `ultrasonic` | Ultrasonic Distance Sensor | Ultraschall-Entfernungssensor | Sensors | vcc, trig, echo, gnd | — | drawable-only | pending |
| 64 | `pir` | PIR Motion Sensor | PIR-Bewegungssensor | Sensors | vcc, out, gnd | — | drawable-only | pending |
| 65 | `imu_6dof` | 6-DOF IMU (MPU-6050) | 6-DOF IMU (MPU-6050) | Sensors | vcc, gnd, scl, sda, int | — | drawable-only | pending |
| 66 | `soil_moisture` | Soil Moisture Sensor | Bodenfeuchtesensor | Sensors | vcc, gnd, sig | — | drawable-only | pending |
| 67 | `gas_sensor` | Gas Sensor (MQ-2) | Gassensor (MQ-2) | Sensors | vcc, gnd, aout, dout | — | drawable-only | pending |
| 68 | `hall_effect` | Hall Effect Sensor | Hall-Effekt-Sensor | Sensors | vcc, gnd, out | — | drawable-only | pending |
| 69 | `dht11` | Temp & Humidity Sensor (DHT11) | Temp- & Feuchtigkeitssensor (DHT11) | Sensors | vcc, data, gnd | — | drawable-only | pending |
| 70 | `light_sensor` | Ambient Light Sensor | Umgebungslichtsensor | Sensors | vcc, gnd, out | — | drawable-only | pending |
| 71 | `water_level` | Water Level Sensor | Wasserstandsensor | Sensors | vcc, gnd, sig | — | drawable-only | pending |

### Displays

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 72 | `seven_segment_4` | 4-Digit 7-Segment | 4-Stellige 7-Segment-Anzeige | Displays | (composite) | — | drawable-only | pending |
| 73 | `oled_128x64` | OLED Display 128x64 | OLED-Anzeige 128x64 | Displays | vcc, gnd, scl, sda | — | drawable-only | pending |
| 74 | `lcd_i2c` | I2C LCD 16x2 | I2C-LCD 16x2 | Displays | vcc, gnd, sda, scl | rows, cols | drawable-only | pending |
| 75 | `bargraph` | 10-Segment Bar Graph | 10-Segment-Balkenanzeige | Displays | a0-a9, c0-c9 | — | drawable-only | pending |
| 76 | `dot_matrix_max` | LED Matrix MAX7219 | LED-Matrix MAX7219 | Displays | vcc, gnd, din, cs, clk | — | drawable-only | pending |

### Digital ICs

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 77 | `gate_xnor` | XNOR Gate | XNOR-Gatter | Logic Gates | in0, in1, out | inputs | drawable-only | pending |
| 78 | `gate_buffer` | Buffer Gate | Buffer-Gatter | Logic Gates | in0, out | — | drawable-only | pending |
| 79 | `flip_flop_d` | D Flip-Flop (74HC74) | D-Flip-Flop (74HC74) | Digital ICs | d, clk, q, qn, set, reset, vcc, gnd | — | drawable-only | pending |
| 80 | `flip_flop_jk` | JK Flip-Flop | JK-Flip-Flop | Digital ICs | j, k, clk, q, qn, set, reset, vcc, gnd | — | drawable-only | pending |
| 81 | `counter_4bit` | 4-Bit Counter (74HC393) | 4-Bit-Zaehler (74HC393) | Digital ICs | clk, clr, q0, q1, q2, q3, vcc, gnd | — | drawable-only | pending |
| 82 | `counter_decade` | Decade Counter (74HC4017) | Dekadenzaehler (74HC4017) | Digital ICs | clk, en, rst, q0-q9, co, vcc, gnd | — | drawable-only | pending |
| 83 | `mux_4to1` | 4:1 Multiplexer | 4:1-Multiplexer | Digital ICs | i0, i1, i2, i3, s0, s1, y, vcc, gnd | — | drawable-only | pending |
| 84 | `demux_1to4` | 1:4 Demultiplexer | 1:4-Demultiplexer | Digital ICs | i, s0, s1, y0, y1, y2, y3, vcc, gnd | — | drawable-only | pending |
| 85 | `optocoupler` | Optocoupler (4N35) | Optokoppler (4N35) | Digital ICs | anode, cathode, emitter, collector, base, vcc | — | drawable-only | pending |
| 86 | `decoder_bcd` | BCD to 7-Seg Decoder (74HC47) | BCD-zu-7-Seg-Dekoder (74HC47) | Digital ICs | a, b, c, d, qa-qg, vcc, gnd | — | drawable-only | pending |
| 87 | `comparator` | Analog Comparator (LM393) | Analogkomparator (LM393) | Analog ICs | inp, inn, out, vcc, gnd | — | drawable-only | pending |

### Voltage Regulators

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 88 | `vreg_7805` | Voltage Regulator 7805 | Spannungsregler 7805 | Power | vin, gnd, vout | — | drawable-only | pending |
| 89 | `vreg_ldo` | LDO Regulator (3.3V) | LDO-Regler (3,3V) | Power | vin, gnd, vout | vout | drawable-only | pending |

### Power / Batteries

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 90 | `battery_9v` | 9V Battery | 9V-Batterie | Power | pos, neg | — | drawable-only | pending |
| 91 | `battery_aa` | AA Battery (1.5V) | AA-Batterie (1,5V) | Power | pos, neg | — | drawable-only | pending |
| 92 | `battery_coin` | Coin Cell (CR2032) | Knopfzelle (CR2032) | Power | pos, neg | — | drawable-only | pending |
| 93 | `battery_holder_2aa` | 2xAA Battery Holder | 2xAA-Batteriehalter | Power | pos, neg | — | drawable-only | pending |
| 94 | `breadboard_psu` | Breadboard Power Supply | Breadboard-Netzteil | Power | 5v, 3v3, gnd | — | drawable-only | pending |

### Electromechanical

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 95 | `stepper` | Stepper Motor (28BYJ-48) | Schrittmotor (28BYJ-48) | Electromechanical | a, b, c, d, com | — | drawable-only | pending |
| 96 | `solenoid` | Solenoid | Solenoid | Electromechanical | a, b | — | drawable-only | pending |
| 97 | `fan` | DC Fan | Gleichstrom-Luefter | Electromechanical | pos, neg | — | drawable-only | pending |
| 98 | `speaker` | Speaker (8 Ohm) | Lautsprecher (8 Ohm) | Outputs | a, b | ohms | drawable-only | pending |

### MCU Boards

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 99 | `attiny85` | ATtiny85 | ATtiny85 | MCU | pb0-pb5, vcc, gnd, reset | — | drawable-only | pending |
| 100 | `arduino_uno` | Arduino-Class AVR Board | Arduino-aehnliches AVR-Board | MCU | d0-d13, a0-a5, 5v, 3v3, gnd, vin, reset | — | drawable-only | pending |
| 101 | `arduino_nano` | AVR Nano Board | AVR-Nano-Board | MCU | d0-d13, a0-a7, 5v, 3v3, gnd, vin, reset | — | drawable-only | pending |

### Connectors & Misc

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 102 | `breadboard_half` | Half-Size Breadboard | Halbes Steckbrett | Infrastructure | (holes) | rows | drawable-only | pending |
| 103 | `breadboard_full` | Full-Size Breadboard | Volles Steckbrett | Infrastructure | (holes) | rows | drawable-only | pending |
| 104 | `header_male` | Pin Header (Male) | Stiftleiste (maennlich) | Connectors | (variable) | pins | drawable-only | pending |
| 105 | `header_female` | Pin Header (Female) | Buchsenleiste (weiblich) | Connectors | (variable) | pins | drawable-only | pending |
| 106 | `terminal_block` | Screw Terminal Block | Schraubklemme | Connectors | (variable) | positions | drawable-only | pending |
| 107 | `jumper_wire` | Jumper Wire | Steckbrueckendraht | Connectors | a, b | — | drawable-only | pending |
| 108 | `probe` | Test Probe | Messpitze | Instruments | tip, ref | — | drawable-only | pending |

### Communication Modules

| # | Kind slug | Name EN | Name DE | Category | Terminals | Key params | Engine | Art |
|---|-----------|---------|---------|----------|-----------|------------|--------|-----|
| 109 | `bluetooth_hc05` | Bluetooth Module (HC-05) | Bluetooth-Modul (HC-05) | Communication | vcc, gnd, txd, rxd | — | drawable-only | pending |
| 110 | `wifi_esp01` | WiFi Module (ESP-01) | WiFi-Modul (ESP-01) | Communication | vcc, gnd, tx, rx, ch_pd, rst, gpio0, gpio2 | — | drawable-only | pending |
| 111 | `rfid_rc522` | RFID Reader (RC522) | RFID-Leser (RC522) | Communication | vcc, gnd, sda, sck, mosi, miso, rst | — | drawable-only | pending |

---

## Summary

| Tier | Count | Description |
|------|-------|-------------|
| Tier 1 | 40 | Modeled in bw-board engine |
| Tier 2 | 3 | Engine models in flight |
| Tier 3 | 68 | Catalog targets (drawable-only) |
| **Total** | **111** | |

### Categories at a glance

| Category | Parts |
|----------|-------|
| Power | 8 |
| Passives | 11 |
| Diodes | 7 |
| Transistors | 4 |
| Analog ICs | 2 |
| Digital ICs | 14 |
| Logic Gates | 8 |
| Input | 8 |
| Sensors | 13 |
| Outputs | 2 |
| Displays | 10 |
| Electromechanical | 7 |
| MCU | 4 |
| Infrastructure | 2 |
| Connectors | 4 |
| Communication | 3 |
| Instruments | 1 |

---

## Art priority queue

1. **Tier-2 parts** (engine models landing soonest): `555`, `hobby_gearmotor`, `motor_driver_l293d`
2. **Tier-1 parts without art** (everything in tier 1 above)
3. **Batteries & power**: `battery_9v`, `battery_aa`, `battery_coin`, `breadboard_psu`, `vreg_7805`
4. **Sensors**: `ultrasonic`, `pir`, `force_sensor`, `flex_sensor`, `dht11`, `imu_6dof`
5. **Displays**: `seven_segment_4`, `neopixel_strip`, `oled_128x64`, `bargraph`
6. **Digital ICs**: `flip_flop_d`, `counter_4bit`, `optocoupler`, `decoder_bcd`
7. **Everything else**
