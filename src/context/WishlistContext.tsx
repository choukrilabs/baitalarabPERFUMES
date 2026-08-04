import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  favorites: string[];
  wishlistCount: number;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (isOpen: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'bait_al_arab_favorites_v1';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile, syncFavoritesToCloud } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Sync with Firestore profile when user logs in
  useEffect(() => {
    if (userProfile && Array.isArray(userProfile.favorites)) {
      setFavorites((localFavs) => {
        // Merge cloud and local favorites
        const merged = Array.from(new Set([...localFavs, ...userProfile.favorites]));
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        } catch (e) {
          console.warn('LocalStorage error:', e);
        }
        return merged;
      });
    }
  }, [userProfile]);

  // Persist to local storage & cloud when favorites change
  const saveFavorites = useCallback(
    (newFavorites: string[]) => {
      setFavorites(newFavorites);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newFavorites));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
      if (currentUser) {
        syncFavoritesToCloud(newFavorites);
      }
    },
    [currentUser, syncFavoritesToCloud]
  );

  const isFavorite = useCallback(
    (productId: string) => {
      return favorites.includes(productId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (product: Product) => {
      const exists = favorites.includes(product.id);
      if (exists) {
        const next = favorites.filter((id) => id !== product.id);
        saveFavorites(next);
        toast.info(`تمت إزالة "${product.name}" من قائمة المفضلة`);
      } else {
        const next = [...favorites, product.id];
        saveFavorites(next);
        toast.success(
          `تمت إضافة "${product.name}" إلى قائمة المفضلة`,
          'المفضلة',
          {
            label: 'عرض المفضلة',
            onClick: () => setIsWishlistOpen(true),
          }
        );
      }
    },
    [favorites, saveFavorites, toast]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      const next = favorites.filter((id) => id !== productId);
      saveFavorites(next);
      toast.info('تمت إزالة المنتج من المفضلة');
    },
    [favorites, saveFavorites, toast]
  );

  const clearWishlist = useCallback(() => {
    saveFavorites([]);
    toast.info('تم مسح قائمة المفضلة');
  }, [saveFavorites, toast]);

  return (
    <WishlistContext.Provider
      value={{
        favorites,
        wishlistCount: favorites.length,
        isFavorite,
        toggleFavorite,
        removeFromWishlist,
        clearWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
