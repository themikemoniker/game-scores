import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "../../lib/admin-auth";
import { getCatalog } from "../../lib/catalog-cache";
import { login, logout, removeGame } from "./actions";

// English only, no locale prefix (spec: i18n).
export const metadata: Metadata = { title: "Admin · Game Scores", robots: { index: false } };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!(await isAdmin())) {
    const { error } = await searchParams;
    return (
      <main className="admin">
        <h1>Admin</h1>
        <form action={login}>
          <label>
            Password <input type="password" name="password" required autoFocus autoComplete="current-password" />
          </label>{" "}
          <button type="submit">Log in</button>
        </form>
        {error && <p role="alert">Wrong password.</p>}
      </main>
    );
  }

  const { games, invalidRows } = await getCatalog();
  return (
    <main className="admin">
      <h1>Admin</h1>
      <form action={logout}>
        <button type="submit">Log out</button>
      </form>

      <h2>Invalid rows ({invalidRows.length})</h2>
      {invalidRows.length === 0 ? (
        <p>None. Every row in the Sheet is valid.</p>
      ) : (
        <>
          <p>These rows are left off the public site. Fix them in the Sheet.</p>
          <table>
            <thead>
              <tr>
                <th>Row</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {invalidRows.map((r) => (
                <tr key={r.row}>
                  <td>{r.row}</td>
                  <td>{r.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2>Catalog ({games.length})</h2>
      {games.length === 0 ? (
        <p>The Catalog is empty.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Game</th>
              <th>IGDB ID</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.igdbId}>
                <td>
                  <Link href={`/games/${game.slug}`}>{game.name}</Link>
                </td>
                <td>{game.igdbId}</td>
                <td>{game.score === null ? "Unscored" : Math.round(game.score)}</td>
                <td>
                  <form action={removeGame}>
                    <input type="hidden" name="igdbId" value={game.igdbId} />
                    <button type="submit" aria-label={`Remove ${game.name}`}>
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
