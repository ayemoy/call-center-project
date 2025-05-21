import { collection, getDocs, query, where, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firestore/firebaseConfig";

export const getCallsFromDB = async () => {
  const snapshot = await getDocs(collection(db, "calls"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};



export const checkCallExists = async (name: string) => {
  const q = query(collection(db, "calls"), where("name", "==", name));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};



export const createCallInDB = async (name: string) => {
  const newCall = {
    name,
    createdAt: Timestamp.now(),
    tags: [],
    tasks: []
  };
  const docRef = await addDoc(collection(db, "calls"), newCall);
  return { id: docRef.id, ...newCall };
};