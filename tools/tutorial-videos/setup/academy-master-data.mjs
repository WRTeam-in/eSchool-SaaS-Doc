// One-time prerequisite for the Manage schools video's Academy Setup Wizard part:
// adds the Super Admin's Academy master data (Settings > Academy setup) that the wizard offers to schools.
// Safe to run again: records that already exist (same name) are skipped.
// Run: node tools/tutorial-videos/setup/academy-master-data.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { session } from '../lib/session.mjs';
import { kit, J } from '../lib/capture-kit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const MASTER = {
  Mediums: ['English', 'Hindi'],
  Sections: ['A', 'B', 'C'],
  Streams: ['Science', 'Commerce', 'Arts'],
  Classes: Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`),
  Subjects: [
    ['English', 'ENG', '#3b82f6', 'Theory', 'english'], ['Mathematics', 'MATH', '#f59e0b', 'Theory', 'mathematics'],
    ['Science', 'SCI', '#10b981', 'Theory', 'science'], ['Social Studies', 'SST', '#8b5cf6', 'Theory', 'social-studies'],
    ['Hindi', 'HIN', '#ef4444', 'Theory', 'hindi'], ['Computer Science', 'CS', '#0ea5e9', 'Practical', 'computer-science'],
    ['Physics', 'PHY', '#6366f1', 'Theory', 'physics'], ['Chemistry', 'CHEM', '#14b8a6', 'Practical', 'chemistry'],
    ['Biology', 'BIO', '#22c55e', 'Practical', 'biology'], ['Accountancy', 'ACC', '#f97316', 'Theory', 'accountancy'],
    ['Economics', 'ECO', '#eab308', 'Theory', 'economics'], ['History', 'HIST', '#a855f7', 'Theory', 'history'],
  ],
};

const b = await session(9820, 1600, 900, 1);
console.log('login ->', await b.login());
const K = kit(b, { out: path.join(ROOT, 'out/setup') });
const { sleep, ev, setField, setFile, waitFor, waitToast, clearToasts } = K;

async function mouseClick(expr) {
  const p = JSON.parse(await ev(`(()=>{const e=${expr};if(!e)return 'null';e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return JSON.stringify([r.x+r.width/2,r.y+r.height/2])})()`, 'null'));
  if (!p) throw new Error('not found: ' + expr.slice(0, 80));
  await sleep(200); await K.clickAt(p[0], p[1]);
}
const openTab = async (tab) => {
  await mouseClick(`[...document.querySelectorAll('.content-wrapper .nav-link')].find(t=>t.innerText.trim().startsWith(${J(tab)}))`);
  await waitFor(`/${tab.slice(0, -1).toLowerCase()}/i.test(document.getElementById('addNewBtn').innerText)`, 8000);
  await sleep(1500);
};
const existing = (tab) => ev(`(()=>{const p=document.querySelector('.tab-pane.active');return JSON.stringify([...p.querySelectorAll('tbody tr')].map(r=>(r.children[1]||{}).innerText?.trim()).filter(Boolean))})()`, '[]').then(JSON.parse);

await b.go('academy-setup'); await sleep(2500);
for (const [tab, items] of Object.entries(MASTER)) {
  await openTab(tab);
  const have = new Set(await existing(tab));
  for (const it of items) {
    const [name, code, color, type, icon] = Array.isArray(it) ? it : [it];
    if (have.has(name)) { console.log(`${tab}: ${name} exists`); continue; }
    await mouseClick(`document.getElementById('addNewBtn')`);
    await waitFor(`document.querySelector('#academyModal.show')`, 6000); await sleep(500);
    await setField('#academyModal [name=name]', name);
    if (code) await setField('#academyModal [name=code]', code);
    if (color) await ev(`(()=>{const i=document.querySelector('#academyModal [name=bg_color]');i.value=${J(color)};['input','change','keyup'].forEach(e=>i.dispatchEvent(new Event(e,{bubbles:true})));try{$(i).minicolors&&$(i).minicolors('value',${J(color)})}catch(e){}try{$(i).spectrum&&$(i).spectrum('set',${J(color)})}catch(e){}return 1})()`);
    if (icon) await setFile('#academyModal input[type=file][name=image]', path.join(ROOT, 'vendor/sample/subjects', icon + '.png'));
    if (type) await ev(`(()=>{const s=document.querySelector('#academyModal [name=subject_type]');s.value=${J(type)};s.dispatchEvent(new Event('change',{bubbles:true}));return 1})()`);
    await clearToasts();
    await mouseClick(`[...document.querySelectorAll('#academyModal button, #academyModal input[type=submit]')].find(x=>/save/i.test(x.innerText||x.value))`);
    await waitToast();
    const msg = (await ev(`(document.querySelector('.jq-toast-single')||{}).innerText||''`, '')).replace(/\s+/g, ' ').replace('×', '').trim();
    console.log(`${tab}: ${name} -> ${msg}`);
    await waitFor(`!document.querySelector('#academyModal.show')`, 5000); await sleep(600);
  }
}
await b.go('academy-setup'); await sleep(2500);
console.log('counts:', await ev(`[...document.querySelectorAll('.content-wrapper .nav-link')].map(t=>t.innerText.trim().replace(/\\s+/g,' ')).join(' | ')`, ''));
b.close();
process.exit(0);
