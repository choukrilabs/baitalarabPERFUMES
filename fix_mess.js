import fs from 'fs';
let content = fs.readFileSync('src/components/ProductCard.tsx', 'utf-8');

const regex = /^[\s\S]*?interface ProductCardProps/m;

const correctHeader = `import React from 'react';
import { Product, SHOP_CONFIG } from '../types';
import { ShoppingBag, Eye, MessageCircle, Sparkles, Check, Star } from 'lucide-react';
import { ProductImage } from './ProductImage';

const HighlightText = ({ text, highlight }: { text: string; highlight?: string }) => {
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

interface ProductCardProps`;

content = content.replace(regex, correctHeader);

// make sure the WhatsApp link is correct
content = content.replace(
  /const whatsappMsg = encodeURIComponent\([\s\S]*?\);/m,
  "const whatsappMsg = encodeURIComponent(\\n    `مرحباً عطور بيت العرب، أود طلب المنتج:\\n• *${product.name}*\\n• السعر: ${product.price} درهم\\n${product.volume ? `• الحجم/الوزن: ${product.volume}\\n` : ''}الرجاء تأكيد الطلب والتوصيل.`\\n  );"
);


fs.writeFileSync('src/components/ProductCard.tsx', content);
