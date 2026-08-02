import fs from 'fs';
let content = fs.readFileSync('src/components/Hero.tsx', 'utf-8');

const target = `<img
                  src={'/images/generic_oud_perfume_1785362643211.jpg'}
                  alt="عطور بيت العرب"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />`;

const replacement = `<div className="w-full h-full bg-[#1A1A1A] transform hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-[#8C7342]/50" />
                </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/Hero.tsx', content);
