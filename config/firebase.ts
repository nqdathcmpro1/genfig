import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDHt-_6mb-jT3h-zx8Dyfz8y69ktBGZtxk",
  authDomain: "genfig.firebaseapp.com",
  projectId: "genfig",
  storageBucket: "genfig.appspot.com",
  messagingSenderId: "200043456470",
  appId: "1:200043456470:web:c1ee6c71d0af18924c6677",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
