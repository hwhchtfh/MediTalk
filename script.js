// ========== ترجمة النصوص ==========
function translateText() {
  const text = document.getElementById("textInput").value;
  const lang = document.getElementById("languageSelect").value;
  document.getElementById("translatedOutput").innerText = `(${lang}) ${text}`;
}

// ========== كاميرا الترجمة المباشرة ==========
let signStream = null;
function startSignCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      signStream = stream;
      document.getElementById("signVideo").srcObject = stream;
    });
}
function stopSignCamera() {
  if (signStream) {
    signStream.getTracks().forEach((track) => track.stop());
    signStream = null;
    document.getElementById("signVideo").srcObject = null;
  }
}
function captureSign() {
  const fakeSigns = ["Hello", "Help", "Doctor", "Pain", "Where?"];
  const random = fakeSigns[Math.floor(Math.random() * fakeSigns.length)];
  document.getElementById("signTextOutput").innerText = random;
}
function clearSignText() {
  document.getElementById("signTextOutput").innerText = "";
}

// ========== AI Sanad ==========
function toggleSanad() {
  const chat = document.getElementById("sanadChat");
  chat.classList.toggle("hidden");
}
function sendToSanad() {
  const input = document.getElementById("sanadInput");
  const msg = input.value.trim();
  if (msg === "") return;
  const chatBox = document.getElementById("chatBox");
  const botReply = "Sanad: This is a demo AI response to your message: " + msg;
  chatBox.innerHTML += `<p><strong>You:</strong> ${msg}</p><p>${botReply}</p>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}
function clearSanadChat() {
  document.getElementById("chatBox").innerHTML = "";
}

// ========== كاميرا مباشرة ==========
let liveStream = null;
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      liveStream = stream;
      document.getElementById("cameraFeed").srcObject = stream;
    });
}
function stopCamera() {
  if (liveStream) {
    liveStream.getTracks().forEach((track) => track.stop());
    liveStream = null;
    document.getElementById("cameraFeed").srcObject = null;
  }
}
function takeSnapshot() {
  const video = document.getElementById("cameraFeed");
  const canvas = document.getElementById("snapshotCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}

// ========== OCR – ترجمة الصور ==========
function translateImage() {
  const file = document.getElementById("imageUpload").files[0];
  if (!file) return;
  const resultBox = document.getElementById("ocrResult");
  resultBox.innerText = "Image translation is not enabled (demo mode)";
}

// ========== برايل (وصفة طبية) ==========
function printBraille() {
  const content = document.getElementById("brailleInput").value;
  const printWindow = window.open("", "", "width=600,height=400");
  printWindow.document.write(`<pre style="font-size: 18px;">${content}</pre>`);
  printWindow.document.close();
  printWindow.print();
}

// ========== زر مسح شامل ==========
function clearAll() {
  document.getElementById("textInput").value = "";
  document.getElementById("translatedOutput").innerText = "";
  document.getElementById("signTextOutput").innerText = "";
  document.getElementById("brailleInput").value = "";
  document.getElementById("ocrResult").innerText = "";
  clearSanadChat();
}
