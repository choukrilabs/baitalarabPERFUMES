import React, { useState, useEffect } from 'react';
import { SHOP_CONFIG } from '../types';
import { MessageCircle, Sparkles } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
    // Trigger subtle attention pulse after user has been on page for 10 seconds
    const timer = setTimeout(() => {
      setShouldPulse(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'مرحباً عطور بيت العرب 🌿\nأود الاستفسار عن المنتجات وتأكيد التوصيل لمدينتي.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2" dir="rtl">
      {/* Gentle Floating Prompt Badge after 10s */}
      {shouldPulse && (
        <div className="hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#1A1A1A] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-[#8C7342]/30 animate-bounce mb-1">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          <span>تواصل معنا عبر واتساب</span>
        </div>
      )}

      <div className="relative flex items-center justify-center">
        {/* Subtle Pulse Rings */}
        {shouldPulse && (
          <>
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
            <span className="absolute -inset-1.5 rounded-full bg-[#25D366]/20 animate-pulse pointer-events-none" />
          </>
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-white group ${
            shouldPulse ? 'shadow-[0_0_20px_rgba(37,211,102,0.4)]' : ''
          }`}
          aria-label="تواصل معنا عبر الواتساب المباشر"
          title="مراسلة عبر الواتساب المباشر"
        >
          <MessageCircle className={`w-7 h-7 ${shouldPulse ? 'animate-pulse' : ''}`} />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:mr-2 transition-all duration-300 text-xs font-bold">
            راسلنا عبر واتساب
          </span>
        </a>
      </div>
    </div>
  );
};
