---
name: Game Scores
description: A hand-picked Catalog of Games, printed as a Japanese weekly game magazine's chart page, with a cross-review box for every Game and the Score stamped in a heat circle.
colors:
  yellow: "oklch(0.885 0.18 94)"
  yellow-tint: "oklch(0.965 0.06 95)"
  yellow-tint-dark: "oklch(0.29 0.05 92)"
  on-yellow: "oklch(0.18 0.006 95)"
  on-yellow-soft: "oklch(0.36 0.06 80)"
  red: "oklch(0.55 0.22 28)"
  red-dark: "oklch(0.64 0.2 28)"
  on-red: "oklch(0.99 0.004 95)"
  on-red-dark: "oklch(0.15 0.006 95)"
  paper: "oklch(0.995 0 0)"
  paper-dark: "oklch(0.17 0.006 95)"
  paper-sunk: "oklch(0.96 0.003 95)"
  paper-sunk-dark: "oklch(0.215 0.008 95)"
  ink: "oklch(0.18 0.006 95)"
  ink-dark: "oklch(0.96 0.008 95)"
  ink-soft: "oklch(0.42 0.012 95)"
  ink-soft-dark: "oklch(0.76 0.012 95)"
  rule-soft: "oklch(0.84 0.012 95)"
  rule-soft-dark: "oklch(0.34 0.01 95)"
  s5: "oklch(0.55 0.22 28)"
  s5-ink: "oklch(0.99 0.004 95)"
  s4: "oklch(0.73 0.17 52)"
  s4-ink: "oklch(0.18 0.006 95)"
  s3: "oklch(0.885 0.18 94)"
  s3-ink: "oklch(0.18 0.006 95)"
  s2: "oklch(0.83 0.075 230)"
  s2-ink: "oklch(0.18 0.006 95)"
  s1: "oklch(0.45 0.15 258)"
  s1-ink: "oklch(0.99 0.004 95)"
  success-tint: "oklch(0.95 0.05 150)"
  success-tint-dark: "oklch(0.28 0.05 150)"
  danger: "oklch(0.5 0.2 28)"
  danger-dark: "oklch(0.7 0.17 28)"
  danger-tint: "oklch(0.95 0.04 28)"
  danger-tint-dark: "oklch(0.27 0.06 28)"
typography:
  display:
    fontFamily: "Dela Gothic One, Arial Black, sans-serif"
    fontSize: "clamp(2.75rem, 1.4rem + 6vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Dela Gothic One, Arial Black, sans-serif"
    fontSize: "clamp(2.25rem, 1.5rem + 3.4vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Dela Gothic One, Arial Black, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.15
  numeral:
    fontFamily: "Dela Gothic One, Arial Black, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  item:
    fontFamily: "Zen Kaku Gothic New, Hiragino Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 900
    lineHeight: 1.15
  body:
    fontFamily: "Zen Kaku Gothic New, Hiragino Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
    fontFeature: "tnum"
  meta:
    fontFamily: "Zen Kaku Gothic New, Hiragino Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Zen Kaku Gothic New, Hiragino Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 900
    letterSpacing: "0.08em"
rounded:
  none: "0"
  circle: "50%"
spacing:
  space-1: "0.25rem"
  space-2: "0.5rem"
  space-3: "0.75rem"
  space-4: "1rem"
  space-5: "1.5rem"
  space-6: "2rem"
  space-7: "3rem"
  space-8: "4.5rem"
  gutter: "clamp(1rem, 0.5rem + 2.5vw, 4rem)"
  page: "80rem"
  measure: "66ch"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.yellow}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-primary-dark:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.on-yellow}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  button-danger:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.danger}"
    rounded: "{rounded.none}"
  button-caution:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.on-yellow}"
    rounded: "{rounded.none}"
  button-small:
    padding: "0 0.75rem"
    height: "2.25rem"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 0.75rem"
    height: "2.75rem"
  masthead:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.on-yellow}"
  switcher-current:
    backgroundColor: "{colors.on-yellow}"
    textColor: "{colors.yellow}"
    height: "2.75rem"
  count-badge:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
    padding: "0.25rem 0.75rem"
  section-bar:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.on-yellow}"
    typography: "{typography.title}"
    padding: "0.25rem 1rem"
  bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.yellow}"
    typography: "{typography.label}"
  bar-dark:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.on-yellow}"
    typography: "{typography.label}"
  stamp-s5:
    backgroundColor: "{colors.s5}"
    textColor: "{colors.s5-ink}"
    rounded: "{rounded.circle}"
    size: "6rem"
  stamp-s4:
    backgroundColor: "{colors.s4}"
    textColor: "{colors.s4-ink}"
    rounded: "{rounded.circle}"
    size: "6rem"
  stamp-s3:
    backgroundColor: "{colors.s3}"
    textColor: "{colors.s3-ink}"
    rounded: "{rounded.circle}"
    size: "6rem"
  stamp-s2:
    backgroundColor: "{colors.s2}"
    textColor: "{colors.s2-ink}"
    rounded: "{rounded.circle}"
    size: "6rem"
  stamp-s1:
    backgroundColor: "{colors.s1}"
    textColor: "{colors.s1-ink}"
    rounded: "{rounded.circle}"
    size: "6rem"
  stamp-large:
    rounded: "{rounded.circle}"
    size: "10rem"
  stamp-unscored:
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.circle}"
    size: "4rem"
  message-success:
    backgroundColor: "{colors.success-tint}"
    textColor: "{colors.ink}"
    padding: "0.75rem 1rem"
  message-error:
    backgroundColor: "{colors.danger-tint}"
    textColor: "{colors.ink}"
    padding: "0.75rem 1rem"
  message-warning:
    backgroundColor: "{colors.yellow-tint}"
    textColor: "{colors.ink}"
    padding: "0.75rem 1rem"
