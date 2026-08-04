import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!aiInstance && process.env.GEMINI_API_KEY) {
    try {
      aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Gemini API initialization deferred or failed:', e);
    }
  }
  return aiInstance;
}

export async function generateProductDescription(
  name: string,
  category: string,
  notes?: string,
  isFrench?: boolean
): Promise<string> {
  const ai = getAI();
  if (!ai) {
    return isFrench
      ? `Création prestigieuse signée Parfumerie Bait Al Arab, située au Quartier Habous à Casablanca. Ingrédients nobles et authentiques soigneusement sélectionnés.`
      : `منتج فاخر من عطور بيت العرب في حي الحبوس بالدار البيضاء. جودة عالية ومكونات أصيلة مختارة بعناية.`;
  }

  try {
    const prompt = isFrench
      ? `Tu es un rédacteur marketing de luxe pour la prestigieuse boutique "Parfumerie Bait Al Arab" située au Quartier Habous à Casablanca.
Rédige une description courte, captivante et élégante (entre 25 et 45 mots) en français raffiné pour le produit suivant :
- Nom du produit : ${name}
- Catégorie : ${category}
${notes ? `- Ingrédients / Notes olfactives : ${notes}` : ''}

La description doit évoquer l'authenticité orientale, le raffinement et l'excellence marocaine sans longueur excessive.`
      : `أنت كاتب تسويقي محترف لمتجر "عطور بيت العرب" الواقع في حي الحبوس بالدار البيضاء.
اكتب وصفاً جذاباً وقصيراً (بين 25 إلى 45 كلمة) باللغة العربية الفصحى الأنيقة للمنتج التالي:
- اسم المنتج: ${name}
- التصنيف: ${category}
${notes ? `- ميزات/مكونات إضافية: ${notes}` : ''}

اجعل الوصف ينبض بالأصالة والفخامة الشرقية، دون إطالة مفرطة.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim();
    if (text) return text;
  } catch (err) {
    console.error('Error generating AI description:', err);
  }

  return isFrench
    ? `Création prestigieuse signée Parfumerie Bait Al Arab, située au Quartier Habous à Casablanca. Ingrédients nobles et authentiques soigneusement sélectionnés.`
    : `منتج فاخر من عطور بيت العرب في حي الحبوس بالدار البيضاء. جودة عالية ومكونات أصيلة مختارة بعناية.`;
}
