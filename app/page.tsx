import Link from "next/link";
import { getCatalog } from "../lib/catalog-cache";

export const revalidate = 600;

export default async function Home() {
  const { games } = await getCatalog();
  return (
    <main>
      <h1>Game Scores</h1>
      {games.length === 0 && <p>The Catalog is empty.</p>}
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
