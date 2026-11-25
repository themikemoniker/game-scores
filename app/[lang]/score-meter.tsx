import type { Game } from "../../lib/catalog";
import type { dictionary, Locale } from "../../lib/i18n";

// A Score stamped in a circle filled with its step of the heat scale. The numeral is the
// accessible text, so colour is never the only signal. Unscored is an empty dashed circle, never a zero.
export function ScoreStamp({
  score,
  unscored,
  size = "sm",
}: {
  score: number | null;
  unscored: string;
  size?: "sm" | "lg";
}) {
  if (score === null) {
    // The large stamp has room for the word; the small one shows a dash and puts the word beneath,
    // so a long translation ("Sin puntuación") never crosses the ring.
    return size === "lg" ? (
      <div className="stamp lg unscored">
        <span className="stamp-value">{unscored}</span>
      </div>
    ) : (
      <div className="stamp-unscored">
        <div className="stamp sm unscored" aria-hidden="true">
          <span className="stamp-value">—</span>
        </div>
        <span className="stamp-caption">{unscored}</span>
      </div>
    );
  }
  return (
    <div className={`stamp ${size} s${scoreStep(score)}`}>
      <span className="stamp-value">{Math.round(score)}</span>
    </div>
  );
}

// The step of the heat scale a Score falls on, by its shown (rounded) value.
export function scoreStep(score: number) {
  const shown = Math.round(score);
  return shown >= 90 ? 5 : shown >= 80 ? 4 : shown >= 70 ? 3 : shown >= 50 ? 2 : 1;
}

// The heat scale's key, printed once on the ranking.
export const STEPS = [
  { step: 5, range: "90+" },
  { step: 4, range: "80–89" },
  { step: 3, range: "70–79" },
  { step: 2, range: "50–69" },
  { step: 1, range: "<50" },
];

// A ranking row's cross-review box: each External Rating's review count, raw value and adjusted value.
// A kind with no rating prints a dash.
export function CrossReview({ game, lang, t }: { game: Game; lang: Locale; t: ReturnType<typeof dictionary> }) {
  const fixed = (n: number) => n.toLocaleString(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const num = (n: number, digits = 1) => n.toLocaleString(lang, { maximumFractionDigits: digits });
  return (
    <dl className="cross">
      {(["critic", "user"] as const).map((kind) => {
        const r = game.breakdown?.ratings.find((x) => x.kind === kind);
        return (
          <div key={kind}>
            <dt>
              {t.ratingShort[kind]}
              {r && <span className="reviews">{t.reviewCount(num(r.count, 0))}</span>}
            </dt>
            <dd>
              {r ? (
                <>
                  <span className="raw">
                    <span className="sr-only">{t.rating} </span>
                    {num(r.rating)}
                  </span>
                  <span className="to" aria-hidden="true" />
                  <span className="adj">
                    <span className="sr-only">, {t.adjusted} </span>
                    {fixed(r.adjusted)}
                  </span>
                </>
              ) : (
                <span className="none">—</span>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
