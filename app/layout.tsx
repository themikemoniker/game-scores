import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Scores",
  description: "A hand-picked Catalog of Games, ranked by their Score.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
