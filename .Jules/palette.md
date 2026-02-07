# Palette's Journal

## 2026-02-07 - Toggle Button Accessibility
**Learning:** Toggle buttons (like Start Menus or mobile menus) require `aria-expanded` to communicate their state to screen readers. Without it, users may trigger the action but not know if the content has been revealed.
**Action:** Always pair `onClick` state toggles with `aria-expanded`, and preferably `aria-controls` pointing to the ID of the revealed content.
