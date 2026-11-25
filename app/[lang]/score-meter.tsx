// A Score as its numeral plus a 0–100 scale with the baseline (70) marked. The numeral is the
// accessible text; the scale is decoration. Unscored gets an empty hatched scale, never a zero.
export function ScoreMeter({
  score,
  unscored,
  size = "sm",
}: {
  score: number | null;
  unscored: string;
  size?: "sm" | "lg";
}) {
  if (score === null) {
    return (
      <div className={`score-meter ${size} unscored`}>
        <span className="score-value">{unscored}</span>
        <span className="scale" aria-hidden="true" />
      </div>
    );
  }
  const shown = Math.round(score);
  const step = shown >= 90 ? 5 : shown >= 80 ? 4 : shown >= 70 ? 3 : shown >= 50 ? 2 : 1;
  return (
    <div className={`score-meter ${size} s${step}`} style={{ "--score": score } as React.CSSProperties}>
      <span className="score-value">{shown}</span>
      <span className="scale" aria-hidden="true">
        <span className="fill" />
      </span>
    </div>
  );
}
