let data;

let labelList = [
  "red-ish",
  "green-ish",
  "blue-ish",
  "orange-ish",
  "yellow-ish",
  "pink-ish",
  "purple-ish",
  "brown-ish",
  "grey-ish",
];

function preload() {
  data = loadJSON("../colorData.json");
}

function setup() {
  let colors = [];
  let labels = [];
  data.entries.forEach((record) => {
    // Normalize r,g,b values
    colors.push([record.r / 255, record.g / 255, record.b / 255]);
    // Labels are recorded as the index number of sabelList
    labels.push(labelList.indexOf(record.label));
  });
  let inputs = tf.tensor2d(colors);
  let labelsTensor = tf.tensor1d(labels, "int32");
  labelsTensor.dispose();
  let outputs = tf.oneHot(labels, 9);
  console.log(inputs.shape);
  inputs.print();
  console.log(outputs.shape);
  outputs.print();
}
