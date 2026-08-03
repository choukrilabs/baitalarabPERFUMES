import fs from 'fs';
let content = fs.readFileSync('src/components/ProductDetailModal.tsx', 'utf-8');

const mockReviewsSection = /const MOCK_REVIEWS[\s\S]*?\];/;
content = content.replace(mockReviewsSection, 'const MOCK_REVIEWS: Review[] = [];');

fs.writeFileSync('src/components/ProductDetailModal.tsx', content);
