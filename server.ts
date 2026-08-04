import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
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

  app.use('/firebase-storage', createProxyMiddleware({
    target: 'https://firebasestorage.googleapis.com',
    changeOrigin: true,
    pathRewrite: { '^/firebase-storage': '' }
  }));

  // Sitemap route for Google Search Console & Search Crawlers
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const host = req.get('host') || 'baitalarab-perfumes.vercel.app';
      const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
      const baseUrl = `${protocol}://${host}`;
      const today = new Date().toISOString().split('T')[0];

      const escapeXml = (unsafe: string) => {
        if (!unsafe) return '';
        return unsafe
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      let products: any[] = [];
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (dbErr) {
        console.warn('Sitemap Firestore query warning:', dbErr);
      }
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Main Catalog Categories -->
  <url>
    <loc>${baseUrl}/?category=perfumes</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/?category=oils</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/?category=incense</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/?category=clothes</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/?category=wholesale</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/?category=other</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;

      products.forEach((p: any) => {
        if (p?.id && p?.active !== false) {
          const prodUrl = `${baseUrl}/?product=${encodeURIComponent(p.id)}`;
          const prodTitle = escapeXml(p.name || 'عطور بيت العرب');
          let imgXml = '';

          if (p.image && typeof p.image === 'string' && !p.image.startsWith('data:')) {
            let imgUrl = p.image;
            if (imgUrl.startsWith('/')) {
              imgUrl = `${baseUrl}${imgUrl}`;
            }
            imgXml = `
    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${prodTitle}</image:title>
    </image:image>`;
          }

          xml += `
  <url>
    <loc>${prodUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imgXml}
  </url>`;
        }
      });
      
      xml += `\n</urlset>`;
      
      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.header('Cache-Control', 'public, max-age=3600, s-maxage=86400');
      res.status(200).send(xml);
    } catch (err: any) {
      console.error('Error generating sitemap:', err);
      // Fail-safe: deliver static sitemap instead of 500
      try {
        const staticPath = path.join(process.cwd(), 'public', 'sitemap.xml');
        if (fs.existsSync(staticPath)) {
          res.header('Content-Type', 'application/xml; charset=utf-8');
          return res.status(200).sendFile(staticPath);
        }
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
      }
      res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://baitalarab.ma/</loc></url></urlset>');
    }
  });

  // robots.txt route for search engine crawlers
  app.get('/robots.txt', (req, res) => {
    const host = req.get('host') || 'baitalarab-perfumes.vercel.app';
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const sitemapUrl = `${protocol}://${host}/sitemap.xml`;

    const robotsTxt = `# robots.txt for Baitalarab Perfumes (عطور بيت العرب)
User-agent: *
Allow: /

# Direct sitemap reference for Google Search Console & Web Crawlers
Sitemap: https://baitalarab-perfumes.vercel.app/sitemap.xml
Sitemap: https://baitalarab.ma/sitemap.xml
Sitemap: ${sitemapUrl}
`;

    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    res.status(200).send(robotsTxt);
  });

  // Vite middleware for development
  let vite: any;
  if (process.env.NODE_ENV !== 'production') {
    vite = await createViteServer({
      server: { middlewareMode: true },
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
