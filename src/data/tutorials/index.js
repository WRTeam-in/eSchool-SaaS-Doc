/**
 * Video tutorial registry: the single source for the Tutorials section.
 * The library page, the cards and every player page are generated from these entries.
 *
 * Adding a tutorial:
 *   1. Render it with tools/tutorial-videos. That writes the MP4 to static/video/tutorials/,
 *      the poster to static/images/tutorials/ and chapters to ./chapters/<id>.json.
 *   2. Add an entry to TUTORIALS below (or flip a "coming-soon" entry to published).
 *   3. Add a page under tutorials/<section>/ that renders <TutorialPlayer id="<id>" />.
 */
import productOverview from './chapters/product-overview.json';
import superadminDashboard from './chapters/superadmin-dashboard.json';
import superadminProfile from './chapters/superadmin-profile.json';
import superadminManageSchools from './chapters/superadmin-manage-schools.json';
import superadminSchoolInquiries from './chapters/superadmin-school-inquiries.json';
import superadminRolePermission from './chapters/superadmin-role-permission.json';
import superadminStaff from './chapters/superadmin-staff.json';

export const SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting started',
    description: 'New to eSchool SaaS? Start with a quick tour of the whole product.',
    icon: 'fa-solid fa-rocket',
  },
  {
    id: 'super-admin',
    title: 'Super Admin',
    description: 'Run your platform: the dashboard, schools, packages, subscriptions and settings.',
    icon: 'fa-solid fa-user-shield',
  },
  {
    id: 'school-admin',
    title: 'School Admin',
    description: 'Day-to-day school management, one feature at a time.',
    icon: 'fa-solid fa-school',
  },
];

export const TUTORIALS = [
  {
    id: 'product-overview',
    section: 'getting-started',
    title: 'Product overview',
    summary: 'A quick tour of eSchool SaaS: the problems it solves, the admin panels, the mobile apps and the school website.',
    page: '/tutorials/getting-started/product-overview/',
    video: '/video/tutorials/product-overview.mp4',
    poster: '/images/tutorials/product-overview.jpg',
    duration: productOverview.duration,
    chapters: productOverview.chapters,
    hasMusic: true,
    featured: true,
  },
  {
    id: 'superadmin-dashboard',
    section: 'super-admin',
    title: 'Dashboard',
    summary: 'Read the summary cards and charts, follow up on expiring subscriptions, and use menu search, dark mode and the profile menu.',
    page: '/tutorials/super-admin/dashboard/',
    docs: '/superadmin/dashboard/',
    video: '/video/tutorials/superadmin-dashboard.mp4',
    poster: '/images/tutorials/superadmin-dashboard.jpg',
    duration: superadminDashboard.duration,
    chapters: superadminDashboard.chapters,
    learn: [
      'What each summary card (schools, plans, revenue, packages) tells you',
      'How to read the Transaction chart and download it as SVG, PNG or CSV',
      'Where to find subscriptions that are about to expire and newly joined schools',
      'How to search the menu, collapse the sidebar, switch theme and open your profile menu',
    ],
  },
  {
    id: 'superadmin-profile',
    section: 'super-admin',
    title: 'Profile',
    summary: 'Update your name, mobile number, date of birth, photo and address, then change your password.',
    page: '/tutorials/super-admin/profile/',
    docs: '/superadmin/authentication/',
    video: '/video/tutorials/superadmin-profile.mp4',
    poster: '/images/tutorials/superadmin-profile.jpg',
    duration: superadminProfile.duration,
    chapters: superadminProfile.chapters,
    learn: [
      'How to open your profile from the menu at the top right',
      'How to update your name, pick a country code and enter your mobile number',
      'How to set your date of birth, upload a profile photo and add your address',
      'What two factor verification does, and how to change your password',
    ],
  },
  {
    id: 'superadmin-manage-schools',
    section: 'super-admin',
    title: 'Manage schools',
    summary: 'The complete journey: create a school, manage it, assign a plan, open its website, sign in as the school admin and complete the Academy Setup Wizard.',
    page: '/tutorials/super-admin/manage-schools/',
    docs: '/superadmin/schools/manage-schools/',
    video: '/video/tutorials/superadmin-manage-schools.mp4',
    poster: '/images/tutorials/superadmin-manage-schools.jpg',
    duration: superadminManageSchools.duration,
    chapters: superadminManageSchools.chapters,
    learn: [
      'How to create a school with its logo, contact details, school code and domain, and follow its setup',
      'How to manage the school admin, edit the school, switch it Inactive or Active, and delete and restore it',
      'Why a new school needs a plan, and how to assign one',
      'How to open the school’s website from its Default domain URL and sign in as the school admin',
      'How to complete the Academy Setup Wizard: session, mediums, sections, shifts, streams, classes, subjects and mapping',
    ],
  },
  {
    id: 'superadmin-school-inquiries',
    section: 'super-admin',
    title: 'School inquiries',
    summary: 'See what Start trial on your website does with School inquiry ON (approve or reject each request) and OFF (the school is created straight away).',
    page: '/tutorials/super-admin/school-inquiries/',
    docs: '/superadmin/schools/school-inquiries/',
    video: '/video/tutorials/superadmin-school-inquiries.mp4',
    poster: '/images/tutorials/superadmin-school-inquiries.jpg',
    duration: superadminSchoolInquiries.duration,
    chapters: superadminSchoolInquiries.chapters,
    learn: [
      'Where the School inquiry setting is and what switching it ON or OFF changes',
      'How a school requests a trial from your website’s Start trial form',
      'How to review a request, approve it (the school is created) or reject it',
      'What happens when School inquiry is OFF: the school is created straight away, with no approval',
    ],
  },
  {
    id: 'superadmin-role-permission',
    section: 'super-admin',
    title: 'Role & permission',
    summary: 'Create a role for your Super Admin staff, choose its permissions by module or one by one, then view, edit and delete roles.',
    page: '/tutorials/super-admin/role-permission/',
    docs: '/superadmin/personnel-management/role-permission/',
    video: '/video/tutorials/superadmin-role-permission.mp4',
    poster: '/images/tutorials/superadmin-role-permission.jpg',
    duration: superadminRolePermission.duration,
    chapters: superadminRolePermission.chapters,
    learn: [
      'Where Role & permission is, and which built-in roles aren’t listed there',
      'How to create a role and give it a whole module, or single permissions',
      'How to view a role’s permissions and edit them',
      'How to delete a role, or cancel and keep it',
    ],
  },
  {
    id: 'superadmin-staff',
    section: 'super-admin',
    title: 'Staff',
    summary: 'Add a staff member with a role, their details and the schools they look after, then see what they can use when they sign in.',
    page: '/tutorials/super-admin/staff/',
    docs: '/superadmin/personnel-management/staff/',
    video: '/video/tutorials/superadmin-staff.mp4',
    poster: '/images/tutorials/superadmin-staff.jpg',
    duration: superadminStaff.duration,
    chapters: superadminStaff.chapters,
    learn: [
      'How to add a staff member and choose their role',
      'How to enter their mobile number, email, photo and date of birth',
      'How to assign the schools they look after',
      'How a staff member signs in, and what their role lets them use',
    ],
  },
  {
    id: 'superadmin-packages',
    section: 'super-admin',
    title: 'Packages',
    summary: 'Create prepaid and postpaid packages for schools, choose their features, and publish them.',
    status: 'coming-soon',
  },
];

export const isPublished = (t) => t.status !== 'coming-soon';
export const getTutorial = (id) => TUTORIALS.find((t) => t.id === id);
export const getSection = (id) => SECTIONS.find((s) => s.id === id);

export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
