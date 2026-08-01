import React, { useState } from 'react';
import { Product, SHOP_CONFIG, getSafeImageUrl } from '../types';
import { ShoppingBag, Eye, MessageCircle, Sparkles, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isInCart?: boolean;
  priority?: boolean;
}

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col animate-pulse">
      {/* Skeleton Image Area */}
      <div className="relative aspect-[4/3] bg-gray-200/90 flex items-center justify-center overflow-hidden">
        <div className="w-10 h-10 rounded-full bg-gray-300/60 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-gray-400/60" />
        </div>
      </div>

      {/* Skeleton Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Category Tag skeleton */}
          <div className="h-3.5 w-24 bg-gray-200 rounded-md" />

          {/* Title skeleton */}
          <div className="h-5 w-4/5 bg-gray-200/90 rounded-md" />

          {/* Description line 1 & 2 skeleton */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3.5 w-full bg-gray-200/70 rounded" />
            <div className="h-3.5 w-3/4 bg-gray-200/70 rounded" />
          </div>

          {/* Notes pills skeleton */}
          <div className="flex gap-1.5 pt-1">
            <div className="h-4.5 w-14 bg-gray-200/80 rounded-md" />
            <div className="h-4.5 w-16 bg-gray-200/80 rounded-md" />
            <div className="h-4.5 w-12 bg-gray-200/80 rounded-md" />
          </div>
        </div>

        {/* Price & Buttons skeleton */}
        <div className="pt-3 border-t border-gray-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="h-6 w-20 bg-gray-200 rounded-md" />
            <div className="h-4 w-12 bg-gray-100 rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="h-9 bg-gray-200 rounded-xl" />
            <div className="h-9 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isInCart,
  priority = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const whatsappMsg = encodeURIComponent(
    `مرحباً عطور بيت العرب، أود طلب المنتج:\n• *${product.name}*\n• السعر: ${product.price} درهم\n${product.volume ? `• الحجم/الوزن: ${product.volume}\n` : ''}الرجاء تأكيد الطلب والتوصيل.`
  );

  const directWhatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {/* Skeleton while image is loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200/90 animate-pulse flex items-center justify-center z-10">
            <div className="w-8 h-8 rounded-full bg-gray-300/50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#8C7342]/40" />
            </div>
          </div>
        )}

        <img
          src={getSafeImageUrl(product.image)}
          alt={product.name}
          className={`w-full h-full object-cover object-center group-hover:scale-108 transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? "eager" : "lazy"}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageLoaded(true);
            // Fallback placeholder image if URL fails
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80';
          }}
          {...(priority ? { fetchPriority: 'high' as any } : {})}
        />

        {/* Overlay Dark Blur Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between pointer-events-none">
          {product.isFeatured ? (
            <span className="gold-gradient text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> مميز
            </span>
          ) : product.originalPrice && product.originalPrice > product.price ? (
            <span className="bg-[#8C7342] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              تخفيض
            </span>
          ) : (
            <span />
          )}

          {product.volume && (
            <span className="bg-[#1A1A1A]/80 backdrop-blur-md text-[#FAF9F6] text-[11px] font-medium px-2.5 py-1 rounded-full shadow">
              {product.volume}
            </span>
          )}
        </div>

        {/* Quick View Hover Button */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute bottom-3 right-3 left-3 bg-white/95 hover:bg-white text-[#1A1A1A] py-2 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
        >
          <Eye className="w-3.5 h-3.5 text-[#8C7342]" />
          <span>معاينة التفاصيل</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Notes or Category tag */}
          <div className="flex items-center gap-1 text-[11px] text-[#8C7342] font-semibold mb-1">
            {product.category === 'perfumes' && '✨ عطور وعود'}
            {product.category === 'incense' && '💨 بخور'}
            {product.category === 'clothes' && '👗 ملابس'}
            {product.category === 'oils' && '🌿 زيوت طبيعية'}
            {product.category === 'other' && '✨ منتجات أخرى'}
          </div>

          <h3 className="font-display font-bold text-base text-[#1A1A1A] line-clamp-1 group-hover:text-[#8C7342] transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>

          {/* Notes Pills if available */}
          {product.notes && product.notes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.notes.slice(0, 3).map((note, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-md"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-gray-200 space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-extrabold text-lg text-[#1A1A1A]">
                {product.price}{' '}
                <span className="text-xs font-normal text-[#8C7342]">درهم</span>
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through">
                  {product.originalPrice} درهم
                </span>
              )}
            </div>
          </div>

          {/* Buttons: WhatsApp Direct & Add to Order List */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#128C7E] hover:bg-[#075E54] text-white py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
              title="طلب مباشر عبر واتساب"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>طلب بالواتساب</span>
            </a>

            <button
              onClick={() => onAddToCart(product)}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                isInCart
                  ? 'bg-[#1E5C48] text-white shadow-inner'
                  : 'bg-gray-100 hover:bg-[#8C7342] text-[#1A1A1A] hover:text-white'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>في السلة</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>إضافة للسلة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
