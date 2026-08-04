import { CartItem, Product, SHOP_CONFIG } from '../types';

export interface CustomerOrderDetails {
  name?: string;
  city?: string;
  phone?: string;
  streetAddress?: string;
}

export const WHATSAPP_TRUST_BANNER_AR = 'اطلب عبر واتساب — نؤكد التوصيل لمدينتك قبل الدفع';
export const WHATSAPP_TRUST_BANNER_FR = 'Commandez sur WhatsApp — Confirmation & Livraison partout au Maroc';
export const WHATSAPP_TRUST_BANNER = WHATSAPP_TRUST_BANNER_AR;

/**
 * Builds the high-converting Moroccan WhatsApp order message
 */
export function buildCartWhatsappMessage(
  cartItems: CartItem[],
  totalPrice: number,
  customer?: CustomerOrderDetails,
  lang: 'ar' | 'fr' = 'ar'
): string {
  if (lang === 'fr') {
    let msg = `Bonjour Parfums Bait Al Arab, je souhaite commander les articles suivants :\n\n🛒 Mon Panier :\n`;

    cartItems.forEach((item) => {
      const vol = item.product.volume ? ` ${item.product.volume}` : '';
      const itemTotal = item.product.price * item.quantity;
      msg += `- ${item.product.name}${vol} × ${item.quantity} — ${itemTotal} DH\n`;
    });

    msg += `\n📦 Total TTC : ${totalPrice} DH\n\n`;

    const nameVal = customer?.name?.trim() ? customer.name.trim() : '___';
    const cityVal = customer?.city?.trim() ? customer.city.trim() : '___';

    msg += `Nom : ${nameVal}\n`;
    msg += `Ville : ${cityVal}\n`;

    if (customer?.phone?.trim()) {
      msg += `Téléphone : ${customer.phone.trim()}\n`;
    }
    if (customer?.streetAddress?.trim()) {
      msg += `Adresse : ${customer.streetAddress.trim()}\n`;
    }

    return msg;
  }

  let msg = `مرحباً، أريد طلب المنتجات التالية:\n\n🛒 سلتي:\n`;

  cartItems.forEach((item) => {
    const vol = item.product.volume ? ` ${item.product.volume}` : '';
    const itemTotal = item.product.price * item.quantity;
    msg += `- ${item.product.name}${vol} × ${item.quantity} — ${itemTotal} MAD\n`;
  });

  msg += `\n📦 المجموع: ${totalPrice} MAD\n\n`;

  const nameVal = customer?.name?.trim() ? customer.name.trim() : '___';
  const cityVal = customer?.city?.trim() ? customer.city.trim() : '___';

  msg += `الاسم: ${nameVal}\n`;
  msg += `المدينة: ${cityVal}\n`;

  if (customer?.phone?.trim()) {
    msg += `الهاتف: ${customer.phone.trim()}\n`;
  }
  if (customer?.streetAddress?.trim()) {
    msg += `العنوان: ${customer.streetAddress.trim()}\n`;
  }

  return msg;
}

/**
 * Builds the single product WhatsApp order message
 */
export function buildSingleProductWhatsappMessage(
  product: Product,
  quantity: number = 1,
  customer?: CustomerOrderDetails,
  lang: 'ar' | 'fr' = 'ar'
): string {
  const vol = product.volume ? ` ${product.volume}` : '';
  const itemTotal = product.price * quantity;

  if (lang === 'fr') {
    let msg = `Bonjour Parfums Bait Al Arab, je souhaite commander ce produit :\n\n🛒 Article :\n`;
    msg += `- ${product.name}${vol} × ${quantity} — ${itemTotal} DH\n\n`;
    msg += `📦 Total : ${itemTotal} DH\n\n`;

    const nameVal = customer?.name?.trim() ? customer.name.trim() : '___';
    const cityVal = customer?.city?.trim() ? customer.city.trim() : '___';

    msg += `Nom : ${nameVal}\n`;
    msg += `Ville : ${cityVal}\n`;

    if (customer?.phone?.trim()) {
      msg += `Téléphone : ${customer.phone.trim()}\n`;
    }
    if (customer?.streetAddress?.trim()) {
      msg += `Adresse : ${customer.streetAddress.trim()}\n`;
    }

    return msg;
  }

  let msg = `مرحباً، أريد طلب المنتجات التالية:\n\n🛒 سلتي:\n`;
  msg += `- ${product.name}${vol} × ${quantity} — ${itemTotal} MAD\n\n`;
  msg += `📦 المجموع: ${itemTotal} MAD\n\n`;

  const nameVal = customer?.name?.trim() ? customer.name.trim() : '___';
  const cityVal = customer?.city?.trim() ? customer.city.trim() : '___';

  msg += `الاسم: ${nameVal}\n`;
  msg += `المدينة: ${cityVal}\n`;

  if (customer?.phone?.trim()) {
    msg += `الهاتف: ${customer.phone.trim()}\n`;
  }
  if (customer?.streetAddress?.trim()) {
    msg += `العنوان: ${customer.streetAddress.trim()}\n`;
  }

  return msg;
}

