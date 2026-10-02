// Builds ONE self-contained HTML page for the Claude cloud preview.
// Claude's cloud pages block outside images and files, so photos and fonts are baked in.
// Usage: node scripts/build-preview.mjs <output.html>
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const out = process.argv[2] ?? 'preview.html';
execFileSync('npm', ['run', 'build'], { stdio: 'inherit', env: { ...process.env, INLINE: '1' } });

const dir = 'dist/assets/';
const files = readdirSync(dir);
const js = readFileSync(dir + files.find((f) => f.endsWith('.js')), 'utf8').replace(/<\/script/g, '<\\/script');
const css = readFileSync(dir + files.find((f) => f.endsWith('.css')), 'utf8');

const html = `<meta charset="utf-8">
<title>Keith Rana Portfolio</title>
<style>${css}
html,body{background:#0C0C0C}</style>
<div id="root"></div>
<script type="module">${js}</script>
`;
writeFileSync(out, html);
const mb = Buffer.byteLength(html) / 1048576;
console.log(`wrote ${out} (${mb.toFixed(1)} MB)${mb > 16 ? '  WARNING: over the 16 MB page limit' : ''}`);
