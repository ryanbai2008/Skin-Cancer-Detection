const labels = ['akiec', 'bcc', 'bkl', 'df', 'nv', 'vasc', 'mel'];
let labelMap = {};

fetch("labels.json")
  .then(res => res.json())
  .then(data => labelMap = data);

const input = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const result = document.getElementById("result");
const predictBtn = document.getElementById("predictBtn");

let selectedFile = null;

input.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile = file;

  const reader = new FileReader();
  reader.onload = function() {
    preview.src = reader.result;
  };
  reader.readAsDataURL(file);
});

predictBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    alert("Please upload an image first!");
    return;
  }

  result.textContent = "Running model on backend...";

  try {
    // Prepare the file for upload
    const formData = new FormData();
    formData.append("data", selectedFile);

    // Call the Gradio backend API
    const res = await fetch("https://rybai08-skin-cancer-detection-backend.hf.space/api/predict/", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();

    // Gradio returns output in { data: [ { label: probability, ... } ] }
    const predictions = data.data[0];
    console.log(predictions);

    // Find top prediction
    const sorted = Object.entries(predictions).sort((a, b) => b[1] - a[1]);
    const [topLabel, topProb] = sorted[0];

    // Use your label map for full name if available
    const labelName = labelMap[topLabel] || topLabel;
    const confidence = (topProb * 100).toFixed(1);

    result.innerHTML = `<b>${labelName}</b> (${topLabel})<br>Confidence: ${confidence}%`;

  } catch (err) {
    console.error(err);
    result.textContent = "Error connecting to backend. Please try again.";
  }
});


// const labels = ['akiec', 'bcc', 'bkl', 'df', 'nv', 'vasc', 'mel'];
// let labelMap = {};

// fetch("labels.json")
//   .then(res => res.json())
//   .then(data => labelMap = data);

// const input = document.getElementById("fileInput");
// const preview = document.getElementById("preview");
// const result = document.getElementById("result");
// const predictBtn = document.getElementById("predictBtn");
// let imageData = null;
// input.addEventListener("change", e => {
//   const file = e.target.files[0];
//   if (!file) return;
//   const reader = new FileReader();
//   reader.onload = function() {
//     preview.src = reader.result;
//     const img = new Image();
//     img.src = reader.result;
//     img.onload = () => {
//       // Resize image to 224x224 for CNN input
//       const canvas = document.createElement("canvas");
//       canvas.width = 224;
//       canvas.height = 224;
//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0, 224, 224);
//       imageData = ctx.getImageData(0, 0, 224, 224);
//     };
//   };
//   reader.readAsDataURL(file);
// });

// predictBtn.addEventListener("click", async () => {
//   if (!imageData) {
//     alert("Please upload an image first!");
//     return;
//   }

//   result.textContent = "Running model...";

//   // Load ONNX model
//   const session = await ort.InferenceSession.create("model.onnx");
//   // Preprocess image (normalize and convert to tensor)
//   const data = new Float32Array(3 * 224 * 224);
//   for (let i = 0; i < 224 * 224; i++) {
//     const offset = i * 4;
//     data[i] = imageData.data[offset] / 255.0;          // R
//     data[i + 224 * 224] = imageData.data[offset + 1] / 255.0;  // G
//     data[i + 2 * 224 * 224] = imageData.data[offset + 2] / 255.0;  // B
//   }

//   const tensor = new ort.Tensor("float32", data, [1, 3, 224, 224]);
//   const feeds = { input: tensor }; // Update if your model’s input name differs

//   // Run inference
//   const output = await session.run(feeds);
//   const outputTensor = output[Object.keys(output)[0]].data;

//   // Get top prediction
//   const maxIdx = outputTensor.indexOf(Math.max(...outputTensor));
//   const confidence = (outputTensor[maxIdx] * 100).toFixed(1);

//   const label = labels[maxIdx];
//   result.innerHTML = `<b>${labelMap[label]}</b> (${label})<br>Confidence: ${confidence}%`;
// });
