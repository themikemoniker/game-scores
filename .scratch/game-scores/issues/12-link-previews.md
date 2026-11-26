# 12: Link previews

**What to build:** Shared links unfurl with a picture instead of plain text. Each Game page gets an Open Graph image with its cover, name and Score stamp; the ranking and the Quiz share one with the wordmark and the site description. Both come in English and Spanish. Game pages also get their own title and description.

See `.scratch/game-scores/spec.md`: user stories 59–60, and Link previews.

**Blocked by:** none

**Status:** done

- [x] `app/[lang]/games/[slug]/opengraph-image.tsx`: a 1200×630 PNG with the cover (or the initial placeholder), the name and the Score stamp colored by the heat scale; an Unscored Game shows the dashed stamp and the word; an unknown slug is a 404.
- [x] `app/[lang]/opengraph-image.tsx`: the wordmark, the site description and the heat scale, in the page's language; the ranking and the Quiz inherit it.
- [x] The font is committed (a Latin subset of Dela Gothic One with its OFL license); rendering fetches only the cover.
- [x] Game pages have the title `<name> · Game Scores` and a description of at most about 160 characters, in `og:` and `twitter:` tags; every page has `twitter:card` set to `summary_large_image`.
- [x] `npm run typecheck`, `npm test` and `npm run build` pass.

## Comments

- The first version put the Score stamp straight on the yellow band, and a 70–79 Score (the yellow step) became a bare ring. The stamp and the legend now sit on a paper plate, like the ranking's rows.
- Checked against a production build: Hades (EN), Jak and Daxter (the longest name, three lines), Breath of the Wild (a red 91), the site card in EN and ES. Unscored and no-cover were checked by forcing both on a real Game in `next dev`, in Spanish: the dashed stamp with "Sin puntuación" and the initial placeholder.
- Every Game in the Catalog has a cover and a Score today, so those two paths only run once the Catalog has such a Game.
- The `alt` text is the same for every Game image; a per-Game one needs `generateImageMetadata`, which isn't worth it yet.
