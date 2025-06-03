// Translate Text using LibreTranslate
async function translateText() {
  const input = document.getElementById("inputText").value;
  const lang = document.getElementById("targetLang").value;
  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    body: JSON.stringify({
      q: input,
      source: "auto",
      target: lang,
      format: "text"
    }),
    headers: { "Content-Type": "application/json" }
  });
  const data = await res.json();
  document.getElementById("outputText").value = data.translatedText;
}

// Sign Language via Teachable Machine
const URL = "https://teachablemachine.withgoogle.com/models/Dm1vAU2b_/";

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
  labelContainer.innerHTML = "";
  prediction.forEach(p => {
    const text = p.className + ": " + (p.probability * 100).toFixed(1) + "%";
    const div = document.createElement("div");
    div.textContent = text;
    labelContainer.appendChild(div);
  });
}

// Braille mock print
function printBraille() {
  const content = document.getElementById("brailleText").value;
  const win = window.open("", "", "width=600,height=400");
  win.document.write("<pre style='font-size: 30px;'>⠿ " + content + "</pre>");
  win.document.close();
  win.print();
}
