#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const part = JSON.parse(fs.readFileSync(path.join(root, 'parts', 'adp7118.json'), 'utf8'));
const svg = fs.readFileSync(path.join(root, 'parts', 'adp7118.svg'), 'utf8');
const pinOrder = ['vout_1', 'vout_2', 'sense_adj', 'gnd', 'en', 'ss', 'vin_7', 'vin_8'];

assert.equal(part.kind, 'adp7118');
assert.deepEqual(part.terminals.map(({name}) => name), pinOrder,
  'terminal array is the Rev. H SOIC-8 physical pin order');
assert.ok(part.terminals.every(({functions}) => Array.isArray(functions) && functions.length === 0));
assert.equal('footprint' in part, false,
  'surface-mount SOIC must not claim direct breadboard seating');
for (const name of pinOrder) assert.match(svg, new RegExp(`>${name}<`));
assert.match(svg, />ADP7118</);
assert.match(svg, />200mA LDO</);
assert.match(svg, />SOIC-8</);

const ratings = JSON.parse(fs.readFileSync(path.join(root, 'current-ratings.json'), 'utf8'));
assert.deepEqual(ratings.adp7118, {
  _src: 'Analog Devices ADP7118 Rev. H Table 1: IGND max 320uA at 200mA load',
  chip_mA: 0,
  supply_mA: 0.32,
});
console.log('ADP7118 SOIC-8 pin order, original art, no-fake-footprint rule, and supply budget verified.');
