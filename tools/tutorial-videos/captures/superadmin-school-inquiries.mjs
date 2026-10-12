// Captures the Super Admin > Schools > School inquiries tutorial, covering both settings:
//   School inquiry ON : "Start trial" on the website creates an inquiry; the Super Admin approves (the school is
//                       created) or rejects it.
//   School inquiry OFF: "Start trial" creates the school straight away, with no inquiry.
// Everything runs on the recording server. It starts by removing earlier copies of the tutorial schools and
// inquiries, and it switches the setting back ON at the end (its default).
// Run: node tools/tutorial-videos/captures/superadmin-school-inquiries.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { session, panelUrl } from '../lib/session.mjs';
import { tidyScript } from '../lib/tidy.mjs';
import { kit, J } from '../lib/capture-kit.mjs';
import { launch } from '../lib/cdp.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'cache/superadmin-school-inquiries');

const APPROVE = { name: 'Maplewood Academy', email: 'maplewood@example.com', countrySearch: '44', country: '44', phone: '7700900321', address: '8 Maple Road, Springfield', tagline: 'Growing curious minds.' };
const REJECT = { name: 'Brookside Learning Centre', email: 'brookside@example.com', countrySearch: '44', country: '44', phone: '7700900654', address: '3 Brook Lane, Springfield', tagline: 'Learning without limits.' };
const DIRECT = { name: 'Riverside Public School', email: 'riverside@example.com', countrySearch: '44', country: '44', phone: '7700900987', address: '21 River Street, Springfield', tagline: 'Every student, every day.' };
// Earlier runs and exploration probes, removed at the start.
const CLEANUP = [APPROVE.name, REJECT.name, DIRECT.name, 'Probe Academy', 'Probe Reject School', 'Probe Direct School'];

const b = await session(9790, 1600, 900, 2);
console.log('login ->', await b.login());
const BRAND = (await b.ev(`(document.title.split('||')[1]||'').trim()`, '')) || 'BEYOND CHALK';
const baseTidy = tidyScript(ROOT);

// ---------- recording-browser cleanup (nothing on the server changes) ----------
const svg = (f) => 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(ROOT, 'vendor/brand', f)).toString('base64');
const HERO = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'vendor/sample/landing-hero.png')).toString('base64');
// Admin pages: hide this server's test "School additional fields" (a fresh install has none).
const adminTidy = `(()=>{ document.querySelectorAll('[name^="extra_fields"], [name^="edit_extra_fields"]').forEach(i => { const g = i.closest('.form-group'); if (g) g.style.display = 'none'; }); return 1; })()`;
// Public website: show the product's stock landing content (logo, hero text and image, colours) instead of
// this server's custom branding, and hide the test fields in the registration form.
const siteTidy = `(()=>{
  window.__tutName = ${J(BRAND)};
  if (!document.getElementById('tut-site')) {
    const st = document.createElement('style'); st.id = 'tut-site';
    st.textContent = ':root{--primary-color:#56cc99!important;--secondary-color:#215679!important;--secondary-color1:#38a3a5!important;--text--secondary-color:#5c788c!important}';
    document.head.appendChild(st);
  }
  document.querySelectorAll('img').forEach(i => { if (/system-settings/.test(i.src) && !i.closest('.heroImg')) { i.src = ${J(svg('logo-horizontal.svg'))}; i.style.height = '50px'; i.style.width = 'auto'; } });
  const set = (sel, t) => document.querySelectorAll(sel).forEach(e => { e.textContent = t; });
  set('.heroSection .commonTitle', 'Transform School Management With eSchool SaaS');
  set('.heroSection .commonDesc', 'Transform School Management With eSchool SaaS');
  set('.heroSection .commonText', 'Experience the future of education with our eSchool SaaS platform. Streamline attendance, assignments, exams, and more. Elevate your school\\u2019s efficiency and engagement.');
  set('.heroSection .textWrapper span', 'Opt for eSchool Saas 14+ robust features for an enhanced educational experience.');
  const hero = document.querySelector('.heroSection .heroImg > img'); if (hero && hero.src !== ${J(HERO)}) hero.src = ${J(HERO)};
  document.querySelectorAll('[name^="extra_fields"]').forEach(i => { const g = i.closest('.form-group'); if (g) g.style.display = 'none'; });
  return 1;
})()`;
const K = kit(b, { out: OUT, tidy: [adminTidy, baseTidy] });
const { sleep, ev, jsClick, waitFor, waitTable, waitToast, waitSwal, waitModal, clearToasts, scrollToEl, setTargets, snap } = K;

