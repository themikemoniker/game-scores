import { describe, expect, it } from "vitest";
import { readCatalog } from "./catalog";
import { matchQuiz, readQuiz } from "./quiz";

// Raw Sheet rows in, through Catalog read, the way the Quiz page gets its Games.
let id = 0;
function row(name: string, f: { platforms?: string; tags?: string; year?: string; critic?: string } = {}) {
  id++;
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id}`;
  return [String(id), slug, name, "", `${f.year ?? "2020"}-01-01`, f.platforms ?? "PC (Microsoft Windows)", "", "", "",
    f.critic ?? "", f.critic ? "1000" : "", "", "", "", f.tags ?? ""];
}
const names = (r: ReturnType<typeof matchQuiz>) => r.matches.map((m) => m.game.name);

describe("readQuiz", () => {
  it("reads repeated URL params and defaults the era to any", () => {
    expect(readQuiz({ platform: ["pc", "nintendo"], tag: "cozy" })).toEqual({
      families: ["pc", "nintendo"],
      tags: ["cozy"],
      era: "any",
    });
  });

  it("ignores unknown values and keeps only the first 3 Tags", () => {
    expect(
      readQuiz({ platform: ["pc", "dreamcast"], tag: ["cozy", "nope", "puzzle", "shooter", "roguelike"], era: "1990s" }),
    ).toEqual({ families: ["pc"], tags: ["cozy", "puzzle", "shooter"], era: "any" });
  });
});

describe("matchQuiz", () => {
  it("ranks Matches by shared Tags, then Score, and keeps the top 3", () => {
    const { games } = readCatalog([
      row("One Tag High", { tags: "roguelike", critic: "95" }),
      row("Two Tags Low", { tags: "roguelike, metroidvania", critic: "60" }),
      row("One Tag Mid", { tags: "metroidvania", critic: "80" }),
      row("One Tag Low", { tags: "roguelike", critic: "50" }),
      row("No Shared Tag", { tags: "cozy", critic: "99" }),
    ]);
    const r = matchQuiz(games, readQuiz({ tag: ["roguelike", "metroidvania"] }));
    expect(r.fallback).toBe(false);
    expect(names(r)).toEqual(["Two Tags Low", "One Tag High", "One Tag Mid"]);
    expect(r.matches[0].tags).toEqual(["roguelike", "metroidvania"]);
  });

  it("filters by Platform family, grouping old consoles under it", () => {
    const { games } = readCatalog([
      row("PS1 Game", { platforms: "PlayStation", tags: "3d-platformer" }),
      row("Switch Game", { platforms: "Nintendo Switch", tags: "3d-platformer" }),
      row("Stadia Only", { platforms: "Google Stadia", tags: "3d-platformer" }),
    ]);
    const r = matchQuiz(games, readQuiz({ platform: "playstation", tag: "3d-platformer" }));
    expect(names(r)).toEqual(["PS1 Game"]);
    expect(r.matches[0].families).toEqual(["playstation"]);
    expect(names(matchQuiz(games, readQuiz({ tag: "3d-platformer" })))).toEqual(["PS1 Game", "Switch Game"]);
  });

  it("splits Classic and Modern at 2010", () => {
    const { games } = readCatalog([
      row("Old", { year: "2009", tags: "cozy" }),
      row("New", { year: "2010", tags: "cozy" }),
    ]);
    expect(names(matchQuiz(games, readQuiz({ tag: "cozy", era: "classic" })))).toEqual(["Old"]);
    expect(names(matchQuiz(games, readQuiz({ tag: "cozy", era: "modern" })))).toEqual(["New"]);
  });

  it("falls back to the top-scored Games on the chosen Platforms when nothing matches", () => {
    const { games } = readCatalog([
      row("PC Best", { tags: "cozy", critic: "90" }),
      row("PC Unscored", { tags: "cozy" }),
      row("Switch Best", { platforms: "Nintendo Switch", tags: "cozy", critic: "99" }),
    ]);
    const r = matchQuiz(games, readQuiz({ platform: "pc", tag: "shooter" }));
    expect(r.fallback).toBe(true);
    expect(names(r)).toEqual(["PC Best"]);
  });
});
