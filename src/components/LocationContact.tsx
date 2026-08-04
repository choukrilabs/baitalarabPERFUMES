import React from 'react';
import { SHOP_CONFIG } from '../types';
import { MapPin, Phone, MessageCircle, Clock, ExternalLink, Facebook, Instagram, ShieldCheck } from 'lucide-react';
import { WHATSAPP_TRUST_BANNER } from '../utils/whatsapp';

export const LocationContact: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-[#8C7342] uppercase tracking-wider bg-gray-100 px-3.5 py-1 rounded-full">
            زورونا أو تواصلوا معنا
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1A1A1A]">
            موقع المتجر ووسائل التواصل
          </h2>
          <p className="text-sm text-gray-500">
            يسعدنا استقبالكم في متجرنا بالحبوس بالدار البيضاء، أو الإجابة على استفساراتكم عبر الواتساب ومواقع التواصل الاجتماعي.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-[#8C7342] flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#1A1A1A]">
                    عنوان المتجر
                  </h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {SHOP_CONFIG.address}
                  </p>
                  <p className="text-xs text-[#8C7342] font-semibold">
                    {SHOP_CONFIG.city}
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
                    الهاتف والواتساب المباشر
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
                    متاح للطلبات والاستفسارات يومياً
                  </p>

                  <div className="mt-2 bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-950">
                    <ShieldCheck className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span className="font-bold text-[11px] leading-tight">
                      {WHATSAPP_TRUST_BANNER}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-[#8C7342] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-[#1A1A1A]">
                    البريد الإلكتروني
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
                    أوقات العمل
                  </h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    يومياً: من 9:00 صباحاً حتى 8:30 مساءً
                  </p>
                </div>
              </div>

            </div>

            {/* Social Media Links */}
            <div className="pt-6 border-t border-gray-200 space-y-3">
              <h4 className="font-bold text-xs text-[#8C7342] uppercase tracking-wider">
                حساباتنا الرسمية على مواقع التواصل:
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
                  <span>إنستغرام</span>
                </a>

                {/* Facebook */}
                <a
                  href={SHOP_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1877F2] text-white font-bold text-xs shadow hover:scale-105 transition-transform"
                >
                  <Facebook className="w-4 h-4" />
                  <span>فيسبوك</span>
                </a>
              </div>

              <a
                href={`https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent('مرحباً عطور بيت العرب، أود الاستفسار عن متجركم في الحبوس.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-xl font-bold text-xs shadow flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>مراسلة عبر الواتساب المباشر</span>
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
              title="موقع عطور بيت العرب - حي الحبوس بالدار البيضاء"
            />

            <div className="p-4 bg-[#1A1A1A] text-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-right">
                <p className="font-bold text-sm text-white">متجر عطور بيت العرب</p>
                <p className="text-xs text-[#8C7342]">حي الحبوس • الدار البيضاء</p>
              </div>

              <a
                href={SHOP_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-gradient text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow hover:scale-105 transition-transform shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>فتح في خرائط جوجل (Google Maps)</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
