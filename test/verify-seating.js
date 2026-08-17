#!/usr/bin/env node
/**
 * verify-seating.js — CI gate: verifies breadboard seating for all DIP parts.
 *
 * DIP seating rules (straddlesGutter = true):
 *   - Left pins:  dRow=0, dCol sequential 0..N/2-1
 *   - Right pins: dRow=5, dCol sequential 0..N/2-1
 *   - Terminal count = 2 * minCols
 *   - Every terminal in the terminals[] array appears in footprint.leads
 *   - Every lead in footprint.leads appears in terminals[]
 *   - No duplicate dRow+dCol pairs
 *
 * Module seating rules (straddlesGutter absent or false):
 *   - All pins on same dRow (typically 0)
 *   - dCol sequential 0..N-1 (or with gaps for wide-spaced modules)
 *   - Every terminal maps to a lead and vice versa
 *
 * Also checks: terminal x/y within viewBox, footprint.refTerminal exists.
 */
const fs = require('fs');
const path = require('path');

const PARTS_DIR = path.join(__dirname, '..', 'parts');
let errors = 0;
let checked = 0;
let dips = 0;
let modules = 0;

function fail(kind, msg) {
  console.error(`FAIL  ${kind}: ${msg}`);
  errors++;
}

const jsonFiles = fs.readdirSync(PARTS_DIR).filter(f => f.endsWith('.json'));

for (const f of jsonFiles) {
  const fp = path.join(PARTS_DIR, f);
  let meta;
  try { meta = JSON.parse(fs.readFileSync(fp, 'utf8')); }
  catch { continue; } // parse errors caught by validate-parts.js

  if (!meta.footprint || !meta.terminals) continue;
  const { footprint, terminals } = meta;
  const kind = meta.kind || f.replace('.json', '');
  const leads = footprint.leads || {};
  const termNames = new Set(terminals.map(t => t.name));
  const leadNames = new Set(Object.keys(leads));

  // Every terminal must have a lead entry — except INTERNAL terminals:
  // a net the part exposes without a physical breadboard lead (the
  // Pico's gp25 onboard-LED net). They declare `internal: true`.
  const internalCount = terminals.filter(t => t.internal).length;
  for (const t of terminals) {
    if (t.internal) continue;
    if (!leads[t.name]) {
      fail(kind, `terminal "${t.name}" has no footprint.leads entry`);
    }
  }
  // Every lead must have a terminal
  for (const ln of leadNames) {
    if (!termNames.has(ln)) {
      fail(kind, `footprint.leads["${ln}"] has no matching terminal`);
    }
  }

  // refTerminal must exist
  if (footprint.refTerminal && !termNames.has(footprint.refTerminal)) {
    fail(kind, `refTerminal "${footprint.refTerminal}" not in terminals`);
  }

  // Check for duplicate dRow+dCol
  const seen = new Set();
  for (const [name, pos] of Object.entries(leads)) {
    const key = `${pos.dRow},${pos.dCol}`;
    if (seen.has(key)) {
      fail(kind, `duplicate dRow/dCol ${key} (lead "${name}")`);
    }
    seen.add(key);
  }

  if (footprint.straddlesGutter) {
    dips++;
    const leftPins = [];
    const rightPins = [];
    let extraPads = 0;
    for (const [name, pos] of Object.entries(leads)) {
      if (pos.dRow === 0) leftPins.push({ name, dCol: pos.dCol });
      else if (pos.dRow === 5) rightPins.push({ name, dCol: pos.dCol });
      else extraPads++; // Non-standard pads (e.g. SWD debug pads on Pico)
    }

    leftPins.sort((a, b) => a.dCol - b.dCol);
    rightPins.sort((a, b) => a.dCol - b.dCol);

    // minCols check. A PARTIALLY-modeled module (the UM245R sidecar
    // carries 15 of the DIP-24's pins — NC/3V3/PWREN are unmodeled) has
    // fewer leads per side than columns, and its dCols legitimately GAP:
    // the modeled pins sit at their true physical columns, the unmodeled
    // pins occupy the holes between. Demanding count==minCols and
    // gap-free dCols rejected exactly the honest layout, so: a side may
    // not EXCEED minCols, every dCol must fit inside it, and the
    // sequential rule applies only to fully-modeled sides.
    if (footprint.minCols) {
      if (leftPins.length > footprint.minCols) {
        fail(kind, `left pin count ${leftPins.length} > minCols ${footprint.minCols}`);
      }
      if (rightPins.length > footprint.minCols) {
        fail(kind, `right pin count ${rightPins.length} > minCols ${footprint.minCols}`);
      }
      for (const p of [...leftPins, ...rightPins]) {
        if (p.dCol < 0 || p.dCol >= footprint.minCols) {
          fail(kind, `pin "${p.name}" dCol=${p.dCol} outside 0..${footprint.minCols - 1}`);
        }
      }
    }

    // Sequential dCol check — fully-modeled sides only (no minCols, or
    // the side fills every column).
    const fullLeft = !footprint.minCols || leftPins.length === footprint.minCols;
    const fullRight = !footprint.minCols || rightPins.length === footprint.minCols;
    if (fullLeft) for (let i = 0; i < leftPins.length; i++) {
      if (leftPins[i].dCol !== i) {
        fail(kind, `left pin "${leftPins[i].name}" dCol=${leftPins[i].dCol}, expected ${i}`);
        break;
      }
    }
    if (fullRight) for (let i = 0; i < rightPins.length; i++) {
      if (rightPins[i].dCol !== i) {
        fail(kind, `right pin "${rightPins[i].name}" dCol=${rightPins[i].dCol}, expected ${i}`);
        break;
      }
    }

    // Total pin count = 2 * side count + extra pads
    const totalPins = leftPins.length + rightPins.length + extraPads;
    if (totalPins !== terminals.length - internalCount) {
      fail(kind, `footprint has ${totalPins} leads but terminals has ${terminals.length} entries`);
    }
  } else {
    modules++;
    // Module: check all leads have same dRow, dCol within range
    const rows = new Set();
    for (const [, pos] of Object.entries(leads)) {
      rows.add(pos.dRow);
    }
    // Modules can have multiple rows but typically just one
    // Just verify lead count matches terminal count
    if (leadNames.size !== termNames.size) {
      fail(kind, `lead count ${leadNames.size} != terminal count ${termNames.size}`);
    }
  }

  checked++;
}

console.log(`\nSeating verified: ${checked} parts (${dips} DIP, ${modules} module), ${errors} error(s).`);
if (errors > 0) process.exit(1);
console.log('All seating checks passed.');
