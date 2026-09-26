// Captures the Super Admin > Personnel management > Role & permission tutorial:
// create a role with permissions, then View, Edit and Delete (the delete dialog is cancelled, so the role
// stays for the Staff tutorial). An earlier copy of the tutorial role is removed first.
// Run: node tools/tutorial-videos/captures/superadmin-role-permission.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { session, panelUrl } from '../lib/session.mjs';
import { tidyScript } from '../lib/tidy.mjs';
import { kit, J } from '../lib/capture-kit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'cache/superadmin-role-permission');
export const ROLE = { name: 'Onboarding Manager', groups: ['schools'], perms: ['contact-inquiry-list', 'package-list', 'subscription-view'], editAdd: 'staff-list' };

const b = await session(9900, 1600, 900, 2);
console.log('login ->', await b.login());
// Hide this server's leftover test roles in the recording (nothing is deleted). Visible rows are renumbered
// and the "Showing" counter matches, so the list reads naturally.
const roleTidy = `(()=>{
  let n = 0;
  document.querySelectorAll('.bootstrap-table tbody tr').forEach(r => {
    if (/test/i.test((r.children[1]||{}).innerText||'')) { r.style.display = 'none'; return; }
    if (r.children.length > 1 && !r.classList.contains('no-records-found')) { n++; r.children[0].innerText = n; }
  });
  document.querySelectorAll('.pagination-info').forEach(p => { if (n) p.innerText = 'Showing 1 to ' + n + ' of ' + n + ' rows'; });
  return 1;
})()`;
const K = kit(b, { out: OUT, tidy: [roleTidy, tidyScript(ROOT)] });
const { sleep, ev, jsClick, setField, blur, waitFor, waitTable, waitToast, waitSwal, clearToasts, closeMenus, scrollToEl, setTargets, snap } = K;

const go = async (p, ready = `document.querySelector('.content-wrapper')`) => {
  b.send('Page.navigate', { url: panelUrl() + p });
  await waitFor(`document.readyState==='complete' && ${ready}`, 60000, 500); await sleep(1200); await K.runTidy();
};
const rowOf = (name) => `row(new RegExp('^\\\\s*' + ${J(name)} + '\\\\s*$'))`;
const roleRow = `[...document.querySelectorAll('.bootstrap-table tbody tr')].find(tr=>(tr.children[1]||{}).innerText&&tr.children[1].innerText.trim()===${J(ROLE.name)})`;
const perm = (p) => `[...document.querySelectorAll('.child-checkbox')].find(c=>c.closest('label').innerText.trim()===${J(p)})`;
const group = (g) => `document.getElementById('checkbox-${g}')`;

// 0. clean start
await go('roles'); await waitTable();
for (let k = 0; k < 3 && await ev(`!!(${roleRow})`, false); k++) {
  await jsClick(`${roleRow}.querySelector('.btn-action-edit')`); await sleep(700);
  await jsClick(`[...document.querySelectorAll('.dropdown-menu.show a')].find(a=>/Delete/.test(a.innerText))`); await closeMenus();
  await waitSwal(); await jsClick(`document.querySelector('.swal2-confirm')`); await waitToast(); await clearToasts(); await sleep(1200); await waitTable();
}
console.log('cleanup done');

