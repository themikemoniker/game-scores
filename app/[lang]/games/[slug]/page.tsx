import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "../../../../lib/catalog-cache";
import { dictionary, genreName, hasLocale } from "../../../../lib/i18n";
import { Switcher } from "../../switcher";

export const revalidate = 600;

export default async function GamePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const {
    games: [game],
  } = await getCatalog({ slug });
  if (!game) notFound();

  const t = dictionary(lang);
  const num = (n: number, digits = 1) => n.toLocaleString(lang, { maximumFractionDigits: digits });
  const utc = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(iso).toLocaleString(lang, { ...opts, timeZone: "UTC" });

  const { breakdown } = game;
  // With a single External Rating, the other kind is the missing one.
  const missing = breakdown?.ratings[0].kind === "critic" ? "user" : "critic";

  return (
    <main className="game">
      <Switcher lang={lang} rest={`/games/${slug}`} />
      <p>
        <Link href={`/${lang}`}>{t.backToRanking}</Link>
      </p>
      <h1>{game.name}</h1>
      <div className="game-info">
        {game.coverUrl ? (
          <img src={game.coverUrl} alt={t.cover(game.name)} width={180} height={240} />
        ) : (
          <div className="cover-placeholder" role="img" aria-label={t.noCover(game.name)} />
        )}
        <dl>
          <dt>{t.released}</dt>
          <dd>{game.releaseDate ? utc(game.releaseDate, { dateStyle: "long" }) : t.unknown}</dd>
          <dt>{t.platforms}</dt>
          <dd>{game.platforms.join(", ") || t.unknown}</dd>
          <dt>{t.genres}</dt>
          <dd>{game.genres.map((g) => genreName(lang, g)).join(", ") || t.noGenres}</dd>
          <dt>{t.developer}</dt>
          <dd>{game.developer || t.unknown}</dd>
        </dl>
      </div>
      {game.description && (
        <p className="description">
          {t.inEnglish && <span className="note">{t.inEnglish} </span>}
          <span lang="en">{game.description}</span>
        </p>
      )}

      <h2>{t.score}</h2>
      {game.score === null || !breakdown ? (
        <>
          <p className="score">{t.unscored}</p>
          <p>{t.unscoredExplain}</p>
        </>
      ) : (
        <>
          <p className="score">{Math.round(game.score)}</p>
          <h3>{t.scoreBreakdown}</h3>
          <p>{t.breakdownIntro}</p>
          <table>
            <thead>
              <tr>
                <th>{t.externalRating}</th>
                <th>{t.rating}</th>
                <th>{t.reviews}</th>
                <th>{t.adjusted}</th>
                <th>{t.shareOfScore}</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.ratings.map((r) => (
                <tr key={r.kind}>
                  <th scope="row">{t.ratingLabels[r.kind]}</th>
                  <td>{num(r.rating)}</td>
                  <td>{num(r.count, 0)}</td>
                  <td>{num(r.adjusted)}</td>
                  <td>{Math.round(r.share * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {breakdown.singleRating && (
            <p className="note">{t.singleRating(t.ratingLabels[missing].toLowerCase())}</p>
          )}
        </>
      )}

      <p className="synced">
        {t.lastSynced}{" "}
        {game.lastSynced ? `${utc(game.lastSynced, { dateStyle: "medium", timeStyle: "short" })} UTC` : t.never}
      </p>
    </main>
  );
}
