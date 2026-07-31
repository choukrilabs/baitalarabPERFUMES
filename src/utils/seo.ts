export const defaultSEO = {
  title: 'عطور بيت العرب - عطور شرقية وعود أصلي الدار البيضاء',
  description: 'تأسس بيت العرب عام 1984 في حي الحبوس بالدار البيضاء. نقدم عطور شرقية، عود، وبخور أصلية 100%. اكتشف دفء الأصالة المغربية للبيع بالتجزئة والجملة.'
};

export const categorySEO: Record<string, { title: string, description: string }> = {
  all: defaultSEO,
  perfumes: {
    title: 'زيوت عود أصلية 100% - شراء العود الأصلي في المغرب',
    description: 'اكتشف مجموعتنا الفاخرة من زيوت العود الأصلية. نضمن لك ثبات الرائحة والجودة العالية من عطور بيت العرب، وجهتك الموثوقة في الدار البيضاء منذ 1984.'
  },
  oils: {
    title: 'زيوت عود أصلية 100% - شراء العود الأصلي في المغرب',
    description: 'اكتشف مجموعتنا الفاخرة من زيوت العود الأصلية. نضمن لك ثبات الرائحة والجودة العالية من عطور بيت العرب، وجهتك الموثوقة في الدار البيضاء منذ 1984.'
  },
  wholesale: {
    title: 'موردي زيوت العطور والعود بالجملة المغرب - بيت العرب',
    description: 'كن شريكاً لعلامة تجارية عريقة بخبرة 40 عاماً. نوفر العطور الشرقية، البخور، والزيوت الطبيعية بالجملة للشركات مع ضمان الجودة العالية والأصالة.'
  },
  incense: {
    title: 'بخور وعود فاخر - عطور بيت العرب',
    description: 'تشكيلة مميزة من البخور والعود الفاخر لتعطير منزلك ومناسباتك بروائح شرقية أصيلة تدوم طويلاً.'
  },
  clothes: {
    title: 'أزياء نسائية أنيقة - بيت العرب',
    description: 'اكتشفي مجموعة الأزياء النسائية الأنيقة من بيت العرب، تصاميم تناسب جميع الأذواق والمناسبات.'
  },
  other: {
    title: 'عسل حر ومنتجات أخرى - بيت العرب',
    description: 'عسل حر طبيعي 100% ومنتجات أخرى متنوعة من بيت العرب بضمان الجودة والأصالة.'
  }
};

export function updateMetaTags(title: string, description: string, product?: any) {
  document.title = title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', description);
  }

  // Inject or update JSON-LD Structured Data
  let script = document.getElementById('structured-data') as HTMLScriptElement;
  if (!script) {
    script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "عطور بيت العرب",
    "image": "https://baitalarab-perfumes.vercel.app/logo_small.webp", // Replace with real domain if available
    "description": "تأسس بيت العرب عام 1984 في حي الحبوس بالدار البيضاء. نقدم عطور شرقية، عود، وبخور أصلية 100%.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "حي الحبوس",
      "addressLocality": "الدار البيضاء",
      "addressRegion": "Casablanca-Settat",
      "addressCountry": "MA"
    },
    "telephone": "+212-000000000", // Update with real number if available
    "priceRange": "$$"
  };

  let schemaData: any = storeSchema;

  if (product) {
    schemaData = [
      storeSchema,
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.image ? (product.image.startsWith('http') ? product.image : `https://baitalarab.com${product.image}`) : "",
        "description": product.description || product.name,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "MAD",
          "price": product.price,
          "availability": "https://schema.org/InStock",
          "url": `https://baitalarab.com/?product=${product.id}`
        }
      }
    ];
  }

  script.textContent = JSON.stringify(schemaData);
}
