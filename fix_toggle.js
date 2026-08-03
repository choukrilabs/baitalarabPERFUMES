import fs from 'fs';
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetToggle = `  const handleToggleActive = (id: string) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, active: !p.active } : p
    );
    onSaveProducts(updated);
  };`;

const replacementToggle = `  const handleToggleActive = (id: string) => {
    const productToUpdate = products.find((p) => p.id === id);
    if (productToUpdate) {
      onEditProduct({ ...productToUpdate, active: !productToUpdate.active });
    }
  };`;

content = content.replace(targetToggle, replacementToggle);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
