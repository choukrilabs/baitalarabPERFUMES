import React from 'react';
import { Product, SHOP_CONFIG } from '../types';
import { ShoppingBag, Eye, MessageCircle, Sparkles, Check, Star, Heart } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { useWishlist } from '../context/WishlistContext';

const HighlightText = ({ text, highlight }: { text: string; highlight?: string }) => {
  if (!highlight || !highlight.trim()) return <>{text}</>;
  
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${()|[\]\\]/g, '\\$&');
  };
  
  const regex = new RegExp(`(${escapeRegExp(highlight.trim())})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200 text-yellow-900 px-0.5 rounded-sm">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isInCart?: boolean;
  searchQuery?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isInCart,
  searchQuery,
}) => {
  const { isFavorite, toggleFavorite } = useWishlist();
  const isFav = isFavorite(product.id);

  const whatsappMsg = encodeURIComponent(
    `مرحباً عطور بيت العرب، أود طلب المنتج:
• *${product.name}*
• السعر: ${product.price} درهم
${product.volume ? `• الحجم/الوزن: ${product.volume}
` : ''}الرجاء تأكيد الطلب والتوصيل.`
  );
  
  const directWhatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative">
      {/* Top Image Container */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
        />

        {/* Overlay Dark Blur Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges & Wishlist Button */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            {product.isFeatured ? (
              <span className="gold-gradient text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> مميز
              </span>
            ) : product.originalPrice && product.originalPrice > product.price ? (
              <span className="bg-[#8C7342] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                تخفيض
              </span>
            ) : null}

            {product.volume && (
              <span className="bg-[#1A1A1A]/80 backdrop-blur-md text-[#FAF9F6] text-[11px] font-medium px-2 py-0.5 rounded-full shadow">
                {product.volume}
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product);
            }}
            className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-md ${
              isFav
                ? 'bg-red-50 text-red-500 hover:bg-red-100 scale-105'
                : 'bg-white/85 text-gray-600 hover:bg-white hover:text-red-500 hover:scale-110'
            }`}
            title={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            aria-label="المفضلة"
          >
            <Heart
              className={`w-4 h-4 transition-all ${
                isFav ? 'fill-red-500 text-red-500 scale-110' : ''
              }`}
            />
          </button>
        </div>

        {/* View Product Page Hover Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-3 right-3 left-3 bg-white/95 hover:bg-white text-[#1A1A1A] py-2 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
        >
          <Eye className="w-3.5 h-3.5 text-[#8C7342]" />
          <span>عرض صفحة المنتج</span>
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

          <h3 
            onClick={() => onQuickView(product)}
            className="font-display font-bold text-base text-[#1A1A1A] line-clamp-1 group-hover:text-[#8C7342] transition-colors cursor-pointer"
          >
            <HighlightText text={product.name} highlight={searchQuery} />
          </h3>
          {product.reviews && product.reviews.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
              <span className="text-xs font-bold text-gray-700">
                {(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)}
              </span>
              <span className="text-[10px] text-gray-400">({product.reviews.length})</span>
            </div>
          )}

          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            <HighlightText text={product.description} highlight={searchQuery} />
          </p>

          {/* Notes Pills if available */}
          {product.notes && product.notes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.notes.slice(0, 3).map((note, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-500 text-[10px] font-medium px-2 py-0.5 rounded-md"
                >
                  <HighlightText text={note} highlight={searchQuery} />
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
                <span className="text-xs text-gray-400 line-through">
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
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
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
