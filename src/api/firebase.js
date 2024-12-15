// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJ6UKcJMCL-BHxhkjYx0i1CHHiyhWqMKo",
  authDomain: "roof-community-admin.firebaseapp.com",
  projectId: "roof-community-admin",
  storageBucket: "roof-community-admin.firebasestorage.app",
  messagingSenderId: "823127643857",
  appId: "1:823127643857:web:9274bb7439b4ef33dd17f0",
  measurementId: "G-878GTT3Q63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;