import fs from 'fs';
let content = fs.readFileSync('src/hooks/useProducts.ts', 'utf-8');

const target = `      const productsToDelete = products.filter(p => !updatedIds.has(p.id));
      
      productsToDelete.forEach(product => {`;
const replacement = `      const productsToDelete = products.filter(p => !updatedIds.has(p.id));
      console.log('Current products:', products.length);
      console.log('Updated products:', updatedProducts.length);
      console.log('Deleting products:', productsToDelete.map(p => p.id));
      
      productsToDelete.forEach(product => {`;
      
content = content.replace(target, replacement);
fs.writeFileSync('src/hooks/useProducts.ts', content);
