import fs from 'fs';

// Hero.tsx
let hero = fs.readFileSync('src/components/Hero.tsx', 'utf-8');
hero = hero.replace('interface HeroProps {', 'import { Product } from "../types";\ninterface HeroProps {\n  products: Product[];');
hero = hero.replace('export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {', 'export const Hero: React.FC<HeroProps> = ({ onExploreClick, products }) => {\n  const heroImg = products.find(p => p.image && p.image.startsWith("data:"))?.image || products.find(p => p.image)?.image;');
hero = hero.replace("src={'/images/generic_oud_perfume_1785362643211.jpg'}", "src={heroImg}");
fs.writeFileSync('src/components/Hero.tsx', hero);

// AboutSection.tsx
let about = fs.readFileSync('src/components/AboutSection.tsx', 'utf-8');
about = about.replace("import { Award, ShieldCheck, Heart, MapPin, Store, Sparkles } from 'lucide-react';", "import { Award, ShieldCheck, Heart, MapPin, Store, Sparkles } from 'lucide-react';\nimport { Product } from '../types';");
about = about.replace('export const AboutSection: React.FC = () => {', 'export const AboutSection: React.FC<{products: Product[]}> = ({products}) => {\n  const aboutImg = products.find(p => p.image && p.image.startsWith("data:"))?.image || products.find(p => p.image)?.image;');
about = about.replace("src={'/images/lattafa_black_edition_1785362819475.jpg'}", "src={aboutImg}");
fs.writeFileSync('src/components/AboutSection.tsx', about);

// App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace('<Hero onExploreClick={scrollToCatalog} />', '<Hero onExploreClick={scrollToCatalog} products={products} />');
app = app.replace('<AboutSection />', '<AboutSection products={products} />');
fs.writeFileSync('src/App.tsx', app);
