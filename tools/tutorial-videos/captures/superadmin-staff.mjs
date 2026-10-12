// Captures the Super Admin > Personnel management > Staff tutorial: add a staff member with the Onboarding Manager
// role (from the Role & permission tutorial), then sign in as them in a fresh browser to show what the role allows.
// An earlier copy of the tutorial staff member is removed first.
// Run: node tools/tutorial-videos/captures/superadmin-staff.mjs
//
// The staff list is not recorded yet: on the recording server its data request fails (HTTP 500, table
// extra_user_datas missing), so the list card is hidden in the recording until that is fixed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { session, panelUrl } from '../lib/session.mjs';
import { tidyScript } from '../lib/tidy.mjs';
import { kit, J } from '../lib/capture-kit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'cache/superadmin-staff');
export const STAFF = {
  role: 'Onboarding Manager', first_name: 'Olivia', last_name: 'Bennett', country: '44', mobile: '7700900789',
  email: 'olivia.bennett@example.com', dob: '12-08-1994', photo: path.join(ROOT, 'vendor/sample/avatar-olivia-bennett.png'),
  schools: ['Greenwood International School', 'Maplewood Academy', 'Riverside Public School'],
};
// Schools on the recording server that are test data; they are left out of the Assign schools list in the video.
const HIDE_SCHOOLS = /^(TTT|Tony Stark Academy school|RD Varsani)$/i;

const b = await session(9901, 1600, 900, 2);
console.log('login ->', await b.login());
// Recording-only cleanup: leftover test roles and test schools are left out of the pickers, and the staff list
// card (broken on this server, see above) is hidden. Nothing on the server changes.
const staffTidy = `(()=>{
  const F = document.querySelector('.create-staff-form');
  if (F) {
    const role = F.querySelector('[name=role_id]');
    if (role && !role.dataset.tut) {
      [...role.options].forEach(o => { if (/test/i.test(o.text)) { const li = role.parentElement.querySelector('.custom-select-option[data-value="' + o.value + '"]'); if (li) li.remove(); o.remove(); } });
      role.dataset.tut = 1;
      const t = role.parentElement.querySelector('.custom-select-trigger'); if (t && role.selectedOptions[0]) t.textContent = role.selectedOptions[0].text.trim();
      role.parentElement.id = 'tut-role';
    }
    const cc = F.querySelector('[name=country_code]'); if (cc) cc.closest('.custom-select-wrapper').id = 'tut-cc';
    F.querySelectorAll('[name="school_id[]"] option').forEach(o => { if (${HIDE_SCHOOLS}.test(o.text.trim())) o.remove(); });
  }
  const list = document.getElementById('table_list'); if (list) { const c = list.closest('.card'); if (c) c.style.display = 'none'; }
  return 1;
})()`;
const K = kit(b, { out: OUT, tidy: [staffTidy, tidyScript(ROOT)] });
const { sleep, ev, jsClick, setField, setFile, blur, waitFor, waitToast, clearToasts, setTargets, snap } = K;

// Staff ids for an email, from the list's data request. While the request fails, its error names the user ids of
// the matching rows, so this works before and after the server fix.
const idsFor = (email, inactive) => ev(`(async()=>{const t=document.querySelector('table[data-url]');const u=new URL(t.dataset.url, location.href);
  u.searchParams.set('search',${J(email)});u.searchParams.set('limit','20');u.searchParams.set('offset','0');${inactive ? `u.searchParams.set('show_deactive','1');` : ''}
  const txt=await (await fetch(u,{headers:{'X-Requested-With':'XMLHttpRequest',Accept:'application/json'}})).text();
  try{const j=JSON.parse(txt);if(j.rows)return j.rows.map(r=>r.id);const m=/user_id\` in \\(([^)]*)\\)/.exec(j.message||'');return m?m[1].split(',').map(s=>+s.trim()):[]}catch(e){return []}})()`, []);
