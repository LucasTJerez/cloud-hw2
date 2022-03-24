// var promise = import("string.js");
var name = '';
var encoded = null;
var fileExt = null;
var SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
const icon = document.querySelector('i.fa.fa-microphone');

function httpPost(theUrl, body)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


function search(e) {
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
      'x-amz-meta-customLabels': "",
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
