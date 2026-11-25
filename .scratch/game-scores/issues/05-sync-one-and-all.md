# 05: Sync, for one Game and for all

**What to build:** The site owner can Sync a single Game, or every Game at once with "Sync all". Sync pulls the latest information and External Ratings from IGDB, overwrites the Source columns (including any hand edits), keeps the slug, and records when each Game was last synced. The admin page reports any Game IGDB no longer returns. The public site reflects the Sync right away.

See `.scratch/game-scores/spec.md`: user stories 36–40 and 44, and Import, Sync and Remove.

**Blocked by:** 04

**Status:** ready-for-agent

- [ ] Each Game on the admin page has a Sync button that refetches it from IGDB and replaces its row, keeping the slug.
- [ ] "Sync all" fetches every Game in batched IGDB queries (staying under the 4 requests per second limit) and writes all the rows in one batch.
- [ ] Sync overwrites every Source column and sets "last synced".
- [ ] If IGDB no longer returns an IGDB ID, that row is left untouched and reported on the admin page.
- [ ] The catalog cache is revalidated after each Sync.
