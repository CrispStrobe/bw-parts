#!/usr/bin/env python3
"""
Audit pass 2: set functions on non-MCU sidecars.

Parts are grouped by audit reasoning. Every terminal set to [] (audited,
no alternates) has a comment explaining why. Parts left at null are listed
at the bottom with the reason they were skipped.

Schema (spec-update 007):
  null  = not yet audited
  []    = audited, genuinely no alternates
  [..]  = audited, these are the alternates
"""

import json
import glob
import os

PARTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'parts')

# ── Parts where EVERY terminal gets [] ──────────────────────────────
#
# These are passive components, discrete semiconductors, power sources,
# sensors with fixed-function pins, actuators, instruments, switches,
# and simple modules. Their terminals are physical leads or fixed-role
# connectors with no alternate electrical function.
#
# The audit claim for each: "I read the terminal names in the sidecar,
# confirmed they match the component's datasheet or standard pinout,
# and determined that no terminal has an alternate function selectable
# by the user or by configuration."

ALL_EMPTY = {
    # ── Passive components ──────────────────────────────────────────
    # Two-terminal passives: leads are electrically symmetric or
    # polarized, but neither has an alternate function.
    "resistor",         # a, b — Ohm's law, no alternates
    "capacitor",        # a, b — unpolarized capacitor
    "polarized_cap",    # pos, neg — electrolytic, fixed polarity
    "inductor",         # a, b — inductor coil
    "potentiometer",    # a, wiper, b — three-terminal variable resistor
    "fuse",             # a, b — overcurrent protection, no alternates

    # ── Diodes and LEDs ─────────────────────────────────────────────
    "diode",            # anode, cathode — standard rectifier
    "zener",            # anode, cathode — zener diode
    "led",              # anode, cathode — light-emitting diode
    "ir_transmitter",   # anode, cathode — infrared LED
    "photodiode",       # anode, cathode — light-sensitive diode
    "rgb_led",          # r_anode, g_anode, b_anode, cathode — common cathode RGB

    # ── Transistors ─────────────────────────────────────────────────
    # BJTs and MOSFETs: terminals are physically defined by the device
    # structure. No pin has an alternate function.
    "npn",              # base, collector, emitter
    "pnp",              # base, collector, emitter
    "nmos",             # gate, drain, source
    "pmos",             # gate, drain, source (note: sidecar has gate, source, drain order)
    "nmos_power",       # gate, drain, source — power MOSFET, same pinout
    "pmos_power",       # gate, source, drain — power MOSFET
    "tip120",           # base, collector, emitter — Darlington, same as NPN

    # ── Op-amps and comparators ─────────────────────────────────────
    # Analog ICs with fixed-function pins. No pin is reconfigurable.
    "opamp",            # inp, inn, out — single op-amp (no supply pins in sidecar)
    "lm393",            # dual comparator: 1out, 1inp, 1inn, gnd, 2inn, 2inp, 2out, vcc
    "lm339",            # quad comparator: 4x (out, inp, inn), vcc, gnd

    # ── Voltage regulators ──────────────────────────────────────────
    "lm7805",           # vin, gnd, vout — 5V linear regulator (7805 datasheet)
    "ld1117v33",        # gnd, vout, vin — 3.3V LDO regulator

    # ── Power sources ───────────────────────────────────────────────
    "battery_9v",       # pos, neg
    "battery_aa",       # pos, neg
    "battery_coin",     # pos, neg
    "lemon_battery",    # pos, neg
    "potato_battery",   # pos, neg
    "solar_cell",       # pos, neg
    "vsource",          # pos, neg — ideal voltage source
    "isource",          # pos, neg — ideal current source
    "vcc",              # vcc — single power terminal
    "gnd",              # gnd — single ground terminal
    "breadboard_psu",   # 5v, 3v3, gnd — breadboard power supply

    # ── Switches ────────────────────────────────────────────────────
    "button",           # a, b — momentary pushbutton
    "switch",           # a, b — SPST toggle
    "slide_switch",     # a, com, b — SPDT slide switch
    "tilt_switch",      # a, b — tilt-activated switch
    "tilt_switch_v2",   # a, b — tilt switch variant
    "dip_switch_spst",  # 1a–4a, 1b–4b — 4-position DIP switch
    "dip_switch_dpst",  # 1a, 1b, 2a, 2b, 1a_out, 1b_out, 2a_out, 2b_out

    # ── Sensors (fixed-function output) ─────────────────────────────
    # These sensors have power pins and a fixed analog or digital output.
    # No pin is reconfigurable.
    "ldr",              # a, b — photoresistor (light-dependent resistor)
    "ntc",              # a, b — NTC thermistor
    "flex_sensor",      # a, b — variable resistance, no alternates
    "force_sensor",     # a, b — FSR, variable resistance
    "tmp36",            # vcc, vout, gnd — analog temperature sensor (Analog Devices)
    "temp_sensor",      # vcc, gnd, dq — DS18B20 1-Wire digital temp sensor
    "light_sensor",     # vcc, gnd, out — ambient light module
    "pir",              # vcc, out, gnd — passive infrared motion detector
    "soil_moisture",    # vcc, gnd, sig — soil moisture probe
    "gas_sensor",       # vcc, gnd, aout, dout — MQ-series gas sensor module
    "ir_receiver",      # vcc, gnd, out — IR demodulator (e.g. TSOP38238)
    "ultrasonic",       # vcc, trig, echo, gnd — HC-SR04 4-pin
    "ultrasonic_3pin",  # vcc, sig, gnd — 3-pin ultrasonic variant

    # ── Actuators ───────────────────────────────────────────────────
    "dc_motor",         # a, b — brushed DC motor
    "gearmotor",        # a, b — geared DC motor
    "vibration_motor",  # a, b — coin/ERM vibration motor
    "solenoid",         # a, b — electromagnetic actuator
    "stepper",          # coil_a1, coil_b1, coil_a2, coil_b2 — bipolar stepper
    "servo",            # gnd, vcc, signal — hobby servo (PWM input)
    "buzzer",           # a, b — piezo or magnetic buzzer
    "light_bulb",       # a, b — incandescent lamp

    # ── Relays ──────────────────────────────────────────────────────
    "relay",            # coil_a, coil_b, no, com, nc — SPDT relay
    "relay_dpdt",       # coil_a/b, no1/com1/nc1, no2/com2/nc2 — DPDT relay

    # ── Optocoupler ─────────────────────────────────────────────────
    "optocoupler",      # anode, cathode (LED side), emitter, collector (phototransistor)

    # ── Displays (no reconfigurable pins) ───────────────────────────
    "seven_segment",    # a, b — simplified 7-seg (2 terminals in sidecar)
    "led_matrix",       # a, b — simplified LED matrix (2 terminals)
    "neopixel",         # din, vcc, gnd, dout — WS2812B addressable LED
    "neopixel_strip",   # vcc, din, gnd, dout
    "neopixel_ring",    # vcc, din, gnd, dout
    "neopixel_jewel",   # vcc, din, gnd, dout

    # ── Motor driver ────────────────────────────────────────────────
    # L293D: every pin has a single fixed function per the TI datasheet.
    # EN1/EN2 enable outputs, IN1-IN4 are logic inputs, OUT1-OUT4 are
    # push-pull outputs, GND1-GND4 are ground/heatsink, VCC1 is logic
    # supply, VCC2 is motor supply. No pin is reconfigurable.
    "l293d",

    # ── Instruments ─────────────────────────────────────────────────
    "multimeter",       # probe_a, probe_b — virtual instrument
    "function_gen",     # out, gnd — virtual function generator
    "oscilloscope",     # ch1, ch2, gnd — virtual oscilloscope

    # ── Connectors ──────────────────────────────────────────────────
    "header",           # p1–p8 — generic pin header, no function
    "usb_a",            # vcc, d_minus, d_plus, gnd — USB Type-A connector

    # ── Simple modules with fixed pins ──────────────────────────────
    "clock_display",    # clk, dio, vcc, gnd — TM1637 4-digit 7-seg driver
    "dc_motor_encoder", # a, b, enc_a, enc_b — motor with quadrature encoder
    "led_cube",         # sel_0–7, data_0–7 — LED cube multiplexed display
    "pololu_motor_ctrl",# vin, gnd, motor_p, motor_n, tx, rx — motor controller
    "keypad_4x4",       # r0–r3, c0–c2 — matrix keypad (no alternate functions)
}

