# 02: Game page with Score Breakdown

**What to build:** A visitor clicks a Game in the ranking and lands on that Game's page, at a URL made of its name and year. The page shows the name, cover, release date, Platforms, Genres, developer and description, plus each External Rating with its review count. It shows the Score prominently, followed by the Score Breakdown, which explains why the Game got that number. Unscored Games explain that they have no External Ratings yet. The page also shows when the Game was last synced.

See `.scratch/game-scores/spec.md`: user stories 10–18, and Score formula (Score Breakdown).

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Ranking entries link to `/games/<slug>`, and the page looks up the Game by slug through the catalog-read step.
- [ ] An unknown slug, or the slug of an invalid row, returns a 404.
- [ ] The Score Breakdown lists, for each External Rating, the raw rating, its count, the adjusted rating and its share of the blend.
- [ ] The Score Breakdown flags when only one External Rating was used.
- [ ] Unscored Games show an explanation instead of a Score.
- [ ] "Last synced" is shown.
- [ ] Vitest tests are added at the catalog-read seam for looking up a single Game by slug and for the contents of the Score Breakdown.
