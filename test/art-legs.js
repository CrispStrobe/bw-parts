#!/usr/bin/env node
/**
 * art-legs.js — parts whose art was redrawn so its legs are the sidecar's
 * terminals and go into one row of holes (2026-11-24), and the per-variant
 * art of parts the engine models in two forms.
 *
 *  - viewBox is the sidecar's w x h and the art draws a pad at every
 *    terminal's x/y; no two terminals share a point;
 *  - seated in one row, the footprint's columns run in the legs' x order, so
 *    the art scales onto its holes without a leg crossing another;
 *  - `variantArt` entries carry their own w/h/terminals and an SVG drawn to
 *    them, the same way.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dir = path.join(__dirname, '..', 'parts');
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8');

function legsOk(label, box, svg) {
  assert.match(svg, new RegExp(`viewBox="0 0 ${box.w} ${box.h}"`), `${label}: viewBox is the sidecar box`);
  const seen = new Set();
  for (const t of box.terminals) {
    assert.ok(t.x >= 0 && t.x <= box.w && t.y >= 0 && t.y <= box.h, `${label}.${t.name} inside the art`);
    const key = `${t.x},${t.y}`;
    assert.ok(!seen.has(key), `${label}.${t.name}: shares a point with another terminal`);
    seen.add(key);
    assert.ok(svg.includes(`cx="${t.x}" cy="${t.y}"`), `${label}.${t.name}: the art draws a pad at the terminal`);
  }
}

const ONE_ROW = ['as5600', 'bmp280', 'ina219', 'tcs34725', 'vl53l0x', 'neopixel', 'pmos', 'usb_a', 'solar_cell',
  'tcs3200', 'eater6502', 'ir_remote', 'mcp4725'];
for (const k of ONE_ROW) {
  const sc = JSON.parse(read(`${k}.json`));
  legsOk(k, sc, read(`${k}.svg`));
  const ys = new Set(sc.terminals.map((t) => t.y));
  assert.equal(ys.size, 1, `${k}: every leg on one edge`);
  const leads = sc.footprint && sc.footprint.leads;
  assert.ok(leads, `${k}: seatable`);
  const byX = [...sc.terminals].sort((a, b) => a.x - b.x).map((t) => t.name);
  const byCol = Object.keys(leads).sort((a, b) => leads[a].dCol - leads[b].dCol);
  assert.deepEqual(byCol, byX, `${k}: footprint columns run in the legs' order`);
  assert.ok(Object.values(leads).every((l) => l.dRow === 0), `${k}: one row`);
}
let variants = 0;
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.json'))) {
  const sc = JSON.parse(read(f));
  for (const v of sc.variantArt || []) {
    variants++;
    const label = `${sc.kind}[${v.param}=${v.value}]`;
    assert.ok(Array.isArray(sc.variants) && sc.variants.some((x) => x.param === v.param && x.values.includes(v.value)), `${label}: a declared variant`);
    assert.ok(fs.existsSync(path.join(dir, v.art)), `${label}: ${v.art} exists`);
    legsOk(label, v, read(v.art));
  }
}
assert.ok(variants >= 2, `variant art found: ${variants}`);
console.log(`Art legs verified: ${ONE_ROW.length} one-row parts, ${variants} variant arts.`);
