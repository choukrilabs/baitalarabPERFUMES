import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { PromoBannerConfig, DEFAULT_PROMO_BANNER } from '../types';
import { handleFirestoreError, OperationType } from '../utils/firestoreError';

const LOCAL_STORAGE_KEY = 'baitalarab_promo_banner';

export const usePromoBanner = () => {
  const [promoBanner, setPromoBanner] = useState<PromoBannerConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROMO_BANNER, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse promo banner from localStorage', e);
    }
    return DEFAULT_PROMO_BANNER;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bannerDocRef = doc(db, 'settings', 'promo_banner');

    const unsubscribe = onSnapshot(
      bannerDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as PromoBannerConfig;
          const merged = { ...DEFAULT_PROMO_BANNER, ...data };
          setPromoBanner(merged);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            console.warn('Failed to cache promo banner to localStorage', e);
          }
        } else {
          // Document does not exist in Firestore yet, initialize it
          setDoc(bannerDocRef, DEFAULT_PROMO_BANNER, { merge: true }).catch((err) => {
            console.warn('Could not initialize default promo banner in Firestore:', err);
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Promo banner snapshot error:', error);
        handleFirestoreError(error, OperationType.GET, 'settings/promo_banner');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updatePromoBanner = async (newConfig: PromoBannerConfig): Promise<boolean> => {
    try {
      setPromoBanner(newConfig);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
      } catch (e) {
        console.warn('Failed to cache promo banner to localStorage', e);
      }

      const bannerDocRef = doc(db, 'settings', 'promo_banner');
      await setDoc(bannerDocRef, newConfig, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating promo banner:', error);
      handleFirestoreError(error, OperationType.UPDATE, 'settings/promo_banner');
      return false;
    }
  };

  return { promoBanner, updatePromoBanner, loading };
};
