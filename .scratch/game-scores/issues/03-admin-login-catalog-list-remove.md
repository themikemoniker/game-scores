# 03: Admin page: login, Catalog list, invalid rows, Remove

**What to build:** The site owner logs in to an English-only admin page with a single password and stays logged in for 30 days, with a way to log out. The page lists every Game in the Catalog and every invalid row (with its row number and the reason), so problems can be fixed in the Sheet. A Remove button deletes a Game's row, and the public site updates right away. Every admin action rejects anyone who isn't logged in, even if the action is called directly.

See `.scratch/game-scores/spec.md`: user stories 26–29, 41, 45–46, and Admin auth.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] The login form compares the submitted password with `ADMIN_PASSWORD` and, on a match, sets a signed, httpOnly cookie that lasts 30 days. Logout clears it.
- [ ] Every admin server action checks the cookie itself; protecting the page alone isn't enough.
- [ ] The admin page lists the Games in the Catalog and the invalid rows, each with its row number and reason.
- [ ] Remove deletes the row by IGDB ID through the Sheet storage module and revalidates the catalog cache tag.
- [ ] A removed Game disappears from the public ranking and its page returns a 404.
- [ ] The admin page has no locale prefix and is in English only.
