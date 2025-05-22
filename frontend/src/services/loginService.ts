// services/loginService.ts

import { signInWithEmailAndPassword } from "firebase/auth";
import http from "../http";             // Axios instance
import { auth } from "../firebase";

export const loginUser = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = cred.user;

  const idToken = await firebaseUser.getIdToken();

  const response = await http.post("/api/login", { token: idToken });

  const { displayName, role } = response.data.user;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName,
    role,
  };
};
