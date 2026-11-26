import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Shared by the link preview images (opengraph-image.tsx). ImageResponse can't read CSS variables
// or OKLCH, so these are the globals.css tokens converted to hex. Keep them in step with globals.css.
export const C = {
  paper: "#fdfdfd",
  ink: "#12120f",
  inkSoft: "#4f4d46",
  yellow: "#ffd50d",
  onYellowSoft: "#4e3914",
};
// The heat scale, by scoreStep(): [fill, numeral].
export const STEP_COLORS: Record<number, [string, string]> = {
  5: ["#d40e14", "#fcfcf9"],
  4: ["#f8842d", C.ink],
  3: [C.yellow, C.ink],
  2: ["#94d1ef", C.ink],
  1: ["#1351a6", "#fcfcf9"],
};

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const SKEW = "skewX(-8deg)";

// Dela Gothic One, Latin subset only (Latin-1 and Latin Extended-A, plus dashes, quotes and the
// ellipsis), committed in assets/ so rendering never fetches a font. A Game name outside that set
// falls back to the renderer's default font.
const font = readFile(join(process.cwd(), "assets/dela-gothic-one-latin.ttf"));

export function Wordmark({ fontSize }: { fontSize: number }) {
  return (
    <div style={{ fontSize, lineHeight: 0.9, letterSpacing: "-0.03em", color: C.ink, transform: SKEW }}>
      GAME SCORES
    </div>
  );
}

// A paper plate with an ink rule, so every step of the heat scale shows, the yellow one included.
export function Plate({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        alignSelf: "flex-start",
        padding: 18,
        background: C.paper,
        border: `6px solid ${C.ink}`,
      }}
    >
      {children}
    </div>
  );
}

// The yellow band with an ink rule underneath, like the masthead.
export async function card(children: React.ReactNode) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: C.yellow,
          borderBottom: `24px solid ${C.ink}`,
          padding: "56px 72px",
          fontFamily: "Dela Gothic One",
          color: C.ink,
        }}
      >
        {children}
      </div>
    ),
    { ...size, fonts: [{ name: "Dela Gothic One", data: await font, weight: 400, style: "normal" }] },
  );
}
