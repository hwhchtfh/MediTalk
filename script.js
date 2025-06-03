function translateText() {
  const text = document.getElementById("inputText").value;
  const lang = document.getElementById("languageSelect").value;
  const output = document.getElementById("translatedText");

  const translations = {
    en: "Hello",
    ar: "مرحبا",
    fr: "Bonjour",
    tr: "Merhaba"
  };

  output.innerText = translations[lang] || "Translation not available.";
}

function convertToBraille() {
  const input = document.getElementById("brailleInput").value.toLowerCase();
  const brailleMap = {
    a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑",
    f: "⠋", g: "⠛", h: "⠓", i: "⠊", j: "⠚",
    k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕",
    p: "⠏", q: "⠟", r: "⠗", s: "⠎", t: "⠞",
    u: "⠥", v: "⠧", w: "⠺", x: "⠭", y: "⠽", z: "⠵",
    " ": " "
  };
  let output = "";
  for (let char of input) {
    output += brailleMap[char] || "?";
  }
  document.getElementById("brailleOutput").innerText = output;
}

function openAIChat() {
  document.getElementById("aiChat").style.display = "block";
}

function respondAI() {
  const input = document.getElementById("aiInput").value.toLowerCase();
  let response = "I'm Sanad. I can help you with medical translations.";
  if (input.includes("pain")) response = "Can you describe the pain and its location?";
  if (input.includes("medicine")) response = "Do you need dosage or drug name information?";
  document.getElementById("aiResponse").innerText = response;
}

// MediaPipe setup
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});
hands.onResults((results) => {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 3 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1 });
    }
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
