import { Product } from '../types/product';

export interface SearchOptions {
  includeHidden?: boolean;
}

export interface ScoredProduct {
  product: Product;
  score: number;
}

/**
 * Normalizes text for search matching (lowercased, accents removed, extra spaces removed).
 */
export function normalizeSearchText(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Tokenizes a query into search keywords.
 */
export function tokenizeQuery(query: string): string[] {
  return normalizeSearchText(query)
    .split(/[\s,+/_-]+/)
    .filter((token) => token.length > 0);
}

/**
 * Comprehensive Product Search Algorithm:
 * - Checks: name, brand, category, subcategory, description, shortDescription, sku, badges
 * - Multi-word & partial word matching (e.g. "Samsung A15" -> matches "Samsung Galaxy A15")
 * - Relevance ranking (Exact title > Title prefix > Brand > Category/Subcategory > SKU/Badges > Description)
 * - Excludes hidden products (unless includeHidden=true for admin)
 * - Retains zero-stock items (they show "Out of Stock" badge on storefront)
 */
export function searchProducts(
  products: Product[],
  rawQuery: string,
  options?: SearchOptions
): Product[] {
  const query = normalizeSearchText(rawQuery);
  if (!query) {
    return options?.includeHidden ? products : products.filter((p) => !p.isHidden);
  }

  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) {
    return options?.includeHidden ? products : products.filter((p) => !p.isHidden);
  }

  const scoredList: ScoredProduct[] = [];

  for (const product of products) {
    if (!options?.includeHidden && product.isHidden) {
      continue;
    }

    const name = normalizeSearchText(product.name);
    const brand = normalizeSearchText(product.brand);
    const category = normalizeSearchText(product.category);
    const subcategory = normalizeSearchText(product.subcategory);
    const sku = normalizeSearchText(product.sku);
    const shortDesc = normalizeSearchText(product.shortDescription);
    const desc = normalizeSearchText(product.description);
    const badges = (product.badges || []).map((b) => normalizeSearchText(b));

    let score = 0;

    // 1. Exact full query matches (Highest Priority)
    if (name === query) score += 1000;
    else if (name.startsWith(query)) score += 500;
    else if (name.includes(query)) score += 300;

    if (brand === query) score += 250;
    else if (brand.includes(query)) score += 150;

    if (sku === query) score += 400;
    else if (sku.includes(query)) score += 120;

    if (category.includes(query) || subcategory.includes(query)) score += 120;
    if (shortDesc.includes(query)) score += 60;
    if (desc.includes(query)) score += 40;

    // 2. Token-level matching (Multi-word partial word matching)
    let matchedTokenCount = 0;

    for (const token of tokens) {
      let tokenMatched = false;

      // Match in Name
      if (name.includes(token)) {
        score += 80;
        tokenMatched = true;
      }
      // Match in Brand
      if (brand.includes(token)) {
        score += 60;
        tokenMatched = true;
      }
      // Match in Category / Subcategory
      if (category.includes(token) || subcategory.includes(token)) {
        score += 45;
        tokenMatched = true;
      }
      // Match in SKU
      if (sku.includes(token)) {
        score += 50;
        tokenMatched = true;
      }
      // Match in Badges
      if (badges.some((b) => b.includes(token))) {
        score += 35;
        tokenMatched = true;
      }
      // Match in Descriptions
      if (shortDesc.includes(token) || desc.includes(token)) {
        score += 20;
        tokenMatched = true;
      }

      if (tokenMatched) {
        matchedTokenCount++;
      }
    }

    // Require either:
    // a) The full query string matched anywhere, OR
    // b) All tokens matched across the product fields, OR
    // c) At least 60% of tokens matched for long queries (3+ tokens)
    const allTokensMatched = matchedTokenCount === tokens.length;
    const partialTokensAcceptable = tokens.length >= 3 && matchedTokenCount / tokens.length >= 0.6;

    if (score > 0 && (allTokensMatched || partialTokensAcceptable || name.includes(query) || brand.includes(query))) {
      // Bonus for matching all tokens
      if (allTokensMatched) score += 100;

      // Slight tie-breaker penalty for out-of-stock items
      if (!product.inStock || product.stock <= 0) {
        score -= 5;
      }

      scoredList.push({ product, score });
    }
  }

  // Sort strictly by relevance score descending
  scoredList.sort((a, b) => b.score - a.score);

  return scoredList.map((item) => item.product);
}
