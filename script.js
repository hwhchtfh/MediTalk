// Text Translation (using LibreTranslate)
async function translateText() {
  const input = document.getElementById("textInput").value;
  const lang = document.getElementById("languageSelect").value;
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
  document.getElementById("translatedOutput").innerText = data.translatedText;
}

// Voice Input
function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.onresult = function(event) {
    document.getElementById("textInput").value = event.results[0][0].transcript;
  };
  recognition.start();
}

// Speak Translation
function speakTranslation() {
  const msg = new SpeechSynthesisUtterance(document.getElementById("translatedOutput").innerText);
  speechSynthesis.speak(msg);
}

// AI Chat (Sanad)
function openSanadChat() {
  document.getElementById("aiChatBox").style.display = "block";
}

async function sendToSanad() {
  const input = document.getElementById("chatInput").value;
  const msgBox = document.getElementById("chatMessages");
  msgBox.innerHTML += `<div><b>You:</b> ${input}</div>`;
  document.getElementById("chatInput").value = "";

  const reply = "I'm Sanad. I will answer soon..."; // Static reply for now
  setTimeout(() => {
    msgBox.innerHTML += `<div><b>Sanad:</b> ${reply}</div>`;
  }, 1000);
}

// Clear All
function clearAll() {
  document.getElementById("textInput").value = "";
  document.getElementById("translatedOutput").innerText = "";
  document.getElementById("signTextOutput").innerText = "";
}

// Camera Controls
let stream;

async function startCamera() {
  const video = document.getElementById("cameraFeed");
  stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}

function stopCamera() {
  const video = document.getElementById("cameraFeed");
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
  }
}

// Take Photo (for OCR)
function takeSnapshot() {
  const video = document.getElementById("cameraFeed");
  const canvas = document.getElementById("snapshotCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.style.display = "block";
  performOCR(canvas);
}

// OCR (Tesseract.js)
function performOCR(canvas) {
  document.getElementById("ocrResult").innerText = "Reading image...";
  Tesseract.recognize(canvas, "eng").then(({ data: { text } }) => {
    document.getElementById("ocrResult").innerText = text;
  });
}

// Image Upload Translation
function translateImage() {
  const input = document.getElementById("imageUpload");
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.onload = function () {
      const canvas = document.getElementById("snapshotCanvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      performOCR(canvas);
    };
    img.src = reader.result;
  };
  if (file) reader.readAsDataURL(file);
}

// Braille Print (Basic Mock)
function printBraille() {
  const content = document.getElementById("brailleInput").value;
  const w = window.open();
  w.document.write(`<pre style="font-size: 20px;">Braille: ${content}</pre>`);
  w.print();
  w.close();
}

// Sign Language Text (placeholder)
setInterval(() => {
  if (stream) {
    // Simulate detection
    const words = ["Hello", "Pain", "Help", "Doctor", "Where", "Yes", "No"];
    const output = document.getElementById("signTextOutput");
    const random = Math.random();
    if (random > 0.95) {
      const word = words[Math.floor(Math.random() * words.length)];
      output.innerText += " " + word;
    }
  }
}, 1000);
