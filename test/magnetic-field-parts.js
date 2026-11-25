#!/usr/bin/env node
// The magnetic field source and the coil pendulum. bw-board owns the terminal
// names (src/magnetic-coupling.js, src/devices/sensing-parts.js); this file
// holds the catalogue to them: terminal order, footprint, art, rating and
// catalogue row.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const ratings = JSON.parse(read('current-ratings.json'));
const catalog = read('PARTS-CATALOG.md');

const ROW = {
  // kind: [terminals in engine order, footprint dCol per terminal]
  induction_loop: [['a', 'b'], [0, 3]],
  coil_pendulum: [['a', 'b'], [0, 3]],
};

for (const kind of Object.keys(ROW)) {
  const part = JSON.parse(read(`parts/${kind}.json`));
  assert.equal(part.kind, kind);
  const [terms, cols] = ROW[kind];
  assert.deepEqual(part.terminals.map((t) => t.name), terms, `${kind}: engine terminal names and order`);
  for (const t of part.terminals) {
    assert.ok(t.x >= 0 && t.x <= part.w && t.y >= 0 && t.y <= part.h, `${kind}.${t.name} inside the body`);
    assert.deepEqual(t.functions, [], `${kind}.${t.name}: audited, no alternate functions`);
  }
  assert.equal(part.footprint.refTerminal, terms[0]);
  terms.forEach((name, i) => assert.deepEqual(part.footprint.leads[name], { dRow: 0, dCol: cols[i] }, `${kind}.${name}`));
  const x0 = part.terminals[0].x;
  part.terminals.forEach((t, i) => assert.equal(t.x - x0, cols[i] * 14, `${kind}.${t.name}: x on the 14 px pitch`));
  assert.ok(typeof part._note === 'string' && part._note.length > 40, `${kind}: _note says what the part is`);
  const svg = read(`parts/${kind}.svg`);
  assert.match(svg, new RegExp(`viewBox="0 0 ${part.w} ${part.h}"`), `${kind}: art viewBox matches the sidecar`);
  for (const t of part.terminals) assert.ok(svg.includes(`cx="${t.x}" cy="${t.y}"`), `${kind}.${t.name}: art draws a pad at the terminal`);
  assert.ok(ratings[kind], `${kind}: current rating present`);
  assert.ok(catalog.includes(`| \`${kind}\` |`), `${kind}: PARTS-CATALOG.md row`);
}

console.log('induction_loop, coil_pendulum: terminals, footprints, art, ratings and catalogue verified.');
