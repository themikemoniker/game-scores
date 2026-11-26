# 10: Quiz and Matches

**What to build:** A Quiz page at `/[lang]/quiz`, linked from the masthead. Visitors pick Platform families, up to 3 Tags and Classic, Modern or Either; the answers go in the URL and the server shows the top 3 Matches, each with its cover, name, Score circle and a "Why this match" line. With no Match, the page says so and shows the top-scored Games on the chosen Platforms.

See `.scratch/game-scores/spec.md`: user stories 49–53, and Tags and the Quiz.

**Blocked by:** 09

**Status:** ready-for-agent

- [ ] Platform families map Source Platform names to PC, PlayStation, Xbox, Nintendo and Mobile in one place in code.
- [ ] A pure matching function: Platform family and era are hard filters, a Match shares at least one Tag, order is shared Tags, then Score (Unscored last), then name; top 3. Tested with Vitest through the same seam style as Catalog read, including the no-Match fallback and odd URLs (unknown values, more than 3 Tags, nothing picked).
- [ ] `/[lang]/quiz` is a plain GET form rendered on the server, no client JavaScript; answers survive a reload and a shared link.
- [ ] No Tag picked shows a prompt rather than results.
- [ ] EN and ES for every Quiz string; the locale switcher keeps the answers.
- [ ] A masthead link to the Quiz on the ranking and Game pages.
- [ ] Reuses the existing cover, Score circle and ruled-box components; one Impeccable polish pass; no horizontal overflow at 320px; focus visible; AA contrast in both themes.
- [ ] `npm run typecheck`, `npm test` and `npm run build` pass.
