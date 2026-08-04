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
  Sparkles
} from 'lucide-react';
import { ProductImage } from './ProductImage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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
        title: 'عنوان التوصيل',
        recipientName: customName.trim() || currentUser?.displayName || 'العميل',
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
        customerName: orderAddress?.recipientName || customName || currentUser?.displayName || 'العميل',
        phone: orderAddress?.phone || customPhone || userProfile?.phone || '',
      };

      if (orderAddress) {
        orderPayload.address = orderAddress;
      }

      await saveOrder(orderPayload);
    } catch (err) {
      console.warn('Could not record order to database:', err);
    }

    // Build WhatsApp message
    let msg = `مرحباً عطور بيت العرب 🌿\nأود طلب المنتجات التالية:\n\n`;
    cartItems.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.product.name}*\n   • الكمية: ${item.quantity}\n   • السعر: ${
        item.product.price * item.quantity
      } درهم\n`;
    });

    msg += `\n*الإجمالي: ${totalPrice} درهم مغربي*\n`;

    if (orderAddress) {
      msg += `\n📍 *بيانات التوصيل:*\n`;
      msg += `• المستلم: ${orderAddress.recipientName}\n`;
      if (orderAddress.phone) msg += `• الهاتف: ${orderAddress.phone}\n`;
      msg += `• المدينة: ${orderAddress.city}\n`;
      if (orderAddress.streetAddress) msg += `• العنوان: ${orderAddress.streetAddress}\n`;
    }

    msg += `\nالرجاء تأكيد الطلب. شكراً لكم!`;

    toast.success('جاري توجيهك إلى واتساب لتأكيد الطلب...');

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(
      msg
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-r border-gray-200"
          dir="rtl"
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
                  سلة الطلبات ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                </h2>
                <p className="text-[11px] text-[#8C7342]">تأكيد سريع وتوصيل لجميع المدن</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#2A2A2A] text-gray-300 hover:text-white transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
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
                          {item.product.price * item.quantity} درهم
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-gray-400 font-normal mr-1">
                              ({item.product.price} درهم / حبة)
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
                            aria-label="تقليل الكمية"
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
                            aria-label="زيادة الكمية"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => {
                          onRemoveItem(item.product.id);
                          toast.info(`تم حذف ${item.product.name} من السلة`);
                        }}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        title="حذف من السلة"
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
                      عنوان التوصيل
                    </span>

                    {currentUser && addresses.length > 0 && (
                      <button
                        onClick={() => setShowAddressPicker(!showAddressPicker)}
                        className="text-[11px] text-[#8C7342] font-bold hover:underline"
                      >
                        {showAddressPicker ? 'إخفاء العناوين' : 'تغيير العنوان'}
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
                                toast.info(`تم اختيار عنوان: ${addr.title}`);
                              }}
                              className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                (selectedAddressId === addr.id ||
                                  (!selectedAddressId && addr.isDefault))
                                  ? 'border-[#8C7342] bg-[#FAF8F5] font-bold text-[#1A1A1A]'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{addr.title} - {addr.city}</span>
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
                            {activeAddress?.streetAddress}، {activeAddress?.city}
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
                          لم تحفظ أي عنوان بعد في حسابك. يمكنك إضافة عنوان سريع:
                        </p>
                        <input
                          type="text"
                          value={customStreet}
                          onChange={(e) => setCustomStreet(e.target.value)}
                          placeholder="الشارع ورقم المنزل..."
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
                          placeholder="اسمك الكريم"
                          className="bg-[#FAF9F6] border border-gray-200 rounded-lg p-2 text-xs"
                        />
                        <input
                          type="tel"
                          value={customPhone}
                          onChange={(e) => setCustomPhone(e.target.value)}
                          placeholder="رقم الهاتف"
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
                              {c}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={customStreet}
                          onChange={(e) => setCustomStreet(e.target.value)}
                          placeholder="الحي / الشارع"
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
                            هل لديك حساب؟ سجّل الدخول لاستخدام عناوينك المحفوظة
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
                  سلة الطلبات فارغة
                </h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                  تصفح مجموعتنا من العطور، العود والبخور وأضف ما يعجبك لإتمام الطلب.
                </p>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-gray-200 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-sm font-bold text-[#1A1A1A]">
                <span>المجموع الكلي:</span>
                <span className="text-xl font-display font-extrabold text-[#8C7342]">
                  {totalPrice} درهم
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckoutAndWhatsapp}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>تأكيد وإرسال الطلب بالواتساب ({cartItems.length})</span>
                </button>

                <button
                  onClick={() => {
                    onClearCart();
                    toast.info('تم تفريغ سلة الطلبات');
                  }}
                  className="w-full text-xs text-gray-400 hover:text-red-500 py-1 transition-colors text-center"
                >
                  تفريغ السلة
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
