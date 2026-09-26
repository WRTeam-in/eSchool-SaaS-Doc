// Captures the Super Admin Profile + Change password tutorial.
// It really fills in and saves the profile on the recording server, one field at a time, and snaps the screen
// after every step. Before that, it resets the profile to BEFORE so every run starts from the same place.
// The password is "changed" to the same value, so the sign-in details stay the same.
// Run: node tools/tutorial-videos/captures/superadmin-profile.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { session } from '../lib/session.mjs';
import { tidyScript } from '../lib/tidy.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'cache/superadmin-profile');
fs.mkdirSync(OUT, { recursive: true });
const tidy = tidyScript(ROOT);
const PASSWORD = process.env.TUTORIAL_PASSWORD;

// The default account as installed, and the details the tutorial enters.
const BEFORE = { first_name: 'super', last_name: 'admin', country: '93', mobile: '9876543210', dob: '28-07-2020', current_address: 'A', permanent_address: 'A' };
const AFTER = {
  first_name: 'Alex', last_name: 'Morgan', countrySearch: '44', country: '44', mobile: '7700900123', dob: '14-03-1990',
  current_address: '221 Park Avenue, Springfield', permanent_address: '18 Lake View Road, Springfield',
  photo: path.join(ROOT, 'vendor/sample/avatar-alex-morgan.png'),
};

const b = await session(9710, 1600, 900, 2);
console.log('login ->', await b.login());

// ---------- helpers ----------
const sleep = (ms) => b.sleep(ms);
const J = (v) => JSON.stringify(v);
async function clickAt(x, y) {
  await b.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  await b.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await b.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
}
async function clickSel(sel) {
  const r = JSON.parse(await b.ev(`(()=>{const e=document.querySelector(${J(sel)});if(!e)return 'null';const r=e.getBoundingClientRect();return JSON.stringify([r.x+r.width/2,r.y+r.height/2])})()`, 'null'));
  if (!r) throw new Error('not found: ' + sel);
  await clickAt(r[0], r[1]);
}
// Set a field like a user would: focus, value, input/keyup/change events.
const setField = (sel, value, { blur = false } = {}) => b.ev(`(()=>{
  const el = document.querySelector(${J(sel)}); if (!el) return 'missing';
  el.focus();
  const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${J(value)});
  ['input', 'keyup', 'change'].forEach(e => el.dispatchEvent(new Event(e, { bubbles: true })));
  ${blur ? "el.dispatchEvent(new Event('blur', { bubbles: true }));" : ''}
  return 'ok';
})()`);
async function setFile(sel, file) {
  const doc = await b.send('DOM.getDocument', {});
  const q = await b.send('DOM.querySelector', { nodeId: doc.result.root.nodeId, selector: sel });
  await b.send('DOM.setFileInputFiles', { nodeId: q.result.nodeId, files: [file] });
  await b.ev(`document.querySelector(${J(sel)}).dispatchEvent(new Event('change', { bubbles: true })); 1`);
}
// The profile form reloads the page 1.5 s after submitting; skip that timer so the toast can be captured.
const blockReload = () => b.ev(`(()=>{ if (window.__noReload) return 1; const st = window.setTimeout; window.setTimeout = (fn, ms, ...a) => (ms === 1500 ? 0 : st(fn, ms, ...a)); window.__noReload = 1; return 1; })()`);
const waitToast = async () => {
  for (let i = 0; i < 80; i++) { await sleep(100); if (await b.ev(`!!document.querySelector('.jq-toast-single')`, false)) break; }
  await sleep(700);   // let the slide-in finish
};
async function openProfileMenu() {
  await b.ev(`(()=>{document.getElementById('profileDropdown').click();return 1})()`);
  await sleep(900);
}

