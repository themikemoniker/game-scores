import Link from "next/link";
import { dictionary, LOCALE_NAMES, LOCALES, type Locale } from "../../lib/i18n";

// `rest` is the current URL after the locale prefix (path and query), so switching keeps the page.
export function Switcher({ lang, rest = "" }: { lang: Locale; rest?: string }) {
  return (
    <nav className="switcher" aria-label={dictionary(lang).language}>
      {LOCALES.map((l) =>
        l === lang ? (
          <strong key={l} aria-current="page">
            {LOCALE_NAMES[l]}
          </strong>
        ) : (
          <Link key={l} href={`/${l}${rest}`} hrefLang={l} lang={l}>
            {LOCALE_NAMES[l]}
          </Link>
        ),
      )}
    </nav>
  );
}
