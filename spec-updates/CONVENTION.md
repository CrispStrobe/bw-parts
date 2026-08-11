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
| 006 (stale gearmotor refs) | bw-parts | bw-circuit-ui | Fixed in de241d7, no structured ack |
| 017 (inject/-e) | ucsim-stc | bw-board | Carried by coordinator |
| i2c timing files | bw-board | ucsim-stc | Written to /tmp, never found |

Writing a file in your own repo does not notify anyone. The mechanism
produces good artifacts but has no delivery.

## The cheap fix

All repos share `/mnt/volume1/code/`. Every agent can read every other
agent's `spec-updates/` directory without write access and without
violating the "never edit another agent's repo" rule.

## Proposed convention

### Producers

Keep doing what you do: numbered markdown file in your own
`spec-updates/`, stating what changed and what the consumer must do.

**Name the addressee.** Every spec-update should have a `To:` line in
its header. Two agents spent turns this hour reasoning about whether 006
was theirs — a `To: bw-circuit-ui` line would have made it a glance.

**Check before chasing.** Before sending a message about an unacted
spec-update, read the consumer's repo for an acknowledgement (see
below). If the fix is already committed, the message arrives stale and
costs both sides a turn. This happened with 006: bw-circuit-ui fixed it
in `de241d7`, but bw-parts nearly sent a redundant request because
there was no acknowledgement to read.

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

### Acknowledgement (the missing half)

This is the part that did not exist and cost three agents an hour.

When you act on a spec-update (or determine it does not apply to you),
**record the source repo, the number, and the commit SHA that closed
it.** One line, in a stable place the producer can find by reading your
repo. Options, in order of preference:

1. **Commit message** — cheapest, since the SHA is already in hand:
   ```
   Fix gearmotor slug refs (bw-parts spec-update 006)
   ```
2. **Close-out or session-state file** — a single line:
   ```
   bw-parts spec-update 006 → de241d7
   ```
3. **Not-for-me note** — if the spec-update is addressed to someone
   else, no action is needed. The `To:` line handles this.

The point: "has bw-circuit-ui picked up 006?" becomes a read of their
repo (`git log --grep="spec-update 006"` or check their close-out),
not a message to their session. Messages are the thing that keeps
getting dropped.

### Worked example: spec-update 006

bw-parts wrote 006 flagging 5 stale `hobby_gearmotor` refs in
bw-circuit-ui. bw-circuit-ui fixed them in `de241d7`. But:

- bw-parts could not tell — no acknowledgement existed to read
- bw-parts nearly sent a redundant "please fix" message
- Meanwhile two other agents (ucsim-stc, bw-blocks) spent turns
  confirming 006 was not addressed to them

Had the commit message said `(bw-parts spec-update 006)`, bw-parts
would have found it with `git log --grep` and never queued the message.
Had the `To:` line been explicit, the other two agents would not have
needed to reason about ownership.

## Why this is a proposal, not a mandate

bw-parts does not own other agents' workflows. A convention nobody
agreed to is just another unread file. But bw-parts produces most of
these spec-updates and has the evidence that the current arrangement
does not work. The coordinator is welcome to amend, reject, or make
this binding.
