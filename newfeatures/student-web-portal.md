---
id: student-web-portal
title: Student Web Portal
hide_title: true
sidebar_position: 2
sidebar_label: Student Web Portal
---

import Link from '@docusaurus/Link';

<style>{`
  /* ── Keyframes ───────────────────────────────────────── */
  @keyframes swp-fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes swp-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.55); }
    60%       { box-shadow: 0 0 0 9px rgba(74, 222, 128, 0); }
  }
  @keyframes swp-gradientMove {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes swp-cardIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes swp-dotBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }

  /* ── Hero ────────────────────────────────────────────── */
  .swp-hero {
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    padding: 52px 48px 44px;
    margin-bottom: 40px;
    background: linear-gradient(135deg, #163a53 0%, #1e5070 45%, #205479 100%);
    background-size: 200% 200%;
    animation: swp-gradientMove 8s ease infinite;
    color: #fff;
  }
  /* subtle radial glow top-right */
  .swp-hero::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -60px;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(74,156,214,0.28) 0%, transparent 70%);
    pointer-events: none;
  }
  /* decorative dot grid bottom-left */
  .swp-hero::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200px;
    height: 160px;
    background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1.5px, transparent 1.5px);
    background-size: 18px 18px;
    pointer-events: none;
  }

  .swp-hero-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  /* Badge — inline-block + text-align:center = guaranteed centered text */
  .swp-badge {
    position: relative;
    display: inline-block;
    text-align: center;
    /* symmetric padding; dot lives in ::before, does not affect layout */
    padding: 6px 24px 6px 24px;
    border-radius: 999px;
    background: rgba(74, 222, 128, 0.12);
    border: 1.5px solid rgba(74, 222, 128, 0.5);
    color: #86efac;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    margin-bottom: 20px;
    animation: swp-fadeUp 0.5s ease 0.05s both, swp-glow 2.4s ease-in-out infinite;
  }
  /* Dot as pure CSS decoration — zero effect on text centering */
  .swp-badge::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4ade80;
    animation: swp-dotBlink 1.4s ease-in-out infinite;
  }

  /* Hero title */
  .swp-hero-title {
    font-size: 2.4rem;
    font-weight: 900;
    color: #fff;
    margin: 0 0 14px;
    line-height: 1.15;
    letter-spacing: -0.5px;
    animation: swp-fadeUp 0.5s ease 0.18s both;
  }

  /* Hero subtitle */
  .swp-hero-sub {
    color: rgba(255, 255, 255, 0.78);
    font-size: 1.05rem;
    line-height: 1.65;
    margin: 0 0 32px;
    max-width: 600px;
    animation: swp-fadeUp 0.5s ease 0.30s both;
  }

  /* CTA row */
  .swp-cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    justify-content: center;
    animation: swp-fadeUp 0.5s ease 0.42s both;
  }

  /* Buttons — inline-block + text-align:center = guaranteed centered label */
  .swp-btn-primary {
    display: inline-block;
    text-align: center;
    padding: 13px 36px;
    border-radius: 12px;
    background: linear-gradient(90deg, #4a9cd6, #2b6cb0, #205479, #4a9cd6);
    background-size: 300% 100%;
    animation: swp-gradientMove 5s ease infinite;
    color: #fff !important;
    font-weight: 700;
    font-size: 15px;
    text-decoration: none !important;
    box-shadow: 0 4px 20px rgba(32, 84, 121, 0.5);
    transition: transform 0.22s ease, box-shadow 0.22s ease;
    border: none;
    cursor: pointer;
    line-height: 1.4;
  }
  .swp-btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(32, 84, 121, 0.6);
    color: #fff !important;
  }

  .swp-btn-outline {
    display: inline-block;
    text-align: center;
    padding: 12px 32px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.07);
    border: 1.5px solid rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.88) !important;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none !important;
    transition: background 0.22s, border-color 0.22s, transform 0.22s;
    cursor: pointer;
    line-height: 1.4;
  }
  .swp-btn-outline:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.55);
    transform: translateY(-3px);
    color: #fff !important;
  }

  /* ── Divider ─────────────────────────────────────────── */
  .swp-divider {
    border: none;
    border-top: 1px solid var(--ifm-color-emphasis-200);
    margin: 44px 0 36px;
  }

  /* ── Live URL block ──────────────────────────────────── */
  .swp-url-box {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 22px;
    margin: 22px 0;
    border-radius: 12px;
    border: 1.5px solid var(--ifm-color-primary-light);
    border-left: 5px solid var(--ifm-color-primary);
    background: var(--ifm-color-emphasis-100);
  }
  .swp-url-icon {
    font-size: 22px;
    flex-shrink: 0;
    line-height: 1;
  }
  .swp-url-link {
    font-family: var(--ifm-font-family-monospace);
    font-size: 0.92rem;
    font-weight: 600;
    word-break: break-all;
    color: var(--ifm-color-primary) !important;
    text-decoration: none !important;
  }
  .swp-url-link:hover {
    text-decoration: underline !important;
  }

  /* ── Feature grid ────────────────────────────────────── */
  .swp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 18px;
    margin: 28px 0;
  }
  .swp-card {
    padding: 22px 20px;
    border-radius: 14px;
    border: 1px solid var(--ifm-color-emphasis-200);
    background: var(--ifm-background-surface-color, var(--ifm-background-color));
    opacity: 0;
    animation: swp-cardIn 0.45s ease forwards;
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  }
  .swp-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 28px rgba(32, 84, 121, 0.13);
    border-color: var(--ifm-color-primary);
  }
  /* Staggered delays */
  .swp-card:nth-child(1) { animation-delay: 0.05s; }
  .swp-card:nth-child(2) { animation-delay: 0.12s; }
  .swp-card:nth-child(3) { animation-delay: 0.19s; }
  .swp-card:nth-child(4) { animation-delay: 0.26s; }
  .swp-card:nth-child(5) { animation-delay: 0.33s; }
  .swp-card:nth-child(6) { animation-delay: 0.40s; }
  .swp-card:nth-child(7) { animation-delay: 0.47s; }
  .swp-card:nth-child(8) { animation-delay: 0.54s; }

  .swp-card-icon {
    font-size: 28px;
    line-height: 1;
    margin-bottom: 12px;
  }
  .swp-card-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--ifm-color-primary);
    margin-bottom: 6px;
  }
  .swp-card-desc {
    font-size: 0.84rem;
    color: var(--ifm-color-emphasis-700);
    line-height: 1.55;
    margin: 0;
  }

  /* ── Video ───────────────────────────────────────────── */
  .swp-video-wrap {
    border-radius: 16px;
    overflow: hidden;
    background: #0d1117;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
    margin: 28px 0;
  }
  .swp-video-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: rgba(0, 0, 0, 0.6);
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.4px;
  }
  .swp-video-bar svg {
    flex-shrink: 0;
  }
  .swp-video-frame {
    display: block;
    width: 100%;
    height: 430px;
    border: none;
  }

  /* ── Steps ───────────────────────────────────────────── */
  .swp-steps {
    margin: 24px 0;
    display: flex;
    flex-direction: column;
  }
  .swp-step {
    display: flex;
    gap: 20px;
    padding-bottom: 28px;
    position: relative;
  }
  .swp-step:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 19px;
    top: 42px;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--ifm-color-primary), var(--ifm-color-emphasis-200));
  }
  .swp-step-num {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--ifm-color-primary);
    color: #fff;
    font-size: 15px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    box-shadow: 0 2px 10px rgba(32, 84, 121, 0.35);
  }
  .swp-step-body {
    padding-top: 7px;
  }
  .swp-step-label {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--ifm-heading-color);
    margin-bottom: 4px;
  }
  .swp-step-desc {
    font-size: 0.875rem;
    color: var(--ifm-color-emphasis-700);
    margin: 0;
    line-height: 1.6;
  }

  /* ── Responsive ──────────────────────────────────────── */
  @media (max-width: 768px) {
    .swp-hero { padding: 36px 24px 30px; }
    .swp-hero-title { font-size: 1.75rem; }
    .swp-cta-row { flex-direction: column; align-items: center; }
    .swp-btn-primary, .swp-btn-outline { width: 100%; }
    .swp-video-frame { height: 240px; }
  }
`}</style>

