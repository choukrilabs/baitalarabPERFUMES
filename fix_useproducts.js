import fs from 'fs';
let content = fs.readFileSync('src/hooks/useProducts.ts', 'utf-8');

const target = `    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
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
    });`;

const replacement = `    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const loadedProducts = snapshot.docs.map(doc => ({
        ...doc.data()
      } as Product));
      setProducts(loadedProducts);
      setLoading(false);
    });`;

content = content.replace(target, replacement);

const targetReset = `  const resetToDefault = async () => {
    await seedDatabase();
  };`;
const replacementReset = `  const resetToDefault = async () => {
    // await seedDatabase();
  };`;

content = content.replace(targetReset, replacementReset);

fs.writeFileSync('src/hooks/useProducts.ts', content);
