import { db } from '../firestore/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const handleLogin = async (email: string, password: string) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        throw new Error('User not found');
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password !== password) {
        throw new Error('Incorrect password');
    }

    const { password: _, ...safeUser } = userData;
    return safeUser;
};
