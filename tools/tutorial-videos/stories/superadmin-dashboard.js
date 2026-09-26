// Super Admin > Dashboard tutorial. Element positions come from the capture (cache/superadmin-dashboard/*.json),
// so re-capturing after a UI change keeps the cursor, zoom and highlights on target.
window.buildStory = async () => {
  const j = async n => (await fetch(`cache/superadmin-dashboard/${n}.json`)).json();
  const R = await j('base'), C = await j('collapsed'), PO = await j('profile-open');
  const mid = r => [r[0] + r[2] / 2, r[1] + r[3] / 2];
  const kpi = R.kpi, may = R.bars[4];
  const donut = [1512, 564];                                  // on the ring of the largest slice
  const exScroll = R.ex[1] - 70 - 40, bottom = R.H - 900;

  return {
    id: 'superadmin-dashboard',
    overline: 'SUPER ADMIN  ·  TUTORIAL 01',
    title: 'Dashboard',
    subtitle: 'See your whole platform at a glance',
    learn: ['Read the summary cards', 'Explore the transaction and package charts', 'Track expiring subscriptions and new schools', 'Search the menu, switch theme and open your profile'],
    doneTitle: 'That’s your Dashboard',
    recap: ['Summary cards for schools, plans and revenue', 'Charts you can hover over and download', 'Renewals to follow up and newly joined schools', 'Menu search, dark mode and the profile menu'],
    next: 'Profile',
    posterAt: 4.2,
    layout: { side: 280, top: 70, dpr: 2 },
    states: Object.fromEntries(['base', 'hover-bar', 'chart-menu', 'hover-donut', 'profile-open', 'search', 'collapsed', 'dark']
      .map(s => [s, `cache/superadmin-dashboard/${s}.png`])),
    steps: [
      { chapter: 'Overview', cam: 'full', state: 'base',
        text: 'After you sign in, the Dashboard opens first. It gives you a live summary of your whole platform.',
        actions: [{ at: 0.6, to: [860, 520], dur: 1.1 }] },

      { chapter: 'Summary cards', cam: kpi[0], hl: kpi[0], zoomMax: 1.75,
        text: 'Total schools shows every school on your platform, and how many joined this month.',
        actions: [{ at: 0.5, to: mid(kpi[0]) }] },
      { cam: kpi[1], hl: kpi[1], zoomMax: 1.75,
        text: 'Active plans counts the schools that have a running subscription.',
        actions: [{ at: 0.3, to: mid(kpi[1]) }] },
      { cam: kpi[2], hl: kpi[2], zoomMax: 1.75,
        text: 'Monthly revenue is this month’s subscription income, compared with last month.',
        actions: [{ at: 0.3, to: mid(kpi[2]) }] },
      { cam: kpi[3], hl: kpi[3], zoomMax: 1.75,
        text: 'Active packages shows the packages schools can buy, and how many add-ons are available.',
        actions: [{ at: 0.3, to: mid(kpi[3]) }] },

      { chapter: 'Transaction chart', cam: R.tx, zoomMax: 1.6,
        text: 'The Transaction chart shows the subscription payments received each month. Hover over a bar to see the exact amount.',
        actions: [{ at: 1.3, to: [may[0] + may[2] / 2, may[1] + 70], dur: 1.0, state: 'hover-bar' }] },
      { cam: R.tx, zoomMax: 1.6, hl: R.txYear,
        text: 'Use the year filter to see the transactions of another year.',
        actions: [{ at: 0.3, to: mid(R.txYear), state: 'base' }] },
      { cam: R.tx, zoomMax: 1.6,
        text: 'Open the chart menu to download the chart as SVG or PNG, or the data as CSV.',
        actions: [{ at: 0.3, to: mid(R.txMenu), click: true, state: 'chart-menu' }] },

      { chapter: 'Trending packages', cam: R.tp, zoomMax: 1.7, state: 'base',
        text: 'Trending Packages shows which packages schools choose most. The legend shows which colour is which package.',
        actions: [{ at: 1.0, to: donut, state: 'hover-donut' }] },

      { chapter: 'Expiring soon', scroll: exScroll, cam: R.ex, hl: R.ex, zoomMax: 1.8, state: 'base',
        text: 'Expiring Soon lists the subscriptions that end first, so you can remind schools to renew on time.',
        actions: [{ at: 0.9, to: mid(R.ex) }] },
      { cam: R.ex, zoomMax: 1.8, hl: R.exViewAll,
        text: 'Click View all to open the complete subscription list.',
        actions: [{ at: 0.3, to: mid(R.exViewAll) }] },

      { chapter: 'Recent schools', cam: R.rs, hl: R.rs, zoomMax: 1.8,
        text: 'Recent Schools shows the newest schools on your platform and whether each one is verified.',
        actions: [{ at: 0.4, to: mid(R.rs) }] },

      { chapter: 'Addon usage', scroll: bottom, cam: R.ad, hl: R.ad, zoomMax: 1.3,
        text: 'The Addon chart shows how many schools are using each add-on.',
        actions: [{ at: 0.9, to: mid(R.ad) }] },

      { chapter: 'Navigation', scroll: 0, cam: [0, 0, 440, 380], camFixed: true, zoomMax: 2.0,
        text: 'Looking for a page? Type in Search menu and the sidebar filters instantly.',
        actions: [{ at: 1.0, to: mid(R.search), fixed: true, click: true, state: 'search' }] },
      { cam: 'full', state: 'base',
        text: 'Click the menu icon to collapse the sidebar and give your pages more room. Click it again to expand it.',
        actions: [
          { at: 0.9, to: mid(R.toggler), fixed: true, click: true, state: 'collapsed' },
          { at: 4.0, to: mid(C.toggler), fixed: true, dur: 0.5, click: true, state: 'base' },
        ] },

      { chapter: 'Theme and language', cam: 'full',
        text: 'Switch between light and dark mode with a single click.',
        actions: [
          { at: 0.3, to: mid(R.theme), fixed: true, click: true, state: 'dark' },
          { at: 3.6, to: mid(R.theme), fixed: true, dur: 0.2, click: true, state: 'base' },
        ] },
      { cam: [1150, 0, 450, 220], camFixed: true, zoomMax: 2.0, hl: R.lang, hlFixed: true,
        text: 'Use the language menu to change the language of the panel.',
        actions: [{ at: 0.6, to: mid(R.lang), fixed: true }] },

      { chapter: 'Profile menu', cam: [1150, 0, 450, 330], camFixed: true, zoomMax: 1.9,
        text: 'Click your name to open the profile menu: Profile, Change password, Cache clear and Sign out.',
        actions: [{ at: 0.3, to: mid(R.profile), fixed: true, click: true, state: 'profile-open' }] },
      { cam: [1150, 0, 450, 330], camFixed: true, zoomMax: 1.9, hl: PO.profileMenu, hlFixed: true, dur: 4.6,
        text: 'Next, we’ll look at your Profile settings.',
        actions: [{ at: 0.4, to: [PO.profileMenu[0] + 60, PO.profileMenu[1] + 30], fixed: true }] },
    ],
  };
};
