import fs from 'fs';
let content = fs.readFileSync('src/components/ProductCard.tsx', 'utf-8');

const regex = /const HighlightText = \(\{ text, highlight \}: \{ text: string; highlight\?: string \}\) => \{[\s\S]*?^};/m;

const correctCode = `const HighlightText = ({ text, highlight }: { text: string; highlight?: string }) => {
  if (!highlight || !highlight.trim()) return <>{text}</>;
  
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^$\{()|[\\]\\\\]/g, '\\\\$&');
  };
  
  const regex = new RegExp(\`(\${escapeRegExp(highlight.trim())})\`, 'gi');
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
};`;

content = content.replace(regex, correctCode);

// Also let's fix line 153 to use HighlightText
content = content.replace(
  "{product.name}",
  "<HighlightText text={product.name} highlight={searchQuery} />"
);

fs.writeFileSync('src/components/ProductCard.tsx', content);
