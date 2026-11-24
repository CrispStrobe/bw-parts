#!/usr/bin/env node
/**
 * breadboard-dip.js — every re-laid DIP (a sidecar with `dip`) is drawn and
 * seated on the breadboard pitch, and its art is the generator's.
 *
 *  - h is 38 (row e to row f across the gutter); every pin is a leg tip on
 *    the top edge (y 0, row e) or the bottom edge (y 38, row f);
 *  - x is 10 + 14 * column, w leaves 10 past the last column;
 *  - where there is a footprint, every lead is exactly its terminal's hole:
 *    dCol = (x - 10) / 14 and dRow 0/5 for y 0/38, refTerminal is the
 *    top-left lead (dRow 0, dCol 0);
 *  - the lowest-numbered pin of the bottom row is pin 1 when the terminal
 *    array is in pin order (sidecars from generate-dip.js / -art.js are);
 *  - the committed SVG is exactly what generate-dip-art.js draws from the
 *    JSON, with the sidecar's viewBox and a leg per pin.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { renderSvg, PITCH, ROWS, MARGIN } = require('../generate-dip-art.js');

const dir = path.join(__dirname, '..', 'parts');
let checked = 0;
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.json'))) {
  const sc = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  if (!sc.dip) continue;
  const k = sc.kind;
  checked++;
  assert.equal(sc.h, ROWS, `${k}: h is the row e to row f distance`);
  const cols = [];
  for (const t of sc.terminals.filter((x) => !x.internal)) {
    assert.ok(t.y === 0 || t.y === ROWS, `${k}.${t.name}: a leg tip on a row (y=${t.y})`);
    const col = (t.x - MARGIN) / PITCH;
    assert.ok(Number.isInteger(col * 2) && col >= 0, `${k}.${t.name}: x=${t.x} on the hole pitch`);
    cols.push(col);
    if (sc.footprint) {
      assert.deepEqual(sc.footprint.leads[t.name], { dRow: t.y === 0 ? 0 : 5, dCol: col }, `${k}.${t.name}: lead = its hole`);
    }
  }
  assert.equal(sc.w, (Math.max(...cols) - Math.min(...cols)) * PITCH + 2 * MARGIN, `${k}: w`);
  if (sc.footprint) {
    assert.equal(sc.footprint.straddlesGutter, true, `${k}: straddles the gutter`);
    const ref = sc.footprint.leads[sc.footprint.refTerminal];
    assert.deepEqual(ref && ref.dRow, 0, `${k}: refTerminal is in the top row`);
    assert.equal(ref.dCol, Math.min(...Object.values(sc.footprint.leads).filter((l) => l.dRow === 0).map((l) => l.dCol)), `${k}: refTerminal is the top-left lead`);
  }
  const svg = fs.readFileSync(path.join(dir, `${k}.svg`), 'utf8');
  assert.equal(svg, renderSvg(k, sc), `${k}: committed art is exactly generate-dip-art.js's`);
  assert.match(svg, new RegExp(`viewBox="0 0 ${sc.w} ${sc.h}"`), `${k}: viewBox is the sidecar box`);
}
// Pin 1 bottom-left, read from parts whose terminal array is the pin order.
for (const [k, pin1, pinN] of [['74hc00', '1a', 'vcc'], ['lm386', 'gain1', 'gain8'], ['z80', 'a11', 'a10'], ['555', 'gnd', 'vcc'], ['attiny2313', 'pa2', 'vcc'], ['at89c2051', 'rst', 'vcc'], ['stc15_mcu', 'P0.0', 'P4.5']]) {
  const sc = JSON.parse(fs.readFileSync(path.join(dir, `${k}.json`), 'utf8'));
  const at = Object.fromEntries(sc.terminals.map((t) => [t.name, t]));
  const bottom = sc.terminals.filter((t) => t.y === ROWS).sort((a, b) => a.x - b.x);
  const top = sc.terminals.filter((t) => t.y === 0).sort((a, b) => a.x - b.x);
  assert.equal(bottom[0].name, pin1, `${k}: pin 1 (${pin1}) is bottom-left`);
  assert.equal(at[pinN].x, top[0].x, `${k}: pin N (${pinN}) is top-left, across from pin 1`);
}
assert.ok(checked >= 100, `re-laid DIPs found: ${checked}`);
console.log(`Breadboard DIPs verified: ${checked} sidecars on the 14/38 pitch, footprints = holes, art = generator.`);
