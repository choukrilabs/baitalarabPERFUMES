import fs from 'fs';

// Update ProductCard
let cardContent = fs.readFileSync('src/components/ProductCard.tsx', 'utf-8');

const highlightHelper = `
const HighlightText = ({ text, highlight }: { text: string; highlight?: string }) => {
  if (!highlight || !highlight.trim()) return <>{text}</>;
  
  const regex = new RegExp(\`(\${highlight.trim().replace(/[.*+?^$\{()|[\\]\\\\]/g, '\\\\$&')})\`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200 text-yellow-900 px-0.5 rounded-sm">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

interface ProductCardProps`;

cardContent = cardContent.replace('interface ProductCardProps', highlightHelper);

cardContent = cardContent.replace(
  '  isInCart?: boolean;\n}',
  '  isInCart?: boolean;\n  searchQuery?: string;\n}'
);

cardContent = cardContent.replace(
  '  isInCart,\n}) => {',
  '  isInCart,\n  searchQuery,\n}) => {'
);

cardContent = cardContent.replace(
  '{product.name}',
  '<HighlightText text={product.name} highlight={searchQuery} />'
);

cardContent = cardContent.replace(
  '{product.description}',
  '<HighlightText text={product.description} highlight={searchQuery} />'
);

cardContent = cardContent.replace(
  '{note}',
  '<HighlightText text={note} highlight={searchQuery} />'
);

fs.writeFileSync('src/components/ProductCard.tsx', cardContent);

// Update ProductGrid
let gridContent = fs.readFileSync('src/components/ProductGrid.tsx', 'utf-8');

gridContent = gridContent.replace(
  '                isInCart={cartProductIds.has(product.id)}\n              />',
  '                isInCart={cartProductIds.has(product.id)}\n                searchQuery={searchQuery}\n              />'
);

fs.writeFileSync('src/components/ProductGrid.tsx', gridContent);
