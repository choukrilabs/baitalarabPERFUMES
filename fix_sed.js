import fs from 'fs';
let cardContent = fs.readFileSync('src/components/ProductCard.tsx', 'utf-8');

// just manually replace the whole line
cardContent = cardContent.replace(/const regex = new RegExp.*?gi'\);/, "const regex = new RegExp(`(${highlight.trim().replace(/[.*+?^${()|[\\\\]\\\\\\\\]/g, '\\\\\\\\$&')})`, 'gi');");

// fix the whatsapp string if it is messed up
cardContent = cardContent.replace(/• \*\$<HighlightText text=\{product\.name\} highlight=\{searchQuery\} \/>\*/, "• *${product.name}*");
cardContent = cardContent.replace(/• \*\$<HighlightText text=\{product\.name\} highlight=\{searchQuery\} \/>\*\\n/, "• *${product.name}*\\n");

fs.writeFileSync('src/components/ProductCard.tsx', cardContent);
