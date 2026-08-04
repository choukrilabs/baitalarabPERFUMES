import { Product, CategoryType } from '../types';

/**
 * Normalizes Arabic and multilingual text for resilient fuzzy searching.
 * Removes tashkeel (diacritics), unifies Alef forms, Teh Marbuta, Yeh/Maksura,
 * removes tatweel, trims and lowers case.
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    // Remove Arabic diacritics / tashkeel
    .replace(/[\u064B-\u0652\u0670]/g, '')
    // Remove Tatweel (Kashida)
    .replace(/\u0640/g, '')
    // Normalize Alef variations (أ, إ, آ, ٱ -> ا)
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Teh Marbuta (ة -> ه)
    .replace(/ة/g, 'ه')
    // Normalize Alef Maksura & Persian Yeh (ى, ئ -> ي)
    .replace(/[ىئ]/g, 'ي')
    // Remove common punctuation and special chars for clean tokens
    .replace(/[-_./\\(),+:"'#]/g, ' ')
    // Collapse multiple whitespaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes a fuzzy match score between a candidate text and a search query.
 * Higher score means better match:
 * 100+: Exact or starts-with match
 * 80-99: All query tokens present in candidate
 * 50-79: Partial token or substring match
 * 20-49: Fuzzy character sequence match
 * 0: No match
 */
export function calculateFuzzyScore(target: string, query: string): number {
  if (!target || !query) return 0;

  const normTarget = normalizeSearchText(target);
  const normQuery = normalizeSearchText(query);

  if (!normTarget || !normQuery) return 0;

  // 1. Exact match
  if (normTarget === normQuery) {
    return 120;
  }

  // 2. Starts with query
  if (normTarget.startsWith(normQuery)) {
    return 100 + (normQuery.length / normTarget.length) * 10;
  }

  // 3. Contains full query phrase as contiguous substring
  const subIdx = normTarget.indexOf(normQuery);
  if (subIdx !== -1) {
    // If it occurs at a word boundary, higher score
    const isWordBoundary = subIdx === 0 || normTarget[subIdx - 1] === ' ';
    return (isWordBoundary ? 90 : 75) + (normQuery.length / normTarget.length) * 10;
  }

  // 4. Token-based matching (all query tokens exist in target)
  const targetTokens = normTarget.split(' ').filter(Boolean);
  const queryTokens = normQuery.split(' ').filter(Boolean);

  if (queryTokens.length > 1) {
    let matchedTokensCount = 0;
    for (const qToken of queryTokens) {
      const matchFound = targetTokens.some((tToken) => tToken.includes(qToken) || qToken.includes(tToken));
      if (matchFound) matchedTokensCount++;
    }

    if (matchedTokensCount === queryTokens.length) {
      return 80 + (matchedTokensCount / targetTokens.length) * 10;
    }
    if (matchedTokensCount > 0) {
      return 40 + (matchedTokensCount / queryTokens.length) * 20;
    }
  } else if (queryTokens.length === 1) {
    const singleToken = queryTokens[0];
    for (const tToken of targetTokens) {
      if (tToken.startsWith(singleToken)) {
        return 70 + (singleToken.length / tToken.length) * 10;
      }
      if (tToken.includes(singleToken)) {
        return 55;
      }
    }
  }

  // 5. Subsequence fuzzy match (letters appear in order)
  let qIdx = 0;
  let matches = 0;
  let consecutive = 0;
  let maxConsecutive = 0;

  for (let tIdx = 0; tIdx < normTarget.length && qIdx < normQuery.length; tIdx++) {
    if (normTarget[tIdx] === normQuery[qIdx]) {
      qIdx++;
      matches++;
      consecutive++;
      if (consecutive > maxConsecutive) maxConsecutive = consecutive;
    } else {
      consecutive = 0;
    }
  }

  if (matches === normQuery.length) {
    // All characters of query found in order in target
    const coverage = matches / normTarget.length;
    return 30 + maxConsecutive * 5 + coverage * 15;
  }

  // If query is 3+ characters and matches at least 80% in order
  if (normQuery.length >= 3 && matches / normQuery.length >= 0.75) {
    return 20 + matches * 2;
  }

  return 0;
}

export interface ProductMatchResult {
  product: Product;
  score: number;
  matchedFields: ('name' | 'category' | 'notes' | 'description' | 'productType')[];
}

export interface CategorySuggestion {
  id: string;
  name: string;
  count: number;
  categoryKey?: CategoryType | 'all';
}

export interface NoteSuggestion {
  note: string;
  count: number;
}

export interface SearchSuggestionsResult {
  matchedProducts: ProductMatchResult[];
  matchedCategories: CategorySuggestion[];
  matchedNotes: NoteSuggestion[];
  totalMatches: number;
}

const CATEGORY_NAMES_MAP: Record<string, string> = {
  perfumes: 'العطور الشرقية الفاخرة',
  oils: 'الزيوت الطبيعية وأدهان العود',
  incense: 'البخور والمعمول والمباخر',
  clothes: 'الملابس والأزياء التقليدية',
  wholesale: 'البيع بالجملة',
  other: 'منتجات أخرى',
};

