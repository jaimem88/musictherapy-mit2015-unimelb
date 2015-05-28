var thisAudio = document.getElementById('thisPlayer');

function playFile(file){

  thisAudio.src = "./uploads/mixed/"+file;
  thisAudio.muted = false;
  thisAudio.controls = true;
  thisAudio.style.display = 'block';
  //thisAudio.currentTime =2;
  /*if (admin=== 'true') {
    thisAudio.controls = true;
    thisAudio.style.display = 'block';
  }*/


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
