import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'header' | 'mobile' | 'footer' | 'pill';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { language, setLanguage, toggleLanguage, isFrench } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  if (variant === 'footer') {
    return (
      <div id="footer-language-switcher" className={`inline-flex items-center gap-2 p-1 bg-[#1A1A1A] border border-[#8C7342]/40 rounded-full text-xs ${className}`}>
        <button
          id="footer-lang-ar-btn"
          type="button"
          onClick={() => setLanguage('ar')}
          className={`px-3 py-1 rounded-full font-bold transition-all ${
            !isFrench
              ? 'gold-gradient text-white shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
          aria-label="التحويل إلى اللغة العربية"
        >
          العربية
        </button>
        <button
          id="footer-lang-fr-btn"
          type="button"
          onClick={() => setLanguage('fr')}
          className={`px-3 py-1 rounded-full font-bold transition-all ${
            isFrench
              ? 'gold-gradient text-white shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
          aria-label="Passer en Français"
        >
          Français
        </button>
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div id="mobile-language-switcher" className={`flex items-center justify-between p-3 rounded-xl bg-[#2A2A2A] border border-[#8C7342]/30 text-sm ${className}`}>
        <div className="flex items-center gap-2.5 text-[#FAF9F6] font-medium">
          <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-[#8C7342]">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block text-xs sm:text-sm">
              {isFrench ? 'Langue / اللغة' : 'اللغة / Langue'}
            </span>
            <span className="text-[11px] text-[#8C7342]">
              {isFrench ? 'Français sélectionné' : 'العربية مختارة'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#1A1A1A] p-1 rounded-lg border border-[#8C7342]/20">
          <button
            id="mobile-lang-ar-btn"
            type="button"
            onClick={() => setLanguage('ar')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              !isFrench
                ? 'gold-gradient text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            العربية
          </button>
          <button
            id="mobile-lang-fr-btn"
            type="button"
            onClick={() => setLanguage('fr')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              isFrench
                ? 'gold-gradient text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            FR
          </button>
        </div>
      </div>
    );
  }

  // Header icon button that expands a dropdown menu when clicked
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        id="header-language-toggle-btn"
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`relative p-2.5 rounded-full transition-all hover:scale-105 flex items-center justify-center border shadow-sm ${
          isDropdownOpen
            ? 'bg-[#8C7342] text-white border-[#8C7342]'
            : 'bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#FAF9F6] border-[#8C7342]/30'
        }`}
        title={isFrench ? 'Changer de langue' : 'تغيير اللغة'}
        aria-label={isFrench ? 'Changer de langue' : 'تغيير اللغة'}
        aria-expanded={isDropdownOpen}
      >
        <Globe className={`w-4.5 h-4.5 ${isDropdownOpen ? 'text-white' : 'text-[#8C7342]'}`} />
        <span className="absolute -bottom-1 -right-1 bg-[#8C7342] text-white text-[9px] font-extrabold px-1 rounded-full border border-[#1A1A1A] uppercase">
          {language}
        </span>
      </button>

      {/* Luxury Dropdown Menu Popover */}
      {isDropdownOpen && (
        <div
          id="header-language-dropdown"
          className="absolute top-full mt-2 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-44 bg-[#1A1A1A] border border-[#8C7342]/50 rounded-2xl shadow-2xl p-1.5 z-50 animate-fadeIn"
          dir={isFrench ? 'ltr' : 'rtl'}
        >
          <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 border-b border-gray-800 flex items-center justify-between">
            <span>{isFrench ? 'Choisir la langue' : 'اختر اللغة'}</span>
            <Globe className="w-3 h-3 text-[#8C7342]" />
          </div>

          <div className="space-y-1 mt-1">
            <button
              id="header-dropdown-lang-ar"
              type="button"
              onClick={() => {
                setLanguage('ar');
                setIsDropdownOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                !isFrench
                  ? 'gold-gradient text-white shadow-sm'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🇲🇦</span>
                <span>العربية</span>
              </div>
              {!isFrench && <Check className="w-3.5 h-3.5 text-white" />}
            </button>

            <button
              id="header-dropdown-lang-fr"
              type="button"
              onClick={() => {
                setLanguage('fr');
                setIsDropdownOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                isFrench
                  ? 'gold-gradient text-white shadow-sm'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🇫🇷</span>
                <span>Français</span>
              </div>
              {isFrench && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
