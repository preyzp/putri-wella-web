// Controlled production-page checks. No mutation or upload to Sanity.
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
const directory = await mkdtemp(join(tmpdir(), 'putri-profile-states-'));
const statePath = join(directory, 'state.json');
const origin = 'http://127.0.0.1:3194';
const state = { mode: 'empty', documents: [] };
const save = () => writeFile(statePath, JSON.stringify(state));
await save();
const preload = new URL('./helpers/sanity-fetch-preload.mjs', import.meta.url).href;
const server = spawn(process.execPath, ['--import', preload, 'node_modules/next/dist/bin/next', 'start', '--port', '3194'], { stdio: 'ignore', env: { ...process.env, SANITY_TEST_STATE_FILE: statePath } });
try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) { try { await fetch(origin + '/id/kontak'); ready = true; break; } catch { await new Promise(resolve => setTimeout(resolve, 100)); } }
  assert(ready);
  for (const locale of ['id', 'en']) for (const page of ['tentang', 'aktivitas']) {
    const html = await (await fetch(`${origin}/${locale}/${page}`)).text();
    assert(html.includes('data-content-state="empty"'));
    assert(!html.includes('class="portrait-placeholder"'));
    assert(!html.includes('src="/fixtures/'));
  }
  state.mode = 'populated';
  const profile = { _id: 'profile', _type: 'profile', fullName: 'Controlled profile', shortBio: { id: 'BIO_ID_FALLBACK', en: ' ' }, biography: { id: [{ _key: 'p', _type: 'block', style: 'normal', children: [{ _key: 's', _type: 'span', marks: [], text: 'RICH_ID_FALLBACK' }], markDefs: [] }], en: [] }, skills: [{ id: 'SKILL_ID_FALLBACK', en: '' }, { id: ' ', en: '' }], professionalSummary: { id: 'PROFESSIONAL_SCOPE', en: '' } };
  state.documents = [profile]; await save();
  const partial = await (await fetch(origin + '/en/tentang')).text();
  for (const text of ['BIO_ID_FALLBACK', 'RICH_ID_FALLBACK', 'SKILL_ID_FALLBACK']) assert(partial.includes(text));
  assert(!partial.includes('id="profile-education"'));
  assert(!partial.includes('id="profile-recognition"'));
  assert(!partial.includes('class="profile-portrait"'));
  const experience = { _id: 'local-work', _type: 'experience', scopeTitle: { id: 'WORK_SCOPE', en: '' }, scopeDescription: { id: 'WORK_DESCRIPTION', en: '' }, achievements: [{ id: 'ACHIEVEMENT_ID', en: '' }], employer: 'PRIVATE_WORK_FIELD', agencyName: 'PRIVATE_WORK_FIELD', periodLabel: 'Controlled period' };
  state.documents.push(experience,
    { _id: 'local-education', _type: 'education', qualification: { id: 'QUALIFICATION_ID' }, institution: 'Controlled education institution', fieldOfStudy: { id: 'STUDY_ID' }, startYear: 2020, endYear: 2024 },
    { _id: 'local-organization', _type: 'organization', name: 'Controlled organization', role: { id: 'ROLE_ID' }, description: { id: 'ORGANIZATION_DESCRIPTION' }, publicUrl: 'https://example.test/organization' },
    { _id: 'local-recognition', _type: 'recognition', kind: 'publication', title: { id: 'PUBLICATION_ID' }, issuer: 'Controlled publisher', summary: { id: 'SUMMARY_ID' }, date: '2026-10-01' },
    { ...experience, _id: 'drafts.local-work', scopeTitle: { id: 'DRAFT_PRIVATE_FIELD' } },
    { ...experience, _id: 'versions.local.work', scopeTitle: { id: 'VERSION_PRIVATE_FIELD' } },
    { ...profile, _id: 'drafts.profile', fullName: 'DRAFT_PRIVATE_FIELD' },
  );
  // Reuse an existing public asset only in local test responses; do not upload or claim new content.
  const cloud = JSON.parse(await readFile('node_modules/.cache/putri-sanity-check/profile-cloud.json', 'utf8'));
  const asset = cloud.profile?.portrait?.asset;
  assert(asset, 'A published image snapshot is required for real image/crop rendering tests');
  state.documents.push({ _id: asset._id, _type: 'sanity.imageAsset', url: asset.url, metadata: { dimensions: { width: asset.width, height: asset.height } } });
  const crop = { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 };
  const hotspot = { x: 0.6, y: 0.4, width: 0.1, height: 0.1 };
  profile.portrait = { _type: 'editorialImage', asset: { _ref: asset._id }, alt: 'CONTROLLED_PORTRAIT_ALT', caption: 'CONTROLLED_PORTRAIT_CAPTION', crop, hotspot };
  const activity = { _id: 'local-activity', _type: 'activity', title: { id: 'ACTIVITY_ID_FALLBACK', en: '' }, date: '2026-10-02', photos: [{ _key: 'one', _type: 'galleryImage', asset: { _ref: asset._id }, alt: { id: 'ACTIVITY_ALT_ID', en: '' }, caption: { id: 'ACTIVITY_CAPTION_ID', en: ' ' }, crop, hotspot }, { _key: 'missing', _type: 'galleryImage', asset: { _ref: 'missing-image' }, alt: { id: 'MISSING_ASSET' } }] };
  state.documents.push(activity, { ...activity, _id: 'drafts.local-activity', title: { id: 'DRAFT_PRIVATE_FIELD' } });
  await save();
  for (const locale of ['id', 'en']) {
    const html = await (await fetch(`${origin}/${locale}/tentang`)).text();
    for (const name of ['bio', 'work', 'achievements', 'education', 'skills', 'organizations', 'recognition']) assert(html.includes(`id="profile-${name}"`));
    for (const text of ['WORK_SCOPE', 'WORK_DESCRIPTION', 'ACHIEVEMENT_ID', 'QUALIFICATION_ID', 'STUDY_ID', 'ROLE_ID', 'PUBLICATION_ID', 'CONTROLLED_PORTRAIT_ALT']) assert(html.includes(text));
    for (const forbidden of ['PRIVATE_WORK_FIELD', 'DRAFT_PRIVATE_FIELD', 'VERSION_PRIVATE_FIELD']) assert(!html.includes(forbidden));
    assert(html.includes('rect%3D') || html.includes('rect='), 'Crop/hotspot must affect the actual image URL');
    const gallery = await (await fetch(`${origin}/${locale}/aktivitas`)).text();
    for (const text of ['ACTIVITY_ID_FALLBACK', 'ACTIVITY_ALT_ID', 'ACTIVITY_CAPTION_ID', '2026-10-02']) assert(gallery.includes(text));
    assert.equal((gallery.match(/<img /g) || []).length, 1, 'Unresolved assets and drafts are not rendered as gallery photos');
    assert(!gallery.includes('DRAFT_PRIVATE_FIELD'));
  }
  const home = await (await fetch(origin + '/id')).text();
  assert(!home.includes('CONTROLLED_PORTRAIT_ALT'));
  assert(!home.includes('profile-portrait'));
  assert(!home.includes(asset.url.split('/').pop()), 'Homepage must not fetch/render the profile portrait');
  profile.shortBio.id = 'PROFILE_EDIT_NEXT_REQUEST'; await save();
  assert((await (await fetch(origin + '/en/tentang')).text()).includes(profile.shortBio.id));
  if (process.env.RUN_PROFILE_BROWSER === '1') {
    const child = spawn(process.execPath, ['tests/public-pages.mjs'], { stdio: 'inherit', env: { ...process.env, CHECK_ONLY: 'profile', PROFILE_EXPECT_GALLERY: '1', NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --import=${preload}`.trim(), SANITY_TEST_STATE_FILE: statePath } });
    assert.equal(await new Promise(resolve => child.on('exit', resolve)), 0);
  }
  state.mode = 'error'; await save();
  for (const path of ['/id/tentang', '/en/aktivitas']) {
    const html = await (await fetch(origin + path)).text();
    assert(html.includes('data-content-state="error"'));
    assert(!html.includes('data-content-state="empty"'));
    assert(!html.includes('Controlled test outage'));
  }
  const requests = (await readFile(statePath + '.requests', 'utf8')).trim().split('\n').map(line => JSON.parse(line));
  assert(requests.every(request => request.cache === 'no-store' && !request.cdn && request.perspective === 'published'));
  console.log('PASS CONTROLLED: profile mapping, bilingual fallback, empty/optional sections, error, portrait crop/hotspot, activity captions/date, draft exclusion, work-field projection privacy, no portrait on home, next-request edits');
} finally { server.kill(); }
