// var promise = import("string.js");
var name = '';
var encoded = null;
var fileExt = null;

function runSpeechRecognition() {
  // get output div reference
  var output = document.getElementById("output");
  // get action element reference
  var action = document.getElementById("action");
      // new speech recognition object
      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
      var recognition = new SpeechRecognition();
  
      // This runs when the speech recognition service starts
      recognition.onstart = function() {
          action.innerHTML = "<small>listening, please speak...</small>";
      };
      
      recognition.onspeechend = function() {
          action.innerHTML = "<small>stopped listening, hope you are done...</small>";
          recognition.stop();
      }
    
      // This runs when the speech recognition service returns result
      recognition.onresult = function(event) {
          var transcript = event.results[0][0].transcript;
          var confidence = event.results[0][0].confidence;
          searchVoice(transcript)
      };
    
       // start recognition
       recognition.start();
}

function searchVoice(transcript) {
  document.getElementById("input-search").value = transcript
  search(null)
}

function search(e) {
  var apigClient = apigClientFactory.newClient();
  var params = {
    'q': document.getElementById("input-search").value
  };
  apigClient.searchGet(params, {}, {}).then(function (result) {
    console.log(result.data.body.photos)
    var div = document.getElementById("images")
    div.innerHTML = "";

    for (let i = 0; i < result.data.body.photos.length; i++) {
      photo = result.data.body.photos[i]
    

      

      let xhr = new XMLHttpRequest();
      xhr.open("GET", photo, true);
      xhr.send(null)

      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // Typical action to be performed when the document is ready:
          div.innerHTML += '<img src="data:image/jpeg;base64,' + xhr.responseText + 
                      '" style="width:25%">';
        }
      };
    }
    
  })
  var file = document.getElementById("search")
  console.log(file)

}

function upload(e) {

  var path = (document.getElementById("input-file").value).split("\\");
  var file_name = path[path.length - 1];
  console.log(file_name);
  var file = document.getElementById("input-file").files[0];
  var encoded_image = getBase64(file).then((data) => {
    var apigClient = apigClientFactory.newClient();
    var file_type = file.type + ';base64';
    var body = data;
    var params = {
      item: file.name,
      bucket: 'photosbucket02',
      'Content-Type': file.type,
      'x-amz-meta-customLabels': cutsomLabels.value,
    };

    console.log(params)
    var additionalParams = {};
    apigClient
      .uploadBucketItemPut(params, body, additionalParams)
      .then(function (res) {
        console.log(res)
        if (res.status == 200) {
          document.getElementById('input-file').innerHTML =
            'success!';
          document.getElementById('input-file').style.display = 'block';
        }
      });
  });
  alert("Image uploaded: " + file.name);

}


function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.onload = () => resolve(reader.result)
    reader.onload = () => {
      let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = error => reject(error);
  });
}
