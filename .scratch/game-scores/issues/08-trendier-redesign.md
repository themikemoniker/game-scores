# 08: Trendier visual redesign

**What to build:** A bolder, more current visual world for every page, replacing the editorial "Exhibition Catalogue" look (good but a bit boring). Chosen on Impeccable's decision page: **Cross Review Weekly**, after a Japanese weekly game magazine. The ranking is the chart page. Each Game gets a cross-review box showing every External Rating raw and adjusted toward 70, and its Score stamped in a heat-coloured circle. The Game page sets the Score Breakdown out as a full cross review whose numbers can't collide. Visual only: data loading, server actions, auth, URLs, cache behaviour, i18n meaning and the Score formula don't change.

See `.scratch/game-scores/spec.md`: user stories 26–28, and Delivery order step 6. Direction contract: `.impeccable/surfaces/app-lang-page-tsx.md`.

**Blocked by:** none (follows the first design pass on branch `design/modern-refresh`)

**Status:** ready-for-agent

- [ ] One token system on `:root` in `app/globals.css` with light and dark themes; fonts through `next/font` only; no new dependencies.
- [ ] Ranking: yellow masthead, black-ruled filter bar, chart rows with rank, cover, name and meta, cross-review box and Score circle. Unscored Games have no rank number and a dashed empty circle, never a zero.
- [ ] Game page: cover and title hero with a large Score circle, facts, description, and a Score Breakdown where every rating shows raw → adjusted, review count, share and a pull mark toward 70, ending in the working and the rounded Score.
- [ ] Numbers never overlap or overflow, at 320px through wide desktop, for close pulls (82 → 81.3) and wide ones (93.5 → 84.8).
- [ ] Locale switcher, both 404 pages and the admin page (login, search results, slug-collision prompt, invalid rows, Catalog, messages) carry the same world; admin stays calm (Operate).
- [ ] The heat scale is printed as a legend, colour is never the only signal, text meets WCAG AA in both themes, focus is visible, motion respects `prefers-reduced-motion`.
- [ ] Spanish holds at every width; the Spanish Genre "Platform" no longer reads the same as the "Plataformas" label.
- [ ] Checked with a real Game that has a cover (Hades, 2020, imported for this ticket).
- [ ] `npm run typecheck`, `npm test` and `npm run build` pass; DESIGN.md is rewritten from the build; screenshots at 375 and 1280, light and dark, /en and /es.

## Comments
