// Super Admin > Schools > School inquiries: the School inquiry setting, and what "Start trial" on the website
// does when it's ON (inquiry -> approve / reject) and OFF (the school is created straight away).
// Positions come from the capture (cache/superadmin-school-inquiries/*.json).
window.buildStory = async () => {
  const dir = 'cache/superadmin-school-inquiries';
  const names = ['s-on', 's-on2', 's-off', 's-off-toast',
    'w-home', 'w-form', 'w-name', 'w-email', 'w-cc-open', 'w-cc-search', 'w-cc', 'w-phone', 'w-address', 'w-tagline', 'w-wait', 'w-toast-on',
    'i-list', 'i-view', 'i-approved', 'i-approve-toast', 'i-after-approve', 'i-view2', 'i-rejected', 'i-reject-toast', 'i-after-reject',
    'm-approved', 'w2-home', 'w2-form', 'w2-name', 'w2-filled', 'w2-wait', 'w2-toast', 'm-direct', 'i-none'];
  const R = {};
  for (const n of names) R[n] = await (await fetch(`${dir}/${n}.json`)).json();
  const mid = r => [r[0] + r[2] / 2, r[1] + r[3] / 2];
  const union = (...rs) => {
    rs = rs.filter(Boolean);
    const x0 = Math.min(...rs.map(r => r[0])), y0 = Math.min(...rs.map(r => r[1]));
    const x1 = Math.max(...rs.map(r => r[0] + r[2])), y1 = Math.max(...rs.map(r => r[1] + r[3]));
    return [x0, y0, x1 - x0, y1 - y0];
  };
  const pad = (r, p) => [r[0] - p, r[1] - p, r[2] + 2 * p, r[3] + 2 * p];
  const S = R['s-on'], W = R['w-form'], I = R['i-list'], V = R['i-view'], V2 = R['i-view2'];
  const settingsScroll = Math.max(0, S.H - 900);                 // policy cards sit at the bottom of the page
  const listTop = (x, card) => Math.min(Math.max(0, card[1] - 80), x.H - 900);
  const topRight = (vp) => [1080, vp, 520, 280];                   // where toasts appear

  return {
    id: 'superadmin-school-inquiries',
    overline: 'SUPER ADMIN  ·  TUTORIAL 04',
    title: 'School inquiries',
    subtitle: 'Decide how new schools join from your website',
    learn: ['Turn School inquiry on or off', 'ON: trial requests wait for your approval', 'Approve or reject an inquiry', 'OFF: the school is created straight away'],
    doneTitle: 'You’re ready for new schools',
    recap: ['School inquiry ON: you approve or reject each request', 'School inquiry OFF: schools are created straight away', 'Switch it any time in General settings'],
    next: 'Role & permission',
    posterAt: 4.2,
    previewState: 'w-tagline',
    layout: { side: 280, top: 70, dpr: 2 },
    states: Object.fromEntries(names.map(n => [n, R[n].viewport ? { src: `${dir}/${n}.png`, viewport: true } : `${dir}/${n}.png`])),
    steps: [
      // ---------- the setting ----------
      { chapter: 'The School inquiry setting', state: 's-on', cam: 'full', hl: S.navGeneral, hlFixed: true,
        text: 'School inquiry is a setting. Go to Settings › System settings › General settings.',
        actions: [{ at: 0.9, to: mid(S.navGeneral), fixed: true }] },
      { cam: union(S.tabSecurity, [S.tabSecurity[0] - 330, S.tabSecurity[1] - 70, 10, 10]), zoomMax: 1.8, hl: S.tabSecurity, dur: 3.8,
        text: 'The switch is on the Security & Server tab.',
        actions: [{ at: 0.6, to: mid(S.tabSecurity) }] },
      { scroll: settingsScroll, cam: pad(S.cardsRow, 20), zoomMax: 1.5, hl: S.cardInquiry,
        text: 'School inquiry controls what happens when someone clicks Start trial on your website. It’s switched on here.',
        actions: [{ at: 1.2, to: mid(S.cardInquiry) }] },
      { scroll: settingsScroll, cam: pad(S.cardsRow, 20), zoomMax: 1.5, hl: S.cardInquiry, dur: 7.2,
        text: 'ON: each request waits in School inquiries for your approval. OFF: the school is created straight away. Let’s see both.' },

      // ---------- website, inquiry ON ----------
      { chapter: 'Start trial (inquiry ON)', scroll: 0, state: 'w-home', fade: 0.5, cam: 'full', hl: R['w-home'].trialBtn,
        text: 'On your website, a school clicks Start trial (or Register your school) to sign up.',
        actions: [{ at: 1.2, to: mid(R['w-home'].trialBtn), click: true }] },
      { cam: W.modal, zoomMax: 1.3, state: 'w-form', dur: 3.8,
        text: 'The registration form opens.' },
      { cam: W.modal, zoomMax: 1.3, dur: 6.0,
        text: 'They enter the school’s name and email address.',
        actions: [
          { at: 0.3, to: mid(W.name), click: true, type: R['w-name'].nameBox, state: 'w-name' },
          { at: 2.6, to: mid(W.email), click: true, type: R['w-email'].emailBox, state: 'w-email' },
        ] },
      { cam: union(W.modal, R['w-cc-open'].ccDropdown), zoomMax: 1.3, dur: 7.0,
        text: 'Then the country code and mobile number.',
        actions: [
          { at: 0.3, to: mid(W.ccTrigger), click: true, state: 'w-cc-open' },
          { at: 1.6, to: mid(R['w-cc-open'].ccSearch.r), dur: 0.5, click: true, type: R['w-cc-search'].ccSearch, state: 'w-cc-search' },
          { at: 3.1, to: mid(R['w-cc-search'].ccOption), dur: 0.5, click: true, state: 'w-cc' },
          { at: 4.3, to: mid(W.phone), dur: 0.6, click: true, type: R['w-phone'].phoneBox, state: 'w-phone' },
        ] },
      { cam: W.modal, zoomMax: 1.3, dur: 6.4,
        text: 'And the address and a short tagline.',
        actions: [
          { at: 0.3, to: mid(W.address), click: true, type: R['w-address'].addressBox, state: 'w-address' },
          { at: 3.0, to: mid(W.tagline), click: true, type: R['w-tagline'].taglineBox, state: 'w-tagline' },
        ] },
      { cam: W.modal, zoomMax: 1.3, dur: 3.4,
        text: 'Then they click Submit.',
        actions: [{ at: 0.4, to: mid(W.submit), click: true, state: 'w-wait' }] },
      { cam: topRight(0), zoomMax: 1.8, state: 'w-toast-on', fade: 0.3, hl: R['w-toast-on'].toast, dur: 6.0,
        text: 'Because School inquiry is ON, they see that the request was sent to you for approval.' },

      // ---------- review ----------
      { chapter: 'Review inquiries', scroll: 0, state: 'i-list', fade: 0.5, cam: 'full', hl: I.navInquiries, hlFixed: true,
        text: 'In the panel, go to Schools › School inquiries.',
        actions: [{ at: 1.0, to: mid(I.navInquiries), fixed: true }] },
      { cam: I.listCard, zoomMax: 1.3, hl: I.aRow,
        text: 'Each request shows the school’s name, phone, email and date. New requests are Pending.',
        actions: [{ at: 1.2, to: mid(I.aStatus) }] },
      { cam: I.listCard, zoomMax: 1.3, hl: I.filterStatus, dur: 4.4,
        text: 'Use the Status filter to show All, Pending or Rejected requests.',
        actions: [{ at: 0.5, to: mid(I.filterStatus) }] },
      { cam: I.listCard, zoomMax: 1.3, hl: I.aView, dur: 4.0,
        text: 'Click the eye icon to open a request.',
        actions: [{ at: 0.6, to: mid(I.aView), click: true }] },
      { cam: V.modal, zoomMax: 1.15, state: 'i-view', hl: V.prefixGroup,
        text: 'The school’s details are read-only. You can still change the School code prefix before approving.',
        actions: [{ at: 1.2, to: mid(V.prefixGroup) }] },

      // ---------- approve ----------
      { chapter: 'Approve an inquiry', cam: V.modal, zoomMax: 1.15, hl: V.statusGroup, dur: 5.0,
        text: 'To accept it, set Application status to Approved and click Submit.',
        actions: [
          { at: 0.6, to: mid(V.approved), click: true, state: 'i-approved' },
          { at: 2.6, to: mid(V.modalSubmit), click: true, state: 'i-approve-toast' },
        ] },
      { cam: topRight(0), zoomMax: 1.8, hl: R['i-approve-toast'].toast, dur: 4.0,
        text: 'The school is registered.' },
      { cam: I.listCard, zoomMax: 1.3, state: 'i-after-approve', fade: 0.4, hl: R['i-after-approve'].rRow, dur: 4.6,
        text: 'Approved requests leave the inquiry list.' },
      { scroll: listTop(R['m-approved'], R['m-approved'].listCard), state: 'm-approved', fade: 0.5, cam: R['m-approved'].mRow, zoomMax: 1.35, hl: R['m-approved'].mStatus,
        text: 'In Schools › Manage schools, the new school is already being set up, just like one you create yourself.',
        actions: [{ at: 1.4, to: mid(R['m-approved'].mStatus) }] },

      // ---------- reject ----------
      { chapter: 'Reject an inquiry', scroll: 0, state: 'i-after-approve', fade: 0.5, cam: I.listCard, zoomMax: 1.3, hl: R['i-after-approve'].rRow,
        text: 'To turn a request down, open it the same way.',
        actions: [{ at: 1.2, to: mid(R['i-after-approve'].rView), click: true }] },
      { cam: V2.modal, zoomMax: 1.15, state: 'i-view2', hl: V2.statusGroup, dur: 5.0,
        text: 'Choose Rejected and click Submit.',
        actions: [
          { at: 0.8, to: mid(V2.rejected), click: true, state: 'i-rejected' },
          { at: 2.6, to: mid(V2.modalSubmit), click: true, state: 'i-reject-toast' },
        ] },
      { cam: I.listCard, zoomMax: 1.3, state: 'i-after-reject', fade: 0.4, hl: R['i-after-reject'].rStatus,
        text: 'The request is marked Rejected, and no school is created.',
        actions: [{ at: 1.0, to: mid(R['i-after-reject'].rStatus) }] },
      { cam: I.listCard, zoomMax: 1.3, hl: R['i-after-reject'].rDelete, dur: 4.2,
        text: 'Use the bin icon to delete a request you no longer need.',
        actions: [{ at: 0.5, to: mid(R['i-after-reject'].rDelete) }] },

      // ---------- switch it off ----------
      { chapter: 'Turn School inquiry off', scroll: settingsScroll, state: 's-on2', fade: 0.5, cam: pad(S.cardsRow, 20), zoomMax: 1.5, hl: S.cardInquiry,
        text: 'To skip approvals, go back to General settings › Security & Server and click the School inquiry card.',
        actions: [{ at: 2.0, to: mid(S.cardInquiry), click: true, state: 's-off' }] },
      { scroll: settingsScroll, cam: union(S.cardsRow, S.secSubmit), zoomMax: 1.4, dur: 3.8,
        text: 'It’s now off. Click Submit to save.',
        actions: [{ at: 0.6, to: mid(S.secSubmit), click: true, state: 's-off-toast' }] },
      { scroll: R['s-off-toast'].vp, cam: topRight(R['s-off-toast'].vp), zoomMax: 1.8, hl: R['s-off-toast'].toast, dur: 3.6,
        text: 'The setting is saved.' },

      // ---------- website, inquiry OFF ----------
      { chapter: 'Start trial (inquiry OFF)', scroll: 0, state: 'w2-home', fade: 0.5, cam: 'full', hl: R['w2-home'].trialBtn, dur: 4.4,
        text: 'Now another school clicks Start trial.',
        actions: [{ at: 1.2, to: mid(R['w2-home'].trialBtn), click: true }] },
      { cam: W.modal, zoomMax: 1.3, state: 'w2-form', dur: 5.4,
        text: 'They fill in the same registration form…',
        actions: [
          { at: 0.5, to: mid(W.name), click: true, type: R['w2-name'].nameBox, state: 'w2-name' },
          { at: 3.3, state: 'w2-filled', fade: 0.35 },
        ] },
      { cam: W.modal, zoomMax: 1.3, dur: 3.2,
        text: '…and click Submit.',
        actions: [{ at: 0.4, to: mid(W.submit), click: true, state: 'w2-wait' }] },
      { cam: topRight(0), zoomMax: 1.8, state: 'w2-toast', fade: 0.3, hl: R['w2-toast'].toast, dur: 6.4,
        text: 'This time the school is created straight away. They get an email when it’s ready.' },

      // ---------- result ----------
      { chapter: 'School created directly', scroll: listTop(R['m-direct'], R['m-direct'].listCard), state: 'm-direct', fade: 0.5, cam: R['m-direct'].dRow, zoomMax: 1.35, hl: R['m-direct'].dStatus,
        text: 'The school goes straight into Manage schools and is queued for setup. No approval is needed.',
        actions: [{ at: 1.4, to: mid(R['m-direct'].dStatus) }] },
      { scroll: 0, state: 'i-none', fade: 0.5, cam: union(R['i-none'].notice, [300, 90, 10, 10]), zoomMax: 1.4, hl: R['i-none'].notice,
        text: 'School inquiries now shows that inquiries are turned off, with a link to switch them back on.',
        actions: [{ at: 1.4, to: [R['i-none'].notice[0] + R['i-none'].notice[2] * 0.45, R['i-none'].notice[1] + R['i-none'].notice[3] / 2] }] },
    ],
  };
};
