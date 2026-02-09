## 2025-05-13 - Security Headers
**Vulnerability:** Missing HTTP security headers (X-Frame-Options, HSTS, etc.)
**Learning:** Next.js requires explicit configuration for security headers in `next.config.js`. They are not enabled by default.
**Prevention:** Always configure `async headers()` in `next.config.js` for production deployments.
