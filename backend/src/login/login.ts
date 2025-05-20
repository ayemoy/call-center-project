import { db } from '../firestore/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const handleLogin = async (uid: string) => {
  // Fetch the user document by UID
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    throw new Error("User not found in Firestore");
  }

  // Strip out any sensitive fields (e.g. no password stored here)
  const data = snap.data();
  const { password, ...safeUser } = data;

  return safeUser; // { displayName, role, email?, … }
};
