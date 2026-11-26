// Catalog read: raw Sheet rows in, visible Games (with Score) and invalid rows out.

// Score formula constants (see spec: Score formula).
const BASELINE = 70;
const WEIGHTS = { critic: 10, user: 100 };
const BLEND = { critic: 0.5, user: 0.5 };

// The `Games` tab's header row, in order.
export const COLUMNS = [
  "igdb_id",
  "slug",
  "name",
  "cover_url",
  "release_date",
  "platforms",
  "genres",
  "developer",
  "description",
  "critic_rating",
  "critic_count",
  "user_rating",
  "user_count",
  "last_synced",
  "tags",
] as const;

// The owner's Tags, in the order the Quiz offers them. Names live in the i18n dictionaries.
export const TAGS = [
  "roguelike",
  "metroidvania",
  "2d-platformer",
  "3d-platformer",
  "open-world",
  "cozy",
  "story-rich",
  "deckbuilder",
  "shooter",
  "puzzle",
] as const;
export type Tag = (typeof TAGS)[number];
export const isTag = (s: string): s is Tag => (TAGS as readonly string[]).includes(s);

type RatingKind = keyof typeof WEIGHTS;
export type Cells = Record<(typeof COLUMNS)[number], string>;

// `slug` looks up a single Game (the Game page); the rest filter the ranking.
export type CatalogQuery = { search?: string; platform?: string; genre?: string; slug?: string };

function adjust(kind: RatingKind, ratingCell: string, countCell: string) {
  if (!ratingCell || !countCell) return null;
  const rating = Number(ratingCell);
  const count = Number(countCell);
  if (count === 0) return null;
  const adjusted = (count * rating + WEIGHTS[kind] * BASELINE) / (count + WEIGHTS[kind]);
  return { kind, rating, count, adjusted };
}

function score(c: Cells) {
  const present = [
    adjust("critic", c.critic_rating, c.critic_count),
    adjust("user", c.user_rating, c.user_count),
  ].filter((a) => a !== null);
  if (present.length === 0) return { score: null, breakdown: null };
  const totalBlend = present.reduce((sum, a) => sum + BLEND[a.kind], 0);
  const ratings = present.map((a) => ({ ...a, share: BLEND[a.kind] / totalBlend }));
  const total = ratings.reduce((sum, a) => sum + a.adjusted * a.share, 0);
  return { score: total, breakdown: { ratings, singleRating: ratings.length === 1 } };
}

const list = (cell: string) =>
  cell
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

function parse(c: Cells) {
  return {
    igdbId: Number(c.igdb_id),
    slug: c.slug,
    name: c.name,
    coverUrl: c.cover_url || null,
    releaseDate: c.release_date || null,
    platforms: list(c.platforms),
    genres: list(c.genres),
    developer: c.developer,
    description: c.description,
    lastSynced: c.last_synced || null,
    tags: list(c.tags).filter(isTag),
    ...score(c),
  };
}

export type Game = ReturnType<typeof parse>;

function byRank(a: Game, b: Game) {
  if (a.score !== b.score) {
    if (a.score === null) return 1;
    if (b.score === null) return -1;
    return b.score - a.score;
  }
  return a.name.localeCompare(b.name);
}

const WHOLE = /^\d+$/;
const RATING = /^\d+(\.\d+)?$/;

function isIsoDate(s: string) {
  const d = new Date(s);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(d.getTime()) && d.toISOString().startsWith(s);
}

// Returns why a row is invalid, or null if it's fine.
function problem(c: Cells): string | null {
  if (!WHOLE.test(c.igdb_id) || Number(c.igdb_id) === 0)
    return `igdb_id is not a positive whole number: "${c.igdb_id}"`;
  if (!c.slug) return "slug is missing";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.slug)) return `slug is not lowercase kebab-case: "${c.slug}"`;
  if (!c.name) return "name is missing";
  if (c.cover_url && !c.cover_url.startsWith("https://"))
    return `cover_url is not an https URL: "${c.cover_url}"`;
  if (c.last_synced && !(/^\d{4}-\d{2}-\d{2}T/.test(c.last_synced) && !isNaN(Date.parse(c.last_synced))))
    return `last_synced is not an ISO datetime: "${c.last_synced}"`;
  if (c.release_date && !isIsoDate(c.release_date))
    return `release_date is not a YYYY-MM-DD date: "${c.release_date}"`;
  for (const col of ["critic_rating", "user_rating"] as const) {
    if (c[col] && !(RATING.test(c[col]) && Number(c[col]) <= 100))
      return `${col} is not a number from 0 to 100: "${c[col]}"`;
  }
  for (const col of ["critic_count", "user_count"] as const) {
    if (c[col] && !WHOLE.test(c[col])) return `${col} is not a whole number of 0 or more: "${c[col]}"`;
  }
  return null;
}

export type InvalidRow = { row: number; reason: string };

// `rows` are the data rows of the `Games` tab, starting at Sheet row 2.
export function readCatalog(rows: string[][], query: CatalogQuery = {}) {
  const games: Game[] = [];
  const invalidRows: InvalidRow[] = [];
  // Unknown Tags are dropped, not fatal: the Game stays visible and the owner sees the typo.
  const unknownTags: InvalidRow[] = [];
  const slugs = new Set<string>();
  const ids = new Set<string>();
  rows.forEach((r, i) => {
    if (r.every((cell) => !cell.trim())) return;
    const c = Object.fromEntries(COLUMNS.map((col, j) => [col, (r[j] ?? "").trim()])) as Cells;
    const reason =
      problem(c) ??
      (slugs.has(c.slug) ? `duplicate slug: "${c.slug}"` : null) ??
      (ids.has(c.igdb_id) ? `duplicate igdb_id: "${c.igdb_id}"` : null);
    if (reason) return invalidRows.push({ row: i + 2, reason });
    slugs.add(c.slug);
    ids.add(c.igdb_id);
    for (const tag of list(c.tags).filter((t) => !isTag(t)))
      unknownTags.push({ row: i + 2, reason: `unknown Tag "${tag}" on ${c.name}, left out` });
    games.push(parse(c));
  });
  const search = query.search?.trim().toLowerCase();
  const visible = games.filter(
    (g) =>
      (!query.slug || g.slug === query.slug) &&
      (!search || g.name.toLowerCase().includes(search)) &&
      (!query.platform || g.platforms.includes(query.platform)) &&
      (!query.genre || g.genres.includes(query.genre)),
  );
  return { games: visible.sort(byRank), invalidRows, unknownTags };
}
