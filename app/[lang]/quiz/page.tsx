import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TAGS } from "../../../lib/catalog";
import { getCatalog } from "../../../lib/catalog-cache";
import { dictionary, hasLocale } from "../../../lib/i18n";
import { ERAS, FAMILIES, matchQuiz, readQuiz } from "../../../lib/quiz";
import { Cover } from "../cover";
import { Masthead } from "../masthead";
import { CrossReview, ScoreStamp } from "../score-meter";

type Params = Record<string, string | string[] | undefined>;
type Props = { params: Promise<{ lang: string }>; searchParams: Promise<Params> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: `${dictionary(lang).quizTitle} · Game Scores` } : {};
}

// The Quiz: a plain GET form, so the answers live in the URL and the page works without JavaScript.
export default async function QuizPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = dictionary(lang);
  const p = await searchParams;
  const quiz = readQuiz(p);
  const answered = p.tag !== undefined || p.platform !== undefined || p.era !== undefined;
  const tooManyTags = [p.tag].flat().filter(Boolean).length > quiz.tags.length && quiz.tags.length === 3;
  const { games } = await getCatalog();
  const result = quiz.tags.length ? matchQuiz(games, quiz) : null;

  const query = new URLSearchParams([
    ...quiz.families.map((f) => ["platform", f]),
    ...quiz.tags.map((tag) => ["tag", tag]),
    ...(quiz.era === "any" ? [] : [["era", quiz.era]]),
  ]).toString();

  return (
    <>
      <Masthead lang={lang} rest={`/quiz${query && `?${query}`}`} />
      <main className="page quiz">
        <div className="ranking-head">
          <h1>{t.quizTitle}</h1>
          <p className="ranking-note">{t.quizIntro}</p>
        </div>

        <form className="quiz-form" action={`/${lang}/quiz#matches`}>
          <fieldset>
            <legend>
              {t.quizPlatforms} <span>{t.quizPlatformsHint}</span>
            </legend>
            <div className="choices">
              {FAMILIES.map((f) => (
                <label key={f} className="choice">
                  <input type="checkbox" name="platform" value={f} defaultChecked={quiz.families.includes(f)} />
                  {t.familyNames[f]}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>
              {t.quizTags} <span>{t.quizTagsHint}</span>
            </legend>
            <div className="choices">
              {TAGS.map((tag) => (
                <label key={tag} className="choice">
                  <input type="checkbox" name="tag" value={tag} defaultChecked={quiz.tags.includes(tag)} />
                  {t.tagNames[tag]}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t.quizEra}</legend>
            <div className="choices">
              {ERAS.map((era) => (
                <label key={era} className="choice">
                  <input type="radio" name="era" value={era} defaultChecked={quiz.era === era} />
                  {t.eraNames[era]}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="quiz-actions">
            <button type="submit" className="button">
              {t.quizSubmit}
            </button>
            {answered && <Link href={`/${lang}/quiz`}>{t.quizStartOver}</Link>}
          </div>
        </form>

        {answered && !result && (
          <p className="empty" role="status">
            {t.quizPickTag}
          </p>
        )}
        {result && (
          <section id="matches" aria-labelledby="matches-heading" className="quiz-results">
            <h2 id="matches-heading" className="results-heading">
              {t.quizMatches}
            </h2>
            {tooManyTags && <p className="ranking-note">{t.quizTooManyTags}</p>}
            {result.fallback && (
              <p className="empty" role="status">
                {result.matches.length ? t.quizFallback : t.quizNothing}
              </p>
            )}
            <ol className="ranking">
              {result.matches.map(({ game, families, tags }) => (
                <li key={game.slug} className={game.score === null ? "unscored" : undefined}>
                  <Cover url={game.coverUrl} name={game.name} t={t} />
                  <div className="label">
                    <h3>
                      <Link href={`/${lang}/games/${game.slug}`}>{game.name}</Link>
                    </h3>
                    <p className="why">
                      {!result.fallback && <span>{t.quizWhy}</span>}{" "}
                      {[
                        families.map((f) => t.familyNames[f]).join(", "),
                        tags.map((tag) => t.tagNames[tag]).join(" + "),
                        game.releaseDate?.slice(0, 4),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <CrossReview game={game} lang={lang} t={t} />
                  <ScoreStamp score={game.score} unscored={t.unscored} />
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
    </>
  );
}
