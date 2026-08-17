# Shopicom mobile app: MVP status, delivery roadmap and current blockers

**Prepared by:** Olawale Marcus  
**Updated:** 17 August 2026
**Current build:** Android MVP development and internal preview  
**Repository:** https://github.com/OlaMarcus09/shopicom.git

## Why I am writing this document

I want us to have one clear document showing what I have built, what is functional, what is still a prototype, and what I will work on next.

The Figma screens are now represented in the mobile app, but a completed screen is not the same as a production-ready feature. For example, the Listings screens and flows exist, but cloud image storage and some listing-management work are still pending. I have separated those two stages throughout this document so that expectations are clear.

## Current project position

The app has moved beyond a static frontend prototype. It now has Firebase Authentication, Firestore data foundations, local data persistence, internal Android builds, and several working marketplace flows.

The app is not ready for public release yet. The main work remaining is completing the cloud-backed marketplace behaviour, making buyer and seller features work reliably between different devices, adding moderation and notifications, and completing release testing.

### Status labels used below

- [x] Complete and tested on an Android phone
- [~] Partly complete or working with a development limitation
- [ ] Not started or not production-ready
- [!] Blocked by an external decision, account access, billing, or missing service

## What has been completed

### 1. Project, accounts and build setup

- [x] Expo React Native project created with TypeScript.
- [x] Android package configured as `com.shopicom.app`.
- [x] Shopicom Expo organisation and EAS cloud builds connected.
- [x] Firebase development project configured as `shopicom-limited-dev`.
- [x] GitHub repository connected and all completed work pushed regularly.
- [x] Android development APK generated and tested.
- [x] Standalone internal APK build process configured.
- [x] Firebase environment variables configured for EAS builds.
- [x] Firestore rules and listing index deployed.

### 2. Authentication

- [x] Email registration.
- [x] Email login.
- [x] Logout.
- [x] Firebase session restoration after reopening the app.
- [x] Password-reset service foundation.
- [x] Login and registration validation and error states.
- [ ] Phone-number authentication and OTP verification.
- [~] Google sign-in is implemented. The first standalone APK test failed at the Android OAuth redirect; the redirect-scheme fix requires a new APK and physical-phone verification.
- [ ] Email verification flow.
- [ ] Final password recovery screen and complete user-facing flow.

### 3. Figma screens implemented

- [x] Login.
- [x] Registration.
- [x] Marketplace Home.
- [x] Categories.
- [x] Create Listing.
- [x] Inbox.
- [x] Chat.
- [x] Listing Details.
- [x] Hot Selling Products.
- [x] Seller Storefront.
- [x] Profile.
- [x] My Listings.
- [x] Favorites.
- [x] Search.
- [x] Notifications screen.
- [x] Edit Profile.
- [x] Vendor application screen.

These screens have been adjusted for real Android phone sizes. The interface uses compact typography, controls and spacing rather than copying oversized Figma dimensions directly.

### 4. Home and marketplace browsing

- [x] Responsive Home feed.
- [x] Promotional banner displays without cropping.
- [x] Search shortcut.
- [x] Profile shortcut.
- [x] Notification shortcut.
- [x] Food, Hotels, Services and Jobs shortcuts.
- [x] Hot Selling Products section.
- [x] Best Selling Near You section.
- [x] Recommend, Fashion, Phones Tablets and Electronics discovery filters.
- [x] Compact marketplace cards with product name, seller, price, location and rating layout.
- [x] Favorite control on product cards.
- [x] Raised Home button in the bottom navigation.
- [~] Product ranking is currently based on available listing data, not real sales or engagement metrics.
- [~] "Near You" currently uses the listing's written location, not GPS distance.

## Listings: what is already built

The Listings section is one of the largest areas already implemented. Listing metadata and image uploads are now connected to Firebase; the new cloud image flow still needs physical-device verification.

### Listing creation

