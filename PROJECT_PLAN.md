# Shopicom Mobile App — MVP Project Plan

**Status:** Expo/Firebase foundation complete; email authentication persistence configured
**Product:** Shopicom, a classifieds marketplace launching in Tamale, Northern Region, Ghana
**Build owner:** Solo technical co-founder
**Primary target:** Budget Android phones and unreliable or expensive mobile networks

This is the living project document. We will update it as decisions are made and mark each feature complete only after it has been reviewed and tested on a real device.

## Product boundaries

### Phase 1 MVP

- Email and phone registration, Google OAuth, and persisted sessions
- User profiles: photo, verification status, ratings, followers/following, and saved listings
- Listings: create, edit, delete, multi-image upload, categories/subcategories, search, and filters
- Direct contact: real-time chat, WhatsApp deep link, and phone-call button
- Vendor storefronts: profile, business hours, ratings, and product catalogue
- Push notifications
- Internal admin dashboard for users, vendors, moderation, and reports

### Explicitly deferred

- In-app payments, checkout, escrow, commissions, and withdrawals
- Hotel, job, and property verticals
- Other legacy prototype collections that are not needed by the MVP

## Technology direction

- **Mobile:** React Native, Expo managed workflow, TypeScript, Expo Router
- **Builds:** EAS cloud builds; avoid local native builds on the 2013 MacBook
- **Backend:** Firebase Authentication, Firestore, Storage, Cloud Functions
- **Notifications:** Firebase Cloud Messaging, integrated through the Expo-compatible notification path
- **Admin:** Prefer a small web view or web app backed by the same Firebase project
- **Design:** Figma MCP is connected to Codex; use design context and screenshots for every screen
- **Search:** Start with structured Firestore filters and normalized search fields; add a dedicated search service only if MVP usage proves it necessary

These are provisional choices. We will change them only when a concrete requirement or device test justifies it.

## Build sequence

1. Project foundation and local conventions
2. Figma design inventory and design tokens
3. Authentication proof-of-concept on an EAS Android development build
4. Auth screens and onboarding
5. User profiles
6. Listing browsing and listing details
7. Listing creation, editing, deletion, and image uploads
8. Categories, search, filters, favorites, and follows
9. Vendor storefronts
10. Chat, WhatsApp, and phone contact
11. Ratings, reports, and moderation flows
12. Push notifications
13. Admin dashboard
14. Security-rule review, indexes, observability, and release preparation

We will work on one screen or feature at a time. After each feature, Codex will provide a short summary of what changed, decisions made, tests run, and known risks before moving on.

## Figma design inventory

The Shopicom Figma file is:

<https://www.figma.com/design/ZC9afHaafHm3PauLjLQy4T/Shopicom-Ltd>

Supplied node links:

| Node ID | Screen/section | Status |
|---|---|---|
| `41:51` | Phone login | Identified; detailed context pending |
| `331:45` | Registration | Identified; detailed context pending |
| `54:2` | Marketplace home feed | Identified; detailed context pending |
| `117:2` | Messages inbox | Identified; detailed context pending |
| `117:33` | Account profile and settings | Identified; detailed context pending |
| `117:62` | Category browser | Identified; detailed context pending |
| `122:119` | Create listing form | Identified; detailed context pending |
| `124:178` | Listing-linked chat thread | Identified; detailed context pending |
| `143:23` | Product/listing details | Identified; detailed context pending |
| `200:97` | Public vendor storefront | Identified; detailed context pending |
| `425:73` | Hot-selling product grid | Identified from metadata; screenshot pending |

Before implementation, each node will be classified by screen name, user flow, responsive assumptions, assets, typography, colors, spacing, and interactive states. We will not infer visual values when the design source can provide them.

### Inspection findings — 2026-08-04

All supplied frames use a narrow mobile canvas around 402 px wide. This is a design reference width, not a fixed implementation width; the Expo app must use safe-area insets and responsive horizontal padding rather than hard-coded screen coordinates.

