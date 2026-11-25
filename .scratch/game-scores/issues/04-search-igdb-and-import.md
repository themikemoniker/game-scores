# 04: Search IGDB and Import

**What to build:** From the admin page, the site owner searches IGDB by name. Each result shows its name, release year and Platforms, and results already in the Catalog are marked. One click Imports the Game: a new row is written to the Sheet, and the Game appears on the public site right away. If the generated slug (name plus year) collides with an existing one, the owner is asked for a different slug before the Import goes through.

See `.scratch/game-scores/spec.md`: user stories 30–35, Modules (Source client), and Import, Sync and Remove.

**Blocked by:** 03

**Status:** done


- [x] The Source client gets an IGDB app access token with Twitch client credentials and caches it until it expires. The credentials come from environment variables and are only used on the server.
- [x] Search by name returns candidates showing name, release year and Platforms. Games already in the Catalog are marked.
- [x] IGDB fields are mapped to the Sheet row as the spec describes (critic rating and count, user rating and count, release date, Platforms, Genres, developer, summary, cover URL).
- [x] The slug is the name plus the release year in lowercase kebab-case, or just the name when there's no release date. If it collides with an existing slug, the owner must enter a different one.
- [x] Import appends the row through the Sheet storage module, sets "last synced" and revalidates the catalog cache.
- [x] The README lists the IGDB environment variables.

## Comments

- Checked by hand on 2026-11-25 with `next start` against the real Sheet and IGDB. Search "Hades" shows 20 candidates with year and Platforms. Importing Hades (2020) wrote the row (Score 87, cover, Genres, developer, summary), marked it "In Catalog", and showed it at once on `/en` and `/es/games/hades-2020`. Two IGDB Games named Tetris from 2020: the first imported as `tetris-2020`. The second stopped with `slug "tetris-2020" is already used by another Game.` and a New slug field on its row, rejected `Tetris VC` (not kebab-case), then imported as `tetris-2020-vc-4000`. All three test Games were then removed, so the Sheet is back to its three seed rows.
- Twitch rejects `http://localhost` as a redirect URL; the README now says `https://localhost`. The value is never used, because client credentials need no redirect.
- Follow-up: every Import button's accessible name is "Import <name>", so a screen reader can't tell the 19 "Import Tetris" buttons apart. Adding the year to the label would fix it.

