## 2025-05-13 - Security Headers
**Vulnerability:** Missing HTTP security headers (X-Frame-Options, HSTS, etc.)
**Learning:** Next.js requires explicit configuration for security headers in `next.config.js`. They are not enabled by default.
**Prevention:** Always configure `async headers()` in `next.config.js` for production deployments.

## 2025-05-14 - Weak Password Policy
**Vulnerability:** Weak Password Requirements
**Learning:** Shopify Storefront API accepts weak passwords by default. Relying solely on the backend for password policy is insufficient for strong account security.
**Prevention:** Implement client-side password complexity validation (length, character types) to enforce stronger security standards before submission.

## 2025-05-15 - Input Validation Gaps
**Vulnerability:** Missing Input Length Limits and Format Validation
**Learning:** Even with managed backends (like Shopify), failing to validate input on the client side can lead to bad data quality, potential DoS (via massive payloads), and poor UX. Browser `type="email"` validation is insufficient for strict security requirements (e.g., it allows intranet domains like `user@localhost`).
**Prevention:** Implement strict client-side validation (regex, length limits) as a first line of defense. Use `maxLength` attributes on inputs and validate logically in the submit handler.
