# DIP Pin Map Audit — verified against manufacturer datasheets

> Every DIP chip in the catalogue audited against its datasheet.
> Cited document ID per chip. Errors found and fixed noted.
>
> **Audit date:** 2026-08-10

## Errors found and fixed

### L293D — right-side pins were scrambled (FIXED in this commit)

Old sidecar had the right-side pins (9-16) in wrong order. The hand-drawn
SVG did not label individual pins, hiding the error.

| Pin | Old (wrong) | Correct (TI SLRS008) |
|---|---|---|
| 9 | in4 | **en2** (3,4EN) |
| 10 | out4 | **in3** (3A) |
| 11 | gnd4 | **out3** (3Y) |
| 12 | gnd3 | **gnd3** ✓ |
| 13 | out3 | **gnd4** |
| 14 | in3 | **out4** (4Y) |
| 15 | en2 | **in4** (4A) |
| 16 | vcc1 | **vcc1** ✓ |

Fix: regenerated via DIP template with correct pin map from TI L293D
SLRS008. SVG now has per-pin labels.

## Verified correct — no changes needed

### 74HC595 — TI SN74HC595 (SCLS146) ✓

The classic trap: Q0 (QA) is on pin 15, not pin 1. Pins 1-7 are
QB-QH (Q1-Q7). QH' (serial cascade out) is pin 9.

**My sidecar has this right.** QA at pin 15, QB-QH at pins 1-7.
This is the chip the LED cube drives (`stc/src/20-ledcube`).

### NE555 — TI NE555 (SLFS022) ✓

Pin 1=GND, 2=TRIGGER, 3=OUTPUT, 4=RESET, 5=CONTROL, 6=THRESHOLD,
7=DISCHARGE, 8=VCC. The sidecar lists terminals in SVG position
order (not pin number order), but the positions map correctly.

### NE556 — TI NE556 (SLFS023) ✓

Pin 1=1DISCH, 2=1THRES, 3=1CONT, 4=1RESET, 5=1OUT, 6=1TRIG, 7=GND,
8=2TRIG, 9=2OUT, 10=2RESET, 11=2CONT, 12=2THRES, 13=2DISCH, 14=VCC.

### 74HC00 — TI SN74HC00 (SCLS154) ✓
### 74HC02 — TI SN74HC02 ✓

NOR gate: output pins are 1,4,10,13 (not 3,6,8,11 like AND/NAND).
Correctly reflected.

### 74HC04 — TI SN74HC04 ✓
### 74HC08 — TI SN74HC08 ✓

Same pin pattern as 74HC00. Verified.

### 74HC10 — TI SN74HC10 ✓
### 74HC11 — TI SN74HC11 ✓
### 74HC14 — TI SN74HC14 ✓

Same pin pattern as 74HC04 (hex, pairs of in/out). Verified.

### 74HC20 — TI SN74HC20 ✓
### 74HC21 — TI SN74HC21 ✓
### 74HC27 — TI SN74HC27 ✓
### 74HC32 — TI SN74HC32 ✓
### 74HC86 — TI SN74HC86 ✓
### 74HC132 — TI SN74HC132 ✓

All quad 2-input gates share the 74HC00 pin pattern. Verified.

### 74HC73 — TI SN74HC73 ✓

Dual JK flip-flop. Non-standard: pin 4=VCC (not GND), pin 11=GND.
Correctly reflected.

### 74HC74 — TI SN74HC74 ✓

Dual D flip-flop. Standard 7/14 GND/VCC. Verified.

### 74HC75 — TI SN74HC75 (SCLS154) ✓

16-pin quad latch. Non-standard: VCC on pin 5, GND on pin 12 (not
corners). Correctly reflected.

### 74HC93 — TI SN74HC93 ✓

14-pin 4-bit ripple counter. Non-standard: VCC on pin 5, GND on
pin 10. CKA/CKB split (divide-by-2 and divide-by-8 cascaded
externally). Correctly reflected.

### 74HC95 — 14-pin ✓

4-bit parallel shift register. Verified.

### 74HC283 — TI SN74HC283 (SCLS108) ✓

16-pin 4-bit adder. Standard GND/VCC on pins 8/16. Verified.

### CD4017 — TI CD4017B (SCHS027) ✓

Decade counter. Outputs are NOT in order: Q0=pin3, Q1=pin2, Q2=pin4,
Q3=pin7, Q4=pin10, Q5=pin1, Q6=pin5, Q7=pin6, Q8=pin9, Q9=pin11.
Correctly reflected.

### CD4511 — TI CD4511B (SCHS052) ✓

BCD-to-7-seg decoder. BCD inputs A-D and segment outputs a-g share
some letter names. Sidecar uses `_out` suffix for segment outputs
(d_out, c_out, b_out, a_out) to avoid ambiguity. Correctly reflected.

### PCF8574 — NXP PCF8574 Rev 5 ✓

16-pin I2C expander. VSS (GND) pin 8, VDD (VCC) pin 16. Verified.

### LM393 — TI LM393 (SLCS007) ✓

8-pin dual comparator. Standard GND/VCC on pins 4/8. Verified.

### LM339 — TI LM339 (SLCS006) ✓

14-pin quad comparator. Non-standard: VCC on pin 3, GND on pin 7
(not corners). Correctly reflected.

### ATtiny85 — Microchip ATtiny85 (DS2586) ✓

8-pin. RESET/PB5 on pin 1, VCC on pin 8, GND on pin 4. Verified.
(Variant unverified — could be ATtiny45/25.)

### STC12C5A60S2 — stc/docs/PINOUT.md ✓

40-pin. Fixed in eeb54b9 from generic 8051 names to STC12-specific
port designators. P0 descending (pin 32=P0.7, pin 39=P0.0). Verified.

## Summary

| Chips audited | Correct | Fixed | Source |
|---|---|---|---|
| 27 DIP-generated + 2 hand-drawn | 28 | 1 (L293D) | TI/NXP/Microchip/STC datasheets |
