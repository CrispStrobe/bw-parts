# Spec-update 006: stale hobby_gearmotor references in bw-circuit-ui

> **Date:** 2026-08-11
> **From:** bw-parts
> **To:** bw-circuit-ui

## Context

Slug rename `hobby_gearmotor` → `gearmotor` landed in bw-parts `db77e8b`.
The sidecar resync in bw-circuit-ui `4064e96` correctly deleted the old
JSON and vendored the new one. But five code references still use the old
slug:

| File | Line | What it does |
|---|---|---|
| `src/model/drc.js` | 126 | high-current load check — lists `hobby_gearmotor` |
| `src/model/drc.js` | 219 | inductive kinds — lists **both** `hobby_gearmotor` AND `gearmotor` |
| `src/model/circuit.js` | 952 | terminal getter — case `hobby_gearmotor` |
| `src/model/wire-router.js` | 112 | bounding box — case `hobby_gearmotor` |
| `src/components/PartThumbnail.jsx` | 341 | rendering — case `hobby_gearmotor` |

## What to do

Replace `hobby_gearmotor` with `gearmotor` in all five locations. In
`drc.js:219` the set already has `gearmotor`, so just remove the
duplicate `hobby_gearmotor` entry.

## Impact if not fixed

Any circuit placing a gearmotor will use slug `gearmotor` (from the
sidecar). The DRC, wire router, circuit model, and thumbnail renderer
will not match it — they still look for `hobby_gearmotor`. The part
renders but gets no bounding box, no terminal names, no DRC checks, and
a generic thumbnail.
