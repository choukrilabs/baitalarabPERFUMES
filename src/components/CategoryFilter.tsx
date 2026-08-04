import React from 'react';
import { CATEGORIES } from '../data/initialCatalog';
import { Product } from '../types';
import { Sparkles, Flame, Shirt, Droplet, Flower2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  products: Product[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  products,
}) => {
  const { t, getCategoryName, isFrench } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Shirt':
        return <Shirt className="w-5 h-5" />;
      case 'Droplet':
        return <Droplet className="w-5 h-5" />;
      case 'Flower2':
        return <Flower2 className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return products.filter((p) => p.active).length;
    return products.filter((p) => p.active && p.category === catId).length;
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1A1A1A] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#8C7342]" />
          <span>{t('category.browse_title')}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = getCategoryCount(cat.id);
          const categoryTitle = getCategoryName(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 text-center relative group ${
                isSelected
                  ? 'bg-[#1A1A1A] text-[#FAF9F6] border-[#8C7342] shadow-xl scale-[1.02]'
                  : 'bg-white text-[#1A1A1A] border-gray-200 hover:border-[#8C7342]/50 hover:bg-[#F5F5F5] shadow-sm'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isSelected
                    ? 'gold-gradient text-white shadow-md'
                    : 'bg-gray-100 text-[#8C7342]'
                }`}
              >
                {getIcon(cat.iconName)}
              </div>

              <span className="font-bold text-sm sm:text-base mb-1">{categoryTitle}</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  isSelected
                    ? 'bg-[#2A2A2A] text-[#8C7342]'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count} {isFrench ? (count > 1 ? 'articles' : 'article') : 'منتج'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
