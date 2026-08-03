import fs from 'fs';
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const targetProps = `interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (updated: Product[]) => void;
  onResetProducts: () => void;
}`;

const replacementProps = `interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetProducts: () => void;
}`;

content = content.replace(targetProps, replacementProps);

const targetComponentParams = `export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProducts,
  onResetProducts,
}) => {`;

const replacementComponentParams = `export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onResetProducts,
}) => {`;

content = content.replace(targetComponentParams, replacementComponentParams);

const targetUpdateField = `  const handleUpdateField = (id: string, field: keyof Product, value: any) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    onSaveProducts(updated);
  };`;

const replacementUpdateField = `  const handleUpdateField = (id: string, field: keyof Product, value: any) => {
    const productToUpdate = products.find(p => p.id === id);
    if (productToUpdate) {
      onEditProduct({ ...productToUpdate, [field]: value });
    }
  };`;

content = content.replace(targetUpdateField, replacementUpdateField);

const targetDelete = `  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(\`هل أنت تأكد من حذف المنتج "\${name}"؟\`)) {
      const updated = products.filter((p) => p.id !== id);
      onSaveProducts(updated);
    }
  };`;

const replacementDelete = `  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(\`هل أنت تأكد من حذف المنتج "\${name}"؟\`)) {
      onDeleteProduct(id);
    }
  };`;

content = content.replace(targetDelete, replacementDelete);

const targetAddProduct = `    const updated = [newProd, ...products];
    onSaveProducts(updated);`;

const replacementAddProduct = `    onAddProduct(newProd);`;

content = content.replace(targetAddProduct, replacementAddProduct);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
