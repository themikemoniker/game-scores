# 01: Ranking page from the Sheet, with Score

**What to build:** A visitor opens the deployed site and sees the Catalog ranked by Score, in English. Each entry shows the cover, name, release year, Platforms and Score. Unscored Games are listed last and marked "Unscored", not shown as zero. The data comes from the `Games` tab of the Google Sheet (for this ticket, a few Games entered by hand) and goes through the Sheet storage module, the catalog cache and the catalog-read step described in the spec. Invalid rows are left off the site. This ticket sets up the Next.js project and builds the whole catalog-read step (row checks, Confidence Adjustment, the blend, Unscored handling and ordering) with its Vitest tests.

See `.scratch/game-scores/spec.md`: Implementation Decisions (Modules, Sheet schema, Score formula) and Testing Decisions. Follows ADR 0001.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] A Next.js (App Router, TypeScript) app is set up, with Vitest configured.
- [x] The Sheet storage module reads all rows of the `Games` tab in one call, using a service account and the Sheet ID from environment variables. It's the only code that touches Google Sheets.
- [x] The catalog-read step takes raw rows (and a query, even if this ticket doesn't use it yet) and returns visible Games with their Score and Score Breakdown, plus invalid rows with row number and reason.
- [x] The Score follows the spec: Confidence Adjustment toward 70 with weights of 10 (critic) and 100 (user), a 50/50 blend, a single rating taking 100% of the weight, a count of zero treated as absent, and Unscored when there are no ratings. The constants live together in one place.
- [x] Ranking order: the unrounded Score from highest to lowest, ties broken by name, and Unscored Games last, ordered by name.
- [x] Catalog reads are cached under one tag, with time-based revalidation every 10 minutes. The Sheet is never read on each page view.
- [x] The home page shows the ranking with covers hotlinked from IGDB's image CDN, and the Score rounded to a whole number.
- [x] Vitest tests cover the catalog-read step through its public input and output only: Confidence Adjustment with few and many reviews, the blend, a single rating, Unscored, a count of zero, ordering and tie-breaks, and invalid rows (a non-numeric rating, a missing name, a duplicate slug) being excluded and reported while the valid rows are still returned.
- [x] The Sheet's header row is exactly: `igdb_id, slug, name, cover_url, release_date, platforms, genres, developer, description, critic_rating, critic_count, user_rating, user_count, last_synced`. Dates are ISO (`YYYY-MM-DD`; `last_synced` is an ISO datetime), lists are comma-separated, and an empty `cover_url` is allowed (shown as a placeholder).
- [x] Environment variables: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` (newlines escaped as `\n`), `GOOGLE_SHEET_ID`. The README lists them along with the header row.
- [x] Deployed to Vercel (or ready to deploy, if the account isn't set up yet).

## Comments

- Ready to deploy, not deployed: the Vercel CLI isn't installed and no account is linked. `npm run build` passes against the real Sheet. To deploy, import the repo in Vercel and add the three env vars (README → Deploy).
- The cache holds the raw rows (tag `catalog`, 10 min). Catalog read runs on top of them, so one Sheet read serves every query.
- Besides the spec's checks, rows are also rejected for a duplicate `igdb_id`, a slug that isn't lowercase kebab-case, a non-https `cover_url` and a `last_synced` that isn't ISO.
