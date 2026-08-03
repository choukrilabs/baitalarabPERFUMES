import { Product, CategoryInfo } from '../types';


export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    nameAr: 'جميع المنتجات',
    iconName: 'Sparkles',
    descriptionAr: 'تصفح تشكيلتنا الكاملة من عطور، بخور، زيوت طبيعية وملابس',
  },
  {
    id: 'perfumes',
    nameAr: 'العطور والروائح',
    iconName: 'Flame',
    descriptionAr: 'دهن عود كمبودي، عنبر فاخر، ومسك أصيل برائحة تدوم طويلاً',
  },
  {
    id: 'incense',
    nameAr: 'البخور',
    iconName: 'Wind',
    descriptionAr: 'بخور عود فاخر، بخور مسك وعنبر للمنازل والمناسبات',
  },
  {
    id: 'clothes',
    nameAr: 'الملابس',
    iconName: 'Shirt',
    descriptionAr: 'تشكيلة مختارة من الملابس المتنوعة',
  },
  {
    id: 'oils',
    nameAr: 'الزيوت الطبيعية',
    iconName: 'Droplet',
    descriptionAr: 'زيوت طبيعية أصلية للعناية بالجسم والشعر',
  },
  {
    id: 'wholesale',
    nameAr: 'البيع بالجملة',
    iconName: 'Store',
    descriptionAr: 'عطور شرقية، بخور، وزيوت طبيعية بالجملة للشركات مع ضمان الجودة العالية',
  },
  {
    id: 'other',
    nameAr: 'منتجات أخرى',
    iconName: 'Flower2',
    descriptionAr: 'مباخر تقليدية ومنتجات متنوعة أخرى',
  },
];

export const INITIAL_PRODUCTS: Product[] = [];

