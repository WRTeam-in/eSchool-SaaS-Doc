---
sidebar_position: 14
sidebar_label: 🚀 Deployment
---

# 🚀 Deployment

## 📋 Overview

Deployment is the final and most critical step in the app release process. Once your app is fully built, branded, and tested, it must be published to the **Google Play Store** (Android) and/or the **Apple App Store** (iOS) to reach your end users.

Each platform has its own developer account requirements, signing configurations, store listing standards, and review processes. Following the correct steps ensures a smooth and timely approval.

We have a comprehensive, platform-specific deployment guide that walks you through everything — from account setup and signing configurations to store listings, testing tracks, and production release.

👉 **[Complete Deployment Guide](https://wrteam-in.github.io/common_app_doc/GeneralSettings/deployment)**

---

## 🏪 Platform Deployment Guides

### 🤖 Google Play Store

👉 **[Deploy to Google Play Store](https://wrteam-in.github.io/common_app_doc/GeneralSettings/deployment/playstore)**

| Step | What's Covered |
|------|----------------|
| **1. Developer Account** | Register on Google Play Console ($25 one-time fee), verify identity, accept developer agreement |
| **2. App Configuration** | Update `pubspec.yaml` version format (`version_name+version_code`), configure `AndroidManifest.xml` |
| **3. App Signing** | Generate `.jks` keystore, configure `key.properties`, update `build.gradle` signing config |
| **4. Build Release** | Run `flutter build appbundle --release` → output at `build/app/outputs/bundle/release/app.aab` |
| **5. Store Listing** | App name (30 chars), short/full descriptions, screenshots, feature graphic (1024×500 px), privacy policy |
| **6. Content Declarations** | Ads, content rating, target audience, data safety, app access credentials |
| **7. Testing Tracks** | Internal → Closed (12+ testers, 14 days) → Open → Production |
| **8. Production Release** | Select countries, configure rollout percentage, submit for review |

:::warning Store your Keystore securely
The `.jks` keystore file and its passwords are **irreplaceable**. If lost, you will be unable to publish updates to your existing app listing. Store a backup in a secure, offline location.
:::

---

### 🍎 Apple App Store

👉 **[Deploy to Apple App Store](https://wrteam-in.github.io/common_app_doc/GeneralSettings/deployment/appstore)**

| Step | What's Covered |
|------|----------------|
| **1. Developer Account** | Enroll in Apple Developer Program ($99/year), complete verification, set up App Store Connect |
| **2. App Configuration** | Update `pubspec.yaml` version, match Bundle ID (`com.company.appname`) across Xcode and Firebase |
| **3. Signing Certificates** | Generate distribution certificates and App Store provisioning profiles via Xcode |
| **4. Build Release** | Run `flutter build ipa --release` with optional `--obfuscate` and `--split-debug-info` flags |
| **5. App Store Connect** | Create app record, configure pricing, upload screenshots (iPhone & iPad), privacy policy, demo account |
| **6. Archive & Submit** | Archive via `Product → Archive` in Xcode, sign with Apple Developer account, submit for review |
| **7. Post-Release** | Monitor feedback, track crashes, plan iterative updates |

:::warning Mac is Required for iOS Deployment
Building and submitting an iOS app requires a **Mac computer with Xcode installed**. This step cannot be performed on Windows or Linux.
:::

---

## ✅ Pre-Deployment Checklist

Before submitting to either store, verify the following:

- [ ] App builds cleanly with no errors — run `flutter build appbundle` / `flutter build ipa`
- [ ] Version name and version code are correctly set in `pubspec.yaml`
- [ ] Package name / Bundle ID matches Firebase configuration
- [ ] App icon is correctly set for all required sizes on both platforms
- [ ] Push notifications are tested and working
- [ ] Privacy Policy URL is live and accessible without login
- [ ] All required store assets are prepared (screenshots, descriptions, feature graphic)
- [ ] Signing credentials (keystore / certificates) are backed up securely

---

## 💡 Required Assets Summary

| Asset | Android | iOS |
|-------|---------|-----|
| App Icon | 512×512 px PNG | 1024×1024 px PNG |
| Feature Graphic | 1024×500 px | — |
| Screenshots | Min. 2 per device type | iPhone + iPad required |
| Privacy Policy | Required | Required |
| Short Description | 80 chars max | — |
| Full Description | 4000 chars max | 4000 chars max |
