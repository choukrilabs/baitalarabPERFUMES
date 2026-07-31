import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore/lite';

// Read config
import config from './firebase-applet-config.json' assert { type: 'json' };

const appFirebase = initializeApp(config);
const db = getFirestore(appFirebase, config.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Sitemap route
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const products = snapshot.docs.map(doc => doc.data());
      
      const baseUrl = 'https://' + req.get('host');
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

      products.forEach((p: any) => {
        if (p.id) {
          xml += `
  <url>
    <loc>${baseUrl}/?product=${p.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
      });
      
      xml += `\n</urlset>`;
      
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err: any) {
      console.error(err);
      res.status(500).send('Error generating sitemap: ' + err.message);
    }
  });

  // Vite middleware for development
  let vite: any;
  if (process.env.NODE_ENV !== 'production') {
    vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined 
      },
      appType: 'spa',
    });
    // Let Vite handle assets and non-HTML files
    app.use((req, res, next) => {
      if (req.path === '/' || req.path === '/index.html') {
        next();
      } else {
        vite.middlewares(req, res, next);
      }
    });
  } else {
    // In production, serve static files from dist, BUT skip index.html to allow our wildcard handler to inject meta tags
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
  }

  // Fallback handler for all other routes to serve index.html with dynamic meta tags
  app.get('*', async (req, res) => {
    try {
      const productId = req.query.product as string;
      let title = 'عطور بيت العرب - عطور شرقية وعود أصلي الدار البيضاء';
      let desc = 'تأسس بيت العرب عام 1984 في حي الحبوس بالدار البيضاء. نقدم عطور شرقية، عود، وبخور أصلية 100%. اكتشف دفء الأصالة المغربية للبيع بالتجزئة والجملة.';
      let ogImage = '';
      
      if (productId) {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const p = productSnap.data();
          title = p.name || title;
          desc = p.description || desc;
          
          // Image might be a relative path like /assets/images/... or a full URL
          ogImage = p.image || '';
          if (ogImage && ogImage.startsWith('/')) {
             ogImage = 'https://' + req.get('host') + ogImage;
          }
        }
      }

      let template = '';
      if (process.env.NODE_ENV !== 'production') {
        template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
      } else {
        template = fs.readFileSync(path.resolve('dist/index.html'), 'utf-8');
      }

      // Inject dynamic meta tags
      template = template.replace(
        /<title>.*?<\/title>/is,
        `<title>${title}</title>`
      );
      template = template.replace(
        /<meta name="description" content=".*?"\s*\/>/is,
        `<meta name="description" content="${desc}" />`
      );
      
      // Add Open Graph tags
      let ogTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />`;
      if (ogImage) {
        ogTags += `\n    <meta property="og:image" content="${ogImage}" />`;
      }
      
      template = template.replace('</head>', `${ogTags}\n  </head>`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      console.error(e);
      res.status(500).end(e.toString());
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
