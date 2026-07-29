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
  notes?: string
): Promise<string> {
  const ai = getAI();
  if (!ai) {
    return `منتج فاخر من عطور بيت العرب في حي الحبوس بالدار البيضاء. جودة عالية ومكونات أصيلة مختارة بعناية.`;
  }

  try {
    const prompt = `أنت كاتب تسويقي محترف لمتجر "عطور بيت العرب" الواقع في حي الحبوس بالدار البيضاء.
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

  return `منتج فاخر من عطور بيت العرب في حي الحبوس بالدار البيضاء. جودة عالية ومكونات أصيلة مختارة بعناية.`;
}
