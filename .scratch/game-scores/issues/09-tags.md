# 09: Tags

**What to build:** The site owner gives each Game 2–4 Tags from a fixed list in a new `tags` column of the Sheet. Catalog read parses them, drops unknown ones and reports them; Sync keeps them; the Game page shows them as chips in English or Spanish; the admin page lists Games with no Tags. Every Game in the Catalog gets its Tags.

See `.scratch/game-scores/spec.md`: user stories 54–57, and Tags and the Quiz.

**Blocked by:** none

**Status:** ready-for-agent

- [ ] The Tag list (roguelike, metroidvania, 2D platformer, 3D platformer, open world, cozy, story-rich, deckbuilder, shooter, puzzle) lives in one place in code, with EN and ES names.
- [ ] `tags` is the last Sheet column; Catalog read returns each Game's Tags and reports an unknown Tag with its row number without hiding the Game. Rows without the column still read.
- [ ] Import leaves `tags` empty; Sync one and Sync all keep it.
- [ ] The Game page shows Tags as chips in the Cross Review Weekly style, translated on `/es`; nothing shows when a Game has none.
- [ ] The admin page lists Games with no Tags.
- [ ] Tests through Catalog read: Tags parsed, unknown Tag dropped and reported, missing column reads as no Tags.
- [ ] The owner approves Tags for every Game and they're written to the Sheet.
- [ ] `npm run typecheck`, `npm test` and `npm run build` pass.
