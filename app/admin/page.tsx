import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "../../lib/admin-auth";
import { getCatalog } from "../../lib/catalog-cache";
import { searchGames, type Candidate } from "../../lib/igdb";
import { importGame, login, logout, removeGame, syncGames } from "./actions";

// English only, no locale prefix (spec: i18n).
export const metadata: Metadata = { title: "Admin · Game Scores", robots: { index: false } };

const utc = (iso: string) =>
  new Date(iso).toLocaleString("en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });

type Params = {
  error?: string;
  q?: string;
  slugFor?: string;
  slug?: string;
  importError?: string;
  imported?: string;
  synced?: string;
  missing?: string;
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { error, q = "", slugFor, slug, importError, imported, synced, missing } = await searchParams;
  if (!(await isAdmin())) {
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
  const inCatalog = new Set(games.map((g) => g.igdbId));
  let candidates: Candidate[] = [];
  let searchError: string | null = null;
  if (q.trim()) {
    try {
      candidates = await searchGames(q.trim());
    } catch (e) {
      searchError = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <main className="admin">
      <h1>Admin</h1>
      <form action={logout}>
        <button type="submit">Log out</button>
      </form>

      <h2>Import from IGDB</h2>
      <form action="/admin">
        <label>
          Name <input type="search" name="q" defaultValue={q} required />
        </label>{" "}
        <button type="submit">Search</button>
      </form>
      {imported && (
        <p role="status">
          Imported. <Link href={`/en/games/${imported}`}>See it on the site</Link>.
        </p>
      )}
      {importError && <p role="alert">{importError}</p>}
      {searchError && <p role="alert">Search failed: {searchError}</p>}
      {q.trim() && !searchError && candidates.length === 0 && <p>No Games found on IGDB.</p>}
      {candidates.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Game</th>
              <th>Year</th>
              <th>Platforms</th>
              <th>Import</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.igdbId}>
                <td>{c.name}</td>
                <td>{c.year ?? "—"}</td>
                <td>{c.platforms.join(", ")}</td>
                <td>
                  {inCatalog.has(c.igdbId) ? (
                    "In Catalog"
                  ) : (
                    <form action={importGame}>
                      <input type="hidden" name="igdbId" value={c.igdbId} />
                      <input type="hidden" name="q" value={q} />
                      {slugFor === String(c.igdbId) && (
                        <label>
                          New slug <input name="slug" defaultValue={slug} required autoFocus />{" "}
                        </label>
                      )}
                      <button type="submit" aria-label={`Import ${c.name}`}>
                        Import
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
      {synced && (
        <p role="status">
          Synced {synced} {synced === "1" ? "Game" : "Games"}.
        </p>
      )}
      {missing && (
        <p role="alert">
          IGDB no longer returns these Games, so their rows were left unchanged:{" "}
          {missing
            .split(",")
            .map((id) => {
              const name = games.find((g) => String(g.igdbId) === id)?.name;
              return name ? `${name} (IGDB ID ${id})` : `IGDB ID ${id}`;
            })
            .join(", ")}
          . Remove any you no longer want.
        </p>
      )}
      {games.length + invalidRows.length > 0 && (
        <form action={syncGames}>
          <button type="submit">Sync all</button> Overwrites every Game&apos;s IGDB data, including hand edits in the
          Sheet. Slugs are kept.
        </form>
      )}
      {games.length === 0 ? (
        <p>The Catalog is empty.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Game</th>
              <th>IGDB ID</th>
              <th>Score</th>
              <th>Last synced</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.igdbId}>
                <td>
                  <Link href={`/en/games/${game.slug}`}>{game.name}</Link>
                </td>
                <td>{game.igdbId}</td>
                <td>{game.score === null ? "Unscored" : Math.round(game.score)}</td>
                <td>{game.lastSynced ? `${utc(game.lastSynced)} UTC` : "Never"}</td>
                <td className="actions">
                  <form action={syncGames}>
                    <input type="hidden" name="igdbId" value={game.igdbId} />
                    <button type="submit" aria-label={`Sync ${game.name}`}>
                      Sync
                    </button>
                  </form>
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
