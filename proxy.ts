import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, pickLocale } from "./lib/i18n";

// Visitor URLs without a locale prefix go to /en or /es, by the browser's language.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const url = request.nextUrl.clone();
  url.pathname = `/${pickLocale(request.headers.get("accept-language"))}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

// Skips Next's own files, the admin page (no locale prefix), API routes and anything with a file extension.
export const config = { matcher: ["/((?!_next/|admin(?:/|$)|api/|.*\\.).*)"] };
