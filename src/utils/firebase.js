const dotenv = require('dotenv');
dotenv.config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

console.log("firebase")
console.log(process.env.REACT_APP_FIREBASE_AUTHDOMAIN)
console.log(process.env.REACT_APP_FIREBASE_APP_ID)

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN || '',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET || '',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.REACT_APP_FIREBASE_APP_ID || ''
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)


export { firebaseApp, db };