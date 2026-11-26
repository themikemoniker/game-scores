---
version: 1
slug: "app-lang-page-tsx"
primary_target: "app/[lang]/page.tsx"
related_targets: ["app/[lang]/games/[slug]/page.tsx","app/[lang]/not-found.tsx","app/global-not-found.tsx","app/[lang]/switcher.tsx"]
---

# Public site: Ranking and Game page

Scope: `/[lang]` ranking, `/[lang]/games/[slug]`, locale switcher, `[lang]/not-found`, `global-not-found`. Mode: **Read** (the visitor's question is "which Games are best, and why this number?").

Audience and job: portfolio reviewers arriving by shared link (judge craft and how clearly the Score explains itself); visitors scanning the best Games, filtering by Platform/Genre, opening a Game to see the working. EN and ES; Spanish runs ~25% longer.

Constraints: plain CSS tokens in `app/globals.css`, next/font only, no new deps; markup changes only for design; never show Unscored as zero; numbers in the Breakdown never overlap or overflow (spec story 28).

Memorable moment: the cross-review box. Every External Rating printed raw, then adjusted, with a mark showing its pull toward 70, and the Score stamped in a heat-coloured circle beside it, on the ranking and in full on the Game page.

Replaces: the 2026-11 "Exhibition Catalogue" world (owner found it "a bit boring but good"). Chosen on the decision page as IMPECCABLE'S PICK over the rolled Holo Card Binder.

## Direction contract

THESIS: The ranking is this week's chart page of a Japanese-style game magazine. Each Game gets a cross-review box: every External Rating printed raw and adjusted toward 70, and the Score stamped in a circle. Refuses the aggregator's tile wall and the dark neon gamer UI.

OWN-WORLD: Newsprint yellow owns the masthead and section bars; heavy black 3px rules box everything; white reading column. Dela Gothic One, skewed, for the wordmark, rank and Score numerals; Zen Kaku Gothic New for labels and reading text. Score scale is heat: red hot (90+), orange, yellow, sky, blue cold (under 50), as filled circles with printed numerals. Red badges for counts. Unscored is a dashed empty circle. No shadows, no rounded cards.

STORY: The visitor sees a loud chart page, recognises Games by cover, compares heat circles, reads each cross-review box, opens a Game, sees each rating pulled toward 70 and the sum stamped as the Score, and trusts it.

FIRST VIEWPORT: Yellow masthead: skewed wordmark around 96px with the dek below, switcher and a red Games-count badge right. A black-ruled filter bar. "Ranking" heading with a one-line method note. Row 1: italic rank 01, cover 92 wide, name and meta, cross-review box (Critic, User), Score circle 104px at the right edge.

FORM: Japanese weekly game magazine, cross-review score box and sales chart page; position 1 of 7 on the ordered list (shown as the pick); seed:6021f37d7454d703.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
