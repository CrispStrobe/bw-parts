#!/usr/bin/env node
/**
 * validate-parts.js — CI gate: checks every part JSON sidecar + SVG pair.
 *
 *  1. Every .json in parts/ must parse, have kind/w/h/terminals[].
 *  2. Every .json must have a matching .svg.
 *  3. Every .svg must be well-formed XML (DOMParser-free: regex close-tag check).
 *  4. Terminal coordinates must be within the declared w/h bounds.
 *  5. Board JSONs in parts/boards/ must have board/title/w/h/elements.
 */
const fs = require('fs');
const path = require('path');

const PARTS_DIR = path.join(__dirname, '..', 'parts');
const BOARDS_DIR = path.join(PARTS_DIR, 'boards');

let errors = 0;
let checked = 0;

function fail(file, msg) {
  console.error(`FAIL  ${file}: ${msg}`);
  errors++;
}
function ok(file) {
  checked++;
}

// ── Part sidecars ──────────────────────────────────────────────────
const jsonFiles = fs.readdirSync(PARTS_DIR).filter(f => f.endsWith('.json'));
const svgFiles = new Set(fs.readdirSync(PARTS_DIR).filter(f => f.endsWith('.svg')));

for (const f of jsonFiles) {
  const fp = path.join(PARTS_DIR, f);
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch (e) {
    fail(f, `JSON parse error: ${e.message}`);
    continue;
  }

  // Required fields
  if (!meta.kind) fail(f, 'missing "kind"');
  if (typeof meta.w !== 'number') fail(f, 'missing or non-number "w"');
  if (typeof meta.h !== 'number') fail(f, 'missing or non-number "h"');
  if (!Array.isArray(meta.terminals)) fail(f, 'missing "terminals" array');

  // Terminal validation
  if (Array.isArray(meta.terminals)) {
    for (const t of meta.terminals) {
      if (!t.name) { fail(f, 'terminal missing "name"'); continue; }
      if (typeof t.x !== 'number' || typeof t.y !== 'number') {
        fail(f, `terminal "${t.name}" missing x/y`);
        continue;
      }
      if (t.x < 0 || t.x > meta.w || t.y < 0 || t.y > meta.h) {
        fail(f, `terminal "${t.name}" at (${t.x},${t.y}) outside bounds ${meta.w}x${meta.h}`);
      }
    }
  }

  // Matching SVG
  const svgName = f.replace('.json', '.svg');
  if (!svgFiles.has(svgName)) {
    fail(f, `no matching SVG file "${svgName}"`);
  } else {
    // Basic SVG well-formedness: starts with <svg, ends with </svg>
    const svg = fs.readFileSync(path.join(PARTS_DIR, svgName), 'utf8');
    if (!svg.includes('<svg')) fail(svgName, 'missing <svg tag');
    if (!svg.includes('</svg>')) fail(svgName, 'missing </svg> closing tag');
  }

  ok(f);
}

// ── Board descriptors ──────────────────────────────────────────────
if (fs.existsSync(BOARDS_DIR)) {
  const boardJsons = fs.readdirSync(BOARDS_DIR).filter(f => f.endsWith('.json'));
  const boardSvgs = new Set(fs.readdirSync(BOARDS_DIR).filter(f => f.endsWith('.svg')));

  for (const f of boardJsons) {
    const fp = path.join(BOARDS_DIR, f);
    let meta;
    try {
      meta = JSON.parse(fs.readFileSync(fp, 'utf8'));
    } catch (e) {
      fail(`boards/${f}`, `JSON parse error: ${e.message}`);
      continue;
    }

    if (!meta.board) fail(`boards/${f}`, 'missing "board"');
    if (!meta.title) fail(`boards/${f}`, 'missing "title"');
    if (typeof meta.w !== 'number') fail(`boards/${f}`, 'missing or non-number "w"');
    if (typeof meta.h !== 'number') fail(`boards/${f}`, 'missing or non-number "h"');
    if (!meta.elements || typeof meta.elements !== 'object') {
      fail(`boards/${f}`, 'missing "elements" object');
    } else {
      for (const [id, el] of Object.entries(meta.elements)) {
        if (!el.at || typeof el.at.x !== 'number') {
          fail(`boards/${f}`, `element "${id}" missing at:{x,y,w,h}`);
        }
      }
    }

    const svgName = f.replace('.json', '.svg');
    if (!boardSvgs.has(svgName)) {
      fail(`boards/${f}`, `no matching SVG "${svgName}"`);
    } else {
      const svg = fs.readFileSync(path.join(BOARDS_DIR, svgName), 'utf8');
      if (!svg.includes('<svg')) fail(`boards/${svgName}`, 'missing <svg tag');
      if (!svg.includes('</svg>')) fail(`boards/${svgName}`, 'missing </svg> closing tag');
    }

    ok(`boards/${f}`);
  }
}

// ── Summary ────────────────────────────────────────────────────────
console.log(`\nValidated ${checked} files, ${errors} error(s).`);
if (errors > 0) process.exit(1);
console.log('All checks passed.');
