# Evidence note: STC12 pin map — what the cross-check missed

> This documents a real case for the taxonomy in
> `stc/docs/EVIDENCE-CATEGORIES.md`. It belongs there as an example
> under category 2. Filed from bw-parts because the error and the
> fix both originated here.

## The error

`bw-parts` commit `8173386` (2026-08-10) shipped a 40-pin DIP sidecar
for the STC12C5A60S2 using **generic 8051 functional names**:

    pin 10: rxd     (should be P3.0)
    pin 29: psen    (should be P4.4)
    pin 30: ale     (should be P4.5)
    pin 31: ea      (should be P4.6)

`PSEN`, `ALE`, and `EA` **do not exist on this part**. The STC12 has no
external memory bus — those pins are P4.x GPIOs. `stc/CLAUDE.md` warns
about exactly this substitution: *"a great many STC12 tutorials online
are AT89C51 text with the part number swapped, and get P0, ALE, PSEN and
EA wrong."*

The project had reproduced in its own data the exact failure its own lab
notes document as a trap.

## What caught it

`bw-parts` commit `eeb54b9` fixed the pin map by checking against
`stc/docs/PINOUT.md` — the lab's reference document, sourced from the
official STC12C5A60S2 datasheet (STC MCU Limited, rev 2011-07-15).

The fix found three classes of error:
1. **Pins that don't exist** on this package (PSEN, ALE, EA)
2. **Wrong naming convention** (functional aliases vs port designators)
3. **P0 descending order** confirmed (pin 32=P0.7, pin 39=P0.0)

## What did NOT catch it

`bw-circuit-ui` commit `341e3db` ran a terminal cross-check between its
own registry and `bw-parts`' sidecars, and reported agreement. But
`bw-circuit-ui` has no `PSEN` anywhere — so a real disagreement existed,
and the cross-check did not surface it.

This is consistent with at least one of:
- The cross-check did not cover the MCU kind
- It compared only names present on both sides, making extra/missing
  terminals invisible
- It ran before the incorrect sidecar existed

## Evidence category

This is a **category 2 limitation demonstrated on real data**: two agents
agreed (or appeared to agree), while one of them was wrong. The error was
found by comparing against the **source document** (the datasheet, via
the lab's PINOUT.md), not by comparing against another agent.

The distinction between category 2a (two agents agree, both read the same
source) and category 2b (one agent checks against the source directly)
is exactly what played out here:

- **2a would have missed it**: bw-circuit-ui and bw-parts both lacked
  PSEN, so they agreed — but neither had checked the datasheet for what
  pins 29-31 actually are.
- **2b caught it**: bw-parts read stc/docs/PINOUT.md, which names P4.4,
  P4.5, P4.6 for those pins, and the error was immediately visible.

## What would move this to category 1

A physical STC12C5A60S2 chip, a multimeter, and 30 seconds: set P4.4 to
push-pull output high, measure pin 29 with a voltmeter. If it reads VCC,
the pin map is correct. If it reads floating, something is still wrong.
