import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8wq6Vdp6PjCxa-qbMZhGHC8_qTYn81fM",
    authDomain: "expense-tracker-3bce5.firebaseapp.com",
    projectId: "expense-tracker-3bce5",
    storageBucket: "expense-tracker-3bce5.firebasestorage.app",
    messagingSenderId: "449187901830",
    appId: "1:449187901830:web:d074d6c2e6fbfe11dabc07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();