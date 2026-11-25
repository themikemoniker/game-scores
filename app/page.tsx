import Link from "next/link";
import { getCatalog } from "../lib/catalog-cache";

export const revalidate = 600;

type Params = Record<string, string | string[] | undefined>;
const first = (v: Params[string]) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function Home({ searchParams }: { searchParams: Promise<Params> }) {
  const p = await searchParams;
  const query = { search: first(p.search), platform: first(p.platform), genre: first(p.genre) };
  const filtered = Boolean(query.search.trim() || query.platform || query.genre);
  const [{ games }, { games: all }] = await Promise.all([getCatalog(query), getCatalog()]);
  const options = (pick: (g: (typeof all)[number]) => string[]) =>
    [...new Set(all.flatMap(pick))].sort((a, b) => a.localeCompare(b));

  return (
    <main>
      <h1>Game Scores</h1>
      {all.length > 0 && (
        <form className="filters" role="search">
          <label>
            Search <input type="search" name="search" defaultValue={query.search} />
          </label>
          <label>
            Platform{" "}
            <select name="platform" defaultValue={query.platform}>
              <option value="">All</option>
              {options((g) => g.platforms).map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label>
            Genre{" "}
            <select name="genre" defaultValue={query.genre}>
              <option value="">All</option>
              {options((g) => g.genres).map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <button type="submit">Filter</button>
          {filtered && <Link href="/">Clear</Link>}
        </form>
      )}
      {all.length === 0 && <p>The Catalog is empty.</p>}
      {all.length > 0 && games.length === 0 && (
        <p>
          No Games match your search and filters. <Link href="/">Clear them</Link> to see the whole ranking.
        </p>
      )}
      <ol className="ranking">
        {games.map((game) => (
          <li key={game.slug}>
            {game.coverUrl ? (
              <img src={game.coverUrl} alt={`${game.name} cover`} width={90} height={120} loading="lazy" />
            ) : (
              <div className="cover-placeholder" role="img" aria-label={`${game.name}: no cover`} />
            )}
            <div>
              <h2>
                <Link href={`/games/${game.slug}`}>{game.name}</Link>
              </h2>
              <p>
                {game.releaseDate?.slice(0, 4) ?? "Release date unknown"}
                {game.platforms.length > 0 && ` · ${game.platforms.join(", ")}`}
              </p>
            </div>
            <p className="score">{game.score === null ? "Unscored" : Math.round(game.score)}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
