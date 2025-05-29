
function translateText() {
  const text = document.getElementById("inputText").value;
  const lang = document.getElementById("languageSelect").value;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURI(text)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const translated = data[0][0][0];
      document.getElementById("outputText").innerText = translated;
    })
    .catch(err => {
      document.getElementById("outputText").innerText = "Translation error.";
    });
}

// Voice Recognition
function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    document.getElementById("inputText").value = event.results[0][0].transcript;
  };

  recognition.start();
}

// Camera Access
function startCamera() {
  const video = document.getElementById('camera');
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      alert("Camera access denied: " + err);
    });
}
