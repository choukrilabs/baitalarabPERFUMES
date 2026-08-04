import React, { useState, useMemo } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, SHOP_CONFIG, Review } from '../types';
import {
  X,
  MessageCircle,
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Sparkles,
  Check,
  Star,
  Heart,
  ChevronRight,
  ChevronLeft,
  XCircle,
} from 'lucide-react';
import { ProductImage } from './ProductImage';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

interface ProductDetailModalProps {
  allProducts?: Product[];
  onProductSelect?: (product: Product) => void;
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
  allProducts = [],
  onProductSelect,
}) => {
  const { isFavorite, toggleFavorite } = useWishlist();
  const { toast } = useToast();
  const [newReview, setNewReview] = useState({ authorName: '', rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [selectedAngleIndex, setSelectedAngleIndex] = useState(0);

  if (!product) return null;

  const isFav = isFavorite(product.id);
  const isOutOfStock = product.inStock === false;

  // Compile unique angles
  const allImages = useMemo(() => {
    if (product.images && product.images.length > 0) {
      const list = [product.image, ...product.images.filter((img) => img !== product.image)];
      return list.filter(Boolean);
    }
    return product.image ? [product.image] : [];
  }, [product.image, product.images]);

  const currentDisplayImage = allImages[selectedAngleIndex] || product.image;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.authorName.trim() || !newReview.comment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const review: Review = {
        id: Date.now().toString(),
        authorName: newReview.authorName,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toLocaleDateString('ar-MA'),
      };

      const docRef = doc(db, 'products', product.id);
      await updateDoc(docRef, {
        reviews: arrayUnion(review),
      });

      setNewReview({ authorName: '', rating: 5, comment: '' });
      setReviewSuccess(true);
      toast.success('شكراً لك! تم إرسال تقييمك بنجاح');
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('حدث خطأ أثناء إرسال التقييم');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const reviews = product.reviews || [];
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const whatsappMsg = encodeURIComponent(
    isOutOfStock
      ? `مرحباً عطور بيت العرب، استفسار عن موعد توفر المنتج:\n• *${product.name}*\n• السعر: ${product.price} درهم\n${
          product.volume ? `• الحجم: ${product.volume}\n` : ''
        }هل يمكن حجزه عند توفره؟`
      : `مرحباً عطور بيت العرب، استفسار عن المنتج:\n• *${product.name}*\n• السعر: ${product.price} درهم\n${
          product.volume ? `• الحجم: ${product.volume}\n` : ''
        }يرجى إفادتي بالتفاصيل وطريقة التوصيل.`
  );

  const directWhatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${whatsappMsg}`;

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id && p.active)
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Buttons (Close & Favorite) */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(product)}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
              isFav
                ? 'bg-red-50 text-red-500 hover:bg-red-100 scale-105'
                : 'bg-[#1A1A1A]/80 text-white hover:bg-white hover:text-red-500'
            }`}
            title={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            aria-label="المفضلة"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#1A1A1A]/80 text-white flex items-center justify-center hover:bg-[#8C7342] transition-colors shadow-md"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Image Side with Multi-Angle previews */}
        <div className="md:w-1/2 bg-gray-100 relative aspect-square md:aspect-auto flex flex-col justify-between p-2">
          <div className="relative w-full h-full min-h-[260px] rounded-2xl overflow-hidden">
            <ProductImage
              src={currentDisplayImage}
              alt={product.name}
              className={`w-full h-full object-cover object-center ${
                isOutOfStock ? 'grayscale-[35%] opacity-85' : ''
              }`}
            />

            {/* Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
              {isOutOfStock ? (
                <span className="bg-rose-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> نفد من المخزن
                </span>
              ) : product.isFeatured ? (
                <span className="gold-gradient text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> منتج مميز
                </span>
              ) : null}
            </div>

            {/* Arrows */}
            {allImages.length > 1 && (
              <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedAngleIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
                  }
                  className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 text-gray-800 flex items-center justify-center shadow"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAngleIndex((prev) => (prev + 1) % allImages.length)}
                  className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 text-gray-800 flex items-center justify-center shadow"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Angle thumbnail pills */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-2 pt-2 overflow-x-auto justify-center">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAngleIndex(idx)}
                  className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedAngleIndex === idx
                      ? 'border-[#C1841A] scale-105'
                      : 'border-gray-300 opacity-60'
                  }`}
                >
                  <ProductImage src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Side */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="text-xs text-[#8C7342] font-bold bg-gray-100 px-2.5 py-1 rounded-md inline-block">
                  {product.category === 'perfumes' && 'عطور وعود شرقي'}
                  {product.category === 'incense' && 'بخور'}
                  {product.category === 'clothes' && 'ملابس'}
                  {product.category === 'oils' && 'زيوت طبيعية'}
                  {product.category === 'wholesale' && 'بيع بالجملة'}
                  {product.category === 'other' && 'منتجات أخرى'}
                </span>

                {isOutOfStock ? (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    غير متوفر بالمخزن
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    متوفر بالمخزن
                  </span>
                )}
              </div>

              <h2 className="font-display font-bold text-2xl text-[#1A1A1A]">{product.name}</h2>

              {product.volume && (
                <p className="text-xs text-gray-500 font-medium mt-1">
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
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice} درهم
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#8C7342] uppercase tracking-wider">
                الوصف والمميزات:
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
            </div>

            {/* Fragrance Notes / Product Specs */}
            {product.notes && product.notes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#8C7342] uppercase tracking-wider">
                  المكونات / النوتات العطرية:
                </h4>
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
            <div className="pt-4 space-y-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#8C7342] uppercase tracking-wider">
                  آراء العملاء:
                </h4>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1 text-sm font-bold text-[#1A1A1A]">
                    <span>{averageRating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500 font-normal">({reviews.length})</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-50 p-3 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#1A1A1A]">
                          {review.authorName}
                        </span>
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
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج!
                  </p>
                )}
              </div>

              {/* Add Review Form */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-bold text-[#1A1A1A] mb-3">أضف تقييمك</h4>
                {reviewSuccess ? (
                  <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    تم إضافة تقييمك بنجاح!
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">الاسم</label>
                      <input
                        type="text"
                        required
                        value={newReview.authorName}
                        onChange={(e) =>
                          setNewReview({ ...newReview, authorName: e.target.value })
                        }
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-1 focus:ring-[#8C7342] focus:border-[#8C7342]"
                        placeholder="الاسم الكريم..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">التقييم</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                star <= newReview.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">تعليق</label>
                      <textarea
                        required
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({ ...newReview, comment: e.target.value })
                        }
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm h-20 resize-none focus:ring-1 focus:ring-[#8C7342] focus:border-[#8C7342]"
                        placeholder="ما رأيك في المنتج؟"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full bg-[#1A1A1A] text-white rounded-lg py-2 text-sm font-bold hover:bg-[#8C7342] transition-colors disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'جاري الإرسال...' : 'إرسال التقييم'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && onProductSelect && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-xs font-bold text-[#8C7342] uppercase tracking-wider mb-3">
                منتجات مشابهة
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {relatedProducts.map((rp) => (
                  <div
                    key={rp.id}
                    className="border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:border-[#8C7342] transition-colors group"
                    onClick={() => onProductSelect(rp)}
                  >
                    <div className="aspect-square bg-gray-50 relative">
                      <ProductImage
                        src={rp.image}
                        alt={rp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-2">
                      <h5 className="text-[10px] font-bold text-[#1A1A1A] line-clamp-1">
                        {rp.name}
                      </h5>
                      <span className="text-[10px] text-[#8C7342] font-semibold">
                        {rp.price} درهم
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] ${
                isOutOfStock
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-[#25D366] hover:bg-[#20bd5a] text-white'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>{isOutOfStock ? 'حجز واستفسار بالواتساب' : 'طلب مباشر عبر واتساب'}</span>
            </a>

            <button
              onClick={() => !isOutOfStock && onAddToCart(product)}
              disabled={isOutOfStock}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                  : isInCart
                  ? 'bg-[#1E5C48] text-white'
                  : 'bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white'
              }`}
            >
              {isOutOfStock ? (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>نفد من المخزن حالياً</span>
                </>
              ) : isInCart ? (
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
