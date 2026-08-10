# ATmega328P pin table — Arduino Uno R3 / Arduino Nano

> **Datasheet source:** Microchip ATmega328P datasheet (DS40002061B),
> §1 Pin Configurations, §14 I/O Ports, §24 ADC, §19 SPI, §22 TWI,
> §20 USART, §16 Timer/Counter.
>
> Applies to both Uno R3 and Nano — same MCU, same pin mapping,
> different board footprint and header layout.

## Digital pins

| Arduino pin | ATmega328P port | Alternate functions | Notes |
|---|---|---|---|
| D0 | PD0 | RXD (USART input) | **UART RX** — bootloader uses this; avoid while flashing |
| D1 | PD1 | TXD (USART output) | **UART TX** — bootloader uses this; avoid while flashing |
| D2 | PD2 | INT0 (external interrupt 0) | Rising, falling, or level trigger |
| D3 | PD3 | INT1, OC2B (**PWM**) | External interrupt 1 + Timer2 PWM output B |
| D4 | PD4 | T0 (Timer0 external clock) | XCK (USART external clock) in synchronous mode |
| D5 | PD5 | OC0B (**PWM**), T1 | Timer0 PWM output B, Timer1 external clock |
| D6 | PD6 | OC0A (**PWM**), AIN0 | Timer0 PWM output A, analog comparator + input |
| D7 | PD7 | AIN1 | Analog comparator − input |
| D8 | PB0 | ICP1, CLKO | Timer1 input capture, clock output (if CKOUT fuse set) |
| D9 | PB1 | OC1A (**PWM**) | Timer1 PWM output A (16-bit) |
| D10 | PB2 | OC1B (**PWM**), SS | Timer1 PWM output B, **SPI slave select** |
| D11 | PB3 | OC2A (**PWM**), MOSI | Timer2 PWM output A, **SPI MOSI** |
| D12 | PB4 | MISO | **SPI MISO** |
| D13 | PB5 | SCK | **SPI SCK**, **onboard LED** (active high on both Uno and Nano) |

## Analog pins

| Arduino pin | ATmega328P port | Alternate functions | Notes |
|---|---|---|---|
| A0 | PC0 | ADC0 | 10-bit ADC channel 0 |
| A1 | PC1 | ADC1 | 10-bit ADC channel 1 |
| A2 | PC2 | ADC2 | 10-bit ADC channel 2 |
| A3 | PC3 | ADC3 | 10-bit ADC channel 3 |
| A4 | PC4 | ADC4, **SDA** (TWI data) | I2C data line; internal pull-up available |
| A5 | PC5 | ADC5, **SCL** (TWI clock) | I2C clock line; internal pull-up available |

## PWM summary

Six PWM-capable pins, three timers:

| Timer | Pins | Resolution | Notes |
|---|---|---|---|
| Timer0 | D5 (OC0B), D6 (OC0A) | 8-bit | Also used for millis()/delay() — changing prescaler affects timing |
| Timer1 | D9 (OC1A), D10 (OC1B) | 16-bit | Best resolution; can do servo control directly |
| Timer2 | D3 (OC2B), D11 (OC2A) | 8-bit | Asynchronous operation possible with external 32.768 kHz crystal |

## SPI bus

| Function | Pin | Notes |
|---|---|---|
| MOSI | D11 | Master out, slave in |
| MISO | D12 | Master in, slave out |
| SCK | D13 | Serial clock (also drives onboard LED) |
| SS | D10 | Slave select; must be OUTPUT for master mode, or SPI hardware switches to slave |

## I2C (TWI) bus

| Function | Pin | Notes |
|---|---|---|
| SDA | A4 | Data; needs external pull-up (4.7 kΩ typical) unless enabled internally |
| SCL | A5 | Clock; same pull-up requirement |

## UART

| Function | Pin | Notes |
|---|---|---|
| RX | D0 | Shared with USB-serial (ATmega16U2 on Uno, CH340/FTDI on Nano) |
| TX | D1 | Same — serial monitor and sketch upload use these pins |

## Power pins (header, not MCU)

| Pin | Voltage | Notes |
|---|---|---|
| 5V | 5.0 V | Regulated output (or input if externally powered) |
| 3V3 | 3.3 V | From on-board regulator, 50 mA max on Uno |
| VIN | 7–12 V | Raw input to on-board regulator |
| GND | 0 V | Multiple GND pins on header |
| RESET | — | Active low; momentary low resets the MCU |
| AREF | — | External ADC reference voltage (leave floating for default 5 V ref) |

## Board differences: Uno vs Nano

| | Uno R3 | Nano |
|---|---|---|
| Form factor | Standard shield-compatible | Mini breadboard-friendly |
| USB | Type B (ATmega16U2 bridge) | Mini-B (CH340G or FTDI FT232RL) |
| Extra analog pins | A0–A5 only | A0–A5 on header, A6/A7 analog-only (no digital) |
| Voltage regulator | NCP1117 (1 A) | AMS1117 (800 mA) |
| Reset | Button + header pin | Button + header pin |

A6 and A7 on the Nano are **analog input only** — they have no digital
I/O capability and no port register bit. They are ADC channels 6 and 7
directly. The Uno does not expose them on the header.
