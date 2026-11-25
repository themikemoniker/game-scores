# Spec: Game Scores site

Status: ready-for-agent

## Problem Statement

I want a video game site, built as a learning project, that shows useful information about each Game I care about and rates it with its own Score. The ratings out there are scattered across critics and users, they don't account for how few reviews they rest on, and they never explain themselves. I want one number per Game that I designed, that I can trust, and that shows why it is what it is. The site should be readable in English and Spanish.

## Solution

A public, read-only website that lists a hand-picked Catalog of Games, ranks them by their Score, and gives each Game a page with its information, its External Ratings, its Score and its Score Breakdown. The site owner manages the Catalog from a password-protected admin page: they search the Source (IGDB), Import Games, Sync them to pull fresh data, and remove them. Data lives in a Google Sheet that the owner can also view and edit by hand. The Score comes from a fixed, explainable formula: each External Rating gets a Confidence Adjustment toward a baseline of 70, and the critic and user ratings are then blended 50/50. A Game with no External Ratings at all is Unscored.

## User Stories

### Visitor: browsing

1. As a visitor, I want a home page that ranks every Game in the Catalog by Score, so that I can see the best Games at a glance.
2. As a visitor, I want each entry in the ranking to show its cover, name, release year, Platforms and Score, so that I can recognise Games without opening them.
3. As a visitor, I want Unscored Games listed after all scored Games, clearly marked as Unscored rather than shown as zero, so that a missing rating isn't mistaken for a bad one.
4. As a visitor, I want to search the Catalog by name, so that I can find a specific Game quickly.
5. As a visitor, I want to filter the ranking by Platform, so that I only see Games I can play.
6. As a visitor, I want to filter the ranking by Genre, so that I can find the best Games of a kind I like.
7. As a visitor, I want to combine search, Platform and Genre filters, so that I can narrow down precisely.
8. As a visitor, I want the current search and filters reflected in the URL, so that I can share or bookmark a filtered ranking and use the back button.
9. As a visitor, I want a clear empty state when no Game matches my filters, so that I know the filters are the reason, not a broken page.

### Visitor: Game page

10. As a visitor, I want a page for each Game, so that I can learn about it in detail.
11. As a visitor, I want the Game page to show name, cover, release date, Platforms, Genres, developer and description, so that I understand what the Game is.
12. As a visitor, I want to see each External Rating with the number of reviews it rests on, so that I can judge how much to trust it.
13. As a visitor, I want to see the Game's Score prominently, so that I get the site's verdict immediately.
14. As a visitor, I want a Score Breakdown showing each External Rating before and after its Confidence Adjustment and how much it contributed, so that I understand why the Game got that Score.
15. As a visitor, I want the Score Breakdown to say when only one External Rating was available, so that I know the Score rests on less data.
16. As a visitor, I want an Unscored Game's page to explain that it has no External Ratings yet, so that I don't think the site is broken.
17. As a visitor, I want to see when the Game's data was last synced, so that I know how current it is.
18. As a visitor, I want readable Game URLs made of the name and release year, so that links are meaningful and two Games with the same name stay distinct.

### Visitor: language

19. As a visitor, I want the site in English or Spanish, so that I can read it in my language.
20. As a first-time visitor, I want the site to pick my language from my browser, so that I land in the right language without doing anything.
21. As a visitor, I want a language switcher on every page that keeps me on the same page, so that I can change language at any time.
22. As a visitor, I want the language in the URL, so that a shared link opens in the language it was shared in.
23. As a Spanish-speaking visitor, I want Genre names translated, so that the filters and Game pages read naturally.
24. As a Spanish-speaking visitor, I want English-only descriptions labelled "(in English)", so that I know why that text isn't translated.
25. As a Spanish-speaking visitor, I want the Score Breakdown explained in Spanish, so that I understand the Score as well as an English reader.

### Site owner: access

26. As the site owner, I want to log in to the admin page with one password, so that only I can change the Catalog.
27. As the site owner, I want to stay logged in for 30 days, so that I don't have to type the password every time.
28. As the site owner, I want to log out, so that I can end the session on a shared computer.
29. As the site owner, I want every admin action to reject requests from someone who isn't logged in, so that the Catalog is safe even if someone calls the actions directly.

### Site owner: Import

