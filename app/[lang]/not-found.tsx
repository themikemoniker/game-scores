import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { dictionary, hasLocale } from "../../lib/i18n";
import { Switcher } from "./switcher";

export default async function NotFound() {
  const param = await rootLang();
  const lang = param && hasLocale(param) ? param : "en";
  const t = dictionary(lang);
  return (
    <main>
      <Switcher lang={lang} />
      <h1>{t.notFound}</h1>
      <p>{t.notFoundExplain}</p>
      <p>
        <Link href={`/${lang}`}>{t.backToRanking}</Link>
      </p>
    </main>
  );
}
