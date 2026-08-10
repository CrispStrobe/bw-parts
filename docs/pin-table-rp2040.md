# RP2040 pin table — Raspberry Pi Pico

> **Datasheet source:** Raspberry Pi RP2040 datasheet (release 2023-03-02),
> §1.4 GPIO Functions, §2.19 GPIO, §4.3 ADC, §4.4 UART, §4.3 SPI,
> §4.2 I2C, §4.5 PWM.
>
> Also: Raspberry Pi Pico datasheet (release 2024-02-01), §2 Pin-out,
> §4 Pinout diagram.

## GPIO pins

All 30 user-accessible GPIOs (GP0–GP29) are 3.3 V, with configurable
pull-up/pull-down. Every GPIO can do PWM. Peripheral assignment is
flexible via the RP2040's I/O mux — the table shows the **default/primary**
assignments used by the Pico SDK and MicroPython.

| Pico pin | GPIO | Primary function | Alternate functions | Notes |
|---|---|---|---|---|
| 1 | GP0 | GPIO | UART0 TX, I2C0 SDA, SPI0 RX | Default UART0 TX |
| 2 | GP1 | GPIO | UART0 RX, I2C0 SCL, SPI0 CSn | Default UART0 RX |
| 3 | — | GND | — | Ground |
| 4 | GP2 | GPIO | I2C1 SDA, SPI0 SCK, UART0 CTS | |
| 5 | GP3 | GPIO | I2C1 SCL, SPI0 TX, UART0 RTS | |
| 6 | GP4 | GPIO | UART1 TX, I2C0 SDA, SPI0 RX | Default UART1 TX |
| 7 | GP5 | GPIO | UART1 RX, I2C0 SCL, SPI0 CSn | Default UART1 RX |
| 8 | — | GND | — | Ground |
| 9 | GP6 | GPIO | I2C1 SDA, SPI0 SCK, UART1 CTS | |
| 10 | GP7 | GPIO | I2C1 SCL, SPI0 TX, UART1 RTS | |
| 11 | GP8 | GPIO | UART1 TX, I2C0 SDA, SPI1 RX | |
| 12 | GP9 | GPIO | UART1 RX, I2C0 SCL, SPI1 CSn | |
| 13 | — | GND | — | Ground |
| 14 | GP10 | GPIO | I2C1 SDA, SPI1 SCK, UART1 CTS | |
| 15 | GP11 | GPIO | I2C1 SCL, SPI1 TX, UART1 RTS | |
| 16 | GP12 | GPIO | UART0 TX, I2C0 SDA, SPI1 RX | |
| 17 | GP13 | GPIO | UART0 RX, I2C0 SCL, SPI1 CSn | |
| 18 | — | GND | — | Ground |
| 19 | GP14 | GPIO | I2C1 SDA, SPI1 SCK, UART0 CTS | |
| 20 | GP15 | GPIO | I2C1 SCL, SPI1 TX, UART0 RTS | |
| 21 | GP16 | GPIO | UART0 TX, I2C0 SDA, SPI0 RX | Default SPI0 RX (MISO) |
| 22 | GP17 | GPIO | UART0 RX, I2C0 SCL, SPI0 CSn | Default SPI0 CS |
| 23 | — | GND | — | Ground |
| 24 | GP18 | GPIO | I2C1 SDA, SPI0 SCK, UART0 CTS | Default SPI0 SCK |
| 25 | GP19 | GPIO | I2C1 SCL, SPI0 TX, UART0 RTS | Default SPI0 TX (MOSI) |
| 26 | GP20 | GPIO | UART1 TX, I2C0 SDA, SPI0 RX | |
| 27 | GP21 | GPIO | UART1 RX, I2C0 SCL, SPI0 CSn | |
| 28 | — | GND | — | Ground |
| 29 | GP22 | GPIO | I2C1 SDA, SPI0 SCK, UART1 CTS | |
| 30 | — | RUN | — | Active-low reset; pull low to reset RP2040 |
| 31 | GP26 | GPIO | **ADC0**, I2C1 SDA, SPI1 SCK | ADC channel 0 |
| 32 | GP27 | GPIO | **ADC1**, I2C1 SCL, SPI1 TX | ADC channel 1 |
| 33 | — | GND/AGND | — | Analog ground reference |
| 34 | GP28 | GPIO | **ADC2**, I2C0 SDA, SPI1 RX | ADC channel 2 |
| 35 | — | ADC_VREF | — | ADC voltage reference (decouple to AGND) |
| 36 | — | 3V3(OUT) | — | 3.3 V regulated output from on-board SMPS |
| 37 | — | 3V3_EN | — | Pull low to disable 3.3 V regulator |
| 38 | — | GND | — | Ground |
| 39 | — | VSYS | — | 1.8–5.5 V system supply input |
| 40 | — | VBUS | — | USB 5 V (from micro-USB connector) |

