export type CategoryType = 'perfumes' | 'incense' | 'clothes' | 'oils' | 'wholesale' | 'other';

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
  image: string;
  volume?: string; // e.g. "100 مل", "1 كجم", "قطعة واحدة"
  active: boolean; // true = visible, false = hidden
  isFeatured?: boolean;
  notes?: string[]; // Fragrance notes or product features (e.g. ["عود كمبودي", "مسك أبيض", "عنبر"])
  createdAt?: string;
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

export function getSafeImageUrl(url: string): string {
  if (!url) return '/images/dehn_oud_royal.jpg';
  
  // Map legacy URLs to the new clean unbranded luxury images
  if (url.includes('royal_oud_perfume') || url.includes('dehn_oud')) {
    return '/images/dehn_oud_royal.jpg';
  }
  if (url.includes('amber_perfume')) {
    return '/images/amber_perfume_luxury.jpg';
  }
  if (url.includes('lattafa_black') || url.includes('black_edition')) {
    return '/images/black_edition_perfume.jpg';
  }
  if (url.includes('generic_oud_perfume')) {
    return '/images/hero_oriental_perfume.jpg';
  }
  if (url.includes('unsplash.com')) {
    return '/images/dehn_oud_royal.jpg';
  }

  // Fix legacy hashed asset URLs that are broken after moving images to public
  if (url.startsWith('/assets/') && url.match(/-[a-zA-Z0-9]+\.jpg$/)) {
    return url.replace('/assets/', '/images/').replace(/-[a-zA-Z0-9]+\.jpg$/, '.jpg');
  }
  return url;
}
