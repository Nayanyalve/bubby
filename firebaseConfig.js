import firebase from "firebase"; // ✅ Firebase 8

const firebaseConfig = {
  apiKey: "AIzaSyAll7zZ3h94YeETzdOqkwd8t-0C8ye-9os",
  authDomain: "projeto1-11610.firebaseapp.com",
  projectId: "projeto1-11610",
  storageBucket: "projeto1-11610.firebasestorage.app",
  messagingSenderId: "73006722031",
  appId: "1:73006722031:web:a177a48b0cc893cd42e41a"
};

// Evita inicialização duplicada
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const database = firebase.firestore();

export { firebase, auth, database };
