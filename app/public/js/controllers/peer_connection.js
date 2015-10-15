//PeerJS Configuration
var apiKey = 'jcohyuv7dh9nqaor';
//var $localVideo = document.getElementById('localVideo');
//var $remoteVideo = document.getElementById('remoteVideo1');
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

function createPeer(){
  //Create new PeerJS Connection
  userId = username;
  if(admin == 'true'){
    userId = userId.replace(' - Clinician','');
    console.log(userId);
  }
  peer= new Peer(userId,{host: window.location.hostname,
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
  // This event: remote peer receives a call
  peer.on('call', function (incomingCall) {
    console.log('received call',incomingCall);
    window.currentCall = incomingCall;
    incomingCall.answer(window.localStream);
    console.log('sent stream',window.localStream);
    incomingCall.on('stream', function (remoteStream) {
      handleRemoteStreamAdded(remoteStream,incomingCall.peer.id,true);
    });
  });

   peer.on('error', function(err) { console.log("ERROR: ",err) });
   peer.on('disconnected',function(tmp){
     console.log('disc',tmp);
   });
}

function callPeer(id){
  userId = id
  if (id != username){
    console.log(username,' calling ',id);
      userId = userId.replace(' - Clinician','');
    outgoingCall = peer.call(userId, window.localStream);
  }
  outgoingCall.on('stream', function (remoteStream) {
    console.log("caller received stream",remoteStream)
     handleRemoteStreamAdded(remoteStream,userId,true);
   });
// if connection is closed
 outgoingCall.on('close', function() {
   console.log('Connection is closed.');
 });
}

/*
window.onbeforeunload = function(e){
  console.log("byebye")
  sendMessage('goodbye');

}*/
