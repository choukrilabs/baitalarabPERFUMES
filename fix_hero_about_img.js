import fs from 'fs';

// Hero.tsx
let hero = fs.readFileSync('src/components/Hero.tsx', 'utf-8');
hero = hero.replace('import { Sparkles,', "import { ProductImage } from './ProductImage';\nimport { Sparkles,");
let targetHero = `<img
                  src={heroImg}
                  alt="عطور بيت العرب"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />`;
let repHero = `<ProductImage src={heroImg} alt="عطور بيت العرب" className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700" />`;
hero = hero.replace(targetHero, repHero);
fs.writeFileSync('src/components/Hero.tsx', hero);

// AboutSection.tsx
let about = fs.readFileSync('src/components/AboutSection.tsx', 'utf-8');
about = about.replace("import { Award, ShieldCheck", "import { ProductImage } from './ProductImage';\nimport { Award, ShieldCheck");
let targetAbout = `<img
                  src={aboutImg}
                  alt="Lattafa Khas Lil Rijal Black Edition"
                  className="w-full h-full object-cover object-center"
                />`;
let repAbout = `<ProductImage src={aboutImg} alt="متجر عطور بيت العرب" className="w-full h-full object-cover object-center" />`;
about = about.replace(targetAbout, repAbout);
fs.writeFileSync('src/components/AboutSection.tsx', about);
