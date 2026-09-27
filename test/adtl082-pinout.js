#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const part = JSON.parse(fs.readFileSync(path.join(root, 'parts', 'adtl082.json'), 'utf8'));
const svg = fs.readFileSync(path.join(root, 'parts', 'adtl082.svg'), 'utf8');
const pinOrder = ['1_out', '1_neg', '1_pos', 'vneg', '2_pos', '2_neg', '2_out', 'vpos'];

assert.equal(part.kind, 'adtl082');
assert.deepEqual(part.terminals.map(({name}) => name), pinOrder,
  'terminal array is the data-sheet R-8 physical pin order');
assert.ok(part.terminals.every(({functions}) => Array.isArray(functions) && functions.length === 0));
assert.equal('footprint' in part, false,
  'surface-mount SOIC must not claim direct breadboard seating');
assert.match(part._note, /official LTspice five-terminal ADTL082 symbol is one logical amplifier/);
for (const name of pinOrder) assert.match(svg, new RegExp(`>${name}<`));
assert.match(svg, />ADTL082</);
assert.match(svg, />DUAL JFET OP AMP</);
assert.match(svg, />SOIC-8</);

const ratings = JSON.parse(fs.readFileSync(path.join(root, 'current-ratings.json'), 'utf8'));
assert.deepEqual(ratings.adtl082, {
  _src: 'Analog Devices ADTL082/ADTL084 Rev. B: 2.0mA max per amplifier, 4.0mA whole dual package',
  chip_mA: 0,
  supply_mA: 4,
});
console.log('ADTL082 SOIC-8 pin order, original art, package boundary, and supply budget verified.');
