import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "./fonts";
import "./globals.css";

// Any 404 on the site. It renders outside the [lang] layout, so it can't tell the language and shows both.
export const metadata: Metadata = { title: "Page not found · Game Scores" };

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <header className="masthead compact">
          <div className="masthead-inner">
            <span className="wordmark">Game Scores</span>
          </div>
        </header>
        <main className="page lost lost-both">
          <div>
            <h1>Page not found</h1>
            <p>There&apos;s no page at this address.</p>
            <p>
              <Link href="/en" className="button">
                Go to the ranking
              </Link>
            </p>
          </div>
          <div lang="es">
            <h1>Página no encontrada</h1>
            <p>No hay ninguna página en esta dirección.</p>
            <p>
              <Link href="/es" className="button">
                Ir a la clasificación
              </Link>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
