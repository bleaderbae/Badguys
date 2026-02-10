## 2025-05-13 - Security Headers
**Vulnerability:** Missing HTTP security headers (X-Frame-Options, HSTS, etc.)
**Learning:** Next.js requires explicit configuration for security headers in `next.config.js`. They are not enabled by default.
**Prevention:** Always configure `async headers()` in `next.config.js` for production deployments.

## 2025-05-14 - Weak Password Policy
**Vulnerability:** Weak Password Requirements
**Learning:** Shopify Storefront API accepts weak passwords by default. Relying solely on the backend for password policy is insufficient for strong account security.
**Prevention:** Implement client-side password complexity validation (length, character types) to enforce stronger security standards before submission.
