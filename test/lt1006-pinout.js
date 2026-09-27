#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const part = JSON.parse(fs.readFileSync(path.join(root, 'parts', 'lt1006.json'), 'utf8'));
const svg = fs.readFileSync(path.join(root, 'parts', 'lt1006.svg'), 'utf8');
const pinOrder = ['offset_1', 'inn', 'inp', 'vneg', 'offset_5', 'out', 'vpos', 'iset'];

assert.equal(part.kind, 'lt1006');
assert.deepEqual(part.terminals.map(({name}) => name), pinOrder,
  'terminal array is the data-sheet S8 physical pin order');
assert.ok(part.terminals.every(({functions}) => Array.isArray(functions) && functions.length === 0));
assert.equal('footprint' in part, false,
  'surface-mount SOIC must not claim direct breadboard seating');
assert.match(part._note, /Pin 8 is the supply-current-set input, not NC/);
assert.match(part._note, /Plain LT1006\/LT1006A source symbols do not establish this package/);
for (const name of pinOrder) assert.match(svg, new RegExp(`>${name}<`));
assert.match(svg, />LT1006</);
assert.match(svg, />PRECISION OP AMP</);
assert.match(svg, />SOIC-8</);

const ratings = JSON.parse(fs.readFileSync(path.join(root, 'current-ratings.json'), 'utf8'));
assert.deepEqual(ratings.lt1006, {
  _src: 'Analog Devices LT1006 data sheet: S8 supply current 570uA max at 5V',
  chip_mA: 0,
  supply_mA: 0.57,
});
console.log('LT1006 SOIC-8 pin order, original art, package boundary, and supply budget verified.');
