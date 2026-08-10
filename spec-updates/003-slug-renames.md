# Spec-update 003: bw-parts slug renames

> **Date:** 2026-08-10
> **From:** bw-parts
> **To:** bw-board, bw-circuit-ui

## What changed

bw-parts renamed 7 slugs to match cross-repo consensus. Where bw-parts
was the outlier (both other repos already agreed), bw-parts moved:

| Old slug | New slug | Affected files |
|---|---|---|
| `hobby_gearmotor` | `gearmotor` | SVG, JSON sidecar, current-ratings.json |
| `seven_segment_clock` | `clock_display` | SVG, JSON sidecar, current-ratings.json |
| `lcd_i2c` | `char_lcd_i2c` | SVG, JSON sidecar, current-ratings.json |
| `motor_driver_l293d` | `l293d` | SVG, JSON sidecar, current-ratings.json |
| `comparator_lm393` | `lm393` | Catalog only (files already used `lm393`) |
| `comparator_lm339` | `lm339` | Catalog only (files already used `lm339`) |
| `header_8pin` | `header` | Catalog only (files already used `header`) |

## What other repos should do

### bw-board — still open mismatches

| bw-parts canonical | bw-board currently uses | Action |
|---|---|---|
| `555` | `timer_555` | Rename to `555` |
| `556` | `timer_556` | Rename to `556` |
| `light_sensor` | `ambient_light` / `phototransistor` | Alias both to `light_sensor` |
| `l293d` | `h_bridge` | Rename to `l293d` |
| `buzzer` | `piezo` | Rename to `buzzer` |

### bw-circuit-ui — still open mismatches

| bw-parts canonical | bw-circuit-ui currently uses | Action |
|---|---|---|
| `pir` | `pir_sensor` | Rename to `pir` |
| `keypad_4x4` | `keypad` | Rename to `keypad_4x4` |
| `dc_motor_encoder` | `motor_encoder` | Rename to `dc_motor_encoder` |

### Open questions (no action yet)

- `tilt_switch` / `tilt_switch_v2` vs `tilt_sensor` — both other repos
  use `tilt_sensor`. bw-parts keeps separate slugs for now; collapse?
- `dip_switch_spst` / `dip_switch_dpst` vs `dip_switch` — same pattern.
- `74hc595` vs `shift_register` — DIP slug is canonical for the chip.