---

# Design System: Game Scores

## Overview

**Creative North Star: "Cross Review Weekly"**

The Catalog is this week's chart page of a Japanese weekly game magazine. A newsprint-yellow masthead carries a huge skewed wordmark; below it, on a white reading column, every Game is a row boxed in heavy black rules: rank, cover, name and meta, a cross-review box printing each External Rating raw and adjusted toward 70, and the Score stamped in a circle filled with its step of a heat scale. The Game page opens the same box at full size: the facts in a ruled grid, then the Score Breakdown, where each rating's pull toward 70 is drawn and the sum is worked out and stamped.

The world is loud on purpose and spends its loudness in three places only: yellow (masthead and section titles), skewed Dela Gothic One (wordmark, ranks, Score numerals, section titles), and the heat circles. Everything else is plain Zen Kaku Gothic New on paper, held in place by 3px black rules. There are no shadows, no rounded cards and no gradients. In the dark theme the page turns to near-black and the rules turn to near-white, but the yellow masthead, the yellow section bars and the heat scale stay exactly as printed; only the black title bars invert to yellow.

The admin (`/admin`) is the same world at Operate volume: the compact yellow masthead, the same rules, bars, buttons and tables, with expression turned down to a small Dela h1 and ruled sections titled in heavy Zen Kaku.

**Key Characteristics:**
- Newsprint yellow masthead and section bars; white (or near-black) reading column.
- Every element boxed or separated by 3px rules; 8px heavy rules mark the masthead base and the Breakdown.
- Skewed (-8deg) Dela Gothic One for the wordmark, ranks, stamp numerals and section bars.
- Scores stamped in heat circles, red hot to blue cold, always with the numeral printed.
- Black title bars with yellow text, inverting to yellow with black text in the dark theme.
- Square corners everywhere except circles; flat, no shadows.

## Colors

A two-spot-colour print palette (yellow and red) over paper and ink, plus a five-step heat scale reserved for Scores.

### Primary
- **Newsprint Yellow** (yellow): the masthead band, the skewed section bars ("Ranking", "Score Breakdown"), the selection highlight and the caution button. It stays yellow in both themes, and text on it is always On-Yellow Ink.
- **On-Yellow Ink** (on-yellow) and **On-Yellow Soft** (on-yellow-soft): the wordmark, switcher and rules on yellow; the soft brown-black carries the masthead dek only.

### Secondary
- **Spot Red** (red, red-dark): the count badge, every hover state (links, ranking names, primary buttons), the drawn raw-to-adjusted arrows, the adjusted dot and pull segment, input focus outlines and the text caret. Text on red is On-Red (white in light, near-black in dark).

### Heat Scale
Five fills, each paired with a fixed numeral ink, identical in both themes. Red is hot (best), blue is cold.
- **Hot Red** (s5, white numeral): 90 and above.
- **Orange** (s4, black numeral): 80–89.
- **Yellow** (s3, black numeral): 70–79.
- **Sky** (s2, black numeral): 50–69.
- **Cold Blue** (s1, white numeral): under 50.

The step is chosen from the shown (rounded) Score, so a 79.6 printed as 80 sits on Orange.

### Neutral
- **Paper** (paper, paper-dark): the page ground and the inside of every box.
- **Sunk Paper** (paper-sunk, paper-sunk-dark): row and table-row hover, the Breakdown's sum box, cover placeholders.
- **Ink** (ink, ink-dark): text, the 3px rules, the focus outline, the title bars in light.
- **Soft Ink** (ink-soft, ink-soft-dark): meta, notes, raw ratings, field and fact labels, Unscored stamps and dashed placeholders.
- **Soft Rule** (rule-soft, rule-soft-dark): the only 1px line, used inside a box (review sub-rows, table rows), never to box anything.

