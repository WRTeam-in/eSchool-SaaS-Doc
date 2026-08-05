---
sidebar_position: 2
sidebar_label: 🛠️ Environment Setup
---

# 🛠️ Environment Setup

## 📋 Overview

Before you can build, run, or customize the **eSchool SaaS** mobile application, your development machine must have a properly configured Flutter environment. This includes installing the Flutter SDK, Java JDK, configuring your IDE, and setting up platform-specific tools for Android and iOS.

We have published a **comprehensive, step-by-step environment setup guide** that covers everything you need — from scratch to a fully working Flutter development environment.

---

## 📖 Follow the Complete Setup Guide

👉 **[Flutter & Java JDK Environment Setup Guide](https://www.marketplace.wrteam.in/docs/flutter-common-doc/GeneralSettings/basicsetup)**

This guide covers all the essential setup steps required before working with the eSchool SaaS mobile application:

| Step | What's Covered |
|------|----------------|
| **1. Flutter SDK** | Download, extract, and configure Flutter on Windows / macOS / Linux |
| **2. Java JDK** | Install JDK, set `JAVA_HOME`, and verify with `java -version` |
| **3. IDE Setup** | Configure Android Studio or VS Code with Flutter & Dart plugins |
| **4. Android SDK** | Set up Android SDK, emulator, or physical device |
| **5. iOS Tools** | Install Xcode and configure iOS simulator *(macOS only)* |
| **6. Verification** | Run `flutter doctor --verbose` to confirm everything is working |

---

## ✅ Before You Proceed

Once you have completed the setup guide linked above, verify your environment by running:

```bash
flutter doctor -v
```

All required checks should show a green ✓. Only then proceed to the next step in this documentation.

:::warning Important
Do **not** skip or partially complete the environment setup. An incomplete setup is the most common cause of build failures, dependency errors, and runtime issues when working with the eSchool SaaS app.
:::

:::info Support Scope
Assistance for system-level setup — including Flutter installation, Android Studio configuration, JDK setup, and macOS-specific tooling — is **not included** in our support services. Please follow the linked guide and refer to the official Flutter documentation for environment-related issues.
:::

---

## 🔗 Additional Resources

- **Official Flutter Docs**: [https://docs.flutter.dev/get-started/install](https://docs.flutter.dev/get-started/install)
- **Android Studio Download**: [https://developer.android.com/studio](https://developer.android.com/studio)
- **Flutter & JDK Setup Guide**: [https://www.marketplace.wrteam.in/docs/flutter-common-doc/GeneralSettings/basicsetup](https://www.marketplace.wrteam.in/docs/flutter-common-doc/GeneralSettings/basicsetup)
