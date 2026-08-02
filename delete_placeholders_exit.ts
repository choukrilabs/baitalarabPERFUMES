import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './src/firebase';

async function run() {
  console.log('Fetching products...');
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  
  let count = 0;
  for (const document of snapshot.docs) {
    const data = document.data();
    if (data.image && data.image.startsWith('/images/')) {
      await deleteDoc(document.ref);
      console.log('Deleted product:', data.name);
      count++;
    }
  }
  console.log('Done, deleted', count);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
