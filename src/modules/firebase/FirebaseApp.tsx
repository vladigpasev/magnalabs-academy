import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCYRwCiYjaAZ2Qaa809UNkHLMJMC2VxBNY",
  authDomain: "pharmacysurveyportal99.firebaseapp.com",
  projectId: "pharmacysurveyportal99",
  storageBucket: "pharmacysurveyportal99.appspot.com",
  messagingSenderId: "783361944460",
  appId: "1:783361944460:web:99ca80607f35d3b723c4a9",
  measurementId: "G-D0V54EF72V"
};

const FirebaseApp = initializeApp(firebaseConfig);

export default FirebaseApp;
