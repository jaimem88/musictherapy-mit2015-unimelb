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
function handleRemoteStreamAdded(stream,connectToUser,remote) {
	if (remote === 'undefined'){
		remote = false;
	}
	console.log('Remote stream added.');
	remoteId = 'panels'+connectToUser ;
	var $newPanel= $("#panels0").clone().prop('id', remoteId );;
	$newPanel.find('.panel-title').text(connectToUser);
	removeFromPanel($newPanel);
	divElement = document.createElement('div');
	if(hasVideo(stream)){
		var remoteVideo = document.createElement('video');
		remoteVideo.id = "remoteVideo";
		remoteVideo.class = "embed-responsive-item"
		remoteVideo.autoplay= "true";
		if (admin=== 'true') {
			remoteVideo.controls = true;
		}

		remoteVideo.src = window.URL.createObjectURL(stream);
		$newPanel.find('.locVid').append(remoteVideo);
		//createCloseButton(divElement,connectToUser,15,15);
	}
	//addNameTag(divElement,connectToUser);
	$newPanel.find('.locVid').append(divElement);
	$("#media").append($newPanel.fadeIn());
	if (remote){
		document.getElementById(remoteId).style.display='none';
	}

	remoteVideo.muted = false;
	remoteVideo.play();
	socket.emit('vr_remote_added',remoteId);

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

//Informing the server about the client ending the session

window.onbeforeunload = function(e){
	sendMessage('goodbye');
}
