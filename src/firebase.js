// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-d751e.firebaseapp.com",
    projectId: "mern-estate-d751e",
    storageBucket: "mern-estate-d751e.appspot.com",
    messagingSenderId: "702248104388",
    appId: "1:702248104388:web:eb1a6c12688a8ddec1f491"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);