// Dependency-free browser checks against a production build.
// Windows defaults to Edge; set BROWSER_BIN for another Chromium executable.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
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

  if (process.env.CHECK_ONLY === 'settings') {
    for (const locale of ['id', 'en']) for (const theme of ['light', 'dark']) {
      await navigate(`/${locale}`);
      await evaluate(`localStorage.setItem('putri-theme', '${theme}')`);
      for (const width of [360, 768, 1440]) {
        await call('Emulation.setDeviceMetricsOverride', { width, height: 1100, deviceScaleFactor: 1, mobile: false });
        for (const page of ['', '/kontak']) {
          await navigate(`/${locale}${page}`);
          assert.equal(await evaluate("document.querySelector('.wordmark').textContent"), 'CONTROLLED_SITE_NAME.');
          assert.equal(await evaluate("document.querySelector('.footer-name').textContent"), 'CONTROLLED_SITE_NAME');
          assert.equal(await evaluate("document.querySelector('meta[name=description]').content"), locale === 'en' ? 'SEO_EN' : 'SEO_ID_FALLBACK');
          assert.equal(await evaluate("document.querySelector('link[rel=canonical]').href"), `https://putriwellasibarani.vercel.app/${locale}${page}`);
          assert.equal(await evaluate('document.documentElement.dataset.theme'), theme);
          assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
          assert(!await evaluate("document.querySelector('#main-navigation').textContent.includes('IGNORE_NAV_CMS')"));
          if (!page) {
            assert.equal(await evaluate("document.querySelector('.intro-bottom p').textContent"), locale === 'en' ? 'INTRO_EN' : 'INTRO_ID_FALLBACK');
            assert(await evaluate("!!document.querySelector('.home-latest-cover')"));
          } else {
            assert.deepEqual(await evaluate("Array.from(document.querySelectorAll('.contact-link'), a => a.getAttribute('href'))"), ['mailto:approved@example.test', 'https://www.linkedin.com/in/approved/', 'https://www.instagram.com/approved/']);
            assert.equal(await evaluate("document.querySelectorAll('form').length"), 0);
          }
        }
      }
      console.log(`PASS CONTROLLED settings browser ${locale}, ${theme}: 360/768/1440, header/footer, intro, contacts, metadata/canonical, dictionary navigation, no overflow`);
    }
  }

  if (process.env.CHECK_ONLY === 'home-covers') {
    for (const theme of ['light', 'dark']) {
      await navigate('/id');
      await evaluate(`localStorage.setItem('putri-theme', '${theme}')`);
      for (const width of [360, 768, 1440]) {
        await call('Emulation.setDeviceMetricsOverride', { width, height: 1200, deviceScaleFactor: 1, mobile: false });
        await navigate('/id');
        for (let attempt = 0; attempt < 100; attempt++) {
          if (await evaluate("!!document.querySelector('.home-latest-cover')")) break;
          await wait(80);
        }
        const imageCount = await evaluate("document.querySelectorAll('.home-latest-cover img').length");
        for (let index = 0; index < imageCount; index++) {
          await evaluate(`document.querySelectorAll('.home-latest-cover img')[${index}].scrollIntoView()`);
          await wait(100);
        }
        for (let attempt = 0; attempt < 100; attempt++) {
          if (await evaluate("[...document.querySelectorAll('.home-latest-cover img')].every(image => image.complete && image.naturalWidth > 0)")) break;
          await wait(80);
        }
        const cards = await evaluate(`Array.from(document.querySelectorAll('.home-latest-item'), card => {
          const cover=card.querySelector('.home-latest-cover'), image=cover.querySelector('img'), link=card.querySelector('a'), title=card.querySelector('h3'), rect=cover.getBoundingClientRect(), category=card.querySelector('.eyebrow'), excerpt=card.querySelector('.excerpt'), meta=card.querySelector('.meta');
          const ordered=[category,cover,title,excerpt,meta].filter(Boolean);
          return {order:ordered.every((node,index)=>index===0 || !!(ordered[index-1].compareDocumentPosition(node)&Node.DOCUMENT_POSITION_FOLLOWING)), categoryGap:rect.top-category.getBoundingClientRect().bottom, titleGap:title.getBoundingClientRect().top-rect.bottom, textGap:excerpt ? excerpt.getBoundingClientRect().top-title.getBoundingClientRect().bottom : null, metaGap:meta.getBoundingClientRect().top-(excerpt||title).getBoundingClientRect().bottom, contained:!image || (image.getBoundingClientRect().left>=rect.left && image.getBoundingClientRect().right<=rect.right && image.getBoundingClientRect().bottom<=rect.bottom), position:getComputedStyle(cover).position, ratio:rect.width/rect.height, radius:getComputedStyle(cover).borderRadius, width:rect.width, itemWidth:card.getBoundingClientRect().width, href:link.getAttribute('href'), namedBy:document.getElementById(link.getAttribute('aria-labelledby'))===title, image:image && {loaded:image.naturalWidth>0, alt:image.alt, fit:getComputedStyle(image).objectFit, sizes:image.sizes, src:decodeURIComponent(image.src)}, background:getComputedStyle(cover).backgroundColor};
        })`);
        assert(cards.length > 0);
        assert(cards.some(card => card.image?.loaded), 'Real Sanity asset loads through next/image');
        for (const card of cards) {
          assert(Math.abs(card.ratio - 1.6) < 0.01, JSON.stringify({ width, theme, card }));
          assert.equal(card.radius, '8px'); assert(card.order); assert(card.contained);
          assert.equal(card.position, 'relative'); assert.equal(card.categoryGap, 12); assert.equal(card.titleGap, 16);
          if (card.textGap !== null) assert(card.textGap >= 8 && card.textGap <= 12);
          assert(card.metaGap >= 8 && card.metaGap <= 12);
          if (width === 1440) assert(card.width < 350, 'Even a single article retains one desktop column');
          if (width === 360) assert.equal(card.width, await evaluate("document.querySelector('.home-latest-item').parentElement.getBoundingClientRect().width"), 'Mobile is one full-width content column, allowing the browser scrollbar');
          assert.equal(card.width, card.itemWidth);
          assert(card.namedBy && card.href.startsWith('/id/tulisan/'));
          if (card.image) { assert(card.image.loaded); assert.equal(card.image.alt, ''); assert.equal(card.image.fit, 'cover'); assert(card.image.sizes.includes('342px')); }
        }
        if (process.env.HOME_COVERS_CONTROLLED === '1') {
          assert.equal(cards.length, Number(process.env.HOME_COVERS_COUNT || 3));
          if (cards.length === 3) { assert(cards.some(card => !card.image)); assert(cards.some(card => card.textGap === null), 'Missing excerpt is omitted'); }
          assert(cards.some(card => card.image?.src.includes('rect=')), 'Crop/hotspot projection reaches image URL');
          assert(await evaluate("document.querySelector('.home-latest-item h3').textContent.length > 180"));
        }
        assert.equal(await evaluate('document.documentElement.dataset.theme'), theme);
        assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `No overflow at ${width}`);
        assert.equal(await evaluate("document.querySelectorAll('.featured img').length"), 0);
        await evaluate("document.querySelector('.home-latest-link').focus()");
        assert.equal(await evaluate('getComputedStyle(document.activeElement).outlineStyle'), 'solid');
      }
      console.log(`PASS home covers ${theme}: 360/768/1440, category/thumbnail/title/excerpt/metadata order, 12/16/10px gaps, contained 16:10 images, single-column width, links/focus, no overflow${process.env.HOME_COVERS_CONTROLLED ? ', controlled covers/long title/crop' : ', real cloud'}`);
    }
  }

  if (process.env.CHECK_ONLY === 'profile') {
    for (const locale of ['id', 'en']) for (const theme of ['light', 'dark']) {
      await navigate(`/${locale}/tentang`);
      await evaluate(`localStorage.setItem('putri-theme', '${theme}')`);
      for (const width of [360, 768, 1440]) {
        await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
        for (const page of ['tentang', 'aktivitas']) {
          await navigate(`/${locale}/${page}`);
          for (let attempt = 0; attempt < 100; attempt++) {
            if (await evaluate("!!document.querySelector('[data-about-content], [data-activity-gallery], [data-content-state=empty], [data-content-state=error]')")) break;
            await wait(70);
          }
          assert(!await evaluate("!!document.querySelector('[data-content-state=error]')"));
          assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `${page} no overflow at ${width}`);
          assert.equal(await evaluate('document.documentElement.dataset.theme'), theme);
          if (page === 'tentang') assert(await evaluate("!!document.querySelector('[data-about-content]')"));
          if (page === 'aktivitas' && process.env.PROFILE_EXPECT_GALLERY === '1') assert(await evaluate("!!document.querySelector('[data-activity-gallery]')"));
          for (let attempt = 0; attempt < 100; attempt++) {
            if (await evaluate("[...document.querySelectorAll('main img')].every(image => image.complete && image.naturalWidth > 0)")) break;
            await wait(80);
          }
          assert(await evaluate("[...document.querySelectorAll('main img')].every(image => image.alt.trim() && image.naturalWidth > 0)"), 'Images load through configured optimizer with alt text');
          assert.equal(await evaluate("document.querySelectorAll('.portrait-placeholder').length"), 0);
          if (page === 'aktivitas') assert.equal(await evaluate("document.querySelectorAll('.profile-portrait').length"), 0);
          if (process.env.SCREENSHOT_PATH && locale === 'en' && theme === 'dark' && width === 360 && page === 'tentang') {
            const screenshot = await call('Page.captureScreenshot', { format: 'png' });
            await writeFile(process.env.SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'));
          }
        }
      }
      console.log(`PASS profile/activity browser ${locale}, ${theme}, 360/768/1440: responsive, image loads/alt, optional/empty state`);
    }
  }
  if (!['keyboard', 'header-contact', 'profile', 'home-covers', 'settings'].includes(process.env.CHECK_ONLY)) {
  // Run sanity-local.mjs and blog-cloud.mjs first to obtain a read-only cloud snapshot.
  const { post, categories } = JSON.parse(await readFile('node_modules/.cache/putri-sanity-check/cloud.json', 'utf8'));
  const path = `/id/tulisan/${encodeURIComponent(post.slug)}`;
    assert.equal((await fetch(origin + path)).status, 200);
    const redirect = await fetch(`${origin}/en/tulisan/${encodeURIComponent(post.slug)}`, { redirect: 'manual' });
    assert.equal(redirect.status, 308);
    assert.equal(new URL(redirect.headers.get('location'), origin).pathname, path);
  for (const locale of ['id', 'en']) {
    const response = await fetch(`${origin}/${locale}/tulisan/tidak-ada`);
    assert.equal(response.status, 404);
    assert.match(await response.text(), /404/);
  }
  console.log('PASS article routes, original-language redirects, HTTP 404');

  for (const locale of ['id', 'en']) {
    await navigate(`/${locale}/tulisan`);
    for (let attempt=0;attempt<60;attempt++){if(await count())break;await wait(100);}
    const total = await count(); assert(total > 0);
    if (post.categories[0]) {
      await choose(0, post.categories[0]._id);
      assert(await evaluate(`!!document.querySelector('.article-item h3 a[href=${JSON.stringify(path)}]')`));
      const category = categories.find(item => item._id === post.categories[0]._id);
      assert(await evaluate(`document.querySelector('.filters select').textContent.includes(${JSON.stringify(category.title[locale]?.trim() || category.title.id)})`));
    }
    await choose(1, post.format); assert(await count() > 0);
    await choose(1, post.format === 'poem' ? 'article' : 'poem');
    if (await count() === 0) assert(await evaluate("!!document.querySelector('[data-blog-state=filtered-empty]')"));
    await evaluate("document.querySelector('.filters button').click()"); await wait(70); assert.equal(await count(), total);
    assert(await evaluate("[...document.querySelectorAll('.article-item h3 a')].every(link => link.getAttribute('href').startsWith('/id/tulisan/'))"));
  }
  console.log('PASS filters, combined empty results, reset, canonical article links');

  await navigate(path);
  for (let attempt=0;attempt<80;attempt++){if(await evaluate("!!document.querySelector('.reading-column')"))break;await wait(100);}
  assert.equal(await evaluate("document.querySelector('link[rel=canonical]').getAttribute('href')"), new URL(path, process.env.SITE_URL || 'https://putriwellasibarani.vercel.app').href);
  assert.equal(await evaluate("document.querySelector('h1').textContent"), post.title);
  assert(await evaluate("!!document.querySelector('time[datetime]')"));
  assert.equal(await evaluate("document.querySelectorAll('.related-section a[href]').length"), post.relatedPosts.length);
  if (post.cover?.asset) {
    assert.equal(await evaluate("document.querySelector('.reading-column figure img').alt"), post.cover.alt);
    for (let attempt=0;attempt<80;attempt++){if(await evaluate("document.querySelector('.reading-column figure img').naturalWidth > 0"))break;await wait(100);}
    assert(await evaluate("document.querySelector('.reading-column figure img').naturalWidth > 0"), 'Cloud cover loaded through next/image');
    if (post.cover.caption) assert(await evaluate(`document.querySelector('.reading-column figure figcaption').textContent.includes(${JSON.stringify(post.cover.caption)})`));
  }
  // Exercise actual browser clipboard (permission granted by the browser protocol).
  await call('Browser.grantPermissions', { origin, permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'] });
  await evaluate("document.querySelector('.share-control button').click()"); await wait(150);
  assert.match(await evaluate("document.querySelector('.share-control [role=status]').textContent"), /berhasil/);
  assert.equal(await evaluate('navigator.clipboard.readText()'), origin + path);
  // Simulate a denied clipboard to exercise the visible failure and retry path.
  await evaluate("Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Denied'); } } }); document.querySelector('.share-control button').click()"); await wait(100);
  assert.match(await evaluate("document.querySelector('.share-control [role=status]').textContent"), /Gagal/);
  assert.equal(await evaluate("document.querySelector('.share-control button').disabled"), false);
  console.log('PASS CLOUD: published detail, canonical, date, cover/image optimizer, related state, clipboard');

  const pages = ['', 'tulisan'];
  for (const theme of ['light', 'dark']) {
    await evaluate(`localStorage.setItem('putri-theme', '${theme}')`);
    for (const width of [360, 768, 1440]) {
      await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
      for (const route of [...['id', 'en'].flatMap(locale => pages.map(page => `/${locale}${page ? `/${page}` : ''}`)), path]) {
        await navigate(route);
        assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `No overflow: ${route}, ${theme}, ${width}`);
        assert.equal(await evaluate('document.documentElement.dataset.theme'), theme);
      }
      console.log(`PASS public page widths ${width}, ${theme}, ID/EN`);
    }
  }
  }
  if (!['keyboard', 'blog', 'profile', 'home-covers', 'settings'].includes(process.env.CHECK_ONLY)) {
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
  if (!['header-contact', 'blog', 'profile', 'home-covers', 'settings'].includes(process.env.CHECK_ONLY)) {
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
  assert.equal(await evaluate("document.querySelector('.filters select').selectedIndex"), 1, 'Category filter can be changed with the keyboard');
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.public-page')).paddingTop"), '40px');
  console.log('PASS keyboard menu, navigation focus, filter focus, reduced-motion layout');
  }
  if (process.env.SCREENSHOT_PATH && process.env.CHECK_ONLY !== 'profile') {
    const screenshot = await call('Page.captureScreenshot', { format: 'png' });
    await writeFile(process.env.SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'));
  }
  await call('Browser.close');
} finally {
  socket?.close();
  browser.kill();
  server.kill();
}
