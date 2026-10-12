// Captures the Super Admin > Schools > Manage schools tutorial.
// It creates a real school on the recording server, then uses every row action on it.
// It runs in two phases, because a new school takes several minutes to set up in the background:
//   node captures/superadmin-manage-schools.mjs create    clean up, fill in the form, submit, setup progress
//   node captures/superadmin-manage-schools.mjs actions   (after setup finishes) search, columns, export,
//                                                        Manage admin, Edit, Inactive/Active, Delete, Trashed, Restore
//   node captures/superadmin-manage-schools.mjs school    open the Default domain URL from Edit school, sign in on the
//                                                        school's website as its admin, complete the Academy Setup Wizard
// The wizard needs the Super Admin's Academy master data (run setup/academy-master-data.mjs once per server).
// `create` first deletes any earlier copy of the tutorial school (including from Trashed), so re-runs give the same video.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { session } from '../lib/session.mjs';
import { tidyScript } from '../lib/tidy.mjs';
import { launch } from '../lib/cdp.mjs';
import { kit, J as JJ } from '../lib/capture-kit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'cache/superadmin-manage-schools');
fs.mkdirSync(OUT, { recursive: true });
const PHASE = process.argv[2] || 'create';
const tidy = tidyScript(ROOT);

export const SCHOOL = {
  name: 'Greenwood International School', email: 'greenwood@example.com', countrySearch: '44', country: '44',
  phone: '7700900456', tagline: 'Learning today, leading tomorrow.', address: '45 Oak Street, Springfield',
  prefix: 'GIS', domain: 'greenwood', logo: path.join(ROOT, 'vendor/sample/logo-greenwood.png'),
  adminFirst: 'Emma', adminLast: 'Collins', newTagline: 'Where every learner grows.',
};
const J = (v) => JSON.stringify(v);
const b = await session(9740, 1600, 900, 2);
console.log('login ->', await b.login());
const sleep = (ms) => b.sleep(ms);

// ---------- page-specific cleanup (recording browser only) ----------
// Hide this server's extra "School additional fields" (test data; a fresh install has none) and blur the
// e-mail addresses of schools other than the tutorial school.
const pageTidy = `(()=>{
  if (!document.getElementById('tut-menus')) { const st = document.createElement('style'); st.id = 'tut-menus'; st.textContent = 'body > .action-column-dropdown-menu:not(.show){display:none!important}'; document.head.appendChild(st); }
  document.querySelectorAll('[name^="extra_fields"], [name^="edit_extra_fields"]').forEach(i => { const g = i.closest('.form-group'); if (g) g.style.display = 'none'; });
  document.querySelectorAll('.bootstrap-table tbody tr').forEach(r => {
    if (/${SCHOOL.name}/.test(r.innerText)) return;
    r.querySelectorAll('td').forEach(td => { if (/@/.test(td.innerText)) td.querySelectorAll('a, span, small, div, p').forEach(e => { if (/@/.test(e.innerText) && !e.querySelector('*')) e.style.filter = 'blur(4px)'; }); });
    r.querySelectorAll('td').forEach(td => { if (/@/.test(td.innerText) && !td.querySelector('[style*=blur]')) { td.childNodes.forEach(n => { if (n.nodeType === 3 && /@/.test(n.nodeValue)) { const s = document.createElement('span'); s.style.filter = 'blur(4px)'; s.textContent = n.nodeValue; n.replaceWith(s); } }); } });
  });
  return 1;
})()`;

// ---------- helpers ----------
async function clickAt(x, y) {
  await b.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  await b.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await b.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
}
async function mouseClick(sel) {
  const r = JSON.parse(await b.ev(`(()=>{const e=[...document.querySelectorAll(${J(sel)})].find(e=>e.offsetParent);if(!e)return 'null';const r=e.getBoundingClientRect();return JSON.stringify([r.x+r.width/2,r.y+r.height/2])})()`, 'null'));
  if (!r) throw new Error('not found: ' + sel);
  await clickAt(r[0], r[1]);
}
const jsClick = (expr) => b.ev(`(()=>{const e=${expr};if(!e)return 0;e.click();return 1})()`, 0);
// Type into a field with real keystrokes (Input.insertText), like a user would. Some forms (Manage admin)
// don't save values that were only set from script.
const setField = async (sel, value) => {
  const ok = await b.ev(`(()=>{
    const el = [...document.querySelectorAll(${J(sel)})].find(e => !e.disabled && e.offsetParent); if (!el) return 'missing';
    el.focus();
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return 'ok';
  })()`, 'missing');
  if (ok !== 'ok') { console.log('setField: not found', sel); return ok; }
  await b.send('Input.insertText', { text: value });
  await b.ev(`(()=>{const el=document.activeElement;['keyup','change'].forEach(e=>el.dispatchEvent(new Event(e,{bubbles:true})));return 1})()`);
  return 'ok';
};
async function setFile(sel, file) {
  const doc = await b.send('DOM.getDocument', {});
  const q = await b.send('DOM.querySelector', { nodeId: doc.result.root.nodeId, selector: sel });
  await b.send('DOM.setFileInputFiles', { nodeId: q.result.nodeId, files: [file] });
  await b.ev(`document.querySelector(${J(sel)}).dispatchEvent(new Event('change', { bubbles: true })); 1`);
}
const blur = () => b.ev(`document.activeElement && document.activeElement.blur(); 1`);
const waitTable = async (re = null) => {
  for (let i = 0; i < 60; i++) {
    await sleep(500);
    const ok = await b.ev(`(()=>{const rows=[...document.querySelectorAll('.bootstrap-table tbody tr')];if(!rows.length||document.querySelector('.fixed-table-loading.open'))return false;${re ? `return rows.some(r=>${re}.test(r.innerText));` : 'return true;'}})()`, false);
    if (ok) break;
  }
  await sleep(800);
};
const waitToast = async () => { for (let i = 0; i < 100; i++) { await sleep(100); if (await b.ev(`!!document.querySelector('.jq-toast-single')`, false)) break; } await sleep(700); };
const waitSwal = async () => { for (let i = 0; i < 40; i++) { await sleep(100); if (await b.ev(`!!document.querySelector('.swal2-popup.swal2-show, .swal2-popup')`, false)) break; } await sleep(500); };
const waitModal = async () => { for (let i = 0; i < 40; i++) { await sleep(150); if (await b.ev(`!!document.querySelector('.modal.show')`, false)) break; } await sleep(700); };
// Close open dropdowns through Bootstrap, so the page's own hide handler puts row menus back in their table cell
// (the page moves an open row menu to <body>; menus closed any other way are left behind in the top-left corner).
const closeMenus = async () => {
  await b.ev(`(()=>{document.querySelectorAll('[data-bs-toggle=dropdown][aria-expanded=true], [data-toggle=dropdown][aria-expanded=true]').forEach(t=>{try{bootstrap.Dropdown.getOrCreateInstance(t).hide()}catch(e){}});return 1})()`);
  await sleep(450);
  // Taking a full-page capture while a menu is open makes the table redraw its rows, which cuts the open menu off
  // from its row; Bootstrap can then no longer close it. Nothing should be open now, so remove any leftovers.
  await b.ev(`(()=>{document.querySelectorAll('body > .action-column-dropdown-menu').forEach(m=>m.remove());return 1})()`);
};
const clearToasts = () => b.ev(`document.querySelectorAll('.jq-toast-wrap').forEach(t=>t.remove()); 1`);
const rowExpr = `[...document.querySelectorAll('.bootstrap-table tbody tr')].find(r=>/${SCHOOL.name}/.test(r.innerText))`;
const openRowMenu = async () => { await jsClick(`${rowExpr} && ${rowExpr}.querySelector('.btn-action-edit')`); await sleep(900); };
const listMode = async (mode) => { await jsClick(`[...document.querySelectorAll('.content-wrapper a.table-list-type')].find(a=>a.textContent.trim()===${J(mode)})`); };

