#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const part = JSON.parse(fs.readFileSync(path.join(root, 'parts', 'ad8541.json'), 'utf8'));
const svg = fs.readFileSync(path.join(root, 'parts', 'ad8541.svg'), 'utf8');
const pinOrder = ['nc_1', 'inn', 'inp', 'vneg', 'nc_5', 'out', 'vpos', 'nc_8'];

assert.equal(part.kind, 'ad8541');
assert.deepEqual(part.terminals.map(({name}) => name), pinOrder,
  'terminal array is the data-sheet R-8 physical pin order');
assert.ok(part.terminals.every(({functions}) => Array.isArray(functions) && functions.length === 0));
assert.equal('footprint' in part, false,
  'surface-mount SOIC must not claim direct breadboard seating');
assert.match(part._note, /three no-connect leads/);
assert.match(part._note, /package-neutral/);
assert.match(part._note, /RJ-5 or KS-5/);
for (const name of pinOrder) assert.match(svg, new RegExp(`>${name}<`));
assert.match(svg, />AD8541</);
assert.match(svg, />RAIL-TO-RAIL OP AMP</);
assert.match(svg, />SOIC-8</);

const ratings = JSON.parse(fs.readFileSync(path.join(root, 'current-ratings.json'), 'utf8'));
assert.deepEqual(ratings.ad8541, {
  _src: 'Analog Devices AD8541/AD8542/AD8544 Rev. H: 85uA maximum per amplifier over temperature at 5V',
  chip_mA: 0,
  supply_mA: 0.085,
});
console.log('AD8541 SOIC-8 pin order, original art, package boundary, and supply budget verified.');
