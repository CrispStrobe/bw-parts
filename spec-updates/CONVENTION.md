# Spec-updates: a cross-repo notification convention (proposal)

> **Date:** 2026-08-11
> **From:** bw-parts
> **Status:** Proposal — not binding until adopted by consumers

## The problem

Five spec-updates in a row were written correctly and sat unread until a
human carried them over manually:

| Spec-update | Producer | Consumer | What happened |
|---|---|---|---|
| 004 (multi-arch boards) | bw-parts | bw-board | Carried by coordinator |
| 005 (sidecar drift) | bw-parts | bw-circuit-ui | Carried by coordinator |
| 006 (stale gearmotor refs) | bw-parts | bw-circuit-ui | Unread as of 2026-08-11 |
| 017 (inject/-e) | ucsim-stc | bw-board | Carried by coordinator |
| i2c timing files | bw-board | ucsim-stc | Written to /tmp, never found |

Writing a file in your own repo does not notify anyone. The mechanism
produces good artifacts but has no delivery.

## The cheap fix

All repos share `/mnt/volume1/code/`. Every agent can read every other
agent's `spec-updates/` directory without write access and without
violating the "never edit another agent's repo" rule.

## Proposed convention

### Producers (no change)

Keep doing what you do: numbered markdown file in your own
`spec-updates/`, stating what changed and what the consumer must do.

### Consumers (new habit)

At **session start** and after **completing any task**, run:

```bash
ls ../bw-parts/spec-updates/
ls ../bw-board/spec-updates/
ls ../bw-circuit-ui/spec-updates/
# ... any other repos you consume from
```

Unread items are visible by number. If you last acted on 005, anything
numbered 006+ is new.

### Acknowledgement (new habit)

When you act on a spec-update (or determine it does not apply to you),
record the number somewhere stable — a line in your close-out, a comment
in the spec-update's commit message, or a simple tracking file. Then
"has repo X picked up spec-update N?" is answerable by reading their
repo, not by asking them.

Example commit message:
```
Fix gearmotor slug refs (bw-parts spec-update 006)
```

## Why this is a proposal, not a mandate

bw-parts does not own other agents' workflows. A convention nobody
agreed to is just another unread file. But bw-parts produces most of
these spec-updates and has the evidence that the current arrangement
does not work. The coordinator is welcome to amend, reject, or make
this binding.