{/* ── HERO ───────────────────────────────────────────────────── */}
<div className="swp-hero">
  <div className="swp-hero-inner">
    <div className="swp-badge">Now Live</div>
    <h1 className="swp-hero-title">Student Web Portal</h1>
    <p className="swp-hero-sub">
      A powerful, browser-based portal giving students instant access to academics,
      assignments, exams, attendance, and more — no app download required.
    </p>
    <div className="swp-cta-row">
      <a
        href="https://eschool-saas.student-web.wrteam.me/student/auth"
        target="_blank"
        rel="noopener noreferrer"
        className="swp-btn-primary"
      >
        Open Live Portal
      </a>
      <Link to="/studentweb/intro" className="swp-btn-outline">
        Setup Guide
      </Link>
    </div>
  </div>
</div>

## Overview

The **Student Web Portal** is eSchool SaaS's latest platform addition — a fully responsive, web-based interface allowing students to manage academic life entirely from a browser. It complements the existing mobile apps by extending access to any device with an internet connection, with no installation needed.

<hr className="swp-divider" />

## Live URL

Access the live Student Web Portal at:

<div className="swp-url-box">
  <span className="swp-url-icon">🌐</span>
  <a
    href="https://eschool-saas.student-web.wrteam.me/student/auth"
    target="_blank"
    rel="noopener noreferrer"
    className="swp-url-link"
  >
    https://eschool-saas.student-web.wrteam.me/student/auth
  </a>
