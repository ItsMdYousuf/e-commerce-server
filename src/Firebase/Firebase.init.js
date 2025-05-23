// Firebase.init.js 
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyDYMsdOkIXNCxrTRYHRPVZ1uzmurrvJxLQ",
   authDomain: "ecommerce-server-ed4a5.firebaseapp.com",
   databaseURL: "https://ecommerce-server-ed4a5-default-rtdb.firebaseio.com",
   projectId: "ecommerce-server-ed4a5",
   storageBucket: "ecommerce-server-ed4a5.firebasestorage.app",
   messagingSenderId: "509733451251",
   appId: "1:509733451251:web:64cf44e621424b38278e86",
   measurementId: "G-EBN3ZZJ46L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
