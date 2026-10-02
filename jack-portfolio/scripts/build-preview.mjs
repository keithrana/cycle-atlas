// Builds ONE self-contained HTML file for the Claude cloud preview.
// Claude's cloud pages block outside images, so every image is downloaded
// here and baked into the page as a data: URI.
// Usage: node scripts/build-preview.mjs <output.html>
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const out = process.argv[2] ?? "jack-preview.html";
import { buildSync } from 'esbuild';
import { rmSync, writeFileSync as write } from 'node:fs';

// 1. Read the real list of image URLs from src/data/content.ts
buildSync({ entryPoints: ['src/data/content.ts'], bundle: true, format: 'esm', outfile: 'dist-tmp/content.mjs', logLevel: 'error' });
const content = await import(new URL('../dist-tmp/content.mjs', import.meta.url).href);
rmSync('dist-tmp', { recursive: true, force: true });
const urls = new Set();
const walk = (v) => {
  if (typeof v === 'string' && v.startsWith('https://')) urls.add(v);
  else if (v && typeof v === 'object') Object.values(v).forEach(walk);
};
walk(content);

// 2. Download each one and turn it into a data: URI
const mime = { png: 'image/png', gif: 'image/gif', webp: 'image/webp', jpg: 'image/jpeg' };
const map = {};
let total = 0;
for (const url of urls) {
  try {
    const buf = execFileSync('curl', ['-sSfL', '-m', '60', url], { maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
    const head = buf.subarray(0, 12).toString('latin1');
    const type = head.startsWith('GIF') ? 'gif' : head.includes('WEBP') ? 'webp' : head.startsWith('\x89PNG') ? 'png' : 'jpg';
    map[url] = `data:${mime[type]};base64,${buf.toString('base64')}`;
    total += buf.length;
  } catch {
    console.warn('could not download:', url.slice(0, 90));
  }
}
console.log(`images embedded: ${Object.keys(map).length}/${urls.size} (${(total / 1048576).toFixed(1)} MB)`);

// 3. Build with the pictures baked in, then put the empty lookup file back
const stub = 'src/data/embedded.ts';
const original = readFileSync(stub, 'utf8');
write(stub, `export const embedded: Record<string, string> = ${JSON.stringify(map)};\n`);
try {
  execFileSync('npm', ['run', 'build'], { stdio: 'inherit' });
} finally {
  write(stub, original);
}
const dir = 'dist/assets/';
const files = readdirSync(dir);
let js = readFileSync(dir + files.find((f) => f.endsWith('.js')), 'utf8');
const css = readFileSync(dir + files.find((f) => f.endsWith('.css')), 'utf8');

js = js.replace(/<\/script/g, '<\\/script');
const html = `<title>Jack 3D Creator</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${css}
html,body{background:#0C0C0C}
img{background:linear-gradient(135deg,#17171c,#24242c)}</style>
<div id="root"></div>
<script>document.addEventListener("error",function(e){var t=e.target;if(t&&t.tagName==="IMG"){t.removeAttribute("src");t.alt="";}},true);</script>
<script type="module">${js}</script>
`;
writeFileSync(out, html);
const mb = Buffer.byteLength(html) / 1048576;
console.log(`wrote ${out} (${mb.toFixed(1)} MB)${mb > 16 ? '  WARNING: over the 16 MB page limit' : ''}`);
