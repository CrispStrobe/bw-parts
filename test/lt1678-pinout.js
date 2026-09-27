#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const part = JSON.parse(fs.readFileSync(path.join(root, 'parts', 'lt1678.json'), 'utf8'));
const svg = fs.readFileSync(path.join(root, 'parts', 'lt1678.svg'), 'utf8');
const pinOrder = ['1_out', '1_neg', '1_pos', 'vneg', '2_pos', '2_neg', '2_out', 'vpos'];

assert.equal(part.kind, 'lt1678');
assert.deepEqual(part.terminals.map(({name}) => name), pinOrder,
  'terminal array is the data-sheet 8-lead narrow-SO physical pin order');
assert.ok(part.terminals.every(({functions}) => Array.isArray(functions) && functions.length === 0));
assert.equal('footprint' in part, false,
  'surface-mount SOIC must not claim direct breadboard seating');
assert.match(part._note, /five-terminal LT1678 symbol represents one logical amplifier channel/);
assert.match(part._note, /does not establish this package/);
for (const name of pinOrder) assert.match(svg, new RegExp(`>${name}<`));
assert.match(svg, />LT1678</);
assert.match(svg, />DUAL PRECISION OP AMP</);
assert.match(svg, />SOIC-8</);

const ratings = JSON.parse(fs.readFileSync(path.join(root, 'current-ratings.json'), 'utf8'));
assert.deepEqual(ratings.lt1678, {
  _src: 'Analog Devices LT1678/LT1679 data sheet: 4.5mA max per amplifier over temperature, 9mA whole dual package',
  chip_mA: 0,
  supply_mA: 9,
});
console.log('LT1678 SOIC-8 pin order, original art, package boundary, and supply budget verified.');
