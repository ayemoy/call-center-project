import { db } from '../firestore/firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';

export const getAllTags = async (): Promise<string[]> => {
  const snapshot = await getDocs(collection(db, "tags"));
  return snapshot.docs.map(doc => doc.data().name);
};

export const addTagIfNotExists = async (name: string): Promise<string> => {
  const cleanName = name.trim().toLowerCase();
  const tagRef = doc(db, "tags", cleanName);
  const tagSnap = await getDoc(tagRef);

  if (tagSnap.exists()) {
    throw new Error("Tag already exists");
  }

  await setDoc(tagRef, { name: name.trim() });
  return "Tag created";
};