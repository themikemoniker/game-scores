# 13: Daily Sync

**What to build:** A Vercel Cron that runs Sync all once a day, so the Score follows IGDB without anyone opening `/admin`. It calls a route that only answers to Vercel's `CRON_SECRET`, and that route uses the same Sync code as the admin button.

See `.scratch/game-scores/spec.md`: user story 61, and Daily Sync.

**Blocked by:** none

**Status:** in progress

- [x] Sync all moves to `lib/sync.ts` without changing behavior; the admin action keeps `requireAdmin()`, `updateTag` and the redirect.
- [x] `GET /api/cron/sync` answers 401 without the right `Authorization: Bearer $CRON_SECRET` (or when `CRON_SECRET` isn't set), and otherwise runs Sync all, revalidates the Catalog and returns `{ synced, missing }`.
- [x] `vercel.json` schedules it at `0 6 * * *`; `proxy.ts` no longer redirects `/api/`.
- [x] README: the `CRON_SECRET` variable and what the daily Sync means for hand edits.
- [x] `CRON_SECRET` is set in the Vercel production environment (a generated 32-byte hex value, marked sensitive).
- [ ] After deploy, the job shows in the Vercel project's Cron Jobs tab, and its first run returns 200.
- [x] `npm run typecheck`, `npm test` and `npm run build` pass.

## Comments

- Moving scheduled Sync into scope reverses a line in the spec's Out of Scope list. It was accepted while grilling: Source columns belong to IGDB, and override columns stay on the roadmap.
- Checked locally against a production build: no header gets 401, a wrong secret gets 401, and the right one ran a real Sync all, returning `{"synced":16,"missing":[]}`. Afterward the ranking still lists 16 Games, and Hades keeps its Tags.
- Without the `proxy.ts` change, the locale redirect would have sent `/api/cron/sync` to `/en/api/cron/sync`, which returns 404.
