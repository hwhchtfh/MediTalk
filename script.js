let liveStream = null;

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      liveStream = stream;
      document.getElementById("cameraFeed").srcObject = stream;
    })
    .catch(err => alert("Camera access denied: " + err));
}

function stopCamera() {
  if (liveStream) {
    liveStream.getTracks().forEach(track => track.stop());
    document.getElementById("cameraFeed").srcObject = null;
    liveStream = null;
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

function translateText() {
  const text = document.getElementById("textInput").value;
  const lang = document.getElementById("languageSelect").value;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      document.getElementById("translatedOutput").innerText = data[0][0][0];
    })
    .catch(() => {
      document.getElementById("translatedOutput").innerText = "Error in translation.";
    });
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.onresult = event => {
    document.getElementById("textInput").value = event.results[0][0].transcript;
  };
  recognition.start();
}

function speakTranslatedText() {
  const output = document.getElementById("translatedOutput").innerText;
  const utterance = new SpeechSynthesisUtterance(output);
  speechSynthesis.speak(utterance);
}

function translateImage() {
  const file = document.getElementById("imageUpload").files[0];
  const ocrResult = document.getElementById("ocrResult");
  if (!file) return;
  ocrResult.innerText = "Image translation is not enabled in this demo.";
}

function printBraille() {
  const content = document.getElementById("brailleInput").value;
  const win = window.open("", "", "width=600,height=400");
  win.document.write(`<pre style="font-size: 18px;">${content}</pre>`);
  win.document.close();
  win.print();
}

function clearAll() {
  document.getElementById("textInput").value = "";
  document.getElementById("translatedOutput").innerText = "";
  document.getElementById("brailleInput").value = "";
  document.getElementById("ocrResult").innerText = "";
  document.getElementById("sanadChatMessages").innerHTML = "";
  document.getElementById("sanadInput").value = "";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function openSanadChat() {
  document.getElementById("sanadChatPopup").classList.add("active");
}

function closeSanadChat() {
  document.getElementById("sanadChatPopup").classList.remove("active");
}

function sendSanadMessage() {
  const input = document.getElementById("sanadInput");
  const chat = document.getElementById("sanadChatMessages");
  const msg = input.value.trim();
  if (!msg) return;
  const userMsg = document.createElement("div");
  userMsg.textContent = "👩‍⚕️: " + msg;
  chat.appendChild(userMsg);

  // Placeholder AI reply
  const botReply = document.createElement("div");
  botReply.textContent = "🤖 Sanad: I'm here to assist with your medical queries.";
  chat.appendChild(botReply);

  input.value = "";
  chat.scrollTop = chat.scrollHeight;
}
