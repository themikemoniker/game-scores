# 07: Spanish

**What to build:** Visitors can read the site in English or Spanish. Every visitor URL carries a `/en` or `/es` prefix, so a shared link opens in the language it was shared in. A first visit without a prefix is redirected according to the browser's language, falling back to English. A switcher on every page changes the language and keeps the visitor on the same page. All visitor-facing text, including the Score Breakdown, is in both languages. Genre names are translated, and English-only descriptions are labelled "(in English)" on the Spanish site. The admin page stays English-only.

See `.scratch/game-scores/spec.md`: user stories 19–25, and Modules (i18n).

**Blocked by:** 02, 06

**Status:** ready-for-agent

- [ ] Visitor routes are under `/en` and `/es`. A visit without a prefix redirects according to the browser's language, falling back to English.
- [ ] A language switcher on every visitor page keeps the visitor on the same page, including the search and filter parameters.
- [ ] EN and ES dictionaries cover all visitor-facing text and the Score Breakdown wording.
- [ ] Genre names are translated through a fixed mapping, falling back to the Source name when a mapping is missing. Platform names are not translated.
- [ ] On the Spanish site, descriptions are shown in English with an "(in English)" label.
- [ ] The admin page has no locale prefix and is in English only.
