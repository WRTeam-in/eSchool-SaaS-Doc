---
sidebar_position: 6
---

# Meta WhatsApp Credentials & Templates Setup Guide

This guide provides step-by-step instructions to set up a Meta Developer App, retrieve your **Phone Number ID**, **Business Account ID**, and **Permanent Access Token**, and create the required **3 Meta Utility Templates** for eSchool SaaS integration.

---

## Quick Reference Links (Meta Developer & Business Tools)

| Tool / Page | Direct URL | Purpose |
| :--- | :--- | :--- |
| **Meta Developer Portal (Apps)** | [developers.facebook.com/apps](https://developers.facebook.com/apps) | Create and manage your Meta Developer App |
| **Meta Business Manager** | [business.facebook.com](https://business.facebook.com) | Manage your Meta Business Portfolio |
| **System Users (Permanent Token)** | [business.facebook.com/settings/system-users](https://business.facebook.com/settings/system-users) | Generate permanent access tokens for API |
| **WhatsApp Manager (Templates)** | [business.facebook.com/wa/manage/templates](https://business.facebook.com/wa/manage/templates) | Create & manage WhatsApp Message Templates |
| **Meta WhatsApp Cloud API Docs** | [developers.facebook.com/docs/whatsapp/cloud-api](https://developers.facebook.com/docs/whatsapp/cloud-api) | Official Meta API documentation |

---

## Step 1: Create a Meta Developer App

1. Go to the [Meta Developer Portal Apps Console](https://developers.facebook.com/apps).
2. Log in with your Facebook account associated with your Business Account.
3. Click the green **Create App** button at the top-right.
4. Select **Other** (or **Business**) as the app type and click **Next**.
5. Select **Business** as the app type and click **Next**.
6. Enter an **App Name** (e.g., `eSchool WhatsApp Integration`).
7. Enter your **App Contact Email**.
8. Under **Business Portfolio**, select your official Meta Business Account.
9. Click **Create App** (you may be prompted to re-enter your Facebook password).

---

## Step 2: Set Up WhatsApp Product & Get Phone Number ID & Business Account ID

1. On your newly created App Dashboard, scroll down to the **Add products to your app** section.
2. Locate **WhatsApp** and click **Set Up**.
3. Select your **Meta Business Portfolio** from the dropdown menu and click **Continue**.
4. In the left sidebar navigation menu, go to **WhatsApp** -> **API Setup** (or **Getting Started**).

Here you will find your credentials:

```
┌──────────────────────────────────────────────────────────────────┐
│  WhatsApp API Setup                                              │
│                                                                  │
│  Phone Number ID:          104567890123456  [Copy]               │
│  WhatsApp Business Account ID: 109876543210987  [Copy]           │
└──────────────────────────────────────────────────────────────────┘
```

* **Phone Number ID**: Copy the numeric value displayed under *Phone Number ID*.
* **WhatsApp Business Account ID**: Copy the numeric value displayed under *WhatsApp Business Account ID*.

> **Adding a Production Phone Number**: In the API Setup section, scroll down to **Step 5: Add a phone number**, enter your school's official display name and mobile number, and verify it via SMS or phone call OTP.

---

## Step 3: Generate a Permanent System User Access Token

> **Important**: The temporary access token shown on the API Setup page expires after 24 hours. For production use, you **MUST** generate a **Permanent System User Token**.

1. Navigate directly to [Meta Business Settings -> System Users](https://business.facebook.com/settings/system-users).
2. Select your Business Portfolio.
3. Click **Add** (or **Create System User**).
4. Enter a name for the System User (e.g., `eSchool WhatsApp System User`).
5. Set the **System User Role** to **Admin**.
6. Click **Create System User**.

#### Assign Assets to the System User
1. Select the created System User from the list and click **Assign Assets**.
2. Go to **Apps** -> Select your app (`eSchool WhatsApp Integration`).
3. Toggle **Full Control** (Manage App) to **ON**.
4. Click **Save Changes**.

#### Generate the Permanent Token
1. Select the System User and click **Generate New Token**.
2. Select your App (`eSchool WhatsApp Integration`) from the dropdown.
3. Under **Token Expiration**, select **Never** (or the maximum duration allowed).
4. Under **Available Permissions**, check the following 2 required permissions:
   * `whatsapp_business_messaging` *(Required to send messages)*
   * `whatsapp_business_management` *(Required to manage templates and read account insights)*
5. Click **Generate Token**.
6. Copy the generated Access Token (starts with `EAAG...` or `EAAL...`) and store it securely.

---

## Step 4: Create the 3 Required Meta Utility Templates

Meta requires pre-approved templates under the **`Utility`** category to send business-initiated messages outside an active 24-hour window.

The eSchool SaaS integration uses **3 Meta Relay Templates** with a `{{1}}` parameter, allowing you to edit all message texts dynamically in your school panel without re-submitting to Meta.

1. Navigate directly to [WhatsApp Manager — Message Templates](https://business.facebook.com/wa/manage/templates).
2. Ensure your correct WhatsApp Business Account is selected in the top-left dropdown.
3. Click the **Create Template** button.

---

### Template 1: Text Relay Template (Normal Text Messages)

* **Category**: `Utility`
* **Template Name**: `school_message` *(Must be lowercase with a-z, 0-9, and underscores only)*
* **Language**: `English (US)` (`en_US`) or your local language
* **Header**: Select **None**
* **Body**:
```text
Hello, you have a new message from your school:

{{1}}

Thank you.
```
* **Sample Content for `{{1}}`**: `Your child Aarav Sharma has been marked present on 31-07-2026.`
* **Footer**: *(Optional)* e.g. `School Communication Portal`
* **Buttons**: None
* Click **Submit**.

---

### Template 2: Document Relay Template (PDF / Document Attachments)

* **Category**: `Utility`
* **Template Name**: `school_message_document`
* **Language**: `English (US)` (`en_US`)
* **Header**: Select **Document**
  * *Upload a sample PDF document from your computer for Meta review.*
* **Body**:
```text
Hello,

{{1}}

Please find the attached document for your reference.
```
* **Sample Content for `{{1}}`**: `Please find attached your fee receipt for term 1.`
* **Footer**: *(Optional)*
* **Buttons**: None
* Click **Submit**.

---

### Template 3: Image Relay Template (JPG / PNG Attachments)

* **Category**: `Utility`
* **Template Name**: `school_message_image`
* **Language**: `English (US)` (`en_US`)
* **Header**: Select **Image**
  * *Upload a sample JPG/PNG image from your computer for Meta review.*
* **Body**:
```text
Hello,

{{1}}

Please find the attached image for your reference.
```
* **Sample Content for `{{1}}`**: `Here is the poster for annual sports day.`
* **Footer**: *(Optional)*
* **Buttons**: None
* Click **Submit**.

> **Note**: Meta utility templates containing standard placeholder parameters are typically approved automatically within a few minutes.

---

## Step 5: Configure Credentials in School Admin Panel

Now that you have gathered all credentials and created the templates, open your School Management System:

1. Log in as **School Admin**.
2. Go to **WhatsApp Integration** (Sidebar Menu) -> **Setup** Tab.
3. Fill in the following fields:

| Field | Value to Enter |
| :--- | :--- |
| **Enable WhatsApp** | Toggle **ON** |
| **Phone Number ID** | Copied from Step 2 |
| **Business Account ID** | Copied from Step 2 |
| **Permanent Access Token** | Copied from Step 3 (`EAAG...`) |
| **Default Meta Relay Template (Text)** | `school_message` |
| **Default Meta Language** | `en_US` (or `en`) |
| **Default Meta Document Template** | `school_message_document` |
| **Default Meta Image Template** | `school_message_image` |

4. Click **Save Settings**.
5. Click **Test Connection** (Green badge indicates successful connection).
6. Click **Send Test Message** to send a test message to your personal mobile number.

---
