// Captures every UI state the Super Admin Dashboard tutorial needs.
// Each state is a full-height screenshot (1600 CSS px wide, DPR 2) plus element rects in page coordinates,
// saved to cache/superadmin-dashboard/. Run: node tools/tutorial-videos/captures/superadmin-dashboard.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { session } from '../lib/session.mjs';
import { tidyScript } from '../lib/tidy.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'cache/superadmin-dashboard');
fs.mkdirSync(OUT, { recursive: true });
const tidy = tidyScript(ROOT);

const b = await session(9610, 1600, 900, 2);
console.log('login ->', await b.login());

const rectsJs = `(()=>{
  const r = el => { if (!el) return null; const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y + scrollY), Math.round(b.width), Math.round(b.height)]; };
  const cards = [...document.querySelectorAll('.content-wrapper .card')];
  const card = t => cards.find(c => c.innerText.trim().toLowerCase().startsWith(t.toLowerCase()));
  const tx = card('Transaction'), tp = card('Trending'), ex = card('Expiring'), rs = card('Recent'), ad = card('Addon');
  const bars = tx ? [...tx.querySelectorAll('.apexcharts-bar-area')] : [];
  const slices = tp ? [...tp.querySelectorAll('.apexcharts-pie-area')] : [];
  const link = (c, t) => c ? [...c.querySelectorAll('a')].find(a => a.textContent.trim().toLowerCase() === t) : null;
  return JSON.stringify({
    H: document.documentElement.scrollHeight,
    title: r(document.querySelector('.page-header, .page-title')),
    kpi: ['Total schools', 'Active plans', 'Monthly revenue', 'Active packages'].map(t => r(card(t))),
    tx: r(tx), txYear: r(document.getElementById('year')), txMenu: r(tx && tx.querySelector('.apexcharts-menu-icon')),
    bars: bars.map(r), tp: r(tp), slices: slices.map(r), tpLegend: r(tp && tp.querySelector('.apexcharts-legend')),
    ex: r(ex), exViewAll: r(link(ex, 'view all')), exRows: ex ? [...ex.querySelectorAll('.list-group-item, li, .d-flex.align-items-center')].slice(0, 3).map(r) : [],
    rs: r(rs), rsViewAll: r(link(rs, 'view all')), ad: r(ad),
    toggler: r(document.querySelector('.navbar .navbar-toggler.align-self-center, .navbar .navbar-toggler')),
    theme: r(document.querySelector('.navbar .theme-toggle, #theme-toggle, .theme-toggle')),
    lang: r([...document.querySelectorAll('.navbar a')].find(a => a.textContent.trim() === 'EN')),
    profile: r([...document.querySelectorAll('.navbar a')].find(a => a.textContent.trim() === 'super')),
    profileMenu: r(document.querySelector('.navbar .dropdown-menu.show')),
    search: r(document.querySelector('.sidebar input')),
    menu: [...document.querySelectorAll('.sidebar .nav > .nav-item')].slice(0, 12).map(li => [li.innerText.trim().split('\\n')[0], r(li)]),
  });
})()`;

async function prepare() {
  await b.viewport(1600, 900, 2);
  await b.go('dashboard');
  await b.sleep(5000);
  await b.ev(tidy);
  const H = await b.ev('document.documentElement.scrollHeight', 1955);
  await b.viewport(1600, H, 2);
  await b.sleep(3500);          // charts re-render after the resize
  await b.ev(tidy);
  return H;
}
async function snap(name) {
  await b.ev(tidy);
  await b.sleep(700);
  const rects = JSON.parse(await b.ev(rectsJs, '{}'));
  const r = await b.send('Page.captureScreenshot', { format: 'png' }, 120000);
  fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(r.result.data, 'base64'));
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(rects));
  console.log(name, 'H', rects.H, 'bars', rects.bars?.length, 'slices', rects.slices?.length);
  return rects;
}
const move = (x, y) => b.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
const center = r => [r[0] + r[2] / 2, r[1] + r[3] / 2];

await prepare();
const base = await snap('base');

// hover the May bar (index 4) for its tooltip
if (base.bars[4]) {
  const [x, y] = center(base.bars[4]);
  await move(x, base.bars[4][1] + 20); await b.sleep(900);
  await snap('hover-bar');
  await move(5, 5); await b.sleep(400);
}
// chart download menu
await b.ev(`(()=>{const m=[...document.querySelectorAll('.content-wrapper .card')].find(c=>c.innerText.trim().startsWith('Transaction')).querySelector('.apexcharts-menu-icon');m&&m.click();return 1})()`);
await b.sleep(800);
await snap('chart-menu');
await b.ev(`(()=>{document.querySelectorAll('.apexcharts-menu.apexcharts-menu-open').forEach(m=>m.classList.remove('apexcharts-menu-open'));return 1})()`); await b.sleep(500);
// hover the largest donut slice
if (base.slices.length) {
  // point on the ring (between inner and outer radius), right-hand side = the largest slice
  const ring = JSON.parse(await b.ev(`(()=>{const c=[...document.querySelectorAll('.content-wrapper .card')].find(c=>c.innerText.trim().startsWith('Trending'));const p=c.querySelector('.apexcharts-pie');const r=p.getBoundingClientRect();return JSON.stringify([r.x+r.width/2,r.y+r.height/2,r.width/2])})()`, '[0,0,0]'));
  await move(ring[0] + ring[2] * 0.83, ring[1] + ring[2] * 0.12); await b.sleep(1000);
  await snap('hover-donut');
  await move(5, 5); await b.sleep(400);
}
// profile dropdown
await b.ev(`(()=>{const a=[...document.querySelectorAll('.navbar a')].find(a=>a.textContent.trim()==='super');a&&a.click();return 1})()`);
await b.sleep(900);
await snap('profile-open');
await b.ev(`document.body.click(); 1`); await b.sleep(500);
// sidebar search
await b.ev(`(()=>{const i=document.querySelector('.sidebar input');i.focus();i.value='pack';['input','keyup','change'].forEach(e=>i.dispatchEvent(new Event(e,{bubbles:true})));return 1})()`);
await b.sleep(900);
await snap('search');
await b.ev(`(()=>{const i=document.querySelector('.sidebar input');i.value='';['input','keyup','change'].forEach(e=>i.dispatchEvent(new Event(e,{bubbles:true})));i.blur();return 1})()`);
await b.sleep(500);
// collapsed sidebar
await b.ev(`(()=>{document.querySelector('.navbar .navbar-toggler').click();return 1})()`);
await b.sleep(1200);
await snap('collapsed');
await b.ev(`(()=>{document.querySelector('.navbar .navbar-toggler').click();return 1})()`);
await b.sleep(1200);
// dark theme (toggle, capture, toggle back)
await b.ev(`(()=>{const t=document.querySelector('.theme-toggle');t&&t.click();return 1})()`);
await b.sleep(2500);
await snap('dark');
await b.ev(`(()=>{const t=document.querySelector('.theme-toggle');t&&t.click();return 1})()`);
await b.sleep(1500);
console.log('theme after reset:', await b.ev(`document.documentElement.getAttribute('data-theme') || document.body.className`, ''));
b.close(); process.exit(0);
