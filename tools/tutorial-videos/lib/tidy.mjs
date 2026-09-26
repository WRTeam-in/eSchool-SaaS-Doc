// Capture-time cleanup, applied only inside the recording browser (nothing on the server changes):
//  - hides the Laravel debug bar that dev servers show
//  - shows the stock eSchool SaaS logo and name instead of the server's custom branding
//  - aligns navbar dropdowns to the right edge so they are not cut off at 1600 px
//  - shows "303.3087 Days left" as "303 Days left" (display bug on the dev server, reported separately)
//  - replaces the recording server's host name with "yourdomain.com" (videos never show a real URL)
import fs from 'node:fs';
import path from 'node:path';

export function tidyScript(toolRoot, { host = process.env.TUTORIAL_URL ? new URL(process.env.TUTORIAL_URL).host : '' } = {}) {
  const svg = (f) => 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(toolRoot, 'vendor/brand', f)).toString('base64');
  const logoH = svg('logo-horizontal.svg');
  const logoM = svg('logo-mini.svg');
  return `(()=>{
    if (!document.getElementById('tut-style')) {
      const st = document.createElement('style'); st.id = 'tut-style';
      st.textContent = '.phpdebugbar{display:none!important} body{padding-bottom:0!important} ::-webkit-scrollbar{display:none}'
        + ' .navbar .dropdown-menu.show{left:auto!important;right:8px!important}';
      document.head.appendChild(st);
    }
    document.querySelectorAll('.navbar-brand.brand-logo img').forEach(i => { i.src = ${JSON.stringify(logoH)}; i.style.height = '46px'; i.style.width = 'auto'; });
    document.querySelectorAll('.navbar-brand.brand-logo-mini img').forEach(i => { i.src = ${JSON.stringify(logoM)}; });
    // The system name is the part of the title after "||", e.g. "Dashboard || My Brand".
    const name = (window.__tutName = window.__tutName || (document.title.split('||')[1] || '').trim());
    const esc = s => s.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
    const re = name && name.toLowerCase() !== 'eschool saas' ? new RegExp(esc(name), 'gi') : null;
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode());) {
      let t = n.nodeValue, u = t.replace(/(\\d+)\\.\\d+(\\s*Days left)/gi, '$1$2');
      if (re) u = u.replace(re, 'eSchool SaaS');
      if (u !== t) n.nodeValue = u;
    }
    if (re) document.title = document.title.replace(re, 'eSchool SaaS');
    // never show the recording server's address: text such as ".dev-server.example.net" becomes ".yourdomain.com"
    const host = ${JSON.stringify(host)};
    if (host) {
      const w2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n; (n = w2.nextNode());) if (n.nodeValue.includes(host)) n.nodeValue = n.nodeValue.split(host).join('yourdomain.com');
      document.querySelectorAll('input').forEach(i => { if (i.value && i.value.includes(host)) i.value = i.value.split(host).join('yourdomain.com'); });
    }
    return 1;
  })()`;
}
