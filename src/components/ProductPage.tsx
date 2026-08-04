import React, { useState, useEffect, useMemo } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, SHOP_CONFIG, Review, CategoryType } from '../types';
import {
  ArrowRight,
  ArrowLeft,
  Share2,
  Heart,
  ShoppingBag,
  MessageCircle,
  Check,
  Star,
  ShieldCheck,
  Sparkles,
  CheckCheck,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Package,
  Camera,
  Maximize2,
  X,
  XCircle,
  Layers,
  Truck,
} from 'lucide-react';
import { ProductImage } from './ProductImage';
import { QuickQuestionButton } from './QuickQuestionButton';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { buildSingleProductWhatsappMessage, getWhatsappUrl, WHATSAPP_TRUST_BANNER } from '../utils/whatsapp';

interface ProductPageProps {
  product: Product;
  allProducts: Product[];
  onNavigateToProduct: (product: Product) => void;
  onBackToHome: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectCategory: (category: CategoryType | 'all') => void;
  cartItems: { product: Product; quantity: number }[];
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  allProducts,
  onNavigateToProduct,
  onBackToHome,
  onAddToCart,
  onSelectCategory,
  cartItems,
}) => {
  const { isFavorite, toggleFavorite } = useWishlist();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newReview, setNewReview] = useState({ authorName: '', rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Multi-angle gallery state
  const [selectedAngleIndex, setSelectedAngleIndex] = useState<number>(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);

  const isFav = isFavorite(product.id);
  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const isInCart = Boolean(cartItem);
  const isOutOfStock = product.inStock === false;

  // Compile all bottle images
  const allImages = useMemo(() => {
    if (product.images && product.images.length > 0) {
      const list = [product.image, ...product.images.filter(img => img !== product.image)];
      return list.filter(Boolean);
    }
    return product.image ? [product.image] : [];
  }, [product.image, product.images]);

  // Current active angle image
  const currentImage = allImages[selectedAngleIndex] || product.image;

  // Reset angle index on product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);
    setCopiedLink(false);
    setSelectedAngleIndex(0);
    setIsZoomModalOpen(false);
  }, [product.id]);

  // Angle labels for perfume presentation
  const getAngleLabel = (idx: number, total: number) => {
    if (total === 1) return 'واجهة المنتج';
    if (idx === 0) return 'واجهة القارورة والتصميم';
    if (idx === 1) return 'الزاوية الجانبية وتفاصيل السائل';
    if (idx === 2) return 'غطاء العطر ورشاش الفوهة';
    if (idx === 3) return 'علبة التغليف الفاخرة';
    return `الزاوية ${idx + 1}`;
  };

  const handleNextAngle = () => {
    setSelectedAngleIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevAngle = () => {
    setSelectedAngleIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Find index and previous / next product for quick carousel switching
  const activeProducts = allProducts.filter((p) => p.active);
  const currentIndex = activeProducts.findIndex((p) => p.id === product.id);
  const prevProduct = currentIndex > 0 ? activeProducts[currentIndex - 1] : null;
  const nextProduct = currentIndex < activeProducts.length - 1 ? activeProducts[currentIndex + 1] : null;

  // Filter related products (same category, excluding current)
  const relatedProducts = allProducts
    .filter((p) => p.active && p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Category labels mapping
  const categoryLabels: Record<string, string> = {
    perfumes: 'عطور وعود',
    incense: 'بخور وعود فاخر',
    clothes: 'أزياء وملابس',
    oils: 'زيوت طبيعية وعود',
    wholesale: 'بيع بالجملة',
    other: 'منتجات أخرى',
  };

  const currentCategoryName = categoryLabels[product.category] || 'الكتالوج';

  const getGenderLabel = (g?: string) => {
    if (g === 'men') return 'عطر رجالي';
    if (g === 'women') return 'عطر نسائي';
    if (g === 'unisex') return 'مناسب للجنسين';
    return null;
  };

  // Calculate Average Rating
  const reviews = product.reviews || [];
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  // Handle WhatsApp direct checkout message
  const totalPriceMAD = product.price * quantity;
  const whatsappMsgText = isOutOfStock
    ? `مرحباً عطور بيت العرب، أود الاستفسار عن موعد توفر وحجز المنتج:\n• ${product.name} ${product.volume || ''}\n• السعر: ${product.price} MAD\nهل يمكن إشعاري عند توفره؟`
    : buildSingleProductWhatsappMessage(product, quantity);
  const directWhatsappUrl = getWhatsappUrl(whatsappMsgText);

  // Handle Copy Link
  const handleCopyLink = () => {
    const url = `${window.location.origin}/?product=${product.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success('تم نسخ رابط المنتج بنجاح إلى الحافظة');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Submit Review to Firestore
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.authorName.trim() || !newReview.comment.trim()) {
      toast.warning('يرجى كتابة الاسم ورأيك في المنتج');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const review: Review = {
        id: 'rev_' + Date.now().toString(),
        authorName: newReview.authorName.trim(),
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        date: new Date().toLocaleDateString('ar-MA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };

      const docRef = doc(db, 'products', product.id);
      await updateDoc(docRef, {
        reviews: arrayUnion(review),
      });

      // Update product locally
      if (!product.reviews) {
        product.reviews = [];
      }
      product.reviews.push(review);

      setNewReview({ authorName: '', rating: 5, comment: '' });
      toast.success('شكراً لمشاركتنا رأيك! تم نشر تقييمك بنجاح');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('تعذر إرسال التقييم، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddToCartWithQuantity = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    toast.success(`تمت إضافة ${quantity} من "${product.name}" إلى السلة`);
  };

  const scrollToReviews = () => {
    const element = document.getElementById('customer-reviews-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="product-page" className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Next/Prev Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 text-sm">
          {/* Breadcrumb Path */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium overflow-x-auto py-1">
            <button
              onClick={onBackToHome}
              className="hover:text-[#8C7342] transition-colors flex items-center gap-1 shrink-0 font-semibold"
            >
              الرئيسية
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 rotate-180 shrink-0" />
            <button
              onClick={() => {
                onSelectCategory(product.category);
                onBackToHome();
              }}
              className="hover:text-[#8C7342] transition-colors shrink-0"
            >
              {currentCategoryName}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 rotate-180 shrink-0" />
            <span className="text-[#1A1A1A] font-bold truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>

          {/* Action Links (Back to Catalog, Prev/Next) */}
          <div className="flex items-center gap-2">
            {prevProduct && (
              <button
                onClick={() => onNavigateToProduct(prevProduct)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
                title={`المنتج السابق: ${prevProduct.name}`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">السابق</span>
              </button>
            )}

            {nextProduct && (
              <button
                onClick={() => onNavigateToProduct(nextProduct)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
                title={`المنتج التالي: ${nextProduct.name}`}
              >
                <span className="hidden sm:inline">التالي</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#8C7342] text-white text-xs font-bold transition-colors shadow-sm mr-1"
            >
              <span>تصفح الكتالوج</span>
            </button>
          </div>
        </div>

        {/* Main Product Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200/80 shadow-sm mb-12">
          
          {/* Column 1: Multi-Angle Bottle & Packaging Showcase (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Viewing Stage */}
            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-gradient-to-b from-gray-50 to-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-inner group">
              <ProductImage
                src={currentImage}
                alt={`${product.name} - ${getAngleLabel(selectedAngleIndex, allImages.length)}`}
                className={`w-full h-full object-cover object-center transition-all duration-500 ${
                  isOutOfStock ? 'grayscale-[35%] opacity-85' : 'group-hover:scale-105'
                }`}
              />

              {/* Floating Status Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5 pointer-events-none z-10">
                {isOutOfStock ? (
                  <span className="bg-rose-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> نفد من المخزن مؤقتاً
                  </span>
                ) : product.isFeatured ? (
                  <span className="gold-gradient text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> مميز والأكثر طلباً
                  </span>
                ) : product.originalPrice && product.originalPrice > product.price ? (
                  <span className="bg-[#8C7342] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                ) : null}

                <span className="bg-[#1A1A1A]/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#8C7342]" /> أصلي ومضمون 100%
                </span>
              </div>

              {/* Quick Actions (Wishlist, Share, Zoom) */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <button
                  type="button"
                  onClick={() => toggleFavorite(product)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
                    isFav
                      ? 'bg-red-50 text-red-500 hover:bg-red-100 scale-105'
                      : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
                  }`}
                  title={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                  aria-label="المفضلة"
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-10 h-10 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-[#8C7342] flex items-center justify-center backdrop-blur-md transition-all shadow-md"
                  title="مشاركة رابط المنتج"
                  aria-label="مشاركة الرابط"
                >
                  {copiedLink ? (
                    <CheckCheck className="w-5 h-5 text-green-600" />
                  ) : (
                    <Share2 className="w-5 h-5" />
                  )}
                </button>

                {/* Zoom / Inspect Bottle Lightbox Button */}
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(true)}
                  className="w-10 h-10 rounded-full bg-white/90 text-gray-700 hover:bg-[#1A1A1A] hover:text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md"
                  title="تكبير ومعاينة تفاصيل الزجاجة بدقة عالية"
                  aria-label="تكبير الصورة"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Arrows for Angles */}
              {allImages.length > 1 && (
                <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                  <button
                    type="button"
                    onClick={handlePrevAngle}
                    className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                    title="الزاوية السابقة"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextAngle}
                    className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                    title="الزاوية التالية"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Bottom Angle Description Bar */}
              <div className="absolute bottom-3 inset-x-3 bg-[#1A1A1A]/85 backdrop-blur-md text-white py-1.5 px-3 rounded-xl flex items-center justify-between text-xs font-medium shadow-md">
                <div className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#C1841A]" />
                  <span>{getAngleLabel(selectedAngleIndex, allImages.length)}</span>
                </div>
                {allImages.length > 1 && (
                  <span className="text-[11px] text-[#C1841A] font-bold">
                    {selectedAngleIndex + 1} / {allImages.length}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails Gallery Strip */}
            {allImages.length > 1 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-bold text-[#8C7342] flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" /> زوايا ورؤى مختلفة للزجاجة:
                  </span>
                  <span>انقر للمعاينة</span>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAngleIndex(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                        selectedAngleIndex === idx
                          ? 'border-[#C1841A] ring-2 ring-[#C1841A]/30 scale-[1.02] shadow-md'
                          : 'border-gray-200 hover:border-[#C1841A]/60 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <ProductImage
                        src={img}
                        alt={`زاوية ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Product Information & Purchase Controls (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category Pill, Gender, and Stock Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#8C7342]/10 text-[#8C7342] text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentCategoryName}
                </span>

                {getGenderLabel(product.gender) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
                    {getGenderLabel(product.gender)}
                  </span>
                )}

                {product.productType && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                    {product.productType}
                  </span>
                )}

                {product.volume && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                    <Package className="w-3.5 h-3.5 text-gray-500" />
                    {product.volume}
                  </span>
                )}

                {/* Stock Status Badge */}
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    نفد من المخزن مؤقتاً
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    متوفر بالمخزن • جاهز للشحن
                  </span>
                )}
              </div>

              {/* Product Main Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-[#1A1A1A] leading-snug">
                {product.name}
              </h1>

              {/* Rating & Reviews Bar */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="font-bold">{averageRating}</span>
                </div>
                <button
                  onClick={scrollToReviews}
                  className="text-xs text-gray-500 hover:text-[#8C7342] underline transition-colors"
                >
                  ({reviews.length} {reviews.length === 1 ? 'تقييم' : 'تقييمات للعملاء'})
                </button>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8C7342]" /> حي الحبوس، الدار البيضاء
                </span>
              </div>

              {/* Price Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF9F6] to-amber-50/50 border border-[#8C7342]/20 flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">السعر الحالي:</span>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#1A1A1A]">
                      {product.price}{' '}
                      <span className="text-base sm:text-lg font-bold text-[#8C7342]">درهم مغربي</span>
                    </span>

                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm sm:text-base text-gray-400 line-through">
                        {product.originalPrice} درهم
                      </span>
                    )}
                  </div>
                </div>

                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="bg-[#8C7342] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
                    وفر {product.originalPrice - product.price} درهم
                  </div>
                )}
              </div>

              {/* Short Description */}
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Fragrance Notes Pills (if present) */}
              {product.notes && product.notes.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-gray-700 block">المكونات والنوتات العطرية:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.notes.map((note, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 hover:bg-[#8C7342]/10 text-[#1A1A1A] text-xs font-medium px-3 py-1 rounded-lg border border-gray-200 transition-colors"
                      >
                        ✨ {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping and Authenticity Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#FAF9F6] p-3 rounded-xl border border-gray-200/80 flex items-center gap-2.5 text-xs text-gray-700">
                  <Truck className="w-4 h-4 text-[#8C7342] shrink-0" />
                  <span>توصيل سريع لجميع المدن المغربية والدفع عند الاستلام</span>
                </div>
                <div className="bg-[#FAF9F6] p-3 rounded-xl border border-gray-200/80 flex items-center gap-2.5 text-xs text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ضمان الجودة والأصالة من متجرنا في حي الحبوس</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Dual Order Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Quantity row */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-700">الكمية المطلوبة:</span>
                  <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 overflow-hidden shadow-inner">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="p-2.5 hover:bg-gray-200 text-gray-700 transition-colors"
                      aria-label="تقليل الكمية"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-1 font-display font-bold text-base text-[#1A1A1A]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="p-2.5 hover:bg-gray-200 text-gray-700 transition-colors"
                      aria-label="زيادة الكمية"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    (المجموع: <strong className="text-[#1A1A1A] font-bold">{totalPriceMAD} درهم</strong>)
                  </span>
                </div>
              )}

              {/* Reassurance Banner for zero-hesitation purchase */}
              <div className="bg-gradient-to-r from-emerald-50 via-[#F3FAF5] to-emerald-50 border border-emerald-200/90 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold text-[#1A1A1A] leading-snug">
                    {WHATSAPP_TRUST_BANNER}
                  </p>
                  <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                    خدمة سريعة ومجانية • الدفع نقداً عند استلام طلبيتك وفحصها
                  </p>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & WhatsApp Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCartWithQuantity}
                  disabled={isOutOfStock}
                  className={`py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300 shadow-none'
                      : isInCart
                      ? 'bg-[#1E5C48] text-white hover:bg-[#164435]'
                      : 'gold-gradient text-white hover:scale-102 hover:shadow-[#C1841A]/30'
                  }`}
                >
                  {isOutOfStock ? (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>نفد من المخزن حالياً</span>
                    </>
                  ) : isInCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>في السلة • إضافة المزيد ({quantity})</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>إضافة إلى السلة ({quantity})</span>
                    </>
                  )}
                </button>

                <a
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-102 ${
                    isOutOfStock
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-[#25D366] hover:bg-[#20bd5a] text-white'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{isOutOfStock ? 'حجز واستفسار بالواتساب' : 'طلب فوري عبر الواتساب'}</span>
                </a>
              </div>

              {/* Quick Question on WhatsApp specifically about availability or scent profile */}
              <QuickQuestionButton product={product} />
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div id="customer-reviews-section" className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-8 lg:p-10 mb-12">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4 text-center sm:text-right">
                <div className="text-4xl sm:text-5xl font-display font-extrabold text-[#1A1A1A]">
                  {averageRating}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-xs text-gray-600">
                    تقييمات العملاء ({reviews.length} {reviews.length === 1 ? 'تقييم' : 'تقييمات'})
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-600 bg-amber-50/60 px-4 py-2 rounded-xl border border-amber-200/80">
                ✨ تقييمات موثوقة من زبائن متجر بيت العرب
              </div>
            </div>

            {/* Add New Review Form */}
            <form
              onSubmit={handleSubmitReview}
              className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4"
            >
              <h4 className="font-bold text-sm text-[#1A1A1A]">شاركنا تجربتك وتقييمك للمنتج</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReview.authorName}
                    onChange={(e) =>
                      setNewReview((prev) => ({ ...prev, authorName: e.target.value }))
                    }
                    placeholder="مثال: يوسف الإدريسي"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8C7342] focus:ring-1 focus:ring-[#8C7342]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    درجة التقييم
                  </label>
                  <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3.5 py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                        className="p-1 text-gray-300 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newReview.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-gray-700 mr-2">
                      {newReview.rating} من 5
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  رأيك في الرائحة والثبات وسرعة التوصيل *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  placeholder="اكتب تفاصيل تجربتك مع المنتج..."
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8C7342] focus:ring-1 focus:ring-[#8C7342]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="gold-gradient text-white text-xs sm:text-sm font-bold py-2.5 px-6 rounded-xl hover:scale-102 transition-all shadow-md flex items-center gap-1.5"
              >
                <span>{isSubmittingReview ? 'جاري النشر...' : 'إرسال التقييم'}</span>
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  كن أول من يقيّم هذا المنتج الرائع من بيت العرب!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-[#FAF9F6] border border-gray-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#8C7342] text-white flex items-center justify-center font-bold text-xs">
                          {rev.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-[#1A1A1A]">
                            {rev.authorName}
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> مشترٍ موثوق
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400">{rev.date}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pt-1">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Related & Recommended Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A]">
                  منتجات مقترحة من نفس التشكيلة
                </h3>
                <p className="text-xs text-gray-500">عطور وبخور فاخرة قد تنال إعجابك</p>
              </div>

              <button
                onClick={() => {
                  onSelectCategory(product.category);
                  onBackToHome();
                }}
                className="text-xs font-bold text-[#8C7342] hover:underline"
              >
                عرض كل منتجات {currentCategoryName} ←
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  onClick={() => onNavigateToProduct(relProduct)}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#8C7342]/40 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <ProductImage
                      src={relProduct.image}
                      alt={relProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {relProduct.volume && (
                      <span className="absolute bottom-2 right-2 bg-[#1A1A1A]/80 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-sm">
                        {relProduct.volume}
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#1A1A1A] group-hover:text-[#8C7342] transition-colors line-clamp-1">
                        {relProduct.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                        {relProduct.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                      <div className="font-display font-bold text-base text-[#1A1A1A]">
                        {relProduct.price} <span className="text-xs text-[#8C7342]">درهم</span>
                      </div>
                      <span className="text-xs font-bold text-[#8C7342] group-hover:underline">
                        عرض الصفحة ←
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox High-Resolution Zoom Modal for Perfume Bottle Inspection */}
      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#1A1A1A] rounded-3xl overflow-hidden border border-[#8C7342]/40 shadow-2xl p-4 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Bar */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-gray-800 text-white">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#C1841A]" />
                <h3 className="font-bold text-sm sm:text-base">
                  معاينة دقيقة: {product.name} ({getAngleLabel(selectedAngleIndex, allImages.length)})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                title="إغلاق المعاينة"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Stage Image */}
            <div className="relative w-full aspect-square sm:aspect-[4/3] max-h-[65vh] flex items-center justify-center my-4 overflow-hidden rounded-2xl bg-black/50">
              <ProductImage
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevAngle}
                    className="absolute right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-[#8C7342] text-white flex items-center justify-center transition-colors shadow-lg"
                    title="الزاوية السابقة"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextAngle}
                    className="absolute left-4 w-10 h-10 rounded-full bg-black/60 hover:bg-[#8C7342] text-white flex items-center justify-center transition-colors shadow-lg"
                    title="الزاوية التالية"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Angles Selector */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAngleIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedAngleIndex === idx
                        ? 'border-[#C1841A] ring-2 ring-[#C1841A]/50 scale-105'
                        : 'border-gray-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <ProductImage src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
