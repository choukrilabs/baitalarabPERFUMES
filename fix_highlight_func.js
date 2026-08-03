import fs from 'fs';
let content = fs.readFileSync('src/components/ProductCard.tsx', 'utf-8');

const regexFunc = /const HighlightText = \(\{ text, highlight \}: \{ text: string; highlight\?: string \}\) => \{[\s\S]*?^};\n/m;

const replacementFunc = `const HighlightText = ({ text, highlight }: { text: string; highlight?: string }) => {
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
};
`;

content = content.replace(regexFunc, replacementFunc);

// also fix the whatsapp URL
content = content.replace(
  "  const whatsappMsg = encodeURIComponent(\\n    `مرحباً عطور بيت العرب، أود طلب المنتج:\\n• *$<HighlightText text={product.name} highlight={searchQuery} />*\\n• السعر: ${product.price} درهم\\n${product.volume ? `• الحجم/الوزن: ${product.volume}\\n` : ''}الرجاء تأكيد الطلب والتوصيل.`\\n  );",
  "  const whatsappMsg = encodeURIComponent(\\n    `مرحباً عطور بيت العرب، أود طلب المنتج:\\n• *${product.name}*\\n• السعر: ${product.price} درهم\\n${product.volume ? `• الحجم/الوزن: ${product.volume}\\n` : ''}الرجاء تأكيد الطلب والتوصيل.`\\n  );"
);

content = content.replace(
  "  const whatsappMsg = encodeURIComponent(\\n    `مرحباً عطور بيت العرب، أود طلب المنتج:\\n• *\\n• السعر: ${product.price} درهم\\n${product.volume ? `• الحجم/الوزن: ${product.volume}\\n` : ''}الرجاء تأكيد الطلب والتوصيل.`\\n  );",
  "  const whatsappMsg = encodeURIComponent(\\n    `مرحباً عطور بيت العرب، أود طلب المنتج:\\n• *${product.name}*\\n• السعر: ${product.price} درهم\\n${product.volume ? `• الحجم/الوزن: ${product.volume}\\n` : ''}الرجاء تأكيد الطلب والتوصيل.`\\n  );"
);


fs.writeFileSync('src/components/ProductCard.tsx', content);
