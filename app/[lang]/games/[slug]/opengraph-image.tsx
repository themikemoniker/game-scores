import { notFound } from "next/navigation";
import { getCatalog } from "../../../../lib/catalog-cache";
import { dictionary, hasLocale } from "../../../../lib/i18n";
import { C, card, Plate, SKEW, STEP_COLORS, Wordmark } from "../../og";
import { scoreStep } from "../../score-meter";

export { contentType, size } from "../../og";
export const alt = "A Game's cover, name and Score on Game Scores";

// The link preview for a Game page: its cover, its name and its Score stamp.
export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const {
    games: [game],
  } = await getCatalog({ slug });
  if (!game) notFound();
  const t = dictionary(lang);
  const [fill, numeral] = game.score === null ? ["transparent", C.inkSoft] : STEP_COLORS[scoreStep(game.score)];
  const nameSize = game.name.length > 32 ? 60 : game.name.length > 18 ? 76 : 96;
  const cover = { width: 330, height: 468, border: `6px solid ${C.ink}`, background: C.paper };

  return card(
    <div style={{ display: "flex", gap: 64, width: "100%", alignItems: "center" }}>
      {game.coverUrl ? (
        // IGDB serves the same image at twice the size under t_cover_big_2x.
        <img src={game.coverUrl.replace("/t_cover_big/", "/t_cover_big_2x/")} style={cover} />
      ) : (
        <div style={{ ...cover, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 200 }}>
          {game.name.charAt(0)}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, height: 468 }}>
        <Wordmark fontSize={44} />
        <div style={{ display: "flex", fontSize: nameSize, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "24px 0" }}>
          {game.name}
        </div>
        <Plate>
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
              border: game.score === null ? `6px dashed ${C.inkSoft}` : `8px solid ${C.ink}`,
              background: fill,
              color: numeral,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: game.score === null ? 56 : 72,
              transform: SKEW,
            }}
          >
            {game.score === null ? "—" : String(Math.round(game.score))}
          </div>
          <div style={{ display: "flex", fontSize: 40, color: C.inkSoft, paddingRight: 14 }}>
            {game.score === null ? t.unscored : t.score}
          </div>
        </Plate>
      </div>
    </div>,
  );
}
