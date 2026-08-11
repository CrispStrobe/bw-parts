#!/usr/bin/env python3
"""
Add 'functions' field to all sidecar terminals.

MCU sidecars (stc_mcu, arduino_nano, pi_pico) get functions derived from
the audited pin tables in docs/. Every function slug is sourced to a
specific datasheet via those tables.

Non-MCU sidecars get functions: null (not yet audited).

Schema (spec-update 007, confirmed by all three repos):
  functions: null                  — not yet audited
  functions: []                    — audited, genuinely no alternates
  functions: ["gpio", "adc0", …]  — audited, these are the alternates
"""

import json
import os
import glob

PARTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'parts')

# ── STC12C5A60S2 pin functions ──────────────────────────────────────
# Source: docs/pin-table-stc12c5a60s2.md (audit commit fbfacf8)
# Datasheet: STC12C5A60S2 rev 2011-07-15
#
# Skipped functions (not in agreed vocabulary, noted at bottom):
#   P1.2 ECI (PCA external clock input)
#   P3.0/P3.4/P3.5 INT (power-down wake interrupt, not numbered ext int)
#   P3.6 WR, P3.7 RD (external memory bus control)
#   P2.0–P2.7 A8–A15 (external address bus)
#   P0.0–P0.7 AD0–AD7 (external multiplexed address/data bus)
#   P4.5 ALE (address latch enable)
#   P4.6 EX_LVD/RST2 (low-voltage detect / secondary reset)

STC_FUNCTIONS = {
    "P1.0": ["gpio", "adc0", "clkout2"],
    "P1.1": ["gpio", "adc1"],
    "P1.2": ["gpio", "adc2", "rxd2"],        # ECI skipped (not in vocab)
    "P1.3": ["gpio", "adc3", "ccp0", "txd2"],
    "P1.4": ["gpio", "adc4", "ccp1", "ss"],
    "P1.5": ["gpio", "adc5", "mosi"],
    "P1.6": ["gpio", "adc6", "miso"],
    "P1.7": ["gpio", "adc7", "sclk"],
    "RST":  [],                               # fixed-function reset pin
    "P3.0": ["gpio", "rxd0"],                 # INT = power-down wake, skipped
    "P3.1": ["gpio", "txd0"],
    "P3.2": ["gpio", "int0"],
    "P3.3": ["gpio", "int1"],
    "P3.4": ["gpio", "t0", "clkout0"],        # INT = power-down wake, skipped
    "P3.5": ["gpio", "t1", "clkout1"],        # INT = power-down wake, skipped
    "P3.6": ["gpio"],                         # WR (ext bus) skipped
    "P3.7": ["gpio"],                         # RD (ext bus) skipped
    "XTAL2": [],                              # crystal oscillator, fixed
    "XTAL1": [],                              # crystal oscillator, fixed
    "GND":  [],                               # power
    "P2.0": ["gpio"],                         # A8 (ext addr bus) skipped
    "P2.1": ["gpio"],                         # A9 skipped
    "P2.2": ["gpio"],                         # A10 skipped
    "P2.3": ["gpio"],                         # A11 skipped
    "P2.4": ["gpio"],                         # A12 skipped
    "P2.5": ["gpio"],                         # A13 skipped
    "P2.6": ["gpio"],                         # A14 skipped
    "P2.7": ["gpio"],                         # A15 skipped
    "P4.4": ["gpio"],                         # NA (no alternate)
    "P4.5": ["gpio"],                         # ALE (ext bus) skipped
    "P4.6": ["gpio"],                         # EX_LVD/RST2 skipped
    "P0.7": ["gpio"],                         # AD7 (ext bus) skipped
    "P0.6": ["gpio"],                         # AD6 skipped
    "P0.5": ["gpio"],                         # AD5 skipped
    "P0.4": ["gpio"],                         # AD4 skipped
    "P0.3": ["gpio"],                         # AD3 skipped
    "P0.2": ["gpio"],                         # AD2 skipped
    "P0.1": ["gpio"],                         # AD1 skipped
    "P0.0": ["gpio"],                         # AD0 skipped
    "VCC":  [],                               # power
}

