# Hifz Competition - Developer Guide

A comprehensive tutorial guide for developers working on the Hifz Competition Display System. This document explains the architecture, data flow, components, and implementation details.

## Table of Contents

1. [Overview](#overview)
2. [Data Flow: Google Sheets to JSON](#data-flow-google-sheets-to-json)
3. [Project Architecture](#project-architecture)
4. [Constants and Configuration](#constants-and-configuration)
5. [State Management (Vuex Store)](#state-management-vuex-store)
6. [Components Deep Dive](#components-deep-dive)
7. [Pages and Routing](#pages-and-routing)
8. [Composables](#composables)
9. [Styling System](#styling-system)
10. [Environment Setup](#environment-setup)
11. [Build and Deployment](#build-and-deployment)

---

## Overview

The Hifz Competition Display System is a Vue 3 application designed to display participant information during the International Hifz Competition. It features:

- **Real-time data fetching** from Google Sheets
- **Two main views**: Profile View and TV Output View
- **Keyboard navigation** for participant selection
- **Quran page display** (1-619 pages)
- **Responsive design** optimized for large displays

### Technology Stack

- **Vue 3** (Composition API with `<script setup>`)
- **Vuex 4** - State management
- **Vue Router 4** - Client-side routing
- **Vite** - Build tool and dev server
- **SCSS** - Styling with modular architecture
- **vue3-keypress** - Keyboard event handling

---

## Data Flow: Google Sheets to JSON

### Step 1: Google Sheets Structure

The application expects a Google Sheet with the following column structure (first row is headers, data starts from row 2):

| Column Index | Field Name | Description |
|-------------|------------|-------------|
| 0 | SLOT_SCHEDULE | Participant's schedule slot |
| 1 | CATEGORY | Competition category |
| 2 | FIRST_AND_LAST_NAME | Full name (combined) |
| 3 | FIRST_NAME | Participant's first name |
| 4 | LAST_NAME | Participant's last name |
| 5 | FLAG | Country name |
| 6 | PARTICIPANT_PHOTO | Photo filename (e.g., `photo.jpg`) |
| 7 | CATEGORY_IMAGE | Category image filename (e.g., `a_28.png`) |
| 8 | FLAG_IMAGE | Flag image filename (e.g., `pakistan.png`) |
| 9 | AGE_ON_EVENT | Participant's age |

### Step 2: Environment Variables

Create a `.env` file in the project root:

```env
VITE_SHEET_ID=your_google_sheet_id_here
VITE_SHEET_RANGE=Sheet1!A1:J1000
VITE_SHEET_API_KEY=your_google_api_key_here
```

**How to get these values:**

1. **Sheet ID**: Found in the Google Sheets URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

2. **Range**: The sheet name and cell range (e.g., `Sheet1!A1:J1000`)

3. **API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project or select existing
   - Enable Google Sheets API
   - Create credentials (API Key)
   - Restrict the key to Google Sheets API

### Step 3: API Request

The data fetching happens in `src/store.js` in the `fetchProfiles` action:

```javascript
const response = await fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
);
```

**API Endpoint Format:**
```
https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{RANGE}?key={API_KEY}
```

### Step 4: Response Processing

The Google Sheets API returns data in this format:

```json
{
  "range": "Sheet1!A1:J1000",
  "majorDimension": "ROWS",
  "values": [
    ["SLOT_SCHEDULE", "CATEGORY", "FIRST_AND_LAST_NAME", ...],  // Header row
    ["Slot 1", "Category A", "John Doe", "John", "Doe", ...],   // Data row 1
    ["Slot 2", "Category B", "Jane Smith", "Jane", "Smith", ...] // Data row 2
  ]
}
```

### Step 5: Data Transformation

The raw array data is transformed into an array of objects:

```javascript
const values = data.values
  .slice(1)  // Skip header row
  .map((row) => {
    return {
      'SLOT_SCHEDULE': row[0],
      'CATEGORY': row[1],
      'FIRST_AND_LAST_NAME': row[2],
      'FIRST_NAME': row[3],
      'LAST_NAME': row[4],
      'FLAG': row[5],
      'PARTICIPANT_PHOTO': row[6],
      'CATEGORY_IMAGE': row[7],
      'FLAG_IMAGE': row[8],
      'AGE_ON_EVENT': row[9],
    };
  });
```

**Result:** An array of profile objects stored in Vuex state.

---

## Project Architecture

### Directory Structure

```
src/
├── assets/              # Static assets and styles
│   ├── images/         # Image files
│   ├── scss/           # SCSS modules
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _components.scss
│   │   ├── _profile-page.scss
│   │   └── _tv-output-page.scss
│   ├── base.css        # Base styles
│   └── main.scss       # Main stylesheet
├── components/           # Reusable Vue components
│   ├── Navbar.vue
│   ├── Dropdown.vue
│   └── Loader.vue
├── composables/        # Vue 3 composables
│   ├── useKeyboardShortcuts.js
│   └── useProfileNavigation.js
├── pages/              # Route components
│   ├── Home.vue        # Profile view
│   └── TvOutput.vue    # TV output view
├── App.vue             # Root component
├── constants.js        # Application constants
├── main.js             # Application entry point
├── router.js           # Vue Router configuration
└── store.js            # Vuex store configuration
```

### Application Flow

```
main.js
  └── Creates Vue app instance
      ├── App.vue (Root Component)
      │   ├── Fetches profiles on mount
      │   ├── Manages selectedProfile state
      │   ├── Manages selectedPageNo state
      │   └── Renders Navbar + Router View
      │
      ├── Router (router.js)
      │   ├── /fip → Home.vue (Profile View)
      │   └── /fip/recitations → TvOutput.vue (TV View)
      │
      └── Store (store.js)
          ├── State: profiles[], loading, error
          └── Actions: fetchProfiles()
```

---

## Constants and Configuration

### File: `src/constants.js`

This file centralizes all application constants to ensure consistency and easy maintenance.

#### Routes

```javascript
export const ROUTE_HOME = '/fip';
export const ROUTE_TV_OUTPUT = '/fip/recitations';
```

**Usage:** Used in router configuration and navigation links to avoid hardcoded paths.

#### Application Constants

```javascript
export const QURAN_MAX_PAGES = 619;
export const QURAN_MIN_PAGE = 1;
export const BASE_PATH = '/fip';
```

**Usage:**
- `QURAN_MAX_PAGES` / `QURAN_MIN_PAGE`: Validation for Quran page input
- `BASE_PATH`: Base path for asset URLs (matches Vite config)

#### Profile Field Names

```javascript
export const PROFILE_FIELDS = {
  SLOT_SCHEDULE: 'SLOT_SCHEDULE',
  CATEGORY: 'CATEGORY',
  FIRST_AND_LAST_NAME: 'FIRST_AND_LAST_NAME',
  FIRST_NAME: 'FIRST_NAME',
  LAST_NAME: 'LAST_NAME',
  FLAG: 'FLAG',
  PARTICIPANT_PHOTO: 'PARTICIPANT_PHOTO',
  CATEGORY_IMAGE: 'CATEGORY_IMAGE',
  FLAG_IMAGE: 'FLAG_IMAGE',
  AGE_ON_EVENT: 'AGE_ON_EVENT',
};
```

**Usage:** Prevents typos when accessing profile object properties. Instead of:
```javascript
profile['FIRST_NAME']  // Error-prone
```

Use:
```javascript
profile[PROFILE_FIELDS.FIRST_NAME]  // Type-safe
```

#### Asset Paths

```javascript
export const ASSET_PATHS = {
  PARTICIPANTS: `${BASE_PATH}/participants-w/`,
  QURAN: `${BASE_PATH}/quran/`,
  FLAGS: 'flags/',
  CATEGORIES: 'categories/',
};
```

**Usage:** Constructs image URLs:
```javascript
// Participant photo
`${ASSET_PATHS.PARTICIPANTS}${profile[PROFILE_FIELDS.PARTICIPANT_PHOTO]}`

// Quran page
`${ASSET_PATHS.QURAN}001.png`

// Flag
`${ASSET_PATHS.FLAGS}${profile[PROFILE_FIELDS.FLAG_IMAGE]}`
```

**Note:** Flags and Categories use relative paths because they're in the `public/` directory and don't need the base path prefix.

---

## State Management (Vuex Store)

### File: `src/store.js`

The Vuex store manages application-wide state using a simple pattern: **State → Mutations → Actions**.

### State

```javascript
state: {
  profiles: [],      // Array of participant profile objects
  loading: false,    // Loading state for API calls
  error: null        // Error message if API call fails
}
```

### Mutations

Mutations are synchronous functions that modify state:

```javascript
mutations: {
  setProfiles(state, data) {
    state.profiles = data;  // Replace entire profiles array
  },
  setLoading(state, isLoading) {
    state.loading = isLoading;  // Update loading state
  },
  setError(state, error) {
    state.error = error;  // Set error message
  }
}
```

**Why mutations?** Vuex requires state changes through mutations for tracking and debugging.

### Actions

Actions are asynchronous functions that commit mutations:

```javascript
actions: {
  async fetchProfiles({ commit }) {
    // 1. Set loading state
    commit('setLoading', true);
    commit('setError', null);

    try {
      // 2. Get environment variables
      const sheetId = import.meta.env.VITE_SHEET_ID;
      const range = import.meta.env.VITE_SHEET_RANGE;
      const apiKey = import.meta.env.VITE_SHEET_API_KEY;

      // 3. Validate environment variables
      if (!sheetId || !range || !apiKey) {
        throw new Error('Missing required environment variables');
      }

      // 4. Fetch data from Google Sheets API
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
      );

      // 5. Check response status
      if (!response.ok) {
        throw new Error(`Failed to fetch profiles: ${response.status}`);
      }

      // 6. Parse JSON response
      const data = await response.json();

      // 7. Validate data structure
      if (!data.values || !Array.isArray(data.values)) {
        throw new Error('Invalid data format received from API');
      }

      // 8. Transform array data to objects
      const values = data.values
        .slice(1)  // Skip header row
        .map((row) => ({
          'SLOT_SCHEDULE': row[0],
          'CATEGORY': row[1],
          // ... map all fields
        }));

      // 9. Commit to state
      commit('setProfiles', values);
    } catch (error) {
      // 10. Handle errors
      commit('setError', error.message);
    } finally {
      // 11. Always set loading to false
      commit('setLoading', false);
    }
  }
}
```

### Usage in Components

```javascript
// In App.vue or any component
import { useStore } from 'vuex';

const store = useStore();

// Dispatch action
await store.dispatch('fetchProfiles');

// Access state
const profiles = store.state.profiles;
const isLoading = store.state.loading;
const error = store.state.error;
```

---

## Components Deep Dive

### 1. App.vue (Root Component)

**Location:** `src/App.vue`

**Purpose:** Root component that orchestrates the entire application.

**Key Responsibilities:**
- Fetches profiles on mount
- Manages selected profile state
- Manages selected Quran page number
- Handles loading and error states
- Renders Navbar and Router View

**State Management:**
```javascript
const store = useStore();
const selectedProfile = ref(null);      // Currently selected profile
const selectedPageNo = ref(1);          // Currently selected Quran page
```

**Lifecycle:**
```javascript
onMounted(async () => {
  // Fetch profiles from Google Sheets
  await store.dispatch('fetchProfiles');

  // Select first profile by default
  if (store.state.profiles.length > 0) {
    selectedProfile.value = store.state.profiles[0];
  }
});
```

**Props Passing:**
- `selectedProfile` → Passed to router-view (Home.vue or TvOutput.vue)
- `selectedPageNo` → Passed to router-view (TvOutput.vue only)

**Event Handlers:**
```javascript
const onSelectProfile = (selectedIndex) => {
  selectedProfile.value = store.state.profiles[selectedIndex];
};

const onChangePageNo = (pageNo) => {
  const page = Number(pageNo);
  if (!isNaN(page) && page >= QURAN_MIN_PAGE && page <= QURAN_MAX_PAGES) {
    selectedPageNo.value = page;
  }
};
```

### 2. Navbar.vue

**Location:** `src/components/Navbar.vue`

**Purpose:** Navigation bar with participant selection and page controls.

**Props:**
- `profiles` (Array) - List of all profiles
- `onSelectProfile` (Function) - Callback when profile is selected
- `onChangePageNo` (Function) - Callback when page number changes

**Features:**
1. **Participant Dropdown** - Searchable dropdown to select participants
2. **Navigation Buttons** - Previous/Next buttons for participant navigation
3. **Keyboard Shortcuts** - Arrow keys for navigation (disabled when input focused)
4. **Page Number Input** - Only visible on TV Output page
5. **Route Navigation** - Toggle between Profile and TV Output views

**Composables Used:**
- `useProfileNavigation` - Manages profile index and navigation
- `useKeyboardShortcuts` - Handles arrow key events

**Keyboard Shortcut Management:**
```javascript
const handleInputFocus = () => disableShortcuts();   // Disable when typing
const handleInputBlur = () => enableShortcuts();      // Re-enable after typing
const handleDropdownOpen = () => disableShortcuts();   // Disable when dropdown open
const handleDropdownClose = () => enableShortcuts();   // Re-enable when closed
```

### 3. Dropdown.vue

**Location:** `src/components/Dropdown.vue`

**Purpose:** Reusable dropdown component for participant selection.

**Props:**
- `modelValue` (Number/String) - Selected option index
- `options` (Array) - Array of options to display
- `optionLabel` (String) - Property name to display (default: 'label')
- `placeholder` (String) - Placeholder text

**Events:**
- `update:modelValue` - Emitted when selection changes
- `open` - Emitted when dropdown opens
- `close` - Emitted when dropdown closes

**Features:**
1. **Click Outside Detection** - Closes dropdown when clicking outside
2. **Keyboard Navigation** - Arrow keys, Enter, Escape
3. **Smooth Animations** - Vue transitions for open/close
4. **Accessibility** - ARIA attributes for screen readers

**Key Methods:**
```javascript
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  // Emit open/close events
};

const selectOption = (index) => {
  emit('update:modelValue', index);  // v-model update
  isOpen.value = false;
};

const handleKeydown = (event) => {
  // ArrowDown/ArrowUp: Navigate options
  // Enter: Select option
  // Escape: Close dropdown
};
```

### 4. Loader.vue

**Location:** `src/components/Loader.vue`

**Purpose:** Full-screen loading overlay with spinner.

**Props:**
- `message` (String) - Loading message (default: 'Loading...')

**Features:**
- Fixed overlay covering entire screen
- Animated spinner
- Customizable message

**Usage:**
```vue
<Loader v-if="store.state.loading" message="Loading participants..." />
```

### 5. Home.vue (Profile View)

**Location:** `src/pages/Home.vue`

**Purpose:** Detailed participant profile display.

**Props:**
- `selectedProfile` (Object) - Currently selected profile

**Layout:**
- **Left Panel:** Participant photo
- **Right Panel:**
  - Name (First + Last)
  - Age (with English/Portuguese labels)
  - Country flag and name
  - Category image
  - Organization logos

**Image Paths:**
```javascript
// Participant photo
`${ASSET_PATHS.PARTICIPANTS}${selectedProfile[PROFILE_FIELDS.PARTICIPANT_PHOTO]}`

// Flag
`${ASSET_PATHS.FLAGS}${selectedProfile[PROFILE_FIELDS.FLAG_IMAGE]}`

// Category
`${ASSET_PATHS.CATEGORIES}${selectedProfile[PROFILE_FIELDS.CATEGORY_IMAGE]}`
```

### 6. TvOutput.vue (TV Output View)

**Location:** `src/pages/TvOutput.vue`

**Purpose:** Optimized layout for live streaming and large displays.

**Props:**
- `selectedProfile` (Object) - Currently selected profile
- `selectedPageNo` (Number) - Currently selected Quran page (1-619)

**Layout:**
- **Left Panel:**
  - Stream space (reserved for video)
  - Participant name and country flag
  - Organization logos and category image
- **Right Panel:**
  - Quran page image

**Quran Page Image:**
```javascript
const quranPageImage = computed(() => {
  const pageNumber = String(props.selectedPageNo || 1).padStart(3, '0');
  return `${ASSET_PATHS.QURAN}${pageNumber}.png`;
});
```

**Image Naming Convention:** Quran pages are named `001.png`, `002.png`, ..., `619.png` (zero-padded to 3 digits).

---

## Pages and Routing

### Router Configuration

**File:** `src/router.js`

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import { ROUTE_HOME, ROUTE_TV_OUTPUT } from './constants';

const routes = [
  { path: ROUTE_HOME, component: Home, props: true },
  { path: ROUTE_TV_OUTPUT, component: TvOutput, props: true },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
```

**Routes:**
- `/fip` → `Home.vue` (Profile View)
- `/fip/recitations` → `TvOutput.vue` (TV Output View)

**Props Passing:** Both routes receive props from `App.vue` via `router-view`:
```vue
<router-view
  v-if="selectedProfile"
  :selectedProfile="selectedProfile"
  :selectedPageNo="selectedPageNo"
/>
```

**Base Path:** The router uses `createWebHistory()` with base path `/fip/` (configured in `vite.config.js`).

---

## Composables

Composables are reusable Vue 3 Composition API functions that encapsulate logic.

### 1. useProfileNavigation

**Location:** `src/composables/useProfileNavigation.js`

**Purpose:** Manages profile navigation state and logic.

**Parameters:**
- `profiles` (Computed/Array) - List of profiles
- `onSelectProfile` (Function) - Callback when profile changes

**Returns:**
```javascript
{
  selectedIndex: ref(0),        // Current profile index
  isPrevDisabled: computed,      // True if at first profile
  isNextDisabled: computed,      // True if at last profile
  goToPrev: () => void,          // Navigate to previous profile
  goToNext: () => void,          // Navigate to next profile
  updateSelectedIndex: (index) => void  // Update index programmatically
}
```

**Usage:**
```javascript
const { selectedIndex, isPrevDisabled, isNextDisabled, goToPrev, goToNext } =
  useProfileNavigation(
    computed(() => props.profiles),
    props.onSelectProfile
  );
```

**Logic:**
- Tracks current index (starts at 0)
- Prevents navigation beyond array bounds
- Calls callback when index changes

### 2. useKeyboardShortcuts

**Location:** `src/composables/useKeyboardShortcuts.js`

**Purpose:** Manages keyboard shortcuts for navigation.

**Parameters:**
- `onPrev` (Function) - Callback for left arrow key
- `onNext` (Function) - Callback for right arrow key

**Returns:**
```javascript
{
  isShortcutActive: ref(true),   // Whether shortcuts are enabled
  disableShortcuts: () => void,   // Disable shortcuts
  enableShortcuts: () => void     // Enable shortcuts
}
```

**Implementation:**
Uses `vue3-keypress` library to listen for arrow key events:
- **Left Arrow** → Previous profile
- **Right Arrow** → Next profile

**Why Disable/Enable?**
Shortcuts are disabled when:
- User is typing in an input field
- Dropdown is open

This prevents conflicts between keyboard navigation and user input.

**Usage:**
```javascript
const { disableShortcuts, enableShortcuts } = useKeyboardShortcuts(goToPrev, goToNext);

// Disable when input focused
const handleInputFocus = () => disableShortcuts();
const handleInputBlur = () => enableShortcuts();
```

---

## Styling System

### SCSS Architecture

The styling system uses a modular SCSS architecture:

```
assets/
├── main.scss              # Main entry point
├── base.css               # Base styles and resets
└── scss/
    ├── _variables.scss    # Design tokens (colors, spacing, typography)
    ├── _mixins.scss       # Reusable mixins
    ├── _components.scss   # Component styles
    ├── _profile-page.scss # Profile page specific styles
    └── _tv-output-page.scss # TV output page specific styles
```

### Design Tokens (`_variables.scss`)

**Colors:**
```scss
$color-orange: #D2910F;    // Primary brand color
$color-gray: #717171;      // Text color
$color-white: #fff;        // Background
$color-black: #000;        // Text
```

**Spacing System:**
```scss
$spacing-xs: 10px;
$spacing-sm: 20px;
$spacing-md: 30px;
$spacing-lg: 40px;
// ... up to $spacing-5xl: 80px
```

**Typography:**
```scss
$font-size-xs: 18px;
$font-size-sm: 20px;
// ... up to $font-size-4xl: 85px

$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

**Layout:**
```scss
$header-height: 65px;
$border-radius-sm: 8px;
$border-radius-md: 16px;
$border-radius-lg: 32px;
```

### Mixins (`_mixins.scss`)

Common reusable mixins:

```scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin button-reset {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
}

@mixin hide-number-spinner {
  // Hide number input spinners
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
```

### Component Styles

Each component imports variables and mixins:

```scss
<style lang="scss" scoped>
@import '../assets/scss/variables';
@import '../assets/scss/mixins';

// Component styles using design tokens
.button {
  padding: $spacing-xs $spacing-sm;
  color: $color-orange;
  font-size: $font-size-sm;
}
</style>
```

---

## Environment Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SHEET_ID=your_google_sheet_id
VITE_SHEET_RANGE=Sheet1!A1:J1000
VITE_SHEET_API_KEY=your_google_api_key
```

**Important:**
- Vite requires the `VITE_` prefix for environment variables
- Never commit `.env` files to version control
- Use `.env.example` for documentation

### 3. Google Sheets API Setup

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project

2. **Enable Google Sheets API:**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

3. **Create API Key:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

4. **Restrict API Key (Recommended):**
   - Click on the created API key
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Sheets API"
   - Under "Application restrictions", set HTTP referrer restrictions if needed

5. **Share Google Sheet:**
   - Open your Google Sheet
   - Click "Share" → "Get link"
   - Set to "Anyone with the link can view" (or use service account)

### 4. Asset Preparation

Ensure the following directories exist in `public/`:

```
public/
├── participants-w/    # Participant photos (86 .jpg files)
├── quran/             # Quran pages (619 .png files: 001.png to 619.png)
├── flags/             # Country flags (.png files)
└── categories/        # Category images (.png files)
```

**Naming Conventions:**
- Participant photos: Filename must match `PARTICIPANT_PHOTO` field from sheet
- Quran pages: Zero-padded 3 digits (`001.png`, `002.png`, ..., `619.png`)
- Flags: Filename must match `FLAG_IMAGE` field from sheet
- Categories: Filename must match `CATEGORY_IMAGE` field from sheet

---

## Build and Deployment

### Development

```bash
npm run dev
```

- Starts Vite dev server
- Automatically opens Google Chrome
- Hot Module Replacement (HMR) enabled
- Access at `http://localhost:5173/fip`

### Production Build

```bash
npm run build
```

**Output:** `dist/` directory containing:
- Optimized and minified JavaScript
- Processed CSS
- Static assets
- `index.html`

### Preview Production Build

```bash
npm run preview
```

Tests the production build locally before deployment.

### Deployment

The project is configured for SFTP deployment via GitHub Actions (`.github/workflows/deploy.yaml`).

**Manual Deployment:**
1. Build the project: `npm run build`
2. Upload `dist/` contents to your web server
3. Ensure the server serves files from the `/fip/` base path

**Server Configuration:**
- Base path: `/fip/`
- SPA routing: Configure server to redirect all routes to `index.html`

**Apache Example (`.htaccess`):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /fip/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /fip/index.html [L]
</IfModule>
```

---

## Troubleshooting

### Common Issues

1. **"Missing required environment variables"**
   - Check `.env` file exists and has correct variable names
   - Ensure variables start with `VITE_` prefix
   - Restart dev server after changing `.env`

2. **"Failed to fetch profiles"**
   - Verify Google Sheets API is enabled
   - Check API key is valid and not restricted incorrectly
   - Ensure sheet is shared (if using public API key)
   - Verify sheet ID and range are correct

3. **Images not loading**
   - Check file paths match exactly (case-sensitive)
   - Verify files exist in `public/` directory
   - Ensure base path is correct (`/fip/`)

4. **Routing not working**
   - Configure server for SPA routing (redirect to `index.html`)
   - Verify base path in `vite.config.js` matches server setup

---

## Best Practices

1. **Always use constants** from `constants.js` instead of hardcoded strings
2. **Access profile fields** using `PROFILE_FIELDS` constant
3. **Handle loading and error states** in components
4. **Disable keyboard shortcuts** when user is typing
5. **Validate input** (e.g., Quran page number range)
6. **Use computed properties** for derived data
7. **Follow Vue 3 Composition API** patterns with `<script setup>`
8. **Keep components focused** on a single responsibility
9. **Use composables** for reusable logic
10. **Maintain consistent styling** using design tokens

---

## Additional Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vuex 4 Documentation](https://vuex.vuejs.org/)
- [Vue Router 4 Documentation](https://router.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)

---

## Credits

Developed by **[Nabil](https://github.com/nabilanam)** and **Huzaifa**.

---

*Last Updated: 2024*

