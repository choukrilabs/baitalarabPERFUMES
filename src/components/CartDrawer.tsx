import React, { useState } from 'react';
import { Product, CartItem, SHOP_CONFIG, Address, MOROCCAN_CITIES } from '../types';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ShoppingBag,
  MapPin,
  Check,
  ChevronDown,
  User,
  Phone,
  Sparkles,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { ProductImage } from './ProductImage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { buildCartWhatsappMessage, getWhatsappUrl, WHATSAPP_TRUST_BANNER_AR, WHATSAPP_TRUST_BANNER_FR } from '../utils/whatsapp';
import { MOROCCAN_CITIES_FR } from '../utils/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenAuth?: () => void;
  onNavigateToProduct?: (product: Product) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenAuth,
  onNavigateToProduct,
}) => {
  const { currentUser, userProfile, saveOrder } = useAuth();
  const { toast } = useToast();
  const { t, isFrench } = useLanguage();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customCity, setCustomCity] = useState('الدار البيضاء');
  const [customStreet, setCustomStreet] = useState('');

  if (!isOpen) return null;

  const addresses = userProfile?.addresses || [];
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
  const activeAddress =
    addresses.find((a) => a.id === selectedAddressId) || defaultAddr;

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleCheckoutAndWhatsapp = async () => {
    let orderAddress: Address | undefined = undefined;

    if (activeAddress) {
      orderAddress = activeAddress;
    } else if (customName.trim() || customPhone.trim() || customStreet.trim()) {
      orderAddress = {
        id: 'guest-' + Date.now(),
        title: t('cart.guest_title'),
        recipientName: customName.trim() || currentUser?.displayName || t('cart.guest_customer'),
        phone: customPhone.trim() || userProfile?.phone || '',
        city: customCity,
        district: '',
        streetAddress: customStreet.trim() || '',
        isDefault: false,
      };
    }

    // Record order in history
    try {
      const orderPayload: any = {
        items: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        totalPrice,
        status: 'pending',
        customerName: orderAddress?.recipientName || customName || currentUser?.displayName || t('cart.guest_customer'),
        phone: orderAddress?.phone || customPhone || userProfile?.phone || '',
      };

      if (orderAddress) {
        orderPayload.address = orderAddress;
      }

      await saveOrder(orderPayload);
    } catch (err) {
      console.warn('Could not record order to database:', err);
    }

    // Build WhatsApp message formatted specifically for high Moroccan conversion
    const customerInfo = {
      name: orderAddress?.recipientName || customName || currentUser?.displayName,
      city: isFrench ? (MOROCCAN_CITIES_FR[orderAddress?.city || customCity] || orderAddress?.city || customCity) : (orderAddress?.city || customCity),
      phone: orderAddress?.phone || customPhone || userProfile?.phone,
      streetAddress: orderAddress?.streetAddress || customStreet,
    };

    const msg = buildCartWhatsappMessage(cartItems, totalPrice, customerInfo, isFrench ? 'fr' : 'ar');

    toast.success(t('cart.directing_whatsapp'));

    // Open WhatsApp
    const whatsappUrl = getWhatsappUrl(msg);
    window.open(whatsappUrl, '_blank');
  };

  const trustBannerText = isFrench ? WHATSAPP_TRUST_BANNER_FR : WHATSAPP_TRUST_BANNER_AR;

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
          <div className="p-4 sm:p-5 bg-[#1A1A1A] text-[#FAF9F6] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gold-gradient p-0.5 flex items-center justify-center shadow">
                <div className="w-full h-full bg-[#1A1A1A] rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[#8C7342]" />
                </div>
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-white">
                  {t('cart.title')} ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                </h2>
                <p className="text-[11px] text-[#8C7342]">{t('cart.order_fast_delivery')}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#2A2A2A] text-gray-300 hover:text-white transition-colors"
              aria-label={isFrench ? 'Fermer' : 'إغلاق'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Reassurance Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-[#132A1C] to-emerald-950 text-emerald-100 px-4 py-2.5 border-b border-emerald-800/40 flex items-center gap-2.5 text-xs shadow-inner">
            <div className="w-6 h-6 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#FAF9F6] leading-tight">
                {trustBannerText}
              </p>
              <p className="text-[10px] text-emerald-300/80 mt-0.5">
                {t('cart.trust_sub')}
              </p>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF9F6]">
            {cartItems.length > 0 ? (
              <>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-sm flex items-center gap-3"
                    >
                      <div
                        onClick={() => {
                          if (onNavigateToProduct) {
                            onClose();
                            onNavigateToProduct(item.product);
                          }
                        }}
                        className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 ${
                          onNavigateToProduct ? 'cursor-pointer hover:opacity-90' : ''
                        }`}
                      >
                        <ProductImage
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4
                          onClick={() => {
                            if (onNavigateToProduct) {
                              onClose();
                              onNavigateToProduct(item.product);
                            }
                          }}
                          className={`font-bold text-xs text-[#1A1A1A] truncate ${
                            onNavigateToProduct ? 'cursor-pointer hover:text-[#8C7342]' : ''
                          }`}
                        >
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-[#8C7342] font-extrabold mt-0.5">
                          {item.product.price * item.quantity} {t('product.currency')}
                          {item.quantity > 1 && (
                            <span className={`text-[10px] text-gray-400 font-normal ${isFrench ? 'ml-1' : 'mr-1'}`}>
                              ({item.product.price} {t('cart.per_unit')})
                            </span>
                          )}
                        </p>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              onUpdateQuantity(item.product.id, -1);
                            }}
                            className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-[#8C7342] text-[#1A1A1A] hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                            aria-label={isFrench ? 'Diminuer la quantité' : 'تقليل الكمية'}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              onUpdateQuantity(item.product.id, 1);
                            }}
                            className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-[#8C7342] text-[#1A1A1A] hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                            aria-label={isFrench ? 'Augmenter la quantité' : 'زيادة الكمية'}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => {
                          onRemoveItem(item.product.id);
                          toast.info(t('cart.item_removed', { name: item.product.name }));
                        }}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        title={isFrench ? 'Supprimer' : 'حذف من السلة'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery Address Selection Block */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8C7342]" />
                      {t('cart.enter_address')}
                    </span>

                    {currentUser && addresses.length > 0 && (
                      <button
                        onClick={() => setShowAddressPicker(!showAddressPicker)}
                        className="text-[11px] text-[#8C7342] font-bold hover:underline"
                      >
                        {showAddressPicker ? t('cart.hide_addresses') : t('cart.change_address')}
                      </button>
                    )}
                  </div>

                  {currentUser ? (
                    addresses.length > 0 ? (
                      showAddressPicker ? (
                        <div className="space-y-2 pt-1 animate-fadeIn">
                          {addresses.map((addr) => (
                            <div
                              key={addr.id}
                              onClick={() => {
                                setSelectedAddressId(addr.id);
                                setShowAddressPicker(false);
                                toast.info(t('cart.selected_address', { title: addr.title }));
                              }}
                              className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                (selectedAddressId === addr.id ||
                                  (!selectedAddressId && addr.isDefault))
                                  ? 'border-[#8C7342] bg-[#FAF8F5] font-bold text-[#1A1A1A]'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{addr.title} - {isFrench ? (MOROCCAN_CITIES_FR[addr.city] || addr.city) : addr.city}</span>
                                {(selectedAddressId === addr.id ||
                                  (!selectedAddressId && addr.isDefault)) && (
                                  <Check className="w-3.5 h-3.5 text-[#8C7342]" />
                                )}
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5 truncate font-normal">
                                {addr.streetAddress}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-[#FAF9F6] p-3 rounded-xl border border-gray-100 text-xs">
                          <p className="font-bold text-gray-800">
                            {activeAddress?.recipientName} ({activeAddress?.title})
                          </p>
                          <p className="text-gray-500 mt-0.5">
                            {activeAddress?.streetAddress}، {isFrench ? (MOROCCAN_CITIES_FR[activeAddress?.city || ''] || activeAddress?.city) : activeAddress?.city}
                          </p>
                          {activeAddress?.phone && (
                            <p className="text-gray-400 text-[11px] mt-0.5">
                              📞 {activeAddress.phone}
                            </p>
                          )}
                        </div>
                      )
                    ) : (
                      <div className="bg-[#FAF9F6] p-3 rounded-xl text-xs space-y-2 border border-gray-100">
                        <p className="text-gray-500">
                          {t('cart.no_addresses')}
                        </p>
                        <input
                          type="text"
                          value={customStreet}
                          onChange={(e) => setCustomStreet(e.target.value)}
                          placeholder={isFrench ? 'Rue, numéro et quartier...' : 'الشارع ورقم المنزل...'}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs"
                        />
                      </div>
                    )
                  ) : (
                    /* Guest Quick Address */
                    <div className="space-y-2 pt-1 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder={t('cart.name')}
                          className="bg-[#FAF9F6] border border-gray-200 rounded-lg p-2 text-xs"
                        />
                        <input
                          type="tel"
                          value={customPhone}
                          onChange={(e) => setCustomPhone(e.target.value)}
                          placeholder={t('cart.phone')}
                          className="bg-[#FAF9F6] border border-gray-200 rounded-lg p-2 text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={customCity}
                          onChange={(e) => setCustomCity(e.target.value)}
                          className="bg-[#FAF9F6] border border-gray-200 rounded-lg p-2 text-xs"
                        >
                          {MOROCCAN_CITIES.slice(0, 10).map((c) => (
                            <option key={c} value={c}>
                              {isFrench ? (MOROCCAN_CITIES_FR[c] || c) : c}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={customStreet}
                          onChange={(e) => setCustomStreet(e.target.value)}
                          placeholder={t('cart.street')}
                          className="bg-[#FAF9F6] border border-gray-200 rounded-lg p-2 text-xs"
                        />
                      </div>

                      {onOpenAuth && (
                        <div className="pt-2 text-center border-t border-gray-100">
                          <button
                            type="button"
                            onClick={onOpenAuth}
                            className="text-[11px] text-[#8C7342] hover:underline font-bold"
                          >
                            {t('cart.have_account')}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-base text-[#1A1A1A]">
                  {t('cart.empty_title')}
                </h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                  {t('cart.empty_desc')}
                </p>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-gray-200 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-sm font-bold text-[#1A1A1A]">
                <span>{t('cart.total')}</span>
                <span className="text-xl font-display font-extrabold text-[#8C7342]">
                  {totalPrice} {t('product.currency')}
                </span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#25D366] shrink-0" />
                <span className="font-bold text-[11px] leading-tight">
                  {trustBannerText}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckoutAndWhatsapp}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('cart.send_whatsapp_btn', { count: cartItems.length })}</span>
                </button>

                <button
                  onClick={() => {
                    onClearCart();
                    toast.info(t('cart.cart_cleared'));
                  }}
                  className="w-full text-xs text-gray-400 hover:text-red-500 py-1 transition-colors text-center"
                >
                  {t('cart.clear')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
