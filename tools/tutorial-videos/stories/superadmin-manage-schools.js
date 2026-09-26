// Super Admin > Schools > Manage schools: create a school, follow its setup, and use every row action.
// Captured in two phases (see captures/superadmin-manage-schools.mjs); positions come from cache/superadmin-manage-schools/*.json.
window.buildStory = async () => {
  const dir = 'cache/superadmin-manage-schools';
  const createStates = ['c-form', 'c-name', 'c-logo', 'c-email', 'c-cc-open', 'c-cc-search', 'c-cc', 'c-phone', 'c-tagline', 'c-address',
    'c-prefix', 'c-domain', 'c-before-submit', 'c-wait', 'c-toast', 'c-list', 'c-menu', 'c-progress'];
  const actionStates = ['a-list', 'a-search', 'a-columns', 'a-export', 'a-menu', 'a-admin', 'a-admin-first', 'a-admin-last', 'a-admin-verify',
    'a-admin-toast', 'a-admin-done', 'a-menu-admin2', 'a-admin2', 'a-admin-verify-toast', 'a-admin-verified', 'a-edit', 'a-edit-tagline', 'a-edit-toast', 'a-menu2', 'a-status-confirm', 'a-inactive-toast', 'a-inactive',
    'a-menu-inactive', 'a-active', 'a-menu3', 'a-delete-confirm', 'a-delete-toast', 'a-deleted', 'a-trashed', 'a-trash-menu', 'a-restore-toast', 'a-restored'];
  const R = {};
  const load = async (n) => { const r = await fetch(`${dir}/${n}.json`); if (r.ok) R[n] = await r.json(); return r.ok; };
  for (const n of createStates) await load(n);
  let hasActions = true;
  for (const n of actionStates) if (!(await load(n)) && !['a-restore-confirm'].includes(n)) hasActions = false;
  await load('a-restore-confirm');

  const mid = r => [r[0] + r[2] / 2, r[1] + r[3] / 2];
  const union = (...rs) => {
    rs = rs.filter(Boolean);
    const x0 = Math.min(...rs.map(r => r[0])), y0 = Math.min(...rs.map(r => r[1]));
    const x1 = Math.max(...rs.map(r => r[0] + r[2])), y1 = Math.max(...rs.map(r => r[1] + r[3]));
    return [x0, y0, x1 - x0, y1 - y0];
  };
  const label = r => [r[0], r[1] - 30, r[2], r[3] + 30];
  const F = R['c-form'], L = R['c-list'];
  const sidebarManage = [27, 228, 236, 41];
  const listTop = (x) => Math.max(0, x.listCard[1] - 80);

  // Third phase: open the school's website, sign in, Academy Setup Wizard.
  const schoolStates = ['p-list', 'p-school', 'p-assign', 'p-assign-full', 'p-assign-toast', 'p-school-active', 'l-list', 'l-menu', 'l-edit-url', 'l-site', 'l-site-menu', 'l-login', 'l-email', 'l-password',
    'z-welcome', 'z-session', 'z-sname', 'z-sstart', 'z-send', ...[0, 1, 2, 3, 4, 5].map(k => `z-sem-${k}`),
    'z-medium', 'z-medium1', 'z-medium2', 'z-medium3', 'z-shifts', 'z-streams', 'z-streams1', 'z-streams2',
    'z-classes', 'z-classes1', 'z-classes2', 'z-classes3', 'z-subjects', ...[1, 2, 3, 4, 5, 6, 7, 8].map(k => `z-subjects${k}`),
    'z-map1', 'z-map1-1', 'z-map1-2', 'z-map1-3', 'z-map1-4', 'z-map2', 'z-map2-done', 'z-map11', 'z-map11-stream',
    'z-map11-s1', 'z-map11-s2', 'z-map11-s3', 'z-map11-s4', 'z-elect1', 'z-elect2', 'z-elect3', 'z-elect4',
    'z-finish', 'z-finalizing', 'z-dashboard'];
  let hasSchool = hasActions;
  for (const n of schoolStates) if (!(await load(n))) hasSchool = false;

  const states = {};
  for (const n of [...createStates, ...(hasActions ? actionStates : []), ...(R['a-restore-confirm'] ? ['a-restore-confirm'] : []), ...(hasSchool ? schoolStates : [])]) {
    const plain = /^z-/.test(n) && n !== 'z-dashboard';        // the wizard has no fixed navbar or sidebar
    states[n] = R[n] && R[n].viewport ? { src: `${dir}/${n}.png`, viewport: true } : plain ? { src: `${dir}/${n}.png`, plain: true, offsetY: R[n].vp || 0 } : `${dir}/${n}.png`;
  }

  const steps = [
    // ---------- open the page ----------
    { chapter: 'Open Manage schools', state: 'c-form', cam: 'full', hl: sidebarManage, hlFixed: true,
      text: 'Go to Schools › Manage schools in the sidebar. This is where you create schools and manage them.',
      actions: [{ at: 0.8, to: mid(sidebarManage), fixed: true }] },
    { cam: 'full', hl: F.formCard,
      text: 'The Create Schools form is at the top. Your schools are listed below it.',
      actions: [{ at: 0.5, to: [F.formCard[0] + 640, F.formCard[1] + 60] }] },

    // ---------- school details ----------
    { chapter: 'School details', cam: label(union(F.school_name, F.logoBtn)), zoomMax: 1.6, dur: 6.4,
      text: 'Enter the school’s name, then click Upload to add its logo.',
      actions: [
        { at: 0.5, to: mid(F.school_name), click: true, type: R['c-name'].school_name_box, state: 'c-name', typeDur: 1.6 },
        { at: 3.2, to: mid(F.logoBtn), click: true },
        { at: 4.3, state: 'c-logo', fade: 0.15 },
      ] },
    { cam: label(union(F.school_support_email, F.school_support_phone)), zoomMax: 1.6, dur: 5.2,
      text: 'Add the school’s email address. The school admin’s sign-in details are sent here.',
      actions: [{ at: 0.5, to: mid(F.school_support_email), click: true, type: R['c-email'].school_support_email_box, state: 'c-email' }] },
    { cam: union(F.ccTrigger, F.school_support_phone, R['c-cc-open'].ccDropdown), zoomMax: 1.6, dur: 8.6,
      text: 'Choose the country code and enter the phone number. By default, this number is also the school admin’s password.',
      actions: [
        { at: 0.6, to: mid(F.ccTrigger), click: true, state: 'c-cc-open', fade: 0.12 },
        { at: 2.0, to: mid(R['c-cc-open'].ccSearch.r), dur: 0.6, click: true, type: R['c-cc-search'].ccSearch, state: 'c-cc-search' },
        { at: 3.7, to: mid(R['c-cc-search'].ccOption), dur: 0.6, click: true, state: 'c-cc', fade: 0.12 },
        { at: 5.0, to: mid(F.school_support_phone), dur: 0.6, click: true, type: R['c-phone'].school_support_phone_box, state: 'c-phone' },
      ] },
    { cam: label(union(F.school_tagline, F.school_address)), zoomMax: 1.5, dur: 7.4,
      text: 'Add a short tagline and the school’s address.',
      actions: [
        { at: 0.5, to: mid(F.school_tagline), click: true, type: R['c-tagline'].school_tagline_box, state: 'c-tagline' },
        { at: 3.8, to: mid(F.school_address), click: true, type: R['c-address'].school_address_box, state: 'c-address' },
      ] },

    // ---------- code and domain ----------
    { chapter: 'Board and school code', cam: label(union(F.boardTrigger, F.code)), zoomMax: 1.6, hl: union(F.school_code_prefix, F.code),
      text: 'Board is optional. The school code is created for you. Change its prefix if you like.',
      actions: [{ at: 1.4, to: mid(F.school_code_prefix), click: true, type: R['c-prefix'].school_code_prefix_box, state: 'c-prefix' }] },
    { chapter: 'Domain', cam: union(F.domainTypes, F.domainGroup), zoomMax: 1.8, hl: F.domainTypes,
      text: 'Choose Default to give the school a sub-domain of your main domain, or Custom if it has its own domain name.',
      actions: [{ at: 0.8, to: [F.domainTypes[0] + 110, F.domainTypes[1] + 52] }] },
    { cam: union(F.domainTypes, F.domainGroup), zoomMax: 1.8, dur: 4.6,
      text: 'Then type the school’s sub-domain.',
      actions: [{ at: 0.4, to: mid(F.domain), click: true, type: R['c-domain'].domain_box, state: 'c-domain' }] },

    // ---------- submit ----------
    { chapter: 'Create the school', scroll: R['c-before-submit'].vp, cam: 'full', state: 'c-before-submit', fade: 0.3, dur: 4.4,
      text: 'Click Submit to create the school.',
      actions: [{ at: 1.0, to: mid(F.submit), click: true, state: 'c-wait', fade: 0.2 }] },
    { scroll: R['c-toast'].vp, cam: [1100, R['c-toast'].vp, 500, 300], camFixed: false, zoomMax: 1.8, state: 'c-toast', fade: 0.35,
      hl: R['c-toast'].toast,
      text: 'Setup starts in the background. A message confirms it, and you’ll get an email when the school is ready.' },

    // ---------- setup progress ----------
    { chapter: 'Setup progress', scroll: listTop(L), cam: union(L.row, [L.row[0], L.row[1] - 60, 10, 10]), zoomMax: 1.5, state: 'c-list', fade: 0.4, hl: L.rowStatus,
      text: 'The new school appears at the top of the list, with a progress bar while it’s being set up.',
      actions: [{ at: 1.2, to: mid(L.rowStatus) }] },
    { cam: union(L.row, R['c-menu'].menu), zoomMax: 1.5, dur: 5.0,
      text: 'To follow the setup, open the ⋮ menu and choose View progress.',
      actions: [
        { at: 0.4, to: mid(L.rowAction), click: true, state: 'c-menu', fade: 0.12 },
        { at: 1.9, to: mid(R['c-menu'].menu_view_progress), click: true },
      ] },
    { scroll: R['c-progress'].vp, cam: R['c-progress'].modal, zoomMax: 1.3, state: 'c-progress', fade: 0.35, hl: R['c-progress'].modalSteps,
      text: 'The window ticks off each setup step. It usually takes a few minutes, so you can minimise it and keep working.',
      actions: [{ at: 1.2, to: [R['c-progress'].modalSteps[0] + 90, R['c-progress'].modalSteps[1] + 40] },
                { at: 5.0, to: mid(R['c-progress'].modalClose) }] },
  ];

  if (hasActions) steps.push(...(await actionSteps(R, { mid, union, label, listTop })));
  if (hasSchool) steps.push(...schoolSteps(R, { mid, union, label, listTop }));

  return {
    id: 'superadmin-manage-schools',
    overline: 'SUPER ADMIN  ·  TUTORIAL 03',
    title: 'Manage schools',
    subtitle: 'Create schools and manage them from one list',
    // Until the second capture phase exists, the video covers creating a school and following its setup.
    learn: hasSchool
      ? ['Create a school and follow its setup', 'Manage the admin, edit, deactivate, delete and restore', 'Open the school’s website and sign in', 'Complete the Academy Setup Wizard']
      : hasActions
      ? ['Create a school with its logo, contact details and domain', 'Follow the school’s setup progress', 'Manage the school admin and edit school details', 'Deactivate, delete and restore a school']
      : ['Open Manage schools', 'Enter the school’s details, logo and contact', 'Set the school code and domain', 'Create the school and follow its setup'],
    doneTitle: hasSchool ? 'Your school is ready to use' : hasActions ? 'You can now manage schools' : 'Your school is being set up',
    recap: hasSchool
      ? ['School created, set up and managed', 'Signed in on the school’s own website', 'Academy Setup Wizard completed']
      : hasActions
      ? ['School created and set up', 'Admin details and school details updated', 'Status, delete and restore explained']
      : ['School details, logo and contact added', 'School code and domain set', 'Setup progress followed'],
    next: 'School inquiries',
    posterAt: 4.2,
    previewState: 'c-domain',
    layout: { side: 280, top: 70, dpr: 2 },
    states,
    steps,
  };
};

