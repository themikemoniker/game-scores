import type { Metadata } from "next";
import { dictionary, hasLocale, LOCALES } from "../../lib/i18n";
import "../globals.css";

type Props = { params: Promise<{ lang: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: "Game Scores", description: hasLocale(lang) ? dictionary(lang).siteDescription : undefined };
}

export default async function RootLayout({ children, params }: Props & { children: React.ReactNode }) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
