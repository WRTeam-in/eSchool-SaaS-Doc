---
sidebar_position: 5
sidebar_label: 🛠️ Troubleshooting & FAQ
description: Fixes for common Multi-School APK builder messages, and answers to frequently asked questions.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🛠️ Troubleshooting & FAQ

The builder checks every school **before** it starts a build and explains exactly what is missing. Most problems are solved by reading that message and editing the school. This page lists the most common ones.

:::tip Check a school at any time
On the **Build** tab, a school that isn't ready lists everything it still needs under **Android** and **iOS**. Click **Edit** on its card to fix it.
:::

---

## ⚠️ Common Messages

The messages name the command for your system: `.\build.cmd` on Windows, `./build.sh` on macOS.

| Message | Cause | Fix |
|---------|-------|-----|
| `The School Builder addon is not installed.` | The `addon` folder is missing or in the wrong place. | Copy the contents of the `school-builder` folder into the project root. See [Install the Add-on](./install-addon.md#step-2-copy-the-add-on-into-your-project). |
| `… the School Builder needs v1.12.0 or later` | Your app code is older than v1.12.0. The builder reads the version from the line at the top of `lib/main.dart`, such as `//[V.1.11.0]`. | Update your app code to the latest eSchool SaaS version, then start the builder again. If your code is already up to date, check that `lib/main.dart` still has its version line. |
| `no enabled schools in addon/config/schools.json` | No school has been added yet, or every school has **Enabled** turned off. | Add a school in the **Schools** tab, or turn **Enabled** back on. |
| `the Default School ... can't be deleted` | You tried to delete or duplicate the Default School. | It's your default app itself, so it can only be edited. Click **Edit**. |
| `… has no School Builder hook, so this school would build as your default app` | Your app code is older than v1.12.0, or `android/app/build.gradle` or an iOS `.xcconfig` file was edited and lost the add-on's lines. | Use the eSchool SaaS app code v1.12.0 or later, or copy the missing lines back from it. The Default School doesn't need them. |
| `no app type` | No app type has been chosen for the school. | Edit the school and choose **general** or **school-specific** under **App type** in the **School** section. |
| `google-services.json has no Android app for '<package ID>'` | The Firebase file belongs to a different app or project. | In the school's Firebase project, add an Android app with **exactly** this package ID, download `google-services.json` again, and choose it in the **Firebase** section. |
| `… is the Firebase config for '<bundle ID A>', but this school builds '<bundle ID B>'` | The iOS Firebase file belongs to a different app. | Add an iOS app with the school's bundle ID in its Firebase project and choose the new `GoogleService-Info.plist`. |
| `Firebase project mismatch between platforms` | The Android and iOS files come from different Firebase projects. | Download both files from the **same** Firebase project. |
| `the key.properties this school names is missing … signing with … instead` | The school's own signing file was moved or deleted, so the default key was used. | Choose the school's `key.properties` and keystore again under **Android signing**. Google Play rejects updates signed with a different key. |
| `another build already holds this project` | Another build is already running. Only one build can run at a time. | Wait for it to finish, or stop it from the **Queue**. |
| `flutter not found on PATH` | Flutter is not installed or not on your PATH. | Follow the [Environment Setup](../initial-setup.md) guide. |
| `no free port between 8787 and 8806` | Other apps are using those ports. | Start the builder on another port: `.\build.cmd --port 9000` or `./build.sh --port 9000`. |
| `iOS builds require macOS and Apple's toolchain` | You asked for an iOS build on Windows. | Build the Android APK or AAB on Windows, and the iOS app on a Mac. |

**Windows only**

| Message | Cause | Fix |
|---------|-------|-----|
| `Python 3.8 or later is needed to run the School Builder` | Python isn't installed, or isn't on the PATH. | Install Python from [python.org](https://www.python.org/downloads/), tick **Add python.exe to PATH**, then open a **new** terminal. |
| `The term 'build.cmd' is not recognized` | PowerShell doesn't run commands from the current folder by name. | Type `.\build.cmd` instead of `build.cmd`. |
| `Terminate batch job (Y/N)?` | You pressed `Ctrl + C` to stop the builder. | Press `Y`. The project has already been restored. |
| **Choose file…** does nothing | The Open dialog opened behind the browser window. | Check the taskbar for the dialog, or drag the file onto the box instead. |

**macOS only**

| Message | Cause | Fix |
|---------|-------|-----|
| `python3 not found on PATH` | Python 3 is not installed. | Run `xcode-select --install`. |
| `permission denied: ./build.sh` | The script lost its "executable" permission during copying. | Run `chmod +x build.sh addon/build.sh`. |

---

## 🔁 If a Build Is Interrupted

A school build never changes your project's Android or iOS files, so an interrupted build leaves nothing to undo there. If your computer shuts down or the terminal is force-closed during an Android build, the school's in-app logo may still be staged in `assets/branding/`. Your default app doesn't use it, but to clean it up, run:

<Tabs groupId="os">
<TabItem value="windows" label="Windows" default>

```powershell
.\build.cmd --restore
```

</TabItem>
<TabItem value="mac" label="macOS">

```bash
./build.sh --restore
```

</TabItem>
</Tabs>

This puts the project back to its original state. The next build also does this automatically before it starts. A build stopped with **Stop everything** in the browser page restores the project by itself.

---

## ❓ Frequently Asked Questions

<details>
<summary><strong>1. Does the add-on change my app's source code?</strong></summary>

No. The add-on never edits your Dart code, and it never changes your project's Android files. Each school's package ID, icons, splash screen and Firebase file are generated in the school's own folder under `build/`, and Gradle uses them for that build only. On iOS, the build runs in a separate copy of your project, `build/.school-builder/ios-workspace/`, and the school's files are written only into that copy.

</details>

<details>
<summary><strong>2. Can I still build the normal app without the add-on?</strong></summary>

Yes. `flutter run`, `flutter build apk` and building from Xcode work exactly as before. Every school-specific value falls back to the app's default when you don't build through the add-on, and the app sends `App-Type: general`.

</details>

<details>
<summary><strong>3. Do I need a separate Firebase project for every school?</strong></summary>

Yes. Each school's app has its own package ID, so it needs its own Firebase project for push notifications. The builder checks that each school's Firebase files match its package IDs before it builds.

</details>

<details>
<summary><strong>4. Can all schools share one signing key?</strong></summary>

Yes. Put one `key.properties` and keystore in `addon/config/signing/default/` and leave the signing fields empty for each school. Once a school's app is published, always sign its updates with the same key.

</details>

<details>
<summary><strong>5. Where are my keystore passwords stored?</strong></summary>

Only in the `key.properties` files inside `addon/config/signing/`. That folder stays on your computer and is excluded from Git. Passwords are never written to `schools.json`.

</details>

<details>
<summary><strong>6. Will updating the add-on delete my schools?</strong></summary>

No. Updates contain only the builder. Your school list, images, Firebase files and signing keys are never included in the zip, so they cannot be overwritten. See [Updating the Add-on](./install-addon.md#-updating-the-add-on).

</details>

<details>
<summary><strong>7. Can I use the add-on on Windows?</strong></summary>

Yes, for Android. On Windows 10 or 11 you can add schools and build **APK** and **AAB** files, from the browser page or with `.\build.cmd`. **iOS** builds (IPA) need a Mac with Xcode, because Apple's tools only run on macOS.

A team can mix both: build the Android apps on Windows and the iOS apps on a Mac, from the same project and the same school settings.

</details>

<details>
<summary><strong>8. Does the add-on work with the Staff/Teacher app too?</strong></summary>

Yes. The same add-on works for both the Student/Parent app and the Staff/Teacher app: install the same zip into each project. It reads each app's own colours and notification icon from that project. The Student app offers nine colours and the Staff app six, so a school's colour settings can differ between the two.

Each app keeps its own list of schools, so you add a school once in each app you build for it.

</details>

<details>
<summary><strong>9. Can I change a school's ID after creating it?</strong></summary>

No. The ID names the school's folders. To use a different ID, **Duplicate** the school with the new ID, then delete the old one.

</details>

<details>
<summary><strong>10. How do I release an update of a school's app?</strong></summary>

Edit the school, increase its **Version** and **Build number**, and build again. Upload the new file to the store with the same signing key. The Play Store rejects a build number that isn't higher than the last one.

</details>

<details>
<summary><strong>11. Is it safe to commit the Firebase files to Git?</strong></summary>

Yes. `google-services.json` and `GoogleService-Info.plist` are included in every published app anyway. They identify a Firebase project but don't grant access to it. Signing keys and passwords must never be committed, and the add-on keeps them out of Git automatically.

</details>

<details>
<summary><strong>12. After I build a school's APK, will a normal `flutter run` use that school's icon?</strong></summary>

No. `flutter run`, `flutter build apk` and `flutter build appbundle` always use your project's own icons, splash screen, name and Firebase file. Only the builder hands a school's folder to Gradle, and only for the build it starts. Building School A and then School B never mixes their files either: each school has its own folder, rebuilt from scratch on every build.

The same is true on iOS. A school's iOS build runs in a separate copy of your project, so `flutter run`, `flutter build ios` and Xcode in your project always build the default app.

If a phone still shows an old icon after you install a different build, that's the phone's launcher caching the icon, not the APK. It's most likely when two builds share a package ID, for example a school that uses the default app's package ID. Uninstall the app and install it again.

</details>

<details>
<summary><strong>13. Why can't I delete the Default School?</strong></summary>

The Default School is your default app itself, the one `flutter run` and `flutter build` build. Its settings live in your project's own files, not in the school list, so there is nothing to delete, only to edit. Click **Edit** to change it. Every save keeps a backup of the files it changed in `addon/config/.backups/default-app/`, so you can undo a change by copying those files back.

</details>

<details>
<summary><strong>14. Which requests send the App-Type header?</strong></summary>

Only two: **login**, and the **settings request the splash screen makes** when the app opens. The value is the school's **App type**: `App-Type: general` or `App-Type: school-specific`. No other request carries the header, before or after login.

To change a school's app type, edit the school, choose the other value and build the app again. The type is built into the app, so apps already installed keep the old value until they are updated.

</details>

<details>
<summary><strong>15. What is the `build/.school-builder/ios-workspace` folder?</strong></summary>

It is where the iOS apps of your schools are built: a copy of your project. Before every iOS build, the builder updates the copy to match your project, then writes that school's icon, splash screen, Firebase file, bundle ID and app name into it. Your project's own `ios/` folder is never changed.

Don't edit files in this folder, because the next build overwrites them. Make your changes in the project as usual. You can delete the folder at any time: the next iOS build creates it again, and that first build takes longer while CocoaPods and Xcode start from scratch.

</details>

---

## 📚 Technical Reference

<details>
<summary><strong>Build with a single command (scripts and CI)</strong></summary>

You don't need these for everyday use: the builder page runs the same commands for you. They are useful for scripts, CI servers, or when you want a build without opening the page. Schools themselves are always added and edited in the builder page.

<Tabs groupId="os">
<TabItem value="windows" label="Windows" default>

| Command | What it does |
|---------|--------------|
| `.\build.cmd` | Opens the builder in your browser |
| `.\build.cmd sunrise android apk` | Builds the APK for the school with ID `sunrise` |
| `.\build.cmd sunrise android aab` | Builds the Play Store bundle (AAB) |
| `.\build.cmd sunrise android both` | Builds both the APK and the AAB |
| `.\build.cmd all android apk` | Builds an APK for **every** enabled school |
| `.\build.cmd sunrise run` | Runs the school's app on a connected phone |
| `.\build.cmd --list` | Lists the configured schools |
| `.\build.cmd --restore` | Cleans up after an interrupted build |
| `.\build.cmd --help` | Shows every command and option |

</TabItem>
<TabItem value="mac" label="macOS">

| Command | What it does |
|---------|--------------|
| `./build.sh` | Opens the builder in your browser |
| `./build.sh sunrise android apk` | Builds the APK for the school with ID `sunrise` |
| `./build.sh sunrise android aab` | Builds the Play Store bundle (AAB) |
| `./build.sh sunrise ios ipa` | Builds the IPA (on a Mac with Xcode) |
| `./build.sh all android apk` | Builds an APK for **every** enabled school |
| `./build.sh sunrise run` | Runs the school's app on a connected phone |
| `./build.sh --list` | Lists the configured schools |
| `./build.sh --restore` | Cleans up after an interrupted build |
| `./build.sh --help` | Shows every command and option |

</TabItem>
</Tabs>

A build command shows a summary and asks you to confirm before it starts:

```text
------------------------------------------------------------
School  : Sunrise International School (sunrise)
Platform: Android
Android : apk · applicationId com.wrteam.eschool.sunrise · "Sunrise International School"
Signing : addon/config/signing/default/key.properties (default)
Version : 1.0.0 (1) · Android + iOS
Code    : SUN2026001 (baked in — login screen never asks)
App type: school-specific (App-Type header on login and settings)
Output  : build/sunrise/
------------------------------------------------------------

Start the build? [Y/n]:
```

Add `-y` to skip the question, for example `./build.sh sunrise android apk -y`. A command that leaves something out, such as `./build.sh sunrise`, doesn't ask: it tells you what to add and shows an example.

</details>

For advanced options, such as manual iOS signing, environment-variable passwords and CI/CD builds, see the full reference included with the add-on: `addon/docs/MULTI_SCHOOL_BUILD.md`.

For anything else, contact us through [Help & Support](../../help-and-support.md).
