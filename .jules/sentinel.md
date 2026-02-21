## 2025-05-23 - Insecure Deserialization of LocalStorage
**Vulnerability:** `CartContext` was blindly trusting `localStorage` data (`bgc_local_cart`) and casting it to `LineItem[]` without validation. Corrupted or malicious data could crash the application (DoS).
**Learning:** Client-side storage is untrusted input. Even if set by the app, it can be modified by XSS or bugs.
**Prevention:** Always validate data read from `localStorage` using a type guard or schema validation library (like Zod) before using it in the application state.

## 2026-02-15 - User Enumeration via Error Messages
**Vulnerability:** Login and Password Recovery pages were displaying raw error messages from Shopify (e.g., "User not found"), allowing attackers to enumerate valid email addresses.
**Learning:** Never expose specific authentication errors to the user.
**Prevention:** Always use generic error messages like "Invalid email or password" and ensure success states (like "Email sent") are shown regardless of user existence.
