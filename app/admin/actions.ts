"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { logIn, logOut, requireAdmin } from "../../lib/admin-auth";
import { CATALOG_TAG } from "../../lib/catalog-cache";
import { deleteGameRow } from "../../lib/sheet";

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
