import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "../../lib/catalog-cache";
import { dictionary, genreName, hasLocale } from "../../lib/i18n";
import { Switcher } from "./switcher";

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
    <main>
      <Switcher lang={lang} rest={queryString && `?${queryString}`} />
      <h1>Game Scores</h1>
      {all.length > 0 && (
        <form className="filters" role="search">
          <label>
            {t.search} <input type="search" name="search" defaultValue={query.search} />
          </label>
          <label>
            {t.platform}{" "}
            <select name="platform" defaultValue={query.platform}>
              <option value="">{t.allPlatforms}</option>
              {platforms.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label>
            {t.genre}{" "}
            <select name="genre" defaultValue={query.genre}>
              <option value="">{t.allGenres}</option>
              {genres.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">{t.filter}</button>
          {filtered && <Link href={`/${lang}`}>{t.clear}</Link>}
        </form>
      )}
      {all.length === 0 && <p>{t.catalogEmpty}</p>}
      {all.length > 0 && games.length === 0 && (
        <p>
          {t.noMatch} <Link href={`/${lang}`}>{t.clearThem}</Link>
          {t.noMatchAfter}
        </p>
      )}
      <ol className="ranking">
        {games.map((game) => (
          <li key={game.slug}>
            {game.coverUrl ? (
              <img src={game.coverUrl} alt={t.cover(game.name)} width={90} height={120} loading="lazy" />
            ) : (
              <div className="cover-placeholder" role="img" aria-label={t.noCover(game.name)} />
            )}
            <div>
              <h2>
                <Link href={`/${lang}/games/${game.slug}`}>{game.name}</Link>
              </h2>
              <p>
                {game.releaseDate?.slice(0, 4) ?? t.releaseUnknown}
                {game.platforms.length > 0 && ` · ${game.platforms.join(", ")}`}
              </p>
            </div>
            <p className="score">{game.score === null ? t.unscored : Math.round(game.score)}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