// Steps for the second capture phase (after setup has finished).
async function actionSteps(R, { mid, union, label, listTop }) {
  const A = R['a-list'];
  const s = [];
  s.push(
    { chapter: 'Your schools list', scroll: listTop(A), cam: 'full', state: 'a-list', fade: 0.5, hl: A.rowStatus,
      text: 'When setup is finished, the school’s status changes to Active and it’s ready to use.',
      actions: [{ at: 1.0, to: mid(A.rowStatus) }] },
    { cam: union(A.filterPackage, A.filterBoard, A.search, A.exportBtn), zoomMax: 1.6, hl: union(A.filterPackage, A.filterBoard),
      text: 'Filter the list by package or board, or search for a school by name.',
      actions: [{ at: 0.6, to: mid(A.filterPackage) }, { at: 2.6, to: mid(A.search), click: true, type: R['a-search'].searchBox, state: 'a-search' }] },
    { cam: union(A.search, R['a-columns'].toolbarMenu || A.columns, A.exportBtn), zoomMax: 1.6, dur: 6.8,
      text: 'Use these buttons to refresh the list, choose which columns to show, and export the list.',
      actions: [
        { at: 0.5, to: mid(A.refresh) },
        { at: 1.6, to: mid(A.columns), click: true, state: 'a-columns', fade: 0.12 },
        { at: 3.8, to: mid(A.exportBtn), click: true, state: 'a-export', fade: 0.12 },
      ] },
  );
  // Manage admin: save 1 changes the admin's name, save 2 uses the account options
  const M = R['a-menu'], AD = R['a-admin'], AD2 = R['a-admin2'], DONE = R['a-admin-done'], VER = R['a-admin-verified'];
  s.push(
    { chapter: 'Manage admin', cam: union(A.row, M.menu), zoomMax: 1.5, state: 'a-search', fade: 0.2,
      text: 'Each school has a ⋮ menu. Choose Manage admin to update the school admin’s details.',
      actions: [
        { at: 0.5, to: mid(A.rowAction), click: true, state: 'a-menu', fade: 0.12 },
        { at: 2.4, to: mid(M.menu_manage_admin), click: true },
      ] },
    { scroll: AD.vp, cam: AD.modal, zoomMax: 1.3, state: 'a-admin', fade: 0.35, dur: 6.4,
      text: 'Change the admin’s name, email, contact number or photo.',
      actions: [
        { at: 0.8, to: mid(AD.edit_admin_first_name), click: true, type: R['a-admin-first'].edit_admin_first_name_box, state: 'a-admin-first' },
        { at: 2.8, to: mid(AD.edit_admin_last_name), click: true, type: R['a-admin-last'].edit_admin_last_name_box, state: 'a-admin-last' },
      ] },
    { scroll: AD.vp, cam: AD.modal, zoomMax: 1.3, dur: 3.8,
      text: 'Click Submit to save.',
      actions: [{ at: 0.6, to: mid(AD.modalSubmit), click: true, state: 'a-admin-toast', fade: 0.3 }] },
    { scroll: listTop(DONE), cam: union(DONE.row), zoomMax: 1.5, state: 'a-admin-done', fade: 0.4, hl: DONE.rowAdmin, dur: 4.2,
      text: 'The list now shows the new admin name.' },
    { chapter: 'Admin account options', cam: union(DONE.row, R['a-menu-admin2'].menu), zoomMax: 1.5, dur: 4.2,
      text: 'Manage admin also has options for the admin’s account.',
      actions: [
        { at: 0.4, to: mid(DONE.rowAction), click: true, state: 'a-menu-admin2', fade: 0.12 },
        { at: 1.9, to: mid(R['a-menu-admin2'].menu_manage_admin), click: true },
      ] },
    { scroll: AD2.vp, cam: AD2.modal, zoomMax: 1.3, state: 'a-admin2', fade: 0.35,
      hl: union(AD2.chk_reset_password, AD2.chk_resend_email, AD2.chk_manually_verify_email, AD2.chk_two_factor_verification),
      text: 'Reset password sets it back to the default, Re send email sends the sign-in details again, and Manually verify email marks the email as verified.',
      actions: [{ at: 1.0, to: mid(AD2.chk_reset_password) }, { at: 3.4, to: mid(AD2.chkbox_manually_verify_email || AD2.chk_manually_verify_email), click: true, state: 'a-admin-verify', fade: 0.1 }] },
    { scroll: AD2.vp, cam: AD2.modal, zoomMax: 1.3, dur: 3.8,
      text: 'Tick the option you need and click Submit.',
      actions: [{ at: 0.6, to: mid(AD2.modalSubmit), click: true, state: 'a-admin-verify-toast', fade: 0.3 }] },
    { scroll: listTop(VER), cam: union(VER.row), zoomMax: 1.5, state: 'a-admin-verified', fade: 0.4, hl: VER.rowVerify, dur: 4.2,
      text: 'The email is now marked as Verified.' },
  );
  // Edit
  const E = R['a-edit'];
  s.push(
    { chapter: 'Edit school', cam: union(VER.row, R['a-menu'].menu), zoomMax: 1.5, dur: 4.4,
      text: 'To change the school’s own details, choose Edit.',
      actions: [
        { at: 0.4, to: mid(VER.rowAction), click: true, state: 'a-menu2', fade: 0.12 },
        { at: 2.0, to: mid(R['a-menu2'].menu_edit), click: true },
      ] },
    { scroll: E.vp, cam: E.modal, zoomMax: 1.25, state: 'a-edit', fade: 0.35, dur: 7.0,
      text: 'Update any detail, such as the tagline. The school code and domain can’t be changed here.',
      actions: [{ at: 1.2, to: mid(E.edit_school_tagline), click: true, type: R['a-edit-tagline'].edit_school_tagline_box, state: 'a-edit-tagline' }] },
    { scroll: E.vp, cam: E.modal, zoomMax: 1.25, dur: 4.2,
      text: 'Click Submit to save.',
      actions: [{ at: 0.5, to: mid(E.modalSubmit), click: true, state: 'a-edit-toast', fade: 0.3 }] },
  );
  // Status
  const SC = R['a-status-confirm'], IN = R['a-inactive'];
  s.push(
    { chapter: 'Deactivate and activate', scroll: listTop(R['a-menu2']), cam: union(R['a-menu2'].row, R['a-menu2'].menu), zoomMax: 1.5, state: 'a-menu2', fade: 0.3,
      text: 'Choose Inactive to switch a school off. Its students and staff can’t sign in until you activate it again.',
      actions: [{ at: 1.2, to: mid(R['a-menu2'].menu_inactive), click: true }] },
    { scroll: SC.vp, cam: SC.swal, zoomMax: 1.35, state: 'a-status-confirm', fade: 0.25, dur: 2.9,
      text: 'Confirm the change.',
      actions: [{ at: 1.3, to: mid(SC.swalConfirm), click: true, state: 'a-inactive-toast', fade: 0.3 }] },
    { scroll: listTop(IN), cam: union(IN.row), zoomMax: 1.5, state: 'a-inactive', fade: 0.4, hl: IN.rowStatus,
      text: 'The status is now Inactive. To switch the school back on, choose Active from the same menu.',
      actions: [
        { at: 2.2, to: mid(IN.rowAction), click: true, state: 'a-menu-inactive', fade: 0.12 },
        { at: 3.6, to: mid(R['a-menu-inactive'].menu_active || R['a-menu-inactive'].menu_inactive || R['a-menu-inactive'].menu), click: true },
      ] },
    { scroll: listTop(R['a-active']), cam: union(R['a-active'].row), zoomMax: 1.5, state: 'a-active', fade: 0.45, hl: R['a-active'].rowStatus, dur: 3.8,
      text: 'After you confirm, the school is Active again.' },
  );
  // Delete, Trashed, Restore
  const DC = R['a-delete-confirm'], T = R['a-trashed'], TM = R['a-trash-menu'];
  s.push(
    { chapter: 'Delete and restore', cam: union(R['a-active'].row, R['a-menu3'].menu), zoomMax: 1.5, dur: 4.2,
      text: 'Choose Delete to remove a school.',
      actions: [
        { at: 0.4, to: mid(R['a-active'].rowAction), click: true, state: 'a-menu3', fade: 0.12 },
        { at: 1.9, to: mid(R['a-menu3'].menu_delete), click: true },
      ] },
    { scroll: DC.vp, cam: DC.swal, zoomMax: 1.35, state: 'a-delete-confirm', fade: 0.25, dur: 4.4,
      text: 'Confirm, and the school moves to Trashed. It’s also set to Inactive.',
      actions: [{ at: 2.2, to: mid(DC.swalConfirm), click: true, state: 'a-delete-toast', fade: 0.3 }] },
    { scroll: listTop(R['a-deleted']), cam: union(R['a-deleted'].linkAll, R['a-deleted'].linkTrashed, [R['a-deleted'].linkTrashed[0] - 700, R['a-deleted'].linkTrashed[1], 10, 260]), zoomMax: 1.6, state: 'a-deleted', fade: 0.4, hl: R['a-deleted'].linkTrashed, dur: 5.2,
      text: 'Deleted schools are kept in Trashed. Click Trashed to see them.',
      actions: [{ at: 1.2, to: mid(R['a-deleted'].linkTrashed), click: true }] },
    { scroll: listTop(T), cam: union(T.row, TM.menu), zoomMax: 1.5, state: 'a-trashed', fade: 0.4, dur: 7.6,
      text: 'From here, choose Restore to bring a school back, or Delete to remove it and all its data permanently.',
      actions: [
        { at: 1.4, to: mid(T.rowAction), click: true, state: 'a-trash-menu', fade: 0.12 },
        { at: 3.0, to: mid(TM.menu_delete), dur: 0.6 },
        { at: 4.6, to: mid(TM.menu_restore), dur: 0.5, click: true },
      ] },
    ...(R['a-restore-confirm'] ? [{ scroll: R['a-restore-confirm'].vp, cam: R['a-restore-confirm'].swal, zoomMax: 1.35, state: 'a-restore-confirm', fade: 0.25, dur: 2.9,
      text: 'Confirm to restore the school.',
      actions: [{ at: 1.3, to: mid(R['a-restore-confirm'].swalConfirm), click: true, state: 'a-restore-toast', fade: 0.3 }] }] : []),
    { scroll: listTop(R['a-restored']), cam: union(R['a-restored'].row), zoomMax: 1.5, state: 'a-restored', fade: 0.45, hl: R['a-restored'].rowStatus, dur: 7.0,
      text: 'The school is back in your list, but still Inactive. Choose Active from its ⋮ menu to switch it on again.',
      actions: [{ at: 2.2, to: mid(R['a-restored'].rowAction) }] },
  );
  return s;
}

