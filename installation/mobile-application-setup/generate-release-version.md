---
sidebar_position: 12
---

# Generate Release Version

## Create and add Key Store file for Android:

1. To generate a keystore file, run the following command:

   ```bash
   keytool -genkey -v -keystore your-keystore-file.jks -keyalg RSA -keysize 2048 -validity 10000 -alias your-alias
   ```

   You can replace "your-keystore-file.jks" with your preferred filename, but ensure you keep the ".jks" extension. Similarly, you can change "your-alias" as needed, but make sure to remember it. During this process, you will be prompted to set a password; please note that the password characters won't be visible on the screen.

   Additional information may be requested, but you can simply press Enter to skip those as they are optional fields.

2. Create a file named "key.properties" in your project's "android" folder and add the following details, which correspond to the information you used in the previous step:

   ```
   storePassword=[your-password-from-previous-step]
   keyPassword=[your-password-from-previous-step]
   keyAlias=[your-alias-from-previous-step]
   storeFile=[your-keystore-file-location]
   ```

   Replace the placeholders ("[]" brackets) with the actual details you used. Once these two steps are completed, you can generate either an APK file using the following command:

   ```bash
   flutter build apk
   ```

   Or an app bundle file for the Play Store upload with:

   ```bash
   flutter build appbundle
   ```

![e-School SaaS](../../static/images/installation/app/generatKeyStorefile.png)

## Follow these links for more information on generating the release version:

1. To generate release android app-bundle and publish to playstore follow
   [https://flutter.dev/docs/deployment/android](https://flutter.dev/docs/deployment/android)

2. To generate release iOS apk and publish to appstore follow
   [https://flutter.dev/docs/deployment/ios](https://flutter.dev/docs/deployment/ios) 