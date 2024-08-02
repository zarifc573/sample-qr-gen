
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDkg-VxRKJUFa1Huc804AY9Cir7BdL3ANs",
  authDomain: "electron-be372.firebaseapp.com",
  databaseURL: "https://electron-be372-default-rtdb.firebaseio.com",
  projectId: "electron-be372",
  storageBucket: "electron-be372.appspot.com",
  messagingSenderId: "402395432436",
  appId: "1:402395432436:web:4b7924c96a3a1146e725a1",
  measurementId: "G-1J9X324LKP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);
export { auth, db, storage  };
