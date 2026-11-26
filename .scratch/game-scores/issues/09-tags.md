# 09: Tags

**What to build:** The site owner gives each Game 2–4 Tags from a fixed list in a new `tags` column of the Sheet. Catalog read parses them, drops unknown ones and reports them; Sync keeps them; the Game page shows them as chips in English or Spanish; the admin page lists Games with no Tags. Every Game in the Catalog gets its Tags.

See `.scratch/game-scores/spec.md`: user stories 54–57, and Tags and the Quiz.

**Blocked by:** none

**Status:** done

- [x] The Tag list (roguelike, metroidvania, 2D platformer, 3D platformer, open world, cozy, story-rich, deckbuilder, shooter, puzzle) lives in one place in code, with EN and ES names.
- [x] `tags` is the last Sheet column; Catalog read returns each Game's Tags and reports an unknown Tag with its row number without hiding the Game. Rows without the column still read.
- [x] Import leaves `tags` empty; Sync one and Sync all keep it.
- [x] The Game page shows Tags as chips in the Cross Review Weekly style, translated on `/es`; nothing shows when a Game has none.
- [x] The admin page lists Games with no Tags.
- [x] Tests through Catalog read: Tags parsed, unknown Tag dropped and reported, missing column reads as no Tags.
- [x] The owner approves Tags for every Game and they're written to the Sheet.
- [x] `npm run typecheck`, `npm test` and `npm run build` pass.

## Comments

- Grilled in three rounds; the first found that IGDB marks 15 of the 16 Games "Adventure", so the Quiz matches on owner-written Tags rather than Genres.
- Tags are stored as keys (`2d-platformer`) and shown by name per language. An unknown Tag goes to a separate `unknownTags` list, not `invalidRows`, because the Game stays on the site.
- Sync keeps Tags the same way it keeps the slug; IGDB rows carry an empty `tags` cell that Sync fills back in.
- Tags for all 16 Games approved by the owner and written to column O; Catalog read reports none missing and none unknown.
