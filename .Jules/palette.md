# Palette's Journal

## 2026-02-07 - Toggle Button Accessibility
**Learning:** Toggle buttons (like Start Menus or mobile menus) require `aria-expanded` to communicate their state to screen readers. Without it, users may trigger the action but not know if the content has been revealed.
**Action:** Always pair `onClick` state toggles with `aria-expanded`, and preferably `aria-controls` pointing to the ID of the revealed content.

## 2026-02-08 - Desktop Icon Interaction
**Learning:** Custom interactive elements (like desktop icons) often lack standard focus indicators, making them invisible to keyboard users. Adding clear `focus-visible` states and `active` scaling transforms a static element into a responsive, accessible control.
**Action:** Always add `focus-visible:ring-2` and `active:scale-95` to custom link wrappers to mimic native OS feel and ensure accessibility.
