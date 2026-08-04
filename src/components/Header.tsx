import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Lock, Menu, X, MapPin, Phone, Search, Star, Heart, User } from 'lucide-react';
import { SHOP_CONFIG, CartItem } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { wishlistCount } = useWishlist();
  const { currentUser, userProfile } = useAuth();
  const { t, isFrench, language } = useLanguage();

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Click outside or press Escape to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen]);

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

  const storeName = isFrench ? 'Parfums Bait Al Arab' : SHOP_CONFIG.name;
  const neighborhoodName = isFrench ? 'Quartier Habous • Casablanca' : SHOP_CONFIG.neighborhood;

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#1A1A1A]/95 text-[#FAF9F6] backdrop-blur-md shadow-xl border-b border-[#8C7342]/30 py-3'
          : 'bg-[#1A1A1A] text-[#FAF9F6] py-4'
      }`}
      dir={isFrench ? 'ltr' : 'rtl'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Title */}
          <div
            id="header-brand-logo-button"
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full gold-gradient p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src="/logo.png" alt={storeName} className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-[#FAF9F6] group-hover:text-[#8C7342] transition-colors">
                {storeName}
              </h1>
              <p className="text-xs text-[#8C7342] font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 inline" /> {neighborhoodName}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="header-desktop-nav" className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-sm">
            <button
              id="nav-link-home"
              onClick={() => scrollToSection('hero')}
              className="hover:text-[#8C7342] transition-colors py-1 relative after:absolute after:bottom-0 after:right-0 after:left-0 after:h-0.5 after:bg-[#8C7342] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              {t('nav.home')}
            </button>
            <button
              id="nav-link-products"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('all');
                scrollToSection('catalog');
              }}
              className="hover:text-[#8C7342] transition-colors py-1 relative after:absolute after:bottom-0 after:right-0 after:left-0 after:h-0.5 after:bg-[#8C7342] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              {t('nav.products')}
            </button>
            <button
              id="nav-link-about"
              onClick={() => scrollToSection('about')}
              className="hover:text-[#8C7342] transition-colors py-1 relative after:absolute after:bottom-0 after:right-0 after:left-0 after:h-0.5 after:bg-[#8C7342] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              {t('nav.about')}
            </button>
            <button
              id="nav-link-contact"
              onClick={() => scrollToSection('contact')}
              className="hover:text-[#8C7342] transition-colors py-1 relative after:absolute after:bottom-0 after:right-0 after:left-0 after:h-0.5 after:bg-[#8C7342] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              {t('nav.contact')}
            </button>
          </nav>

          {/* Right Action Icons Toolbar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Icon Trigger / Floating Popover Dropdown */}
            <div ref={searchContainerRef} className="relative">
              <button
                id="header-search-toggle-btn"
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`relative p-2.5 rounded-full transition-all hover:scale-105 flex items-center justify-center border shadow-sm ${
                  isSearchOpen || searchQuery
                    ? 'bg-[#8C7342] text-white border-[#8C7342]'
                    : 'bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#FAF9F6] border-[#8C7342]/30'
                }`}
                title={isFrench ? 'Rechercher un parfum' : 'بحث في العطور'}
                aria-label={isFrench ? 'Rechercher un parfum' : 'بحث في العطور'}
                aria-expanded={isSearchOpen}
              >
                <Search className={`w-4.5 h-4.5 ${isSearchOpen || searchQuery ? 'text-white' : 'text-[#8C7342]'}`} />
                {searchQuery && !isSearchOpen && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#8C7342] border-2 border-[#1A1A1A]" />
                )}
              </button>

              {/* Luxury Floating Search Dropdown Popover */}
              {isSearchOpen && (
                <div
                  id="header-search-dropdown"
                  className="absolute top-full mt-2.5 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-[#1A1A1A] border border-[#8C7342]/60 rounded-2xl shadow-2xl p-3 z-50 animate-fadeIn backdrop-blur-xl"
                  dir={isFrench ? 'ltr' : 'rtl'}
                >
                  <div className="flex items-center bg-[#2A2A2A] border border-[#8C7342]/50 focus-within:border-[#8C7342] rounded-xl px-3 py-2 text-xs text-[#FAF9F6] shadow-inner transition-colors">
                    <Search className="w-4 h-4 text-[#8C7342] shrink-0" />
                    <input
                      id="header-search-input"
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        onSearchChange(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setIsSearchOpen(false);
                        } else if (e.key === 'Enter') {
                          scrollToSection('catalog');
                          setIsSearchOpen(false);
                        }
                      }}
                      placeholder={isFrench ? 'Rechercher un parfum, oud, musc...' : 'ابحث عن عطر، عود، مسك، بخور...'}
                      className="flex-1 bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none px-2.5"
                    />
                    {searchQuery ? (
                      <button
                        id="header-search-clear-btn"
                        type="button"
                        onClick={() => onSearchChange('')}
                        className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors mx-1"
                        title={isFrench ? 'Effacer' : 'مسح'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                    <button
                      id="header-search-submit-btn"
                      type="button"
                      onClick={() => {
                        scrollToSection('catalog');
                        setIsSearchOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-lg gold-gradient text-white text-[11px] font-bold hover:scale-105 transition-transform shrink-0"
                    >
                      {isFrench ? 'Chercher' : 'بحث'}
                    </button>
                  </div>

                  {/* Popular Quick Suggestions Chips */}
                  <div className="mt-2.5 pt-2.5 border-t border-[#8C7342]/20">
                    <div className="text-[11px] font-bold text-gray-400 mb-1.5 flex items-center justify-between">
                      <span>{isFrench ? 'Recherches populaires :' : 'أشهر الكلمات المفتاحية :'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(isFrench
                        ? ['Oud', 'Musc', 'Bakhoor', 'Ambre', 'Rose', 'Oriental']
                        : ['عود ملكي', 'مسك الطهارة', 'بخور', 'عنبر', 'مخلط', 'ورد']
                      ).map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            onSearchChange(term);
                            scrollToSection('catalog');
                            setIsSearchOpen(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#2A2A2A] hover:bg-[#8C7342]/30 text-gray-300 hover:text-white text-[11px] border border-[#8C7342]/30 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher Icon Dropdown */}
            <LanguageSwitcher variant="header" />

            {/* Wishlist Trigger */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#FAF9F6] border border-[#8C7342]/30 transition-all hover:scale-105 flex items-center justify-center shadow-sm"
              title={t('nav.wishlist')}
              aria-label={t('nav.wishlist')}
            >
              <Heart className="w-4.5 h-4.5 text-[#8C7342]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#1A1A1A] animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#FAF9F6] border border-[#8C7342]/30 transition-all hover:scale-105 flex items-center justify-center shadow-sm"
              title={t('nav.cart')}
              aria-label={t('nav.cart')}
            >
              <ShoppingBag className="w-4.5 h-4.5 text-[#8C7342]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-[#8C7342] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#1A1A1A] animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Trigger */}
            {currentUser ? (
              <button
                id="header-profile-btn"
                onClick={onOpenProfile}
                className="p-1 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#FAF9F6] border border-[#8C7342]/30 transition-all hover:scale-105 flex items-center justify-center shadow-sm"
                title={userProfile?.displayName || currentUser.displayName || t('profile.title')}
                aria-label={t('profile.title')}
              >
                <div className="w-7 h-7 rounded-full bg-[#8C7342] text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (userProfile?.displayName || currentUser.displayName || 'U').charAt(0).toUpperCase()
                  )}
                </div>
              </button>
            ) : (
              <button
                id="header-auth-btn"
                onClick={onOpenAuth}
                className="p-2.5 rounded-full bg-[#2A2A2A] hover:bg-[#8C7342] text-white border border-[#8C7342]/40 transition-all hover:scale-105 flex items-center justify-center shadow-sm group"
                title={t('nav.login_register')}
                aria-label={t('nav.login_register')}
              >
                <User className="w-4.5 h-4.5 text-[#8C7342] group-hover:text-white" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              id="header-mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#2A2A2A] text-[#FAF9F6] border border-[#8C7342]/30"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div id="header-mobile-dropdown-menu" className="md:hidden mt-4 pt-4 border-t border-[#8C7342]/20 pb-2 space-y-3 font-medium animate-fadeIn">
            {/* Mobile Language Switcher */}
            <LanguageSwitcher variant="mobile" />

            {/* Mobile Search */}
            <div className="relative mb-3">
              <input
                id="mobile-nav-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (e.target.value) {
                    scrollToSection('catalog');
                  }
                }}
                placeholder={t('nav.search_placeholder')}
                className="w-full bg-[#2A2A2A] border border-[#8C7342]/30 focus:border-[#8C7342] rounded-full pr-10 pl-4 py-2.5 text-xs sm:text-sm text-[#FAF9F6] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8C7342]/50 transition-all"
              />
              <Search className="w-4 h-4 text-[#8C7342] absolute right-3.5 top-3 pointer-events-none" />
            </div>

            {/* User Account Quick Mobile Row */}
            {currentUser ? (
              <button
                id="mobile-nav-profile-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="flex items-center justify-between w-full p-3 rounded-xl bg-[#2A2A2A] text-[#FAF9F6] border border-[#8C7342]/30"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#8C7342] text-white flex items-center justify-center font-bold text-xs">
                    {(userProfile?.displayName || currentUser.displayName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className={isFrench ? 'text-left' : 'text-right'}>
                    <span className="text-xs font-bold block">{userProfile?.displayName || currentUser.displayName || t('nav.my_account')}</span>
                    <span className="text-[10px] text-[#8C7342]">{t('profile.addresses')}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">&rarr;</span>
              </button>
            ) : (
              <button
                id="mobile-nav-auth-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-[#8C7342] text-white text-xs font-bold shadow"
              >
                <User className="w-4 h-4" />
                <span>{t('nav.login_register')}</span>
              </button>
            )}

            <button
              id="mobile-nav-wishlist-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWishlist();
              }}
              className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-[#2A2A2A] text-sm text-red-400"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{t('nav.wishlist')}</span>
              </div>
              {wishlistCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              id="mobile-nav-home-btn"
              onClick={() => scrollToSection('hero')}
              className={`block w-full py-2 px-3 rounded-lg hover:bg-[#2A2A2A] text-sm ${isFrench ? 'text-left' : 'text-right'}`}
            >
              {t('nav.home')}
            </button>
            <button
              id="mobile-nav-products-btn"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('all');
                scrollToSection('catalog');
              }}
              className={`block w-full py-2 px-3 rounded-lg hover:bg-[#2A2A2A] text-sm text-[#8C7342] ${isFrench ? 'text-left' : 'text-right'}`}
            >
              {t('nav.products')}
            </button>
            <button
              id="mobile-nav-about-btn"
              onClick={() => scrollToSection('about')}
              className={`block w-full py-2 px-3 rounded-lg hover:bg-[#2A2A2A] text-sm ${isFrench ? 'text-left' : 'text-right'}`}
            >
              {t('nav.about')}
            </button>
            <button
              id="mobile-nav-contact-btn"
              onClick={() => scrollToSection('contact')}
              className={`block w-full py-2 px-3 rounded-lg hover:bg-[#2A2A2A] text-sm ${isFrench ? 'text-left' : 'text-right'}`}
            >
              {t('nav.contact')}
            </button>

            <a
              id="mobile-nav-google-review-btn"
              href="https://g.page/r/CTQkkxcTLbUJEBI/review"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/30 py-2.5 rounded-lg text-sm font-bold mt-2 hover:bg-[#4285F4]/20 transition-colors"
            >
              <Star className="w-4 h-4 fill-current" />
              <span>{t('nav.google_review')}</span>
            </a>

            <a
              id="mobile-nav-whatsapp-btn"
              href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-lg text-sm font-bold mt-2 shadow"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp: {SHOP_CONFIG.phoneFormatted}</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};