// Element rectangles (page coordinates) and text boxes used by the story for cursor targets and typing.
const rectsJs = `(()=>{
  const r = el => { if (!el) return null; const b = el.getBoundingClientRect(); if (!b.width && !b.height) return null; return [Math.round(b.x), Math.round(b.y + scrollY), Math.round(b.width), Math.round(b.height)]; };
  const byName = n => document.querySelector('[name="' + n + '"]:not([type=hidden]):not([type=file])');
  const cv = document.createElement('canvas').getContext('2d');
  const box = el => {
    if (!el) return null;
    const s = getComputedStyle(el), b = el.getBoundingClientRect();
    const px = v => parseFloat(v) || 0;
    const x = b.x + px(s.borderLeftWidth) + px(s.paddingLeft), y = b.y + scrollY + px(s.borderTopWidth);
    const w = b.width - px(s.borderLeftWidth) - px(s.borderRightWidth) - px(s.paddingLeft) - px(s.paddingRight);
    const h = el.tagName === 'TEXTAREA' ? px(s.paddingTop) + px(s.lineHeight || s.fontSize) * 1.25 : b.height - px(s.borderTopWidth) - px(s.borderBottomWidth);
    cv.font = s.font;
    const text = el.type === 'password' ? '\\u2022'.repeat(el.value.length) : el.value;
    return { r: [Math.round(x), Math.round(y), Math.round(w), Math.round(h)], textW: Math.round(cv.measureText(text).width), bg: s.backgroundColor, n: el.value.length };
  };
  const menu = document.querySelector('.nav-profile .dropdown-menu.show');
  const link = t => [...document.querySelectorAll('.nav-profile .dropdown-menu a')].find(a => a.textContent.trim().toLowerCase() === t);
  const card = document.querySelector('.content-wrapper .card');
  const opt44 = [...document.querySelectorAll('.custom-select-option')].find(o => o.dataset.value === '44' && o.offsetParent);
  const f = {};
  ['first_name', 'last_name', 'mobile', 'dob', 'email', 'current_address', 'permanent_address', 'old_password', 'new_password', 'confirm_password']
    .forEach(n => { const el = byName(n); if (el) { f[n] = r(el); f[n + '_box'] = box(el); } });
  return JSON.stringify({
    title: document.title,
    profile: r(document.getElementById('profileDropdown')),
    menu: r(menu), menuProfile: r(link('profile')), menuPassword: r(link('change password')),
    card: r(card), header: r(document.querySelector('.page-title, .content-wrapper h3')),
    ...f,
    countryTrigger: r(document.querySelector('.custom-select-trigger')),
    countryDropdown: r([...document.querySelectorAll('.custom-select-dropdown')].find(d => d.offsetParent)),
    countrySearch: box([...document.querySelectorAll('.custom-select-search-input')].find(i => i.offsetParent)),
    countryOption44: r(opt44),
    gender: r(document.querySelector('[name=gender]') && document.querySelector('[name=gender]').closest('.form-group, .col-sm-12, .col-md-4, div')),
    imageText: r(document.querySelector('.content-wrapper .file-upload-info')),
    uploadBtn: r(document.querySelector('.content-wrapper .file-upload-browse')),
    imagePreview: r(document.querySelector('.content-wrapper img')),
    datepicker: r([...document.querySelectorAll('.datepicker')].find(d => d.offsetParent)),
    twoFactor: (() => { const c = document.querySelector('#two_factor_verification'); if (!c) return null; const l = document.querySelector('label[for=two_factor_verification]') || c.parentElement; const a = c.getBoundingClientRect(), b = l.getBoundingClientRect(); const x0 = Math.min(a.x, b.x), y0 = Math.min(a.y, b.y); return [Math.round(x0), Math.round(y0 + scrollY), Math.round(Math.max(a.right, b.right) - x0), Math.round(Math.max(a.bottom, b.bottom) - y0)]; })(),
    submit: r(document.querySelector('.content-wrapper input[type=submit], .content-wrapper button[type=submit]')),
    oldStatus: r(document.getElementById('old_status')),
    toast: r(document.querySelector('.jq-toast-single')),
  });
})()`;

async function snap(name) {
  await b.ev(tidy);
  await sleep(500);
  const rects = JSON.parse(await b.ev(rectsJs, '{}'));
  const r = await b.send('Page.captureScreenshot', { format: 'png' }, 120000);
  fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(r.result.data, 'base64'));
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(rects));
  console.log('snap', name);
  return rects;
}
async function profilePage() {
  await b.go('auth/profile');
  await sleep(2500);
  await b.ev(tidy);
}

