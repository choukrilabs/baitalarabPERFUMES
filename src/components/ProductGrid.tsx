import React, { useState, useMemo } from 'react';
import { Product, CartItem } from '../types';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';
import { Search, SlidersHorizontal, PackageX, Sparkles } from 'lucide-react';

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
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  const cartProductIds = useMemo(
    () => new Set(cartItems.map((item) => item.product.id)),
    [cartItems]
  );

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.active);

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.notes && p.notes.some((n) => n.toLowerCase().includes(q)))
      );
    }

    // Sort
    return list.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'featured') {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
      }
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="catalog" className="py-12 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Header Selector */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          products={products}
        />

        {/* Search & Sort Controls Bar */}
        <div className="mt-6 mb-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن عطر، بخور، زيوت طبيعية، ملابس..."
              className="w-full bg-[#FAF9F6] border border-gray-200 focus:border-[#8C7342] rounded-xl pr-10 pl-4 py-2.5 text-sm text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8C7342]/20 transition-all"
            />
            <Search className="w-4 h-4 text-[#8C7342] absolute right-3.5 top-3 pointer-events-none" />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C7342]">
              <SlidersHorizontal className="w-4 h-4" />
              <span>ترتيب حسب:</span>
            </div>

            <label htmlFor="sort-select" className="sr-only">ترتيب المنتجات</label>
            <select
              id="sort-select"
              aria-label="ترتيب المنتجات"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF9F6] border border-gray-200 text-[#1A1A1A] text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-[#8C7342] cursor-pointer"
            >
              <option value="featured">المميزة والأكثر مبيعاً</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>

        {/* Product Grid / Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                isInCart={cartProductIds.has(product.id)}
                priority={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-md mx-auto my-8 space-y-4">
            <div className="w-16 h-16 bg-gray-100 text-[#8C7342] rounded-full flex items-center justify-center mx-auto">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#1A1A1A]">
              لم يتم العثور على نتائج
            </h3>
            <p className="text-sm text-gray-600">
              جرّب التفتيش بكلمات أخرى أو اختر قسم آخر من الأقسام أعلاه.
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                onSelectCategory('all');
              }}
              className="gold-gradient text-white px-6 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-transform"
            >
              عرض جميع المنتجات
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
