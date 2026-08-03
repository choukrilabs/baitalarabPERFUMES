import fs from 'fs';
let content = fs.readFileSync('src/hooks/useProducts.ts', 'utf-8');

const mutations = `
  const addProduct = async (product: Product) => {
    try {
      const docRef = doc(db, 'products', product.id);
      await setDoc(docRef, product);
      return true;
    } catch (e) {
      console.error("Error adding product: ", e);
      return false;
    }
  };

  const editProduct = async (product: Product) => {
    try {
      const docRef = doc(db, 'products', product.id);
      await setDoc(docRef, product);
      return true;
    } catch (e) {
      console.error("Error updating product: ", e);
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const docRef = doc(db, 'products', id);
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(docRef);
      return true;
    } catch (e) {
      console.error("Error deleting product: ", e);
      return false;
    }
  };
`;

// Replace updateProducts with individual mutations
const oldUpdateProducts = /  const updateProducts = async \([\s\S]*?^  \};/m;
content = content.replace(oldUpdateProducts, mutations);

// Update return statement
content = content.replace('return { products, loading, updateProducts, resetToDefault };', 'return { products, loading, addProduct, editProduct, deleteProduct, resetToDefault };');

fs.writeFileSync('src/hooks/useProducts.ts', content);
