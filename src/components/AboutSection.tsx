import React from 'react';
import { SHOP_CONFIG } from '../types';
import { ProductImage } from './ProductImage';
import { Award, ShieldCheck, Heart, MapPin, Store, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const AboutSection: React.FC<{products: Product[]}> = ({products}) => {
  const { t, isFrench } = useLanguage();
  const aboutImg = products.find(p => p.image && p.image.startsWith("data:"))?.image || products.find(p => p.image)?.image;

  return (
    <section id="about" className="py-16 bg-[#1A1A1A] text-[#FAF9F6] relative overflow-hidden border-t border-[#8C7342]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Showcase Frame */}
          <div className={`lg:col-span-5 relative ${isFrench ? 'order-2 lg:order-2' : 'order-2 lg:order-1'}`}>
            <div className="relative rounded-3xl p-3 bg-gradient-to-b from-[#8C7342]/40 to-[#2A2A2A] shadow-2xl border border-[#8C7342]/30">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#0A0A0A] relative">
                <ProductImage
                  src={aboutImg}
                  alt={isFrench ? "Boutique Parfums Bait Al Arab" : "متجر عطور بيت العرب"}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />
                
                <div className={`absolute bottom-4 right-4 left-4 p-4 rounded-xl bg-[#1A1A1A]/90 backdrop-blur-md border border-[#8C7342]/30 ${isFrench ? 'text-left' : 'text-right'}`}>
                  <div className="flex items-center gap-2 text-[#8C7342] text-xs font-bold mb-1">
                    <Store className="w-4 h-4" />
                    <span>{t('about.loc_tag')}</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    {t('about.loc_sub')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy Story */}
          <div className={`lg:col-span-7 space-y-6 ${isFrench ? 'text-left order-1 lg:order-1' : 'text-right order-1 lg:order-2'}`}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A2A2A] border border-[#8C7342]/30 text-[#8C7342] text-xs font-bold">
              <Sparkles className="w-4 h-4 text-[#8C7342]" />
              <span>{t('about.badge')}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white leading-tight">
              {isFrench ? (
                <>
                  L’Authenticité des Parfums d’Orient <br />
                  <span className="gold-text-gradient">au Cœur des Habous à Casablanca</span>
                </>
              ) : (
                <>
                  أصالة العطور الشرقية ودفء الأصالة المغربية <br />
                  <span className="gold-text-gradient">في حي الحبوس العريق</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
              {t('about.p1')}
            </p>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
              {t('about.p2')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
