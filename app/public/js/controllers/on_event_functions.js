/*************************************************************************************/
								/****On event functions****/
/*************************************************************************************/
					;
//On receiving contact list from server,
//display it on the screen and store the length of the contact list
var user = username
socket.on('contacts', function(data){
	console.log('received contacts from server');
	numberOfOnlineContacts = data.length;
	displayContacts(data);

});

//On receiving a new online contact from the server,
//append a new button to the contact list on the screen

socket.on('addContact', function(data){
	console.log('received new online contact from server:'+data);
	numberOfOnlineContacts ++;
	var idString="contact"+numberOfOnlineContacts;
	var newOnlineUser = "<button id = \"contact"+(numberOfOnlineContacts)
		+"\" input type=\"button\" value=\""+data
		+"\" onclick = \"callUser('contact"+(numberOfOnlineContacts)
		+"')\">"+data+"</button>"+'<br/>';
	$contacts.innerHTML = $contacts.innerHTML + newOnlineUser;
	console.log($contacts.innerHTML);
});

//On receiving delete contact from server,
//delete the user button from the contact list

socket.on('deleteContact',function(deleteName){
	var $innerContacts = $contacts.childNodes;
	for(i=0;i<$contacts.childNodes.length;i++){
		if($innerContacts[i].innerText === deleteName){
			console.log('user found, deleting user');
			$contacts.removeChild($contacts.childNodes[i]);
			numberOfOnlineContacts--;
		}
	}
});

//On incoming call,
//display the accept reject buttons to the user

socket.on('connectRequest', function(callerName){
	$callerName.innerHTML = callerName;
	$caller.style.display = 'block';
	$acceptButtons.style.display = 'block';
	$ringingSound.play();
});

//On incoming call,
//display the add to conference buttons to the user
//if user is already in a conference

socket.on('addToConferenceRequest', function(callerName){
	console.log("add to conference request received");
	var $caller = document.getElementById('callerDisplay');
	var $addToConferenceButtons = document.getElementById('addToConferenceButtons');
	$callerName.innerHTML = callerName;
	$caller.style.display = 'block';
	$addToConferenceButtons.style.display = 'block';
	$ringingSound.play();
});

//On creation of the room,
//make isInitiator status true and
//display the end call button	to the initiator

socket.on('created', function (room){
	$callee.style.display = 'none';
	$endConference.style.display = 'block';
	console.log('Created room ' + room+ 'for ' + user);
	isInitiator = true;
});

//On any new peer joining the conference,
//create a separate peer connection,increment userID
//and send offer to that peer

socket.on('user joined', function (userJoined){
	if(user!=userJoined){
		userID ++;
		$callee.style.display = 'none';
		console.log( userJoined+' joined conference');
		createPeerConnection(userJoined);
		sendOffer(userJoined);
	}
});

//On receiving joined message from server,
//display the joined information to the user

socket.on('joined', function (members){
	console.log(user +' Joined room ' + room);
});

//On successfully being added into the conference,
//increment the userID

socket.on('addedToConference', function (room){
	userID ++;
	$callee.style.display = 'none';
	console.log(user +' added to conference room ' + room);
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
	console.log('got remove user request from server');
	if(hangupUser===user){
		deleteAllConnections();
	}
	else{
		stop(hangupUser);
	}
});

//On receiving a reject message,
//alert the caller about the rejection

socket.on('reject', function (calleeName){
	console.log(calleeName + ' rejected the call');
	$callee.style.display ='none';
	alert('Call rejected by ' + calleeName);
});

//Client response to other messages from server

socket.on('message', function (message){
	console.log('message from server:', message);

	if (message.type === 'offer') {
		onOfferMessage(message);
	}else if (message.type === 'answer') {
		onAnswerMessage(message);
	}else if (message.type === 'candidate') {
		onCandidateMessage(message);
	}else if(message === 'endOfConference'){
		deleteAllConnections();
	}/*else if(message === 'start recording'){
		recordLocalAudio();
	}else if (message === 'stop recording'){
		stopRecordLocalAudio();
	}*/
});

//On receiving offer from a peer,increment the userID, create a separate peer connection,
//send answer message to the server,
//store the remote description and display the remote media stream

function onOfferMessage(message){
	var connectToUser = message.connectTo;
	console.log('got offer from:'+ connectToUser);
	userID ++;
	createPeerConnection(connectToUser);
	connectedUsers[connectToUser].setRemoteDescription(new RTCSessionDescription(message.sdp));
	sendAnswer(connectToUser);
	connectedUsers[connectToUser].onaddstream = function(event){
		handleRemoteStreamAdded(event,connectToUser)};
}

//On receiving answer from a peer,
//set the remote description and display the remote media stream

function onAnswerMessage(message){
	var connectToUser = message.connectTo;
	console.log('got answer from:'+connectToUser);
	connectedUsers[connectToUser].setRemoteDescription(new RTCSessionDescription(message.sdp));
	connectedUsers[connectToUser].onaddstream = function(event){
		handleRemoteStreamAdded(event,connectToUser)};
}
//On receiving candidate information from server,
//add the ICE candidates to the corresponding peer connection

function onCandidateMessage(message){
	console.log('got candidate');
	var candidate = new RTCIceCandidate(
	{
		sdpMLineIndex: message.label,
		candidate: message.candidate
	});
	connectedUsers[message.connectTo].addIceCandidate(candidate);
	//call initiated
	if (admin=== 'true') {
		$startRecording.style.display = 'block';
		$stopRecordingAudio.style.display = 'block'
	}
}

//Informing the server about the client ending the session

window.onbeforeunload = function(e){
	sendMessage('goodbye');
}
