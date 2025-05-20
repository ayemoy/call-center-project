// services/loginService.ts

import { signInWithEmailAndPassword } from "firebase/auth";
import http from "../http";             // Axios instance
import { auth } from "../firebase";

export const loginUser = async (email: string, password: string) => {
  // 1) Authenticate with Firebase Auth
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = cred.user;

  // 2) Grab the ID token (JWT) to prove to your backend that this is a real signed-in user
  const idToken = await firebaseUser.getIdToken();

  // 3) Send that token (not the email!) to your backend
  const response = await http.post("/api/login", { token: idToken });

  // 4) Your backend verifies the token via Firebase Admin SDK
  //    and then looks up users/{uid} in Firestore for role/displayName,
  //    finally returning that info under `data.user`
  const { displayName, role } = response.data.user;

  // 5) Return a unified user object
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName,
    role,
  };
};
