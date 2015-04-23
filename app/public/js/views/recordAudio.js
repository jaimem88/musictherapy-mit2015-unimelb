var audioConstraints = {
	audio: true,
	video: false
};
var audio = document.getElementById('localAudio');
var $recordAudio = document.getElementById('recordAudio');
var $stopRecordingAudio = document.getElementById('stop-recording-audio');
var $pauseResumeAudio = document.getElementById('pause-resume-audio');
var audioStream;
var recorder;
$recordAudio.onclick = function() {
	console.log("recordAudio.onClick()");
	if (!audioStream)
		navigator.getUserMedia(audioConstraints, function(stream) {
			if (window.IsChrome) stream = new window.MediaStream(stream.getAudioTracks());
				audioStream = stream;
                // "audio" is a default type
				recorder = window.RecordRTC(stream, {
					type: 'audio',
					bufferSize: typeof window.params.bufferSize == 'undefined' ? 16384 : window.params.bufferSize,
					sampleRate: typeof window.params.sampleRate == 'undefined' ? 44100 : window.params.sampleRate,
					leftChannel: window.params.leftChannel || false,
                    disableLogs: window.params.disableLogs || false
				});
                recorder.startRecording();
                }, function() {});
            else {
                audio.src = URL.createObjectURL(audioStream);
                audio.muted = true;
                audio.play();
                if (recorder) recorder.startRecording();
            }

            window.isAudio = true;

            this.disabled = true;
            $stopRecordingAudio.disabled = false;
            $pauseResumeAudio.disabled = false;
};
