#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const part = JSON.parse(fs.readFileSync(path.join(root, 'parts', 'ada4522_1.json'), 'utf8'));
const svg = fs.readFileSync(path.join(root, 'parts', 'ada4522_1.svg'), 'utf8');
const pinOrder = ['nic_1', 'inn', 'inp', 'vneg', 'nic_5', 'out', 'vpos', 'nic_8'];

assert.equal(part.kind, 'ada4522_1');
assert.deepEqual(part.terminals.map(({name}) => name), pinOrder,
  'terminal array is the data-sheet R-8 physical pin order');
assert.ok(part.terminals.every(({functions}) => Array.isArray(functions) && functions.length === 0));
assert.equal('footprint' in part, false,
  'surface-mount SOIC must not claim direct breadboard seating');
assert.match(part._note, /three not-internally-connected leads/);
assert.match(part._note, /RM-8 MSOP order codes must not borrow/);
for (const name of pinOrder) assert.match(svg, new RegExp(`>${name}<`));
assert.match(svg, />ADA4522-1</);
assert.match(svg, />ZERO-DRIFT OP AMP</);
assert.match(svg, />SOIC-8</);

const ratings = JSON.parse(fs.readFileSync(path.join(root, 'current-ratings.json'), 'utf8'));
assert.deepEqual(ratings.ada4522_1, {
  _src: 'Analog Devices ADA4522-1/ADA4522-2/ADA4522-4 Rev. I: 0.97mA maximum per amplifier over temperature',
  chip_mA: 0,
  supply_mA: 0.97,
});
console.log('ADA4522-1 SOIC-8 pin order, original art, package boundary, and supply budget verified.');
