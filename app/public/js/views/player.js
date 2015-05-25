var thisAudio = document.getElementById('thisPlayer');
thisAudio.src = "./uploads/mixed/2015-5-25_SessionX_RecordingYcompMixed.mp3";
thisAudio.muted = false;
if (admin=== 'true') {
  thisAudio.controls = true;
  //thisAudio.style.display = 'block';
}

//thisAudio.play();
