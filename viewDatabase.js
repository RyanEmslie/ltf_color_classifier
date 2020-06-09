// Global variables
let resolution = 0;
let mappedRes = 0;

let retrievedData = [];
let colArr = [];
let rowArr = [];

async function preload() {
  await getData();
}
//!
function setup() {
  var canvas = createCanvas(400, 400);
  canvas.parent("sketchBox");
}

const setupGrid = () => {
  colArr = [];
  rowArr = [];
  for (let col = 0; col < resolution; col++) {
    for (let row = 0; row < resolution; row++) {
      stroke(0);
      fill(255);
      rect(col * mappedRes, row * mappedRes, mappedRes, mappedRes);
      colArr.push(col * mappedRes);
      rowArr.push(row * mappedRes);
    }
  }
};

const getData = async () => {
  // Pointer to the data with callback
  myDB.ref("colors/inputs").on("value", gotData);
};

// Call back function that returns data
const gotData = (results) => {
  let data = results.val();
  let keys = Object.keys(data);
  for (let key of keys) {
    retrievedData.push(data[key]);
  }
  let colorArr = [...retrievedData];

  resolution = Math.floor(sqrt(retrievedData.length));
  mappedRes = height / resolution;
  setupGrid();

  for (let j = 0; j < resolution * resolution; j++) {
    fill(colorArr[j].r, colorArr[j].g, colorArr[j].b);
    rect(rowArr[j], colArr[j], mappedRes, mappedRes);
  }
};

// Draw grid with color information
const sendData = (event) => {
  let r = 0;
  let g = 0;
  let b = 0;
  let value = event.target.value;
  let colorArr = [...retrievedData].filter((x) => x.label == value);
  resolution = Math.floor(sqrt(colorArr.length));
  mappedRes = height / resolution;
  setupGrid();

  let avgColor = [...colorArr].forEach((x) => {
    r = r + x.r;
    g = g + x.g;
    b = b + x.b;
  });
  document.getElementById(
    "infoMessage"
  ).innerText = `Total Colors: ${retrievedData.length} --- ${value}: ${colorArr.length}`;
  for (let j = 0; j < resolution * resolution; j++) {
    fill(colorArr[j].r, colorArr[j].g, colorArr[j].b);
    rect(rowArr[j], colArr[j], mappedRes, mappedRes);
  }
  let newR = Math.floor((r / resolution) * resolution);
  let newG = Math.floor((g / resolution) * resolution);
  let newB = Math.floor((b / resolution) * resolution);

  document.getElementById("avgColor").style.backgroundColor = `rgb(${newR},${newG},${newB})`;
};