export function buildProductAvailabilityWhatsappMessage(product: Product, lang: 'ar' | 'fr' = 'ar'): string {
  const vol = product.volume ? ` (${product.volume})` : '';

  if (lang === 'fr') {
    const inStockStatus = product.inStock !== false ? 'Disponible au catalogue' : 'Temporairement épuisé';
    return `Bonjour Parfums Bait Al Arab, j’aimerais savoir si ce produit est disponible :\n\n🏷️ Produit : ${product.name}${vol}\n💰 Prix : ${product.price} DH\n📌 Statut : ${inStockStatus}\n\nEst-il disponible dans votre boutique des Habous et prêt pour expédition ? Merci !`;
  }

  const inStockStatus = product.inStock !== false ? 'متوفر حالياً بالكتالوج' : 'غير متوفر مؤقتاً';
  return `مرحباً بيت العرب للعطور، لدي استفسار سريع بخصوص توفر هذا المنتج:\n\n🏷️ المنتج: ${product.name}${vol}\n💰 السعر: ${product.price} MAD\n📌 حالة المخزن: ${inStockStatus}\n\nهل المنتج متوفر حالياً في متجركم بالحبوس وجاهز للشحن لمدينتي؟ شكراً لكم!`;
}

export function buildProductScentProfileWhatsappMessage(product: Product, lang: 'ar' | 'fr' = 'ar'): string {
  const vol = product.volume ? ` (${product.volume})` : '';

  if (lang === 'fr') {
    const notesText = product.notes && product.notes.length > 0
      ? `\n✨ Notes Olfactives : ${product.notes.join(' • ')}`
      : '';
    return `Bonjour Parfums Bait Al Arab, je souhaite en savoir plus sur la pyramide olfactive de ce produit :\n\n🌸 Produit : ${product.name}${vol}\n💰 Prix : ${product.price} DH${notesText}\n\nPouvez-vous me conseiller sur son sillage, sa tenue et les occasions appropriées ? Merci beaucoup !`;
  }

  const notesText = product.notes && product.notes.length > 0
    ? `\n✨ النوتات المذكورة: ${product.notes.join(' • ')}`
    : '';

  return `مرحباً بيت العرب للعطور، أود الاستفسار عن الرائحة والنوتات العطرية لهذا المنتج:\n\n🌸 المنتج: ${product.name}${vol}\n💰 السعر: ${product.price} MAD${notesText}\n\nهل يمكن تزويدي بمعلومات أكثر حول:\n• طابع الرائحة ودرجة الفوحان والثبات؟\n• هل العطر مناسب للاستخدام اليومي أم للمناسبات الخاصة؟\n\nشكراً جزيلاً لكم!`;
}

export function buildQuickQuestionWhatsappMessage(
  product: Product,
  topic: 'scent' | 'availability' | 'general' = 'general',
  lang: 'ar' | 'fr' = 'ar'
): string {
  if (topic === 'scent') {
    return buildProductScentProfileWhatsappMessage(product, lang);
  }
  if (topic === 'availability') {
    return buildProductAvailabilityWhatsappMessage(product, lang);
  }

  const vol = product.volume ? ` (${product.volume})` : '';

  if (lang === 'fr') {
    const notesText = product.notes && product.notes.length > 0
      ? `\n✨ Notes : ${product.notes.join(' • ')}`
      : '';
    return `Bonjour Parfums Bait Al Arab, j’ai une question concernant cet article :\n\n✨ Produit : ${product.name}${vol}\n💰 Prix : ${product.price} DH${notesText}\n\nJe souhaite obtenir plus d’informations sur sa disponibilité et sa fragrance. Merci !`;
  }

  const notesText = product.notes && product.notes.length > 0
    ? `\n✨ النوتات: ${product.notes.join(' • ')}`
    : '';

  return `مرحباً بيت العرب للعطور، لدي سؤال سريع حول هذا المنتج:\n\n✨ المنتج: ${product.name}${vol}\n💰 السعر: ${product.price} MAD${notesText}\n\nأود الاستفسار عن توفره حالياً وتفاصيل الرائحة والثبات ومناسبته. شكراً لكم!`;
}

/**
 * Encodes the WhatsApp URL for direct ordering or inquiries
 */
export function getWhatsappUrl(message: string): string {
  return `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}


