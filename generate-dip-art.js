#!/usr/bin/env node
/**
 * generate-dip-art.js — DIP art on the breadboard pitch, from the sidecar.
 *
 * The JSON is the authority. A DIP sidecar still in the old upright layout
 * (pins on two side columns) is first re-laid onto the breadboard pitch —
 * w, h, terminal x/y, footprint leads and refTerminal change, nothing else —
 * and marked with `dip: {label, subtitle}`; then the SVG is written as a pure
 * function of the JSON, so re-running it on a re-laid sidecar reproduces the
 * committed art byte for byte.
 *
 * Usage: node generate-dip-art.js 74hc00 [lm386 ...]
 *        node generate-dip-art.js --dir <parts dir> 74hc00   (another copy)
 *
 * The layout. A DIP sidecar used to be drawn upright with its pins on two side columns
 * 5 units apart. Seated on a breadboard the same chip lies across the gutter:
 * its pins sit on the 14-unit hole pitch, in row e (above the gutter) and row
 * f (below it), 38 units apart. Upright art could never put its legs into
 * those holes, so the designer drew DIPs as a box. This module re-lays a DIP
 * sidecar the way it sits on the board, seen from above with the notch to the
 * LEFT:
 *
 *   - pins 1..N/2 run left to right along the BOTTOM row (row f, dRow 5),
 *   - pins N/2+1..N run right to left along the TOP row (row e, dRow 0),
 *     so pin N is top-left and is the footprint's reference (dRow 0, dCol 0),
 *   - a pin's x is 10 + 14 * its column, top-row pins have y = 0 and
 *     bottom-row pins y = 38 (= h): the terminal x/y ARE the leg tips, which
 *     are the holes.
 *
 * The upright sidecars give the pin order by geometry: the left column, top
 * to bottom, is pins 1..N/2; the right column, top to bottom, is pins N..N/2+1.
 * Columns come from the sidecar's footprint where it has one (so modeled pins
 * keep the gaps of unmodeled ones, as on the UM245R, and pin 1 shares a
 * column with pin N), else from that order.
 * Many footprints had pins 1..N/2 on dRow 0 — the chip seen from BELOW, a
 * mirror image no real part can be seated as. The re-laid footprint puts
 * pin 1's row on dRow 5, keeping every column.
 *
 * `dip: {label, subtitle}` in the sidecar marks it as re-laid and carries the
 * text the art prints, so the art is a pure function of the JSON.
 */
'use strict';

const PITCH = 14;     // breadboard hole pitch
const ROWS = 38;      // row e to row f across the gutter
const MARGIN = 10;    // body end to the first/last leg
const LEG = 7;        // leg length from the body edge to the hole

/** Escape text for SVG. */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** True when a sidecar is already laid out on the breadboard pitch. */
function isBreadboardDip(sc) {
  return !!(sc && sc.dip && typeof sc.dip === 'object');
}

/**
 * Re-lay an upright DIP sidecar. Returns {w, h, at: name -> {x, y}, leads,
 * refTerminal} without touching the input, or throws when a pin cannot be
 * placed honestly.
 */
