export type CategoryType = 'perfumes' | 'incense' | 'clothes' | 'oils' | 'wholesale' | 'other';

export type GenderType = 'men' | 'women' | 'unisex' | 'all';

export type ProductTypeCategory = 
  | 'eau_de_parfum' 
  | 'oil_attar' 
  | 'oud_incense' 
  | 'body_care' 
  | 'traditional_wear' 
  | 'wholesale_pack'
  | 'other';

export interface Review {
  id: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  price: number; // in MAD (درهم مغربي)
  originalPrice?: number; // for discount badge
  description: string;
  image: string; // Primary image
  images?: string[]; // Multiple angle images: e.g. bottle front, cap detail, packaging box
  volume?: string; // e.g. "100 مل", "1 كجم", "قطعة واحدة"
  active: boolean; // true = visible, false = hidden
  inStock?: boolean; // true = In stock / متوفر بالمخزن, false = Out of stock / نفد من المخزن (default: true)
  gender?: GenderType; // 'men' | 'women' | 'unisex'
  productType?: string; // 'ماء عطر فاخر', 'دهن عود وزيت', 'بخور ومبخرة', 'أزياء تقليدية', etc.
  isFeatured?: boolean;
  notes?: string[]; // Fragrance notes or product features (e.g. ["عود كمبودي", "مسك أبيض", "عنبر"])
  createdAt?: string;
  reviews?: Review[];
}

export interface CategoryInfo {
  id: CategoryType | 'all';
  nameAr: string;
  iconName: string;
  descriptionAr: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  title: string; // e.g. "المنزل", "العمل"
  recipientName: string;
  phone: string;
  city: string;
  district: string;
  streetAddress: string;
  postalCode?: string;
  deliveryNotes?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  items: CartItem[];
  totalPrice: number;
  address?: Address;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  notes?: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;
  addresses: Address[];
  favorites: string[]; // product IDs
  cart?: CartItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export const MOROCCAN_CITIES = [
  'الدار البيضاء',
  'الرباط',
  'مراكش',
  'فاس',
  'طنجة',
  'أكادير',
  'مكناس',
  'وجدة',
  'القنيطرة',
  'تطوان',
  'تمارة',
  'سلا',
  'الجديدة',
  'المحمدية',
  'بني ملال',
  'خريبكة',
  'آسفي',
  'الناظور',
  'سطات',
  'الصويرة',
  'العيون',
  'الداخلة',
  'ورزازات',
  'تارودانت',
  'أخرى'
];

export interface ShopInfo {
  name: string;
  subtitle: string;
  email: string;
  phone: string;
  phoneFormatted: string;
  whatsappNumber: string; // 212667235559
  facebookUrl: string; // https://web.facebook.com/people/Baitalarab-Perfumes/61592644231147/
  instagramUrl: string; // https://www.instagram.com/perfumes.bait.al.arab/
  googleMapsUrl: string;
  address: string;
  city: string;
  neighborhood: string;
}

export const SHOP_CONFIG: ShopInfo = {
  name: 'عطور بيت العرب',
  subtitle: 'عطور شرقية أصيلة، بخور، زيوت طبيعية، وملابس',
  email: 'perfumes.bait.al.arab@gmail.com',
  phone: '+212667235559',
  phoneFormatted: '+212 6 67 23 55 59',
  whatsappNumber: '212667235559',
  facebookUrl: 'https://web.facebook.com/people/Baitalarab-Perfumes/61592644231147/',
  instagramUrl: 'https://www.instagram.com/perfumes.bait.al.arab/',
  googleMapsUrl: 'https://maps.app.goo.gl/VZ6yURzux41NksJb8',
  address: 'زنقة مولاي إسماعيل، حي الحبوس',
  city: 'الدار البيضاء 20000',
  neighborhood: 'حي الحبوس التاريخي',
};

export type PromoBannerTheme = 'gold_dark' | 'emerald_gold' | 'ruby_gold' | 'midnight_blue';

export interface PromoBannerConfig {
  enabled: boolean;
  badgeText: string;
  headline: string;
  subtext?: string;
  ctaText: string;
  ctaCategory?: CategoryType | 'all';
  theme?: PromoBannerTheme;
  countdownText?: string;
  closable?: boolean;
}

export const DEFAULT_PROMO_BANNER: PromoBannerConfig = {
  enabled: true,
  badgeText: '✨ عرض حصري لفترة محدودة',
  headline: 'تخفيضات خاصة تصل إلى 30% على أرقى تشكيلات العطور الشرقية ودهن العود الملكي!',
  subtext: 'استفد من تخفيض فوري وتوصيل سريع مع إمكانية الدفع عند الاستلام لجميع مدن المغرب.',
  ctaText: 'تسوق العروض الآن',
  ctaCategory: 'perfumes',
  theme: 'gold_dark',
  countdownText: 'ينتهي العرض قريباً',
  closable: true,
};

