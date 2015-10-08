//PeerJS Configuration
var apiKey = 'jcohyuv7dh9nqaor';
var $localVideo = document.getElementById('localVideo');
var $remoteVideo = document.getElementById('remoteVideo1');

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



window.onload = function() {
  //Get user media after window has loaded
  socket = io.connect("http://" + window.location.host);
  console.log("LOADED");
  getMedia(init);
  $localVideo.style.display = 'block';
function init(){
  var peer= new Peer(username,{host: window.location.hostname,
                  port: 9000,
                  key: 'peerjs',
                  debug: 3,
                  config:peer_config,
                  secure: false,
                  path: 'pjs'
                  },
    function(e){
      console.log("failed?",e)
  });
  console.log('peer.id',peer)
  peer.on('open',function(){
      socket.emit('new_peer',username,peer.id);
  });


  socket.on('new_peer',function(id){
    console.log("NEW PEEER", id,username);
    if (id != username){
      console.log(username,' calling ',id);
      call = peer.call(id,
      localStream);

    }
  });

  peer.on('call', function(call) {
    // Answer the call, providing our mediaStream

    call.answer(localStream);
    call.on('stream', function(stream) {
      // `stream` is the MediaStream of the remote peer.
      // Here you'd add it to an HTML video/canvas element.
      $remoteVideo.src = window.URL.createObjectURL(stream);
      $remoteVideo.style.display = 'block';
    });

  });

}

};
