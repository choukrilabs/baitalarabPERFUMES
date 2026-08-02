import fs from 'fs';
let content = fs.readFileSync('src/data/initialCatalog.ts', 'utf-8');
content = content.replace(/image:\s*['"]\/images\/[^'"]+['"]/g, "image: ''");
fs.writeFileSync('src/data/initialCatalog.ts', content);
