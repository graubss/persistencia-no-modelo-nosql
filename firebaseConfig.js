// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDvYWBYatv_6yJHbER-EL8zIICMr4XP2Z8",
  authDomain: "produto-crud-e9c00.firebaseapp.com",
  projectId: "produto-crud-e9c00",
  storageBucket: "produto-crud-e9c00.appspot.com",
  messagingSenderId: "417319912863",
  appId: "1:417319912863:web:862a145a05c6f1257c29aa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };