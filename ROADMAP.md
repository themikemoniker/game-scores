# Roadmap

Ideas, not promises. When one is picked up it gets a ticket under `.scratch/<feature>/issues/`.

## Now: ready to share

- **Clean Catalog.** Remove the `test-*` rows from the Sheet and import 15–30 real Games, so the
  ranking shows the Score working across the heat scale.
- **Link previews.** Open Graph image per page with `next/og` (built in): the Game's cover, name
  and Score circle. Shared links currently unfurl as plain text.
- **Favicon.** `app/icon.svg`, the Score circle.
- **Search engines.** `app/sitemap.ts` and `app/robots.ts`, plus `hreflang` alternates between
  `/en` and `/es`.

## Next

- **CI.** A GitHub Action that runs `npm run typecheck`, `npm test` and `npm run build` on every PR.
- **Fresh ratings.** A daily Vercel Cron (allowed on Hobby) that runs Sync all, so the Score
  follows IGDB without visiting `/admin`.
- **Analytics.** Vercel Web Analytics and Speed Insights (free on Hobby) to see which Games
  people open.
- **Ranking screenshot in the README** once the Catalog is real.

## Later

- **A second Source.** OpenCritic or Steam reviews (named in the spec as candidates), each as
  another External Rating in the Breakdown.
- **Override columns** in the Sheet that protect hand edits from Sync.
- **Spanish descriptions** written by hand for the Games that matter most.
- **Compare two Games** side by side, Breakdown against Breakdown.

## Deliberately out

User accounts, voting, personal ratings, Score history, prices, trailers. The site stays a small,
hand-picked, read-only Catalog (see `PRODUCT.md`).
