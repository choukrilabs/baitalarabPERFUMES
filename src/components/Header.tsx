import React, { useState, useEffect } from 'react';
import { ShoppingBag, Lock, Menu, X, MapPin, Phone } from 'lucide-react';
import { SHOP_CONFIG, CartItem } from '../types';

interface HeaderProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  onOpenCart,
  onOpenAdmin,
  onSelectCategory,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#1A1A1A]/95 text-[#FAF9F6] backdrop-blur-md shadow-xl border-b border-[#8C7342]/30 py-3'
          : 'bg-[#1A1A1A] text-[#FAF9F6] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Title */}
          <div
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full gold-gradient p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src="/logo.png" alt="عطور بيت العرب" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-[#FAF9F6] group-hover:text-[#8C7342] transition-colors">
                {SHOP_CONFIG.name}
              </h1>
              <p className="text-xs text-[#8C7342] font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 inline" /> {SHOP_CONFIG.neighborhood}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-[#8C7342] transition-colors py-1 relative after:absolute after:bottom-0 after:right-0 after:left-0 after:h-0.5 after:bg-[#8C7342] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              الرئيسية
            </button>
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory('all');
                scrollToSection('catalog');
              }}
              className="hover:text-[#8C7342] transition-colors py-1 relative after:absolute after:bottom-0 after:right-0 after:left-0 after:h-0.5 after:bg-[#8C7342] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              تصفّح المنتجات
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-[#8C7342] transition-colors py-1 relative after:absolute after:bottom-0 after:right-0 after:left-0 after:h-0.5 after:bg-[#8C7342] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              من نحن
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-[#8C7342] transition-colors py-1 relative after:absolute after:bottom-0 after:right-0 after:left-0 after:h-0.5 after:bg-[#8C7342] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              الموقع والتواصل
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct WhatsApp Callout Button */}
            <a
              href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3.5 py-2 rounded-full text-xs font-bold transition-transform hover:scale-105 shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{SHOP_CONFIG.phoneFormatted}</span>
            </a>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#FAF9F6] border border-[#8C7342]/30 transition-all hover:scale-105"
              title="سلة الطلبات"
              aria-label="فتح سلة الطلبات"
            >
              <ShoppingBag className="w-5 h-5 text-[#8C7342]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-[#8C7342] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1A1A1A] animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Admin Login Button - HIDDEN for security, moved to double click on logo */}
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#2A2A2A] text-[#FAF9F6] border border-[#8C7342]/30"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-[#8C7342]/20 pb-2 space-y-3 font-medium text-right animate-fadeIn">
            <button
              onClick={() => scrollToSection('hero')}
              className="block w-full text-right py-2 px-3 rounded-lg hover:bg-[#2A2A2A] text-sm"
            >
              الرئيسية
            </button>
            <button
              onClick={() => {
                if (onSelectCategory) onSelectCategory('all');
                scrollToSection('catalog');
              }}
              className="block w-full text-right py-2 px-3 rounded-lg hover:bg-[#2A2A2A] text-sm text-[#8C7342]"
            >
              تصفّح المنتجات
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-right py-2 px-3 rounded-lg hover:bg-[#2A2A2A] text-sm"
            >
              من نحن
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-right py-2 px-3 rounded-lg hover:bg-[#2A2A2A] text-sm"
            >
              الموقع والتواصل
            </button>

            <a
              href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-bold mt-2 shadow"
            >
              <Phone className="w-4 h-4" />
              <span>واتساب: {SHOP_CONFIG.phoneFormatted}</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
