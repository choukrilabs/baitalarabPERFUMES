import React, { useMemo } from 'react';
import { Product, CategoryType } from '../types';
import {
  getSearchSuggestions,
  POPULAR_SEARCH_SUGGESTIONS,
  normalizeSearchText,
} from '../utils/fuzzySearch';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  Search,
  Tag,
  Flame,
  ArrowLeft,
  Package,
  Layers,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ProductImage } from './ProductImage';

interface SearchSuggestionsDropdownProps {
  query: string;
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryKey: string) => void;
  onApplyQuery: (query: string) => void;
  selectedIndex?: number;
}

/**
 * Text component that highlights characters matching the normalized search query
 */
export const HighlightFuzzyText: React.FC<{ text: string; query?: string; className?: string }> = ({
  text,
  query,
  className = '',
}) => {
  if (!query || !query.trim() || !text) {
    return <span className={className}>{text}</span>;
  }

  const normQuery = normalizeSearchText(query);
  const normText = normalizeSearchText(text);

  // Exact or normalized substring match check
  const subIdx = normText.indexOf(normQuery);
  if (subIdx !== -1 && normQuery.length > 1) {
    // Attempt approximate substring slicing
    const start = Math.max(0, subIdx);
    const end = Math.min(text.length, start + normQuery.length);

    const before = text.substring(0, start);
    const matched = text.substring(start, end);
    const after = text.substring(end);

    return (
      <span className={className}>
        {before}
        <mark className="bg-amber-200 text-amber-950 font-bold px-0.5 rounded-xs">{matched}</mark>
        {after}
      </span>
    );
  }

  // Fallback simple token regex match
  const words = query.trim().split(/\s+/).filter(Boolean);
  const pattern = words.map((w) => w.replace(/[.*+?^${()|[\]\\]/g, '\\$&')).join('|');
  if (!pattern) return <span className={className}>{text}</span>;

  try {
    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(regex);
    return (
      <span className={className}>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-amber-200 text-amber-950 font-bold px-0.5 rounded-xs">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  } catch {
    return <span className={className}>{text}</span>;
  }
};

export const SearchSuggestionsDropdown: React.FC<SearchSuggestionsDropdownProps> = ({
  query,
  products,
  isOpen,
  onClose,
  onSelectProduct,
  onSelectCategory,
  onApplyQuery,
}) => {
  const { t, isFrench, getCategoryName } = useLanguage();

  const suggestions = useMemo(() => {
    return getSearchSuggestions(products, query, 5, 3, 4);
  }, [products, query]);

  if (!isOpen) return null;

  const isQueryEmpty = !query.trim();
  const hasMatches =
    suggestions.matchedProducts.length > 0 ||
    suggestions.matchedCategories.length > 0 ||
    suggestions.matchedNotes.length > 0;

  const popularSearches = isFrench
    ? [
        { label: 'Oud Royal', query: 'عود' },
        { label: 'Musc Blanc', query: 'مسك' },
        { label: 'Bakhoor & Encens', query: 'بخور', category: 'incense' },
        { label: 'Parfum Homme', query: 'رجالي' },
        { label: 'Huile Dahn Al Oud', query: 'دهن عود' },
      ]
    : POPULAR_SEARCH_SUGGESTIONS;

  const quickNavCategories = [
    { id: 'perfumes', name: getCategoryName('perfumes'), icon: '✨' },
    { id: 'oils', name: getCategoryName('oils'), icon: '👑' },
    { id: 'incense', name: getCategoryName('incense'), icon: '🔥' },
    { id: 'clothes', name: getCategoryName('clothes'), icon: '👘' },
    { id: 'wholesale', name: getCategoryName('wholesale'), icon: '📦' },
    { id: 'all', name: getCategoryName('all'), icon: '🌸' },
  ];

  return (
    <div
      id="search-suggestions-dropdown"
      className={`absolute top-full right-0 left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200/90 overflow-hidden ${
        isFrench ? 'text-left' : 'text-right'
      } animate-fadeIn`}
      style={{ maxHeight: 'min(80vh, 520px)' }}
    >
      <div className="overflow-y-auto max-h-[min(78vh,500px)] p-2 sm:p-3 divide-y divide-gray-100">
        {/* CASE 1: Empty Query - Show Trending Searches & Quick Navigation */}
        {isQueryEmpty && (
          <div className="p-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{isFrench ? 'Recherches populaires' : 'عمليات البحث الأكثر طلباً'}</span>
              </span>
              <span className="text-[10px] text-gray-400">
                {isFrench ? 'Cliquez pour rechercher' : 'انقر للبحث الفوري'}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {popularSearches.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onApplyQuery(item.query);
                    if (item.category && item.category !== 'all') {
                      onSelectCategory(item.category);
                    }
                    onClose();
                  }}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F6] hover:bg-[#8C7342]/10 border border-gray-200 hover:border-[#8C7342]/40 text-xs font-medium text-gray-700 hover:text-[#8C7342] transition-all"
                >
                  <Search className="w-3 h-3 text-gray-400 group-hover:text-[#8C7342]" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-500 block mb-2">
                {isFrench ? 'Parcourir les catégories principales :' : 'تصفح الأقسام الرئيسية:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {quickNavCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onApplyQuery('');
                      onClose();
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl bg-gray-50 hover:bg-[#8C7342]/10 text-xs text-gray-800 hover:text-[#8C7342] transition-all ${
                      isFrench ? 'text-left' : 'text-right'
                    } font-medium`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: Active Query with Matches */}
        {!isQueryEmpty && hasMatches && (
          <>
            {/* 1. Matched Categories & Notes Pills */}
            {(suggestions.matchedCategories.length > 0 || suggestions.matchedNotes.length > 0) && (
              <div className="pb-3 space-y-2">
                {/* Category suggestions */}
                {suggestions.matchedCategories.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mb-1.5">
                      <Tag className="w-3 h-3 text-[#8C7342]" />
                      <span>{isFrench ? 'Catégories correspondantes :' : 'أقسام وفئات مطابقة:'}</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.matchedCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            onSelectCategory(cat.id);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-xs font-semibold transition-all hover:scale-102"
                        >
                          <HighlightFuzzyText text={getCategoryName(cat.id)} query={query} />
                          <span className="text-[10px] bg-amber-200/70 text-amber-950 px-1.5 py-0.2 rounded-full">
                            {cat.count} {isFrench ? 'produits' : 'منتج'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scent notes suggestions */}
                {suggestions.matchedNotes.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 mb-1.5">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{isFrench ? 'Notes et ingrédients olfactifs :' : 'نوتات ومكونات عطرية:'}</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.matchedNotes.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            onApplyQuery(item.note);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 text-xs font-semibold transition-all hover:scale-102"
                        >
                          <span>🌸</span>
                          <HighlightFuzzyText text={item.note} query={query} />
                          <span className="text-[10px] bg-emerald-200/70 text-emerald-950 px-1.5 py-0.2 rounded-full">
                            {item.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Matched Products List */}
            {suggestions.matchedProducts.length > 0 && (
              <div className="py-2.5 space-y-1.5">
                <div className="flex items-center justify-between px-1 mb-1">
                  <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#8C7342]" />
                    <span>{isFrench ? 'Produits suggérés' : 'المنتجات المقترحة'}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-mono">
                      {suggestions.totalMatches}
                    </span>
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {isFrench ? 'Aperçu rapide' : 'انقر للمعاينة الفورية'}
                  </span>
                </div>

                <div className="space-y-1">
                  {suggestions.matchedProducts.map(({ product, matchedFields }) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className={`w-full group flex items-center justify-between p-2 rounded-xl hover:bg-amber-50/60 border border-transparent hover:border-amber-200/70 transition-all ${
                        isFrench ? 'text-left' : 'text-right'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Thumbnail */}
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 border border-gray-200/80 shrink-0 relative">
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>

                        {/* Details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#8C7342] truncate">
                              <HighlightFuzzyText text={product.name} query={query} />
                            </h4>
                            {product.volume && (
                              <span className="text-[10px] text-gray-400">({product.volume})</span>
                            )}
                          </div>

                          {/* Matching note hint if matched by notes */}
                          {matchedFields.includes('notes') && product.notes && (
                            <p className="text-[10px] text-emerald-700 truncate mt-0.5">
                              {isFrench ? 'Notes: ' : 'نوتات: '}{' '}
                              <HighlightFuzzyText text={product.notes.join(' • ')} query={query} />
                            </p>
                          )}

                          {/* Category or Type */}
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">
                            {product.productType || getCategoryName(product.category)}
                          </p>
                        </div>
                      </div>

                      {/* Price & Action Badge */}
                      <div className={`flex flex-col ${isFrench ? 'items-end pr-1' : 'items-end pl-1'} shrink-0`}>
                        <span className="text-xs font-bold text-[#8C7342]">
                          {product.price} <span className="text-[9px]">{t('product.currency')}</span>
                        </span>
                        {product.inStock === false ? (
                          <span className="text-[9px] text-rose-600 flex items-center gap-0.5">
                            <XCircle className="w-2.5 h-2.5" /> {t('product.out_of_stock')}
                          </span>
                        ) : (
                          <span className="text-[9px] text-emerald-600 flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> {t('product.in_stock')}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Footer Callout: View all results in grid */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#FAF9F6] hover:bg-[#8C7342]/15 text-[#8C7342] font-bold text-xs flex items-center justify-between transition-colors border border-[#8C7342]/20"
              >
                <div className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  <span>
                    {isFrench
                      ? `Voir tous les résultats (${suggestions.totalMatches} produits) pour "${query}"`
                      : `عرض جميع النتائج (${suggestions.totalMatches} منتج) لكلمة "${query}"`}
                  </span>
                </div>
                {isFrench ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
          </>
        )}

        {/* CASE 3: Active Query with NO matches */}
        {!isQueryEmpty && !hasMatches && (
          <div className="p-4 text-center space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700">
                {isFrench
                  ? `Aucun résultat direct pour "${query}"`
                  : `لم نعثر على تطابق مباشر لكلمة "${query}"`}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {isFrench
                  ? 'Essayez avec un mot-clé général : Oud, Musc, Bakhoor, Parfum Homme, ou explorez les catégories.'
                  : 'جرّب البحث بكلمة عامة أخرى مثل: عود، مسك، بخور، عطر رجالي، أو تصفح الأقسام أدناه.'}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {(isFrench
                ? ['Oud Cambodi', 'Musc', 'Bakhoor', 'Parfum Oriental']
                : ['عود كمبودي', 'مسك', 'بخور', 'عطر شرقي']
              ).map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    onApplyQuery(term);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-[#8C7342]/10 text-xs text-gray-700 hover:text-[#8C7342] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
