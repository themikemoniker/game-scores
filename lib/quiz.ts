// Quiz and Matches: a visitor's answers in, the top 3 Games from the Catalog out (spec: Tags and the Quiz).
import { isTag, type Game, type Tag } from "./catalog";

export const FAMILIES = ["pc", "playstation", "xbox", "nintendo", "mobile"] as const;
export type Family = (typeof FAMILIES)[number];
export const ERAS = ["any", "modern", "classic"] as const;
export type Era = (typeof ERAS)[number];

// Modern is this year and later, Classic before it.
const MODERN_FROM = 2010;
const MAX_TAGS = 3;
const MAX_MATCHES = 3;

// The Source's Platform names, grouped. Anything unmapped (Stadia, arcade…) belongs to no family.
export function family(platform: string): Family | null {
  if (["PC (Microsoft Windows)", "Mac", "Linux"].includes(platform)) return "pc";
  if (platform.startsWith("PlayStation")) return "playstation";
  if (platform.startsWith("Xbox")) return "xbox";
  if (/Nintendo|^Wii|^Game Boy|^Virtual Boy/.test(platform)) return "nintendo";
  if (["iOS", "Android"].includes(platform)) return "mobile";
  return null;
}

export type Quiz = { families: Family[]; tags: Tag[]; era: Era };

type Param = string | string[] | undefined;
const values = (p: Param) => (Array.isArray(p) ? p : p ? [p] : []);

// Reads the Quiz from the URL (?platform=pc&tag=roguelike&era=classic). Unknown values are ignored
// and only the first 3 Tags count, so a hand-edited link can't break the page.
export function readQuiz(params: { platform?: Param; tag?: Param; era?: Param }): Quiz {
  const families = values(params.platform).filter((f): f is Family => (FAMILIES as readonly string[]).includes(f));
  const tags = values(params.tag).filter(isTag).slice(0, MAX_TAGS);
  const era = values(params.era).find((e): e is Era => (ERAS as readonly string[]).includes(e)) ?? "any";
  return { families: [...new Set(families)], tags: [...new Set(tags)], era };
}

export type Match = { game: Game; families: Family[]; tags: Tag[] };

// Platform family and era are hard filters; a Match shares at least one Tag. `games` come from
// Catalog read in ranking order, and the sort is stable, so equal Tag counts keep Score then name.
// With no Match, the fallback is the top-scored Games on the chosen Platforms, era aside.
export function matchQuiz(games: Game[], quiz: Quiz): { matches: Match[]; fallback: boolean } {
  const onPlatforms = (g: Game) => {
    const families = [...new Set(g.platforms.map(family))].filter((f): f is Family => f !== null);
    const picked = quiz.families.length ? families.filter((f) => quiz.families.includes(f)) : families;
    return picked.length ? picked : null;
  };
  const year = (g: Game) => (g.releaseDate ? Number(g.releaseDate.slice(0, 4)) : null);
  const inEra = (g: Game) => {
    const y = year(g);
    if (quiz.era === "any") return true;
    if (y === null) return false;
    return quiz.era === "modern" ? y >= MODERN_FROM : y < MODERN_FROM;
  };

  const matches = games
    .flatMap((game) => {
      const families = onPlatforms(game);
      const tags = game.tags.filter((t) => quiz.tags.includes(t));
      return families && inEra(game) && tags.length ? [{ game, families, tags }] : [];
    })
    .sort((a, b) => b.tags.length - a.tags.length)
    .slice(0, MAX_MATCHES);
  if (matches.length) return { matches, fallback: false };

  const fallback = games
    .flatMap((game) => {
      const families = onPlatforms(game);
      return families && game.score !== null ? [{ game, families, tags: [] }] : [];
    })
    .slice(0, MAX_MATCHES);
  return { matches: fallback, fallback: true };
}
