// Checks that every click in a story gets an immediate response. Usage: node tools/tutorial-videos/lib/latency.mjs <story-id> ...
// For every click in a story: seconds until the screen starts to change, and how long that change fades.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './cdp.mjs';
import { startServer } from './server.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = await startServer(ROOT);
const b = await launch(9760, 1920, 1080, 1);
for (const id of process.argv.slice(2)) {
  b.send('Page.navigate', { url: `http://127.0.0.1:${server.port}/tutorial.html?story=${id}` });
  await b.sleep(1500);
  const r = await b.send('Runtime.evaluate', { expression: `window.ready.then(()=>JSON.stringify({clicks: TL.clicks.map(c=>c.t), states: TL.state.map(s=>[s.t, s.s, s.f||0]), subs: TL.subs.map(s=>[s.t0,s.text.slice(0,40)])}))`, awaitPromise: true, returnByValue: true }, 120000);
  const { clicks, states, subs } = JSON.parse(r.result.result.value);
  const rows = clicks.map(c => {
    const nx = states.find(s => s[0] >= c - 0.001);
    const gap = nx ? nx[0] - c : null;
    const sub = [...subs].reverse().find(s => s[0] <= c + 0.01);
    return { c, gap, fade: nx ? nx[2] : 0, to: nx ? nx[1] : '-', sub: sub ? sub[1] : '' };
  });
  const slow = rows.filter(x => x.gap === null || x.gap > 0.3);
  console.log(`\n${id}: ${clicks.length} clicks, ${slow.length} with a delay > 0.3 s; worst ${Math.max(...rows.map(x => x.gap ?? 99)).toFixed(2)} s`);
  for (const x of rows) if (x.gap === null || x.gap > 0.3 || x.fade > 0.2) console.log(`  ${x.c.toFixed(1)}s  delay ${x.gap === null ? 'none' : x.gap.toFixed(2)}  fade ${x.fade}  -> ${x.to}   "${x.sub}"`);
}
b.close(); server.close(); process.exit(0);
