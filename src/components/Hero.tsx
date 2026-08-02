import React from 'react';
import { Sparkles, MessageCircle, MapPin, Award, ShieldCheck, Heart } from 'lucide-react';
import { SHOP_CONFIG } from '../types';
import heroImage from '../assets/images/generic_oud_perfume_1785362643211.jpg';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section id="hero" className="relative dark-amber-gradient text-[#FAF9F6] overflow-hidden py-16 lg:py-24 border-b border-[#8C7342]/30">
      {/* Decorative Golden Ambient Circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#8C7342]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#1A1A1A]/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 text-center lg:text-right space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A2A2A]/90 border border-[#8C7342]/40 text-[#8C7342] text-xs sm:text-sm font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-[#8C7342]" />
              <span>من قلب حي الحبوس العريق • الدار البيضاء</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight text-[#FAF9F6]">
              عطور <span className="gold-text-gradient">بيت العرب</span>
            </h1>

            {/* Paragraph Description */}
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              وجهتكم الأولى لأفخر أنواع <span className="text-[#8C7342] font-medium">العود والعطور الشرقية الأصيلة</span>، 
              و<span className="text-[#8C7342] font-medium">البخور والزيوت الطبيعية</span>، بالإضافة إلى 
              <span className="text-[#8C7342] font-medium">تشكيلة مختارة من الملابس</span>.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2 justify-center lg:justify-start bg-[#2A2A2A]/60 p-2.5 rounded-xl border border-[#8C7342]/20">
                <ShieldCheck className="w-4 h-4 text-[#8C7342] shrink-0" />
                <span>عطور ثابته وأصيلة</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start bg-[#2A2A2A]/60 p-2.5 rounded-xl border border-[#8C7342]/20">
                <Award className="w-4 h-4 text-[#8C7342] shrink-0" />
                <span>زيوت طبيعية وبخور</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start bg-[#2A2A2A]/60 p-2.5 rounded-xl border border-[#8C7342]/20 col-span-2 sm:col-span-1">
                <Heart className="w-4 h-4 text-[#8C7342] shrink-0" />
                <span>بيع بالجملة والتفصيل</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={onExploreClick}
                className="gold-gradient text-white px-8 py-3.5 rounded-full font-bold text-base shadow-xl hover:shadow-[#C1841A]/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <span>تصفّح التشكيلة الكاملة</span>
                <Sparkles className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent('مرحباً عطور بيت العرب، أود الاستفسار عن المنتجات والعروض المتاحة.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-7 py-3.5 rounded-full font-bold text-base shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>

            {/* Social Links Subrow */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-gray-400">
              <span>تابعونا على:</span>
              <a
                href={SHOP_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#8C7342] underline flex items-center gap-1 transition-colors"
              >
                انستغرام
              </a>
              <span>•</span>
              <a
                href={SHOP_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#8C7342] underline flex items-center gap-1 transition-colors"
              >
                فيسبوك
              </a>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-3xl p-3 bg-gradient-to-b from-[#8C7342]/40 to-[#1A1A1A] shadow-2xl border border-[#8C7342]/30">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#0A0A0A]">
                <img
                  src={heroImage}
                  alt="عطور بيت العرب"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-90" />
                
                {/* Overlay Card Details */}
                <div className="absolute bottom-4 right-4 left-4 p-4 rounded-xl bg-[#1A1A1A]/90 backdrop-blur-md border border-[#8C7342]/30 text-right space-y-1">
                  <div className="flex items-center justify-between text-[#8C7342] text-xs font-bold">
                    <span>مجموعة العود والمسك</span>
                    <span className="bg-[#8C7342]/30 px-2 py-0.5 rounded-full">أصلي 100%</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">حي الحبوس • الدار البيضاء</h3>
                  <p className="text-xs text-gray-300">زنقة مولاي إسماعيل، متجر عطور بيت العرب</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