- [x] Select up to 10 images from the phone.
- [x] Preview selected images.
- [x] Enter listing title.
- [x] Select category.
- [x] Show subcategories that match the selected category.
- [x] Show types that match the selected subcategory.
- [x] Enter type and brand specifications.
- [x] Select item condition.
- [x] Enter price and discount.
- [x] Enter business location.
- [x] Add seller phone number.
- [x] Select in-store pickup and local delivery.
- [x] Select negotiation preference.
- [x] Enter description.
- [x] Validate required fields.
- [x] Save the complete listing locally on the phone.
- [x] Sync listing text and metadata to Firestore.
- [~] Upload listing images to Firebase Storage is implemented and rules are deployed; physical-device verification remains.

### Listing browsing and details

- [x] Show locally created listings on Home.
- [x] Load Firestore listing metadata into Home, Hot Selling, Categories and Search.
- [x] Open the correct Listing Details screen.
- [x] Display the saved title, price, location, description and specifications.
- [x] Display multiple images with swipe navigation and an image counter.
- [x] Display seller information and delivery options.
- [x] Search by title, category, brand and location.
- [x] Filter products through Categories and Home discovery tabs.
- [x] Share product details through Android's share sheet.
- [x] Open the phone dialler when a seller phone number exists.
- [x] Add and remove local favorites.
- [x] Return to the correct previous screen after opening a product.
- [~] Listings created on another device should now load their Firestore details and Storage images; this requires verification with the new APK on two devices.
- [~] Hot Selling, ratings and Best Selling are presentation sections. They do not yet use real sales, reviews or popularity scoring.

### Listing management still required

- [x] Local My Listings screen.
- [x] Local listing deletion with confirmation.
- [ ] Cloud-backed My Listings query.
- [ ] Edit an existing listing.
- [ ] Delete or archive a listing in Firestore.
- [ ] Mark a listing as sold.
- [ ] Draft listing autosave and recovery.
- [ ] Upload progress, retry and failed-upload handling.
- [ ] Cloud favorite records shared across devices.
- [ ] Pagination and pull-to-refresh.
- [ ] Sorting and advanced filters.
- [ ] Report listing flow and moderation record.

Important: deleting or reinstalling the current APK can still remove local-only records. Listings created after the new Storage-enabled APK is installed should retain their Firestore metadata and cloud images across devices.

## Chat and Inbox status

- [x] Inbox screen and tabs.
- [x] Inbox name search.
- [x] Keyboard-aware Chat screen.
- [x] Send text messages.
- [x] Keep a local copy of messages.
- [x] Firestore conversation and message foundation.
- [x] Listing, buyer and seller are included in the cloud conversation identity.
- [x] Firestore security rules restrict conversation access to participants.
- [~] Buyer and seller can use the same Firestore thread foundation, but full two-account testing is still required.
- [ ] Load the user's cloud conversation list into Inbox.
- [ ] Live message updates without manually reopening the screen.
- [ ] Sent, delivered, read and failed message states.
- [ ] Unread counts.
- [ ] Image messages.
- [ ] Block, spam and report controls.
- [ ] Push notifications for new messages.
- [ ] Pagination for long conversations.
- [ ] Reliable offline send queue and retry.

## Profile and vendor status

### User profile

- [x] Display name and email.
- [x] Edit display name, location and bio.
- [x] Save profile locally.
- [x] Sync profile data to Firestore.
- [x] Profile, My Listings and Favorites navigation.
- [ ] Upload profile photo.
- [ ] Cloud followers and following.
- [ ] Public rating and review totals.
- [ ] Privacy and security settings.
- [ ] Account deletion.

### Seller and vendor features

- [x] Public seller storefront layout.
- [x] Seller identity, location and catalogue display.
- [x] Follow button interaction in the current session.
- [x] Message and share actions.
- [x] Become a Vendor form.
- [x] Vendor application saved locally and submitted to Firestore.
- [ ] Admin review and approval workflow.
- [ ] Verified vendor status controlled by an administrator.
- [ ] Business logo and cover photo upload.
- [ ] Business hours and contact settings.
- [ ] Cloud follow and unfollow records.
- [ ] Vendor ratings and reviews.
- [ ] Vendor application status updates and rejection reasons.