// Element rectangles (page coordinates) and text boxes for typing.
const rectsJs = `(()=>{
  const r = el => { if (!el) return null; const b = el.getBoundingClientRect(); if (!b.width && !b.height) return null; return [Math.round(b.x), Math.round(b.y + scrollY), Math.round(b.width), Math.round(b.height)]; };
  const q = s => [...document.querySelectorAll(s)].find(e => e.offsetParent);
  const cv = document.createElement('canvas').getContext('2d');
  const box = el => {
    if (!el) return null;
    const s = getComputedStyle(el), b = el.getBoundingClientRect(), px = v => parseFloat(v) || 0;
    const x = b.x + px(s.borderLeftWidth) + px(s.paddingLeft), y = b.y + scrollY + px(s.borderTopWidth);
    const w = b.width - px(s.borderLeftWidth) - px(s.borderRightWidth) - px(s.paddingLeft) - px(s.paddingRight);
    const h = el.tagName === 'TEXTAREA' ? px(s.paddingTop) + px(s.lineHeight || s.fontSize) * 1.25 : b.height - px(s.borderTopWidth) - px(s.borderBottomWidth);
    cv.font = s.font;
    return { r: [Math.round(x), Math.round(y), Math.round(w), Math.round(h)], textW: Math.round(cv.measureText(el.value).width), bg: s.backgroundColor, n: el.value.length };
  };
  const byName = n => q('[name="' + n + '"]:not([type=hidden]):not([type=file]):not([disabled])');
  const out = { vp: Math.round(scrollY), H: document.documentElement.scrollHeight };
  ['school_name', 'school_support_email', 'school_support_phone', 'school_tagline', 'school_address', 'school_code_prefix', 'domain',
   'edit_admin_first_name', 'edit_admin_last_name', 'edit_admin_email', 'edit_school_tagline']
    .forEach(n => { const el = byName(n); if (el) { out[n] = r(el); out[n + '_box'] = box(el); } });
  const cards = [...document.querySelectorAll('.content-wrapper > .row .card, .content-wrapper .card')].filter(c => c.offsetParent && !c.closest('.modal'));
  out.formCard = r(cards.find(c => /Create Schools/.test(c.innerText)));
  out.listCard = r(cards.find(c => /List Schools/.test(c.innerText)));
  out.title = r(q('.content-wrapper .page-title'));
  out.help = r(q('.content-wrapper .help-icon'));
  out.banner = r([...document.querySelectorAll('.content-wrapper div')].find(d => /Active provisioning/.test(d.innerText) && d.offsetHeight < 140 && d.offsetHeight > 30));
  out.logoText = r(q('.content-wrapper form .file-upload-info'));
  out.logoBtn = r(q('.content-wrapper form .file-upload-browse'));
  const triggers = [...document.querySelectorAll('.content-wrapper form .custom-select-trigger')].filter(e => e.offsetParent && !e.closest('.modal'));
  out.ccTrigger = r(triggers[0]); out.boardTrigger = r(triggers[1]);
  out.ccDropdown = r(q('.custom-select-dropdown'));
  out.ccSearch = box(q('.custom-select-search-input'));
  out.ccOption = r([...document.querySelectorAll('.custom-select-option')].find(o => o.dataset.value === '${SCHOOL.country}' && o.offsetParent));
  out.code = r(q('[name=school_code]'));
  out.domainDefault = r(q('[name=domain_type][value=default]') && q('[name=domain_type][value=default]').closest('.form-check, label') || q('[name=domain_type][value=default]'));
  out.domainTypes = r(q('[name=domain_type]') && q('[name=domain_type]').closest('.form-group'));
  out.domainGroup = r(byName('domain') && byName('domain').closest('.form-group'));
  out.submit = r(q('.content-wrapper form input[type=submit][name=create-btn], .content-wrapper form input[type=submit]'));
  out.reset = r(q('.content-wrapper form input[type=reset]'));
  // list
  const row = [...document.querySelectorAll('.bootstrap-table tbody tr')].find(r => /${SCHOOL.name}/.test(r.innerText));
  out.row = r(row);
  if (row) { const tds = [...row.children]; out.rowStatus = r(tds[tds.length - 2]); out.rowAction = r(row.querySelector('.btn-action-edit')); out.rowAdmin = r(tds[5]); out.rowVerify = r(tds[3]); out.rowPlan = r(tds[6]); out.rowName = r(tds[1]); }
  const menu = q('.dropdown-menu.show');
  out.menu = r(menu);
  if (menu) for (const a of menu.querySelectorAll('a')) out['menu_' + a.innerText.trim().toLowerCase().replace(/[^a-z]+/g, '_')] = r(a);
  out.search = r(q('.fixed-table-toolbar .search input, .fixed-table-toolbar input[placeholder=Search]'));
  out.searchBox = box(q('.fixed-table-toolbar .search input, .fixed-table-toolbar input[placeholder=Search]'));
  out.refresh = r(q('.fixed-table-toolbar button[name=refresh], .fixed-table-toolbar button[title=Refresh]'));
  out.columns = r(q('.fixed-table-toolbar .keep-open button, .fixed-table-toolbar button[title=Columns]'));
  out.exportBtn = r(q('.fixed-table-toolbar .export button, .fixed-table-toolbar button[title="Export data"]'));
  out.toolbarMenu = r(q('.fixed-table-toolbar .dropdown-menu.show'));
  const filters = [...document.querySelectorAll('.content-wrapper .custom-select-trigger')].filter(e => e.offsetParent && e.closest('.card') && /List Schools/.test(e.closest('.card').innerText));
  out.filterPackage = r(filters[0] && filters[0].closest('.form-group, .col-md-3, div')); out.filterBoard = r(filters[1] && filters[1].closest('.form-group, .col-md-3, div'));
  out.linkAll = r([...document.querySelectorAll('a.table-list-type')].find(a => a.textContent.trim() === 'All'));
  out.linkTrashed = r([...document.querySelectorAll('a.table-list-type')].find(a => a.textContent.trim() === 'Trashed'));
  // overlays
  const modal = q('.modal.show .modal-content'); out.modal = r(modal);
  if (modal) {
    out.modalSubmit = r([...modal.querySelectorAll('input[type=submit], button[type=submit]')].find(e => e.offsetParent));
    out.modalClose = r([...modal.querySelectorAll('button')].find(e => /close|minimi/i.test(e.innerText) && e.offsetParent));
    out.modalSteps = r(modal.querySelector('ul, ol, .steps, .provision-steps'));
    for (const n of ['reset_password', 'resend_email', 'manually_verify_email', 'two_factor_verification']) {
      const c = modal.querySelector('[name=' + n + ']'); if (c) { const l = c.closest('.form-check, .form-group, label') || c; out['chk_' + n] = r(l); out['chkbox_' + n] = r(c); }
    }
    out.modalImage = r(modal.querySelector('.file-upload-browse'));
    out.modalEmailGroup = r(modal.querySelector('[name=edit_admin_email]') && modal.querySelector('[name=edit_admin_email]').closest('.form-group'));
    out.modalDomain = r(modal.querySelector('[name=edit_domain]') && modal.querySelector('[name=edit_domain]').closest('.form-group'));
    out.domainGroup = r(modal.querySelector('.defaultDomain'));
    out.schoolUrl = r(modal.querySelector('.defaultDomain .school_url'));
  }
  const swal = q('.swal2-popup'); out.swal = r(swal);
  out.swalConfirm = r(q('.swal2-confirm')); out.swalCancel = r(q('.swal2-cancel'));
  out.toast = r(q('.jq-toast-single'));
  return JSON.stringify(out);
})()`;

