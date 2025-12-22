// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "eSchool SaaS Documentation",
  tagline: "Documentation for eSchool SaaS Installation, Setup and Usage",
  favicon: "images/logo/logo.png",

  // Set the production url of your site here
  url: "https://wrteam-in.github.io", // Your GitHub Pages URL
  baseUrl: "/eSchool-SaaS-Doc/", // The repository name, preceded by a slash
  organizationName: "WRTeam-in", // Your GitHub username
  projectName: "eSchool-SaaS-Doc", // Your repository name
  trailingSlash: true,
  deploymentBranch: "gh-pages", // Deployment branch for GitHub Pages
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // Add local search plugin with a unique ID to avoid conflicts
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "installation",
        path: "installation", // Folder with markdown files
        routeBasePath: "installation", // URL path
        sidebarPath: require.resolve("./installationSidebar.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "schooladmin",
        path: "schooladmin", // Another folder
        routeBasePath: "schooladmin",
        sidebarPath: require.resolve("./schooladminSidebar.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "superadmin",
        path: "superadmin", // Another folder
        routeBasePath: "superadmin",
        sidebarPath: require.resolve("./superadminSidebar.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "changelog",
        path: "changelog",
        routeBasePath: "changelog",
        sidebarItemsGenerator: async () => [],
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "newfeatures",
        path: "newfeatures",
        routeBasePath: "newfeatures",
        sidebarPath: require.resolve("./newfeaturesSidebar.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "studentweb",
        path: "studentweb",
        routeBasePath: "studentweb",
        sidebarPath: require.resolve("./studentwebSidebar.js"),
      },
    ],
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "images/logo/transparent_logo.svg",
      navbar: {
        title: "eSchool SaaS",
        logo: {
          alt: "eSchool SaaS Logo",
          src: "images/logo/transparent_logo.svg",
        },
        items: [
          {
            type: "doc",
            docsPluginId: "installation",
            docId: "intro",
            position: "left",
            label: "Introduction",
          },
          {
            docsPluginId: "installation",
            type: "docSidebar",
            sidebarId: "adminPanelSidebar",
            position: "left",
            label: "Admin Installation",
          },

          {
            docsPluginId: "installation",
            type: "docSidebar",
            sidebarId: "appInstallationSidebar",
            position: "left",
            label: "App Installation",
          },
          {
            docsPluginId: "newfeatures",
            type: "docSidebar",
            sidebarId: "newfeaturesSidebar",
            position: "left",
            label: "New Features",
          },
          {
            docsPluginId: "superadmin",
            type: "docSidebar",
            sidebarId: "superadminSidebar",
            position: "left",
            label: "Super Admin",
          },
          {
            docsPluginId: "schooladmin",
            type: "docSidebar",
            sidebarId: "schooladminSidebar",
            position: "left",
            label: "School Admin",
          },
          {
            docsPluginId: "studentweb",
            type: "docSidebar",
            sidebarId: "studentwebSidebar",
            position: "left",
            label: "Student Web",
          },
          {
            type: "doc",
            docsPluginId: "installation",
            docId: "faqs",
            position: "left",
            label: "FAQs",
          },
          {
            type: "doc",
            docsPluginId: "installation",
            docId: "help-and-support",
            position: "left",
            label: "Support",
          },
          {
            docId: "index",
            docsPluginId: "changelog",
            type: "doc",
            position: "left",
            label: "Changelog",
          },
          {
            type: "search",
            position: "right",
          },
          {
            href: "https://www.wrteam.in/",
            label: "WRTeam",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} WRTeam. All rights reserved.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      colorMode: {
        defaultMode: "light",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),

      {
        hashed: true,
        docsRouteBasePath: [
          "installation",
          "superadmin",
          "schooladmin",
          "newfeatures",
          "studentweb",
        ],
        docsDir: [
          "installation",
          "superadmin",
          "schooladmin",
          "newfeatures",
          "studentweb",
        ],
        docsPluginIdForPreferredVersion: "installation",
      },
    ],
  ],

  // Add Font Awesome for icons
  stylesheets: [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
  ],
};

export default config;
