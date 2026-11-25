import Link from "next/link";
import type { Locale } from "../../lib/i18n";
import { Switcher } from "./switcher";

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