const call = (method, p) => ev(`(async()=>{const tok=document.querySelector('meta[name=csrf-token]').content;const r=await fetch(location.origin+${J(p)},{method:'POST',headers:{'X-CSRF-TOKEN':tok,'X-Requested-With':'XMLHttpRequest',Accept:'application/json','Content-Type':'application/x-www-form-urlencoded'},body:'_method='+${J(method)}});return r.status})()`, 0);
const openStaff = async () => {
  b.send('Page.navigate', { url: panelUrl() + 'staff' });
  await waitFor(`document.readyState==='complete' && document.querySelector('.create-staff-form [name=first_name]')`, 60000, 500);
  await sleep(1500); await K.runTidy();
};

// 0. clean start: an earlier tutorial staff member is set inactive, then deleted for good
await openStaff();
for (const id of await idsFor(STAFF.email, false)) console.log('inactive', id, await call('DELETE', `/staff/${id}`));
for (const id of await idsFor(STAFF.email, true)) console.log('delete', id, await call('DELETE', `/staff/${id}/deleted`));
console.log('cleanup done');

// 1. the form, one field at a time (window-sized shots: the pickers open over the page)
await openStaff();
const F = (s) => `q('.create-staff-form ${s}')`;
setTargets({
  navStaff: `[...document.querySelectorAll('.sidebar a')].find(a=>a.innerText.trim()==='Staff')`,
  navPersonnel: `[...document.querySelectorAll('.sidebar .nav-link')].find(a=>/Personnel management/.test(a.innerText))`,
  formCard: `q('.create-staff-form') && q('.create-staff-form').closest('.card')`,
  role: `q('#tut-role')`, roleTrigger: `q('#tut-role .custom-select-trigger')`, roleDropdown: `q('#tut-role .custom-select-dropdown')`,
  roleOption: `[...document.querySelectorAll('#tut-role .custom-select-option')].find(o=>o.innerText.trim()===${J(STAFF.role)}&&o.offsetParent)`,
  first_name: F('[name=first_name]'), last_name: F('[name=last_name]'),
  ccTrigger: `q('#tut-cc .custom-select-trigger')`, ccDropdown: `q('#tut-cc .custom-select-dropdown')`,
  ccOption: `[...document.querySelectorAll('#tut-cc .custom-select-option')].find(o=>o.dataset.value===${J(STAFF.country)}&&o.offsetParent)`,
  mobile: F('[name=mobile]'), mobileGroup: `q('#tut-cc') && q('#tut-cc').closest('.form-group')`, email: F('[name=email]'),
  imageText: F('.file-upload-info'), uploadBtn: F('.file-upload-browse'), imageGroup: `q('.create-staff-form .file-upload-browse') && q('.create-staff-form .file-upload-browse').closest('.form-group')`,
  dob: F('[name=dob]'), datepicker: `[...document.querySelectorAll('.datepicker')].find(d=>d.offsetParent)`,
  schools: `q('.create-staff-form [name="school_id[]"]') && q('.create-staff-form [name="school_id[]"]').parentElement.querySelector('.select2-container')`,
  schoolsGroup: `q('.create-staff-form [name="school_id[]"]') && q('.create-staff-form [name="school_id[]"]').closest('.form-group')`,
  schoolsDropdown: `q('.select2-container--open .select2-dropdown')`,
  schoolOpts: { raw: `(()=>{const o={};document.querySelectorAll('.select2-results__option').forEach(e=>{if(e.offsetParent)o[e.innerText.trim()]=r(e)});return o})()` },
  submit: `q('#create-btn')`, reset: F('[type=reset]'), toast: `q('.jq-toast-single')`,
}, {
  ccSearch: `q('#tut-cc .custom-select-search-input')`,
  first_name_box: F('[name=first_name]'), last_name_box: F('[name=last_name]'), mobile_box: F('[name=mobile]'),
  email_box: F('[name=email]'), dob_box: F('[name=dob]'),
});
const V = { viewport: true };
await snap('s-form', V);
// role
await jsClick(`q('#tut-role .custom-select-trigger')`); await sleep(600); await snap('s-role-open', V);
await jsClick(`[...document.querySelectorAll('#tut-role .custom-select-option')].find(o=>o.innerText.trim()===${J(STAFF.role)})`); await sleep(500);
console.log('role:', await ev(`document.querySelector('.create-staff-form [name=role_id]').selectedOptions[0].text`, ''));
await snap('s-role', V);
// name
await setField('.create-staff-form [name=first_name]', STAFF.first_name); await snap('s-first', V);
await setField('.create-staff-form [name=last_name]', STAFF.last_name); await snap('s-last', V);
await blur();
// mobile: country code, then the number
await K.pickCountry('#tut-cc', STAFF.country, STAFF.country, { open: 's-cc-open', search: 's-cc-search', opts: V });
await snap('s-cc', V);
await setField('.create-staff-form [name=mobile]', STAFF.mobile); await snap('s-mobile', V);
await setField('.create-staff-form [name=email]', STAFF.email); await snap('s-email', V);
await blur();
// photo
await setFile('.create-staff-form input[type=file][name=image]', STAFF.photo); await sleep(500); await snap('s-image', V);
// date of birth
await jsClick(`q('.create-staff-form [name=dob]')`); await ev(`(()=>{const i=document.querySelector('.create-staff-form [name=dob]');i.focus();try{$(i).datepicker('show')}catch(e){};return 1})()`);
await sleep(700); await snap('s-dob-open', V);
await setField('.create-staff-form [name=dob]', STAFF.dob); await sleep(500); await snap('s-dob-typed', V);
await ev(`(()=>{try{$('.create-staff-form [name=dob]').datepicker('hide')}catch(e){};document.activeElement&&document.activeElement.blur();return 1})()`);
await sleep(500); await snap('s-dob', V);
// assign schools: open the list and pick each school
const SEL = `$('.create-staff-form [name="school_id[]"]')`;
for (let k = 0; k < STAFF.schools.length; k++) {
  await ev(`(()=>{${SEL}.select2('open');return 1})()`); await sleep(600); await snap(`s-sch-open${k + 1}`, V);
  const ok = await ev(`(()=>{const s=${SEL};const o=[...s[0].options].find(o=>o.text.trim()===${J(STAFF.schools[k])});if(!o)return 0;s.val([...(s.val()||[]),o.value]).trigger('change');s.select2('close');return 1})()`, 0);
  if (!ok) console.log('school missing:', STAFF.schools[k]);
  await sleep(500); await snap(`s-sch${k + 1}`, V);
}
console.log('schools:', await ev(`${SEL}.select2('data').map(d=>d.text).join(', ')`, ''));
// submit
await blur(); await clearToasts();
await jsClick(`q('#create-btn')`); await waitToast();
const toast = (await ev(`(document.querySelector('.jq-toast-single')||{}).innerText||''`, '')).replace(/\s+/g, ' ');
console.log('create:', toast);
if (!/success/i.test(toast)) { console.log('Staff member was not saved.'); process.exit(2); }
await snap('s-toast', V);
const brand = await ev(`window.__tutName || ''`, '') || 'BEYOND CHALK';
await clearToasts();