// The public website is captured in a second, signed-out browser: signed in, the home page redirects to the panel.
const w = await launch(9791, 1600, 900, 2);
w.ev = async (e, d) => { try { const v = await w.evaluate(e); return v === undefined ? d : v; } catch (x) { return d; } };
const KW = kit(w, { out: OUT, tidy: [siteTidy, baseTidy] });

// ---------- navigation ----------
async function admin(pathname, ready = `document.querySelector('.content-wrapper')`) {
  await b.viewport(1600, 900, 2);
  b.send('Page.navigate', { url: panelUrl() + pathname });
  await waitFor(ready, 45000, 500); await sleep(1200);
  if (await ev(`location.pathname.includes('login')`, false)) { await b.login(); return admin(pathname, ready); }
  await K.runTidy();
}
async function site() {
  await w.viewport(1600, 900, 2);
  w.send('Page.navigate', { url: panelUrl() });
  if (!(await KW.waitFor(`document.getElementById('trialBtn')`, 45000, 500))) throw new Error('website: Start trial button not found');
  await w.ev(`scrollTo(0,0); 1`);
  await KW.waitFor(`[...document.images].filter(i=>i.closest('header, nav, .heroSection')).every(i=>i.complete)`, 15000, 300);
  await sleep(1200); await KW.runTidy(); await sleep(600);
}
const rowRe = (name) => `/${name}/`;
async function deleteInquiries() {
  await admin('schools/inquiry'); await waitTable();
  for (const name of CLEANUP) {
    for (let k = 0; k < 3 && await ev(`!!([...document.querySelectorAll('.bootstrap-table tbody tr')].find(r=>${rowRe(name)}.test(r.innerText)))`, false); k++) {
      await jsClick(`[...document.querySelectorAll('.bootstrap-table tbody tr')].find(r=>${rowRe(name)}.test(r.innerText)).querySelector('.delete-form')`);
      await waitSwal(); await jsClick(`document.querySelector('.swal2-confirm')`); await waitToast(); await clearToasts(); await waitTable();
    }
  }
}
async function deleteSchools() {
  await admin('schools'); await waitTable();
  for (const name of CLEANUP) {
    const row = `[...document.querySelectorAll('.bootstrap-table tbody tr')].find(r=>${rowRe(name)}.test(r.innerText))`;
    if (await ev(`!!(${row})`, false)) {
      await jsClick(`${row}.querySelector('.delete-form')`); await waitSwal(); await jsClick(`document.querySelector('.swal2-confirm')`); await waitToast(); await clearToasts(); await waitTable();
    }
  }
  await jsClick(`[...document.querySelectorAll('a.table-list-type')].find(a=>a.textContent.trim()==='Trashed')`); await waitTable();
  for (const name of CLEANUP) {
    const row = `[...document.querySelectorAll('.bootstrap-table tbody tr')].find(r=>${rowRe(name)}.test(r.innerText))`;
    for (let k = 0; k < 2 && await ev(`!!(${row})`, false); k++) {
      await jsClick(`${row}.querySelector('.trash-data')`); await waitSwal(); await jsClick(`document.querySelector('.swal2-confirm')`); await waitToast(); await clearToasts(); await sleep(1500); await waitTable();
    }
  }
}
const SEC_FORM = `[...document.querySelectorAll('.content-wrapper form')].find(f=>/security-settings/.test(f.action))`;
async function openSecurityTab() {
  await admin('system-settings');
  await jsClick(`[...document.querySelectorAll('.content-wrapper .nav-link')].find(t=>/Security/.test(t.innerText))`); await sleep(700);
}
async function setInquiry(on, { save = true } = {}) {
  const now = await ev(`document.getElementById('school_inquiry').checked`, null);
  if (now !== on) { await jsClick(`document.querySelector('.policy-card[data-key=school_inquiry]')`); await sleep(400); }
  if (save) { await jsClick(`${SEC_FORM}.querySelector('[type=submit]')`); await waitToast(); }
}
async function fillTrialForm(d, snaps = {}) {
  const { setField, pickCountry, blur, snap } = KW;
  const M = '.modal.show';
  await setField(`${M} [name=school_name]`, d.name); if (snaps.name) await snap(snaps.name, { viewport: true });
  await setField(`${M} [name=school_email]`, d.email); if (snaps.email) await snap(snaps.email, { viewport: true });
  await blur();
  await pickCountry(M, d.countrySearch, d.country, snaps.ccOpen ? { open: snaps.ccOpen, search: snaps.ccSearch, opts: { viewport: true } } : {});
  if (snaps.cc) await snap(snaps.cc, { viewport: true });
  await setField(`${M} [name=school_phone]`, d.phone); if (snaps.phone) await snap(snaps.phone, { viewport: true });
  await setField(`${M} [name=school_address]`, d.address); if (snaps.address) await snap(snaps.address, { viewport: true });
  await setField(`${M} [name=school_tagline]`, d.tagline); if (snaps.tagline) await snap(snaps.tagline, { viewport: true });
  await blur();
}
async function submitTrial(snaps = {}) {
  const { jsClick, waitSwal, waitToast, waitFor, snap, ev } = KW;
  await jsClick(`document.querySelector('.modal.show form [type=submit]')`);
  await waitSwal(); if (snaps.wait) await snap(snaps.wait, { viewport: true });
  await waitToast(); await waitFor(`!document.querySelector('.modal.show')`, 5000); await sleep(500);
  if (snaps.toast) await snap(snaps.toast, { viewport: true });
  console.log('website message:', (await ev(`(document.querySelector('.jq-toast-single')||{}).innerText||''`, '')).replace(/\s+/g, ' ').slice(0, 140));
}

