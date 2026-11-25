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
  const step = scoreStep(score);
  return (
    <div className={`score-meter ${size} s${step}`} style={{ "--score": score } as React.CSSProperties}>
      <span className="score-value">{Math.round(score)}</span>
      <span className="scale" aria-hidden="true">
        <span className="fill" />
      </span>
    </div>
  );
}

// The step of the colour scale a Score falls on, by its shown (rounded) value.
export function scoreStep(score: number) {
  const shown = Math.round(score);
  return shown >= 90 ? 5 : shown >= 80 ? 4 : shown >= 70 ? 3 : shown >= 50 ? 2 : 1;
}
