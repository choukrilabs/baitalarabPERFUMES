import fs from 'fs';
let content = fs.readFileSync('src/hooks/useProducts.ts', 'utf-8');

content = content.replace("import { collection, onSnapshot, doc, setDoc, writeBatch } from 'firebase/firestore';", "import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';");

content = content.replace("      const { deleteDoc } = await import('firebase/firestore');\n      await deleteDoc(docRef);", "      await deleteDoc(docRef);");

fs.writeFileSync('src/hooks/useProducts.ts', content);