# ── ATmega328P pin functions (Arduino Nano) ─────────────────────────
# Source: docs/pin-table-atmega328p.md (audit commit 465ac3a)
# Datasheet: Microchip DS40002061B
#
# Terminal names in the sidecar are lowercase Arduino-style (d0, a0, etc.)
#
# Skipped functions (not in agreed vocabulary):
#   D4 XCK (USART synchronous external clock — rare usage)
#   D8 CLKO (clock output, requires fuse — not runtime-selectable)

NANO_FUNCTIONS = {
    "d0":     ["gpio", "rxd0"],
    "d1":     ["gpio", "txd0"],
    "d2":     ["gpio", "int0"],
    "d3":     ["gpio", "int1", "pwm_t2b"],
    "d4":     ["gpio", "t0"],                  # XCK skipped
    "d5":     ["gpio", "pwm_t0b", "t1"],
    "d6":     ["gpio", "pwm_t0a", "ain0"],
    "d7":     ["gpio", "ain1"],
    "d8":     ["gpio", "icp1"],                # CLKO skipped (fuse-dependent)
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
    "a6":     ["analog_only"],                 # ADC6, no digital I/O, no port bit
    "a7":     ["analog_only"],                 # ADC7, no digital I/O, no port bit
    "reset":  [],                              # active-low reset
    "reset2": [],                              # second reset header pin
    "gnd":    [],                              # power
    "gnd2":   [],                              # power
    "5v":     [],                              # power
    "3v3":    [],                              # power
    "vin":    [],                              # power
    "aref":   [],                              # ADC reference voltage
}

# ── RP2040 pin functions (Pi Pico) ──────────────────────────────────
# Source: docs/pin-table-rp2040.md (audit commit 465ac3a)
# Datasheet: RP2040 release 2023-03-02
#
# All GPIOs can do PWM (8 slices × 2 channels). Every GP pin gets "pwm"
# as a generic capability rather than specific slice IDs — the RP2040's
# flexible mux means the slice assignment is deterministic (GP n → slice
# n/16, channel A if even, B if odd) but not a "choice" the way ATmega
# timer outputs are. Using "pwm" (generic) not "pwm_t0a" etc.
#
# I2C and SPI alternate assignments repeat on a 4-GPIO cycle. The table
# shows the SDK defaults; all GPIOs COULD do any peripheral via the mux,
# but the pin table documents defaults only (per SESSION-STATE.md scope
# decision). Functions listed are what the SDK assigns by default.

