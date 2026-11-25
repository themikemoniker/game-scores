import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "../../lib/catalog-cache";
import { dictionary, genreName, hasLocale } from "../../lib/i18n";
import { Cover } from "./cover";
import { Masthead } from "./masthead";
import { CrossReview, ScoreStamp, STEPS } from "./score-meter";

type Params = Record<string, string | string[] | undefined>;
const first = (v: Params[string]) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Params>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = dictionary(lang);
  const p = await searchParams;
  const query = { search: first(p.search), platform: first(p.platform), genre: first(p.genre) };
  const filtered = Boolean(query.search.trim() || query.platform || query.genre);
  const [{ games }, { games: all }] = await Promise.all([getCatalog(query), getCatalog()]);

  const unique = (values: string[]) => [...new Set(values)];
  const platforms = unique(all.flatMap((g) => g.platforms)).sort((a, b) => a.localeCompare(b, lang));
  // Genre values stay the Source names, so a filtered URL works in both languages; only the label is translated.
  const genres = unique(all.flatMap((g) => g.genres))
    .map((value) => ({ value, label: genreName(lang, value) }))
    .sort((a, b) => a.label.localeCompare(b.label, lang));
  const queryString = new URLSearchParams(Object.entries(query).filter(([, v]) => v)).toString();

  return (
    <>
      <Masthead lang={lang} rest={queryString && `?${queryString}`}>
        <div className="masthead-title">
          <h1 className="wordmark">Game Scores</h1>
          <p className="dek">{t.siteDescription}</p>
        </div>
        {all.length > 0 && <p className="count-badge">{t.gamesCount(all.length)}</p>}
      </Masthead>
      <main className="page">
        {all.length > 0 && (
          <form className="filters" role="search">
            <label className="field field-search">
              <span>{t.search}</span>
              <input type="search" name="search" defaultValue={query.search} />
            </label>
            <label className="field">
              <span>{t.platform}</span>
              <select name="platform" defaultValue={query.platform}>
                <option value="">{t.allPlatforms}</option>
                {platforms.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>{t.genre}</span>
              <select name="genre" defaultValue={query.genre}>
                <option value="">{t.allGenres}</option>
                {genres.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="filter-actions">
              <button type="submit" className="button">
                {t.filter}
              </button>
              {filtered && <Link href={`/${lang}`}>{t.clear}</Link>}
            </div>
          </form>
        )}
        {all.length === 0 && <p className="empty">{t.catalogEmpty}</p>}
        {all.length > 0 && games.length === 0 && (
          <p className="empty">
            {t.noMatch} <Link href={`/${lang}`}>{t.clearThem}</Link>
            {t.noMatchAfter}
          </p>
        )}
        {games.length > 0 && (
          <div className="ranking-head">
            <h2>{t.backToRanking}</h2>
            <p className="ranking-note">{t.rankingNote}</p>
            <ul className="heat-key" aria-label={t.heatKey}>
              {STEPS.map(({ step, range }) => (
                <li key={step} className={`s${step}`}>
                  {range}
                </li>
              ))}
            </ul>
          </div>
        )}
        <ol className="ranking">
          {games.map((game) => (
            <li key={game.slug} className={game.score === null ? "unscored" : undefined}>
              <Cover url={game.coverUrl} name={game.name} t={t} />
              <div className="label">
                <h3>
                  <Link href={`/${lang}/games/${game.slug}`}>{game.name}</Link>
                </h3>
                <p className="meta">
                  {game.releaseDate?.slice(0, 4) ?? t.releaseUnknown}
                  {game.platforms.length > 0 && ` · ${game.platforms.slice(0, 3).join(", ")}`}
                  {game.platforms.length > 3 && ` +${game.platforms.length - 3}`}
                </p>
                {(game.developer || game.genres.length > 0) && (
                  <p className="wall-label">
                    {[game.developer, game.genres.map((g) => genreName(lang, g)).join(", ")]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>
              <CrossReview game={game} lang={lang} t={t} />
              <ScoreStamp score={game.score} unscored={t.unscored} />
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
