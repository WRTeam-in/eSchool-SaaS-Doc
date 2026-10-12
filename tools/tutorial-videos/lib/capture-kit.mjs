// Shared helpers for capture scripts: realistic input, waits for the panel's widgets, and snapshots with
// element rectangles. New capture scripts should use this kit; older scripts keep their own copies.
import fs from 'node:fs';
import path from 'node:path';

export const J = (v) => JSON.stringify(v);

// Browser-side helpers injected into every rect query: r(el) -> [x, y, w, h] in page coordinates,
// box(el) -> the text area of an input for the typing animation.
const RECT_HELPERS = `
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
    const shown = el.type === 'password' ? '\\u2022'.repeat((el.value || '').length) : (el.value || '');
    return { r: [Math.round(x), Math.round(y), Math.round(w), Math.round(h)], textW: Math.round(cv.measureText(shown).width), bg: s.backgroundColor, n: (el.value || '').length };
  };
  const row = re => [...document.querySelectorAll('.bootstrap-table tbody tr')].find(tr => re.test(tr.innerText));
`;

export function kit(b, { out, tidy = [] }) {
  fs.mkdirSync(out, { recursive: true });
  const sleep = (ms) => b.sleep(ms);
  const ev = b.ev;
  const runTidy = async () => { for (const t of tidy) await ev(typeof t === 'function' ? t() : t); };

  async function clickAt(x, y) {
    await b.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await b.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
    await b.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  }
  // expr may use the same helpers as targets (q, row, ...)
  const jsClick = async (expr) => {
    const res = await ev(`(()=>{ ${RECT_HELPERS} const e=${expr};if(!e)return 0;e.click();return 1})()`, 'error');
    if (res !== 1) console.log('jsClick: nothing clicked for', expr.slice(0, 90));
    return res === 1 ? 1 : 0;
  };
  // Real keystrokes (Input.insertText): some forms don't save values that were only set from script.
  async function setField(sel, value) {
    const ok = await ev(`(()=>{
      const el = [...document.querySelectorAll(${J(sel)})].find(e => !e.disabled && e.offsetParent); if (!el) return 'missing';
      el.focus();
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, '');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      return 'ok';
    })()`, 'missing');
    if (ok !== 'ok') { console.log('setField: not found', sel); return ok; }
    await b.send('Input.insertText', { text: value });
    await ev(`(()=>{const el=document.activeElement;['keyup','change'].forEach(e=>el.dispatchEvent(new Event(e,{bubbles:true})));return 1})()`);
    return 'ok';
  }
  async function setFile(sel, file) {
    const doc = await b.send('DOM.getDocument', {});
    const n = await b.send('DOM.querySelector', { nodeId: doc.result.root.nodeId, selector: sel });
    await b.send('DOM.setFileInputFiles', { nodeId: n.result.nodeId, files: [file] });
    await ev(`document.querySelector(${J(sel)}).dispatchEvent(new Event('change', { bubbles: true })); 1`);
  }
  // Pick an option in the panel's searchable country picker (custom-search-select) inside `scope`.
  async function pickCountry(scope, search, value, snaps = {}) {
    await jsClick(`document.querySelector(${J(scope + ' .custom-select-trigger')})`); await sleep(500);
    if (snaps.open) await snap(snaps.open, snaps.opts);
    await setField(`${scope} .custom-select-search-input`, search); await sleep(400);
    if (snaps.search) await snap(snaps.search, snaps.opts);
    await jsClick(`[...document.querySelectorAll(${J(scope + ' .custom-select-option')})].find(o=>o.dataset.value===${J(value)}&&o.offsetParent)`);
    await sleep(400);
  }
  const blur = () => ev(`document.activeElement && document.activeElement.blur(); 1`);
  async function waitFor(expr, ms = 20000, step = 150) {
    for (let i = 0; i < ms / step; i++) { if (await ev(`!!(${expr})`, false)) return true; await sleep(step); }
    return false;
  }
  const waitTable = async (re = null) => {
    await waitFor(`(()=>{const rows=[...document.querySelectorAll('.bootstrap-table tbody tr')];if(!rows.length||document.querySelector('.fixed-table-loading.open'))return false;${re ? `return rows.some(r=>${re}.test(r.innerText));` : 'return true;'}})()`, 30000, 400);
    await sleep(700);
  };
  const waitToast = async () => { await waitFor(`document.querySelector('.jq-toast-single')`, 15000, 100); await sleep(700); };
  const waitSwal = async () => { await waitFor(`document.querySelector('.swal2-popup')`, 6000, 100); await sleep(450); };
  const waitModal = async () => { await waitFor(`document.querySelector('.modal.show')`, 6000, 150); await sleep(700); };
  const clearToasts = () => ev(`document.querySelectorAll('.jq-toast-wrap').forEach(t=>t.remove()); 1`);
  // Close dropdowns through Bootstrap so the page's own handlers run; remove row menus left in <body>.
  const closeMenus = async () => {
    await ev(`(()=>{document.querySelectorAll('[data-bs-toggle=dropdown][aria-expanded=true], [data-toggle=dropdown][aria-expanded=true]').forEach(t=>{try{bootstrap.Dropdown.getOrCreateInstance(t).hide()}catch(e){}});return 1})()`);
    await sleep(400);
    await ev(`(()=>{document.querySelectorAll('body > .action-column-dropdown-menu').forEach(m=>m.remove());return 1})()`);
  };
  const scrollToEl = async (expr, offset = 90) => { await ev(`(()=>{const e=${expr};if(e)scrollTo(0, Math.max(0, e.getBoundingClientRect().top + scrollY - ${offset}));return 1})()`); await sleep(450); };

  // targets: { key: 'js expression returning an element' | { raw: 'js expression returning any JSON value' } },
// boxes: { key: 'js expression returning an input' }
  let targets = {}, boxes = {};
  const setTargets = (t, bx = {}) => { targets = t; boxes = bx; };
  const rectsJs = () => `(()=>{ ${RECT_HELPERS}
    const out = { vp: Math.round(scrollY), H: document.documentElement.scrollHeight };
    ${Object.entries(targets).map(([k, e]) => typeof e === 'object' ? `try { out[${J(k)}] = (${e.raw}); } catch (x) { out[${J(k)}] = null; }` : `try { out[${J(k)}] = r(${e}); } catch (x) { out[${J(k)}] = null; }`).join('\n')}
    ${Object.entries(boxes).map(([k, e]) => `try { out[${J(k)}] = box(${e}); } catch (x) { out[${J(k)}] = null; }`).join('\n')}
    return JSON.stringify(out);
  })()`;
  // viewport: capture only the visible window (dialogs, toasts, the public website);
  // otherwise capture the whole page height (the engine scrolls it, keeping the navbar and sidebar fixed).
  async function snap(name, { viewport = false } = {}) {
    await runTidy(); await sleep(300);
    let rects;
    if (!viewport) {
      const scroll = await ev('scrollY', 0);
      const H = await ev('document.documentElement.scrollHeight', 1900);
      await b.viewport(1600, H, 2); await sleep(900);
      await runTidy(); await ev(`scrollTo(0, 0); 1`); await sleep(200);   // a focused field can keep the page scrolled
      rects = JSON.parse(await ev(rectsJs(), '{}'));
      rects.H = H;                       // the screenshot's height (the page can grow a little after the resize)
      const shot = await b.send('Page.captureScreenshot', { format: 'png' }, 120000);
      fs.writeFileSync(path.join(out, `${name}.png`), Buffer.from(shot.result.data, 'base64'));
      await b.viewport(1600, 900, 2); await sleep(400);
      await ev(`scrollTo(0, ${scroll}); 1`);
    } else {
      rects = JSON.parse(await ev(rectsJs(), '{}'));
      const shot = await b.send('Page.captureScreenshot', { format: 'png' }, 120000);
      fs.writeFileSync(path.join(out, `${name}.png`), Buffer.from(shot.result.data, 'base64'));
    }
    fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify({ ...rects, viewport }));
    console.log('snap', name, viewport ? `(window @${rects.vp})` : '');
    return rects;
  }

  return { sleep, ev, clickAt, jsClick, setField, setFile, pickCountry, blur, waitFor, waitTable, waitToast, waitSwal, waitModal, clearToasts, closeMenus, scrollToEl, setTargets, snap, runTidy };
}
