---
sidebar_position: 1
---

# File Structure

Understanding the Student Web Portal project structure helps you navigate and modify the application effectively.

## Project Structure Overview

The Student Web Portal is built with **Next.js 15**, **TypeScript**, **React 19**, **Redux Toolkit**, and **Tailwind CSS**.

```
eschool-sass-web/
├── public/                          # Static files served directly
│   ├── assets/                      # Images and static resources
│   │   └── images/                  # Application images
│   │       ├── aboutus/             # About us section images
│   │       ├── common/              # Common images (logo, user avatar)
│   │       ├── dashboard/           # Dashboard images
│   │       └── hero/                # Hero section images
│   ├── firebase-messaging-sw.js    # Firebase service worker for push notifications
│   └── *.svg                        # SVG icons
├── src/                             # Source code
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                  # Auth route group
│   │   │   └── student/             # Student authentication
│   │   │       └── auth/            # Auth pages
│   │   │           ├── login/       # Login page
│   │   │           └── reset-password/  # Password reset
│   │   ├── (dashboard)/             # Dashboard route group
│   │   │   └── student/             # Student dashboard
│   │   │       ├── dashboard/       # Main dashboard
│   │   │       ├── assignments/     # Assignments page
│   │   │       ├── chats/           # Chat feature
│   │   │       ├── diary/           # Student diary
│   │   │       ├── exams/           # Exams (online & offline)
│   │   │       ├── gallery/         # Photo gallery
│   │   │       ├── guardian/        # Guardian information
│   │   │       ├── holiday/         # Holiday list
│   │   │       ├── noticeboard/     # Notice board
│   │   │       ├── notifications/   # Notifications
│   │   │       ├── profile/         # Student profile
│   │   │       ├── report/          # Academic reports
│   │   │       ├── result/          # Exam results
│   │   │       ├── subjects/        # Subjects and lessons
│   │   │       ├── teachers/        # Teachers list
│   │   │       ├── timetable/       # Class timetable
│   │   │       ├── transportation/  # Transportation info
│   │   │       └── layout.tsx       # Dashboard layout
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home page
│   ├── components/                  # React components
│   │   ├── chat/                    # Chat components
│   │   ├── contexts/                # React contexts
│   │   ├── features/                # Feature-specific components
│   │   │   └── student/             # Student features
│   │   │       └── auth/            # Auth components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Library utilities
│   │   │   ├── api.ts               # API client
│   │   │   ├── auth.ts              # Auth utilities
│   │   │   ├── queryClient.ts       # React Query client
│   │   │   └── utils.ts             # Common utilities
│   │   ├── providers/               # React providers
│   │   ├── shared/                  # Shared components
│   │   │   ├── common/              # Common UI components
│   │   │   ├── container/           # Layout container
│   │   │   └── layout/              # Layout components
│   │   ├── store/                   # Redux store
│   │   │   ├── slices/              # Redux slices
│   │   │   │   ├── examSlice.ts     # Exam state
│   │   │   │   ├── languageSlice.ts # Language state
│   │   │   │   └── studentAuthSlice.ts  # Auth state
│   │   │   ├── index.ts             # Store configuration
│   │   │   └── ReduxProvider.tsx    # Redux provider
│   │   └── ui/                      # UI components (shadcn/ui)
│   │       ├── button.tsx           # Button component
│   │       ├── card.tsx             # Card component
│   │       ├── dialog.tsx           # Dialog/Modal component
│   │       ├── input.tsx            # Input component
│   │       └── pages/               # Page-specific components
│   │           ├── common/          # Common page components
│   │           ├── dashboard/       # Dashboard components
│   │           └── home/            # Home page components
│   └── lib/                         # Library code
│       ├── api/                     # API integration
│       │   └── student/             # Student API
│       │       ├── axiosConfig.ts   # Axios configuration
│       │       ├── endpoints.ts     # API endpoints
│       │       ├── functions.ts     # API functions
│       │       ├── queryHooks.ts    # React Query hooks
│       │       └── responseHandler.ts   # Response handling
│       ├── firebase/                # Firebase configuration
│       │   ├── firebaseConfig.ts    # Firebase setup
│       │   ├── NotificationContext.tsx  # Notification context
│       │   └── useFCMToken.ts       # FCM token hook
│       ├── student/                 # Student-specific code
│       │   └── translations/        # Translation files
│       │       ├── en.json          # English
│       │       ├── hi.json          # Hindi
│       │       └── ar.json          # Arabic
│       ├── langConfig.ts            # Language configuration
│       └── utils.ts                 # Utility functions
├── docs/                            # Project documentation
│   ├── API_STRUCTURE.md             # API structure guide
│   ├── FIREBASE_CONFIG_SETUP.md     # Firebase setup
│   ├── FEATURE_FLAGS_DOCUMENTATION.md  # Feature flags
│   └── [other feature docs]         # Feature-specific docs
├── .env.local                       # Environment variables
├── .gitignore                       # Git ignore rules
├── .prettierrc                      # Prettier configuration
├── components.json                  # shadcn/ui configuration
├── eslint.config.mjs                # ESLint configuration
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies and scripts
├── postcss.config.mjs               # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # Project documentation
```

