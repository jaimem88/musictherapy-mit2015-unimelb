//PeerJS Configuration
var apiKey = 'jcohyuv7dh9nqaor';
var $localVideo = document.getElementById('localVideo');
var $remoteVideo = document.getElementById('remoteVideo1');
// Compatibility shim
var outgoingCall;
var peer;
var peer_config =
{'iceServers':
  [
    {'url': 'stun:stun.l.google.com:19302'},
  //  {'url': 'stun:23.21.150.121'},
    {
      'url': 'turn:numb.viagenie.ca',
      credential: 'abalab.com.au',
      username: 'lab@clab.org.au'
    }
  ]
};
var constraints  = {
  video: {
    mandatory: {
      maxWidth: 320,
      maxHeight: 240
    }
  },audio:true
};


window.onload = function() {
  socket = io.connect("https://" + window.location.host);
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
       init();
     }, function (error) { console.log(error); }
   );

function init(){
  //Create new PeerJS Connection
  peer= new Peer(username,{host: window.location.hostname,
                  port: 443,
                  key: 'peerjs',
                  debug: 3,
                  config:peer_config,
                  secure: true,
                  path: '/api'
                  },
    function(e){
      console.log("failed?",e)
  });
  console.log('peer.id',peer)
  peer.on('open',function(){
      socket.emit('new_peer',username,peer.id);
  });

  //Initiate call
  socket.on('new_peer',function(id){
    console.log("NEW PEEER", id,username);
    if (id != username){
      console.log(username,' calling ',id);
      outgoingCall = peer.call(id, window.localStream);

    }
      outgoingCall.on('stream', function (remoteStream) {
         enableRemoteVideo(remoteStream);
       });
    // if connection is closed
     outgoingCall.on('close', function() {
       console.log('Connection is closed.');
     });
  });

 // This event: remote peer receives a call
    peer.on('call', function (incomingCall) {
      window.currentCall = incomingCall;
      incomingCall.answer(window.localStream);
      incomingCall.on('stream', function (remoteStream) {
        enableRemoteVideo(remoteStream);
      });
    });




  peer.on('error', function(err) { console.log("ERROR: ",err) });
  function enableRemoteVideo(remoteStream){
    window.remoteStream = remoteStream;
    $remoteVideo = document.getElementById("remoteVideo1")
    $remoteVideo.src = URL.createObjectURL(remoteStream);
    $remoteVideo.style.display = 'block';
    $remoteVideo.muted = false;
  }
}

};
window.onbeforeunload = function(e){
	peer.disconnect();
}