PICO_FUNCTIONS = {
    # Left side (pins 1–20)
    "gp0":   ["gpio", "pwm", "txd0", "sda0", "spi0_rx"],
    "gp1":   ["gpio", "pwm", "rxd0", "scl0", "spi0_csn"],
    "gp2":   ["gpio", "pwm", "sda1", "spi0_sck"],
    "gp3":   ["gpio", "pwm", "scl1", "spi0_tx"],
    "gp4":   ["gpio", "pwm", "txd1", "sda0", "spi0_rx"],
    "gp5":   ["gpio", "pwm", "rxd1", "scl0", "spi0_csn"],
    "gp6":   ["gpio", "pwm", "sda1", "spi0_sck"],
    "gp7":   ["gpio", "pwm", "scl1", "spi0_tx"],
    "gp8":   ["gpio", "pwm", "txd1", "sda0", "spi1_rx"],
    "gp9":   ["gpio", "pwm", "rxd1", "scl0", "spi1_csn"],
    "gp10":  ["gpio", "pwm", "sda1", "spi1_sck"],
    "gp11":  ["gpio", "pwm", "scl1", "spi1_tx"],
    "gp12":  ["gpio", "pwm", "txd0", "sda0", "spi1_rx"],
    "gp13":  ["gpio", "pwm", "rxd0", "scl0", "spi1_csn"],
    "gp14":  ["gpio", "pwm", "sda1", "spi1_sck"],
    "gp15":  ["gpio", "pwm", "scl1", "spi1_tx"],
    # Right side (pins 21–40, bottom to top in sidecar)
    "gp16":  ["gpio", "pwm", "txd0", "sda0", "spi0_rx"],
    "gp17":  ["gpio", "pwm", "rxd0", "scl0", "spi0_csn"],
    "gp18":  ["gpio", "pwm", "sda1", "spi0_sck"],
    "gp19":  ["gpio", "pwm", "scl1", "spi0_tx"],
    "gp20":  ["gpio", "pwm", "txd1", "sda0", "spi0_rx"],
    "gp21":  ["gpio", "pwm", "rxd1", "scl0", "spi0_csn"],
    "gp22":  ["gpio", "pwm", "sda1", "spi0_sck"],
    # ADC pins
    "gp26":  ["gpio", "pwm", "adc0", "sda1", "spi1_sck"],
    "gp27":  ["gpio", "pwm", "adc1", "scl1", "spi1_tx"],
    "gp28":  ["gpio", "pwm", "adc2", "sda0", "spi1_rx"],
    # Fixed-function / power pins
    "run":      [],                            # active-low reset
    "adc_vref": [],                            # ADC reference
    "3v3":      [],                            # power
    "3v3_en":   [],                            # regulator enable
    "vsys":     [],                            # power
    "vbus":     [],                            # power
    "agnd":     [],                            # analog ground
    "gnd_1":    [],                            # ground
    "gnd_2":    [],
    "gnd_3":    [],
    "gnd_4":    [],
    "gnd_5":    [],
    "gnd_6":    [],
    "gnd_7":    [],
    # Debug pins
    "swclk":    [],                            # SWD clock, fixed debug
    "swd_gnd":  [],                            # SWD ground
    "swdio":    [],                            # SWD data, fixed debug
}

MCU_LOOKUP = {
    "stc_mcu": STC_FUNCTIONS,
    "arduino_nano": NANO_FUNCTIONS,
    "pi_pico": PICO_FUNCTIONS,
}


def process_sidecar(filepath):
    """Add functions field to every terminal in a sidecar."""
    with open(filepath) as f:
        data = json.load(f)

    kind = data["kind"]
    lookup = MCU_LOOKUP.get(kind)
    skipped = []

    for terminal in data["terminals"]:
        name = terminal["name"]
        if lookup is not None:
            if name in lookup:
                terminal["functions"] = lookup[name]
            else:
                # Terminal exists in sidecar but not in our lookup —
                # mark null (unaudited) and record it
                terminal["functions"] = None
                skipped.append(name)
        else:
            # Non-MCU part: null (not yet audited)
            terminal["functions"] = None

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')

    return kind, len(data["terminals"]), skipped


def main():
    files = sorted(glob.glob(os.path.join(PARTS_DIR, '*.json')))
    mcu_count = 0
    non_mcu_count = 0
    total_terminals = 0
    audited_terminals = 0
    all_skipped = {}

    for filepath in files:
        kind, n_terminals, skipped = process_sidecar(filepath)
        total_terminals += n_terminals

        if kind in MCU_LOOKUP:
            mcu_count += 1
            audited_terminals += (n_terminals - len(skipped))
            if skipped:
                all_skipped[kind] = skipped
        else:
            non_mcu_count += 1

    print(f"Processed {mcu_count} MCU sidecars, {non_mcu_count} non-MCU sidecars")
    print(f"Total terminals: {total_terminals}")
    print(f"Audited terminals (functions != null): {audited_terminals}")
    print(f"Unaudited terminals (functions = null): {total_terminals - audited_terminals}")

    if all_skipped:
        print("\nTerminals in MCU sidecars with no lookup (set to null):")
        for kind, names in all_skipped.items():
            print(f"  {kind}: {', '.join(names)}")
    else:
        print("\nAll MCU terminals have lookup entries — no gaps.")


if __name__ == '__main__':
    main()
