'use strict';
// Glimmer server: serves the page and keeps the AI key secret.
// The browser never sees LAOZHANG_API_KEY; it only talks to /api/image here.
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Read the private .env file next to this script (works with Windows line endings).
try {
  fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/).forEach(line => {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !line.trim().startsWith('#') && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  });
} catch (e) { /* no .env file: fine, demo mode */ }

const PORT = Number(process.env.PORT || 3000);
const KEY = process.env.LAOZHANG_API_KEY || '';
const BASE = (process.env.LAOZHANG_BASE_URL || 'https://api.laozhang.ai').replace(/\/+$/, '');
const MODEL = process.env.IMAGE_MODEL || 'gpt-image-1'; // confirm in your laozhang.ai dashboard
const HOST = process.env.HOST || '127.0.0.1'; // 127.0.0.1 = this computer only
const PASSWORD = process.env.ACCESS_PASSWORD || '';
const MAX_PROMPT = 300;
const STYLES = ['Dreamy', 'Geometric', 'Neon', 'Waves', 'Paper cut'];
const SIZES = { Square: '1024x1024', Wide: '1536x1024', Tall: '1024x1536' };

// very small rate limit: 10 requests per minute per visitor
const hits = new Map();
function limited(ip) {
  const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < 60000);
  list.push(now); hits.set(ip, list);
  return list.length > 10;
}

function send(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > 4096) { reject(new Error('too big')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function makeImage(req, res) {
  if (limited(req.socket.remoteAddress)) return send(res, 429, { error: 'Slow down: too many requests. Try again in a minute.' });
  let input;
  try { input = JSON.parse(await readBody(req)); } catch (e) { return send(res, 400, { error: 'Bad request.' }); }
  const prompt = typeof input.prompt === 'string' ? input.prompt.trim() : '';
  if (!prompt || prompt.length > MAX_PROMPT) return send(res, 400, { error: 'Prompt must be 1 to ' + MAX_PROMPT + ' characters.' });
  const style = STYLES.includes(input.style) ? input.style : 'Dreamy';
  const size = SIZES[input.ratio] || SIZES.Square;
  const n = [1, 2, 4].includes(input.count) ? input.count : 1;
  if (!KEY) return send(res, 503, { error: 'No AI key is set on the server.' });

  try {
    const up = await fetch(BASE + '/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY },
      body: JSON.stringify({ model: MODEL, prompt: prompt + ', ' + style.toLowerCase() + ' style', n, size }),
      signal: AbortSignal.timeout(90000),
    });
    const data = await up.json().catch(() => ({}));
    if (!up.ok) { console.error('upstream', up.status); return send(res, 502, { error: 'The AI service said no (code ' + up.status + ').' }); }
    const images = (data.data || []).map(d => d.b64_json ? { src: 'data:image/png;base64,' + d.b64_json } : { src: d.url }).filter(i => typeof i.src === 'string');
    if (!images.length) return send(res, 502, { error: 'The AI service sent nothing back.' });
    send(res, 200, { images });
  } catch (e) {
    console.error('upstream failed:', e.name);
    send(res, 504, { error: 'Could not reach the AI service.' });
  }
}

function allowed(req) {
  if (!PASSWORD) return true;
  const m = /^Basic (.+)$/.exec(req.headers.authorization || '');
  if (!m) return false;
  const given = Buffer.from(Buffer.from(m[1], 'base64').toString('utf8').split(':').slice(1).join(':'));
  const want = Buffer.from(PASSWORD);
  return given.length === want.length && crypto.timingSafeEqual(given, want);
}

http.createServer((req, res) => {
  if (!allowed(req)) { res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Glimmer"' }); return res.end('Password needed'); }
  const url = req.url.split('?')[0];
  if (url === '/favicon.ico') { res.writeHead(204); return res.end(); }
  if (req.method === 'GET' && url === '/api/status') return send(res, 200, { real: !!KEY });
  if (req.method === 'POST' && url === '/api/image') return makeImage(req, res);
  if (req.method === 'GET' && (url === '/' || url === '/index.html')) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; media-src 'self' blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'",
    });
    return fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
  }
  send(res, 404, { error: 'Not found' });
}).listen(PORT, HOST, () => {
  console.log('Glimmer is running: http://localhost:' + PORT + (KEY ? '  (real AI on)' : '  (demo mode: no key set)'));
  if (HOST !== '127.0.0.1') console.log(PASSWORD ? 'Open to your home network, password required.' : 'WARNING: open to your network with NO password. Set ACCESS_PASSWORD.');
});
