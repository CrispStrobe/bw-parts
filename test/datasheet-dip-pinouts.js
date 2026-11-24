#!/usr/bin/env node
// The DIPs scripts/fix-dip-pinouts.js put on their datasheet pinout stay there:
// pin p of N sits at dRow 5, dCol p-1 for p <= N/2, else dRow 0, dCol N-p,
// the terminal array is in pin order, and the art is the generator's.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { PINOUTS } = require('../scripts/fix-dip-pinouts.js');

const root = path.join(__dirname, '..');
for (const [kind, order] of Object.entries(PINOUTS)) {
  const sc = JSON.parse(fs.readFileSync(path.join(root, 'parts', `${kind}.json`), 'utf8'));
  const n = order.length;
  assert.deepEqual(sc.terminals.map((t) => t.name), order, `${kind}: terminals in datasheet pin order`);
  order.forEach((name, i) => {
    const pin = i + 1, bottom = pin <= n / 2;
    assert.deepEqual(sc.footprint.leads[name], { dRow: bottom ? 5 : 0, dCol: bottom ? pin - 1 : n - pin },
      `${kind}: pin ${pin} (${name})`);
  });
  assert.equal(sc.footprint.refTerminal, order[n - 1], `${kind}: pin ${n} is the top-left reference`);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), `bw-parts-${kind}-`));
  try {
    fs.mkdirSync(path.join(temp, 'parts'));
    fs.copyFileSync(path.join(root, 'generate-dip-art.js'), path.join(temp, 'generate-dip-art.js'));
    fs.copyFileSync(path.join(root, 'parts', `${kind}.json`), path.join(temp, 'parts', `${kind}.json`));
    execFileSync(process.execPath, ['generate-dip-art.js', kind], { cwd: temp, stdio: 'pipe' });
    assert.equal(fs.readFileSync(path.join(temp, 'parts', `${kind}.svg`), 'utf8'),
      fs.readFileSync(path.join(root, 'parts', `${kind}.svg`), 'utf8'), `${kind}: art is generator-owned`);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}
console.log(`Datasheet DIP pinouts verified: ${Object.keys(PINOUTS).join(', ')}.`);