| Node ID | Flow and visible content | Implementation notes / open states |
|---|---|---|
| `41:51` | Login with Ghana `+233` phone input, password, forgotten-password link, primary login action, Google sign-in, and email-login alternative. | Need validation, loading, invalid credentials, unverified account, password visibility, keyboard, and recovery states. |
| `331:45` | Registration with name, Ghana phone, password, confirmation, Google, and email alternatives. | The name field's visible placeholder is incorrectly `Enter password`; correct this during implementation after product confirmation. Need duplicate-account, OTP/phone verification, password rules, and consent states. |
| `54:2` | Home feed with avatar, search, notifications, promotional carousel, top-level shortcuts, hot-selling products, nearby products, recommendations, and bottom navigation. | Frame metadata contains content extending well past the 874 px viewport, so this is a vertically scrolling feed. `Hotels` appears although hotel verticals are deferred; reconcile the design with MVP categories. Ads and product rails imply horizontal scrolling and pagination/loading states. |
| `117:2` | Messages inbox with search, All/Unread/Spam tabs, conversation rows, saved/bookmark action, and bottom navigation. | Need empty inbox, unread badges, spam/report handling, search results, pagination, connection/offline state, and accessible timestamps. |
| `117:33` | Signed-in profile with avatar/status, identity and rating summary, bio, vendor conversion, favorites, edit profile, privacy, help, policies, settings, about, store rating, and logout. | Source frame is 1389 px high and must scroll. Need signed-out/partial-profile variants, destructive logout confirmation, and vendor-state variants. |
| `117:62` | Two-pane category browser: scrollable primary categories on the left and recommended subcategories on the right, with global search and bottom navigation. | Need selected-category styling, long-label handling, category loading/empty/error states, and dynamic data rather than fixed rows. Legacy categories should be filtered to the agreed MVP taxonomy. |
| `122:119` | Create-listing form with media upload, title, category/subcategory/type, specifications, condition, price/discount, location, delivery methods, negotiation preference, description, and submit action. | Source frame is 1899 px high. Treat it as a keyboard-aware form with draft persistence, upload progress/retry, validation, dependent selectors, permissions, and submit progress. The design says five images and 20 MB maximum; confirm whether that limit is per image or total. |
| `124:178` | Direct chat tied to a listing, including vendor online status, listing context banner, safety warning, message bubbles, composer, camera, and overflow menu. | Need sent/delivered/read/failed states, image messages, pagination, blocking/reporting, offline queueing, keyboard avoidance, and current-user/vendor role handling. |
| `143:23` | Listing details with image gallery, favorite/share, title, badges, discount pricing, location/rating, call/message actions, specifications, description, delivery options, vendor card, review, reporting, recommendations, and sticky chat/share actions. | Source frame is 2231 px high. Need gallery paging, missing fields, unavailable/sold state, review states, contact permissions, share fallback, sticky-action safe area, and lazy-loaded recommendations. |
| `200:97` | Public vendor storefront with vendor identity, follower/rating summary, bio, follow and message actions, and listing grid. | Need follow/unfollow/loading states, verified/vendor variants, empty catalogue, pagination, and grid responsiveness. Some text wraps/clips in the 874 px reference and requires cleanup. |
| `425:73` | Hot-selling product collection using a two-column grid of reusable product cards. | Metadata shows six cards and the same card anatomy used elsewhere: image, choice badge, favorite, title, vendor verification, price, location, and rating. Screenshot retrieval was blocked by the Figma Starter-plan call limit; verify the header, scrolling behavior, and final card spacing when access resets. |

The Figma connection is authenticated and can read this file. During this inspection the account reached the Figma MCP Starter-plan call limit. Screen identity and high-level layout are recorded above, but exact typography, color values, effects, exported assets, component mappings, and per-layer spacing remain pending. Before implementing any screen, call `get_design_context` for that specific node and use its screenshot and assets as the source of truth.

## Account and access ownership

The founder should own production accounts and billing. The developer can be added as a team member with the minimum required permissions.

| Account/service | Founder action | Developer use |
|---|---|---|
| Firebase / Google Cloud | Create development and production projects; add developer access | Configure Auth, Firestore, Storage, Functions, rules, and indexes |
| Expo / EAS | Create or transfer the Shopicom Expo project | Run development builds and submit cloud builds |
| Google OAuth | Create OAuth consent/app credentials under the company account | Configure the mobile sign-in flow |
| Figma | Grant view access to the connected MCP account | Inspect nodes and implement screens |
| Apple/Google stores | Retain ownership and billing | Prepare builds and release artifacts when ready |

Never commit service-account private keys or production secrets. Client Firebase configuration is not treated as a server secret, but it still belongs in environment-specific configuration and not in source control when avoidable.

## Firebase direction

The prototype schema is reference material, not a specification. The initial MVP collections are expected to be:

`users`, `vendors`, `listings`, `categories`, `favorites`, `follows`, `chats`, `messages` (or chat subcollections), `reviews`, `notifications`, `reports`, and `settings`.

Before backend implementation we will review the complete `firestore.rules` and `storage.rules` files. Particular checks already identified:

- Restrict promotion-banner writes to authorized roles.
- Validate actor ownership and target fields for reviews and follows.
- Prevent role, verification, and ownership escalation by client updates.
- Keep audit records immutable and privileged operations explicit.
- Add pagination, field allowlists, and immutable timestamps where appropriate.

## Performance and reliability budget

- Paginate all listing, chat, notification, and moderation lists.
- Resize/compress images before upload and render thumbnails in feeds.
- Avoid broad real-time listeners; subscribe only to the visible conversation or required document set.
- Debounce search and avoid querying on every keystroke.
- Provide loading, empty, error, retry, and offline-friendly states.
- Test on a physical budget Android device and a weak network before calling a feature complete.
- Avoid unnecessary animation, large shadow layers, and deeply nested scrolling layouts.

## Definition of done for each feature

- Matches the inspected Figma design at the supplied frame/node.
- Handles normal, loading, empty, error, validation, and permission states.
- Uses the agreed Firebase data contract and security rules.
- Does not expose secrets or privileged operations to the client.
- Has been exercised on a real Android device.
- Has a short review summary recorded in this document.

## Current decisions and open questions

### Decisions

- New project; no prototype code will be copied blindly.
- Expo managed workflow with EAS cloud builds.
- Firebase remains the backend.
- Production account ownership stays with the founder.
- Figma MCP is the source of truth for visual implementation.
- Developer Firebase team-member access was confirmed on 2026-08-05.
- Permanent Android package identifier: `com.shopicom.app`.

### Foundation review — 2026-08-05

- Initialized the blank Expo SDK 57 TypeScript application without overwriting project documentation.
- Set the Shopicom app name, slug, and URL scheme; the Android package identifier was added after founder confirmation.
- Added strict TypeScript validation, environment-file safety defaults, and initial source-directory conventions.
- Installed and locked dependencies.
- Initialized the local Git repository on the `main` branch; no remote is configured yet.
- Passed TypeScript and Expo configuration validation.
- Started Metro successfully in offline CI mode and stopped it cleanly after verification.

### Firebase development configuration review — 2026-08-05

- Confirmed Editor access to the Firebase team.
- Created the separate `shopicom-limited-dev` development project and registered the `Shopicom Mobile Development` web app.
- Created the default Firestore database in `europe-west1` (Belgium) using production rules mode.
- Installed the Firebase JavaScript SDK and initialized it from validated Expo public environment values.
- Kept actual development values in ignored `.env.local`; `.env.example` contains key names only.
- Passed TypeScript validation and a complete Android JavaScript bundle export with Firebase loaded.

### Email authentication foundation review — 2026-08-05

- Enabled Email/Password as the first Firebase Authentication provider.
- Added Expo-compatible AsyncStorage and initialized Firebase Auth with persistent React Native sessions.
- Added service functions for email registration, sign-in, sign-out, password reset, and auth-state observation.
- Passed TypeScript validation and an Android bundle export with Auth included.
- Recorded the current moderate `uuid` advisory inherited through Expo's native `xcode` tooling; no breaking forced downgrade was applied.
- Confirmed and configured the permanent Android package identifier as `com.shopicom.app`.
- Registered the development Android app in Firebase and integrated its environment-specific `google-services.json` through an ignored local file and EAS-compatible dynamic Expo configuration.
- Added a temporary Expo Go Email/Password test harness with registration, login, logout, password reset, validation, loading/error handling, and session restoration.
- Passed TypeScript and Android export validation; physical-device authentication verification is pending.
- Final Figma auth-screen implementation remains blocked by the Figma Starter-plan context quota and will replace the neutral test harness when detailed context is available.

### Open questions

- Verify the accepted Shopicom Expo organization invitation and link EAS to the company-owned organization.
- Confirm the developer's Google Cloud access level when that milestone requires it.
- Confirm the first physical Android test device and Android version.
- Decide whether vendor status is self-serve, application-based, or admin-assigned.

## Immediate next actions

1. Re-run detailed Figma context/assets inspection for each supplied node when the Starter-plan MCP quota resets.
2. Configure and test the Android authentication proof of concept.
3. Generate an EAS Android development signing certificate and add its SHA fingerprint to Firebase before Google sign-in testing.
4. Confirm the first physical Android test device and Android version.
5. Ask the founder for additional account invitations only when the relevant milestone requires them.
