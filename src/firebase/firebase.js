// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxKGC4UIbqohmbJhsLu9ImfYjIuNRRJ9Q",
  authDomain: "auth-test-92c4f.firebaseapp.com",
  projectId: "auth-test-92c4f",
  storageBucket: "auth-test-92c4f.appspot.com",
  messagingSenderId: "227839334770",
  appId: "1:227839334770:web:97b53e7c5ceebd559625eb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
