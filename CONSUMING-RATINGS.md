# How to consume current-ratings.json

> For bw-board and any other consumer. Read this before vendoring.

## Schema (as of cf3eb7d)

Each entry is an object with two fields, not a flat number:

```json
{
  "servo": { "chip_mA": 0, "supply_mA": 350 },
  "led":   { "chip_mA": "circuit", "supply_mA": "circuit" },
  "resistor": { "chip_mA": 0, "supply_mA": 0 },
  "temp_sensor": { "chip_mA": null, "supply_mA": null }
}
```

**The old schema** (`"servo": 350`) no longer exists. If your code
reads a flat number, it will get an object and produce `NaN`.

## Which field to consume

| DRC check | Read this field | Budget limit |
|---|---|---|
| Chip I/O pin budget ("will this brown out the chip?") | `chip_mA` | 120 mA (STC12 §4.1) |
| Supply rail budget ("will this brown out USB?") | `supply_mA` | ~500 mA (USB), battery-dependent |

**For the existing chip-budget DRC, read `chip_mA` only.**

## How to sum safely

Each field is one of four types. **The string `"circuit"` will corrupt
arithmetic if summed.** `0 + "circuit"` produces `"0circuit"` in JS,
which is truthy, compares false against any number, and silently
disables the warning.

```js
function getMaxCurrent(kind, field = 'chip_mA') {
  const entry = ratings[kind];
  if (!entry) return null;                    // unknown kind
  const val = entry[field];
  if (typeof val === 'number') return val;    // rated or 0
  if (val === 'circuit') return null;         // cannot sum — treat as uncountable
  return null;                                // null or anything else
}

// When summing:
let total = 0;
let uncounted = 0;
let circuitDependent = 0;

for (const kind of partKinds) {
  const mA = getMaxCurrent(kind, 'chip_mA');
  if (mA === null) {
    // Check WHY it is null
    const raw = ratings[kind]?.chip_mA;
    if (raw === 'circuit') circuitDependent++;
    else uncounted++;
  } else {
    total += mA;
  }
}

// Warning text:
// "at least 60 mA, 2 parts depend on your circuit, 1 part not yet rated"
```

## The three warning cases

| `chip_mA` value | Category | In the sum? | Warning text |
|---|---|---|---|
| `number` (incl. 0) | Rated | Yes (0 adds nothing) | — |
| `"circuit"` | Circuit-dependent | No | "N parts depend on your circuit" |
| `null` | Not yet rated | No | "M parts not yet rated" |

## Breaking change log

| Date | Commit | Change | Migration |
|---|---|---|---|
| 2026-08-10 | cf3eb7d | Flat `number\|null` → `{chip_mA, supply_mA}` | Read `.chip_mA` instead of the value directly |
| 2026-08-10 | 8882a86 | Added `"circuit"` sentinel | Filter `typeof val === 'number'` before summing |

## Tell us what you consume

When you vendor this file, tell bw-parts which fields you read. The
next schema change should arrive as a conversation, not as a `NaN`.
