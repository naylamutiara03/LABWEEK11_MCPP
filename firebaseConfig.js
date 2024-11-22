// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEFpQ7xvfz4ORFQsAFzNIifIjZx1RNVic",
  authDomain: "labweek11-mcpp-11d50.firebaseapp.com",
  projectId: "labweek11-mcpp-11d50",
  storageBucket: "labweek11-mcpp-11d50.firebasestorage.app",
  messagingSenderId: "1004395888367",
  appId: "1:1004395888367:web:47bb319af26a9e0128251a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

