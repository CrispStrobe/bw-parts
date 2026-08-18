# Blocked items

> Updated: 2026-08-18

## AT89C2051 + STC15 emulation — blocked on emu8051

Both `at89c2051` and `stc15_mcu` have complete sidecars, SVGs, and
catalog entries. bw-circuit-ui has palette entries and DIP face labels.
Engine emulation is blocked on emu8051 adapter config — the 8051
emulator core exists but the device-specific wiring (port configs,
pin mappings, interrupt routing) has not been configured for these
two specific chips. Owner: emu8051-stc repo.

**Not blocking bw-parts work** — record only.