// Steps for the third capture phase: from Edit school's Default domain URL to a finished Academy Setup Wizard.
function schoolSteps(R, { mid, union, label, listTop }) {
  const L = R['l-list'], LM = R['l-menu'], E = R['l-edit-url'], SITE = R['l-site'], LOG = R['l-login'];
  const Z = (n) => R[n];
  const pad = (r, p) => [r[0] - p, r[1] - p, r[2] + 2 * p, r[3] + 2 * p];
  const topOf = (n, rect, margin = 120) => Math.max(0, Math.min(rect[1] - margin, Z(n).H - 900));   // scroll so rect sits near the top
  const W0 = Z('z-welcome'), S0 = Z('z-session');
  const sessionScroll = topOf('z-session', S0.sessionBlock, 170);
  const semScroll = topOf('z-send', Z('z-send').semBlock || S0.sessionBlock, 150);
  const nextAt = (n) => Z(n).next;
  const chipSteps = (st0, prefix, names, text, extra = {}) => {
    const C = Z(st0).chips;
    return { state: st0, fade: 0.35, scroll: 0, cam: pad(union(Z(st0).section, Z(st0).next), 30), zoomMax: 1.25, dur: Math.max(4.2, 1.6 + names.length * 0.55), text, ...extra,
      actions: names.map((nm, i) => ({ at: 0.6 + i * 0.55, dur: i ? 0.4 : 0.7, to: mid(C[nm]), click: true, state: `${prefix}${i + 1}` })) };
  };
  const subjectNames = ['English', 'Hindi', 'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
  const M1 = Z('z-map1'), M11 = Z('z-map11'), MS = Z('z-map11-stream');
  const mapScroll = (n, rect) => topOf(n, rect, 160);
  const e2 = Z('z-elect2'), e4 = Z('z-elect4');
  const P1 = Z('p-list'), P2 = Z('p-school'), PA = Z('p-assign'), PT = Z('p-assign-toast'), P3 = Z('p-school-active');
  const topRight = (vp) => [1080, vp, 520, 280];
  return [
    // ---------- assign a plan ----------
    { chapter: 'Assign a plan', scroll: 0, state: 'p-list', fade: 0.5, cam: 'full', hl: P1.navSubscription, hlFixed: true, dur: 7.4,
      text: 'A new school starts without a plan, so its website and features are off. Go to Packages & subscription › Subscription.',
      actions: [{ at: 1.2, to: mid(P1.navSubscription), fixed: true }] },
    { cam: pad(P1.listCard, 10), zoomMax: 1.3, hl: P1.row, dur: 5.0,
      text: 'The school’s current plan is None. Click View report.',
      actions: [{ at: 0.8, to: mid(P1.rowPlan) }, { at: 2.6, to: mid(P1.viewReport), dur: 0.7, click: true }] },
    { state: 'p-school', fade: 0.5, cam: 'full', hl: P2.profileCard, dur: 5.2,
      text: 'Its subscription is Inactive. Click Assign plan.',
      actions: [{ at: 1.0, to: mid(P2.statusBadge || P2.profileCard) }, { at: 2.8, to: mid(P2.assignBtn), dur: 0.7, click: true, state: 'p-assign' }] },
    { scroll: 0, cam: pad(PA.modal, 30), zoomMax: 1.4, dur: 5.4,
      text: 'Choose a package, here Full, and click Submit.',
      actions: [
        { at: 0.6, to: mid(PA.pkgSelect), click: true, state: 'p-assign-full' },
        { at: 2.8, to: mid(PA.modalSubmit), dur: 0.7, click: true, state: 'p-assign-toast' },
      ] },
    { cam: topRight(PT.vp || 0), zoomMax: 1.8, hl: PT.toast, dur: 3.4,
      text: 'The plan is assigned.' },
    { state: 'p-school-active', fade: 0.5, cam: 'full', hl: P3.planCard || P3.profileCard, dur: 6.0,
      text: 'The school now has an active Full plan, so its website and features are switched on.',
      actions: [{ at: 1.2, to: mid(P3.planCard || P3.profileCard) }] },

    // ---------- open the school's website ----------
    { chapter: 'Open the school’s website', scroll: listTop(L), state: 'l-list', fade: 0.5, cam: union(L.row, LM.menu), zoomMax: 1.5, dur: 5.4,
      text: 'Now open the school. In Manage schools, choose Edit from its ⋮ menu.',
      actions: [{ at: 0.9, to: mid(L.rowAction), click: true, state: 'l-menu' }, { at: 2.6, to: mid(LM.menu_edit), click: true }] },
    { scroll: E.vp, cam: pad(union(E.domainGroup || E.modal, E.schoolUrl || E.domainGroup || E.modal), 40), zoomMax: 1.6, state: 'l-edit-url', fade: 0.4, hl: E.schoolUrl, dur: 6.0,
      text: 'Under Default domain you’ll find the school’s own web address. Click it to open the school’s website.',
      actions: [{ at: 2.4, to: mid(E.schoolUrl), click: true }] },
    { scroll: 0, state: 'l-site', fade: 0.55, cam: 'full', hl: SITE.header, dur: 5.6,
      text: 'The school’s website opens in a new tab. Every school gets one, and its staff sign in from here.' },

    // ---------- sign in ----------
    { chapter: 'Sign in as the school admin', cam: [1000, 0, 600, 330], zoomMax: 1.8, hl: SITE.loginBtn, dur: 4.6,
      text: 'Click Login, then choose Login with staff.',
      actions: [{ at: 0.7, to: mid(SITE.loginBtn), click: true, state: 'l-site-menu' }, { at: 2.3, to: mid(R['l-site-menu'].staffLink), dur: 0.6, click: true }] },
    { scroll: 0, state: 'l-login', fade: 0.5, cam: pad(LOG.form, 60), zoomMax: 1.5, dur: 6.2,
      text: 'Sign in with the school admin’s email: the school email you entered when you created the school.',
      actions: [{ at: 1.2, to: mid(LOG.email), click: true, type: R['l-email'].emailBox, state: 'l-email' }] },
    { cam: pad(LOG.form, 60), zoomMax: 1.5, dur: 6.4,
      text: 'The password is the school’s phone number, unless it has been changed. Then click Sign in.',
      actions: [{ at: 0.4, to: mid(LOG.password), click: true, type: R['l-password'].passwordBox, state: 'l-password' },
                { at: 3.8, to: mid(LOG.signIn), click: true }] },

    // ---------- the wizard ----------
    { chapter: 'Academy Setup Wizard', scroll: 0, state: 'z-welcome', fade: 0.55, cam: pad(union(W0.features, W0.begin), 40), zoomMax: 1.3, hl: W0.features, dur: 7.0,
      text: 'On the first sign-in, the Academy Setup Wizard opens. In eight steps it sets up the school’s academic structure.',
      actions: [{ at: 4.8, to: mid(W0.begin), click: true }] },
    { chapter: 'Wizard: Academy year', state: 'z-session', fade: 0.4, scroll: sessionScroll, cam: pad(S0.sessionBlock, 30), zoomMax: 1.35, dur: 7.6,
      text: 'Name the academic session and set its start and end dates.',
      actions: [
        { at: 0.6, to: mid(S0.sessionName), click: true, type: Z('z-sname').sessionNameBox, state: 'z-sname' },
        { at: 2.6, to: mid(S0.sessionStart), click: true, type: Z('z-sstart').sessionStartBox, state: 'z-sstart' },
        { at: 4.7, to: mid(S0.sessionEnd), click: true, type: Z('z-send').sessionEndBox, state: 'z-send' },
      ] },
    { scroll: semScroll, cam: pad(Z('z-send').semBlock || S0.sessionBlock, 24), zoomMax: 1.35, dur: 11.2,
      text: 'The semester system is switched on, so name each semester and give it dates.',
      actions: [0, 1, 2, 3, 4, 5].map(k => ({ at: 0.8 + k * 1.65, dur: k ? 0.45 : 0.8, to: mid(Z('z-send').sem[k]), click: true, type: Z(`z-sem-${k}`)[`sem${k}`], state: `z-sem-${k}`, typeDur: k % 3 ? 0.9 : 0.8 })) },
    { scroll: topOf('z-sem-5', nextAt('z-sem-5'), 700), cam: pad(nextAt('z-sem-5'), 200), zoomMax: 1.3, dur: 3.2,
      text: 'Click Next step to continue.',
      actions: [{ at: 0.6, to: mid(nextAt('z-sem-5')), click: true }] },

    { chapter: 'Wizard: Mediums, sections and shifts', ...chipSteps('z-medium', 'z-medium', ['English', 'A', 'B'], 'Pick the teaching languages (mediums) and the sections the school uses.') },
    { cam: pad(union(Z('z-medium3').section, Z('z-medium3').next), 30), zoomMax: 1.25, dur: 3.0, text: 'Then click Next step.',
      actions: [{ at: 0.5, to: mid(nextAt('z-medium3')), click: true }] },
    { state: 'z-shifts', fade: 0.35, scroll: 0, cam: pad(union(Z('z-shifts').section, Z('z-shifts').next), 30), zoomMax: 1.25, hl: Z('z-shifts').shiftRow, dur: 6.6,
      text: 'Set the school’s shifts. A Morning shift is ready; add more with Add new shift if you need them.',
      actions: [{ at: 1.0, to: mid(Z('z-shifts').shiftRow) }, { at: 3.0, to: mid(Z('z-shifts').addShift), dur: 0.6 }, { at: 4.9, to: mid(nextAt('z-shifts')), dur: 0.8, click: true }] },

    { chapter: 'Wizard: Streams, classes and subjects', ...chipSteps('z-streams', 'z-streams', ['Science', 'Commerce'], 'Choose the streams offered in the senior classes.'),
      actions: [...chipSteps('z-streams', 'z-streams', ['Science', 'Commerce'], '').actions, { at: 2.9, to: mid(nextAt('z-streams2')), dur: 0.8, click: true }], dur: 4.6 },
    { ...chipSteps('z-classes', 'z-classes', ['Class 1', 'Class 2', 'Class 11'], 'Choose the classes the school teaches.'),
      actions: [...chipSteps('z-classes', 'z-classes', ['Class 1', 'Class 2', 'Class 11'], '').actions, { at: 3.4, to: mid(nextAt('z-classes3')), dur: 0.8, click: true }], dur: 5.0 },
    { ...chipSteps('z-subjects', 'z-subjects', subjectNames, 'Then pick every subject taught at the school.'),
      actions: [...chipSteps('z-subjects', 'z-subjects', subjectNames, '').actions, { at: 5.6, to: mid(nextAt('z-subjects8')), dur: 0.8, click: true }], dur: 7.2 },

    { chapter: 'Wizard: Mapping', state: 'z-map1', fade: 0.4, scroll: 0, cam: pad(union(M1.mediumBlock, M1.infoRow, M1.classTabs['Class 1']), 24), zoomMax: 1.3, hl: union(M1.mediumBlock, M1.infoRow), dur: 6.4,
      text: 'Now map each class. Class 1 uses the English medium and the Morning shift, and doesn’t need a stream.' },
    { scroll: mapScroll('z-map1', M1.subjectBlock), cam: pad(M1.subjectBlock, 24), zoomMax: 1.35, dur: 4.8,
      text: 'Tick the subjects taught in Class 1.',
      actions: ['English', 'Hindi', 'Mathematics', 'Science'].map((n, i) => ({ at: 0.7 + i * 0.7, dur: i ? 0.45 : 0.7, to: mid(M1.subjects[n]), click: true, state: `z-map1-${i + 1}` })) },
    { scroll: 0, cam: pad(union(M1.classTabs['Class 2'], M1.mediumBlock), 30), zoomMax: 1.4, dur: 4.4,
      text: 'Class 2 is set up the same way.',
      actions: [{ at: 0.5, to: mid(M1.classTabs['Class 2']), click: true, state: 'z-map2' }, { at: 2.4, state: 'z-map2-done', fade: 0.3 }] },
    { cam: pad(union(M11.classTabs['Class 11'], M11.infoRow), 24), zoomMax: 1.3, dur: 5.2,
      text: 'Class 11 has streams. Select Science to set up its subjects.',
      actions: [{ at: 0.5, to: mid(M1.classTabs['Class 11']), click: true, state: 'z-map11' }, { at: 2.4, to: mid(M11.streams['Science']), dur: 0.8, click: true, state: 'z-map11-stream' }] },
    { scroll: mapScroll('z-map11-stream', MS.subjectBlock), cam: pad(MS.subjectBlock, 24), zoomMax: 1.35, dur: 4.8,
      text: 'Tick the core subjects for Science.',
      actions: ['English', 'Physics', 'Chemistry', 'Mathematics'].map((n, i) => ({ at: 0.7 + i * 0.7, dur: i ? 0.45 : 0.7, to: mid(MS.subjects[n]), click: true, state: `z-map11-s${i + 1}` })) },
    // the page grows as the group opens: stay at the bottom of the shorter page, then scroll on in the next step
    { scroll: Math.max(0, Z('z-map11-s4').H - 900), cam: [494, 1370, 857, 400], zoomMax: 1.35, dur: 7.2,
      text: 'Add an elective group so each student chooses one of Biology or Computer Science.',
      actions: [
        { at: 0.6, to: mid(Z('z-map11-s4').enableElectives), click: true, state: 'z-elect1' },
        { at: 2.0, to: mid(Z('z-elect1').newGroup), dur: 0.6, click: true, state: 'z-elect2' },
        { at: 3.4, to: mid(e2.addElective), dur: 0.6, click: true, state: 'z-elect3' },
        { at: 4.8, to: mid(Z('z-elect3').addElective), dur: 0.5, click: true, state: 'z-elect4' },
      ] },
    { scroll: Math.min(e4.totalSelect[1] - 260, e4.H - 900), cam: pad(union(e4.totalSelect, e4.next, [e4.electiveBlock[0], e4.electiveBlock[1] + 150, 10, 10]), 30), zoomMax: 1.35, hl: e4.totalSelect, dur: 5.2,
      text: 'Students must pick one subject from this group. Then click Next step.',
      actions: [{ at: 0.8, to: mid(e4.totalSelect) }, { at: 3.2, to: mid(e4.next), dur: 0.8, click: true }] },

    { chapter: 'Wizard: Finish', state: 'z-finish', fade: 0.4, scroll: 0, cam: pad(Z('z-finish').section, 30), zoomMax: 1.25, hl: Z('z-finish').summary, dur: 6.2,
      text: 'Review the summary of your choices, then click Complete setup.',
      actions: [{ at: 3.6, to: mid(Z('z-finish').finalize), dur: 0.8, click: true, state: 'z-finalizing', fade: 0.2 }] },
    { scroll: Z('z-finalizing').vp, cam: pad(Z('z-finalizing').progressList || Z('z-finalizing').section, 40), zoomMax: 1.4, hl: Z('z-finalizing').progressList, dur: 5.4,
      text: 'The wizard creates the session, mediums, classes and subjects for the school.' },
    { scroll: 0, state: 'z-dashboard', fade: 0.6, cam: 'full', hl: Z('z-dashboard').kpis, dur: 6.8,
      text: 'Then the school admin lands on the school’s dashboard, ready to add teachers and students.' },
  ];
}