## Key Directories

### `/public`

Contains static assets that are served directly without processing.

- **assets/images/** - All application images (logos, banners, icons)
- **firebase-messaging-sw.js** - Service worker for Firebase push notifications
- SVG icons and other static files

### `/src/app`

Next.js App Router with file-based routing.

- **(auth)/** - Route group for authentication pages (login, password reset)
- **(dashboard)/** - Route group for authenticated student pages
- **layout.tsx** - Defines the layout structure for routes
- **page.tsx** - Page components for each route
- Uses Next.js 15 App Router conventions

### `/src/components`

Organized React components by functionality.

#### `/components/chat/`

- Chat interface components
- Message bubbles, chat sidebar, contact list

#### `/components/hooks/`

- Custom React hooks for reusable logic
- **useLanguage.ts** - Multi-language support
- **useOnlineStatus.ts** - Network connectivity detection
- **useTranslate.ts** - Translation utilities
- **useElectiveSubjects.ts** - Elective subjects management

#### `/components/lib/`

- Core library utilities
- **api.ts** - Axios API client configuration
- **auth.ts** - Authentication utilities
- **queryClient.ts** - React Query configuration
- **toast.ts** - Toast notification utilities

#### `/components/providers/`

- React context providers
- **QueryProvider.tsx** - React Query provider
- **OnlineStatusProvider.tsx** - Online/offline status
- **ToastProvider.tsx** - Toast notifications

#### `/components/store/`

- Redux Toolkit state management
- **slices/** - Redux slices for different features
  - **studentAuthSlice.ts** - Authentication state
  - **examSlice.ts** - Exam-related state
  - **languageSlice.ts** - Language preferences
- **ReduxProvider.tsx** - Redux provider wrapper

#### `/components/ui/`

- Reusable UI components (shadcn/ui)
- Pre-built components like buttons, cards, dialogs, inputs
- **pages/** - Page-specific component collections

### `/src/lib`

Library code and integrations.

#### `/lib/api/student/`

- Complete API integration layer
- **axiosConfig.ts** - Axios instance configuration
- **endpoints.ts** - API endpoint definitions
- **functions.ts** - API request functions
- **queryHooks.ts** - React Query hooks for data fetching
- **responseHandler.ts** - Centralized response handling
- **statusCodes.ts** - HTTP status code handling

#### `/lib/firebase/`

- Firebase integration for push notifications
- **firebaseConfig.ts** - Firebase initialization
- **NotificationContext.tsx** - Notification state management
- **useFCMToken.ts** - Firebase Cloud Messaging token management
- **notificationHelper.ts** - Notification utilities

#### `/lib/student/translations/`

- Multi-language support files
- **en.json** - English translations
- **hi.json** - Hindi translations
- **ar.json** - Arabic translations

### `/docs`

Comprehensive feature documentation.

- API integration guides
- Feature-specific documentation
- Setup and configuration instructions
- Git workflow guidelines

## Important Files

### `package.json`

Lists all dependencies and project scripts.

```json
{
  "scripts": {
    "dev": "next dev --turbopack", // Start development server with Turbopack
    "build": "next build --turbopack", // Build for production
    "start": "next start", // Start production server
    "lint": "eslint" // Run ESLint
  },
  "dependencies": {
    "next": "^15.5.9", // Next.js framework
    "react": "^19.2.3", // React library
    "react-dom": "^19.2.3", // React DOM
    "@reduxjs/toolkit": "^2.11.2", // Redux state management
    "@tanstack/react-query": "^5.90.12", // Data fetching
    "axios": "^1.13.2", // HTTP client
    "firebase": "^12.6.0", // Firebase integration
    "tailwindcss": "^4.1.18" // Tailwind CSS
  }
}
```

### `.env.local`

Environment variables for configuration (create from template).

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-admin-panel-api.com/api/v1
NEXT_PUBLIC_API_VERSION=v1

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key

# App Configuration
NEXT_PUBLIC_APP_NAME=eSchool Student Portal
```

### `next.config.ts`

Next.js configuration file.

- Configures routing, images, environment variables
- Optimizations and build settings

### `tailwind.config.js`

Tailwind CSS configuration.

- Custom colors, fonts, and theme settings
- Plugin configurations

### `tsconfig.json`

TypeScript configuration.

- Compiler options
- Path aliases
- Type checking rules

### `src/app/layout.tsx`

Root layout component - wraps all pages.

- Defines global layout structure
- Includes providers (Redux, React Query, Toast)
- Global metadata and HTML structure

### `src/app/page.tsx`

Home page component (landing page).

## File Naming Conventions

- **Pages**: `page.tsx` (Next.js App Router convention)
- **Layouts**: `layout.tsx` (Next.js App Router convention)
- **Components**: PascalCase (e.g., `StudentCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useLanguage.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Types**: PascalCase (e.g., `StudentTypes.ts`)
- **API Files**: camelCase (e.g., `endpoints.ts`)
- **Redux Slices**: camelCase with `Slice` suffix (e.g., `studentAuthSlice.ts`)

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **UI Components**: shadcn/ui (Radix UI)
- **Notifications**: Firebase Cloud Messaging
- **Icons**: Lucide React, React Icons
- **Charts**: Recharts
- **Date Handling**: date-fns
- **PDF Generation**: jsPDF

## Routing Structure

Next.js App Router uses file-based routing:

- **`(auth)/`** - Route group (doesn't affect URL path)
- **`student/`** - URL segment: `/student`
- **`page.tsx`** - Creates a route page
- **`layout.tsx`** - Shared layout for routes
- **`[id]/`** - Dynamic route segment: `/student/[id]`
- **`[[...slug]]/`** - Optional catch-all route

## Best Practices

1. **Component Organization**: Keep components small and focused on a single responsibility
2. **TypeScript**: Use proper typing for props, state, and API responses
3. **API Layer**: All API calls go through `/lib/api/student/` with React Query hooks
4. **State Management**:
   - Use Redux for global state (auth, language, exams)
   - Use React Query for server state (API data)
   - Use React Context for UI state
5. **Styling**: Use Tailwind CSS utility classes, avoid inline styles
6. **File Structure**: Follow Next.js App Router conventions
7. **Error Handling**: Centralized error handling in `responseHandler.ts`
8. **Translations**: Use the translation system for all user-facing text
9. **Performance**:
   - Use Next.js Image component for images
   - Implement proper loading states
   - Use React Query caching effectively
10. **Security**:
    - Never expose sensitive keys in client-side code
    - Use environment variables with `NEXT_PUBLIC_` prefix for client-side values
