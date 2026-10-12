// Minimal Chrome DevTools Protocol driver (headless Chrome, no Puppeteer needed).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Set CHROME_PATH on Windows/Linux, e.g. "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" or "google-chrome".
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export async function launch(port, w = 1440, h = 900, scale = 2) {
  const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(os.tmpdir(), `tutorial-videos-chrome-${port}`)}`, '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', `--window-size=${w},${h}`, 'about:blank'], { stdio: 'ignore' });
  let targets;
  for (let i = 0; i < 100; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      if (targets.find(t => t.type === 'page')) break;
    } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
  if (!targets || !targets.find(t => t.type === 'page')) { proc.kill(); throw new Error(`Chrome did not start on port ${port}`); }
  const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  const opened = await Promise.race([new Promise(r => ws.addEventListener('open', () => r(true))), new Promise(r => setTimeout(() => r(false), 20000))]);
  if (!opened) { proc.kill(); throw new Error(`Could not connect to Chrome on port ${port} (is another Chrome using it?)`); }
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  });
  const send = (method, params = {}, ms = 30000) => new Promise(r => {
    const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params }));
    setTimeout(() => { if (pending.has(i)) { pending.delete(i); r({ result: { timeout: true } }); } }, ms);
  });
  const evaluate = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 600));
    return r.result?.result?.value;
  };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const shot = async (file, opts = {}) => {
    const p = { format: opts.format || 'png' };
    if (opts.quality) p.quality = opts.quality;
    if (opts.clip) { p.clip = { ...opts.clip, scale: 1 }; p.captureBeyondViewport = true; }
    const r = await send('Page.captureScreenshot', p);
    fs.writeFileSync(file, Buffer.from(r.result.data, 'base64'));
  };
  const viewport = (width, height, deviceScaleFactor = scale) =>
    send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor, mobile: false });
  await send('Page.enable');
  await send('Runtime.enable');
  await viewport(w, h);
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
  return { send, evaluate, sleep, shot, viewport, close: () => { ws.close(); proc.kill(); } };
}
