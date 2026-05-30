# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-05-30

### Added
- **Multi-Provider Storage**: Added Cloudflare R2 as a storage provider alongside Cloudinary.
- **Storage Abstraction**: Implemented a unified storage system in `src/utils/storage` to handle uploads and deletions across different providers.
- **Image Lifecycle Management**: Added automatic cleanup of orphan images if database operations fail.
- **Image Replacement**: Implemented logic to delete old images when they are replaced during news updates.
- **Storage Metrics**: Added `GET /api/v1/admin/metrics/storage` endpoint to track monthly usage for Cloudinary and Cloudflare R2.
- **News Tracking**: Added `imagePublicId` and `imageProvider` to `News` model to manage cloud files reliably.

### Changed
- Refactored `News` and `Upload` controllers to use the new unified storage system.
- Updated `Settings` to allow admins to choose the `active_storage_provider`.

## [1.1.1] - 2026-04-05

### Fixed
- **Security/Rate Limiting**: Enabled `trust proxy` in `src/app.js` to correctly detect client IPs behind proxies (Render, Cloudflare), preventing global rate limiting.
- **Security/Rate Limiting**: Increased general API rate limit from 100 to 500 requests per 15 minutes to better accommodate frontend requirements.

## [1.1.0] - 2026-04-05

### Added
- **Content Discovery**: Added `GET /api/v1/frontend/news/:slug/related` endpoint for related articles.
- **Trending News**: Added `GET /api/v1/frontend/news/trending` for most viewed news.
- **News Tags**: Added `tags` array to `News` model and search support.
- **Newsletter Subscription**: Added `Subscriber` model and `POST /api/v1/communication/newsletter/subscribe` endpoint.
- **Contact Form**: Added `Contact` model and `POST /api/v1/communication/contact` endpoint.
- **Admin Communication**: Added `GET /api/v1/communication/newsletter/subscribers` and `GET /api/v1/communication/contact/messages` for administrators.
- **Sitemap**: Added dynamic XML sitemap at `GET /sitemap.xml`.
- **RSS Feed**: Added dynamic RSS feed at `GET /rss.xml`.
- **Security**: Added `express-rate-limit` for API rate limiting.
- **Health Check**: Enhanced `/api/v1/health` with MongoDB status, uptime, and timestamp.

### Changed
- Improved `News` controllers to handle tags during create and update operations.
- Updated `News` search to include tags in query logic.
- Standardized `serializeNews` to always return a `tags` array.

### Fixed
- Fixed inconsistencies in `News` controller response shapes.
