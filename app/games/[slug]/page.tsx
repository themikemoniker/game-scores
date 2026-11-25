import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "../../../lib/catalog-cache";

export const revalidate = 600;

const LABELS = { critic: "Critic rating", user: "User rating" };
const num = (n: number) => n.toLocaleString("en", { maximumFractionDigits: 1 });
const utc = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleString("en", { ...opts, timeZone: "UTC" });

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const {
    games: [game],
  } = await getCatalog({ slug });
  if (!game) notFound();

  const { breakdown } = game;
  // With a single External Rating, the other kind is the missing one.
  const missing = breakdown?.ratings[0].kind === "critic" ? "user" : "critic";

  return (
    <main className="game">
      <p>
        <Link href="/">← Ranking</Link>
      </p>
      <h1>{game.name}</h1>
      <div className="game-info">
        {game.coverUrl ? (
          <img src={game.coverUrl} alt={`${game.name} cover`} width={180} height={240} />
        ) : (
          <div className="cover-placeholder" role="img" aria-label={`${game.name}: no cover`} />
        )}
        <dl>
          <dt>Released</dt>
          <dd>{game.releaseDate ? utc(game.releaseDate, { dateStyle: "long" }) : "Unknown"}</dd>
          <dt>Platforms</dt>
          <dd>{game.platforms.join(", ") || "Unknown"}</dd>
          <dt>Genres</dt>
          <dd>{game.genres.join(", ") || "None listed"}</dd>
          <dt>Developer</dt>
          <dd>{game.developer || "Unknown"}</dd>
        </dl>
      </div>
      {game.description && <p className="description">{game.description}</p>}

      <h2>Score</h2>
      {game.score === null || !breakdown ? (
        <>
          <p className="score">Unscored</p>
          <p>This Game has no External Ratings yet, so it has no Score.</p>
        </>
      ) : (
        <>
          <p className="score">{Math.round(game.score)}</p>
          <h3>Score Breakdown</h3>
          <p>
            Each External Rating is pulled toward 70, more strongly the fewer reviews it rests on. The
            adjusted ratings are then blended into the Score.
          </p>
          <table>
            <thead>
              <tr>
                <th>External Rating</th>
                <th>Rating</th>
                <th>Reviews</th>
                <th>Adjusted</th>
                <th>Share of Score</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.ratings.map((r) => (
                <tr key={r.kind}>
                  <th scope="row">{LABELS[r.kind]}</th>
                  <td>{num(r.rating)}</td>
                  <td>{r.count.toLocaleString("en")}</td>
                  <td>{num(r.adjusted)}</td>
                  <td>{Math.round(r.share * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {breakdown.singleRating && (
            <p className="note">
              Only one External Rating was used: there is no {LABELS[missing].toLowerCase()} yet, so the Score
              rests on less data.
            </p>
          )}
        </>
      )}

      <p className="synced">
        Last synced:{" "}
        {game.lastSynced ? `${utc(game.lastSynced, { dateStyle: "medium", timeStyle: "short" })} UTC` : "never"}
      </p>
    </main>
  );
}