// ---------- 0. reset to the starting point ----------
await profilePage();
const beforePhoto = path.join(OUT, 'avatar-before.png');
if (!fs.existsSync(beforePhoto)) {
  // keep the account's original photo so later runs can restore it
  const data = await b.send('Runtime.evaluate', { expression: `(async()=>{const i=document.querySelector('.content-wrapper img');const r=await fetch(i.src);const bl=await r.blob();return await new Promise(res=>{const fr=new FileReader();fr.onload=()=>res(fr.result.split(',')[1]);fr.readAsDataURL(bl)})})()`, awaitPromise: true, returnByValue: true }, 60000);
  if (data.result?.result?.value) fs.writeFileSync(beforePhoto, Buffer.from(data.result.result.value, 'base64'));
}
for (const [k, v] of Object.entries(BEFORE)) {
  if (k === 'country') await b.ev(`(()=>{const s=document.querySelector('[name=country_code]');s.value=${J(v)};s.dispatchEvent(new Event('change',{bubbles:true}));return 1})()`);
  else await setField(`[name=${k}]`, v);
}
if (fs.existsSync(beforePhoto)) await setFile('input[type=file][name=image]', beforePhoto);
await blockReload();
await clickSel('.content-wrapper input[type=submit]');
await waitToast();
console.log('reset done');

// ---------- 1. dashboard: open the profile menu ----------
await b.go('dashboard'); await sleep(4000);
await snap('dash');
await openProfileMenu();
await snap('dash-menu');

// ---------- 2. profile form, one field at a time ----------
await profilePage();
await snap('form0');
await setField('[name=first_name]', AFTER.first_name); await snap('f-first');
await setField('[name=last_name]', AFTER.last_name); await snap('f-last');
await b.ev(`document.activeElement && document.activeElement.blur(); 1`);
await clickSel('.custom-select-trigger'); await sleep(600); await snap('f-country-open');
await setField('.custom-select-search-input', AFTER.countrySearch); await sleep(500); await snap('f-country-search');
await b.ev(`(()=>{const o=[...document.querySelectorAll('.custom-select-option')].find(o=>o.dataset.value===${J(AFTER.country)}&&o.offsetParent);o&&o.click();return o?1:0})()`);
await sleep(600); await snap('f-country');
await setField('[name=mobile]', AFTER.mobile); await snap('f-mobile');
await b.ev(`document.activeElement && document.activeElement.blur(); 1`);
await clickSel('[name=dob]'); await sleep(700); await snap('f-dob-open');
await setField('[name=dob]', AFTER.dob); await sleep(500); await snap('f-dob-typed');
await b.ev(`(()=>{try{$('[name=dob]').datepicker('hide')}catch(e){};document.activeElement&&document.activeElement.blur();return 1})()`);
await sleep(500); await snap('f-dob');
await setFile('input[type=file][name=image]', AFTER.photo); await sleep(500); await snap('f-image');
await setField('[name=current_address]', AFTER.current_address); await snap('f-addr1');
await setField('[name=permanent_address]', AFTER.permanent_address); await snap('f-addr2');
await b.ev(`document.activeElement && document.activeElement.blur(); 1`); await sleep(300);
await blockReload();
await clickSel('.content-wrapper input[type=submit]');
await waitToast();
await snap('f-toast');

// ---------- 3. saved: new name and photo in the top bar ----------
await profilePage(); await sleep(1500);
await snap('saved');
await openProfileMenu();
await snap('saved-menu');

// ---------- 4. change password (to the same value, so sign-in stays the same) ----------
await b.go('auth/change-password'); await sleep(2500);
await snap('pw0');
await setField('#old_password', PASSWORD, { blur: true });
for (let i = 0; i < 40; i++) { await sleep(200); if (await b.ev(`!!document.querySelector('#old_status .text-success')`, false)) break; }
await b.ev(`document.getElementById('old_password').focus(); 1`);
await snap('pw-old');
await setField('#new_password', PASSWORD); await snap('pw-new');
await setField('#confirm_password', PASSWORD); await snap('pw-confirm');
await b.ev(`document.activeElement && document.activeElement.blur(); 1`);
await clickSel('.password_form input[type=submit]');
await waitToast();
await snap('pw-toast');

b.close();
process.exit(0);
