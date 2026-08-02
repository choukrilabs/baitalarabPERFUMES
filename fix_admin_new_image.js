import fs from 'fs';
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const target = `<img
                            src={newImage}
                            alt="Preview"
                            className="w-6 h-6 object-cover rounded-md"
                          />`;
                          
const replacement = `<div className="w-6 h-6 rounded-md overflow-hidden shrink-0 bg-gray-100">
                            <ProductImage
                              src={newImage}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/AdminPanel.tsx', content);
