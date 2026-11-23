#!/usr/bin/env node
// The sensing transducers: thermocouple, air_coil, electrolysis_cell.
// bw-board owns the terminal names (src/sensing-transducers.js and its device
// models); this file holds the catalogue to them: terminal order, breadboard
// footprint, art, rating and catalogue row.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const ratings = JSON.parse(read('current-ratings.json'));
const catalog = read('PARTS-CATALOG.md');

const PARTS = {
  // kind: [terminals in engine order, footprint dCol per terminal, pin budget]
  thermocouple: [['pos', 'neg'], [0, 1], 0],
  air_coil: [['a', 'b'], [0, 3], 'circuit'],
  electrolysis_cell: [['a', 'b'], [0, 2], 'circuit'],
};

for (const [kind, [terms, cols, chip]] of Object.entries(PARTS)) {
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
  const x0 = part.terminals[0].x;
  part.terminals.forEach((t, i) => assert.equal(t.x - x0, cols[i] * 14, `${kind}.${t.name}: x on the 14 px pitch`));
  assert.ok(typeof part._note === 'string' && part._note.length > 40, `${kind}: _note says what the part is`);

  const svg = read(`parts/${kind}.svg`);
  assert.match(svg, new RegExp(`viewBox="0 0 ${part.w} ${part.h}"`), `${kind}: art viewBox matches the sidecar`);
  for (const t of part.terminals) {
    assert.ok(svg.includes(`cx="${t.x}" cy="${t.y}"`), `${kind}.${t.name}: art draws a pad at the terminal`);
  }

  assert.ok(ratings[kind], `${kind}: current rating present`);
  assert.equal(ratings[kind].chip_mA, chip, `${kind}: pin budget`);
  assert.equal(ratings[kind].supply_mA, 0, `${kind}: passive, no rail budget`);
  assert.ok(catalog.includes(`| \`${kind}\` |`), `${kind}: PARTS-CATALOG.md row`);
}

console.log('thermocouple, air_coil, electrolysis_cell: terminals, footprints, art, ratings and catalogue verified.');