let fullH = 1900;
async function snap(name, { viewport = false } = {}) {
  await b.ev(tidy); await b.ev(pageTidy);
  await sleep(400);
  if (!viewport) {
    const scroll = await b.ev('scrollY', 0);
    const H = await b.ev('document.documentElement.scrollHeight', 1900);
    fullH = H;
    await b.viewport(1600, H, 2); await sleep(900);
    await b.ev(tidy); await b.ev(pageTidy); await sleep(200);
    const rects = JSON.parse(await b.ev(rectsJs, '{}'));
    const r = await b.send('Page.captureScreenshot', { format: 'png' }, 120000);
    fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(r.result.data, 'base64'));
    fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify({ ...rects, H, viewport: false }));
    await b.viewport(1600, 900, 2); await sleep(500);
    await b.ev(`scrollTo(0, ${scroll}); 1`);
  } else {
    const rects = JSON.parse(await b.ev(rectsJs, '{}'));
    const r = await b.send('Page.captureScreenshot', { format: 'png' }, 120000);
    fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(r.result.data, 'base64'));
    fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify({ ...rects, viewport: true }));
  }
  console.log('snap', name, viewport ? '(viewport @' + (await b.ev('scrollY', 0)) + ')' : '');
}
const scrollToEl = async (expr, offset = 90) => { await b.ev(`(()=>{const e=${expr};if(e)scrollTo(0, Math.max(0, e.getBoundingClientRect().top + scrollY - ${offset}));return 1})()`); await sleep(500); };
async function openSchools() { await b.viewport(1600, 900, 2); await b.go('schools'); await waitTable(); await b.ev(tidy); await b.ev(pageTidy); }

// Remove any earlier copy of the tutorial school (All list, then Trashed).
async function cleanup() {
  await openSchools();
  if (await b.ev(`!!(${rowExpr})`, false)) {
    await openRowMenu();
    await jsClick(`document.querySelector('.dropdown-menu.show .delete-form')`); await closeMenus(); await waitSwal();
    await jsClick(`document.querySelector('.swal2-confirm')`); await waitToast(); await sleep(1500);
  }
  await listMode('Trashed'); await waitTable();
  for (let k = 0; k < 3 && await b.ev(`!!(${rowExpr})`, false); k++) {
    await jsClick(`${rowExpr}.querySelector('.trash-data')`); await waitSwal();
    await jsClick(`document.querySelector('.swal2-confirm')`); await waitToast(); await sleep(2000); await waitTable();
  }
  console.log('cleanup done');
}

if (PHASE === 'create') {
  await cleanup();
  await openSchools(); await clearToasts(); await b.ev('scrollTo(0,0); 1');
  await snap('c-form');
  await setField('[name=school_name]', SCHOOL.name); await snap('c-name');
  await blur(); await setFile('input[type=file][name=school_image]', SCHOOL.logo); await sleep(400); await snap('c-logo');
  await setField('[name=school_support_email]', SCHOOL.email); await snap('c-email');
  await blur(); await mouseClick('.content-wrapper form .custom-select-trigger'); await sleep(600); await snap('c-cc-open');
  await setField('.custom-select-search-input', SCHOOL.countrySearch); await sleep(500); await snap('c-cc-search');
  await jsClick(`[...document.querySelectorAll('.custom-select-option')].find(o=>o.dataset.value===${J(SCHOOL.country)}&&o.offsetParent)`); await sleep(500); await snap('c-cc');
  await setField('[name=school_support_phone]', SCHOOL.phone); await snap('c-phone');
  await setField('[name=school_tagline]', SCHOOL.tagline); await snap('c-tagline');
  await setField('[name=school_address]', SCHOOL.address); await snap('c-address');
  await setField('[name=school_code_prefix]', SCHOOL.prefix); await snap('c-prefix');
  await setField('input[name=domain]', SCHOOL.domain); await snap('c-domain');
  await blur();
  // submit: "Please wait" dialog, then the toast (window-sized captures, as they are fixed on screen)
  await scrollToEl(`document.querySelector('.content-wrapper form input[type=submit]')`, 560);
  await snap('c-before-submit', { viewport: true });
  await b.ev(`setTimeout(()=>document.querySelector('.content-wrapper form input[type=submit]').click(),30); 1`);
  await waitSwal(); await b.ev(tidy); await snap('c-wait', { viewport: true });
  await waitToast(); await b.ev(tidy); await b.ev(pageTidy); await snap('c-toast', { viewport: true });
  await waitTable(new RegExp(SCHOOL.name).toString()); await sleep(1500);
  await clearToasts();
  await scrollToEl(`[...document.querySelectorAll('.card')].find(c=>/List Schools/.test(c.innerText))`, 80);
  await snap('c-list');
  await openRowMenu(); await snap('c-menu');
  await closeMenus();
  // Capture the progress window part-way through (ticked steps), re-checking in this same session.
  let pct = 0;
  for (let i = 0; i < 40; i++) {
    await openSchools(); await clearToasts();
    const cell = await b.ev(`((${rowExpr} || {}).innerText || '')`, '');
    pct = +((cell.match(/(\d+)%/) || [0, 0])[1]);
    if (!/INSTALLING/.test(cell)) { console.log('setup finished before a mid-way capture'); break; }
    if (pct >= 20) {
      await scrollToEl(`[...document.querySelectorAll('.card')].find(c=>/List Schools/.test(c.innerText))`, 80);
      await openRowMenu(); await openProgress('c-progress'); break;
    }
    await sleep(4000);
  }
}

