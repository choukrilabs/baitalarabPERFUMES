import React from 'react';
import { CartItem, SHOP_CONFIG } from '../types';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';

import { ProductImage } from './ProductImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const generateWhatsappMessage = () => {
    let msg = `مرحباً عطور بيت العرب 🌿\nأود طلب قائمة المنتجات التالية:\n\n`;
    cartItems.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.product.name}*\n   • الكمية: ${item.quantity}\n   • السعر: ${
        item.product.price * item.quantity
      } درهم\n`;
    });
    msg += `\n*الإجمالي التقديري: ${totalPrice} درهم مغربي*\nالرجاء تأكيد الطلب وتحديد التوصيل. شكراً لك!`;

    return `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-r border-gray-200">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-[#1A1A1A] text-[#FAF9F6] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-[#8C7342]" />
              <div>
                <h2 className="font-display font-bold text-lg text-white">سلة الطلبات المباشرة</h2>
                <p className="text-xs text-[#8C7342]">إرسال قائمة الطلب عبر واتساب</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#2A2A2A] text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF9F6]">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm flex items-center gap-3"
                >
                  <div className="w-16 h-16 shrink-0">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-xl bg-gray-100"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#1A1A1A] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-[#8C7342] font-extrabold mt-0.5">
                      {item.product.price} درهم
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-[#8C7342] text-[#1A1A1A] hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-[#8C7342] text-[#1A1A1A] hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-base text-[#1A1A1A]">
                  السلة فارغة حالياً
                </h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  أضف المنتجات التي ترغب بها ثم اضغط على زر إرسال الطلب عبر واتساب.
                </p>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-gray-200 space-y-4">
              <div className="flex items-center justify-between text-base font-bold text-[#1A1A1A]">
                <span>المجموع الكلي:</span>
                <span className="text-xl text-[#8C7342]">{totalPrice} درهم</span>
              </div>

              <div className="space-y-2">
                <a
                  href={generateWhatsappMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>إرسال الطلب عبر واتساب ({cartItems.length})</span>
                </a>

                <button
                  onClick={onClearCart}
                  className="w-full text-xs text-gray-500 hover:text-red-500 py-1 transition-colors text-center"
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
