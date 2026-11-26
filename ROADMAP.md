# Roadmap

Ideas, not promises. When one is picked up it gets a ticket under `.scratch/<feature>/issues/`.

## Shipped

- **Link previews.** Each Game page unfurls with its cover, name and Score stamp; the ranking
  and the Quiz with the wordmark and the site description, in English or Spanish (ticket 12).
- **CI.** A GitHub Action runs `npm run typecheck`, `npm test` and `npm run build` on every PR
  and every push to `main` (ticket 11).
- **Quiz and Matches.** A short Quiz (where you play, which Tags you feel like, classic or
  modern) that recommends 3 Games from the Catalog and says why each one matched. Built through
  the usual process: grilled, specced (stories 49–57), tickets 09 Tags and 10 Quiz and Matches.
- **A real Catalog.** 16 hand-picked Games; the test rows are gone.

## Now: ready to share

- **Favicon.** `app/icon.svg`, the Score circle.
- **Search engines.** `app/sitemap.ts` and `app/robots.ts`, plus `hreflang` alternates between
  `/en` and `/es`.

## Next

- **Fresh ratings.** A daily Vercel Cron (allowed on Hobby) that runs Sync all, so the Score
  follows IGDB without visiting `/admin`.
- **Analytics.** Vercel Web Analytics and Speed Insights (free on Hobby) to see which Games
  people open.
- **Tag filter on the ranking**, once Tags exist.

## Later

- **A second Source.** OpenCritic or Steam reviews (named in the spec as candidates), each as
  another External Rating in the Breakdown.
- **Override columns** in the Sheet that protect hand edits from Sync.
- **Spanish descriptions** written by hand for the Games that matter most.
- **Compare two Games** side by side, Breakdown against Breakdown.

## Deliberately out

User accounts, voting, personal ratings, Score history, prices, trailers. The site stays a small,
hand-picked, read-only Catalog (see `PRODUCT.md`).