function layout(sc) {
  const pins = sc.terminals.filter((t) => !t.internal);
  const left = pins.filter((t) => t.x <= sc.w / 2 && !(t.x > 0 && t.x < sc.w && t.y === sc.h))
    .sort((a, b) => a.y - b.y);
  const right = pins.filter((t) => t.x > sc.w / 2 && !(t.x > 0 && t.x < sc.w && t.y === sc.h))
    .sort((a, b) => a.y - b.y);
  const fp = sc.footprint && sc.footprint.straddlesGutter ? sc.footprint : null;
  const place = {}; // name -> {row: 'top'|'bottom', col}
  if (fp) {
    for (const t of pins) {
      const lead = fp.leads[t.name];
      if (!lead) throw new Error(`${sc.kind}: terminal ${t.name} has no footprint lead`);
      place[t.name] = { col: lead.dCol };
    }
    // The row comes from the pin's side: pins 1..N/2 (left column) go below
    // the gutter. A pin on neither side column (a module's middle pad) keeps
    // the row its footprint gives it.
    for (const t of left) place[t.name].row = 'bottom';
    for (const t of right) place[t.name].row = 'top';
    for (const t of pins) {
      if (!place[t.name].row) place[t.name].row = fp.leads[t.name].dRow >= 5 ? 'bottom' : 'top';
    }
    // Pins 1..N/2 must run left to right (pin 1 leftmost). The top row's
    // order is the footprint's: a few upright arts drew the right column as a
    // U (pin N/2+1 at the top), while their footprints pair pin 1 with pin N
    // in one column as the package does, so the footprint is the authority.
    for (const [side, list] of [['bottom', left]]) {
      const cols = list.map((t) => place[t.name].col);
      for (let i = 1; i < cols.length; i++) {
        if (!(cols[i] > cols[i - 1])) throw new Error(`${sc.kind}: ${side} row columns out of pin order (${list.map((t) => t.name).join(',')})`);
      }
    }
  } else {
    left.forEach((t, i) => { place[t.name] = { row: 'bottom', col: i - (left.length - 1) / 2 }; });
    right.forEach((t, i) => { place[t.name] = { row: 'top', col: i - (right.length - 1) / 2 }; });
    for (const t of pins) if (!place[t.name]) throw new Error(`${sc.kind}: ${t.name} is on neither side`);
  }
  const cols = Object.values(place).map((p) => p.col);
  const min = Math.min(...cols), max = Math.max(...cols);
  const w = (max - min) * PITCH + 2 * MARGIN;
  const at = {};
  for (const [name, p] of Object.entries(place)) {
    at[name] = { x: MARGIN + (p.col - min) * PITCH, y: p.row === 'top' ? 0 : ROWS };
  }
  let leads = null, refTerminal = null;
  if (fp) {
    leads = {};
    for (const [name, p] of Object.entries(place)) leads[name] = { dRow: p.row === 'top' ? 0 : 5, dCol: p.col - min };
    const top = Object.entries(leads).filter(([, l]) => l.dRow === 0).sort((a, b) => a[1].dCol - b[1].dCol);
    refTerminal = (top[0] || Object.entries(leads)[0])[0];
  }
  return { w, h: ROWS, at, leads, refTerminal };
}

/** Find the [start, end) span of the JSON object value of `key` (first match). */
function objectSpan(text, key, from = 0) {
  const k = text.indexOf(`"${key}"`, from);
  if (k < 0) return null;
  const open = text.indexOf('{', k);
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') { depth--; if (depth === 0) return [open, i + 1]; }
  }
  return null;
}

const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Apply a layout to the sidecar's JSON TEXT, changing only w, h, terminal
 * x/y, the footprint's leads and refTerminal, and adding `dip` — the rest of
 * the file keeps its formatting byte for byte.
 */
function rewriteJson(text, sc, lay, dip) {
  let out = text;
  const one = (re, rep, what) => {
    const m = out.match(re);
    if (!m) throw new Error(`${sc.kind}: cannot find ${what}`);
    out = out.replace(re, rep);
  };
  one(/^(\s*)"w": [0-9.]+,/m, `$1"w": ${lay.w},`, 'w');
  const ind = (out.match(/^(\s*)"h":/m) || [, '  '])[1];
  one(/^(\s*)"h": [0-9.]+,/m, `$1"h": ${lay.h},\n$1"dip": ${JSON.stringify(dip, null, 2).replace(/\n/g, `\n${ind}`)},`, 'h');
  for (const [name, p] of Object.entries(lay.at)) {
    one(new RegExp(`("name":\\s*"${reEsc(name)}",\\s*"x":\\s*)[0-9.]+(,\\s*"y":\\s*)[0-9.]+`), `$1${p.x}$2${p.y}`, `terminal ${name}`);
  }
  if (lay.leads) {
    const span = objectSpan(out, 'footprint');
    let fpText = out.slice(span[0], span[1]);
    for (const [name, l] of Object.entries(lay.leads)) {
      const re = new RegExp(`("${reEsc(name)}":\\s*\\{\\s*"dRow":\\s*)[0-9]+(,\\s*"dCol":\\s*)[0-9]+`);
      if (!re.test(fpText)) throw new Error(`${sc.kind}: cannot find footprint lead ${name}`);
      fpText = fpText.replace(re, `$1${l.dRow}$2${l.dCol}`);
    }
    fpText = fpText.replace(/("refTerminal":\s*)"[^"]*"/, `$1${JSON.stringify(lay.refTerminal)}`);
    out = out.slice(0, span[0]) + fpText + out.slice(span[1]);
  }
  return out;
}

