import React from 'react';
import { ProductImage } from './ProductImage';
import { Sparkles, MessageCircle, MapPin, Award, ShieldCheck, Heart, Truck } from 'lucide-react';
import { SHOP_CONFIG } from '../types';
import { Product } from "../types";
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  products: Product[];
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, products }) => {
  const { t, isFrench, language } = useLanguage();
  const heroImg = products.find(p => p.image && p.image.startsWith("data:"))?.image || products.find(p => p.image)?.image;

  const whatsappInquiryMsg = isFrench
    ? 'Bonjour Parfums Bait Al Arab, je souhaite me renseigner sur vos produits et offres disponibles.'
    : 'مرحباً عطور بيت العرب، أود الاستفسار عن المنتجات والعروض المتاحة.';

  return (
    <section id="hero" className="relative dark-amber-gradient text-[#FAF9F6] overflow-hidden py-16 lg:py-24 border-b border-[#8C7342]/30" dir={isFrench ? 'ltr' : 'rtl'}>
      {/* Decorative Golden Ambient Circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#8C7342]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#1A1A1A]/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className={`lg:col-span-7 text-center ${isFrench ? 'lg:text-left' : 'lg:text-right'} space-y-6`}>
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2A2A2A]/90 border border-[#8C7342]/40 text-[#8C7342] text-xs sm:text-sm font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-[#8C7342]" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight text-[#FAF9F6]">
              {isFrench ? (
                <>Parfums <span className="gold-text-gradient">Bait Al Arab</span></>
              ) : (
                <>عطور <span className="gold-text-gradient">بيت العرب</span></>
              )}
            </h1>

            {/* Paragraph Description */}
            <p className={`text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto ${isFrench ? 'lg:mx-0' : 'lg:mx-0'} font-normal`}>
              {t('hero.desc')}
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm font-medium">
              <div className={`flex items-center gap-2 justify-center ${isFrench ? 'lg:justify-start' : 'lg:justify-start'} bg-[#2A2A2A]/60 p-2.5 rounded-xl border border-[#8C7342]/20`}>
                <ShieldCheck className="w-4 h-4 text-[#8C7342] shrink-0" />
                <span>{t('hero.feat_perfumes')}</span>
              </div>
              <div className={`flex items-center gap-2 justify-center ${isFrench ? 'lg:justify-start' : 'lg:justify-start'} bg-[#2A2A2A]/60 p-2.5 rounded-xl border border-[#8C7342]/20`}>
                <Award className="w-4 h-4 text-[#8C7342] shrink-0" />
                <span>{t('hero.feat_oils')}</span>
              </div>
              <div className={`flex items-center gap-2 justify-center ${isFrench ? 'lg:justify-start' : 'lg:justify-start'} bg-[#2A2A2A]/60 p-2.5 rounded-xl border border-[#8C7342]/20 col-span-2 sm:col-span-1`}>
                <Heart className="w-4 h-4 text-[#8C7342] shrink-0" />
                <span>{t('hero.feat_wholesale')}</span>
              </div>
            </div>

            {/* Moroccan Direct Reassurance Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-[#1A1A1A] border border-[#25D366]/40 text-emerald-200 text-xs sm:text-sm font-bold shadow-md">
              <span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
              </span>
              <span>{t('trust.badge')}</span>
            </div>

            {/* CTA Action Buttons */}
            <div className={`pt-4 flex flex-wrap gap-4 justify-center ${isFrench ? 'lg:justify-start' : 'lg:justify-start'}`}>
              <button
                onClick={onExploreClick}
                className="gold-gradient text-white px-8 py-3.5 rounded-full font-bold text-base shadow-xl hover:shadow-[#C1841A]/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <span>{t('hero.cta_explore')}</span>
                <Sparkles className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappInquiryMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-7 py-3.5 rounded-full font-bold text-base shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t('hero.cta_whatsapp')}</span>
              </a>
            </div>

            {/* Social Links Subrow */}
            <div className={`pt-2 flex items-center justify-center ${isFrench ? 'lg:justify-start' : 'lg:justify-start'} gap-4 text-xs text-gray-400`}>
              <span>{t('hero.follow_us')}</span>
              <a
                href={SHOP_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#8C7342] underline flex items-center gap-1 transition-colors"
              >
                {t('hero.instagram')}
              </a>
              <span>•</span>
              <a
                href={SHOP_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#8C7342] underline flex items-center gap-1 transition-colors"
              >
                {t('hero.facebook')}
              </a>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-3xl p-3 bg-gradient-to-b from-[#8C7342]/40 to-[#1A1A1A] shadow-2xl border border-[#8C7342]/30">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#0A0A0A]">
                <ProductImage
                  src={heroImg}
                  alt={isFrench ? "Parfums Bait Al Arab" : "عطور بيت العرب"}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-90" />
                
                {/* Overlay Card Details */}
                <div className={`absolute bottom-4 right-4 left-4 p-4 rounded-xl bg-[#1A1A1A]/90 backdrop-blur-md border border-[#8C7342]/30 ${isFrench ? 'text-left' : 'text-right'} space-y-1`}>
                  <div className="flex items-center justify-between text-[#8C7342] text-xs font-bold">
                    <span>{t('hero.showcase_title')}</span>
                    <span className="bg-[#8C7342]/30 px-2 py-0.5 rounded-full">{t('hero.showcase_badge')}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {isFrench ? 'Habous • Casablanca' : 'حي الحبوس • الدار البيضاء'}
                  </h3>
                  <p className="text-xs text-gray-300">
                    {isFrench ? 'Rue Moulay Ismaïl, Magasin Bait Al Arab' : 'زنقة مولاي إسماعيل، متجر عطور بيت العرب'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

