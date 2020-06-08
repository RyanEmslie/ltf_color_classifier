// Global variables
let myDB;
let authPromise;
let resolution = 20;
let retrievedData = [];
let colArr = [];
let rowArr = [];

//!
// Connect to firebase
function preload() {
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
}

//!
async function setup() {
  var canvas = createCanvas(800, 400);
  canvas.parent("sketchBox");
  await getData();

  setupGrid();
}

//!
function draw() {}

const setupGrid = () => {
  for (let col = 0; col < resolution; col++) {
    for (let row = 0; row < resolution; row++) {
      noStroke();
      fill(255);
      rect(col * resolution, row * resolution, resolution, resolution);
      colArr.push(col * resolution);
      rowArr.push(row * resolution);
    }
  }
};

const getData = () => {
  // Pointer to the data with callback
  myDB.ref("colors/inputs").on("value", gotData);
};

const gotData = (results) => {
  let data = results.val();
  let keys = Object.keys(data);
  for (let key of keys) {
    retrievedData.push(data[key]);
  }
  let colorArr = [...retrievedData];
  console.log(colorArr.length);

  for (let j = 0; j < resolution * resolution; j++) {
    fill(colorArr[j].r, colorArr[j].g, colorArr[j].b);
    rect(rowArr[j], colArr[j], resolution, resolution);
  }
};

// Draw grid with color information
const sendData = (event) => {
  let r = 0;
  let g = 0;
  let b = 0;
  setupGrid();
  let value = event.target.value;
  let colorArr = [...retrievedData].filter((x) => x.label == value);
  let avgColor = [...colorArr].forEach((x) => {
    r = r + x.r;
    g = g + x.g;
    b = b + x.b;
  });
  document.getElementById(
    "infoMessage"
  ).innerText = `Total Colors: ${retrievedData.length} --- ${value}: ${colorArr.length}`;
  for (let j = 0; j < colorArr.length; j++) {
    fill(colorArr[j].r, colorArr[j].g, colorArr[j].b);
    rect(rowArr[j], colArr[j], resolution, resolution);
  }
  let newR = Math.floor(r / colorArr.length);
  let newG = Math.floor(g / colorArr.length);
  let newB = Math.floor(b / colorArr.length);

  document.getElementById("avgColor").style.backgroundColor = `rgb(${newR},${newG},${newB})`;
};
