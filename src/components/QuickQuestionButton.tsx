import React, { useState } from 'react';
import { Product } from '../types';
import {
  MessageCircle,
  HelpCircle,
  Sparkles,
  PackageCheck,
  ChevronDown,
  ExternalLink,
  Info,
} from 'lucide-react';
import {
  buildProductAvailabilityWhatsappMessage,
  buildProductScentProfileWhatsappMessage,
  buildQuickQuestionWhatsappMessage,
  getWhatsappUrl,
} from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

interface QuickQuestionButtonProps {
  product: Product;
  variant?: 'inline' | 'card' | 'compact';
  className?: string;
}

export const QuickQuestionButton: React.FC<QuickQuestionButtonProps> = ({
  product,
  variant = 'card',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, isFrench, language } = useLanguage();

  const availabilityUrl = getWhatsappUrl(buildProductAvailabilityWhatsappMessage(product, language));
  const scentProfileUrl = getWhatsappUrl(buildProductScentProfileWhatsappMessage(product, language));
  const generalUrl = getWhatsappUrl(buildQuickQuestionWhatsappMessage(product, 'general', language));

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} dir={isFrench ? 'ltr' : 'rtl'}>
        <a
          href={generalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FAF9F6] hover:bg-[#8C7342]/10 text-[#8C7342] border border-[#8C7342]/30 transition-all hover:scale-102 shadow-sm"
          title={isFrench ? "Question rapide sur WhatsApp" : "سؤال سريع عن التوفر أو الرائحة عبر واتساب"}
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#8C7342]" />
          <span>{isFrench ? 'Question Rapide' : 'سؤال سريع'}</span>
        </a>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        isOpen
          ? 'bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/50 border-[#8C7342]/40 shadow-md'
          : 'bg-[#FAF9F6] border-gray-200/90 hover:border-[#8C7342]/40'
      } ${className}`}
      dir={isFrench ? 'ltr' : 'rtl'}
    >
      {/* Top Banner / Toggle Bar */}
      <div className="p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8C7342]/10 text-[#8C7342] flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className={isFrench ? 'text-left' : 'text-right'}>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
                  {isFrench ? 'Une question sur ce produit ?' : 'سؤال سريع عن هذا المنتج؟'}
                </span>
                <span className="text-[10px] font-semibold bg-[#25D366]/15 text-[#1a883f] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                  {isFrench ? 'Réponse rapide' : 'رد سريع'}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {isFrench ? 'Discutez instantanément sur WhatsApp pour le stock ou la fragrance' : 'استفسر فوراً عبر واتساب عن التوفر بالمحل أو النوتات والثبات'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-gray-500 hover:text-[#8C7342] transition-colors rounded-lg hover:bg-gray-100/80"
            aria-label={isFrench ? 'Afficher les options' : 'عرض خيارات الاستفسار'}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-[#8C7342]' : ''
              }`}
            />
          </button>
        </div>

        {/* Quick 2-Pill Inquiries (Always visible or toggled) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2 border-t border-gray-200/60">
          {/* Option 1: Scent Profile & Notes */}
          <a
            href={scentProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-300 ${isFrench ? 'text-left' : 'text-right'} transition-all shadow-2xs hover:shadow-xs`}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <div>
                <span className="block text-xs font-bold text-[#1A1A1A] group-hover:text-amber-900">
                  {isFrench ? 'Fragrance & Sillage' : 'استفسار عن الرائحة والنوتات'}
                </span>
                <span className="text-[10px] text-gray-500">
                  {isFrench ? 'Tenue, notes, occasions' : 'الثبات، الفوحان، الطابع'}
                </span>
              </div>
            </div>
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0 opacity-80 group-hover:opacity-100" />
          </a>

          {/* Option 2: Stock Availability & Delivery */}
          <a
            href={availabilityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 ${isFrench ? 'text-left' : 'text-right'} transition-all shadow-2xs hover:shadow-xs`}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <div>
                <span className="block text-xs font-bold text-[#1A1A1A] group-hover:text-emerald-900">
                  {isFrench ? 'Stock & Expédition' : 'استفسار عن التوفر والشحن'}
                </span>
                <span className="text-[10px] text-gray-500">
                  {isFrench ? 'Habous, livraison chez vous' : 'المخزن، الشحن لمدينتك'}
                </span>
              </div>
            </div>
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0 opacity-80 group-hover:opacity-100" />
          </a>
        </div>

        {/* Expanded View for Additional Guidance */}
        {isOpen && (
          <div className="mt-3 pt-3 border-t border-gray-200/70 text-xs text-gray-600 space-y-2 animate-fadeIn">
            <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-gray-200">
              <Info className="w-4 h-4 text-[#8C7342] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                {isFrench ? (
                  <>
                    Un message pré-rempli avec l'article <strong className="text-[#1A1A1A]">"{product.name}"</strong> et son tarif sera envoyé directement à notre conseiller aux Habous.
                  </>
                ) : (
                  <>
                    يتم إرسال رسالة جاهزة تلقائياً تحتوي على اسم المنتج <strong className="text-[#1A1A1A]">"{product.name}"</strong> وسعره، ليقوم خبير العطور لدينا بالإجابة على استفسارك ومساعدتك في الاختيار مباشرة عبر واتساب.
                  </>
                )}
              </p>
            </div>

            <a
              href={generalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1a883f] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#25D366]/30"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{isFrench ? 'Ouvrir la discussion générale sur WhatsApp' : 'فتح محادثة عامة حول المنتج عبر واتساب'}</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
