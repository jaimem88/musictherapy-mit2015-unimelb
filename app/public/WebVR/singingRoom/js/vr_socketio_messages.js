
  // socket = io.connect("https://" + window.location.host);
/*    $.getScript("js/views/recordAudio.js");
    $.getScript("js/views/player.js");
    $.getScript("js/controllers/remote_media_functions.js");
    $.getScript("js/controllers/webRTC_API_functions.js");
    $.getScript("js/controllers/on_event_functions.js");*/

  socket = io('/vr_connections');
    if(admin==='true'){
      username = username +" - Clinician";
  }

    //  displayContent();
    //getMedia();
  socket.on('connect',function (){
    console.log('new connection to server!', username,'|');
    socket.emit('vr_new_user',username);

  });

  socket.on('vr_joined', function (newUser){
    if (newUser != username){
      	userID ++;
      storeConnectedUsers(username,pc);
      console.log("Joined room ",newUser);
      createPeerConnection(newUser);
      sendOffer(newUser);
      socket.emit('vr_webrtc_connection',username);
    }
  });


  //Client response to other messages from server

  socket.on('vr_message', function (message){
  	console.log('message from server:', message);

  	if (message.type === 'offer') {
  		onOfferMessage(message);
  	}else if (message.type === 'answer') {
  		onAnswerMessage(message);
  	}else if (message.type === 'candidate') {
  		onCandidateMessage(message);
  	}else if(message === 'endOfConference'){
  		deleteAllConnections();
  	}
  });
function sendMessage(message){
		console.log('Client sending vr_message: ', message);
		socket.emit('vr_message', message);
}
//Storing the peer connection details of the connected users

function storeConnectedUsers(user,pc){
	connectedUsers[user] = pc;
	console.log('user stored in array');
	console.log('connected users are:'+JSON.stringify(connectedUsers));
}

//Deleting the peer connections of all the connected users

function deleteAllConnections(){
	for (var key in connectedUsers) {
		stop(key);
	}
}
