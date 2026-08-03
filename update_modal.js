import fs from 'fs';

// Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
appContent = appContent.replace(
  '        product={quickViewProduct}',
  '        product={quickViewProduct}\n        allProducts={products}\n        onProductSelect={handleQuickView}'
);
fs.writeFileSync('src/App.tsx', appContent);
