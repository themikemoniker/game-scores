import "server-only";
import { COLUMNS } from "./catalog";
import { fetchGameRows } from "./igdb";
import { readGameRows, replaceGameRows } from "./sheet";

const ID = COLUMNS.indexOf("igdb_id");
const SLUG = COLUMNS.indexOf("slug");
const TAGS = COLUMNS.indexOf("tags");

// Syncs one Game (by IGDB ID) or, without one, every row in the Sheet. Overwrites every Source column
// and last_synced, keeps the slug and the Tags. IDs IGDB no longer returns are left as they are and
// returned as `missing`. Callers check who's asking and revalidate the Catalog cache.
export async function runSync(only?: number) {
  // Read the Sheet itself, not the cache, so a row added by hand a minute ago is synced too.
  const rows = await readGameRows();
  // Reversed so a duplicated IGDB ID keeps the first row's slug, the row replaceGameRows writes.
  const slugs = new Map(rows.map((r) => [Number(r[ID]?.trim()), r[SLUG]?.trim() ?? ""] as const).reverse());
  const tags = new Map(rows.map((r) => [Number(r[ID]?.trim()), r[TAGS] ?? ""] as const).reverse());
  const ids = (only === undefined ? [...slugs.keys()] : [only]).filter(
    (id) => Number.isInteger(id) && id > 0 && slugs.has(id),
  );

  const fetched = await fetchGameRows(ids);
  for (const [id, row] of fetched) {
    row[SLUG] = slugs.get(id) || row[SLUG];
    row[TAGS] = tags.get(id) ?? "";
  }
  await replaceGameRows(fetched);
  return { synced: fetched.size, missing: ids.filter((id) => !fetched.has(id)) };
}
