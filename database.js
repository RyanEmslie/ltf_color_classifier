let myDB;
let authPromise;

var firebaseConfig = {
  apiKey: "AIzaSyBItUIaPm0UGDGkn-ZuyyzaJPxM0XigaSg",
  authDomain: "color-classifier-e9d72.firebaseapp.com",
  databaseURL: "https://color-classifier-e9d72.firebaseio.com",
  projectId: "color-classifier-e9d72",
  storageBucket: "color-classifier-e9d72.appspot.com",
  messagingSenderId: "297469815956",
  appId: "1:297469815956:web:6e80e2841bd24dc3239881",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
myDB = firebase.database();
