import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');

if (!content.includes('http-proxy-middleware')) {
  content = content.replace("import express from 'express';", "import express from 'express';\nimport { createProxyMiddleware } from 'http-proxy-middleware';");
}

const proxyCode = `  app.use('/firebase-storage', createProxyMiddleware({
    target: 'https://firebasestorage.googleapis.com',
    changeOrigin: true,
    pathRewrite: { '^/firebase-storage': '' }
  }));`;

if (!content.includes('/firebase-storage')) {
  content = content.replace("  const PORT = 3000;", "  const PORT = 3000;\n\n" + proxyCode);
}

fs.writeFileSync('server.ts', content);
