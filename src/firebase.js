import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA13qCqI2JO6E5_DnBiT1dTkLfF06xM3hE",
  authDomain: "spendify-07.firebaseapp.com",
  projectId: "spendify-07",
  storageBucket: "spendify-07.firebasestorage.app",
  messagingSenderId: "298617173317",
  appId: "1:298617173317:web:0722eb784c9cecf2a3ba2c",
  measurementId: "G-BR7D910NC2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
