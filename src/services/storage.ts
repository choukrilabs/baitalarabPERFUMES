import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialCatalog';

const STORAGE_KEY = 'baitalarab_products_catalog';

export const loadProducts = (): Product[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load products from storage:', e);
  }
  return INITIAL_PRODUCTS;
};

export const saveProducts = (products: Product[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch (e) {
    console.error('Failed to save products to storage:', e);
    return false;
  }
};

export const resetToDefaultProducts = (): Product[] => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  } catch (e) {
    console.error('Failed to reset products:', e);
  }
  return INITIAL_PRODUCTS;
};

export const getAdminPassword = (): string => {
  return import.meta.env.VITE_ADMIN_PASSWORD || '';
};
