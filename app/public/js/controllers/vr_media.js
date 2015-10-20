
var constraints  = {
	  video: {
	    mandatory: {
	      maxWidth: 320,
	      maxHeight: 240
	    }
	  },audio:true
	};
	console.log('vr_media loaded');
function getMedia(done){
//  socket = io.connect("https://" + window.location.host);
  console.log("LOADED");
  navigator.getUserMedia = ( navigator.getUserMedia ||
                   navigator.webkitGetUserMedia ||
                   navigator.mozGetUserMedia ||
                   navigator.msGetUserMedia );

   // get audio/video
   navigator.getUserMedia(constraints, function (stream) {
       //display video
      $localVideo = document.getElementById("localVideo");
      $localVideo.src = URL.createObjectURL(stream);
      $localVideo.style.display = 'block';
      window.localStream = stream;
			console.log('getMedia() localStream ',window.localStream);
			done();
       //init();
     }, function (error) { console.log(error); }
   );

}
