// Super Admin > Personnel management > Staff: add a staff member with a role, then sign in as them.
// Positions come from the capture (cache/superadmin-staff/*.json). All shots are window-sized.
window.buildStory = async () => {
  const dir = 'cache/superadmin-staff';
  const names = ['s-form', 's-role-open', 's-role', 's-first', 's-last', 's-cc-open', 's-cc-search', 's-cc', 's-mobile', 's-email',
    's-image', 's-dob-open', 's-dob-typed', 's-dob', 's-sch-open1', 's-sch1', 's-sch-open2', 's-sch2', 's-sch-open3', 's-sch3',
    's-toast', 'l-login', 'l-email', 'l-password', 'd-dash', 'd-personnel'];
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
  const labelPad = r => [r[0], r[1] - 34, r[2], r[3] + 34];   // include the field label above
  const F = R['s-form'], L = R['l-login'], D = R['d-dash'], P = R['d-personnel'];
  const opt = (n, school) => R[n].schoolOpts[school];
  const sideCam = [0, 10, 900, 506];   // the staff member's sidebar with the start of the dashboard
  const schoolsCam = pad(union(R['s-sch3'].schoolsGroup, R['s-sch-open3'].schoolsDropdown), 30);

  return {
    id: 'superadmin-staff',
    overline: 'SUPER ADMIN  ·  TUTORIAL 06',
    title: 'Staff',
    subtitle: 'Add your team and give each person a role',
    learn: ['Add a staff member and choose their role', 'Enter their details and assign schools', 'See how a staff member signs in', 'See what their role lets them use'],
    doneTitle: 'Your staff member is ready',
    recap: ['Olivia Bennett added as Onboarding Manager', 'Three schools assigned to her', 'She signed in and sees only what her role allows'],
    next: 'Packages',
    posterAt: 4.2,
    previewState: 's-sch3',
    layout: { side: 280, top: 70, dpr: 2 },
    states: Object.fromEntries(names.map(n => [n, { src: `${dir}/${n}.png`, viewport: true }])),
    steps: [
      // ---------- open ----------
      { chapter: 'Open Staff', state: 's-form', cam: 'full', hl: F.navStaff, hlFixed: true, dur: 6.4,
        text: 'Staff members are people on your team who help you run the platform. Go to Personnel management › Staff.',
        actions: [{ at: 1.0, to: mid(F.navStaff), fixed: true }] },
      { cam: pad(F.formCard, 10), zoomMax: 1.3, hl: F.formCard, dur: 4.8,
        text: 'Add a staff member with the Create Staff form. Fields marked with a red star are required.',
        actions: [{ at: 1.2, to: [F.formCard[0] + 520, F.formCard[1] + 60] }] },

      // ---------- add ----------
      { chapter: 'Add a staff member', cam: pad(labelPad(union(F.roleTrigger, R['s-role-open'].roleDropdown)), 40), zoomMax: 1.8, dur: 6.6,
        text: 'Choose their role. The role decides what they can see and do. Here, Onboarding Manager.',
        actions: [
          { at: 0.9, to: mid(F.roleTrigger), click: true, state: 's-role-open', fade: 0.12 },
          { at: 3.2, to: mid(R['s-role-open'].roleOption), dur: 0.6, click: true, state: 's-role', fade: 0.12 },
        ] },
      { cam: pad(labelPad(union(F.first_name, F.last_name)), 30), zoomMax: 1.8, dur: 5.4,
        text: 'Enter their first name and last name.',
        actions: [
          { at: 0.5, to: mid(F.first_name), click: true, type: R['s-first'].first_name_box, state: 's-first' },
          { at: 2.6, to: mid(F.last_name), click: true, type: R['s-last'].last_name_box, state: 's-last' },
        ] },
      { chapter: 'Mobile number and email', cam: pad(union(F.mobileGroup, R['s-cc-open'].ccDropdown), 30), zoomMax: 1.8, dur: 8.6,
        text: 'Choose the country code, then enter their mobile number.',
        actions: [
          { at: 0.8, to: mid(F.ccTrigger), click: true, state: 's-cc-open', fade: 0.12 },
          { at: 2.2, to: mid(R['s-cc-open'].ccSearch.r), dur: 0.6, click: true, type: R['s-cc-search'].ccSearch, state: 's-cc-search' },
          { at: 4.0, to: mid(R['s-cc-search'].ccOption), dur: 0.6, click: true, state: 's-cc', fade: 0.12 },
          { at: 5.6, to: mid(F.mobile), dur: 0.6, click: true, type: R['s-mobile'].mobile_box, state: 's-mobile' },
        ] },
      { cam: pad(F.mobileGroup, 40), zoomMax: 1.8, hl: F.mobile, dur: 4.4,
        text: 'This mobile number is also their password the first time they sign in.' },
      { cam: pad(labelPad(F.email), 30), zoomMax: 1.8, dur: 5.2,
        text: 'Enter their email address. They sign in with it.',
        actions: [{ at: 0.5, to: mid(F.email), click: true, type: R['s-email'].email_box, state: 's-email' }] },
      { chapter: 'Photo, date of birth and schools', cam: pad(F.imageGroup, 30), zoomMax: 1.8, dur: 4.2,
        text: 'Click Upload to add their photo.',
        actions: [
          { at: 0.7, to: mid(F.uploadBtn), click: true, state: 's-image', fade: 0.15 },
        ] },
      { cam: pad(union(labelPad(F.dob), R['s-dob-open'].datepicker), 20), zoomMax: 1.8, dur: 6.2,
        text: 'Pick their date of birth, or type it.',
        actions: [
          { at: 0.8, to: mid(F.dob), click: true, state: 's-dob-open', fade: 0.15 },
          { at: 2.2, type: R['s-dob-typed'].dob_box, state: 's-dob-typed' },
          { at: 4.8, state: 's-dob', fade: 0.2 },
        ] },
      { cam: schoolsCam, zoomMax: 1.8, dur: 10.2,
        text: 'Assign the schools they look after. Those schools see this staff member as their support contact.',
        actions: [
          { at: 0.8, to: mid(F.schools), click: true, state: 's-sch-open1', fade: 0.12 },
          { at: 2.0, to: mid(opt('s-sch-open1', 'Greenwood International School')), dur: 0.6, click: true, state: 's-sch1', fade: 0.12 },
          { at: 3.6, to: mid(R['s-sch1'].schools), dur: 0.6, click: true, state: 's-sch-open2', fade: 0.12 },
          { at: 4.8, to: mid(opt('s-sch-open2', 'Maplewood Academy')), dur: 0.6, click: true, state: 's-sch2', fade: 0.12 },
          { at: 6.4, to: mid(R['s-sch2'].schools), dur: 0.6, click: true, state: 's-sch-open3', fade: 0.12 },
          { at: 7.6, to: mid(opt('s-sch-open3', 'Riverside Public School')), dur: 0.6, click: true, state: 's-sch3', fade: 0.12 },
        ] },
      { cam: pad(union(F.submit, F.reset, [F.submit[0] - 380, F.submit[1] - 130, 10, 10]), 30), zoomMax: 1.6, dur: 3.6,
        text: 'Click Submit to add the staff member.',
        actions: [{ at: 0.9, to: mid(F.submit), click: true, state: 's-toast' }] },
      { cam: [1080, 0, 520, 280], zoomMax: 1.8, hl: R['s-toast'].toast, dur: 3.4,
        text: 'The staff member is added.' },

      // ---------- sign in ----------
      { chapter: 'Sign in as the staff member', state: 'l-login', fade: 0.5, cam: pad(union(L.heading, L.form), 40), zoomMax: 1.5, dur: 5.6,
        text: 'Olivia can now sign in on the usual sign-in page. She enters her email address,',
        actions: [{ at: 1.2, to: mid(L.email), click: true, type: R['l-email'].emailBox, state: 'l-email' }] },
      { cam: pad(union(L.heading, L.form), 40), zoomMax: 1.5, hl: L.password, dur: 5.8,
        text: 'and her mobile number as the password. She leaves School code empty.',
        actions: [{ at: 0.6, to: mid(L.password), click: true, type: R['l-password'].passwordBox, state: 'l-password' }] },
      { cam: pad(union(L.heading, L.form), 40), zoomMax: 1.5, hl: L.signIn, dur: 3.2,
        text: 'Then she clicks Sign in.',
        actions: [{ at: 0.8, to: mid(L.signIn), click: true, state: 'd-dash' }] },
      { state: 'd-dash', cam: [1000, 0, 600, 338], zoomMax: 2, hl: D.userMenu, hlFixed: true, dur: 4.4,
        text: 'She’s signed in. Her name and photo are at the top right.',
        actions: [{ at: 0.8, to: [D.userMenu[0] + 40, D.userMenu[1] + 50], fixed: true }] },
      { cam: sideCam, zoomMax: 2, hl: D.sidebar, hlFixed: true, dur: 7.0,
        text: 'Her menu shows only what the Onboarding Manager role allows: Schools, Staff, Packages & subscription and Contact inquiry.',
        actions: [{ at: 1.4, to: mid(D.sidebar), fixed: true }, { at: 5.2, to: mid(D.nav['Personnel management']), dur: 0.6, fixed: true, click: true }] },
      { state: 'd-personnel', fade: 0.15, cam: sideCam, zoomMax: 2, hl: P.nav['Personnel management'], hlFixed: true, dur: 6.8,
        text: 'Under Personnel management she sees Staff, but not Role & permission. Add-ons, Email schools and Settings aren’t shown.' },
    ],
  };
};
