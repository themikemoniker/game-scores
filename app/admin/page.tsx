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
      <>
        <AdminMasthead />
        <main className="page admin admin-login">
          <h1>Admin</h1>
          <form action={login} className="stack">
            <label className="field">
              <span>Password</span>
              <input type="password" name="password" required autoFocus autoComplete="current-password" />
            </label>
            <button type="submit" className="button">
              Log in
            </button>
          </form>
          {error && (
            <p role="alert" className="message error">
              Wrong password.
            </p>
          )}
        </main>
      </>
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
    <>
      <AdminMasthead>
        <form action={logout}>
          <button type="submit" className="button small quiet">
            Log out
          </button>
        </form>
      </AdminMasthead>
      <main className="page admin">
        <h1>Admin</h1>

        <section className="admin-section" aria-labelledby="import-heading">
          <h2 id="import-heading">Import from IGDB</h2>
          <form action="/admin" className="inline-form">
            <label className="field field-search">
              <span>Name</span>
              <input type="search" name="q" defaultValue={q} required />
            </label>
            <button type="submit" className="button">
              Search
            </button>
          </form>
          {imported && (
            <p role="status" className="message success">
              Imported. <Link href={`/en/games/${imported}`}>See it on the site</Link>.
            </p>
          )}
          {importError && (
            <p role="alert" className="message error">
              {importError}
            </p>
          )}
          {searchError && (
            <p role="alert" className="message error">
              Search failed: {searchError}
            </p>
          )}
          {q.trim() && !searchError && candidates.length === 0 && <p className="quiet-text">No Games found on IGDB.</p>}
          {candidates.length > 0 && (
            <div className="table-scroll">
              <table className="data-table candidates">
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
                      <td className="name">{c.name}</td>
                      <td className="num" data-label="Year">
                        {c.year ?? "—"}
                      </td>
                      <td data-label="Platforms">{c.platforms.join(", ")}</td>
                      <td className="import">
                        {inCatalog.has(c.igdbId) ? (
                          <span className="in-catalog">In Catalog</span>
                        ) : (
                          <form action={importGame} className="row-form">
                            <input type="hidden" name="igdbId" value={c.igdbId} />
                            <input type="hidden" name="q" value={q} />
                            {slugFor === String(c.igdbId) && (
                              <label className="field slug-field">
                                <span>New slug</span>
                                <input name="slug" defaultValue={slug} required autoFocus />
                              </label>
                            )}
                            <button type="submit" className="button small secondary" aria-label={`Import ${c.name}`}>
                              Import
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-section" aria-labelledby="invalid-heading">
          <h2 id="invalid-heading">
            Invalid rows <span className="count">({invalidRows.length})</span>
          </h2>
          {invalidRows.length === 0 ? (
            <p className="quiet-text">None. Every row in the Sheet is valid.</p>
          ) : (
            <>
              <p className="message warning">These rows are left off the public site. Fix them in the Sheet.</p>
              <div className="table-scroll">
                <table className="data-table invalid-rows">
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invalidRows.map((r) => (
                      <tr key={r.row}>
                        <td className="num">{r.row}</td>
                        <td className="reason">{r.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        <section className="admin-section" aria-labelledby="catalog-heading">
          <h2 id="catalog-heading">
            Catalog <span className="count">({games.length})</span>
          </h2>
          {synced && (
            <p role="status" className="message success">
              Synced {synced} {synced === "1" ? "Game" : "Games"}.
            </p>
          )}
          {missing && (
            <p role="alert" className="message error">
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
            <form action={syncGames} className="sync-all">
              <button type="submit" className="button caution">
                Sync all
              </button>
              <p>Overwrites every Game&apos;s IGDB data, including hand edits in the Sheet. Slugs are kept.</p>
            </form>
          )}
          {games.length === 0 ? (
            <p className="quiet-text">The Catalog is empty.</p>
          ) : (
            <div className="table-scroll">
              <table className="data-table catalog-table">
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
                      <td className="name">
                        <Link href={`/en/games/${game.slug}`}>{game.name}</Link>
                      </td>
                      <td className="num" data-label="IGDB ID">
                        {game.igdbId}
                      </td>
                      <td className={game.score === null ? "unscored-cell" : "num score-cell"}>
                        {game.score === null ? "Unscored" : Math.round(game.score)}
                      </td>
                      <td data-label="Last synced">{game.lastSynced ? `${utc(game.lastSynced)} UTC` : "Never"}</td>
                      <td className="actions">
                        <form action={syncGames}>
                          <input type="hidden" name="igdbId" value={game.igdbId} />
                          <button type="submit" className="button small secondary" aria-label={`Sync ${game.name}`}>
                            Sync
                          </button>
                        </form>
                        <form action={removeGame}>
                          <input type="hidden" name="igdbId" value={game.igdbId} />
                          <button type="submit" className="button small danger" aria-label={`Remove ${game.name}`}>
                            Remove
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

// The same ink band as the visitor pages, with the admin's own controls on the right.
function AdminMasthead({ children }: { children?: React.ReactNode }) {
  return (
    <header className="masthead compact">
      <div className="masthead-inner">
        <span className="wordmark">
          Game Scores <span className="wordmark-sub">Admin</span>
        </span>
        {children}
      </div>
    </header>
  );
}
