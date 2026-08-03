import fs from 'fs';

let content = fs.readFileSync('src/components/ProductDetailModal.tsx', 'utf-8');

// Update Interface
content = content.replace(
  'interface ProductDetailModalProps {',
  'interface ProductDetailModalProps {\n  allProducts?: Product[];\n  onProductSelect?: (product: Product) => void;'
);

// Update Component Signature
content = content.replace(
  '  isInCart,\n}) => {',
  '  isInCart,\n  allProducts = [],\n  onProductSelect,\n}) => {'
);

// Add Related Products Logic before return
const logicStr = `
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id && p.active)
    .slice(0, 2); // Show max 2 related products in the sidebar

  return (`;

content = content.replace('  return (', logicStr);

// Find the end of the Product Information Side
// It ends with:
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

const searchStr = `          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <a
              href={directWhatsappUrl}`;

const insertStr = `          {/* Related Products Section */}
          {relatedProducts.length > 0 && onProductSelect && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-xs font-bold text-[#8C7342] uppercase tracking-wider mb-3">منتجات مشابهة</h4>
              <div className="grid grid-cols-2 gap-3">
                {relatedProducts.map(rp => (
                  <div 
                    key={rp.id} 
                    className="border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:border-[#8C7342] transition-colors group"
                    onClick={() => onProductSelect(rp)}
                  >
                    <div className="aspect-square bg-gray-50 relative">
                      <ProductImage src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-2">
                      <h5 className="text-[10px] font-bold text-[#1A1A1A] line-clamp-1">{rp.name}</h5>
                      <span className="text-[10px] text-[#8C7342] font-semibold">{rp.price} درهم</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}`;

content = content.replace('          {/* Buttons */}\n          <div className="space-y-2 pt-2">\n            <a\n              href={directWhatsappUrl}', insertStr + '\n          <div className="space-y-2 pt-2">\n            <a\n              href={directWhatsappUrl}');

fs.writeFileSync('src/components/ProductDetailModal.tsx', content);
