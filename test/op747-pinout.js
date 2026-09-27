#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const part = JSON.parse(fs.readFileSync(path.join(root, 'parts', 'op747.json'), 'utf8'));
const svg = fs.readFileSync(path.join(root, 'parts', 'op747.svg'), 'utf8');
const pinOrder = ['1_neg', '1_pos', 'vpos', '2_pos', '2_neg', '2_out', '4_out',
  '4_neg', '4_pos', 'vneg', '3_pos', '3_neg', '3_out', '1_out'];

assert.equal(part.kind, 'op747');
assert.deepEqual(part.terminals.map(({name}) => name), pinOrder,
  'terminal array is the data-sheet R-14 physical pin order');
assert.ok(part.terminals.every(({functions}) => Array.isArray(functions) && functions.length === 0));
assert.equal('footprint' in part, false,
  'surface-mount SOIC must not claim direct breadboard seating');
assert.match(part._note, /official LTspice five-terminal OP747 symbol is one logical amplifier/);
for (const name of new Set(pinOrder)) assert.match(svg, new RegExp(`>${name}<`));
assert.match(svg, />OP747</);
assert.match(svg, />QUAD PRECISION OP AMP</);
assert.match(svg, />SOIC-14</);

const ratings = JSON.parse(fs.readFileSync(path.join(root, 'current-ratings.json'), 'utf8'));
assert.deepEqual(ratings.op747, {
  _src: 'Analog Devices OP777/OP727/OP747 Rev. D: 0.45mA max per amplifier, 1.8mA whole quad package',
  chip_mA: 0,
  supply_mA: 1.8,
});
console.log('OP747 SOIC-14 pin order, original art, package boundary, and supply budget verified.');
