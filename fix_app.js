import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace('const { products, updateProducts, resetToDefault } = useProducts();', 'const { products, addProduct, editProduct, deleteProduct, resetToDefault } = useProducts();');

content = content.replace(/  const handleSaveProducts = \([\s\S]*?  \};/, '');

const newAdminPanel = `      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={addProduct}
        onEditProduct={editProduct}
        onDeleteProduct={deleteProduct}
        onResetProducts={handleResetProducts}
      />`;

content = content.replace(/      <AdminPanel[\s\S]*?\/>/, newAdminPanel);

fs.writeFileSync('src/App.tsx', content);