</div>

:::tip Production-Ready
This is the live production instance of the Student Web Portal. Use it to evaluate all features before deploying your own school instance.
:::

<hr className="swp-divider" />

## Key Features

<div className="swp-grid">
  <div className="swp-card">
    <div className="swp-card-icon">📊</div>
    <div className="swp-card-title">Student Dashboard</div>
    <p className="swp-card-desc">Unified overview of attendance, upcoming exams, assignments, and announcements.</p>
  </div>
  <div className="swp-card">
    <div className="swp-card-icon">📅</div>
    <div className="swp-card-title">Timetable & Schedule</div>
    <p className="swp-card-desc">View class timetables, period details, and subject-wise schedules at a glance.</p>
  </div>
  <div className="swp-card">
    <div className="swp-card-icon">📝</div>
    <div className="swp-card-title">Assignments</div>
    <p className="swp-card-desc">Access, review, and track homework and assignments submitted by teachers.</p>
  </div>
  <div className="swp-card">
    <div className="swp-card-icon">✅</div>
    <div className="swp-card-title">Attendance Records</div>
    <p className="swp-card-desc">Check daily and monthly attendance history with clear visual summaries.</p>
  </div>
  <div className="swp-card">
    <div className="swp-card-icon">🎓</div>
    <div className="swp-card-title">Exam Results</div>
    <p className="swp-card-desc">View online and offline exam results, grades, and performance reports.</p>
  </div>
  <div className="swp-card">
    <div className="swp-card-icon">📂</div>
    <div className="swp-card-title">Study Materials</div>
    <p className="swp-card-desc">Download teacher-shared notes, PDFs, and reference materials anytime.</p>
  </div>
  <div className="swp-card">
    <div className="swp-card-icon">💬</div>
    <div className="swp-card-title">Communication</div>
    <p className="swp-card-desc">Receive announcements and notifications from teachers and administrators.</p>
  </div>
  <div className="swp-card">
    <div className="swp-card-icon">🚌</div>
    <div className="swp-card-title">Transport Tracking</div>
    <p className="swp-card-desc">Track school bus routes, live trip status, stop timings, and driver details.</p>
  </div>
</div>

<hr className="swp-divider" />

## Video Demo

See the Student Web Portal in action:

