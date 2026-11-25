# 05: Sync, for one Game and for all

**What to build:** The site owner can Sync a single Game, or every Game at once with "Sync all". Sync pulls the latest information and External Ratings from IGDB, overwrites the Source columns (including any hand edits), keeps the slug, and records when each Game was last synced. The admin page reports any Game IGDB no longer returns. The public site reflects the Sync right away.

See `.scratch/game-scores/spec.md`: user stories 36–40 and 44, and Import, Sync and Remove.

**Blocked by:** 04

**Status:** done

- [x] Each Game on the admin page has a Sync button that refetches it from IGDB and replaces its row, keeping the slug.
- [x] "Sync all" fetches every Game in batched IGDB queries (staying under the 4 requests per second limit) and writes all the rows in one batch.
- [x] Sync overwrites every Source column and sets "last synced".
- [x] If IGDB no longer returns an IGDB ID, that row is left untouched and reported on the admin page.
- [x] The catalog cache is revalidated after each Sync.

## Comments

- Sync and Sync all are one server action, `syncGames`: with an `igdbId` it syncs that Game, without one it syncs every row in the Sheet. It reads the Sheet itself, not the cache, so rows added by hand are included and invalid rows can be repaired. IGDB data comes from `fetchGameRows`, at 500 IDs per sequential query, so a Catalog under 2,000 Games stays within IGDB's 4 requests per second. Each row keeps its slug, and every row is written in one `values:batchUpdate` through the new `replaceGameRows` in Sheet storage. The catalog tag is then revalidated, and the action redirects with `?synced=N&missing=<ids>`, which the admin page turns into a status line and an alert naming the missing Games.
- The admin Catalog table now has a "Last synced" column and a Sync button per Game. "Sync all" carries a note that it overwrites hand edits (user story 44).
- Checked by hand on 2026-11-25 against the real Sheet and IGDB, with the seed rows backed up first and restored afterwards (the restored Sheet was byte-for-byte the same). A hand edit to row 1 (name and critic rating) was overwritten by Sync, while the slug and every other row stayed the same and the public Game page updated at once. Sync all synced 3 Games and reported a row with IGDB ID 999999999 as missing, leaving that row unchanged.
- Heads-up: the seed rows use IGDB IDs 1, 2 and 3, which are real IGDB Games (the Thief series). A real Sync all replaces them with Thief data. Giving the seed rows IDs IGDB doesn't have would make Sync report them as missing and leave them alone.

