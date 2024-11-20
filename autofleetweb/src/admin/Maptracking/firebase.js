import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyAZ4He_Ff3KoZnZm3rN9Fr0Vzu1dkP2nLg",
  authDomain: "autofleetdumpdb.firebaseapp.com",
  databaseURL: "https://autofleetdumpdb-default-rtdb.firebaseio.com",
  projectId: "autofleetdumpdb",
  storageBucket: "autofleetdumpdb.firebasestorage.app",
  messagingSenderId: "847617553535",
  appId: "1:847617553535:web:8a55ac72b27428613d7b4a",
  measurementId: "G-0CD3SP3YWB"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };