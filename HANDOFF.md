# Shopicom Mobile — Session Handoff

**Updated:** 2026-08-06
**Current milestone:** Step 4b — Expo organization invitation received; EAS login/link pending
**Instruction from founder:** Work one step at a time. Finish and report each step before moving to the next.

## Completed this session

- Verified the connected Shopicom Figma file and identified all 11 supplied nodes.
- Added the screen inventory, implementation observations, missing states, and known design conflicts to `PROJECT_PLAN.md`.
- Verified the local JavaScript toolchain:
  - Node.js `v20.19.5`
  - npm `10.8.2`
- Initialized the workspace as a Git repository on the `main` branch.

## Figma status

The inspected nodes cover:

- Phone login
- Registration
- Marketplace home
- Messages inbox
- Account profile/settings
- Category browser
- Create-listing form
- Listing-linked chat
- Product details
- Public vendor storefront
- Hot-selling product grid

The Figma MCP Starter-plan call limit was reached. Exact typography, colors, spacing, effects, components, and exported assets still require `get_design_context` calls when the quota resets. Do not guess these values during screen implementation.

## Current foundation state

The Expo TypeScript project is now initialized in the workspace. It includes:

- Expo SDK `57.0.10`
- React `19.2.3`
- React Native `0.86.2`
- TypeScript `6.0.3`
- Shopicom app name, slug, and URL scheme
- Environment-file safety defaults and `.env.example`
- Initial `src/` directory conventions
- Installed dependencies and `package-lock.json`
- Git repository initialized on `main` (no commit or remote configured yet)

Validation completed:

- `npm run typecheck` — passed
- `EXPO_NO_TELEMETRY=1 CI=1 npx expo config --type public` — passed; SDK 57 configuration resolved
- Metro offline launch on port `8097` — started successfully and was stopped cleanly

The first dependency download was interrupted by `ECONNRESET`; a retry reused the npm cache and completed successfully with 467 packages installed.

## Access update

The founder confirmed on 2026-08-05 that developer Firebase team-member access has been granted.

Development Firebase configuration:

- Project name: `Shopicom Limited Dev`
- Project ID: `shopicom-limited-dev`
- Developer role: Editor
- Default Firestore database created in `europe-west1` (Belgium), production rules mode
- Firebase web app registered as `Shopicom Mobile Development`
- Firebase JavaScript SDK installed and initialized from ignored Expo environment values
- Public environment key names documented in `.env.example`
- Real development values stored only in ignored `.env.local`

Validation completed:

- `npm run typecheck` — passed after Firebase integration
- Git ignore verification — `.env.local` is ignored
- Expo Android export — passed; Firebase environment loaded and 589 modules bundled

## Authentication foundation

- Enabled Firebase Email/Password authentication in `shopicom-limited-dev`.
- Installed Expo-compatible AsyncStorage for persisted native sessions.
- Initialized Firebase Auth with React Native persistence and a hot-reload-safe fallback.
- Added email registration, sign-in, sign-out, password reset, and auth-session subscription services.
- Passed TypeScript validation.
- Passed Android export with persisted Auth included; 598 modules bundled.
- `npm audit --omit=dev` reports 10 moderate advisories through Expo's `xcode -> uuid` build-tool dependency. The proposed forced fix would downgrade Expo from SDK 57 to SDK 46, so it was not applied. This is not in the app's Firebase Auth runtime path and should be rechecked on Expo upgrades.

## Exact next action

The founder confirmed the permanent Android package identifier as `com.shopicom.app` on 2026-08-05, and it is configured in `app.json`.

Firebase Android configuration:

- Registered `Shopicom Mobile Android Development` in `shopicom-limited-dev` with package `com.shopicom.app`.
- Verified the downloaded `google-services.json` matches both the development project and Android package.
- Stored the file as ignored `.firebase/google-services.dev.json`.
- Added `app.config.js` so local builds use the ignored development file and future EAS builds can provide `GOOGLE_SERVICES_FILE` as a file environment variable.
- Verified Expo resolves `android.googleServicesFile` to the expected development file.
- Confirmed Git ignores `.firebase/`, `.env.local`, and `node_modules/`.

Wait for the founder to approve moving beyond Step 3c. The next authentication-provider step should be configured separately. Google sign-in requires an EAS-generated Android signing certificate SHA fingerprint; phone authentication requires billing/SMS safeguards and test phone numbers.

## Expo organization access

The founder created the company-owned Expo account/organization and invited the developer as a team member on 2026-08-06. The invitation is available; local EAS authentication and project linking are still pending.

Continue with local `eas login`, verify the Shopicom organization membership, link the project to that organization, configure the development build profile, and generate the Android signing credentials. Do not link the project to the developer's personal Expo owner.

## Expo Go authentication prototype

- Added a temporary, non-Figma authentication harness for Email/Password testing while EAS organization access is pending.
- Supports registration with display name, login, logout, password reset, validation, Firebase error messages, loading states, and restored sessions.
- Passed TypeScript validation and Android export (600 modules bundled).
- Figma `get_design_context` remains blocked by the Starter-plan MCP call limit, so this harness intentionally uses neutral styling and must not be treated as the final login/registration design.
- Metro was started in LAN mode at `exp://10.186.1.162:8097` for physical Android testing.

Device verification is still required: register a development account, confirm the restored session after reopening Expo Go, test logout/login, and request a password-reset email.

Do not register the Android app until the permanent package identifier is approved. Do not enable unrestricted phone-auth testing or use real customer phone numbers during development.

## Important product/design observations

- The registration name field is mislabeled `Enter password` in Figma.
- Several screens are much taller than their nominal viewport and require proper scrolling and safe-area handling.
- The design includes legacy categories such as Hotels even though hotel verticals are deferred for the MVP.
- The product/listing flows need explicit loading, empty, error, validation, offline, and permission states that are not shown in the supplied frames.