## Pins not on header

| GPIO | Function | Notes |
|---|---|---|
| GP23 | SMPS PS pin | Controls power save mode of on-board regulator; not on header |
| GP24 | VBUS detect | High when USB 5 V present; not on header |
| GP25 | **Onboard LED** | Active high; directly drives the green LED on the Pico board |
| GP29 | VSYS/3 voltage sense | ADC3 channel; reads VSYS through a voltage divider; not on header |

## ADC

12-bit SAR ADC, 500 ksps, 4 channels (only 3 on header):

| Channel | GPIO | Pico pin | Notes |
|---|---|---|---|
| ADC0 | GP26 | 31 | On header |
| ADC1 | GP27 | 32 | On header |
| ADC2 | GP28 | 34 | On header |
| ADC3 | GP29 | — | VSYS/3 sense, not on header |
| ADC4 | — | — | Internal temperature sensor |

ADC reference is 3.3 V by default (from ADC_VREF pin, which is connected
to 3V3 via an R-C filter on the Pico board).

## PWM

Every GPIO can output PWM. The RP2040 has 8 PWM slices, each with two
channels (A and B). GPn uses slice `n/16` (integer division), channel A
if n is even, channel B if n is odd. Two GPIOs sharing a slice share
the same frequency but can have different duty cycles.

## UART

| UART | Default TX | Default RX | Notes |
|---|---|---|---|
| UART0 | GP0 | GP1 | Primary serial; SDK default |
| UART1 | GP4 | GP5 | Secondary serial |

Both UARTs can be remapped to many other GPIOs via the I/O mux.

## SPI

| SPI | Default SCK | Default TX (MOSI) | Default RX (MISO) | Default CS | Notes |
|---|---|---|---|---|---|
| SPI0 | GP18 | GP19 | GP16 | GP17 | SDK defaults |
| SPI1 | GP10 | GP11 | GP12 | GP13 | SDK defaults |

## I2C

| I2C | Default SDA | Default SCL | Notes |
|---|---|---|---|
| I2C0 | GP0 | GP1 | Shared with UART0 defaults — pick one |
| I2C1 | GP2 | GP3 | |

I2C pins are highly flexible — almost any GPIO can serve as I2C SDA or
SCL via the mux. The defaults above are the SDK's first choice.

## Power

| Pin | Voltage | Notes |
|---|---|---|
| VBUS | 5.0 V | From USB connector; do not back-power through this |
| VSYS | 1.8–5.5 V | System supply; Schottky-diode-OR'd with VBUS |
| 3V3(OUT) | 3.3 V | 300 mA from on-board buck converter |
| 3V3_EN | — | Pull low to shut down the 3.3 V rail |
| RUN | — | Active-low reset with internal pull-up |

## Key differences from ATmega328P

| | ATmega328P (Uno/Nano) | RP2040 (Pico) |
|---|---|---|
| Logic level | 5 V | **3.3 V** — not 5 V tolerant |
| ADC | 10-bit, 6 channels | 12-bit, 3 channels on header (+1 internal temp) |
| PWM pins | 6 specific pins | All 30 GPIOs |
| I/O mux | Fixed alternate functions | Flexible — most peripherals on most pins |
| Clock | 16 MHz | 125 MHz (default), up to 133 MHz |
| Cores | 1 | 2 (Cortex-M0+) |
| Flash | 32 KB (on-die) | 2 MB (external QSPI) |
| RAM | 2 KB | 264 KB |
