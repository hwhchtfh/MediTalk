// 🔤 Text Translation
async function translate() {
  const input = document.getElementById("inputText").value;
  const targetLang = document.getElementById("targetLang").value;

  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    body: JSON.stringify({
      q: input,
      source: "auto",
      target: targetLang,
      format: "text"
    }),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  document.getElementById("outputText").value = data.translatedText;
}

// 🧾 Braille Print (simulate dots)
function printBraille() {
  const content = document.getElementById("brailleInput").value;
  const dots = content.replace(/./g, "⠿"); // simulate Braille with block dots
  const win = window.open("", "", "width=400,height=400");
  win.document.write(`<pre style="font-size: 30px;">${dots}</pre>`);
  win.print();
  win.close();
}

// 🖐️ Sign Language using Teachable Machine
const URL = "https://teachablemachine.withgoogle.com/models/Dm1vAU2b/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  webcam = new tmImage.Webcam(200, 200, true);
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
