import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBBqgX-lA1X6DBENBzBY28QTBVTOvMPztA",
  authDomain: "boomfaremessenger.firebaseapp.com",
  projectId: "boomfaremessenger",
  storageBucket: "boomfaremessenger.firebasestorage.app",
  messagingSenderId: "59974763010",
  appId: "1:59974763010:web:04c8831f6b45b26fd39d1b",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
