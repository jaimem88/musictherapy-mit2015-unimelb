var thisAudio = document.getElementById('thisPlayer');

function playFile(file){

  thisAudio.src = "./uploads/mixed/"+file;
  thisAudio.muted = false;
  thisAudio.controls = true;
  thisAudio.style.display = 'block';
}
function stopPlaying(){
  thisAudio.pause();
  thisAudio.currentTime = 0;
}
thisAudio.addEventListener('pause', function(){
  if(admin==='true'){
    console.log("paused");
    socket.emit('pause');
  }
});

thisAudio.addEventListener('play', function(){

  if(admin==='true'){
    console.log("playing");
    socket.emit('play');
  }
});

thisAudio.addEventListener('seeked', function(){
  if(admin==='true'){

    var x= thisAudio.currentTime;
    console.log("seeking "+x);
    socket.emit('seek',x);
  }
});

socket.on('pause',function(){
  if(admin==='false'){
    console.log('pause'+admin);
    thisAudio.pause();
  }
});
socket.on('play',function(){
  if(admin==='false'){
    console.log('play');
    thisAudio.play();
  }
});

socket.on('seek',function(data){
  if(admin==='false'){
    console.log('pause'+data);
    thisAudio.currentTime = data;
  }
});


function displayRecordingsBMode(sel,recs){
  var j = 0;
  while (sel.firstChild) {
    console.log("SEEEEL "+ sel.length)
    sel.removeChild(sel.firstChild);
    j++;
  }
  console.log("DISPLREC" +recs.length);

  createOption(sel,"");
  for (i = 0; i < recs.length; i++) {
    createOption(sel,recs[i]['fileName']);
  }
}
function createOption(ddl,value) {
  console.log("createOption "+ddl.id);
  var opt = document.createElement('option');
  opt.value = value;
  opt.text = value;
  ddl.options.add(opt);
}
function sendSongToPlay(file){
  socket.emit('file to play',file);
}

//When broadcast mode is received, mute all remote videos.
socket.on('broadcast',function(recs){
  $CurrentMode.innerHTML = "Broadcast mode";
	toggleRemoteAudio(true);
	if(admin==='true'){
		$selValues = document.getElementById('values');

		displayRecordingsBMode($selValues,recs);
	}
});
socket.on('file to play', function(file){
	playFile(file);
})
//When stop broadcast is received, unmute remote videos.

socket.on('stop broadcast',function(){
  $CurrentMode.innerHTML = "Call mode";
	console.log("stop broadcast mode");
	toggleRemoteAudio(true);
	stopPlaying();
});
