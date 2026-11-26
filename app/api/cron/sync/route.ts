import { revalidateTag } from "next/cache";
import { CATALOG_TAG } from "../../../../lib/catalog-cache";
import { runSync } from "../../../../lib/sync";

// Vercel Cron calls this once a day (vercel.json) with `Authorization: Bearer $CRON_SECRET`.
// It runs Sync all, so the Score follows IGDB without anyone opening /admin. A thrown error is a 500,
// which Vercel's cron log shows as failed.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const result = await runSync();
  revalidateTag(CATALOG_TAG, "max");
  if (result.missing.length) console.warn(`Daily Sync: IGDB returned nothing for ${result.missing.join(", ")}`);
  return Response.json(result);
}
