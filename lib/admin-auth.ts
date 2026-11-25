import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Admin auth: one password (ADMIN_PASSWORD), a signed httpOnly cookie that lasts 30 days.
// The cookie is `<expiry ms>.<HMAC of the expiry>`, keyed by the password, so changing the
// password logs every session out.

const COOKIE = "admin_session";
const MAX_AGE = 30 * 24 * 60 * 60; // seconds

function password() {
  const value = process.env.ADMIN_PASSWORD;
  if (!value) throw new Error("Missing environment variable ADMIN_PASSWORD");
  return value;
}

const hmac = (data: string) => createHmac("sha256", password()).update(data).digest();

const sessionSignature = (expiry: string) => hmac(`session:${expiry}`);

// Compares HMACs so both sides have the same length and the comparison takes constant time.
const passwordMatches = (submitted: string) => timingSafeEqual(hmac(submitted), hmac(password()));

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  const [expiry, signature] = value?.split(".") ?? [];
  if (!expiry || !signature || !(Number(expiry) > Date.now())) return false;
  const expected = sessionSignature(expiry);
  const given = Buffer.from(signature, "base64url");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

// Every admin server action calls this first; protecting the page alone isn't enough.
export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Not logged in");
}

// Sets the session cookie if the password matches. Returns whether it did.
export async function logIn(submitted: string) {
  if (!passwordMatches(submitted)) return false;
  const expiry = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${expiry}.${sessionSignature(expiry).toString("base64url")}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function logOut() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}
