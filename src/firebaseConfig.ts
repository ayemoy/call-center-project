// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmBSbekNCX275L7JAZjd9n1xhBQNU7ko",
  authDomain: "call-center-project-c7222.firebaseapp.com",
  projectId: "call-center-project-c7222",
  storageBucket: "call-center-project-c7222.appspot.com",
  messagingSenderId: "8083498572",
  appId: "1:8083498572:web:ad275d4f6bb315de29b6e9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
