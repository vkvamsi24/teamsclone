import firebase from 'firebase';	

const firebaseConfig = {
    apiKey: "AIzaSyDpc8zZQJC2hz1CEpr-6ZvAYEe0qGYqiUs",
    authDomain: "wa-clone-b0164.firebaseapp.com",
    projectId: "wa-clone-b0164",
    storageBucket: "wa-clone-b0164.appspot.com",
    messagingSenderId: "727862385492",
    appId: "1:727862385492:web:ccbe29e4aeeb066f1586c1",
    measurementId: "G-92RB60SWL2"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);	

const db = firebaseApp.firestore();	
const auth = firebase.auth();	
const provider = new firebase.auth.GoogleAuthProvider();	
const storage = firebase.storage();

export { auth, provider, storage, firebase };	
export default db;  