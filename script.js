const labels = ['akiec', 'bcc', 'bkl', 'df', 'nv', 'vasc', 'mel'];
let labelMap = {};

fetch("labels.json")
  .then(res => res.json())
  .then(data => labelMap = data);

const input = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const result = document.getElementById("result");
const predictBtn = document.getElementById("predictBtn");
let imageData = null;
///////////////////////////////////////////////////////////////////////
const session = await ort.InferenceSession.create("model.onnx");
///////////////////////////////////////////////////////////////////////
input.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function() {
    preview.src = reader.result;
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      // Resize image to 224x224 for CNN input
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

predictBtn.addEventListener("click", async () => {
  if (!imageData) {
    alert("Please upload an image first!");
    return;
  }

  result.textContent = "Running model...";

  // Load ONNX model
///////////////////////////////////////////////////////////////////////
  // const session = await ort.InferenceSession.create("model.onnx");
///////////////////////////////////////////////////////////////////////
  // Preprocess image (normalize and convert to tensor)
  const data = new Float32Array(3 * 224 * 224);
  for (let i = 0; i < 224 * 224; i++) {
    const offset = i * 4;
    data[i] = imageData.data[offset] / 255.0;          // R
    data[i + 224 * 224] = imageData.data[offset + 1] / 255.0;  // G
    data[i + 2 * 224 * 224] = imageData.data[offset + 2] / 255.0;  // B
  }

  const tensor = new ort.Tensor("float32", data, [1, 3, 224, 224]);
  const feeds = { input: tensor }; // Update if your model’s input name differs

  // Run inference
  const output = await session.run(feeds);
  const outputTensor = output[Object.keys(output)[0]].data;

  // Get top prediction
  const maxIdx = outputTensor.indexOf(Math.max(...outputTensor));
  const confidence = (outputTensor[maxIdx] * 100).toFixed(1);

  const label = labels[maxIdx];
  result.innerHTML = `<b>${labelMap[label]}</b> (${label})<br>Confidence: ${confidence}%`;
});
