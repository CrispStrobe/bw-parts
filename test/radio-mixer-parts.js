#!/usr/bin/env node
// The mixer IC, the ceramic IF filter, the FM IF IC and the dipole.
// bw-board owns the terminal names (src/mixer-ic.js,
// src/radio.js, src/fm-if-ic.js); this file holds the
// catalogue to them: terminal order, footprint, art, rating and catalogue row.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const ratings = JSON.parse(read('current-ratings.json'));
const catalog = read('PARTS-CATALOG.md');

const ROW = {
  // kind: [terminals in engine order, footprint dCol per terminal]
  ceramic_filter: [['in', 'gnd', 'out'], [0, 1, 2]],
  fm_if: [['in', 'gnd', 'vcc', 'out'], [0, 1, 2, 3]],
  dipole: [['a', 'b'], [0, 1]],
};
const DIP = {
  sa612: ['in_a', 'in_b', 'gnd', 'out_a', 'out_b', 'osc_b', 'osc_e', 'vcc'],
};

for (const kind of [...Object.keys(ROW), ...Object.keys(DIP)]) {
  const part = JSON.parse(read(`parts/${kind}.json`));
  assert.equal(part.kind, kind);
  const terms = ROW[kind]?.[0] ?? DIP[kind];
  assert.deepEqual(part.terminals.map((t) => t.name), terms, `${kind}: engine terminal names and order`);
  for (const t of part.terminals) {
    assert.ok(t.x >= 0 && t.x <= part.w && t.y >= 0 && t.y <= part.h, `${kind}.${t.name} inside the body`);
    assert.deepEqual(t.functions, [], `${kind}.${t.name}: audited, no alternate functions`);
  }
  assert.deepEqual(Object.keys(part.footprint.leads).sort(), [...terms].sort(), `${kind}: one lead per terminal`);
  if (ROW[kind]) {
    const cols = ROW[kind][1];
    assert.equal(part.footprint.refTerminal, terms[0]);
    terms.forEach((name, i) => assert.deepEqual(part.footprint.leads[name], { dRow: 0, dCol: cols[i] }, `${kind}.${name}`));
    const x0 = part.terminals[0].x;
    part.terminals.forEach((t, i) => assert.equal(t.x - x0, cols[i] * 14, `${kind}.${t.name}: x on the 14 px pitch`));
  } else {
    // DIP across the gutter: the first half on the bottom row left to right, the rest top right to left.
    assert.equal(part.footprint.refTerminal, terms[terms.length - 1]);
    assert.equal(part.footprint.straddlesGutter, true);
    terms.forEach((name, i) => assert.deepEqual(part.footprint.leads[name],
      i < terms.length / 2 ? { dRow: 5, dCol: i } : { dRow: 0, dCol: terms.length - 1 - i }, `${kind}.${name}: pin ${i + 1}`));
  }
  assert.ok(typeof part._note === 'string' && part._note.length > 40, `${kind}: _note says what the part is`);
  const svg = read(`parts/${kind}.svg`);
  assert.match(svg, new RegExp(`viewBox="0 0 ${part.w} ${part.h}"`), `${kind}: art viewBox matches the sidecar`);
  assert.ok(ratings[kind], `${kind}: current rating present`);
  assert.ok(catalog.includes(`| \`${kind}\` |`), `${kind}: PARTS-CATALOG.md row`);
}
for (const kind of Object.keys(ROW)) {
  const part = JSON.parse(read(`parts/${kind}.json`));
  const svg = read(`parts/${kind}.svg`);
  for (const t of part.terminals) assert.ok(svg.includes(`cx="${t.x}" cy="${t.y}"`), `${kind}.${t.name}: art draws a pad at the terminal`);
}

console.log('sa612, ceramic_filter, fm_if, dipole: terminals, footprints, art, ratings and catalogue verified.');
