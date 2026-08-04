import React, { useState, useEffect } from 'react';
import { ShoppingBag, Lock, Menu, X, MapPin, Phone, Search, Star, Heart, User } from 'lucide-react';
import { SHOP_CONFIG, CartItem } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onSelectCategory?: (category: string) => void;
  onNavigateHome?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
  onSelectCategory,
  onNavigateHome,
  searchQuery,
  onSearchChange,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wishlistCount } = useWishlist();
  const { currentUser, userProfile } = useAuth();

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
    if (onNavigateHome) {
      onNavigateHome();
    }
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
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
            {/* Search Input */}
            <div className="relative hidden md:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (e.target.value) {
                    scrollToSection('catalog');
                  }
                }}
                placeholder="ابحث..."
                className="w-32 lg:w-48 bg-[#2A2A2A] border border-[#8C7342]/30 focus:border-[#8C7342] rounded-full pr-10 pl-4 py-2 text-xs text-[#FAF9F6] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8C7342]/50 transition-all"
              />
              <Search className="w-4 h-4 text-[#8C7342] absolute right-3.5 top-2 pointer-events-none" />
            </div>

            {/* Google Review Button */}
            <a
              href="https://g.page/r/CTQkkxcTLbUJEBI/review"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 bg-[#4285F4]/10 hover:bg-[#4285F4]/20 text-[#4285F4] px-3.5 py-2 rounded-full text-xs font-bold transition-transform hover:scale-105 border border-[#4285F4]/30"
              title="تقييم متجرنا على جوجل"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>تقييم جوجل</span>
            </a>

            {/* Wishlist Trigger */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#FAF9F6] border border-[#8C7342]/30 transition-all hover:scale-105"
              title="قائمة المفضلة"
              aria-label="فتح قائمة المفضلة"
            >
              <Heart className="w-5 h-5 text-[#8C7342]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1A1A1A] animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

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

            {/* User Account / Auth Trigger */}
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#FAF9F6] border border-[#8C7342]/30 transition-all hover:scale-105"
                title="حسابي وعناويني"
              >
                <div className="w-7 h-7 rounded-full bg-[#8C7342] text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (userProfile?.displayName || currentUser.displayName || 'ع').charAt(0).toUpperCase()
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold max-w-[100px] truncate text-[#FAF9F6]">
                  {userProfile?.displayName || currentUser.displayName || 'حسابي'}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#2A2A2A] hover:bg-[#8C7342] text-white border border-[#8C7342]/40 transition-all hover:scale-105 text-xs font-bold"
                title="تسجيل الدخول"
              >
                <User className="w-3.5 h-3.5 text-[#8C7342] group-hover:text-white" />
                <span>دخول / تسجيل</span>
              </button>
            )}

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
            {/* Mobile Search */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (e.target.value) {
                    scrollToSection('catalog');
                  }
                }}
                placeholder="ابحث عن عطر، بخور، زيوت طبيعية..."
                className="w-full bg-[#2A2A2A] border border-[#8C7342]/30 focus:border-[#8C7342] rounded-full pr-10 pl-4 py-2.5 text-sm text-[#FAF9F6] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8C7342]/50 transition-all"
              />
              <Search className="w-4 h-4 text-[#8C7342] absolute right-3.5 top-3 pointer-events-none" />
            </div>

            {/* User Account Quick Mobile Row */}
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="flex items-center justify-between w-full p-3 rounded-xl bg-[#2A2A2A] text-[#FAF9F6] border border-[#8C7342]/30"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#8C7342] text-white flex items-center justify-center font-bold text-xs">
                    {(userProfile?.displayName || currentUser.displayName || 'ع').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold block">{userProfile?.displayName || currentUser.displayName || 'حسابي'}</span>
                    <span className="text-[10px] text-[#8C7342]">العناوين وسجل الطلبات</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">إدارة الحساب &larr;</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-[#8C7342] text-white text-xs font-bold shadow"
              >
                <User className="w-4 h-4" />
                <span>تسجيل الدخول / إنشاء حساب جديد</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWishlist();
              }}
              className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-[#2A2A2A] text-sm text-red-400"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>المفضلة</span>
              </div>
              {wishlistCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

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
              href="https://g.page/r/CTQkkxcTLbUJEBI/review"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/30 py-2.5 rounded-lg text-sm font-bold mt-2 hover:bg-[#4285F4]/20 transition-colors"
            >
              <Star className="w-4 h-4 fill-current" />
              <span>تقييمنا على جوجل</span>
            </a>

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
