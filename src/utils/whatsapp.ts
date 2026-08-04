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

/**
 * Encodes the WhatsApp URL for direct ordering
 */
export function getWhatsappUrl(message: string): string {
  return `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
