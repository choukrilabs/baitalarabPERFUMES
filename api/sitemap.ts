import fs from 'fs';
import path from 'path';
// @ts-ignore
import config from '../firebase-applet-config.json';

export default async function handler(req: any, res: any) {
  try {
    const projectId = config.projectId;
    const databaseId = config.firestoreDatabaseId || '(default)';
    
    // Fetch products using REST API
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/products?key=${config.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const data = await response.json();
    const products = (data.documents || []).map((doc: any) => {
      return { id: doc.name.split('/').pop() };
    });
    
    const host = req.headers.host || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
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
    
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (err: any) {
    console.error(err);
    res.status(500).send('Error generating sitemap: ' + err.message);
  }
}
