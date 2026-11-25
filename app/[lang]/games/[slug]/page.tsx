import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "../../../../lib/catalog-cache";
import { dictionary, genreName, hasLocale } from "../../../../lib/i18n";
import { Cover } from "../../cover";
import { BackArrow, Masthead } from "../../masthead";
import { ScoreMeter, scoreStep } from "../../score-meter";

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
  // The Breakdown's figures always show one decimal, so the working reads as a sum.
  const fixed = (n: number) => n.toLocaleString(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const pct = (share: number) => `${Math.round(share * 100)}%`;
  const utc = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(iso).toLocaleString(lang, { ...opts, timeZone: "UTC" });

  const { breakdown } = game;
  // With a single External Rating, the other kind is the missing one.
  const missing = breakdown?.ratings[0].kind === "critic" ? "user" : "critic";
  // The pull figures share one axis, zoomed to the ratings and the baseline so a few points of pull stay visible.
  const values = [70, ...(breakdown?.ratings.flatMap((r) => [r.rating, r.adjusted]) ?? [])];
  const axis = {
    lo: Math.max(0, Math.floor((Math.min(...values) - 4) / 10) * 10),
    hi: Math.min(100, Math.ceil((Math.max(...values) + 4) / 10) * 10),
  };

  return (
    <>
      <Masthead lang={lang} rest={`/games/${slug}`} />
      <main className="page game">
        <p className="back">
          <Link href={`/${lang}`}>
            <BackArrow />
            {t.backToRanking}
          </Link>
        </p>
        <article className="game-hero">
          <h1 className={game.name.length > 40 ? "long" : undefined}>{game.name}</h1>
          <Cover url={game.coverUrl} name={game.name} t={t} large />
          <section className="score-plate" aria-labelledby="score-heading">
            <h2 id="score-heading">{t.score}</h2>
            <ScoreMeter score={game.score} unscored={t.unscored} size="lg" />
            {(game.score === null || !breakdown) && <p className="unscored-explain">{t.unscoredExplain}</p>}
          </section>
          <dl className="facts">
            <div>
              <dt>{t.released}</dt>
              <dd>{game.releaseDate ? utc(game.releaseDate, { dateStyle: "long" }) : t.unknown}</dd>
            </div>
            <div>
              <dt>{t.developer}</dt>
              <dd>{game.developer || t.unknown}</dd>
            </div>
            <div>
              <dt>{t.platforms}</dt>
              <dd>{game.platforms.join(", ") || t.unknown}</dd>
            </div>
            <div>
              <dt>{t.genres}</dt>
              <dd>{game.genres.map((g) => genreName(lang, g)).join(", ") || t.noGenres}</dd>
            </div>
          </dl>
          {game.description && (
            <p className="description">
              {t.inEnglish && <span className="note">{t.inEnglish} </span>}
              <span lang="en">{game.description}</span>
            </p>
          )}
        </article>

        {game.score !== null && breakdown && (
          <section className="breakdown" aria-labelledby="breakdown-heading">
            <div className="breakdown-inner">
              <h2 id="breakdown-heading">{t.scoreBreakdown}</h2>
              <p className="breakdown-intro">{t.breakdownIntro}</p>
              <p className="pull-key" aria-hidden="true">
                <span className="key key-raw" />
                {t.rating}
                <span className="key key-adj" />
                {t.adjusted}
                <span className="key key-base" />
                70
              </p>
              <table>
                <thead>
                  <tr>
                    <th scope="col">{t.externalRating}</th>
                    <th scope="col">{t.rating}</th>
                    <th scope="col">{t.reviews}</th>
                    <th scope="col">{t.adjusted}</th>
                    <th scope="col">{t.shareOfScore}</th>
                  </tr>
                </thead>
                {breakdown.ratings.map((r) => (
                  <tbody key={r.kind}>
                    <tr>
                      <th scope="row">{t.ratingLabels[r.kind]}</th>
                      <td data-label={t.rating}>{num(r.rating)}</td>
                      <td data-label={t.reviews}>{num(r.count, 0)}</td>
                      <td data-label={t.adjusted} className="adjusted">
                        {fixed(r.adjusted)}
                      </td>
                      <td data-label={t.shareOfScore}>{pct(r.share)}</td>
                    </tr>
                    <tr className="pull" aria-hidden="true">
                      <td colSpan={5}>
                        <PullFigure
                          rating={r.rating}
                          adjusted={r.adjusted}
                          axis={axis}
                          labels={[num(r.rating), fixed(r.adjusted)]}
                        />
                      </td>
                    </tr>
                  </tbody>
                ))}
                <tfoot>
                  <tr>
                    <th scope="row">{t.score}</th>
                    <td colSpan={2} className="working">
                      {breakdown.ratings.map((r) => `${fixed(r.adjusted)} × ${pct(r.share)}`).join(" + ")} =
                    </td>
                    <td data-label={t.score} className={`total s${scoreStep(game.score)}`}>
                      {fixed(game.score)} → <span className="rounded">{Math.round(game.score)}</span>
                    </td>
                    <td className="total-share">100%</td>
                  </tr>
                </tfoot>
              </table>
              {breakdown.singleRating && (
                <p className="note single">{t.singleRating(t.ratingLabels[missing].toLowerCase())}</p>
              )}
            </div>
          </section>
        )}

        <p className="synced">
          {t.lastSynced}{" "}
          {game.lastSynced ? `${utc(game.lastSynced, { dateStyle: "medium", timeStyle: "short" })} UTC` : t.never}
        </p>
      </main>
    </>
  );
}

// One External Rating on the shared axis: the raw rating (ring, value above), the baseline of 70
// (tick), and the adjusted rating (dot, value below) it was pulled to. Decoration only; the table row
// above carries the same numbers for assistive technology.
function PullFigure({
  rating,
  adjusted,
  axis,
  labels,
}: {
  rating: number;
  adjusted: number;
  axis: { lo: number; hi: number };
  labels: [string, string];
}) {
  const at = (v: number) => ((v - axis.lo) / (axis.hi - axis.lo)) * 100;
  const style = {
    "--raw": at(rating),
    "--adj": at(adjusted),
    "--base": at(70),
    "--from": at(Math.min(rating, adjusted)),
    "--span": Math.abs(at(rating) - at(adjusted)),
  } as React.CSSProperties;
  return (
    <div className={`pull-figure${adjusted < rating ? " leftward" : ""}`} style={style}>
      <span className="track" />
      <span className="baseline" />
      <span className="segment" />
      <span className="raw">
        <span>{labels[0]}</span>
      </span>
      <span className="adj">
        <span>{labels[1]}</span>
      </span>
      <span className="ends">
        <span>{axis.lo}</span>
        <span>{axis.hi}</span>
      </span>
    </div>
  );
}