// ---------- element targets ----------
const SIDEBAR = {
  navSettings: `[...document.querySelectorAll('.sidebar .nav-link')].find(a=>a.innerText.trim()==='Settings')`,
  navGeneral: `[...document.querySelectorAll('.sidebar a')].find(a=>a.innerText.trim()==='General settings')`,
  navInquiries: `[...document.querySelectorAll('.sidebar a')].find(a=>a.innerText.trim()==='School inquiries')`,
  navManage: `[...document.querySelectorAll('.sidebar a')].find(a=>a.innerText.trim()==='Manage schools')`,
};
const SETTINGS = {
  ...SIDEBAR,
  tabSecurity: `[...document.querySelectorAll('.content-wrapper .nav-link')].find(t=>/Security/.test(t.innerText))`,
  cardInquiry: `document.querySelector('.policy-card[data-key=school_inquiry]')`,
  cardsRow: `document.querySelector('.policy-card[data-key=school_inquiry]').closest('.row')`,
  switchInquiry: `document.getElementById('school_inquiry')`,
  secSubmit: `${SEC_FORM}.querySelector('[type=submit]')`,
  toast: `q('.jq-toast-single')`,
};
const SITE = {
  trialBtn: `document.getElementById('trialBtn')`,
  registerBtn: `[...document.querySelectorAll('.heroSection button')].find(b=>/Register/.test(b.innerText))`,
  header: `document.querySelector('header, .navbar')`,
  modal: `q('.modal.show .modal-content')`,
  ccTrigger: `q('.modal.show .custom-select-trigger')`,
  ccDropdown: `q('.modal.show .custom-select-dropdown')`,
  ccOption: `[...document.querySelectorAll('.modal.show .custom-select-option')].find(o=>o.dataset.value==='44'&&o.offsetParent)`,
  name: `q('.modal.show [name=school_name]')`, email: `q('.modal.show [name=school_email]')`, phone: `q('.modal.show [name=school_phone]')`,
  address: `q('.modal.show [name=school_address]')`, tagline: `q('.modal.show [name=school_tagline]')`,
  submit: `q('.modal.show form [type=submit]')`, close: `q('.modal.show .btn-close, .modal.show [data-bs-dismiss=modal]')`,
  swal: `q('.swal2-popup')`, toast: `q('.jq-toast-single')`,
};
const SITE_BOXES = {
  nameBox: `q('.modal.show [name=school_name]')`, emailBox: `q('.modal.show [name=school_email]')`, phoneBox: `q('.modal.show [name=school_phone]')`,
  addressBox: `q('.modal.show [name=school_address]')`, taglineBox: `q('.modal.show [name=school_tagline]')`, ccSearch: `q('.modal.show .custom-select-search-input')`,
};
const inqRow = (d) => `row(/${d.name}/)`;
const INQ = {
  ...SIDEBAR,
  listCard: `[...document.querySelectorAll('.content-wrapper .card')].find(c=>c.querySelector('.bootstrap-table'))`,
  filterStatus: `(document.querySelector('.content-wrapper select[name=status]')||{}).closest ? (document.querySelector('.content-wrapper select[name=status]').closest('.custom-select-wrapper')||document.querySelector('.content-wrapper select[name=status]')).closest('.form-group, .col-md-3, .col-sm-12, div') : null`,
  filterTrigger: `(document.querySelector('.content-wrapper select[name=status]').closest('.custom-select-wrapper')||{}).querySelector ? document.querySelector('.content-wrapper select[name=status]').closest('.custom-select-wrapper').querySelector('.custom-select-trigger') : document.querySelector('.content-wrapper select[name=status]')`,
  filterDropdown: `q('.content-wrapper .custom-select-dropdown')`,
  aRow: inqRow(APPROVE), aStatus: `${inqRow(APPROVE)}.children[6]`, aView: `${inqRow(APPROVE)}.querySelector('.edit-data')`, aDelete: `${inqRow(APPROVE)}.querySelector('.delete-form')`, aCheck: `${inqRow(APPROVE)}.querySelector('input[type=checkbox]')`,
  rRow: inqRow(REJECT), rStatus: `${inqRow(REJECT)}.children[6]`, rView: `${inqRow(REJECT)}.querySelector('.edit-data')`, rDelete: `${inqRow(REJECT)}.querySelector('.delete-form')`,
  modal: `q('.modal.show .modal-content')`, modalDetails: `q('.modal.show [name=school_name]') && q('.modal.show [name=school_name]').closest('form')`,
  prefix: `q('.modal.show [name=school_code_prefix]')`, prefixGroup: `q('.modal.show [name=school_code_prefix]') && q('.modal.show [name=school_code_prefix]').closest('.form-group')`,
  statusGroup: `q('.modal.show [name=status]') && q('.modal.show [name=status]').closest('.form-group')`,
  approved: `q('.modal.show [name=status][value="1"]')`, rejected: `q('.modal.show [name=status][value="2"]')`,
  approvedLabel: `(q('.modal.show [name=status][value="1"]')||{}).closest ? q('.modal.show [name=status][value="1"]').closest('label, .form-check') : null`,
  rejectedLabel: `(q('.modal.show [name=status][value="2"]')||{}).closest ? q('.modal.show [name=status][value="2"]').closest('label, .form-check') : null`,
  modalSubmit: `q('.modal.show [type=submit]')`,
  toast: `q('.jq-toast-single')`, swal: `q('.swal2-popup')`,
};
const schoolRow = (d) => `row(/${d.name}/)`;
const SCHOOLS = {
  ...SIDEBAR,
  listCard: `[...document.querySelectorAll('.content-wrapper .card')].find(c=>/List Schools/.test(c.innerText))`,
  mRow: schoolRow(APPROVE), mStatus: `${schoolRow(APPROVE)} && [...${schoolRow(APPROVE)}.children].slice(-2)[0]`,
  dRow: schoolRow(DIRECT), dStatus: `${schoolRow(DIRECT)} && [...${schoolRow(DIRECT)}.children].slice(-2)[0]`,
};

