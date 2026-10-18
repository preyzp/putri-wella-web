// Smoke test a production build with no Sanity configuration. No cloud requests.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const origin = 'http://127.0.0.1:3192';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3192'], { stdio: 'ignore', env: { ...process.env, NEXT_PUBLIC_SANITY_PROJECT_ID: '', NEXT_PUBLIC_SANITY_DATASET: '' } });
let error;
server.on('error', value => { error = value; });
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (error) throw error;
    try { await fetch(`${origin}/studio`); ready = true; break; } catch { await new Promise(resolve => setTimeout(resolve, 100)); }
  }
  assert(ready, 'Production server must start');
  for (const path of ['/studio', '/studio/structure']) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Studio belum dikonfigurasi/);
    assert.match(html, /NEXT_PUBLIC_SANITY_PROJECT_ID/);
    assert.match(html, /NEXT_PUBLIC_SANITY_DATASET/);
    assert.match(html, /noindex/);
    console.log(`PASS ${path}: safe setup instructions, noindex`);
  }
  // Focused regression checks only: Studio must not capture existing public routes or article URLs.
  assert.equal((await fetch(`${origin}/id/tulisan/ekonomi`)).status, 200);
  assert.equal((await fetch(`${origin}/id/tulisan/tidak-ada`)).status, 404);
  assert.equal((await fetch(`${origin}/en/tulisan/ekonomi`, { redirect: 'manual' })).status, 308);
  console.log('PASS public article route, HTTP 404, EN canonical redirect preserved');
} finally { server.kill(); }
