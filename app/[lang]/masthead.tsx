import Link from "next/link";
import type { Locale } from "../../lib/i18n";
import { Switcher } from "./switcher";

// A drawn back arrow in the UI stroke weight, for links that return to the ranking.
export function BackArrow() {
  return (
    <svg className="back-arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M14 8H3M7.5 3.5 3 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

// The ink band at the top of every visitor page. The ranking page passes the full masthead
// (wordmark as its h1 and the site description); other pages get the compact one.
export function Masthead({ lang, rest, children }: { lang: Locale; rest?: string; children?: React.ReactNode }) {
  return (
    <header className={children ? "masthead" : "masthead compact"}>
      <div className="masthead-inner">
        {children ?? (
          <Link href={`/${lang}`} className="wordmark">
            Game Scores
          </Link>
        )}
        <Switcher lang={lang} rest={rest} />
      </div>
    </header>
  );
}
