let data;
let model;

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
  let outputs = tf.oneHot(labelsTensor, 9);
  labelsTensor.dispose();

  console.log(inputs.shape);
  console.log(outputs.shape);

  // Construct model
  model = tf.sequential();

  // Used inputShape instead of inputDim
  let hidden = tf.layers.dense({
    units: 16,
    activation: "sigmoid",
    inputShape: [3],
  });
  let output = tf.layers.dense({
    units: 9,
    activation: "sigmoid",
  });
  model.add(hidden);
  model.add(output);

  const lr = 0.2;
  const optimizer = tf.train.sgd(lr);

  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
  });

  // validation split, percentage to use a training
  let config = { epochs: 10, validationSplit: 0.1, shuffle: true };
  // model.fit returns a promise
  model.fit(inputs, outputs, config).then((results) => console.log(results.history.loss));
}
