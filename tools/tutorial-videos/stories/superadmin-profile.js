// Super Admin > Profile tutorial: update your details and change your password.
// Element positions come from the capture (cache/superadmin-profile/*.json).
window.buildStory = async () => {
  const dir = 'cache/superadmin-profile';
  const names = ['dash', 'dash-menu', 'form0', 'f-first', 'f-last', 'f-country-open', 'f-country-search', 'f-country', 'f-mobile',
    'f-dob-open', 'f-dob-typed', 'f-dob', 'f-image', 'f-addr1', 'f-addr2', 'f-toast', 'saved', 'saved-menu',
    'pw0', 'pw-old', 'pw-new', 'pw-confirm', 'pw-toast'];
  const R = {};
  for (const n of names) R[n] = await (await fetch(`${dir}/${n}.json`)).json();
  const mid = r => [r[0] + r[2] / 2, r[1] + r[3] / 2];
  const union = (...rs) => {
    const x0 = Math.min(...rs.map(r => r[0])), y0 = Math.min(...rs.map(r => r[1]));
    const x1 = Math.max(...rs.map(r => r[0] + r[2])), y1 = Math.max(...rs.map(r => r[1] + r[3]));
    return [x0, y0, x1 - x0, y1 - y0];
  };
  const F = R.form0, P = R.pw0;
  const topRight = [1100, 0, 500, 330];
  const labelPad = r => [r[0], r[1] - 34, r[2], r[3] + 34];   // include the field label above

  return {
    id: 'superadmin-profile',
    overline: 'SUPER ADMIN  ·  TUTORIAL 02',
    title: 'Profile',
    subtitle: 'Keep your own account details up to date',
    learn: ['Open your profile from the top bar', 'Update your name, mobile number and date of birth', 'Add a profile photo and your address', 'Change your password'],
    doneTitle: 'Your profile is ready',
    recap: ['Name, mobile number and date of birth updated', 'Profile photo and address added', 'Password changed'],
    next: 'Manage schools',
    posterAt: 4.2,
    previewState: 'f-addr2',          // the title card previews the filled-in form
    layout: { side: 280, top: 70, dpr: 2 },
    states: Object.fromEntries(names.map(n => [n, `${dir}/${n}.png`])),
    steps: [
      // --- open the profile ---
      { chapter: 'Open your profile', state: 'dash', cam: topRight, camFixed: true, zoomMax: 1.8,
        text: 'Your profile holds your own account details. To open it, click your name at the top right.',
        actions: [{ at: 1.0, to: mid(R['dash-menu'].profile), fixed: true, click: true, state: 'dash-menu', fade: 0.15 }] },
      { cam: topRight, camFixed: true, zoomMax: 1.8, hl: R['dash-menu'].menuProfile, hlFixed: true, dur: 2.9,
        text: 'Then choose Profile.',
        actions: [{ at: 0.5, to: mid(R['dash-menu'].menuProfile), fixed: true, click: true }] },

      // --- the form ---
      { chapter: 'Your details', cam: 'full', hl: F.card, state: 'form0', fade: 0.5,
        text: 'The Profile page shows your account details. Fields marked with a red star are required.',
        actions: [{ at: 0.8, to: [F.card[0] + 420, F.card[1] + 120] }] },
      { cam: labelPad(union(F.first_name, F.last_name)), zoomMax: 1.9, dur: 5.4,
        text: 'Enter your first name and last name.',
        actions: [
          { at: 0.5, to: mid(F.first_name), click: true, type: R['f-first'].first_name_box, state: 'f-first' },
          { at: 2.5, to: mid(F.last_name), click: true, type: R['f-last'].last_name_box, state: 'f-last' },
        ] },

      { chapter: 'Mobile number', cam: union(F.countryTrigger, F.mobile, R['f-country-open'].countryDropdown), zoomMax: 1.8, dur: 7.2,
        text: 'Choose your country code. Type in the search box to find it quickly, then pick it from the list.',
        actions: [
          { at: 0.9, to: mid(F.countryTrigger), click: true, state: 'f-country-open', fade: 0.12 },
          { at: 2.4, to: mid(R['f-country-open'].countrySearch.r), dur: 0.6, click: true, type: R['f-country-search'].countrySearch, state: 'f-country-search' },
          { at: 4.4, to: mid(R['f-country-search'].countryOption44), dur: 0.6, click: true, state: 'f-country', fade: 0.12 },
        ] },
      { cam: union(F.countryTrigger, F.mobile), zoomMax: 1.8, dur: 4.2,
        text: 'Then enter your mobile number.',
        actions: [{ at: 0.4, to: mid(F.mobile), click: true, type: R['f-mobile'].mobile_box, state: 'f-mobile' }] },

      { chapter: 'Date of birth', cam: union(F.dob, R['f-dob-open'].datepicker), zoomMax: 1.8, dur: 6.4,
        text: 'Click Date of birth to open the calendar. Pick a date, or type it in.',
        actions: [
          { at: 0.8, to: mid(F.dob), click: true, state: 'f-dob-open', fade: 0.15 },
          { at: 2.2, type: R['f-dob-typed'].dob_box, state: 'f-dob-typed' },
          { at: 5.0, state: 'f-dob', fade: 0.2 },
        ] },

      { chapter: 'Profile photo', cam: labelPad(union(F.imageText, F.uploadBtn, F.imagePreview)), zoomMax: 1.9,
        text: 'Click Upload and choose a photo from your computer. The file name appears in the box.',
        actions: [
          { at: 0.7, to: mid(F.uploadBtn), click: true },
          { at: 1.85, state: 'f-image', fade: 0.15 },
        ] },

      { chapter: 'Address', cam: labelPad(union(F.current_address, F.permanent_address)), zoomMax: 1.5, dur: 7.2,
        text: 'Fill in your current address and permanent address.',
        actions: [
          { at: 0.5, to: mid(F.current_address), click: true, type: R['f-addr1'].current_address_box, state: 'f-addr1' },
          { at: 3.7, to: mid(F.permanent_address), click: true, type: R['f-addr2'].permanent_address_box, state: 'f-addr2' },
        ] },

      { chapter: 'Two factor verification', cam: [F.twoFactor[0], F.twoFactor[1] - 80, 700, 190], zoomMax: 1.9, hl: F.twoFactor,
        text: 'Tick Two factor verification to add an extra security check when you sign in. Leave it unticked if you don’t need it.',
        actions: [{ at: 0.9, to: [F.twoFactor[0] + 8, F.twoFactor[1] + F.twoFactor[3] / 2] }] },

      // --- save ---
      { chapter: 'Save your changes', cam: 'full', dur: 3.6,
        text: 'Click Submit to save your changes.',
        actions: [{ at: 0.9, to: mid(F.submit), click: true, state: 'f-toast', fade: 0.25 }] },
      { cam: topRight, camFixed: true, zoomMax: 1.8, hl: R['f-toast'].toast, hlFixed: true, dur: 3.8,
        text: 'A message at the top right confirms that your changes are saved.' },
      { cam: topRight, camFixed: true, zoomMax: 1.8, state: 'saved', fade: 0.45, hl: R.saved.profile, hlFixed: true,
        text: 'The page refreshes, and your new name and photo now show in the top bar.',
        actions: [{ at: 1.0, to: [R.saved.profile[0] - 40, R.saved.profile[1] + 95], fixed: true }] },

      // --- password ---
      { chapter: 'Change password', cam: topRight, camFixed: true, zoomMax: 1.8, dur: 4.4,
        text: 'To change your password, open the same menu and choose Change password.',
        actions: [
          { at: 0.5, to: mid(R.saved.profile), fixed: true, click: true, state: 'saved-menu', fade: 0.15 },
          { at: 2.1, to: mid(R['saved-menu'].menuPassword), fixed: true, click: true },
        ] },
      { cam: union(P.card, R['pw-old'].oldStatus), zoomMax: 1.7, dur: 6.0, state: 'pw0', fade: 0.5,
        text: 'Type your current password. A green tick shows that it’s correct.',
        actions: [{ at: 1.2, to: mid(P.old_password), click: true, type: R['pw-old'].old_password_box, state: 'pw-old',
          hide: R['pw-old'].oldStatus, hideBg: '#ffffff', hideExtra: 0.45 }] },
      { cam: union(P.card, R['pw-old'].oldStatus), zoomMax: 1.7, dur: 5.6,
        text: 'Then enter your new password, and type it again to confirm it.',
        actions: [
          { at: 0.4, to: mid(P.new_password), click: true, type: R['pw-new'].new_password_box, state: 'pw-new' },
          { at: 2.6, to: mid(P.confirm_password), click: true, type: R['pw-confirm'].confirm_password_box, state: 'pw-confirm' },
        ] },
      { cam: 'full', dur: 3.6,
        text: 'Click Submit to save your new password.',
        actions: [{ at: 0.9, to: mid(P.submit), click: true, state: 'pw-toast', fade: 0.25 }] },
      { cam: topRight, camFixed: true, zoomMax: 1.8, hl: R['pw-toast'].toast, hlFixed: true,
        text: 'A message confirms the change. Use your new password the next time you sign in.' },
    ],
  };
};
