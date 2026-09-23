# BugQuest

BugQuest is a small, friendly bug-collecting field guide inspired by creature-collection games. Players explore real habitats, register a habitat photo, unlock local insects, and learn a verified fact before adding each discovery to their Bugdex.

## Course Submission

- Course: IN405109 Hybrid Mobile Application Programming
- Author: นายรณกฤต สาแก้ว
- Student ID: 663450351-5
- Platform target: Expo SDK 54 + Expo Router + TypeScript

The prototype uses educational collection mechanics rather than copying Pokémon assets or branding. A discovered bug shows its Thai/English name, scientific name, habitat, conservation note when available, and a short fact. Undiscovered bugs stay as silhouettes or `?` to keep exploration meaningful.

## 11-topic coverage

| # | Topic | Current evidence | Status |
|---|---|---|---|
| 1 | Mobile, React Native, Expo, TypeScript | Expo SDK 54, Router, strict typecheck, native entry | Working |
| 2 | Components, props, state, events | Native SpotCard, BugdexCard, tab and favorite events | Working |
| 3 | Styling, responsive lists, states | Responsive FlatList grid and native visual states | Working |
| 4 | Navigation | Expo Router stack: index, spot, bug, favorites, profile, login, catch, map | Working |
| 5 | Forms and state management | Favorite/discovery events plus validated login and catch registration forms | Working |
| 6 | REST API and networking | `src/services/api.ts` and `mock-server/server.ts`: GET, login, POST registration | Working |
| 7 | Storage and offline-first | AsyncStorage cache/favorites/pending queue service plus web persistence | Working |
| 8 | Authentication and security | Login route, expiring session in SecureStore, Bearer registration request | Working |
| 9 | Camera and image picker | Camera permission, CameraView, gallery fallback, preview and validation | Working |
| 10 | Location and maps | Location permission, current position, MapView markers and radius circles | Working |
| 11 | Notifications and platform APIs | Local 10-second reminder and notification response deep link to spot detail | Working |

`Working` means the feature has a native route/service implementation and can be demonstrated with Expo Go, a device/simulator, or the web fallback where hardware APIs are unavailable.

## Image and data attribution

Bug reference images are loaded from Wikimedia Commons through `src/data/bugMedia.ts`. Each image entry includes its source file page and credit. Wikimedia files can have different licenses, so the file page must be checked before a public release and the author/license attribution must remain visible. The app's cute SVG art is an original educational illustration and is not a photograph of a real insect.

Reference galleries used while preparing the catalog:

- [Attacus atlas](https://commons.wikimedia.org/wiki/Attacus_atlas)
- [Troides aeacus](https://commons.wikimedia.org/wiki/Troides_aeacus)
- [Oecophylla smaragdina](https://commons.wikimedia.org/wiki/Oecophylla_smaragdina)
- [Lethocerus indicus](https://commons.wikimedia.org/wiki/Category:Lethocerus_indicus)
- [Hymenopus coronatus](https://commons.wikimedia.org/wiki/Hymenopus_coronatus)

## Run Locally

Prerequisite: Node.js and npm.

1. Install dependencies:
   `npm install`
2. For the existing full web UI, run:
   `npm start`
   Then open `http://localhost:3000`.
3. For Expo SDK 54 Web or Expo Go, run:
   `npm run expo:web`
   Then open the URL shown by Expo, or scan the QR code with Expo Go.
4. Start the mock REST API in a second terminal:
   `npm run api`
5. For a physical device, set `EXPO_PUBLIC_API_URL` to the computer's LAN URL, for example `http://192.168.1.20:3001`.

Demo login: `explorer@bugquest.dev` / `1234`.

Native demo routes include `/spot/[id]`, `/bug/[id]`, `/favorites`, `/profile`, `/login`, `/catch/[spotId]`, and `/map`. The main UI also provides Home, Camera, and Collection tabs.

## Checks

- TypeScript: `npm run lint`
- Vite production build: `npm run build`
- Expo health check: `npm run expo:doctor`

The Vite route contains the complete existing DOM/Leaflet presentation. Expo Web and native Expo Go share the React Native-compatible shell in `app/index.tsx` through the platform entry files. This keeps the Expo route free from DOM-only modules while Vite remains available for the richer web presentation.
