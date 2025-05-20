import { collection, getDocs } from "firebase/firestore";
import { db } from "../firestore/firebaseConfig";

export const getCallsFromDB = async () => {
  const snapshot = await getDocs(collection(db, "calls"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
