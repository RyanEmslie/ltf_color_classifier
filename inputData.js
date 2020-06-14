// Promise to setTimeout after data is saved
const myPromise = () => {
  return new Promise(function (resolve, reject) {
    redraw();
    setTimeout(resolve, 750);
  });
};

function setup() {
  var canvas = createCanvas(400, 400);
  canvas.parent("sketchBox");
  newColors();
}

function draw() {
  fill(r, g, b);
  rect(width / 2 - 100, height / 2 - 100, 200, 200);
}

const sendData = async (e) => {
  var label = e.target.value;
  var data = {
    date: firebase.database.ServerValue.TIMESTAMP,
    r: r,
    g: g,
    b: b,
    label: label,
  };
  myDB.ref("colors/inputs").push(data, finished);

  async function finished(error) {
    error
      ? console.log("ooops")
      : (document.getElementById("infoMessage").innerText = "Saving Data");
  }
  document.getElementById("infoMessage").innerText = "Saving Data";
  toggleClass();
  await myPromise();
  await newColors();
  toggleClass();
};

const newColors = async () => {
  document.getElementById("infoMessage").innerText = "Please Select Color";
  r = Math.floor(random(0, 256));
  g = Math.floor(random(0, 256));
  b = Math.floor(random(0, 256));
};

const toggleClass = () => {
  Array.from(document.querySelectorAll(".buttons")).forEach((btn) => {
    btn.classList.toggle("hidden");
  });
};
