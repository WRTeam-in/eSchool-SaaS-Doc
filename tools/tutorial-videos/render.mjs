// Render a tutorial story.
//   node tools/tutorial-videos/render.mjs <id> preview 5 30 61.5   stills -> tools/tutorial-videos/out/<id>-<t>.jpg
//   node tools/tutorial-videos/render.mjs <id> publish [qp]        video, poster and chapters -> docs
// publish writes:
//   static/video/tutorials/<id>.mp4
//   static/images/tutorials/<id>.jpg
//   src/data/tutorials/chapters/<id>.json   ({ duration, chapters } used by the Tutorials pages)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './lib/cdp.mjs';
import { startServer } from './lib/server.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.resolve(ROOT, '../..');
const [id, mode = 'preview', ...rest] = process.argv.slice(2);
if (!id || !fs.existsSync(path.join(ROOT, 'stories', `${id}.js`))) {
  console.error(`Usage: node render.mjs <story-id> preview|publish ...  (stories: ${fs.readdirSync(path.join(ROOT, 'stories')).map((f) => f.replace(/\.js$/, '')).join(', ')})`);
  process.exit(1);
}
fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });

const server = await startServer(ROOT);
const b = await launch(9620, 1920, 1080, 1);
const evalAsync = async (expression, ms = 1800000) => {
  const r = await b.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, ms);
  if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 500));
  return r.result?.result?.value;
};

try {
  b.send('Page.navigate', { url: `http://127.0.0.1:${server.port}/tutorial.html?story=${id}` });
  await b.sleep(1500);
  const info = await evalAsync('window.ready', 180000);
  console.log(`${id}: ${info.duration}s, ${info.chapters.length} chapters`);
  console.log('  ' + info.chapters.map((c) => `${c.t}s ${c.label}`).join(' | '));

  if (mode === 'preview') {
    for (const t of rest.map(Number)) {
      await b.evaluate(`renderAt(${t}); 1`);
      const file = path.join(ROOT, 'out', `${id}-${t.toFixed(1)}.jpg`);
      await b.shot(file, { format: 'jpeg', quality: 85 });
      console.log('  ', path.relative(DOCS, file));
    }
  } else if (mode === 'publish') {
    const qp = Number(rest[0] || 25);
    const t0 = Date.now();
    await evalAsync(`encodeVideo({ name: '${id}.mp4', qp: ${qp} })`);
    await evalAsync(`savePoster({ name: '${id}.jpg', t: window.STORY.posterAt })`);
    const targets = [
      [path.join(ROOT, 'out', `${id}.mp4`), path.join(DOCS, 'static/video/tutorials', `${id}.mp4`)],
      [path.join(ROOT, 'out', `${id}.jpg`), path.join(DOCS, 'static/images/tutorials', `${id}.jpg`)],
    ];
    for (const [from, to] of targets) { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); }
    const chapters = path.join(DOCS, 'src/data/tutorials/chapters', `${id}.json`);
    fs.mkdirSync(path.dirname(chapters), { recursive: true });
    fs.writeFileSync(chapters, JSON.stringify(info, null, 2) + '\n');
    for (const [, to] of targets) console.log('  ', path.relative(DOCS, to), (fs.statSync(to).size / 1e6).toFixed(1), 'MB');
    console.log('  ', path.relative(DOCS, chapters));
    console.log(`done in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  } else {
    throw new Error(`Unknown mode "${mode}" (use preview or publish)`);
  }
} finally {
  b.close();
  server.close();
}
process.exit(0);
