"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { logIn, logOut, requireAdmin } from "../../lib/admin-auth";
import { COLUMNS, readCatalog } from "../../lib/catalog";
import { CATALOG_TAG } from "../../lib/catalog-cache";
import { fetchGameRows } from "../../lib/igdb";
import { appendGameRow, deleteGameRow, readGameRows } from "../../lib/sheet";
import { runSync } from "../../lib/sync";

export async function login(formData: FormData) {
  const ok = await logIn(String(formData.get("password") ?? ""));
  redirect(ok ? "/admin" : "/admin?error=1");
}

export async function logout() {
  await logOut();
  redirect("/admin");
}

export async function removeGame(formData: FormData) {
  await requireAdmin();
  const igdbId = Number(formData.get("igdbId"));
  if (!Number.isInteger(igdbId) || igdbId <= 0) throw new Error("Invalid IGDB ID");
  await deleteGameRow(igdbId);
  updateTag(CATALOG_TAG);
}

const ID = COLUMNS.indexOf("igdb_id");
const SLUG = COLUMNS.indexOf("slug");
const NAME = COLUMNS.indexOf("name");

// Imports one Game from IGDB. A taken or invalid slug sends the owner back to pick another one.
export async function importGame(formData: FormData) {
  await requireAdmin();
  const igdbId = Number(formData.get("igdbId"));
  if (!Number.isInteger(igdbId) || igdbId <= 0) throw new Error("Invalid IGDB ID");
  const back = (params: Record<string, string>): never =>
    redirect(`/admin?${new URLSearchParams({ q: String(formData.get("q") ?? ""), ...params })}`);

  // Read the Sheet itself, not the cache, so the duplicate checks see every row as it is now.
  const [rows, fetched] = await Promise.all([readGameRows(), fetchGameRows([igdbId])]);
  const row = fetched.get(igdbId);
  if (!row) return back({ importError: `IGDB has no Game with ID ${igdbId}.` });
  if (rows.some((r) => r[ID]?.trim() === String(igdbId)))
    return back({ importError: `${row[NAME]} is already in the Catalog.` });

  const chosen = String(formData.get("slug") ?? "").trim();
  if (chosen) row[SLUG] = chosen;
  const slug = row[SLUG];
  // Validate the new row through Catalog read: the same rules the site applies when it reads it.
  const reason = rows.some((r) => r[SLUG]?.trim() === slug)
    ? `slug "${slug}" is already used by another Game`
    : readCatalog([row]).invalidRows[0]?.reason;
  // Catalog read's reasons start with the column name ("slug is missing", ...).
  if (reason?.startsWith("slug")) return back({ slugFor: String(igdbId), slug, importError: `${reason}.` });
  if (reason) return back({ importError: `${reason}.` });

  await appendGameRow(row);
  updateTag(CATALOG_TAG);
  back({ imported: slug });
}

// Syncs one Game (form field igdbId) or, without one, every Game; see runSync.
export async function syncGames(formData: FormData) {
  await requireAdmin();
  const one = formData.get("igdbId");
  const { synced, missing } = await runSync(one ? Number(one) : undefined);
  updateTag(CATALOG_TAG);

  const params = new URLSearchParams({ synced: String(synced) });
  if (missing.length) params.set("missing", missing.join(","));
  redirect(`/admin?${params}`);
}
