import firebase from "firebase";

// Configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAll7zZ3h94YeETzdOqkwd8t-0C8ye-9os",
  authDomain: "projeto1-11610.firebaseapp.com",
  projectId: "projeto1-11610",
  storageBucket: "projeto1-11610.appspot.com",
  messagingSenderId: "73006722031",
  appId: "1:73006722031:web:a177a48b0cc893cd42e41a"
};

// Inicializa o Firebase somente se ainda não foi inicializado
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Exporta os serviços usados
const auth = firebase.auth();
const database = firebase.firestore();

export { firebase, auth, database };
