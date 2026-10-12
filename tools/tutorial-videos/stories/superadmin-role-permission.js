// Super Admin > Personnel management > Role & permission: create a role with permissions, view, edit, delete.
// Positions come from the capture (cache/superadmin-role-permission/*.json).
window.buildStory = async () => {
  const dir = 'cache/superadmin-role-permission';
  const names = ['r-list', 'r-create', 'r-name', 'r-schools', 'r-contact', 'r-package', 'r-subscription', 'r-create-toast',
    'r-list2', 'r-menu', 'r-view', 'r-menu2', 'r-edit', 'r-edit-staff', 'r-edit-toast', 'r-menu3', 'r-delete', 'r-kept'];
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
  const C = R['r-create'], E = R['r-edit'], L2 = R['r-list2'];
  const at = (n, rect, margin = 230) => Math.max(0, Math.min(rect[1] - margin, R[n].H - 900));   // scroll so rect sits in the upper part
  const topRight = (vp) => [1080, vp, 520, 280];

  return {
    id: 'superadmin-role-permission',
    overline: 'SUPER ADMIN  ·  TUTORIAL 05',
    title: 'Role & permission',
    subtitle: 'Decide what each staff member can do',
    learn: ['Create a role and name it', 'Give whole modules or single permissions', 'View and edit a role', 'Delete a role you no longer need'],
    doneTitle: 'Your role is ready',
    recap: ['Onboarding Manager role created', 'Permissions chosen by module and one by one', 'Role viewed, edited and kept'],
    next: 'Staff',
    posterAt: 4.2,
    previewState: 'r-subscription',
    layout: { side: 280, top: 70, dpr: 2 },
    states: Object.fromEntries(names.map(n => [n, R[n].viewport ? { src: `${dir}/${n}.png`, viewport: true } : `${dir}/${n}.png`])),
    steps: [
      // ---------- open ----------
      { chapter: 'Open Role & permission', state: 'r-list', cam: 'full', hl: R['r-list'].navRoles, hlFixed: true, dur: 6.4,
        text: 'Roles decide what each Super Admin staff member can see and do. Go to Personnel management › Role & permission.',
        actions: [{ at: 1.0, to: mid(R['r-list'].navRoles), fixed: true }] },
      { cam: union(R['r-list'].listCard, R['r-list'].createBtn), zoomMax: 1.4, hl: R['r-list'].createBtn, dur: 6.6,
        text: 'Your roles are listed here. The built-in roles, such as School Admin, Teacher and Student, aren’t listed. Click Create new role.',
        actions: [{ at: 4.4, to: mid(R['r-list'].createBtn), click: true }] },

      // ---------- create ----------
      { chapter: 'Create a role', state: 'r-create', fade: 0.45, scroll: 0, cam: pad(union(C.name, C.selectAll), 60), zoomMax: 1.5, dur: 5.2,
        text: 'Give the role a name, for example Onboarding Manager.',
        actions: [{ at: 0.8, to: mid(C.name), click: true, type: R['r-name'].nameBox, state: 'r-name' }] },
      { cam: pad(union(C.selectAll, C.permTitle || C.selectAll, C.blockContact ? [C.selectAll[0], C.selectAll[1], 10, 260] : C.selectAll), 50), zoomMax: 1.5, hl: C.selectAll, dur: 5.6,
        text: 'Permissions are grouped by module. Select all gives every permission at once.',
        actions: [{ at: 1.0, to: mid(C.selectAll) }] },
      { scroll: at('r-create', C.blockSchools), cam: pad(C.blockSchools, 30), zoomMax: 1.45, dur: 6.4,
        text: 'Tick a module’s name to give every permission in it. Here, all of Schools: create, delete, edit and list.',
        actions: [{ at: 1.2, to: mid(C.groupSchools), click: true, state: 'r-schools' }] },
      { scroll: at('r-create', C.blockContact), cam: pad(C.blockContact, 30), zoomMax: 1.45, dur: 4.8,
        text: 'Or tick single permissions. This role can see contact inquiries,',
        actions: [{ at: 1.2, to: mid(C.permContact), click: true, state: 'r-contact' }] },
      { scroll: at('r-create', C.blockPackage), cam: pad(C.blockPackage, 30), zoomMax: 1.45, dur: 3.8,
        text: 'the package list,',
        actions: [{ at: 1.1, to: mid(C.permPackage), click: true, state: 'r-package' }] },
      { scroll: at('r-create', C.blockSubscription), cam: pad(C.blockSubscription, 30), zoomMax: 1.45, dur: 4.0,
        text: 'and schools’ subscriptions.',
        actions: [{ at: 1.1, to: mid(C.permSubscription), click: true, state: 'r-subscription' }] },
      { scroll: R['r-create-toast'].vp, cam: pad(union(C.submit, [C.submit[0] - 500, C.submit[1] - 200, 10, 10]), 40), zoomMax: 1.5, dur: 3.6,
        text: 'Then click Submit to save the role.',
        actions: [{ at: 0.9, to: mid(C.submit), click: true, state: 'r-create-toast' }] },
      { cam: topRight(R['r-create-toast'].vp), zoomMax: 1.8, hl: R['r-create-toast'].toast, dur: 3.4,
        text: 'The role is saved.' },

      // ---------- view ----------
      { chapter: 'View a role', scroll: 0, state: 'r-list2', fade: 0.5, cam: union(L2.listCard, R['r-menu'].menu), zoomMax: 1.4, hl: L2.row, dur: 6.4,
        text: 'The new role is in the list. Use its ⋮ menu to view, edit or delete it. Choose View.',
        actions: [{ at: 2.4, to: mid(L2.rowAction), click: true, state: 'r-menu' }, { at: 4.2, to: mid(R['r-menu'].menuView), dur: 0.6, click: true }] },
      { state: 'r-view', fade: 0.45, cam: pad(R['r-view'].viewCard, 20), zoomMax: 1.3, hl: R['r-view'].viewCard, dur: 5.4,
        text: 'View shows the role’s name and its permissions, grouped by module.' },

      // ---------- edit ----------
      { chapter: 'Edit a role', state: 'r-list2', fade: 0.45, cam: union(L2.listCard, R['r-menu2'].menu), zoomMax: 1.4, dur: 4.6,
        text: 'To change a role’s permissions, choose Edit.',
        actions: [{ at: 0.6, to: mid(L2.rowAction), click: true, state: 'r-menu2' }, { at: 2.4, to: mid(R['r-menu2'].menuEdit), dur: 0.6, click: true }] },
      { scroll: at('r-edit', E.blockStaff), state: 'r-edit', fade: 0.45, cam: pad(E.blockStaff, 30), zoomMax: 1.45, dur: 6.2,
        text: 'Its permissions are already ticked. Add or remove any, for example staff-list, to let the role see your staff.',
        actions: [{ at: 2.8, to: mid(E.permStaff), click: true, state: 'r-edit-staff' }] },
      { scroll: R['r-edit-toast'].vp, cam: pad(union(E.submit, [E.submit[0] - 500, E.submit[1] - 200, 10, 10]), 40), zoomMax: 1.5, dur: 3.4,
        text: 'Click Submit to save.',
        actions: [{ at: 0.8, to: mid(E.submit), click: true, state: 'r-edit-toast' }] },
      { cam: topRight(R['r-edit-toast'].vp), zoomMax: 1.8, hl: R['r-edit-toast'].toast, dur: 3.2,
        text: 'The role is updated.' },

      // ---------- delete ----------
      { chapter: 'Delete a role', scroll: 0, state: 'r-list2', fade: 0.5, cam: union(L2.listCard, R['r-menu3'].menu), zoomMax: 1.4, dur: 4.4,
        text: 'To remove a role, choose Delete.',
        actions: [{ at: 0.6, to: mid(L2.rowAction), click: true, state: 'r-menu3' }, { at: 2.4, to: mid(R['r-menu3'].menuDelete), dur: 0.6, click: true }] },
      { state: 'r-delete', fade: 0.3, cam: R['r-delete'].swal, zoomMax: 1.35, dur: 5.4,
        text: 'Confirm to delete it for good, or click Cancel to keep it.',
        actions: [{ at: 1.2, to: mid(R['r-delete'].swalConfirm), dur: 0.7 }, { at: 3.0, to: mid(R['r-delete'].swalCancel), dur: 0.6, click: true }] },
      { state: 'r-kept', fade: 0.4, cam: union(R['r-kept'].listCard, R['r-kept'].row), zoomMax: 1.4, hl: R['r-kept'].row, dur: 5.6,
        text: 'We’ll keep Onboarding Manager. Next, you can give this role to a staff member.' },
    ],
  };
};
