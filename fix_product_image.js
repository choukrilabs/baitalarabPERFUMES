import fs from 'fs';
let content = fs.readFileSync('src/components/ProductImage.tsx', 'utf-8');

if (!content.includes('proxySrc')) {
  const target = `  if (!src || error) {`;
  const replacement = `  let proxySrc = src;
  if (src && src.startsWith('https://firebasestorage.googleapis.com/')) {
    proxySrc = src.replace('https://firebasestorage.googleapis.com', '/firebase-storage');
  }

  if (!proxySrc || error) {`;
  
  content = content.replace(target, replacement);
  content = content.replace(`src={src}`, `src={proxySrc}`);
  
  fs.writeFileSync('src/components/ProductImage.tsx', content);
}
