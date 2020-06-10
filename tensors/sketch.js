let data;
let model;
let inputs;
let outputs;

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
  var canvas = createCanvas(400, 400);
  canvas.parent("sketchBox");
  console.log("setup");

  let colors = [];
  let labels = [];
  data.entries.forEach((record) => {
    // Normalize r,g,b values
    colors.push([record.r / 255, record.g / 255, record.b / 255]);
    // Labels are recorded as the index number of sabelList
    labels.push(labelList.indexOf(record.label));
  });
  inputs = tf.tensor2d(colors);
  let labelsTensor = tf.tensor1d(labels, "int32");
  outputs = tf.oneHot(labelsTensor, 9);
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
  train().then((results) => console.log(results.history.loss));
}

async function train() {
  // validation split, percentage to use a training
  // callback functions allow operations during training
  let config = {
    epochs: 10,
    validationSplit: 0.1,
    shuffle: true,
    callbacks: {
      onTrainBegin: () => console.log("Begin Training"),
      onTrainEnd: () => console.log("End Training"),
      onBatchEnd: async (num, logs) => {
        await tf.nextFrame();
      },
      onEpochEnd: (num, logs) => {
        console.log(`Epochs: ${num}`);
        console.log(`Loss: ${logs.loss}`);
      },
    },
  };

  // model.fit returns a promise
  return await model.fit(inputs, outputs, config);
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(4);
  line(frameCount % width, 0, frameCount % width, height);
}
