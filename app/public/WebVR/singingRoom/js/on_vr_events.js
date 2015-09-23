/*************************************************************************************/
								/****On VR event functions****/
/*************************************************************************************/

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
		handleRemoteStreamAdded(event,connectToUser)
	};
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

}

//Informing the server about the client ending the session

window.onbeforeunload = function(e){
	sendMessage('goodbye');
}
