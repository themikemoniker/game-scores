import "server-only";
import { unstable_cache } from "next/cache";
import { readCatalog, type CatalogQuery } from "./catalog";
import { readGameRows } from "./sheet";

// Admin actions call updateTag(CATALOG_TAG) (or revalidateTag(CATALOG_TAG, "max")) after changing the Sheet.
export const CATALOG_TAG = "catalog";

// The Sheet is read at most once per 10 minutes (or after revalidation), never per page view.
const cachedRows = unstable_cache(readGameRows, ["games-rows"], {
  tags: [CATALOG_TAG],
  revalidate: 600,
});

export async function getCatalog(query: CatalogQuery = {}) {
  return readCatalog(await cachedRows(), query);
}
