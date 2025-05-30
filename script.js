let cameraInstance = null;
let cameraRunning = false;

// 🌐 Translation
function translateText() {
  const text = document.getElementById("inputText").value;
  const lang = document.getElementById("languageSelect").value;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      document.getElementById("outputText").innerText = data[0][0][0];
    })
    .catch(() => {
      document.getElementById("outputText").innerText = "Error translating.";
    });
}

// 🎤 Voice input
function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.onresult = function(event) {
    document.getElementById("inputText").value = event.results[0][0].transcript;
  };
  recognition.start();
}

// 🔊 Speak out translation
function speakTranslation() {
  const text = document.getElementById("outputText").innerText;
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// ❌ Clear all fields
function clearAll() {
  document.getElementById("inputText").value = "";
  document.getElementById("outputText").innerText = "";
  document.getElementById("status").innerText = "Camera is off";
}

// 🤖 AI Chat
function simulateAIChat() {
  const input = document.getElementById("inputText").value.trim().toLowerCase();
  let response = "🤖 I don't understand that yet.";

  if (input.includes("fever")) {
    response = "🤖 AI: Monitor temperature and stay hydrated.";
  } else if (input.includes("headache")) {
    response = "🤖 AI: Try rest, hydration, and paracetamol.";
  }

  document.getElementById("outputText").innerText = response;
}

// 🌙 Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// ✋ Sign Language Setup
const videoElement = document.getElementById('camera');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');
const statusText = document.getElementById('status');

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults((results) => {
  if (!videoElement.videoWidth) return;

  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 3 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

      const y0 = landmarks[0].y;
      const y8 = landmarks[8].y;
      const y4 = landmarks[4].y;
      const y12 = landmarks[12].y;

      let gesture = "✋ Hand detected";
      if (Math.abs(y0 - y8) < 0.05 && Math.abs(y0 - y12) < 0.05) {
        gesture = "✊ Gesture: Hello";
      } else if (y8 < y0 && y4 < y0) {
        gesture = "✌️ Gesture: Yes";
      } else if (y8 > y0 && y12 > y0) {
        gesture = "👎 Gesture: No";
      }

      statusText.innerText = gesture;
      document.getElementById("outputText").innerText = "Sign says: " + gesture;
    }
  } else {
    statusText.innerText = "No hand detected";
  }

  canvasCtx.restore();
});

// 📸 Start/Stop Camera
function startCamera() {
  if (cameraRunning) return;
  cameraInstance = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480
  });
  cameraInstance.start();
  cameraRunning = true;
  statusText.innerText = "Camera running...";
}

function stopCamera() {
  if (cameraInstance) {
    cameraInstance.stop();
    cameraRunning = false;
    statusText.innerText = "Camera is off";
  }
}

// 📷 Capture photo from camera
function capturePhoto() {
  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoElement, 0, 0);
  const imageDataUrl = canvas.toDataURL("image/png");
  document.getElementById("outputText").innerText = "Image captured. (Translation pending)";
}

// 🖼️ Handle image upload
function handleImageUpload() {
  const file = document.getElementById("imageUpload").files[0];
  if (!file) return;
  document.getElementById("outputText").innerText = "Image uploaded. (OCR translation feature coming soon)";
}
