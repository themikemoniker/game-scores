---
version: 1
slug: "app-lang-page-tsx"
primary_target: "app/[lang]/page.tsx"
related_targets: ["app/[lang]/games/[slug]/page.tsx","app/[lang]/not-found.tsx","app/global-not-found.tsx","app/[lang]/switcher.tsx"]
---

# Public site: Ranking and Game page

Scope: `/[lang]` ranking, `/[lang]/games/[slug]`, locale switcher, `[lang]/not-found`, `global-not-found`. Mode: **Read** (the visitor's question is "which Games are best, and why this number?").

Audience and job: portfolio reviewers arriving by shared link (judge craft and how clearly the Score explains itself); visitors scanning the best Games, filtering by Platform/Genre, opening a Game to see the working. EN and ES; Spanish runs ~25% longer.

Constraints: plain CSS tokens in `app/globals.css`, next/font only, no new deps; markup changes only for design; never show Unscored as zero.

Memorable moment: the Score Breakdown's pull toward 70: each External Rating drawn on a 0–100 scale with the baseline marked, the raw value travelling to its adjusted value, then summed into the Score like a ledger total.

## Direction contract

THESIS: The Catalog is an exhibition catalogue of under fifty works. Each Game is a numbered plate with a wall label; the Score Breakdown is the catalogue's apparatus, set out so the reader can check the sum. Refuses the aggregator wall of coloured score tiles and the dark neon gamer UI.

OWN-WORLD: Gallery-wall Prussian ink owns the masthead and section openers; label-stock white carries the reading column. Dark theme hangs the whole page on the wall. Archivo (wide, heavy) for plate numbers, wall-vinyl headings and Score numerals; Source Serif 4 for reading text. Score scale: five earthy steps from clay red to deep green, ink chosen per step for contrast. Unscored is a hatched, uncoloured plate. Hairline rules, tabular figures, no cards-in-cards.

STORY: The visitor sees a short ranked hang, recognises Games by cover, reads one big Score, opens a Game, watches each rating pulled toward 70, sees the adjusted values sum to the Score, and trusts it.

FIRST VIEWPORT: Full-bleed ink masthead: wordmark "Game Scores" large, the site description as dek, switcher top right. Below it a quiet filter bar, then plate 1: large rank numeral, cover at real size, title, year and Platforms, and the Score plate at the right edge with a 0–100 scale tick at 70. On a Game page: cover left, title and label right, Score plate beside the title, Breakdown starting above the fold on desktop.

FORM: Exhibition catalogue (numbered plates, wall labels, scholarly apparatus); position 5 of 7 on the ordered list; seed:d30cc8d480d53597. Raises kept from declined challengers: noir one-sheet: total palette commitment (ink plus one wall colour plus the score scale, nothing else); Art Paul program: a strict grid, one spot colour as a custom property; sneaker box stacks: every plate ruled by the same label grid; cyclorama: colour is never the only signal (numbers always printed); depot blind: narrow screens drop decoration, never shrink type; cutting bench: state is a mark, not a hue.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
