async function translateText() {
  const input = document.getElementById("inputText").value;
  const sourceLang = document.getElementById("sourceLang").value;
  const targetLang = document.getElementById("targetLang").value;
  const output = document.getElementById("translatedOutput");

  const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=${sourceLang}|${targetLang}`);
  const data = await res.json();
  output.innerText = data.responseData.translatedText;
}

function printBraille() {
  const text = document.getElementById("brailleInput").value.toLowerCase();
  const brailleMap = {
    'a':'⠁','b':'⠃','c':'⠉','d':'⠙','e':'⠑','f':'⠋','g':'⠛','h':'⠓','i':'⠊','j':'⠚',
    'k':'⠅','l':'⠇','m':'⠍','n':'⠝','o':'⠕','p':'⠏','q':'⠟','r':'⠗','s':'⠎','t':'⠞',
    'u':'⠥','v':'⠧','w':'⠺','x':'⠭','y':'⠽','z':'⠵',' ':' '
  };
  const output = text.split('').map(ch => brailleMap[ch] || '?').join('');
  document.getElementById("brailleOutput").innerText = output;
}

function initTeachableModel() {
  const URL = "https://teachablemachine.withgoogle.com/models/Dm1vAU2b/";
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  let model, webcam, labelContainer;

  tmImage.load(modelURL, metadataURL).then(loadedModel => {
    model = loadedModel;
    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    webcam.setup().then(() => {
      webcam.play();
      window.requestAnimationFrame(loop);
      document.getElementById("webcam-container").appendChild(webcam.canvas);
      labelContainer = document.getElementById("label-container");
    });

    function loop() {
      webcam.update();
      model.predict(webcam.canvas).then(predictions => {
        labelContainer.innerText = predictions[0].className + " (" + predictions[0].probability.toFixed(2) + ")";
        window.requestAnimationFrame(loop);
      });
    }
  });
}
