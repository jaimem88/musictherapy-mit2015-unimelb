/************************************************************************************************/
/**** JavaScript for the client side of the webRTC based audio-video conference application****/
/*************************************************************************************************/

						/****Declarations****/


var localStream;
var remoteStream;

var pc=[];
var userID=0;
var room = 'room1';
var connectedUsers={};
var numberOfOnlineContacts;
var isInitiator = false;

var $acceptButtons = document.getElementById('acceptButtons');
var $reject = document.getElementById('rejectDisplay');
var $addToConferenceButtons = document.getElementById('addToConferenceButtons');
var $endConference = document.getElementById('endConference');
var $caller = document.getElementById('callerDisplay');
var $callerName = document.getElementById('callerName');
var $callee = document.getElementById('calleeDisplay');
var $calleeName = document.getElementById('calleeName');
var $contacts = document.getElementById('contacts');
var $ringingSound = document.getElementById('ringingSound');

var $media = document.getElementById('media');
var $localAudio = document.getElementById('localAudio');
var $localVideo = document.getElementById('localVideo');

//var $mediaSelection = document.getElementById('mediaSelection');

var sdpConstraints = {'mandatory': {
	'OfferToReceiveAudio':true,
	'OfferToReceiveVideo':true }};
/*************************************************************************************/
console.log("Home loaded");

//Creating a new HTML button for each contact in the contact list


function displayContacts(contacts){
	var contactString='';
	console.log('displaying contacts onto the screen: '+ contacts);
	for(i=0;i<numberOfOnlineContacts;i++){
		contactString = contactString +"<button id = \"contact"+(i+1)
				+"\" input type=\"button\" value=\""+contacts[i]
				+"\" onclick = \"callUser('contact"+(i+1)
				+"')\">"+contacts[i]+"</button>"+'<br/>';
	}

	$contacts.innerHTML = contactString;
	console.log(contactString);
}

//When any name in the contact list is clicked,
//the function confirms the calling
//and displays the calling to the user

function callUser(id) {
	console.log('entered call user function ');
	var connectToUser=document.getElementById(id).value;
	console.log('contact selected ='+connectToUser);
	var answer = confirm('call '+connectToUser+'?');
	if (answer){
		console.log('calling '+connectToUser);
		socket.emit('connectToUser',connectToUser);
		$calleeName.innerHTML = 'calling  ' + connectToUser;
		$callee.style.display = 'block';
	}
	else{
		console.log('calling cancelled');
	}
}

//Sending an accept message to the server,
//when the user accepts an incoming call

function accept(){
	var connectToUser = $callerName.innerHTML;
	console.log(connectToUser + ' call accepted');
	socket.emit('accept',connectToUser);
	$caller.style.display = 'none';
	$acceptButtons.style.display = 'none';
//	$mediaSelection.style.display = "none";
	$ringingSound.pause();
}

//Sending add to conference message to the server
//when the user has accepted the caller into a conference

function addToConference(){
	var connectToUser = $callerName.innerHTML;
	console.log(connectToUser + ' call accepted');
	socket.emit('acceptIntoConference',connectToUser );
	$caller.style.display = 'none';
	$addToConferenceButtons.style.display = 'none';
	$ringingSound.pause();
}

//Sending reject message to the server
//when the user rejects an incoming call

function reject(){
	console.log('call rejected');
	socket.emit('reject',$callerName.innerHTML);
	$acceptButtons.style.display = 'none';
	$addToConferenceButtons.style.display = 'none';
	$caller.style.display = 'none';
	$ringingSound.pause();
}

//Informing the server to end the conference,
//when end call button is clicked by the initiator

function endConference(){
	console.log('initiator ending the call');
	$endConference.style.display = 'none';
	sendMessage('endConference');
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

//If the user hangups the connection with the initiator,
//the function will inform the server to remove the user from the conference room itself.
//If the user hangups another member in the room,
//then the function stops that particular peer connection only

function hangupUser(hangupUser) {
	console.log('Hanging up user '+hangupUser);
	if(isInitiator || admin=== 'true' ){
					socket.emit('remove from room',hangupUser);
	}
	else{
		socket.emit('hangup',hangupUser);
		stop(hangupUser);
	}

}

//Stopping a peer connection includes,
//removing the remote media stream,
//closing and deleting the peer connection object from the connectedUsers array,
//and decrementing the userID.
//The function also checks the number of users connected
//and acts accordingly


function stop(hangupUser) {
	console.log('closing peer connection of :'+hangupUser);
	connectedUsers[hangupUser].close();

	$media.removeChild(document.getElementById('panels'+hangupUser));
	userID--;
	console.log('deleting the user from connected users array');
	delete connectedUsers[hangupUser];
	console.log('connected Users:'+Object.keys(connectedUsers));
	checkNumberOfConnections();
}

//Informs the server to leave the room if there are no peers connected to the user
//The function also makes the isInitiator status false if the user is the initiator and
//there are no existing peer connections left

function checkNumberOfConnections(){
	if(Object.keys(connectedUsers).length==0){
		console.log('no connected users');
		sendMessage('leave');
		console.log('leaving the room '+user);
		numberOfOnlineContacts =0;

		if(isInitiator){
		//	$endConference.style.display = 'none';
			isInitiator = false;
		}

		if (admin=== 'true') {
			$recordingControl.style.display='none'
			$endConference.style.display = 'none';
			isInitiator = false;
		//	$startRecording.style.display = 'none';
		//	$stopRecordingAudio.style.display = 'none'
		//	$mixRecordings.style.display='none'
		}
	}
}

//Sending messages to the server with a message tag

function sendMessage(message){
		console.log('Client sending message: ', message);
		socket.emit('message', message);
}
