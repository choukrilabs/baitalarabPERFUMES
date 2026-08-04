import React from 'react';
import { Product, CartItem, SHOP_CONFIG } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';
import { ProductImage } from './ProductImage';

interface WishlistDrawerProps {
  products?: Product[];
  isOpen?: boolean;
  onClose?: () => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  cartItems: CartItem[];
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  products = [],
  isOpen,
  onClose,
  onAddToCart,
  onQuickView,
  cartItems,
}) => {
  const { favorites, isWishlistOpen, setIsWishlistOpen, removeFromWishlist, clearWishlist } =
    useWishlist();
  const { toast } = useToast();
  const { t, isFrench } = useLanguage();

  const isVisible = isOpen !== undefined ? isOpen : isWishlistOpen;
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setIsWishlistOpen(false);
  };

  if (!isVisible) return null;

  const favoriteProducts = (products || []).filter((p) => favorites.includes(p.id));

  const handleAddAllToCart = () => {
    favoriteProducts.forEach((p) => {
      const alreadyInCart = cartItems.some((item) => item.product.id === p.id);
      if (!alreadyInCart) {
        onAddToCart(p);
      }
    });
    toast.success(t('wishlist.all_added_to_cart', { count: favoriteProducts.length }));
  };

  const generateWhatsappWishlistUrl = () => {
    if (isFrench) {
      let msg = `Bonjour Parfums Bait Al Arab 🌿\nJe souhaite me renseigner sur les articles enregistrés dans mes favoris :\n\n`;
      favoriteProducts.forEach((item, idx) => {
        msg += `${idx + 1}. *${item.name}* - ${item.price} DH ${
          item.volume ? `(${item.volume})` : ''
        }\n`;
      });
      msg += `\nPouvez-vous me confirmer leur disponibilité et les modalités de livraison ? Merci beaucoup !`;
      return `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    }

    let msg = `مرحباً عطور بيت العرب 🌿\nأود الاستفسار عن المنتجات المحفوظة في قائمة رغباتي:\n\n`;
    favoriteProducts.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}* - ${item.price} درهم ${
        item.volume ? `(${item.volume})` : ''
      }\n`;
    });
    msg += `\nالرجاء إفادتي بتوفرها وإمكانية التوصيل. شكراً لكم!`;
    return `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`absolute inset-y-0 ${isFrench ? 'right-0 pr-0 sm:pr-10' : 'left-0 pl-0 sm:pl-10'} max-w-full flex`}>
        <div
          className={`w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between ${
            isFrench ? 'border-l' : 'border-r'
          } border-gray-200`}
          dir={isFrench ? 'ltr' : 'rtl'}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 bg-[#1A1A1A] text-[#FAF9F6] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8C7342]/20 flex items-center justify-center border border-[#8C7342]/40">
                <Heart className="w-5 h-5 text-[#8C7342] fill-current" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white">{t('wishlist.title')}</h2>
                <p className="text-xs text-[#8C7342]">
                  {t('wishlist.items_count', { count: favoriteProducts.length })}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-[#2A2A2A] text-gray-300 hover:text-white transition-colors"
              aria-label={isFrench ? 'Fermer la liste des favoris' : 'إغلاق قائمة المفضلة'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Favorite Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF9F6]">
            {favoriteProducts.length > 0 ? (
              favoriteProducts.map((product) => {
                const isInCart = cartItems.some((i) => i.product.id === product.id);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm flex items-center gap-3 hover:border-[#8C7342]/40 transition-colors"
                  >
                    <div
                      className="w-20 h-20 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-gray-100 relative group"
                      onClick={() => {
                        setIsWishlistOpen(false);
                        onQuickView(product);
                      }}
                    >
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {product.isFeatured && (
                        <span className={`absolute top-1 ${isFrench ? 'left-1' : 'right-1'} gold-gradient text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow`}>
                          {t('product.featured')}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          onClick={() => {
                            setIsWishlistOpen(false);
                            onQuickView(product);
                          }}
                          className="font-bold text-sm text-[#1A1A1A] truncate cursor-pointer hover:text-[#8C7342] transition-colors"
                        >
                          {product.name}
                        </h4>
                        <button
                          onClick={() => {
                            removeFromWishlist(product.id);
                            toast.info(t('wishlist.item_removed', { name: product.name }));
                          }}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors shrink-0"
                          title={isFrench ? 'Retirer des favoris' : 'إزالة من المفضلة'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[#8C7342] font-extrabold">
                          {product.price} {t('product.currency')}
                        </span>
                        {product.volume && (
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            {product.volume}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart button */}
                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          onClick={() => {
                            onAddToCart(product);
                            toast.success(t('wishlist.added_to_cart', { name: product.name }));
                          }}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 w-full ${
                            isInCart
                              ? 'bg-[#1E5C48] text-white'
                              : 'bg-[#1A1A1A] hover:bg-[#8C7342] text-white shadow-sm'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{isInCart ? t('product.in_cart') : t('product.add_to_cart')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-display font-bold text-base text-[#1A1A1A]">
                  {t('wishlist.empty_title')}
                </h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  {t('wishlist.empty_desc')}
                </p>
                <button
                  onClick={handleClose}
                  className="mt-3 bg-[#1A1A1A] hover:bg-[#8C7342] text-white text-xs font-bold py-2.5 px-5 rounded-full shadow transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{t('wishlist.browse_collection')}</span>
                  {isFrench ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {favoriteProducts.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-gray-200 space-y-3">
              <button
                onClick={handleAddAllToCart}
                className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <ShoppingBag className="w-4 h-4 text-[#8C7342]" />
                <span>{t('wishlist.add_all')} ({favoriteProducts.length})</span>
              </button>

              <a
                href={generateWhatsappWishlistUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-bold text-xs shadow flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isFrench ? 'Demande par WhatsApp sur mes favoris' : 'استفسار عن المفضلة عبر واتساب'}</span>
              </a>

              <button
                onClick={() => {
                  clearWishlist();
                  toast.info(isFrench ? 'Favoris effacés' : 'تم مسح قائمة المفضلة');
                }}
                className="w-full text-xs text-gray-500 hover:text-red-500 py-1 transition-colors text-center"
              >
                {isFrench ? 'Vider tous les favoris' : 'مسح كل المفضلة'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
