import fs from 'fs';
let content = fs.readFileSync('src/hooks/useProducts.ts', 'utf-8');

const targetSeed = `  const seedDatabase = async () => {
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
  };`;

content = content.replace(targetSeed, '');

fs.writeFileSync('src/hooks/useProducts.ts', content);