30. As the site owner, I want to search the Source by name from the admin page, so that I can find a Game to Import.
31. As the site owner, I want search results to show name, release year and Platforms, so that I pick the right Game among similarly named ones.
32. As the site owner, I want search results to mark Games already in the Catalog, so that I don't Import duplicates.
33. As the site owner, I want to Import a Game with one click, so that adding to the Catalog is fast.
34. As the site owner, I want to be asked to adjust the slug when an Import would collide with an existing Game's slug, so that every Game keeps a unique URL.
35. As the site owner, I want the public site to show a newly imported Game right away, so that I can check it immediately.

### Site owner: Sync

36. As the site owner, I want to Sync a single Game, so that I can pull fresh External Ratings for a recent release.
37. As the site owner, I want to "Sync all" Games at once, so that I can refresh the whole Catalog in one action.
38. As the site owner, I want Sync to record when each Game was last synced, so that I and visitors can see how current it is.
39. As the site owner, I want to be told when a Game could not be found at the Source during Sync, so that I can decide whether to remove it.
40. As the site owner, I want the public site to reflect a Sync right away, so that I see the result of my action.

### Site owner: managing the Catalog

41. As the site owner, I want to remove a Game from the Catalog, so that I can drop Games I no longer want listed.
42. As the site owner, I want to view and edit the Catalog directly in the Google Sheet, so that I can inspect and fix data without building UI for it.
43. As the site owner, I want my hand edits in the Sheet to show up on the site within 10 minutes without doing anything, so that quick fixes don't need a deploy or an admin action.
44. As the site owner, I want to understand that a Sync overwrites my hand edits to Source data, so that I'm not surprised when a fix disappears.
45. As the site owner, I want invalid rows in the Sheet left off the public site, so that one bad cell never breaks the site.
46. As the site owner, I want the admin page to list each invalid row with its row number and the reason, so that I can find and fix it in the Sheet.

### Site owner: tuning the Score

47. As the site owner, I want the Score constants (baseline, confidence weights, blend) in one place, so that I can tune the formula easily.
48. As the site owner, I want a change to the Score constants to update every Score at once without a Sync, so that I can experiment with the formula freely.

## Implementation Decisions

### Architecture

- Next.js (App Router) in TypeScript, deployed to Vercel's free tier.
- A Google Sheet is the database (see ADR 0001). The Next.js server reads and writes it through the Sheets API using a service account. The site never reads the Sheet per page view.
- IGDB is the only Source, called from the server only. Its credentials never reach the browser.
- Secrets are configured as environment variables: Google service account credentials, the Sheet ID, the IGDB client ID and secret, and the admin password.

### Modules

