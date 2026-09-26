// Tiny static server for the render page. PUT requests save files under out/.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4',
};

export function startServer(root) {
  const outDir = path.join(root, 'out');
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(root, rel);
    if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    if (req.method === 'PUT') {
      if (!file.startsWith(outDir)) { res.writeHead(403); res.end(); return; }
      fs.mkdirSync(path.dirname(file), { recursive: true });
      const ws = fs.createWriteStream(file);
      req.pipe(ws);
      ws.on('finish', () => { res.writeHead(200); res.end(String(fs.statSync(file).size)); });
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ port: server.address().port, close: () => server.close() })));
}