### Admin states
- **Success Tint**, **Danger** with **Danger Tint**, and **Yellow Tint** back the Done, Problem and Check messages. Danger also draws the Remove button.

### Named Rules
**The Two Spot Colours Rule.** Yellow and red are the only accents outside the heat scale. Yellow is for owning a band or a title; red is for counts, hover and the pull. Neither is used for decoration.

**The Fixed Heat Rule.** A heat fill and its numeral ink never change with theme, and a heat colour never appears except as a Score step (the yellow masthead and the s3 step share a value, but s3 is only ever a circle).

**The Printed Numeral Rule.** Colour is never the only signal: every stamp prints its Score, every admin message prints its state word, and the heat key prints its ranges.

## Typography

**Display Font:** Dela Gothic One (with Arial Black)
**Body Font:** Zen Kaku Gothic New (with Hiragino Sans, Helvetica Neue, Arial)

**Character:** Dela Gothic One is the magazine's poster lettering, always regular weight, usually skewed -8deg and uppercase for titles; Zen Kaku Gothic New does all reading and every control, and goes to 900 weight for labels and bars. Numbers are tabular site-wide.

### Hierarchy
- **Display** (Dela 400, clamp 2.75–6rem, line-height 0.9, -0.03em, uppercase, skewed): the wordmark on the ranking. The compact masthead uses it at 1.875rem.
- **Headline** (Dela 400, clamp 2.25–4rem, 1.05): the Game page title, unskewed; long names step down to the title size. Not-found headings use it uppercase and skewed.
- **Title** (Dela 400, clamp 2–3rem, uppercase, skewed): section bars on yellow, and the rank numerals (01, 02...) on the ranking.
- **Numeral** (Dela 400): stamp numerals at 42% of the circle, adjusted ratings in the cross-review box (1.875rem), raw and adjusted values in the Breakdown (title size), the exact Score in the sum, admin Score cells.
- **Item** (Zen 900, 1.375rem): Game names on the ranking, admin section titles.
- **Body** (Zen 400, 1.0625rem, line-height 1.7; 1.8 for the description, max 66ch).
- **Meta** (Zen 400–700, 0.9375rem, 1.5): meta lines, notes, raw ratings.
- **Label** (Zen 900, 0.8125rem, 0.04–0.08em, uppercase): field labels, fact and review terms, bar text, table headers, the back link.

### Named Rules
**The Skew Rule.** Skew (skewX -8deg) belongs to Dela Gothic One on the wordmark, ranks, stamp numerals, section bars and the count badge. Reading text, controls and the Game page title are never skewed.

**The Steady Body Rule.** Body text stays 1.0625rem on phones; only display, rank, names and meta step down.

## Layout

A single centred page (max 80rem) with a fluid gutter (1rem to 4rem). Desktop ranking rows are a five-column grid: rank (5rem), cover (6rem), name and meta, cross-review box (up to 25rem), stamp (6rem), with 1.5rem gaps and 1.5rem vertical padding between rules. The Game page hero is cover (16.5rem) beside title, facts and description, with the large stamp at the right.

Spacing follows an eight-step scale from 0.25rem to 4.5rem; sections open with 3–4.5rem, rows breathe at 1.5rem, boxes pad at 0.5–1rem.

