# 03: Admin page: login, Catalog list, invalid rows, Remove

**What to build:** The site owner logs in to an English-only admin page with a single password and stays logged in for 30 days, with a way to log out. The page lists every Game in the Catalog and every invalid row (with its row number and the reason), so problems can be fixed in the Sheet. A Remove button deletes a Game's row, and the public site updates right away. Every admin action rejects anyone who isn't logged in, even if the action is called directly.

See `.scratch/game-scores/spec.md`: user stories 26–29, 41, 45–46, and Admin auth.

**Blocked by:** 01

**Status:** done

- [x] The login form compares the submitted password with `ADMIN_PASSWORD` and, on a match, sets a signed, httpOnly cookie that lasts 30 days. Logout clears it.
- [x] Every admin server action checks the cookie itself; protecting the page alone isn't enough.
- [x] The admin page lists the Games in the Catalog and the invalid rows, each with its row number and reason.
- [x] Remove deletes the row by IGDB ID through the Sheet storage module and revalidates the catalog cache tag.
- [x] A removed Game disappears from the public ranking and its page returns a 404.
- [x] The admin page has no locale prefix and is in English only.

## Comments

- Checked by hand on 2026-11-25 with `next start`: a wrong password shows "Wrong password."; the right one opens the admin page with the Catalog and "Invalid rows (0)"; Remove on an imported Game drops it from the admin list, and at once from the `/en` ranking, with `/en/games/<slug>` returning 404; Log out returns to the login form. The cookie is httpOnly, 30 days, `path=/admin`, and `secure` in production (see `lib/admin-auth.ts`). The invalid-row list wasn't exercised with a bad row (the Sheet has none). The Vitest tests cover the reasons.

