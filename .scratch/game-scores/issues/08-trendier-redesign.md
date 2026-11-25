# 08: Trendier visual redesign

**What to build:** A bolder, more current visual world for every page, replacing the editorial "Exhibition Catalogue" look (good but a bit boring). Chosen on Impeccable's decision page: **Cross Review Weekly**, after a Japanese weekly game magazine. The ranking is the chart page. Each Game gets a cross-review box showing every External Rating raw and adjusted toward 70, and its Score stamped in a heat-coloured circle. The Game page sets the Score Breakdown out as a full cross review whose numbers can't collide. Visual only: data loading, server actions, auth, URLs, cache behaviour, i18n meaning and the Score formula don't change.

See `.scratch/game-scores/spec.md`: user stories 26–28, and Delivery order step 6. Direction contract: `.impeccable/surfaces/app-lang-page-tsx.md`.

**Blocked by:** none (follows the first design pass on branch `design/modern-refresh`)

**Status:** done

- [x] One token system on `:root` in `app/globals.css` with light and dark themes; fonts through `next/font` only; no new dependencies.
- [x] Ranking: yellow masthead, black-ruled filter bar, chart rows with rank, cover, name and meta, cross-review box and Score circle. Unscored Games have no rank number and a dashed empty circle, never a zero.
- [x] Game page: cover and title hero with a large Score circle, facts, description, and a Score Breakdown where every rating shows raw → adjusted, review count, share and a pull mark toward 70, ending in the working and the rounded Score.
- [x] Numbers never overlap or overflow, at 320px through wide desktop, for close pulls (82 → 81.3) and wide ones (93.5 → 84.8).
- [x] Locale switcher, both 404 pages and the admin page (login, search results, slug-collision prompt, invalid rows, Catalog, messages) carry the same world; admin stays calm (Operate).
- [x] The heat scale is printed as a legend, colour is never the only signal, text meets WCAG AA in both themes, focus is visible, motion respects `prefers-reduced-motion`.
- [x] Spanish holds at every width; the Spanish Genre "Platform" no longer reads the same as the "Plataformas" label.
- [x] Checked with a real Game that has a cover (Hades, 2020, imported for this ticket).
- [x] `npm run typecheck`, `npm test` and `npm run build` pass; DESIGN.md is rewritten from the build; screenshots at 375 and 1280, light and dark, /en and /es.

## Comments

- Direction picked on Impeccable's decision page: Cross Review Weekly (Impeccable's pick) over the rolled Holo Card Binder, Emission Line Rail and Build Instructions. Code-led build; DESIGN.md and `.impeccable/design.json` were rewritten from the shipped build.
- The pull figure now draws marks only (ring = Rating, dot = Adjusted, tick = 70, axis ends). The values are printed in each review box above it, so labels can't collide however small the pull. Checked with 82 → 81.3 and 93.5 → 84.8.
- Heat scale for the Score circles: red 90+, orange 80–89, yellow 70–79, sky 50–69, blue under 50, each with its numeral printed and a key on the ranking. Every text pair measures 5.18:1 or better in both themes.
- Ranking rows show the first three Platforms then "+N"; the full list is on the Game page. On phones the developer and Genres line is hidden so the first row fits the first screen, and the rank sits on the cover's corner.
- The small Unscored stamp is a dash in a dashed circle with the word beneath it, so "Sin puntuación" never crosses the ring.
- Impeccable's finish reviewer first returned "fix" (six items: Spanish Unscored overflow, misaligned Breakdown rules in Spanish, first row below the phone fold, description drifting from the facts, 404 spacing, cream-tinted ground). After one correction round it scored all six resolved: "ship", at that scope.
- Not taken from the sketch: a ruled tab-strip filter bar (boxed fields kept for affordance) and a "CROSS REVIEW" issue tag (invented copy).
- No horizontal overflow at 320 or 375 on any screen. Screenshots of all 20 screens at 375 and 1280 in both themes are in the session scratchpad (`after-weekly/`).

