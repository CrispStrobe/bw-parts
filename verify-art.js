#!/usr/bin/env node
/**
 * verify-art.js — Render all SVG part art into an HTML montage page,
 * screenshot it with Playwright, and save as ART-PROOF.png.
 */
const fs = require('fs');
const path = require('path');

const PARTS_DIR = path.join(__dirname, 'parts');
const OUT_HTML = path.join(__dirname, 'art-montage.html');
const OUT_PNG = path.join(__dirname, 'ART-PROOF.png');

// Gather all .svg files in parts/
const svgFiles = fs.readdirSync(PARTS_DIR)
  .filter(f => f.endsWith('.svg'))
  .sort();

if (svgFiles.length === 0) {
  console.error('No SVG files found in parts/');
  process.exit(1);
}

// Build HTML montage
const cells = svgFiles.map(f => {
  const kind = f.replace('.svg', '');
  const svgContent = fs.readFileSync(path.join(PARTS_DIR, f), 'utf8');
  // Read metadata if available
  const jsonPath = path.join(PARTS_DIR, kind + '.json');
  let meta = '';
  if (fs.existsSync(jsonPath)) {
    const m = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const terms = (m.terminals || []).map(t => t.name).join(', ');
    meta = `<div class="meta">${m.w}x${m.h} | ${terms}</div>`;
  }
  return `
    <div class="cell">
      <div class="svg-container">${svgContent}</div>
      <div class="label">${kind}</div>
      ${meta}
    </div>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>bw-parts Art Montage</title>
<style>
  body { background: #1a1a2e; color: #e0e0e0; font-family: monospace;
         margin: 20px; }
  h1 { text-align: center; color: #8ab4f8; margin-bottom: 24px; }
  .grid { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; }
  .cell { background: #2a2a4a; border: 1px solid #444; border-radius: 8px;
          padding: 12px; text-align: center; width: 140px; }
  .svg-container { display: flex; align-items: center; justify-content: center;
                   min-height: 80px; background: #222240; border-radius: 4px;
                   padding: 8px; margin-bottom: 8px; }
  .svg-container svg { max-width: 120px; max-height: 80px; }
  .label { font-weight: bold; font-size: 11px; color: #8ab4f8; }
  .meta { font-size: 9px; color: #888; margin-top: 4px; word-break: break-all; }
  .footer { text-align: center; margin-top: 24px; color: #666; font-size: 11px; }
</style>
</head>
<body>
<h1>bw-parts SVG Art Montage — ${svgFiles.length} parts</h1>
<div class="grid">
${cells}
</div>
<div class="footer">Generated ${new Date().toISOString().slice(0, 10)} by verify-art.js</div>
</body>
</html>`;

fs.writeFileSync(OUT_HTML, html);
console.log(`Wrote montage HTML: ${OUT_HTML} (${svgFiles.length} SVGs)`);

// Screenshot with Playwright
(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  await page.goto('file://' + OUT_HTML);
  // Wait for rendering
  await page.waitForTimeout(500);
  // Full-page screenshot
  await page.screenshot({ path: OUT_PNG, fullPage: true });
  await browser.close();
  console.log(`Wrote screenshot: ${OUT_PNG}`);
})();
