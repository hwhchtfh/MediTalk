// Text translation using LibreTranslate
async function translateText() {
  const text = document.getElementById("textInput").value;
  const lang = document.getElementById("languageSelect").value;
  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    body: JSON.stringify({ q: text, source: "auto", target: lang }),
    headers: { "Content-Type": "application/json" }
  });
  const data = await res.json();
  document.getElementById("translatedOutput").value = data.translatedText;
}

// Voice input
function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.onresult = function(event) {
    document.getElementById("textInput").value = event.results[0][0].transcript;
  };
  recognition.start();
}

// Text-to-speech
function speakTranslation() {
  const msg = new SpeechSynthesisUtterance(document.getElementById("translatedOutput").value);
  speechSynthesis.speak(msg);
}

// AI chat
function openSanadChat() {
  document.getElementById("aiChatBox").style.display = "block";
}
function sendToSanad() {
  const input = document.getElementById("chatInput").value;
  const chatBox = document.getElementById("chatMessages");
  chatBox.innerHTML += `<div><b>You:</b> ${input}</div>`;
  setTimeout(() => {
    chatBox.innerHTML += `<div><b>Sanad:</b> Sorry, I’m still learning!</div>`;
  }, 1000);
}

// Clear fields
function clearAll() {
  document.getElementById("textInput").value = "";
  document.getElementById("translatedOutput").value = "";
  document.getElementById("chatInput").value = "";
  document.getElementById("chatMessages").innerHTML = "";
  document.getElementById("ocrResult").innerText = "";
  document.getElementById("brailleInput").value = "";
}

// OCR image translation
function translateImage() {
  const file = document.getElementById("imageUpload").files[0];
  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.onload = function () {
      const canvas = document.getElementById("snapshotCanvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.style.display = "block";
      Tesseract.recognize(canvas, "eng").then(({ data: { text } }) => {
        document.getElementById("ocrResult").innerText = text;
      });
    };
    img.src = reader.result;
  };
  if (file) reader.readAsDataURL(file);
}

// Braille print
function printBraille() {
  const content = document.getElementById("brailleInput").value;
  const win = window.open("", "", "width=600,height=400");
  win.document.write(`<pre style="font-size:20px;">${content}</pre>`);
  win.print();
  win.close();
}

// Teachable Machine Sign Language
const URL = "https://teachablemachine.withgoogle.com/models/Dm1vAU2b_/"; // put your model URL
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
  labelContainer.innerHTML = "";
  prediction.forEach(p => {
    const classPrediction = `${p.className}: ${p.probability.toFixed(2)}`;
    const div = document.createElement("div");
    div.textContent = classPrediction;
    labelContainer.appendChild(div);
  });
}
