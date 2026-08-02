import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './src/firebase';

async function run() {
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  
  for (const document of snapshot.docs) {
    const data = document.data();
    if (data.image && data.image.startsWith('/images/')) {
      await deleteDoc(document.ref);
      console.log('Deleted product:', data.name);
    }
  }
  console.log('Done');
}

run().catch(console.error);
