import React from 'react';
import { SHOP_CONFIG } from '../types';
import { Award, ShieldCheck, Heart, MapPin, Store, Sparkles } from 'lucide-react';
import lattafaBlackEditionImg from '../assets/images/lattafa_black_edition_1785362819475.jpg';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-[#1A1A1A] text-[#FAF9F6] relative overflow-hidden border-t border-[#8C7342]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Showcase Frame */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-3xl p-3 bg-gradient-to-b from-[#8C7342]/40 to-[#2A2A2A] shadow-2xl border border-[#8C7342]/30">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#0A0A0A] relative">
                <img
                  src={lattafaBlackEditionImg}
                  alt="Lattafa Khas Lil Rijal Black Edition"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-4 right-4 left-4 p-4 rounded-xl bg-[#1A1A1A]/90 backdrop-blur-md border border-[#8C7342]/30 text-right">
                  <div className="flex items-center gap-2 text-[#8C7342] text-xs font-bold mb-1">
                    <Store className="w-4 h-4" />
                    <span>متجرنا العريق في الدار البيضاء</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    زنقة مولاي إسماعيل، حي الحبوس التاريخي
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy Story */}
          <div className="lg:col-span-7 space-y-6 text-right order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A2A2A] border border-[#8C7342]/30 text-[#8C7342] text-xs font-bold">
              <Sparkles className="w-4 h-4 text-[#8C7342]" />
              <span>عن متجر عطور بيت العرب</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white leading-tight">
              أصالة العطور الشرقية ودفء الأصالة المغربية <br />
              <span className="gold-text-gradient">في حي الحبوس العريق</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
              في قلب أزقة <span className="text-white font-semibold">حي الحبوس التاريخي بالدار البيضاء</span>، 
              تأسست محلات <span className="text-[#8C7342] font-bold">{SHOP_CONFIG.name}</span> لتكون العنوان 
              الأول لكل من يبحث عن الجودة والتميز. نجمع لكم في متجرنا أرقى أصناف العود والعطور الشرقية، 
              إلى جانب تشكيلة فاخرة من الملابس والزيوت الطبيعية والبخور.
            </p>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
              نحن نرحب بزوارنا الكرام ومحبي الفخامة، ونوفر جميع منتجاتنا للبيع <span className="text-[#8C7342] font-bold">بالجملة والتفصيل</span> مع إمكانية التوصيل المباشر والتواصل عبر الواتساب.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
