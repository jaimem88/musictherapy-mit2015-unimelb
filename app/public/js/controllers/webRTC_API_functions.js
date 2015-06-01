/*************************************************************************************/
				/****Handling the call using webRTC APIs****/
/*************************************************************************************/

//Creating a peer connection using the ICE candidates returned from the
//STUN server and adding local stream to the created peer connection object

function createPeerConnection(connectToUser) {
	var pc_config =
	{'iceServers':
		[
			{'url': 'stun:stun.l.google.com:19302'},
			{'url': 'stun:23.21.150.121'},
			{
				'url': 'turn:numb.viagenie.ca',
				credential: 'abalab.com.au',
				username: 'lab@clab.org.au'
			}
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
//lab@clab.org.au

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
x = 0;
function handleRemoteStreamAdded(event,connectToUser) {
	console.log('Remote stream added.');
	var $newPanel= $("#panels0").clone().prop('id', 'panels'+connectToUser );;
	$newPanel.find('.panel-title').text(connectToUser);
	removeFromPanel($newPanel);
	divElement = document.createElement('div');
	//createHTMLDivision(divElement,connectToUser);
	//console.log('div element id in webRTC:'+divElement.id);
	if(hasVideo(event.stream)){
		var remoteVideo = document.createElement('video');
		//	remoteVideo.width = 320;
		//	remoteVideo.height = 240;
		remoteVideo.id = "remoteVideo";
		remoteVideo.class = "embed-responsive-item"
		remoteVideo.autoplay= "true";
		if (admin=== 'true') {
			remoteVideo.controls = true;
		}
	//	remoteVideo.autoplay = true;
		remoteVideo.src = window.URL.createObjectURL(event.stream);
		$newPanel.find('.locVid').append(remoteVideo);
	//	$newPanel.find("localVideo").src="";
		//$newPanel.find("localVideo").src = window.URL.createObjectURL(event.stream);
		//createVideoElement($newPanel,event.stream);
		createCloseButton(divElement,connectToUser,15,15);
	}
	//addNameTag(divElement,connectToUser);
	$newPanel.find('.locVid').append(divElement);
	$("#media").append($newPanel.fadeIn());
	remoteVideo.muted = false;
	remoteVideo.play();
//	$("remoteVideo").prop('autoplay', true);
//	$media.appendChild(divElement);
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
	//console.log('setLocalAndSendMessage sending message' , sessionDescription);
	sendMessage({
		type:messageType,
		sdp:sessionDescription,
		connectTo:connectToUser});
}

//Displaying error message in case of failure in sending offer message

function handleCreateOfferError(event){
	console.log('createOffer() error: ', e);
}
function removeFromPanel($newPanel){
	$($newPanel)
		.find("#localVideo")
		.remove()
		.end()
		.appendTo("body");
	$($newPanel)
		.find("#recordAudio")
		.remove()
		.end()
		.appendTo("body");
	$($newPanel)
		.find("#mix-recordings")
		.remove()
		.end()
		.appendTo("body");
	$($newPanel)
		.find("#stop-recording-audio")
		.remove()
		.end()
		.appendTo("body");
	$($newPanel).find("#callControls")
		.find("#endConference")
		.remove()
		.end()
		.appendTo("body");
}