// 2. sign in as the new staff member in a fresh, signed-out browser (password = mobile number)
const w = await session(9902, 1600, 900, 2);
await w.send('Network.enable'); await w.send('Network.clearBrowserCookies'); await w.send('Network.clearBrowserCache');
const loginArt = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(ROOT, 'vendor/sample/login-art.jpg')).toString('base64');
// the sign-in page's side artwork comes from this server's branding: show the product's stock artwork
const loginTidy = `(()=>{
  window.__tutName = ${J(brand)};
  document.querySelectorAll('.lp-brand-col').forEach(e => { if (!e.dataset.tut) { e.style.backgroundImage = 'url(' + ${J(loginArt)} + ')'; e.dataset.tut = 1; } });
  return 1;
})()`;
// this server's package names are client branding: show neutral names (as in the Manage schools tutorial)
const planTidy = `(()=>{ const m = { 'Chalk Start': 'Starter', 'Chalk Core': 'Standard', 'Chalk Pro': 'Premium' };
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) for (const [k, v] of Object.entries(m)) if (n.nodeValue.includes(k)) n.nodeValue = n.nodeValue.split(k).join(v);
  return 1; })()`;
const KW = kit(w, { out: OUT, tidy: [loginTidy, planTidy, tidyScript(ROOT)] });
w.send('Page.navigate', { url: panelUrl() + 'login' });
await KW.waitFor(`document.getElementById('email') && document.readyState==='complete'`, 45000, 400); await sleep(1500);
KW.setTargets({
  form: `q('#loginForm')`, email: `q('#email')`, password: `q('#password')`, schoolCode: `q('#loginForm [name=code], #loginForm [name=school_code]')`,
  signIn: `[...document.querySelectorAll('#loginForm button, #loginForm [type=submit]')].find(x=>/sign in/i.test(x.innerText||x.value))`,
  heading: `[...document.querySelectorAll('h1,h2,h3')].find(h=>/Welcome/.test(h.innerText))`,
}, { emailBox: `q('#email')`, passwordBox: `q('#password')` });
await KW.snap('l-login', V);
const typeIn = async (id, v) => {
  await w.ev(`(()=>{const i=document.getElementById(${J(id)});i.focus();i.select&&i.select();return 1})()`);
  await w.send('Input.insertText', { text: v });
  await w.ev(`(()=>{const i=document.activeElement;['keyup','change'].forEach(e=>i.dispatchEvent(new Event(e,{bubbles:true})));return 1})()`); await sleep(200);
};
await typeIn('email', STAFF.email); await KW.snap('l-email', V);
await typeIn('password', STAFF.mobile); await KW.snap('l-password', V);
await KW.blur();
// Submit on a timer: an evaluate that triggers navigation would never return.
await w.ev(`(()=>{const x=[...document.querySelectorAll('#loginForm button, #loginForm [type=submit]')].find(x=>/sign in/i.test(x.innerText||x.value));setTimeout(()=>x.click(),50);return 1})()`);
if (!(await KW.waitFor(`!location.pathname.includes('login') && document.querySelector('.content-wrapper .card')`, 60000, 500))) {
  console.log('Staff sign-in failed:', await w.ev(`document.body.innerText.slice(0,300)`, '')); process.exit(3);
}
await KW.waitFor(`document.readyState==='complete'`, 30000, 400); await sleep(2500);
const navTargets = {
  sidebar: `q('.sidebar .nav') || q('.sidebar')`,
  nav: { raw: `(()=>{const o={};document.querySelectorAll('.sidebar .nav > .nav-item > .nav-link').forEach(a=>{const t=a.innerText.trim();if(t&&a.offsetParent)o[t]=r(a.closest('.nav-item'))});return o})()` },
  subnav: { raw: `(()=>{const o={};document.querySelectorAll('.sidebar .sub-menu .nav-link').forEach(a=>{const t=a.innerText.trim();if(t&&a.offsetParent)o[t]=r(a)});return o})()` },
  navPersonnel: `[...document.querySelectorAll('.sidebar .nav-link')].find(a=>/Personnel management/.test(a.innerText))`,
  userMenu: `q('.navbar .nav-profile, .navbar .dropdown.nav-profile') || q('.navbar-nav-right .nav-item:last-child')`,
  pageTitle: `q('.content-wrapper .page-title, .content-wrapper h3')`,
};
KW.setTargets(navTargets);
console.log('staff sidebar:', await w.ev(`[...document.querySelectorAll('.sidebar .nav > .nav-item > .nav-link')].map(a=>a.innerText.trim()).filter(Boolean).join(' | ')`, ''));
await KW.snap('d-dash', V);
await KW.jsClick(`[...document.querySelectorAll('.sidebar .nav-link')].find(a=>/Personnel management/.test(a.innerText))`); await sleep(900);
console.log('personnel:', await w.ev(`[...document.querySelectorAll('.sidebar .sub-menu .nav-link')].filter(a=>a.offsetParent).map(a=>a.innerText.trim()).join(' | ')`, ''));
await KW.snap('d-personnel', V);
w.close(); b.close();
process.exit(0);
