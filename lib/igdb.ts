import "server-only";
import { COLUMNS, type Cells } from "./catalog";

// Source client (IGDB): server only, so the Twitch credentials never reach the browser.

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

// App access token from Twitch client credentials, cached until a minute before it expires.
let token: { value: string; expiresAt: number } | undefined;

async function accessToken() {
  if (token && token.expiresAt > Date.now()) return token.value;
  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: env("IGDB_CLIENT_ID"),
      client_secret: env("IGDB_CLIENT_SECRET"),
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Twitch token request failed: ${res.status} ${await res.text()}`);
  const data: { access_token: string; expires_in: number } = await res.json();
  token = { value: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return token.value;
}

async function igdb<T>(endpoint: string, query: string): Promise<T> {
  const res = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
    method: "POST",
    headers: { "Client-ID": env("IGDB_CLIENT_ID"), Authorization: `Bearer ${await accessToken()}` },
    body: query,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`IGDB ${endpoint} request failed: ${res.status} ${await res.text()}`);
  return res.json();
}

type Named = { name: string };

type IgdbGame = {
  id: number;
  name: string;
  first_release_date?: number; // unix seconds
  platforms?: Named[];
  genres?: Named[];
  involved_companies?: { developer: boolean; company: Named }[];
  summary?: string;
  cover?: { image_id: string };
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  rating?: number;
  rating_count?: number;
};

const releaseDate = (seconds?: number) =>
  seconds === undefined ? "" : new Date(seconds * 1000).toISOString().slice(0, 10);

const names = (list?: Named[]) => (list ?? []).map((x) => x.name).join(", ");

const num = (n?: number) => (n === undefined ? "" : String(n));

// Name plus release year in lowercase kebab-case ("The Witcher 3" 2015 → "the-witcher-3-2015").
export function defaultSlug(name: string, date: string) {
  return [name, date.slice(0, 4)]
    .join(" ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// IGDB game → `Games` tab row, in COLUMNS order. last_synced is now.
function toRow(g: IgdbGame): string[] {
  const date = releaseDate(g.first_release_date);
  const cells: Cells = {
    igdb_id: String(g.id),
    slug: defaultSlug(g.name, date),
    name: g.name,
    cover_url: g.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${g.cover.image_id}.jpg` : "",
    release_date: date,
    platforms: names(g.platforms),
    genres: names(g.genres),
    developer: names(g.involved_companies?.filter((c) => c.developer).map((c) => c.company)),
    description: g.summary ?? "",
    critic_rating: num(g.aggregated_rating),
    critic_count: num(g.aggregated_rating_count),
    user_rating: num(g.rating),
    user_count: num(g.rating_count),
    last_synced: new Date().toISOString(),
  };
  return COLUMNS.map((col) => cells[col]);
}

export type Candidate = { igdbId: number; name: string; year: string | null; platforms: string[] };

// Apicalypse strings are double-quoted; drop characters that would break out of them.
const quoted = (s: string) => `"${s.replace(/["\\]/g, " ")}"`;

export async function searchGames(name: string): Promise<Candidate[]> {
  const games = await igdb<IgdbGame[]>(
    "games",
    `search ${quoted(name)}; fields name,first_release_date,platforms.name; limit 20;`,
  );
  return games.map((g) => ({
    igdbId: g.id,
    name: g.name,
    year: releaseDate(g.first_release_date).slice(0, 4) || null,
    platforms: (g.platforms ?? []).map((p) => p.name),
  }));
}

const FULL_FIELDS = [
  "name",
  "first_release_date",
  "platforms.name",
  "genres.name",
  "involved_companies.developer",
  "involved_companies.company.name",
  "summary",
  "cover.image_id",
  "aggregated_rating",
  "aggregated_rating_count",
  "rating",
  "rating_count",
].join(",");

// Full data for many Games, 500 IDs per query (IGDB's max), keyed by IGDB ID. IDs IGDB no longer
// returns are missing from the map.
export async function fetchGameRows(ids: number[]): Promise<Map<number, string[]>> {
  const rows = new Map<number, string[]>();
  for (let i = 0; i < ids.length; i += 500) {
    const batch = ids.slice(i, i + 500);
    const games = await igdb<IgdbGame[]>(
      "games",
      `fields ${FULL_FIELDS}; where id = (${batch.join(",")}); limit 500;`,
    );
    for (const g of games) rows.set(g.id, toRow(g));
  }
  return rows;
}
