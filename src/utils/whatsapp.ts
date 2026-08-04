import { CartItem, Product, SHOP_CONFIG } from '../types';

export interface CustomerOrderDetails {
  name?: string;
  city?: string;
  phone?: string;
  streetAddress?: string;
}

export const WHATSAPP_TRUST_BANNER = 'اطلب عبر واتساب — نؤكد التوصيل لمدينتك قبل الدفع';

/**
 * Builds the high-converting Moroccan WhatsApp order message
 * 
 * Template:
 * مرحباً، أريد طلب المنتجات التالية:
 * 
 * 🛒 سلتي:
 * - عود ملكي 100ml × 1 — 350 MAD
 * - بخور العرب × 2 — 120 MAD
 * 
 * 📦 المجموع: 470 MAD
 * 
 * الاسم: ___
 * المدينة: ___
 */
export function buildCartWhatsappMessage(
  cartItems: CartItem[],
  totalPrice: number,
  customer?: CustomerOrderDetails
): string {
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
  customer?: CustomerOrderDetails
): string {
  const vol = product.volume ? ` ${product.volume}` : '';
  const itemTotal = product.price * quantity;

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

export function buildProductAvailabilityWhatsappMessage(product: Product): string {
  const vol = product.volume ? ` (${product.volume})` : '';
  const inStockStatus = product.inStock !== false ? 'متوفر حالياً بالكتالوج' : 'غير متوفر مؤقتاً';

  return `مرحباً بيت العرب للعطور، لدي استفسار سريع بخصوص توفر هذا المنتج:\n\n🏷️ المنتج: ${product.name}${vol}\n💰 السعر: ${product.price} MAD\n📌 حالة المخزن: ${inStockStatus}\n\nهل المنتج متوفر حالياً في متجركم بالحبوس وجاهز للشحن لمدينتي؟ شكراً لكم!`;
}

export function buildProductScentProfileWhatsappMessage(product: Product): string {
  const vol = product.volume ? ` (${product.volume})` : '';
  const notesText = product.notes && product.notes.length > 0
    ? `\n✨ النوتات المذكورة: ${product.notes.join(' • ')}`
    : '';

  return `مرحباً بيت العرب للعطور، أود الاستفسار عن الرائحة والنوتات العطرية لهذا المنتج:\n\n🌸 المنتج: ${product.name}${vol}\n💰 السعر: ${product.price} MAD${notesText}\n\nهل يمكن تزويدي بمعلومات أكثر حول:\n• طابع الرائحة ودرجة الفوحان والثبات؟\n• هل العطر مناسب للاستخدام اليومي أم للمناسبات الخاصة؟\n\nشكراً جزيلاً لكم!`;
}

export function buildQuickQuestionWhatsappMessage(
  product: Product,
  topic: 'scent' | 'availability' | 'general' = 'general'
): string {
  if (topic === 'scent') {
    return buildProductScentProfileWhatsappMessage(product);
  }
  if (topic === 'availability') {
    return buildProductAvailabilityWhatsappMessage(product);
  }

  const vol = product.volume ? ` (${product.volume})` : '';
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