// Re-capture the setup-progress window without creating the school again (also shows how far setup is).
async function openProgress(name) {
  await jsClick(`document.querySelector('.dropdown-menu.show .view-provision-progress')`); await closeMenus();
  await b.ev(`document.querySelectorAll('.dropdown-menu.show').forEach(m=>m.classList.remove('show')); 1`);
  await waitModal(); await sleep(1500);
  await snap(name, { viewport: true });
  console.log('setup status:', await b.ev(`(document.querySelector('.modal.show')||{}).innerText?.replace(/\\s+/g,' ').slice(0,80)`, ''));
}
if (PHASE === 'progress') {
  await openSchools(); await clearToasts();
  await scrollToEl(`[...document.querySelectorAll('.card')].find(c=>/List Schools/.test(c.innerText))`, 80);
  if (await b.ev(`!!(${rowExpr} && ${rowExpr}.querySelector('.view-provision-progress'))`, false)) {
    await openRowMenu();
    await openProgress(process.argv[3] || 'c-progress');
  } else console.log('setup finished:', await b.ev(`(${rowExpr}||{}).innerText?.replace(/\\s+/g,' ').slice(0,160)`, ''));
}

if (PHASE === 'actions') {
  // Start from a normal state even if an earlier run stopped halfway: restore from Trashed, then make it Active.
  await openSchools(); await clearToasts();
  if (!(await b.ev(`!!(${rowExpr})`, false))) {
    await listMode('Trashed'); await waitTable();
    if (await b.ev(`!!(${rowExpr})`, false)) {
      await jsClick(`${rowExpr}.querySelector('.restore-data')`); await sleep(800);
      if (await b.ev(`!!document.querySelector('.swal2-popup')`, false)) await jsClick(`document.querySelector('.swal2-confirm')`);
      await waitToast(); console.log('restored from Trashed');
    }
    await openSchools(); await clearToasts();
  }
  if (/Inactive/.test(await b.ev(`(${rowExpr}||{}).innerText||''`, ''))) {
    await jsClick(`${rowExpr}.querySelector('.change-school-status')`); await waitSwal();
    await jsClick(`document.querySelector('.swal2-confirm')`); await waitToast(); console.log('set Active again');
    await openSchools(); await clearToasts();
  }
  const status = await b.ev(`(${rowExpr}||{}).innerText||''`, '');
  if (!/Active/.test(status) || /INSTALLING/.test(status)) { console.log('School is not ready yet:', status.replace(/\s+/g, ' ').slice(0, 160)); process.exit(2); }
  await scrollToEl(`[...document.querySelectorAll('.card')].find(c=>/List Schools/.test(c.innerText))`, 80);
  await snap('a-list');
  // search, columns, export
  await setField('.fixed-table-toolbar input[placeholder=Search], .fixed-table-toolbar .search input', 'Greenwood'); await sleep(2500); await waitTable(); await snap('a-search');
  await jsClick(`document.querySelector('.fixed-table-toolbar .keep-open button, .fixed-table-toolbar button[title=Columns]')`); await sleep(700); await snap('a-columns');
  await jsClick(`document.querySelector('.fixed-table-toolbar .keep-open button, .fixed-table-toolbar button[title=Columns]')`); await sleep(400);
  await jsClick(`document.querySelector('.fixed-table-toolbar .export button, .fixed-table-toolbar button[title="Export data"]')`); await sleep(700); await snap('a-export');
  await jsClick(`document.querySelector('.fixed-table-toolbar .export button, .fixed-table-toolbar button[title="Export data"]')`); await sleep(400); await blur();
  // row menu
  await openRowMenu(); await snap('a-menu');
  // Manage admin, save 1: change the admin's name
  await jsClick(`document.querySelector('.dropdown-menu.show .update-admin-data')`); await closeMenus(); await waitModal(); await snap('a-admin', { viewport: true });
  await setField('[name=edit_admin_first_name]', SCHOOL.adminFirst); await snap('a-admin-first', { viewport: true });
  await setField('[name=edit_admin_last_name]', SCHOOL.adminLast); await snap('a-admin-last', { viewport: true });
  await blur();
  const submitModal = () => jsClick(`[...document.querySelectorAll('.modal.show input[type=submit], .modal.show button[type=submit]')].find(e=>e.offsetParent)`);
  await submitModal();
  await waitToast(); await sleep(1200); await b.ev(tidy); await b.ev(pageTidy); await snap('a-admin-toast', { viewport: true });
  await clearToasts(); await waitTable(); await sleep(800); await snap('a-admin-done');
  // Manage admin, save 2: the account options. Kept separate because the server drops other changes made
  // in the same save as "Manually verify email" (reported to the backend team).
  await openRowMenu(); await snap('a-menu-admin2');
  await jsClick(`document.querySelector('.dropdown-menu.show .update-admin-data')`); await closeMenus(); await waitModal(); await snap('a-admin2', { viewport: true });
  await jsClick(`document.querySelector('.modal.show [name=manually_verify_email]')`); await sleep(300); await snap('a-admin-verify', { viewport: true });
  await submitModal();
  await waitToast(); await sleep(1200); await b.ev(tidy); await b.ev(pageTidy); await snap('a-admin-verify-toast', { viewport: true });
  await clearToasts(); await waitTable(); await sleep(800); await snap('a-admin-verified');
  // Edit
  await openRowMenu();
  await jsClick(`document.querySelector('.dropdown-menu.show .edit-data')`); await closeMenus(); await waitModal(); await sleep(600); await snap('a-edit', { viewport: true });
  await setField('[name=edit_school_tagline]', SCHOOL.newTagline); await snap('a-edit-tagline', { viewport: true });
  await blur();
  await jsClick(`[...document.querySelectorAll('.modal.show input[type=submit], .modal.show button[type=submit]')].find(e=>e.offsetParent)`);
  await waitToast(); await sleep(1000); await snap('a-edit-toast', { viewport: true });
  await clearToasts(); await waitTable(); await sleep(600);
  // Inactive, then Active again
  await openRowMenu(); await snap('a-menu2');
  await jsClick(`document.querySelector('.dropdown-menu.show .change-school-status')`); await closeMenus(); await waitSwal(); await snap('a-status-confirm', { viewport: true });
  await jsClick(`document.querySelector('.swal2-confirm')`); await waitToast(); await sleep(1500); await waitTable(); await b.ev(tidy); await b.ev(pageTidy);
  await snap('a-inactive-toast', { viewport: true });
  await clearToasts(); await snap('a-inactive');
  await openRowMenu(); await snap('a-menu-inactive');
  await jsClick(`document.querySelector('.dropdown-menu.show .change-school-status')`); await closeMenus(); await waitSwal();
  await jsClick(`document.querySelector('.swal2-confirm')`); await waitToast(); await sleep(1500); await waitTable();
  await clearToasts(); await snap('a-active');
  // Delete -> Trashed -> Restore
  await openRowMenu(); await snap('a-menu3');
  await jsClick(`document.querySelector('.dropdown-menu.show .delete-form')`); await closeMenus(); await waitSwal(); await snap('a-delete-confirm', { viewport: true });
  await jsClick(`document.querySelector('.swal2-confirm')`); await waitToast(); await sleep(1500); await waitTable(); await b.ev(tidy); await b.ev(pageTidy);
  await snap('a-delete-toast', { viewport: true });
  await clearToasts(); await snap('a-deleted');
  await listMode('Trashed'); await waitTable(new RegExp(SCHOOL.name).toString()); await snap('a-trashed');
  await openRowMenu(); await snap('a-trash-menu');
  await jsClick(`document.querySelector('.dropdown-menu.show .restore-data')`); await closeMenus(); await sleep(800);
  if (await b.ev(`!!document.querySelector('.swal2-popup')`, false)) { await snap('a-restore-confirm', { viewport: true }); await jsClick(`document.querySelector('.swal2-confirm')`); }
  await waitToast(); await sleep(1500); await b.ev(tidy); await b.ev(pageTidy); await snap('a-restore-toast', { viewport: true });
  await clearToasts(); await listMode('All'); await waitTable(new RegExp(SCHOOL.name).toString()); await snap('a-restored');
  // A restored school comes back Inactive; switch it on again so the server is left tidy (not part of the video).
  await jsClick(`${rowExpr}.querySelector('.change-school-status')`); await waitSwal();
  await jsClick(`document.querySelector('.swal2-confirm')`); await waitToast();
  await sleep(1500); await waitTable();
  console.log('status now:', (await b.ev(`(${rowExpr}||{}).innerText||''`, '')).replace(/\s+/g, ' ').slice(-40));
}

