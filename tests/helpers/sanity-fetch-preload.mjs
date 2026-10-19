// Installed ONLY by the controlled test's Node --import argument. Never imported by the app.
import { readFileSync, appendFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sanityRequire = createRequire(require.resolve('sanity/package.json'));
const { parse, evaluate } = sanityRequire('groq-js');
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' ? input : input.url || String(input));
  if (!/\.(api|apicdn)\.sanity\.io$/.test(url.hostname)) return realFetch(input, init);
  if (!url.pathname.includes('/data/query/')) throw new Error('Only read-only query requests are allowed in this test');
  const state = JSON.parse(readFileSync(process.env.SANITY_TEST_STATE_FILE, 'utf8'));
  appendFileSync(process.env.SANITY_TEST_STATE_FILE + '.requests', JSON.stringify({ cache: init?.cache, cdn: url.hostname.includes('.apicdn.'), perspective: url.searchParams.get('perspective'), authenticated: new Headers(init?.headers).has('authorization') }) + '\n');
  if (state.mode === 'error') return Response.json({ error: { description: 'Controlled test outage' } }, { status: 500 });
  let query = url.searchParams.get('query');
  const params = {};
  for (const [key, value] of url.searchParams) if (key.startsWith('$')) params[key.slice(1)] = JSON.parse(value);
  if (init?.body) { const body = JSON.parse(init.body); query = body.query; Object.assign(params, body.params); }
  let dataset = state.mode === 'empty' ? [] : state.documents;
  if (state.simulatePerspectives) {
    const perspective = url.searchParams.get('perspective');
    if (perspective === 'published') dataset = dataset.filter(doc => !/^(drafts|versions)\./.test(doc._id));
    if (perspective === 'drafts') {
      const merged = new Map(dataset.filter(doc => !/^(drafts|versions)\./.test(doc._id)).map(doc => [doc._id, doc]));
      for (const doc of dataset.filter(doc => doc._id.startsWith('drafts.'))) merged.set(doc._id.slice(7), { ...doc, _id: doc._id.slice(7) });
      dataset = [...merged.values()];
    }
  }
  const result = await (await evaluate(parse(query), { dataset, params })).get();
  return Response.json({ result });
};
