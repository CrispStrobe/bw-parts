# GUITION ESP32-4848S040 C_I board

This part describes the common display/touch board with an ESP32-S3, 16 MB
flash, 8 MB octal PSRAM, a 480 × 480 ST7701 RGB display and GT911 touch.
It is a board profile, separate from a generic ESP32-S3 SoC target. Optional
one-relay, three-relay and audio assemblies are not implied by the part.

## Accessible connector

Only **rear H1** is represented as connectable terminals. Looking at the
labelled rear header, its four rows are:

| Row | Left | Terminal name | Right | Terminal name |
|---|---|---|---|---|
| 1 | GND | `gnd` | GND | `gnd2` |
| 2 | GPIO40 | `gpio40` | UART0 RX / GPIO44 | `gpio44` |
| 3 | GPIO2 | `gpio2` | UART0 TX / GPIO43 | `gpio43` |
| 4 | GPIO1 | `gpio1` | 5 V supply | `5v` |

The sidecar preserves this row-major order. Both grounds are the same board
ground. P1 duplicates UART0 RX/TX, ground and 5 V; it does not add GPIOs.
There is no exposed 3.3 V terminal in this profile. GPIO uses 3.3 V logic
and is not 5 V tolerant; the 5 V connector supplies the board regulator.

The original drawing combines the front display and a labelled **rear H1
inset**. Its screen aperture is `(16,16,124,124)` in a `240 × 160` SVG view
box. Connector coordinates are drawing coordinates, not mechanical
measurements. `footprint: null` prevents direct breadboard seating.

## Internal wiring

| Function | ESP32-S3 GPIOs |
|---|---|
| LCD 3-wire, 9-bit serial configuration | CS 39, SCK 48, MOSI 47 |
| LCD control | DE 18, VSYNC 17, HSYNC 16, PCLK 21 |
| Red, least significant bit first | 11, 12, 13, 14, 0 |
| Green, least significant bit first | 8, 20, 3, 46, 9, 10 |
| Blue, least significant bit first | 4, 5, 6, 7, 15 |
| Backlight | 38, active high |
| GT911 touch | SDA 19, SCL 45; no exposed reset/interrupt connection |
| microSD | CS 42, MISO 41, MOSI 47, SCK 48 |
| Flash/PSRAM reservation | 26–32; octal PSRAM also occupies 33–37 |

These are reserved internal signals, **not terminals**. GPIO22–25 do not
exist on the ESP32-S3. GPIO0, 3, 45 and 46 are strapping pins and are already
consumed internally on this board. GPIO40/2/1 can be connected to optional
relays or an I2S audio assembly; that assembly must be checked before using
them as expansion pins. Neither assembly is simulated by the drawing.

GT911 normally uses the 7-bit address `0x5d` and is polled on this board.
The controller also supports `0x14` when selected at reset; this is not a
second simultaneous touch device. The RGB bus physically carries 16-bit
RGB565 pixels. Arduino_GFX's board-specific `st7701_type9_init_operations`
contains COLMOD `0x60`; the initialization byte must not be mistaken for
18 connected RGB data lines. Arduino_GFX performs display rotation in
software. Art and pin metadata do not assert hardware MADCTL rotation.

USB-C uses a USB-to-UART bridge. Native ESP32-S3 USB uses GPIO19/20, which
this board consumes for touch and RGB data. Do not infer native USB CDC or
USB JTAG support from the S3 SoC capabilities. UART flashing uses the
`esp32s3` target, with the ESP32-S3 bootloader at flash offset zero.

## Sources and limits

- [GUITION downloads](https://www.guition.com/-download), including the
  [ESP32-4848S040 English specification](https://www.guition.com/icms/upload/fb081940d6fc11f09850077a33e1404f/FTPData/UEditor/file/2026121/1768961092477/ESP32-4848S040%20Specifications-EN.pdf).
  The cover names S043 while the board table names S040; cross-check the
  purchased board and assembly rather than treating that cover as a new pinout.
- [Arduino_GFX board definition at `6da54cb7`](https://github.com/moononournation/Arduino_GFX/blob/6da54cb7f7ce6fde1ef8435186eb60406ea4caa0/examples/PDQgraphicstest/Arduino_GFX_dev_device.h),
  `ESP32_4848S040_86BOX_GUITION`, and
  [ST7701 type 9 initialization](https://github.com/moononournation/Arduino_GFX/blob/6da54cb7f7ce6fde1ef8435186eb60406ea4caa0/src/display/Arduino_RGB_Display.h).
- [ESPHome board profile and connector photo](https://devices.esphome.io/devices/guition-esp32-s3-4848s040/).
  The H1 terminal map is transcribed from the labelled connector photograph;
  no photographic pixels or SVG paths were copied into the original art.
- [HomeDing board notes](https://homeding.github.io/boards/esp32s3/panel-4848S040.htm)
  confirm polling touch without wired interrupt/reset and USB-to-UART.
  Its prose has conflicting I2C/SPI pin examples; the executable Arduino_GFX
  and ESPHome definitions above take precedence for the pin map.
- [Espressif ESP32-S3 GPIO restrictions](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-reference/peripherals/gpio.html),
  [ESP32-S3 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf),
  [USB pins](https://docs.espressif.com/projects/esp-usb/en/latest/esp32s3/usb_device.html)
  and [boot mode selection](https://docs.espressif.com/projects/esptool/en/latest/esp32s3/advanced-topics/boot-mode-selection.html).

Pin metadata and the static artwork do not qualify firmware execution,
display/touch emulation, Wi-Fi/Bluetooth, SD, audio, relays, electrical current
ratings or cycle/pixel timing. Such capabilities require separately tested
engine and consumer support. RGB blanking timings differ between published
driver profiles and are intentionally not asserted by this physical part.
