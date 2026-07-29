import React from 'react';
import { SHOP_CONFIG } from '../types';
import { Lock, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onSelectCategory: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onSelectCategory }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0A0A] text-gray-400 pt-16 pb-8 border-t border-[#8C7342]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#8C7342]/20">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gold-gradient p-0.5 flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img src="/logo.png" alt="عطور بيت العرب" className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                {SHOP_CONFIG.name}
              </h3>
            </div>

            <p className="text-sm leading-relaxed max-w-md text-gray-400">
              متجر متخصص في عطور العود والمسك الشرقية الفاخرة، والقفاطين والأزياء النسائية المغربية، بالإضافة إلى أجود أنواع العسل الحر الطبيعي من قلب حي الحبوس بالدار البيضاء.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#8C7342]">
              <MapPin className="w-4 h-4" />
              <span>{SHOP_CONFIG.address} • {SHOP_CONFIG.city}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-white">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="hover:text-[#8C7342] transition-colors"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('perfumes');
                    scrollToSection('catalog');
                  }}
                  className="hover:text-[#8C7342] transition-colors"
                >
                  قسم العطور والعود
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('abayas');
                    scrollToSection('catalog');
                  }}
                  className="hover:text-[#8C7342] transition-colors"
                >
                  الأزياء والقفاطين
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('honey');
                    scrollToSection('catalog');
                  }}
                  className="hover:text-[#8C7342] transition-colors"
                >
                  العسل الحر الطبيعي
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-white">
              تواصل معنا
            </h4>
            <div className="space-y-2 text-sm">
              <a
                href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#25D366] hover:underline font-bold dir-ltr justify-end"
              >
                <span>{SHOP_CONFIG.phoneFormatted}</span>
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${SHOP_CONFIG.email}`}
                className="flex items-center gap-2 text-gray-400 hover:text-[#8C7342] transition-colors dir-ltr justify-end"
              >
                <span>{SHOP_CONFIG.email}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </a>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={SHOP_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#2A2A2A] text-[#8C7342] hover:bg-[#8C7342] hover:text-white flex items-center justify-center transition-colors shadow"
                  aria-label="إنستغرام"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href={SHOP_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#2A2A2A] text-[#8C7342] hover:bg-[#8C7342] hover:text-white flex items-center justify-center transition-colors shadow"
                  aria-label="فيسبوك"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center text-xs text-gray-500 gap-4">
          <p onDoubleClick={onOpenAdmin} className="cursor-default">
            © {new Date().getFullYear()} {SHOP_CONFIG.name} — جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};
