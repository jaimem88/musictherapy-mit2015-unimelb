
  // socket = io.connect("https://" + window.location.host);
/*    $.getScript("js/views/recordAudio.js");
    $.getScript("js/views/player.js");
    $.getScript("js/controllers/remote_media_functions.js");
    $.getScript("js/controllers/webRTC_API_functions.js");
    $.getScript("js/controllers/on_event_functions.js");*/

    //  displayContent();
    //getMedia();
  socket.on('connect',function (){
      console.log('on.connect')
    console.log('new connection to server!', username,'|');
    createPeer();
    socket.emit('vr_new_user',username);

  });

  socket.on('vr_joined', function (newUser){
    if (newUser != username){
      	userID ++;
      storeConnectedUsers(username,pc);
      console.log("Joined room ",newUser);

    //  createPeerConnection(newUser);
      //sendOffer(newUser);
    //  socket.emit('vr_webrtc_connection',username);
    }
  });
  //Initiate call
  socket.on('new_peer',function(id){
    console.log("NEW PEEER", id,username);
    callPeer(id);
  });

  socket.on('vr_remote_added',function(remoteId){
    addRemoteVRVideo(remoteId);
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

  var numberOfOnlineContacts;
  //On receiving contact list from server,
  //display it on the screen and store the length of the contact list

  socket.on('contacts', function(data){
  	console.log('received contacts from server');
  	numberOfOnlineContacts = data.length;
  	//displayContacts(data);

  });

  //On receiving a new online contact from the server,
  //append a new button to the contact list on the screen

  socket.on('addContact', function(data){
  	console.log('received new online contact from server:'+data);
  	numberOfOnlineContacts ++;
  	/*	$contacts.innerHTML = $contacts.innerHTML + newOnlineUser;
  	console.log($contacts.innerHTML);*/
  });

  //On receiving delete contact from server,
  //delete the user button from the contact list

  socket.on('deleteContact',function(deleteName){
  	console.log('recevied deleteContact: ', deleteName);
  });


  //On getting a disconnect request from other user,
  //stop that user's corresponding peer connection

  socket.on('hangup', function (hangupUser){
  	console.log('hangup request from user '+hangupUser);
  	stop(hangupUser);

  });

  //On receiving remove peer instruction from initiator, stop the connection with the peer
  //The peer himself will delete all connections with his room members

  socket.on('remove', function (hangupUser){
  	console.log('got remove user request from server',hangupUser);
  	if(hangupUser===username){
  		deleteAllConnections();
      objects=[];
  	}
  	else{
  		stop(hangupUser);
      for(obj of objects){
        if(obj.name == 'panels'+hangupUser){
          console.log("REMOVE", obj.name);
          removeEntity(obj);
          var panel = document.getElementById("panels"+hangupUser);
          var canvas = document.getElementById("panels"+hangupUser+"VideoImage");

          document.body.removeChild(panel);
          document.body.removeChild(canvas);
        }
      }
  	}
  });
