// VERSION 3
// // script.js - Fixed for Gradio 5+ API
// const labels = ['akiec', 'bcc', 'bkl', 'df', 'nv', 'vasc', 'mel'];
// let labelMap = {};

// // Load labels.json if needed (optional)
// fetch("labels.json")
//   .then(res => res.json())
//   .then(data => (labelMap = data))
//   .catch(err => console.log("labels.json not found, using default labels"));

// const input = document.getElementById("fileInput");
// const preview = document.getElementById("preview");
// const result = document.getElementById("result");
// const predictBtn = document.getElementById("predictBtn");

// let selectedFile = null;

// // Handle file selection and preview
// input.addEventListener("change", (e) => {
//   const file = e.target.files[0];
//   if (!file) return;
  
//   selectedFile = file;
  
//   const reader = new FileReader();
//   reader.onload = function () {
//     preview.src = reader.result;
//   };
//   reader.readAsDataURL(file);
// });

// // Handle predict button
// predictBtn.addEventListener("click", async () => {
//   if (!selectedFile) return alert("Please upload an image first!");
//   result.textContent = "Running model on backend...";

//   const reader = new FileReader();
//   reader.onload = async () => {
//     try {
//       const dataURI = reader.result;
//       const res = await fetch(
//         "https://rybai08-skin-cancer-detection-backend.hf.space/api/predict/",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ data: [dataURI] })
//         }
//       );
//       if (!res.ok) throw new Error(`Server error: ${res.status}`);
//       const data = await res.json();

//       const predictions = data.data[0];
//       const sorted = Object.entries(predictions).sort((a, b) => b[1] - a[1]);
//       const [topLabel, topProb] = sorted[0];
//       const confidence = (topProb * 100).toFixed(1);

//       result.innerHTML = `<b>${topLabel}</b><br>Confidence: ${confidence}%<br><br>` +
//         sorted.map(([lbl, p]) => `${lbl}: ${(p * 100).toFixed(1)}%`).join("<br>");
//     } catch (err) {
//       console.error(err);
//       result.textContent = `Error: ${err.message}`;
//     }
//   };
//   reader.readAsDataURL(selectedFile);
// });



// // VERSION 2
// //////////////////////////////////////////////////////////////////////////////////////
// // script.js - Fixed for Hugging Face backend
// const labels = ['akiec', 'bcc', 'bkl', 'df', 'nv', 'vasc', 'mel'];
// let labelMap = {};

// // Load labels.json if needed (optional)
// fetch("labels.json")
//   .then(res => res.json())
//   .then(data => (labelMap = data))
//   .catch(err => console.log("labels.json not found, using default labels"));

// const input = document.getElementById("fileInput");
// const preview = document.getElementById("preview");
// const result = document.getElementById("result");
// const predictBtn = document.getElementById("predictBtn");

// let selectedFile = null;

// // Handle file selection and preview
// input.addEventListener("change", (e) => {
//   const file = e.target.files[0];
//   if (!file) return;
  
//   selectedFile = file;
  
//   const reader = new FileReader();
//   reader.onload = function () {
//     preview.src = reader.result;
//   };
//   reader.readAsDataURL(file);
// });

// // Handle predict button
// predictBtn.addEventListener("click", async () => {
//   if (!selectedFile) {
//     alert("Please upload an image first!");
//     return;
//   }
  
//   result.textContent = "Running model on backend...";
  
//   const reader = new FileReader();
//   reader.onload = async () => {
//     try {
//       // FIXED: Send the FULL data URI, not just the base64 part
//       const dataURI = reader.result; // Keep the full "data:image/...;base64,..." string
      
//       // Send JSON to Gradio backend API
//       const res = await fetch(
//         "https://rybai08-skin-cancer-detection-backend.hf.space/api/predict/",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ data: [dataURI] }) // Send full data URI
//         }
//       );
      
//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(`Server error: ${res.status} - ${errorText}`);
//       }
      
//       const data = await res.json();
      
//       // Gradio returns { data: [ { label: prob, ... } ] }
//       const predictions = data.data[0];
//       const sorted = Object.entries(predictions).sort((a, b) => b[1] - a[1]);
//       const [topLabel, topProb] = sorted[0];
//       const confidence = (topProb * 100).toFixed(1);
      
//       // Display results
//       result.innerHTML = `<b>${topLabel}</b><br>Confidence: ${confidence}%<br><br>` +
//         sorted.map(([lbl, p]) => `${lbl}: ${(p * 100).toFixed(1)}%`).join("<br>");
        
//     } catch (err) {
//       console.error(err);
//       result.textContent = `Error: ${err.message}`;
//     }
//   };
  
//   reader.readAsDataURL(selectedFile);
// });







// //VERSION 1
// ///////////////////////////////////////////////////////////////
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


// version 4
// Skin Cancer Detection - ONNX in Browser
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

// Predict button
predictBtn.addEventListener("click", async () => {
  if (!imageData) {
    alert("Please upload an image first!");
    return;
  }

  result.textContent = "Running model...";

  try {
    // Load ONNX model (web-friendly)
    const session = await ort.InferenceSession.create("assets/model.onnx", {
      executionProviders: ['wasm']  // or 'webgl' / 'webgpu' if supported
    });

    // Preprocess image to Float32 tensor [1, 3, 224, 224]
    const data = new Float32Array(3 * 224 * 224);
    for (let i = 0; i < 224 * 224; i++) {
      const offset = i * 4;
      data[i] = imageData.data[offset] / 255.0;          // R
      data[i + 224 * 224] = imageData.data[offset + 1] / 255.0;  // G
      data[i + 2 * 224 * 224] = imageData.data[offset + 2] / 255.0; // B
    }

    const inputName = session.inputNames[0];  // automatically detect input name
    const tensor = new ort.Tensor("float32", data, [1, 3, 224, 224]);
    const feeds = {};
    feeds[inputName] = tensor;

    // Run inference
    const output = await session.run(feeds);
    const outputTensor = output[session.outputNames[0]].data;

    // Softmax
    const max = Math.max(...outputTensor);
    const exps = outputTensor.map(x => Math.exp(x - max));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    const probs = exps.map(x => x / sumExps);

    // Get top prediction
    const maxIdx = probs.indexOf(Math.max(...probs));
    const label = labels[maxIdx];
    const confidence = (probs[maxIdx] * 100).toFixed(1);

    result.innerHTML = `<b>${labelMap[label]}</b> (${label})<br>Confidence: ${confidence}%<br><br>` +
      labels.map((l, i) => `${labelMap[l]}: ${(probs[i] * 100).toFixed(1)}%`).join("<br>");
  } catch (err) {
    console.error(err);
    result.textContent = `Error running model: ${err.message}`;
  }
});

