#!/usr/bin/env node
// The optical-link parts: laser_diode (an emitter with leads) and light_path
// (no leads: it names its emitter and receiver). bw-board owns the kind names
// and terminals (src/optics.js, devices/optical-parts.js).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const ratings = JSON.parse(read('current-ratings.json'));
const catalog = read('PARTS-CATALOG.md');

const laser = JSON.parse(read('parts/laser_diode.json'));
assert.deepEqual(laser.terminals.map((t) => t.name), ['anode', 'cathode']);
assert.equal(laser.terminals[1].x - laser.terminals[0].x, 14, 'laser leads one breadboard pitch apart');
assert.deepEqual(laser.footprint.leads, { anode: { dRow: 0, dCol: 0 }, cathode: { dRow: 0, dCol: 1 } });
const laserSvg = read('parts/laser_diode.svg');
assert.match(laserSvg, /viewBox="0 0 30 44"/);
for (const t of laser.terminals) assert.ok(laserSvg.includes(`cx="${t.x}" cy="${t.y}"`), `pad at ${t.name}`);
assert.equal(ratings.laser_diode.chip_mA, 'circuit');

const lp = JSON.parse(read('parts/light_path.json'));
assert.deepEqual(lp.terminals, [], 'light_path has no leads');
assert.equal(lp.footprint, null, 'light_path is not seated');
assert.match(read('parts/light_path.svg'), /viewBox="0 0 80 40"/);
assert.deepEqual(ratings.light_path, { chip_mA: 0, supply_mA: 0 });

for (const kind of ['laser_diode', 'light_path']) {
  assert.ok(catalog.includes(`| \`${kind}\` |`), `${kind}: PARTS-CATALOG.md row`);
  assert.ok(JSON.parse(read(`parts/${kind}.json`))._note.length > 40, `${kind}: _note`);
}
// The IR LED and the phototransistor: leads on the breadboard pitch of their
// footprints (14 units per column), so their art meets the holes when seated.
for (const [kind, names] of [['ir_transmitter', ['anode', 'cathode']], ['phototransistor', ['collector', 'emitter']]]) {
  const part = JSON.parse(read(`parts/${kind}.json`));
  const [a, b] = names.map((n) => part.terminals.find((t) => t.name === n));
  const cols = part.footprint.leads[names[1]].dCol - part.footprint.leads[names[0]].dCol;
  assert.equal(b.x - a.x, cols * 14, `${kind}: leads ${cols} column(s) apart on the 14-unit pitch`);
  assert.equal(a.y, b.y, `${kind}: both leads end on one row`);
  const svg = read(`parts/${kind}.svg`);
  assert.match(svg, new RegExp(`viewBox="0 0 ${part.w} ${part.h}"`), `${kind}: art viewBox is the sidecar box`);
  for (const t of [a, b]) assert.ok(svg.includes(`cx="${t.x}" cy="${t.y}"`), `${kind}.${t.name}: pad at the terminal`);
}
console.log('laser_diode, light_path, ir_transmitter, phototransistor: terminals, footprints, art, ratings and catalogue verified.');