# ── Parts with I2C pins that get specific functions ─────────────────
#
# These modules communicate via I2C. Their SDA/SCL pins have a defined
# protocol function. Power and other pins get [].

I2C_PARTS = {
    # char_lcd_i2c: PCF8574 I2C backpack for character LCD
    "char_lcd_i2c": {
        "sda": ["sda"],
        "scl": ["scl"],
        "vcc": [],
        "gnd": [],
    },
    # eeprom: I2C EEPROM (e.g. AT24C256)
    "eeprom": {
        "sda": ["sda"],
        "scl": ["scl"],
        "vcc": [],
        "gnd": [],
    },
}

# ── 74HC logic ICs: all pins are fixed-function ─────────────────────
#
# Every 74HC-series gate/flip-flop/counter has inputs, outputs, vcc,
# gnd, and NC pins — all fixed by the datasheet. No pin is user-
# reconfigurable. All terminals get [].
#
# This covers: 74hc00, 74hc02, 74hc04, 74hc08, 74hc10, 74hc11,
# 74hc14, 74hc20, 74hc21, 74hc27, 74hc32, 74hc73, 74hc74, 74hc75,
# 74hc86, 74hc93, 74hc95, 74hc132, 74hc283, 74hc595.
# Also: cd4017, cd4511, 555, 556.
#
# These are already in ALL_EMPTY above (implicitly — the script handles
# them if their kind is listed). Adding them explicitly for clarity:
HC_PARTS = {
    "74hc00", "74hc02", "74hc04", "74hc08", "74hc10", "74hc11",
    "74hc14", "74hc20", "74hc21", "74hc27", "74hc32", "74hc73",
    "74hc74", "74hc75", "74hc86", "74hc93", "74hc95", "74hc132",
    "74hc283", "74hc595",
    "cd4017", "cd4511",
    "555", "556",
}

