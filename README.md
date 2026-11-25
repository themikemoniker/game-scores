# Game Scores

A hand-picked Catalog of Games, ranked by the site's own Score. See `GLOSSARY.md` for vocabulary,
`.scratch/game-scores/spec.md` for the spec and `docs/adr/` for decisions.

## Run

```sh
npm install
npm run dev        # http://localhost:3000
npm test           # Vitest: the Catalog read seam
npm run typecheck
npm run build
```

Check the Sheet connection (prints tabs, header and Game names, no secrets):

```sh
node --env-file=.env.local scripts/check-sheet.mjs
```

## Environment variables

Put these in `.env.local` locally and in the Vercel project settings for deploys:

| Variable | Value |
| --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | The service account's email. Share the Sheet with it as an editor. |
| `GOOGLE_PRIVATE_KEY` | The service account's private key, on one line with newlines escaped as `\n`. |
| `GOOGLE_SHEET_ID` | The ID from the Sheet's URL: `docs.google.com/spreadsheets/d/<ID>/edit`. |
| `ADMIN_PASSWORD` | The password for `/admin`. It also signs the 30-day session cookie, so changing it logs everyone out. |

## The Sheet

One tab named `Games`, one row per Game. The header row is exactly:

```
igdb_id, slug, name, cover_url, release_date, platforms, genres, developer, description, critic_rating, critic_count, user_rating, user_count, last_synced
```

- Format every column as **Format → Number → Plain text**. Otherwise Sheets turns a typed
  `2020-01-01` into a date displayed as `1/1/2020`, and the row is rejected.
- `release_date` is `YYYY-MM-DD`; `last_synced` is an ISO datetime.
- `slug` is lowercase kebab-case (`the-game-2020`), unique; `igdb_id` is unique.
- `cover_url` is an https URL (IGDB's image CDN) or empty.
- `platforms` and `genres` are comma-separated.
- Ratings are 0–100; counts are whole numbers. A rating with an empty or zero count is ignored.
- `cover_url` may be empty (a placeholder is shown).
- The Score is computed, never stored. Invalid rows are left off the site.

The site reads the Sheet at most every 10 minutes (cache tag `catalog`), so hand edits take up to
10 minutes to appear.

## Deploy

Import the repo in Vercel (framework preset: Next.js), add the four environment variables, deploy. The admin page is at `/admin`.
