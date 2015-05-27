var thisAudio = document.getElementById('thisPlayer');

function playFile(file){

  thisAudio.src = "./uploads/mixed/"+file;
  thisAudio.muted = false;
  if (admin=== 'true') {
    thisAudio.controls = true;
    //thisAudio.style.display = 'block';
  }
}
//thisAudio.play();
