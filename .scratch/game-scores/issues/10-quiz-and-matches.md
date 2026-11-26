# 10: Quiz and Matches

**What to build:** A Quiz page at `/[lang]/quiz`, linked from the masthead. Visitors pick Platform families, up to 3 Tags and Classic, Modern or Either; the answers go in the URL and the server shows the top 3 Matches, each with its cover, name, Score circle and a "Why this match" line. With no Match, the page says so and shows the top-scored Games on the chosen Platforms.

See `.scratch/game-scores/spec.md`: user stories 49–53, and Tags and the Quiz.

**Blocked by:** 09

**Status:** done

- [x] Platform families map Source Platform names to PC, PlayStation, Xbox, Nintendo and Mobile in one place in code.
- [x] A pure matching function: Platform family and era are hard filters, a Match shares at least one Tag, order is shared Tags, then Score (Unscored last), then name; top 3. Tested with Vitest through the same seam style as Catalog read, including the no-Match fallback and odd URLs (unknown values, more than 3 Tags, nothing picked).
- [x] `/[lang]/quiz` is a plain GET form rendered on the server, no client JavaScript; answers survive a reload and a shared link.
- [x] No Tag picked shows a prompt rather than results.
- [x] EN and ES for every Quiz string; the locale switcher keeps the answers.
- [x] A masthead link to the Quiz on the ranking and Game pages.
- [x] Reuses the existing cover, Score circle and ruled-box components; one Impeccable polish pass; no horizontal overflow at 320px; focus visible; AA contrast in both themes.
- [x] `npm run typecheck`, `npm test` and `npm run build` pass.

## Comments

- A page, not a modal: answers in the URL make results shareable, keep back/forward working and need no client JavaScript.
- Answers are repeated URL params (`?platform=pc&tag=roguelike&tag=metroidvania&era=classic`), which is what a plain GET form sends.
- Impeccable's finish reviewer returned "fix" with four items, all applied: the form submits to `#matches` so phones land on the results; a forced-colors outline for picked answers; fallback rows drop the "Why this match" label (they aren't Matches); the admin "Tags to fix" list styled like the rest of the admin. Its verdict after those: ship.
- Checked at 1280, 375 and 320 (framed at true width, since headless Chrome won't go under 500px), light and dark, /en and /es. No horizontal overflow.