/** Label and subtitle printed by an upright DIP art (the 5.5 and 3.5 texts). */
function labelsFromArt(svg) {
  const label = svg && (svg.match(/font-size="5\.5"[^>]*>([^<]+)</) || [])[1];
  const subtitle = svg && (svg.match(/font-size="3\.5"[^>]*>([^<]+)</) || [])[1];
  return { label: label || null, subtitle: subtitle || '' };
}

/**
 * The art of a re-laid DIP: a horizontal package over the gutter, notch on
 * the left, a dot at pin 1 (bottom-left), the part name and subtitle, and a
 * leg from the body to every pin's hole with the pin's name beside it.
 */
function renderSvg(kind, sc) {
  const { w, h } = sc;
  const label = esc(sc.dip.label || kind.toUpperCase());
  const sub = sc.dip.subtitle ? esc(sc.dip.subtitle) : '';
  const bodyY = LEG, bodyH = h - 2 * LEG, bodyX = 3, bodyW = w - 6;
  const midY = h / 2;
  const pins = sc.terminals.filter((t) => !t.internal);
  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`);
  out.push(`  <!-- ${label} — ${pins.length}-pin DIP, generated by generate-dip-art.js from ${kind}.json -->`);
  out.push(`  <!-- On the breadboard pitch: legs 14 apart, rows 38 apart across the gutter; notch left, pin 1 bottom-left. -->`);
  for (const t of pins) {
    const top = t.y === 0;
    const y1 = top ? bodyY : bodyY + bodyH;
    out.push(`  <rect x="${t.x - 1.6}" y="${top ? t.y : y1}" width="3.2" height="${LEG}" rx="0.8" fill="#b8bec4" stroke="#8a9096" stroke-width="0.4"/>`);
  }
  // `dip.style`: a moulded chip (default), a module on its own PCB with two
  // header rows, or a metal can (a crystal oscillator).
  const style = STYLES[sc.dip.style] || STYLES.chip;
  out.push(`  <rect x="${bodyX}" y="${bodyY}" width="${bodyW}" height="${bodyH}" rx="${style.rx}" fill="${style.fill}" stroke="${style.stroke}" stroke-width="1"/>`);
  if (style.notch) out.push(`  <path d="M${bodyX} ${midY - 3.5} A3.5 3.5 0 0 1 ${bodyX} ${midY + 3.5}" fill="${style.notch}" stroke="#555" stroke-width="0.6"/>`);
  if (style.pads) {
    for (const t of pins) out.push(`  <rect x="${t.x - 2.2}" y="${t.y === 0 ? bodyY + 0.8 : bodyY + bodyH - 5.2}" width="4.4" height="4.4" fill="#d9b44a" stroke="#8a6d1d" stroke-width="0.4"/>`);
  }
  if (style.sliders) {
    // A DIP switch: one slide switch per column, drawn OFF (slider down).
    for (const x of [...new Set(pins.map((t) => t.x))]) {
      out.push(`  <rect x="${x - 3}" y="${bodyY + 3}" width="6" height="${bodyH - 6}" fill="#f8fafc" stroke="#7f1d1d" stroke-width="0.4"/>`);
      out.push(`  <rect x="${x - 3}" y="${bodyY + bodyH / 2}" width="6" height="${bodyH / 2 - 3}" fill="#cbd5e1"/>`);
    }
  } else {
    out.push(`  <circle cx="${bodyX + 4.5}" cy="${bodyY + bodyH - 7.5}" r="1.4" fill="${style.dot}"/>`);
  }
  if (style.sliders) {
    out.push('</svg>');
    return out.join('\n') + '\n';
  }
  const fit = Math.max(3.5, Math.min(7, (bodyW - 16) / Math.max(1, label.length) / 0.62));
  const ly = sub ? midY + fit / 3 - 2 : midY + fit / 3;
  out.push(`  <text x="${w / 2}" y="${round(ly)}" text-anchor="middle" font-family="monospace" font-size="${round(fit)}" font-weight="bold" fill="${style.ink}">${label}</text>`);
  if (sub) out.push(`  <text x="${w / 2}" y="${round(ly + 5.5)}" text-anchor="middle" font-family="monospace" font-size="3.2" fill="#8c8c8c">${sub}</text>`);
  // A module's pads are its pin marks; names would crowd its header.
  for (const t of style.sliders || style.pads ? [] : pins) {
    const top = t.y === 0;
    const inset = style.pads ? 5.4 : 0; // clear of a module's header pads
    const y = top ? bodyY + 3.6 + inset : bodyY + bodyH - 1.6 - inset;
    const size = t.name.length > 4 ? 2.2 : 2.6;
    out.push(`  <text x="${t.x}" y="${y}" text-anchor="middle" font-family="monospace" font-size="${size}" fill="#7d8790">${esc(t.name)}</text>`);
  }
  out.push('</svg>');
  return out.join('\n') + '\n';
}

const round = (v) => Math.round(v * 100) / 100;

const STYLES = {
  chip: { fill: '#2b2b2b', stroke: '#141414', rx: 2, notch: '#1a1a1a', dot: '#9a9a9a', pads: false, ink: '#d6d6d6' },
  board: { fill: '#1d4f91', stroke: '#123461', rx: 1.5, notch: null, dot: '#e8e8e8', pads: true, ink: '#e6edf5' },
  can: { fill: '#c9ced3', stroke: '#8a9096', rx: 4, notch: null, dot: '#5a5f64', pads: false, ink: '#33383d' },
  switch: { fill: '#b91c1c', stroke: '#7f1d1d', rx: 1.5, notch: null, dot: '#fee2e2', pads: false, ink: '#fee2e2', sliders: true },
};


const fs = require('fs');
const path = require('path');

/** Subtitles for sidecars whose upright art printed none. */
const SUBTITLES = {
  '74hc125': 'QUAD 3-ST BUF',
  '74hc34': 'HEX BUFFER',
  '74hc4050': 'HEX BUF/LVL',
  'lm324': 'QUAD OP AMP',
  'lt1014': 'PRECISION QUAD',
  'lm741': 'SINGLE OP AMP',
  'lm386': 'AUDIO POWER AMP',
};

/** Re-lay (if needed) and draw one kind in `dir`. Returns a log line. */
function generate(kind, dir) {
  const jsonPath = path.join(dir, `${kind}.json`);
  const svgPath = path.join(dir, `${kind}.svg`);
  let text = fs.readFileSync(jsonPath, 'utf8');
  let sc = JSON.parse(text);
  if (!isBreadboardDip(sc)) {
    const old = fs.existsSync(svgPath) ? labelsFromArt(fs.readFileSync(svgPath, 'utf8')) : { label: null, subtitle: '' };
    const dip = { label: old.label || kind.toUpperCase(), subtitle: SUBTITLES[kind] || old.subtitle || '' };
    text = rewriteJson(text, sc, layout(sc), dip);
    sc = JSON.parse(text);
    fs.writeFileSync(jsonPath, text);
  }
  fs.writeFileSync(svgPath, renderSvg(kind, sc));
  return `${kind}: ${sc.terminals.length} pins, ${sc.w}x${sc.h}`;
}

module.exports = { PITCH, ROWS, MARGIN, isBreadboardDip, layout, rewriteJson, labelsFromArt, renderSvg, generate };

if (require.main === module) {
  const args = process.argv.slice(2);
  const dirAt = args.indexOf('--dir');
  const dir = dirAt >= 0 ? path.resolve(args[dirAt + 1]) : path.join(__dirname, 'parts');
  const kinds = args.filter((a, i) => !a.startsWith('--') && (dirAt < 0 || i !== dirAt + 1));
  if (!kinds.length) {
    console.error('usage: node generate-dip-art.js [--dir <parts dir>] <kind>...');
    process.exit(2);
  }
  let failed = 0;
  for (const kind of kinds) {
    try { console.log(generate(kind, dir)); } catch (e) { console.error(`FAIL ${kind}: ${e.message}`); failed++; }
  }
  process.exit(failed ? 1 : 0);
}
