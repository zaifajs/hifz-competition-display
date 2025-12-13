# Hifz Competition Display System

A Vue 3 application for displaying participant information during the International Hifz Competition 2023 in Lisbon. Designed for big screen displays and online streaming with fixed aspect ratios to ensure consistent presentation across different display formats.

## Overview

This application displays participant profiles, Quran pages, and competition information in real-time. It features two main views:
- **Profile View**: Detailed participant information with photos, country flags, and categories
- **TV Output View**: Optimized layout for live streaming and large screen displays with participant names, flags, and Quran page references

## Data Source

Participant data is fetched from **Google Sheets** via the Google Sheets API. The application requires the following environment variables:

- `VITE_SHEET_ID` - Google Sheets spreadsheet ID
- `VITE_SHEET_RANGE` - Sheet range to fetch data from
- `VITE_SHEET_API_KEY` - Google Sheets API key

The data includes participant names, photos, country flags, categories, ages, and scheduling information.

## Features

- Real-time participant profile display
- Quran page navigation (1-619 pages)
- Keyboard navigation (arrow keys for participant selection)
- Loading states and error handling
- Responsive design optimized for fixed aspect ratio displays
- Multi-language support (English/Portuguese labels)

## Project Setup

```sh
npm install
```

### Development

```sh
npm run dev
```

The application will open in Google Chrome automatically.

### Production Build

```sh
npm run build
```

### Linting

```sh
npm run lint
```

## Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **Vuex** - State management
- **Vue Router** - Routing
- **Vite** - Build tool and dev server
- **SCSS** - Styling

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Credits

Developed by **[Nabil](https://github.com/nabilanam)** and **Huzaifa**.
