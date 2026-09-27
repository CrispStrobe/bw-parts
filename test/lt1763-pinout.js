#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const part = JSON.parse(fs.readFileSync(path.join(root, 'parts', 'lt1763.json'), 'utf8'));
const svg = fs.readFileSync(path.join(root, 'parts', 'lt1763.svg'), 'utf8');
const pinOrder = ['out', 'sense_adj', 'gnd_3', 'byp', 'shdn', 'gnd_6', 'gnd_7', 'in'];

assert.equal(part.kind, 'lt1763');
assert.deepEqual(part.terminals.map(({name}) => name), pinOrder,
  'terminal array is the Rev. H SO-8 physical pin order');
assert.ok(part.terminals.every(({functions}) => Array.isArray(functions) && functions.length === 0));
assert.equal('footprint' in part, false,
  'surface-mount SO-8 must not claim direct breadboard seating');
for (const name of pinOrder) assert.match(svg, new RegExp(`>${name}<`));
assert.match(svg, />LT1763</);
assert.match(svg, />500mA LDO</);
assert.match(svg, />SO-8</);

const ratings = JSON.parse(fs.readFileSync(path.join(root, 'current-ratings.json'), 'utf8'));
assert.deepEqual(ratings.lt1763, {
  _src: 'Analog Devices LT1763 Rev. H Table 1: IGND max 16mA at 500mA load',
  chip_mA: 0,
  supply_mA: 16,
});
console.log('LT1763 SO-8 pin order, original art, no-fake-footprint rule, and supply budget verified.');
