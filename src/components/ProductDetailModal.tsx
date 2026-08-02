import React from 'react';
import { Product, SHOP_CONFIG, Review, getSafeImageUrl } from '../types';
import { X, MessageCircle, ShoppingBag, ShieldCheck, MapPin, Sparkles, Check, Star } from 'lucide-react';

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    authorName: 'أحمد م.',
    rating: 5,
    comment: 'عطر ممتاز وثباته قوي جداً. أنصح به بشدة!',
    date: 'منذ أسبوعين'
  },
  {
    id: 'r2',
    authorName: 'سارة خ.',
    rating: 4,
    comment: 'رائحة جميلة وفخمة ومميزة.',
    date: 'منذ شهر'
  },
];

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isInCart?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isInCart,
}) => {
  if (!product) return null;

  const whatsappMsg = encodeURIComponent(
    `مرحباً عطور بيت العرب، استفسار عن المنتج:\n• *${product.name}*\n• السعر: ${product.price} درهم\n${product.volume ? `• الحجم: ${product.volume}\n` : ''}يرجى إفادتي بالتفاصيل وطريقة التوصيل.`
  );

  const directWhatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-[#1A1A1A]/80 text-white flex items-center justify-center hover:bg-[#8C7342] transition-colors shadow-md"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Side */}
        <div className="md:w-1/2 bg-gray-100 relative aspect-square md:aspect-auto">
          <img
            src={getSafeImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/dehn_oud_royal.jpg';
            }}
          />
          {product.isFeatured && (
            <span className="absolute top-4 right-4 gold-gradient text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> منتج مميز
            </span>
          )}
        </div>

        {/* Product Information Side */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs text-[#8C7342] font-bold bg-gray-100 px-2.5 py-1 rounded-md inline-block mb-2">
                {product.category === 'perfumes' && 'عطور وعود شرقي'}
                {product.category === 'incense' && 'بخور'}
                {product.category === 'clothes' && 'ملابس'}
                {product.category === 'oils' && 'زيوت طبيعية'}
                {product.category === 'other' && 'منتجات أخرى'}
              </span>

              <h2 className="font-display font-bold text-2xl text-[#1A1A1A]">
                {product.name}
              </h2>

              {product.volume && (
                <p className="text-xs text-gray-600 font-medium mt-1">
                  الحجم/الكمية: {product.volume}
                </p>
              )}
            </div>

            {/* Price Badge */}
            <div className="flex items-baseline gap-3 pb-3 border-b border-gray-200">
              <span className="font-display font-extrabold text-2xl text-[#8C7342]">
                {product.price} <span className="text-sm font-normal text-[#1A1A1A]">درهم مغربي</span>
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {product.originalPrice} درهم
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#8C7342] uppercase tracking-wider">
                الوصف والمميزات:
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Fragrance Notes / Product Specs */}
            {product.notes && product.notes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#8C7342] uppercase tracking-wider">
                  المكونات / النوتات العطرية:
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.notes.map((note, idx) => (
                    <span
                      key={idx}
                      className="bg-[#F5F5F5] text-[#1A1A1A] border border-gray-200 text-xs px-2.5 py-1 rounded-lg font-medium"
                    >
                      • {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="pt-2 flex items-center gap-4 text-xs text-gray-600 border-t border-gray-200">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#8C7342]" />
                <span>ضمان الجودة</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#8C7342]" />
                <span>متجرنا بالحبوس</span>
              </div>
            </div>

            {/* Reviews Section */}
            {product.category === 'perfumes' && (
              <div className="pt-4 space-y-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#8C7342] uppercase tracking-wider">
                    آراء العملاء:
                  </h3>
                  <div className="flex items-center gap-1 text-sm font-bold text-[#1A1A1A]">
                    <span>4.5</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                </div>
                <div className="space-y-3">
                  {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#1A1A1A]">{review.authorName}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{review.comment}</p>
                      <span className="text-[10px] text-gray-400 block mt-1">{review.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>طلب مباشر عبر واتساب</span>
            </a>

            <button
              onClick={() => onAddToCart(product)}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isInCart
                  ? 'bg-[#1E5C48] text-white'
                  : 'bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تمت الإضافة لسلة الطلبات</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#8C7342]" />
                  <span>إضافة لسلة الطلبات</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
