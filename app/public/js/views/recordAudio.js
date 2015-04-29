var audioConstraints = {
	audio: true,
	video: false
};
//var audio = document.getElementById('audio');
//var $stopRecordingAudio = document.getElementById('stop-recording-audio');
//var $pauseResumeAudio = document.getElementById('pause-resume-audio');
var recordAudio, recordVideo;
$startRecording.onclick = function() {
	$startRecording.disabled = true
	mediaStream = stream = getLocalStream();
	recordAudio = RecordRTC(stream);
	recordAudio.startRecording();
	$stopRecordingAudio.disabled = false;
};


$stopRecordingAudio.onclick = function() {
	$startRecording.disabled = false;
	$stopRecordingAudio.disabled = true;

	// if firefox or if you want to record only audio
	// stop audio recorder
	recordAudio.stopRecording(function() {
		// get audio data-URL
		recordAudio.getDataURL(function(audioDataURL) {
			var files = {
				audio: {
					type: recordAudio.getBlob().type || 'audio/wav',
					dataURL: audioDataURL
				}
			};
			RecordRTC.writeToDisk(files.audio);

			//socketio.emit('stop recording', files);
		//	if(mediaStream) mediaStream.stop();
		});
	});
};