Breakpoints are 60rem (ranking drops to four columns, cross-review box moves under the name), 44rem (phones: masthead stacks badge and switcher above the wordmark; filters pair into two rows; the rank leaves its column and becomes a black-bar badge on the cover's top-left corner; the Game page puts title above cover-and-stamp; reviews stack; admin tables become labelled blocks), 24rem and 21rem (display steps down so long Spanish words fit; the facts grid goes single-column).

### Named Rules
**The Corner Badge Rule.** On phones the rank is never dropped: it moves onto the cover's corner as a bar-coloured badge.

## Elevation & Depth

Flat. There are no shadows anywhere; depth is conveyed by rules (3px boxes, 8px heavy rules), by the black or yellow title bars that cap a box, and by Sunk Paper under hovered rows and the sum box.

### Named Rules
**The Ruled Box Rule.** Every element sits inside 3px rules. A heavy 8px rule marks the base of the ranking masthead and the top of the Score Breakdown (6px under the compact masthead). 1px Soft Rules exist only inside a box.

## Shapes

Two shapes only: the square (radius 0 on every box, button, input, bar and cover) and the circle (stamps, heat-key dots, the raw ring and adjusted dot in the pull figure). Section bars and the count badge are skewed parallelograms. Placeholders and Unscored use dashed strokes in Soft Ink; drawn arrows are a single SVG mask filled with red.

## Components

### Buttons
- **Shape:** square (0), min-height 2.75rem (2.25rem small), 3px border in the button's own colour.
- **Primary:** the bar colours, black with yellow text in light, yellow with black text in dark; Zen 900 at 0.9375rem, 0.04em tracking.
- **Hover:** fills Spot Red with On-Red text (140ms, ease-out). Secondary inverts paper and ink; Danger fills Danger; Caution and Quiet fill On-Yellow Ink with yellow text.
- **Variants:** Secondary (paper, ink border), Danger (paper, danger text and border; Remove), Caution (yellow; Sync all), Quiet (transparent on the masthead; Log out).
- **Focus:** 3px ink outline offset 3px; on the masthead the outline is On-Yellow Ink.

### Inputs / Fields
- **Style:** 3px ink border, paper ground, square, 2.75rem tall, body size. Selects carry a drawn two-triangle chevron.
- **Label:** Label style above the control.
- **Focus:** the outline turns Spot Red and sits flush (offset 0).

### Navigation
- **Masthead:** full-width yellow band. Ranking version: display wordmark, dek, switcher top-right, red count badge bottom-right, 8px base rule. Compact version (every other page and admin): 1.875rem wordmark, 6px base rule.
- **Language switcher:** a 3px-ruled two-cell control on yellow; the current language is inverted (On-Yellow Ink with yellow text), the other hovers to Yellow Tint.
- **Back link:** Label style with a drawn left arrow, 2.75rem target.

### Score Stamp (signature)
A circle with a 3px ink ring (4px at large) filled with its heat step and the rounded Score in skewed Dela at 42% of the diameter. Sizes: 6rem on the ranking (5.5rem below 60rem, 4.75rem on phones), 10rem on the Game page (8.5rem on phones), and the same small stamp closes the Breakdown's sum. The Game page stamp is headed by a small "Score" bar.
- **Unscored, small:** a dashed Soft Ink ring around an em dash, with the word "Unscored" captioned beneath, so a translation never crosses the ring. The rank column shows a dash, and the row takes no rank number.
- **Unscored, large:** the dashed ring with the word inside.

### Cross-Review Box (signature)
A 3px-ruled two-column box, one column per External Rating (Critic, Users). Each column is capped by a bar (label, review count right-aligned) and prints the raw rating in Soft Ink, a red drawn arrow, then the adjusted value in Dela. A missing rating prints a dash. Both columns share a subgrid header row so their numbers stay level.

### Heat Key
A row of 1rem circles (2px ink ring, step fill) each followed by its printed range: 90+, 80–89, 70–79, 50–69, <50.

### Score Breakdown
Opens under an 8px rule with a yellow skewed section bar, an intro at 66ch and a key (ring = Rating, red dot = Adjusted, tick = 70). Below, a ruled grid of review boxes, each capped by a bar: raw and adjusted in large Dela, reviews and share of Score under a Soft Rule, then the pull figure. The figure carries marks only: the axis, the raw ring, the red adjusted dot and segment, the 70 tick, and small axis-end and 70 labels; the rating values themselves are printed in the box above, never on the figure, so nothing collides. With motion allowed, the dot slides from raw to adjusted and the segment grows over 900ms. The sum box (Sunk Paper, joined to the grid) prints the working and stamps the Score.

### Facts Grid
A 3px-ruled two-by-two grid of Label terms over 700-weight values (one column below 21rem).

### Messages (admin)
A 3px-ruled block whose state word is printed in a bar before the text: **Done** on Success Tint, **Problem** (Danger bar, Danger border) on Danger Tint, **Check** on Yellow Tint.

### Data Table (admin)
3px-ruled, bar-coloured header row in Label style, 1px Soft Rule between rows, Sunk Paper on hover, Score cells in Dela. On phones each row becomes a block with its column labels printed inline.

## Do's and Don'ts

### Do:
- **Do** box every element in 3px ink rules and use the 8px heavy rule only under the ranking masthead and above the Score Breakdown.
- **Do** print the numeral in every Score stamp and choose its fill from the rounded Score: s5 90+, s4 80–89, s3 70–79, s2 50–69, s1 under 50.
- **Do** keep the heat fills, their numeral inks, the masthead yellow and text-on-yellow identical in both themes; invert only the bars (black with yellow text in light, yellow with black text in dark).
- **Do** skew (-8deg) Dela Gothic One on the wordmark, ranks, stamp numerals and section bars.
- **Do** show Unscored as a dashed empty circle with the word, and give it no rank number.
- **Do** print the state word (Done, Problem, Check) on every admin message.
- **Do** keep every text pair at 4.5:1 or better in both themes (the shipped build measures 5.18:1 or better).

### Don't:
- **Don't** show an Unscored Game as zero, or let colour alone carry a Score or a state.
- **Don't** add shadows, rounded corners, gradients or a second accent colour.
- **Don't** print rating values on the pull figure; they belong in the box above it.
- **Don't** use the heat colours for anything but Score steps.
- **Don't** shrink body text on phones.
- **Don't** skew reading text, controls or the Game page title.
