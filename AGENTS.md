# Agentic Context: Bad Guys Club

## Project State: 2026-02-15
**Active Agent:** Gemini CLI
**Last Major Action:** Integrated Performance Optimizations and Testing Suite.

### Summary of Changes
- **Performance:** Memoized `StartMenu` and `WindowFrame`. Wrapped handlers in `useCallback` in `DesktopShell` to eliminate unnecessary re-renders during state changes.
- **UI/UX:** Implemented Framer Motion animations for the Start Menu (slide-up/fade).
- **Testing:** Added comprehensive Jest/RTL tests for `ProductClient` and `Header`. Fixed a crash in `ProductClient` when product data is null.
- **Cart:** Integrated robust retry logic for expired Shopify checkouts and improved mock data mapping.

### Known Architectural Patterns
- **Desktop Simulation:** `DesktopShell.tsx` manages the global OS state (Start Menu, Window management).
- **Shopify/Mock Hybrid:** `lib/shopify.ts` handles API calls with transparent fallback to `lib/mockData.ts` if credentials are missing or errors occur.

### Advice for Next Agents (Jules/Claude)
- **Local Sync:** ALWAYS run `git fetch origin && git merge origin/main` before starting.
- **Testing:** Run `npm test` to verify any changes to the cart or product flows.
- **Components:** Favor `React.memo` for heavy desktop components.
- **Identity:** Use `bleaderbae <ben.walton406@gmail.com>` for commits.
