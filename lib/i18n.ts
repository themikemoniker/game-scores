// Visitor-facing text in English and Spanish (spec: i18n). The admin page is English-only.

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const hasLocale = (s: string): s is Locale => (LOCALES as readonly string[]).includes(s);

// Each language's name in that language, for the switcher.
export const LOCALE_NAMES: Record<Locale, string> = { en: "English", es: "Español" };

// The first supported language in an Accept-Language header, by preference; English otherwise.
export function pickLocale(acceptLanguage: string | null): Locale {
  const prefs = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { lang: tag.split("-")[0], q: q ? Number(q.slice(2)) : 1 };
    })
    .filter((p) => p.q > 0)
    .sort((a, b) => b.q - a.q);
  return prefs.map((p) => p.lang).find(hasLocale) ?? "en";
}

import type { Tag } from "./catalog";
import type { Era, Family } from "./quiz";

type RatingKind = "critic" | "user";

const en = {
  siteDescription: "A hand-picked Catalog of Games, ranked by their Score.",
  language: "Language",
  // Ranking
  search: "Search",
  platform: "Platform",
  genre: "Genre",
  allPlatforms: "All",
  allGenres: "All",
  filter: "Filter",
  clear: "Clear",
  catalogEmpty: "The Catalog is empty.",
  noMatch: "No Games match your search and filters.",
  clearThem: "Clear them",
  noMatchAfter: " to see the whole ranking.",
  releaseUnknown: "Release date unknown",
  unscored: "Unscored",
  gamesCount: (n: number) => (n === 1 ? "1 Game" : `${n} Games`),
  rankingNote: "Each External Rating is pulled toward 70, then blended into the Score.",
  heatKey: "Score colours",
  ratingShort: { critic: "Critic", user: "Users" } as Record<RatingKind, string>,
  reviewCount: (n: string) => (n === "1" ? "1 review" : `${n} reviews`),
  cover: (name: string) => `${name} cover`,
  noCover: (name: string) => `${name}: no cover`,
  // Game page
  backToRanking: "Ranking",
  released: "Released",
  platforms: "Platforms",
  genres: "Genres",
  developer: "Developer",
  unknown: "Unknown",
  noGenres: "None listed",
  inEnglish: null as string | null,
  score: "Score",
  unscoredExplain: "This Game has no External Ratings yet, so it has no Score.",
  scoreBreakdown: "Score Breakdown",
  breakdownIntro:
    "Each External Rating is pulled toward 70, more strongly the fewer reviews it rests on. The adjusted ratings are then blended into the Score.",
  externalRating: "External Rating",
  rating: "Rating",
  reviews: "Reviews",
  adjusted: "Adjusted",
  shareOfScore: "Share of Score",
  ratingLabels: { critic: "Critic rating", user: "User rating" } as Record<RatingKind, string>,
  singleRating: (missing: string) =>
    `Only one External Rating was used: there is no ${missing} yet, so the Score rests on less data.`,
  lastSynced: "Last synced:",
  never: "never",
  // Not found
  notFound: "Page not found",
  notFoundExplain: "There's no page at this address.",
  genreNames: {} as Record<string, string>,
  tagsLabel: "Tags",
  tagNames: {
    roguelike: "Roguelike",
    metroidvania: "Metroidvania",
    "2d-platformer": "2D platformer",
    "3d-platformer": "3D platformer",
    "open-world": "Open world",
    cozy: "Cozy",
    "story-rich": "Story-rich",
    deckbuilder: "Deckbuilder",
    shooter: "Shooter",
    puzzle: "Puzzle",
  } as Record<Tag, string>,
  quizLink: "Find my next Game",
  quizTitle: "Find your next Game",
  quizIntro: "Three questions. The Catalog answers with up to 3 Matches, and says why each one matched.",
  quizPlatforms: "Where do you play?",
  quizPlatformsHint: "Pick any. None means all of them.",
  quizTags: "What do you feel like?",
  quizTagsHint: "Pick up to 3.",
  quizEra: "New or classic?",
  familyNames: { pc: "PC", playstation: "PlayStation", xbox: "Xbox", nintendo: "Nintendo", mobile: "Mobile" } as Record<
    Family,
    string
  >,
  eraNames: { any: "Either", modern: "Modern (2010 and later)", classic: "Classic (before 2010)" } as Record<Era, string>,
  quizSubmit: "Show my Matches",
  quizPickTag: "Pick at least one Tag to see your Matches.",
  quizTooManyTags: "Only your first 3 Tags count.",
  quizMatches: "Your Matches",
  quizFallback: "No Game fits all of that. These are the best-scored Games on your Platforms instead.",
  quizNothing: "No Game in the Catalog is on those Platforms yet.",
  quizWhy: "Why this match",
  quizStartOver: "Start over",
};

type Dictionary = typeof en;

