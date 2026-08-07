# Shopicom Mobile — Session Handoff

**Updated:** 2026-08-06  
**Current milestone:** Home, Categories, Create Listing, and Inbox screens approved on Android.  
**Working preference:** Complete and report one bounded step before moving to the next.

## Project configuration

- GitHub: `https://github.com/OlaMarcus09/shopicom.git`
- Firebase development project: `shopicom-limited-dev`
- Expo/EAS project: `@shopicmltd/shopicom-mobile`
- Android package: `com.shopicom.app`
- Development APK is installed on the physical Android phone.
- Email/password Firebase authentication is enabled and physically verified.

## Completed and verified

- Figma Registration screen implemented and approved.
- Fixed the Ghana `+233` phone-prefix wrapping issue.
- Figma Login screen implemented and approved.
- Registration, restored session, login, logout, and Profile details verified on Android.
- Marketplace Home implemented and approved after responsive scaling fixes.
- Home advert now displays fully rather than being cropped.
- Home header, categories, product cards, typography, and spacing resize for smaller phones.
- Profile tab preserves the working logout flow.
- Categories sidebar correction and six-tile grid verified on Android.
- Compact Create Listing form implemented and approved.
- Compact Inbox/Messages screen implemented and approved.
- All 11 saved Figma screen exports are in `docs/figma/screens/`.

## Mobile sizing standard

The founder approved the compact Inbox scale as the standard for all remaining screens. Keep headings, controls, list rows, icons, and vertical spacing restrained. Avoid transferring oversized Figma-export dimensions directly to the phone UI. Existing Home, Categories, and Create Listing screens have already been compacted.

## Categories implementation

- Added `src/features/categories/CategoriesScreen.tsx` and connected it to the Categories bottom tab.
- The first version had a layout bug on the physical phone: the sidebar expanded over the recommendation area and hid the six tiles.
- Corrected the structure using:
  - A strict responsive sidebar width.
  - A separate flexible recommendation panel.
  - A visible `3 × 2` six-tile grid.
  - Smaller phone-friendly typography and icons.
- TypeScript and `git diff --check` passed after the correction.
- The corrected Categories layout was visually approved on the phone.
- `docs/figma/assets/Group 38.png` is the saved composite Categories reference. It is not a set of separate category assets.

## Exact next step

1. Start Metro with:
   `EXPO_NO_TELEMETRY=1 npm run start -- --dev-client --lan --port 8097`
2. Open the installed Shopicom app on the Android phone.
3. Continue with the next saved Figma screen using the approved compact sizing standard.

## Pending product work

- Chat screen.
- Listing details screen.
- Hot-selling grid.
- Vendor storefront.
- Final Figma Profile styling.
- Phone and Google authentication backend setup remains intentionally deferred.

## Recent commits

- `696d9ef` — initial marketplace Home screen.
- `f2bee17` — responsive Home layout and contained advert.
- `6d64c19` — initial responsive Categories screen.

Never request or commit passwords, private keys, tokens, `.env.local`, or Firebase service-account JSON.
