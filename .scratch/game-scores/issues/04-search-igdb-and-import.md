# 04: Search IGDB and Import

**What to build:** From the admin page, the site owner searches IGDB by name. Each result shows its name, release year and Platforms, and results already in the Catalog are marked. One click Imports the Game: a new row is written to the Sheet, and the Game appears on the public site right away. If the generated slug (name plus year) collides with an existing one, the owner is asked for a different slug before the Import goes through.

See `.scratch/game-scores/spec.md`: user stories 30–35, Modules (Source client), and Import, Sync and Remove.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] The Source client gets an IGDB app access token with Twitch client credentials and caches it until it expires. The credentials come from environment variables and are only used on the server.
- [ ] Search by name returns candidates showing name, release year and Platforms. Games already in the Catalog are marked.
- [ ] IGDB fields are mapped to the Sheet row as the spec describes (critic rating and count, user rating and count, release date, Platforms, Genres, developer, summary, cover URL).
- [ ] The slug is the name plus the release year in lowercase kebab-case, or just the name when there's no release date. If it collides with an existing slug, the owner must enter a different one.
- [ ] Import appends the row through the Sheet storage module, sets "last synced" and revalidates the catalog cache.
- [ ] The README lists the IGDB environment variables.