ALL_EMPTY.update(HC_PARTS)

# ── PCF8574: I2C I/O expander with quasi-bidirectional ports ────────
#
# Source: NXP PCF8574 datasheet (Rev. 5, 2013-01-07)
# P0–P7 are quasi-bidirectional I/O — they function as GPIO but have
# no alternate peripheral function (no ADC, no PWM, no SPI). They are
# generic I/O pins exposed over I2C.
# INT is open-drain interrupt output (directly active, no alternate).
# A0–A2 are address select pins (directly tied high/low, no alternate).

PCF8574_FUNCTIONS = {
    "a0": [],       # address select bit 0
    "a1": [],       # address select bit 1
    "a2": [],       # address select bit 2
    "p0": ["gpio"], # quasi-bidirectional I/O
    "p1": ["gpio"],
    "p2": ["gpio"],
    "p3": ["gpio"],
    "p4": ["gpio"],
    "p5": ["gpio"],
    "p6": ["gpio"],
    "p7": ["gpio"],
    "int": [],      # open-drain interrupt output
    "scl": ["scl"], # I2C clock
    "sda": ["sda"], # I2C data
    "vss": [],      # ground
    "vdd": [],      # supply
}

# ── Char LCD (HD44780 parallel interface) ───────────────────────────
#
# Source: Hitachi HD44780U datasheet
# RS, E, D4–D7 are fixed-function parallel bus pins. No alternates.

CHAR_LCD_FUNCTIONS = {
    "rs": [],   # register select
    "e": [],    # enable strobe
    "d4": [],   # data bit 4
    "d5": [],   # data bit 5
    "d6": [],   # data bit 6
    "d7": [],   # data bit 7
}

