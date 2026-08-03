import fs from 'fs';
let content = fs.readFileSync('src/components/ProductDetailModal.tsx', 'utf-8');

const regex = /\{\/\* Reviews Section \*\/\}([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

// Looking closely at the output, it seems the reviews section is conditionally rendered for perfumes? 
// \`{product.category === 'perfumes' && (\`

