import React from 'react';
import { SHOP_CONFIG } from '../types';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'مرحباً عطور بيت العرب 🌿\nأود الاستفسار عن المنتجات وتأكيد التوصيل لمدينتي.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2" dir="rtl">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-white group"
        aria-label="تواصل معنا عبر الواتساب المباشر"
        title="مراسلة عبر الواتساب المباشر"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:mr-2 transition-all duration-300 text-xs font-bold">
          راسلنا عبر واتساب
        </span>
      </a>
    </div>
  );
};
