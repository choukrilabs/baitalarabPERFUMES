import fs from 'fs';
let content = fs.readFileSync('src/firebase.ts', 'utf-8');

content = content.replace("import { getFirestore } from 'firebase/firestore';", "import { initializeFirestore } from 'firebase/firestore';");
content = content.replace("export const db = getFirestore(app, config.firestoreDatabaseId);", "export const db = initializeFirestore(app, { experimentalForceLongPolling: true }, config.firestoreDatabaseId);");

fs.writeFileSync('src/firebase.ts', content);
