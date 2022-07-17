import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";



function Startfirebase(opt) {
  const firebaseConfig = {
    apiKey: "AIzaSyCHLZ-PltMTOUFCZ4NwukT9KqPtcfzwmW0",
    authDomain: "chat-app-1a635.firebaseapp.com",
    databaseURL: "https://chat-app-1a635-default-rtdb.firebaseio.com",
    projectId: "chat-app-1a635",
    storageBucket: "chat-app-1a635.appspot.com",
    messagingSenderId: "120035237709",
    appId: "1:120035237709:web:ffe9ec3187aee0f4bca104"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  switch (opt) {
    case "Auth":
      return getAuth(app);
    case "DB":
      return getDatabase(app)

  }

}

export default Startfirebase;