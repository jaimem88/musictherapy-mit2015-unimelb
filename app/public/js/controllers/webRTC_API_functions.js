/*************************************************************************************/
				/****Handling the call using webRTC APIs****/
/*************************************************************************************/

//Creating a peer connection using the ICE candidates returned from the
//STUN server and adding local stream to the created peer connection object

function createPeerConnection(connectToUser) {
	var pc_config =
	{'iceServers':
		[
			//{'url': 'stun:stun.l.google.com:19302'},
			//{'url': 'stun:23.21.150.121'},
			{
				'url': 'turn:numb.viagenie.ca',
				credential: 'muazkh',
				username: 'webrtc@live.com'
			}//,
		/*	{
				url: 'turn:192.158.29.39:3478?transport=udp',
				credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
				username: '28224511:1379330808'
			},
			{
				url: 'turn:192.158.29.39:3478?transport=tcp',
				credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
				username: '28224511:1379330808'
			}*/
		]
	};
	try {
		console.log('number of contacts connected: '+ userID);
		//if(webrtcDetectedBrowser==='firefox'
		pc = new RTCPeerConnection(pc_config);
		pc.onicecandidate = function(event){
			handleIceCandidate(event,connectToUser)};
		console.log('Created RTCPeerConnnection with config:\n' + '  \''
						+JSON.stringify(pc_config) + '\'.');
		pc.addStream(localStream);
		storeConnectedUsers(connectToUser,pc);
	}
	catch (e) {
		console.log('Problem in PeerConnection or in adding a stream, exception: ' + e.message);
		alert('Cannot create RTCPeerConnection object.');
		return;
	}
}

//Sending the ICE candidate received from the STUN server
//along with the connect to user name  to the signalling server

function handleIceCandidate(event,connectToUser) {
	console.log('handleIceCandidate event: ', event);
	if (event.candidate) {
		sendMessage({
		  type: 'candidate',
		  label: event.candidate.sdpMLineIndex,
		  id: event.candidate.sdpMid,
		  candidate: event.candidate.candidate,
		  connectTo: connectToUser});
	  } else {
		console.log('End of candidates.');
	  }
}

//Detecting the presence of remote audio/video stream and
//calling the respective display functions to display the remote media content

function handleRemoteStreamAdded(event,connectToUser) {
	console.log('Remote stream added.');
	divElement = document.createElement('div');
	createHTMLDivision(divElement,connectToUser);
	console.log('div element id in webRTC:'+divElement.id);
	if(hasVideo(event.stream)){
		createVideoElement(divElement,event.stream);
		createCloseButton(divElement,connectToUser,30,30);
	}
	else{
		createAudioElement(divElement,event.stream);
		createCloseButton(divElement,connectToUser,10,10);
	}
	addNameTag(divElement,connectToUser);
	$media.appendChild(divElement);
}

//Sending an offer to the peer user

function sendOffer(connectToUser) {
	console.log('Sending offer to peer');
	connectedUsers[connectToUser].createOffer(function(sdp){
		setLocalAndSendMessage(sdp,connectToUser,'offer')},handleCreateOfferError);
}

//Creating an answer to the peer

function sendAnswer(connectToUser) {
	console.log('Sending answer to peer.');
	connectedUsers[connectToUser].createAnswer(function (sdp){
	setLocalAndSendMessage(sdp,connectToUser,'answer')}, null, sdpConstraints);
}

//Selecting the audio codec then setting session description and sending it to the signalling server

function setLocalAndSendMessage(sessionDescription,connectToUser,messageType) {
	sessionDescription.sdp = preferOpus(sessionDescription.sdp);
	connectedUsers[connectToUser].setLocalDescription(sessionDescription);
	console.log('setLocalAndSendMessage sending message' , sessionDescription);
	sendMessage({
		type:messageType,
		sdp:sessionDescription,
		connectTo:connectToUser});
}

//Displaying error message in case of failure in sending offer message

function handleCreateOfferError(event){
	console.log('createOffer() error: ', e);
}
