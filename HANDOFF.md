# Shopicom Mobile — Session Handoff

**Updated:** 2026-08-17
**Current milestone:** MVP screens and core marketplace flows are implemented; Firebase is now on Blaze and cloud image storage is the next integration milestone.
**Working preference:** Complete and report one bounded step before moving to the next.

## Project configuration

- GitHub: `https://github.com/OlaMarcus09/shopicom.git`
- Firebase development project: `shopicom-limited-dev`
- Expo/EAS project: `@shopicmltd/shopicom-mobile`
- Android package: `com.shopicom.app`
- Development APK is installed on the physical Android phone.
- Email/password Firebase authentication is enabled and physically verified.
- Google Sign-In is required for MVP. Its OAuth flow is implemented, but the first APK test exposed an Android redirect-scheme error. The native redirect fix is now in the code and requires a fresh APK build and phone test.
- Firebase billing has been upgraded to Blaze. Storage bucket creation and deployment are now unblocked.

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
- Chat screen implemented with keyboard-aware composer and approved.
- Listing Details flow implemented with product, vendor, delivery, and review sections and approved.
- Hot Selling two-column product grid implemented and approved.
- Vendor Storefront implemented with responsive listings and approved.
- Figma-style Profile screen implemented with account sections and approved.
- Modern floating bottom navigation implemented and approved.
- All 11 saved Figma screen exports are in `docs/figma/screens/`.

## Mobile sizing standard

The founder approved the compact Inbox scale as the standard for all remaining screens. Keep headings, controls, list rows, icons, and vertical spacing restrained. Avoid transferring oversized Figma-export dimensions directly to the phone UI. Existing Home, Categories, and Create Listing screens have already been compacted.

## Firebase marketplace progress

- Firestore listing model and services added in `src/features/listings/`.
- Firestore security rules and active-listing index deployed successfully to `shopicom-limited-dev`.
- Expo Image Picker installed.
- Create Listing supports selecting up to 10 photos, removing individual selections, previewing them, saving the listing locally, and syncing listing metadata to Firestore.
- Listing image uploads are now connected: selected photos upload under the authenticated seller and listing ID, and their download URLs are saved in Firestore.
- Storage rules are deployed from `storage.rules`; the remaining step is physical-device verification with a fresh native APK.
- Firebase is now on the Blaze plan, so the previous billing blocker is resolved.

## Confirmed MVP scope updates

- Products and Services are enabled for the first release. Hotels, Jobs, Food, and Property remain gated for a later phase.
- The shared category and subcategory taxonomy drives Create Listing, Categories, and Search filters.
- The vendor application contains the confirmed personal and business fields and submits with `pending` status.
- Optional seller WhatsApp contact is supported on storefront and listing details.
- Privacy Policy, Terms of Service, and Cookie Policy open the current official Shopicom pages in an in-app browser.
- Phone OTP remains deferred; its existing scaffolding is preserved.

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

1. Build a fresh preview APK containing the Google redirect fix and Storage integration.
2. Test Google Sign-In on the physical Android phone.
3. Create a listing with one or more photos and verify the upload in Storage and the URLs in Firestore.
4. Verify the same listing and photos from another device or clean app install.
5. Add cloud-backed listing management and continue release testing.

## Pending product work

- Replace remaining hardcoded listing/review presentation data with real records.
- Verify and harden Create Listing image uploads across slow networks and failed uploads.
- Add real search, categories, vendor data, reviews, and messaging.
- Phone authentication remains intentionally deferred. Google authentication is implemented and awaiting a fresh APK verification after the redirect fix.

## Recent commits

- `696d9ef` — initial marketplace Home screen.
- `f2bee17` — responsive Home layout and contained advert.
- `6d64c19` — initial responsive Categories screen.

Never request or commit passwords, private keys, tokens, `.env.local`, or Firebase service-account JSON.
