let cameraStream;
const videoElement = document.getElementById('camera');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');
const statusText = document.getElementById('status');

// 📷 Start camera
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      videoElement.srcObject = stream;
      cameraStream = stream;
    })
    .catch(err => {
      alert("Camera error: " + err);
    });
}

// ❌ Stop camera
function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null;
  }
}

// 🌐 Translate text
function translateText() {
  const text = document.getElementById("inputText").value;
  const lang = document.getElementById("languageSelect").value;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURI(text)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      document.getElementById("outputText").innerText = data[0][0][0];
    })
    .catch(err => {
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

// ✋ Hand detection via MediaPipe
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

      if (Math.abs(y0 - y8) < 0.05 && Math.abs(y0 - y12) < 0.05) {
        statusText.innerText = "✊ Gesture: Hello";
      } else if (y8 < y0 && y4 < y0) {
        statusText.innerText = "✌️ Gesture: Yes";
      } else if (y8 > y0 && y12 > y0) {
        statusText.innerText = "👎 Gesture: No";
      } else {
        statusText.innerText = "✋ Hand detected";
      }
    }
  } else {
    statusText.innerText = "No hand detected";
  }

  canvasCtx.restore();
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480
});

camera.start();

// 🤖 Simulated AI Chatbot
function simulateAIChat() {
  const input = document.getElementById("inputText").value.trim().toLowerCase();
  let response = "🤖 I'm not sure how to help with that.";

  if (input.includes("fever")) {
    response = "🤖 AI: For fever, stay hydrated and monitor your temperature.";
  } else if (input.includes("headache")) {
    response = "🤖 AI: Headaches can be caused by dehydration or stress.";
  } else if (input.includes("diabetes")) {
    response = "🤖 AI: Diabetes management includes a balanced diet and insulin checks.";
  }

  document.getElementById("outputText").innerText = response;
}
