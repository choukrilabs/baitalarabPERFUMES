import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialCatalog';

const STORAGE_KEY = 'baitalarab_products_catalog';
const ADMIN_PIN_KEY = 'baitalarab_admin_pin';
export const DEFAULT_PIN = '2580';

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

export const getAdminPin = (): string => {
  return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
};

export const setAdminPin = (newPin: string): void => {
  localStorage.setItem(ADMIN_PIN_KEY, newPin);
};
