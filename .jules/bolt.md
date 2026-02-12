## 2024-05-23 - CartContext Memoization
**Learning:** `CartProvider` wraps `ClientLayout` in `RootLayout`. Since `RootLayout` re-renders `children` on navigation, `CartProvider` also re-renders. Without memoization, the context value is recreated on every navigation, forcing all context consumers (like cart icons) to re-render unnecessarily.
**Action:** Always memoize context values in global providers, especially those wrapping the main layout, to prevent cascading re-renders on route changes.
