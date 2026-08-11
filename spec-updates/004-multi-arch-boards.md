# Spec-update 004: Arduino Nano and Raspberry Pi Pico — board sidecars and pin tables

> **Date:** 2026-08-10
> **From:** bw-parts
> **To:** bw-board (when it resumes), bw-circuit-ui
> **Commit:** 465ac3a

## What was delivered

bw-parts now ships sidecars, SVG art, and datasheet-audited pin tables
for two new boards:

| Board | Kind slug | MCU | Terminals | Pin table |
|---|---|---|---|---|
| Arduino Nano | `arduino_nano` | ATmega328P | 30 | `docs/pin-table-atmega328p.md` |
| Raspberry Pi Pico | `pi_pico` | RP2040 | 43 | `docs/pin-table-rp2040.md` |

The existing `arduino_uno` sidecar (28 terminals) is unchanged but now
references the same ATmega328P pin table.

## What bw-board must do

### 1. Register the new board kinds in the part-model loader

`arduino_nano` has 30 terminals (vs Uno's 28). The two extras are A6
and A7 — **analog-only pins with no digital I/O and no port register
bit** (they are ADC channels 6 and 7 directly). The part-model loader
must accept a 30-terminal sidecar without treating A6/A7 as GPIOs.

`pi_pico` has 43 terminals (40 header pins + 3 SWD debug). This is
larger than any current sidecar. The loader must handle it. Eight of
the 43 are GND (named `gnd_1` through `gnd_7` plus `agnd`); they are
electrically identical but positionally distinct for wiring purposes.

### 2. Expose pin alternate-function data to the UI pin-chooser

The pin tables document per-pin alternate functions in the format the
designer's pin-chooser dialog needs. Examples:

**ATmega328P (from `docs/pin-table-atmega328p.md`):**
- D3 → PD3 → INT1, OC2B (PWM) — external interrupt + Timer2 PWM
- D13 → PB5 → SCK, onboard LED — SPI clock, also drives LED
- A4 → PC4 → ADC4, SDA (TWI) — I2C data line

**RP2040 (from `docs/pin-table-rp2040.md`):**
- GP0 → UART0 TX, I2C0 SDA, SPI0 RX — flexible mux, SDK default is UART0 TX
- GP26 → ADC0, I2C1 SDA, SPI1 SCK — ADC channel 0
- GP25 → onboard LED — NOT on header, internal only

bw-board decides the data format for this. The pin tables are
human-readable markdown; if bw-board needs structured JSON, it should
specify the schema and bw-parts will produce it.

### 3. Handle 3.3V vs 5V logic levels

The Pico is **3.3V logic and is NOT 5V tolerant**. If bw-board's DRC
checks logic-level compatibility (e.g. warning when a 3.3V output
drives a 5V input), the `pi_pico` board needs to be marked as 3.3V.
The Uno and Nano are 5V.

## What was NOT delivered — the boundary

**Parts and pin tables are not a simulation model.** bw-parts delivered
terminals, art, and pin-function documentation. It did not deliver and
did not design:

- An RP2040 peripheral model (PIO, DMA, dual-core, flexible I/O mux)
- Debug or trace support for AVR or ARM architectures

### Execution engine status (updated 2026-08-11)

| Board | Engine | Status |
|---|---|---|
| `arduino_uno` | avr8js | modeled — AVR execution via avr8js |
| `arduino_nano` | avr8js | modeled — same ATmega328P as Uno |
| `pi_pico` | rp2040js | modeled — lite has `rp2040js-adapter.js` with UF2 image loading and timing test (`bc6476d`, `9f48ad2`, `d044648`) |

The original version of this spec-update (2026-08-10) stated the Pico
had no execution engine (`drawable-only`). That was true when written.
lite has since added an RP2040 adapter, making the Pico executable.
The PARTS-CATALOG.md engine column has been updated to match.

## Datasheet audit trail

Every pin assignment in the tables was checked against a named datasheet
revision so the next person can re-verify rather than trust:

| MCU | Datasheet | Revision | Sections checked |
|---|---|---|---|
| ATmega328P | Microchip DS40002061B | current | §1 Pin Configurations, §14 I/O Ports, §24 ADC, §19 SPI, §22 TWI, §20 USART, §16 Timer/Counter |
| RP2040 | Raspberry Pi RP2040 | 2023-03-02 | §1.4 GPIO Functions, §2.19 GPIO, §4.3 ADC, §4.4 UART, §4.3 SPI, §4.2 I2C, §4.5 PWM |
| RP2040 (board) | Raspberry Pi Pico | 2024-02-01 | §2 Pin-out, §4 Pinout diagram |

The STC12C5A60S2 pin table (`stc/docs/PINOUT.md`) was already audited
in bw-parts commit `eeb54b9` and the DIP audit in `DIP-AUDIT.md`.

## For bw-circuit-ui

Two new board SVGs and sidecars are available for palette rendering:
`parts/arduino_nano.{svg,json}` and `parts/pi_pico.{svg,json}`. Both
use the standard sidecar format. The Nano is 60x160 (vertical,
breadboard-oriented); the Pico is 60x210 (same orientation).