- **Sheet storage**: the only module that talks to Google Sheets. It reads all rows of the `Games` tab in one call, appends a row, replaces the row for a given IGDB ID, deletes the row for a given IGDB ID, and writes many rows in one batch (for Sync all). It returns raw cell values and does no validation.
- **Source client (IGDB)**: gets an app access token with Twitch client credentials and caches it until it expires. It searches Games by name, and fetches full data for a list of IGDB IDs in batched queries (IGDB allows many IDs per query, so Sync all doesn't run into the 4 requests per second limit). It maps IGDB fields to the Sheet row shape:
  - critic rating and count ← `aggregated_rating` and `aggregated_rating_count`
  - user rating and count ← `rating` and `rating_count`
  - release date ← `first_release_date`
  - Platforms and Genres ← their names
  - developer ← the involved company flagged as developer
  - description ← `summary`
  - cover URL ← built from the cover's image ID on IGDB's image CDN (images are hotlinked, not copied)
- **Catalog read** (the main seam): a pure function that takes all raw rows plus a query (search text, Platform, Genre) and returns the visible Games and the invalid rows. Each visible Game is validated and parsed, and carries its Score and Score Breakdown. Games are filtered by the query and ordered for the ranking. Looking up a single Game by slug goes through the same function. Row validation, Confidence Adjustment, blending, Unscored handling, filtering and ordering all live behind this function.
- **Catalog cache**: wraps "read all rows → Catalog read" in Next.js's data cache under one tag, with a 10-minute time-based revalidation. Every admin action (Import, Sync, Sync all, Remove) revalidates the tag on demand.
- **Admin auth**: a login form compares the submitted password with the configured admin password and, on a match, sets a signed, httpOnly, 30-day cookie. There is a logout action. Every admin server action verifies the cookie itself; protecting the page alone isn't enough.
- **i18n**: every route has an `en` or `es` locale prefix. A visit without a prefix redirects according to the browser's language, falling back to English. Each page has a switcher that keeps the visitor on the same page. EN and ES dictionaries cover all visitor-facing interface text and the Score Breakdown wording. The admin page is English-only and has no locale prefix. Genre names are translated through a fixed mapping in the dictionaries, falling back to the Source name when a mapping is missing. Platform names are not translated. Descriptions are shown in English, with an "(in English)" label on the Spanish site.

### Sheet schema

One `Games` tab with one row per Game and a header row. The IGDB ID is the row's identity. Columns:

IGDB ID, slug, name, cover URL, release date, Platforms (comma-separated), Genres (comma-separated), developer, description, critic rating, critic count, user rating, user count, last synced.

The Score is never stored in the Sheet.

### Score formula

- Both External Ratings are on a 0–100 scale.
- Confidence Adjustment for each External Rating: `adjusted = (count × rating + weight × 70) / (count + weight)`. The weight is 10 for the critic rating and 100 for the user rating. The baseline is fixed rather than the Catalog average, so a Game's Score changes only when that Game's own data changes.
- Score = a 50/50 blend of the adjusted critic and user ratings. If only one External Rating exists, it gets 100% of the weight. If neither exists, the Game is Unscored.
- An External Rating with a count of zero or missing data counts as absent.
- All constants (baseline 70, weights 10 and 100, blend 50/50) live together in the Catalog read module.
- The Score is shown rounded to a whole number. Ranking uses the unrounded value. Ties, and the order of Unscored Games, are broken by name.
- The Score Breakdown lists, for each External Rating: the raw rating, its count, the adjusted rating and its share of the blend. It also flags when only one External Rating was used.

### Import, Sync and Remove

- **Import** writes a new row built by the Source client. The slug is the name plus the release year, in lowercase kebab-case (just the name if there's no release date). If it collides with an existing slug, the admin must enter a different slug before the Import completes.
- **Sync** (one Game, or all of them) refetches from the Source, overwrites every Source column, keeps the slug and sets last synced. If an IGDB ID no longer returns data, the row is left as it is and the admin page reports it.
- **Remove** deletes the row. Nothing else references a Game.

### Delivery order

Each slice is deployed working:

1. Import one Game into the Sheet, then a ranking and a Game page in English with the Score and Score Breakdown.
2. Admin page: login and logout, search the Source, Import, Remove, and the invalid-row list.
3. Sync, for one Game and for all, with last synced.
4. Search and filters in the URL.
5. Spanish: locale prefixes, browser detection, the switcher, Genre translations and the "(in English)" label.

## Testing Decisions

- A good test drives the Catalog read seam the way the app does: it hands in raw Sheet rows and a query, and asserts on the visible Games (order, Score, Score Breakdown, Unscored) and on the invalid rows. Tests must not reach into internal helpers, so the formula and validation can be refactored freely.
- **One seam**: Catalog read, tested with Vitest. The cases to cover:
  - Confidence Adjustment pulls a rating backed by few reviews toward 70, while a rating backed by many reviews barely moves.
  - The 50/50 blend when both External Ratings exist.
  - A single External Rating gets 100% of the weight, and the Score Breakdown flags it.
  - A Game with no External Ratings is Unscored and is ordered after scored Games.
  - A count of zero counts as absent.
  - Ranking order, including tie-breaking by name.
  - Search, Platform and Genre filters, alone and combined.
  - Invalid rows (a non-numeric rating, a missing name, a duplicate slug) are excluded and reported with their row number and reason, and the valid rows are still returned.
- The Sheet storage, Source client, auth and i18n are not unit-tested. They're thin glue over external services and the framework, and they get checked by hand on each deployed slice.
- No E2E tests: they would mean mocking both Google Sheets and IGDB.
- There's no prior art yet; the repo is empty. These are its first tests.

## Out of Scope

- User accounts, favorites, community voting and personal ratings.
- Sources other than IGDB (Steam reviews and OpenCritic are candidates for later).
- Translating the admin page.
- Machine translation of descriptions, or Spanish descriptions written by hand.
- Override columns that protect hand edits from Sync.
- Scheduled or automatic Sync.
- Side-by-side comparisons, "similar games" and rankings by year.
- Price, screenshots, trailers and game length.
- Score history, or keeping old Scores when the formula changes.
- A real database (see ADR 0001 for the path if it's ever needed).

## Further Notes

- This is a learning project. Simple and explainable beats clever wherever they conflict.
- These details were not discussed and were set in the spec by default: rounding the Score for display, breaking ties by name, treating a count of zero as absent, basing the slug on the name alone when there's no release date, and leaving a row in place when the Source no longer returns it. Change any of them freely.
- Vocabulary follows the root `GLOSSARY.md`, and storage constraints follow `docs/adr/0001-google-sheets-as-database.md`.
