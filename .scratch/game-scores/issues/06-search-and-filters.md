# 06: Search and filters in the URL

**What to build:** On the ranking, a visitor can search by name and filter by Platform and Genre, and combine all three. The current search and filters live in the URL, so a filtered ranking can be shared or bookmarked and the back button works. When nothing matches, a clear message says the filters are the reason.

See `.scratch/game-scores/spec.md`: user stories 4–9.

**Blocked by:** 01

**Status:** done

- [x] Search, Platform and Genre are read from URL parameters and passed as the query to the catalog-read step. Filtering happens on the server, over the cached Catalog.
- [x] The Platform and Genre options come from the Games in the Catalog.
- [x] Filters can be combined, and the ranking order is kept within the results.
- [x] When no Game matches, a message says so.
- [x] Vitest tests are added at the catalog-read seam for search, Platform and Genre, each alone and all combined.

- The search and filters are a plain GET `<form>` (`?search=&platform=&genre=`), so each change is a normal navigation: the URL updates, the back button works and no client JS is needed. Search matches part of the name, ignoring case. Platform and Genre must match exactly, and the dropdowns are built from the whole Catalog.
- `/` now renders on each request, because it reads `searchParams`. The Sheet rows still come from the 10-minute `catalog` cache, so a page view never reads the Sheet.
- Checked by hand against the real Sheet with `next start`: each filter alone, all three together, a search with no matches showing the empty-state message with a Clear link, and the chosen values kept in the form.

