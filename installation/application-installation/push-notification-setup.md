---
sidebar_position: 5
sidebar_label: 🔔 Push Notification Setup
---

# 🔔 Push Notification Setup

## 📋 Overview

After integrating Firebase, the next essential step is configuring **Push Notifications** so your eSchool SaaS app can deliver real-time alerts to users on both **Android** and **iOS**.

This setup involves registering your app with Firebase Cloud Messaging (FCM), configuring the Admin Panel, and enabling notification capabilities on each platform.

---

## 📖 Follow the Complete Notification Setup Guide

👉 **[Push Notification Setup Guide](https://www.marketplace.wrteam.in/docs/flutter-common-doc/GeneralSettings/notifications)**

This guide provides platform-specific, step-by-step instructions for the full notification configuration:

| Platform / Step | What's Covered |
|-----------------|----------------|
| **Admin Panel** | Register Firebase Project ID and upload the Service Account JSON file |
| **Android** | Place `google-services.json` in `android/app/` — no extra coding required |
| **iOS — Capabilities** | Enable Push Notifications, Remote Notifications & Background Fetch in Xcode |
| **iOS — Token Auth (.p8)** | Preferred method — create APNs key from Apple Developer Portal and upload to Firebase |
| **iOS — Certificate Auth (.p12)** | Alternative method — generate SSL certificates and export `.p12` from Keychain Access |

---

## ✅ Before You Begin

Make sure the following are completed before starting notification setup:

- [ ] Firebase is fully integrated — see 👉 [Integrate with Firebase](./integrate-with-firebase.md)
- [ ] `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are in place
- [ ] You have access to the **Firebase Console** with the correct project selected
- [ ] *(iOS only)* An active **Apple Developer Account** is available

---

:::info Android is Pre-Configured
All FCM dependencies, service classes, and manifest configurations are **already included** in the eSchool SaaS project for Android. Simply place the correct `google-services.json` file — no additional code changes are required.
:::

:::warning iOS Requires Apple Developer Account
Push Notifications on iOS require an active **Apple Developer Account**. Ensure your App ID has **Push Notifications** enabled in the Apple Developer Portal before proceeding with the iOS steps.
:::

---

## 🔗 Additional Resources

- **FCM Documentation**: [https://firebase.google.com/docs/cloud-messaging](https://firebase.google.com/docs/cloud-messaging)
- **Apple Developer Portal**: [https://developer.apple.com](https://developer.apple.com)
- **FlutterFire Messaging**: [https://firebase.flutter.dev/docs/messaging/overview](https://firebase.flutter.dev/docs/messaging/overview)
