let data;
let model;
let inputs;
let outputs;
let graphLabel;

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

  rSlider = createSlider(0, 255, 255);
  gSlider = createSlider(0, 255, 255);
  bSlider = createSlider(0, 255, 0);

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
    activation: "softmax",
  });
  model.add(hidden);
  model.add(output);

  const lr = 0.2;
  const optimizer = tf.train.sgd(lr);

  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
  });
  train().then((results) => console.log(results));
}

async function train() {
  // validation split, percentage to use a training
  // callback functions allow operations during training
  let config = {
    epochs: 100,
    validationSplit: 0.1,
    shuffle: true,
    callbacks: {
      onTrainBegin: () => console.log("Begin Training"),
      onTrainEnd: () => console.log("End Training"),
      onBatchEnd: tf.nextFrame,
      onEpochEnd: (num, logs) => {
        // console.log(`Epochs: ${num}`);
        // console.log(`Loss: ${logs.loss}`);
      },
    },
  };

  // model.fit returns a promise
  return await model.fit(inputs, outputs, config);
}

function draw() {
  let r = rSlider.value();
  let g = gSlider.value();
  let b = bSlider.value();
  background(r, g, b);
  fill(0);
  textSize(35);
  text(graphLabel, width / 2 + 0.5, height / 2);

  tf.tidy(() => {
    const xs = tf.tensor2d([[r / 255, g / 255, b / 255]]);

    let results = model.predict(xs);
    let index = results.argMax(1).dataSync();
    // console.log(labelList[index[0]]);
    graphLabel = labelList[index[0]];
    // console.log(index);

    // stroke(255);
    // strokeWeight(4);
    // line(frameCount % width, 0, frameCount % width, height);
  });
}
