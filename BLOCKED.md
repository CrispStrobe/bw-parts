# Blocked items

> Updated: 2026-08-12

## bw-circuit-ui vendored sidecars are stale

The vendored copies in `bw-circuit-ui/src/parts-data/` are missing the
`functions` field on all terminals (Nano, Uno, Pico, and likely all 123
sidecars). The sync:parts script (`npm run sync:parts` in bw-circuit-ui)
needs re-running to pick up the functions data added in the bw-parts
`8c52a25` series. The pin-chooser dialog reads alternate functions from
this field — without it, pin meanings won't display.

**Owner:** bw-circuit-ui agent
**Unblocked by:** `cd bw-circuit-ui && npm run sync:parts`
