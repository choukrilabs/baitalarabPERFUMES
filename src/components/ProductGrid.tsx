import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product, CartItem, SHOP_CONFIG } from '../types';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';
import { SearchSuggestionsDropdown } from './SearchSuggestionsDropdown';
import { calculateFuzzyScore } from '../utils/fuzzySearch';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  SlidersHorizontal,
  PackageX,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Check,
  LayoutGrid,
  List,
  Flame,
  ArrowUpDown,
  RotateCcw,
  MessageCircle,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { WHATSAPP_TRUST_BANNER } from '../utils/whatsapp';

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  cartItems: CartItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onQuickView,
  onAddToCart,
  cartItems,
  searchQuery,
  onSearchChange,
}) => {
  const { t, isFrench, getCategoryName } = useLanguage();

  // Advanced Filter States
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women' | 'unisex'>('all');
  const [pricePreset, setPricePreset] = useState<'all' | 'under150' | '150-300' | '300-600' | 'above600' | 'custom'>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'onSale'>('all');

  // Search Suggestions State
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Display & Navigation States
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  const cartProductIds = useMemo(
    () => new Set(cartItems.map((item) => item.product.id)),
    [cartItems]
  );

  // Available Product Types dynamically extracted + predefined standard types
  const availableProductTypes = useMemo(() => {
    const types = new Set<string>();
    products.forEach((p) => {
      if (p.productType && p.productType.trim()) {
        types.add(p.productType.trim());
      }
    });
    return Array.from(types);
  }, [products]);

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedGender !== 'all') count++;
    if (pricePreset !== 'all') count++;
    if (selectedType !== 'all') count++;
    if (stockFilter !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedCategory, selectedGender, pricePreset, selectedType, stockFilter, searchQuery]);

  // Reset all filters
  const handleResetAllFilters = () => {
    onSelectCategory('all');
    setSelectedGender('all');
    setPricePreset('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedType('all');
    setStockFilter('all');
    onSearchChange('');
    setCurrentPage(1);
  };

  // Main Filter Logic with Fuzzy Matching
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.active);

    // 1. Category Filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // 2. Search Query with Fuzzy Matching (name, notes, productType, description, category)
    const q = searchQuery.trim();
    let productScores = new Map<string, number>();

    if (q) {
      list = list.filter((p) => {
        // Name score
        const nameScore = calculateFuzzyScore(p.name, q) * 1.4;
        
        // Notes score
        let bestNoteScore = 0;
        if (p.notes && p.notes.length > 0) {
          for (const n of p.notes) {
            const sc = calculateFuzzyScore(n, q);
            if (sc > bestNoteScore) bestNoteScore = sc;
          }
        }

        // Product type score
        const typeScore = p.productType ? calculateFuzzyScore(p.productType, q) : 0;
        
        // Description score
        const descScore = p.description ? calculateFuzzyScore(p.description, q) * 0.7 : 0;

        // Category score
        const catScore = p.category ? calculateFuzzyScore(p.category, q) * 0.8 : 0;

        const maxScore = Math.max(nameScore, bestNoteScore * 1.1, typeScore, descScore, catScore);

        if (maxScore >= 25) {
          productScores.set(p.id, maxScore);
          return true;
        }
        return false;
      });
    }

    // 3. Gender Filter
    if (selectedGender !== 'all') {
      list = list.filter((p) => {
        if (!p.gender) return selectedGender === 'unisex';
        return p.gender === selectedGender;
      });
    }

    // 4. Product Type Filter
    if (selectedType !== 'all') {
      list = list.filter((p) => p.productType === selectedType);
    }

    // 5. Stock Status & Sale Filter
    if (stockFilter === 'inStock') {
      list = list.filter((p) => p.inStock !== false);
    } else if (stockFilter === 'onSale') {
      list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // 6. Price Filter
    if (pricePreset === 'under150') {
      list = list.filter((p) => p.price < 150);
    } else if (pricePreset === '150-300') {
      list = list.filter((p) => p.price >= 150 && p.price <= 300);
    } else if (pricePreset === '300-600') {
      list = list.filter((p) => p.price >= 300 && p.price <= 600);
    } else if (pricePreset === 'above600') {
      list = list.filter((p) => p.price > 600);
    } else if (pricePreset === 'custom') {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      list = list.filter((p) => p.price >= min && p.price <= max);
    }

    // 7. Sort
    return list.sort((a, b) => {
      // If user is actively searching and featured sort is selected, rank by fuzzy match score first
      if (q && sortBy === 'featured') {
        const scoreA = productScores.get(a.id) || 0;
        const scoreB = productScores.get(b.id) || 0;
        if (Math.abs(scoreA - scoreB) > 5) {
          return scoreB - scoreA;
        }
      }

      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') {
        const aRating = a.reviews && a.reviews.length ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length : 0;
        const bRating = b.reviews && b.reviews.length ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length : 0;
        return bRating - aRating;
      }
      if (sortBy === 'newest') {
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      }
      if (sortBy === 'featured') {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
      }
      return 0;
    });
  }, [
    products,
    selectedCategory,
    searchQuery,
    selectedGender,
    selectedType,
    stockFilter,
    pricePreset,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const catalogElement = document.getElementById('catalog-products-top');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="catalog" className="py-10 bg-[#FAF9F6]" dir={isFrench ? 'ltr' : 'rtl'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Header Selector */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            onSelectCategory(cat);
            setCurrentPage(1);
          }}
          products={products}
        />

        <div id="catalog-products-top" className="scroll-mt-20" />

        {/* Search, Filter Bar & Toolbar */}
        <div className="mt-6 mb-6 bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
            
            {/* Search Input Box with Real-Time Suggestions */}
            <div ref={searchContainerRef} className="relative w-full lg:w-96">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSuggestionsOpen(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSuggestionsOpen(true);
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsSuggestionsOpen(false);
                  } else if (e.key === 'Enter') {
                    setIsSuggestionsOpen(false);
                    setCurrentPage(1);
                  }
                }}
                placeholder={isFrench ? "Rechercher parfum, oud, encens, notes..." : "ابحث عن اسم عطر، نوتات عطرية، دهن عود..."}
                className="w-full bg-[#FAF9F6] border border-gray-200 focus:border-[#8C7342] rounded-2xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8C7342]/20 transition-all"
              />
              <Search className="w-4 h-4 text-[#8C7342] absolute right-3.5 top-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    setIsSuggestionsOpen(false);
                  }}
                  className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Real-time Fuzzy Matching Suggestions Dropdown */}
              <SearchSuggestionsDropdown
                query={searchQuery}
                products={products}
                isOpen={isSuggestionsOpen}
                onClose={() => setIsSuggestionsOpen(false)}
                onSelectProduct={(prod) => {
                  setIsSuggestionsOpen(false);
                  onQuickView(prod);
                }}
                onSelectCategory={(catKey) => {
                  setIsSuggestionsOpen(false);
                  onSelectCategory(catKey);
                  setCurrentPage(1);
                }}
                onApplyQuery={(q) => {
                  setIsSuggestionsOpen(false);
                  onSearchChange(q);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Quick Actions & Sorting Controls */}
            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5 w-full lg:w-auto">
              {/* Filter Drawer Toggle Button */}
              <button
                type="button"
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm ${
                  isFilterPanelOpen || activeFiltersCount > 0
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-3.5 h-3.5 text-[#C1841A]" />
                <span>{isFrench ? 'Filtres' : 'فلاتر متقدمة'}</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#C1841A] text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-[#FAF9F6] border border-gray-200 rounded-2xl px-3 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#8C7342]" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-[#1A1A1A] text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="featured">{t('filter.sort_featured')}</option>
                  <option value="price-asc">{t('filter.sort_price_asc')}</option>
                  <option value="price-desc">{t('filter.sort_price_desc')}</option>
                  <option value="rating">{t('filter.sort_rating')}</option>
                  <option value="newest">{t('filter.sort_newest')}</option>
                </select>
              </div>

              {/* View Layout Toggle */}
              <div className="hidden sm:flex items-center border border-gray-200 rounded-2xl p-0.5 bg-[#FAF9F6]">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-xl transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-[#8C7342]'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={isFrench ? "Grille" : "شبكة البطاقات"}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  className={`p-1.5 rounded-xl transition-colors ${
                    viewMode === 'compact'
                      ? 'bg-white shadow-sm text-[#8C7342]'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={isFrench ? "Compact" : "عرض مكثف"}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Advanced Filters Drawer Panel */}
          {isFilterPanelOpen && (
            <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn text-xs">
              {/* 1. Gender Filter */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">{t('filter.gender')}:</label>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'all', label: t('filter.gender_all') },
                    { id: 'men', label: t('filter.gender_men') },
                    { id: 'women', label: t('filter.gender_women') },
                    { id: 'unisex', label: t('filter.gender_unisex') },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setSelectedGender(g.id as any);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                        selectedGender === g.id
                          ? 'bg-[#8C7342] text-white shadow-sm'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Price Preset Filter */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">{t('filter.price_range')}:</label>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'all', label: t('filter.price_all') },
                    { id: 'under150', label: '< 150 DH' },
                    { id: '150-300', label: '150-300 DH' },
                    { id: '300-600', label: '300-600 DH' },
                    { id: 'above600', label: '> 600 DH' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPricePreset(p.id as any);
                        setCurrentPage(1);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl font-medium transition-all ${
                        pricePreset === p.id
                          ? 'bg-[#8C7342] text-white shadow-sm'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Product Type Filter */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">{t('filter.type')}:</label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#8C7342]"
                >
                  <option value="all">{t('filter.all_types')}</option>
                  <option value="ماء عطر فاخر (Eau de Parfum)">{isFrench ? "Eau de Parfum" : "ماء عطر فاخر (Eau de Parfum)"}</option>
                  <option value="دهن وزيت عطري مركز">{isFrench ? "Dahn & Huile Concentrée" : "دهن وزيت عطري مركز"}</option>
                  <option value="بخور وعود فاخر">{isFrench ? "Bakhoor & Oud Précieux" : "بخور وعود فاخر"}</option>
                  <option value="أزياء وملابس تقليدية">{isFrench ? "Vêtements Traditionnels" : "أزياء وملابس تقليدية"}</option>
                  <option value="زيوت طبيعية وعناية">{isFrench ? "Huiles Naturelles" : "زيوت طبيعية وعناية"}</option>
                  {availableProductTypes.map((tItem) => (
                    <option key={tItem} value={tItem}>
                      {tItem}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Stock & Offers Filter */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 block">{t('filter.availability')}:</label>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'all', label: t('filter.avail_all') },
                    { id: 'inStock', label: t('filter.avail_instock') },
                    { id: 'onSale', label: t('filter.avail_onsale') },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setStockFilter(s.id as any);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                        stockFilter === s.id
                          ? 'bg-[#8C7342] text-white shadow-sm'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Filter Chips & Clear All */}
          {activeFiltersCount > 0 && (
            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-400 font-medium">{t('filter.active_filters')}:</span>

              {selectedCategory !== 'all' && (
                <span className="bg-[#FAF9F6] border border-[#8C7342]/30 text-[#8C7342] px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold">
                  {isFrench ? 'Catégorie : ' : 'قسم: '} {getCategoryName(selectedCategory)}
                  <button type="button" onClick={() => onSelectCategory('all')}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}

              {selectedGender !== 'all' && (
                <span className="bg-[#FAF9F6] border border-[#8C7342]/30 text-[#8C7342] px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold">
                  {isFrench ? 'Genre : ' : 'الجنس: '} {selectedGender === 'men' ? (isFrench ? 'Homme' : 'رجالي') : selectedGender === 'women' ? (isFrench ? 'Femme' : 'نسائي') : (isFrench ? 'Unisexe' : 'للجنسين')}
                  <button type="button" onClick={() => setSelectedGender('all')}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}

              {pricePreset !== 'all' && (
                <span className="bg-[#FAF9F6] border border-[#8C7342]/30 text-[#8C7342] px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold">
                  {isFrench ? 'Prix : ' : 'السعر: '} {pricePreset}
                  <button type="button" onClick={() => setPricePreset('all')}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}

              {selectedType !== 'all' && (
                <span className="bg-[#FAF9F6] border border-[#8C7342]/30 text-[#8C7342] px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold">
                  {isFrench ? 'Type : ' : 'النوع: '} {selectedType}
                  <button type="button" onClick={() => setSelectedType('all')}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}

              {stockFilter !== 'all' && (
                <span className="bg-[#FAF9F6] border border-[#8C7342]/30 text-[#8C7342] px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold">
                  {isFrench ? 'Statut : ' : 'الحالة: '} {stockFilter === 'inStock' ? t('filter.avail_instock') : t('filter.avail_onsale')}
                  <button type="button" onClick={() => setStockFilter('all')}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="bg-[#FAF9F6] border border-[#8C7342]/30 text-[#8C7342] px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold">
                  {isFrench ? 'Recherche : ' : 'بحث: '} &quot;{searchQuery}&quot;
                  <button type="button" onClick={() => onSearchChange('')}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetAllFilters}
                className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 mr-auto hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('filter.reset')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Count Header */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500">
          <div>
            {isFrench ? (
              <>
                <strong className="text-[#1A1A1A] font-bold text-sm">{filteredProducts.length}</strong>
                <span> produit(s) trouvé(s)</span>
                {filteredProducts.length > itemsPerPage && (
                  <span> (Page {currentPage} sur {totalPages})</span>
                )}
              </>
            ) : (
              <>
                <span>تم العثور على </span>
                <strong className="text-[#1A1A1A] font-bold text-sm">{filteredProducts.length}</strong>
                <span> منتج في الكتالوج</span>
                {filteredProducts.length > itemsPerPage && (
                  <span> (عرض الصفحة {currentPage} من أصل {totalPages})</span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>{isFrench ? 'Par page :' : 'عناصر الصفحة:'}</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 focus:outline-none"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        {/* Product Grid / Empty State */}
        {filteredProducts.length > 0 ? (
          <>
            <div
              className={`grid gap-3.5 sm:gap-6 ${
                viewMode === 'compact'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}
            >
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  isInCart={cartProductIds.has(product.id)}
                  searchQuery={searchQuery}
                />
              ))}
            </div>

            {/* Pagination Controls for Large Catalog Browsability */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
                >
                  {isFrench ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span>{isFrench ? 'Précédent' : 'السابق'}</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      currentPage === pageNum
                        ? 'bg-[#1A1A1A] text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
                >
                  <span>{isFrench ? 'Suivant' : 'التالي'}</span>
                  {isFrench ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-md mx-auto my-8 space-y-4">
            <div className="w-16 h-16 bg-gray-100 text-[#8C7342] rounded-full flex items-center justify-center mx-auto">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#1A1A1A]">
              {t('filter.no_results')}
            </h3>
            <p className="text-sm text-gray-500">
              {t('filter.no_results_desc')}
            </p>
            <button
              onClick={handleResetAllFilters}
              className="gold-gradient text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:scale-105 transition-transform shadow-md"
            >
              {t('filter.reset')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
