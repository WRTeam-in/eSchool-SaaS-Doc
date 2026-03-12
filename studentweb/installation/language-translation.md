---
sidebar_position: 4
---

# 🌐 Language Translation Guide

This guide explains how the dynamic language translation system works in the eSchool SaaS Web Project and provides a step-by-step process for adding new languages.

---

##  System Overview

The application utilizes a dynamic translation architecture powered by **Redux** and **JSON**. This ensures that only the required translation data is loaded, optimizing performance and scalability.

| Component | Description |
| :--- | :--- |
| **Language Registry** | `src/lib/student/languages.json` — The source of truth for all supported languages. |
| **Translation Assets** | `src/lib/student/translations/` — JSON files containing localized strings. |
| **State Management** | `languageSlice.ts` — Handles language state and user preferences via Redux. |
| **Hook** | `useLanguage.ts` — The interface for components to access translation data. |

---

## ➕ Adding a New Language

Adding a new language is a simple configuration process that does not require any logic changes.

### 1. Register the Language
Open `src/lib/student/languages.json` and append a new entry to the array.

```json
{
  "name": "French",
  "code": "fr",
  "flag": "🇫🇷",
  "isRtl": false
}
```

*   **name**: The display name in the application UI.
*   **code**: ISO 639-1 code (must match the JSON filename in step 2).
*   **flag**: The emoji or icon representing the language.
*   **isRtl**: Set to `true` for Right-to-Left languages (e.g., Arabic).

### 2. Create the Translation File
Navigate to `src/lib/student/translations/` and create a new JSON file named after your language code (e.g., `fr.json`).

### 3. Populate Localized Strings
Copy the content from `en.json` into your new file and translate the values. 

> [!IMPORTANT]
> **Maintain Key Parity:** Always keep the JSON keys identical to the original `en.json` file. The application uses these keys to map translations dynamically across all components.