// ================= recording =================
// 0. Clean start: setting ON, earlier tutorial data removed.
await openSecurityTab(); await setInquiry(true); await clearToasts();
await deleteInquiries(); await deleteSchools();
console.log('cleanup done');

// Off camera: a second inquiry that will be rejected in the video.
await site(); await KW.jsClick(`document.getElementById('trialBtn')`); await KW.waitModal();
await fillTrialForm(REJECT); await submitTrial();

// 1. The setting (ON). Start on the page's first tab (it remembers the last one).
await admin('system-settings');
await ev(`sessionStorage.removeItem('systemSettingsActiveTab'); 1`); await admin('system-settings');
setTargets(SETTINGS);
await snap('s-basic');
await jsClick(SETTINGS.tabSecurity); await sleep(700);
await scrollToEl(SETTINGS.cardsRow, 300);
await snap('s-on');

// 2. Website, inquiry ON.
await site(); KW.setTargets(SITE, SITE_BOXES);
await KW.snap('w-home', { viewport: true });
await KW.jsClick(SITE.trialBtn); await KW.waitModal(); await KW.snap('w-form', { viewport: true });
await fillTrialForm(APPROVE, { name: 'w-name', email: 'w-email', ccOpen: 'w-cc-open', ccSearch: 'w-cc-search', cc: 'w-cc', phone: 'w-phone', address: 'w-address', tagline: 'w-tagline' });
await submitTrial({ wait: 'w-wait', toast: 'w-toast-on' });

