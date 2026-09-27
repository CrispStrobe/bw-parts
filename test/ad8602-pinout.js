#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const part = JSON.parse(fs.readFileSync(path.join(root, 'parts', 'ad8602.json'), 'utf8'));
const svg = fs.readFileSync(path.join(root, 'parts', 'ad8602.svg'), 'utf8');
const pinOrder = ['1_out', '1_neg', '1_pos', 'vneg', '2_pos', '2_neg', '2_out', 'vpos'];

assert.equal(part.kind, 'ad8602');
assert.deepEqual(part.terminals.map(({name}) => name), pinOrder,
  'terminal array is the Rev. I R-8 physical pin order');
assert.ok(part.terminals.every(({functions}) => Array.isArray(functions) && functions.length === 0));
assert.equal('footprint' in part, false,
  'surface-mount SOIC must not claim direct breadboard seating');
assert.match(part._note, /five-terminal source symbol represents one logical amplifier channel/);
assert.match(part._note, /RM-8 MSOP parts must not borrow this face/);
for (const name of pinOrder) assert.match(svg, new RegExp(`>${name}<`));
assert.match(svg, />AD8602</);
assert.match(svg, />DUAL RRIO OP AMP</);
assert.match(svg, />SOIC-8 R</);

const ratings = JSON.parse(fs.readFileSync(path.join(root, 'current-ratings.json'), 'utf8'));
assert.deepEqual(ratings.ad8602, {
  _src: 'Analog Devices AD8601/AD8602/AD8604 Rev. I: 750uA maximum supply current per amplifier, 1.5mA whole dual package',
  chip_mA: 0,
  supply_mA: 1.5,
});
console.log('AD8602 R-8 pin order, original art, package boundary, and supply budget verified.');