## Notifications, reviews and moderation

- [x] Local Notifications screen showing listing activity.
- [ ] Firebase Cloud Messaging and device-token registration.
- [ ] Push notifications for messages, listing status and vendor applications.
- [ ] Product reviews and seller reviews.
- [ ] Review eligibility and anti-abuse rules.
- [ ] Report user, listing and message flows.
- [ ] Admin moderation queue.
- [ ] User blocking.
- [ ] Audit history for administrative actions.

## Admin dashboard

- [ ] Admin authentication and role controls.
- [ ] User management.
- [ ] Vendor application review.
- [ ] Listing moderation.
- [ ] Reports and complaints.
- [ ] Verification controls.
- [ ] Basic marketplace statistics.

The admin dashboard is part of the complete operating product, but it is separate from the mobile Figma screens and has not been built yet.

## Firebase Storage status

The `shopicom-limited-dev` project has now been upgraded to Firebase Blaze. The former billing blocker is resolved.

The Storage bucket and rules are now ready, and listing-image upload code is connected. The next work is physical-device verification across two devices, followed by retry handling and cloud-backed listing management.

### Remaining image-dependent work

- Verify listing images shared between users and devices.
- Profile photos.
- Vendor logos and cover images.
- Image messages in Chat.
- Confirm images survive app deletion or reinstallation.
- Confirm the founder and developer see the same product photos.

Existing listings created before Storage integration may still have no cloud images. New listings will use the cloud flow after the updated APK is installed.

## Other dependencies and decisions needed

- [x] Firebase Blaze approved for the development project.
- [x] Google sign-in is required for MVP; phone OTP is deferred.
- [~] Vendor form fields are confirmed and no KYC documents are required for this release; the later admin approval workflow still needs definition.
- [x] Products and Services are the first-release categories. Hotels, Jobs, Food, and Property are deferred behind feature gates.
- [x] Optional WhatsApp seller contact is included in the first release.
- [ ] Confirm who will moderate reports and approve vendors.
- [ ] Confirm whether the first release needs a separate web admin dashboard.
- [~] Official Privacy, Terms, and Cookie pages are connected; final Help and About content remains.
- [ ] Confirm Play Store company account access and release ownership.

## Step-by-step development roadmap

The estimates below assume I am working as the main developer, decisions and account access are provided without long delays, and the scope does not change during a phase. They are working-day estimates, not fixed calendar promises.

### Phase 1: stabilise the current build

**Estimate: 2 to 3 working days**

- [ ] Test the latest standalone APK on at least two Android devices.
- [ ] Test registration, login and restored sessions again.
- [ ] Test all navigation and back behaviour.
- [ ] Test the new Home layout on small and large Android screens.
- [ ] Test Firestore rules using two separate accounts.
- [ ] Fix crashes, blank states and layout regressions found during the test.
- [ ] Update the handoff and test checklist.

**Deliverable:** A stable internal Android build that the founder and developer can review independently.

### Phase 2: finish the Listings feature

**Estimate: 7 to 10 working days after cloud image storage is approved**

- [ ] Enable cloud image storage and deploy Storage rules.
- [ ] Compress images before upload.
- [ ] Upload listing images and save permanent URLs in Firestore.
- [ ] Replace temporary local image paths.
- [ ] Build cloud-backed My Listings.
- [ ] Add edit, archive, sold and cloud delete actions.
- [ ] Add upload progress, retry and error states.
- [ ] Add pagination, refresh, sorting and filters.
- [ ] Add cloud favorites.
- [ ] Complete report-listing submission.
- [ ] Test listings across two accounts and two devices.

**Deliverable:** A buyer can browse a seller's listing on another device with the correct photos and details. A seller can manage the listing after posting it.

### Phase 3: complete Inbox and real-time Chat

**Estimate: 5 to 7 working days**