// ================= school: open the school, sign in, Academy Setup Wizard =================
if (PHASE === 'school') {
  await openSchools(); await clearToasts();
  const status = await b.ev(`(${rowExpr}||{}).innerText||''`, '');
  if (!/Active/.test(status) || /Inactive|INSTALLING/.test(status)) { console.log('School is not Active:', status.replace(/\s+/g, ' ').slice(-60)); process.exit(2); }
  // 0. A new school has no plan, so its website and features are off: assign one first.
  //    (Package names from this server's branding are shown as generic tiers in the recording.)
  const planTidy = `(()=>{ const m = { 'Chalk Start': 'Starter', 'Chalk Core': 'Standard', 'Chalk Pro': 'Premium' };
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode());) for (const [k, v] of Object.entries(m)) if (n.nodeValue.includes(k)) n.nodeValue = n.nodeValue.split(k).join(v);
    return 1; })()`;
  const KA = kit(b, { out: OUT, tidy: [pageTidy, planTidy, tidy] });
  const reportRow = `row(/${SCHOOL.name}/)`;
  const PLAN = {
    navSubscription: `[...document.querySelectorAll('.sidebar a')].find(a=>a.innerText.trim()==='Subscription')`,
    navPackages: `[...document.querySelectorAll('.sidebar .nav-link')].find(a=>/Packages & subscription/.test(a.innerText))`,
    listCard: `[...document.querySelectorAll('.content-wrapper .card')].find(c=>c.querySelector('.bootstrap-table'))`,
    row: reportRow, rowPlan: `${reportRow} && ${reportRow}.children[2]`, viewReport: `${reportRow} && [...${reportRow}.querySelectorAll('a')].find(a=>/View report/i.test(a.innerText))`,
    profileCard: `[...document.querySelectorAll('.content-wrapper .card')].find(c=>/Total spent/.test(c.innerText))`,
    assignBtn: `[...document.querySelectorAll('.content-wrapper a, .content-wrapper button')].find(x=>/ASSIGN PLAN|UPDATE PLAN/i.test(x.innerText)&&x.offsetParent)`,
    statusBadge: `[...document.querySelectorAll('.content-wrapper *')].find(e=>e.offsetParent&&e.children.length===0&&/^(Active|Inactive)$/.test(e.innerText.trim()))`,
    planCard: `[...document.querySelectorAll('.content-wrapper *')].find(e=>e.offsetParent&&/CURRENT ACTIVE PLAN/i.test(e.innerText)&&e.getBoundingClientRect().height<260&&e.children.length<10)`,
    historyCard: `[...document.querySelectorAll('.content-wrapper .card')].find(c=>/Subscription history/.test(c.innerText))`,
    modal: `q('.modal.show .modal-content')`, pkgSelect: `q('.modal.show [name=package_id]')`,
    modalSubmit: `q('.modal.show [type=submit]')`, toast: `q('.jq-toast-single')`,
  };
  KA.setTargets(PLAN);
  await b.go('subscriptions/report'); await KA.waitTable(`/${SCHOOL.name}/`); await KA.runTidy();
  // Re-running only the second half: if this copy of the school already has a plan and the plan shots exist, keep them.
  const hasPlan = !/None/.test(await b.ev(`(()=>{const r=[...document.querySelectorAll('.bootstrap-table tbody tr')].find(r=>/${SCHOOL.name}/.test(r.innerText));return r?r.children[2].innerText:'None'})()`, 'None'));
  const skipPlan = hasPlan && fs.existsSync(path.join(OUT, 'p-school-active.png'));
  if (hasPlan && !skipPlan) { console.log('This school already has a plan: re-run create first.'); process.exit(5); }
  if (skipPlan) console.log('plan already assigned: keeping the recorded plan shots');
  if (!skipPlan) {
  await KA.snap('p-list');
  await KA.jsClick(PLAN.viewReport); await KA.waitFor(`location.pathname.includes('/subscriptions/report/school/')`, 30000, 300);
  await KA.waitFor(`[...document.querySelectorAll('.content-wrapper a, .content-wrapper button')].some(x=>/ASSIGN PLAN/i.test(x.innerText))`, 30000, 300); await sleep(1200);
  await KA.snap('p-school');
  await KA.jsClick(PLAN.assignBtn); await KA.waitModal(); await KA.snap('p-assign', { viewport: true });
  // A native <select>: its open list is drawn by the OS and never appears in screenshots, so pick the value directly.
  await b.ev(`(()=>{const s=document.querySelector('.modal.show [name=package_id]');const o=[...s.options].find(o=>/^Full/.test(o.text));s.value=o.value;s.dispatchEvent(new Event('change',{bubbles:true}));return 1})()`);
  await sleep(400); await KA.snap('p-assign-full', { viewport: true });
  await KA.jsClick(PLAN.modalSubmit); await KA.waitToast(); await KA.snap('p-assign-toast', { viewport: true });
  console.log('assign plan:', (await b.ev(`(document.querySelector('.jq-toast-single')||{}).innerText||''`, '')).replace(/\s+/g, ' '));
  await KA.clearToasts(); await b.ev(`location.reload(); 1`); await sleep(1500);
  await KA.waitFor(`[...document.querySelectorAll('.content-wrapper *')].some(e=>/CURRENT ACTIVE PLAN/i.test(e.innerText))`, 30000, 400); await sleep(1500);
  await KA.snap('p-school-active');
  }

  // 1. Super Admin: Edit school shows the Default domain URL.
  await openSchools(); await clearToasts();
  await scrollToEl(`[...document.querySelectorAll('.card')].find(c=>/List Schools/.test(c.innerText))`, 80);
  await snap('l-list');
  await openRowMenu(); await snap('l-menu');
  await jsClick(`document.querySelector('.dropdown-menu.show .edit-data')`); await closeMenus(); await waitModal(); await sleep(600);
  await b.ev(`(()=>{const a=document.querySelector('.modal.show .defaultDomain .school_url');a.scrollIntoView({block:'center'});return 1})()`); await sleep(500);
  await snap('l-edit-url', { viewport: true });
  const schoolUrl = await b.ev(`document.querySelector('.modal.show .defaultDomain .school_url').href`, '');
  console.log('school URL:', schoolUrl.replace(/\/\/[^.]+\./, '//greenwood.').slice(0, 12) + '…');
  await b.ev(`document.querySelectorAll('.modal.show [data-bs-dismiss=modal]').forEach(x=>x.click()); 1`); await sleep(600);

  // Right after a school is recreated, its address can briefly point at the old copy's database (HTTP 500
  // "Unknown database"). Wait until it serves the new school.
  for (let i = 0; i < 40; i++) {
    const res = await fetch(schoolUrl).then(async (r) => ({ ok: r.ok, body: await r.text() })).catch(() => ({ ok: false, body: '' }));
    if (res.ok && !/Unknown database|QueryException/.test(res.body)) break;
    if (i === 0) console.log('waiting for the school address to serve the new school…');
    await sleep(15000);
  }

  // 2. The school's website, signed out, in its own browser.
  const w = await launch(9745, 1600, 900, 2);
  w.ev = async (e, d) => { try { const v = await w.evaluate(e); return v === undefined ? d : v; } catch (x) { return d; } };
  // A fresh, signed-out visitor: the saved profile may hold a session for a previous copy of the school.
  await w.send('Network.enable'); await w.send('Network.clearBrowserCookies'); await w.send('Network.clearBrowserCache');
  // The recording tidy has already swapped the Super Admin page title, so read the brand it remembered.
  const brand = await b.ev(`window.__tutName || ''`, '') || 'BEYOND CHALK';
  const logoH = 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(ROOT, 'vendor/brand/logo-horizontal.svg')).toString('base64');
  const loginArt = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(ROOT, 'vendor/sample/login-art.jpg')).toString('base64');
  // The school's pages show the system logo/name from this server's branding: show the stock eSchool SaaS ones,
  // fix a typo in the default slider text ("Syatem"), and hide this server's test additional fields.
  const schoolTidy = (`(()=>{
    window.__tutName = ${JJ(brand)};
    document.querySelectorAll('img').forEach(i => { if (/system-settings/.test(i.src) && i.naturalWidth > 2 * i.naturalHeight) { i.src = ${JJ(logoH)}; i.style.height = (i.closest('.navbar, header, nav') ? 46 : 60) + 'px'; i.style.width = 'auto'; } });
    // hold the home page slider on its first slide (a later slide image has a typo, and slides must not jump between shots)
    try { window.jQuery && jQuery('.owl-carousel').trigger('stop.owl.autoplay').trigger('to.owl.carousel', [0, 0]); } catch (e) {}
    document.querySelectorAll('.swiper, .swiper-container').forEach(s => { try { s.swiper.autoplay && s.swiper.autoplay.stop(); s.swiper.slideTo(0, 0); } catch (e) {} });
    document.querySelectorAll('.carousel').forEach(c => { try { const k = bootstrap.Carousel.getOrCreateInstance(c); k.pause(); k.to(0); } catch (e) {} });
    // the sign-in page's side artwork comes from this server's branding: show the product's stock artwork
    document.querySelectorAll('.lp-brand-col').forEach(e => { if (!e.dataset.tut) { e.style.backgroundImage = 'url(' + ${JJ(loginArt)} + ')'; e.dataset.tut = 1; } });
    document.querySelectorAll('[name^="extra_fields"]').forEach(i => { const g = i.closest('.form-group'); if (g) g.style.display = 'none'; });
    return 1;
  })()`);
  const KW = kit(w, { out: OUT, tidy: [schoolTidy, tidy] });
  const typeIn = async (expr, v) => {
    await w.ev(`(()=>{const i=${expr};i.focus();i.select&&i.select();return 1})()`);
    await w.send('Input.insertText', { text: v });
    await w.ev(`(()=>{const i=document.activeElement;['keyup','change'].forEach(e=>i.dispatchEvent(new Event(e,{bubbles:true})));return 1})()`); await sleep(200);
  };
  const closePickers = () => w.ev(`document.activeElement&&document.activeElement.blur();document.querySelectorAll('.datepicker-dropdown').forEach(d=>d.remove());1`);
  w.send('Page.navigate', { url: schoolUrl });
  await KW.waitFor(`[...document.querySelectorAll('button')].some(e=>/^Login/.test(e.innerText.trim()))`, 45000, 500);
  await KW.waitFor(`[...document.images].filter(i=>i.offsetParent).every(i=>i.complete)`, 15000, 300); await sleep(1500);
  KW.setTargets({
    loginBtn: `[...document.querySelectorAll('button')].find(e=>/^Login/.test(e.innerText.trim())&&e.offsetParent)`,
    loginMenu: `q('.dropdown-menu.show')`,
    staffLink: `[...document.querySelectorAll('.dropdown-menu.show a')].find(a=>/staff/i.test(a.innerText))`,
    studentLink: `[...document.querySelectorAll('.dropdown-menu.show a')].find(a=>/student/i.test(a.innerText))`,
    header: `q('header, .navbar, nav')`,
  });
  // let the home page slider draw its first slide before the first shot
  await KW.runTidy(); await sleep(2500); await KW.runTidy();
  await KW.waitFor(`[...document.querySelectorAll('.owl-item.active img, .swiper-slide-active img, .carousel-item.active img, .heroImg img')].some(i=>i.complete&&i.naturalWidth>0&&i.getBoundingClientRect().height>100)`, 15000, 300);
  await sleep(1200);
  await KW.snap('l-site', { viewport: true });
  await KW.jsClick(`[...document.querySelectorAll('button')].find(e=>/^Login/.test(e.innerText.trim())&&e.offsetParent)`); await sleep(700);
  await KW.snap('l-site-menu', { viewport: true });
  if (process.env.ONLY_SITE) { console.log('site shots re-taken'); w.close(); b.close(); process.exit(0); }
  await KW.jsClick(`[...document.querySelectorAll('.dropdown-menu.show a')].find(a=>/staff/i.test(a.innerText))`);
  await KW.waitFor(`document.getElementById('email')`, 30000, 300); await sleep(1500);
  KW.setTargets({ card: `q('#loginForm') && q('#loginForm').closest('.card, .login-card, .auth-form-wrapper, div')`, form: `q('#loginForm')`, email: `q('#email')`, password: `q('#password')`, signIn: `[...document.querySelectorAll('#loginForm button, #loginForm [type=submit]')].find(x=>/sign in/i.test(x.innerText||x.value))` },
                { emailBox: `q('#email')`, passwordBox: `q('#password')` });
  await KW.snap('l-login', { viewport: true });
  await typeIn(`document.getElementById('email')`, SCHOOL.email); await KW.snap('l-email', { viewport: true });
  await typeIn(`document.getElementById('password')`, SCHOOL.phone); await KW.snap('l-password', { viewport: true });
  await KW.blur();
  await KW.jsClick(`[...document.querySelectorAll('#loginForm button, #loginForm [type=submit]')].find(x=>/sign in/i.test(x.innerText||x.value))`);
  if (!(await KW.waitFor(`location.pathname.includes('academy-setup-wizard') && (document.getElementById('begin-setup-btn')||{}).offsetParent`, 45000, 500))) {
    console.log('Wizard did not open:', await w.ev('location.pathname', ''), await w.ev(`document.body.innerText.slice(0,200)`, '')); process.exit(3);
  }
  await sleep(1500);

  // 3. Academy Setup Wizard. Every target is captured on every snapshot; missing ones are null.
  const SEC = (st) => `document.querySelector('section[data-step=${st}]')`;
  const chipRects = { raw: `(()=>{const o={};document.querySelectorAll('section.academy-step.active .select-chip').forEach(c=>{if(c.offsetParent)o[c.innerText.trim()]=r(c)});return o})()` };
  const subjRects = { raw: `(()=>{const o={};document.querySelectorAll('section[data-step=mapping] .subject-radio-item').forEach(c=>{if(c.offsetParent)o[c.innerText.trim()]=r(c)});return o})()` };
  const tabRects = { raw: `(()=>{const o={};document.querySelectorAll('.mapping-class-tab').forEach(c=>{if(c.offsetParent)o[c.innerText.trim()]=r(c)});return o})()` };
  const streamRects = { raw: `(()=>{const o={};document.querySelectorAll('section[data-step=mapping] .stream-card').forEach(c=>{if(c.offsetParent)o[c.innerText.trim().split('\\n')[0]]=r(c)});return o})()` };
  KW.setTargets({
    wizardCard: `q('.academy-setup-progress-steps') && q('.academy-setup-progress-steps').closest('.card, .wizard-card, .setup-card') || q('section.academy-step.active')`,
    steps: `q('#academy-steps')`, section: `q('section.academy-step.active')`, header: `q('section.academy-step.active .step-header')`,
    begin: `q('#begin-setup-btn')`, next: `q('#next-step-btn')`, prev: `q('#prev-step-btn')`, skip: `q('#skip-installation-btn')`, finalize: `q('#finalize-setup-btn')`,
    features: `q('section[data-step=welcome] .row') || q('section[data-step=welcome]')`,
    sessionName: `q('#session-name')`, sessionStart: `q('#session-start-date')`, sessionEnd: `q('#session-end-date')`, board: `q('#optional-board-id') && (q('#optional-board-id').closest('.form-group')||q('#optional-board-id'))`,
    semToggle: `q('#enable-semesters') && q('#enable-semesters').closest('.custom-control, .form-check, .form-group, div')`,
    semBlock: `q('.semester-input') && q('.semester-input').closest('.content-block, .card, .semesters-block') `,
    sessionBlock: `q('#session-name') && q('#session-name').closest('.content-block, .card')`,
    sem: { raw: `[...document.querySelectorAll('section[data-step=session] .semester-input')].filter(i=>i.offsetParent).map(r)` },
    chips: chipRects,
    shiftRow: `q('.shift-item')`, addShift: `q('#add-shift-btn')`,
    classTabs: tabRects, subjects: subjRects, streams: streamRects,
    mediumBlock: `q('#mapping-medium-tabs') && q('#mapping-medium-tabs').closest('.mapping-block')`,
    infoRow: `q('.mapping-row-grid')`,
    semesterRow: `[...document.querySelectorAll('section[data-step=mapping] *')].find(e=>e.offsetParent&&/Enable semester system/.test(e.innerText)&&e.children.length>0&&e.children.length<6&&e.getBoundingClientRect().height<130)`,
    subjectBlock: `[...document.querySelectorAll('section[data-step=mapping] .mapping-block')].find(e=>e.offsetParent&&/Subject mapping/.test(e.innerText))`,
    electiveBlock: `q('.elective-groups-wrapper')`, enableElectives: `[...document.querySelectorAll('section[data-step=mapping] button')].find(x=>/ELECTIVES/i.test(x.innerText)&&x.offsetParent)`,
    newGroup: `[...document.querySelectorAll('section[data-step=mapping] button')].find(x=>/New group/i.test(x.innerText)&&x.offsetParent)`,
    electiveCard: `q('.elective-group-card')`, addElective: `q('.add-elective-subject-wrapper')`, totalSelect: `q('.total-selectable-input')`,
    summary: `q('section[data-step=finish] .content-block, section[data-step=finish] table, section[data-step=finish] .summary')`,
    progressList: { raw: `(()=>{const e=[...document.querySelectorAll('section[data-step=finish] *')].find(x=>x.offsetParent&&/Finalizing your academy data/.test(x.innerText)&&x.getBoundingClientRect().height<400&&x.getBoundingClientRect().height>100);return e?r(e):null})()` },
    toast: `q('.jq-toast-single')`,
  }, { sessionNameBox: `q('#session-name')`, sessionStartBox: `q('#session-start-date')`, sessionEndBox: `q('#session-end-date')`,
       sem0: `[...document.querySelectorAll('.semester-input')][0]`, sem1: `[...document.querySelectorAll('.semester-input')][1]`, sem2: `[...document.querySelectorAll('.semester-input')][2]`,
       sem3: `[...document.querySelectorAll('.semester-input')][3]`, sem4: `[...document.querySelectorAll('.semester-input')][4]`, sem5: `[...document.querySelectorAll('.semester-input')][5]` });
  const snapW = (name) => KW.snap(name);
  const cur = () => w.ev(`(document.querySelector('section.academy-step.active')||{}).dataset?.step`, '?');
  const next = async (want) => {
    await KW.clearToasts(); await w.ev(`scrollTo(0,0); 1`);
    await KW.jsClick(`document.getElementById('next-step-btn')`);
    await KW.waitFor(`(document.querySelector('section.academy-step.active')||{}).dataset.step===${JJ(want)}`, 10000, 200); await sleep(700);
    if ((await cur()) !== want) { console.log('Wizard stuck before', want, await w.ev(`[...document.querySelectorAll('.jq-toast-single')].map(t=>t.innerText).join(' | ')`, '')); process.exit(4); }
  };
  const chip = (name) => KW.jsClick(`[...document.querySelectorAll('section.academy-step.active .select-chip')].find(c=>c.innerText.trim()===${JJ(name)})`);
  await snapW('z-welcome');
  await KW.jsClick(`document.getElementById('begin-setup-btn')`); await KW.waitFor(`(document.querySelector('section.academy-step.active')||{}).dataset.step==='session'`, 8000); await sleep(700);
  // Academy year
  await snapW('z-session');
  await typeIn(`document.getElementById('session-name')`, '2026-2027'); await closePickers(); await snapW('z-sname');
  await typeIn(`document.getElementById('session-start-date')`, '01-04-2026'); await closePickers(); await snapW('z-sstart');
  await typeIn(`document.getElementById('session-end-date')`, '31-03-2027'); await closePickers(); await snapW('z-send');
  const semVals = ['Semester 1', '01-04-2026', '30-09-2026', 'Semester 2', '01-10-2026', '31-03-2027'];
  for (let k = 0; k < 6; k++) { await typeIn(`[...document.querySelectorAll('section[data-step=session] .semester-input')][${k}]`, semVals[k]); await closePickers(); await snapW(`z-sem-${k}`); }
  // Mediums & sections
  await next('medium-section'); await snapW('z-medium');
  for (const [n, i] of [['English', 1], ['A', 2], ['B', 3]]) { await chip(n); await sleep(250); await snapW(`z-medium${i}`); }
  // Shifts (the default Morning shift, 07:30 to 13:00)
  await next('shifts'); await snapW('z-shifts');
  // Streams
  await next('streams'); await snapW('z-streams');
  for (const [n, i] of [['Science', 1], ['Commerce', 2]]) { await chip(n); await sleep(250); await snapW(`z-streams${i}`); }
  // Classes
  await next('classes'); await snapW('z-classes');
  for (const [n, i] of [['Class 1', 1], ['Class 2', 2], ['Class 11', 3]]) { await chip(n); await sleep(250); await snapW(`z-classes${i}`); }
  // Subjects
  await next('subjects'); await snapW('z-subjects');
  const SUBJ = ['English', 'Hindi', 'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
  for (let i = 0; i < SUBJ.length; i++) { await chip(SUBJ[i]); await sleep(200); await snapW(`z-subjects${i + 1}`); }
  // Mapping
  await next('mapping'); await snapW('z-map1');
  const M = SEC('mapping');
  const subj = (n) => KW.jsClick(`[...${M}.querySelectorAll('.subject-radio-item')].find(c=>c.offsetParent&&c.innerText.trim()===${JJ(n)})`);
  const classTab = async (n) => { await KW.jsClick(`[...document.querySelectorAll('.mapping-class-tab')].find(t=>t.innerText.trim()===${JJ(n)})`); await sleep(800); };
  const CORE = ['English', 'Hindi', 'Mathematics', 'Science'];
  for (let i = 0; i < CORE.length; i++) { await subj(CORE[i]); await sleep(200); await snapW(`z-map1-${i + 1}`); }
  await classTab('Class 2'); await snapW('z-map2');
  for (const n of CORE) { await subj(n); await sleep(150); }
  await snapW('z-map2-done');
  await classTab('Class 11'); await snapW('z-map11');
  await KW.jsClick(`[...${M}.querySelectorAll('.stream-card')].find(c=>c.offsetParent&&/Science/.test(c.innerText))`); await sleep(900); await snapW('z-map11-stream');
  const SCI = ['English', 'Physics', 'Chemistry', 'Mathematics'];
  for (let i = 0; i < SCI.length; i++) { await subj(SCI[i]); await sleep(200); await snapW(`z-map11-s${i + 1}`); }
  await KW.jsClick(`[...${M}.querySelectorAll('button')].find(x=>/ENABLE ELECTIVES/i.test(x.innerText)&&x.offsetParent)`); await sleep(700); await snapW('z-elect1');
  await KW.jsClick(`[...${M}.querySelectorAll('button')].find(x=>/New group/i.test(x.innerText)&&x.offsetParent)`); await sleep(700); await snapW('z-elect2');
  for (const [n, i] of [['Biology', 3], ['Computer Science', 4]]) {
    await w.ev(`(()=>{const s=[...${M}.querySelectorAll('.add-elective-subject-select')].find(s=>s.offsetParent);const o=[...s.options].find(o=>o.text.trim()===${JJ(n)});s.value=o.value;s.dispatchEvent(new Event('change',{bubbles:true}));try{$(s).trigger('change')}catch(e){};return 1})()`);
    await sleep(600); await snapW(`z-elect${i}`);
  }
  // Finish
  await next('finish'); await snapW('z-finish');
  await KW.jsClick(`document.getElementById('finalize-setup-btn')`);
  // The checklist ticks off in a few seconds: capture the visible window part-way through.
  await sleep(3600);
  await w.ev(`(()=>{const e=[...document.querySelectorAll('section[data-step=finish] *')].find(x=>x.offsetParent&&/Finalizing your academy data/.test(x.innerText)&&x.children.length<12);e&&e.scrollIntoView({block:'center'});return 1})()`);
  await KW.snap('z-finalizing', { viewport: true });
  await KW.waitFor(`location.pathname.includes('dashboard') && document.querySelector('.content-wrapper')`, 45000, 500); await sleep(4000);
  KW.setTargets({
    navbar: `q('.navbar')`, sessionPicker: `[...document.querySelectorAll('.navbar *')].find(e=>e.offsetParent&&/2026-2027/.test(e.innerText)&&e.children.length<6)`,
    kpis: `q('.content-wrapper .row')`, profile: `q('#profileDropdown')`, schoolName: `[...document.querySelectorAll('.navbar *')].find(e=>e.offsetParent&&e.children.length===0&&/Greenwood/.test(e.innerText))`,
  });
  await snapW('z-dashboard');
  console.log('wizard done, landed on', await w.ev('location.pathname', ''));
  w.close();
}

b.close();
process.exit(0);
