#!/usr/bin/env node
// The audio-output and crystal-set parts: speaker, earphone, antenna, earth,
// tuning_cap, ferrite_coil. bw-board owns the terminal names (the engine
// devices in transducers.js / the radio models); this file holds the
// catalogue to them: terminal order, breadboard footprint, art, rating and
// catalogue row.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const ratings = JSON.parse(read('current-ratings.json'));
const catalog = read('PARTS-CATALOG.md');

const PARTS = {
  // kind: [terminals in engine order, footprint dCol per terminal]
  speaker: [['a', 'b'], [0, 2]],
  earphone: [['a', 'b'], [0, 1]],
  antenna: [['a'], [0]],
  earth: [['earth'], [0]],
  tuning_cap: [['a', 'b'], [0, 4]],
  ferrite_coil: [['a', 'tap', 'b', 'c1', 'c2'], [0, 1, 2, 3, 4]],
  // The room's fields (bw-board src/fields.js): a one-lead bare wire.
  field_probe: [['a'], [0]],
  vhf_coil: [['a', 'b'], [0, 2]],
  varicap: [['anode', 'cathode'], [0, 4]],
};

for (const [kind, [terms, cols]] of Object.entries(PARTS)) {
  const part = JSON.parse(read(`parts/${kind}.json`));
  assert.equal(part.kind, kind);
  assert.deepEqual(part.terminals.map((t) => t.name), terms, `${kind}: engine terminal names and order`);
  for (const t of part.terminals) {
    assert.ok(t.x >= 0 && t.x <= part.w && t.y >= 0 && t.y <= part.h, `${kind}.${t.name} inside the body`);
    assert.deepEqual(t.functions, [], `${kind}.${t.name}: audited, no alternate functions`);
  }
  assert.equal(part.footprint.refTerminal, terms[0], `${kind}: footprint anchored on its first lead`);
  assert.deepEqual(Object.keys(part.footprint.leads), terms, `${kind}: one lead per terminal`);
  terms.forEach((name, i) => assert.deepEqual(part.footprint.leads[name], { dRow: 0, dCol: cols[i] },
    `${kind}.${name}: one row, column ${cols[i]}`));
  // Leads that are 14 px (one breadboard pitch) apart per column, so a seated
  // part's art lines up with its holes.
  const x0 = part.terminals[0].x;
  part.terminals.forEach((t, i) => assert.equal(t.x - x0, cols[i] * 14, `${kind}.${t.name}: x on the 14 px pitch`));
  assert.ok(typeof part._note === 'string' && part._note.length > 40, `${kind}: _note says what the part is`);

  const svg = read(`parts/${kind}.svg`);
  assert.match(svg, new RegExp(`viewBox="0 0 ${part.w} ${part.h}"`), `${kind}: art viewBox matches the sidecar`);
  for (const t of part.terminals) {
    assert.ok(svg.includes(`cx="${t.x}" cy="${t.y}"`), `${kind}.${t.name}: art draws a pad at the terminal`);
  }

  assert.ok(ratings[kind], `${kind}: current rating present`);
  // A transducer draws whatever its driver pushes through the coil, like the
  // buzzer ('circuit'); the radio parts never load a pin by themselves.
  const transducer = kind === 'speaker' || kind === 'earphone';
  assert.equal(ratings[kind].chip_mA, transducer ? 'circuit' : 0, `${kind}: pin budget`);
  assert.equal(ratings[kind].supply_mA, 0, `${kind}: passive, no rail budget`);
  assert.ok(catalog.includes(`| \`${kind}\` |`), `${kind}: PARTS-CATALOG.md row`);
}

console.log('speaker, earphone, antenna, earth, tuning_cap, ferrite_coil, field_probe, vhf_coil, varicap: terminals, footprints, art, ratings and catalogue verified.');
