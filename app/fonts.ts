import { Archivo, Source_Serif_4 } from "next/font/google";

// Archivo (with its width axis) for headings, numerals and UI; Source Serif 4 for reading text.
const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-display", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], axes: ["opsz"], variable: "--font-serif", display: "swap" });

export const fontVariables = `${display.variable} ${serif.variable}`;
