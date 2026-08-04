import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { initializeApp, getApps } from 'firebase/app';
// @ts-ignore
import config from '../firebase-applet-config.json';

function getDbInstance() {
  try {
    const app = getApps().length > 0 ? getApps()[0] : initializeApp(config);
    return getFirestore(app, config?.firestoreDatabaseId);
  } catch (err) {
    console.error('Firebase sitemap initialization error:', err);
    return null;
  }
}

export default async function handler(req: any, res: any) {
  try {
    const host = req.headers?.host || 'baitalarab.ma';
    const protocol = host.includes('localhost') ? 'http' : 'https';
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
    const db = getDbInstance();

    if (db) {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (dbErr) {
        console.warn('Could not fetch products from Firestore for sitemap:', dbErr);
      }
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
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
    res.status(200).send(xml);
  } catch (err: any) {
    console.error('Error generating sitemap:', err);
    res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://baitalarab.ma/</loc></url></urlset>');
  }
}

