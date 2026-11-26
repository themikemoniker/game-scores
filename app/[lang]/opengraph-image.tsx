import { notFound } from "next/navigation";
import { dictionary, hasLocale } from "../../lib/i18n";
import { C, card, Plate, STEP_COLORS, Wordmark } from "./og";

export { contentType, size } from "./og";
export const alt = "Game Scores: a hand-picked Catalog of Games, ranked by their Score";

// The link preview for the ranking and the Quiz: the wordmark, the site description and the heat scale.
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return card(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
      <Wordmark fontSize={120} />
      <div style={{ display: "flex", fontSize: 40, lineHeight: 1.25, color: C.onYellowSoft, maxWidth: 900 }}>
        {dictionary(lang).siteDescription}
      </div>
      <Plate>
        {[5, 4, 3, 2, 1].map((step) => (
          <div
            key={step}
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              border: `6px solid ${C.ink}`,
              background: STEP_COLORS[step][0],
            }}
          />
        ))}
      </Plate>
    </div>,
  );
}
