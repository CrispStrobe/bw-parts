#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const part = JSON.parse(fs.readFileSync(path.join(root, 'parts', 'adp151.json'), 'utf8'));
const svg = fs.readFileSync(path.join(root, 'parts', 'adp151.svg'), 'utf8');
const pinOrder = ['vin', 'gnd', 'en', 'nc', 'vout'];

assert.equal(part.kind, 'adp151');
assert.deepEqual(part.terminals.map(({name}) => name), pinOrder,
  'terminal array is the Rev. J TSOT-5 physical pin order');
assert.ok(part.terminals.every(({functions}) => Array.isArray(functions) && functions.length === 0));
assert.equal('footprint' in part, false,
  'surface-mount TSOT must not claim direct breadboard seating');
for (const name of pinOrder) assert.match(svg, new RegExp(`>${name}<`));
assert.match(svg, />ADP151</);
assert.match(svg, />200mA LDO</);
assert.match(svg, />TSOT-5</);

const ratings = JSON.parse(fs.readFileSync(path.join(root, 'current-ratings.json'), 'utf8'));
assert.deepEqual(ratings.adp151, {
  _src: 'Analog Devices ADP151 Rev. J Table 1: IGND max 350uA at 200mA load',
  chip_mA: 0,
  supply_mA: 0.35,
});
console.log('ADP151 TSOT-5 pin order, original art, no-fake-footprint rule, and supply budget verified.');
