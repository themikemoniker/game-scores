# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: people evaluating the owner's work.** Game Scores is a portfolio piece, shown to
  recruiters and peers as a learning project. They arrive by shared link, look around for a few
  minutes, and judge the craft and how clearly the site explains its Score.
- **Visitors browsing the Catalog:** they want the best Games at a glance, filtered to their
  Platform or Genre, and the reason behind each Score. They read in English or Spanish.
- **The site owner (one person):** manages the Catalog from `/admin`: searches the Source,
  Imports, Syncs, Removes, and fixes invalid Sheet rows.

## Product Purpose

A hand-picked Catalog of Games, ranked by the site's own Score. External Ratings are scattered,
ignore how few reviews they rest on, and never explain themselves. Game Scores gives one number
per Game that the owner designed and that shows why it is what it is. Success means a visitor
trusts the Score because they can see the Score Breakdown, and a reviewer of the portfolio sees
a small product built with care.

## Positioning

The Score is explainable by construction. Each External Rating gets a Confidence Adjustment
toward a fixed baseline of 70 (weight 10 for critics, 100 for users), then the critic and user
ratings blend 50/50. Every Game page shows the raw ratings, their review counts, the adjusted
values and each one's share. Aggregators show a number; this site shows the working.

## Operating Context

- Public site is read-only. Routes carry a locale prefix (`/en`, `/es`); a bare visit redirects
  by browser language. A switcher on every page keeps the visitor on the same page.
- Ranking page: search by name plus Platform and Genre filters, all reflected in the URL.
- Game page: cover, release date, Platforms, Genres, developer, description, External Ratings
  with counts, Score, Score Breakdown, last synced.
- Admin (`/admin`, English only, no locale prefix): password login with a 30-day session,
  Source search, Import (with slug-collision prompt), Sync one, Sync all, Remove, invalid-row list.
- The owner can also edit the Google Sheet by hand; edits appear within 10 minutes.

## Capabilities and Constraints

- Next.js App Router, TypeScript, deployed on Vercel's free tier. Plain CSS in `app/globals.css`.
- A Google Sheet is the database (ADR 0001). IGDB is the only Source, called from the server.
- Catalog size: under 50 Games. A tight, hand-picked shortlist, not a large database.
- Covers are hotlinked from IGDB's image CDN and may be missing (a placeholder is shown).
- Unscored Games (no External Ratings) are listed after scored ones and never shown as zero.
- The Score is shown rounded to a whole number and is never stored.
- Spanish: interface text, Score Breakdown wording and Genre names are translated; Platform names
  are not; descriptions stay in English with an "(in English)" label.
- Vocabulary follows `GLOSSARY.md` (Game, Catalog, Platform, Genre, Source, Import, Sync,
  External Rating, Score, Confidence Adjustment, Unscored, Score Breakdown).
- Out of scope: user accounts, voting, other Sources, screenshots, trailers, prices, Score history.

## Brand Commitments

- The name is **Game Scores**, final. No logo or wordmark exists yet.
- Interface copy uses the glossary terms and avoids their listed alternatives ("Unrated", "N/A",
  "metascore", "Bayesian average").

## Evidence on Hand

- Real Catalog data in the Google Sheet (names, covers, dates, Platforms, Genres, developers,
  descriptions, critic and user ratings with counts).
- The spec (`.scratch/game-scores/spec.md`) and the Score formula in `lib/catalog.ts`.
- No testimonials, press, user counts or screenshots exist. Do not invent any.

## Product Principles

1. **Show the working.** The Score is only worth something next to its Breakdown.
2. **Absence is not zero.** Missing ratings, covers and translations are labeled honestly.
3. **Simple and explainable beats clever.** It's a learning project; every choice should be
   easy to read in the code and on the page.
4. **Small and hand-picked.** Treat each of the few Games as worth attention, not as rows.
