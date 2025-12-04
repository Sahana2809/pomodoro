// firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfZTPmbPN3CVwzE-eKHcQ2gyFJDakL60w",
  authDomain: "pomodorabbit.firebaseapp.com",
  projectId: "pomodorabbit",
  storageBucket: "pomodorabbit.firebasestorage.app",
  messagingSenderId: "482507412766",
  appId: "1:482507412766:web:6e6e298a478ed2f162650f",
  measurementId: "G-9D3HBGXV2H"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