<div className="swp-video-wrap">
  <div className="swp-video-bar">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
    Watch Demo
  </div>
  <iframe
    src="https://drive.google.com/file/d/1iFA--Ih2Jx6NMrMjY4rpj2I0jC8mWK12/preview"
    title="Student Web Portal Demo"
    allow="autoplay; encrypted-media"
    allowFullScreen
    className="swp-video-frame"
  ></iframe>
</div>

<hr className="swp-divider" />

## Platform Compatibility

Works across all modern devices and browsers — no installation required.

| Platform | Support |
|---|---|
| Desktop — Chrome, Firefox, Edge, Safari | ✅ Full Support |
| Tablet — iPad, Android Tablet | ✅ Fully Responsive |
| Mobile Browser | ✅ Optimized Layout |
| Requires App Installation | ❌ Not Required |

:::info Browser Recommendation
For the best experience, use **Google Chrome** (v90+) or **Microsoft Edge** (v90+) on desktop.
:::

<hr className="swp-divider" />

## How to Get Started

<div className="swp-steps">
  <div className="swp-step">
    <div className="swp-step-num">1</div>
    <div className="swp-step-body">
      <div className="swp-step-label">Deploy the Admin Panel</div>
      <p className="swp-step-desc">Ensure your eSchool SaaS Admin Panel is installed, configured, and publicly accessible before setting up the Student Web Portal.</p>
    </div>
  </div>
  <div className="swp-step">
    <div className="swp-step-num">2</div>
    <div className="swp-step-body">
      <div className="swp-step-label">Configure the Student Web Portal</div>
      <p className="swp-step-desc">Clone the project, point the API URL to your Admin Panel, and configure your environment variables.</p>
    </div>
  </div>
  <div className="swp-step">
    <div className="swp-step-num">3</div>
    <div className="swp-step-body">
      <div className="swp-step-label">Set Up Firebase (Notifications)</div>
      <p className="swp-step-desc">Integrate Firebase for push notification support so students receive real-time alerts for announcements and updates.</p>
    </div>
  </div>
  <div className="swp-step">
    <div className="swp-step-num">4</div>
    <div className="swp-step-body">
      <div className="swp-step-label">Build & Deploy</div>
      <p className="swp-step-desc">Run the production build and deploy to your hosting environment — Shared Hosting, VPS, Vercel, Netlify, or any static host.</p>
    </div>
  </div>
  <div className="swp-step">
    <div className="swp-step-num">5</div>
    <div className="swp-step-body">
      <div className="swp-step-label">Share with Students</div>
      <p className="swp-step-desc">Distribute the portal URL to students They log in with existing eSchool credentials — no new account needed.</p>
    </div>
  </div>
</div>

For full setup instructions, see the <Link to="/studentweb/intro">**Student Web Portal Setup Guide →**</Link>

<hr className="swp-divider" />

## Why Student Web Portal?

:::note What Problem Does It Solve?
While the eSchool mobile app serves students well, many users prefer or require browser-based access — particularly students on shared school computers or devices that cannot run mobile apps. The Student Web Portal fills this gap without requiring new credentials.
:::

| Advantage | Description |
|---|---|
| **Zero Installation** | Works in any browser — no app store, no downloads |
| **Cross-Device** | Desktop, tablet, and mobile responsive by design |
| **Same Credentials** | Log in with existing eSchool username and password |
| **Real-time Sync** | Always in sync with the Admin Panel |
| **Push Notifications** | Browser notifications via Firebase keep students informed |

<hr className="swp-divider" />

## Related Documentation

- <Link to="/studentweb/intro">Student Web Portal — Full Setup Guide</Link>
- <Link to="/studentweb/installation/installation-steps">Student Web — Installation Steps</Link>
- <Link to="/studentweb/installation/firebase-setup">Student Web — Firebase Setup</Link>
- <Link to="/studentweb/installation/deployment">Student Web — Deployment</Link>

---

*The Student Web Portal is actively maintained and updated alongside the main eSchool SaaS platform. New features are released with every major version.*
