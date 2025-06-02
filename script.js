// Text translation (auto-triggered)
document.getElementById("textInput").addEventListener("input", async () => {
  const input = document.getElementById("textInput").value;
  const lang = document.getElementById("languageSelect").value;
  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    body: JSON.stringify({ q: input, source: "auto", target: lang, format: "text" }),
    headers: { "Content-Type": "application/json" }
  });
  const data = await res.json();
  document.getElementById("translatedOutput").innerText = data.translatedText;
});

// Braille print
function printBraille() {
  const content = document.getElementById("brailleInput").value;
  const brailleContent = content.normalize("NFD"); // Fake for demonstration
  const w = window.open();
  w.document.write(`<pre style="font-size: 20px;">${brailleContent}</pre>`);
  w.print();
  w.close();
}

// Teachable Machine (Sign Language)
const URL = "https://teachablemachine.withgoogle.com/models/Dm1vAU2b/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true;
  webcam = new tmImage.Webcam(200, 200, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}
