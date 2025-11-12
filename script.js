const labels = ['akiec', 'bcc', 'bkl', 'df', 'nv', 'vasc', 'mel'];
let labelMap = {};

// Load labels.json
fetch("labels.json")
  .then(res => res.json())
  .then(data => labelMap = data)
  .catch(() => console.log("labels.json not found, using default labels"));

const input = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const result = document.getElementById("result");
const predictBtn = document.getElementById("predictBtn");

let imageData = null;

// Handle file selection
input.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function() {
    preview.src = reader.result;

    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      // Resize to 224x224
      const canvas = document.createElement("canvas");
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 224, 224);
      imageData = ctx.getImageData(0, 0, 224, 224);
    };
  };
  reader.readAsDataURL(file);
});




// // EXAMPLES CODE
// const exampleData = {
//   1: { img: "assets/example_image_1.jpg", label: "Melanocytic Nevus", confidence: "92%" },
//   2: { img: "assets/example_image_2.jpg", label: "Basal Cell Carcinoma", confidence: "87%" },
//   3: { img: "assets/example_image_3.jpg", label: "Actinic Keratosis", confidence: "78%" },
// };

// const buttons = document.querySelectorAll(".example-btn");
// const exampleImg = document.getElementById("example-img");
// const exampleLabel = document.getElementById("example-label");
// const exampleConfidence = document.getElementById("example-confidence");

// // Button click event
// buttons.forEach(btn => {
//   btn.addEventListener("click", () => {
//     // Remove "active" from all buttons
//     buttons.forEach(b => b.classList.remove("active"));
//     // Add "active" to clicked button
//     btn.classList.add("active");

//     const index = btn.dataset.index;
//     const data = exampleData[index];

//     // Update preview image and classification results
//     exampleImg.src = data.img;
//     exampleLabel.textContent = data.label;
//     exampleConfidence.textContent = data.confidence;
//   });
// });





// UNCOMMENT IF WANT TO PUT PREDICTION BUTTON ON MY WEBSITE AGAIN, IF EVER CONNECTED TO BACKEND
// UNCOMMENT IF WANT TO PUT PREDICTION BUTTON ON MY WEBSITE AGAIN, IF EVER CONNECTED TO BACKEND
// UNCOMMENT IF WANT TO PUT PREDICTION BUTTON ON MY WEBSITE AGAIN, IF EVER CONNECTED TO BACKEND
// Predict button
// predictBtn.addEventListener("click", async () => {
//   if (!imageData) {
//     alert("Please upload an image first!");
//     return;
//   }

//   result.textContent = "Running model...";

//   try {
//     // Load ONNX model (web-friendly)
//     const session = await ort.InferenceSession.create("assets/model.onnx", {
//       executionProviders: ['wasm']  // or 'webgl' / 'webgpu' if supported
//     });

//     // Preprocess image to Float32 tensor [1, 3, 224, 224]
//     const data = new Float32Array(3 * 224 * 224);
//     for (let i = 0; i < 224 * 224; i++) {
//       const offset = i * 4;
//       data[i] = imageData.data[offset] / 255.0;          // R
//       data[i + 224 * 224] = imageData.data[offset + 1] / 255.0;  // G
//       data[i + 2 * 224 * 224] = imageData.data[offset + 2] / 255.0; // B
//     }

//     const inputName = session.inputNames[0];  // automatically detect input name
//     const tensor = new ort.Tensor("float32", data, [1, 3, 224, 224]);
//     const feeds = {};
//     feeds[inputName] = tensor;

//     // Run inference
//     const output = await session.run(feeds);
//     const outputTensor = output[session.outputNames[0]].data;

//     // Softmax
//     const max = Math.max(...outputTensor);
//     const exps = outputTensor.map(x => Math.exp(x - max));
//     const sumExps = exps.reduce((a, b) => a + b, 0);
//     const probs = exps.map(x => x / sumExps);

//     // Get top prediction
//     const maxIdx = probs.indexOf(Math.max(...probs));
//     const label = labels[maxIdx];
//     const confidence = (probs[maxIdx] * 100).toFixed(1);

//     result.innerHTML = `<b>${labelMap[label]}</b> (${label})<br>Confidence: ${confidence}%<br><br>` +
//       labels.map((l, i) => `${labelMap[l]}: ${(probs[i] * 100).toFixed(1)}%`).join("<br>");
//   } catch (err) {
//     console.error(err);
//     result.textContent = `Error running model: ${err.message}`;
//   }
// });

