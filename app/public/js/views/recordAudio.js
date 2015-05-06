var audioConstraints = {
	audio: true,
	video: false
};

var recordAudio, recordVideo;
$startRecording.onclick = function() {
	console.log('click on start recording '+username)
	$startRecording.disabled = true
	$stopRecordingAudio.disabled = false;
	$mixRecordings.disabled = true;
	socket.emit('start recording');
};


$stopRecordingAudio.onclick = function() {
	$startRecording.disabled = false;
	$stopRecordingAudio.disabled = true;
	$mixRecordings.disabled = false;
	socket.emit('stop recording');
};
$mixRecordings.onclick = function() {
	$startRecording.disabled = false;
	$stopRecordingAudio.disabled = true;
	$mixRecordings.disabled = true;
	socket.emit('mix recordings');
};


//when start recording is received, then record local stream
socket.on('start recording',function (){
	console.log("recording local audio")
	mediaStream = stream = getLocalStream();
	recordAudio = RecordRTC(stream);
	recordAudio.startRecording();
});

socket.on('stop recording',function (){
	console.log("stop recording local audio")
	recordAudio.stopRecording(function() {
		// get audio data-URL
		recordAudio.getDataURL(function(audioDataURL) {
			var file = {
				audio: {
					type: recordAudio.getBlob().type || 'audio/wav',
					dataURL: audioDataURL,
					user : username
				}
			};
			socket.emit('myrecording',file )
		});
});
});
