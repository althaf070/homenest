// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBmE562I4Y1t_5mCN--4PYJ10A1LcsNsxA",
  authDomain: "homenest-5066a.firebaseapp.com",
  projectId: "homenest-5066a",
  storageBucket: "homenest-5066a.appspot.com",
  messagingSenderId: "166524426020",
  appId: "1:166524426020:web:cc910c88e7ea4da72945b1",
  measurementId: "G-D4W5B8QBNB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider(app)

export const db = getFirestore(app)

export const storage = getStorage(app)