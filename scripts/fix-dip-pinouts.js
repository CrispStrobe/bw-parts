#!/usr/bin/env node
/**
 * Put DIP sidecars whose pins sat in the wrong holes onto their datasheet
 * pinout (2026-11-24). Every name stays; only where each pin sits changes.
 *
 * The breadboard layout is generate-dip-art.js's: seen from above, notch left,
 * pins 1..N/2 left to right along the bottom row (dRow 5, y = h), pins
 * N/2+1..N right to left along the top row (dRow 0, y = 0), so pin N is the
 * top-left reference. The terminal array is rewritten in pin order.
 *
 * Usage: node scripts/fix-dip-pinouts.js [kind ...]   then
 *        node generate-dip-art.js <kind ...>           for the art
 */
'use strict';
const fs = require('fs');
const path = require('path');

/** Pin 1..N, by the sidecar's own terminal names, with the datasheet cited. */
const PINOUTS = {
  // TI LM358 (SLOS068): 1 OUT1, 2 IN1-, 3 IN1+, 4 GND, 5 IN2+, 6 IN2-, 7 OUT2, 8 VCC
  lm358: ['1_out', '1_neg', '1_pos', 'gnd', '2_pos', '2_neg', '2_out', 'vcc'],
  // TI LM393 (SLCS005): same pinout as the LM358
  lm393: ['1_out', '1_neg', '1_pos', 'gnd', '2_pos', '2_neg', '2_out', 'vcc'],
  // TI LM339 (SLCS006): 1 OUT2, 2 OUT1, 3 VCC, 4 IN1-, 5 IN1+, 6 IN2-, 7 IN2+,
  // 8 IN3-, 9 IN3+, 10 IN4-, 11 IN4+, 12 GND, 13 OUT4, 14 OUT3
  lm339: ['2_out', '1_out', 'vcc', '1_neg', '1_pos', '2_neg', '2_pos',
    '3_neg', '3_pos', '4_neg', '4_pos', 'gnd', '4_out', '3_out'],
  // TI CD74HC4067 (SCHS209): 1 COM, 2..9 I7..I0, 10 S0, 11 S1, 12 GND, 13 S3,
  // 14 S2, 15 E, 16..23 I15..I8, 24 VCC
  cd74hc4067: ['z', 'c7', 'c6', 'c5', 'c4', 'c3', 'c2', 'c1', 'c0', 's0', 's1', 'gnd',
    's3', 's2', 'eb', 'c15', 'c14', 'c13', 'c12', 'c11', 'c10', 'c9', 'c8', 'vcc'],
  // TI ULN2803A (SLRS049): 1..8 1B..8B, 9 GND, 10 COM, 11..18 8C..1C
  darlington_driver: ['in0', 'in1', 'in2', 'in3', 'in4', 'in5', 'in6', 'in7', 'gnd',
    'com', 'out7', 'out6', 'out5', 'out4', 'out3', 'out2', 'out1', 'out0'],
  // TI SN74HC244 (SCLS130): 1 1OE, 2 1A1, 3 2Y4, 4 1A2, 5 2Y3, 6 1A3, 7 2Y2, 8 1A4,
  // 9 2Y1, 10 GND, 11 2A1, 12 1Y4, 13 2A2, 14 1Y3, 15 2A3, 16 1Y2, 17 2A4, 18 1Y1,
  // 19 2OE, 20 VCC (the sidecar counts from 0: 1A1 is 1a0)
  '74hc244': ['1oeb', '1a0', '2y3', '1a1', '2y2', '1a2', '2y1', '1a3', '2y0', 'gnd',
    '2a0', '1y3', '2a1', '1y2', '2a2', '1y1', '2a3', '1y0', '2oeb', 'vcc'],
  // TI SN74LS93 / NXP 74HC93: 1 CKB, 2 R0(1), 3 R0(2), 4 NC, 5 VCC, 6 NC, 7 NC,
  // 8 QC, 9 QB, 10 GND, 11 QD, 12 QA, 13 NC, 14 CKA
  '74hc93': ['clk_b', 'r0_1', 'r0_2', 'nc1', 'vcc', 'nc2', 'nc3',
    'qc', 'qb', 'gnd', 'qd', 'qa', 'nc4', 'clk_a'],
  // TI SN74HC73 (SCLS122): 1 1CLK, 2 1CLR, 3 1K, 4 VCC, 5 2CLK, 6 2CLR, 7 2J,
  // 8 2Q-bar, 9 2Q, 10 2K, 11 GND, 12 1Q, 13 1Q-bar, 14 1J
  '74hc73': ['1clk', '1clr', '1k', 'vcc', '2clk', '2clr', '2j',
    '2q_bar', '2q', '2k', 'gnd', '1q', '1q_bar', '1j'],
  // TI CD4050B (SCHS046): 1 VDD, 2 G=A, 3 A, 4 H=B, 5 B, 6 I=C, 7 C, 8 VSS,
  // 9 D, 10 J=D, 11 E, 12 K=E, 13 NC, 14 F, 15 L=F, 16 NC
  '74hc4050': ['vcc', '1y', '1a', '2y', '2a', '3y', '3a', 'gnd',
    '4a', '4y', '5a', '5y', 'nc1', '6a', '6y', 'nc2'],
};

const PITCH = 14, ROWS = 38, MARGIN = 10;

function fix(kind, dir) {
  const file = path.join(dir, `${kind}.json`);
  const text = fs.readFileSync(file, 'utf8');
  const sc = JSON.parse(text);
  const order = PINOUTS[kind];
  const n = order.length, half = n / 2;
  const have = sc.terminals.map((t) => t.name).sort();
  if (JSON.stringify([...order].sort()) !== JSON.stringify(have)) {
    throw new Error(`${kind}: pinout names ${order} are not the sidecar's ${have}`);
  }
  if (!sc.dip || !sc.footprint || !sc.footprint.straddlesGutter) throw new Error(`${kind}: not a re-laid DIP`);
  const byName = new Map(sc.terminals.map((t) => [t.name, t]));
  const leads = {};
  const terminals = order.map((name, i) => {
    const bottom = i < half;
    const col = bottom ? i : n - 1 - i;
    leads[name] = { dRow: bottom ? 5 : 0, dCol: col };
    return { ...byName.get(name), x: MARGIN + col * PITCH, y: bottom ? ROWS : 0 };
  });
  const w = (half - 1) * PITCH + 2 * MARGIN;
  if (sc.w !== w || sc.h !== ROWS) throw new Error(`${kind}: body ${sc.w}x${sc.h}, expected ${w}x${ROWS}`);
  sc.terminals = terminals;
  sc.footprint = { ...sc.footprint, refTerminal: order[n - 1], leads };
  const out = JSON.stringify(sc, null, 2) + (text.endsWith('\n') ? '\n' : '');
  fs.writeFileSync(file, out);
  return out !== text;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const dirArg = args.indexOf('--dir');
  const dir = dirArg >= 0 ? args.splice(dirArg, 2)[1] : path.join(__dirname, '..', 'parts');
  const kinds = args.length ? args : Object.keys(PINOUTS);
  for (const k of kinds) console.log(`${k}: ${fix(k, dir) ? 'rewritten' : 'unchanged'}`);
}

module.exports = { PINOUTS, fix };
