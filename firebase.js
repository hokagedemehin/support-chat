import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAWJuQbGK5dYLyLhrs9PGQFh47Rd55cM3A",
    authDomain: "ibk-support-chat1.firebaseapp.com",
    projectId: "ibk-support-chat1",
    storageBucket: "ibk-support-chat1.appspot.com",
    messagingSenderId: "46740928301",
    appId: "1:46740928301:web:721d4d76d68e3f3ceac5a4"
  };

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider, app };