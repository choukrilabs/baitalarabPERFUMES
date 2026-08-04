import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, X, Flame } from 'lucide-react';
import { PromoBannerConfig, CategoryType } from '../types';

interface PromoBannerProps {
  config: PromoBannerConfig;
  onSelectCategory?: (category: CategoryType | 'all') => void;
  onExplore?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  config,
  onSelectCategory,
  onExplore,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Reset dismissal if headline or enabled state changes (new promotion)
  useEffect(() => {
    setIsDismissed(false);
  }, [config.headline, config.enabled]);

  if (!config.enabled || isDismissed) {
    return null;
  }

  const handleCtaClick = () => {
    if (config.ctaCategory && onSelectCategory) {
      onSelectCategory(config.ctaCategory);
    }
    if (onExplore) {
      onExplore();
    } else {
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Theme Styling configurations
  const themeStyles = {
    gold_dark: {
      container: 'bg-gradient-to-r from-[#120F0A] via-[#241B0E] to-[#120F0A] border-[#C1841A]/50 text-white shadow-xl shadow-black/40',
      badge: 'bg-[#C1841A]/20 text-[#E5B558] border border-[#C1841A]/40',
      ctaBtn: 'bg-gradient-to-r from-[#C1841A] to-[#E5B558] hover:from-[#A87114] hover:to-[#D4A346] text-[#1A1105]',
      accentGlow: 'from-[#C1841A]/15 to-transparent',
    },
    emerald_gold: {
      container: 'bg-gradient-to-r from-[#071D13] via-[#0E3524] to-[#071D13] border-[#25D366]/40 text-white shadow-xl shadow-black/40',
      badge: 'bg-[#25D366]/20 text-[#68E297] border border-[#25D366]/40',
      ctaBtn: 'bg-gradient-to-r from-[#25D366] to-[#1FAF54] hover:from-[#1FAF54] hover:to-[#178E43] text-white',
      accentGlow: 'from-[#25D366]/15 to-transparent',
    },
    ruby_gold: {
      container: 'bg-gradient-to-r from-[#21090F] via-[#3B111B] to-[#21090F] border-[#E14D66]/40 text-white shadow-xl shadow-black/40',
      badge: 'bg-[#E14D66]/20 text-[#FF8DA0] border border-[#E14D66]/40',
      ctaBtn: 'bg-gradient-to-r from-[#E14D66] to-[#C9334D] hover:from-[#C9334D] hover:to-[#A7243B] text-white',
      accentGlow: 'from-[#E14D66]/15 to-transparent',
    },
    midnight_blue: {
      container: 'bg-gradient-to-r from-[#071424] via-[#0D2442] to-[#071424] border-[#4A90E2]/40 text-white shadow-xl shadow-black/40',
      badge: 'bg-[#4A90E2]/20 text-[#90CAF9] border border-[#4A90E2]/40',
      ctaBtn: 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:from-[#B89628] hover:to-[#D4AF37] text-[#0A1626]',
      accentGlow: 'from-[#4A90E2]/15 to-transparent',
    },
  };

  const currentTheme = themeStyles[config.theme || 'gold_dark'] || themeStyles.gold_dark;

  return (
    <aside
      aria-label="إعلان ترويجي وعروض خاصة"
      className="relative z-30 w-full px-2 sm:px-4 pt-2.5 pb-1 max-w-7xl mx-auto animate-fadeIn"
      dir="rtl"
    >
      <div
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border p-3 sm:p-4 transition-all duration-300 ${currentTheme.container}`}
      >
        {/* Subtle Decorative Ambient Background Glow */}
        <div
          className={`absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gradient-to-br ${currentTheme.accentGlow} blur-2xl pointer-events-none`}
        />
        <div
          className={`absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-gradient-to-tr ${currentTheme.accentGlow} blur-2xl pointer-events-none`}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Main Info Block */}
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0">
            {/* Sparkling Icon */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5B558] animate-pulse" />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {config.badgeText && (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-full ${currentTheme.badge}`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{config.badgeText}</span>
                  </span>
                )}

                {config.countdownText && (
                  <span className="text-[10px] sm:text-[11px] text-gray-300 font-medium flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    <span>{config.countdownText}</span>
                  </span>
                )}
              </div>

              <h2 className="font-display font-bold text-sm sm:text-base lg:text-lg text-white leading-tight">
                {config.headline}
              </h2>

              {config.subtext && (
                <p className="text-xs sm:text-sm text-gray-300/90 line-clamp-2 leading-relaxed">
                  {config.subtext}
                </p>
              )}
            </div>
          </div>

          {/* Action Controls: CTA Button & Close */}
          <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center shrink-0 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-between sm:justify-end">
            {/* Primary Action Button */}
            {config.ctaText && (
              <button
                type="button"
                onClick={handleCtaClick}
                className={`font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 ${currentTheme.ctaBtn}`}
              >
                <span>{config.ctaText}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            {/* Dismiss / Close Button */}
            {config.closable !== false && (
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="إغلاق الإعلان الترويجي"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
