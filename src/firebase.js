// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAat5eSlGz_3atqXY4Ucnc79imp-wZD-2U",
  authDomain: "realtor-clone-react-ac256.firebaseapp.com",
  projectId: "realtor-clone-react-ac256",
  storageBucket: "realtor-clone-react-ac256.appspot.com",
  messagingSenderId: "888613752099",
  appId: "1:888613752099:web:8d0c2991670ccd6f39d096",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
