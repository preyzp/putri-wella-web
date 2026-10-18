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

  if (!['keyboard', 'header-contact'].includes(process.env.CHECK_ONLY)) {
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
        if (path.endsWith('kontak')) {
          assert.equal(await evaluate("document.querySelectorAll('form').length"), 0);
          assert.equal(await evaluate("document.querySelector('a[href^=mailto]').getAttribute('href')"), 'mailto:putriwella97@gmail.com');
        }
      }
      console.log(`PASS public page widths ${width}, ${theme}, ID/EN`);
    }
  }
  }
  if (process.env.CHECK_ONLY !== 'keyboard') {
    const errors = [];
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.method === 'Runtime.exceptionThrown' || (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error')) errors.push(message.params);
    });
    await call('Runtime.enable');
    const geometry = () => evaluate(`(() => {
      const rect = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return [r.x,r.y,r.width,r.height]; };
      return { header: rect('.site-header'), logo: rect('.wordmark'), controls: rect('.header-controls'), theme: rect('.theme-toggle') };
    })()`);
    const expectTheme = async (locale, theme) => {
      assert.equal(await evaluate('document.documentElement.dataset.theme'), theme);
      const label = locale === 'id' ? (theme === 'dark' ? 'Beralih ke tema terang' : 'Beralih ke tema gelap') : (theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      const { nodes } = await call('Accessibility.getFullAXTree');
      assert(nodes.some(node => !node.ignored && node.role?.value === 'button' && node.name?.value === label), `Accessible theme action: ${label}`);
      const expectedIcon = theme === 'dark' ? 'theme-to-light' : 'theme-to-dark';
      assert.equal(await evaluate(`document.querySelector('.theme-toggle svg.${expectedIcon}').getAttribute('aria-hidden')`), 'true');
      assert.notEqual(await evaluate(`getComputedStyle(document.querySelector('.theme-toggle svg.${expectedIcon}')).display`), 'none');
      assert.equal(await evaluate(`document.querySelectorAll('.header-controls select').length`), 0);
    };
    for (const locale of ['id', 'en']) for (const system of ['light', 'dark']) {
      await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: system }] });
      await navigate(`/${locale}/kontak`);
      await evaluate("localStorage.removeItem('putri-theme')");
      for (const width of [360, 768, 1440]) {
        await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
        await navigate(`/${locale}/kontak`);
        await call('Page.bringToFront');
        await expectTheme(locale, system);
        assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
        const before = await geometry();
        assert.equal(before.theme[2], 44); assert.equal(before.theme[3], 44);
        await evaluate("document.querySelector('.theme-toggle').click()"); await wait(80);
        const opposite = system === 'dark' ? 'light' : 'dark';
        await expectTheme(locale, opposite);
        assert.equal(await evaluate("localStorage.getItem('putri-theme')"), opposite);
        assert.deepEqual(await geometry(), before, 'Theme toggle must not move the header');
        await navigate(`/${locale}/kontak`); await expectTheme(locale, opposite);
        await evaluate("document.querySelector('.theme-toggle').click()"); await wait(50);
        await expectTheme(locale, system);
        // Verify all destinations without opening third-party accounts or sending email.
        const contacts = await evaluate("[...document.querySelectorAll('.contact-link')].map(a => ({href:a.getAttribute('href'),target:a.target,rel:a.rel,text:a.textContent}))");
        assert.deepEqual(contacts.map(link => link.href), ['mailto:putriwella97@gmail.com','https://www.linkedin.com/in/putriwella97/','https://www.instagram.com/wellasibarani/']);
        assert(contacts.every(link => link.text.trim()));
        assert(contacts.filter(link => link.target === '_blank').every(link => link.rel.includes('noopener') && link.rel.includes('noreferrer')));
        assert.equal(await evaluate("document.querySelectorAll('.contact-status form').length"), 0);
        assert.equal(await evaluate("document.querySelectorAll('.contact-status svg:not([aria-hidden=true])').length"), 0);
        if (width === 360) {
          const buttonLabel = locale === 'id' ? 'Buka menu' : 'Open menu';
          assert.equal(await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-label')"), buttonLabel);
          assert(await evaluate("(() => { const r=document.querySelector('.menu-toggle').getBoundingClientRect();return r.width>=44 && r.height>=44; })()"));
          assert(await evaluate("!!document.querySelector('.menu-toggle .lucide-menu')"));
          // Actual mouse clicks verify that blur from a focused link does not reopen the menu.
          const position = await evaluate("(() => {const r=document.querySelector('.menu-toggle').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()");
          const clickMenu = async () => { await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...position});await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...position});await wait(70); };
          await clickMenu();
          assert.equal(await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')"), 'true');
          assert.equal(await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-label')"), locale === 'id' ? 'Tutup menu' : 'Close menu');
          assert(await evaluate("!!document.querySelector('.menu-toggle .lucide-x') && document.activeElement===document.querySelector('#main-navigation a')"));
          await clickMenu();
          assert.equal(await evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')"), 'false');
          assert.deepEqual(await geometry(), before, 'Closed menu restores the same header geometry');
          await clickMenu();
          await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
          assert(await evaluate("document.activeElement===document.querySelector('.menu-toggle') && document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false'"));
          await clickMenu();
          await evaluate("document.querySelector('#main-navigation a[href$=tulisan]').click()");
          for (let attempt=0;attempt<50;attempt++){if(await evaluate(`location.pathname==='/${locale}/tulisan'`))break;await wait(50);}
          assert.equal(await evaluate('location.pathname'), `/${locale}/tulisan`);
        } else assert.equal(await evaluate("getComputedStyle(document.querySelector('.menu-toggle')).display"), 'none');
        await evaluate("localStorage.removeItem('putri-theme')");
      }
      console.log(`PASS header/contact ${locale}, system ${system}: 360/768/1440, icon labels, persistence, geometry, menu/focus/navigation, contact destinations`);
    }
    // Following system must remain reactive until the user chooses an explicit theme.
    await navigate('/en'); await evaluate("localStorage.removeItem('putri-theme')"); await navigate('/en');
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'light'}]}); await wait(70); await expectTheme('en','light');
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'dark'}]}); await wait(70); await expectTheme('en','dark');
    await evaluate("document.querySelector('.theme-toggle').click()"); await wait(70); await expectTheme('en','light');
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'light'}]}); await wait(70);
    await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'dark'}]}); await wait(70); await expectTheme('en','light');
    assert.deepEqual(errors, [], 'No hydration or browser runtime errors');
    console.log('PASS live system theme, explicit override, no hydration/runtime errors');
  }
  if (process.env.CHECK_ONLY !== 'header-contact') {
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
  const priorTheme = await evaluate('document.documentElement.dataset.theme');
  await evaluate("document.querySelector('.theme-toggle').focus()");
  assert.equal(await evaluate('getComputedStyle(document.activeElement).outlineStyle'), 'solid');
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' });
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  assert.equal(await evaluate('document.documentElement.dataset.theme'), priorTheme === 'dark' ? 'light' : 'dark');
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
  }
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