# ── ATtiny85: 8-pin AVR microcontroller ─────────────────────────────
#
# Source: Microchip ATtiny85 datasheet (DS2586J)
# 8-pin PDIP: PB0–PB5 are GPIO with alternates, plus VCC and GND.

ATTINY85_FUNCTIONS = {
    "pb0": ["gpio", "mosi", "adc0", "sda"],    # MOSI/DI/SDA/AIN0/OC0A/PCINT0
    "pb1": ["gpio", "miso", "pwm_t0b"],        # MISO/DO/AIN1/OC0B/OC1A/PCINT1
    "pb2": ["gpio", "sclk", "adc1"],            # SCK/USCK/SCL/ADC1/T0/INT0/PCINT2
    "pb3": ["gpio", "adc3"],                     # ADC3/PCINT3/CLKI (also OC1B via inv)
    "pb4": ["gpio", "adc2", "pwm_t1b"],         # ADC2/OC1B/PCINT4
    "pb5": ["gpio"],                             # PCINT5/RESET/ADC0/dW — but RESET by default
    "vcc": [],
    "gnd": [],
}

# ── micro:bit breakout ──────────────────────────────────────────────
#
# Source: BBC micro:bit V2 edge connector pinout (tech.microbit.org)
# P0, P1, P2 are GPIO with analog capability. P8, P12, P16 are GPIO.
# 3V and GND are power. This is the breakout board, not the full
# edge connector — only 10 pins exposed.

MICROBIT_FUNCTIONS = {
    "p0": ["gpio", "adc0"],     # large pad, analog/digital
    "p1": ["gpio", "adc1"],     # large pad, analog/digital
    "p2": ["gpio", "adc2"],     # large pad, analog/digital
    "3v_l": [],                  # 3V power (left)
    "gnd_l": [],                 # ground (left)
    "p8": ["gpio"],              # digital only
    "p12": ["gpio"],             # digital only
    "p16": ["gpio"],             # digital only
    "3v_r": [],                  # 3V power (right)
    "gnd_r": [],                 # ground (right)
}

# ── micro:bit (simplified 5-pin) ───────────────────────────────────
#
# Same source. Simplified sidecar with 3 large pads + power.

MICROBIT_SIMPLE_FUNCTIONS = {
    "p0": ["gpio", "adc0"],
    "p1": ["gpio", "adc1"],
    "p2": ["gpio", "adc2"],
    "3v": [],
    "gnd": [],
}

# ── Arduino Uno (28 terminals) ──────────────────────────────────────
#
# Source: docs/pin-table-atmega328p.md (audit commit 465ac3a)
# Same MCU as Nano but no A6/A7 on header.

UNO_FUNCTIONS = {
    "d0":     ["gpio", "rxd0"],
    "d1":     ["gpio", "txd0"],
    "d2":     ["gpio", "int0"],
    "d3":     ["gpio", "int1", "pwm_t2b"],
    "d4":     ["gpio", "t0"],
    "d5":     ["gpio", "pwm_t0b", "t1"],
    "d6":     ["gpio", "pwm_t0a", "ain0"],
    "d7":     ["gpio", "ain1"],
    "d8":     ["gpio", "icp1"],
    "d9":     ["gpio", "pwm_t1a"],
    "d10":    ["gpio", "pwm_t1b", "ss"],
    "d11":    ["gpio", "pwm_t2a", "mosi"],
    "d12":    ["gpio", "miso"],
    "d13":    ["gpio", "sclk"],
    "a0":     ["gpio", "adc0"],
    "a1":     ["gpio", "adc1"],
    "a2":     ["gpio", "adc2"],
    "a3":     ["gpio", "adc3"],
    "a4":     ["gpio", "adc4", "sda"],
    "a5":     ["gpio", "adc5", "scl"],
    "reset":  [],
    "aref":   [],
    "gnd":    [],
    "gnd2":   [],
    "gnd3":   [],
    "3v3":    [],
    "5v":     [],
    "vin":    [],
}

