import React from 'react';
import { SHOP_CONFIG } from '../types';
import { MapPin, Phone, MessageCircle, Clock, ExternalLink, Facebook, Instagram, ShieldCheck, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WHATSAPP_TRUST_BANNER_AR, WHATSAPP_TRUST_BANNER_FR } from '../utils/whatsapp';

export const LocationContact: React.FC = () => {
  const { t, isFrench } = useLanguage();
  const trustBannerText = isFrench ? WHATSAPP_TRUST_BANNER_FR : WHATSAPP_TRUST_BANNER_AR;

  const whatsappInquiryText = isFrench
    ? 'Bonjour Parfums Bait Al Arab, je souhaite obtenir des informations sur votre boutique aux Habous.'
    : 'مرحباً عطور بيت العرب، أود الاستفسار عن متجركم في الحبوس.';

  return (
    <section id="contact" className="py-16 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-[#8C7342] uppercase tracking-wider bg-gray-100 px-3.5 py-1 rounded-full">
            {t('contact.badge')}
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1A1A1A]">
            {t('contact.title')}
          </h2>
          <p className="text-sm text-gray-500">
            {t('contact.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Contact Details Column */}
          <div className={`lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between space-y-6 ${isFrench ? 'text-left' : 'text-right'}`}>
            <div className="space-y-6">
              
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-[#8C7342] flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#1A1A1A]">
                    {t('contact.address_title')}
                  </h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {isFrench ? 'Rue Moulay Ismaïl, Quartier des Habous' : SHOP_CONFIG.address}
                  </p>
                  <p className="text-xs text-[#8C7342] font-semibold">
                    {isFrench ? 'Casablanca, Maroc' : SHOP_CONFIG.city}
                  </p>
                </div>
              </div>

              {/* WhatsApp & Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F8EE] text-[#25D366] flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-base text-[#1A1A1A]">
                    {t('contact.phone_title')}
                  </h4>
                  <a
                    href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-[#25D366] hover:underline dir-ltr inline-block"
                  >
                    {SHOP_CONFIG.phoneFormatted}
                  </a>
                  <p className="text-xs text-gray-500">
                    {t('contact.phone_sub')}
                  </p>

                  <div className="mt-2 bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-950">
                    <ShieldCheck className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span className="font-bold text-[11px] leading-tight">
                      {trustBannerText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-[#8C7342] flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#1A1A1A]">
                    {t('contact.email_title')}
                  </h4>
                  <a
                    href={`mailto:${SHOP_CONFIG.email}`}
                    className="text-sm font-medium text-[#8C7342] hover:underline mt-0.5 inline-block"
                  >
                    {SHOP_CONFIG.email}
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-[#8C7342] flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#1A1A1A]">
                    {t('contact.hours_title')}
                  </h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {t('contact.hours_val')}
                  </p>
                </div>
              </div>

            </div>

            {/* Social Media Links */}
            <div className="pt-6 border-t border-gray-200 space-y-3">
              <h4 className="font-bold text-xs text-[#8C7342] uppercase tracking-wider">
                {t('contact.socials')}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {/* Instagram */}
                <a
                  href={SHOP_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs shadow hover:scale-105 transition-transform"
                >
                  <Instagram className="w-4 h-4" />
                  <span>{t('contact.instagram')}</span>
                </a>

                {/* Facebook */}
                <a
                  href={SHOP_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1877F2] text-white font-bold text-xs shadow hover:scale-105 transition-transform"
                >
                  <Facebook className="w-4 h-4" />
                  <span>{t('contact.facebook')}</span>
                </a>
              </div>

              <a
                href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappInquiryText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-xl font-bold text-xs shadow flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('contact.msg_whatsapp')}</span>
              </a>
            </div>
          </div>

          {/* Map Embed Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative min-h-[380px] flex flex-col">
            <iframe
              src="https://maps.google.com/maps?q=33.576269,-7.604217&z=16&output=embed"
              className="w-full flex-1 border-0 min-h-[360px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={isFrench ? "Localisation Parfums Bait Al Arab - Quartier des Habous" : "موقع عطور بيت العرب - حي الحبوس بالدار البيضاء"}
            />

            <div className={`p-4 bg-[#1A1A1A] text-white flex flex-col sm:flex-row items-center justify-between gap-3 ${isFrench ? 'text-left' : 'text-right'}`}>
              <div>
                <p className="font-bold text-sm text-white">
                  {isFrench ? 'Parfums Bait Al Arab' : 'متجر عطور بيت العرب'}
                </p>
                <p className="text-xs text-[#8C7342]">
                  {isFrench ? 'Quartier Habous • Casablanca' : 'حي الحبوس • الدار البيضاء'}
                </p>
              </div>

              <a
                href={SHOP_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-gradient text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow hover:scale-105 transition-transform shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t('contact.open_maps')}</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