const LIST = {
  navRoles: `[...document.querySelectorAll('.sidebar a')].find(a=>a.innerText.trim()==='Role & permission')`,
  navPersonnel: `[...document.querySelectorAll('.sidebar .nav-link')].find(a=>/Personnel management/.test(a.innerText))`,
  createBtn: `[...document.querySelectorAll('.content-wrapper a, .content-wrapper button')].find(x=>/Create new role/i.test(x.innerText))`,
  listCard: `[...document.querySelectorAll('.content-wrapper .card')].find(c=>c.querySelector('.bootstrap-table'))`,
  row: roleRow, rowAction: `${roleRow} && ${roleRow}.querySelector('.btn-action-edit')`,
  menu: `q('.dropdown-menu.show')`,
  menuView: `[...document.querySelectorAll('.dropdown-menu.show a')].find(a=>/View/.test(a.innerText))`,
  menuEdit: `[...document.querySelectorAll('.dropdown-menu.show a')].find(a=>/Edit/.test(a.innerText))`,
  menuDelete: `[...document.querySelectorAll('.dropdown-menu.show a')].find(a=>/Delete/.test(a.innerText))`,
  swal: `q('.swal2-popup')`, swalConfirm: `q('.swal2-confirm')`, swalCancel: `q('.swal2-cancel')`, toast: `q('.jq-toast-single')`,
};
const FORM = {
  ...LIST,
  formCard: `[...document.querySelectorAll('.content-wrapper .card')].find(c=>c.querySelector('form'))`,
  name: `q('.content-wrapper form [name=name]')`, back: `[...document.querySelectorAll('.content-wrapper a, .content-wrapper button')].find(x=>/^Back$/i.test(x.innerText.trim()))`,
  selectAll: `q('#selectall') && q('#selectall').closest('.form-check, div')`,
  permTitle: `[...document.querySelectorAll('.content-wrapper form *')].find(e=>e.offsetParent&&e.children.length===0&&/^Permissions:?$/.test(e.innerText.trim()))`,
  groupSchools: `q('#checkbox-schools') && q('#checkbox-schools').closest('.form-check')`,
  blockSchools: `q('#checkbox-schools') && q('#checkbox-schools').closest('.col-sm-12, .col-md-12')`,
  blockContact: `q('#checkbox-contact') && q('#checkbox-contact').closest('.col-sm-12, .col-md-12')`,
  blockPackage: `q('#checkbox-package') && q('#checkbox-package').closest('.col-sm-12, .col-md-12')`,
  blockSubscription: `q('#checkbox-subscription') && q('#checkbox-subscription').closest('.col-sm-12, .col-md-12')`,
  blockStaff: `q('#checkbox-staff') && q('#checkbox-staff').closest('.col-sm-12, .col-md-12')`,
  permContact: `${perm('contact-inquiry-list')} && ${perm('contact-inquiry-list')}.closest('.form-check')`,
  permPackage: `${perm('package-list')} && ${perm('package-list')}.closest('.form-check')`,
  permSubscription: `${perm('subscription-view')} && ${perm('subscription-view')}.closest('.form-check')`,
  permStaff: `${perm('staff-list')} && ${perm('staff-list')}.closest('.form-check')`,
  submit: `q('.content-wrapper form [type=submit]')`,
  viewCard: `[...document.querySelectorAll('.content-wrapper .card')].find(c=>/Name:/.test(c.innerText))`,
};
setTargets(FORM, { nameBox: `q('.content-wrapper form [name=name]')` });

// 1. the list
await go('roles'); await waitTable(); await snap('r-list');
// 2. create
await jsClick(LIST.createBtn); await waitFor(`document.querySelector('.content-wrapper form [name=name]')`, 60000, 400); await sleep(1500); await K.runTidy();
await snap('r-create');
await setField('.content-wrapper form [name=name]', ROLE.name); await blur(); await snap('r-name');
await jsClick(group('schools')); await sleep(400); await snap('r-schools');
await jsClick(perm('contact-inquiry-list')); await sleep(300); await snap('r-contact');
await jsClick(perm('package-list')); await sleep(300); await snap('r-package');
await jsClick(perm('subscription-view')); await sleep(300); await snap('r-subscription');
await ev(`scrollTo(0, document.documentElement.scrollHeight); 1`); await sleep(300);
await clearToasts(); await jsClick(FORM.submit); await waitToast(); await snap('r-create-toast', { viewport: true });
console.log('create:', (await ev(`(document.querySelector('.jq-toast-single')||{}).innerText||''`, '')).replace(/\s+/g, ' '));
await clearToasts();
// 3. back to the list, the new role and its menu
await go('roles'); await waitTable(`/${ROLE.name}/`); await snap('r-list2');
await jsClick(LIST.rowAction); await sleep(800); await snap('r-menu');
// View
await jsClick(LIST.menuView); await closeMenus(); await waitFor(`/roles\\/\\d+$/.test(location.pathname) && document.querySelector('.content-wrapper')`, 60000, 400); await sleep(1500);
await snap('r-view');
// Edit: add one more permission
await go('roles'); await waitTable(`/${ROLE.name}/`);
await jsClick(LIST.rowAction); await sleep(800); await snap('r-menu2');
await jsClick(LIST.menuEdit); await closeMenus(); await waitFor(`/edit$/.test(location.pathname) && document.querySelector('.content-wrapper form')`, 60000, 400); await sleep(1500);
await snap('r-edit');
await jsClick(perm(ROLE.editAdd)); await sleep(300); await snap('r-edit-staff');
await ev(`scrollTo(0, document.documentElement.scrollHeight); 1`); await sleep(300);
await clearToasts(); await jsClick(FORM.submit); await waitToast(); await snap('r-edit-toast', { viewport: true });
console.log('edit:', (await ev(`(document.querySelector('.jq-toast-single')||{}).innerText||''`, '')).replace(/\s+/g, ' '));
await clearToasts();
// Delete dialog (cancelled: the role is kept for the Staff tutorial)
await go('roles'); await waitTable(`/${ROLE.name}/`);
await jsClick(LIST.rowAction); await sleep(800); await snap('r-menu3');
await jsClick(LIST.menuDelete); await closeMenus(); await waitSwal(); await snap('r-delete', { viewport: true });
await jsClick(LIST.swalCancel); await sleep(800); await snap('r-kept');
console.log('role kept:', await ev(`!!(${roleRow})`, false));
b.close();
process.exit(0);