# ── mcu (STC12 generic, same as stc_mcu) ───────────────────────────
#
# The 'mcu' kind has the same 40 terminals as stc_mcu. It uses the
# same pin table (docs/pin-table-stc12c5a60s2.md, audit commit fbfacf8).
# Import the lookup from the MCU script rather than duplicating.

# We'll load it at runtime from the existing script's data.

# ── Specific per-terminal lookups ───────────────────────────────────

SPECIFIC_LOOKUPS = {
    "pcf8574": PCF8574_FUNCTIONS,
    "char_lcd": CHAR_LCD_FUNCTIONS,
    "attiny85": ATTINY85_FUNCTIONS,
    "microbit_breakout": MICROBIT_FUNCTIONS,
    "microbit": MICROBIT_SIMPLE_FUNCTIONS,
    "arduino_uno": UNO_FUNCTIONS,
}
SPECIFIC_LOOKUPS.update(I2C_PARTS)


# ── MCU kind (same pinout as stc_mcu) ──────────────────────────────
# Rather than importing, just reuse the same table.
import importlib.util
_spec = importlib.util.spec_from_file_location(
    "mcu_script",
    os.path.join(os.path.dirname(__file__), "add-functions-to-sidecars.py")
)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
SPECIFIC_LOOKUPS["mcu"] = _mod.STC_FUNCTIONS


# ── Skip list: parts already audited by the MCU script ──────────────
ALREADY_AUDITED = {"stc_mcu", "arduino_nano", "pi_pico"}


def process_sidecar(filepath):
    with open(filepath) as f:
        data = json.load(f)

    kind = data["kind"]

    if kind in ALREADY_AUDITED:
        return kind, 0, 0, []

    changed = 0
    skipped = []

    if kind in SPECIFIC_LOOKUPS:
        lookup = SPECIFIC_LOOKUPS[kind]
        for terminal in data["terminals"]:
            name = terminal["name"]
            if name in lookup:
                terminal["functions"] = lookup[name]
                changed += 1
            else:
                # Terminal in sidecar not in our lookup — leave null, report
                if terminal.get("functions") is None:
                    skipped.append(name)
    elif kind in ALL_EMPTY:
        for terminal in data["terminals"]:
            terminal["functions"] = []
            changed += 1
    else:
        # Unknown kind — leave null
        for terminal in data["terminals"]:
            if terminal.get("functions") is None:
                skipped.append(terminal["name"])
        return kind, 0, 0, skipped

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')

    return kind, changed, len(data["terminals"]), skipped


def main():
    files = sorted(glob.glob(os.path.join(PARTS_DIR, '*.json')))
    total_changed = 0
    total_terminals = 0
    all_skipped = {}
    kinds_updated = []
    kinds_skipped_entirely = []

    for filepath in files:
        kind, changed, n_terms, skipped = process_sidecar(filepath)
        if changed > 0:
            total_changed += changed
            total_terminals += n_terms
            kinds_updated.append(kind)
        if skipped:
            all_skipped[kind] = skipped
        if changed == 0 and kind not in ALREADY_AUDITED and not skipped:
            pass  # already done or no terminals

    print(f"Updated {len(kinds_updated)} parts, {total_changed} terminals set")
    print(f"Parts updated: {', '.join(kinds_updated[:20])}{'...' if len(kinds_updated) > 20 else ''}")

    if all_skipped:
        print(f"\nTerminals left at null (no lookup entry):")
        for kind, names in sorted(all_skipped.items()):
            print(f"  {kind}: {', '.join(names)}")

    # Count overall coverage
    all_terms = 0
    audited = 0
    for filepath in files:
        with open(filepath) as f:
            d = json.load(f)
        for t in d.get("terminals", []):
            all_terms += 1
            if t.get("functions") is not None:
                audited += 1
    print(f"\nOverall coverage: {audited} / {all_terms} ({100*audited//all_terms}%)")


if __name__ == '__main__':
    main()
