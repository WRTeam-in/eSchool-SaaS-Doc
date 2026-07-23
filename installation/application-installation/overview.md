---
sidebar_position: 1
sidebar_label: 📋 App Prerequisites
---
import DocBanner from '@site/src/components/DocBanner/DocBanner';

<DocBanner />
# 📋 App Prerequisites

## 📋 Introduction

This guide will help you understand, set up, and customize your own version of the **eSchool SaaS mobile application**.  
Follow this documentation step-by-step to configure the project properly on your system.

## 🔧 Requirements

Before you begin, ensure your development environment meets the following specifications.  
Using different versions may cause unexpected compatibility issues.

### 🖥️ Required Software

#### Core Requirements
 
- **Android Studio**: Version 2025.1.1 (Narwhal)
- **Flutter**: [View Compatible Versions](#-version-compatibility)
- **Java**: Version 21

#### macOS Requirements

- **Homebrew**: Latest version
- **CocoaPods**: Version 1.16.2
- **Xcode**: Version 16.4

#### Optional but Recommended

- **Firebase CLI** (for easier Firebase setup)

### ⚠️ Important Note

Setting up your development environment correctly is essential.  
Please configure your system according to the above specifications **before requesting support**.

Assistance for system-level setup (Android Studio, Flutter installation, macOS setup, etc.) is **not included** in our support services.

## 🚀 Getting Started: Setup Roadmap

Launching the eSchool SaaS app involves the following stages:

1. **Environment Setup** – Installing and configuring required tools on your PC.
2. **Project Configuration** – Running the app for the first time.
3. **Branding** – Updating package name and app display name.
4. **Firebase Integration** – Connecting the app with Firebase services.
5. **Admin Panel Connection** – Linking the app with your eSchool SaaS Admin Panel.
6. **Customization** – Changing UI, UI theme, features, and modules.
7. **Deployment** – Creating production-ready builds for Play Store and App Store.

Follow the next sections for detailed instructions for each step.

## 📋 Version Compatibility

This table shows the compatibility between different versions of the eSchool SaaS mobile application and their required dependencies.

| Product Version | Flutter Version | Kotlin Version | distributionUrl (gradle) | JDK Version |
|----------------|-----------------|----------------|-------------------------|-------------|
| 1.9.6 | 3.44.7 | 2.1.0 | 8.14 | 21 |
| 1.9.5 | 3.44.1 | 2.1.0 | 8.14 | 21 |
| 1.9.4 | 3.44.1 | 2.1.0 | 8.14 | 21 |
| 1.9.3 | 3.41.1 | 2.0.10 | 8.7 | 21 |
| 1.9.2 | 3.41.1 | 2.0.10 | 8.7 | 21 |
| 1.9.1 | 3.41.1 | 2.0.10 | 8.7 | 21 |
| 1.9.0 | 3.41.1 | 2.0.10 | 8.7 | 21 |
| 1.8.2 | 3.38.5 | 2.0.10 | 8.7 | 21 |
| 1.8.1 | 3.38.5 | 2.0.10 | 8.7 | 21 |
| 1.8.0 | 3.38.1 | 2.0.10 | 8.7 | 21 |
| 1.7.1 | 3.32.7 | 2.0.10 | 8.7 | 21 |
| 1.7.0 | 3.32.7 | 2.0.10 | 8.7 | 21 |
| 1.6.1 | 3.32.0 | 2.0.10 | 8.7 | 17 |
| 1.6.0 | 3.29.0 | 1.8.22 | 8.4 | 17 |
| 1.5.4 | 3.27.1 | 1.8.22 | 8.4 | 17 |
| 1.5.0 | 3.27.1 | 1.8.22 | 8.4 | 17 |

### Important Notes

- **Flutter Version**: The Flutter SDK version required for building the mobile application
- **Kotlin Version**: The Kotlin version used for Android development
- **distributionUrl (gradle)**: The Gradle wrapper version for Android builds
- **JDK Version**: The Java Development Kit version required for Android development

Make sure to use the exact versions specified in the table to avoid compatibility issues during development and deployment.
