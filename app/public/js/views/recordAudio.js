var audioConstraints = {
	audio: true,
	video: false
};

var recordAudio, recordVideo;
$startRecording.onclick = function() {
	$startRecording.disabled = true
	socket.emit('start recording');
	$stopRecordingAudio.disabled = false;
};


$stopRecordingAudio.onclick = function() {
	$startRecording.disabled = false;
	$stopRecording.disabled = true;
	socket.emit('stop recording');
};

//when start recording is received, then record local stream
socket.on('start recording',function(){
	console.log("recording local audio")
	mediaStream = stream = getLocalStream();
	recordAudio = RecordRTC(stream);
	recordAudio.startRecording();
});

socket.on('stop recording',function(){
	console.log("stop recording local audio")
	recordAudio.stopRecording(function() {
		// get audio data-URL
		recordAudio.getDataURL(function(audioDataURL) {
			var file = {
				audio: {
					type: recordAudio.getBlob().type || 'audio/wav',
					dataURL: audioDataURL
				}
			};
			socket.emit('myrecording',file )
		});
});
});
