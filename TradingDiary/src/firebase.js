import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, setLogLevel } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBWXckMZDMj-ECiuTRcjsbZTaa0nLUjXDU",
  authDomain: "tradingdiary-dd301.firebaseapp.com",
  projectId: "tradingdiary-dd301",
  storageBucket: "tradingdiary-dd301.firebasestorage.app",
  messagingSenderId: "335823645697",
  appId: "1:335823645697:web:25c02c45c4d8014cbaa400",
  measurementId: "G-1GFNZ5LQG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
setLogLevel("debug");

export { app, auth, db,  collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc };
