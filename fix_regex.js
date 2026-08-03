import fs from 'fs';
let cardContent = fs.readFileSync('src/components/ProductCard.tsx', 'utf-8');

cardContent = cardContent.replace(
  "\\\\interface ProductCardProps", 
  "\\\\$&"
);

// also fix the {product.name} in whatsapp URL being replaced incorrectly
cardContent = cardContent.replace(
  "\\n• *$<HighlightText text={product.name} highlight={searchQuery} />*\\n",
  "\\n• *${product.name}*\\n"
);

fs.writeFileSync('src/components/ProductCard.tsx', cardContent);
