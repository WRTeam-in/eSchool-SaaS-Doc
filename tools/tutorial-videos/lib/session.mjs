// Launch Chrome and sign in to the admin panel used for recording.
// Credentials come from the environment and are never stored in the repo:
//   TUTORIAL_URL       e.g. https://your-dev-server.example.com
//   TUTORIAL_EMAIL     Super Admin email
//   TUTORIAL_PASSWORD  Super Admin password
import { launch } from './cdp.mjs';

export function panelUrl() {
  const url = process.env.TUTORIAL_URL;
  if (!url) throw new Error('Set TUTORIAL_URL (and TUTORIAL_EMAIL / TUTORIAL_PASSWORD) before capturing.');
  return url.replace(/\/+$/, '') + '/';
}

export async function session(port, w = 1600, h = 900, dpr = 2) {
  const base = panelUrl();
  const b = await launch(port, w, h, dpr);
  const ev = async (expr, fallback) => {
    try { const v = await b.evaluate(expr); return v === undefined ? fallback : v; } catch { return fallback; }
  };
  b.ev = ev;
  // Navigate and wait until the admin layout is on screen (the dev server can be slow).
  b.go = async (path, readyExpr = `!!document.querySelector('.content-wrapper, .main-panel')`, maxS = 45) => {
    b.send('Page.navigate', { url: base + path });
    for (let i = 0; i < maxS; i++) { await b.sleep(1000); if (await ev(readyExpr, false)) return i; }
    return -1;
  };
  b.login = async (email = process.env.TUTORIAL_EMAIL, pass = process.env.TUTORIAL_PASSWORD) => {
    if (!email || !pass) throw new Error('Set TUTORIAL_EMAIL and TUTORIAL_PASSWORD.');
    await b.go('login', `!!document.getElementById('email')`);
    // Submit on a timer: an evaluate that triggers navigation would never return.
    await ev(`(()=>{document.getElementById('email').value=${JSON.stringify(email)};document.getElementById('password').value=${JSON.stringify(pass)};setTimeout(()=>document.getElementById('loginForm').submit(),50);return 1})()`);
    for (let i = 0; i < 40; i++) {
      await b.sleep(1000);
      const p = await ev('location.pathname', '/login');
      if (!p.includes('login') && await ev(`!!document.querySelector('.content-wrapper, .main-panel')`, false)) return p;
    }
    throw new Error('Login failed: ' + await ev('document.body.innerText.slice(0,300)', ''));
  };
  return b;
}
