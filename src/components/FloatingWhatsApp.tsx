import React from 'react';
import { SHOP_CONFIG } from '../types';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'مرحباً عطور بيت العرب 🌿\nأود الاستفسار عن المنتجات والعروض المتاحة في المتجر.'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#128C7E] hover:bg-[#075E54] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-white group animate-bounce"
      aria-label="تواصل معنا عبر الواتساب المباشر"
      title="مراسلة عبر الواتساب المباشر"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:mr-2 transition-all duration-300 text-xs font-bold">
        راسلنا عبر واتساب
      </span>
    </a>
  );
};
