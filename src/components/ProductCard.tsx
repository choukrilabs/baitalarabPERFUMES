import React, { useState } from 'react';
import { Product, SHOP_CONFIG } from '../types';
import { ShoppingBag, Eye, MessageCircle, Sparkles, Check, Star, Heart, Camera, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { useWishlist } from '../context/WishlistContext';
import { buildSingleProductWhatsappMessage, getWhatsappUrl } from '../utils/whatsapp';

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

  // All available angles for this product
  const allImages = React.useMemo(() => {
    if (product.images && product.images.length > 0) {
      // Ensure primary image is at the beginning if not already in images array
      const unique = [product.image, ...product.images.filter(img => img !== product.image)];
      return unique.filter(Boolean);
    }
    return product.image ? [product.image] : [];
  }, [product.image, product.images]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const currentDisplayImage = allImages[activeImageIndex] || product.image;
  const isOutOfStock = product.inStock === false;

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const whatsappMsgText = isOutOfStock
    ? `مرحباً عطور بيت العرب، أود الاستفسار عن موعد توفر منتج:\n• ${product.name} ${product.volume || ''}\n• السعر: ${product.price} MAD\nهل يمكن إشعاري عند توفره؟`
    : buildSingleProductWhatsappMessage(product, 1);
  
  const directWhatsappUrl = getWhatsappUrl(whatsappMsgText);

  const getGenderLabel = (g?: string) => {
    if (g === 'men') return 'رجالي';
    if (g === 'women') return 'نسائي';
    if (g === 'unisex') return 'للجنسين';
    return null;
  };

  return (
    <div className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col group relative ${
      isOutOfStock ? 'border-gray-200 opacity-90' : 'border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1'
    }`}>
      {/* Top Image Container */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer"
      >
        <ProductImage
          src={currentDisplayImage}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-500 ${
            isOutOfStock ? 'grayscale-[35%] opacity-85' : 'group-hover:scale-108 duration-700'
          }`}
        />

        {/* Overlay Dark Blur Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges & Wishlist Button */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex flex-wrap items-center gap-1.5">
            {isOutOfStock ? (
              <span className="bg-rose-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <XCircle className="w-3 h-3" /> نفد من المخزن
              </span>
            ) : product.isFeatured ? (
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

        {/* Multi-angle Indicator & Navigation Arrows on Card */}
        {allImages.length > 1 && (
          <>
            <div className="absolute top-12 right-3 z-10 pointer-events-none">
              <span className="bg-[#1A1A1A]/85 backdrop-blur-sm text-[#FAF9F6] text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                <Camera className="w-3 h-3 text-[#C1841A]" />
                <span>{allImages.length} زوايا للزجاجة</span>
              </span>
            </div>

            {/* Quick Angle switcher arrows */}
            <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              <button
                type="button"
                onClick={handlePrevImage}
                className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-transform active:scale-95"
                title="الزاوية السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-transform active:scale-95"
                title="الزاوية التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Angle dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {allImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === activeImageIndex
                      ? 'bg-[#C1841A] w-3.5'
                      : 'bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* View Product Page Hover Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-3 right-3 left-3 bg-white/95 hover:bg-white text-[#1A1A1A] py-2 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10"
        >
          <Eye className="w-3.5 h-3.5 text-[#8C7342]" />
          <span>عرض تفاصيل المنتج وزوايا العطر</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Notes or Category tag + Gender Pill */}
          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#8C7342] font-semibold mb-1">
            <span className="flex items-center gap-1">
              {product.category === 'perfumes' && '✨ عطور وعود'}
              {product.category === 'incense' && '💨 بخور'}
              {product.category === 'clothes' && '👗 ملابس'}
              {product.category === 'oils' && '🌿 زيوت طبيعية'}
              {product.category === 'wholesale' && '🏢 بيع بالجملة'}
              {product.category === 'other' && '✨ منتجات أخرى'}
            </span>

            {getGenderLabel(product.gender) && (
              <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                {getGenderLabel(product.gender)}
              </span>
            )}
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

            {/* Stock Mini Indicator */}
            {isOutOfStock ? (
              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                غير متوفر
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                متوفر بالمخزن
              </span>
            )}
          </div>

          {/* Buttons: WhatsApp Direct & Add to Order List */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm ${
                isOutOfStock
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-[#25D366] hover:bg-[#20bd5a] text-white'
              }`}
              title={isOutOfStock ? "استفسار عن التوفر عبر واتساب" : "طلب مباشر عبر واتساب"}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? 'استفسر بالواتساب' : 'طلب بالواتساب'}</span>
            </a>

            <button
              onClick={() => !isOutOfStock && onAddToCart(product)}
              disabled={isOutOfStock}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : isInCart
                  ? 'bg-[#1E5C48] text-white shadow-inner'
                  : 'bg-gray-100 hover:bg-[#8C7342] text-[#1A1A1A] hover:text-white'
              }`}
            >
              {isOutOfStock ? (
                <span>نفد من المخزن</span>
              ) : isInCart ? (
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
