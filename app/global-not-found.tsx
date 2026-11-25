import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

// Any 404 on the site. It renders outside the [lang] layout, so it can't tell the language and shows both.
export const metadata: Metadata = { title: "Page not found · Game Scores" };

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main>
          <h1>Page not found</h1>
          <p>
            There&apos;s no page at this address. <Link href="/en">Go to the ranking</Link>.
          </p>
          <h1 lang="es">Página no encontrada</h1>
          <p lang="es">
            No hay ninguna página en esta dirección. <Link href="/es">Ir a la clasificación</Link>.
          </p>
        </main>
      </body>
    </html>
  );
}
