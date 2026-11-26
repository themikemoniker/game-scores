import { Dela_Gothic_One, Zen_Kaku_Gothic_New } from "next/font/google";

// Dela Gothic One for the wordmark, section titles and every Score and rank numeral;
// Zen Kaku Gothic New for labels, controls and reading text.
// Both are Japanese fonts that Google splits into dozens of files per weight. Preloading them made every
// page fetch ~195 fonts before "load"; without preload the browser fetches only the slices it uses.
const display = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: false,
});
const ui = Zen_Kaku_Gothic_New({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
  preload: false,
});

export const fontVariables = `${display.variable} ${ui.variable}`;