- [ ] Load real Firestore conversations into Inbox.
- [ ] Add real-time listeners to the open conversation.
- [ ] Add unread state and last-message previews.
- [ ] Add sent, failed, delivered and read states where supported.
- [ ] Add image messages after image storage is available.
- [ ] Add block, spam and report actions.
- [ ] Test buyer-to-seller messaging with two accounts.
- [ ] Add notification hooks for new messages.

**Deliverable:** Two users on separate devices can discuss a listing and see the same conversation history.

### Phase 4: complete profiles and vendor onboarding

**Estimate: 4 to 6 working days**

- [ ] Load profiles consistently from Firestore on every device.
- [ ] Add profile and business-image uploads.
- [ ] Store follows and follower counts in Firestore.
- [ ] Complete vendor application validation.
- [ ] Add application status: pending, approved and rejected.
- [ ] Apply verified vendor status only through an authorised admin action.
- [ ] Show the correct vendor catalogue and public business information.

**Deliverable:** User profiles and approved vendor storefronts are shared across devices and controlled by secure backend rules.

### Phase 5: reviews, reports, notifications and moderation

**Estimate: 6 to 9 working days**

- [ ] Add product and seller reviews.
- [ ] Add report forms for listings, users and messages.
- [ ] Add user blocking.
- [ ] Configure push notification permissions and device tokens.
- [ ] Send notifications for messages and marketplace events.
- [ ] Build the minimum admin moderation tools.
- [ ] Add secure role and verification rules.

**Deliverable:** Shopicom has the basic trust, safety and communication tools required to operate the marketplace.

### Phase 6: release preparation

**Estimate: 4 to 6 working days**

- [ ] End-to-end testing on multiple Android devices.
- [ ] Weak-network and offline testing.
- [ ] Performance review for images and long lists.
- [ ] Security-rule review.
- [ ] Accessibility and keyboard review.
- [ ] Crash reporting and basic monitoring.
- [ ] Final app icon, splash screen and versioning.
- [ ] Terms and Privacy Policy integration.
- [ ] Production Firebase environment.
- [ ] Play Store internal test build and store listing preparation.

**Deliverable:** A release candidate for controlled Play Store testing.

## Expected delivery range

### Core marketplace MVP

The core marketplace MVP covers authentication, cloud listings with images, seller management, search, profiles and working buyer-to-seller Chat.

**Expected remaining time: approximately 3 to 5 working weeks.**

This estimate depends heavily on resolving image storage at the start of the Listings phase.

### Broader operational MVP

The broader MVP also includes reviews, reports, push notifications, vendor approval, moderation tools and release preparation.

**Expected remaining time: approximately 5 to 8 working weeks.**

This range assumes prompt decisions, no major redesign, no new payment system, and no separate hotel, property or job product flows added during the same period.

## Items not included in the current MVP estimate

- In-app payments or escrow.
- Checkout and delivery management.
- Seller commissions and withdrawals.
- Separate hotel booking flow.
- Separate recruitment or job application system.
- Separate property-rental workflow.
- iOS App Store release.
- Large analytics or recommendation engine.

Adding any of these changes the delivery estimate and should be planned as a separate phase.

## What I need from the founder now

- [ ] Confirm the Firebase Storage decision.
- [ ] Confirm the exact first-release categories.
- [ ] Confirm whether phone OTP and Google sign-in are MVP requirements.
- [ ] Confirm the vendor approval requirements.
- [ ] Confirm whether WhatsApp contact belongs in the first release.
- [ ] Confirm whether the web admin dashboard is required before public testing.
- [ ] Review and approve this roadmap or mark any priority changes.

## My next development order

Unless we agree to change the priority, I will proceed in this order:

1. Stabilise and test the current Android build.
2. Complete cloud image storage and the Listings feature.
3. Complete real-time buyer-to-seller Chat and Inbox.
4. Complete shared profiles and vendor approval.
5. Add reviews, reports and push notifications.
6. Build the minimum admin tools.
7. Complete release testing and prepare the Play Store internal test.

This order keeps the work focused on the main marketplace loop: a seller posts a product, another user finds it, checks the seller, and starts a conversation. Once that flow is reliable across separate devices, the remaining trust, moderation and release work can be completed around it.