/**
 * Scans products and extracts real-time fuzzy matching suggestions
 */
export function getSearchSuggestions(
  products: Product[],
  query: string,
  maxProductResults = 5,
  maxCategoryResults = 3,
  maxNoteResults = 4
): SearchSuggestionsResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      matchedProducts: [],
      matchedCategories: [],
      matchedNotes: [],
      totalMatches: 0,
    };
  }

  const activeProducts = products.filter((p) => p.active !== false);

  // 1. Score and filter products
  const scoredProducts: ProductMatchResult[] = [];

  for (const product of activeProducts) {
    const matchedFields: ('name' | 'category' | 'notes' | 'description' | 'productType')[] = [];
    let maxScore = 0;

    // Name score (weight x 1.4)
    const nameScore = calculateFuzzyScore(product.name, trimmed) * 1.4;
    if (nameScore > 0) {
      maxScore = Math.max(maxScore, nameScore);
      matchedFields.push('name');
    }

    // Category score
    const catName = CATEGORY_NAMES_MAP[product.category] || product.category;
    const catScore = calculateFuzzyScore(catName, trimmed);
    if (catScore > 0) {
      maxScore = Math.max(maxScore, catScore);
      matchedFields.push('category');
    }

    // Product Type score
    if (product.productType) {
      const typeScore = calculateFuzzyScore(product.productType, trimmed);
      if (typeScore > 0) {
        maxScore = Math.max(maxScore, typeScore);
        matchedFields.push('productType');
      }
    }

    // Notes score
    if (product.notes && product.notes.length > 0) {
      let bestNoteScore = 0;
      for (const note of product.notes) {
        const nScore = calculateFuzzyScore(note, trimmed);
        if (nScore > bestNoteScore) bestNoteScore = nScore;
      }
      if (bestNoteScore > 0) {
        maxScore = Math.max(maxScore, bestNoteScore * 1.1);
        matchedFields.push('notes');
      }
    }

    // Description score
    if (product.description) {
      const descScore = calculateFuzzyScore(product.description, trimmed) * 0.7;
      if (descScore > 30) {
        maxScore = Math.max(maxScore, descScore);
        matchedFields.push('description');
      }
    }

    if (maxScore >= 25) {
      // Boost featured and in-stock items slightly
      let finalScore = maxScore;
      if (product.isFeatured) finalScore += 5;
      if (product.inStock !== false) finalScore += 3;

      scoredProducts.push({
        product,
        score: finalScore,
        matchedFields,
      });
    }
  }

  // Sort descending by match score
  scoredProducts.sort((a, b) => b.score - a.score);

  // 2. Extract Matching Categories
  const categoryCounts: Record<string, number> = {};
  for (const p of activeProducts) {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  }

  const matchedCategories: CategorySuggestion[] = [];
  for (const [catKey, count] of Object.entries(categoryCounts)) {
    const arabicName = CATEGORY_NAMES_MAP[catKey] || catKey;
    const catScore = Math.max(
      calculateFuzzyScore(arabicName, trimmed),
      calculateFuzzyScore(catKey, trimmed)
    );
    if (catScore > 20) {
      matchedCategories.push({
        id: catKey,
        name: arabicName,
        count,
        categoryKey: catKey as CategoryType,
      });
    }
  }

  // 3. Extract Matching Scent Notes
  const noteCounts: Record<string, number> = {};
  for (const p of activeProducts) {
    if (p.notes && Array.isArray(p.notes)) {
      for (const note of p.notes) {
        const cleanNote = note.trim();
        if (cleanNote) {
          noteCounts[cleanNote] = (noteCounts[cleanNote] || 0) + 1;
        }
      }
    }
  }

  const matchedNotes: NoteSuggestion[] = [];
  for (const [note, count] of Object.entries(noteCounts)) {
    const nScore = calculateFuzzyScore(note, trimmed);
    if (nScore >= 30) {
      matchedNotes.push({ note, count });
    }
  }
  matchedNotes.sort((a, b) => b.count - a.count);

  return {
    matchedProducts: scoredProducts.slice(0, maxProductResults),
    matchedCategories: matchedCategories.slice(0, maxCategoryResults),
    matchedNotes: matchedNotes.slice(0, maxNoteResults),
    totalMatches: scoredProducts.length,
  };
}

/**
 * Curated list of popular / trending searches to suggest when input is empty or focused
 */
export const POPULAR_SEARCH_SUGGESTIONS = [
  { label: 'دهن عود كمبودي ملكي', category: 'oils', query: 'عود كمبودي' },
  { label: 'المسك الأبيض الصافي', category: 'oils', query: 'مسك أبيض' },
  { label: 'بخور ومعمول شرقي فاخر', category: 'incense', query: 'بخور' },
  { label: 'عطور شرقية رجالية فخمة', category: 'perfumes', query: 'عطر رجالي' },
  { label: 'مخلطات وعطور العرائس', category: 'perfumes', query: 'مخلط' },
  { label: 'زيوت طبيعية وعناية', category: 'oils', query: 'زيت طبيعي' },
];
