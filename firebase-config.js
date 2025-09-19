// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyAsg9CgO_WZC1TIGk-HiA6uckodWDLET3w",
  authDomain: "studyhub-161cb.firebaseapp.com",
  projectId: "studyhub-161cb",
  storageBucket: "studyhub-161cb.firebasestorage.app",
  messagingSenderId: "270475349190",
  appId: "1:270475349190:web:5dd3f8894ac31eb23a9bc7",
  measurementId: "G-9BBZZS59YR"
};

// Initialize Firebase with the global syntax
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firestore service
const db = firebase.firestore();
