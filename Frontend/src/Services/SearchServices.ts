import searchItems, {
  type SearchItem,
  type SearchItemType,
} from "../Data/SearchData";

export interface SearchOptions {
  type?: SearchItemType;
  limit?: number;
}

const normalizeText = (value: string): string => {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
};

const getSearchScore = (item: SearchItem, query: string): number => {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return 0;
  }

  const title = normalizeText(item.title);
  const description = normalizeText(item.description);
  const keywords = item.keywords.map(normalizeText);

  let score = 0;

  // Exact title match
  if (title === normalizedQuery) {
    score += 100;
  }

  // Title starts with query
  if (title.startsWith(normalizedQuery)) {
    score += 70;
  }

  // Title contains query
  if (title.includes(normalizedQuery)) {
    score += 50;
  }

  // Exact keyword match
  if (keywords.some((keyword) => keyword === normalizedQuery)) {
    score += 45;
  }

  // Keyword starts with query
  if (keywords.some((keyword) => keyword.startsWith(normalizedQuery))) {
    score += 30;
  }

  // Keyword contains query
  if (keywords.some((keyword) => keyword.includes(normalizedQuery))) {
    score += 20;
  }

  // Description contains query
  if (description.includes(normalizedQuery)) {
    score += 15;
  }

  return score;
};

export const searchPlanner = (
  query: string,
  options: SearchOptions = {},
): SearchItem[] => {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return [];
  }

  const { type, limit = 8 } = options;

  const results = searchItems
    .filter((item) => {
      if (type && item.type !== type) {
        return false;
      }

      return true;
    })
    .map((item) => ({
      item,
      score: getSearchScore(item, normalizedQuery),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.item.title.localeCompare(b.item.title);
    })
    .slice(0, limit)
    .map(({ item }) => item);

  return results;
};

export const getSearchItemById = (id: string): SearchItem | undefined => {
  return searchItems.find((item) => item.id === id);
};

export const getSearchItemsByType = (type: SearchItemType): SearchItem[] => {
  return searchItems.filter((item) => item.type === type);
};

export const getPopularSearches = (limit = 6): SearchItem[] => {
  return searchItems
    .filter(
      (item) =>
        item.type === "tour" ||
        item.type === "birthday" ||
        item.type === "event" ||
        item.type === "corporate",
    )
    .slice(0, limit);
};

export const hasSearchResults = (query: string): boolean => {
  return searchPlanner(query, { limit: 1 }).length > 0;
};

export default searchPlanner;
