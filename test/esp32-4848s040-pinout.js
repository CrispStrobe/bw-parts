#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const part = JSON.parse(fs.readFileSync(path.join(root, 'parts/esp32_4848s040.json'), 'utf8'));
const svg = fs.readFileSync(path.join(root, 'parts/esp32_4848s040.svg'), 'utf8');
const expected = [
  ['gnd', 180, 48], ['gnd2', 216, 48],
  ['gpio40', 180, 72], ['gpio44', 216, 72],
  ['gpio2', 180, 96], ['gpio43', 216, 96],
  ['gpio1', 180, 120], ['5v', 216, 120],
];
assert.equal(part.kind, 'esp32_4848s040');
assert.deepEqual(part.terminals.map(({ name, x, y }) => [name, x, y]), expected,
  'H1 is transcribed row-major from the labelled rear connector, not from the SoC pin count');
assert.equal(part.footprint, null, 'a panel board must not acquire invented breadboard leads');
assert.deepEqual(part.boardProfile.groundTerminals, ['gnd', 'gnd2']);
assert.equal(part.boardProfile.gpioVolts, 3.3);
assert.equal(part.boardProfile.supplyVolts, 5);
assert.deepEqual(part.screen, { x: 16, y: 16, w: 124, h: 124 });

const external = part.terminals.filter(t => t.name.startsWith('gpio')).map(t => Number(t.name.slice(4)));
assert.deepEqual(external, [40, 44, 2, 43, 1]);
assert.equal(external.some(pin => part.boardProfile.internalGpio.includes(pin)), false);
assert.deepEqual([...part.boardProfile.internalGpio, ...external].sort((a, b) => a - b),
  [...Array.from({ length: 22 }, (_, i) => i), ...Array.from({ length: 23 }, (_, i) => i + 26)],
  'all S3 GPIOs are accounted for without inventing GPIO22–25 or exposing internal buses');
assert.deepEqual(part.boardProfile.lcd.blueLsbFirst.concat(part.boardProfile.lcd.greenLsbFirst, part.boardProfile.lcd.redLsbFirst),
  [4, 5, 6, 7, 15, 8, 20, 3, 46, 9, 10, 11, 12, 13, 14, 0]);
assert.deepEqual(part.boardProfile.lcd.control, { cs: 39, sck: 48, mosi: 47 });
assert.deepEqual(part.boardProfile.touch, { controller: 'gt911', sda: 19, scl: 45, address: 0x5d, interrupt: null, reset: null });
assert.match(svg, /viewBox="0 0 240 160"/);
assert.match(svg, />REAR H1 INSET</);
assert.match(svg, />SEPARATE VIEW · NOT TO SCALE</);
assert.match(svg, /x="16" y="16" width="124" height="124"/);
for (const [, x, y] of expected) {
  assert.ok(svg.includes(`x="${x - 3}" y="${y - 3}" width="6" height="6"`),
    `visible H1 pad must be centred at sidecar terminal ${x},${y}`);
}
console.log('ESP32-4848S040: exact H1 terminals, internal reservations, RGB/touch map and original art aperture verified.');
