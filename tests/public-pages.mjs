// Dependency-free browser checks against a production build.
// Windows defaults to Edge; set BROWSER_BIN for another Chromium executable.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const port = 3191;
const debugPort = 9291;
const origin = `http://127.0.0.1:${port}`;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const profile = await mkdtemp(join(tmpdir(), 'putri-public-check-'));
const browserBin = process.env.BROWSER_BIN || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(port)], { stdio: 'ignore' });
const browser = spawn(browserBin, ['--headless=new', '--disable-gpu', '--no-proxy-server', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore', windowsHide: true });
let socket;
let call;
let spawnError;
server.on('error', error => { spawnError = error; });
browser.on('error', error => { spawnError = error; });

try {
  let tabs;
  for (let attempt = 0; attempt < 80; attempt++) {
    if (spawnError) throw spawnError;
    try {
      tabs = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
      await fetch(`${origin}/id/tulisan`);
      if (tabs.some(tab => tab.type === 'page')) break;
    } catch { /* Wait for our server and browser. */ }
    await wait(100);
  }
  assert(tabs?.some(tab => tab.type === 'page'), 'Production server and Chromium must be available.');
  socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const promise = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) promise.reject(message.error); else promise.resolve(message.result);
  });
  call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const navigate = async path => {
    await call('Page.navigate', { url: origin + path });
    let loaded = false;
    for (let attempt = 0; attempt < 80; attempt++) {
      await wait(70);
      loaded = await evaluate(`location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete' && !!document.querySelector('h1')`);
      if (loaded) break;
    }
    assert(loaded, `Page loaded: ${path}`);
    await evaluate('document.fonts.ready.then(() => true)');
    await wait(150);
  };
  const choose = async (index, value) => {
    await evaluate(`(() => { const control = document.querySelectorAll('.filters select')[${index}]; control.value = ${JSON.stringify(value)}; control.dispatchEvent(new Event('change', { bubbles: true })); })()`);
    await wait(70);
  };
  const count = () => evaluate("document.querySelectorAll('.article-grid .article-item').length");

  if (process.env.CHECK_ONLY !== 'keyboard') {
  const slugs = ['ekonomi', 'ruang-publik', 'jeda', 'pilihan'];
  for (const slug of slugs) {
    assert.equal((await fetch(`${origin}/id/tulisan/${slug}`)).status, 200);
    const redirect = await fetch(`${origin}/en/tulisan/${slug}`, { redirect: 'manual' });
    assert.equal(redirect.status, 308);
    assert.equal(new URL(redirect.headers.get('location'), origin).pathname, `/id/tulisan/${slug}`);
  }
  for (const locale of ['id', 'en']) {
    const response = await fetch(`${origin}/${locale}/tulisan/tidak-ada`);
    assert.equal(response.status, 404);
    assert.match(await response.text(), /404/);
  }
  console.log('PASS article routes, original-language redirects, HTTP 404');

  for (const locale of ['id', 'en']) {
    await navigate(`/${locale}/tulisan`);
    assert.equal(await count(), 4);
    await choose(0, 'economy'); assert.equal(await count(), 2);
    await choose(1, 'article'); assert.equal(await count(), 1);
    await choose(0, 'policy'); assert.equal(await count(), 0);
    assert(await evaluate("!!document.querySelector('.empty-state')"));
    await choose(1, 'noteFormat'); assert.equal(await count(), 1);
    await choose(0, 'literature'); await choose(1, 'poem'); assert.equal(await count(), 1);
    assert.equal(await evaluate("document.querySelector('.article-item h3 a').getAttribute('href')"), '/id/tulisan/jeda');
    await evaluate("document.querySelector('.filters button').click()"); await wait(70); assert.equal(await count(), 4);
    assert(await evaluate("[...document.querySelectorAll('.article-item h3 a')].every(link => link.getAttribute('href').startsWith('/id/tulisan/'))"));
  }
  console.log('PASS filters, combined empty results, reset, canonical article links');

  await navigate('/id/tulisan/ekonomi');
  assert.equal(await evaluate("document.querySelector('link[rel=canonical]').getAttribute('href')"), '/id/tulisan/ekonomi');
  assert(await evaluate("!!document.querySelector('.article-body h2') && !!document.querySelector('.article-body h3') && !!document.querySelector('.article-body blockquote') && !!document.querySelector('.article-body ul') && !!document.querySelector('.article-body ol') && !!document.querySelector('.article-body img') && !!document.querySelector('time[datetime]')"));
  assert.equal(await evaluate("document.querySelectorAll('.related-section .article-item').length"), 2);
  // Exercise actual browser clipboard (permission granted by the browser protocol).
  await call('Browser.grantPermissions', { origin, permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'] });
  await evaluate("document.querySelector('.share-control button').click()"); await wait(150);
  assert.match(await evaluate("document.querySelector('.share-control [role=status]').textContent"), /berhasil/);
  assert.equal(await evaluate('navigator.clipboard.readText()'), `${origin}/id/tulisan/ekonomi`);
  // Simulate a denied clipboard to exercise the visible failure and retry path.
  await evaluate("Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Denied'); } } }); document.querySelector('.share-control button').click()"); await wait(100);
  assert.match(await evaluate("document.querySelector('.share-control [role=status]').textContent"), /Gagal/);
  assert.equal(await evaluate("document.querySelector('.share-control button').disabled"), false);
  await navigate('/id/tulisan/jeda');
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.article-body .poem')].map(node => node.textContent)"), ['pagi menyisakan cahaya\ndi tepi meja', 'kata-kata menunggu\nruang untuk pulang']);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.article-body .poem')).whiteSpace"), 'pre-wrap');
  assert.equal(await evaluate("document.querySelectorAll('.reading-column figure').length"), 0);
  console.log('PASS content blocks, related writing, clipboard success/failure, poem stanzas, no-cover detail');

  const pages = ['tulisan', 'tentang', 'aktivitas', 'kontak'];
  for (const theme of ['light', 'dark']) {
    await evaluate(`localStorage.setItem('putri-theme', '${theme}')`);
    for (const width of [360, 768, 1440]) {
      await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
      for (const path of [...['id', 'en'].flatMap(locale => pages.map(page => `/${locale}/${page}`)), '/id/tulisan/ekonomi', '/id/tulisan/jeda']) {
        await navigate(path);
        assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `No overflow: ${path}, ${theme}, ${width}`);
        assert.equal(await evaluate('document.documentElement.dataset.theme'), theme);
        if (path.endsWith('kontak')) assert.equal(await evaluate("document.querySelectorAll('form, a[href^=mailto], a[href^=tel]').length"), 0);
      }
      console.log(`PASS public page widths ${width}, ${theme}, ID/EN`);
    }
  }
  }
  await call('Emulation.setDeviceMetricsOverride', { width: 360, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate('/en/tulisan');
  await call('Page.bringToFront');
  await evaluate("document.querySelector('.menu-toggle').focus()");
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' });
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await wait(100);
  assert(await evaluate("document.activeElement === document.querySelector('#main-navigation a')"), JSON.stringify(await evaluate("({active: document.activeElement.outerHTML, open: document.querySelector('.menu-toggle').getAttribute('aria-expanded')})")));
  assert.equal(await evaluate("document.querySelectorAll('#main-navigation a').length"), 5);
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  assert.equal(await evaluate("document.activeElement.getAttribute('href')"), '/en/tulisan');
  assert.equal(await evaluate('getComputedStyle(document.activeElement).outlineStyle'), 'solid');
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  assert(await evaluate("document.activeElement === document.querySelector('.menu-toggle')"));
  await navigate('/id/tulisan');
  await evaluate("document.querySelector('.filters select').focus()");
  assert.equal(await evaluate('getComputedStyle(document.activeElement).outlineStyle'), 'solid');
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 });
  await wait(100);
  assert.equal(await count(), 2, 'Category filter can be changed with the keyboard');
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.public-page')).paddingTop"), '40px');
  console.log('PASS keyboard menu, navigation focus, filter focus, reduced-motion layout');
  if (process.env.SCREENSHOT_PATH) {
    const screenshot = await call('Page.captureScreenshot', { format: 'png' });
    await writeFile(process.env.SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'));
  }
  await call('Browser.close');
} finally {
  socket?.close();
  browser.kill();
  server.kill();
}
