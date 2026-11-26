import { describe, expect, it } from "vitest";
import { readCatalog } from "./catalog";

// One raw Sheet row, in header order, as the Sheets API returns it (strings).
function row(fields: Partial<Record<string, string>> = {}): string[] {
  const r = {
    igdb_id: "1",
    slug: "game-2020",
    name: "Game",
    cover_url: "",
    release_date: "2020-01-01",
    platforms: "PC",
    genres: "",
    developer: "",
    description: "",
    critic_rating: "",
    critic_count: "",
    user_rating: "",
    user_count: "",
    last_synced: "",
    tags: "",
    ...fields,
  };
  return Object.values(r) as string[];
}

describe("readCatalog", () => {
  it("pulls a critic rating backed by few reviews toward 70", () => {
    const { games } = readCatalog([row({ critic_rating: "90", critic_count: "10" })]);
    expect(games[0].score).toBe(80);
  });

  it("pulls a user rating toward 70 with a weight of 100", () => {
    const { games } = readCatalog([row({ user_rating: "90", user_count: "100" })]);
    expect(games[0].score).toBe(80);
  });

  it("barely moves a rating backed by many reviews", () => {
    const { games } = readCatalog([row({ user_rating: "90", user_count: "10000" })]);
    expect(games[0].score).toBeCloseTo(89.802, 3);
  });

  it("blends the adjusted critic and user ratings 50/50", () => {
    const { games } = readCatalog([
      row({ critic_rating: "90", critic_count: "10", user_rating: "50", user_count: "100" }),
    ]);
    expect(games[0].score).toBe(70);
    expect(games[0].breakdown).toEqual({
      ratings: [
        { kind: "critic", rating: 90, count: 10, adjusted: 80, share: 0.5 },
        { kind: "user", rating: 50, count: 100, adjusted: 60, share: 0.5 },
      ],
      singleRating: false,
    });
  });

  it("gives a single rating 100% of the weight and flags it", () => {
    const { games } = readCatalog([row({ user_rating: "90", user_count: "100" })]);
    expect(games[0].breakdown).toEqual({
      ratings: [{ kind: "user", rating: 90, count: 100, adjusted: 80, share: 1 }],
      singleRating: true,
    });
  });

  it("marks a Game with no External Ratings as Unscored", () => {
    const { games } = readCatalog([row()]);
    expect(games[0].score).toBeNull();
    expect(games[0].breakdown).toBeNull();
  });

  it("treats a rating with a count of zero as absent", () => {
    const { games } = readCatalog([
      row({ critic_rating: "20", critic_count: "0", user_rating: "90", user_count: "100" }),
    ]);
    expect(games[0].score).toBe(80);
    expect(games[0].breakdown?.singleRating).toBe(true);
  });

  it("treats a rating with a count of zero and no other rating as Unscored", () => {
    const { games } = readCatalog([row({ critic_rating: "90", critic_count: "0" })]);
    expect(games[0].score).toBeNull();
  });

  it("ranks by unrounded Score, breaks ties by name, and lists Unscored Games last by name", () => {
    const game = (n: number, name: string, critic = "") =>
      row({
        igdb_id: String(n),
        slug: name.toLowerCase(),
        name,
        critic_rating: critic,
        critic_count: critic ? "10" : "",
      });
    const { games } = readCatalog([
      game(1, "Echo"),
      game(2, "Charlie", "90"), // 80
      game(3, "Alpha", "89.2"), // 79.6, rounds to 80
      game(4, "Delta"),
      game(5, "Zeta", "90.8"), // 80.4, rounds to 80
      game(6, "Bravo", "90"), // 80
      game(7, "Top", "100"), // 85
    ]);
    expect(games.map((g) => g.name)).toEqual([
      "Top",
      "Zeta",
      "Bravo",
      "Charlie",
      "Alpha",
      "Delta",
      "Echo",
    ]);
  });

  // Rows start at Sheet row 2 (row 1 is the header).
  it("excludes and reports invalid rows while still returning the valid ones", () => {
    const { games, invalidRows } = readCatalog([
      row({ igdb_id: "1", slug: "a", name: "A" }), // row 2
      row({ igdb_id: "2", slug: "b", name: "B", critic_rating: "abc", critic_count: "5" }), // row 3
      [], // row 4: blank, skipped silently
      row({ igdb_id: "3", slug: "c", name: "" }), // row 5
      row({ igdb_id: "4", slug: "a", name: "A again" }), // row 6
      row({ igdb_id: "5", slug: "e", name: "E", last_synced: "2026-11-20T10:00:00Z" }), // row 7
      row({ igdb_id: "5", slug: "f", name: "F" }), // row 8
    ]);
    expect(games.map((g) => g.name)).toEqual(["A", "E"]);
    expect(invalidRows).toEqual([
      { row: 3, reason: 'critic_rating is not a number from 0 to 100: "abc"' },
      { row: 5, reason: "name is missing" },
      { row: 6, reason: 'duplicate slug: "a"' },
      { row: 8, reason: 'duplicate igdb_id: "5"' },
    ]);
  });

  it("looks up a single Game by slug, with its Score Breakdown", () => {
    const { games } = readCatalog(
      [
        row({ igdb_id: "1", slug: "a-2020", name: "A" }),
        row({
          igdb_id: "2",
          slug: "b-2021",
          name: "B",
          critic_rating: "90",
          critic_count: "10",
          user_rating: "50",
          user_count: "100",
        }),
      ],
      { slug: "b-2021" },
    );
    expect(games.map((g) => g.name)).toEqual(["B"]);
    expect(games[0].score).toBe(70);
    expect(games[0].breakdown).toEqual({
      ratings: [
        { kind: "critic", rating: 90, count: 10, adjusted: 80, share: 0.5 },
        { kind: "user", rating: 50, count: 100, adjusted: 60, share: 0.5 },
      ],
      singleRating: false,
    });
  });

  it("finds no Game for an unknown slug or the slug of an invalid row", () => {
    const rows = [
      row({ igdb_id: "1", slug: "a", name: "A" }),
      row({ igdb_id: "2", slug: "bad", name: "" }),
    ];
    expect(readCatalog(rows, { slug: "nope" }).games).toEqual([]);
    expect(readCatalog(rows, { slug: "bad" }).games).toEqual([]);
  });

  it.each([
    [{ igdb_id: "x" }, 'igdb_id is not a positive whole number: "x"'],
    [{ slug: "" }, "slug is missing"],
    [{ slug: "Zelda 2017" }, 'slug is not lowercase kebab-case: "Zelda 2017"'],
    [{ cover_url: "cover.jpg" }, 'cover_url is not an https URL: "cover.jpg"'],
    [{ last_synced: "yesterday" }, 'last_synced is not an ISO datetime: "yesterday"'],
    [{ release_date: "01/02/2020" }, 'release_date is not a YYYY-MM-DD date: "01/02/2020"'],
    [{ user_rating: "120", user_count: "5" }, 'user_rating is not a number from 0 to 100: "120"'],
    [{ user_rating: "80", user_count: "-1" }, 'user_count is not a whole number of 0 or more: "-1"'],
  ])("reports a row with %o", (fields, reason) => {
    const { games, invalidRows } = readCatalog([row(fields)]);
    expect(games).toEqual([]);
    expect(invalidRows).toEqual([{ row: 2, reason }]);
  });

  describe("Tags", () => {
    it("reads the owner's Tags in the order they were written", () => {
      const { games, unknownTags } = readCatalog([row({ tags: "metroidvania, roguelike" })]);
      expect(games[0].tags).toEqual(["metroidvania", "roguelike"]);
      expect(unknownTags).toEqual([]);
    });

    it("drops an unknown Tag and reports it, but keeps the Game visible", () => {
      const { games, invalidRows, unknownTags } = readCatalog([row({ tags: "cozy, rogelike" })]);
      expect(games[0].tags).toEqual(["cozy"]);
      expect(invalidRows).toEqual([]);
      expect(unknownTags).toEqual([{ row: 2, reason: 'unknown Tag "rogelike" on Game, left out' }]);
    });

    it("reads a row without the tags column as a Game with no Tags", () => {
      const { games } = readCatalog([row().slice(0, 14)]);
      expect(games[0].tags).toEqual([]);
    });
  });

  describe("search and filters", () => {
    const rows = [
      row({ igdb_id: "1", slug: "zelda", name: "The Legend of Zelda", platforms: "Switch", genres: "Adventure, RPG", critic_rating: "95", critic_count: "10" }),
      row({ igdb_id: "2", slug: "zelda-2", name: "Zelda II", platforms: "NES", genres: "RPG", critic_rating: "80", critic_count: "10" }),
      row({ igdb_id: "3", slug: "doom", name: "Doom", platforms: "PC, Switch", genres: "Shooter", critic_rating: "90", critic_count: "10" }),
      row({ igdb_id: "4", slug: "hades", name: "Hades", platforms: "PC, Switch", genres: "RPG" }), // Unscored
    ];
    const names = (query: Parameters<typeof readCatalog>[1]) =>
      readCatalog(rows, query).games.map((g) => g.name);

    it("searches by name, ignoring case and surrounding spaces", () => {
      expect(names({ search: "  zELDa " })).toEqual(["The Legend of Zelda", "Zelda II"]);
    });

    it("filters by Platform, keeping the ranking order", () => {
      expect(names({ platform: "Switch" })).toEqual(["The Legend of Zelda", "Doom", "Hades"]);
    });

    it("filters by Genre, keeping the ranking order", () => {
      expect(names({ genre: "RPG" })).toEqual(["The Legend of Zelda", "Zelda II", "Hades"]);
    });

    it("combines search, Platform and Genre", () => {
      expect(names({ search: "zelda", platform: "Switch", genre: "RPG" })).toEqual(["The Legend of Zelda"]);
      expect(names({ platform: "PC", genre: "RPG" })).toEqual(["Hades"]);
    });

    it("ignores empty values and returns nothing when no Game matches", () => {
      expect(names({ search: "", platform: "", genre: "" })).toHaveLength(4);
      expect(names({ search: "zelda", platform: "PC" })).toEqual([]);
    });
  });
});
