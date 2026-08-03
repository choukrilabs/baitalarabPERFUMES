import fs from 'fs';
let content = fs.readFileSync('src/data/initialCatalog.ts', 'utf-8');

// replace INITIAL_PRODUCTS export with empty array
content = content.replace(/export const INITIAL_PRODUCTS: Product\[\] = \[[\s\S]*?\];/, 'export const INITIAL_PRODUCTS: Product[] = [];');

fs.writeFileSync('src/data/initialCatalog.ts', content);