// 3. School inquiries: review, approve, reject.
await admin('schools/inquiry'); await waitTable(`/${APPROVE.name}/`); setTargets(INQ);
for (const d of [APPROVE, REJECT]) if (!(await ev(`[...document.querySelectorAll('.bootstrap-table tbody tr')].some(tr=>/${d.name}/.test(tr.innerText))`, false))) throw new Error('inquiry not found: ' + d.name);
await snap('i-list');
if (await ev(`!!(${INQ.filterTrigger}) && !!document.querySelector('.content-wrapper select[name=status]').closest('.custom-select-wrapper')`, false)) {
  await jsClick(INQ.filterTrigger); await sleep(500); await snap('i-filter'); await jsClick(INQ.filterTrigger); await sleep(300); await blur();
}
await jsClick(INQ.aView); await waitModal(); await snap('i-view', { viewport: true });
await jsClick(INQ.approved); await sleep(300); await snap('i-approved', { viewport: true });
await jsClick(INQ.modalSubmit); await waitToast(); await sleep(400); await snap('i-approve-toast', { viewport: true });
await clearToasts(); await waitTable(); await snap('i-after-approve');
await jsClick(INQ.rView); await waitModal(); await snap('i-view2', { viewport: true });
await jsClick(INQ.rejected); await sleep(300); await snap('i-rejected', { viewport: true });
await jsClick(INQ.modalSubmit); await waitToast(); await sleep(400); await snap('i-reject-toast', { viewport: true });
await clearToasts(); await waitTable(); await sleep(1500); await waitTable(`/Rejected/`); await snap('i-after-reject');

// 4. The approved inquiry is now a school.
await admin('schools'); await waitTable(`/${APPROVE.name}/`); setTargets(SCHOOLS);
await scrollToEl(SCHOOLS.listCard, 80); await snap('m-approved');

// 5. Turn the setting OFF.
await openSecurityTab(); setTargets(SETTINGS); await scrollToEl(SETTINGS.cardsRow, 300);
await snap('s-on2');
await setInquiry(false, { save: false }); await snap('s-off');
await jsClick(SETTINGS.secSubmit); await waitToast(); await snap('s-off-toast', { viewport: true });
await clearToasts();

// 6. Website, inquiry OFF.
await site(); KW.setTargets(SITE, SITE_BOXES);
await KW.snap('w2-home', { viewport: true });
await KW.jsClick(SITE.trialBtn); await KW.waitModal(); await KW.snap('w2-form', { viewport: true });
await fillTrialForm(DIRECT, { name: 'w2-name', tagline: 'w2-filled' });
await submitTrial({ wait: 'w2-wait', toast: 'w2-toast' });

// 7. The school was created directly; no new inquiry.
await admin('schools'); await waitTable(`/${DIRECT.name}/`); setTargets(SCHOOLS);
await scrollToEl(SCHOOLS.listCard, 80); await snap('m-direct');
await admin('schools/inquiry'); await sleep(2500);
setTargets({ ...INQ, notice: `[...document.querySelectorAll('.content-wrapper .alert, .content-wrapper .text-danger')].find(e=>e.offsetParent)`, noticeLink: `[...document.querySelectorAll('.content-wrapper .alert a, .content-wrapper a')].find(a=>/setting/i.test(a.innerText))` });
console.log('inquiries page (OFF):', (await ev(`document.querySelector('.content-wrapper').innerText.replace(/\\s+/g,' ').slice(0,200)`, '')));
await snap('i-none');

// Leave the setting at its default (ON). Not part of the video.
await openSecurityTab(); await setInquiry(true); await clearToasts();
console.log('setting restored: ON');
w.close(); b.close();
process.exit(0);
