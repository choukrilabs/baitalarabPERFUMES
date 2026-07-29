import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialCatalog';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(db, 'products');
    
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      if (snapshot.empty) {
        // Seed the database if it's empty
        seedDatabase();
      } else {
        const loadedProducts = snapshot.docs.map(doc => ({
          ...doc.data()
        } as Product));
        setProducts(loadedProducts);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const seedDatabase = async () => {
    try {
      const batch = writeBatch(db);
      INITIAL_PRODUCTS.forEach(product => {
        const docRef = doc(db, 'products', product.id);
        batch.set(docRef, product);
      });
      await batch.commit();
    } catch (e) {
      console.error("Error seeding database: ", e);
    }
  };

  const updateProducts = async (updatedProducts: Product[]) => {
    try {
      const batch = writeBatch(db);
      
      // Find products to delete (in current products but not in updatedProducts)
      const updatedIds = new Set(updatedProducts.map(p => p.id));
      const productsToDelete = products.filter(p => !updatedIds.has(p.id));
      
      productsToDelete.forEach(product => {
        const docRef = doc(db, 'products', product.id);
        batch.delete(docRef);
      });

      // Update or add remaining products
      updatedProducts.forEach(product => {
        const docRef = doc(db, 'products', product.id);
        batch.set(docRef, product);
      });

      await batch.commit();
      return true;
    } catch (e) {
      console.error("Error updating products: ", e);
      return false;
    }
  };

  const resetToDefault = async () => {
    await seedDatabase();
  };

  return { products, loading, updateProducts, resetToDefault };
};
