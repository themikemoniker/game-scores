# 07: Spanish

**What to build:** Visitors can read the site in English or Spanish. Every visitor URL carries a `/en` or `/es` prefix, so a shared link opens in the language it was shared in. A first visit without a prefix is redirected according to the browser's language, falling back to English. A switcher on every page changes the language and keeps the visitor on the same page. All visitor-facing text, including the Score Breakdown, is in both languages. Genre names are translated, and English-only descriptions are labelled "(in English)" on the Spanish site. The admin page stays English-only.

See `.scratch/game-scores/spec.md`: user stories 19–25, and Modules (i18n).

**Blocked by:** 02, 06

**Status:** done

- [x] Visitor routes are under `/en` and `/es`. A visit without a prefix redirects according to the browser's language, falling back to English.
- [x] A language switcher on every visitor page keeps the visitor on the same page, including the search and filter parameters.
- [x] EN and ES dictionaries cover all visitor-facing text and the Score Breakdown wording.
- [x] Genre names are translated through a fixed mapping, falling back to the Source name when a mapping is missing. Platform names are not translated.
- [x] On the Spanish site, descriptions are shown in English with an "(in English)" label.
- [x] The admin page has no locale prefix and is in English only.

## Comments

- Visitor pages live under `app/[lang]/`, whose layout is the visitor root layout (`<html lang>`). The admin page has its own English-only root layout. `proxy.ts` (Next 16's name for middleware) sends any visit without a prefix to `/en` or `/es`, choosing by `Accept-Language` q-values and falling back to English, and keeps the rest of the path and the query. It skips `/admin`, `/_next/` and files.
- All visitor text, the Genre mapping (IGDB names) and the Spanish Score Breakdown are in `lib/i18n.ts`. Genre filter values stay the Source names, so a filtered link works in both languages and the switcher keeps the filters. Dates and numbers are formatted for the locale.
- 404s: `notFound()` from a Game page shows `app/[lang]/not-found.tsx` in the visitor's language, but Next renders it on the client. With the root layout under a dynamic segment, the server sends an empty error shell, so without JS the page is blank (still a 404 and `noindex`). URLs that match no route get `app/global-not-found.tsx`, a bilingual page rendered on the server, behind the experimental `globalNotFound` flag in `next.config.ts`, as the Next docs advise for this layout.
- Checked by hand against the real Sheet: redirects for no header, `es-MX`, `fr,es;q=0.5`, `es;q=0` and prefixless paths with a query; both languages on the ranking and on Game pages with two ratings, one rating and none; the switcher keeping the filters; the 404s (in Chrome for the client-rendered one); `/admin` still unprefixed and `lang="en"`.
- `next dev` appends a Next.js block to `AGENTS.md` every time it starts. I reverted it each time; commit it once if you'd rather stop seeing the diff.

