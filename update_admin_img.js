import fs from 'fs';
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

if (!content.includes('import { ProductImage }')) {
  content = content.replace("import { compressImage } from '../utils/imageUtils';", "import { compressImage } from '../utils/imageUtils';\nimport { ProductImage } from './ProductImage';");
}

const target = `                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-14 h-14 object-cover rounded-xl bg-[#F4EAD9] shrink-0 group-hover:opacity-75 transition-opacity"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/royal_oud_perfume_1785349659426.jpg';
                            }}
                          />`;

const replacement = `                          <div className="w-14 h-14 shrink-0 overflow-hidden rounded-xl bg-[#F4EAD9]">
                            <ProductImage
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                            />
                          </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/AdminPanel.tsx', content);
