# STC12C5A60S2 pin table — PDIP-40 audit

> **Datasheet source:** STC MCU Limited, STC12C5A60S2/STC12LE5A60S2
> datasheet, revision 2011-07-15.
> https://www.stcmicro.com/datasheet/STC12C5A60S2-en.pdf
>
> **Cross-reference:** `stc/docs/PINOUT.md` (the bench reference in
> `/mnt/volume1/code/stc`).
>
> **Sidecar:** `parts/stc_mcu.json` (bw-parts).
>
> **DIP generator:** `generate-dip.js` pin map for kind `stc_mcu`.

## PDIP-40 pin map — three-way comparison

The datasheet is the authority. PINOUT.md and stc_mcu.json are checked
against it.

| Pin | Datasheet | PINOUT.md | stc_mcu.json | generate-dip.js | Match |
|---:|---|---|---|---|---|
| 1 | P1.0 / ADC0 / CLKOUT2 | P1.0 / ADC0 / CLKOUT2 | P1.0 | P1.0 | **yes** |
| 2 | P1.1 / ADC1 | P1.1 / ADC1 | P1.1 | P1.1 | **yes** |
| 3 | P1.2 / ADC2 / ECI / RxD2 | P1.2 / ADC2 / ECI / RxD2 | P1.2 | P1.2 | **yes** |
| 4 | P1.3 / ADC3 / CCP0 / TxD2 | P1.3 / ADC3 / CCP0 / TxD2 | P1.3 | P1.3 | **yes** |
| 5 | P1.4 / ADC4 / CCP1 / SS | P1.4 / ADC4 / CCP1 / SS | P1.4 | P1.4 | **yes** |
| 6 | P1.5 / ADC5 / MOSI | P1.5 / ADC5 / MOSI | P1.5 | P1.5 | **yes** |
| 7 | P1.6 / ADC6 / MISO | P1.6 / ADC6 / MISO | P1.6 | P1.6 | **yes** |
| 8 | P1.7 / ADC7 / SCLK | P1.7 / ADC7 / SCLK | P1.7 | P1.7 | **yes** |
| 9 | RST / P4.7 | RST / P4.7 | RST | RST | **yes** (sidecar omits P4.7 alias, acceptable) |
| 10 | P3.0 / RxD / INT | P3.0 / RxD / INT | P3.0 | P3.0 | **yes** |
| 11 | P3.1 / TxD | P3.1 / TxD | P3.1 | P3.1 | **yes** |
| 12 | P3.2 / INT0 | P3.2 / INT0 | P3.2 | P3.2 | **yes** |
| 13 | P3.3 / INT1 | P3.3 / INT1 | P3.3 | P3.3 | **yes** |
| 14 | P3.4 / T0 / INT / CLKOUT0 | P3.4 / T0 / INT / CLKOUT0 | P3.4 | P3.4 | **yes** |
| 15 | P3.5 / T1 / INT / CLKOUT1 | P3.5 / T1 / INT / CLKOUT1 | P3.5 | P3.5 | **yes** |
| 16 | P3.6 / WR | P3.6 / WR | P3.6 | P3.6 | **yes** |
| 17 | P3.7 / RD | P3.7 / RD | P3.7 | P3.7 | **yes** |
| 18 | XTAL2 | XTAL2 | XTAL2 | XTAL2 | **yes** |
| 19 | XTAL1 | XTAL1 | XTAL1 | XTAL1 | **yes** |
| 20 | GND | GND | GND | GND | **yes** |
| 21 | P2.0 / A8 | P2.0 / A8 | P2.0 | P2.0 | **yes** |
| 22 | P2.1 / A9 | P2.1 / A9 | P2.1 | P2.1 | **yes** |
| 23 | P2.2 / A10 | P2.2 / A10 | P2.2 | P2.2 | **yes** |
| 24 | P2.3 / A11 | P2.3 / A11 | P2.3 | P2.3 | **yes** |
| 25 | P2.4 / A12 | P2.4 / A12 | P2.4 | P2.4 | **yes** |
| 26 | P2.5 / A13 | P2.5 / A13 | P2.5 | P2.5 | **yes** |
| 27 | P2.6 / A14 | P2.6 / A14 | P2.6 | P2.6 | **yes** |
| 28 | P2.7 / A15 | P2.7 / A15 | P2.7 | P2.7 | **yes** |
| 29 | P4.4 / NA | P4.4 / NA | P4.4 | P4.4 | **yes** |
| 30 | P4.5 / ALE | P4.5 / ALE | P4.5 | P4.5 | **yes** |
| 31 | P4.6 / EX_LVD / RST2 | P4.6 / EX_LVD / RST2 | P4.6 | P4.6 | **yes** |
| 32 | P0.7 / AD7 | P0.7 / AD7 | P0.7 | P0.7 | **yes** |
| 33 | P0.6 / AD6 | P0.6 / AD6 | P0.6 | P0.6 | **yes** |
| 34 | P0.5 / AD5 | P0.5 / AD5 | P0.5 | P0.5 | **yes** |
| 35 | P0.4 / AD4 | P0.4 / AD4 | P0.4 | P0.4 | **yes** |
| 36 | P0.3 / AD3 | P0.3 / AD3 | P0.3 | P0.3 | **yes** |
| 37 | P0.2 / AD2 | P0.2 / AD2 | P0.2 | P0.2 | **yes** |
| 38 | P0.1 / AD1 | P0.1 / AD1 | P0.1 | P0.1 | **yes** |
| 39 | P0.0 / AD0 | P0.0 / AD0 | P0.0 | P0.0 | **yes** |
| 40 | VCC | VCC | VCC | VCC | **yes** |

