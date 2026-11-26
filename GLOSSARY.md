# Game Scores

A site that shows information about a curated set of video games and gives each one its own computed score.

## Catalog

**Game**:
A single published work, regardless of how many platforms it shipped on. A remaster or remake is a separate Game.
_Avoid_: Title, release, entry

**Platform**:
A system a Game is playable on (PC, PS5, Switch…). A Game has one or more Platforms.
_Avoid_: System, console

**Genre**:
A category of gameplay a Game belongs to (RPG, Shooter…). A Game has zero or more Genres.
_Avoid_: Category, tag

**Catalog**:
The set of Games the site knows about, chosen by hand by the site owner.
_Avoid_: Library, database, collection

**Source**:
An outside provider of Game information and External Ratings. There is one Source today (IGDB).
_Avoid_: Provider, API, feed

**Import**:
Adding a Game from the Source to the Catalog for the first time.
_Avoid_: Add, create

**Sync**:
Replacing a Game's stored information and External Ratings with the latest from its Source. Each Game records when it was last synced.
_Avoid_: Refresh, update, import (import is adding a new Game to the Catalog)

**Tag**:
An owner-written label of how a Game plays (roguelike, cozy…), from a fixed list. Unlike Genres, Tags come from the site owner, not the Source.
_Avoid_: Label, keyword, vibe

**Platform family**:
A group of related Platforms (PC, PlayStation, Xbox, Nintendo, Mobile) used by the Quiz.
_Avoid_: Ecosystem, brand

## Recommending

**Quiz**:
A visitor's answers about where they play, which Tags they feel like and classic or modern.
_Avoid_: Survey, form, questionnaire

**Match**:
A Game that fits a Quiz, shown with why it matched.
_Avoid_: Recommendation (fine in prose, not in the UI), suggestion, result

## Scoring

**External Rating**:
A rating of a Game published by an outside source, such as a critic aggregate or a user-review average.
_Avoid_: Review score, metascore (unless naming that specific source)

**Score**:
The site's own rating of a Game, computed by a formula from External Ratings and other Game data, never entered by hand.
_Avoid_: Rating, grade, custom score

**Confidence Adjustment**:
Pulling an External Rating toward a fixed baseline, more strongly the fewer reviews it rests on, so a rating backed by few reviews can't dominate.
_Avoid_: Bayesian average (fine in code, not in the UI), normalization

**Unscored**:
A Game with no External Ratings at all, and therefore no Score. It is listed after scored Games.
_Avoid_: Unrated, N/A, zero

**Score Breakdown**:
How much each input contributed to a Game's Score, shown so a reader can see why the Game got that number.
_Avoid_: Explanation, details
