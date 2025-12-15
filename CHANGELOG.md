# Changelog

## [Unreleased] - 2025-12-10

### Features

- **Backend**: Added `PUT /api/auth/me` endpoint for user profile updates.
- **Frontend**: Integrated `authService` and `authStore` with real profile update API.
- **Performance**: Added `scripts/optimizeImages.ts` for automated image compression (WebP).
- **Security**: Added `sanitizeHTML` utility (DOMPurify with strict config) for blog content.

### Improvements

- **Performance**: Implemented Layout Shift (CLS) fix in `OptimizedImage` by enforcing aspect-ratio on container.
- **Accessibility**: Audited semantic headers (H1 frequency) and button labels. Verified `npm run a11y` pipeline.
- **Maintenance**: Centralized hardcoded UI strings into `src/constants/uiTexts.ts`.
- **Docs**: Updated architecture documentation and automated auditing scripts.

### Fixes

- **Auth**: Resolved TODOs in `authStore.ts` by removing mocks.
- **Images**: Identified and processed legacy unoptimized images in `public/Jpeg`.
