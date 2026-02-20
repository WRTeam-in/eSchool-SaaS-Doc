---
sidebar_position: 4
---

# Adding a New Language to the Web Project

This guide explains where and what you need to change in the codebase to formally add a newly created translation (e.g., French `fr` / `fr.json`) to the language settings. We will use French (`fr`) as an example.

## 1. Create the Translation File

**File Location:** `src/lib/student/translations/fr.json`
_Status:_ ✅ Make sure this is created. This file contains the English translations mapped to their French equivalents.

## 2. Update the Redux Language Slice

**File Location:** `src/components/store/slices/languageSlice.ts`

You need to add `'fr'` as a valid language code, `'French'` as a language name, and include it in the `availableLanguages` array.

**Changes required in the code:**

```typescript
// 1. Update LanguageCode type
export type LanguageCode = 'en' | 'hi' | 'ar' | 'fr';

// 2. Update LanguageName type
export type LanguageName = 'English' | 'Hindi' | 'Arabic' | 'French';

// ...

// 3. Update the loadLanguageFromLocalStorage function validation
// Change from ['en', 'hi', 'ar'] to include 'fr':
if (saved && ['en', 'hi', 'ar', 'fr'].includes(saved)) {
```

```typescript
// 4. Add French to the availableLanguages array
const availableLanguages: Language[] = [
  { name: "English", code: "en", flag: "🇺🇸", isRtl: false },
  { name: "Hindi", code: "hi", flag: "🇮🇳", isRtl: false },
  { name: "Arabic", code: "ar", flag: "🇸🇦", isRtl: true },
  /* ADD THIS LINE BELOW 👇 */
  { name: "French", code: "fr", flag: "🇫🇷", isRtl: false },
];
```

## 3. Update the useLanguage Hook

**File Location:** `src/components/hooks/useLanguage.ts`

You need to include a `case` for `'fr'` so the app knows to dynamically import `fr.json` when French is selected.

**Changes required in the code:**

Inside the `switch (currentLanguage)` statement, add the rule for French:

```typescript
switch (currentLanguage) {
  case "hi":
    translationModule = await import("@/lib/student/translations/hi.json");
    break;
  case "ar":
    translationModule = await import("@/lib/student/translations/ar.json");
    break;

  /* ADD THIS CASE FOR FRENCH BELOW 👇 */
  case "fr":
    translationModule = await import("@/lib/student/translations/fr.json");
    break;
  /* -------------------------------- */

  case "en":
  default:
    translationModule = await import("@/lib/student/translations/en.json");
    break;
}
```

---

That's it! After completing these small configuration steps, the language selector in the UI will properly display "French" and will dynamically load `fr.json` when users select it.