const es: Dictionary = {
  siteDescription: "Un Catálogo de Juegos elegido a mano, ordenado por su Puntuación.",
  language: "Idioma",
  search: "Buscar",
  platform: "Plataforma",
  genre: "Género",
  allPlatforms: "Todas",
  allGenres: "Todos",
  filter: "Filtrar",
  clear: "Quitar filtros",
  catalogEmpty: "El Catálogo está vacío.",
  noMatch: "Ningún Juego coincide con tu búsqueda y tus filtros.",
  clearThem: "Quítalos",
  noMatchAfter: " para ver la clasificación completa.",
  releaseUnknown: "Fecha de lanzamiento desconocida",
  unscored: "Sin puntuación",
  gamesCount: (n) => (n === 1 ? "1 Juego" : `${n} Juegos`),
  rankingNote: "Cada Valoración externa se acerca a 70 y luego se combina en la Puntuación.",
  heatKey: "Colores de la Puntuación",
  ratingShort: { critic: "Crítica", user: "Usuarios" },
  reviewCount: (n) => (n === "1" ? "1 reseña" : `${n} reseñas`),
  cover: (name) => `Portada de ${name}`,
  noCover: (name) => `${name}: sin portada`,
  backToRanking: "Clasificación",
  released: "Lanzamiento",
  platforms: "Plataformas",
  genres: "Géneros",
  developer: "Desarrollador",
  unknown: "No disponible",
  noGenres: "Ninguno",
  inEnglish: "(en inglés)",
  score: "Puntuación",
  unscoredExplain: "Este Juego aún no tiene Valoraciones externas, así que no tiene Puntuación.",
  scoreBreakdown: "Desglose de la Puntuación",
  breakdownIntro:
    "Cada Valoración externa se acerca a 70, con más fuerza cuantas menos reseñas la respaldan. Después, las valoraciones ajustadas se combinan en la Puntuación.",
  externalRating: "Valoración externa",
  rating: "Valoración",
  reviews: "Reseñas",
  adjusted: "Ajustada",
  shareOfScore: "Peso en la Puntuación",
  ratingLabels: { critic: "Valoración de la crítica", user: "Valoración de los usuarios" },
  singleRating: (missing) =>
    `Solo se usó una Valoración externa: aún no hay ${missing}, así que la Puntuación se apoya en menos datos.`,
  lastSynced: "Última sincronización:",
  never: "nunca",
  notFound: "Página no encontrada",
  notFoundExplain: "No hay ninguna página en esta dirección.",
  // IGDB Genre names. Names missing here (or the same in Spanish) are shown as they come from the Source.
  genreNames: {
    Adventure: "Aventura",
    "Card & Board Game": "Juego de cartas y de mesa",
    Fighting: "Lucha",
    Music: "Música",
    Platform: "De plataformas",
    "Point-and-click": "Aventura gráfica",
    Puzzle: "Puzle",
    "Quiz/Trivia": "Preguntas y respuestas",
    Racing: "Carreras",
    "Real Time Strategy (RTS)": "Estrategia en tiempo real (RTS)",
    "Role-playing (RPG)": "Rol (RPG)",
    Shooter: "Disparos",
    Simulator: "Simulación",
    Sport: "Deportes",
    Strategy: "Estrategia",
    Tactical: "Táctico",
    "Turn-based strategy (TBS)": "Estrategia por turnos (TBS)",
    "Visual Novel": "Novela visual",
  },
  tagsLabel: "Etiquetas",
  tagNames: {
    roguelike: "Roguelike",
    metroidvania: "Metroidvania",
    "2d-platformer": "Plataformas 2D",
    "3d-platformer": "Plataformas 3D",
    "open-world": "Mundo abierto",
    cozy: "Relajado",
    "story-rich": "Gran historia",
    deckbuilder: "Construcción de mazos",
    shooter: "Disparos",
    puzzle: "Puzle",
  },
  quizLink: "Encuentra tu próximo Juego",
  quizTitle: "Encuentra tu próximo Juego",
  quizIntro: "Tres preguntas. El Catálogo responde con hasta 3 Coincidencias y explica por qué encaja cada una.",
  quizPlatforms: "¿Dónde juegas?",
  quizPlatformsHint: "Elige las que quieras. Ninguna significa todas.",
  quizTags: "¿Qué te apetece?",
  quizTagsHint: "Elige hasta 3.",
  quizEra: "¿Nuevo o clásico?",
  familyNames: { pc: "PC", playstation: "PlayStation", xbox: "Xbox", nintendo: "Nintendo", mobile: "Móvil" },
  eraNames: { any: "Me da igual", modern: "Moderno (2010 en adelante)", classic: "Clásico (antes de 2010)" },
  quizSubmit: "Ver mis Coincidencias",
  quizPickTag: "Elige al menos una Etiqueta para ver tus Coincidencias.",
  quizTooManyTags: "Solo cuentan tus 3 primeras Etiquetas.",
  quizMatches: "Tus Coincidencias",
  quizFallback: "Ningún Juego encaja con todo eso. Estos son los Juegos mejor puntuados en tus Plataformas.",
  quizNothing: "Aún no hay ningún Juego del Catálogo en esas Plataformas.",
  quizWhy: "Por qué encaja",
  quizStartOver: "Empezar de nuevo",
};

export const dictionary = (lang: Locale) => ({ en, es })[lang];

export const genreName = (lang: Locale, genre: string) => dictionary(lang).genreNames[genre] ?? genre;
