# 06: Search and filters in the URL

**What to build:** On the ranking, a visitor can search by name and filter by Platform and Genre, and combine all three. The current search and filters live in the URL, so a filtered ranking can be shared or bookmarked and the back button works. When nothing matches, a clear message says the filters are the reason.

See `.scratch/game-scores/spec.md`: user stories 4–9.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Search, Platform and Genre are read from URL parameters and passed as the query to the catalog-read step. Filtering happens on the server, over the cached Catalog.
- [ ] The Platform and Genre options come from the Games in the Catalog.
- [ ] Filters can be combined, and the ranking order is kept within the results.
- [ ] When no Game matches, a message says so.
- [ ] Vitest tests are added at the catalog-read seam for search, Platform and Genre, each alone and all combined.
