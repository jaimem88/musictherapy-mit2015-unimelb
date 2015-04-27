var audioConstraints = {
	audio: true,
	video: false
};
//var audio = document.getElementById('audio');
//var $stopRecordingAudio = document.getElementById('stop-recording-audio');
//var $pauseResumeAudio = document.getElementById('pause-resume-audio');
var recordAudio, recordVideo;
$startRecording.onclick = function() {
	$startRecording.disabled = true;
	navigator.getUserMedia({
		audio: true,
		video: true
	}, function(stream) {
		mediaStream = stream;

		recordAudio = RecordRTC(stream, {
			onAudioProcessStarted: function() {
				recordVideoSeparately && recordVideo.startRecording();

				cameraPreview.src = window.URL.createObjectURL(stream);
				cameraPreview.play();

				cameraPreview.muted = true;
				cameraPreview.controls = false;
			}
		});

		recordVideo = RecordRTC(stream, {
			type: 'video'
		});

		recordAudio.startRecording();

		stopRecording.disabled = false;
	}, function(error) {
		alert( JSON.stringify( error ) );
	});
};

$stopRecordingAudio.onclick = function() {
	startRecording.disabled = false;
	stopRecording.disabled = true;

	// stop audio recorder
	recordVideoSeparately && recordAudio.stopRecording(function() {
		// stop video recorder
		recordVideo.stopRecording(function() {

			// get audio data-URL
			recordAudio.getDataURL(function(audioDataURL) {

				// get video data-URL
				recordVideo.getDataURL(function(videoDataURL) {
					var files = {
						audio: {
							type: recordAudio.getBlob().type || 'audio/wav',
							dataURL: audioDataURL
						},
						video: {
							type: recordVideo.getBlob().type || 'video/webm',
							dataURL: videoDataURL
						}
					};

					socketio.emit('message', files);

					if(mediaStream) mediaStream.stop();
				});

			});

			cameraPreview.src = '';
			cameraPreview.poster = 'ajax-loader.gif';
		});

	});

	// if firefox or if you want to record only audio
	// stop audio recorder
	!recordVideoSeparately && recordAudio.stopRecording(function() {
		// get audio data-URL
		recordAudio.getDataURL(function(audioDataURL) {
			var files = {
				audio: {
					type: recordAudio.getBlob().type || 'audio/wav',
					dataURL: audioDataURL
				}
			};

			socketio.emit('message', files);
			if(mediaStream) mediaStream.stop();
		});

		cameraPreview.src = '';
		cameraPreview.poster = 'ajax-loader.gif';
	});
};