## Result: all three sources agree on all 40 pins

No disagreements found. The five traps were checked explicitly:

### Trap 1: VCC is pin 40, GND is pin 20

**Confirmed.** All three sources agree. The STC15 series puts VCC on
pin 18 and RST on pin 17 — this is the STC12, not the STC15, and the
sidecar correctly shows VCC at pin 40 (terminal at x=80, the rightmost
position at the top of the right side, which is pin 40 in standard DIP
numbering — down the left, up the right).

### Trap 2: P0 runs descending (pin 32 = P0.7, pin 39 = P0.0)

**Confirmed.** All three sources show P0 descending. The sidecar
terminals list P0.7 first (at y=48, pin 32) through P0.0 last (at
y=13, pin 39), matching the datasheet. The generate-dip.js pin array
also has them in the correct order: `P0.7, P0.6, P0.5, P0.4, P0.3,
P0.2, P0.1, P0.0` at positions 32–39.

### Trap 3: No EA, no PSEN

**Confirmed.** Neither `EA` nor `PSEN` appears in any of the three
sources. Pin 29 is P4.4/NA, pin 30 is P4.5/ALE, pin 31 is
P4.6/EX_LVD/RST2. This was the error caught and fixed in commit
`eeb54b9` — the original sidecar had used generic 8051 names including
PSEN, ALE, and EA, which do not exist on this chip.

### Trap 4: Only P4.4–P4.7 on PDIP-40

**Confirmed.** The sidecar has exactly four P4 pins: P4.4 (pin 29),
P4.5 (pin 30), P4.6 (pin 31), and RST/P4.7 (pin 9). P4.0–P4.3 are
not bonded on the PDIP-40 package (they appear only on PLCC-44 and
LQFP-44/48).

### Trap 5: Reset is active HIGH

**Not represented in the sidecar.** The sidecar names pin 9 as `RST`,
which is correct, but does not indicate polarity. PINOUT.md correctly
states "active high" in §Reset. This is a property of the pin's
electrical behaviour, not its name — the sidecar format has no field
for it. bw-board's engine model is where this must be enforced.

## Notes on what the sidecar omits

The sidecar uses **port designator names only** (P1.0, P3.0, RST, etc.)
without the alternate function names (ADC0, RxD, INT0, CCP0, etc.).
This is deliberate — the same convention as the generate-dip.js pin map.
The alternate functions are documented in the pin table (this file) and
in PINOUT.md, and are the data the pin-chooser dialog should display.

The sidecar also omits XTAL1/XTAL2's functional role (they are the
crystal oscillator pins) and does not mark GND/VCC as power pins vs
signal pins. These are standard DIP conventions that bw-board's loader
should handle by name pattern.

## Comparison method

1. Read the PDIP-40 pin diagram from the STC12C5A60S2 datasheet (§ pin
   configuration, the diagram on the first page of the electrical section).
2. Read the PDIP-40 pin table from `stc/docs/PINOUT.md` lines 35–56.
3. Read the terminal list from `parts/stc_mcu.json` (40 entries).
4. Read the pin array from `generate-dip.js` lines 253–260.
5. Compared pin-by-pin across all four, checking name, position, and
   ordering. For P0, specifically verified descending order (P0.7 at
   pin 32 through P0.0 at pin 39).
6. Verified absence of EA, PSEN by searching all four sources.
7. Verified VCC/GND positions (40 and 20).
8. Verified P4.x coverage (only .4–.7 on PDIP-40).
