import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialCatalog';
import { handleFirestoreError, OperationType } from '../utils/firestoreError';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(db, 'products');
    
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const loadedProducts = snapshot.docs.map((doc) => ({
          ...doc.data(),
        } as Product));
        setProducts(loadedProducts);
        setLoading(false);
      },
      (error) => {
        console.error("Products snapshot error:", error);
        handleFirestoreError(error, OperationType.GET, 'products');
      }
    );

    return () => unsubscribe();
  }, []);

  const addProduct = async (product: Product) => {
    try {
      const docRef = doc(db, 'products', product.id);
      await setDoc(docRef, product, { merge: true });
      return true;
    } catch (e) {
      console.error("Error adding product: ", e);
      handleFirestoreError(e, OperationType.CREATE, `products/${product.id}`);
      return false;
    }
  };

  const editProduct = async (product: Product) => {
    try {
      const docRef = doc(db, 'products', product.id);
      await setDoc(docRef, product, { merge: true });
      return true;
    } catch (e) {
      console.error("Error updating product: ", e);
      handleFirestoreError(e, OperationType.UPDATE, `products/${product.id}`);
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
      return true;
    } catch (e) {
      console.error("Error deleting product: ", e);
      handleFirestoreError(e, OperationType.DELETE, `products/${id}`);
      return false;
    }
  };

  const resetToDefault = async () => {
    // optional reset if needed
  };

  return { products, loading, addProduct, editProduct, deleteProduct, resetToDefault };
};

