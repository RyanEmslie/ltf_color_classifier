// Global variables
let resolution = 20;
let retrievedData = [];
let colArr = [];
let rowArr = [];

//!
async function setup() {
  await getData();
  setupGrid();
  var canvas = createCanvas(800, 400);
  canvas.parent("sketchBox");
}

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
  console.log(Math.ceil(sqrt(colorArr.length)));

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
