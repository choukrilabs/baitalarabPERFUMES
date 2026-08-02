import fs from 'fs';
let content = fs.readFileSync('src/components/CartDrawer.tsx', 'utf-8');
const target = `                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl bg-gray-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/royal_oud_perfume_1785349659426.jpg';
                    }}
                  />`;
const replacement = `                  <div className="w-16 h-16 shrink-0">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-xl bg-gray-100"
                    />
                  </div>`;
content = content.replace(target, replacement);
fs.writeFileSync('src/components/CartDrawer.tsx', content);
