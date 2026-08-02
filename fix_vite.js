import fs from 'fs';
let content = fs.readFileSync('vite.config.ts', 'utf-8');

if (!content.includes('proxy:')) {
  const replacement = `    server: {
      proxy: {
        '/firebase-storage': {
          target: 'https://firebasestorage.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\\/firebase-storage/, '')
        }
      },`;
  content = content.replace("    server: {", replacement);
  fs.writeFileSync('vite.config.ts', content);
}
